const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    firstName: String,
    middleName: String,
    lastName: String,
    mobile: { type: String, unique: true, required : true, trim: true },
    email: { 
    type: String, 
    lowercase: true, // Automatically saves as lowercase
    trim: true 
  },
    degree: String,
    regNo: String,

    city: String,
    state: String,
    pin: String,

    password: { type: String, required: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    clinic: {
    name: String,
    phones: String,
    address: String,
    city: String,
    state: String,
    pin: String,
    morningFrom: String,
    morningTo: String,
    eveningFrom: String,
    eveningTo: String,
    closedDays: [String],
  },

    photo: String, // store image filename / url
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
