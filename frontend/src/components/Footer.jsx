import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
              C
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
              CampusRide
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/" className="text-gray-500 hover:text-gray-800 text-sm font-medium transition-colors">
              Home
            </Link>
            <Link to="/search" className="text-gray-500 hover:text-gray-800 text-sm font-medium transition-colors">
              Rides
            </Link>
            <a href="#" className="text-gray-500 hover:text-gray-800 text-sm font-medium transition-colors">
              Contact
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-400">
            &copy; 2026 CampusRide. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
