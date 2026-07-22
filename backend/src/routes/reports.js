const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report"); // Matches singular filename

// This matches: GET /api/reports/summary
router.get("/summary", reportController.getSummary);

// This matches: GET /api/reports/financial-audit
router.get("/financial-audit", reportController.getFinancialAudit);

// This matches: GET /api/reports/active-referrals
router.get("/active-referrals", reportController.getActiveReferrals);

// This matches: GET /api/reports/pending-dues
router.get("/pending-dues", reportController.getPendingDues);

// This matches: GET /api/reports/upcoming-follow-ups
router.get("/upcoming-follow-ups", reportController.getUpcomingFollowUps);

module.exports = router;