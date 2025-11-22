const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

/**
 * @route   GET /api/inventory/stock-levels
 * @desc    Get current stock levels
 * @access  Private (All authenticated users)
 */
router.get('/stock-levels', inventoryController.getStockLevels);

/**
 * @route   GET /api/inventory/stock-ledger
 * @desc    Get stock movement history (complete audit trail)
 * @access  Private (ADMIN, MANAGER only)
 */
router.get(
  '/stock-ledger', 
  authorize('ADMIN', 'MANAGER'),
  inventoryController.getStockLedger
);

/**
 * @route   GET /api/inventory/low-stock
 * @desc    Get low stock alerts
 * @access  Private (ADMIN, MANAGER only for full access)
 */
router.get('/low-stock', inventoryController.getLowStock);

module.exports = router;

