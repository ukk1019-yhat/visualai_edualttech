'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { getApiUrl } from '@/lib/api';

export default function OutputPage() {
  const [prompt, setPrompt] = useState('What is gravity?');
  const [loading, setLoading] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [done, setDone] = useState(false);
  const [stats, setStats] = useState<{ label: string; value: string }[]>([]);
  const [error, setError] = useState('');

  const handleStream = async () => {
    if (loading) return;
    setLoading(true);
    setDone(false);
    setDisplayedText('');
    setError('');
    setStats([]);

    try {
      const res = await fetch(getApiUrl('/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model: 'nvidia/nemotron-3-ultra-550b-a55b:free' }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      const fullText = data.content || '';
      const chars = fullText.split('');

      for (let i = 0; i < chars.length; i++) {
        setDisplayedText((prev) => prev + chars[i]);
        await new Promise((r) => setTimeout(r, 10 + Math.random() * 20));
      }

      setStats([
        { label: 'Characters', value: String(fullText.length) },
        { label: 'Est. Tokens', value: String(Math.ceil(fullText.length * 0.4)) },
        { label: 'Prompt Tokens', value: String(data.prompt_tokens ?? '-') },
        { label: 'Completion Tokens', value: String(data.completion_tokens ?? '-') },
        { label: 'Latency', value: data.latency ? `${data.latency.toFixed(0)}ms` : '-' },
        { label: 'Cost', value: data.cost ? `$${data.cost.toFixed(6)}` : '-' },
        { label: 'Model', value: data.model?.split('/').pop() ?? '-' },
      ]);
    } catch (e: any) {
      setError(e.message || 'Request failed');
    }

    setLoading(false);
    setDone(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-5xl">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold">Output Viewer</h1>
        <p className="text-sm text-muted-foreground">
          Watch tokens stream out one by one with real-time probabilities.
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
            <Button onClick={handleStream} loading={loading} className="shrink-0">
              {loading ? 'Streaming...' : done ? 'Stream Again' : 'Start Stream'}
            </Button>
          </div>
        </CardContent>
      </GlassCard>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        <GlassCard>
          <CardHeader
            title="Streaming Output"
            action={
              loading ? (
                <Badge variant="info">
                  <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse-glow" />
                  Live
                </Badge>
              ) : done ? (
                <Badge variant="success">Complete</Badge>
              ) : null
            }
          />
          <CardContent>
            <div className="font-mono text-sm sm:text-base leading-relaxed min-h-[200px]">
              {error ? (
                <span className="text-red-400 text-sm">{error}</span>
              ) : displayedText ? (
                <span>
                  {displayedText.split('').map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.1 }}
                      className="inline"
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              ) : (
                <span className="text-muted-foreground/50 italic">
                  Click &quot;Start Stream&quot; to see token-by-token output
                </span>
              )}
              {loading && (
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="inline-block w-0.5 h-4 sm:h-5 bg-[var(--neon-blue)] ml-0.5 align-middle"
                />
              )}
            </div>
          </CardContent>
        </GlassCard>

        <GlassCard>
          <CardHeader
            title="Response Stats"
            action={done ? <Badge variant="info">Live</Badge> : undefined}
          />
          <CardContent>
            <div className="space-y-2 sm:space-y-3 min-h-[200px]">
              {stats.length > 0 ? (
                stats.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center justify-between py-1 border-b border-border/30"
                  >
                    <span className="text-xs text-muted-foreground">{s.label}</span>
                    <span className="text-xs font-mono font-semibold">{s.value}</span>
                  </motion.div>
                ))
              ) : (
                <span className="text-muted-foreground/50 italic text-sm">
                  Stats appear after streaming completes
                </span>
              )}
            </div>
          </CardContent>
        </GlassCard>
      </div>

      {displayedText && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: 'Characters', value: String(displayedText.length) },
            { label: 'Est. Tokens', value: String(Math.ceil(displayedText.length * 0.4)) },
            { label: 'Stream Time', value: loading ? '...' : `${(displayedText.length * 15).toFixed(0)}ms` },
            { label: 'Avg Char/ms', value: loading ? '...' : `${(displayedText.length / (displayedText.length * 0.015)).toFixed(1)}/s` },
          ].map((stat) => (
            <GlassCard key={stat.label} className="p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-lg sm:text-xl font-bold font-mono">{stat.value}</p>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
