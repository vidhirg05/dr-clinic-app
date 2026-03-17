const express = require("express");
const router = express.Router();
const Visit = require("../models/Visit"); // ✅ THIS MUST MATCH

router.post("/", async (req, res) => {
  try {
    const visit = await Visit.create(req.body);
    res.json({ success: true, visit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Visit save failed" });
  }
});

router.get("/:patientId", async (req, res) => {
  try {
    const visits = await Visit.find({ patientId: req.params.patientId })
      .sort({ createdAt: -1 });
    res.json(visits);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch visits" });
  }
});
module.exports = router;
