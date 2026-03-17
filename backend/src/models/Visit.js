const mongoose = require("mongoose");

const PrescriptionSchema = new mongoose.Schema({
  medicine: String,
  duration: String,      // Added to store duration (e.g., "5")
  durationType: String,  // Added to store type (e.g., "Days")
  mor: Boolean,
  aft: Boolean,
  eve: Boolean,
  night: Boolean,
});

const VisitSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    vitals: {
      height: String,
      weight: String,
      bp: String,
      pulse: String,
      temperature: String,
      respirations: String,
      bmi: String,
      // --- ADD THESE NEW FIELDS ---
      spo2: String,
      waist: String,
      head: String,
      bloodSugar: String,  // For FBS
      randomSugar: String, // For RBS
    },

    medical: {
      doctorNotes: String,
      prescription: [PrescriptionSchema],
    },
    
    referral: {
      targetName: String,
      specialty: String,
      urgency: String,
    },

    followUp: {
      date: String,
      notes: String,
    },

    fees: {
      visitCharges: String,
      totalCharges: String,
      previousBalance: String,
      netPayable: String,
      discount: String,
      discountType: String,
      paymentMode: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Visit", VisitSchema);