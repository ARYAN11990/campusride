import { Link } from 'react-router-dom';
import { getAvatarColor, formatPrice } from '../utils/helpers';

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
    <div className="backdrop-blur-md bg-white/70 border border-gray-200 rounded-2xl p-5 shadow-md transition-all duration-300 group hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer">
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
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{dateStr}</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{ride.time}</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
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
    </div>
  );
};

export default RideCard;
