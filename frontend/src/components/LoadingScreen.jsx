import React, { useState, useEffect } from 'react';

const LoadingScreen = ({ isDataLoading, onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const intervalTime = 40; // update very frequently for smoothness
    let currentProgress = 0;

    const timer = setInterval(() => {
      // Simulate real progress taking time
      // It slows down as it approaches 90%
      if (currentProgress < 90) {
        const remaining = 90 - currentProgress;
        // As remaining gets smaller, the increment gets smaller
        currentProgress += Math.max(0.1, remaining * 0.03); 
        if (currentProgress > 90) currentProgress = 90;
        setProgress(currentProgress);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isDataLoading) {
      // Jump to 100% since actual loading is done
      setProgress(100);

      // Wait exactly for the transit time to 100% to finish (approx ease-out time)
      const hideTimer = setTimeout(() => {
        onFinish();
      }, 800);

      return () => clearTimeout(hideTimer);
    }
  }, [isDataLoading, onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-sm transition-opacity duration-500">
      <div className="w-full max-w-xl px-6 flex flex-col items-center">
        {/* Startup Brand Header */}
        <div className="mb-14 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">
            Campus<span className="text-blue-600">Ride</span>
          </h1>
          <p className="text-sm sm:text-base font-medium text-gray-500 dark:text-gray-400 animate-pulse">
            {progress < 100 ? "Finding the perfect ride..." : "Let's hit the road!"}
          </p>
        </div>

        {/* Road and Animation Container */}
        <div className="relative w-full h-20 mb-6 px-4">
          
          {/* Destination Marker */}
          <div className="absolute right-0 bottom-4 text-blue-500/80 transform translate-x-2 translate-y-1">
             <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="opacity-80">
               <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
             </svg>
          </div>

          {/* Road */}
          <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full shadow-inner overflow-hidden">
            {/* Dashed Lane Markings */}
            <div 
              className="absolute inset-0 opacity-50"
              style={{
                backgroundImage: 'linear-gradient(to right, #9ca3af 50%, transparent 50%)',
                backgroundSize: '20px 2px'
              }}
            />
          </div>

          {/* Progress fill (blue line) */}
          <div 
            className="absolute bottom-0 left-0 h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all ease-out"
            style={{ 
              width: `${progress}%`,
              transitionDuration: progress === 100 ? '700ms' : '200ms'
            }}
          />

          {/* Moving Bike Icon */}
          <div 
            className="absolute bottom-2 z-20 transition-all ease-out"
            style={{ 
              left: `calc(${progress}% - 20px)`,
              transitionDuration: progress === 100 ? '700ms' : '200ms'
            }}
          >
            {/* Bike SVG with slight bounce while moving */}
            <div className={`text-blue-600 ${progress < 100 ? 'animate-[bounce_2s_ease-in-out_infinite]' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-md bg-white dark:bg-gray-900 rounded-full p-1 border-2 border-blue-100 dark:border-blue-900">
                <circle cx="5.5" cy="17.5" r="3.5" />
                <circle cx="18.5" cy="17.5" r="3.5" />
                <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2" />
              </svg>
            </div>
          </div>
        </div>

        {/* Progress Text */}
        <div className="text-sm font-bold text-gray-400 dark:text-gray-500 w-full text-right flex justify-between items-center transition-all duration-300">
           <span>0%</span>
           <span className={`${progress === 100 ? 'text-blue-500 scale-110 drop-shadow-sm' : ''} transition-all duration-300`}>
             {Math.floor(progress)}%
           </span>
        </div>

      </div>
    </div>
  );
};

export default LoadingScreen;
