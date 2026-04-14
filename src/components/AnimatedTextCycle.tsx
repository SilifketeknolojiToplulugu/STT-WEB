import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedTextCycleProps {
  words: string[];
  className?: string;
  interval?: number;
}

const AnimatedTextCycle: React.FC<AnimatedTextCycleProps> = ({
  words,
  className = "",
  interval = 3000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [width, setWidth] = useState<string>("auto");
  const measureRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (measureRef.current) {
      const elements = measureRef.current.children;
      if (elements.length > currentIndex) {
        const newWidth = elements[currentIndex].getBoundingClientRect().width;
        setWidth(`${newWidth}px`);
      }
    }
  }, [currentIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, interval);

    return () => clearInterval(timer);
  }, [interval, words.length]);

  const containerVariants = {
    hidden: { 
      y: -20,
      opacity: 0,
      filter: "blur(8px)"
    },
    visible: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)"
    },
    exit: {
      y: 20,
      opacity: 0,
      filter: "blur(8px)"
    }
  };

  return (
    <>
      <span
        ref={measureRef}
        className="absolute opacity-0 pointer-events-none whitespace-nowrap"
        aria-hidden="true"
      >
        {words.map((word, index) => (
          <span key={index} className={`inline-block font-bold ${className}`}>
            {word}
          </span>
        ))}
      </span>
      
      <motion.span
        className="inline-block overflow-hidden"
        style={{ width }}
        animate={{ width }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
          mass: 1.2,
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={currentIndex}
            className={`inline-block font-bold ${className}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.4 }}
            style={{ whiteSpace: "nowrap" }}
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </>
  );
};

export default AnimatedTextCycle;