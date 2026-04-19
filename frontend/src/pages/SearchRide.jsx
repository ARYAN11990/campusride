import { useState, useEffect } from 'react';
import API from '../services/api';
import RideCard from '../components/RideCard';
import Hero from '../components/Hero';
import SkeletonCard from '../components/SkeletonCard';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchX, MapPinned } from 'lucide-react';
import searchImg from "../assets/searchride.webp";

const SearchRide = () => {
  const [filters, setFilters] = useState({
    source: '',
    destination: '',
    date: '',
  });
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Auto-load all rides on mount (show everything initially)
  useEffect(() => {
    loadAllRides();
  }, []);

  const loadAllRides = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/rides/search');
      setRides(data);
      setSearched(true);
    } catch (error) {
      console.error('Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams();
      // Trim whitespace before sending
      const source = filters.source.trim();
      const destination = filters.destination.trim();
      const date = filters.date.trim();

      if (source) params.append('source', source);
      if (destination) params.append('destination', destination);
      if (date) params.append('date', date);

      const { data } = await API.get(`/rides/search?${params.toString()}`);
      setRides(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFilters({ source: '', destination: '', date: '' });
    loadAllRides();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Hero
        title="Find the Perfect Ride 🚗"
        subtitle="Search thousands of verified student routes. Save money, travel safely, and make new friends on your campus journeys."
        image={searchImg}
      />

      {/* Search Bar */}
      <div className="glass rounded-2xl p-6 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              name="source"
              id="source"
              value={filters.source}
              onChange={handleChange}
              className="peer w-full px-4 pt-5 pb-2 rounded-xl bg-white border border-gray-200 text-gray-800 placeholder-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
              placeholder="From"
            />
            <label htmlFor="source" className="absolute left-4 top-2 text-xs text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-blue-500 pointer-events-none">
              From
            </label>
          </div>
          <div className="flex-1 relative">
            <input
              type="text"
              name="destination"
              id="destination"
              value={filters.destination}
              onChange={handleChange}
              className="peer w-full px-4 pt-5 pb-2 rounded-xl bg-white border border-gray-200 text-gray-800 placeholder-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
              placeholder="To"
            />
            <label htmlFor="destination" className="absolute left-4 top-2 text-xs text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-blue-500 pointer-events-none">
              To
            </label>
          </div>
          <div className="md:w-48 relative">
            <input
              type="date"
              name="date"
              id="date"
              value={filters.date}
              onChange={handleChange}
              className="peer w-full px-4 pt-5 pb-2 rounded-xl bg-white border border-gray-200 text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
              placeholder="Date"
            />
            <label htmlFor="date" className="absolute left-4 top-1.5 text-xs text-gray-500 transition-all peer-focus:text-blue-500 pointer-events-none">
              Date <span className="text-gray-400">(optional)</span>
            </label>
          </div>
          <div className="flex items-end gap-2">
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="flex-1 md:flex-none px-8 py-3 bg-blue-600 rounded-lg text-white font-semibold transition-all hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Searching...
                </>
              ) : (
                'Search'
              )}
            </motion.button>
            {(filters.source || filters.destination || filters.date) && (
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-3 rounded-lg bg-gray-200 text-black hover:bg-gray-300 transition-colors"
                title="Clear filters"
              >
                ✕
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : searched ? (
        rides.length > 0 ? (
          <>
            <p className="text-sm text-gray-500 mb-4">{rides.length} ride{rides.length !== 1 ? 's' : ''} found</p>
            <motion.div 
              layout 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
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
                {rides.map((ride) => (
                  <RideCard key={ride._id} ride={ride} />
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        ) : (
          <div className="backdrop-blur-md bg-white/70 rounded-2xl p-12 text-center border border-gray-200 shadow-lg flex flex-col items-center">
            <motion.div 
              animate={{ y: [-5, 5, -5] }} 
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} 
              className="text-gray-400 mb-6 drop-shadow-md bg-white p-6 rounded-full shadow-inner"
            >
              <SearchX size={64} strokeWidth={1.5} />
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No rides found</h3>
            <p className="text-gray-500">Try different keywords or remove the date filter</p>
          </div>
        )
      ) : (
        <div className="backdrop-blur-md bg-white/70 rounded-2xl p-12 text-center border border-gray-200 shadow-lg flex flex-col items-center">
            <motion.div 
              animate={{ y: [-5, 5, -5] }} 
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} 
              className="text-blue-400 mb-6 drop-shadow-md bg-white p-6 rounded-full shadow-inner"
            >
              <MapPinned size={64} strokeWidth={1.5} />
            </motion.div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Start searching</h3>
          <p className="text-gray-500">Enter your source, destination, or date to find rides</p>
        </div>
      )}
    </div>
  );
};

export default SearchRide;
