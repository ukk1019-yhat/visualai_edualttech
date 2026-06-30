'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

function randomGrid(gridSize: number, seed: number): number[][] {
  const g: number[][] = [];
  for (let r = 0; r < gridSize; r++) {
    const row: number[] = [];
    for (let c = 0; c < gridSize; c++) {
      const val = Math.sin(seed + r * 3.7 + c * 5.1) * 0.5 + 0.5;
      row.push(val);
    }
    g.push(row);
  }
  return g;
}

function targetPattern(type: string, gridSize: number, seed: number = 42): number[][] {
  const g: number[][] = [];
  for (let r = 0; r < gridSize; r++) {
    const row: number[] = [];
    for (let c = 0; c < gridSize; c++) {
      switch (type) {
        case 'diagonal':
          row.push(r === c || r + c === gridSize - 1 ? 1 : 0);
          break;
        case 'checkerboard':
          row.push((r + c) % 2 === 0 ? 1 : 0);
          break;
        case 'horizontal':
          row.push(r % 2 === 0 ? 1 : 0);
          break;
        case 'vertical':
          row.push(c % 2 === 0 ? 1 : 0);
          break;
        case 'gradient':
          row.push(gridSize > 1 ? r / (gridSize - 1) : 0);
          break;
        case 'random':
          row.push(Math.sin(seed + r * 7.3 + c * 11.7) * 0.5 + 0.5);
          break;
        default:
          row.push(0);
      }
    }
    g.push(row);
  }
  return g;
}

function interpolateGrid(noise: number[][], target: number[][], t: number): number[][] {
  const g: number[][] = [];
  for (let r = 0; r < noise.length; r++) {
    const row: number[] = [];
    for (let c = 0; c < noise[r].length; c++) {
      row.push(noise[r][c] * (1 - t) + target[r][c] * t);
    }
    g.push(row);
  }
  return g;
}

function GridDisplay({ grid, label, gridSize }: { grid: number[][]; label: string; gridSize: number }) {
  const cellSize = gridSize <= 4 ? 'w-5 h-5 sm:w-6 sm:h-6' : gridSize <= 6 ? 'w-4 h-4 sm:w-5 sm:h-5' : 'w-3 h-3 sm:w-4 sm:h-4';
  return (
    <div className="flex flex-col items-center gap-1">
      <p className="text-[10px] font-mono text-muted-foreground">{label}</p>
      <div className="grid gap-px" style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0,1fr))` }}>
        {grid.map((row, r) =>
          row.map((val, c) => (
            <div
              key={`${r}-${c}`}
              className={`${cellSize} rounded-sm transition-all duration-300`}
              style={{ backgroundColor: `rgb(${Math.round((1 - val) * 255)}, ${Math.round(val * 255 * 0.6)}, ${Math.round(val * 255 * 0.8)})` }}
            />
          ))
        )}
      </div>
    </div>
  );
}

const PATTERNS = ['Diagonal', 'Checkerboard', 'Horizontal', 'Vertical', 'Gradient', 'Random'] as const;
const GRID_SIZES = [4, 6, 8] as const;
const SPEED_OPTIONS = ['slow', 'medium', 'fast'] as const;

export default function DiffusionPage() {
  const [gridSize, setGridSize] = useState(8);
  const [totalSteps, setTotalSteps] = useState(10);
  const [patternType, setPatternType] = useState<string>('diagonal');
  const [speed, setSpeed] = useState<'slow' | 'medium' | 'fast'>('medium');
  const [noiseSeed, setNoiseSeed] = useState(42);
  const [step, setStep] = useState(totalSteps);
  const [animating, setAnimating] = useState(false);
  const [mode, setMode] = useState<'reverse' | 'forward'>('reverse');
  const noiseRef = useRef<number[][]>([]);
  const targetRef = useRef<number[][]>([]);
  const [grids, setGrids] = useState<number[][]>([]);

  useEffect(() => {
    noiseRef.current = randomGrid(gridSize, noiseSeed);
    targetRef.current = targetPattern(patternType, gridSize, noiseSeed);
    setStep(totalSteps);
    setGrids(interpolateGrid(noiseRef.current, targetRef.current, 0));
  }, [gridSize, totalSteps, patternType, noiseSeed]);

  const speedMs = speed === 'slow' ? 600 : speed === 'fast' ? 200 : 400;

  const runDenoise = useCallback(async () => {
    if (animating) return;
    setAnimating(true);
    setMode('reverse');
    const ms = speed === 'slow' ? 600 : speed === 'fast' ? 200 : 400;
    for (let i = totalSteps; i >= 0; i--) {
      setStep(i);
      setGrids(interpolateGrid(noiseRef.current, targetRef.current, 1 - i / totalSteps));
      await new Promise((r) => setTimeout(r, ms));
    }
    setAnimating(false);
  }, [animating, totalSteps, speed]);

  const runNoise = useCallback(async () => {
    if (animating) return;
    setAnimating(true);
    const newSeed = Math.floor(Math.random() * 1000);
    noiseRef.current = randomGrid(gridSize, newSeed);
    targetRef.current = targetPattern(patternType, gridSize, newSeed);
    setNoiseSeed(newSeed);
    setMode('forward');
    const ms = speed === 'slow' ? 600 : speed === 'fast' ? 200 : 400;
    for (let i = 0; i <= totalSteps; i++) {
      setStep(i);
      setGrids(interpolateGrid(noiseRef.current, targetRef.current, 1 - i / totalSteps));
      await new Promise((r) => setTimeout(r, ms));
    }
    setAnimating(false);
  }, [animating, totalSteps, speed, gridSize, patternType]);

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
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Target Pattern</p>
              <div className="flex flex-wrap gap-2">
                {PATTERNS.map((p) => (
                  <Button
                    key={p}
                    size="sm"
                    variant={patternType === p.toLowerCase() ? 'primary' : 'secondary'}
                    onClick={() => setPatternType(p.toLowerCase())}
                    disabled={animating}
                  >
                    {p}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Grid Size</p>
                <div className="flex gap-2">
                  {GRID_SIZES.map((s) => (
                    <Button
                      key={s}
                      size="sm"
                      variant={gridSize === s ? 'primary' : 'secondary'}
                      onClick={() => setGridSize(s)}
                      disabled={animating}
                    >
                      {s}&times;{s}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Steps: {totalSteps}</p>
                <input
                  type="range"
                  min={5}
                  max={20}
                  value={totalSteps}
                  onChange={(e) => setTotalSteps(Number(e.target.value))}
                  disabled={animating}
                  className="w-full accent-primary"
                />
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Speed</p>
                <div className="flex gap-2">
                  {SPEED_OPTIONS.map((s) => (
                    <Button
                      key={s}
                      size="sm"
                      variant={speed === s ? 'primary' : 'secondary'}
                      onClick={() => setSpeed(s)}
                      disabled={animating}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-end gap-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Noise Seed</p>
                <input
                  type="number"
                  value={noiseSeed}
                  onChange={(e) => setNoiseSeed(Number(e.target.value))}
                  disabled={animating}
                  className="w-24 bg-muted/50 border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={runDenoise} loading={animating && mode === 'reverse'} disabled={animating}>
                  {animating && mode === 'reverse' ? 'Denoising...' : 'Denoise'}
                </Button>
                <Button onClick={runNoise} loading={animating && mode === 'forward'} variant="secondary" disabled={animating}>
                  {animating && mode === 'forward' ? 'Adding Noise...' : 'Add Noise'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </GlassCard>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        <GlassCard>
          <CardHeader title="Denoising Process" action={<Badge variant="info">Step {step}/{totalSteps}</Badge>} />
          <CardContent>
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="flex items-center gap-4 sm:gap-8">
                <GridDisplay grid={grids} label={step === 0 ? 'Output' : `t=${step}`} gridSize={gridSize} />
                {step > 0 && (
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-2xl text-[var(--neon-green)]"
                  >
                    &rarr;
                  </motion.div>
                )}
                <GridDisplay grid={noiseRef.current} label="Noise" gridSize={gridSize} />
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
              <text x="30" y="98" fontSize="7" fill="#e2e8f0" textAnchor="middle">x&#x2080;</text>
              <text x="150" y="25" fontSize="8" fill="#94a3b8" textAnchor="middle">Noise</text>
              <rect x="130" y="30" width="40" height="40" rx="4" fill="rgba(99,102,241,0.2)" stroke="#6366f1" strokeWidth="0.5"/>
              <text x="150" y="98" fontSize="7" fill="#e2e8f0" textAnchor="middle">x_T</text>
              <path d="M50 50 Q90 20 130 50" fill="none" stroke="url(#fw-grad)" strokeWidth="1" strokeDasharray="3 2"/>
              <text x="90" y="18" fontSize="7" fill="#34d399" textAnchor="middle">q (forward)</text>
              <path d="M130 70 Q90 100 50 70" fill="none" stroke="url(#rev-grad)" strokeWidth="1.5"/>
              <text x="90" y="115" fontSize="7" fill="#34d399" textAnchor="middle">p (reverse) &#10022;</text>
              <text x="200" y="45" fontSize="7" fill="#94a3b8">T = {totalSteps} steps</text>
              <text x="200" y="58" fontSize="7" fill="#94a3b8">Noise level: {(step / totalSteps * 100).toFixed(0)}%</text>
              <text x="200" y="71" fontSize="7" fill="#94a3b8">Mode: {mode === 'reverse' ? 'Denoising' : 'Adding Noise'}</text>
            </svg>
          </CardContent>
        </GlassCard>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Total Steps', value: String(totalSteps) },
          { label: 'Current Step', value: String(step) },
          { label: 'Grid Size', value: `${gridSize}x${gridSize}` },
          { label: 'Noise Level', value: `${(step / totalSteps * 100).toFixed(0)}%` },
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
