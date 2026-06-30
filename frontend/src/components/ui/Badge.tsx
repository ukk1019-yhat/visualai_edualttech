'use client';

import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
        variant === 'default' && 'bg-muted text-muted-foreground',
        variant === 'success' && 'bg-success/15 text-success',
        variant === 'warning' && 'bg-warning/15 text-warning',
        variant === 'danger' && 'bg-danger/15 text-danger',
        variant === 'info' && 'bg-primary/15 text-primary',
        variant === 'purple' && 'bg-[var(--neon-purple)]/15 text-[var(--neon-purple)]',
        className
      )}
    >
      {variant === 'success' && <div className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
