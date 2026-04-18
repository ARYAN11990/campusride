const Booking = require('../models/Booking');
const Ride = require('../models/Ride');

// @desc    Get bookings for a specific ride (driver only)
// @route   GET /api/bookings/ride/:rideId
exports.getRideBookings = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view these bookings' });
    }

    const bookings = await Booking.find({ ride: req.params.rideId, status: { $ne: 'cancelled' } })
      .populate('passenger', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Book a ride
// @route   POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    const { rideId, seats } = req.body;

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    // Can't book your own ride
    if (ride.driver.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You can't book your own ride" });
    }

    // Check available seats
    if (ride.availableSeats < seats) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    // Check if already booked
    const existingBooking = await Booking.findOne({
      ride: rideId,
      passenger: req.user._id,
      status: 'confirmed',
    });
    if (existingBooking) {
      return res.status(400).json({ message: 'You already booked this ride' });
    }

    // Create booking
    const booking = await Booking.create({
      ride: rideId,
      passenger: req.user._id,
      seats,
    });

    // Update available seats
    ride.availableSeats -= seats;
    await ride.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate('passenger', 'name email phone')
      .populate({
        path: 'ride',
        populate: { path: 'driver', select: 'name email phone' },
      });

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my bookings
// @route   GET /api/bookings/my
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ passenger: req.user._id })
      .populate({
        path: 'ride',
        populate: { path: 'driver', select: 'name email phone' },
      })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get bookings for a specific ride (for the driver)
// @route   GET /api/bookings/ride/:rideId
exports.getRideBookings = async (req, res) => {
  try {
    const rideId = req.params.rideId;
    const ride = await Ride.findById(rideId);
    
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view passengers for this ride' });
    }

    const bookings = await Booking.find({ ride: rideId, status: 'confirmed' })
      .populate('passenger', 'name email phone profilePhoto');
      
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.passenger.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Restore seats
    const ride = await Ride.findById(booking.ride);
    if (ride) {
      ride.availableSeats += booking.seats;
      await ride.save();
    }

    res.json({ message: 'Booking cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
