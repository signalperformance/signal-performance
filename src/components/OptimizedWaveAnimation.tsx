import React from 'react';

interface WaveAnimationProps {
  className?: string;
}

const OptimizedWaveAnimation: React.FC<WaveAnimationProps> = ({ className }) => {
  return (
    <div 
      className={`absolute inset-0 z-0 overflow-hidden ${className || ''}`}
      aria-hidden="true"
    >
      {/* CSS-only wave animation for better performance */}
      <svg 
        className="w-full h-full" 
        viewBox="0 0 1200 300" 
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,150 Q300,100 600,150 T1200,150 L1200,300 L0,300 Z"
          fill="rgba(201, 170, 113, 0.4)"
          className="animate-wave"
        />
      </svg>
      
      <style>{`
        @keyframes wave {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-wave {
          animation: wave 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default OptimizedWaveAnimation;