import mongoose from "mongoose";

const IncidentSchema = new mongoose.Schema({
  caseCode: { type: String, unique: true, required: true },
  incidentType: { type: String, required: true }, // e.g., Doxxing, Image-based Abuse
  platform: { type: String, required: true },
  description: { type: String, required: true },
  offenderLink: { type: String, default: null }, // URL to offender profile / post
  evidenceUrls: [{ type: String }], // Cloudinary URLs for uploaded screenshots
  status: { type: String, default: "Pending Review" },
  createdAt: { type: Date, default: Date.now },
  // Note: No userId or IP address fields to maintain strict anonymity
});

export default mongoose.model("Incident", IncidentSchema);
