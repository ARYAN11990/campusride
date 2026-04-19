import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getAvatarColor, formatPrice } from '../utils/helpers';

const RideDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [seats, setSeats] = useState(1);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [passengers, setPassengers] = useState([]);

  useEffect(() => {
    fetchRide();
  }, [id]);

  useEffect(() => {
    if (ride && user && ride.driver?._id === user._id) {
      fetchPassengers();
    }
  }, [ride, user]);

  const fetchRide = async () => {
    try {
      const { data } = await API.get(`/rides/${id}`);
      setRide(data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Ride not found' });
    } finally {
      setLoading(false);
    }
  };

  const fetchPassengers = async () => {
    try {
      const { data } = await API.get(`/bookings/ride/${id}`);
      setPassengers(data);
    } catch (error) {
      console.error("Failed to fetch passengers", error);
    }
  };

  const handleBook = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setBooking(true);
    setMessage({ type: '', text: '' });
    try {
      await API.post('/bookings', { rideId: id, seats });
      setMessage({ type: 'success', text: 'Ride booked successfully!' });
      fetchRide(); // Refresh to show updated seat count
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Booking failed' });
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Ride not found</h2>
        <Link to="/" className="text-blue-600 hover:text-primary-300">Go back home</Link>
      </div>
    );
  }

  const dateStr = new Date(ride.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const isDriver = user?._id === ride.driver?._id;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className="glass rounded-2xl p-8">
        {/* Route */}
        <div className="flex items-start gap-4 mb-6">
          <div className="flex flex-col items-center mt-1">
            <div className="w-4 h-4 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/30"></div>
            <div className="w-0.5 h-12 bg-gradient-to-b from-emerald-400 to-primary-500 my-1"></div>
            <div className="w-4 h-4 rounded-full bg-blue-500 shadow-lg shadow-primary-500/30"></div>
          </div>
          <div className="flex-1">
            <div className="mb-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">From</p>
              <p className="text-xl font-semibold text-gray-800">{ride.source}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">To</p>
              <p className="text-xl font-semibold text-gray-800">{ride.destination}</p>
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-50 my-6"></div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <DetailItem icon="📅" label="Date" value={dateStr} />
          <DetailItem icon="⏰" label="Time" value={ride.time} />
          <DetailItem icon="💺" label="Availability" value={ride.seatsAvailableText || `${ride.availableSeats} seats available`} />
          <DetailItem icon="💰" label="Price" value={ride.price === 0 ? 'FREE' : `₹${ride.price}/seat`} />
        </div>

        <div className="h-px bg-gray-50 my-6"></div>

        {/* Driver Info */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-gray-800 text-lg font-bold shadow-md"
            style={getAvatarColor(ride.driver?.name)}
          >
            {ride.driver?.name?.charAt(0) || '?'}
          </div>
          <div>
            <p className="text-gray-800 font-medium">{ride.driver?.name}</p>
            <p className="text-sm text-gray-500">{ride.driver?.email}</p>
            {ride.driver?.phone && user && (
              <p className="text-sm text-blue-500 flex items-center gap-1 mt-1">
                📞 {ride.driver.phone}
              </p>
            )}
          </div>
          {user && !isDriver && (
            <Link
              to={`/chat/${ride.driver?._id}`}
              className="ml-auto px-4 py-2 rounded-lg border border-gray-200 text-blue-600 text-sm hover:bg-gray-50 transition-colors"
            >
              💬 Message
            </Link>
          )}
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${
            message.type === 'success' 
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        {/* Booking */}
        {!isDriver && ride.availableSeats > 0 && ride.status === 'active' && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-5">
            <div className="flex gap-4 sm:gap-5 flex-1 items-end">
              <div className="flex-1 sm:flex-none">
                <label className="block text-xs text-gray-500 mb-1">Seats</label>
                <select
                  value={seats}
                  onChange={(e) => setSeats(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-800 focus:border-blue-500"
                >
                  {Array.from({ length: ride.availableSeats }, (_, i) => (
                    <option key={i + 1} value={i + 1} className="text-gray-900 bg-white">{i + 1}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Total</p>
                {ride.price === 0 ? (
                  <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-lg font-bold border border-emerald-500/30 inline-block">
                    FREE
                  </span>
                ) : (
                  <p className="text-2xl font-bold text-emerald-400">₹{ride.price * seats}</p>
                )}
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBook}
              disabled={booking}
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 rounded-lg text-white font-semibold transition-all hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {booking ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Booking...
                </>
              ) : 'Book Now'}
            </motion.button>
          </div>
        )}

        {ride.availableSeats === 0 && (
          <div className="text-center py-4 rounded-xl bg-amber-500/10 text-amber-600 font-medium border border-amber-500/20">
            This ride is fully booked
          </div>
        )}

        {/* Passengers List (Driver Only) */}
        {isDriver && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span>👥</span> Passengers ({passengers.length})
            </h3>
            {passengers.length > 0 ? (
              <div className="space-y-3">
                {passengers.map((booking) => (
                  <div key={booking._id} className="bg-white rounded-xl p-4 flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md"
                      style={getAvatarColor(booking.passenger?.name)}
                    >
                      {booking.passenger?.name?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 font-medium text-sm">{booking.passenger?.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Seats Booked: {booking.seats}</p>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      {booking.passenger?.phone ? (
                        <a href={`tel:${booking.passenger.phone}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100 transition-colors">
                          📞 {booking.passenger.phone}
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">No phone</span>
                      )}
                      {/* Navigate to Message */}
                      <Link
                        to={`/chat/${booking.passenger?._id}`}
                        className="p-1.5 rounded-lg bg-white border border-gray-200 text-blue-600 text-xs hover:bg-gray-50 transition-colors"
                        title="Message Passenger"
                      >
                        💬
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 rounded-xl bg-white border border-gray-100">
                <p className="text-sm text-gray-500">No passengers have booked yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div className="glass rounded-xl p-3 text-center">
    <div className="text-lg mb-1">{icon}</div>
    <div className="text-xs text-gray-500 mb-0.5">{label}</div>
    <div className="text-sm font-medium text-gray-800">{value}</div>
  </div>
);

export default RideDetails;
