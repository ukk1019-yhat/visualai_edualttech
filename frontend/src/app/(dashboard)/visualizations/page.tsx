'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

type Arch = {
  title: string;
  desc: string;
  color: string;
  href: string;
  tags: string[];
  stats: { label: string; value: string }[];
  level: number;
  svg: (h: boolean) => React.ReactNode;
};

function NeuralNetSVG({ hover }: { hover: boolean }) {
  return (
    <svg viewBox="0 0 200 100" className="w-full h-full">
      {[0, 1, 2].map((l) =>
        Array.from({ length: [4, 5, 3][l] }).map((_, n) => {
          const x = 30 + l * 70;
          const y = 20 + (n + 1) * (60 / ([4, 5, 3][l] + 1));
          return (
            <g key={`n${l}-${n}`}>
              {l < 2 &&
                Array.from({ length: [4, 5, 3][l + 1] }).map((_, m) => {
                  const x2 = 30 + (l + 1) * 70;
                  const y2 = 20 + (m + 1) * (60 / ([4, 5, 3][l + 1] + 1));
                  return (
                    <line
                      key={`w${l}-${n}-${m}`}
                      x1={x} y1={y} x2={x2} y2={y2}
                      stroke={hover ? '#60a5fa' : '#334155'}
                      strokeWidth={0.5}
                      className="transition-colors duration-500"
                    />
                  );
                })}
              <circle
                cx={x} cy={y} r={5}
                fill={hover ? (l === 0 ? '#60a5fa' : l === 1 ? '#a78bfa' : '#34d399') : '#1e293b'}
                stroke={hover ? (l === 0 ? '#60a5fa' : l === 1 ? '#a78bfa' : '#34d399') : '#334155'}
                strokeWidth={1}
                className="transition-all duration-500"
              />
            </g>
          );
        })
      )}
    </svg>
  );
}

function CNNSVG({ hover }: { hover: boolean }) {
  return (
    <svg viewBox="0 0 200 100" className="w-full h-full">
      {Array.from({ length: 5 }).map((_, r) =>
        Array.from({ length: 5 }).map((_, c) => (
          <rect
            key={`in-${r}-${c}`}
            x={15 + c * 8} y={10 + r * 8}
            width={7} height={7}
            fill={hover ? `rgba(52,211,153,${0.2 + ((r + c) % 3) * 0.2})` : '#1e293b'}
            stroke={hover ? '#34d399' : '#334155'}
            strokeWidth={0.5}
            className="transition-all duration-500"
          />
        ))
      )}
      {hover && (
        <motion.rect
          x={17} y={12} width={22} height={22}
          fill="none" stroke="#60a5fa" strokeWidth={1.5} rx={1}
          animate={{ x: [17, 17, 33, 33, 17], y: [12, 28, 28, 12, 12] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}
      {Array.from({ length: 3 }).map((_, r) =>
        Array.from({ length: 3 }).map((_, c) => (
          <rect
            key={`out-${r}-${c}`}
            x={150 + c * 14} y={25 + r * 14}
            width={12} height={12}
            fill={hover ? 'rgba(96,165,250,0.3)' : '#1e293b'}
            stroke={hover ? '#60a5fa' : '#334155'}
            strokeWidth={0.5}
            className="transition-all duration-500"
          />
        ))
      )}
      <line x1={65} y1={50} x2={145} y2={50} stroke={hover ? '#34d399' : '#334155'} strokeWidth={1} strokeDasharray="3 2" className="transition-colors duration-500" />
      <text x={105} y={45} fontSize={5} fill={hover ? '#34d399' : '#475569'} textAnchor="middle" className="transition-colors duration-500">→ feat map</text>
    </svg>
  );
}

function RNNSVG({ hover }: { hover: boolean }) {
  return (
    <svg viewBox="0 0 200 100" className="w-full h-full">
      {[0, 1, 2, 3].map((t) => {
        const x = 25 + t * 42;
        return (
          <g key={`step-${t}`}>
            <rect x={x - 8} y={8} width={16} height={12} rx={2} fill={hover ? '#f97316' : '#1e293b'} stroke={hover ? '#f97316' : '#334155'} strokeWidth={0.8} className="transition-all duration-500" />
            <text x={x} y={17} fontSize={5} fill={hover ? '#fff' : '#475569'} textAnchor="middle">{hover ? 'x' : ''}</text>
            <circle cx={x} cy={45} r={7} fill={hover ? '#60a5fa' : '#1e293b'} stroke={hover ? '#60a5fa' : '#334155'} strokeWidth={1} className="transition-all duration-500" />
            <text x={x} y={47} fontSize={4} fill={hover ? '#fff' : 'transparent'} textAnchor="middle">h</text>
            {t < 3 && (
              <motion.path
                d={`M${x + 7} 45 Q${x + 18} ${hover ? 30 : 45} ${x + 35} 45`}
                fill="none" stroke={hover ? '#34d399' : '#334155'}
                strokeWidth={1}
                className="transition-colors duration-500"
                animate={hover ? { pathLength: [0, 1] } : undefined}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

function GANSVG({ hover }: { hover: boolean }) {
  return (
    <svg viewBox="0 0 200 100" className="w-full h-full">
      <text x={40} y={12} fontSize={6} fill={hover ? '#60a5fa' : '#475569'} textAnchor="middle" className="transition-colors duration-500">Generator</text>
      <rect x={15} y={18} width={18} height={8} rx={1.5} fill="rgba(96,165,250,0.2)" stroke={hover ? '#60a5fa' : '#334155'} strokeWidth={0.8} className="transition-colors duration-500" />
      <circle cx={24} cy={26} r={2} fill={hover ? '#60a5fa' : '#1e293b'} className="transition-colors duration-500" />
      <rect x={15} y={30} width={18} height={8} rx={1.5} fill="rgba(96,165,250,0.2)" stroke={hover ? '#60a5fa' : '#334155'} strokeWidth={0.8} className="transition-colors duration-500" />
      <rect x={15} y={42} width={18} height={8} rx={1.5} fill="rgba(96,165,250,0.2)" stroke={hover ? '#60a5fa' : '#334155'} strokeWidth={0.8} className="transition-colors duration-500" />
      <motion.rect
        x={15} y={54} width={18} height={18} rx={2}
        fill="rgba(96,165,250,0.3)" stroke={hover ? '#60a5fa' : '#334155'} strokeWidth={0.8}
        className="transition-colors duration-500"
        animate={hover ? { scale: [1, 1.08, 1] } : undefined}
        transition={{ duration: 0.5, repeat: Infinity }}
      />
      <text x={160} y={12} fontSize={6} fill={hover ? '#a78bfa' : '#475569'} textAnchor="middle" className="transition-colors duration-500">Discriminator</text>
      <rect x={130} y={18} width={14} height={8} rx={1.5} fill="rgba(167,139,250,0.2)" stroke={hover ? '#a78bfa' : '#334155'} strokeWidth={0.8} className="transition-colors duration-500" />
      <rect x={130} y={30} width={14} height={8} rx={1.5} fill="rgba(167,139,250,0.2)" stroke={hover ? '#a78bfa' : '#334155'} strokeWidth={0.8} className="transition-colors duration-500" />
      <rect x={130} y={42} width={14} height={8} rx={1.5} fill="rgba(167,139,250,0.2)" stroke={hover ? '#a78bfa' : '#334155'} strokeWidth={0.8} className="transition-colors duration-500" />
      <circle cx={137} cy={58} r={6} fill="rgba(167,139,250,0.3)" stroke={hover ? '#a78bfa' : '#334155'} strokeWidth={1} className="transition-colors duration-500" />
      <motion.path
        d="M34 40 Q78 20 128 40"
        fill="none" stroke={hover ? '#f87171' : '#334155'} strokeWidth={1}
        strokeDasharray="3 2"
        animate={hover ? { strokeDashoffset: [0, -20] } : undefined}
        transition={{ duration: 1, repeat: Infinity }}
      />
      <motion.path
        d="M128 50 Q78 75 34 50"
        fill="none" stroke={hover ? '#34d399' : '#334155'} strokeWidth={1}
        strokeDasharray="3 2"
        animate={hover ? { strokeDashoffset: [0, -20] } : undefined}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </svg>
  );
}

function DiffusionSVG({ hover }: { hover: boolean }) {
  const cols = 5;
  return (
    <svg viewBox="0 0 200 100" className="w-full h-full">
      <motion.g
        animate={hover ? undefined : undefined}
      >
        {Array.from({ length: cols }).map((_, i) => {
          const x = 15 + i * 36;
          const alpha = hover ? 1 - i * 0.18 : 0.3;
          const fill = hover
            ? `rgba(6,182,212,${alpha})`
            : '#1e293b';
          return (
            <g key={`step-${i}`}>
              <rect x={x} y={20} width={28} height={28} rx={3} fill={fill} stroke={hover ? '#06b6d4' : '#334155'} strokeWidth={0.5} className="transition-all duration-500" />
              {i < cols - 1 && (
                <motion.path
                  d={`M${x + 28} 34 Q${x + 33} 34 ${x + 36} 34`}
                  fill="none"
                  stroke={hover ? '#34d399' : '#334155'}
                  strokeWidth={0.8}
                  animate={hover ? { pathLength: [0, 1], opacity: [0, 1] } : undefined}
                  transition={{ delay: i * 0.1, duration: 0.3 }}
                />
              )}
              <text x={x + 14} y={58} fontSize={4.5} fill={hover ? '#94a3b8' : 'transparent'} textAnchor="middle">t={cols - 1 - i}</text>
            </g>
          );
        })}
      </motion.g>
      {hover && (
        <text x={100} y={75} fontSize={5} fill="#34d399" textAnchor="middle" fontFamily="monospace">
          {Array.from({ length: 8 }).map(() => '▁▂▃▄▅▆▇█'[Math.floor(Math.random() * 8)]).join('')}
        </text>
      )}
    </svg>
  );
}

function TransformerSVG({ hover }: { hover: boolean }) {
  const heads = 4;
  const tokens = 5;
  return (
    <svg viewBox="0 0 200 100" className="w-full h-full">
      {/* Input tokens */}
      {Array.from({ length: tokens }).map((_, t) => (
        <rect key={`tok-${t}`} x={8} y={10 + t * 14} width={6} height={10} rx={1} fill={hover ? 'rgba(96,165,250,0.3)' : '#1e293b'} stroke={hover ? '#60a5fa' : '#334155'} strokeWidth={0.5} className="transition-all duration-500" />
      ))}
      {/* Attention lines */}
      {Array.from(Array(heads).keys()).map((h) =>
        Array.from({ length: Math.min(tokens, 4) }).map((_, s) => {
          const sy = 15 + s * 14;
          const ty = 15 + (tokens - 1 - s) * 14;
          const colors = ['#60a5fa', '#34d399', '#a78bfa', '#f97316'];
          return (
            <motion.path
              key={`attn-${h}-${s}`}
              d={`M18 ${sy} Q${28 + h * 15} ${(sy + ty) / 2} ${170} ${ty}`}
              fill="none"
              stroke={hover ? colors[h] : '#1e293b'}
              strokeWidth={hover ? 0.6 + h * 0.2 : 0.3}
              strokeOpacity={hover ? 0.3 + s * 0.15 : 0}
              animate={hover ? { strokeOpacity: [0.2, 0.6, 0.2] } : undefined}
              transition={{ duration: 1.5 + h * 0.3, repeat: Infinity }}
            />
          );
        })
      )}
      {/* Output tokens */}
      {Array.from({ length: tokens }).map((_, t) => (
        <rect key={`out-${t}`} x={180} y={10 + t * 14} width={6} height={10} rx={1} fill={hover ? 'rgba(52,211,153,0.3)' : '#1e293b'} stroke={hover ? '#34d399' : '#334155'} strokeWidth={0.5} className="transition-all duration-500" />
      ))}
      <text x={97} y={95} fontSize={5} fill={hover ? '#60a5fa' : '#1e293b'} textAnchor="middle" className="transition-colors duration-500">multi-head attention</text>
    </svg>
  );
}

const architectures: Arch[] = [
  {
    title: 'Transformer',
    desc: 'Multi-head self-attention driving modern generative AI.',
    color: 'from-blue-500 to-cyan-500',
    href: '/playground/attention',
    tags: ['Attention', 'Self-Attention', 'Positional Encoding'],
    stats: [
      { label: 'Introduced', value: '2017' },
      { label: 'Layers', value: '6-12+' },
      { label: 'Params', value: '100M+' },
    ],
    level: 3,
    svg: (h: boolean) => <TransformerSVG hover={h} />,
  },
  {
    title: 'Neural Network',
    desc: 'Fully connected layers with backpropagation and activation flows.',
    color: 'from-purple-500 to-pink-500',
    href: '/playground/neural-network',
    tags: ['MLP', 'Activations', 'Backpropagation'],
    stats: [
      { label: 'Layers', value: '3' },
      { label: 'Weights', value: '35' },
      { label: 'Biases', value: '8' },
    ],
    level: 2,
    svg: (h: boolean) => <NeuralNetSVG hover={h} />,
  },
  {
    title: 'CNN',
    desc: 'Convolutional filters scanning for spatial hierarchies.',
    color: 'from-green-500 to-emerald-500',
    href: '/playground/cnn',
    tags: ['Convolution', 'Pooling', 'Feature Maps'],
    stats: [
      { label: 'Introduced', value: '1989' },
      { label: 'Kernel', value: '3×3' },
      { label: 'Stride', value: '1 / 2' },
    ],
    level: 2,
    svg: (h: boolean) => <CNNSVG hover={h} />,
  },
  {
    title: 'RNN',
    desc: 'Sequential memory through hidden state recurrence and gates.',
    color: 'from-orange-500 to-red-500',
    href: '/playground/rnn',
    tags: ['LSTM', 'GRU', 'Sequence'],
    stats: [
      { label: 'Introduced', value: '1986' },
      { label: 'Steps', value: '4' },
      { label: 'Hidden', value: '128' },
    ],
    level: 2,
    svg: (h: boolean) => <RNNSVG hover={h} />,
  },
  {
    title: 'GAN',
    desc: 'Adversarial training where G and D compete, improving together.',
    color: 'from-red-500 to-rose-500',
    href: '/playground/gan',
    tags: ['Generator', 'Discriminator', 'Adversarial'],
    stats: [
      { label: 'Introduced', value: '2014' },
      { label: 'Loss', value: 'BCE' },
      { label: 'Latent', value: '100' },
    ],
    level: 2,
    svg: (h: boolean) => <GANSVG hover={h} />,
  },
  {
    title: 'Diffusion',
    desc: 'Iterative denoising from pure noise to structured output.',
    color: 'from-cyan-500 to-blue-500',
    href: '/playground/diffusion',
    tags: ['Denoising', 'Sampling', 'Latent Space'],
    stats: [
      { label: 'Steps', value: '10' },
      { label: 'Grid', value: '8×8' },
      { label: 'Noise', value: 'Gaussian' },
    ],
    level: 2,
    svg: (h: boolean) => <DiffusionSVG hover={h} />,
  },
];

function LevelDots({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3].map((l) => (
        <div
          key={l}
          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
            l <= level ? 'bg-primary shadow-[0_0_4px_var(--primary)]' : 'bg-border'
          }`}
        />
      ))}
    </div>
  );
}

export default function VisualizationsPage() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="space-y-4 sm:space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold">Visualizations</h1>
          <p className="text-sm text-muted-foreground">
            Interactive neural architecture playgrounds. Hover to preview, click to explore.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[10px] text-muted-foreground">
          <span>Interactivity</span>
          <LevelDots level={3} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {architectures.map((arch, i) => {
          const isHovered = hovered === arch.title;
          return (
            <motion.div
              key={arch.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onMouseEnter={() => setHovered(arch.title)}
              onMouseLeave={() => setHovered(null)}
            >
              <Link href={arch.href} className="block h-full">
                <GlassCard hover className="h-full group">
                  <div className="p-4 sm:p-5 flex flex-col h-full">
                    {/* SVG preview */}
                    <div className="h-24 sm:h-28 mb-3 rounded-lg bg-black/40 overflow-hidden">
                      <div className="w-full h-full p-1.5">
                        {arch.svg(isHovered)}
                      </div>
                    </div>

                    {/* Title + level */}
                    <div className="flex items-start justify-between mb-1.5">
                      <h3 className="font-semibold text-sm sm:text-base group-hover:text-primary transition-colors">
                        {arch.title}
                      </h3>
                      <div className="sm:hidden">
                        <LevelDots level={arch.level} />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                      {arch.desc}
                    </p>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {arch.stats.map((s) => (
                        <div key={s.label} className="text-center">
                          <p className="text-[10px] text-muted-foreground">{s.label}</p>
                          <p className="text-xs font-mono font-semibold text-foreground">{s.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-auto pt-3 border-t border-border">
                      {arch.tags.map((tag) => (
                        <Badge key={tag} variant="default" className="text-[9px]">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
