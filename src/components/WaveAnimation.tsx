
import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

interface WaveAnimationProps {
  className?: string;
}

const WaveAnimation: React.FC<WaveAnimationProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<p5.Renderer | null>(null);
  const p5Ref = useRef<p5 | null>(null);
  
  useEffect(() => {
    // Skip if running on server or if already initialized
    if (typeof window === 'undefined' || p5Ref.current) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    // Create new p5 instance
    const sketch = (p: p5) => {
      let waves: Array<{
        y: number;
        color: string;
        speed: number;
        amplitude: number;
        phase: number;
      }> = [];
      
      // Signal Performance brand colors
      const colors = [
        'rgba(201, 170, 113, 0.5)',  // Signal gold (with transparency)
        'rgba(66, 85, 99, 0.3)',     // Signal charcoal (with transparency)
        'rgba(201, 170, 113, 0.3)',  // Signal gold variant
        'rgba(66, 85, 99, 0.2)',     // Signal charcoal variant
        'rgba(201, 170, 113, 0.2)',  // Signal gold variant
      ];
      
      p.setup = () => {
        const canvas = p.createCanvas(container.offsetWidth, container.offsetHeight);
        canvas.parent(container);
        canvasRef.current = canvas;
        
        // Initialize waves with different properties
        for (let i = 0; i < colors.length; i++) {
          waves.push({
            y: p.height * (i + 1) / 6,
            color: colors[i],
            speed: p.random(0.01, 0.03),
            amplitude: p.random(30, 70),
            phase: p.random(0, p.TWO_PI)
          });
        }
      };
      
      p.draw = () => {
        p.clear(); // Clear the canvas each frame
        
        waves.forEach(wave => {
          p.stroke(wave.color);
          p.strokeWeight(3);
          p.noFill();
          
          p.beginShape();
          for (let x = 0; x <= p.width; x += 15) {
            const angle = (p.frameCount * wave.speed) + (x * 0.01) + wave.phase;
            const y = wave.y + p.sin(angle) * wave.amplitude;
            p.vertex(x, y);
          }
          p.endShape();
        });
      };
      
      // Handle window resize
      p.windowResized = () => {
        if (container) {
          p.resizeCanvas(container.offsetWidth, container.offsetHeight);
          
          // Adjust wave positions for new height
          waves.forEach((wave, i) => {
            wave.y = p.height * (i + 1) / 6;
          });
        }
      };
    };
    
    p5Ref.current = new p5(sketch);
    
    // Cleanup function
    return () => {
      if (p5Ref.current) {
        p5Ref.current.remove();
        p5Ref.current = null;
      }
    };
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 z-0 overflow-hidden ${className || ''}`}
      aria-hidden="true"
    />
  );
};

export default WaveAnimation;
