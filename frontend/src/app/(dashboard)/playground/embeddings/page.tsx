'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { GlassCard, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const seedColors = ['#00d4ff', '#00ff88', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6', '#f97316'];

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function EmbeddingsPage() {
  const [input, setInput] = useState('Dog, Cat, Tiger, Lion, Car, Bicycle, Airplane, Boat');
  const [hovered, setHovered] = useState<number | null>(null);

  const words = useMemo(
    () => input.split(',').map((w) => w.trim()).filter(Boolean),
    [input]
  );

  const points = useMemo(
    () =>
      words.map((word, i) => {
        const seed = word.split('').reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0);
        const angle1 = seededRandom(seed + 1) * Math.PI * 2;
        const angle2 = seededRandom(seed + 2) * Math.PI;
        const radius = 0.3 + seededRandom(seed + 3) * 0.7;
        return {
          word,
          x: Math.cos(angle1) * Math.sin(angle2) * radius * 120,
          y: Math.sin(angle1) * Math.sin(angle2) * radius * 120,
          z: Math.cos(angle2) * radius * 120,
          color: seedColors[i % seedColors.length],
          magnitude: 0.5 + seededRandom(seed + 4) * 1.0,
        };
      }),
    [words]
  );

  const similarities = useMemo(() => {
    const sims: { a: string; b: string; sim: number }[] = [];
    for (let i = 0; i < Math.min(words.length, 5); i++) {
      for (let j = i + 1; j < Math.min(words.length, 5); j++) {
        const dot = points[i].x * points[j].x + points[i].y * points[j].y + points[i].z * points[j].z;
        const magI = Math.sqrt(points[i].x ** 2 + points[i].y ** 2 + points[i].z ** 2);
        const magJ = Math.sqrt(points[j].x ** 2 + points[j].y ** 2 + points[j].z ** 2);
        const sim = magI && magJ ? ((dot / (magI * magJ)) + 1) / 2 : 0;
        sims.push({ a: words[i], b: words[j], sim: Math.max(0, Math.min(1, sim)) });
      }
    }
    return sims.sort((a, b) => b.sim - a.sim).slice(0, 8);
  }, [points, words]);

  return (
    <div className="space-y-4 sm:space-y-6 max-w-6xl">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold">Embedding Viewer</h1>
        <p className="text-sm text-muted-foreground">
          Explore the high-dimensional space where words become vectors. Hover a point to inspect.
        </p>
      </div>

      <GlassCard>
        <CardContent>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter comma-separated words..."
            className="text-sm"
          />
          <p className="text-xs text-muted-foreground mt-2">Separate words with commas</p>
        </CardContent>
      </GlassCard>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        {/* 3D visualization */}
        <GlassCard className="lg:col-span-2">
          <CardContent className="p-0 relative overflow-hidden" style={{ minHeight: 400 }}>
            <div className="absolute top-3 left-3 z-10 flex gap-2">
              <Badge variant="info">{words.length} words</Badge>
              <Badge variant="info">3D Space</Badge>
            </div>

            <svg viewBox="-150 -150 300 300" className="w-full h-full" style={{ minHeight: 400 }}>
              <defs>
                <radialGradient id="embedGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(59,130,246,0.08)" />
                  <stop offset="100%" stopColor="rgba(59,130,246,0)" />
                </radialGradient>
              </defs>

              <circle cx="0" cy="0" r="140" fill="url(#embedGlow)" />

              {/* Grid lines */}
              {[-100, -50, 0, 50, 100].map((v) => (
                <g key={`grid-${v}`}>
                  <line x1={-120} y1={v} x2={120} y2={v} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                  <line x1={v} y1={-120} x2={v} y2={120} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                </g>
              ))}

              <circle cx="0" cy="0" r="3" fill="#8B5CF6" opacity="0.5" />
              <text x="5" y="4" className="text-[8px] fill-muted-foreground font-mono">origin</text>

              <AnimatePresence>
                {points.map((pt, i) => (
                  <motion.g
                    key={pt.word}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08, type: 'spring' }}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    className="cursor-pointer"
                  >
                    <motion.line
                      x1="0" y1="0"
                      x2={pt.x} y2={pt.y}
                      stroke={pt.color}
                      strokeWidth="1"
                      opacity={hovered === null || hovered === i ? 0.2 : 0.05}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: i * 0.08 + 0.1, duration: 0.4 }}
                    />
                    <motion.circle
                      cx={pt.x} cy={pt.y} r={hovered === i ? 10 : 6}
                      fill={pt.color}
                      opacity={hovered === null || hovered === i ? 0.9 : 0.2}
                      animate={{
                        r: hovered === i ? 10 : 6,
                        opacity: hovered === null || hovered === i ? 0.9 : 0.2,
                      }}
                      className="drop-shadow-[0_0_6px_rgba(0,212,255,0.3)]"
                    />
                    {hovered === i && (
                      <motion.text
                        x={pt.x + (pt.x > 0 ? 14 : -14)}
                        y={pt.y + 4}
                        textAnchor={pt.x > 0 ? 'start' : 'end'}
                        className="text-xs fill-foreground font-mono font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {pt.word}
                      </motion.text>
                    )}
                  </motion.g>
                ))}
              </AnimatePresence>
            </svg>
          </CardContent>
        </GlassCard>

        {/* Similarity panel */}
        <GlassCard>
          <CardHeader title="Semantic Similarity" description="Cosine similarity between word vectors" />
          <CardContent>
            <div className="space-y-3">
              {similarities.map((sim) => (
                <div key={`${sim.a}-${sim.b}`} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-mono truncate mr-2">{sim.a} ↔ {sim.b}</span>
                    <span className="font-mono text-muted-foreground shrink-0">
                      {(sim.sim * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${sim.sim * 100}%` }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="h-full rounded-full bg-gradient-to-r from-[#082C4E] to-[#8B5CF6]"
                    />
                  </div>
                </div>
              ))}
              {similarities.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-8">
                  Add more words to see similarities
                </p>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground mb-2">Selected Vector</p>
              {hovered !== null && points[hovered] ? (
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between"><span className="text-muted-foreground">Word</span><span>{points[hovered].word}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">x</span><span>{points[hovered].x.toFixed(1)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">y</span><span>{points[hovered].y.toFixed(1)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">z</span><span>{points[hovered].z.toFixed(1)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Magnitude</span><span>{points[hovered].magnitude.toFixed(2)}</span></div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Hover a point to see details</p>
              )}
            </div>
          </CardContent>
        </GlassCard>
      </div>
    </div>
  );
}
