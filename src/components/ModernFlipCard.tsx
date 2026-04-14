import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ModernFlipCardProps {
  title: string;
  description: string;
  imageUrl: string;
  detailedContent?: string;
  index: number;
  onCardClick: () => void;
}

const ModernFlipCard: React.FC<ModernFlipCardProps> = ({
  title,
  description,
  imageUrl,
  detailedContent,
  index,
  onCardClick
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: '50px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={elementRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="group perspective-1000 h-80"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ 
          duration: 0.8, 
          ease: [0.23, 1, 0.32, 1]
        }}
        className="relative w-full h-full preserve-3d cursor-pointer"
        onClick={onCardClick}
      >
        {/* Front Face */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <div className="glass-panel glass-border-accent w-full h-full rounded-2xl overflow-hidden shadow-2xl hover:shadow-yellow-400/20 transition-all duration-500">
            {/* Premium Background Image */}
            <div className="absolute inset-0 opacity-60 group-hover:opacity-80 transition-opacity duration-500">
              <img 
                src={imageUrl} 
                alt={title}
                className="w-full h-full object-cover transition-opacity duration-300"
                loading="lazy"
                decoding="async"
                onLoad={(e) => {
                  (e.target as HTMLImageElement).style.opacity = '1';
                }}
                style={{ opacity: 0 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/65 to-black/30" />
            </div>
            
            {/* Animated Border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400/0 via-yellow-400/20 to-yellow-400/0 p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="w-full h-full rounded-2xl bg-black/95" />
            </div>

            {/* Content */}
            <div className="relative z-10 p-8 h-full flex flex-col justify-between">
              <div className="space-y-6">
                {/* Title */}
                <h3 className="text-2xl font-bold text-white group-hover:text-yellow-300 transition-colors duration-300 tracking-wide font-['Space_Grotesk',_'Inter',_system-ui] drop-shadow-2xl [text-shadow:_0_2px_8px_rgba(0,0,0,0.8),_0_0_20px_rgba(255,215,0,0.3)] leading-tight">
                  {title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-white text-lg leading-relaxed group-hover:text-white transition-colors duration-300 font-medium drop-shadow-lg [text-shadow:_0_1px_4px_rgba(0,0,0,0.8),_0_0_12px_rgba(255,255,255,0.2)] tracking-wide">
                {description}
              </p>

              {/* Hover indicator */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-8 h-8 rounded-full bg-yellow-400/20 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <div className="glass-panel glass-border-accent w-full h-full rounded-2xl overflow-hidden shadow-2xl shadow-yellow-400/20">
            {/* Premium Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.1),transparent_50%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_40%,rgba(255,215,0,0.05)_50%,transparent_60%)]" />
            </div>

            {/* Animated Border */}
            <div className="absolute inset-0 rounded-2xl">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400/20 via-yellow-500/20 to-yellow-600/20 animate-pulse" />
            </div>

            {/* Content */}
            <div className="relative z-10 p-6 md:p-8 h-full flex flex-col justify-center text-center space-y-4 md:space-y-6">
              {/* Enhanced Title */}
              <h3 className="text-xl md:text-2xl font-bold text-white tracking-wide font-['Space_Grotesk',_'Inter',_system-ui] drop-shadow-2xl [text-shadow:_0_2px_8px_rgba(0,0,0,0.8),_0_0_25px_rgba(255,215,0,0.4)] leading-tight">
                {title}
              </h3>

              {/* Detailed Content */}
              <div className="space-y-4">
                <p className="text-white text-sm md:text-base leading-relaxed font-medium drop-shadow-lg [text-shadow:_0_1px_4px_rgba(0,0,0,0.6),_0_0_15px_rgba(255,215,0,0.3)] tracking-wide">
                  {detailedContent || description}
                </p>
                
                {/* Feature highlights */}
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3].map((dot) => (
                    <motion.div
                      key={dot}
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        delay: dot * 0.2
                      }}
                      className="w-2 h-2 bg-yellow-400 rounded-full"
                    />
                  ))}
                </div>
              </div>

              {/* Action hint */}
              <div className="text-xs md:text-sm text-yellow-400 font-semibold tracking-wide drop-shadow-md [text-shadow:_0_1px_3px_rgba(0,0,0,0.6),_0_0_10px_rgba(255,215,0,0.4)]">
                Detaylar için tıklayın
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ModernFlipCard;
