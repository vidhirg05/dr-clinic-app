const Visit = require("../models/Visit");

// 1. For the Top KPI Cards
exports.getSummary = async (req, res) => {
  try {
    const visits = await Visit.find();
    
    const totalRevenue = visits.reduce((acc, v) => acc + (Number(v.fees?.netPayable) || 0), 0);
    const pendingDues = visits.reduce((acc, v) => acc + (Number(v.fees?.previousBalance) || 0), 0);

    res.json({ totalRevenue, pendingDues });
  } catch (error) {
    res.status(500).json({ message: "Summary error", error });
  }
};

// 2. For the Filtered Audit Log
exports.getFinancialAudit = async (req, res) => {
  try {
    const { range } = req.query;
    let startDate = new Date();
    let endDate = new Date();
    const now = new Date();

    if (range === "this_week") {
      startDate.setDate(now.getDate() - now.getDay());
    } else if (range === "this_month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }
    // ... (rest of your date logic)

    const filter = range === "all" ? {} : { createdAt: { $gte: startDate, $lte: endDate } };

    const auditLogs = await Visit.find(filter)
      .select("fees createdAt patientId")
      .populate("patientId", "fullName");

    res.json(auditLogs);
  } catch (error) {
    res.status(500).json({ message: "Audit error", error });
  }
};

// 3. For Active Referrals
exports.getActiveReferrals = async (req, res) => {
  try {
    const referrals = await Visit.find({ "referral.targetName": { $exists: true, $ne: null } })
      .select("referral patientId createdAt")
      .populate("patientId", "fullName")
      .sort({ createdAt: -1 });

    const formattedReferrals = referrals.map((visit) => ({
      _id: visit._id,
      patientName: visit.patientId?.fullName || "Unknown Patient",
      specialty: visit.referral?.specialty || "General",
      targetName: visit.referral?.targetName || "Doctor",
      urgency: visit.referral?.urgency || "Normal",
      referredDate: new Date(visit.createdAt).toLocaleDateString("en-IN"),
    }));

    res.json(formattedReferrals);
  } catch (error) {
    res.status(500).json({ message: "Referral error", error });
  }
};

// 4. For Pending Dues
exports.getPendingDues = async (req, res) => {
  try {
    const visits = await Visit.find({ "fees.previousBalance": { $exists: true, $ne: null, $gt: 0 } })
      .select("fees patientId")
      .populate("patientId", "fullName");

    // Group by patient and sum up their dues
    const duesMap = {};
    visits.forEach((visit) => {
      const patientId = visit.patientId?._id.toString();
      const patientName = visit.patientId?.fullName || "Unknown Patient";
      const balance = Number(visit.fees?.previousBalance) || 0;

      if (patientId) {
        if (!duesMap[patientId]) {
          duesMap[patientId] = {
            patientId,
            patientName,
            totalDue: 0,
          };
        }
        duesMap[patientId].totalDue += balance;
      }
    });

    const pendingDuesList = Object.values(duesMap)
      .sort((a, b) => b.totalDue - a.totalDue);

    res.json(pendingDuesList);
  } catch (error) {
    res.status(500).json({ message: "Pending dues error", error });
  }
};

// 5. For Upcoming Follow-ups
exports.getUpcomingFollowUps = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const endOfWeek = new Date(today);
    endOfWeek.setDate(endOfWeek.getDate() + (7 - today.getDay()));
    endOfWeek.setHours(23, 59, 59, 999);

    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(23, 59, 59, 999);

    const followUpsTomorrow = await Visit.countDocuments({
      "followUp.date": { $gte: tomorrow, $lte: tomorrowEnd }
    });

    const followUpsThisWeek = await Visit.countDocuments({
      "followUp.date": { $gte: today, $lte: endOfWeek }
    });

    res.json({
      tomorrow: followUpsTomorrow,
      thisWeek: followUpsThisWeek
    });
  } catch (error) {
    res.status(500).json({ message: "Follow-ups error", error });
  }
};