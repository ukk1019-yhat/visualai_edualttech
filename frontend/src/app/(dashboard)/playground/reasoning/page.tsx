'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const timelineSteps = [
  { time: '0 ms', label: 'Received Prompt', color: 'text-muted-foreground', desc: 'Input received by the model' },
  { time: '120 ms', label: 'Tokenized', color: 'text-[var(--neon-green)]', desc: 'Text split into 12 tokens' },
  { time: '180 ms', label: 'Embedding', color: 'text-[var(--neon-blue)]', desc: 'Tokens converted to 1536-dim vectors' },
  { time: '310 ms', label: 'Searching Memory', color: 'text-[var(--neon-purple)]', desc: 'Context retrieval across 8M tokens' },
  { time: '500 ms', label: 'Reasoning', color: 'text-[var(--neon-blue)]', desc: 'Multi-step chain-of-thought' },
  { time: '720 ms', label: 'Safety Check', color: 'text-[var(--warning)]', desc: 'Content policy verification' },
  { time: '810 ms', label: 'Output Generated', color: 'text-[var(--neon-green)]', desc: 'Response streamed to user' },
];

export default function ReasoningPage() {
  const [prompt, setPrompt] = useState('Explain quantum computing');
  const [animating, setAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);

  const handleAnimate = async () => {
    if (animating) return;
    setAnimating(true);
    setCurrentStep(0);
    for (let i = 0; i < timelineSteps.length; i++) {
      await new Promise((r) => setTimeout(r, 400 + Math.random() * 300));
      setCurrentStep(i);
    }
    await new Promise((r) => setTimeout(r, 500));
    setAnimating(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-5xl">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold">Reasoning Timeline</h1>
        <p className="text-sm text-muted-foreground">
          Every millisecond of AI reasoning visualized like Chrome DevTools.
        </p>
      </div>

      <GlassCard>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter a prompt..."
              className="flex-1"
            />
            <Button onClick={handleAnimate} loading={animating} className="shrink-0">
              {animating ? 'Processing...' : 'Run Timeline'}
            </Button>
          </div>
        </CardContent>
      </GlassCard>

      <GlassCard>
        <CardContent className="p-4 sm:p-6">
          {/* Header stats */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 mb-6 pb-4 border-b border-border">
            <div className="space-y-0.5 min-w-0">
              <p className="text-xs text-muted-foreground">Prompt</p>
              <p className="text-xs sm:text-sm font-mono truncate max-w-[200px] sm:max-w-[300px]">&ldquo;{prompt}&rdquo;</p>
            </div>
            <div className="flex flex-wrap gap-3 sm:gap-6 ml-auto text-xs font-mono">
              <div className="text-right">
                <p className="text-muted-foreground">Total Latency</p>
                <p className="text-foreground font-semibold">810 ms</p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground">Tokens</p>
                <p className="text-foreground font-semibold">1,342</p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground">Cost</p>
                <p className="text-foreground font-semibold">$0.0032</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative">
            {timelineSteps.map((item, i) => {
              const isActive = i === currentStep && animating;
              const isDone = i < currentStep;
              const opacity = animating ? (isDone || isActive ? 1 : 0.3) : 1;

              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity, x: 0 }}
                  transition={{ delay: animating ? 0 : i * 0.1 }}
                  className="relative flex items-start gap-4 pb-5 last:pb-0"
                >
                  {/* Dot + connector */}
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                        isDone
                          ? 'bg-[var(--neon-green)] border-[var(--neon-green)] shadow-[0_0_6px_var(--neon-green)]'
                          : isActive
                          ? 'bg-[var(--neon-blue)] border-[var(--neon-blue)] animate-pulse-glow'
                          : 'bg-background border-border'
                      }`}
                    />
                    {i < timelineSteps.length - 1 && (
                      <motion.div
                        className="w-0.5 flex-1 bg-border"
                        animate={isDone ? { backgroundColor: 'var(--neon-green)' } : {}}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div
                    className={`flex-1 p-3 sm:p-4 rounded-xl border transition-all duration-300 ${
                      isActive
                        ? 'border-primary/30 bg-primary/5'
                        : isDone
                        ? 'border-border/50 bg-muted/20'
                        : 'glass'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`text-xs sm:text-sm font-mono font-medium ${item.color} truncate`}>
                          {item.label}
                        </span>
                        {isDone && <span className="text-[var(--neon-green)] text-xs shrink-0">✓</span>}
                      </div>
                      <span className="text-xs font-mono text-muted-foreground shrink-0">{item.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                    {isActive && (
                      <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          animate={{ width: ['0%', '100%'] }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                          className="h-full rounded-full bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)]"
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </GlassCard>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Prompt Tokens', value: '768', change: '+12%', positive: true },
          { label: 'Completion', value: '574', change: '+8%', positive: true },
          { label: 'Total Cost', value: '$0.0032', change: '-3%', positive: true },
          { label: 'Avg Latency', value: '1.3s', change: '-5%', positive: true },
        ].map((stat) => (
          <GlassCard key={stat.label} className="p-4">
            <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-lg sm:text-xl font-bold font-mono">{stat.value}</p>
            <p className={`text-xs mt-1 ${stat.positive ? 'text-[var(--neon-green)]' : 'text-[var(--danger)]'}`}>
              {stat.change} vs. average
            </p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
