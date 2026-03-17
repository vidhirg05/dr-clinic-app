const express = require("express");
const bcrypt = require("bcryptjs");
const Doctor = require("../models/Doctor");
const multer = require("multer");

const router = express.Router();

/* ---------- FILE UPLOAD CONFIG ---------- */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

/* ---------- GET PROFILE (DOCTOR + CLINIC) ---------- */
router.get("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select("-password");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.json({
      success: true,
      doctor,
      clinic: doctor.clinic || {},
    });
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to load profile",
    });
  }
});

/* ---------- UPDATE DOCTOR ---------- */
router.put("/:id", async (req, res) => {
  try {
    const updated = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select("-password");

    res.json({ success: true, doctor: updated });
  } catch (err) {
    console.error("UPDATE DOCTOR ERROR:", err);
    res.status(500).json({ success: false });
  }
});

/* ---------- UPDATE CLINIC ---------- */
router.put("/:id/clinic", async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { clinic: req.body },
      { new: true }
    );

    res.json({ success: true, clinic: doctor.clinic });
  } catch (err) {
    console.error("UPDATE CLINIC ERROR:", err);
    res.status(500).json({ success: false });
  }
});

/* ---------- CHANGE PASSWORD ---------- */
router.put("/:id/password", async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const doctor = await Doctor.findById(req.params.id);
  const match = await bcrypt.compare(oldPassword, doctor.password);

  if (!match)
    return res.json({ success: false, message: "Wrong password" });

  doctor.password = await bcrypt.hash(newPassword, 10);
  await doctor.save();

  res.json({ success: true });
});

/* ---------- UPLOAD PHOTO ---------- */
router.post("/:id/photo", upload.single("photo"), async (req, res) => {
  const doctor = await Doctor.findByIdAndUpdate(
    req.params.id,
    { photo: req.file.filename },
    { new: true }
  );

  res.json({ success: true, photo: doctor.photo });
});

module.exports = router;
