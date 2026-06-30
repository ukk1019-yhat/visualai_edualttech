'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';

const endpoints = [
  {
    method: 'POST',
    path: '/api/chat',
    desc: 'Send a prompt and get a response with visualization data',
    auth: 'API Key',
    body: JSON.stringify({ prompt: 'Explain gravity', model: 'nemotron-3-ultra', stream: false }, null, 2),
    response: JSON.stringify({
      id: 'msg_123',
      content: 'Gravity is a fundamental force...',
      role: 'assistant',
      processing_steps: [
        { id: 'tokenize', label: 'Tokenizing', status: 'complete', duration: 45.2, timestamp: 1234567890 },
        { id: 'embed', label: 'Embedding', status: 'complete', duration: 52.1, timestamp: 1234567890 },
      ],
      prompt_tokens: 12,
      completion_tokens: 45,
      latency: 810.3,
      cost: 0.0032,
    }, null, 2),
  },
  {
    method: 'POST',
    path: '/api/tokenize',
    desc: 'Tokenize text and return detailed token information',
    auth: 'None',
    body: JSON.stringify({ text: 'I love AI', model: 'nemotron-3-ultra' }, null, 2),
    response: JSON.stringify({
      tokens: [
        { id: 342, text: 'I', position: 0 },
        { id: 984, text: 'Love', position: 1 },
        { id: 2123, text: 'AI', position: 2 },
      ],
      total_tokens: 3,
      model: 'gpt-4o',
    }, null, 2),
  },
  {
    method: 'GET',
    path: '/api/models',
    desc: 'List available AI models with pricing and capabilities',
    auth: 'None',
    body: null,
    response: JSON.stringify({
      models: [
        { id: 'nemotron-3-ultra', name: 'Nemotron 3 Ultra', provider: 'nvidia', context_window: 131072, pricing: { input: 0.0, output: 0.0 } },
        { id: 'llama-3.1-70b', name: 'Llama 3.1 70B', provider: 'meta', context_window: 128000, pricing: { input: 0.0, output: 0.0 } },
      ],
    }, null, 2),
  },
  {
    method: 'GET',
    path: '/api/visualize/attention',
    desc: 'Get attention map data for visualization',
    auth: 'None',
    body: null,
    response: JSON.stringify({
      tokens: ['The', 'cat', 'sat', 'on', 'the', 'mat'],
      attention_heads: [
        { layer: 0, head: 0, source_indices: [0, 1, 2, 3, 4, 5], target_indices: [0, 1, 2, 3, 4, 5], weights: [[0.1, 0.6, 0.05, 0.02, 0.03, 0.2]] },
      ],
    }, null, 2),
  },
  {
    method: 'GET',
    path: '/api/visualize/embeddings',
    desc: 'Get embedding coordinates for word visualization',
    auth: 'None',
    body: null,
    response: JSON.stringify({
      points: [
        { word: 'dog', x: 0.25, y: -0.13, z: 0.45, magnitude: 0.92 },
        { word: 'cat', x: 0.18, y: -0.21, z: 0.38, magnitude: 0.87 },
      ],
      dimensions: 1536,
    }, null, 2),
  },
];

export default function ApiPage() {
  const [activeEndpoint, setActiveEndpoint] = useState(0);

  return (
    <div className="space-y-4 sm:space-y-6 max-w-6xl">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold">API</h1>
        <p className="text-sm text-muted-foreground">
          Integrate NeuralFlow visualizations into your own applications.
        </p>
      </div>

      {/* Endpoint tabs */}
      <div className="flex flex-wrap gap-2">
        {endpoints.map((ep, i) => (
          <button
            key={ep.path}
            onClick={() => setActiveEndpoint(i)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              activeEndpoint === i
                ? 'bg-primary/10 text-primary border border-primary/30'
                : 'bg-muted/30 text-muted-foreground border border-border hover:text-foreground'
            }`}
          >
            <span className={`text-[10px] font-bold ${
              ep.method === 'GET' ? 'text-[var(--neon-green)]' : 'text-[var(--neon-blue)]'
            }`}>{ep.method}</span>
            {ep.path}
          </button>
        ))}
      </div>

      {/* Active endpoint */}
      {endpoints.map((ep, i) => (
        i === activeEndpoint && (
          <motion.div
            key={ep.path}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <GlassCard>
              <CardContent>
                <div className="flex items-start gap-4 mb-4">
                  <div className={`px-3 py-1 rounded-lg text-sm font-mono font-bold ${
                    ep.method === 'GET' ? 'bg-[var(--neon-green)]/10 text-[var(--neon-green)]' : 'bg-[var(--neon-blue)]/10 text-[var(--neon-blue)]'
                  }`}>{ep.method}</div>
                  <div className="flex-1 min-w-0">
                    <code className="text-sm font-mono">{ep.path}</code>
                    <p className="text-xs text-muted-foreground mt-1">{ep.desc}</p>
                  </div>
                  <Badge variant="default" className="text-[10px]">{ep.auth}</Badge>
                </div>
              </CardContent>
            </GlassCard>

            <div className="grid md:grid-cols-2 gap-4">
              {ep.body && (
                <GlassCard>
                  <CardHeader title="Request Body" />
                  <CardContent className="p-0">
                    <pre className="p-4 text-xs font-mono overflow-x-auto text-muted-foreground">{ep.body}</pre>
                  </CardContent>
                </GlassCard>
              )}
              <GlassCard>
                <CardHeader title="Response" />
                <CardContent className="p-0">
                  <pre className="p-4 text-xs font-mono overflow-x-auto text-muted-foreground max-h-[300px]">{ep.response}</pre>
                </CardContent>
              </GlassCard>
            </div>
          </motion.div>
        )
      ))}

      {/* Quick start */}
      <GlassCard>
        <CardHeader title="Quick Start" description="Try the API right now with curl" />
        <CardContent>
          <p className="text-xs text-muted-foreground mb-3">Replace with your actual API endpoint:</p>
          <pre className="p-4 rounded-xl bg-muted/50 text-xs sm:text-sm font-mono overflow-x-auto">
{`curl -X POST https://api.neuralflow.dev/chat \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{"prompt": "Explain gravity", "model": "nemotron-3-ultra"}'`}
          </pre>
        </CardContent>
      </GlassCard>
    </div>
  );
}
