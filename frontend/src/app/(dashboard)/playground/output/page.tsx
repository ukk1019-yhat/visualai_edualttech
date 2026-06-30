'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const sampleOutputs = [
  'Gravity is a fundamental force of nature that attracts objects with mass toward each other. On Earth, it gives us weight and keeps our feet on the ground.',
  'Quantum computing leverages quantum mechanical phenomena like superposition and entanglement to process information exponentially faster than classical computers for certain problems.',
  'Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed.',
];

const sampleProbs = [
  { token: 'Gravity', prob: 0.95 },
  { token: ' is', prob: 0.92 },
  { token: ' a', prob: 0.88 },
  { token: ' fundamental', prob: 0.76 },
  { token: ' force', prob: 0.71 },
  { token: ' of', prob: 0.85 },
  { token: ' nature', prob: 0.69 },
];

export default function OutputPage() {
  const [prompt, setPrompt] = useState('What is gravity?');
  const [streaming, setStreaming] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [done, setDone] = useState(false);

  const handleStream = async () => {
    if (streaming) return;
    setStreaming(true);
    setDone(false);
    setDisplayedText('');

    const text = sampleOutputs[Math.floor(Math.random() * sampleOutputs.length)];
    const chars = text.split('');

    for (let i = 0; i < chars.length; i++) {
      setDisplayedText((prev) => prev + chars[i]);
      await new Promise((r) => setTimeout(r, 15 + Math.random() * 25));
    }

    setStreaming(false);
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
            <Button onClick={handleStream} loading={streaming} className="shrink-0">
              {streaming ? 'Streaming...' : done ? 'Stream Again' : 'Start Stream'}
            </Button>
          </div>
        </CardContent>
      </GlassCard>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Streaming output */}
        <GlassCard>
          <CardHeader
            title="Streaming Output"
            action={
              streaming ? (
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
              {displayedText ? (
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
              {streaming && (
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="inline-block w-0.5 h-4 sm:h-5 bg-[var(--neon-blue)] ml-0.5 align-middle"
                />
              )}
            </div>
          </CardContent>
        </GlassCard>

        {/* Token probabilities */}
        <GlassCard>
          <CardHeader
            title="Token Probabilities"
            action={displayedText ? <Badge variant="info">{sampleProbs.length} tokens</Badge> : undefined}
          />
          <CardContent>
            <div className="space-y-2 sm:space-y-3 min-h-[200px]">
              {sampleProbs.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{
                    opacity: displayedText ? 1 : 0.3,
                    x: 0,
                  }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-2 sm:gap-3"
                >
                  <span className="w-16 sm:w-20 font-mono text-xs sm:text-sm truncate">{t.token}</span>
                  <div className="flex-1 h-2 sm:h-2.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: displayedText ? `${t.prob * 100}%` : '0%' }}
                      transition={{ delay: i * 0.08 + 0.2, duration: 0.4 }}
                      className="h-full rounded-full bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-green)]"
                    />
                  </div>
                  <span className="w-8 sm:w-10 text-right font-mono text-xs text-muted-foreground">
                    {(t.prob * 100).toFixed(0)}%
                  </span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </GlassCard>
      </div>

      {/* Streaming stats */}
      {displayedText && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: 'Characters', value: String(displayedText.length) },
            { label: 'Est. Tokens', value: String(Math.ceil(displayedText.length * 0.4)) },
            { label: 'Stream Time', value: streaming ? '...' : `${(displayedText.length * 20).toFixed(0)}ms` },
            { label: 'Avg Prob', value: `${(sampleProbs.reduce((s, t) => s + t.prob, 0) / sampleProbs.length * 100).toFixed(0)}%` },
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
