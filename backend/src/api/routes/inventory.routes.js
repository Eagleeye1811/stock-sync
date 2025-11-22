const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

/**
 * @route   GET /api/inventory/stock-levels
 * @desc    Get current stock levels
 * @access  Private
 */
router.get('/stock-levels', inventoryController.getStockLevels);

/**
 * @route   GET /api/inventory/stock-ledger
 * @desc    Get stock movement history
 * @access  Private
 */
router.get('/stock-ledger', inventoryController.getStockLedger);

/**
 * @route   GET /api/inventory/low-stock
 * @desc    Get low stock alerts
 * @access  Private
 */
router.get('/low-stock', inventoryController.getLowStock);

module.exports = router;

