import { useEffect, useRef, useState } from 'react';

interface OptimizedWaveAnimationProps {
  className?: string;
  height?: number;
  speed?: number;
  amplitude?: number;
  frequency?: number;
  color?: string;
}

export const OptimizedWaveAnimation = ({
  className = '',
  height = 200,
  speed = 0.02,
  amplitude = 50,
  frequency = 0.01,
  color = '#c9aa71'
}: OptimizedWaveAnimationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isInView, setIsInView] = useState(false);
  const observerRef = useRef<IntersectionObserver>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set up intersection observer for performance
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(canvas);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isInView) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    let width = canvas.offsetWidth;
    let canvasHeight = height;

    // Set canvas size
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      width = canvas.offsetWidth;
      canvas.width = width * dpr;
      canvas.height = canvasHeight * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = canvasHeight + 'px';
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();

    const animate = () => {
      if (!isInView) return;

      ctx.clearRect(0, 0, width, canvasHeight);
      
      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
      gradient.addColorStop(0, color + '40'); // 40 = 25% opacity
      gradient.addColorStop(1, color + '10'); // 10 = ~6% opacity
      
      ctx.fillStyle = gradient;
      ctx.strokeStyle = color + '80'; // 80 = 50% opacity
      ctx.lineWidth = 2;

      // Draw wave
      ctx.beginPath();
      ctx.moveTo(0, canvasHeight);
      
      for (let x = 0; x <= width; x += 4) { // Reduce density for performance
        const y = canvasHeight / 2 + Math.sin(x * frequency + time) * amplitude;
        if (x === 0) {
          ctx.lineTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.lineTo(width, canvasHeight);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      time += speed;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [isInView, height, speed, amplitude, frequency, color]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full ${className}`}
      style={{ height: `${height}px` }}
    />
  );
};

export default OptimizedWaveAnimation;