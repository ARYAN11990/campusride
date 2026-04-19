import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAvatarColor } from '../utils/helpers';
import { useState } from 'react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-gray-800 font-bold text-lg shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-shadow">
              C
            </div>
            <span className="text-xl font-bold gradient-text">CampusRide</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {user ? (
              <>
                <NavLink to="/">Browse Rides</NavLink>
                <NavLink to="/post-ride">Post Ride</NavLink>
                <NavLink to="/search">Search</NavLink>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/chat">Chat</NavLink>
                <NavLink to="/admin">Admin</NavLink>
                <div className="ml-3 flex items-center gap-3">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 text-sm text-gray-700 px-3 py-1.5 rounded-full bg-white hover:bg-gray-50 transition-colors group"
                  >
                    {user.profilePhoto ? (
                      <motion.img
                        whileHover={{ rotate: 10, y: -2 }}
                        src={`http://localhost:5000/${user.profilePhoto}`}
                        alt={user.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <motion.div
                        whileHover={{ rotate: 10, y: -2 }}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-gray-800 text-xs font-bold"
                        style={getAvatarColor(user.name)}
                      >
                        {user.name?.charAt(0)}
                      </motion.div>
                    )}
                    <span className="group-hover:text-gray-800 transition-colors">{user.name}</span>
                  </Link>
                  {/* <motion.button
                    whileHover={{ scale: 1.03, boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="text-sm px-4 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </motion.button> */}

                  {<motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleLogout}
                    className="text-sm px-4 py-1.5 rounded-lg text-white font-medium bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all"
                  >
                    Logout
                  </motion.button>}
                </div>
              </>
            ) : (
              <>
                <NavLink to="/admin">Admin</NavLink>
                <NavLink to="/login">Login</NavLink>
                <motion.div whileHover={{ scale: 1.03, boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/register"
                    className="ml-2 px-5 py-2 rounded-lg bg-blue-600 text-white font-medium text-sm hover:opacity-90 btn-transition block"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-gray-500 hover:text-gray-800"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {user ? (
              <>
                <MobileLink to="/" onClick={() => setMenuOpen(false)}>Browse Rides</MobileLink>
                <MobileLink to="/post-ride" onClick={() => setMenuOpen(false)}>Post Ride</MobileLink>
                <MobileLink to="/search" onClick={() => setMenuOpen(false)}>Search</MobileLink>
                <MobileLink to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</MobileLink>
                <MobileLink to="/chat" onClick={() => setMenuOpen(false)}>Chat</MobileLink>
                <MobileLink to="/profile" onClick={() => setMenuOpen(false)}>Profile</MobileLink>
                <MobileLink to="/admin" onClick={() => setMenuOpen(false)}>Admin</MobileLink>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="w-full text-left text-sm px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <MobileLink to="/admin" onClick={() => setMenuOpen(false)}>Admin</MobileLink>
                <MobileLink to="/login" onClick={() => setMenuOpen(false)}>Login</MobileLink>
                <MobileLink to="/register" onClick={() => setMenuOpen(false)}>Register</MobileLink>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="relative text-sm text-gray-700 hover:text-blue-500 px-3 py-2 rounded-lg transition-colors group"
  >
    {children}
    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
  </Link>
);

const MobileLink = ({ to, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="relative block text-sm text-gray-700 hover:text-blue-500 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors group w-max"
  >
    {children}
    <span className="absolute left-4 bottom-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-[calc(100%-2rem)]"></span>
  </Link>
);

export default Navbar;
