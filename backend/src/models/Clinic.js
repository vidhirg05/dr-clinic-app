const mongoose = require("mongoose");

const ClinicSchema = new mongoose.Schema({
  name: String,
  phones: [String],
  address: String,
  city: String,
  state: String,
  pin: String,

  timings: {
    morning: { from: String, to: String },
    evening: { from: String, to: String },
  },

  closedDays: [String],

  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
  },
});

module.exports = mongoose.model("Clinic", ClinicSchema);
