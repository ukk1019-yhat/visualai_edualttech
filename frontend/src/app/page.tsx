'use client';

import { useState, useEffect, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { IconReceive, IconTokens, IconEmbed, IconTarget, IconZap, IconBrain, IconShield, IconSparkles, IconSearch, IconClock, IconWrench, IconChart, IconCheck } from '@/components/ui/Icons';
import { useTheme } from '@/components/ThemeProvider';

const pipelineSteps: { label: string; duration: number; icon: ReactNode }[] = [
  { label: 'Receiving Prompt', duration: 600, icon: <IconReceive size={14} /> },
  { label: 'Tokenizing', duration: 400, icon: <IconTokens size={14} /> },
  { label: 'Embedding', duration: 500, icon: <IconEmbed size={14} /> },
  { label: 'Attention', duration: 700, icon: <IconTarget size={14} /> },
  { label: 'Transformer Layers', duration: 900, icon: <IconZap size={14} /> },
  { label: 'Reasoning', duration: 600, icon: <IconBrain size={14} /> },
  { label: 'Safety', duration: 300, icon: <IconShield size={14} /> },
  { label: 'Final Answer', duration: 400, icon: <IconSparkles size={14} /> },
];

export default function LandingPage() {
  const [currentStep, setCurrentStep] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [restart, setRestart] = useState(false);

  const animate = useCallback(() => {
    setCurrentStep(0);
    setProgress(0);
  }, []);

  useEffect(() => {
    if (restart) { setRestart(false); return; }
    const t = setTimeout(() => animate(), 1500);
    return () => clearTimeout(t);
  }, [restart, animate]);

  useEffect(() => {
    if (currentStep < 0 || currentStep >= pipelineSteps.length) return;
    const step = pipelineSteps[currentStep];
    const interval = 30;
    const increment = interval / step.duration;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 1) {
          setCurrentStep((c) => c + 1);
          return 0;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [currentStep]);

  const handleRestart = () => {
    setCurrentStep(-1);
    setRestart(true);
    setTimeout(() => animate(), 100);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="EAT Neural Flow" className="h-7" />
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggleLanding />
            <Link href="/playground/chat" className="hidden sm:inline-flex text-sm text-muted-foreground hover:text-foreground transition-colors">Playground</Link>
            <Link href="/visualizations" className="hidden sm:inline-flex text-sm text-muted-foreground hover:text-foreground transition-colors">Visualizations</Link>
            <Link href="/learn" className="hidden sm:inline-flex text-sm text-muted-foreground hover:text-foreground transition-colors">Learn</Link>
            <Link
              href="/playground/chat"
              className="ml-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all shadow-lg shadow-primary/20"
            >
              Start Visualizing
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero */}
        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 sm:px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--neon-blue)]/5 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-1/4 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-[var(--neon-blue)]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-[var(--neon-purple)]/10 rounded-full blur-3xl pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl relative z-10 w-full"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs sm:text-sm text-muted-foreground mb-6 sm:mb-8"
            >
              <div className="w-2 h-2 rounded-full bg-[var(--neon-green)] animate-pulse-glow" />
              AI Visualization Platform
            </motion.div>

            <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight mb-4 sm:mb-6 leading-tight">
              <span className="bg-gradient-to-r from-foreground via-[var(--neon-blue)] to-[var(--neon-purple)] bg-clip-text text-transparent">
                See AI Think
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-2 max-w-2xl mx-auto px-4">
              Watch every token, every neuron, every attention head, every decision.
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground/60 mb-8 sm:mb-12">
              Real-time AI visualization platform
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
              <Link
                href="/playground/chat"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-base sm:text-lg hover:opacity-90 transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] text-center"
              >
                Start Visualizing
              </Link>
              <Link
                href="/learn"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl glass text-foreground font-medium text-base sm:text-lg hover:bg-sidebar-hover transition-all text-center"
              >
                Learn AI
              </Link>
            </div>
          </motion.div>

          {/* Animated pipeline */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-8 sm:mt-16 w-full max-w-lg px-4 relative z-10"
          >
            <div className="glass rounded-2xl p-4 sm:p-6 space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                  <span className="w-2 h-2 rounded-full bg-[var(--neon-green)]" />
                  Processing in real-time
                </div>
                <button
                  onClick={handleRestart}
                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  Restart ↻
                </button>
              </div>
              <AnimatePresence mode="wait">
                {pipelineSteps.map((step, i) => (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{
                      opacity: i <= currentStep && currentStep < pipelineSteps.length ? 1 : i > currentStep ? 0.25 : 0.7,
                      x: 0,
                    }}
                    className="flex items-center gap-2 sm:gap-3"
                  >
                    <div
                      className={cn(
                        'w-2 h-2 rounded-full shrink-0 transition-colors duration-300',
                        i < currentStep && 'bg-[var(--neon-green)]',
                        i === currentStep && currentStep < pipelineSteps.length && 'bg-[var(--neon-blue)] animate-pulse-glow',
                        (i > currentStep || currentStep >= pipelineSteps.length) && 'bg-muted-foreground/30'
                      )}
                    />
                    <span className="text-xs sm:text-sm">{step.icon}</span>
                    <span
                      className={cn(
                        'flex-1 text-xs sm:text-sm font-mono transition-colors duration-300',
                        i <= currentStep && currentStep < pipelineSteps.length ? 'text-foreground' : 'text-muted-foreground'
                      )}
                    >
                      {step.label}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono hidden xs:inline">{step.duration}ms</span>
                    {i === currentStep && currentStep < pipelineSteps.length && (
                      <div className="w-16 sm:w-24 h-1.5 rounded-full bg-muted overflow-hidden shrink-0">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)]"
                          animate={{ width: `${progress * 100}%` }}
                        />
                      </div>
                    )}
                    {i < currentStep && <IconCheck size={12} className="text-[var(--neon-green)] shrink-0" />}
                    {i === currentStep && currentStep >= pipelineSteps.length && (
                      <IconCheck size={12} className="text-[var(--neon-green)] shrink-0" />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              {currentStep >= pipelineSteps.length && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-sm text-[var(--neon-green)] font-mono mt-4"
                >
                  <IconCheck size={12} className="inline mr-1" /> Response complete
                </motion.p>
              )}
            </div>
          </motion.div>
        </section>

        {/* Features */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 border-t border-border">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 sm:mb-16 px-4">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] bg-clip-text text-transparent">
                See AI Think
              </span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-0">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="glass rounded-xl p-5 sm:p-6 hover:border-primary/30 transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-8 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="EAT Neural Flow" className="h-5" />
            </div>
            <p>Built with Next.js, FastAPI, and Three.js</p>
          </div>
        </footer>
      </main>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

function ThemeToggleLanding() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      {theme === 'dark' ? (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}

const features = [
  { title: 'Token Viewer', desc: 'See how your input gets split into tokens with probabilities and embeddings.', icon: <IconTokens size={20} /> },
  { title: 'Attention Maps', desc: 'Watch attention heads light up as the model connects words across your input.', icon: <IconTarget size={20} /> },
  { title: 'Transformer Layers', desc: 'Animate through all 32+ layers of the transformer in real-time.', icon: <IconZap size={20} /> },
  { title: 'Reasoning Timeline', desc: 'Every millisecond of AI reasoning visualized like Chrome DevTools.', icon: <IconClock size={20} /> },
  { title: 'Agent Builder', desc: 'Drag-and-drop interface to build custom AI agent workflows.', icon: <IconWrench size={20} /> },
  { title: 'Cost Analytics', desc: 'Track tokens, latency, and cost for every request.', icon: <IconChart size={20} /> },
];
