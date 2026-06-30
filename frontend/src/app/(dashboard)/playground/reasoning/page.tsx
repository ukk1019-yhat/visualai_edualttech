'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { getApiUrl } from '@/lib/api';

export default function ReasoningPage() {
  const [prompt, setPrompt] = useState('Explain quantum computing');
  const [animating, setAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [steps, setSteps] = useState<{ time: string; label: string; color: string; desc: string }[]>([]);
  const [latency, setLatency] = useState('-');
  const [tokens, setTokens] = useState('-');
  const [cost, setCost] = useState('-');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleAnimate = async () => {
    if (animating) return;
    setAnimating(true);
    setDone(false);
    setError('');
    setCurrentStep(0);
    setSteps([]);

    try {
      const res = await fetch(getApiUrl('/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model: 'nvidia/nemotron-3-ultra-550b-a55b:free' }),
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();

      const stepLabels = [
        { id: 'tokenize', label: 'Tokenized', color: 'text-[#16A34A]' },
        { id: 'embed', label: 'Embedding', color: 'text-[#082C4E]' },
        { id: 'attention', label: 'Attention', color: 'text-[#8B5CF6]' },
        { id: 'layers', label: 'Transformer Layers', color: 'text-[#082C4E]' },
        { id: 'reasoning', label: 'Reasoning', color: 'text-[#16A34A]' },
        { id: 'safety', label: 'Safety Check', color: 'text-[var(--warning)]' },
      ];

      const procSteps = data.processing_steps || [];
      const timelineSteps = stepLabels.map((s, i) => {
        const ps = procSteps.find((p: any) => p.id === s.id);
        return {
          time: ps ? `${ps.duration.toFixed(0)} ms` : `${(i * 120).toFixed(0)} ms`,
          label: s.label,
          color: s.color,
          desc: ps ? `${s.label} complete` : `${s.label} step`,
        };
      });
      timelineSteps.unshift({ time: '0 ms', label: 'Received Prompt', color: 'text-muted-foreground', desc: 'Input received by the model' });
      timelineSteps.push({ time: data.latency ? `${data.latency.toFixed(0)} ms` : '-', label: 'Output Generated', color: 'text-[#16A34A]', desc: 'Response streamed to user' });

      setSteps(timelineSteps);
      for (let i = 0; i < timelineSteps.length; i++) {
        await new Promise((r) => setTimeout(r, 300 + Math.random() * 200));
        setCurrentStep(i);
      }

      setLatency(data.latency ? `${data.latency.toFixed(0)} ms` : '-');
      setTokens(data.completion_tokens ? `${data.completion_tokens.toLocaleString()}` : '-');
      setCost(data.cost != null ? `$${data.cost.toFixed(6)}` : '-');
      setDone(true);
    } catch (e: any) {
      setError(e.message || 'Request failed');
    }

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
              {animating ? 'Processing...' : done ? 'Run Again' : 'Run Timeline'}
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
                <p className="text-foreground font-semibold">{latency}</p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground">Tokens</p>
                <p className="text-foreground font-semibold">{tokens}</p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground">Cost</p>
                <p className="text-foreground font-semibold">{cost}</p>
              </div>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

          {/* Timeline */}
          <div className="relative">
            {(steps.length > 0 ? steps : []).map((item, i) => {
              const isActive = i === currentStep && animating;
              const isDone = i < currentStep;
              const opacity = animating ? (isDone || isActive ? 1 : 0.3) : 1;

              return (
                <motion.div
                  key={`${item.label}-${i}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity, x: 0 }}
                  transition={{ delay: animating ? 0 : i * 0.1 }}
                  className="relative flex items-start gap-4 pb-5 last:pb-0"
                >
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                        isDone
                          ? 'bg-[#16A34A] border-[#16A34A] shadow-[0_0_6px_#16A34A]'
                          : isActive
                          ? 'bg-[#082C4E] border-[#082C4E] animate-pulse-glow'
                          : 'bg-background border-border'
                      }`}
                    />
                    {i < steps.length - 1 && (
                      <motion.div
                        className="w-0.5 flex-1 bg-border"
                        animate={isDone ? { backgroundColor: '#16A34A' } : {}}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </div>

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
                        {isDone && <span className="text-[#16A34A] text-xs shrink-0">✓</span>}
                      </div>
                      <span className="text-xs font-mono text-muted-foreground shrink-0">{item.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                    {isActive && (
                      <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          animate={{ width: ['0%', '100%'] }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                          className="h-full rounded-full bg-gradient-to-r from-[#082C4E] to-[#8B5CF6]"
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
            {!animating && steps.length === 0 && (
              <p className="text-xs text-muted-foreground/50 italic text-center py-8">
                Click &quot;Run Timeline&quot; to see AI reasoning steps
              </p>
            )}
          </div>
        </CardContent>
      </GlassCard>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Prompt Tokens', value: done ? tokens : '-', change: null, positive: true },
          { label: 'Completion', value: done ? tokens : '-', change: null, positive: true },
          { label: 'Total Cost', value: done ? cost : '-', change: null, positive: true },
          { label: 'Avg Latency', value: done ? latency : '-', change: null, positive: true },
        ].map((stat) => (
          <GlassCard key={stat.label} className="p-4">
            <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-lg sm:text-xl font-bold font-mono">{stat.value}</p>
            {stat.change && (
              <p className={`text-xs mt-1 ${stat.positive ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                {stat.change} vs. average
              </p>
            )}
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
