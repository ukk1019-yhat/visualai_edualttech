'use client';

import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { IconMessage, IconTokens, IconEmbed, IconTarget, IconClock, IconDocument, IconBot, IconChart, IconWrench, IconGamepad, IconBook, IconPlug, IconTrending } from '@/components/ui/Icons';

const navGroups: { section: string; items: { label: string; href: string; icon: ReactNode }[] }[] = [
  {
    section: 'AI Playground',
    items: [
      { label: 'Chat', href: '/playground/chat', icon: <IconMessage size={18} /> },
      { label: 'Token Viewer', href: '/playground/token-viewer', icon: <IconTokens size={18} /> },
      { label: 'Embeddings', href: '/playground/embeddings', icon: <IconEmbed size={18} /> },
      { label: 'Attention', href: '/playground/attention', icon: <IconTarget size={18} /> },
      { label: 'Reasoning', href: '/playground/reasoning', icon: <IconClock size={18} /> },
      { label: 'Output', href: '/playground/output', icon: <IconDocument size={18} /> },
    ],
  },
  {
    section: 'AI Models',
    items: [
      { label: 'Models', href: '/models', icon: <IconBot size={18} /> },
    ],
  },
  {
    section: 'Tools',
    items: [
      { label: 'Visualizations', href: '/visualizations', icon: <IconChart size={18} /> },
      { label: 'Agent Builder', href: '/agent-builder', icon: <IconWrench size={18} /> },
      { label: 'AI Simulator', href: '/simulator', icon: <IconGamepad size={18} /> },
      { label: 'Learn AI', href: '/learn', icon: <IconBook size={18} /> },
      { label: 'API', href: '/api-page', icon: <IconPlug size={18} /> },
      { label: 'Dashboard', href: '/dashboard-page', icon: <IconTrending size={18} /> },
    ],
  },
];

const models = [
  { value: 'nemotron-3-ultra', label: 'Nemotron 3 Ultra' },
  { value: 'gemma-4-31b-it', label: 'Gemma 4 31B' },
  { value: 'gemma-4-26b-a4b-it', label: 'Gemma 4 26B' },
  { value: 'gemma-3-12b-it', label: 'Gemma 3 12B' },
  { value: 'llama-3.1-70b', label: 'Llama 3.1 70B' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 1024) setCollapsed(true);
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const sidebarContent = (
    <nav className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 h-16 shrink-0 border-b border-border">
        <div className="w-3 h-3 rounded-full bg-[var(--neon-blue)] shadow-[0_0_8px_var(--neon-blue)] shrink-0" />
        {!collapsed && <span className="font-bold text-lg tracking-tight">NeuralFlow</span>}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-6 scrollbar-thin">
        {navGroups.map((group) => (
          <div key={group.section}>
            {!collapsed && (
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-2">
                {group.section}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
                      isActive
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-sidebar-foreground hover:bg-sidebar-hover hover:text-foreground'
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <span className="shrink-0 text-foreground">{item.icon}</span>
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -8 }}
                          className="truncate"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:flex fixed left-0 top-0 bottom-0 z-30 glass border-r border-border flex-col transition-all duration-300',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 z-50 w-64 glass border-r border-border flex flex-col lg:hidden"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className={cn('flex-1 flex flex-col transition-all duration-300', 'lg:ml-64', collapsed && 'lg:ml-16')}>
        {/* Top bar */}
        <header className="h-16 glass border-b border-border flex items-center justify-between gap-4 px-4 lg:px-6 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-sidebar-hover text-muted-foreground"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-1.5 rounded-lg hover:bg-sidebar-hover text-muted-foreground transition-colors"
            >
              <svg className={cn('w-4 h-4 transition-transform', collapsed && 'rotate-180')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-[var(--neon-green)] animate-pulse-glow" />
              <span className="hidden sm:inline">All systems operational</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              className="bg-muted border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-primary max-w-[140px] sm:max-w-none"
              defaultValue="nemotron-3-ultra"
            >
              {models.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
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
