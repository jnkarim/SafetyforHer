import express from "express";
import crypto from "crypto";
import Incident from "../models/Incident.js";

const router = express.Router();

// POST: Submit anonymous report
router.post('/report', async (req, res) => {
  try {
    const caseCode = `CASE-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const newIncident = new Incident({ ...req.body, caseCode });
    await newIncident.save();
    res.status(201).json({ success: true, caseCode });
  } catch (err) {
    res.status(500).json({ error: "Failed to submit report" });
  }
});

// GET: Check report status by case code
router.get('/status/:caseCode', async (req, res) => {
  try {
    const incident = await Incident.findOne({ caseCode: req.params.caseCode });
    if (!incident) return res.status(404).json({ error: "Case not found" });
    res.status(200).json({ data: incident });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch report" });
  }
});

export default router;