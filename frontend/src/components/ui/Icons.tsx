'use client';

import { cn } from '@/lib/utils';
import { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({ children, size = 16, className, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('shrink-0', className)}
      {...props}
    >
      {children}
    </svg>
  );
}

export function IconReceive({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <path d="M22 12h-6l-2 3H10l-2-3H2" />
      <path d="M2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6" />
      <path d="M12 2v12" />
      <path d="M9 11l3 3 3-3" />
    </Icon>
  );
}

export function IconTokens({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <path d="M4 7V4h16v3" />
      <path d="M9 20h6" />
      <path d="M12 4v16" />
      <path d="M4 11h16" />
      <path d="M4 15h16" />
    </Icon>
  );
}

export function IconEmbed({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <circle cx="12" cy="12" r="10" opacity="0.3" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
    </Icon>
  );
}

export function IconZap({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </Icon>
  );
}

export function IconSparkles({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <path d="M18 15l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" />
    </Icon>
  );
}

export function IconBrain({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <path d="M12 2a7 7 0 0 1 7 7c0 2.3-1.2 4.3-3 5.5V21H8v-6.5A7 7 0 0 1 5 9a7 7 0 0 1 7-7z" />
      <path d="M9 12h6" />
      <path d="M9 16h6" />
    </Icon>
  );
}

export function IconShield({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <path d="M12 2l7 4v5c0 5-3.5 9.7-7 11-3.5-1.3-7-6-7-11V6l7-4z" />
      <path d="M9 12l2 2 4-4" />
    </Icon>
  );
}

export function IconTarget({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </Icon>
  );
}

export function IconSearch({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </Icon>
  );
}

export function IconChart({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <line x1="4" y1="20" x2="4" y2="10" />
      <line x1="10" y1="20" x2="10" y2="4" />
      <line x1="16" y1="20" x2="16" y2="12" />
      <line x1="20" y1="20" x2="20" y2="8" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </Icon>
  );
}

export function IconClock({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </Icon>
  );
}

export function IconWrench({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a1 1 0 0 0 0-1.4l-1.6-1.6a1 1 0 0 0-1.4 0l-3.8 3.8z" />
      <path d="M9.5 14.5L2.3 21.7a1 1 0 0 0 0 1.4l.6.6a1 1 0 0 0 1.4 0l7.2-7.2" />
      <path d="M9.5 14.5l3.5-3.5" />
    </Icon>
  );
}

export function IconWave({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <path d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
      <path d="M2 16c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
      <path d="M2 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
    </Icon>
  );
}

export function IconFire({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <path d="M12 2C9 6 8 9 8 12c0 3 2 5 4 5s4-2 4-5c0-3-1-6-4-10z" />
      <path d="M12 17c-2 0-4-1-4-4 0-3 1-6 4-10 3 4 4 7 4 10 0 3-2 4-4 4z" />
      <path d="M8 17c0 2 2 3 4 3s4-1 4-3" />
    </Icon>
  );
}

export function IconCode({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </Icon>
  );
}

export function IconNote({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </Icon>
  );
}

export function IconClipboard({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="9" y1="9" x2="15" y2="9" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="17" x2="13" y2="17" />
    </Icon>
  );
}

export function IconCheck({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <polyline points="20 6 9 17 4 12" />
    </Icon>
  );
}

export function IconRocket({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <path d="M4.5 16.5c-1.5 1.5-2.5 5-2.5 5s3.5-1 5-2.5" />
      <path d="M15 3c-4 0-7 3-7 7 0 2 .5 3.5 1.5 4.5L15 19c3-3 3-9 0-12z" />
      <circle cx="12" cy="12" r="1.5" />
    </Icon>
  );
}

export function IconGem({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <polygon points="12 2 4 8 4 16 12 22 20 16 20 8 12 2" />
      <polyline points="4 8 12 12 20 8" />
      <line x1="12" y1="12" x2="12" y2="22" />
    </Icon>
  );
}

export function IconMoney({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </Icon>
  );
}

export function IconGamepad({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <rect x="2" y="6" width="20" height="12" rx="2" ry="2" />
      <circle cx="9" cy="10" r="1" />
      <circle cx="15" cy="10" r="1" />
      <line x1="9" y1="14" x2="15" y2="14" />
    </Icon>
  );
}

export function IconBalance({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <line x1="12" y1="2" x2="12" y2="22" />
      <path d="M2 12h20" />
      <path d="M6 6l6 6-6 6" />
      <path d="M18 6l-6 6 6 6" />
    </Icon>
  );
}

export function IconProvider({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" />
      <circle cx="12" cy="12" r="6" fill="currentColor" opacity="0.3" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </Icon>
  );
}

export function IconDollar({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </Icon>
  );
}

export function IconSnowflake({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="4.9" y1="4.9" x2="19.1" y2="19.1" />
      <line x1="19.1" y1="4.9" x2="4.9" y2="19.1" />
    </Icon>
  );
}

export function IconActivity({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </Icon>
  );
}

export function IconCursor({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
      <path d="M13 13l6 6" />
    </Icon>
  );
}

export function IconGlobe({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <circle cx="12" cy="12" r="10" />
      <ellipse cx="12" cy="12" rx="4" ry="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
    </Icon>
  );
}

export function IconMessage({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </Icon>
  );
}

export function IconDocument({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </Icon>
  );
}

export function IconBook({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <line x1="10" y1="2" x2="10" y2="10" />
      <line x1="14" y1="6" x2="14" y2="12" />
    </Icon>
  );
}

export function IconPlug({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <path d="M12 22v-5" />
      <path d="M9 8V2" />
      <path d="M15 8V2" />
      <path d="M18 8v5a6 6 0 0 1-6 6" />
      <path d="M6 8v5c0 1.7.7 3.3 1.8 4.4" />
    </Icon>
  );
}

export function IconTrending({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </Icon>
  );
}

export function IconBot({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <rect x="4" y="6" width="16" height="14" rx="3" ry="3" />
      <circle cx="9" cy="12" r="1" fill="currentColor" />
      <circle cx="15" cy="12" r="1" fill="currentColor" />
      <path d="M12 17c-2 0-3-1-3-2h6c0 1-1 2-3 2z" />
      <line x1="9" y1="2" x2="12" y2="6" />
      <line x1="15" y1="2" x2="12" y2="6" />
    </Icon>
  );
}
