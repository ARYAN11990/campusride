import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [rides, setRides] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin-login');
      return;
    }
    fetchAll(token);
  }, []);

  const fetchAll = async (token) => {
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [statsRes, usersRes, ridesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/stats', { headers }),
        axios.get('http://localhost:5000/api/admin/users', { headers }),
        axios.get('http://localhost:5000/api/admin/rides', { headers }),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setRides(ridesRes.data);
    } catch (error) {
      console.error('Admin fetch error:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('adminToken');
        navigate('/admin-login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('adminToken')}` };
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, { headers });
      setUsers(users.filter(u => u._id !== id));
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  const handleDeleteRide = async (id) => {
    if (!window.confirm('Delete this ride?')) return;
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('adminToken')}` };
      await axios.delete(`http://localhost:5000/api/admin/rides/${id}`, { headers });
      setRides(rides.filter(r => r._id !== id));
    } catch (error) {
      alert('Failed to delete ride');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">Admin Dashboard</h1>
        <p className="text-gray-500">Manage users, rides, and platform activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <AdminStat label="Total Users" value={stats.totalUsers} icon="👥" color="from-blue-500 to-blue-600" />
        <AdminStat label="Total Rides" value={stats.totalRides} icon="🚗" color="from-emerald-500 to-emerald-600" />
        <AdminStat label="Active Rides" value={stats.activeRides} icon="🟢" color="from-amber-500 to-amber-600" />
        <AdminStat label="Total Bookings" value={stats.totalBookings} icon="🎫" color="from-purple-500 to-purple-600" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 w-fit">
        {['overview', 'users', 'rides'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all capitalize ${
              activeTab === tab
                ? '-white shadow-lg shadow-primary-500/25'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Users</h3>
            <div className="space-y-3">
              {users.slice(0, 5).map((u) => (
                <div key={u._id} className="flex items-center gap-3">
                  <div className="-white text-sm font-bold">
                    {u.name?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 text-sm font-medium truncate">{u.name}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    u.role === 'admin' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-600'
                  }`}>
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Rides */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Rides</h3>
            <div className="space-y-3">
              {rides.slice(0, 5).map((r) => (
                <div key={r._id} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 text-sm font-medium truncate">
                      {r.source} → {r.destination}
                    </p>
                    <p className="text-xs text-gray-500">
                      by {r.driver?.name} • {new Date(r.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    r.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-gray-500'
                  }`}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="text-right p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-white transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-gray-800 text-xs font-bold">
                          {u.name?.charAt(0)}
                        </div>
                        <span className="text-gray-800 text-sm">{u.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-500">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        u.role === 'admin' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-600'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="px-3 py-1 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'rides' && (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                  <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                  <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Seats</th>
                  <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-right p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {rides.map((r) => (
                  <tr key={r._id} className="hover:bg-white transition-colors">
                    <td className="p-4">
                      <span className="text-gray-800 text-sm">{r.source} → {r.destination}</span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">{r.driver?.name}</td>
                    <td className="p-4 text-sm text-gray-500">{new Date(r.date).toLocaleDateString()}</td>
                    <td className="p-4 text-sm text-gray-500">{r.availableSeats}/{r.seats}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        r.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                        r.status === 'completed' ? 'bg-blue-500/10 text-blue-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteRide(r._id)}
                        className="px-3 py-1 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminStat = ({ label, value, icon, color }) => (
  <div className="glass rounded-xl p-5">
    <div className="flex items-center justify-between mb-2">
      <span className="text-2xl">{icon}</span>
    </div>
    <div className={`text-3xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>{value || 0}</div>
    <div className="text-sm text-gray-500 mt-1">{label}</div>
  </div>
);

export default AdminDashboard;
