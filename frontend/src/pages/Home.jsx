import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import RideCard from '../components/RideCard';
import Hero from '../components/Hero';
import { useAuth } from '../context/AuthContext';
import { motion, useMotionValue, useTransform, useSpring, useInView, animate } from 'framer-motion';

const CountUpStat = ({ label, value, suffix }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  
  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, { duration: 2, ease: "easeOut" });
      return controls.stop;
    }
  }, [isInView, value, count]);

  return (
    <div ref={ref} className="text-center p-6 backdrop-blur-md bg-white/70 rounded-2xl shadow-lg border border-gray-200 group hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300">
      <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent mb-2 flex justify-center items-center drop-shadow-sm">
        <motion.span>{rounded}</motion.span>
        <span>{suffix}</span>
      </div>
      <p className="text-gray-600 font-medium group-hover:text-blue-500 transition-colors uppercase tracking-wide text-sm">{label}</p>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: 1000 }} className="h-full">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="group backdrop-blur-md bg-white/70 rounded-xl shadow-lg p-6 text-center border border-gray-200 cursor-pointer h-full"
      >
        <div style={{ transform: "translateZ(40px)" }}>
          <div className="text-4xl mb-4 transition-transform duration-300 group-hover:scale-125 group-hover:-translate-y-2 inline-block filter group-hover:drop-shadow-lg">{icon}</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-500 text-sm">{description}</p>
        </div>
      </motion.div>
    </div>
  );
};

const Home = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      const { data } = await API.get('/rides');
      setRides(data);
    } catch (error) {
      console.error('Error fetching rides:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <Hero 
        title={
          <>
            Share Your Ride, <span className="gradient-text">Save Your Money 🚗</span>
          </>
        }
        subtitle="Find students traveling your route and ride together safely. Affordable, fast, and eco-friendly campus transportation."
        image="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1200"
        buttons={
          user 
          ? [
              { text: "Offer a Ride", to: "/post-ride", primary: true },
              { text: "Find a Ride", to: "/search", primary: false }
            ]
          : [
              { text: "Browse Rides", to: "/search", primary: true },
              { text: "Post a Ride", to: "/post-ride", primary: false }
            ]
        }
      />

      {/* SECTION 1: FEATURES SECTION */}
      <div className="mb-16" data-aos="fade-up">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Why Choose CampusRide?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard icon="💰" title="Save Money" description="Share rides and reduce travel costs" />
          <FeatureCard icon="🌱" title="Eco-Friendly" description="Reduce fuel usage and pollution" />
          <FeatureCard icon="⚡" title="Easy Booking" description="Find and book rides instantly" />
          <FeatureCard icon="👥" title="Safe Community" description="Only students can use the platform" />
        </div>
      </div>

      {/* SECTION 2: HOW IT WORKS */}
      <div className="mb-16 backdrop-blur-md bg-white/70 rounded-2xl shadow-lg border border-gray-200 p-8 md:p-12" data-aos="zoom-in">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">How It Works</h2>
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 relative">
          {/* Desktop connecting line */}
          <div className="hidden md:block absolute top-6 left-12 right-12 h-1 bg-blue-50 z-0"></div>
          
          <div className="flex-1 w-full text-center relative z-10 flex flex-row md:flex-col items-center gap-4 group cursor-default">
            <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xl shadow-md mb-0 md:mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:shadow-indigo-500/40">1</div>
            <div className="text-left md:text-center">
              <h3 className="text-lg font-semibold text-gray-800 transition-colors duration-300 group-hover:text-blue-500">Register/Login</h3>
              <p className="text-sm text-gray-500 mt-1">Create your secure student account</p>
            </div>
          </div>
          <div className="flex-1 w-full text-center relative z-10 flex flex-row md:flex-col items-center gap-4 group cursor-default">
            <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xl shadow-md mb-0 md:mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:shadow-indigo-500/40">2</div>
            <div className="text-left md:text-center">
              <h3 className="text-lg font-semibold text-gray-800 transition-colors duration-300 group-hover:text-blue-500">Post or Search</h3>
              <p className="text-sm text-gray-500 mt-1">Find a route or offer empty seats</p>
            </div>
          </div>
          <div className="flex-1 w-full text-center relative z-10 flex flex-row md:flex-col items-center gap-4 group cursor-default">
            <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xl shadow-md mb-0 md:mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:shadow-indigo-500/40">3</div>
            <div className="text-left md:text-center">
              <h3 className="text-lg font-semibold text-gray-800 transition-colors duration-300 group-hover:text-blue-500">Book Instantly</h3>
              <p className="text-sm text-gray-500 mt-1">Reserve your seat securely</p>
            </div>
          </div>
          <div className="flex-1 w-full text-center relative z-10 flex flex-row md:flex-col items-center gap-4 group cursor-default">
            <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xl shadow-md mb-0 md:mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:shadow-indigo-500/40">4</div>
            <div className="text-left md:text-center">
              <h3 className="text-lg font-semibold text-gray-800 transition-colors duration-300 group-hover:text-blue-500">Travel Together</h3>
              <p className="text-sm text-gray-500 mt-1">Meet up and enjoy your journey</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2.5: OUR IMPACT (NEW) */}
      <div className="mb-16" data-aos="fade-up">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Our Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CountUpStat label="Users" value={1000} suffix="+" />
          <CountUpStat label="Rides" value={500} suffix="+" />
          <CountUpStat label="Daily Trips" value={300} suffix="+" />
        </div>
      </div>

      {/* SECTION 3: RECENT RIDES */}
      <div className="mb-16" data-aos="fade-up">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Recent Rides</h2>
          <Link to="/search" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
            View all →
          </Link>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : rides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rides.slice(0, 6).map((ride) => (
              <RideCard key={ride._id} ride={ride} />
            ))}
          </div>
        ) : (
          <div className="backdrop-blur-md bg-white/70 rounded-2xl p-12 text-center border border-gray-200 shadow-lg">
            <div className="text-5xl mb-4">🚗</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No rides available</h3>
            <p className="text-gray-500 mb-6">Be the first to post a ride!</p>
            {user && (
              <Link to="/post-ride" className="inline-block px-6 py-3 bg-blue-500 rounded-lg text-white font-semibold hover:bg-blue-600 transition-colors">
                Post a Ride
              </Link>
            )}
          </div>
        )}
      </div>

      {/* SECTION 4: CALL TO ACTION */}
      <div className="backdrop-blur-md bg-white/70 rounded-2xl p-12 text-center shadow-lg border border-gray-200 mb-8" data-aos="zoom-in">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Ready to Share Your Ride?</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
          Join the fastest growing campus transportation network. Whether you have an empty seat or need a lift, CampusRide is here.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
            <Link to="/post-ride" className="block w-full sm:w-auto px-8 py-3 bg-blue-500 text-white rounded-lg font-bold text-lg hover:shadow-lg transition-shadow border border-gray-200">
              Post a Ride
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
            <Link to="/search" className="block w-full sm:w-auto px-8 py-3 bg-white text-gray-800 border border-gray-200 rounded-lg font-bold text-lg hover:shadow-lg transition-shadow">
              Browse Rides
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
