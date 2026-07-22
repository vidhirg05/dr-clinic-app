const express = require("express");
const router = express.Router();
const Visit = require("../models/Visit");
const Patient = require("../models/Patient");

// GET all visited patients with their last visit date
router.get("/", async (req, res) => {
  try {
    // Get all unique patients who have visits, with their last visit date and visit count
    const visitedPatients = await Visit.aggregate([
      {
        $group: {
          _id: "$patientId",
          lastVisit: { $max: "$createdAt" },
          visitCount: { $sum: 1 }
        }
      },
      {
        $sort: { lastVisit: -1 } // Sort by most recent visit first
      }
    ]);

    // Get patient details for each visited patient
    const result = await Promise.all(
      visitedPatients.map(async (visit) => {
        const patient = await Patient.findById(visit._id);
        if (!patient) return null; // Skip if patient not found
        return {
          _id: patient._id,
          name: patient.fullName,
          age: patient.age,
          gender: patient.gender,
          mobile: patient.mobile,
          visitCount: visit.visitCount,
          lastVisit: visit.lastVisit ? visit.lastVisit.toISOString().split('T')[0] : null
        };
      })
    );

    // Filter out null results
    const validResults = result.filter(r => r !== null);
    res.json(validResults);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch visited patients" });
  }
});

router.post("/", async (req, res) => {
  try {
    const visit = await Visit.create(req.body);
    res.json({ success: true, visit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Visit save failed" });
  }
});

router.get("/:patientId", async (req, res) => {
  try {
    const { month, year } = req.query;
    const query = { patientId: req.params.patientId };

    // If month and/or year filter is provided, filter by that
    if (month || year) {
      const filterYear = year ? parseInt(year) : new Date().getFullYear();
      const filterMonth = month ? parseInt(month) - 1 : new Date().getMonth(); // JavaScript months are 0-indexed

      const startDate = new Date(filterYear, filterMonth, 1); // First day of month
      const endDate = new Date(filterYear, filterMonth + 1, 1); // First day of next month

      query.createdAt = {
        $gte: startDate,
        $lt: endDate
      };
    }

    const visits = await Visit.find(query)
      .sort({ createdAt: -1 });
    res.json(visits);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch visits" });
  }
});
module.exports = router;
