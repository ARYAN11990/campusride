import rideImg from "../assets/ride.webp";
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import RideCard from '../components/RideCard';
import Hero from '../components/Hero';
import { useAuth } from '../context/AuthContext';
import SkeletonCard from '../components/SkeletonCard';
import { motion, useMotionValue, useTransform, useSpring, useInView, animate, AnimatePresence } from 'framer-motion';
import { Search, CheckSquare, Map, Car, Users as UsersIcon } from 'lucide-react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

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
        className="group backdrop-blur-md bg-white/70 rounded-xl shadow-lg p-6 text-center border border-gray-200 cursor-pointer h-full hover:shadow-black/40"
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
        // lottieSrc="https://lottie.host/7e0ee47a-241f-49ed-82dd-a8b417e2acbd/tBv0QzO0F5.json"
        // image="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1200"
        image={rideImg}
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
      <div className="mb-16 backdrop-blur-md bg-white/70 rounded-2xl shadow-lg border border-gray-200 p-8 md:p-12" data-aos="fade-up">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">How It Works</h2>
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 relative">
          {/* Desktop connecting line */}
          <div className="hidden md:block absolute top-6 left-12 right-12 h-1 bg-blue-50 z-0"></div>

          <div className="flex-1 w-full text-center relative z-10 flex flex-row md:flex-col items-center gap-4 group cursor-default">
            <motion.div whileHover={{ scale: 1.1, rotate: [-5, 5, 0] }} transition={{ duration: 0.3 }} className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xl shadow-md mb-0 md:mb-4 transition-colors duration-300 group-hover:bg-indigo-500 group-hover:shadow-indigo-500/40">
              <UsersIcon size={24} />
            </motion.div>
            <div className="text-left md:text-center">
              <h3 className="text-lg font-semibold text-gray-800 transition-colors duration-300 group-hover:text-blue-500">Register/Login</h3>
              <p className="text-sm text-gray-500 mt-1">Create your secure student account</p>
            </div>
          </div>
          <div className="flex-1 w-full text-center relative z-10 flex flex-row md:flex-col items-center gap-4 group cursor-default">
            <motion.div whileHover={{ scale: 1.1, rotate: [-5, 5, 0] }} transition={{ duration: 0.3 }} className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xl shadow-md mb-0 md:mb-4 transition-colors duration-300 group-hover:bg-indigo-500 group-hover:shadow-indigo-500/40">
              <Search size={22} strokeWidth={2.5} />
            </motion.div>
            <div className="text-left md:text-center">
              <h3 className="text-lg font-semibold text-gray-800 transition-colors duration-300 group-hover:text-blue-500">Post or Search</h3>
              <p className="text-sm text-gray-500 mt-1">Find a route or offer empty seats</p>
            </div>
          </div>
          <div className="flex-1 w-full text-center relative z-10 flex flex-row md:flex-col items-center gap-4 group cursor-default">
            <motion.div whileHover={{ scale: 1.1, rotate: [-5, 5, 0] }} transition={{ duration: 0.3 }} className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xl shadow-md mb-0 md:mb-4 transition-colors duration-300 group-hover:bg-indigo-500 group-hover:shadow-indigo-500/40">
              <CheckSquare size={22} strokeWidth={2.5} />
            </motion.div>
            <div className="text-left md:text-center">
              <h3 className="text-lg font-semibold text-gray-800 transition-colors duration-300 group-hover:text-blue-500">Book Instantly</h3>
              <p className="text-sm text-gray-500 mt-1">Reserve your seat securely</p>
            </div>
          </div>
          <div className="flex-1 w-full text-center relative z-10 flex flex-row md:flex-col items-center gap-4 group cursor-default">
            <motion.div whileHover={{ scale: 1.1, rotate: [-5, 5, 0] }} transition={{ duration: 0.3 }} className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xl shadow-md mb-0 md:mb-4 transition-colors duration-300 group-hover:bg-indigo-500 group-hover:shadow-indigo-500/40">
              <Car size={24} strokeWidth={2.2} />
            </motion.div>
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

      {/* SECTION 3: TESTIMONIALS */}
      <div className="mb-16 relative overflow-hidden">
        {/* Floating ambient blobs */}
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-blue-200/25 blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ x: [0, -35, 0], y: [0, 40, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-indigo-200/20 blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ x: [0, 25, 0], y: [0, 25, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 6 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-purple-200/15 blur-3xl pointer-events-none"
        />

        {/* Heading */}
        <div className="text-center mb-12 relative z-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">What Your Fellow Students Say</h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-blue-400 rounded-full" />
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-blue-400 rounded-full" />
          </div>
        </div>

        {/* Cards Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.15 } }
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          {[
            {
              name: "Rahul Mehta",
              role: "3rd Year, Mechanical",
              review: "CampusRide saved me so much money on my weekend trips to the city. Highly recommended for every hostel student!",
              rating: 5,
              color: "from-blue-500 to-indigo-500",
              bg: "bg-blue-50",
            },
            {
              name: "Sneha Patel",
              role: "Final Year, IT",
              review: "As a female student, safety was my priority. Knowing that I'm riding with verified college mates makes it 100% stress-free.",
              rating: 5,
              color: "from-purple-500 to-pink-500",
              bg: "bg-purple-50",
            },
            {
              name: "Aryan Shah",
              role: "2nd Year, Civil",
              review: "Found a regular carpool partner through this app. The interface is smooth and the booking process is seamless.",
              rating: 4.5,
              color: "from-emerald-500 to-teal-500",
              bg: "bg-emerald-50",
            },
            {
              name: "Drashti Vora",
              role: "1st Year, EC",
              review: "I used to wait hours for the bus. Now, I just check CampusRide and reach my lectures on time. Pure life-saver!",
              rating: 5,
              color: "from-amber-500 to-orange-500",
              bg: "bg-amber-50",
            },
          ].map((t, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
              }}
              whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.10)" }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="backdrop-blur-md bg-white/80 border border-slate-100 rounded-2xl p-6 shadow-md flex flex-col gap-4 cursor-default"
            >
              {/* Stars */}
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => {
                  const isHalf = t.rating === s - 0.5;
                  const isFull = t.rating >= s;
                  return isFull ? (
                    <AiFillStar key={s} className="text-amber-400 w-4 h-4" />
                  ) : isHalf ? (
                    <span key={s} className="relative inline-block w-4 h-4">
                      <AiOutlineStar className="absolute text-amber-200 w-4 h-4" />
                      <AiFillStar className="absolute text-amber-400 w-4 h-4" style={{ clipPath: "inset(0 50% 0 0)" }} />
                    </span>
                  ) : (
                    <AiOutlineStar key={s} className="text-amber-200 w-4 h-4" />
                  );
                })}
                <span className="ml-1 text-xs text-gray-400 font-medium">{t.rating}</span>
              </div>

              {/* Review Text */}
              <p className="text-gray-600 text-sm leading-relaxed flex-1">"{t.review}"</p>

              {/* Divider */}
              <div className={`h-px w-full bg-gradient-to-r ${t.color} opacity-20 rounded-full`} />

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-base shadow-md flex-shrink-0`}>
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-gray-800 font-semibold text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* SECTION 4: RECENT RIDES */}

      <div className="mb-16" data-aos="fade-up">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Recent Rides</h2>
          <Link to="/search" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : rides.length > 0 ? (
          <motion.div 
            layout 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            initial="hidden"
            animate="show"
          >
            <AnimatePresence>
              {rides.slice(0, 6).map((ride) => (
                <RideCard key={ride._id} ride={ride} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="backdrop-blur-md bg-white/70 rounded-2xl p-12 text-center border border-gray-200 shadow-lg flex flex-col items-center">
            <motion.div 
              animate={{ y: [-10, 0, -10] }} 
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} 
              className="text-gray-400 mb-6 drop-shadow-md"
            >
              <Car size={80} strokeWidth={1} />
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No rides available</h3>
            <p className="text-gray-500 mb-6">Be the first to post a ride!</p>
            {user && (
              <Link to="/post-ride" className="inline-block px-6 py-3 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-700 transition-colors">
                Post a Ride
              </Link>
            )}
          </div>
        )}
      </div>

      {/* SECTION 4: CALL TO ACTION */}
      <div className="backdrop-blur-md bg-white/70 rounded-2xl p-12 text-center shadow-lg border border-gray-200 mb-8" data-aos="fade-up">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Ready to Share Your Ride?</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
          Join the fastest growing campus transportation network. Whether you have an empty seat or need a lift, CampusRide is here.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <motion.div whileHover={{ scale: 1.03, boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
            <Link to="/post-ride" className="block w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 hover:shadow-lg transition-all border border-blue-600">
              Post a Ride
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03, boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
            <Link to="/search" className="block w-full sm:w-auto px-8 py-3 bg-gray-200 text-black border border-gray-300 rounded-lg font-bold text-lg hover:bg-gray-300 hover:shadow-lg transition-all">
              Browse Rides
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
