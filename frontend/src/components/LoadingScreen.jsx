import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function LoadingScreen({ onLoadingComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 2800; // 2.8 seconds for smooth progression

    const animationInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progressPercentage = Math.min((elapsed / duration) * 100, 100);

      setProgress(progressPercentage);

      if (progressPercentage >= 100) {
        clearInterval(animationInterval);
        setTimeout(() => onLoadingComplete(), 300);
      }
    }, 16); // ~60fps

    return () => clearInterval(animationInterval);
  }, [onLoadingComplete]);

  const containerVariants = {
    initial: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.5 } },
  };

  const logoVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const textVariants = {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.4, duration: 0.6 },
    },
  };

  const progressVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { delay: 0.8, duration: 0.6 },
    },
  };

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-b from-primary-900 via-dark to-primary-900 flex items-center justify-center z-50"
      variants={containerVariants}
      initial="initial"
      exit="exit"
    >
      <div className="w-full max-w-3xl px-4 text-center">
        {/* Logo/Badge */}
        <motion.div
          className="mb-8 flex justify-center"
          variants={logoVariants}
          initial="initial"
          animate="animate"
        >
          <div className="w-24 h-24 rounded-full border-2 border-primary-500 flex items-center justify-center relative">
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary-400 border-r-primary-400"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            <span className="text-4xl font-bold text-primary-400">DY</span>
          </div>
        </motion.div>

        {/* Main Title */}
        <motion.div variants={textVariants} initial="initial" animate="animate">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
            Devansh Yadav
          </h1>
          <p className="text-primary-400 text-base sm:text-lg uppercase tracking-wider sm:tracking-widest mb-8">
            Full Stack Developer Portfolio
          </p>
        </motion.div>

        {/* Progress Section */}
        <motion.div
          className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto"
          variants={progressVariants}
          initial="initial"
          animate="animate"
        >
          <div className="mb-6">
            <p className="text-gray-400 text-sm uppercase tracking-wider mb-4">
              Preparing Content
            </p>

            {/* Progress Bar */}
            <div className="relative h-1 bg-primary-500/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ ease: 'easeOut' }}
              />
            </div>

            {/* Progress Numbers */}
            <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
              <span>0</span>
              <span className="text-primary-400 font-semibold">
                {Math.round(progress)}%
              </span>
              <span>100</span>
            </div>
          </div>

          {/* Loading Text */}
          <p className="text-gray-500 text-sm">
            {progress < 30
              ? 'Initializing...'
              : progress < 60
              ? 'Loading resources...'
              : progress < 90
              ? 'Almost ready...'
              : 'Finalizing...'}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
