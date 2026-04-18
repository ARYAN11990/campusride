import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getAvatarColor } from '../utils/helpers';

const Dashboard = () => {
  const { user } = useAuth();
  const [myRides, setMyRides] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('rides');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ridesRes, bookingsRes] = await Promise.all([
        API.get('/rides/my'),
        API.get('/bookings/my'),
      ]);
      setMyRides(ridesRes.data);
      setMyBookings(bookingsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRide = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ride?')) return;
    try {
      await API.delete(`/rides/${id}`);
      setMyRides(myRides.filter(r => r._id !== id));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete ride');
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await API.put(`/bookings/${id}/cancel`);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-gray-800 text-2xl font-bold shadow-lg"
          style={getAvatarColor(user?.name)}
        >
          {user?.name?.charAt(0) || '?'}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{user?.name}'s Dashboard</h1>
          <p className="text-gray-500 text-sm">{user?.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Rides Posted" value={myRides.length} color="from-blue-500 to-blue-600" />
        <StatCard label="Active Rides" value={myRides.filter(r => r.status === 'active').length} color="from-emerald-500 to-emerald-600" />
        <StatCard label="Bookings Made" value={myBookings.length} color="from-accent-500 to-accent-600" />
        <StatCard label="Active Bookings" value={myBookings.filter(b => b.status === 'confirmed').length} color="from-amber-500 to-amber-600" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 w-fit">
        <button
          onClick={() => setActiveTab('rides')}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'rides'
              ? '-white shadow-lg shadow-primary-500/25'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          My Rides ({myRides.length})
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'bookings'
              ? '-white shadow-lg shadow-primary-500/25'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          My Bookings ({myBookings.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'rides' ? (
        myRides.length > 0 ? (
          <div className="space-y-4">
            {myRides.map((ride) => (
              <div key={ride._id} className="glass rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-800 font-medium truncate">{ride.source}</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-gray-800 font-medium truncate">{ride.destination}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>{new Date(ride.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{ride.time}</span>
                    <span>•</span>
                    <span>{ride.seatsAvailableText || `${ride.availableSeats} seats available`}</span>
                    <span>•</span>
                    {ride.price === 0 ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">FREE</span>
                    ) : (
                      <span>₹{ride.price}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    ride.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                    ride.status === 'completed' ? 'bg-blue-500/10 text-blue-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>
                    {ride.status}
                  </span>
                  <button
                    onClick={() => handleDeleteRide(ride._id)}
                    className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            emoji="🚗"
            title="No rides posted yet"
            desc="Start sharing your rides with fellow students"
            link="/post-ride"
            linkText="Post a Ride"
          />
        )
      ) : (
        myBookings.length > 0 ? (
          <div className="space-y-4">
            {myBookings.map((booking) => (
              <div key={booking._id} className="glass rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-800 font-medium truncate">{booking.ride?.source}</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-gray-800 font-medium truncate">{booking.ride?.destination}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>Driver: {booking.ride?.driver?.name}</span>
                    <span>•</span>
                    <span>{booking.seats} seat(s)</span>
                    <span>•</span>
                    {(booking.ride?.price || 0) === 0 ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">FREE</span>
                    ) : (
                      <span>₹{(booking.ride?.price || 0) * booking.seats}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {booking.status}
                  </span>
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            emoji="🎫"
            title="No bookings yet"
            desc="Browse available rides and book one"
            link="/search"
            linkText="Find a Ride"
          />
        )
      )}
    </div>
  );
};

const StatCard = ({ label, value, color }) => (
  <div className="glass rounded-xl p-4">
    <div className={`text-2xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>{value}</div>
    <div className="text-xs text-gray-500 mt-1">{label}</div>
  </div>
);

const EmptyState = ({ emoji, title, desc, link, linkText }) => (
  <div className="glass rounded-2xl p-12 text-center">
    <div className="text-5xl mb-4">{emoji}</div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-500 mb-6">{desc}</p>
    <Link
      to={link}
      className="inline-block px-6 py-3 text-white font-semibold btn-transition"
    >
      {linkText}
    </Link>
  </div>
);

export default Dashboard;
