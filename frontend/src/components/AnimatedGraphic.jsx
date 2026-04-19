import { Player } from '@lottiefiles/react-lottie-player';
import { motion } from 'framer-motion';

const AnimatedGraphic = ({ src, altText, className, width = '100%', height = '100%', loop = true, autoplay = true }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`relative flex items-center justify-center ${className}`}
      style={{ width, height }}
      aria-label={altText}
    >
      <Player
        autoplay={autoplay}
        loop={loop}
        src={src}
        style={{ height: '100%', width: '100%', objectFit: 'contain' }}
      >
      </Player>
    </motion.div>
  );
};

export default AnimatedGraphic;
