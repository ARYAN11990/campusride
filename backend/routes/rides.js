const express = require('express');
const router = express.Router();
const {
  createRide,
  getRides,
  searchRides,
  getRide,
  deleteRide,
  getMyRides,
} = require('../controllers/rideController');
const { protect } = require('../middleware/auth');

router.get('/search', searchRides);
router.get('/my', protect, getMyRides);
router.route('/').get(getRides).post(protect, createRide);
router.route('/:id').get(getRide).delete(protect, deleteRide);

module.exports = router;
