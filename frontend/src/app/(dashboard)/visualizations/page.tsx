'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

const architectures = [
  {
    title: 'Transformer',
    desc: 'The foundation of modern LLMs. Animate through all layers in real-time.',
    icon: '⚡',
    color: 'from-blue-500 to-cyan-500',
    href: '/playground/attention',
    tags: ['Attention', 'Self-Attention', 'Positional Encoding'],
  },
  {
    title: 'Neural Network',
    desc: 'Fully connected layers visualized with activation flows and weight animations.',
    icon: '🧠',
    color: 'from-purple-500 to-pink-500',
    href: '/visualizations',
    tags: ['MLP', 'Activations', 'Backpropagation'],
    comingSoon: true,
  },
  {
    title: 'CNN',
    desc: 'Watch convolutional filters scan across images detecting edges, textures, and features.',
    icon: '🔍',
    color: 'from-green-500 to-emerald-500',
    href: '/visualizations',
    tags: ['Convolution', 'Pooling', 'Feature Maps'],
    comingSoon: true,
  },
  {
    title: 'RNN',
    desc: 'Recurrent connections unfolding through time with LSTM gates in action.',
    icon: '🔄',
    color: 'from-orange-500 to-red-500',
    href: '/visualizations',
    tags: ['LSTM', 'GRU', 'Sequence'],
    comingSoon: true,
  },
  {
    title: 'GAN',
    desc: 'Generator vs discriminator: watch the adversarial training process in real-time.',
    icon: '⚔️',
    color: 'from-red-500 to-rose-500',
    href: '/visualizations',
    tags: ['Generator', 'Discriminator', 'Adversarial'],
    comingSoon: true,
  },
  {
    title: 'Diffusion',
    desc: 'Watch pure noise be denoised step by step into a coherent image.',
    icon: '🌫️',
    color: 'from-cyan-500 to-blue-500',
    href: '/visualizations',
    tags: ['Denoising', 'Sampling', 'Latent Space'],
    comingSoon: true,
  },
];

export default function VisualizationsPage() {
  return (
    <div className="space-y-4 sm:space-y-6 max-w-6xl">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold">Visualizations</h1>
        <p className="text-sm text-muted-foreground">
          Interactive visualizations of neural network architectures. Click to explore.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {architectures.map((arch, i) => (
          <motion.div
            key={arch.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link href={arch.comingSoon ? '#' : arch.href} className={`block h-full ${arch.comingSoon ? 'pointer-events-none' : ''}`}>
              <GlassCard hover={!arch.comingSoon} className={`h-full group ${arch.comingSoon ? 'opacity-60' : ''}`}>
                <div className="p-5 sm:p-6 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${arch.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                      {arch.icon}
                    </div>
                    {arch.comingSoon && <Badge variant="warning" className="text-[10px]">Soon</Badge>}
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base mb-2 group-hover:text-primary transition-colors">
                    {arch.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground flex-1">{arch.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-border">
                    {arch.tags.map((tag) => (
                      <Badge key={tag} variant="default" className="text-[10px]">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Coming soon details */}
      <GlassCard>
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-3">
            <Badge variant="warning">Coming Soon</Badge>
            <span className="text-sm font-medium">CNN, RNN, GAN, Diffusion & Neural Network Pages</span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Dedicated interactive playgrounds for these architectures are under development.
            For now, explore the <Link href="/playground/attention" className="text-primary hover:underline">Transformer</Link> visualization which covers attention mechanisms and neural network internals.
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
