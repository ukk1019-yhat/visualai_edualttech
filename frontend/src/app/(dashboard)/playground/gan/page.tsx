'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const GRID_SIZE = 4;
type TargetPattern = 'diagonal' | 'checkerboard' | 'horizontal-bars' | 'vertical-bars' | 'solid';

function randomNoise(dim: number): number[] {
  return Array.from({ length: dim }, () => Math.random() * 2 - 1);
}

function generateRealImage(pattern: TargetPattern): number[][] {
  const grid: number[][] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    const row: number[] = [];
    for (let c = 0; c < GRID_SIZE; c++) {
      let val: number;
      switch (pattern) {
        case 'diagonal':
          val = (r + c) / (GRID_SIZE * 2 - 2) * 2 - 1;
          break;
        case 'checkerboard':
          val = (r + c) % 2 === 0 ? 1 : -1;
          break;
        case 'horizontal-bars':
          val = r % 2 === 0 ? 1 : -1;
          break;
        case 'vertical-bars':
          val = c % 2 === 0 ? 1 : -1;
          break;
        case 'solid':
          val = 1;
          break;
      }
      row.push(val);
    }
    grid.push(row);
  }
  return grid;
}

function generateFakeImage(noise: number[], step: number, pattern: TargetPattern, noiseDim: number): number[][] {
  const grid: number[][] = [];
  const maturity = Math.min(1, step / 20);
  const realFlat = generateRealImage(pattern).flat();
  for (let r = 0; r < GRID_SIZE; r++) {
    const row: number[] = [];
    for (let c = 0; c < GRID_SIZE; c++) {
      const i = r * GRID_SIZE + c;
      const base = noise[i % noise.length] ?? 0;
      const targetVal = realFlat[i] ?? 0;
      const structured = targetVal + (Math.random() - 0.5) * 0.3 * (1 - maturity);
      const val = base * (1 - maturity) + structured * maturity + (Math.random() - 0.5) * 0.2 * (1 - maturity);
      row.push(Math.max(-1, Math.min(1, val)));
    }
    grid.push(row);
  }
  return grid;
}

function clamp01(v: number): number {
  return Math.max(0.01, Math.min(0.99, v));
}

function discriminatorScore(image: number[][], step: number): number {
  const avg = image.flat().reduce((a, b) => a + Math.abs(b), 0) / (GRID_SIZE * GRID_SIZE);
  const realProb = clamp01(0.3 + avg * 0.5 + Math.sin(step * 0.1) * 0.05 + (Math.random() - 0.5) * 0.1);
  return realProb;
}

function computeLosses(step: number, dScore: number): { gLoss: number; dLoss: number } {
  const maturity = Math.min(1, step / 30);
  const gLoss = Math.max(0.05, 2.5 - maturity * 2.0 + (Math.random() - 0.5) * 0.3);
  const dLoss = Math.max(0.05, 1.2 - dScore * 0.6 + (Math.random() - 0.5) * 0.2);
  return { gLoss, dLoss };
}

function fakeImageToColor(val: number): string {
  const t = (val + 1) / 2;
  const r = Math.round(10 + t * 200);
  const g = Math.round(10 + t * 180);
  const b = Math.round(100 + t * 155);
  return `rgb(${r}, ${g}, ${b})`;
}

function realImageToColor(val: number): string {
  const t = (val + 1) / 2;
  const r = Math.round(200 - t * 100);
  const g = Math.round(120 + t * 80);
  const b = Math.round(180 - t * 100);
  return `rgb(${r}, ${g}, ${b})`;
}

function NeuronLayer({ count, label, color, values, active }: {
  count: number;
  label: string;
  color: string;
  values?: number[];
  active?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-[10px] font-mono text-muted-foreground">{label}</span>
      <div className="flex flex-col items-center gap-1">
        {Array.from({ length: count }).map((_, i) => {
          const v = values?.[i] ?? 0.5;
          const opacity = active !== undefined ? (active ? 0.9 : 0.2) : 0.3 + Math.abs(v) * 0.7;
          const size = active !== undefined ? 8 : 6 + Math.abs(v) * 6;
          return (
            <motion.div
              key={i}
              className="rounded-full"
              style={{
                width: size,
                height: size,
                backgroundColor: color,
                opacity,
                boxShadow: active ? `0 0 8px ${color}` : 'none',
              }}
              animate={{ opacity, scale: active ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 0.4, repeat: active ? Infinity : 0, repeatDelay: 0.5 + i * 0.1 }}
            />
          );
        })}
      </div>
    </div>
  );
}

function ConnectionLines({ from, to, active, color }: {
  from: number;
  to: number;
  active: boolean;
  color: string;
}) {
  const lines: { y1: number; y2: number }[] = [];
  const fromStep = 100 / (from + 1);
  const toStep = 100 / (to + 1);
  for (let i = 0; i < from; i++) {
    for (let j = 0; j < to; j++) {
      if (Math.random() > 0.15) continue;
      lines.push({ y1: fromStep * (i + 0.5), y2: toStep * (j + 0.5) });
    }
  }
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: active ? 1 : 0.1 }}>
      {lines.map((l, i) => (
        <motion.line
          key={i}
          x1="0%"
          y1={`${l.y1}%`}
          x2="100%"
          y2={`${l.y2}%`}
          stroke={color}
          strokeWidth={0.5}
          strokeOpacity={0.15 + Math.random() * 0.2}
          initial={{ pathLength: 0 }}
          animate={active ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.6, delay: i * 0.02 }}
        />
      ))}
      {active && (
        <motion.circle
          r={3}
          fill={color}
          initial={{ cx: '0%', cy: '50%', opacity: 0 }}
          animate={{
            cx: ['0%', '100%'],
            cy: ['50%', '50%'],
            opacity: [0, 1, 0],
          }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        />
      )}
    </svg>
  );
}

export default function GanPage() {
  const [step, setStep] = useState(0);
  const [noiseDim, setNoiseDim] = useState(16);
  const [targetPattern, setTargetPattern] = useState<TargetPattern>('diagonal');
  const [speed, setSpeed] = useState<'slow' | 'medium' | 'fast'>('medium');
  const [isTraining, setIsTraining] = useState(false);
  const [fakeGrid, setFakeGrid] = useState<number[][]>(generateFakeImage(randomNoise(16), 0, 'diagonal', 16));
  const [dScore, setDScore] = useState(0.5);
  const [gLoss, setGLoss] = useState(2.5);
  const [dLoss, setDLoss] = useState(1.2);
  const [history, setHistory] = useState<{ step: number; gLoss: number; dLoss: number }[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const noiseRef = useRef(randomNoise(16));
  const stepRef = useRef(0);
  const noiseDimRef = useRef(16);
  const targetPatternRef = useRef<TargetPattern>('diagonal');

  const runStep = useCallback(() => {
    noiseRef.current = noiseRef.current.map((n) => n + (Math.random() - 0.5) * 0.3);
    noiseRef.current = noiseRef.current.map((n) => Math.max(-1.5, Math.min(1.5, n)));
    const newStep = stepRef.current + 1;
    stepRef.current = newStep;
    const newGrid = generateFakeImage(noiseRef.current, newStep, targetPatternRef.current, noiseDimRef.current);
    const score = discriminatorScore(newGrid, newStep);
    const { gLoss: g, dLoss: d } = computeLosses(newStep, score);
    setStep(newStep);
    setFakeGrid(newGrid);
    setDScore(score);
    setGLoss(g);
    setDLoss(d);
    setHistory((prev) => [...prev.slice(-20), { step: newStep, gLoss: g, dLoss: d }]);
  }, []);

  const handleTrain = useCallback(() => {
    if (isTraining) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsTraining(false);
    } else {
      setIsTraining(true);
      const speedMap = { slow: 800, medium: 400, fast: 150 };
      intervalRef.current = setInterval(() => {
        runStep();
      }, speedMap[speed]);
    }
  }, [isTraining, speed, runStep]);

  const handleManualStep = useCallback(() => {
    runStep();
  }, [runStep]);

  const handleReset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsTraining(false);
    setStep(0);
    stepRef.current = 0;
    setDScore(0.5);
    setGLoss(2.5);
    setDLoss(1.2);
    setHistory([]);
    const newNoise = randomNoise(noiseDim);
    noiseRef.current = newNoise;
    setFakeGrid(generateFakeImage(newNoise, 0, targetPattern, noiseDim));
  }, [noiseDim, targetPattern]);

  const handleNoiseDimChange = useCallback((newDim: number) => {
    setNoiseDim(newDim);
    noiseDimRef.current = newDim;
    const newNoise = randomNoise(newDim);
    noiseRef.current = newNoise;
    setStep(0);
    stepRef.current = 0;
    setFakeGrid(generateFakeImage(newNoise, 0, targetPattern, newDim));
    setHistory([]);
    setDScore(0.5);
    setGLoss(2.5);
    setDLoss(1.2);
  }, [targetPattern]);

  const handleTargetPatternChange = useCallback((newPattern: TargetPattern) => {
    setTargetPattern(newPattern);
    targetPatternRef.current = newPattern;
    setStep(0);
    stepRef.current = 0;
    setFakeGrid(generateFakeImage(noiseRef.current, 0, newPattern, noiseDim));
    setHistory([]);
    setDScore(0.5);
    setGLoss(2.5);
    setDLoss(1.2);
  }, [noiseDim]);

  const handleSpeedChange = useCallback((newSpeed: 'slow' | 'medium' | 'fast') => {
    setSpeed(newSpeed);
    if (isTraining) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      const speedMap = { slow: 800, medium: 400, fast: 150 };
      intervalRef.current = setInterval(() => {
        runStep();
      }, speedMap[newSpeed]);
    }
  }, [isTraining, runStep]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const realGrid = generateRealImage(targetPattern);

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold">GAN Playground</h1>
          <p className="text-sm text-muted-foreground">
            Generative Adversarial Network — watch the generator vs discriminator battle
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="info">Step {step}</Badge>
          <Button
            variant={isTraining ? 'danger' : 'primary'}
            size="md"
            onClick={handleTrain}
          >
            {isTraining ? 'Stop Training' : 'Auto Train'}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleManualStep}>
            Step
          </Button>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </div>

      {/* Controls Panel */}
      <GlassCard>
        <CardHeader title="Data Controls" description="Customize the training data and parameters" />
        <CardContent>
          <div className="grid sm:grid-cols-4 gap-4">
            {/* Noise Dim */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-muted-foreground">
                Noise Dimension: <span className="text-[var(--neon-blue)] font-bold">{noiseDim}</span>
              </label>
              <input
                type="range"
                min={2}
                max={20}
                value={noiseDim}
                onChange={(e) => handleNoiseDimChange(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-[9px] text-muted-foreground">
                <span>2</span>
                <span>20</span>
              </div>
            </div>

            {/* Speed */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-muted-foreground">Training Speed</label>
              <div className="flex gap-1">
                {(['slow', 'medium', 'fast'] as const).map((s) => (
                  <Button
                    key={s}
                    variant={speed === s ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => handleSpeedChange(s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>

            {/* Target Pattern */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-muted-foreground">Target Pattern</label>
              <select
                value={targetPattern}
                onChange={(e) => handleTargetPatternChange(e.target.value as TargetPattern)}
                className="w-full px-2 py-1.5 text-xs rounded-xl bg-sidebar-hover border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="diagonal">Diagonal</option>
                <option value="checkerboard">Checkerboard</option>
                <option value="horizontal-bars">Horizontal Bars</option>
                <option value="vertical-bars">Vertical Bars</option>
                <option value="solid">Solid</option>
              </select>
            </div>

            {/* Real Data Preview */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-muted-foreground">Real Data</label>
              <div className="grid grid-cols-4 gap-0.5 w-16 h-16 mx-auto">
                {realGrid.flat().map((v, i) => (
                  <div key={i} className="rounded-sm" style={{ backgroundColor: realImageToColor(v) }} />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </GlassCard>

      {/* Generator + Discriminator */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Generator */}
        <GlassCard className="relative overflow-hidden border-[var(--neon-blue)]/20">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-blue)]/5 to-transparent pointer-events-none" />
          <CardHeader
            title="Generator"
            description="Noise → Fake Image"
            action={<Badge variant="info">G</Badge>}
          />
          <CardContent>
            <div className="flex items-center justify-center gap-8 py-4">
              {/* Noise Vector */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-mono text-muted-foreground mb-1">Noise z</span>
                <div className="flex flex-wrap w-20 gap-0.5">
                  {noiseRef.current.map((v, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-sm"
                      style={{
                        backgroundColor: `var(--neon-blue)`,
                        opacity: 0.3 + Math.abs(v) * 0.5,
                      }}
                      animate={{ opacity: 0.3 + Math.abs(v) * 0.5 }}
                      transition={{ duration: 0.3 }}
                    />
                  ))}
                </div>
              </div>

              {/* Arrow */}
              <motion.div
                className="text-2xl"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                style={{ color: 'var(--neon-blue)' }}
              >
                →
              </motion.div>

              {/* Fake Image Grid */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-mono text-muted-foreground mb-1">Fake Image</span>
                <div className="grid grid-cols-4 gap-0.5 w-24 h-24">
                  {fakeGrid.flat().map((v, i) => (
                    <motion.div
                      key={i}
                      className="rounded-sm"
                      style={{ backgroundColor: fakeImageToColor(v) }}
                      animate={{ backgroundColor: fakeImageToColor(v) }}
                      transition={{ duration: 0.3 }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Generator loss */}
            <div className="mt-4 p-3 rounded-lg bg-black/20 border border-[var(--neon-blue)]/10">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-mono text-[var(--neon-blue)]">Generator Loss</span>
                <span className="font-mono font-bold" style={{ color: 'var(--neon-blue)' }}>{gLoss.toFixed(3)}</span>
              </div>
              <div className="h-1.5 rounded-full bg-[var(--neon-blue)]/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: 'var(--neon-blue)' }}
                  animate={{ width: `${Math.min(100, gLoss * 40)}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>
          </CardContent>
        </GlassCard>

        {/* Discriminator */}
        <GlassCard className="relative overflow-hidden border-[var(--neon-purple)]/20">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-purple)]/5 to-transparent pointer-events-none" />
          <CardHeader
            title="Discriminator"
            description="Real / Fake Classification"
            action={<Badge variant="purple">D</Badge>}
          />
          <CardContent>
            <div className="flex items-center justify-center gap-6 py-4">
              {/* Input sources */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: fakeImageToColor(fakeGrid.flat()[0] ?? 0) }} />
                  <span className="text-[10px] font-mono text-muted-foreground">Fake</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: realImageToColor(realGrid.flat()[0] ?? 0) }} />
                  <span className="text-[10px] font-mono text-muted-foreground">Real</span>
                </div>
              </div>

              {/* D Network */}
              <div className="flex items-center gap-4">
                <NeuronLayer count={8} label="Hidden" color="var(--neon-purple)" active />
                <NeuronLayer count={4} label="Hidden" color="var(--neon-purple)" active />
              </div>

              {/* Arrow */}
              <motion.div
                className="text-2xl"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                style={{ color: 'var(--neon-purple)' }}
              >
                →
              </motion.div>

              {/* Output */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-mono text-muted-foreground mb-1">Prediction</span>
                <motion.div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-xs font-bold font-mono border-2"
                  style={{
                    borderColor: dScore > 0.5 ? 'var(--neon-green)' : 'var(--neon-purple)',
                    color: dScore > 0.5 ? 'var(--neon-green)' : 'var(--neon-purple)',
                  }}
                  animate={{
                    boxShadow: dScore > 0.5
                      ? '0 0 20px rgba(0, 255, 136, 0.3)'
                      : '0 0 20px rgba(139, 92, 246, 0.3)',
                  }}
                >
                  {(dScore * 100).toFixed(0)}%
                </motion.div>
                <span className="text-[9px] font-mono text-muted-foreground">
                  {dScore > 0.5 ? 'Real' : 'Fake'}
                </span>
              </div>
            </div>

            {/* D loss */}
            <div className="mt-4 p-3 rounded-lg bg-black/20 border border-[var(--neon-purple)]/10">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-mono text-[var(--neon-purple)]">Discriminator Loss</span>
                <span className="font-mono font-bold" style={{ color: 'var(--neon-purple)' }}>{dLoss.toFixed(3)}</span>
              </div>
              <div className="h-1.5 rounded-full bg-[var(--neon-purple)]/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: 'var(--neon-purple)' }}
                  animate={{ width: `${Math.min(100, dLoss * 40)}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>
          </CardContent>
        </GlassCard>
      </div>

      {/* Training Progress */}
      <GlassCard>
        <CardHeader
          title="Training Progress"
          description="Generator vs Discriminator loss over time"
          action={<Badge variant="info">Step {step}</Badge>}
        />
        <CardContent>
          {history.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-xs text-muted-foreground">
              Press &ldquo;Auto Train&rdquo; or &ldquo;Step&rdquo; to begin
            </div>
          ) : (
            <div className="h-32 w-full relative">
              {/* Mini chart */}
              <svg viewBox="0 0 400 100" className="w-full h-full" preserveAspectRatio="none">
                {(() => {
                  const maxVal = Math.max(1, ...history.map((h) => Math.max(h.gLoss, h.dLoss)));
                  const ptsG = history.map((h, i) => `${(i / Math.max(1, history.length - 1)) * 400},${100 - (h.gLoss / maxVal) * 90}`);
                  const ptsD = history.map((h, i) => `${(i / Math.max(1, history.length - 1)) * 400},${100 - (h.dLoss / maxVal) * 90}`);
                  return (
                    <>
                      <polyline
                        points={ptsG.join(' ')}
                        fill="none"
                        stroke="var(--neon-blue)"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <polyline
                        points={ptsD.join(' ')}
                        fill="none"
                        stroke="var(--neon-purple)"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </>
                  );
                })()}
              </svg>
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] font-mono text-muted-foreground px-1">
                <span>Step {history[0]?.step ?? 0}</span>
                <span>Step {history[history.length - 1]?.step ?? 0}</span>
              </div>
              <div className="absolute top-0 left-0 flex gap-4 text-[10px] font-mono">
                <span className="text-[var(--neon-blue)]">G loss</span>
                <span className="text-[var(--neon-purple)]">D loss</span>
              </div>
            </div>
          )}
        </CardContent>
      </GlassCard>

      {/* Fake Image Grid Evolution */}
      <GlassCard>
        <CardHeader
          title="Image Evolution"
          description="How the generated image changes over training steps"
          action={<Badge variant="success">Live</Badge>}
        />
        <CardContent>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {history.filter((_, i) => i % 2 === 0 || i === history.length - 1).map((h) => {
              const grid = generateFakeImage(noiseRef.current, h.step, targetPatternRef.current, noiseDimRef.current);
              return (
                <div key={h.step} className="flex flex-col items-center gap-1 shrink-0">
                  <div className="grid grid-cols-4 gap-0.5 w-16 h-16">
                    {grid.flat().map((v, i) => (
                      <div key={i} className="rounded-sm" style={{ backgroundColor: fakeImageToColor(v) }} />
                    ))}
                  </div>
                  <span className="text-[9px] font-mono text-muted-foreground">Step {h.step}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </GlassCard>
    </div>
  );
}
