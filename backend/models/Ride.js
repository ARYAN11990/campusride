const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  source: {
    type: String,
    required: [true, 'Please add a source location'],
    trim: true,
  },
  destination: {
    type: String,
    required: [true, 'Please add a destination'],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'Please add a date'],
  },
  time: {
    type: String,
    required: [true, 'Please add a time'],
  },
  seats: {
    type: Number,
    required: [true, 'Please add number of seats'],
    min: 1,
  },
  availableSeats: {
    type: Number,
    required: true,
    min: 0,
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: 0,
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active',
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual: human-readable seat availability text
rideSchema.virtual('seatsAvailableText').get(function () {
  if (this.availableSeats === 0) return 'Fully booked';
  if (this.availableSeats === 1) return '1 seat available';
  return `${this.availableSeats} seats available`;
});

/**
 * Convert 24-hour time string ("13:00") to 12-hour AM/PM format ("01:00 PM").
 * If the value already contains AM/PM it is returned as-is.
 */
rideSchema.statics.formatTimeTo12Hr = function (timeStr) {
  if (!timeStr) return timeStr;

  // Already formatted – nothing to do
  if (/am|pm/i.test(timeStr)) return timeStr;

  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;

  let hours = parseInt(parts[0], 10);
  const minutes = parts[1].padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';

  if (hours === 0) hours = 12;
  else if (hours > 12) hours -= 12;

  return `${hours.toString().padStart(2, '0')}:${minutes} ${period}`;
};

module.exports = mongoose.model('Ride', rideSchema);
