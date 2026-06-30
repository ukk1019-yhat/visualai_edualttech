'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { GlassCard, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/Progress';

interface TokenDisplay {
  text: string;
  id: number;
  position: number;
  probability: number;
}

function tokenize(text: string): TokenDisplay[] {
  const words = text.trim().split(/\s+/);
  if (!text.trim()) return [];
  return words.map((word, i) => ({
    text: word,
    id: Math.abs(word.split('').reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0)) % 50000,
    position: i,
    probability: 0.5 + Math.random() * 0.48,
  }));
}

export default function TokenViewerPage() {
  const [input, setInput] = useState('I love AI');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const tokens = useMemo(() => tokenize(input), [input]);

  return (
    <div className="space-y-4 sm:space-y-6 max-w-5xl">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold">Token Viewer</h1>
        <p className="text-sm text-muted-foreground">
          See how your input gets split into tokens with probabilities and positional embeddings.
        </p>
      </div>

      <GlassCard>
        <CardContent>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to tokenize..."
            className="text-base sm:text-lg"
          />
        </CardContent>
      </GlassCard>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Token display */}
        <GlassCard>
          <CardHeader title="Tokens" description={`${tokens.length} token${tokens.length !== 1 ? 's' : ''}`} />
          <CardContent>
            <div className="flex flex-wrap gap-2 min-h-[100px]">
              <AnimatePresence>
                {tokens.map((token, i) => (
                  <motion.div
                    key={`${token.text}-${i}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: i * 0.05 }}
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    className={`relative px-3 sm:px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                      hoveredIdx === i
                        ? 'border-primary bg-primary/10 shadow-[0_0_12px_rgba(59,130,246,0.2)] scale-105'
                        : 'border-border bg-muted/50 hover:border-border/80'
                    }`}
                  >
                    <span className="text-sm sm:text-base font-mono font-medium">{token.text}</span>
                    <AnimatePresence>
                      {hoveredIdx === i && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          className="absolute top-full left-0 mt-2 z-20 w-44 sm:w-48"
                        >
                          <GlassCard className="p-3 space-y-2 shadow-xl">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Token ID</span>
                              <span className="font-mono">{token.id}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Position</span>
                              <span className="font-mono text-[#8B5CF6]">{token.position}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Probability</span>
                              <span className="font-mono text-[#16A34A]">
                                {(token.probability * 100).toFixed(0)}%
                              </span>
                            </div>
                            <ProgressBar value={token.probability * 100} size="sm" variant="success" />
                          </GlassCard>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </GlassCard>

        {/* Token details table */}
        <GlassCard>
          <CardHeader
            title="Token Details"
            action={<Badge variant="info">{tokens.length} tokens</Badge>}
          />
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {tokens.map((token, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className={`flex items-center justify-between px-5 py-2.5 transition-colors ${
                    hoveredIdx === i ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground font-mono w-6">{i}</span>
                    <span className="font-mono font-medium text-sm">{token.text}</span>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono text-muted-foreground">
                    <span className="hidden sm:inline">ID: {token.id}</span>
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-12 sm:w-16 h-1.5 rounded-full bg-muted overflow-hidden"
                      >
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#082C4E] to-[#16A34A]"
                          style={{ width: `${token.probability * 100}%` }}
                        />
                      </div>
                      <span>{(token.probability * 100).toFixed(0)}%</span>
                    </div>
                    <span className="text-[#8B5CF6] hidden sm:inline">pos: {token.position}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </GlassCard>
      </div>

      {/* Token counts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Total Tokens', value: String(tokens.length) },
          { label: 'Avg Probability', value: tokens.length ? `${(tokens.reduce((s, t) => s + t.probability, 0) / tokens.length * 100).toFixed(0)}%` : '-' },
          { label: 'Unique IDs', value: String(new Set(tokens.map(t => t.id)).size) },
          { label: 'Characters', value: String(input.length) },
        ].map((stat) => (
          <GlassCard key={stat.label} className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-lg sm:text-xl font-bold font-mono">{stat.value}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
