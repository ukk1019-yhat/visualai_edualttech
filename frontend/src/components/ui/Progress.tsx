'use client';

import { cn } from '@/lib/utils';

interface ProgressProps {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  className,
  showLabel,
}: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn('space-y-1', className)}>
      <div
        className={cn(
          'rounded-full bg-muted overflow-hidden',
          size === 'sm' ? 'h-1.5' : 'h-2.5'
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            variant === 'default' && 'bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)]',
            variant === 'success' && 'bg-success',
            variant === 'warning' && 'bg-warning',
            variant === 'danger' && 'bg-danger'
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-muted-foreground font-mono">{pct.toFixed(0)}%</p>
      )}
    </div>
  );
}

export function StepProgress({
  steps,
  current,
}: {
  steps: { id: string; label: string }[];
  current: number;
}) {
  return (
    <div className="space-y-1">
      {steps.map((step, i) => (
        <div
          key={step.id}
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all',
            i === current && 'bg-primary/10 text-primary font-medium',
            i < current && 'text-muted-foreground',
            i > current && 'text-muted-foreground/40'
          )}
        >
          <div
            className={cn(
              'w-2 h-2 rounded-full shrink-0',
              i === current && 'bg-[var(--neon-blue)] animate-pulse-glow',
              i < current && 'bg-[var(--neon-green)]',
              i > current && 'bg-muted-foreground/30'
            )}
          />
          {i < current && <span className="text-[var(--neon-green)]">✓</span>}
          {step.label}
        </div>
      ))}
    </div>
  );
}
