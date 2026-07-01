'use client';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Loader({ size = 'md', className = '' }: LoaderProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div
      className={`${sizeClasses[size]} border-4 border-muted border-t-primary rounded-full animate-spin ${className}`}
      role="status"
      aria-busy="true"
      aria-label="Loading"
    />
  );
}
