const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const productController = require('../controllers/product.controller');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

// All routes require authentication
router.use(protect);

/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Private (MANAGER, ADMIN)
 */
router.post(
  '/',
  authorize('MANAGER', 'ADMIN'),
  [
    body('name').notEmpty().withMessage('Product name is required'),
    body('skuCode').notEmpty().withMessage('SKU code is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('uom').notEmpty().withMessage('Unit of measure is required'),
    body('description').optional().isString(),
    body('reorderLevel').optional().isInt({ min: 0 })
  ],
  validate,
  productController.createProduct
);

/**
 * @route   GET /api/products
 * @desc    Get all products
 * @access  Private
 */
router.get('/', productController.getProducts);

/**
 * @route   GET /api/products/:id
 * @desc    Get single product
 * @access  Private
 */
router.get('/:id', productController.getProduct);

/**
 * @route   PUT /api/products/:id
 * @desc    Update product
 * @access  Private (MANAGER, ADMIN)
 */
router.put('/:id', authorize('MANAGER', 'ADMIN'), productController.updateProduct);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product (soft delete)
 * @access  Private (ADMIN)
 */
router.delete('/:id', authorize('ADMIN'), productController.deleteProduct);

module.exports = router;

