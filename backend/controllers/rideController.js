const Ride = require('../models/Ride');

// @desc    Create a new ride
// @route   POST /api/rides
exports.createRide = async (req, res) => {
  try {
    const { source, destination, date, time, seats, price } = req.body;

    // Convert 24hr time from the HTML input to 12hr AM/PM format
    const formattedTime = Ride.formatTimeTo12Hr(time);

    const ride = await Ride.create({
      driver: req.user._id,
      source,
      destination,
      date,
      time: formattedTime,
      seats,
      availableSeats: seats,
      price,
    });

    const populatedRide = await Ride.findById(ride._id).populate('driver', 'name email phone');
    res.status(201).json(populatedRide);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all active rides
// @route   GET /api/rides
exports.getRides = async (req, res) => {
  try {
    const rides = await Ride.find({ status: 'active', availableSeats: { $gt: 0 } })
      .populate('driver', 'name email phone')
      .sort({ date: 1 });
    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search rides
// @route   GET /api/rides/search
exports.searchRides = async (req, res) => {
  try {
    const { source, destination, date } = req.query;
    const query = { status: 'active', availableSeats: { $gt: 0 } };

    // Helper: trim whitespace, escape regex special characters, and allow spaces between words
    const escapeRegex = (str) => {
      return str.trim()
        .split(/\s+/) // split by any whitespace
        .map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) // escape each word
        .join('\\s*'); // allow any optional spaces between words
    };

    if (source && source.trim()) {
      query.source = { $regex: escapeRegex(source), $options: 'i' };
    }
    if (destination && destination.trim()) {
      query.destination = { $regex: escapeRegex(destination), $options: 'i' };
    }

    // Date is OPTIONAL — only filter if provided
    if (date && date.trim()) {
      const searchDate = new Date(date);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      query.date = { $gte: searchDate, $lt: nextDay };
    }

    const rides = await Ride.find(query)
      .populate('driver', 'name email phone')
      .sort({ date: 1 });
    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single ride
// @route   GET /api/rides/:id
exports.getRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate('driver', 'name email phone');
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    res.json(ride);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a ride
// @route   DELETE /api/rides/:id
exports.deleteRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    // Only the driver or admin can delete
    if (ride.driver.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Ride.findByIdAndDelete(req.params.id);
    res.json({ message: 'Ride deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get rides posted by current user
// @route   GET /api/rides/my
exports.getMyRides = async (req, res) => {
  try {
    const rides = await Ride.find({ driver: req.user._id })
      .populate('driver', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
