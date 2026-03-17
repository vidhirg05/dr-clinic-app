const mongoose = require("mongoose");

const vitalsSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    bp: String,
    pulse: String,
    weight: String,
    temperature: String,
    medicine: String,
    notes: String,
    height: String,
    respirations: String,
    bmi: String,
      // --- ADD THESE NEW FIELDS ---
    spo2: String,
    waist: String,
    head: String,
    bloodSugar: String,  // For FBS
    randomSugar: String, // For RBS
  },
  { timestamps: true } // visit date
);

module.exports = mongoose.model("Vitals", vitalsSchema);
