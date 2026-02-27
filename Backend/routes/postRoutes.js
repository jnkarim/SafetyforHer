import express from "express";
import Post from "../models/Post.js";
import User from "../models/User.js";
import { protect, optionalAuth } from "../middleware/auth.js";

// Import Cloudinary parser
import parser from "../middleware/upload.js";

const router = express.Router();

/* -------- Cloudinary Image Upload -------- */
router.post("/upload-image", protect, parser.single("image"), (req, res) => {
  try {
    res.json({ url: req.file.path }); // Cloudinary URL
  } catch (error) {
    console.error("Image upload error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

/* -------- Existing Post Routes -------- */
router.get("/", optionalAuth, async (req, res) => {
  try {
    const { category, type, sort = "new", page = 1, limit = 10, search } = req.query;

    const filter = { isDeleted: false };
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const sortOption = sort === "top" ? { upvotes: -1, createdAt: -1 } : { createdAt: -1 };
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Post.countDocuments(filter);

    const posts = await Post.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .populate("author", "username")
      .select("-upvotedBy -comments");

    const myUpvotedIds = req.user ? req.user.upvotedPosts.map((id) => id.toString()) : [];

    const result = posts.map((post) => {
      const p = post.toObject();
      p.userUpvoted = myUpvotedIds.includes(post._id.toString());
      return p;
    });

    const commentCounts = await Post.aggregate([
      { $match: filter },
      { $project: { count: { $size: { $filter: { input: "$comments", as: "c", cond: { $eq: ["$$c.isDeleted", false] } } } } } },
    ]);

    const countMap = {};
    commentCounts.forEach((p) => { countMap[p._id.toString()] = p.count; });
    result.forEach((p) => { p.commentCount = countMap[p._id.toString()] ?? 0; });

    res.json({
      posts: result,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
    });
  } catch (err) {
    console.error("Get posts error:", err.message);
    res.status(500).json({ message: "Server error fetching posts." });
  }
});

router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username")
      .populate("comments.author", "username");

    if (!post || post.isDeleted) {
      return res.status(404).json({ message: "Post not found." });
    }

    post.views += 1;
    await post.save();

    const p = post.toObject();


    p.userUpvoted = req.user
      ? post.upvotedBy.some((id) => id.toString() === req.user._id.toString())
      : false;

    const myUpvotedComments = req.user
      ? req.user.upvotedComments.map((id) => id.toString())
      : [];

    p.comments = p.comments
      .filter((c) => !c.isDeleted)
      .map((c) => ({
        ...c,
        userUpvoted: myUpvotedComments.includes(c._id.toString()),
      }));

    res.json({ post: p });
  } catch (err) {
    console.error("Get post error:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});


router.post("/", protect, async (req, res) => {
  try {
    const { title, content, category, type, imageUrl } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ message: "Title, content, and category are required." });
    }

    const post = await Post.create({
      author:   req.user._id,
      title:    title.trim(),
      content:  content.trim(),
      category,
      type:     type || "story",
      ...(imageUrl && { imageUrl }),
    });

    await post.populate("author", "username");

    res.status(201).json({ post });
  } catch (err) {
    console.error("Create post error:", err.message);

    if (err.name === "ValidationError") {
      const message = Object.values(err.errors).map((e) => e.message).join(", ");
      return res.status(400).json({ message });
    }

    res.status(500).json({ message: "Server error creating post." });
  }
});

router.patch("/:id/upvote", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post || post.isDeleted) {
      return res.status(404).json({ message: "Post not found." });
    }

    const userId     = req.user._id;
    const hasUpvoted = post.upvotedBy.some(
      (id) => id.toString() === userId.toString()
    );

    if (hasUpvoted) {
      post.upvotes = Math.max(0, post.upvotes - 1);
      post.upvotedBy.pull(userId);
      await User.findByIdAndUpdate(userId, {
        $pull: { upvotedPosts: post._id },
      });
    } else {

      post.upvotes += 1;
      post.upvotedBy.push(userId);
      await User.findByIdAndUpdate(userId, {
        $addToSet: { upvotedPosts: post._id },
      });
    }

    await post.save();

    res.json({
      upvotes:     post.upvotes,
      userUpvoted: !hasUpvoted,
    });
  } catch (err) {
    console.error("Upvote error:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});


router.post("/:id/comments", protect, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty." });
    }

    if (content.length > 1000) {
      return res.status(400).json({ message: "Comment cannot exceed 1000 characters." });
    }

    const post = await Post.findById(req.params.id);

    if (!post || post.isDeleted) {
      return res.status(404).json({ message: "Post not found." });
    }

    post.comments.push({
      author:  req.user._id,
      content: content.trim(),
    });

    await post.save();


    await post.populate("comments.author", "username");

    const newComment = post.comments[post.comments.length - 1];

    res.status(201).json({ comment: newComment });
  } catch (err) {
    console.error("Comment error:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});


router.patch("/:id/comments/:commentId/upvote", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post || post.isDeleted) {
      return res.status(404).json({ message: "Post not found." });
    }

    const comment = post.comments.id(req.params.commentId);

    if (!comment || comment.isDeleted) {
      return res.status(404).json({ message: "Comment not found." });
    }

    const userId     = req.user._id;
    const hasUpvoted = comment.upvotedBy.some(
      (id) => id.toString() === userId.toString()
    );

    if (hasUpvoted) {
      comment.upvotes = Math.max(0, comment.upvotes - 1);
      comment.upvotedBy.pull(userId);
      await User.findByIdAndUpdate(userId, {
        $pull: { upvotedComments: comment._id },
      });
    } else {
      comment.upvotes += 1;
      comment.upvotedBy.push(userId);
      await User.findByIdAndUpdate(userId, {
        $addToSet: { upvotedComments: comment._id },
      });
    }

    await post.save();

    res.json({
      upvotes:     comment.upvotes,
      userUpvoted: !hasUpvoted,
    });
  } catch (err) {
    console.error("Comment upvote error:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});


router.delete("/:id", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post || post.isDeleted) {
      return res.status(404).json({ message: "Post not found." });
    }

    const isOwner = post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "You are not authorized to delete this post." });
    }

    post.isDeleted = true;
    await post.save();

    res.json({ message: "Post deleted." });
  } catch (err) {
    console.error("Delete post error:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});


router.patch("/:id/flag", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post || post.isDeleted) {
      return res.status(404).json({ message: "Post not found." });
    }

    post.isFlagged = true;
    await post.save();

    res.json({ message: "Post flagged for review. Thank you for keeping SheZone safe." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

export default router;