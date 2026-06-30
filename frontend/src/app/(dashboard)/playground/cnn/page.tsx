'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';

type KernelSize = 3 | 5;
type Stride = 1 | 2;
type GridSize = 4 | 6 | 8;

const GRID_SIZES: GridSize[] = [4, 6, 8];

function genPixels(n: number): number[][] {
  return Array.from({ length: n }, () =>
    Array.from({ length: n }, () => Math.round(Math.random() * 100) / 100)
  );
}

function defaultKernel(n: number): number[][] {
  if (n === 3) return [[-1,0,1],[-2,0,2],[-1,0,1]];
  return [
    [-1,-1, 0, 1, 1],
    [-1,-2, 0, 2, 1],
    [-2,-3, 0, 3, 2],
    [-1,-2, 0, 2, 1],
    [-1,-1, 0, 1, 1],
  ];
}

function nearestGridSize(n: number): GridSize {
  if (n <= 5) return 4;
  if (n <= 7) return 6;
  return 8;
}

function outSize(input: number, kernel: number, stride: number): number {
  return Math.floor((input - kernel) / stride) + 1;
}

export default function CNNPage() {
  const [inputSize, setInputSize] = useState<GridSize>(8);
  const [kernelSize, setKernelSize] = useState<KernelSize>(3);
  const [stride, setStride] = useState<Stride>(1);
  const [status, setStatus] = useState<'idle' | 'running' | 'done'>('idle');
  const [currentPosIdx, setCurrentPosIdx] = useState(-1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [pixels, setPixels] = useState<number[][]>(() => genPixels(8));
  const [kernel, setKernel] = useState<number[][]>(() => defaultKernel(3));
  const [gridInput, setGridInput] = useState('');

  const outputSize = useMemo(() => outSize(inputSize, kernelSize, stride), [inputSize, kernelSize, stride]);

  const positions = useMemo(() => {
    const p: { r: number; c: number }[] = [];
    for (let r = 0; r <= inputSize - kernelSize; r += stride) {
      for (let c = 0; c <= inputSize - kernelSize; c += stride) {
        p.push({ r, c });
      }
    }
    return p;
  }, [inputSize, kernelSize, stride]);

  const [results, setResults] = useState<number[][]>(() =>
    Array.from({ length: outputSize }, () => Array(outputSize).fill(-1))
  );

  const [elemWise, setElemWise] = useState<{ iv: number; kv: number; prod: number }[][]>([]);
  const [convSum, setConvSum] = useState(0);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => cleanup, [cleanup]);

  const resetResults = useCallback((os: number) => {
    setResults(Array.from({ length: os }, () => Array(os).fill(-1)));
  }, []);

  const resetState = useCallback(() => {
    setCurrentPosIdx(-1);
    setStatus('idle');
    setElemWise([]);
    setConvSum(0);
  }, []);

  const handleGridSizeChange = useCallback((size: GridSize) => {
    cleanup();
    setInputSize(size);
    setPixels(genPixels(size));
    const os = outSize(size, kernelSize, stride);
    resetResults(os);
    resetState();
  }, [cleanup, kernelSize, stride, resetResults, resetState]);

  const handleKernelChange = useCallback((size: KernelSize) => {
    cleanup();
    const os = outSize(inputSize, size, stride);
    setKernelSize(size);
    setKernel(defaultKernel(size));
    resetResults(os);
    resetState();
  }, [cleanup, inputSize, stride, resetResults, resetState]);

  const handleStrideChange = useCallback((s: Stride) => {
    cleanup();
    const os = outSize(inputSize, kernelSize, s);
    setStride(s);
    resetResults(os);
    resetState();
  }, [cleanup, inputSize, kernelSize, resetResults, resetState]);

  const handleParseGrid = useCallback(() => {
    const trimmed = gridInput.trim();
    if (!trimmed) return;
    try {
      const rows = trimmed.split(';').map(r =>
        r.split(',').map(v => {
          const num = parseFloat(v.trim());
          if (isNaN(num)) throw new Error('Invalid number');
          return Math.max(0, Math.min(1, num));
        })
      );
      const h = rows.length;
      const w = rows[0].length;
      for (const row of rows) {
        if (row.length !== w) throw new Error('Inconsistent row lengths');
      }
      const size = nearestGridSize(Math.max(h, w));
      const cropped: number[][] = [];
      for (let r = 0; r < size; r++) {
        const row: number[] = [];
        for (let c = 0; c < size; c++) {
          row.push(r < h && c < w ? rows[r][c] : 0);
        }
        cropped.push(row);
      }
      cleanup();
      setInputSize(size);
      setPixels(cropped);
      const os = outSize(size, kernelSize, stride);
      resetResults(os);
      resetState();
    } catch {
      // ignore parse errors
    }
  }, [gridInput, cleanup, kernelSize, stride, resetResults, resetState]);

  const handleGenerateRandom = useCallback(() => {
    cleanup();
    setPixels(genPixels(inputSize));
    const os = outSize(inputSize, kernelSize, stride);
    resetResults(os);
    resetState();
  }, [inputSize, cleanup, kernelSize, stride, resetResults, resetState]);

  const togglePixel = useCallback((r: number, c: number) => {
    if (status === 'running') return;
    setPixels(prev => {
      const next = prev.map(row => [...row]);
      next[r][c] = next[r][c] === 0 ? 1 : 0;
      return next;
    });
    setElemWise([]);
    setConvSum(0);
    setStatus('idle');
  }, [status]);

  const handleKernelValueChange = useCallback((r: number, c: number, val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) return;
    setKernel(prev => {
      const next = prev.map(row => [...row]);
      next[r][c] = num;
      return next;
    });
    setElemWise([]);
    setConvSum(0);
    setStatus('idle');
  }, []);

  const start = useCallback(() => {
    cleanup();
    setCurrentPosIdx(-1);
    setStatus('running');
    setResults(Array.from({ length: outputSize }, () => Array(outputSize).fill(-1)));
    setElemWise([]);
    setConvSum(0);

    const maxAbs = kernel.reduce(
      (sum, row) => sum + row.reduce((s, v) => s + Math.abs(v), 0), 0
    );

    let idx = -1;
    timerRef.current = setInterval(() => {
      idx++;
      if (idx >= positions.length) {
        cleanup();
        setStatus('done');
        return;
      }

      setCurrentPosIdx(idx);
      const pos = positions[idx];
      const ew: { iv: number; kv: number; prod: number }[][] = [];
      let sum = 0;
      for (let kr = 0; kr < kernelSize; kr++) {
        const row: { iv: number; kv: number; prod: number }[] = [];
        for (let kc = 0; kc < kernelSize; kc++) {
          const iv = pixels[pos.r + kr][pos.c + kc];
          const kv = kernel[kr][kc];
          const prod = iv * kv;
          row.push({ iv, kv, prod });
          sum += prod;
        }
        ew.push(row);
      }
      setElemWise(ew);
      setConvSum(sum);

      const norm = maxAbs > 0
        ? Math.max(0, Math.min(1, (sum + maxAbs) / (2 * maxAbs)))
        : 0.5;

      const outR = Math.floor(idx / outputSize);
      const outC = idx % outputSize;

      setResults(prev => {
        const next = prev.map(r => [...r]);
        next[outR][outC] = norm;
        return next;
      });
    }, 500);
  }, [positions, kernelSize, outputSize, pixels, kernel, cleanup]);

  const pos = currentPosIdx >= 0 ? positions[currentPosIdx] : null;
  const totalOps = positions.length * kernelSize * kernelSize;
  const canStart = positions.length > 0 && status !== 'running';

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold">CNN Convolution Visualizer</h1>
        <p className="text-sm text-muted-foreground">
          Watch a convolution kernel slide over an input image to produce a feature map.
        </p>
      </div>

      <GlassCard>
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Grid:</span>
              {GRID_SIZES.map(size => (
                <Button
                  key={size}
                  size="sm"
                  variant={inputSize === size ? 'primary' : 'secondary'}
                  onClick={() => handleGridSizeChange(size)}
                  disabled={status === 'running'}
                >
                  {size}&times;{size}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Kernel:</span>
              {([3, 5] as KernelSize[]).map(size => (
                <Button
                  key={size}
                  size="sm"
                  variant={kernelSize === size ? 'primary' : 'secondary'}
                  onClick={() => handleKernelChange(size)}
                  disabled={status === 'running'}
                >
                  {size}&times;{size}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Stride:</span>
              {([1, 2] as Stride[]).map(s => (
                <Button
                  key={s}
                  size="sm"
                  variant={stride === s ? 'primary' : 'secondary'}
                  onClick={() => handleStrideChange(s)}
                  disabled={status === 'running'}
                >
                  {s}
                </Button>
              ))}
            </div>
            <div className="flex-1" />
            {status === 'running' ? (
              <Button variant="secondary" disabled size="md">
                <span className="w-2 h-2 bg-current rounded-full animate-pulse" />
                Computing&hellip;
              </Button>
            ) : (
              <Button onClick={start} size="md" disabled={!canStart}>
                {status === 'done' ? 'Restart' : 'Start Convolution'}
              </Button>
            )}
          </div>
        </CardContent>
      </GlassCard>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        <GlassCard>
          <CardHeader title="Input Image" action={<Badge>{inputSize}&times;{inputSize}</Badge>} />
          <CardContent>
            <div className="mb-3 space-y-2">
              <Textarea
                placeholder="Paste CSV: 0.1,0.5,0.9;0.2,0.6,1.0;0.3,0.7,0.8"
                value={gridInput}
                onChange={e => setGridInput(e.target.value)}
                rows={2}
                className="text-xs"
              />
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={handleParseGrid}>Parse</Button>
                <Button size="sm" variant="secondary" onClick={handleGenerateRandom}>Generate Random</Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="grid gap-0.5 bg-border/20 p-1 rounded-lg" style={{ gridTemplateColumns: `repeat(${inputSize}, 1fr)` }}>
                {pixels.map((row, ri) =>
                  row.map((val, ci) => {
                    const hl = pos && ri >= pos.r && ri < pos.r + kernelSize && ci >= pos.c && ci < pos.c + kernelSize;
                    return (
                      <motion.div
                        key={`${ri}-${ci}`}
                        className="relative w-7 h-7 sm:w-9 sm:h-9 rounded cursor-pointer"
                        style={{
                          backgroundColor: `rgb(${val * 255 | 0},${val * 255 | 0},${val * 255 | 0})`,
                        }}
                        animate={hl ? {
                          scale: 1.15,
                          boxShadow: '0 0 12px #082C4E',
                          border: '1px solid #082C4E',
                        } : {
                          scale: 1,
                          boxShadow: 'none',
                          border: '1px solid transparent',
                        }}
                        onClick={() => togglePixel(ri, ci)}
                      >
                        <span className="absolute inset-0 flex items-center justify-center text-[7px] font-mono font-bold text-white mix-blend-difference">
                          {val.toFixed(2)}
                        </span>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
            {pos && (
              <p className="mt-2 text-center text-xs text-[#082C4E] font-mono">
                Kernel at ({pos.r}, {pos.c})
              </p>
            )}
          </CardContent>
        </GlassCard>

        <GlassCard>
          <CardHeader title="Kernel" action={<Badge variant="info">{kernelSize}&times;{kernelSize}</Badge>} />
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-center">
                <div className="grid gap-0.5 bg-border/20 p-1 rounded-lg" style={{ gridTemplateColumns: `repeat(${kernelSize}, 1fr)` }}>
                  {kernel.map((row, ri) =>
                    row.map((val, ci) => (
                      <div
                        key={`k-${ri}-${ci}`}
                        className="w-7 h-7 sm:w-9 sm:h-9 rounded flex items-center justify-center"
                        style={{
                          backgroundColor: val > 0
                            ? `rgba(0,120,255,${Math.min(Math.abs(val), 1)})`
                            : `rgba(255,50,50,${Math.min(Math.abs(val), 1)})`,
                        }}
                      >
                        <input
                          type="number"
                          value={val}
                          onChange={e => handleKernelValueChange(ri, ci, e.target.value)}
                          step="0.1"
                          disabled={status === 'running'}
                          className="w-full h-full bg-transparent text-center text-[7px] font-mono font-bold text-white outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>

              {elemWise.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                  <p className="text-xs text-muted-foreground mb-1 text-center">Element-wise Multiplication</p>
                  <div className="flex justify-center">
                    <div className="grid gap-0.5 bg-border/20 p-1 rounded-lg" style={{ gridTemplateColumns: `repeat(${kernelSize}, 1fr)` }}>
                      {elemWise.map((row, ri) =>
                        row.map((cell, ci) => (
                          <div key={`ew-${ri}-${ci}`} className="w-7 h-7 sm:w-9 sm:h-9 rounded flex flex-col items-center justify-center bg-background/50">
                            <span className="text-[5px] font-mono text-muted-foreground leading-none">{cell.iv.toFixed(2)}&times;{cell.kv.toFixed(2)}</span>
                            <span className="text-[7px] font-mono font-bold text-white leading-none mt-0.5">{cell.prod.toFixed(2)}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  <p className="text-center text-xs font-mono text-[#16A34A] mt-1">
                    Sum = {convSum.toFixed(2)}
                  </p>
                </motion.div>
              )}

              {status === 'idle' && (
                <p className="text-xs text-muted-foreground text-center py-6">Press Start Convolution</p>
              )}
            </div>
          </CardContent>
        </GlassCard>

        <GlassCard>
          <CardHeader
            title="Feature Map"
            action={
              <Badge variant={status === 'done' ? 'success' : 'default'}>
                {status === 'done' ? 'Done' : status === 'running' ? 'Computing' : `${outputSize}&times;${outputSize}`}
              </Badge>
            }
          />
          <CardContent>
            <div className="flex justify-center">
              <div className="grid gap-0.5 bg-border/20 p-1 rounded-lg" style={{ gridTemplateColumns: `repeat(${outputSize}, 1fr)` }}>
                {results.map((row, ri) =>
                  row.map((val, ci) => (
                    <motion.div
                      key={`r-${ri}-${ci}`}
                      className="w-7 h-7 sm:w-9 sm:h-9 rounded flex items-center justify-center"
                      style={{
                        backgroundColor: val >= 0
                          ? `rgb(${val * 255 | 0},${val * 255 | 0},${val * 255 | 0})`
                          : 'rgb(10,10,20)',
                      }}
                      initial={false}
                      animate={val >= 0 ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.25 }}
                    >
                      <span className="text-[7px] font-mono font-bold text-white mix-blend-difference">
                        {val >= 0 ? val.toFixed(2) : ''}
                      </span>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
            {status === 'running' && (
              <div className="mt-3 space-y-1">
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#082C4E] to-[#8B5CF6] rounded-full"
                    animate={{ width: `${((currentPosIdx + 1) / positions.length) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground text-center font-mono">
                  Step {currentPosIdx + 1} of {positions.length}
                </p>
              </div>
            )}
          </CardContent>
        </GlassCard>
      </div>

      <GlassCard>
        <CardContent className="p-4 sm:p-5">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[
              { label: 'Input Size', value: `${inputSize}\u00d7${inputSize}`, color: '#082C4E' },
              { label: 'Kernel Size', value: `${kernelSize}\u00d7${kernelSize}`, color: '#8B5CF6' },
              { label: 'Stride', value: String(stride), color: '#16A34A' },
              { label: 'Output Size', value: `${outputSize}\u00d7${outputSize}`, color: '#082C4E' },
              { label: 'Total Operations', value: totalOps.toLocaleString(), color: '#16A34A' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-lg font-bold font-mono" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-[10px] text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </GlassCard>
    </div>
  );
}
