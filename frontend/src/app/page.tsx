'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { IconZap, IconBook, IconChart, IconWrench, IconCheck, IconBrain, IconTarget, IconSparkles } from '@/components/ui/Icons';

const features = [
  { title: 'AI Playground', desc: 'Experiment with AI in real time.', icon: <IconBrain size={22} />, href: '/playground/chat', color: '#082C4E' },
  { title: 'Learn AI', desc: 'Interactive AI lessons from beginner to advanced.', icon: <IconBook size={22} />, href: '/learn', color: '#16A34A' },
  { title: 'Visualizations', desc: 'See how AI works internally.', icon: <IconChart size={22} />, href: '/visualizations', color: '#082C4E' },
  { title: 'Agent Builder', desc: 'Build AI workflows visually.', icon: <IconWrench size={22} />, href: '/agent-builder', color: '#16A34A' },
];

const timelineSteps = [
  { label: 'Input Prompt', icon: 'IN' },
  { label: 'Tokenization', icon: 'TK' },
  { label: 'Embeddings', icon: 'EM' },
  { label: 'Attention', icon: 'AT' },
  { label: 'Transformer Layers', icon: 'TL' },
  { label: 'Reasoning', icon: 'RN' },
  { label: 'Safety', icon: 'SF' },
  { label: 'Response', icon: 'RE' },
];

const popularLessons = [
  { title: 'What is AI?', difficulty: 'Beginner', duration: '10 min', color: '#082C4E', href: '/learn' },
  { title: 'Machine Learning Basics', difficulty: 'Beginner', duration: '15 min', color: '#16A34A', href: '/learn' },
  { title: 'Neural Networks', difficulty: 'Intermediate', duration: '20 min', color: '#082C4E', href: '/learn' },
  { title: 'Transformers', difficulty: 'Advanced', duration: '25 min', color: '#16A34A', href: '/learn' },
  { title: 'Prompt Engineering', difficulty: 'Intermediate', duration: '15 min', color: '#082C4E', href: '/learn' },
  { title: 'LLM Architecture', difficulty: 'Advanced', duration: '30 min', color: '#16A34A', href: '/learn' },
  { title: 'Vector Databases', difficulty: 'Intermediate', duration: '20 min', color: '#082C4E', href: '/learn' },
  { title: 'RAG', difficulty: 'Advanced', duration: '25 min', color: '#16A34A', href: '/learn' },
  { title: 'AI Agents', difficulty: 'Advanced', duration: '30 min', color: '#082C4E', href: '/learn' },
  { title: 'Fine Tuning', difficulty: 'Advanced', duration: '35 min', color: '#16A34A', href: '/learn' },
];

export default function LandingPage() {
  const { theme, toggle } = useTheme();
  const [activeTimeline, setActiveTimeline] = useState(-1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (activeTimeline < 0 || activeTimeline >= timelineSteps.length) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + 0.02;
        if (next >= 1) {
          setActiveTimeline((c) => c + 1);
          return 0;
        }
        return next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [activeTimeline]);

  useEffect(() => {
    const t = setTimeout(() => setActiveTimeline(0), 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <img src="/logo.svg" alt="EduAltTech" className="h-7" />
          <div className="flex items-center gap-3">
            <Link href="/playground/chat" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">Playground</Link>
            <Link href="/learn" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">Learn</Link>
            <Link href="/visualizations" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">Visualizations</Link>
            <button onClick={toggle} className="p-2 rounded-lg hover:bg-[#F1F5F9] text-[#64748B] transition-colors ml-2">
              {theme === 'dark' ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
            <Link href="/playground/chat" className="ml-2 px-5 py-2 rounded-xl bg-[#082C4E] text-white text-sm font-medium hover:bg-[#082C4E]/90 transition-all shadow-lg shadow-[#082C4E]/15">
              Start Learning
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#082C4E]/[0.02] via-transparent to-[#16A34A]/[0.02] pointer-events-none" />
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                  <Badge variant="info" className="mb-4">Interactive AI Learning Platform</Badge>
                  <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#0F172A] mb-6 leading-tight">
                    See{' '}
                    <span className="gradient-text">AI</span>
                    {' '}Think.
                  </h1>
                  <p className="text-lg sm:text-xl text-[#64748B] mb-8 max-w-lg leading-relaxed">
                    Learn Artificial Intelligence through beautiful visualizations, interactive experiments, and real-world simulations.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/learn">
                      <Button size="lg" className="w-full sm:w-auto">Start Learning</Button>
                    </Link>
                    <Link href="/playground/chat">
                      <Button variant="secondary" size="lg" className="w-full sm:w-auto">Explore Playground</Button>
                    </Link>
                  </div>
                </motion.div>
              </div>

              {/* Hero illustration */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="hidden lg:block"
              >
                <div className="relative w-full aspect-square max-w-lg mx-auto">
                  <svg viewBox="0 0 400 400" className="w-full h-full">
                    {/* Neural network */}
                    <g opacity="0.3">
                      {[0, 1, 2].map((l) =>
                        Array.from({ length: [5, 6, 4][l] }).map((_, n) => {
                          const x = 60 + l * 120;
                          const y = 60 + (n + 1) * (280 / ([5, 6, 4][l] + 1));
                          return (
                            <g key={`n${l}-${n}`}>
                              {l < 2 && Array.from({ length: [5, 6, 4][l + 1] }).map((_, m) => {
                                const x2 = 60 + (l + 1) * 120;
                                const y2 = 60 + (m + 1) * (280 / ([5, 6, 4][l + 1] + 1));
                                return <line key={`w${l}-${n}-${m}`} x1={x} y1={y} x2={x2} y2={y2} stroke="#082C4E" strokeWidth={0.5} opacity={0.2} />;
                              })}
                              <circle cx={x} cy={y} r={6} fill="#082C4E" opacity={0.15} />
                              <circle cx={x} cy={y} r={3} fill="#082C4E" opacity={0.3} />
                            </g>
                          );
                        })
                      )}
                    </g>

                    {/* Brain outline */}
                    <path d="M200 80 C160 80 120 100 120 150 C120 180 135 200 150 210 C140 230 140 260 160 280 C180 300 190 300 200 310 C210 300 220 300 240 280 C260 260 260 230 250 210 C265 200 280 180 280 150 C280 100 240 80 200 80Z" fill="none" stroke="#082C4E" strokeWidth={1.5} opacity={0.2} />
                    <path d="M200 100 C170 100 145 120 145 155 C145 175 155 190 165 200 C158 215 158 240 170 255 C185 270 195 275 200 280 C205 275 215 270 230 255 C242 240 242 215 235 200 C245 190 255 175 255 155 C255 120 230 100 200 100Z" fill="none" stroke="#16A34A" strokeWidth={1} opacity={0.3} />

                    {/* Data nodes */}
                    {[
                      { x: 60, y: 60 }, { x: 340, y: 60 }, { x: 60, y: 340 }, { x: 340, y: 340 },
                      { x: 200, y: 40 }, { x: 200, y: 360 }, { x: 40, y: 200 }, { x: 360, y: 200 },
                    ].map((p, i) => (
                      <g key={`node-${i}`}>
                        <circle cx={p.x} cy={p.y} r={4} fill="#16A34A" opacity={0.4} className="animate-pulse-glow" style={{ animationDelay: `${i * 0.3}s` }} />
                        <circle cx={p.x} cy={p.y} r="8" fill="none" stroke="#16A34A" strokeWidth={0.5} opacity={0.2} />
                      </g>
                    ))}

                    {/* Signal lines */}
                    <motion.path
                      d="M60 60 Q130 30 200 40 Q270 50 340 60"
                      fill="none" stroke="#16A34A" strokeWidth={1.5} opacity={0.5}
                      strokeDasharray="4 4"
                      animate={{ strokeDashoffset: [0, -20] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <motion.path
                      d="M60 340 Q130 370 200 360 Q270 350 340 340"
                      fill="none" stroke="#16A34A" strokeWidth={1.5} opacity={0.5}
                      strokeDasharray="4 4"
                      animate={{ strokeDashoffset: [0, -20] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    />

                    {/* Book */}
                    <g transform="translate(155, 140)" opacity="0.4">
                      <rect x="0" y="0" width="90" height="70" rx="4" fill="none" stroke="#082C4E" strokeWidth={1} />
                      <line x1="45" y1="0" x2="45" y2="70" stroke="#082C4E" strokeWidth={0.5} />
                      <line x1="10" y1="15" x2="35" y2="15" stroke="#082C4E" strokeWidth={0.5} />
                      <line x1="10" y1="25" x2="35" y2="25" stroke="#082C4E" strokeWidth={0.5} />
                      <line x1="10" y1="35" x2="35" y2="35" stroke="#082C4E" strokeWidth={0.5} />
                      <line x1="55" y1="15" x2="80" y2="15" stroke="#082C4E" strokeWidth={0.5} />
                      <line x1="55" y1="25" x2="80" y2="25" stroke="#082C4E" strokeWidth={0.5} />
                      <line x1="55" y1="35" x2="80" y2="35" stroke="#082C4E" strokeWidth={0.5} />
                    </g>

                    {/* AI Pipeline */}
                    <g transform="translate(120, 260)" opacity="0.3">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <rect key={`pipe-${i}`} x={i * 42} y={0} width={38} height={16} rx={3} fill={i % 2 === 0 ? "#082C4E" : "#16A34A"} opacity={0.15 + i * 0.05} />
                      ))}
                    </g>
                  </svg>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Dashboard Cards */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link href={f.href} className="block h-full">
                    <GlassCard hover className="h-full p-6">
                      <div className="flex flex-col h-full">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                          style={{ background: `${f.color}10`, color: f.color }}
                        >
                          {f.icon}
                        </div>
                        <h3 className="font-semibold text-[#0F172A] text-sm mb-1.5">{f.title}</h3>
                        <p className="text-sm text-[#64748B] flex-1">{f.desc}</p>
                        <span className="text-sm font-medium mt-4" style={{ color: f.color }}>
                          {f.title === 'AI Playground' ? 'Try Now →' : f.title === 'Learn AI' ? 'Start Learning →' : 'Explore →'}
                        </span>
                      </div>
                    </GlassCard>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Learning Progress */}
        <section className="py-16 px-6 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Circular progress */}
              <GlassCard className="p-8 flex flex-col items-center text-center">
                <div className="relative w-32 h-32 mb-6">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#E5E7EB" strokeWidth="8" />
                    <motion.circle
                      cx="50" cy="50" r="42" fill="none" stroke="#16A34A" strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={264}
                      initial={{ strokeDashoffset: 264 }}
                      animate={{ strokeDashoffset: 264 * 0.28 }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-3xl font-bold text-[#0F172A]">72%</span>
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold text-[#0F172A] mb-1">Learning Progress</h3>
                <p className="text-sm text-[#64748B] mb-4">18 / 25 Lessons</p>
                <Button size="sm" variant="outline">Continue Learning</Button>
              </GlassCard>

              {/* Recent lessons */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xl font-bold text-[#0F172A]">Continue Learning</h2>
                {[
                  { title: 'What is AI?', duration: '10 min', progress: 100, icon: <IconBrain size={16} /> },
                  { title: 'Neural Networks', duration: '20 min', progress: 65, icon: <IconTarget size={16} /> },
                  { title: 'Transformers', duration: '25 min', progress: 30, icon: <IconZap size={16} /> },
                ].map((lesson) => (
                  <GlassCard key={lesson.title} hover className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#082C4E]/10 flex items-center justify-center text-[#082C4E] shrink-0">
                        {lesson.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-[#0F172A]">{lesson.title}</h4>
                        <p className="text-xs text-[#64748B]">{lesson.duration}</p>
                        <div className="w-full h-1.5 rounded-full bg-[#E5E7EB] mt-2">
                          <div className="h-full rounded-full bg-[#16A34A]" style={{ width: `${lesson.progress}%` }} />
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">Resume</Button>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How AI Works Timeline */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-4">How AI Works</h2>
            <p className="text-[#64748B] mb-12 max-w-xl mx-auto">Follow your prompt through the AI pipeline — from input to response.</p>
            <div className="flex items-center justify-center gap-0 overflow-x-auto pb-4">
              {timelineSteps.map((step, i) => (
                <div key={step.label} className="flex items-center">
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setActiveTimeline(i)}
                    className={`relative flex flex-col items-center px-3 py-4 rounded-xl transition-all min-w-[80px] ${
                      i <= activeTimeline ? 'bg-[#082C4E]/5' : 'opacity-50'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold mb-2 transition-all ${
                      i <= activeTimeline ? 'bg-[#082C4E] text-white shadow-md' : 'bg-[#F1F5F9] text-[#64748B]'
                    }`}>
                      {step.icon}
                    </div>
                    <span className="text-[10px] font-medium text-[#64748B] whitespace-nowrap">{step.label}</span>
                    {i <= activeTimeline && i > 0 && (
                      <motion.div
                        className="absolute -left-1 top-1/2 w-2 h-0.5 bg-[#16A34A]"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                      />
                    )}
                  </motion.button>
                  {i < timelineSteps.length - 1 && (
                    <div className={`w-6 h-0.5 ${i < activeTimeline ? 'bg-[#16A34A]' : 'bg-[#E5E7EB]'} transition-colors`} />
                  )}
                </div>
              ))}
            </div>
            <AnimatePresence mode="wait">
              {activeTimeline >= 0 && activeTimeline < timelineSteps.length && (
                <motion.div
                  key={activeTimeline}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-8 p-6 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] text-left max-w-lg mx-auto"
                >
                  <p className="text-sm text-[#64748B]">
                    {activeTimeline === 0 && 'Your input text is received and prepared for processing.'}
                    {activeTimeline === 1 && 'The text is split into tokens (words/subwords) that the model can understand.'}
                    {activeTimeline === 2 && 'Each token is converted into a high-dimensional vector representation.'}
                    {activeTimeline === 3 && 'The model computes attention scores between all tokens to understand context.'}
                    {activeTimeline === 4 && 'Data flows through stacked transformer layers, each refining the representation.'}
                    {activeTimeline === 5 && 'The model generates an understanding and predicts the next token.'}
                    {activeTimeline === 6 && 'Safety checks ensure the output is appropriate and harmless.'}
                    {activeTimeline === 7 && 'The final response is streamed back token by token.'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Popular Lessons */}
        <section className="py-20 px-6 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">Popular Lessons</h2>
                <p className="text-[#64748B] mt-1">Start your AI learning journey</p>
              </div>
              <Link href="/learn">
                <Button variant="ghost" size="sm">View All →</Button>
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {popularLessons.map((lesson, i) => (
                <motion.div
                  key={lesson.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link href={lesson.href}>
                    <GlassCard hover className="h-full p-5">
                      <div className="flex flex-col h-full">
                        <div
                          className="w-full h-20 rounded-xl mb-4 flex items-center justify-center"
                          style={{ background: `${lesson.color}08` }}
                        >
                          <svg className="w-8 h-8" style={{ color: lesson.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <h3 className="text-sm font-semibold text-[#0F172A] mb-2">{lesson.title}</h3>
                        <div className="flex items-center gap-2 mt-auto">
                          <Badge variant={lesson.difficulty === 'Beginner' ? 'success' : lesson.difficulty === 'Intermediate' ? 'warning' : 'danger'}>
                            {lesson.difficulty}
                          </Badge>
                          <span className="text-xs text-[#64748B]">{lesson.duration}</span>
                        </div>
                      </div>
                    </GlassCard>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#E5E7EB] py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
              <div className="lg:col-span-2">
                <img src="/logo.svg" alt="EduAltTech" className="h-7 mb-4" />
                <p className="text-sm text-[#64748B] max-w-sm">
                  Learn Artificial Intelligence through beautiful visualizations, interactive experiments, and real-world simulations.
                </p>
              </div>
              {[
                { title: 'Product', links: ['Documentation', 'API', 'Pricing', 'Changelog'] },
                { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
                { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'Cookies'] },
              ].map((col) => (
                <div key={col.title}>
                  <h4 className="font-semibold text-sm text-[#0F172A] mb-3">{col.title}</h4>
                  <ul className="space-y-2">
                    {col.links.map((link) => (
                      <li key={link}>
                        <a href="#" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">{link}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="pt-8 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#64748B]">
              <p>&copy; 2026 EduAltTech. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <a href="#" className="hover:text-[#0F172A] transition-colors">Twitter</a>
                <a href="#" className="hover:text-[#0F172A] transition-colors">GitHub</a>
                <a href="#" className="hover:text-[#0F172A] transition-colors">LinkedIn</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
