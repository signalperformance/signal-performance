import { cn } from '@/lib/utils';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'text' | 'card' | 'image' | 'button';
  lines?: number;
}

export const SkeletonLoader = ({ 
  className, 
  variant = 'text', 
  lines = 1 
}: SkeletonLoaderProps) => {
  const baseClasses = "animate-pulse bg-muted rounded";

  const variantClasses = {
    text: "h-4",
    card: "h-32",
    image: "aspect-video",
    button: "h-10 w-24"
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn("space-y-2", className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              variantClasses.text,
              index === lines - 1 ? "w-3/4" : "w-full"
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div 
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )} 
    />
  );
};

export const SkeletonCard = ({ className }: { className?: string }) => (
  <div className={cn("space-y-4 p-6 border rounded-lg", className)}>
    <SkeletonLoader variant="text" className="w-1/2" />
    <SkeletonLoader variant="text" lines={3} />
    <SkeletonLoader variant="button" />
  </div>
);

export const SkeletonGrid = ({ 
  count = 3, 
  className 
}: { 
  count?: number; 
  className?: string; 
}) => (
  <div className={cn("grid gap-6", className)}>
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonCard key={index} />
    ))}
  </div>
);