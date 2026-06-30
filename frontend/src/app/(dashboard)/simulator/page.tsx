'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { ProgressBar } from '@/components/ui/Progress';

const simulationSteps = [
  { id: 'receive', label: 'Receiving Input', icon: '📨' },
  { id: 'tokenize', label: 'Tokenizing Text', icon: '🔤' },
  { id: 'embed', label: 'Generating Embeddings', icon: '🌌' },
  { id: 'process', label: 'Processing through Layers', icon: '⚡' },
  { id: 'generate', label: 'Generating Response', icon: '✨' },
];

export default function SimulatorPage() {
  const [prompt, setPrompt] = useState('');
  const [simulating, setSimulating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<null | {
    tokens: number;
    latency: number;
    cost: number;
  }>(null);

  const handleSimulate = async () => {
    if (!prompt.trim() || simulating) return;
    setSimulating(true);
    setResult(null);
    setProgress(0);

    for (let i = 0; i <= 100; i += Math.random() * 5 + 2) {
      setProgress(Math.min(100, i));
      await new Promise((r) => setTimeout(r, 30 + Math.random() * 50));
    }

    setProgress(100);
    const tokenCount = Math.ceil(prompt.length * 0.4);
    await new Promise((r) => setTimeout(r, 300));

    setResult({
      tokens: tokenCount,
      latency: tokenCount * 2,
      cost: tokenCount * 0.000003,
    });
    setSimulating(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold">AI Simulator</h1>
        <p className="text-sm text-muted-foreground">
          Simulate AI responses without an API key. See the estimated cost, latency, and token usage.
        </p>
      </div>

      <GlassCard>
        <CardContent>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a prompt to simulate..."
            rows={4}
            className="text-base"
          />
          <div className="flex justify-end mt-4">
            <Button onClick={handleSimulate} loading={simulating} disabled={!prompt.trim()}>
              {simulating ? 'Simulating...' : 'Simulate'}
            </Button>
          </div>
        </CardContent>
      </GlassCard>

      {/* Progress */}
      {simulating && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <GlassCard>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="info">
                  <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse-glow" />
                  Simulating
                </Badge>
                <span className="text-xs font-mono text-muted-foreground">{progress.toFixed(0)}%</span>
              </div>
              <ProgressBar value={progress} size="md" variant="default" />
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {simulationSteps.map((step, i) => {
                  const stepProgress = (i + 1) / simulationSteps.length * 100;
                  const isDone = progress >= stepProgress;
                  const isActive = !isDone && progress >= stepProgress - 100 / simulationSteps.length;
                  return (
                    <div
                      key={step.id}
                      className={`text-center p-2 rounded-lg text-xs transition-all ${
                        isDone ? 'bg-success/10 text-success' : isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground/50'
                      }`}
                    >
                      <div className="text-lg mb-1">{step.icon}</div>
                      <span className="text-[10px]">{step.label}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </GlassCard>
        </motion.div>
      )}

      {/* Results */}
      {result && !simulating && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard>
            <CardHeader
              title="Simulation Results"
              action={<Badge variant="success">Complete</Badge>}
            />
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Token Count', value: `${result.tokens.toLocaleString()} tokens` },
                  { label: 'Estimated Latency', value: `${result.latency.toFixed(0)} ms` },
                  { label: 'Estimated Cost', value: `$${result.cost.toFixed(6)}` },
                ].map((stat) => (
                  <div key={stat.label} className="glass rounded-xl p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-lg sm:text-xl font-bold font-mono">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="glass rounded-xl p-4 space-y-3">
                <p className="text-xs font-medium text-muted-foreground">Breakdown</p>
                {[
                  { label: 'Input Length', value: `${prompt.length} characters` },
                  { label: 'Est. Tokens', value: `${result.tokens} tokens` },
                  { label: 'Speed', value: `${(result.tokens / (result.latency / 1000)).toFixed(0)} tok/s` },
                  { label: 'Cost per Token', value: `$${(result.cost / result.tokens).toExponential(4)}` },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between text-xs py-1.5 border-b border-border last:border-0">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-mono">{row.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </GlassCard>

          <GlassCard className="mt-4">
            <CardHeader title="Real-world Comparison" />
            <CardContent>
              <p className="text-xs text-muted-foreground mb-4">
                How this prompt would perform across different providers:
              </p>
              <div className="space-y-3">
                {[
                  { model: 'GPT-4o', latency: result.latency * 0.8, cost: result.cost * 3.3 },
                  { model: 'Claude 3 Opus', latency: result.latency * 1.2, cost: result.cost * 5 },
                  { model: 'Gemini 1.5 Pro', latency: result.latency * 0.6, cost: result.cost * 1.2 },
                  { model: 'Llama 3.1 70B', latency: result.latency * 1.0, cost: 0 },
                ].map((cmp) => (
                  <div key={cmp.model} className="flex items-center justify-between text-xs">
                    <span className="font-mono w-28">{cmp.model}</span>
                    <span>{cmp.latency.toFixed(0)}ms</span>
                    <span className="font-mono">{cmp.cost === 0 ? 'Free' : `$${cmp.cost.toFixed(6)}`}</span>
                    <div className="w-16 sm:w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)]"
                        style={{ width: `${Math.min(100, (cmp.latency / (result.latency * 1.5)) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </GlassCard>
        </motion.div>
      )}

      {!prompt && !simulating && !result && (
        <GlassCard>
          <CardContent className="text-center py-12">
            <p className="text-3xl mb-3">🎮</p>
            <p className="text-sm text-muted-foreground">
              Enter a prompt above and click Simulate to see estimated costs and latency.
            </p>
          </CardContent>
        </GlassCard>
      )}
    </div>
  );
}
