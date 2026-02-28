import express from "express";
import crypto from "crypto";
import Incident from "../models/Incident.js";
import parser from "../middleware/upload.js"; // Cloudinary multer middleware

const router = express.Router();

// POST: Submit anonymous report (multipart/form-data to support screenshots)
// parser.array('screenshots', 5) — accepts up to 5 images under the key "screenshots"
router.post("/report", parser.array("screenshots", 5), async (req, res) => {
  try {
    const { incidentType, platform, description, offenderLink } = req.body;

    // Each uploaded file has a .path property set by CloudinaryStorage (the CDN URL)
    const evidenceUrls = req.files?.map((f) => f.path) ?? [];

    const caseCode = `CASE-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

    const newIncident = new Incident({
      caseCode,
      incidentType,
      platform,
      description,
      offenderLink: offenderLink || null,
      evidenceUrls,
    });

    await newIncident.save();
    res.status(201).json({ success: true, caseCode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit report" });
  }
});

// GET: Check report status by case code
router.get("/status/:caseCode", async (req, res) => {
  try {
    const incident = await Incident.findOne({ caseCode: req.params.caseCode });
    if (!incident) return res.status(404).json({ error: "Case not found" });
    res.status(200).json({ data: incident });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch report" });
  }
});

export default router;
