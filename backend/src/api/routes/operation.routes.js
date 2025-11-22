const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const operationController = require('../controllers/operation.controller');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

// All routes require authentication
router.use(protect);

/**
 * @route   POST /api/operations/receipt
 * @desc    Create a new receipt (incoming stock)
 * @access  Private
 */
router.post(
  '/receipt',
  [
    body('productId').notEmpty().withMessage('Product ID is required'),
    body('locationId').notEmpty().withMessage('Destination location ID is required'),
    body('quantity').isFloat({ min: 0.01 }).withMessage('Quantity must be greater than 0'),
    body('documentNumber').optional().isString(),
    body('notes').optional().isString()
  ],
  validate,
  operationController.createReceipt
);

/**
 * @route   POST /api/operations/delivery
 * @desc    Create a new delivery (outgoing stock)
 * @access  Private
 */
router.post(
  '/delivery',
  [
    body('productId').notEmpty().withMessage('Product ID is required'),
    body('locationId').notEmpty().withMessage('Source location ID is required'),
    body('quantity').isFloat({ min: 0.01 }).withMessage('Quantity must be greater than 0'),
    body('documentNumber').optional().isString(),
    body('notes').optional().isString()
  ],
  validate,
  operationController.createDelivery
);

/**
 * @route   POST /api/operations/transfer
 * @desc    Create a new internal transfer
 * @access  Private
 */
router.post(
  '/transfer',
  [
    body('productId').notEmpty().withMessage('Product ID is required'),
    body('sourceLocationId').notEmpty().withMessage('Source location ID is required'),
    body('destinationLocationId').notEmpty().withMessage('Destination location ID is required'),
    body('quantity').isFloat({ min: 0.01 }).withMessage('Quantity must be greater than 0'),
    body('notes').optional().isString()
  ],
  validate,
  operationController.createTransfer
);

/**
 * @route   POST /api/operations/validate/:moveId
 * @desc    Validate an operation (CRITICAL ENDPOINT - Updates stock levels)
 * @access  Private
 */
router.post('/validate/:moveId', operationController.validateOperation);

/**
 * @route   GET /api/operations
 * @desc    Get all operations with optional filters
 * @access  Private
 */
router.get('/', operationController.getOperations);

/**
 * @route   GET /api/operations/:moveId
 * @desc    Get single operation by ID
 * @access  Private
 */
router.get('/:moveId', operationController.getOperation);

/**
 * @route   DELETE /api/operations/:moveId
 * @desc    Cancel/delete an operation (only if status is DRAFT)
 * @access  Private
 */
router.delete('/:moveId', operationController.cancelOperation);

module.exports = router;

