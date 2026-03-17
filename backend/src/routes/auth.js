const express = require("express");
const Doctor = require("../models/Doctor");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const Clinic = require("../models/Clinic");



const router = express.Router();


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


/* REGISTER DOCTOR */
router.post("/register", async (req, res) => {
  try {
    const exists = await Doctor.findOne({ mobile: req.body.mobile });
    if (exists) {
      return res.json({ success: false, message: "Doctor already exists" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const doctor = await Doctor.create({
      ...req.body,
      password: hashedPassword,
    });

    res.json({ success: true, doctorId: doctor._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
});

router.post("/register-with-clinic", async (req, res) => {
  try {
    const { doctor, clinic } = req.body;

    if (!doctor || !clinic) {
      return res.status(400).json({
        success: false,
        message: "Doctor and clinic data required",
      });
    }

    const exists = await Doctor.findOne({ email: doctor.email });
    if (exists) {
      return res.json({
        success: false,
        message: "Doctor already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(doctor.password, 10);

    const newDoctor = await Doctor.create({
      ...doctor,
      password: hashedPassword,
      clinic, // embed clinic
    });

    res.json({
      success: true,
      doctorId: newDoctor._id,
    });
  } catch (err) {
    console.error("register-with-clinic error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
  console.log("REGISTER WITH CLINIC BODY:", req.body);
});


/* LOGIN DOCTOR */
router.post("/login", async (req, res) => {
  console.log("LOGIN BODY RECEIVED:", req.body); // 👈 ADD THIS
  try {
    // 1. Use 'let' to allow cleaning the data
    let { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    // 2. Clean the input: remove spaces and make lowercase
    const cleanIdentifier = identifier.trim().toLowerCase();



    const count = await Doctor.countDocuments();
    console.log(`Total Doctors in DB: ${count}`);
    // 3. Search both email and mobile simultaneously
    // This solves the "mobile regex" failing or email case-sensitivity issues
    const doctor = await Doctor.findOne({
      $or: [
        { email: cleanIdentifier },
        { mobile: cleanIdentifier }
      ]
    });

    // DEBUG LOG: See what the backend found
    console.log(`Searching for: [${cleanIdentifier}] | Result: ${doctor ? 'Found' : 'Not Found'}`);

    if (!doctor) {
      return res.status(401).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // 4. Password Check
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    res.json({ success: true, doctor });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ================= PASSWORD RESET ================= */
router.post("/auth/request-reset", async (req, res) => {
  const { email } = req.body;

  const doctor = await Doctor.findOne({ email });
  if (!doctor) {
    return res.status(404).json({ message: "Doctor not found" });
  }

  const token = crypto.randomBytes(32).toString("hex");

  doctor.resetPasswordToken = token;
  doctor.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
  await doctor.save();

  const resetLink = "https://render.com/#/reset-password?token=${token}";


  await transporter.sendMail({
    to: doctor.email,
    subject: "Reset Password",
    html: `
      <p>Click below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>Valid for 15 minutes</p>
    `,
  });

  res.json({ success: true });
});

router.post("/auth/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const doctor = await Doctor.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!doctor) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    doctor.password = await bcrypt.hash(newPassword, 10);
    doctor.resetPasswordToken = undefined;
    doctor.resetPasswordExpires = undefined;

    await doctor.save();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});



/* ================= CHANGE PASSWORD ================= */
router.post("/change-password", async (req, res) => {
  try {
    const { doctorName, oldPassword, newPassword } = req.body;

    if (!doctorName || !oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🔹 find doctor (case-insensitive)
    const doctor = await Doctor.findOne({
      $expr: {
        $eq: [
          { $concat: ["$firstName", " ", "$lastName"] },
          doctorName
        ]
      }
    });
     if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // 🔹 check old password
    const isMatch = await bcrypt.compare(oldPassword, doctor.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    // 🔹 hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    doctor.password = hashedPassword;

    await doctor.save();

    res.json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
