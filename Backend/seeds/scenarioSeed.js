// Run with: node backend/seeds/scenarioSeed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Scenario from "../models/Scenario.js";

dotenv.config();

const scenarios = [
  {
    slug: "doxxing",
    title: "Doxxing & Cyberstalking",
    subtitle: "Chapter 1",
    description:
      "A stranger knows your address from your posts. Every choice you make matters.",
    category: "Doxxing",
    difficulty: "Beginner",
    isPublished: true,
    playCount: 0,
  },
  // Add more scenarios here as you build them:
  // { slug: 'sextortion',  title: 'Sextortion & Blackmail',     category: 'Sextortion',  ... },
  // { slug: 'image-abuse', title: 'Image-Based Abuse',          category: 'ImageAbuse',  ... },
  // { slug: 'grooming',    title: 'Online Grooming',            category: 'Grooming',    ... },
  // { slug: 'deepfakes',   title: 'Deepfakes & Impersonation',  category: 'Deepfakes',   ... },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    for (const s of scenarios) {
      await Scenario.findOneAndUpdate({ slug: s.slug }, s, {
        upsert: true,
        new: true,
      });
      console.log(`✅ Seeded: ${s.title}`);
    }

    console.log("Seed complete.");
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  }
};

seed();
