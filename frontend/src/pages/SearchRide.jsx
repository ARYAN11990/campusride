import { useState, useEffect } from 'react';
import API from '../services/api';
import RideCard from '../components/RideCard';
import Hero from '../components/Hero';
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
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">From</label>
            <input
              type="text"
              name="source"
              value={filters.source}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-800 placeholder-slate-500 focus:border-blue-500"
              placeholder="e.g. Ahmedabad"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">To</label>
            <input
              type="text"
              name="destination"
              value={filters.destination}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-800 placeholder-slate-500 focus:border-blue-500"
              placeholder="e.g. Mumbai"
            />
          </div>
          <div className="md:w-48">
            <label className="block text-xs text-gray-500 mb-1">Date <span className="text-gray-400">(optional)</span></label>
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-800 focus:border-blue-500"
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="flex-1 md:flex-none px-8 py-3 text-white font-semibold btn-transition"
            >
              Search
            </button>
            {(filters.source || filters.destination || filters.date) && (
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors"
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
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : searched ? (
        rides.length > 0 ? (
          <>
            <p className="text-sm text-gray-500 mb-4">{rides.length} ride{rides.length !== 1 ? 's' : ''} found</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {rides.map((ride) => (
                <RideCard key={ride._id} ride={ride} />
              ))}
            </div>
          </>
        ) : (
          <div className="glass rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No rides found</h3>
            <p className="text-gray-500">Try different keywords or remove the date filter</p>
          </div>
        )
      ) : (
        <div className="glass rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4">🗺️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Start searching</h3>
          <p className="text-gray-500">Enter your source, destination, or date to find rides</p>
        </div>
      )}
    </div>
  );
};

export default SearchRide;
