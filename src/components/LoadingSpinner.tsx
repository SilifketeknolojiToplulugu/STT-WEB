import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'white' | 'yellow' | 'gray';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'white',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const colorClasses = {
    white: 'border-white',
    yellow: 'border-yellow-400',
    gray: 'border-gray-400'
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
      className={`${sizeClasses[size]} ${className}`}
    >
      <div className={`w-full h-full rounded-full border-2 border-t-transparent ${colorClasses[color]} border-opacity-30`}></div>
    </motion.div>
  );
};

// Loading overlay component
export const LoadingOverlay: React.FC<{ isVisible: boolean; message?: string }> = ({
  isVisible,
  message = 'Yükleniyor...'
}) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-gradient-to-br from-black/90 via-black/95 to-black/90 backdrop-blur-md
                   rounded-3xl p-8 border border-yellow-400/30 shadow-2xl text-center"
      >
        <LoadingSpinner size="lg" color="yellow" className="mx-auto mb-4" />
        <p className="text-white font-medium">{message}</p>
      </motion.div>
    </motion.div>
  );
};

// Skeleton loading component
export const SkeletonLoader: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <motion.div
      animate={{
        background: [
          'linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%)',
          'linear-gradient(90deg, rgba(255,255,255,0.2) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.2) 75%)',
          'linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%)'
        ]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={`bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg ${className}`}
    />
  );
};

export default LoadingSpinner;
