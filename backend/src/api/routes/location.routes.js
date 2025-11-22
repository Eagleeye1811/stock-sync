const express = require('express');
const router = express.Router();
const locationController = require('../controllers/location.controller');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.get('/', locationController.getLocations);
router.post('/', locationController.createLocation);
router.get('/:id', locationController.getLocation);
router.put('/:id', locationController.updateLocation);
router.delete('/:id', locationController.deleteLocation);

module.exports = router;

