
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
      // Single wave configuration
      let wave = {
        y: p.height / 2,
        color: 'rgba(201, 170, 113, 0.4)', // Signal gold with transparency
        speed: 0.02,
        amplitude: 50,
        phase: 0
      };
      
      p.setup = () => {
        const canvas = p.createCanvas(container.offsetWidth, container.offsetHeight);
        canvas.parent(container);
        canvasRef.current = canvas;
      };
      
      p.draw = () => {
        p.clear(); // Clear the canvas each frame
        
        // Draw single wave
        p.stroke(wave.color);
        p.strokeWeight(4);
        p.noFill();
        
        p.beginShape();
        for (let x = 0; x <= p.width; x += 10) {
          const angle = (p.frameCount * wave.speed) + (x * 0.01) + wave.phase;
          const y = wave.y + p.sin(angle) * wave.amplitude;
          p.vertex(x, y);
        }
        p.endShape();
      };
      
      // Handle window resize
      p.windowResized = () => {
        if (container) {
          p.resizeCanvas(container.offsetWidth, container.offsetHeight);
          // Update wave position for new height
          wave.y = p.height / 2;
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
