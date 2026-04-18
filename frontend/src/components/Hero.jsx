// import { Link } from 'react-router-dom';
// import { motion } from 'framer-motion';


// const Hero = ({ title, subtitle, image, buttons }) => {
//   return (
//     <div className="backdrop-blur-md bg-white/70 rounded-2xl overflow-hidden mb-10 border border-gray-200 shadow-lg">
//       <div className="flex flex-col md:flex-row items-stretch">
//         {/* Left Side: Content */}
//         <motion.div 
//           initial={{ opacity: 0, x: -50 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.8 }}
//           className="flex-1 py-16 px-6 md:px-12 flex flex-col justify-center text-center md:text-left"
//         >
//           <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
//             {title}
//           </h1>
//           <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto md:mx-0">
//             {subtitle}
//           </p>
//           {buttons && buttons.length > 0 && (
//             <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
//               {buttons.map((btn, idx) => (
//                 <motion.div
//                   key={idx}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   <Link
//                     to={btn.to}
//                     className={`block px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
//                       btn.primary
//                         ? 'bg-blue-500 text-white shadow-md hover:shadow-[0_0_15px_rgba(59,130,246,0.6)] border border-transparent'
//                         : 'bg-white text-gray-800 shadow-sm border border-gray-200 hover:shadow-[0_0_15px_rgba(0,0,0,0.1)]'
//                     }`}
//                   >
//                     {btn.text}
//                   </Link>
//                 </motion.div>
//               ))}
//             </div>
//           )}
//         </motion.div>

//         {/* Right Side: Image */}
//         <motion.div 
//           initial={{ opacity: 0, x: 50 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.8, delay: 0.2 }}
//           className="flex-1 w-full h-72 md:h-auto min-h-[300px] overflow-hidden"
//         >
//           <motion.img
//             animate={{ y: [0, -15, 0] }}
//             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
//             src={image || 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=800'}
//             alt="Hero Header"
//             className="w-full h-full object-cover object-center scale-105"
//           />
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default Hero;

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import heroImg from "../assets/ride.webp";   // 👈 ADD THIS

const Hero = ({ title, subtitle, image, buttons }) => {
  return (
    <div className="backdrop-blur-md bg-white/70 rounded-2xl overflow-hidden mb-10 border border-gray-200 shadow-lg">
      <div className="flex flex-col md:flex-row items-stretch">

        {/* Left Side: Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 py-16 px-6 md:px-12 flex flex-col justify-center text-center md:text-left"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
            {title}
          </h1>

          <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto md:mx-0">
            {subtitle}
          </p>

          {buttons && buttons.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              {buttons.map((btn, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={btn.to}
                    className={`block px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
                      btn.primary
                        ? 'bg-blue-500 text-white shadow-md hover:shadow-[0_0_15px_rgba(59,130,246,0.6)] border border-transparent'
                        : 'bg-white text-gray-800 shadow-sm border border-gray-200 hover:shadow-[0_0_15px_rgba(0,0,0,0.1)]'
                    }`}
                  >
                    {btn.text}
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Right Side: Image */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 w-full h-72 md:h-auto min-h-[300px] overflow-hidden"
        >
          <motion.img
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            src={image || heroImg}   // 👈 CHANGE HERE
            alt="Hero Header"
            className="w-full h-full object-cover object-center scale-105"
          />
        </motion.div>

      </div>
    </div>
  );
};

export default Hero;