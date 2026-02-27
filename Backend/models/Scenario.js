import mongoose from "mongoose";

// ─── Progress subdocument (tracks which scenes a user has visited) ───────────
const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    scenarioId: { type: String, required: true }, // e.g. 'doxxing'
    completed: { type: Boolean, default: false },
    badgeEarned: { type: Boolean, default: false },
    choicesTaken: [{ sceneId: String, choiceLabel: String, next: String }],
    completedAt: { type: Date },
  },
  { _id: false },
);

// ─── Main Scenario model ──────────────────────────────────────────────────────
const scenarioSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true }, // 'doxxing'
    title: { type: String, required: true },
    subtitle: { type: String },
    description: { type: String },
    category: {
      type: String,
      enum: ["Doxxing", "Sextortion", "ImageAbuse", "Grooming", "Deepfakes"],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    isPublished: { type: Boolean, default: true },
    playCount: { type: Number, default: 0 },
    progress: [progressSchema],
  },
  { timestamps: true },
);

export default mongoose.model("Scenario", scenarioSchema);
