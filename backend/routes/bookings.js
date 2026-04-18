const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  cancelBooking,
  getRideBookings,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/ride/:rideId', protect, getRideBookings);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
