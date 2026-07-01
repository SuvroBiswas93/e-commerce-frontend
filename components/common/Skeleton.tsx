'use client';

interface SkeletonProps {
  variant?: 'card' | 'detail' | 'text';
  count?: number;
  className?: string;
}

export default function Skeleton({
  variant = 'card',
  count = 1,
  className = '',
}: SkeletonProps) {
  if (variant === 'card') {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="rounded-lg overflow-hidden">
            <div className="bg-muted h-64 w-full animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
              <div className="h-6 bg-muted rounded w-1/3 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'detail') {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="bg-muted h-96 rounded-lg animate-pulse" />
        <div className="space-y-4">
          <div className="h-8 bg-muted rounded animate-pulse w-2/3" />
          <div className="h-6 bg-muted rounded animate-pulse w-1/3" />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-4 bg-muted rounded animate-pulse" />
            ))}
          </div>
          <div className="h-10 bg-muted rounded animate-pulse w-1/3 mt-6" />
        </div>
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="h-4 bg-muted rounded animate-pulse"
            style={{
              width: i === count - 1 ? '80%' : '100%',
            }}
          />
        ))}
      </div>
    );
  }

  return null;
}
