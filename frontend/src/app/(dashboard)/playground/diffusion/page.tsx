'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const GRID = 8;
const TOTAL_STEPS = 10;

function randomGrid(seed: number): number[][] {
  const g: number[][] = [];
  for (let r = 0; r < GRID; r++) {
    const row: number[] = [];
    for (let c = 0; c < GRID; c++) {
      const val = Math.sin(seed + r * 3.7 + c * 5.1) * 0.5 + 0.5;
      row.push(val);
    }
    g.push(row);
  }
  return g;
}

function targetPattern(): number[][] {
  const g: number[][] = [];
  for (let r = 0; r < GRID; r++) {
    const row: number[] = [];
    for (let c = 0; c < GRID; c++) {
      row.push(r === c || r + c === GRID - 1 ? 1 : 0);
    }
    g.push(row);
  }
  return g;
}

function interpolateGrid(noise: number[][], target: number[][], t: number): number[][] {
  const g: number[][] = [];
  for (let r = 0; r < GRID; r++) {
    const row: number[] = [];
    for (let c = 0; c < GRID; c++) {
      row.push(noise[r][c] * (1 - t) + target[r][c] * t);
    }
    g.push(row);
  }
  return g;
}

function GridDisplay({ grid, label, color }: { grid: number[][]; label: string; color: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <p className="text-[10px] font-mono text-muted-foreground">{label}</p>
      <div className="grid gap-px" style={{ gridTemplateColumns: `repeat(${GRID}, minmax(0,1fr))` }}>
        {grid.map((row, r) =>
          row.map((val, c) => (
            <div
              key={`${r}-${c}`}
              className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm transition-all duration-300"
              style={{ backgroundColor: `rgb(${Math.round((1 - val) * 255)}, ${Math.round(val * 255 * 0.6)}, ${Math.round(val * 255 * 0.8)})` }}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default function DiffusionPage() {
  const seedRef = useRef(42);
  const [step, setStep] = useState(TOTAL_STEPS);
  const [animating, setAnimating] = useState(false);
  const [mode, setMode] = useState<'reverse' | 'forward'>('reverse');
  const noise = useRef(randomGrid(seedRef.current));
  const target = useRef(targetPattern());
  const [grids, setGrids] = useState<number[][]>(() => interpolateGrid(noise.current, target.current, 0));

  const runDenoise = useCallback(async () => {
    if (animating) return;
    setAnimating(true);
    setMode('reverse');
    for (let i = TOTAL_STEPS; i >= 0; i--) {
      setStep(i);
      setGrids(interpolateGrid(noise.current, target.current, 1 - i / TOTAL_STEPS));
      await new Promise((r) => setTimeout(r, 400));
    }
    setAnimating(false);
  }, [animating]);

  const runNoise = useCallback(async () => {
    if (animating) return;
    setAnimating(true);
    seedRef.current = Math.floor(Math.random() * 1000);
    noise.current = randomGrid(seedRef.current);
    target.current = targetPattern();
    setMode('forward');
    for (let i = 0; i <= TOTAL_STEPS; i++) {
      setStep(i);
      setGrids(interpolateGrid(noise.current, target.current, 1 - i / TOTAL_STEPS));
      await new Promise((r) => setTimeout(r, 300));
    }
    setAnimating(false);
  }, [animating]);

  return (
    <div className="space-y-4 sm:space-y-6 max-w-5xl">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold">Diffusion Model</h1>
        <p className="text-sm text-muted-foreground">
          Watch pure noise be denoised step by step into a coherent pattern.
        </p>
      </div>

      <GlassCard>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={runDenoise} loading={animating && mode === 'reverse'} className="shrink-0">
              {animating && mode === 'reverse' ? 'Denoising...' : 'Denoise'}
            </Button>
            <Button onClick={runNoise} loading={animating && mode === 'forward'} variant="secondary" className="shrink-0">
              {animating && mode === 'forward' ? 'Adding Noise...' : 'Add Noise'}
            </Button>
          </div>
        </CardContent>
      </GlassCard>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        <GlassCard>
          <CardHeader title="Denoising Process" action={<Badge variant="info">Step {step}/{TOTAL_STEPS}</Badge>} />
          <CardContent>
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="flex items-center gap-4 sm:gap-8">
                <GridDisplay grid={grids} label={step === 0 ? 'Output' : `t=${step}`} color="var(--neon-blue)" />
                {step > 0 && (
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-2xl text-[var(--neon-green)]"
                  >
                    →
                  </motion.div>
                )}
                <GridDisplay grid={noise.current} label="Noise" color="var(--neon-purple)" />
              </div>
            </div>
          </CardContent>
        </GlassCard>

        <GlassCard>
          <CardHeader title="Process Diagram" />
          <CardContent>
            <svg viewBox="0 0 300 120" className="w-full max-w-sm mx-auto">
              <defs>
                <linearGradient id="fw-grad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#34d399"/><stop offset="100%" stopColor="#6366f1"/></linearGradient>
                <linearGradient id="rev-grad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#6366f1"/><stop offset="100%" stopColor="#34d399"/></linearGradient>
              </defs>
              <text x="30" y="25" fontSize="8" fill="#94a3b8" textAnchor="middle">Clean</text>
              <rect x="10" y="30" width="40" height="40" rx="4" fill="rgba(52,211,153,0.2)" stroke="#34d399" strokeWidth="0.5"/>
              <text x="30" y="98" fontSize="7" fill="#e2e8f0" textAnchor="middle">x₀</text>
              <text x="150" y="25" fontSize="8" fill="#94a3b8" textAnchor="middle">Noise</text>
              <rect x="130" y="30" width="40" height="40" rx="4" fill="rgba(99,102,241,0.2)" stroke="#6366f1" strokeWidth="0.5"/>
              <text x="150" y="98" fontSize="7" fill="#e2e8f0" textAnchor="middle">x_T</text>
              <path d="M50 50 Q90 20 130 50" fill="none" stroke="url(#fw-grad)" strokeWidth="1" strokeDasharray="3 2"/>
              <text x="90" y="18" fontSize="7" fill="#34d399" textAnchor="middle">q (forward)</text>
              <path d="M130 70 Q90 100 50 70" fill="none" stroke="url(#rev-grad)" strokeWidth="1.5"/>
              <text x="90" y="115" fontSize="7" fill="#34d399" textAnchor="middle">p (reverse) ✦</text>
              <text x="200" y="45" fontSize="7" fill="#94a3b8">T = {TOTAL_STEPS} steps</text>
              <text x="200" y="58" fontSize="7" fill="#94a3b8">Noise level: {(step / TOTAL_STEPS * 100).toFixed(0)}%</text>
              <text x="200" y="71" fontSize="7" fill="#94a3b8">Mode: {mode === 'reverse' ? 'Denoising' : 'Adding Noise'}</text>
            </svg>
          </CardContent>
        </GlassCard>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Total Steps', value: String(TOTAL_STEPS) },
          { label: 'Current Step', value: String(step) },
          { label: 'Grid Size', value: `${GRID}x${GRID}` },
          { label: 'Noise Level', value: `${(step / TOTAL_STEPS * 100).toFixed(0)}%` },
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
