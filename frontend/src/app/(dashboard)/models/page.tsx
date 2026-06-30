'use client';

import { useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { IconProvider, IconGem, IconBot, IconSearch, IconSnowflake } from '@/components/ui/Icons';
import { GlassCard, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';

const allModels = [
  {
    id: 'nemotron-3-ultra', name: 'Nemotron 3 Ultra', provider: 'NVIDIA', icon: <IconProvider size={16} className="text-green-400" />,
    latency: '0.6s', cost: 'Free', context: '128K',
    capabilities: ['Free', '550B MoE', 'Fast', 'Reasoning'],
    color: 'from-green-500 to-emerald-500',
    description: 'NVIDIA\'s most powerful Nemotron, 550B MoE model — free tier on OpenRouter.',
  },
  {
    id: 'gemma-4-31b-it', name: 'Gemma 4 31B', provider: 'Google', icon: <IconGem size={16} className="text-cyan-400" />,
    latency: '0.8s', cost: 'Free', context: '1M',
    capabilities: ['Free', '1M Context', 'Latest', 'Reasoning'],
    color: 'from-blue-400 to-cyan-400',
    description: 'Google\'s latest Gemma 4 flagship with 1M context window — free tier on OpenRouter.',
  },
  {
    id: 'gemma-4-26b-a4b-it', name: 'Gemma 4 26B', provider: 'Google', icon: <IconGem size={16} className="text-cyan-400" />,
    latency: '0.6s', cost: 'Free', context: '1M',
    capabilities: ['Free', 'MoE', '1M Context', 'Efficient'],
    color: 'from-blue-500 to-cyan-500',
    description: 'Google\'s MoE Gemma 4 model — fast, efficient, free on OpenRouter.',
  },
  {
    id: 'gemma-3-12b-it', name: 'Gemma 3 12B', provider: 'Google', icon: <IconGem size={16} className="text-cyan-400" />,
    latency: '0.5s', cost: 'Free', context: '128K',
    capabilities: ['Free', 'Fast', 'Open Source', 'Balanced'],
    color: 'from-blue-600 to-cyan-600',
    description: 'Google\'s well-rounded open model with strong quality.',
  },
  {
    id: 'llama-3.1-70b', name: 'Llama 3.1 70B', provider: 'Meta', icon: <IconBot size={16} className="text-orange-400" />,
    latency: '1.5s', cost: 'Free (Open Source)', context: '128K',
    capabilities: ['Open Source', 'Code', 'Reasoning', 'On-premise'],
    color: 'from-purple-400 to-purple-600',
    description: 'Meta\'s open-source large language model, deployable on-premise.',
  },
  {
    id: 'mistral-large', name: 'Mistral Large', provider: 'Mistral', icon: <IconSnowflake size={16} className="text-blue-400" />,
    latency: '1.1s', cost: '$8 / 1M tokens', context: '128K',
    capabilities: ['Multilingual', 'Code', 'Reasoning', 'Open Source'],
    color: 'from-cyan-400 to-cyan-600',
    description: 'Mistral\'s flagship model with strong multilingual and code capabilities.',
  },
];

export default function ModelsPage() {
  const [selected, setSelected] = useState('nemotron-3-ultra');
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? allModels : allModels.filter((m) => m.provider.toLowerCase() === filter);

  return (
    <div className="space-y-4 sm:space-y-6 max-w-6xl">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold">AI Models</h1>
        <p className="text-sm text-muted-foreground">
          Compare and switch between different AI models. Select one to use in the playground.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Tabs
          tabs={[
            { id: 'all', label: 'All' },
            { id: 'google', label: 'Google', icon: <IconGem size={16} className="text-cyan-400" /> },
            { id: 'nvidia', label: 'NVIDIA', icon: <IconProvider size={16} className="text-green-400" /> },
            { id: 'meta', label: 'Meta', icon: <IconBot size={16} className="text-orange-400" /> },
            { id: 'mistral', label: 'Mistral', icon: <IconSnowflake size={16} className="text-blue-400" /> },
          ]}
          activeTab={filter}
          onChange={setFilter}
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((model, i) => (
          <motion.div
            key={model.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <GlassCard
              hover
              onClick={() => setSelected(model.id)}
              className={`relative overflow-hidden ${selected === model.id ? 'border-primary ring-1 ring-primary/30' : ''}`}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r opacity-60 ${model.color}" />
              <CardContent>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="text-2xl shrink-0">{model.icon}</span>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm truncate">{model.name}</h3>
                      <p className="text-xs text-muted-foreground">{model.provider}</p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      selected === model.id ? 'border-primary' : 'border-border'
                    }`}>
                      {selected === model.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-3 line-clamp-2">{model.description}</p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {model.capabilities.map((cap) => (
                    <Badge key={cap} variant="default" className="text-[10px]">{cap}</Badge>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-border text-xs">
                  <div>
                    <p className="text-muted-foreground">Latency</p>
                    <p className="font-mono font-medium">{model.latency}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Context</p>
                    <p className="font-mono font-medium">{model.context}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Pricing</p>
                    <p className="font-mono font-medium text-[10px] leading-tight">{model.cost}</p>
                  </div>
                </div>
              </CardContent>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Selected model actions */}
      {selected && (
        <GlassCard>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">
                  Active: {allModels.find((m) => m.id === selected)?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  This model will be used in the playground and API requests
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm">View Details</Button>
                <Button size="sm">Use in Playground</Button>
              </div>
            </div>
          </CardContent>
        </GlassCard>
      )}
    </div>
  );
}
