'use client';

import { cn } from '@/lib/utils';
import { forwardRef, type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 disabled:pointer-events-none',
          variant === 'primary' && 'bg-[#082C4E] text-white hover:bg-[#082C4E]/90 shadow-lg shadow-[#082C4E]/15',
          variant === 'secondary' && 'bg-white text-[#082C4E] border border-[#E5E7EB] hover:border-[#16A34A]/50 hover:shadow-md',
          variant === 'outline' && 'border border-[#082C4E]/30 text-[#082C4E] hover:bg-[#082C4E]/5',
          variant === 'ghost' && 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]',
          variant === 'danger' && 'bg-[#DC2626] text-white hover:opacity-90',
          size === 'sm' && 'px-3 py-1.5 text-xs',
          size === 'md' && 'px-4 py-2.5 text-sm',
          size === 'lg' && 'px-6 py-3 text-base font-semibold',
          className
        )}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, type ButtonProps };
