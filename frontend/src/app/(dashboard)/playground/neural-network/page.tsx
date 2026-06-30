'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const LAYER_X_POSITIONS = [100, 350, 600];
const NODE_SPACING_Y = 70;
const MIN_SVG_HEIGHT = 400;

interface Particle {
  id: number;
  layerFrom: number;
  fromNode: number;
  toNode: number;
  x: number;
  y: number;
  progress: number;
}

function generateWeights(
  inputSize: number,
  hiddenSize: number,
  outputSize: number,
  scheme: 'random' | 'xavier' | 'he'
) {
  const w: Record<string, number> = {};
  for (let i = 0; i < inputSize; i++) {
    for (let h = 0; h < hiddenSize; h++) {
      let val = Math.random() * 2 - 1;
      if (scheme === 'xavier') {
        const limit = Math.sqrt(6 / (inputSize + hiddenSize));
        val = (Math.random() * 2 - 1) * limit;
      } else if (scheme === 'he') {
        const limit = Math.sqrt(6 / inputSize);
        val = (Math.random() * 2 - 1) * limit;
      }
      w[`0-${i}-${h}`] = val;
    }
  }
  for (let h = 0; h < hiddenSize; h++) {
    for (let o = 0; o < outputSize; o++) {
      let val = Math.random() * 2 - 1;
      if (scheme === 'xavier') {
        const limit = Math.sqrt(6 / (hiddenSize + outputSize));
        val = (Math.random() * 2 - 1) * limit;
      } else if (scheme === 'he') {
        const limit = Math.sqrt(6 / hiddenSize);
        val = (Math.random() * 2 - 1) * limit;
      }
      w[`1-${h}-${o}`] = val;
    }
  }
  return w;
}

function getNodeY(layerCount: number, nodeIndex: number, svgHeight: number) {
  const totalHeight = (layerCount - 1) * NODE_SPACING_Y;
  const startY = (svgHeight - totalHeight) / 2;
  return startY + nodeIndex * NODE_SPACING_Y;
}

export default function NeuralNetworkPage() {
  const [layerSizes, setLayerSizes] = useState({ input: 4, hidden: 5, output: 3 });
  const [activation, setActivation] = useState<'relu' | 'sigmoid' | 'tanh'>('relu');
  const [initScheme, setInitScheme] = useState<'random' | 'xavier' | 'he'>('random');
  const [weights, setWeights] = useState(() => generateWeights(4, 5, 3, 'random'));
  const [hoveredConnection, setHoveredConnection] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [activeNodes, setActiveNodes] = useState<Set<string>>(new Set());
  const idRef = useRef(0);

  const layers = useMemo(
    () => [
      { label: 'Input', count: layerSizes.input, color: 'var(--neon-blue)' },
      { label: 'Hidden', count: layerSizes.hidden, color: 'var(--neon-purple)' },
      { label: 'Output', count: layerSizes.output, color: 'var(--neon-green)' },
    ],
    [layerSizes]
  );

  const svgHeight = useMemo(() => {
    const maxCount = Math.max(layerSizes.input, layerSizes.hidden, layerSizes.output);
    return Math.max(MIN_SVG_HEIGHT, maxCount * NODE_SPACING_Y + 80);
  }, [layerSizes]);

  const regenerateNetwork = useCallback(
    (sizes: typeof layerSizes, scheme: typeof initScheme) => {
      setWeights(generateWeights(sizes.input, sizes.hidden, sizes.output, scheme));
      setParticles([]);
      setActiveNodes(new Set());
      setHoveredConnection(null);
      setRunning(false);
    },
    []
  );

  const handleSizeChange = (layer: 'input' | 'hidden' | 'output', raw: number) => {
    const clamped = Math.max(1, Math.min(10, raw || 1));
    const newSizes = { ...layerSizes, [layer]: clamped };
    setLayerSizes(newSizes);
    regenerateNetwork(newSizes, initScheme);
  };

  const handleRandomize = () => {
    regenerateNetwork(layerSizes, initScheme);
  };

  const handleInitChange = (scheme: 'random' | 'xavier' | 'he') => {
    setInitScheme(scheme);
    setWeights(generateWeights(layerSizes.input, layerSizes.hidden, layerSizes.output, scheme));
  };

  const getWeight = useCallback(
    (layerIdx: number, from: number, to: number) => {
      return weights[`${layerIdx}-${from}-${to}`] ?? 0;
    },
    [weights]
  );

  const runForwardPass = useCallback(() => {
    if (running) return;
    setRunning(true);
    setParticles([]);
    setActiveNodes(new Set());
    idRef.current = 0;

    const newParticles: Particle[] = [];
    const { input: inputNodes, hidden: hiddenNodes, output: outputNodes } = layerSizes;

    for (let i = 0; i < inputNodes; i++) {
      for (let h = 0; h < hiddenNodes; h++) {
        const fx = LAYER_X_POSITIONS[0];
        const fy = getNodeY(inputNodes, i, svgHeight);
        const tx = LAYER_X_POSITIONS[1];
        const ty = getNodeY(hiddenNodes, h, svgHeight);
        newParticles.push({
          id: ++idRef.current,
          layerFrom: 0,
          fromNode: i,
          toNode: h,
          x: fx,
          y: fy,
          progress: 0,
        });
      }
    }

    const delayedHidden: Particle[] = [];
    for (let h = 0; h < hiddenNodes; h++) {
      for (let o = 0; o < outputNodes; o++) {
        const fx = LAYER_X_POSITIONS[1];
        const fy = getNodeY(hiddenNodes, h, svgHeight);
        const tx = LAYER_X_POSITIONS[2];
        const ty = getNodeY(outputNodes, o, svgHeight);
        delayedHidden.push({
          id: ++idRef.current,
          layerFrom: 1,
          fromNode: h,
          toNode: o,
          x: fx,
          y: fy,
          progress: 0,
        });
      }
    }

    const totalFirst = newParticles.length;
    const totalSecond = delayedHidden.length;
    const allParticles = [...newParticles, ...delayedHidden];
    setParticles(allParticles);

    const activated = new Set<string>();
    allParticles.forEach((p) => {
      activated.add(`${p.layerFrom}-${p.fromNode}`);
      activated.add(`${p.layerFrom + 1}-${p.toNode}`);
    });
    setActiveNodes(activated);

    setTimeout(() => {
      setRunning(false);
    }, (totalFirst + totalSecond) * 60 + 1200);
  }, [running, layerSizes, svgHeight]);

  useEffect(() => {
    if (particles.length === 0) return;
    const interval = setInterval(() => {
      setParticles((prev) => {
        let allDone = true;
        const next = prev.map((p) => {
          const speed = 0.012;
          const newProgress = p.progress + speed;
          if (newProgress < 1) allDone = false;
          const clamped = Math.min(1, newProgress);

          const fromLayer = p.layerFrom;
          const toLayer = p.layerFrom + 1;
          const fromCount = fromLayer === 0 ? layerSizes.input : layerSizes.hidden;
          const toCount = toLayer === 1 ? layerSizes.hidden : layerSizes.output;
          const sx = LAYER_X_POSITIONS[fromLayer];
          const sy = getNodeY(fromCount, p.fromNode, svgHeight);
          const ex = LAYER_X_POSITIONS[toLayer];
          const ey = getNodeY(toCount, p.toNode, svgHeight);

          return {
            ...p,
            x: sx + (ex - sx) * clamped,
            y: sy + (ey - sy) * clamped,
            progress: clamped,
          };
        });
        if (allDone) return next;
        return next;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [particles.length > 0, running, layerSizes, svgHeight]);

  const connectionWeight = getWeight;

  const totalParams =
    layerSizes.input * layerSizes.hidden +
    layerSizes.hidden +
    layerSizes.hidden * layerSizes.output +
    layerSizes.output;

  return (
    <div className="space-y-4 sm:space-y-6 max-w-6xl">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold">Neural Network Visualizer</h1>
        <p className="text-sm text-muted-foreground">
          Fully connected feed-forward network. Hover connections to see weights, click run to animate.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        <GlassCard className="lg:col-span-2">
          <CardContent className="p-0 relative overflow-hidden" style={{ minHeight: svgHeight }}>
            <svg
              viewBox={`0 0 ${LAYER_X_POSITIONS[2] + 100} ${svgHeight}`}
              className="w-full"
              style={{ minHeight: svgHeight }}
            >
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Connections: Input → Hidden */}
              {Array.from({ length: layers[0].count }).map((_, i) =>
                Array.from({ length: layers[1].count }).map((_, h) => {
                  const w = connectionWeight(0, i, h);
                  const key = `0-${i}-${h}`;
                  const isHovered = hoveredConnection === key;
                  const thickness = Math.max(0.5, Math.abs(w) * 3);
                  const opacity = isHovered ? 0.9 : 0.2 + Math.abs(w) * 0.4;
                  const x1 = LAYER_X_POSITIONS[0];
                  const y1 = getNodeY(layers[0].count, i, svgHeight);
                  const x2 = LAYER_X_POSITIONS[1];
                  const y2 = getNodeY(layers[1].count, h, svgHeight);
                  return (
                    <g key={key}>
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={w >= 0 ? 'var(--neon-blue)' : 'var(--neon-purple)'}
                        strokeWidth={isHovered ? thickness + 2 : thickness}
                        opacity={opacity}
                        className="transition-all duration-200"
                      />
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="transparent"
                        strokeWidth={12}
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredConnection(key)}
                        onMouseLeave={() => setHoveredConnection(null)}
                      />
                      {isHovered && (
                        <motion.rect
                          x={(x1 + x2) / 2 - 30}
                          y={(y1 + y2) / 2 - 10}
                          width={60}
                          height={20}
                          rx={4}
                          fill="rgba(0,0,0,0.85)"
                          stroke="var(--neon-blue)"
                          strokeWidth={1}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <title>{`Weight: ${w.toFixed(3)}`}</title>
                        </motion.rect>
                      )}
                      {isHovered && (
                        <motion.text
                          x={(x1 + x2) / 2}
                          y={(y1 + y2) / 2 + 4}
                          textAnchor="middle"
                          className="text-[9px] fill-foreground font-mono pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {w.toFixed(3)}
                        </motion.text>
                      )}
                    </g>
                  );
                })
              )}

              {/* Connections: Hidden → Output */}
              {Array.from({ length: layers[1].count }).map((_, h) =>
                Array.from({ length: layers[2].count }).map((_, o) => {
                  const w = connectionWeight(1, h, o);
                  const key = `1-${h}-${o}`;
                  const isHovered = hoveredConnection === key;
                  const thickness = Math.max(0.5, Math.abs(w) * 3);
                  const opacity = isHovered ? 0.9 : 0.2 + Math.abs(w) * 0.4;
                  const x1 = LAYER_X_POSITIONS[1];
                  const y1 = getNodeY(layers[1].count, h, svgHeight);
                  const x2 = LAYER_X_POSITIONS[2];
                  const y2 = getNodeY(layers[2].count, o, svgHeight);
                  return (
                    <g key={key}>
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={w >= 0 ? 'var(--neon-purple)' : 'var(--neon-green)'}
                        strokeWidth={isHovered ? thickness + 2 : thickness}
                        opacity={opacity}
                        className="transition-all duration-200"
                      />
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="transparent"
                        strokeWidth={12}
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredConnection(key)}
                        onMouseLeave={() => setHoveredConnection(null)}
                      />
                      {isHovered && (
                        <motion.rect
                          x={(x1 + x2) / 2 - 30}
                          y={(y1 + y2) / 2 - 10}
                          width={60}
                          height={20}
                          rx={4}
                          fill="rgba(0,0,0,0.85)"
                          stroke="var(--neon-green)"
                          strokeWidth={1}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                        />
                      )}
                      {isHovered && (
                        <motion.text
                          x={(x1 + x2) / 2}
                          y={(y1 + y2) / 2 + 4}
                          textAnchor="middle"
                          className="text-[9px] fill-foreground font-mono pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {w.toFixed(3)}
                        </motion.text>
                      )}
                    </g>
                  );
                })
              )}

              {/* Layer labels */}
              {layers.map((layer, li) => (
                <text
                  key={`label-${li}`}
                  x={LAYER_X_POSITIONS[li]}
                  y={20}
                  textAnchor="middle"
                  className="text-[11px] fill-muted-foreground font-mono font-medium"
                >
                  {layer.label}
                </text>
              ))}

              {/* Nodes */}
              {layers.map((layer, li) =>
                Array.from({ length: layer.count }).map((_, ni) => {
                  const cx = LAYER_X_POSITIONS[li];
                  const cy = getNodeY(layer.count, ni, svgHeight);
                  const isActive = activeNodes.has(`${li}-${ni}`);
                  return (
                    <g key={`node-${li}-${ni}`}>
                      <circle
                        cx={cx}
                        cy={cy}
                        r={14}
                        fill="rgba(0,0,0,0.6)"
                        stroke={layer.color}
                        strokeWidth={2}
                        className="transition-all duration-300"
                      />
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isActive ? 20 : 14}
                        fill={layer.color}
                        opacity={isActive ? 0.15 : 0.05}
                        className="transition-all duration-300"
                      />
                      {isActive && (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={24}
                          fill="none"
                          stroke={layer.color}
                          strokeWidth={1}
                          opacity={0.4}
                          className="animate-pulse"
                        >
                          <animate
                            attributeName="r"
                            values="18;26;18"
                            dur="1.5s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            values="0.5;0.15;0.5"
                            dur="1.5s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}
                      <text
                        x={cx}
                        y={cy + 1}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="text-[10px] fill-foreground font-mono font-medium pointer-events-none"
                      >
                        {ni + 1}
                      </text>
                    </g>
                  );
                })
              )}

              {/* Particles */}
              <AnimatePresence>
                {particles.map((p) => {
                  const fromLayer = p.layerFrom;
                  const color =
                    fromLayer === 0
                      ? 'var(--neon-blue)'
                      : fromLayer === 1
                      ? 'var(--neon-purple)'
                      : 'var(--neon-green)';
                  return (
                    <motion.circle
                      key={p.id}
                      cx={p.x}
                      cy={p.y}
                      r={4}
                      fill={color}
                      filter="url(#glow)"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ duration: 0.15 }}
                    />
                  );
                })}
              </AnimatePresence>
            </svg>
          </CardContent>
        </GlassCard>

        {/* Stats panel */}
        <GlassCard>
          <CardHeader
            title="Network Info"
            action={
              <button
                onClick={runForwardPass}
                disabled={running}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--neon-blue)]/20 text-[var(--neon-blue)] border border-[var(--neon-blue)]/30 hover:bg-[var(--neon-blue)]/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {running ? 'Running...' : 'Run Forward'}
              </button>
            }
          />
          <CardContent className="overflow-y-auto max-h-[calc(100vh-12rem)]">
            <div className="space-y-4">
              {/* Layer size inputs */}
              <div className="space-y-3 pb-3 border-b border-border">
                <p className="text-xs font-medium text-muted-foreground">Customize</p>
                <div className="space-y-2">
                  {(['input', 'hidden', 'output'] as const).map((layer) => (
                    <div key={layer} className="flex items-center justify-between">
                      <label className="text-xs text-muted-foreground capitalize">{layer} size</label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={layerSizes[layer]}
                        onChange={(e) => handleSizeChange(layer, parseInt(e.target.value) || 1)}
                        className="w-16 px-2 py-1 text-xs font-mono text-right bg-black/30 border border-border rounded-md focus:outline-none focus:border-[var(--neon-blue)] transition-colors"
                      />
                    </div>
                  ))}
                </div>

                {/* Activation function */}
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5">Activation</p>
                  <div className="flex gap-1">
                    {(['relu', 'sigmoid', 'tanh'] as const).map((fn) => (
                      <button
                        key={fn}
                        onClick={() => setActivation(fn)}
                        className={`px-2.5 py-1 text-[10px] font-medium rounded-md transition-all ${
                          activation === fn
                            ? 'bg-[var(--neon-purple)]/30 text-[var(--neon-purple)] border border-[var(--neon-purple)]/50'
                            : 'bg-black/20 text-muted-foreground border border-transparent hover:border-border'
                        }`}
                      >
                        {fn === 'relu' ? 'ReLU' : fn === 'sigmoid' ? 'Sigmoid' : 'Tanh'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Weight initialization */}
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5">Weight Init</p>
                  <div className="flex gap-1">
                    {(['random', 'xavier', 'he'] as const).map((scheme) => (
                      <button
                        key={scheme}
                        onClick={() => handleInitChange(scheme)}
                        className={`px-2.5 py-1 text-[10px] font-medium rounded-md capitalize transition-all ${
                          initScheme === scheme
                            ? 'bg-[var(--neon-blue)]/30 text-[var(--neon-blue)] border border-[var(--neon-blue)]/50'
                            : 'bg-black/20 text-muted-foreground border border-transparent hover:border-border'
                        }`}
                      >
                        {scheme}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Randomize button */}
                <button
                  onClick={handleRandomize}
                  className="w-full px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--neon-green)]/20 text-[var(--neon-green)] border border-[var(--neon-green)]/30 hover:bg-[var(--neon-green)]/30 transition-all"
                >
                  Randomize Weights
                </button>
              </div>

              {/* Architecture badges */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Architecture</p>
                <div className="flex gap-2 flex-wrap">
                  {layers.map((l) => (
                    <Badge
                      key={l.label}
                      variant={
                        l.label === 'Input'
                          ? 'info'
                          : l.label === 'Hidden'
                          ? 'purple'
                          : 'success'
                      }
                    >
                      {l.label}: {l.count}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Parameters</span>
                  <span>{totalParams.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Weights</span>
                  <span>
                    {layerSizes.input * layerSizes.hidden +
                      layerSizes.hidden * layerSizes.output}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Biases</span>
                  <span>{layerSizes.hidden + layerSizes.output}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Layers</span>
                  <span>{layers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Activation</span>
                  <span>
                    {activation === 'relu'
                      ? 'ReLU'
                      : activation === 'sigmoid'
                      ? 'Sigmoid'
                      : 'Tanh'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Connections</span>
                  <span>
                    {layerSizes.input * layerSizes.hidden +
                      layerSizes.hidden * layerSizes.output}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground mb-2">Legend</p>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-0.5 rounded"
                      style={{ background: 'var(--neon-blue)' }}
                    />
                    <span className="text-muted-foreground font-mono">Positive weight</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-0.5 rounded"
                      style={{ background: 'var(--neon-purple)' }}
                    />
                    <span className="text-muted-foreground font-mono">Negative weight</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-0.5 rounded"
                      style={{ background: 'var(--neon-green)' }}
                    />
                    <span className="text-muted-foreground font-mono">Output signal</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </GlassCard>
      </div>
    </div>
  );
}
