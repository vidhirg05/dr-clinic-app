const express = require("express");
const router = express.Router();
const Vitals = require("../models/Vitals");

/* ADD VISIT */
router.post("/", async (req, res) => {
  const vitals = await Vitals.create(req.body);
  res.json(vitals);
});

/* GET ALL VISITS FOR PATIENT */
router.get("/:patientId", async (req, res) => {
  const vitals = await Vitals.find({
    patientId: req.params.patientId,
  }).sort({ createdAt: -1 });

  res.json(vitals);
});

module.exports = router;
