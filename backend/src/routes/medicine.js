const express = require("express");
const router = express.Router();
const Medicine = require("../models/Medicine");

/* BULK ADD MEDICINES */
router.post("/bulk", async (req, res) => {
  const { medicines } = req.body;

  if (!Array.isArray(medicines) || medicines.length === 0) {
    return res.status(400).json({ message: "Medicines array required" });
  }

  // Remove duplicates by name
  const names = medicines.map(m => m.name);
  const existing = await Medicine.find({ name: { $in: names } });

  const existingNames = existing.map(m => m.name);

  const newMedicines = medicines.filter(
    m => !existingNames.includes(m.name)
  );

  if (newMedicines.length === 0) {
    return res.json({ message: "All medicines already exist" });
  }

  const inserted = await Medicine.insertMany(newMedicines);
  res.json(inserted);
});

/* GET ALL MEDICINES */
router.get("/", async (req, res) => {
  const medicines = await Medicine.find().sort({ name: 1 });
  res.json(medicines);
});

/* ADD MEDICINE */
router.post("/", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Medicine name required" });
  }

  const exists = await Medicine.findOne({ name });
  if (exists) {
    return res.status(409).json({ message: "Medicine already exists" });
  }

  const medicine = await Medicine.create({ name });
  res.json(medicine);
});

/* DELETE MEDICINE */
router.delete("/:id", async (req, res) => {
  await Medicine.findByIdAndDelete(req.params.id);
  res.json({ message: "Medicine deleted" });
});

module.exports = router;
