import React, { useEffect, useRef } from "react";

interface MatrixRainProps {
  fontSize?: number;
  color?: string;
  characters?: string;
  fadeOpacity?: number;
  speed?: number;
}

const MatrixRain: React.FC<MatrixRainProps> = ({
  fontSize = 16,
  color = 'rgba(59, 130, 246, 0.4)',
  characters = '01',
  fadeOpacity = 0.08,
  speed = 0.6
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const chars = characters.split('');
    const drops: number[] = [];
    const columnCount = Math.floor(canvas.width / fontSize);

    for (let i = 0; i < columnCount; i++) {
      drops[i] = Math.random() * -100;
    }

    const draw = () => {
      ctx.fillStyle = `rgba(0, 0, 0, ${fadeOpacity})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = color;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += speed;
      }
    };

    const animationDelay = Math.max(24, 33 / Math.max(speed, 0.1));
    let interval: number | null = null;

    const startAnimation = () => {
      if (interval !== null) return;
      interval = window.setInterval(draw, animationDelay);
    };

    const stopAnimation = () => {
      if (interval !== null) {
        clearInterval(interval);
        interval = null;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const handleMotionChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        stopAnimation();
      } else {
        stopAnimation();
        startAnimation();
      }
    };

    if (mediaQuery.matches) {
      stopAnimation();
    } else {
      startAnimation();
    }

    mediaQuery.addEventListener('change', handleMotionChange);

    return () => {
      stopAnimation();
      mediaQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [fontSize, color, characters, fadeOpacity, speed]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10"
    />
  );
};

export default MatrixRain;
