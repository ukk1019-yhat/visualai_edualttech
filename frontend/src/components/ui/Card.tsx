import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function GlassCard({ children, className, hover, onClick }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-2xl border border-[#E5E7EB] shadow-sm',
        hover && 'cursor-pointer card-hover',
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function CardHeader({ title, description, action, className }: CardHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4 p-6 pb-0', className)}>
      <div className="space-y-1">
        <h3 className="font-semibold text-[#0F172A]">{title}</h3>
        {description && <p className="text-sm text-[#64748B]">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function CardContent({ children, className, style }: CardContentProps) {
  return <div className={cn('p-6', className)} style={style}>{children}</div>;
}
