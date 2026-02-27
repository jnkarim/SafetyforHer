import express from "express";
import Scenario from "../models/Scenario.js";
import { protect, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

/* ─────────────────────────────────────────────────────────
   GET /api/scenarios
   List all published scenarios (with user progress if logged in)
───────────────────────────────────────────────────────── */
router.get("/", optionalAuth, async (req, res) => {
  try {
    const scenarios = await Scenario.find({ isPublished: true }).select(
      "-progress",
    );

    const result = scenarios.map((s) => {
      const obj = s.toObject();
      if (req.user) {
        // Re-fetch progress for this user from the full doc isn't needed since we excluded it
        // Client will call /:slug for full detail with progress
        obj.userProgress = null;
      }
      return obj;
    });

    res.json({ scenarios: result });
  } catch (err) {
    console.error("Get scenarios error:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});

/* ─────────────────────────────────────────────────────────
   GET /api/scenarios/:slug
   Get a single scenario + user's progress
───────────────────────────────────────────────────────── */
router.get("/:slug", optionalAuth, async (req, res) => {
  try {
    const scenario = await Scenario.findOne({
      slug: req.params.slug,
      isPublished: true,
    });
    if (!scenario)
      return res.status(404).json({ message: "Scenario not found." });

    // Increment play count
    scenario.playCount += 1;
    await scenario.save();

    const obj = scenario.toObject();

    // Attach only the current user's progress (don't expose everyone's)
    obj.userProgress = null;
    if (req.user) {
      const myProgress = scenario.progress.find(
        (p) => p.userId.toString() === req.user._id.toString(),
      );
      obj.userProgress = myProgress || null;
    }

    // Strip all progress from response
    delete obj.progress;

    res.json({ scenario: obj });
  } catch (err) {
    console.error("Get scenario error:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});

/* ─────────────────────────────────────────────────────────
   POST /api/scenarios/:slug/progress
   Save a choice the user made (called on each choice click)
   Body: { sceneId, choiceLabel, next }
───────────────────────────────────────────────────────── */
router.post("/:slug/progress", protect, async (req, res) => {
  try {
    const { sceneId, choiceLabel, next } = req.body;
    if (!sceneId || !choiceLabel || !next) {
      return res
        .status(400)
        .json({ message: "sceneId, choiceLabel and next are required." });
    }

    const scenario = await Scenario.findOne({ slug: req.params.slug });
    if (!scenario)
      return res.status(404).json({ message: "Scenario not found." });

    const userId = req.user._id;
    let userProgress = scenario.progress.find(
      (p) => p.userId.toString() === userId.toString(),
    );

    if (!userProgress) {
      scenario.progress.push({
        userId,
        scenarioId: req.params.slug,
        choicesTaken: [],
      });
      userProgress = scenario.progress[scenario.progress.length - 1];
    }

    // Avoid duplicate scene entries
    const alreadyLogged = userProgress.choicesTaken.find(
      (c) => c.sceneId === sceneId,
    );
    if (!alreadyLogged) {
      userProgress.choicesTaken.push({ sceneId, choiceLabel, next });
    }

    await scenario.save();

    res.json({
      message: "Progress saved.",
      choicesTaken: userProgress.choicesTaken,
    });
  } catch (err) {
    console.error("Save progress error:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});

/* ─────────────────────────────────────────────────────────
   POST /api/scenarios/:slug/complete
   Mark scenario as completed + award badge
   Body: { badgeEarned: true/false }
───────────────────────────────────────────────────────── */
router.post("/:slug/complete", protect, async (req, res) => {
  try {
    const { badgeEarned = false } = req.body;

    const scenario = await Scenario.findOne({ slug: req.params.slug });
    if (!scenario)
      return res.status(404).json({ message: "Scenario not found." });

    const userId = req.user._id;
    let userProgress = scenario.progress.find(
      (p) => p.userId.toString() === userId.toString(),
    );

    if (!userProgress) {
      scenario.progress.push({
        userId,
        scenarioId: req.params.slug,
        choicesTaken: [],
      });
      userProgress = scenario.progress[scenario.progress.length - 1];
    }

    userProgress.completed = true;
    userProgress.badgeEarned = badgeEarned;
    userProgress.completedAt = new Date();

    await scenario.save();

    res.json({
      message: badgeEarned ? "🏅 Badge earned!" : "Scenario completed.",
      completed: true,
      badgeEarned,
    });
  } catch (err) {
    console.error("Complete scenario error:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});

/* ─────────────────────────────────────────────────────────
   GET /api/scenarios/user/badges
   Get all badges/completions for the current user
───────────────────────────────────────────────────────── */
router.get("/user/badges", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const scenarios = await Scenario.find({ isPublished: true });

    const badges = scenarios
      .map((s) => {
        const p = s.progress.find(
          (p) => p.userId.toString() === userId.toString(),
        );
        return {
          slug: s.slug,
          title: s.title,
          category: s.category,
          completed: p?.completed ?? false,
          badgeEarned: p?.badgeEarned ?? false,
          completedAt: p?.completedAt ?? null,
        };
      })
      .filter((b) => b.completed);

    res.json({ badges });
  } catch (err) {
    console.error("Get badges error:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});

export default router;
