'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  icon?: ReactNode;
}

export default function EmptyState({
  title,
  description,
  action,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      {icon && (
        <div className="mb-5 w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground/40">
          {icon}
        </div>
      )}
      <h2 className="text-xl font-bold text-foreground tracking-tight mb-2">{title}</h2>
      {description && (
        <p className="text-sm text-muted-foreground/70 text-center mb-7 max-w-sm leading-relaxed">
          {description}
        </p>
      )}
      {action && (
        <>
          {action.href ? (
            <Link
              href={action.href}
              className="inline-flex items-center justify-center px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 transition-all"
            >
              {action.label}
            </Link>
          ) : (
            <button
              onClick={action.onClick}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 transition-all cursor-pointer border-none"
            >
              {action.label}
            </button>
          )}
        </>
      )}
    </div>
  );
}
