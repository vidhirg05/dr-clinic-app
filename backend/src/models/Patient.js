// Patient.js (Backend Model)
const mongoose = require("mongoose");

// models/Patient.js
const PatientSchema = new mongoose.Schema({
  fullName: String,
  age: Number,
  gender: String,
  dob: String,
  mobile: String,
  email: String,
  address: String,
  city: String,
  state: String,
  pinCode: String,
  bloodGroup: String,
  allergies: String,
  doctorNotes: String,

  // Set these to 'Object' or 'Array' so they can store the nested data from your frontend
  vitals: { type: Object, default: {} },
  history: { type: Object, default: {} },
  followUp: { type: Object, default: {} },
  fees: { type: Object, default: {} },
  referral: { type: Object, default: {} },
  prescription: { type: Array, default: [] } 
}, { timestamps: true });

module.exports = mongoose.model("Patient", PatientSchema);
module.exports = mongoose.model("Patient", PatientSchema);