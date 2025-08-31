import { useState, useEffect } from 'react';

interface SlideshowImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

const SlideshowImage = ({ src, alt, className = '', style }: SlideshowImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Check if image is already in cache
    const img = new Image();
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setHasError(true);
    img.src = src;

    // If image loads immediately (from cache), setIsLoaded will be called
    if (img.complete && img.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [src]);

  if (hasError) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`} style={style}>
        <div className="text-gray-400 text-xs">Failed to load</div>
      </div>
    );
  }

  return (
    <div className={className} style={style}>
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-contain transition-opacity duration-200 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading="eager"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
          <div className="w-4 h-4 bg-gray-300 rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  );
};

export default SlideshowImage;