const Visit = require("../models/Visit");
const Patient = require("../models/Patient");

// 1. KPI Summary - Patient Growth, Revenue per Visit, No-Show Rate
exports.getKPISummary = async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    // Active Patient Growth
    const patientsThisMonth = await Patient.countDocuments({
      createdAt: { $gte: currentMonth }
    });

    const patientsLastMonth = await Patient.countDocuments({
      createdAt: { $gte: lastMonth, $lte: endOfLastMonth }
    });

    const patientGrowth = patientsLastMonth > 0
      ? (((patientsThisMonth - patientsLastMonth) / patientsLastMonth) * 100).toFixed(1)
      : 0;

    // Average Revenue Per Visit
    const totalVisits = await Visit.countDocuments();
    const totalRevenue = await Visit.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: { $toDouble: "$fees.netPayable" } }
        }
      }
    ]);

    const avgRevenuePerVisit = totalVisits > 0
      ? (totalRevenue[0]?.total / totalVisits).toFixed(2)
      : 0;

    // No-Show / Cancellation Rate (using missing follow-ups as indicator)
    const totalScheduledFollowUps = await Visit.countDocuments({
      "followUp.date": { $exists: true, $ne: null }
    });

    const completedFollowUps = await Visit.countDocuments({
      "followUp.date": { $exists: true, $ne: null },
      updatedAt: { $exists: true }
    });

    const noShowRate = totalScheduledFollowUps > 0
      ? (((totalScheduledFollowUps - completedFollowUps) / totalScheduledFollowUps) * 100).toFixed(1)
      : 0;

    res.json({
      activePatientGrowth: {
        current: patientsThisMonth,
        previous: patientsLastMonth,
        growthPercentage: patientGrowth
      },
      averageRevenuePerVisit: avgRevenuePerVisit,
      noShowRate: noShowRate
    });
  } catch (error) {
    res.status(500).json({ message: "KPI error", error });
  }
};

// 2. Revenue Trends - Month-over-month revenue
exports.getRevenueTrends = async (req, res) => {
  try {
    const months = [];
    const labels = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

      const revenue = await Visit.aggregate([
        {
          $match: { createdAt: { $gte: monthStart, $lte: monthEnd } }
        },
        {
          $group: {
            _id: null,
            total: { $sum: { $toDouble: "$fees.netPayable" } }
          }
        }
      ]);

      months.push({
        month: monthStart.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }),
        revenue: revenue[0]?.total || 0
      });

      labels.push(monthStart.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }));
    }

    res.json(months);
  } catch (error) {
    res.status(500).json({ message: "Revenue trends error", error });
  }
};

// 3. Specialty Breakdown - Which specialties generate most revenue/volume
exports.getSpecialtyBreakdown = async (req, res) => {
  try {
    const specialties = await Visit.aggregate([
      {
        $match: { "referral.specialty": { $exists: true, $ne: null } }
      },
      {
        $group: {
          _id: "$referral.specialty",
          count: { $sum: 1 },
          revenue: { $sum: { $toDouble: "$fees.netPayable" } }
        }
      },
      {
        $sort: { revenue: -1 }
      }
    ]);

    const formattedSpecialties = specialties.map(spec => ({
      name: spec._id || "General",
      volume: spec.count,
      revenue: spec.revenue.toFixed(2)
    }));

    res.json(formattedSpecialties);
  } catch (error) {
    res.status(500).json({ message: "Specialty breakdown error", error });
  }
};

// 4. Peak Visit Hours - What time of day has most visits
exports.getPeakVisitHours = async (req, res) => {
  try {
    // Extract hour from createdAt timestamp
    const visits = await Visit.aggregate([
      {
        $group: {
          _id: {
            $hour: {
              $toDate: { $multiply: ["$createdAt", 1000] }
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Format the data with hour labels
    const hoursData = [];
    for (let hour = 9; hour <= 17; hour++) {
      const found = visits.find(v => v._id === hour);
      hoursData.push({
        hour: `${hour}:00`,
        visits: found ? found.count : 0
      });
    }

    res.json(hoursData);
  } catch (error) {
    res.status(500).json({ message: "Peak hours error", error });
  }
};

// 5. Weekly Visit Trends
exports.getWeeklyTrends = async (req, res) => {
  try {
    const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const weeklyData = [];

    const visits = await Visit.aggregate([
      {
        $group: {
          _id: {
            $dayOfWeek: {
              $toDate: { $multiply: ["$createdAt", 1000] }
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    for (let day = 1; day <= 7; day++) {
      const found = visits.find(v => v._id === day);
      weeklyData.push({
        day: weekDays[day - 1],
        visits: found ? found.count : 0
      });
    }

    res.json(weeklyData);
  } catch (error) {
    res.status(500).json({ message: "Weekly trends error", error });
  }
};
