import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'navy';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
        variant === 'default' && 'bg-[#F1F5F9] text-[#64748B]',
        variant === 'success' && 'bg-[#16A34A]/10 text-[#16A34A]',
        variant === 'warning' && 'bg-[#F59E0B]/10 text-[#F59E0B]',
        variant === 'danger' && 'bg-[#DC2626]/10 text-[#DC2626]',
        variant === 'info' && 'bg-[#082C4E]/10 text-[#082C4E]',
        variant === 'navy' && 'bg-[#082C4E] text-white',
        className
      )}
    >
      {variant === 'success' && <div className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
