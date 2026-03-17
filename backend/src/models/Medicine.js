const mongoose = require("mongoose");

const MedicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Medicine", MedicineSchema);
