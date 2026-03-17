const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");

/* GET clinic by doctorId */
router.get("/:doctorId", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.doctorId);

    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    res.json(doctor.clinic || {});
  } catch (err) {
    console.error("GET CLINIC ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* UPDATE clinic by doctorId */
router.put("/:doctorId", async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.doctorId,
      { clinic: req.body },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    res.json({ success: true, clinic: doctor.clinic });
  } catch (err) {
    console.error("UPDATE CLINIC ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
