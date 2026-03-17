//import updatePatient from "../controllers/patientController.js";
const router = require("express").Router();
const Patient = require("../models/Patient");
const Visit = require("../models/Visit");


//search patients by name or mobile
router.get("/search", async (req, res) => {
  try {
    const { name, mobile } = req.query;

    let filter = {};

    if (name) {
      filter = {
        $or: [
          { fullName: new RegExp(name, "i") },
          { name: new RegExp(name, "i") }
        ]
      };
    }

    if (mobile) {
      filter = { mobile };
    }

    const patients = await Patient.find(filter);

    // ✅ NORMALIZE RESPONSE
    const normalizedPatients = patients.map(p => ({
      _id: p._id,
      fullName:
        p.fullName ||
        p.name ||
        `${p.firstName || ""} ${p.lastName || ""}`.trim(),
      age: p.age,
      gender: p.gender,
      mobile: p.mobile
      }));

    res.json(normalizedPatients);
  } catch (err) {
    console.error("Patient search error:", err);
    res.status(500).json({ message: "Search failed" });
  }
});


/* CREATE PATIENT - FINAL FIXED VERSION */
router.post("/create", async (req, res) => {
  try {
    // 1️⃣ We pass req.body directly to Patient.create. 
    // This captures EVERY field sent from the frontend (vitals, fees, followUp, etc.)
    const patient = await Patient.create(req.body);

    // 2️⃣ We create the first visit. 
    // We use the patient object we just created to ensure IDs match.
    await Visit.create({
      patientId: patient._id,
      vitals: patient.vitals || {}, 
      medical: {
        doctorNotes: req.body.doctorNotes || "",
        prescription: req.body.prescription || []
      }
    });

    // 3️⃣ Send back the patient object so the frontend can redirect using patient._id
    res.status(201).json({ success: true, patient });

  } catch (err) {
    console.error("Backend Save Error:", err);
    // This will now tell you EXACTLY what is wrong in your terminal
    res.status(500).json({ message: "Patient creation failed", error: err.message });
  }
});



/* GET PATIENT BY ID */
router.get("/:id", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE PATIENT DETAILS
router.put("/:id", async (req, res) => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(updatedPatient);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err });
  }
});





module.exports = router;
