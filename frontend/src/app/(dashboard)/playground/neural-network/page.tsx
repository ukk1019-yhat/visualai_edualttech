'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const LAYERS = [
  { label: 'Input', count: 4, color: 'var(--neon-blue)' },
  { label: 'Hidden', count: 5, color: 'var(--neon-purple)' },
  { label: 'Output', count: 3, color: 'var(--neon-green)' },
];

const LAYER_X_POSITIONS = [100, 350, 600];
const NODE_SPACING_Y = 70;
const SVG_HEIGHT = 400;

function generateWeights() {
  const w: Record<string, number> = {};
  for (let i = 0; i < LAYERS[0].count; i++) {
    for (let h = 0; h < LAYERS[1].count; h++) {
      w[`0-${i}-${h}`] = Math.random() * 2 - 1;
    }
  }
  for (let h = 0; h < LAYERS[1].count; h++) {
    for (let o = 0; o < LAYERS[2].count; o++) {
      w[`1-${h}-${o}`] = Math.random() * 2 - 1;
    }
  }
  return w;
}

function getNodeY(layerIndex: number, nodeIndex: number) {
  const count = LAYERS[layerIndex].count;
  const totalHeight = (count - 1) * NODE_SPACING_Y;
  const startY = (SVG_HEIGHT - totalHeight) / 2;
  return startY + nodeIndex * NODE_SPACING_Y;
}

interface Particle {
  id: number;
  layerFrom: number;
  fromNode: number;
  toNode: number;
  x: number;
  y: number;
  progress: number;
}

export default function NeuralNetworkPage() {
  const [weights] = useState(generateWeights);
  const [hoveredConnection, setHoveredConnection] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [activeNodes, setActiveNodes] = useState<Set<string>>(new Set());
  const idRef = useRef(0);

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
    const inputNodes = LAYERS[0].count;
    const hiddenNodes = LAYERS[1].count;
    const outputNodes = LAYERS[2].count;

    for (let i = 0; i < inputNodes; i++) {
      for (let h = 0; h < hiddenNodes; h++) {
        const fx = LAYER_X_POSITIONS[0];
        const fy = getNodeY(0, i);
        const tx = LAYER_X_POSITIONS[1];
        const ty = getNodeY(1, h);
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
        const fy = getNodeY(1, h);
        const tx = LAYER_X_POSITIONS[2];
        const ty = getNodeY(2, o);
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
  }, [running]);

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
          const sx = LAYER_X_POSITIONS[fromLayer];
          const sy = getNodeY(fromLayer, p.fromNode);
          const ex = LAYER_X_POSITIONS[toLayer];
          const ey = getNodeY(toLayer, p.toNode);

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
  }, [particles.length > 0, running]);

  const connectionWeight = getWeight;

  const totalParams =
    LAYERS[0].count * LAYERS[1].count +
    LAYERS[1].count +
    LAYERS[1].count * LAYERS[2].count +
    LAYERS[2].count;

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
          <CardContent className="p-0 relative overflow-hidden" style={{ minHeight: SVG_HEIGHT }}>
            <svg
              viewBox={`0 0 ${LAYER_X_POSITIONS[2] + 100} ${SVG_HEIGHT}`}
              className="w-full"
              style={{ minHeight: SVG_HEIGHT }}
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
              {Array.from({ length: LAYERS[0].count }).map((_, i) =>
                Array.from({ length: LAYERS[1].count }).map((_, h) => {
                  const w = connectionWeight(0, i, h);
                  const key = `0-${i}-${h}`;
                  const isHovered = hoveredConnection === key;
                  const thickness = Math.max(0.5, Math.abs(w) * 3);
                  const opacity = isHovered ? 0.9 : 0.2 + Math.abs(w) * 0.4;
                  const x1 = LAYER_X_POSITIONS[0];
                  const y1 = getNodeY(0, i);
                  const x2 = LAYER_X_POSITIONS[1];
                  const y2 = getNodeY(1, h);
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
              {Array.from({ length: LAYERS[1].count }).map((_, h) =>
                Array.from({ length: LAYERS[2].count }).map((_, o) => {
                  const w = connectionWeight(1, h, o);
                  const key = `1-${h}-${o}`;
                  const isHovered = hoveredConnection === key;
                  const thickness = Math.max(0.5, Math.abs(w) * 3);
                  const opacity = isHovered ? 0.9 : 0.2 + Math.abs(w) * 0.4;
                  const x1 = LAYER_X_POSITIONS[1];
                  const y1 = getNodeY(1, h);
                  const x2 = LAYER_X_POSITIONS[2];
                  const y2 = getNodeY(2, o);
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
              {LAYERS.map((layer, li) => (
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
              {LAYERS.map((layer, li) =>
                Array.from({ length: layer.count }).map((_, ni) => {
                  const cx = LAYER_X_POSITIONS[li];
                  const cy = getNodeY(li, ni);
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
                  const toLayer = p.layerFrom + 1;
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
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Architecture</p>
                <div className="flex gap-2 flex-wrap">
                  {LAYERS.map((l) => (
                    <Badge key={l.label} variant={l.label === 'Input' ? 'info' : l.label === 'Hidden' ? 'purple' : 'success'}>
                      {l.label}: {l.count}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Parameters</span>
                  <span>{totalParams.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Weights</span>
                  <span>{LAYERS[0].count * LAYERS[1].count + LAYERS[1].count * LAYERS[2].count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Biases</span>
                  <span>{LAYERS[1].count + LAYERS[2].count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Layers</span>
                  <span>{LAYERS.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Activation</span>
                  <span>ReLU</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Connections</span>
                  <span>{LAYERS[0].count * LAYERS[1].count + LAYERS[1].count * LAYERS[2].count}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground mb-2">Legend</p>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 rounded" style={{ background: 'var(--neon-blue)' }} />
                    <span className="text-muted-foreground font-mono">Positive weight</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 rounded" style={{ background: 'var(--neon-purple)' }} />
                    <span className="text-muted-foreground font-mono">Negative weight</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 rounded" style={{ background: 'var(--neon-green)' }} />
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
