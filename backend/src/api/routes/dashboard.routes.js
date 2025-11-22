const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

/**
 * @route   GET /api/dashboard/kpis
 * @desc    Get dashboard KPIs
 * @access  Private
 */
router.get('/kpis', dashboardController.getKPIs);

module.exports = router;

