import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: [true, "Comment cannot be empty"],
      trim: true,
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    // ✅ Array so multiple users can upvote
    upvotedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [10, "Title must be at least 10 characters"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      minlength: [15, "Content must be at least 15 characters"],
      maxlength: [5000, "Content cannot exceed 5000 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Stalking",
        "Catfishing",
        "Gaming",
        "Privacy",
        "ImageAbuse",
        "DoxxAttack",
        "Harassment",
        "Tips",
      ],
    },
    type: {
      type: String,
      enum: ["story", "tip", "question"],
      default: "story",
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    // ✅ Array so multiple users can upvote
    upvotedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [commentSchema],

    // ✅ Single imageUrl string (from Cloudinary)
    imageUrl: {
      type: String,
      default: null,
    },

    views: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isFlagged: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ upvotes: -1, createdAt: -1 });

export default mongoose.models.Post || mongoose.model("Post", postSchema);