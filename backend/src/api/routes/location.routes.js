const express = require('express');
const router = express.Router();
const locationController = require('../controllers/location.controller');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

/**
 * @route   GET /api/locations
 * @desc    Get all locations
 * @access  Private (All authenticated users)
 */
router.get('/', locationController.getLocations);

/**
 * @route   POST /api/locations
 * @desc    Create a new location
 * @access  Private (ADMIN, MANAGER only)
 */
router.post('/', authorize('ADMIN', 'MANAGER'), locationController.createLocation);

/**
 * @route   GET /api/locations/:id
 * @desc    Get single location
 * @access  Private (All authenticated users)
 */
router.get('/:id', locationController.getLocation);

/**
 * @route   PUT /api/locations/:id
 * @desc    Update a location
 * @access  Private (ADMIN, MANAGER only)
 */
router.put('/:id', authorize('ADMIN', 'MANAGER'), locationController.updateLocation);

/**
 * @route   DELETE /api/locations/:id
 * @desc    Delete a location
 * @access  Private (ADMIN only)
 */
router.delete('/:id', authorize('ADMIN'), locationController.deleteLocation);

module.exports = router;

