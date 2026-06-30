'use client';

import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/ThemeProvider';
import {
  IconChart, IconZap, IconTarget, IconBook, IconWrench,
  IconBot, IconGamepad, IconPlug, IconTrending, IconMessage,
} from '@/components/ui/Icons';

const navItems: { label: string; href: string; icon: ReactNode }[] = [
  { label: 'Home', href: '/dashboard-page', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  { label: 'Learn AI', href: '/learn', icon: <IconBook size={20} /> },
  { label: 'AI Playground', href: '/playground/chat', icon: <IconZap size={20} /> },
  { label: 'Visualizations', href: '/visualizations', icon: <IconChart size={20} /> },
  { label: 'Agent Builder', href: '/agent-builder', icon: <IconWrench size={20} /> },
  { label: 'Models', href: '/models', icon: <IconBot size={20} /> },
  { label: 'API', href: '/api-page', icon: <IconPlug size={20} /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 z-30 w-64 bg-white border-r border-[#E5E7EB] flex-col">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 z-50 w-64 bg-white border-r border-[#E5E7EB] flex-col lg:hidden"
          >
            <SidebarContent pathname={pathname} mobile onClose={() => setMobileOpen(false)} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="flex-1 flex flex-col lg:ml-64 min-h-screen">
        {/* Topbar */}
        <TopBar onMenuClick={() => setMobileOpen(true)} />

        {/* Page content */}
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function SidebarContent({ pathname, mobile, onClose }: { pathname: string; mobile?: boolean; onClose?: () => void }) {
  return (
    <nav className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 h-16 shrink-0 border-b border-[#E5E7EB]">
        <Link href="/">
          <img src="/logo.svg" alt="EduAltTech" className="h-7" />
        </Link>
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={mobile ? onClose : undefined}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative group',
                isActive
                  ? 'bg-[#082C4E] text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
              )}
            >
              <span className={cn('shrink-0', isActive ? 'text-white' : 'text-[#64748B] group-hover:text-[#082C4E]')}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute right-2 w-1.5 h-1.5 rounded-full bg-[#16A34A]"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom */}
      <div className="p-4 border-t border-[#E5E7EB]">
        <Link
          href="/pricing"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Pricing
        </Link>
      </div>
    </nav>
  );
}

function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const { theme, toggle } = useTheme();

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB] flex items-center justify-between gap-4 px-4 lg:px-8 sticky top-0 z-20">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-[#F1F5F9] text-[#64748B]"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search AI concepts..."
            className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl pl-10 pr-4 py-2 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#082C4E]/30 focus:ring-1 focus:ring-[#082C4E]/20 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="p-2 rounded-lg hover:bg-[#F1F5F9] text-[#64748B] transition-colors"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          {theme === 'dark' ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-lg hover:bg-[#F1F5F9] text-[#64748B] transition-colors relative">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#16A34A]" />
        </button>

        {/* User */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#E5E7EB]">
          <div className="w-8 h-8 rounded-full bg-[#082C4E] flex items-center justify-center text-white text-xs font-semibold">U</div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-[#0F172A]">User</p>
            <p className="text-xs text-[#64748B]">Free plan</p>
          </div>
        </div>
      </div>
    </header>
  );
}
