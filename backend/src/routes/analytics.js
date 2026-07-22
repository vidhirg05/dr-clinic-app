const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analytics");

// KPI Summary endpoints
router.get("/kpi-summary", analyticsController.getKPISummary);

// Revenue and trends
router.get("/revenue-trends", analyticsController.getRevenueTrends);

// Specialty breakdown
router.get("/specialty-breakdown", analyticsController.getSpecialtyBreakdown);

// Peak visit hours
router.get("/peak-hours", analyticsController.getPeakVisitHours);

// Weekly trends
router.get("/weekly-trends", analyticsController.getWeeklyTrends);

module.exports = router;
