import { motion } from 'framer-motion';

const SkeletonCard = () => {
  return (
    <div className="backdrop-blur-md bg-white/70 border border-gray-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-start gap-4 mb-4">
        <div className="flex flex-col items-center mt-1">
          <div className="w-3 h-3 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="w-0.5 h-8 bg-gray-200 my-1 animate-pulse"></div>
          <div className="w-3 h-3 rounded-full bg-gray-200 animate-pulse"></div>
        </div>
        <div className="flex-1 w-full space-y-4 pt-1">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
          <div className="h-8"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
        </div>
      </div>
      <div className="h-px bg-gray-100 my-4"></div>
      <div className="flex justify-between items-center gap-4 mb-5">
        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/4"></div>
        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/4"></div>
        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/4"></div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-16 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
