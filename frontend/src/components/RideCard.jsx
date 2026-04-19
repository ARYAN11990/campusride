import { Link } from 'react-router-dom';
import { getAvatarColor, formatPrice } from '../utils/helpers';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users } from 'lucide-react';

const RideCard = ({ ride }) => {
  const dateStr = new Date(ride.date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const driverName = ride.driver?.name || 'Unknown';
  const avatarStyle = getAvatarColor(driverName);
  const price = formatPrice(ride.price);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="backdrop-blur-md bg-white/70 border border-gray-200 rounded-2xl p-5 shadow-md transition-all duration-300 group hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer"
    >
      {/* Route with visual connection */}
      <div className="flex items-start gap-3 mb-4">
        <div className="flex flex-col items-center mt-1">
          <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/30"></div>
          <div className="w-0.5 h-8 bg-gradient-to-b from-emerald-400 to-primary-500 my-1"></div>
          <div className="w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-primary-500/30"></div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-gray-800 font-medium truncate">{ride.source}</p>
          <div className="h-8"></div>
          <p className="text-gray-800 font-medium truncate">{ride.destination}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-50 my-3"></div>

      {/* Info row */}
      <div className="flex items-center justify-between gap-2 text-sm mb-4">
        <div className="flex items-center gap-1.5 text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>{dateStr}</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-500">
          <Clock className="w-4 h-4" />
          <span>{ride.time}</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-500">
          <Users className="w-4 h-4" />
          <span>{ride.seatsAvailableText || `${ride.availableSeats} seats available`}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-800 text-xs font-semibold shadow-md"
            style={avatarStyle}
          >
            {driverName.charAt(0)}
          </div>
          <span className="text-sm text-gray-700">{driverName}</span>
        </div>
        <div className="flex items-center gap-3">
          {price.isFree ? (
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-bold border border-emerald-500/30 shadow-sm shadow-emerald-500/10">
              FREE
            </span>
          ) : (
            <span className="text-lg font-bold text-emerald-400">{price.text}</span>
          )}
          <Link
            to={`/ride/${ride._id}`}
            className="px-4 py-1.5 rounded-lg bg-blue-500/20 text-primary-300 text-sm font-medium hover:bg-blue-500/30 transition-colors"
          >
            View
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default RideCard;
