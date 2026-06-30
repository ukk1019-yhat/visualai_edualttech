'use client';

import { motion } from 'framer-motion';
import { GlassCard, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/Progress';
import { IconChart, IconTokens, IconZap, IconMoney } from '@/components/ui/Icons';
import { ReactNode } from 'react';

const stats: { label: string; value: string; change: string; positive: boolean; icon: ReactNode }[] = [
  { label: 'Total Requests', value: '12,847', change: '+23%', positive: true, icon: <IconChart size={16} /> },
  { label: 'Tokens Processed', value: '8.2M', change: '+18%', positive: true, icon: <IconTokens size={16} /> },
  { label: 'Avg Latency', value: '1.2s', change: '-5%', positive: true, icon: <IconZap size={16} /> },
  { label: 'Total Cost', value: '$42.18', change: '+15%', positive: false, icon: <IconMoney size={16} /> },
];

const weeklyData = [
  { day: 'Mon', requests: 1820, tokens: 1.2 },
  { day: 'Tue', requests: 2100, tokens: 1.5 },
  { day: 'Wed', requests: 1950, tokens: 1.3 },
  { day: 'Thu', requests: 2300, tokens: 1.7 },
  { day: 'Fri', requests: 2150, tokens: 1.4 },
  { day: 'Sat', requests: 1200, tokens: 0.8 },
  { day: 'Sun', requests: 1327, tokens: 0.3 },
];

const recentActivity = [
  { prompt: 'Explain quantum computing', model: 'gpt-4o', tokens: 1452, cost: '$0.0032', time: '2m ago', status: 'success' as const },
  { prompt: 'Write a poem about AI', model: 'claude-3-opus', tokens: 892, cost: '$0.0021', time: '5m ago', status: 'success' as const },
  { prompt: 'Summarize this article', model: 'gemini-1.5-pro', tokens: 2341, cost: '$0.0051', time: '12m ago', status: 'success' as const },
  { prompt: 'Debug this Python code', model: 'llama-3.1-70b', tokens: 678, cost: '$0.0015', time: '18m ago', status: 'success' as const },
  { prompt: 'Generate a business plan', model: 'gpt-4o', tokens: 3201, cost: '$0.0089', time: '25m ago', status: 'success' as const },
  { prompt: 'Translate to French', model: 'gpt-4o-mini', tokens: 0, cost: '$0.0000', time: '32m ago', status: 'warning' as const },
];

const modelUsage = [
  { model: 'GPT-4o', pct: 42, tokens: '3.4M' },
  { model: 'GPT-4o Mini', pct: 28, tokens: '2.3M' },
  { model: 'Claude 3 Opus', pct: 15, tokens: '1.2M' },
  { model: 'Gemini 1.5 Pro', pct: 10, tokens: '0.8M' },
  { model: 'Llama 3.1', pct: 5, tokens: '0.4M' },
];

export default function DashboardPage() {
  const maxTokens = Math.max(...weeklyData.map(d => d.tokens));
  const maxReqs = Math.max(...weeklyData.map(d => d.requests));

  return (
    <div className="space-y-4 sm:space-y-6 max-w-6xl">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Usage analytics, model distribution, and recent activity for your account.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <GlassCard className="p-4">
              <div className="flex items-start justify-between mb-2">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <span className="text-lg">{stat.icon}</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold font-mono">{stat.value}</p>
              <p className={`text-xs mt-1 ${stat.positive ? 'text-[var(--neon-green)]' : 'text-[var(--danger)]'}`}>
                {stat.change} this week
              </p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Weekly chart */}
        <GlassCard className="lg:col-span-2">
          <CardHeader title="Weekly Usage" action={<Badge variant="info">Last 7 days</Badge>} />
          <CardContent>
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded bg-[var(--neon-blue)]" />
                <span className="text-muted-foreground">Requests</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded bg-[var(--neon-purple)]" />
                <span className="text-muted-foreground">Tokens (M)</span>
              </div>
            </div>

            <div className="flex items-end gap-2 sm:gap-3 h-32 sm:h-40">
              {weeklyData.map((day) => (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <div className="flex flex-col items-center gap-0.5 w-full" style={{ height: '100%', justifyContent: 'flex-end' }}>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(day.requests / maxReqs) * 100}%` }}
                      transition={{ duration: 0.4 }}
                      className="w-full rounded-t bg-gradient-to-t from-[var(--neon-blue)] to-[var(--neon-blue)]/50"
                      style={{ opacity: 0.7 }}
                    />
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(day.tokens / maxTokens) * 100}%` }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      className="w-full rounded-t bg-gradient-to-t from-[var(--neon-purple)] to-[var(--neon-purple)]/50"
                      style={{ opacity: 0.7 }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">{day.day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </GlassCard>

        {/* Model distribution */}
        <GlassCard>
          <CardHeader title="Model Usage" action={<Badge variant="purple">Distribution</Badge>} />
          <CardContent>
            <div className="space-y-4">
              {modelUsage.map((m) => (
                <div key={m.model} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-mono">{m.model}</span>
                    <span className="text-muted-foreground">{m.tokens} tokens</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ProgressBar value={m.pct} size="sm" variant="default" className="flex-1" />
                    <span className="text-xs font-mono text-muted-foreground w-8 text-right">{m.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </GlassCard>
      </div>

      {/* Recent activity */}
      <GlassCard>
        <CardHeader
          title="Recent Activity"
          action={<Badge variant="success">{recentActivity.length} requests</Badge>}
        />
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {recentActivity.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center justify-between px-5 py-3 hover:bg-muted/20 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{item.prompt}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.model} — {item.time}
                  </p>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 text-xs text-muted-foreground ml-4 shrink-0">
                  <span className="hidden sm:inline">{item.tokens.toLocaleString()} tokens</span>
                  <span className="font-mono">{item.cost}</span>
                  <Badge
                    variant={item.status === 'success' ? 'success' : 'warning'}
                    className="text-[10px]"
                  >
                    {item.status}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </GlassCard>
    </div>
  );
}
