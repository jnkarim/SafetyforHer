import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const formatUser = (user) => ({
  _id: user._id,
  email: user.email,
  username: user.username,
  role: user.role,
});

router.post("/register", async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const emailExists = await User.findOne({
      email: email.toLowerCase().trim(),
    });
    if (emailExists) {
      return res
        .status(400)
        .json({ message: "An account with this email already exists." });
    }

    const finalUsername = username?.trim();

    if (finalUsername) {
      const usernameExists = await User.findOne({ username: finalUsername });
      if (usernameExists) {
        return res
          .status(400)
          .json({ message: "Username already taken. Please choose another." });
      }
    }

    const user = await User.create({
      email: email.toLowerCase().trim(),
      password,
      username: finalUsername,
    });

    res.status(201).json({
      token: generateToken(user._id),
      user: formatUser(user),
    });
  } catch (err) {
    console.error("Register error:", err.message);
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors)
        .map((e) => e.message)
        .join(", ");
      return res.status(400).json({ message });
    }
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    res.json({
      token: generateToken(user._id),
      user: formatUser(user),
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

router.get("/me", protect, async (req, res) => {
  try {
    res.json({ user: formatUser(req.user) });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

export default router;
