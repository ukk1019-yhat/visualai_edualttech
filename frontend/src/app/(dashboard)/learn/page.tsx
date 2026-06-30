'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { IconZap, IconBook, IconWrench, IconChart, IconBrain, IconSparkles, IconCheck, IconTarget } from '@/components/ui/Icons';

type Category = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  lessons: Lesson[];
};

type Lesson = {
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  progress: number;
  href: string;
};

const categories: Category[] = [
  {
    id: 'ai-foundations',
    title: 'AI Foundations',
    description: 'Core concepts — what AI is, how it started, and the fundamental ideas that power modern intelligence.',
    icon: <IconBrain size={22} />,
    color: '#082C4E',
    lessons: [
      { title: 'What is AI?', difficulty: 'Beginner', duration: '10 min', progress: 100, href: '/learn' },
      { title: 'History of AI', difficulty: 'Beginner', duration: '12 min', progress: 0, href: '/learn' },
      { title: 'Machine Learning Basics', difficulty: 'Beginner', duration: '15 min', progress: 0, href: '/learn' },
      { title: 'Types of AI', difficulty: 'Beginner', duration: '10 min', progress: 0, href: '/learn' },
      { title: 'AI Ethics & Safety', difficulty: 'Beginner', duration: '15 min', progress: 0, href: '/learn' },
    ],
  },
  {
    id: 'llms',
    title: 'Large Language Models',
    description: 'Deep dive into transformers, attention mechanisms, and the models behind ChatGPT, Claude, Gemini, and more.',
    icon: <IconZap size={22} />,
    color: '#16A34A',
    lessons: [
      { title: 'What are LLMs?', difficulty: 'Beginner', duration: '15 min', progress: 30, href: '/learn' },
      { title: 'Tokenization & Embeddings', difficulty: 'Intermediate', duration: '20 min', progress: 0, href: '/learn' },
      { title: 'Transformer Architecture', difficulty: 'Advanced', duration: '25 min', progress: 0, href: '/learn' },
      { title: 'Attention Mechanisms', difficulty: 'Advanced', duration: '20 min', progress: 0, href: '/learn' },
      { title: 'Prompt Engineering', difficulty: 'Intermediate', duration: '15 min', progress: 0, href: '/learn' },
    ],
  },
  {
    id: 'generative-ai',
    title: 'Generative AI',
    description: 'How AI creates images, music, code, and video — from diffusion models to multimodal generation.',
    icon: <IconSparkles size={22} />,
    color: '#082C4E',
    lessons: [
      { title: 'Generative AI Overview', difficulty: 'Beginner', duration: '12 min', progress: 0, href: '/learn' },
      { title: 'Diffusion Models', difficulty: 'Advanced', duration: '25 min', progress: 0, href: '/learn' },
      { title: 'VAEs & GANs', difficulty: 'Advanced', duration: '20 min', progress: 0, href: '/learn' },
      { title: 'Multimodal Models', difficulty: 'Intermediate', duration: '20 min', progress: 0, href: '/learn' },
      { title: 'AI Video Generation', difficulty: 'Intermediate', duration: '15 min', progress: 0, href: '/learn' },
    ],
  },
  {
    id: 'ai-engineering',
    title: 'AI Engineering',
    description: 'Build real AI applications — RAG pipelines, fine-tuning, vector databases, and agent architectures.',
    icon: <IconWrench size={22} />,
    color: '#16A34A',
    lessons: [
      { title: 'RAG Architecture', difficulty: 'Intermediate', duration: '20 min', progress: 0, href: '/learn' },
      { title: 'Vector Databases', difficulty: 'Intermediate', duration: '20 min', progress: 0, href: '/learn' },
      { title: 'Fine-Tuning LLMs', difficulty: 'Advanced', duration: '30 min', progress: 0, href: '/learn' },
      { title: 'Mixture of Experts', difficulty: 'Advanced', duration: '25 min', progress: 0, href: '/learn' },
      { title: 'Model Evaluation', difficulty: 'Intermediate', duration: '15 min', progress: 0, href: '/learn' },
    ],
  },
  {
    id: 'build-projects',
    title: 'Build Projects',
    description: 'Hands-on projects where you apply what you\'ve learned — build chatbots, RAG systems, AI agents, and more.',
    icon: <IconTarget size={22} />,
    color: '#082C4E',
    lessons: [
      { title: 'Build a Chatbot', difficulty: 'Intermediate', duration: '30 min', progress: 0, href: '/learn' },
      { title: 'RAG Search System', difficulty: 'Advanced', duration: '45 min', progress: 0, href: '/learn' },
      { title: 'AI Agent Workflow', difficulty: 'Advanced', duration: '40 min', progress: 0, href: '/learn' },
      { title: 'Image Classifier', difficulty: 'Intermediate', duration: '25 min', progress: 0, href: '/learn' },
      { title: 'Deploy an AI Model', difficulty: 'Advanced', duration: '35 min', progress: 0, href: '/learn' },
    ],
  },
];

const allLessons = categories.flatMap((c) => c.lessons.map((l) => ({ ...l, category: c.title, color: c.color })));
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'] as const;

export default function LearnPage() {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('ai-foundations');

  const filteredLessons = activeFilter === 'All'
    ? allLessons.slice(0, 8)
    : allLessons.filter((l) => l.difficulty === activeFilter).slice(0, 8);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-2">Learn AI</h1>
        <p className="text-[#64748B]">Interactive courses — from AI fundamentals to advanced engineering.</p>
      </div>

      {/* Progress summary */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <GlassCard className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#16A34A]/10 flex items-center justify-center text-[#16A34A]">
            <IconCheck size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#0F172A]">3</p>
            <p className="text-sm text-[#64748B]">Completed</p>
          </div>
        </GlassCard>
        <GlassCard className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#082C4E]/10 flex items-center justify-center text-[#082C4E]">
            <IconBook size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#0F172A]">5</p>
            <p className="text-sm text-[#64748B]">In Progress</p>
          </div>
        </GlassCard>
        <GlassCard className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F1F5F9] flex items-center justify-center text-[#64748B]">
            <IconTarget size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#0F172A]">25</p>
            <p className="text-sm text-[#64748B]">Total Lessons</p>
          </div>
        </GlassCard>
      </div>

      {/* Difficulty filter */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {difficulties.map((d) => (
          <button
            key={d}
            onClick={() => setActiveFilter(d)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeFilter === d
                ? 'bg-[#082C4E] text-white shadow-md'
                : 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#F1F5F9] border border-[#E5E7EB]'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Categories */}
      <div className="space-y-10">
        {categories.map((category, ci) => {
          const isExpanded = expandedCategory === category.id;
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: ci * 0.05 }}
            >
              <GlassCard className="overflow-hidden">
                {/* Category header */}
                <button
                  onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-[#F8FAFC] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${category.color}10`, color: category.color }}
                    >
                      {category.icon}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-[#0F172A]">{category.title}</h2>
                      <p className="text-sm text-[#64748B] hidden sm:block">{category.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#64748B]">{category.lessons.length} lessons</span>
                    <svg
                      className={`w-5 h-5 text-[#64748B] transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Lessons grid */}
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-[#E5E7EB]"
                  >
                    <div className="p-5 sm:p-6 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                      {category.lessons.map((lesson, li) => (
                        <motion.div
                          key={lesson.title}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: li * 0.03 }}
                        >
                          <Link href={lesson.href}>
                            <div className="p-4 rounded-xl border border-[#E5E7EB] hover:border-[#16A34A]/30 hover:shadow-md transition-all bg-white group">
                              <div
                                className="w-full h-14 rounded-lg mb-3 flex items-center justify-center"
                                style={{ background: `${category.color}06` }}
                              >
                                <svg className="w-5 h-5" style={{ color: category.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                  <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                              </div>
                              <h3 className="text-sm font-semibold text-[#0F172A] mb-2 group-hover:text-[#082C4E] transition-colors">{lesson.title}</h3>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant={lesson.difficulty === 'Beginner' ? 'success' : lesson.difficulty === 'Intermediate' ? 'warning' : 'danger'} >
                                  {lesson.difficulty}
                                </Badge>
                                <span className="text-xs text-[#64748B]">{lesson.duration}</span>
                              </div>
                              {lesson.progress > 0 && (
                                <div className="w-full h-1 rounded-full bg-[#E5E7EB] mb-2">
                                  <div className="h-full rounded-full bg-[#16A34A]" style={{ width: `${lesson.progress}%` }} />
                                </div>
                              )}
                              <span
                                className="text-xs font-medium text-[#082C4E] group-hover:text-[#16A34A] transition-colors"
                              >
                                {lesson.progress > 0 ? 'Continue →' : 'Start →'}
                              </span>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Popular lessons (filtered) */}
      {activeFilter !== 'All' && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-[#0F172A] mb-6">
            {activeFilter} Lessons
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredLessons.map((lesson, i) => (
              <motion.div
                key={`${lesson.title}-${i}`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                <Link href={lesson.href}>
                  <GlassCard hover className="p-5">
                    <div className="w-full h-14 rounded-lg mb-3 flex items-center justify-center" style={{ background: `${lesson.color}06` }}>
                      <svg className="w-5 h-5" style={{ color: lesson.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-[#0F172A] mb-2">{lesson.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={lesson.difficulty === 'Beginner' ? 'success' : lesson.difficulty === 'Intermediate' ? 'warning' : 'danger'} >
                        {lesson.difficulty}
                      </Badge>
                      <span className="text-xs text-[#64748B]">{lesson.duration}</span>
                    </div>
                    <span className="text-xs font-medium text-[#082C4E]">{lesson.category}</span>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive demo section */}
      <div className="mt-16 mb-8">
        <GlassCard className="p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-3">
                Try the AI Pipeline
              </h2>
              <p className="text-[#64748B] mb-6">
                See how your prompt flows through an LLM — from tokenization to response. Watch each step with live visualizations.
              </p>
              <div className="flex gap-3">
                <Link href="/learn/ai-pipeline">
                  <Button>Open Pipeline Viz</Button>
                </Link>
                <Link href="/playground/chat">
                  <Button variant="secondary">Go to Playground</Button>
                </Link>
              </div>
            </div>
            <div className="w-full lg:w-64 h-40 rounded-2xl bg-gradient-to-br from-[#082C4E]/5 to-[#16A34A]/5 border border-[#E5E7EB] flex items-center justify-center">
              <svg className="w-16 h-16 text-[#082C4E]/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <circle cx="12" cy="5" r="2" /><circle cx="5" cy="19" r="2" /><circle cx="19" cy="19" r="2" />
                <line x1="12" y1="7" x2="5" y2="17" /><line x1="12" y1="7" x2="19" y2="17" />
                <line x1="7" y1="19" x2="17" y2="19" />
              </svg>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
