'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { GlassCard, CardContent } from '@/components/ui/Card';
import { getApiUrl } from '@/lib/api';
import { IconTokens, IconEmbed, IconTarget, IconZap, IconBrain, IconShield, IconCheck } from '@/components/ui/Icons';

const pipelineSteps: { id: string; label: string; icon: ReactNode }[] = [
  { id: 'tokenize', label: 'Tokenizing', icon: <IconTokens size={12} /> },
  { id: 'embed', label: 'Embedding', icon: <IconEmbed size={12} /> },
  { id: 'attention', label: 'Attention', icon: <IconTarget size={12} /> },
  { id: 'layers', label: 'Transformer Layers', icon: <IconZap size={12} /> },
  { id: 'reasoning', label: 'Reasoning', icon: <IconBrain size={12} /> },
  { id: 'safety', label: 'Safety', icon: <IconShield size={12} /> },
];

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  stats?: { label: string; value: string }[];
  model?: string;
}

function stripMarkdown(text: string) {
  return text.replace(/^#{1,3}\s*/gm, '').replace(/\*\*/g, '');
}

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Ask me anything and watch the AI processing pipeline come to life. Connected via OpenRouter.',
    },
  ]);
  const [processing, setProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [streamingText, setStreamingText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText, currentStep]);

  const animateSteps = async (stepDurations: number[]) => {
    for (let i = 0; i < pipelineSteps.length; i++) {
      setCurrentStep(i);
      const delay = stepDurations[i] || 150;
      await new Promise((r) => setTimeout(r, Math.max(30, delay * 0.8)));
    }
  };

  const streamText = async (text: string) => {
    setStreamingText('');
    const words = text.split(' ');
    for (let i = 0; i < words.length; i++) {
      setStreamingText((prev) => prev + (i > 0 ? ' ' : '') + words[i]);
      await new Promise((r) => setTimeout(r, 15 + Math.random() * 25));
    }
    return text;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || processing) return;

    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setProcessing(true);
    setCurrentStep(0);
    const promptText = input;
    setInput('');

    try {
      const res = await fetch(getApiUrl('/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText, model: 'nvidia/nemotron-3-ultra-550b-a55b:free' }),
      });

      if (res.ok) {
        const data = await res.json();
        const durations = (data.processing_steps || []).map((s: { duration: number }) => s.duration);
        await animateSteps(durations);
        const cleaned = stripMarkdown(data.content);
        const finalText = await streamText(cleaned);
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: 'assistant',
            content: finalText,
            model: data.model,
            stats: [
              { label: 'Tokens', value: `${data.prompt_tokens || '?'} → ${data.completion_tokens || '?'}` },
              { label: 'Latency', value: `${(data.latency || 0).toFixed(0)}ms` },
              { label: 'Cost', value: `$${(data.cost || 0).toFixed(4)}` },
              { label: 'Model', value: data.model?.split('/').pop()?.replace(':free', '') || 'nemotron-3-ultra' },
            ],
          },
        ]);
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error || `HTTP ${res.status}`);
      }
    } catch (err) {
      await animateSteps([]);
      const errMsg = err instanceof Error ? err.message : 'Request failed';
      const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      const hint = isLocal
        ? 'Make sure the backend server is running on port 8000 (`uvicorn app.main:app --reload --port 8000` from backend/)'
        : errMsg;
      const finalText = await streamText(`(!) Error: ${hint}`);
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: 'assistant', content: finalText },
      ]);
    }

    setProcessing(false);
    setCurrentStep(-1);
    setStreamingText('');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 h-full min-h-[calc(100vh-8rem)]">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 scrollbar-thin">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[95%] sm:max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'glass'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed text-justify">{msg.content}</p>
                  {msg.stats && (
                    <div className="mt-3 pt-3 border-t border-border/50 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      {msg.stats.map((s) => (
                        <span key={s.label} className="font-mono">
                          {s.label}: <span className="text-foreground">{s.value}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {streamingText && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="max-w-[85%] glass rounded-2xl px-4 py-3">
                <p className="text-sm whitespace-pre-wrap leading-relaxed text-justify">
                  {streamingText}
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block w-0.5 h-4 bg-[var(--neon-blue)] ml-0.5 align-middle"
                  />
                </p>
              </div>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            disabled={processing}
            className="flex-1 glass rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors border border-border disabled:opacity-50 min-w-0"
          />
          <Button type="submit" disabled={processing || !input.trim()} loading={processing}>
            Send
          </Button>
        </form>
      </div>

      <div className="w-full lg:w-72 xl:w-80 shrink-0">
        <GlassCard>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Pipeline</h3>
              {processing ? (
                <Badge variant="info">
                  <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse-glow" />
                  Live
                </Badge>
              ) : (
                <Badge variant="success">Ready</Badge>
              )}
            </div>
            <div className="space-y-0.5">
              {pipelineSteps.map((step, i) => {
                const isActive = i === currentStep;
                const isDone = i < currentStep;
                return (
                  <div
                    key={step.id}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                      isActive ? 'bg-primary/10 text-primary font-medium' : isDone ? 'text-muted-foreground' : 'text-muted-foreground/40'
                    }`}
                  >
                    <span className="text-sm">{step.icon}</span>
                    <span className="flex-1 truncate">{step.label}</span>
                    {isActive && (
                      <div className="w-12 sm:w-16 h-1 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)]"
                          animate={{ width: ['0%', '100%'] }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                        />
                      </div>
                    )}
                    {isDone && <IconCheck size={12} className="text-[var(--neon-green)] shrink-0" />}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-[var(--neon-green)]" />
                OpenRouter connected
              </div>
            </div>
          </CardContent>
        </GlassCard>
      </div>
    </div>
  );
}
