'use client';

import { useState, useEffect, JSX, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/Progress';
import { IconZap, IconBalance } from '@/components/ui/Icons';

type Section = {
  title: string;
  visual: string;
  diagram?: JSX.Element;
  content?: string;
  points?: { label: string; desc: string; color: string }[];
  items?: { term: string; def: string; color: string }[];
  steps?: string[];
  formula?: string;
  formulaDetail?: string;
  note?: string;
  tip?: string;
};

const nodeColors = {
  blue: 'from-[var(--neon-blue)] to-blue-600',
  purple: 'from-purple-500 to-[var(--neon-purple)]',
  green: 'from-emerald-500 to-[var(--neon-green)]',
  orange: 'from-orange-500 to-red-500',
  cyan: 'from-cyan-400 to-cyan-600',
  pink: 'from-pink-500 to-rose-600',
};

const icons: Record<string, JSX.Element> = {
  AF: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><polygon points="12,3 21,7.5 21,16.5 12,21 3,16.5 3,7.5"/><circle cx="12" cy="12" r="2"/></svg>,
  LL: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><rect x="3" y="4" width="18" height="4" rx="1"/><rect x="3" y="10" width="18" height="4" rx="1"/><rect x="3" y="16" width="18" height="4" rx="1"/></svg>,
  DD: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><circle cx="10.5" cy="10.5" r="6"/><line x1="15" y1="15" x2="21" y2="21"/></svg>,
  IL: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><polygon points="6,4 20,12 6,20"/></svg>,
  AE: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M12 2L3 6v6c0 5.25 3.83 10.15 9 12 5.17-1.85 9-6.75 9-12V6l-9-4z"/><path d="M9 12l2 2 4-4"/></svg>,
  CH: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>,
  AT: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  TK: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><line x1="6" y1="5" x2="18" y2="5"/><line x1="12" y1="5" x2="12" y2="19"/><line x1="8" y1="19" x2="16" y2="19"/></svg>,
  NN: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><line x1="12" y1="7" x2="5" y2="17"/><line x1="12" y1="7" x2="19" y2="17"/><line x1="7" y1="19" x2="17" y2="19"/></svg>,
  TF: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M12 3v18"/><polyline points="7 8 12 3 17 8"/><polyline points="7 16 12 21 17 16"/></svg>,
  EM: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><circle cx="6" cy="6" r="1.5"/><circle cx="12" cy="6" r="1.5"/><circle cx="18" cy="6" r="1.5"/><circle cx="6" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/><circle cx="6" cy="18" r="1.5"/><circle cx="12" cy="18" r="1.5"/><circle cx="18" cy="18" r="1.5"/></svg>,
  RL: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M21 12a9 9 0 11-6.219-8.56"/><polyline points="21 3 21 9 15 9"/></svg>,
  DF: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><circle cx="12" cy="12" r="2"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="10"/></svg>,
  RG: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/><circle cx="15" cy="8" r="2.5"/><line x1="17" y1="10" x2="19" y2="12"/></svg>,
  MO: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><rect x="2" y="2" width="8" height="8" rx="1"/><rect x="14" y="2" width="8" height="8" rx="1"/><rect x="8" y="14" width="8" height="8" rx="1"/><line x1="10" y1="6" x2="14" y2="6"/><line x1="12" y1="10" x2="12" y2="14"/></svg>,
  FT: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><circle cx="4" cy="12" r="2"/><line x1="12" y1="21" x2="12" y2="9"/><line x1="12" y1="5" x2="12" y2="3"/><circle cx="12" cy="7" r="2"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><circle cx="20" cy="14" r="2"/></svg>,
  AC: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M6 9H4a2 2 0 01-2-2V5a2 2 0 012-2h2"/><path d="M18 9h2a2 2 0 002-2V5a2 2 0 00-2-2h-2"/><path d="M6 2h12v7a6 6 0 11-12 0V2z"/><path d="M12 15v-3"/><circle cx="12" cy="19" r="1.5"/></svg>,
};

function AttentionDiagram() {
  return (
    <svg viewBox="0 0 600 280" className="w-full max-w-2xl mx-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="q-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#3b82f6"/></linearGradient>
        <linearGradient id="k-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a78bfa"/><stop offset="100%" stopColor="#8b5cf6"/></linearGradient>
        <linearGradient id="v-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#34d399"/><stop offset="100%" stopColor="#10b981"/></linearGradient>
        <linearGradient id="head-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#60a5fa"/><stop offset="33%" stopColor="#a78bfa"/><stop offset="66%" stopColor="#34d399"/><stop offset="100%" stopColor="#f472b6"/></linearGradient>
      </defs>

      <text x="300" y="20" textAnchor="middle" fontSize="13" fill="#94a3b8" fontWeight="600">Scaled Dot-Product Attention</text>

      <rect x="30" y="40" width="80" height="36" rx="8" fill="url(#q-grad)" opacity="0.9"/>
      <text x="70" y="62" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">Q</text>
      <rect x="130" y="40" width="80" height="36" rx="8" fill="url(#k-grad)" opacity="0.9"/>
      <text x="170" y="62" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">K</text>
      <rect x="230" y="40" width="80" height="36" rx="8" fill="url(#v-grad)" opacity="0.9"/>
      <text x="270" y="62" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">V</text>

      <path d="M110 58 L130 58" stroke="#60a5fa" strokeWidth="1.5" fill="none"/>
      <path d="M210 58 L230 58" stroke="#34d399" strokeWidth="1.5" fill="none"/>

      <rect x="155" y="100" width="120" height="36" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="1"/>
      <text x="215" y="122" textAnchor="middle" fontSize="11" fill="#94a3b8">Q · K^T  (scores)</text>
      <path d="M110 76 L175 100" stroke="#60a5fa" strokeWidth="1" strokeDasharray="4,3" fill="none"/>
      <path d="M210 76 L175 100" stroke="#a78bfa" strokeWidth="1" strokeDasharray="4,3" fill="none"/>

      <rect x="155" y="155" width="120" height="36" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="1"/>
      <text x="215" y="177" textAnchor="middle" fontSize="11" fill="#94a3b8">Softmax(scale)</text>
      <path d="M215 136 L215 155" stroke="#475569" strokeWidth="1.5" fill="none" markerEnd="url(#arrow)"/>

      <path d="M270 76 L270 173 L275 173" stroke="#34d399" strokeWidth="1" strokeDasharray="4,3" fill="none"/>

      <rect x="155" y="210" width="120" height="36" rx="8" fill="url(#head-grad)" opacity="0.85"/>
      <text x="215" y="232" textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">Attention Output</text>
      <path d="M215 191 L215 210" stroke="#475569" strokeWidth="1.5" fill="none"/>

      <text x="380" y="40" textAnchor="middle" fontSize="13" fill="#94a3b8" fontWeight="600">Multi-Head Attention</text>
      <rect x="340" y="55" width="80" height="28" rx="6" fill="url(#head-grad)" opacity="0.7"/>
      <text x="380" y="73" textAnchor="middle" fontSize="10" fill="white">Head 1</text>
      <rect x="340" y="90" width="80" height="28" rx="6" fill="url(#head-grad)" opacity="0.7"/>
      <text x="380" y="108" textAnchor="middle" fontSize="10" fill="white">Head 2</text>
      <rect x="340" y="125" width="80" height="28" rx="6" fill="url(#head-grad)" opacity="0.7"/>
      <text x="380" y="143" textAnchor="middle" fontSize="10" fill="white">Head 3</text>
      <rect x="340" y="160" width="80" height="28" rx="6" fill="url(#head-grad)" opacity="0.7"/>
      <text x="380" y="178" textAnchor="middle" fontSize="10" fill="white">Head 4</text>

      <rect x="340" y="205" width="80" height="28" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="1"/>
      <text x="380" y="223" textAnchor="middle" fontSize="10" fill="#94a3b8">Concat</text>
      <path d="M380 188 L380 205" stroke="#475569" strokeWidth="1" fill="none"/>

      <rect x="340" y="245" width="80" height="24" rx="8" fill="url(#head-grad)" opacity="0.9"/>
      <text x="380" y="261" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">Output</text>
      <path d="M380 233 L380 245" stroke="#475569" strokeWidth="1" fill="none"/>
    </svg>
  );
}

function AttentionHeatmap() {
  const words = ['The', 'cat', 'sat', 'on', 'the', 'mat'];
  // Simulated attention weights matrix
  const weights = [
    [0.05, 0.10, 0.55, 0.05, 0.05, 0.20],
    [0.08, 0.25, 0.30, 0.10, 0.12, 0.15],
    [0.02, 0.60, 0.10, 0.08, 0.05, 0.15],
    [0.10, 0.10, 0.20, 0.20, 0.20, 0.20],
    [0.05, 0.08, 0.10, 0.12, 0.15, 0.50],
    [0.03, 0.12, 0.15, 0.10, 0.30, 0.30],
  ];
  const size = 30;
  const gap = 2;
  const startX = 50;
  const startY = 30;

  return (
    <svg viewBox="0 0 250 190" className="w-full max-w-sm mx-auto" xmlns="http://www.w3.org/2000/svg">
      <text x="125" y="12" textAnchor="middle" fontSize="11" fill="#94a3b8" fontWeight="600">Attention Heatmap (cat → sat)</text>
      {words.map((w, i) => (
        <text key={`x-${i}`} x={startX + i * (size + gap) + size / 2} y={startY - 6} textAnchor="middle" fontSize="8" fill="#94a3b8">{w}</text>
      ))}
      {words.map((w, i) => (
        <text key={`y-${i}`} x={startX - 6} y={startY + i * (size + gap) + size / 2 + 3} textAnchor="end" fontSize="7" fill="#94a3b8">{w}</text>
      ))}
      {weights.map((row, i) =>
        row.map((val, j) => {
          const intensity = Math.round(val * 255);
          const r = 59, g = 130, b = 246;
          const alpha = val;
          return (
            <rect
              key={`${i}-${j}`}
              x={startX + j * (size + gap)}
              y={startY + i * (size + gap)}
              width={size}
              height={size}
              rx={3}
              fill={`rgba(${r},${g},${b},${alpha})`}
            >
              <title>{`${words[i]} → ${words[j]}: ${(val * 100).toFixed(0)}%`}</title>
            </rect>
          );
        })
      )}
      {/* Highlight cat→sat cell */}
      <rect x={startX + 2 * (size + gap)} y={startY + 1 * (size + gap)} width={size} height={size} rx={3} fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="3,2"/>
    </svg>
  );
}

function TokenizationDiagram() {
  return (
    <svg viewBox="0 0 600 250" className="w-full max-w-2xl mx-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tok-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#3b82f6"/></linearGradient>
        <linearGradient id="tok-grad2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#34d399"/><stop offset="100%" stopColor="#10b981"/></linearGradient>
        <linearGradient id="tok-grad3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a78bfa"/><stop offset="100%" stopColor="#8b5cf6"/></linearGradient>
      </defs>

      <text x="300" y="18" textAnchor="middle" fontSize="13" fill="#94a3b8" fontWeight="600">Byte-Pair Encoding (BPE) Tokenization</text>

      <rect x="40" y="35" width="520" height="32" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="1"/>
      <text x="60" y="55" fontSize="13" fill="#e2e8f0" fontWeight="500">Input: "I love artificial intelligence"</text>

      <path d="M60 67 L60 80" stroke="#475569" strokeWidth="1" strokeDasharray="3,2" fill="none"/>
      <path d="M540 67 L540 80" stroke="#475569" strokeWidth="1" strokeDasharray="3,2" fill="none"/>
      <line x1="60" y1="80" x2="540" y2="80" stroke="#475569" strokeWidth="0.5"/>

      <rect x="40" y="90" width="70" height="30" rx="6" fill="url(#tok-grad)" opacity="0.8"/>
      <text x="75" y="109" textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">I</text>
      <rect x="118" y="90" width="100" height="30" rx="6" fill="url(#tok-grad2)" opacity="0.8"/>
      <text x="168" y="109" textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">love</text>
      <rect x="226" y="90" width="140" height="30" rx="6" fill="url(#tok-grad3)" opacity="0.8"/>
      <text x="296" y="109" textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">artificial</text>
      <rect x="374" y="90" width="130" height="30" rx="6" fill="url(#tok-grad)" opacity="0.8"/>
      <text x="439" y="109" textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">intelligence</text>

      <line x1="60" y1="120" x2="540" y2="120" stroke="#475569" strokeWidth="0.5"/>

      <text x="60" y="138" fontSize="10" fill="#64748b">Tokens →</text>

      <rect x="118" y="140" width="40" height="22" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="0.5"/>
      <text x="138" y="155" textAnchor="middle" fontSize="9" fill="#94a3b8">ID:342</text>
      <rect x="166" y="140" width="55" height="22" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="0.5"/>
      <text x="193" y="155" textAnchor="middle" fontSize="9" fill="#94a3b8">ID:215</text>
      <rect x="229" y="140" width="70" height="22" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="0.5"/>
      <text x="264" y="155" textAnchor="middle" fontSize="9" fill="#94a3b8">ID:8712</text>
      <rect x="307" y="140" width="100" height="22" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="0.5"/>
      <text x="357" y="155" textAnchor="middle" fontSize="9" fill="#94a3b8">ID:14235</text>

      {/* BPE merge tree */}
      <text x="300" y="190" textAnchor="middle" fontSize="11" fill="#94a3b8" fontWeight="600">BPE Merge Process</text>
      <text x="40" y="210" fontSize="10" fill="#64748b">Chars:</text>
      <text x="90" y="210" fontSize="10" fill="#e2e8f0">"a" "r" "t" "i" "f" "i" "c" "i" "a" "l"</text>
      <text x="40" y="228" fontSize="10" fill="#64748b">Merge:</text>
      <text x="90" y="228" fontSize="10" fill="#34d399">("a","r")→"ar", ("ar","t")→"art", ("art","i")→"arti" ...</text>
    </svg>
  );
}

function NeuralNetDiagram() {
  return (
    <svg viewBox="0 0 620 300" className="w-full max-w-2xl mx-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="neu-grad"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#3b82f6"/></radialGradient>
        <radialGradient id="neu-grad2"><stop offset="0%" stopColor="#a78bfa"/><stop offset="100%" stopColor="#8b5cf6"/></radialGradient>
        <radialGradient id="neu-grad3"><stop offset="0%" stopColor="#34d399"/><stop offset="100%" stopColor="#10b981"/></radialGradient>
        <radialGradient id="neu-grad4"><stop offset="0%" stopColor="#f472b6"/><stop offset="100%" stopColor="#ec4899"/></radialGradient>
      </defs>

      <text x="310" y="15" textAnchor="middle" fontSize="12" fill="#94a3b8" fontWeight="600">Neural Network Architecture</text>

      {/* Input layer */}
      {[0, 1, 2].map((i) => (
        <circle key={`in-${i}`} cx={70} cy={70 + i * 50} r={14} fill="url(#neu-grad)" opacity="0.9"/>
      ))}
      <text x="70" y="198" textAnchor="middle" fontSize="9" fill="#94a3b8">Input</text>

      {/* Hidden layer 1 */}
      {[0, 1, 2, 3].map((i) => (
        <circle key={`h1-${i}`} cx={210} cy={45 + i * 50} r={14} fill="url(#neu-grad2)" opacity="0.9"/>
      ))}
      <text x="210" y="248" textAnchor="middle" fontSize="9" fill="#94a3b8">Hidden 1</text>

      {/* Hidden layer 2 */}
      {[0, 1, 2, 3].map((i) => (
        <circle key={`h2-${i}`} cx={350} cy={45 + i * 50} r={14} fill="url(#neu-grad3)" opacity="0.9"/>
      ))}
      <text x="350" y="248" textAnchor="middle" fontSize="9" fill="#94a3b8">Hidden 2</text>

      {/* Output layer */}
      {[0, 1].map((i) => (
        <circle key={`out-${i}`} cy={95 + i * 50} r={14} fill="url(#neu-grad4)" opacity="0.9" cx={490}/>
      ))}
      <text x="490" y="198" textAnchor="middle" fontSize="9" fill="#94a3b8">Output</text>

      {/* Connections between layers (just a few representative) */}
      {[0, 1, 2].map((i) =>
        [0, 1, 2, 3].map((j) => (
          <line key={`i${i}-h${j}`} x1={84} y1={70 + i * 50} x2={196} y2={45 + j * 50} stroke="#475569" strokeWidth="0.3" opacity="0.3"/>
        ))
      )}

      {/* Forward pass arrow */}
      <path d="M510 108 L540 108" stroke="#34d399" strokeWidth="2" fill="none"/>
      <text x="555" y="112" fontSize="9" fill="#34d399">Forward</text>
      <path d="M540 138 L510 138" stroke="#f472b6" strokeWidth="2" strokeDasharray="4,3" fill="none"/>
      <text x="555" y="142" fontSize="9" fill="#f472b6">Backward</text>

      {/* Weight label */}
      <text x="250" y="275" textAnchor="middle" fontSize="10" fill="#64748b">Each connection = learned weight × bias</text>

      {/* Backprop flow */}
      <rect x="40" y="280" width="120" height="18" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="0.5"/>
      <text x="100" y="292" textAnchor="middle" fontSize="8" fill="#94a3b8">Forward: w·x + b → σ</text>
      <rect x="200" y="280" width="140" height="18" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="0.5"/>
      <text x="270" y="292" textAnchor="middle" fontSize="8" fill="#94a3b8">Loss = ½(y - ŷ)²</text>
      <rect x="380" y="280" width="100" height="18" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="0.5"/>
      <text x="430" y="292" textAnchor="middle" fontSize="8" fill="#94a3b8">w ← w - η·∂L/∂w</text>
    </svg>
  );
}

function TransformerDiagram() {
  return (
    <svg viewBox="0 0 620 380" className="w-full max-w-2xl mx-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="enc-grad"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#3b82f6"/></linearGradient>
        <linearGradient id="dec-grad"><stop offset="0%" stopColor="#34d399"/><stop offset="100%" stopColor="#10b981"/></linearGradient>
        <linearGradient id="attn-grad"><stop offset="0%" stopColor="#a78bfa"/><stop offset="100%" stopColor="#8b5cf6"/></linearGradient>
        <linearGradient id="ffn-grad"><stop offset="0%" stopColor="#f472b6"/><stop offset="100%" stopColor="#ec4899"/></linearGradient>
      </defs>

      <text x="310" y="16" textAnchor="middle" fontSize="12" fill="#94a3b8" fontWeight="600">Transformer Architecture</text>

      {/* Encoder side */}
      <rect x="30" y="28" width="220" height="330" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="1"/>
      <text x="140" y="46" textAnchor="middle" fontSize="10" fill="#60a5fa" fontWeight="bold">Encoder (x6)</text>

      <rect x="45" y="55" width="190" height="60" rx="6" fill="url(#attn-grad)" opacity="0.15" stroke="#8b5cf6" strokeWidth="0.5"/>
      <text x="140" y="78" textAnchor="middle" fontSize="9" fill="#a78bfa" fontWeight="600">Multi-Head Self-Attention</text>
      <text x="140" y="95" textAnchor="middle" fontSize="7" fill="#64748b">Each token attends to all tokens</text>
      <text x="140" y="108" textAnchor="middle" fontSize="7" fill="#64748b">LayerNorm + Residual</text>

      <line x1="60" y1="120" x2="220" y2="120" stroke="#334155" strokeWidth="0.5"/>

      <rect x="45" y="130" width="190" height="60" rx="6" fill="url(#ffn-grad)" opacity="0.15" stroke="#ec4899" strokeWidth="0.5"/>
      <text x="140" y="153" textAnchor="middle" fontSize="9" fill="#f472b6" fontWeight="600">Feed-Forward Network</text>
      <text x="140" y="170" textAnchor="middle" fontSize="7" fill="#64748b">Linear → ReLU → Linear</text>
      <text x="140" y="183" textAnchor="middle" fontSize="7" fill="#64748b">LayerNorm + Residual</text>

      <line x1="60" y1="195" x2="220" y2="195" stroke="#334155" strokeWidth="0.5"/>

      <rect x="85" y="205" width="110" height="24" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="0.5"/>
      <text x="140" y="221" textAnchor="middle" fontSize="8" fill="#94a3b8">↑ x N layers</text>

      {/* Decoder side */}
      <rect x="370" y="28" width="220" height="330" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="1"/>
      <text x="480" y="46" textAnchor="middle" fontSize="10" fill="#34d399" fontWeight="bold">Decoder (x6)</text>

      <rect x="385" y="55" width="190" height="50" rx="6" fill="url(#attn-grad)" opacity="0.15" stroke="#8b5cf6" strokeWidth="0.5"/>
      <text x="480" y="73" textAnchor="middle" fontSize="8" fill="#a78bfa" fontWeight="600">Masked Self-Attention</text>
      <text x="480" y="90" textAnchor="middle" fontSize="7" fill="#64748b">Can't look at future tokens</text>
      <text x="480" y="100" textAnchor="middle" fontSize="7" fill="#64748b">LayerNorm + Residual</text>

      <line x1="395" y1="110" x2="565" y2="110" stroke="#334155" strokeWidth="0.5"/>

      <rect x="385" y="120" width="190" height="50" rx="6" fill="url(#enc-grad)" opacity="0.15" stroke="#3b82f6" strokeWidth="0.5"/>
      <text x="480" y="138" textAnchor="middle" fontSize="8" fill="#60a5fa" fontWeight="600">Cross-Attention</text>
      <text x="480" y="155" textAnchor="middle" fontSize="7" fill="#64748b">Queries from decoder, K/V from encoder</text>
      <text x="480" y="165" textAnchor="middle" fontSize="7" fill="#64748b">LayerNorm + Residual</text>

      <line x1="395" y1="175" x2="565" y2="175" stroke="#334155" strokeWidth="0.5"/>

      <rect x="385" y="185" width="190" height="50" rx="6" fill="url(#ffn-grad)" opacity="0.15" stroke="#ec4899" strokeWidth="0.5"/>
      <text x="480" y="203" textAnchor="middle" fontSize="8" fill="#f472b6" fontWeight="600">Feed-Forward Network</text>
      <text x="480" y="220" textAnchor="middle" fontSize="7" fill="#64748b">Linear → ReLU → Linear</text>
      <text x="480" y="230" textAnchor="middle" fontSize="7" fill="#64748b">LayerNorm + Residual</text>

      <rect x="425" y="245" width="110" height="24" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="0.5"/>
      <text x="480" y="261" textAnchor="middle" fontSize="8" fill="#94a3b8">↑ x N layers</text>

      <rect x="385" y="285" width="190" height="40" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="0.5"/>
      <text x="480" y="300" textAnchor="middle" fontSize="9" fill="#e2e8f0" fontWeight="500">Linear + Softmax</text>
      <text x="480" y="315" textAnchor="middle" fontSize="7" fill="#64748b">Output probabilities</text>

      {/* Arrow from encoder to decoder cross-attention */}
      <path d="M220 150 L250 150 L250 145 L385 145" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,3" fill="none"/>
      <text x="302" y="142" textAnchor="middle" fontSize="7" fill="#3b82f6">K, V</text>

      {/* Positional encoding */}
      <text x="310" y="340" textAnchor="middle" fontSize="10" fill="#94a3b8">Positional Encoding: sin(pos/10000^(2i/d)) + cos(pos/10000^(2i/d))</text>
    </svg>
  );
}

function EmbeddingDiagram() {
  return (
    <svg viewBox="0 0 600 320" className="w-full max-w-2xl mx-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="emb-grad1"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#3b82f6"/></radialGradient>
        <radialGradient id="emb-grad2"><stop offset="0%" stopColor="#34d399"/><stop offset="100%" stopColor="#10b981"/></radialGradient>
        <radialGradient id="emb-grad3"><stop offset="0%" stopColor="#f472b6"/><stop offset="100%" stopColor="#ec4899"/></radialGradient>
        <radialGradient id="emb-grad4"><stop offset="0%" stopColor="#fbbf24"/><stop offset="100%" stopColor="#f59e0b"/></radialGradient>
      </defs>

      <text x="300" y="16" textAnchor="middle" fontSize="12" fill="#94a3b8" fontWeight="600">Vector Embedding Space</text>

      {/* Scatter points */}
      {[
        {x:120,y:200,label:"dog",color:"emb-grad1"},
        {x:140,y:180,label:"cat",color:"emb-grad1"},
        {x:160,y:210,label:"pet",color:"emb-grad1"},
        {x:300,y:240,label:"king",color:"emb-grad2"},
        {x:280,y:220,label:"queen",color:"emb-grad2"},
        {x:320,y:260,label:"royal",color:"emb-grad2"},
        {x:450,y:120,label:"car",color:"emb-grad3"},
        {x:470,y:140,label:"truck",color:"emb-grad3"},
        {x:430,y:100,label:"vehicle",color:"emb-grad3"},
        {x:480,y:200,label:"run",color:"emb-grad4"},
        {x:460,y:220,label:"walk",color:"emb-grad4"},
      ].map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={6} fill={`url(#${p.color})`} opacity="0.8"/>
          <text x={p.x + 10} y={p.y + 3} fontSize="8" fill="#94a3b8">{p.label}</text>
        </g>
      ))}

      {/* Analogy arrows */}
      <path d="M140 180 L280 220" stroke="#f472b6" strokeWidth="1" strokeDasharray="3,3" fill="none" opacity="0.5"/>
      <path d="M120 200 L300 240" stroke="#f472b6" strokeWidth="1" strokeDasharray="3,3" fill="none" opacity="0.5"/>
      <text x="200" y="195" textAnchor="middle" fontSize="7" fill="#f472b6">Semantic similarity</text>

      {/* Analogy text */}
      <rect x="100" y="260" width="190" height="24" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="0.5"/>
      <text x="195" y="276" textAnchor="middle" fontSize="9" fill="#e2e8f0">king - man + woman ≈ queen</text>

      {/* Arrow labels for axes */}
      <line x1="50" y1="280" x2="550" y2="280" stroke="#334155" strokeWidth="0.5"/>
      <text x="560" y="283" fontSize="8" fill="#64748b">Dimension 1</text>
      <line x1="280" y1="30" x2="280" y2="310" stroke="#334155" strokeWidth="0.5"/>
      <text x="265" y="24" fontSize="8" fill="#64748b">Dimension 2</text>

      {/* Dimension info */}
      <rect x="360" y="30" width="120" height="20" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="0.5"/>
      <text x="420" y="43" textAnchor="middle" fontSize="8" fill="#94a3b8">1536 dimensions</text>
    </svg>
  );
}

function RLDiaqram() {
  return (
    <svg viewBox="0 0 620 280" className="w-full max-w-2xl mx-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rl-agent"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#3b82f6"/></linearGradient>
        <linearGradient id="rl-env"><stop offset="0%" stopColor="#34d399"/><stop offset="100%" stopColor="#10b981"/></linearGradient>
        <linearGradient id="rl-rlhf"><stop offset="0%" stopColor="#a78bfa"/><stop offset="100%" stopColor="#8b5cf6"/></linearGradient>
        <linearGradient id="rl-reward"><stop offset="0%" stopColor="#fbbf24"/><stop offset="100%" stopColor="#f59e0b"/></linearGradient>
      </defs>

      <text x="310" y="16" textAnchor="middle" fontSize="12" fill="#94a3b8" fontWeight="600">Reinforcement Learning Loop</text>

      {/* Agent */}
      <rect x="60" y="70" width="150" height="70" rx="12" fill="url(#rl-agent)" opacity="0.9"/>
      <text x="135" y="100" textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">Agent</text>
      <text x="135" y="118" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.7)">Policy π(a|s)</text>

      {/* Environment */}
      <rect x="410" y="70" width="150" height="70" rx="12" fill="url(#rl-env)" opacity="0.9"/>
      <text x="485" y="100" textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">Environment</text>
      <text x="485" y="118" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.7)">State transitions</text>

      {/* Action arrow */}
      <path d="M210 90 L410 90" stroke="#f472b6" strokeWidth="2" fill="none"/>
      <polygon points="405,85 415,90 405,95" fill="#f472b6"/>
      <text x="310" y="82" textAnchor="middle" fontSize="9" fill="#f472b6">Action a</text>

      {/* State + Reward arrow */}
      <path d="M410 120 L210 120" stroke="#34d399" strokeWidth="2" fill="none"/>
      <polygon points="215,115 205,120 215,125" fill="#34d399"/>
      <text x="310" y="145" textAnchor="middle" fontSize="9" fill="#34d399">State s' , Reward r</text>

      {/* Reward icon */}
      <rect x="250" y="175" width="120" height="24" rx="6" fill="url(#rl-reward)" opacity="0.8"/>
      <text x="310" y="192" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">Goal: Max Σγᵗrₜ</text>

      {/* RLHF pipeline */}
      <text x="310" y="225" textAnchor="middle" fontSize="11" fill="#94a3b8" fontWeight="600">RLHF Pipeline</text>
      <rect x="30" y="240" width="120" height="24" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="0.5"/>
      <text x="90" y="256" textAnchor="middle" fontSize="8" fill="#94a3b8">SFT (pretrain)</text>
      <path d="M150 252 L170 252" stroke="#475569" strokeWidth="1" fill="none"/>
      <rect x="170" y="240" width="120" height="24" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="0.5"/>
      <text x="230" y="256" textAnchor="middle" fontSize="8" fill="#94a3b8">Human Feedback</text>
      <path d="M290 252 L310 252" stroke="#475569" strokeWidth="1" fill="none"/>
      <rect x="310" y="240" width="120" height="24" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="0.5"/>
      <text x="370" y="256" textAnchor="middle" fontSize="8" fill="#94a3b8">Reward Model</text>
      <path d="M430 252 L450 252" stroke="#475569" strokeWidth="1" fill="none"/>
      <rect x="450" y="240" width="120" height="24" rx="6" fill="url(#rl-rlhf)" opacity="0.5"/>
      <text x="510" y="256" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">PPO Optimize</text>
    </svg>
  );
}

function DiffusionDiagram() {
  return (
    <svg viewBox="0 0 640 260" className="w-full max-w-2xl mx-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="diff-noise"><stop offset="0%" stopColor="#64748b"/><stop offset="100%" stopColor="#475569"/></linearGradient>
        <linearGradient id="diff-clean"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#3b82f6"/></linearGradient>
        <linearGradient id="diff-denoise"><stop offset="0%" stopColor="#a78bfa"/><stop offset="100%" stopColor="#8b5cf6"/></linearGradient>
      </defs>

      <text x="320" y="16" textAnchor="middle" fontSize="13" fill="#94a3b8" fontWeight="600">Denoising Diffusion Process</text>

      {/* Forward (noise) row */}
      <text x="320" y="38" textAnchor="middle" fontSize="9" fill="#64748b">Forward: add noise →</text>
      {[0, 1, 2, 3].map((i) => (
        <g key={`f-${i}`}>
          <rect x={30 + i * 155} y="48" width="130" height="50" rx="10" fill={i < 3 ? "#1e293b" : "#0f172a"} stroke={i < 3 ? "#334155" : "#1e293b"} strokeWidth="1"/>
          {Array.from({length: i * 4}).map((_, j) => (
            <circle key={j} cx={40 + i * 155 + (j % 5) * 25 + Math.random() * 10} cy={55 + Math.floor(j / 5) * 14 + Math.random() * 10} r="1.5" fill="#94a3b8" opacity={0.3 + i * 0.15}/>
          ))}
          <text x={95 + i * 155} y="78" textAnchor="middle" fontSize="8" fill="#64748b">x_{i === 3 ? "T" : `t${i === 0 ? "" : i}`}</text>
        </g>
      ))}
      <path d="M160 73 L180 73" stroke="#475569" strokeWidth="1" fill="none"/>
      <path d="M315 73 L335 73" stroke="#475569" strokeWidth="1" fill="none"/>
      <path d="M470 73 L490 73" stroke="#475569" strokeWidth="1" fill="none"/>

      {/* Reverse (denoise) row */}
      <text x="320" y="115" textAnchor="middle" fontSize="9" fill="#64748b">Reverse: denoise (learned) ←</text>
      {[0, 1, 2, 3].map((i) => (
        <g key={`r-${i}`}>
          <rect x={470 - i * 155} y="125" width="130" height="50" rx="10" fill={i < 3 ? "#1e293b" : "#0f172a"} stroke={i < 3 ? "#334155" : "#1e293b"} strokeWidth="1"/>
          {Array.from({length: (3 - i) * 4}).map((_, j) => (
            <circle key={j} cx={480 - i * 155 + (j % 5) * 25 + Math.random() * 10} cy={132 + Math.floor(j / 5) * 14 + Math.random() * 10} r="1.5" fill="#94a3b8" opacity={0.3 + (3 - i) * 0.15}/>
          ))}
          {i === 3 && <text x={345} y="155" textAnchor="middle" fontSize="8" fill="#60a5fa">Clear image!</text>}
          <text x={525 - i * 155} y="155" textAnchor="middle" fontSize="8" fill="#64748b">x_{i === 3 ? "0" : `t${3 - i}`}</text>
        </g>
      ))}
      <path d="M340 150 L320 150" stroke="#475569" strokeWidth="1" fill="none"/>
      <path d="M185 150 L165 150" stroke="#475569" strokeWidth="1" fill="none"/>

      {/* Denoising U-Net box */}
      <rect x="220" y="190" width="200" height="30" rx="8" fill="url(#diff-denoise)" opacity="0.8"/>
      <text x="320" y="210" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">U-Net Denoiser ε_θ(x_t, t)</text>

      <path d="M265 175 L265 190" stroke="#a78bfa" strokeWidth="1" strokeDasharray="3,2" fill="none"/>
      <path d="M375 175 L375 190" stroke="#a78bfa" strokeWidth="1" strokeDasharray="3,2" fill="none"/>

      <text x="320" y="248" textAnchor="middle" fontSize="8" fill="#64748b">The model predicts and removes noise step by step, reconstructing the original data</text>
    </svg>
  );
}

function RAGDiagram() {
  return (
    <svg viewBox="0 0 640 260" className="w-full max-w-2xl mx-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rag-query"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#3b82f6"/></linearGradient>
        <linearGradient id="rag-ret"><stop offset="0%" stopColor="#34d399"/><stop offset="100%" stopColor="#10b981"/></linearGradient>
        <linearGradient id="rag-llm"><stop offset="0%" stopColor="#a78bfa"/><stop offset="100%" stopColor="#8b5cf6"/></linearGradient>
        <linearGradient id="rag-db"><stop offset="0%" stopColor="#f472b6"/><stop offset="100%" stopColor="#ec4899"/></linearGradient>
      </defs>

      <text x="320" y="16" textAnchor="middle" fontSize="13" fill="#94a3b8" fontWeight="600">Retrieval-Augmented Generation (RAG)</text>

      {/* Query */}
      <rect x="45" y="40" width="150" height="44" rx="10" fill="url(#rag-query)" opacity="0.9"/>
      <text x="120" y="58" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">User Query</text>
      <text x="120" y="73" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.7)">"What is attention?"</text>

      {/* Embed */}
      <rect x="45" y="110" width="150" height="36" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="0.5"/>
      <text x="120" y="133" textAnchor="middle" fontSize="9" fill="#e2e8f0">Embed Query</text>

      <path d="M120 84 L120 110" stroke="#475569" strokeWidth="1" fill="none"/>

      {/* Vector DB */}
      <rect x="250" y="100" width="160" height="70" rx="10" fill="url(#rag-db)" opacity="0.15" stroke="#ec4899" strokeWidth="0.5"/>
      <text x="330" y="124" textAnchor="middle" fontSize="9" fill="#f472b6" fontWeight="600">Vector Database</text>
      <text x="330" y="140" textAnchor="middle" fontSize="7" fill="#64748b">Stores document embeddings</text>
      <text x="330" y="156" textAnchor="middle" fontSize="7" fill="#64748b">Cosine similarity search</text>

      <path d="M195 128 L250 128" stroke="#f472b6" strokeWidth="1.5" fill="none"/>
      <polygon points="245,123 255,128 245,133" fill="#f472b6"/>
      <text x="222" y="122" textAnchor="middle" fontSize="7" fill="#f472b6">vector</text>

      {/* Retrieved context */}
      <rect x="445" y="95" width="160" height="50" rx="8" fill="url(#rag-ret)" opacity="0.8"/>
      <text x="525" y="115" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">Retrieved Context</text>
      <text x="525" y="132" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.7)">Top-K relevant passages</text>

      <path d="M410 135 L445 120" stroke="#34d399" strokeWidth="1.5" fill="none"/>
      <polygon points="440,115 450,120 440,125" fill="#34d399"/>

      {/* LLM */}
      <rect x="445" y="175" width="160" height="44" rx="10" fill="url(#rag-llm)" opacity="0.9"/>
      <text x="525" y="193" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">LLM + Context</text>
      <text x="525" y="208" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.7)">Generates grounded answer</text>

      <path d="M525 145 L525 175" stroke="#475569" strokeWidth="1" fill="none"/>

      {/* Query to LLM direct */}
      <path d="M120 146 L525 175" stroke="#475569" strokeWidth="0.5" strokeDasharray="3,3" fill="none"/>

      {/* Output */}
      <rect x="445" y="230" width="160" height="24" rx="6" fill="url(#rag-query)" opacity="0.9"/>
      <text x="525" y="246" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">Answer ✓</text>

      <path d="M525 219 L525 230" stroke="#475569" strokeWidth="1" fill="none"/>

      {/* Legend */}
      <text x="320" y="250" textAnchor="middle" fontSize="7" fill="#64748b">RAG reduces hallucinations by grounding LLM responses in retrieved external knowledge</text>
    </svg>
  );
}

function MoEDiagram() {
  return (
    <svg viewBox="0 0 620 290" className="w-full max-w-2xl mx-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="moe-router"><stop offset="0%" stopColor="#fbbf24"/><stop offset="100%" stopColor="#f59e0b"/></linearGradient>
        <linearGradient id="moe-e1"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#3b82f6"/></linearGradient>
        <linearGradient id="moe-e2"><stop offset="0%" stopColor="#34d399"/><stop offset="100%" stopColor="#10b981"/></linearGradient>
        <linearGradient id="moe-e3"><stop offset="0%" stopColor="#a78bfa"/><stop offset="100%" stopColor="#8b5cf6"/></linearGradient>
        <linearGradient id="moe-e4"><stop offset="0%" stopColor="#f472b6"/><stop offset="100%" stopColor="#ec4899"/></linearGradient>
        <linearGradient id="moe-out"><stop offset="0%" stopColor="#34d399"/><stop offset="100%" stopColor="#10b981"/></linearGradient>
      </defs>

      <text x="310" y="16" textAnchor="middle" fontSize="13" fill="#94a3b8" fontWeight="600">Mixture of Experts (MoE)</text>

      {/* Input */}
      <rect x="245" y="30" width="130" height="36" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="1"/>
      <text x="310" y="53" textAnchor="middle" fontSize="10" fill="#e2e8f0">Input Token</text>

      {/* Router */}
      <rect x="245" y="80" width="130" height="40" rx="10" fill="url(#moe-router)" opacity="0.9"/>
      <text x="310" y="98" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">Router / Gate</text>
      <text x="310" y="112" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.7)">Top-2 selection</text>

      <path d="M310 66 L310 80" stroke="#475569" strokeWidth="1.5" fill="none"/>

      {/* Expert paths */}
      {[
        {x:30, label:"Expert 1: Math", color:"moe-e1", active:true},
        {x:170, label:"Expert 2: Code", color:"moe-e2", active:true},
        {x:310, label:"Expert 3: Text", color:"moe-e3", active:false},
        {x:450, label:"Expert 4: Vision", color:"moe-e4", active:false},
      ].map((exp, i) => (
        <g key={i}>
          <path d={`M${240 + i * 70} ${100} L${exp.x + 60} ${130}`} stroke={exp.active ? "#fbbf24" : "#334155"} strokeWidth={exp.active ? 2 : 0.5} strokeDasharray={exp.active ? "none" : "4,3"} fill="none"/>
          <rect x={exp.x} y="135" width="120" height="36" rx="8" fill={`url(#${exp.color})`} opacity={exp.active ? 0.8 : 0.2}/>
          <text x={exp.x + 60} y={152} textAnchor="middle" fontSize="8" fill={exp.active ? "white" : "#475569"} fontWeight={exp.active ? "bold" : "normal"}>{exp.label}</text>
          <text x={exp.x + 60} y={163} textAnchor="middle" fontSize="6" fill={exp.active ? "rgba(255,255,255,0.7)" : "#334155"}>{exp.active ? "ACTIVE ✓" : "idle"}</text>
        </g>
      ))}

      {/* Weighted sum */}
      <rect x="245" y="195" width="130" height="36" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="1"/>
      <text x="310" y="211" textAnchor="middle" fontSize="8" fill="#94a3b8">Weighted Sum</text>
      <text x="310" y="223" textAnchor="middle" fontSize="6" fill="#64748b">Gating weights × Expert outputs</text>

      <path d="M90 171 L270 195" stroke="#34d399" strokeWidth="1" fill="none"/>
      <path d="M230 171 L290 195" stroke="#60a5fa" strokeWidth="1" fill="none"/>

      {/* Output */}
      <rect x="260" y="248" width="100" height="28" rx="8" fill="url(#moe-out)" opacity="0.9"/>
      <text x="310" y="267" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">Output</text>

      <path d="M310 231 L310 248" stroke="#475569" strokeWidth="1.5" fill="none"/>

      {/* Note */}
      <text x="310" y="288" textAnchor="middle" fontSize="7" fill="#64748b">Only 2 of 4 experts activate per token — sparse computation, massive parameter count</text>
    </svg>
  );
}

function FinetuneDiagram() {
  return (
    <svg viewBox="0 0 620 280" className="w-full max-w-2xl mx-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ft-base"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#3b82f6"/></linearGradient>
        <linearGradient id="ft-lora"><stop offset="0%" stopColor="#34d399"/><stop offset="100%" stopColor="#10b981"/></linearGradient>
        <linearGradient id="ft-full"><stop offset="0%" stopColor="#a78bfa"/><stop offset="100%" stopColor="#8b5cf6"/></linearGradient>
        <linearGradient id="ft-adapter"><stop offset="0%" stopColor="#f472b6"/><stop offset="100%" stopColor="#ec4899"/></linearGradient>
      </defs>

      <text x="310" y="16" textAnchor="middle" fontSize="13" fill="#94a3b8" fontWeight="600">Fine-Tuning Methods</text>

      {/* Base model */}
      <rect x="40" y="35" width="180" height="60" rx="10" fill="url(#ft-base)" opacity="0.9"/>
      <text x="130" y="58" textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">Pre-trained Base Model</text>
      <text x="130" y="78" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.7)">Trained on internet-scale data</text>

      {/* Full fine-tune */}
      <rect x="250" y="35" width="160" height="60" rx="10" fill="url(#ft-full)" opacity="0.9"/>
      <text x="330" y="58" textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">Full Fine-Tune</text>
      <text x="330" y="78" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.7)">All weights updated</text>

      <path d="M220 65 L250 65" stroke="#475569" strokeWidth="1.5" fill="none"/>
      <polygon points="245,60 255,65 245,70" fill="#475569"/>

      <rect x="440" y="35" width="160" height="60" rx="10" fill="url(#ft-full)" opacity="0.4"/>
      <text x="520" y="58" textAnchor="middle" fontSize="9" fill="#94a3b8">Result: New Model</text>
      <text x="520" y="75" textAnchor="middle" fontSize="7" fill="#64748b">7B params × 16-bit</text>
      <text x="520" y="88" textAnchor="middle" fontSize="6" fill="#64748b">~14GB VRAM</text>
      <path d="M410 65 L440 65" stroke="#475569" strokeWidth="1" fill="none"/>

      {/* LoRA */}
      <rect x="250" y="120" width="160" height="60" rx="10" fill="url(#ft-lora)" opacity="0.9"/>
      <text x="330" y="143" textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">LoRA</text>
      <text x="330" y="163" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.7)">Low-Rank Adapters (A·B)</text>

      <path d="M310 35 L310 95 L330 95 L330 120" stroke="#34d399" strokeWidth="1" strokeDasharray="4,2" fill="none"/>

      <rect x="440" y="120" width="160" height="60" rx="10" fill="url(#ft-lora)" opacity="0.4"/>
      <text x="520" y="143" textAnchor="middle" fontSize="9" fill="#94a3b8">Result: Tiny adapter</text>
      <text x="520" y="160" textAnchor="middle" fontSize="7" fill="#64748b">~0.1% of original size</text>
      <text x="520" y="175" textAnchor="middle" fontSize="6" fill="#64748b">Hot-swappable adapters</text>
      <path d="M410 150 L440 150" stroke="#475569" strokeWidth="1" fill="none"/>

      {/* Adapter / PEFT */}
      <rect x="250" y="205" width="160" height="60" rx="10" fill="url(#ft-adapter)" opacity="0.9"/>
      <text x="330" y="228" textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">PEFT (Adapter)</text>
      <text x="330" y="248" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.7)">Small neural modules inserted</text>

      <path d="M310 35 L310 95 L330 95 L330 205" stroke="#f472b6" strokeWidth="1" strokeDasharray="4,2" fill="none"/>

      <rect x="440" y="205" width="160" height="60" rx="10" fill="url(#ft-adapter)" opacity="0.4"/>
      <text x="520" y="228" textAnchor="middle" fontSize="9" fill="#94a3b8">Result: Plug-in layers</text>
      <text x="520" y="245" textAnchor="middle" fontSize="7" fill="#64748b">Trainable per task</text>
      <text x="520" y="260" textAnchor="middle" fontSize="6" fill="#64748b">No base model copy</text>
      <path d="M410 235 L440 235" stroke="#475569" strokeWidth="1" fill="none"/>
    </svg>
  );
}

function AITimeline() {
  const events = [
    { year: '1950', event: 'Turing Test', desc: 'Can machines think?', color: '#60a5fa' },
    { year: '1956', event: 'Dartmouth', desc: 'AI is born as a field', color: '#60a5fa' },
    { year: '1966', event: 'ELIZA', desc: 'First chatbot', color: '#34d399' },
    { year: '1997', event: 'Deep Blue', desc: 'AI beats chess champ', color: '#34d399' },
    { year: '2012', event: 'AlexNet', desc: 'Deep learning breakthrough', color: '#a78bfa' },
    { year: '2017', event: 'Transformer', desc: 'Attention is all you need', color: '#a78bfa' },
    { year: '2022', event: 'ChatGPT', desc: 'LLMs go mainstream', color: '#f472b6' },
    { year: '2024', event: 'Gemini/GPT-4o', desc: 'Multimodal AI', color: '#fbbf24' },
  ];
  const startX = 60;
  const spacing = 68;

  return (
    <svg viewBox="0 0 610 280" className="w-full max-w-2xl mx-auto" xmlns="http://www.w3.org/2000/svg">
      <text x="305" y="16" textAnchor="middle" fontSize="13" fill="#94a3b8" fontWeight="600">AI History Timeline</text>
      {/* Timeline line */}
      <line x1={startX} y1="80" x2={startX + events.length * spacing} y2="80" stroke="#475569" strokeWidth="2"/>
      {events.map((e, i) => (
        <g key={i}>
          <circle cx={startX + i * spacing + 10} cy={80} r={6} fill={e.color} stroke="#1e293b" strokeWidth="2"/>
          <line x1={startX + i * spacing + 10} y1={80} x2={startX + i * spacing + 10} y2={50} stroke="#475569" strokeWidth="1"/>
          <text x={startX + i * spacing + 10} y={44} textAnchor="middle" fontSize="9" fill={e.color} fontWeight="bold">{e.year}</text>
          <line x1={startX + i * spacing + 10} y1={80} x2={startX + i * spacing + 10} y2={110} stroke="#475569" strokeWidth="1"/>
          <text x={startX + i * spacing + 10} y={124} textAnchor="middle" fontSize="9" fill="#e2e8f0" fontWeight="500">{e.event}</text>
          <text x={startX + i * spacing + 10} y={138} textAnchor="middle" fontSize="7" fill="#64748b">{e.desc}</text>
        </g>
      ))}
      <text x="305" y="175" textAnchor="middle" fontSize="9" fill="#64748b">↓</text>
      <text x="305" y="195" textAnchor="middle" fontSize="10" fill="#94a3b8">1940s–1950s: Theoretical foundations</text>
      <text x="305" y="212" textAnchor="middle" fontSize="10" fill="#94a3b8">1980s–1990s: Expert systems, ML崛起</text>
      <text x="305" y="229" textAnchor="middle" fontSize="10" fill="#94a3b8">2010s: Deep learning revolution</text>
      <text x="305" y="246" textAnchor="middle" fontSize="10" fill="#34d399" fontWeight="600">2020s: Generative AI Era →</text>
      <rect x="220" y="255" width="170" height="18" rx="4" fill="#34d399" opacity="0.2"/>
      <text x="305" y="268" textAnchor="middle" fontSize="7" fill="#34d399">Exponential growth in capability & adoption</text>
    </svg>
  );
}

function LLMPipeline({ activeStep, setActiveStep }: { activeStep: number; setActiveStep: (i: number) => void }) {
  const steps = [
    { label: 'Prompt', icon: 'IN', desc: 'Your input text' },
    { label: 'Tokenizer', icon: 'TK', desc: 'Split into tokens' },
    { label: 'Embeddings', icon: 'EM', desc: 'Convert to vectors' },
    { label: 'Transformer', icon: '⚡', desc: 'Process through layers' },
    { label: 'Attention', icon: 'AT', desc: 'Focus on relevant tokens' },
    { label: 'Reasoning', icon: 'NN', desc: 'Generate understanding' },
    { label: 'Output', icon: 'OU', desc: 'Final response' },
  ];
  const boxW = 76;
  const boxH = 44;
  const gap = 8;
  const totalW = steps.length * boxW + (steps.length - 1) * gap;
  const startX = (610 - totalW) / 2;

  return (
    <svg viewBox="0 0 610 260" className="w-full max-w-2xl mx-auto cursor-pointer" xmlns="http://www.w3.org/2000/svg">
      <text x="305" y="16" textAnchor="middle" fontSize="13" fill="#94a3b8" fontWeight="600">How an LLM Processes Your Prompt</text>
      {steps.map((s, i) => {
        const x = startX + i * (boxW + gap);
        const isActive = i === activeStep;
        const isDone = i < activeStep;
        return (
          <g key={i} onClick={() => setActiveStep(i)} style={{ cursor: 'pointer' }}>
            <rect x={x} y="45" width={boxW} height={boxH} rx="8"
              fill={isActive ? '#3b82f6' : isDone ? '#1e293b' : '#0f172a'}
              stroke={isActive ? '#60a5fa' : isDone ? '#34d399' : '#334155'}
              strokeWidth={isActive ? 2 : 1}
            />
            <text x={x + boxW / 2} y={60} textAnchor="middle" fontSize="14">{s.icon}</text>
            <text x={x + boxW / 2} y={78} textAnchor="middle" fontSize="7" fill={isActive ? 'white' : '#94a3b8'}>{s.label}</text>
            {i > 0 && (
              <path d={`M${x - gap / 2} ${45 + boxH / 2} L${x} ${45 + boxH / 2}`} stroke={isDone ? '#34d399' : '#334155'} strokeWidth="1" fill="none"/>
            )}
          </g>
        );
      })}
      {/* Detail panel */}
      <rect x="80" y="110" width="450" height="120" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="1"/>
      <text x="305" y="135" textAnchor="middle" fontSize="12" fill="#60a5fa" fontWeight="bold">{steps[activeStep].label}</text>
      <text x="305" y="155" textAnchor="middle" fontSize="9" fill="#94a3b8">{steps[activeStep].desc}</text>
      <text x="92" y="178" fontSize="8" fill="#64748b">
        {activeStep === 0 && 'User types a question. The raw text is the starting point of the pipeline.'}
        {activeStep === 1 && 'The tokenizer splits text into tokens (words/subwords). Each token gets a unique ID from the model\'s vocabulary.'}
        {activeStep === 2 && 'Each token ID is mapped to a high-dimensional vector (embedding). Similar tokens have similar vectors.'}
        {activeStep === 3 && 'Embeddings flow through stacked transformer layers. Each layer refines the representation with self-attention + feed-forward.'}
        {activeStep === 4 && 'Attention mechanisms compute relationships between all tokens. Each token "looks at" every other token to build context.'}
        {activeStep === 5 && 'The final hidden states are decoded into a probability distribution over the vocabulary. The model predicts the next token.'}
        {activeStep === 6 && 'Tokens are streamed out one by one, forming the response text. The process repeats for each new token until complete.'}
      </text>
      <text x="305" y="225" textAnchor="middle" fontSize="7" fill="#475569">Click any step above for details</text>
    </svg>
  );
}

function InsideAIMind({ activeStep }: { activeStep: number }) {
  const steps = [
    { label: 'Prompt Received', color: '#34d399', icon: '>' },
    { label: 'Tokenization', color: '#3b82f6', icon: '>' },
    { label: 'Embedding Space', color: '#a78bfa', icon: '>' },
    { label: 'Attention Between Tokens', color: '#f97316', icon: '>' },
    { label: 'Transformer Layers', color: '#fbbf24', icon: '>' },
    { label: 'Next Token Prediction', color: '#ef4444', icon: '>' },
    { label: 'Final Response', color: '#34d399', icon: '>' },
  ];
  const boxW = 120;
  const boxH = 36;
  const gap = 8;
  const startY = 40;

  return (
    <svg viewBox="0 0 610 340" className="w-full max-w-2xl mx-auto" xmlns="http://www.w3.org/2000/svg">
      <rect x="40" y="10" width="530" height="320" rx="12" fill="#0f172a" stroke="#334155" strokeWidth="1"/>
      <text x="305" y="30" textAnchor="middle" fontSize="11" fill="#94a3b8" fontWeight="600">Inside the AI's Mind — Live Pipeline</text>
      {steps.map((s, i) => {
        const y = startY + i * (boxH + gap);
        const isActive = i === activeStep;
        const isDone = i < activeStep;
        return (
          <g key={i}>
            <rect x={60} y={y} width={boxW} height={boxH} rx="6"
              fill={isActive ? s.color : isDone ? '#1e293b' : '#0f172a'}
              stroke={isActive ? s.color : isDone ? s.color : '#334155'}
              strokeWidth={isActive ? 2 : isDone ? 1 : 1}
              opacity={isActive ? 1 : isDone ? 0.7 : 0.3}
            />
            <text x={120} y={y + 22} textAnchor="middle" fontSize="10" fill={isActive || isDone ? 'white' : '#475569'} fontWeight={isActive ? 'bold' : 'normal'}>
              {s.icon} {s.label}
            </text>
            {i < steps.length - 1 && (
              <path d={`M120 ${y + boxH} L120 ${y + boxH + gap}`} stroke={isDone ? s.color : '#334155'} strokeWidth="1.5" fill="none"/>
            )}
            {/* Detail panel */}
            {isActive && (
              <g>
                <rect x={200} y={y - 2} width={350} height={boxH + 4} rx="6" fill="#1e293b" stroke={s.color} strokeWidth="1"/>
                <text x={210} y={y + 15} fontSize="8" fill={s.color} fontWeight="bold">{s.label}</text>
                <text x={210} y={y + 29} fontSize="7" fill="#94a3b8">
                  {i === 0 && 'User sends a query. The AI system receives and prepares the input for processing.'}
                  {i === 1 && 'Text is split into tokens (words/subwords). Each token mapped to a vocabulary ID.'}
                  {i === 2 && 'Token IDs → high-dimensional vectors. Semantic relationships encoded as vector distances.'}
                  {i === 3 && 'Each token attends to all others. Attention weights show relationships and context.'}
                  {i === 4 && 'Vectors pass through N transformer layers. Each layer: Self-Attention → FFN → LayerNorm.'}
                  {i === 5 && 'Final layer produces logits. Softmax converts to probabilities. Highest probability token is chosen.'}
                  {i === 6 && 'Token appended to output. Process repeats from step 1 for next token until [EOS].'}
                </text>
              </g>
            )}
          </g>
        );
      })}
      <text x="305" y="330" textAnchor="middle" fontSize="7" fill="#475569">This animation shows the journey of your input through the AI model in real-time</text>
    </svg>
  );
}

type Lesson = {
  id: string;
  title: string;
  desc: string;
  icon: ReactNode;
  duration: string;
  level: string;
  category: string;
  sections: Section[];
};

const categories = [
  { id: 'fundamentals', label: 'AI Fundamentals', icon: 'AF', desc: 'Core concepts for beginners' },
  { id: 'how-llm-works', label: 'How an LLM Works', icon: 'LL', desc: 'The full pipeline explained' },
  { id: 'deep-dives', label: 'Deep Dives', icon: 'DD', desc: 'Advanced technical topics' },
  { id: 'interactive', label: 'Interactive Labs', icon: 'IL', desc: 'Hands-on AI exploration' },
  { id: 'ethics', label: 'AI Ethics', icon: 'AE', desc: 'Responsible AI development' },
  { id: 'challenges', label: 'Challenges', icon: 'CH', desc: 'Test your knowledge' },
];

const lessons: Lesson[] = [
  {
    id: 'attention',
    title: 'What is Attention?',
    desc: 'Learn how attention mechanisms work in transformers to focus on relevant parts of input.',
    icon: 'AT',
    duration: '10 min',
    level: 'Beginner',
    category: 'deep-dives',
    sections: [
      {
        title: 'The Intuition',
        visual: 'diagram',
        diagram: <AttentionDiagram />,
        points: [
          { label: 'Focus', desc: 'Attention lets a model focus on relevant input parts — like reading "sat" while paying attention to "cat" more than "the".', color: nodeColors.blue },
          { label: 'Weights', desc: 'Each token gets an attention weight for every other token, forming a probability distribution.', color: nodeColors.purple },
          { label: 'Context', desc: 'The weighted sum of all values produces a context-aware representation of each token.', color: nodeColors.green },
        ],
      },
      {
        title: 'QKV — Query, Key, Value',
        visual: 'explanation',
        content: 'Every token is projected into three vectors via learned weight matrices:',
        items: [
          { term: 'Query (Q)', def: 'What this token is "looking for"', color: '#60a5fa' },
          { term: 'Key (K)', def: 'What information this token "has"', color: '#a78bfa' },
          { term: 'Value (V)', def: 'The actual content to pass through', color: '#34d399' },
        ],
        formula: 'Attention(Q, K, V) = softmax(QK^T / √d_k) · V',
        formulaDetail: '1. Dot product Q·K^T gives raw scores | 2. Scale by √d_k to stabilize gradients | 3. Softmax turns scores into probabilities | 4. Multiply by V to get weighted output',
      },
      {
        title: 'Multi-Head Attention',
        visual: 'diagram',
        diagram: <AttentionHeatmap />,
        content: 'Instead of one attention pattern, transformers use multiple "heads" that learn different relationships simultaneously:',
        items: [
          { term: 'Head 1', def: 'Syntax — grammatical relationships', color: '#60a5fa' },
          { term: 'Head 2', def: 'Semantics — meaning relationships', color: '#a78bfa' },
          { term: 'Head 3', def: 'Position — distance relationships', color: '#34d399' },
          { term: 'Head 4', def: 'Entity — object/name tracking', color: '#f472b6' },
        ],
        note: 'Outputs from all heads are concatenated and projected back to the original dimension.',
      },
      {
        title: 'Causal Masking & GQA',
        visual: 'explanation',
        content: 'Modern optimizations that make attention practical for real-world LLMs:',
        items: [
          { term: 'Causal Masking', def: 'Prevents decoder tokens from attending to future positions. Implemented via an upper-triangular mask of -inf in the softmax.', color: '#60a5fa' },
          { term: 'Grouped Query Attention (GQA)', def: 'Uses fewer K/V heads than Q heads (e.g., 8 Q heads share 4 K/V groups). Dramatically reduces KV-cache memory with minimal quality loss. Used in Llama 2/3, Gemma.', color: '#34d399' },
          { term: 'Flash Attention', def: 'IO-aware algorithm that computes attention in tiles without materializing the full N×N matrix to HBM. 2-4× faster, uses O(N) memory instead of O(N²).', color: '#a78bfa' },
          { term: 'Sliding Window Attention', def: 'Each token only attends to a local window (e.g., 4096 tokens). Linear scaling instead of quadratic. Used in Mistral, Gemma.', color: '#f472b6' },
        ],
        formula: 'Standard: O(N²) memory | Flash: O(N) memory | Sliding window: O(N·W) with window size W',
        note: 'GQA + Flash Attention are the key innovations that enabled 128K+ context windows in modern LLMs.',
      },
    ],
  },
  {
    id: 'tokenization',
    title: 'Tokenization 101',
    desc: 'How text gets split into tokens for AI processing.',
    icon: 'TK',
    duration: '8 min',
    level: 'Beginner',
    category: 'deep-dives',
    sections: [
      {
        title: 'What Are Tokens?',
        visual: 'diagram',
        diagram: <TokenizationDiagram />,
        points: [
          { label: 'Tokens', desc: 'Basic units of text — can be whole words, subwords, or even individual characters.', color: nodeColors.blue },
          { label: 'Vocabulary', desc: 'Models have a fixed vocab (e.g., 50K tokens). Rare words are split into known subwords.', color: nodeColors.purple },
          { label: 'Token IDs', desc: 'Each token maps to a unique integer ID that the model processes numerically.', color: nodeColors.green },
        ],
      },
      {
        title: 'Byte-Pair Encoding (BPE)',
        visual: 'explanation',
        content: 'The most common tokenization algorithm in modern LLMs (GPT, Llama, Gemma):',
        steps: [
          'Start with individual characters as the base vocabulary',
          'Count all adjacent pairs of tokens in the training corpus',
          'Merge the most frequent pair into a new token',
          'Repeat until the desired vocabulary size is reached',
          'During inference, apply the learned merges to new text',
        ],
        note: 'BPE elegantly handles rare words by decomposing them into familiar subword pieces.',
      },
      {
        title: 'Token Statistics',
        visual: 'explanation',
        items: [
          { term: 'English', def: '~0.75 tokens/word (~750 tokens for 1000 words)', color: '#60a5fa' },
          { term: 'Code', def: '~1.2 tokens/word (spaces and syntax add tokens)', color: '#34d399' },
          { term: 'Chinese', def: '~1.5-3 tokens/character (each character is dense)', color: '#f472b6' },
          { term: 'Special chars', def: 'Emojis can be 2-8 tokens each', color: '#fbbf24' },
        ],
        tip: 'Token count directly affects API cost and processing speed — shorter prompts save money!',
      },
      {
        title: 'SentencePiece & Tokenizer Training',
        visual: 'explanation',
        content: 'Modern tokenizers (used by Gemma, Llama, T5) work differently from BPE:',
        items: [
          { term: 'SentencePiece', def: 'Unlike BPE which operates on space-separated words, SentencePiece treats the raw text as a stream of Unicode characters. Spaces are just another character, so no pre-tokenization is needed. This handles languages without spaces (Chinese, Japanese) naturally.', color: '#60a5fa' },
          { term: 'Unigram LM Tokenization', def: 'Instead of merging pairs, Unigram starts with a large vocab and iteratively removes the least likely tokens based on a language model over the training data. Used by Gemma and T5.', color: '#34d399' },
          { term: 'Special Tokens', def: 'Tokenizers include special control tokens: [BOS] (beginning), [EOS] (end), [PAD], [UNK] (unknown). Chat templates add [INST], [/INST], [SYS], etc. These consume vocabulary slots but enable structured prompting.', color: '#a78bfa' },
        ],
        note: 'The choice of tokenizer dramatically affects model performance — Gemma 2 uses a 256K token vocabulary, one of the largest.',
      },
    ],
  },
  {
    id: 'neural-networks',
    title: 'Neural Networks',
    desc: 'The building blocks of modern AI explained visually.',
    icon: 'NN',
    duration: '15 min',
    level: 'Intermediate',
    category: 'deep-dives',
    sections: [
      {
        title: 'Neurons & Layers',
        visual: 'diagram',
        diagram: <NeuralNetDiagram />,
        points: [
          { label: 'Neuron', desc: 'A single unit: input × weight + bias → activation function → output', color: nodeColors.blue },
          { label: 'Layer', desc: 'A collection of neurons operating in parallel, transforming the input space', color: nodeColors.purple },
          { label: 'Depth', desc: 'Deep networks (many layers) learn hierarchical features — edges → shapes → objects → concepts', color: nodeColors.green },
        ],
      },
      {
        title: 'Activation Functions',
        visual: 'explanation',
        items: [
          { term: 'ReLU (Most Common)', def: 'f(x) = max(0, x) — simple, fast, solves vanishing gradient', color: '#60a5fa' },
          { term: 'Sigmoid', def: 'f(x) = 1/(1+e^-x) — squashes output to 0..1, used for probabilities', color: '#34d399' },
          { term: 'Tanh', def: 'f(x) = (e^x - e^-x)/(e^x + e^-x) — zero-centered, good for hidden layers', color: '#a78bfa' },
          { term: 'Softmax', def: 'Converts logits to probabilities summing to 1 — used in final layer', color: '#f472b6' },
        ],
        formula: 'Neuron output = σ(w₁x₁ + w₂x₂ + ... + wₙxₙ + b)',
      },
      {
        title: 'Backpropagation',
        visual: 'explanation',
        content: 'How neural networks learn from their mistakes:',
        steps: [
          'Forward pass: compute output ŷ from input x',
          'Calculate loss: L = (y - ŷ)² (difference between prediction and truth)',
          'Compute gradient: ∂L/∂w for every weight w (chain rule)',
          'Update weights: w ← w - η · ∂L/∂w (gradient descent step)',
          'Repeat until loss converges to a minimum',
        ],
        note: 'The learning rate η controls step size — too large = unstable, too small = slow convergence.',
      },
      {
        title: 'Regularization & Optimization',
        visual: 'explanation',
        content: 'Techniques that prevent overfitting and make deep networks train reliably:',
        items: [
          { term: 'Dropout', def: 'Randomly sets a fraction (e.g., 0.1-0.5) of neuron outputs to zero during each training step. Forces the network to learn redundant representations. Only active during training, not inference.', color: '#60a5fa' },
          { term: 'Batch Normalization', def: 'Normalizes each batch to have mean 0 and variance 1. Allows higher learning rates, reduces sensitivity to initialization, and provides a slight regularization effect. Applied before or after activation.', color: '#34d399' },
          { term: 'Adam / AdamW Optimizer', def: 'The default optimizer for LLM training. Combines momentum (accelerates convergence) with adaptive learning rates (different LR per parameter). AdamW improves weight decay decoupling.', color: '#a78bfa' },
          { term: 'Gradient Clipping', def: 'Caps the gradient norm to a max value (e.g., 1.0). Prevents exploding gradients in deep networks and RNNs. Essential for stable transformer training.', color: '#f472b6' },
        ],
        formula: 'Dropout: y = mask · σ(Wx + b) | BatchNorm: x̂ = (x - μ_β) / √(σ²_β + ε) | Adam: θ ← θ - η · m̂_t / (√v̂_t + ε)',
      },
    ],
  },
  {
    id: 'transformers',
    title: 'Transformer Architecture',
    desc: 'Deep dive into the transformer model that powers modern AI.',
    icon: <IconZap size={14} />,
    duration: '20 min',
    level: 'Advanced',
    category: 'deep-dives',
    sections: [
      {
        title: 'Encoder-Decoder Structure',
        visual: 'diagram',
        diagram: <TransformerDiagram />,
        points: [
          { label: 'Encoder', desc: 'Reads input text bidirectionally — each token sees all other tokens', color: nodeColors.blue },
          { label: 'Decoder', desc: 'Generates output autoregressively — each token only sees previous tokens', color: nodeColors.green },
          { label: 'Cross-Attention', desc: 'Decoder queries the encoder\'s output for relevant context during generation', color: nodeColors.purple },
        ],
      },
      {
        title: 'Positional Encoding',
        visual: 'explanation',
        content: 'Since transformers process all tokens in parallel (not sequentially), they need positional information injected:',
        items: [
          { term: 'Sinusoidal Encoding', def: 'PE(pos,2i) = sin(pos/10000^(2i/d)), PE(pos,2i+1) = cos(...)', color: '#60a5fa' },
          { term: 'Learned Encoding', def: 'Position embeddings are learned like token embeddings during training', color: '#34d399' },
          { term: 'RoPE (Modern)', def: 'Rotary Position Embedding — rotates Q and K vectors by position angle', color: '#a78bfa' },
          { term: 'ALiBi (Modern)', def: 'Attention with Linear Biases — adds bias based on distance, no learned embeddings', color: '#f472b6' },
        ],
        note: 'Sinusoidal encodings let the model extrapolate to longer sequences than it was trained on.',
      },
      {
        title: 'Residual Connections & Layer Norm',
        visual: 'explanation',
        content: 'Two critical components that make deep transformers trainable:',
        formula: 'output = LayerNorm(x + Sublayer(x))',
        items: [
          { term: 'Residual Connections', def: '"Skip connections" that add the input back to the layer output. Gradients flow directly through these, preventing vanishing gradients in deep (>50 layer) networks.', color: '#60a5fa' },
          { term: 'Layer Normalization', def: 'Normalizes activations across the feature dimension to have mean 0 and variance 1. Stabilizes training and reduces sensitivity to learning rate.', color: '#34d399' },
        ],
      },
      {
        title: 'KV-Cache & Inference Optimization',
        visual: 'explanation',
        content: 'How transformers generate text efficiently at inference time:',
        items: [
          { term: 'KV-Cache', def: 'During autoregressive generation, the K and V values from previous tokens are cached instead of recomputed. For each new token, you only compute attention against the cached K/V. This is why the first token is slow (fills cache) and subsequent tokens are fast.', color: '#60a5fa' },
          { term: 'Speculative Decoding', def: 'A small "draft" model generates several tokens quickly, then the large model verifies them in parallel. If accepted, you get multiple tokens per forward pass. 2-3× speedup with no quality loss.', color: '#34d399' },
          { term: 'Quantization for Inference', def: 'Reducing weights from 16-bit to 4-bit or 8-bit. 4-bit quantized 70B models fit on a single GPU. Techniques: GPTQ (post-training), AWQ (activation-aware), GGUF (CPU-friendly).', color: '#a78bfa' },
          { term: 'Continuous Batching', def: 'Rather than waiting for one request to finish, the serving system batches multiple ongoing requests together. In-flight tokens from different requests are processed in one forward pass. Essential for cost-efficient serving.', color: '#f472b6' },
        ],
        formula: 'KV-cache size = 2 × layers × hidden_dim × sequence_length × bytes_per_param',
        note: 'KV-cache is why 128K context windows require so much RAM — the cache for a 70B model at 128K length is ~80GB!',
      },
    ],
  },
  {
    id: 'embeddings',
    title: 'Embeddings & Vectors',
    desc: 'How words become numbers that AI can understand.',
    icon: 'EM',
    duration: '12 min',
    level: 'Intermediate',
    category: 'deep-dives',
    sections: [
      {
        title: 'The Vector Space',
        visual: 'diagram',
        diagram: <EmbeddingDiagram />,
        points: [
          { label: 'Mapping', desc: 'Each word is mapped to a point in high-dimensional space (e.g., 1536D for GPT-4)', color: nodeColors.blue },
          { label: 'Similarity', desc: 'Similar words cluster together — cosine distance measures how close they are', color: nodeColors.purple },
          { label: 'Analogies', desc: 'Vector arithmetic works: "king" - "man" + "woman" ≈ "queen"', color: nodeColors.green },
        ],
      },
      {
        title: 'Static vs. Contextual',
        visual: 'explanation',
        content: 'There are two generations of embedding models:',
        items: [
          { term: 'Static (Word2Vec, GloVe)', def: 'One fixed vector per word regardless of context. "Bank" in "river bank" and "money bank" = same vector.', color: '#60a5fa' },
          { term: 'Contextual (BERT, GPT)', def: 'Dynamic vectors that change based on surrounding words. Same word in different contexts = different vectors.', color: '#34d399' },
        ],
        note: 'Modern LLMs use contextual embeddings, which is why they understand polysemy (words with multiple meanings).',
      },
      {
        title: 'Dimensionality & Reduction',
        visual: 'explanation',
        items: [
          { term: 'Why 1536 dimensions?', def: 'High dimensions capture rich semantic relationships. Each dimension can encode a different "feature" (gender, tense, formality, etc.)', color: '#60a5fa' },
          { term: 'PCA (Linear)', def: 'Principal Component Analysis — finds the directions of highest variance, projects down', color: '#a78bfa' },
          { term: 't-SNE (Non-linear)', def: 't-Distributed Stochastic Neighbor Embedding — preserves local neighborhoods, great for visualization', color: '#34d399' },
          { term: 'UMAP (Modern)', def: 'Uniform Manifold Approximation — faster than t-SNE, better preserves global structure', color: '#f472b6' },
        ],
        tip: 'We reduce to 2D/3D for visualization, but always lose some information in the process.',
      },
      {
        title: 'Cross-Encoder vs Bi-Encoder',
        visual: 'explanation',
        content: 'Two fundamentally different approaches to measuring text similarity:',
        items: [
          { term: 'Bi-Encoder (Dual Encoder)', def: 'Encodes two texts independently into separate vectors. Queries can be pre-computed and stored. At search time, compute cosine similarity — O(1) per comparison. Used in RAG retrieval. Fast, scalable to millions of docs.', color: '#60a5fa' },
          { term: 'Cross-Encoder', def: 'Takes both texts as a single concatenated input and processes them through attention together. Much more accurate (the texts "see" each other) but O(N) per comparison — you must re-encode for every pair. Used for re-ranking top results.', color: '#34d399' },
          { term: 'Typical Pipeline', def: 'Stage 1: Bi-encoder retrieves top-100 candidates fast. Stage 2: Cross-encoder re-ranks top-10 for precision. Hybrid approach gives both speed and accuracy.', color: '#a78bfa' },
        ],
        formula: 'Bi-Encoder: sim(A,B) = cos(E(A), E(B)) | Cross-Encoder: score = Classifier(Encoder([A; B]))',
        note: 'Real-world search systems use both: bi-encoder for candidate retrieval, cross-encoder for final ranking.',
      },
    ],
  },
  {
    id: 'rl',
    title: 'Reinforcement Learning',
    desc: 'How AI learns from rewards, feedback, and interaction.',
    icon: 'RL',
    duration: '18 min',
    level: 'Advanced',
    category: 'deep-dives',
    sections: [
      {
        title: 'The RL Loop',
        visual: 'diagram',
        diagram: <RLDiaqram />,
        points: [
          { label: 'Agent', desc: 'The AI that makes decisions (policy π) based on the current state', color: nodeColors.blue },
          { label: 'Environment', desc: 'The world the agent interacts with — gives new states and rewards', color: nodeColors.green },
          { label: 'Reward Signal', desc: 'The feedback loop — positive reward reinforces good actions, negative discourages bad ones', color: nodeColors.orange },
        ],
      },
      {
        title: 'RLHF — The Secret Sauce',
        visual: 'explanation',
        content: 'Reinforcement Learning from Human Feedback is how models like GPT-4 and Claude are aligned:',
        steps: [
          'Supervised Fine-Tuning (SFT): Train on high-quality human demonstrations',
          'Collect preferences: Humans rank model outputs from best to worst',
          'Train a Reward Model: Learns to predict human preference scores',
          'PPO Optimization: The LLM is optimized to maximize the reward model\'s score',
          'Iterate: Repeat the process, gradually improving alignment',
        ],
        note: 'RLHF is why modern chatbots are helpful, harmless, and honest — it aligns AI with human values.',
      },
      {
        title: 'PPO Algorithm',
        visual: 'explanation',
        content: 'Proximal Policy Optimization is the workhorse of modern RLHF:',
        items: [
          { term: 'Objective', def: 'Maximize expected reward while keeping the policy "close" to the original (avoiding catastrophic forgetting)', color: '#60a5fa' },
          { term: 'Clipping', def: 'PPO clips the update ratio to [1-ε, 1+ε], preventing destructively large policy changes', color: '#34d399' },
          { term: 'KL Penalty', def: 'Adds a KL-divergence penalty between new and old policy — ensures the model doesn\'t drift too far', color: '#a78bfa' },
          { term: 'Advantage', def: 'How much better/worse was this action compared to average? Positive = reinforce, negative = discourage', color: '#f472b6' },
        ],
        formula: 'L_CLIP(θ) = E_t[min(r_t(θ)Â_t, clip(r_t(θ), 1-ε, 1+ε)Â_t)]',
      },
      {
        title: 'Exploration vs. Exploitation',
        visual: 'explanation',
        content: 'The fundamental dilemma in reinforcement learning:',
        items: [
          { term: 'Exploitation', def: 'Choose the action you know gives the best reward. Greedy approach — maximizes short-term reward but may miss better strategies.', color: '#60a5fa' },
          { term: 'Exploration', def: 'Try new actions to discover potentially better rewards. Essential for learning but may incur short-term cost. Must balance with exploitation.', color: '#34d399' },
          { term: 'Epsilon-Greedy', def: 'With probability ε, take a random action (explore). With probability 1-ε, take the best-known action (exploit). ε typically decays from 1.0 to 0.01 during training.', color: '#a78bfa' },
          { term: 'Thompson Sampling', def: 'Bayesian approach — maintains a probability distribution over which actions are best. Samples from the distribution to decide. Naturally balances exploration for uncertain actions.', color: '#f472b6' },
        ],
        formula: 'ε-greedy: π(a|s) = argmax Q(s,a) with prob 1-ε, random with prob ε',
        note: 'Modern LLMs like GPT-4 use RLHF + PPO, which inherently balances exploration (trying new responses) with exploitation (using what works).',
      },
    ],
  },
  {
    id: 'diffusion',
    title: 'Diffusion Models',
    desc: 'How AI generates images by learning to reverse a noise process.',
    icon: 'DF',
    duration: '20 min',
    level: 'Advanced',
    category: 'deep-dives',
    sections: [
      {
        title: 'The Diffusion Process',
        visual: 'diagram',
        diagram: <DiffusionDiagram />,
        points: [
          { label: 'Forward: Noise', desc: 'Gradually add Gaussian noise to an image over T steps until it becomes pure noise. This destroys structure.', color: nodeColors.blue },
          { label: 'Reverse: Denoise', desc: 'Train a neural network to reverse the noise process — predicting and removing noise step by step to reconstruct the original.', color: nodeColors.purple },
          { label: 'Generation', desc: 'At inference, start from pure noise and apply the learned denoising steps to generate a new image.', color: nodeColors.green },
        ],
      },
      {
        title: 'How Denoising Works',
        visual: 'explanation',
        content: 'The core math behind diffusion models:',
        items: [
          { term: 'Noise Schedule', def: 'A variance schedule β_1...β_T controls how much noise is added at each step. Linear or cosine schedules work best. More steps (T=1000) give better quality.', color: '#60a5fa' },
          { term: 'U-Net Architecture', def: 'The denoiser is a U-Net with skip connections. It takes the noisy image x_t and timestep t as input, predicts the noise ε that was added. Encoder downsamples, decoder upsamples, skip connections preserve details.', color: '#34d399' },
          { term: 'Training Objective', def: 'Simple MSE loss between predicted noise and actual noise: L = E[||ε - ε_θ(x_t, t)||²]. No need for paired data — just take clean images and add noise.', color: '#a78bfa' },
        ],
        formula: 'x_t = √(1-β_t)·x_{t-1} + √(β_t)·ε | L = ||ε - ε_θ(√(α̅_t)·x_0 + √(1-α̅_t)·ε, t)||²',
        note: 'The loss is calculated directly in noise space, not pixel space — this is why diffusion training is stable.',
      },
      {
        title: 'Text-to-Image Conditioning',
        visual: 'explanation',
        content: 'How models like Stable Diffusion understand prompts:',
        steps: [
          'Encoder: Text prompt → CLIP text encoder → text embedding (77 tokens × 768 dims)',
          'Latent Space: Instead of pixels, operate in a compressed VAE latent space (64×64 instead of 512×512)',
          'Cross-Attention: The U-Net denoiser attends to text embeddings at each step via cross-attention layers',
          'Classifier-Free Guidance (CFG): During training, randomly drop the text condition. At inference, extrapolate: ε_guided = ε_uncond + γ·(ε_cond - ε_uncond)',
          'Decoder: After denoising, the VAE decoder converts the latent back to a full-resolution image',
        ],
        note: 'Stable Diffusion runs denoising in latent space — that is why it is 10× faster than pixel-space diffusion (like DALL-E 2).',
      },
    ],
  },
  {
    id: 'rag',
    title: 'Retrieval-Augmented Generation',
    desc: 'How AI searches external knowledge to answer accurately.',
    icon: 'RG',
    duration: '15 min',
    level: 'Intermediate',
    category: 'deep-dives',
    sections: [
      {
        title: 'The RAG Pipeline',
        visual: 'diagram',
        diagram: <RAGDiagram />,
        points: [
          { label: 'Retrieve', desc: 'Convert the user query into a vector embedding, then search a vector database for the most semantically similar documents.', color: nodeColors.blue },
          { label: 'Augment', desc: 'Insert the retrieved documents into the LLM prompt as context, alongside the original query.', color: nodeColors.purple },
          { label: 'Generate', desc: 'The LLM generates an answer grounded in the provided context — reducing hallucination by giving it factual sources.', color: nodeColors.green },
        ],
      },
      {
        title: 'Vector Search & Embeddings',
        visual: 'explanation',
        content: 'How retrieval works under the hood:',
        items: [
          { term: 'Document Chunking', def: 'Documents are split into chunks (e.g., 512 tokens with 128 overlap). Chunk boundaries matter — semantic chunking (by paragraphs/sections) beats fixed-size splitting.', color: '#60a5fa' },
          { term: 'Embedding Models', def: 'A dedicated embedding model (e.g., text-embedding-3-small, BGE, E5) converts each chunk into a vector. Models are trained on contrastive learning: similar texts → close vectors, dissimilar → far apart.', color: '#34d399' },
          { term: 'Approximate Nearest Neighbor (ANN)', def: 'Brute-force cosine similarity is O(N) per query. ANN indexes (HNSW, IVF, FAISS) organize vectors into navigable graphs for logarithmic search. Millions of docs searched in milliseconds.', color: '#a78bfa' },
          { term: 'Hybrid Search', def: 'Combine vector similarity with keyword search (BM25). Vector finds semantic matches, BM25 finds exact keyword matches. Reciprocal Rank Fusion (RRF) merges results. Best of both worlds.', color: '#f472b6' },
        ],
        note: 'RAG is the primary way enterprises ground LLMs in their own data — it requires no model retraining.',
      },
      {
        title: 'Advanced RAG Patterns',
        visual: 'explanation',
        content: 'Production RAG systems go beyond simple retrieve-and-generate:',
        steps: [
          'Query Rewriting: Use a small LLM to rewrite the user query into a better search query before retrieval',
          'Self-RAG: The LLM generates special tokens indicating whether retrieval is needed, then reflects on retrieved relevance',
          'Re-Ranking: After retrieving top-K, use a cross-encoder to re-rank results for precision',
          'Fusion: Query multiple sources (vector DB, web search, SQL database) and fuse results',
          'RAPTOR: Build a hierarchical summary tree over documents — retrieve at different abstraction levels',
        ],
        note: 'Meta introduced "Self-RAG" and "CRAG" — letting the model decide when and how to retrieve, improving both accuracy and efficiency.',
      },
    ],
  },
  {
    id: 'moe',
    title: 'Mixture of Experts (MoE)',
    desc: 'How models scale to trillions of parameters while staying efficient.',
    icon: 'MO',
    duration: '15 min',
    level: 'Advanced',
    category: 'deep-dives',
    sections: [
      {
        title: 'Sparse Activation',
        visual: 'diagram',
        diagram: <MoEDiagram />,
        points: [
          { label: 'Router', desc: 'A learned gating network decides which experts to activate for each token. Typically top-2 out of 8-64 experts are selected.', color: nodeColors.blue },
          { label: 'Experts', desc: 'Each expert is an independent feed-forward network. Different experts specialize in different patterns (math, code, syntax, etc.).', color: nodeColors.purple },
          { label: 'Sparsity', desc: 'Only a fraction of parameters are active per token. Mixtral 8x7B has 47B total params but only 13B active per forward pass.', color: nodeColors.green },
        ],
      },
      {
        title: 'Routing Strategies',
        visual: 'explanation',
        content: 'How the router decides which experts to use:',
        items: [
          { term: 'Top-K Routing', def: 'The router outputs a probability for each expert. Only the top-K experts (usually K=2) are activated. Others contribute zero. Output = weighted sum of top-K expert outputs, weighted by router probabilities.', color: '#60a5fa' },
          { term: 'Load Balancing Loss', def: 'An auxiliary loss that encourages uniform expert utilization. Without it, the router might always pick the same few experts, defeating the purpose. Added to the main training loss with small weight (0.01).', color: '#34d399' },
          { term: 'Capacity Factor', def: 'Each expert has a finite "capacity" — how many tokens it can process. Tokens exceeding capacity are dropped (routed to the next choice). Controls computational cost.', color: '#a78bfa' },
          { term: 'Expert Parallelism', def: 'Experts are distributed across different GPUs. Each GPU hosts a subset of experts. Tokens are routed across GPUs via all-to-all communication. Enables training of trillion-parameter models.', color: '#f472b6' },
        ],
        formula: 'MoE(x) = Σ_{i=1}^E G(x)_i · E_i(x) where G(x) = softmax(Top-K(W_g · x))',
        note: 'The auxiliary load balancing loss is critical — without it, the router collapses to using only 1-2 experts.',
      },
      {
        title: 'MoE in Practice',
        visual: 'explanation',
        content: 'Real-world models using Mixture of Experts:',
        items: [
          { term: 'Mixtral 8x7B (Mistral)', def: '8 experts with 7B params each. Total: 47B, Active: 13B. Outperforms Llama 2 70B with 1/5 the compute. Uses top-2 routing, 32K context.', color: '#60a5fa' },
          { term: 'GPT-4 (OpenAI)', def: 'Rumored to be 8 MoE with ~220B active params out of ~1.8T total. 16 experts, top-2 routing. This sparse design explains GPT-4\'s massive capability with reasonable inference cost.', color: '#34d399' },
          { term: 'DeepSeekMoE', def: 'Innovative design with "shared" experts and "routed" experts. 2 shared + 160 routed experts. Achieves GPT-4-level performance with much fewer active parameters.', color: '#a78bfa' },
          { term: 'Dbrx (Databricks)', def: '132B total, 36B active. 16 experts, top-4 routing — unusual for using more than 2 experts. Fine-tuned for code and reasoning tasks.', color: '#f472b6' },
        ],
        tip: 'MoE models are great for serving: you pay for 13B-36B of compute but get 70B+ quality. This is why Mixtral is so popular for self-hosting.',
      },
    ],
  },
  {
    id: 'finetuning',
    title: 'Fine-Tuning & PEFT',
    desc: 'How to adapt pretrained models to custom tasks without training from scratch.',
    icon: 'FT',
    duration: '18 min',
    level: 'Intermediate',
    category: 'deep-dives',
    sections: [
      {
        title: 'Full Fine-Tuning vs. PEFT',
        visual: 'diagram',
        diagram: <FinetuneDiagram />,
        points: [
          { label: 'Full Fine-Tune', desc: 'Update all model parameters on domain data. Most powerful but expensive — requires full GPU memory for training, produces a complete model copy per task.', color: nodeColors.blue },
          { label: 'LoRA', desc: 'Inject rank-decomposition matrices (A·B) into attention layers. Only ~0.1-1% of parameters are trainable. The base model stays frozen and can be shared across many LoRA adapters.', color: nodeColors.green },
          { label: 'PEFT Adapters', desc: 'Small bottleneck neural modules inserted between transformer layers. Each task gets its own adapter. Base model remains unchanged.', color: nodeColors.pink },
        ],
      },
      {
        title: 'LoRA — Low-Rank Adaptation',
        visual: 'explanation',
        content: 'The most popular parameter-efficient fine-tuning method:',
        items: [
          { term: 'How it Works', def: 'For a weight matrix W ∈ ℝ^{d×k}, learn two small matrices A ∈ ℝ^{d×r} and B ∈ ℝ^{r×k} where r ≪ d,k. The update is ΔW = A·B. Typical rank r = 8-64. During training, W is frozen; only A and B update.', color: '#60a5fa' },
          { term: 'Why Rank is Effective', def: 'The "intrinsic dimension" of fine-tuning is very low. A rank-64 update (only 128×64 params for a 4096×4096 matrix) captures most of the expressiveness needed for task adaptation.', color: '#34d399' },
          { term: 'QLoRA', def: 'Quantized LoRA — the base model is loaded in 4-bit (NF4 format), LoRA adapters remain in 16-bit. A 70B model fits in 48GB VRAM for training. Made fine-tuning accessible on consumer GPUs.', color: '#a78bfa' },
          { term: 'Merging & Deployment', def: 'After training, the LoRA weights A·B can be merged back into the original W: W\' = W + α·A·B. No inference overhead — the merged model runs at full speed. Adapters can also be kept separate for hot-swapping.', color: '#f472b6' },
        ],
        formula: 'h = W₀x + ΔWx = W₀x + BAx | Trainable: A, B | Frozen: W₀ | r = 8-64',
        note: 'LoRA adapters are <10MB for most tasks. You can store hundreds of fine-tuned "skills" and swap them at runtime.',
      },
      {
        title: 'When to Use Each Method',
        visual: 'explanation',
        content: 'Choose your fine-tuning strategy based on your constraints:',
        items: [
          { term: 'Full Fine-Tune', def: 'Use when: you have >100K high-quality examples, need maximum quality, have ≥8 GPUs (for 70B). Cost: $5K-50K. Best for: domain-specific base models (e.g., code Llama, medical GPT).', color: '#60a5fa' },
          { term: 'LoRA/QLoRA', def: 'Use when: you have 1K-10K examples, want to adapt quickly, have 1 GPU. Cost: ~$10-100. Best for: instruction tuning, style adaptation, task-specific formatting.', color: '#34d399' },
          { term: 'Prompt Tuning', def: 'Learn only a small set of "soft prompt" tokens prepended to the input. No model weights changed. Extremely lightweight (<1MB per task). Best for: when you can\'t modify the model at all.', color: '#a78bfa' },
          { term: 'RAG (no training)', def: 'Use when: you need to inject new factual knowledge, change frequently, or need citations. No training required — just provide context in the prompt. Best for: Q&A over custom documents.', color: '#f472b6' },
        ],
        tip: 'Start with RAG (no cost), move to LoRA if quality isn\'t enough, go full fine-tune only as a last resort.',
      },
    ],
  },
  {
    id: 'ai-fundamentals',
    title: 'AI Fundamentals',
    desc: 'Core concepts — what AI is, its history, and the different types that exist today.',
    icon: 'AF',
    duration: '15 min',
    level: 'Beginner',
    category: 'fundamentals',
    sections: [
      {
        title: 'What is AI?',
        visual: 'explanation',
        points: [
          { label: 'Definition', desc: 'AI is the simulation of human intelligence by machines. Systems that can learn, reason, perceive, and make decisions.', color: nodeColors.blue },
          { label: 'Goal', desc: 'Create machines that can perform tasks requiring human-like intelligence — from playing chess to writing poetry to diagnosing diseases.', color: nodeColors.green },
          { label: 'Key Insight', desc: 'AI doesn\'t need to "think" like humans — it just needs to produce useful results. A calculator "computes" but an AI "learns to compute."', color: nodeColors.purple },
        ],
      },
      {
        title: 'AI vs ML vs Deep Learning',
        visual: 'explanation',
        content: 'These terms are often confused. Here is the hierarchy:',
        items: [
          { term: 'Artificial Intelligence (AI)', def: 'The broadest field — any machine that exhibits intelligent behavior. Includes everything from chess programs to self-driving cars.', color: '#60a5fa' },
          { term: 'Machine Learning (ML)', def: 'A subset of AI where systems learn from data instead of being explicitly programmed. Algorithms find patterns in data without hard-coded rules.', color: '#34d399' },
          { term: 'Deep Learning (DL)', def: 'A subset of ML using multi-layer neural networks. Learns hierarchical representations automatically. Powers modern LLMs, image recognition, speech synthesis.', color: '#a78bfa' },
          { term: 'Generative AI', def: 'A subset of DL focused on creating new content (text, images, music, code). Uses models like transformers, diffusion, and GANs to generate novel outputs.', color: '#f472b6' },
        ],
        formula: 'AI ⊃ ML ⊃ Deep Learning ⊃ Generative AI',
        note: 'All deep learning is ML, all ML is AI — but not vice versa. A decision tree is ML but not deep learning.',
      },
      {
        title: 'History of AI',
        visual: 'diagram',
        diagram: <AITimeline />,
        content: 'AI has evolved through several waves:',
        steps: [
          '1950s-60s: Symbolic AI — logic, search, early chatbots (ELIZA). Proved concepts but hit complexity limits.',
          '1970s-80s: Expert systems — rule-based knowledge encoding. Commercial success but brittle and hard to maintain.',
          '1990s-2000s: Statistical ML — SVM, random forests, Bayesian methods. Data-driven rather than rule-based.',
          '2010s: Deep Learning — AlexNet (2012) sparked the neural network revolution. GPUs made deep nets practical.',
          '2017: Transformer — "Attention is All You Need" paper. Parallel processing replaced sequential RNNs.',
          '2020s: Foundation Models — GPT-3, BERT, DALL-E. Pre-trained on internet scale, adapted to any task.',
          '2024+: Multimodal AI — models that see, hear, speak, and write. GPT-4o, Gemini, Claude 3 integrated text+vision+audio.',
        ],
        note: 'The pace of progress has accelerated enormously — the jump from GPT-3 (2020) to GPT-4 (2023) was bigger than from ELIZA (1966) to GPT-3.',
      },
      {
        title: 'Types of AI & Generative AI',
        visual: 'explanation',
        content: 'AI is classified by capability and by application:',
        items: [
          { term: 'Narrow AI (ANI)', def: 'Specialized in one task — chess, translation, face recognition. All current AI is narrow. Even GPT-4 can\'t drive a car.', color: '#60a5fa' },
          { term: 'AGI (Artificial General Intelligence)', def: 'Human-level intelligence across any task. Does not exist yet. Would need to reason, plan, learn, and adapt like a human. Estimated arrival: 2030-2050 (hotly debated).', color: '#34d399' },
          { term: 'ASI (Superintelligence)', def: 'Beyond human intelligence in every field. Hypothetical — the "singularity." Risks and benefits are intensely debated by philosophers and AI researchers.', color: '#a78bfa' },
          { term: 'Generative AI Applications', def: 'Text (GPT, Claude, Gemini), Images (Midjourney, DALL-E, Stable Diffusion), Code (Copilot, Cursor), Music (Suno, Udio), Video (Sora, Runway), Speech (ElevenLabs, Whisper). Each uses different architectures.', color: '#f472b6' },
        ],
        tip: 'Most of what you use today is Narrow AI — even the most impressive models are "idiot savants" that excel at one thing.',
      },
    ],
  },
  {
    id: 'how-llm-works',
    title: 'How an LLM Works',
    desc: 'Follow your prompt step-by-step through the AI pipeline.',
    icon: <IconZap size={14} />,
    duration: '15 min',
    level: 'Beginner',
    category: 'how-llm-works',
    sections: [
      {
        title: 'The Full Pipeline',
        visual: 'diagram',
        diagram: <LLMPipeline activeStep={0} setActiveStep={() => {}} />,
        content: 'When you type a prompt, it goes through 7 stages inside the LLM. Each stage transforms the data:',
        items: [
          { term: '1. Prompt', def: 'Your raw text input — e.g., "Explain gravity like I\'m 5."', color: '#60a5fa' },
          { term: '2. Tokenizer', def: 'Splits text into tokens (subwords). "Explain gravity" → ["Explain", " grav", "ity"]. Each gets a numeric ID.', color: '#34d399' },
          { term: '3. Embeddings', def: 'Converts token IDs to high-dimensional vectors (e.g., 4096D). These capture semantic meaning.', color: '#a78bfa' },
          { term: '4. Transformer Layers', def: 'Stack of N layers (e.g., 32-96). Each layer applies self-attention + feed-forward network.', color: '#f472b6' },
          { term: '5. Attention', def: 'Each token "attends" to all others. Builds context-aware representations.', color: '#fbbf24' },
          { term: '6. Next Token Prediction', def: 'Final layer outputs probabilities for every token in vocabulary. Highest probability wins.', color: '#ef4444' },
          { term: '7. Output', def: 'Token is emitted. Process repeats until [EOS] token or length limit.', color: '#34d399' },
        ],
      },
      {
        title: 'Inside the AI\'s Mind',
        visual: 'diagram',
        diagram: <InsideAIMind activeStep={0} />,
        content: 'This visualization shows exactly what happens inside the model when you send a message. Each step transforms the data in a specific way. The pipeline runs automatically — the AI doesn\'t "think" like a human, but information flows through these stages in sequence.',
        note: 'Key insight: The model doesn\'t understand text the way humans do. It processes numerical patterns — the "meaning" emerges from the statistics of how tokens relate to each other across billions of training examples.',
      },
      {
        title: 'Autoregressive Generation',
        visual: 'explanation',
        content: 'LLMs generate text one token at a time — this is called autoregressive generation:',
        steps: [
          'Start with the input prompt tokens as the initial sequence',
          'Feed the entire sequence through the transformer — this produces one forward pass',
          'Look at the last token\'s output: it contains a probability distribution over the entire vocabulary',
          'Sample or select the next token from this distribution (greedy, top-k, top-p, temperature)',
          'Append the chosen token to the sequence',
          'Repeat: the now-longer sequence is fed through the transformer again',
          'Continue until an [EOS] token is generated or the max length is reached',
        ],
        formula: 'P(x_t | x_{<t}) = softmax(W · h_t) where h_t = Transformer(x_1, ..., x_{t-1})',
        note: 'Each token is generated one at a time, which is why responses take longer for longer outputs. The first token is the slowest (fills the KV-cache).',
      },
      {
        title: 'Why LLMs Are So Powerful',
        visual: 'explanation',
        items: [
          { term: 'Scale', def: 'Training on trillions of tokens from the internet gives broad knowledge. GPT-4 trained on ~13T tokens, ~2T parameters. This scale unlocks emergent abilities not present in smaller models.', color: '#60a5fa' },
          { term: 'In-Context Learning', def: 'LLMs can learn from examples in the prompt without weight updates. Show 3 examples of sentiment analysis → the model understands the task. This is "few-shot learning" — a property that emerges at scale.', color: '#34d399' },
          { term: 'Instruction Following', def: 'RLHF (Reinforcement Learning from Human Feedback) fine-tunes models to follow instructions. This is what makes ChatGPT helpful vs. raw GPT-3 which just completes text.', color: '#a78bfa' },
          { term: 'Emergent Abilities', def: 'Chain-of-thought reasoning, tool use, code execution, multilingual translation — these abilities appear suddenly at certain model sizes. They weren\'t explicitly programmed but emerged from scale.', color: '#f472b6' },
        ],
        tip: 'The magic of LLMs is not that they "know" things — it\'s that they can combine patterns from training data in novel ways to produce reasonable responses to never-before-seen prompts.',
      },
    ],
  },
  {
    id: 'ai-ethics',
    title: 'AI Ethics',
    desc: 'Understanding bias, hallucinations, fairness, and responsible AI development.',
    icon: <IconBalance size={14} />,
    duration: '20 min',
    level: 'Intermediate',
    category: 'ethics',
    sections: [
      {
        title: 'Bias & Fairness',
        visual: 'explanation',
        points: [
          { label: 'Data Bias', desc: 'If training data over-represents certain groups, the model learns those biases. Example: "doctor" associated with "male," "nurse" with "female."', color: nodeColors.blue },
          { label: 'Algorithmic Bias', desc: 'Even with balanced data, algorithms can amplify bias through optimization — optimizing for overall accuracy may sacrifice fairness for minority groups.', color: nodeColors.purple },
          { label: 'Mitigation', desc: 'Debias training data, use fairness constraints during training, post-process outputs, and continuously audit model behavior across demographic groups.', color: nodeColors.green },
        ],
        note: 'Bias in AI is not just a social issue — it\'s a technical problem. Biased medical AI can misdiagnose, biased hiring AI can discriminate. Fairness is a mathematical constraint.',
      },
      {
        title: 'Hallucinations & Accuracy',
        visual: 'explanation',
        content: 'LLMs confidently generate false information — this is called hallucination:',
        items: [
          { term: 'Why Hallucinations Happen', def: 'LLMs are next-token predictors, not databases. They don\'t "know" facts — they generate plausible-sounding text. When the training data doesn\'t cover a query, the model fills in with patterns that look correct.', color: '#60a5fa' },
          { term: 'Types', def: 'Factual hallucination (wrong dates, names, events), Reasoning hallucination (flawed logic with confident tone), Source hallucination (citing non-existent papers or URLs).', color: '#34d399' },
          { term: 'Detection', def: 'Ask the model to cite sources, use RAG to ground responses in retrieved documents, cross-check with external knowledge bases, and use "self-reflection" prompts.', color: '#a78bfa' },
          { term: 'Trade-off', def: 'More creative models hallucinate more. Temperature=0 reduces creativity and hallucinations but makes outputs boring. Finding the right balance depends on the use case.', color: '#f472b6' },
        ],
        tip: 'Never trust an LLM\'s output without verification — especially for medical, legal, or financial advice. RAG and citations are your best defense.',
      },
      {
        title: 'Privacy & Safety',
        visual: 'explanation',
        content: 'Key concerns when deploying AI systems:',
        steps: [
          'Data Privacy: Training data may contain personal information. Models can memorize and regurgitate sensitive data. Differential privacy during training helps but reduces quality.',
          'Prompt Injection: Users can craft prompts to bypass safety filters ("Ignore previous instructions..."). Models need robust guardrails against adversarial inputs.',
          'Data Leakage: Chatting with an LLM about proprietary code or business plans sends data to external servers. Self-hosted models or local SLMs (Llama, Gemma) avoid this.',
          'Alignment: RLHF aligns models with human values — helpful, harmless, honest. But alignment can be brittle. "Jailbreaking" finds edge cases where safety fails.',
          'Regulations: EU AI Act (2024) classifies AI by risk level. High-risk systems (healthcare, hiring, policing) require conformity assessments. US Executive Order on AI (2023) mandates safety testing.',
        ],
        note: 'Safety is not a one-time fix — it requires continuous monitoring, red-teaming, and updating as new attack vectors are discovered.',
      },
      {
        title: 'Responsible AI Principles',
        visual: 'explanation',
        items: [
          { term: 'Transparency', def: 'Users should know they are interacting with AI. Disclose AI use, explain model capabilities and limitations. Open-weight models (Llama, Gemma) enable independent auditing.', color: '#60a5fa' },
          { term: 'Accountability', def: 'Someone must be responsible for AI outputs. "The model did it" is not an excuse. Organizations must have human oversight and escalation processes.', color: '#34d399' },
          { term: 'Explainability', def: 'AI decisions should be understandable. Techniques: attention visualization, SHAP/LIME for feature importance, chain-of-thought reasoning for LLMs. "Black box" AI is increasingly regulated.', color: '#a78bfa' },
          { term: 'Inclusivity', def: 'AI should benefit everyone, not just those who build it. Consider accessibility, language diversity, cultural context, and economic impact. Digital divide could widen if AI benefits are concentrated.', color: '#f472b6' },
        ],
        note: 'The AI ethics field grows as fast as AI itself. Staying informed is a professional responsibility for anyone building with AI.',
      },
    ],
  },
  {
    id: 'ai-challenges',
    title: 'AI Challenges',
    desc: 'Hands-on exercises to test and improve your AI skills.',
    icon: 'AC',
    duration: '25 min',
    level: 'Intermediate',
    category: 'challenges',
    sections: [
      {
        title: 'Improve a Prompt',
        visual: 'explanation',
        content: 'A vague prompt gives bad results. Your challenge: improve this prompt step by step.',
        items: [
          { term: '[BAD] Bad Prompt', def: '"Tell me about AI" — too broad, the model doesn\'t know what angle you want.', color: '#ef4444' },
          { term: '[ADD] Add Context', def: '"Explain neural networks to a 10-year-old" — gives audience and tone guidance.', color: '#fbbf24' },
          { term: '[GOOD] Add Format', def: '"Explain how transformers work in 3 bullet points, then give a 2-sentence summary for a non-technical audience." — specific structure, dual audience, clear constraints.', color: '#34d399' },
        ],
        tip: 'Try: add role ("You are a physics professor"), add format ("table comparing X and Y"), add constraints ("in 50 words or less"), and add examples. Each addition improves output quality.',
      },
      {
        title: 'Identify Hallucinations',
        visual: 'explanation',
        content: 'Below are model responses. Which contain hallucinations?',
        items: [
          { term: 'Response A', def: '"The Eiffel Tower is in Paris, France. It was built in 1889 for the World\'s Fair." — CORRECT. Verifiable facts.', color: '#34d399' },
          { term: 'Response B', def: '"The Eiffel Tower was moved to London in 1924 after a Franco-British agreement." — HALLUCINATION. The tower never moved. The model fabricated a "plausible" historical event.', color: '#ef4444' },
          { term: 'Response C', def: '"According to a 2023 study by Dr. Smith at MIT, quantum computers will replace all classical computers by 2025." — HALLUCINATION. The study likely doesn\'t exist, and the claim is false. Models often invent citations.', color: '#ef4444' },
        ],
        note: 'Red flag patterns: specific years + dramatic claims, invented citations ("according to a study"), confident tone about unverifiable facts. Always verify!',
      },
      {
        title: 'Optimize Token Usage',
        visual: 'explanation',
        content: 'Tokens cost money and determine context limits. Can you rewrite these prompts to use fewer tokens?',
        steps: [
          'Original: "I would like you to please explain to me in a detailed manner how the process of photosynthesis works in green plants, step by step, so that I can understand it completely."',
          'Optimized: "Explain photosynthesis step by step." — same intent, ~80% fewer tokens.',
          'Original: "Please analyze the following customer feedback and tell me what the main issues are that customers are complaining about, and also suggest some possible solutions for each issue."',
          'Optimized: "Summarize customer complaints and suggest fixes." — ~70% fewer tokens.',
        ],
        tip: 'Remove polite phrases ("please", "I would like"), remove redundancies ("in a detailed manner"), be direct. Every token saved = more room for context and lower cost.',
      },
      {
        title: 'Design an Agent Workflow',
        visual: 'explanation',
        content: 'Your challenge: design an AI agent that answers questions about your company\'s internal documents.',
        items: [
          { term: 'Step 1: Ingestion', def: 'Parse documents (PDFs, wikis, Slack exports). Split into chunks (512 tokens, 128 overlap). Generate embeddings for each chunk. Store in vector DB (Pinecone, Chroma, Weaviate).', color: '#60a5fa' },
          { term: 'Step 2: Retrieval', def: 'User asks a question → embed the query → search top-5 most similar chunks via cosine similarity → optionally re-rank with a cross-encoder.', color: '#34d399' },
          { term: 'Step 3: Generation', def: 'Construct a prompt: "Context: [retrieved chunks]\n\nQuestion: [user query]\n\nAnswer based only on the context above." Add a "don\'t know" fallback to reduce hallucination.', color: '#a78bfa' },
          { term: 'Step 4: Evaluation', def: 'Evaluate answer quality: faithfulness (does it match the context?), relevance (does it answer the question?), completeness (does it cover all aspects?). Use LLM-as-judge for automated scoring.', color: '#f472b6' },
        ],
        tip: 'Bonus: add a "confidence score" to each answer. If confidence < 0.7, ask the user to rephrase or provide more context. This simple guardrail dramatically improves user trust.',
      },
    ],
  },
];

function DiagramCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="glass rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 border border-border/50 overflow-x-auto">
      {children}
    </div>
  );
}

function KeyPoints({ points }: { points: { label: string; desc: string; color: string }[] }) {
  return (
    <div className="grid sm:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
      {points.map((p, i) => (
        <motion.div
          key={p.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`relative overflow-hidden rounded-xl p-3 sm:p-4 border border-border/50 bg-gradient-to-br ${p.color} bg-opacity-5`}
        >
          <div className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r ${p.color}`} />
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${p.color}`} />
            <span className="font-semibold text-xs">{p.label}</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
        </motion.div>
      ))}
    </div>
  );
}

function ItemsList({ items }: { items: { term: string; def: string; color: string }[] }) {
  return (
    <div className="space-y-2 mt-4">
      {items.map((item) => (
        <div key={item.term} className="flex items-start gap-3 glass rounded-lg p-3 border border-border/50">
          <div className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ backgroundColor: item.color }} />
          <div className="min-w-0">
            <span className="text-xs font-semibold" style={{ color: item.color }}>{item.term}</span>
            <p className="text-xs text-muted-foreground mt-0.5">{item.def}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function StepsList({ steps }: { steps: string[] }) {
  return (
    <div className="space-y-1.5 mt-4">
      {steps.map((step, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold shrink-0 mt-0.5">
            {i + 1}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{step}</p>
        </div>
      ))}
    </div>
  );
}

export default function LearnPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [pipelineStep, setPipelineStep] = useState(0);

  const lesson = lessons.find((l) => l.id === activeLesson);
  const catLessons = activeCategory ? lessons.filter((l) => l.category === activeCategory) : [];

  const [mindStep, setMindStep] = useState(0);
  useEffect(() => {
    if (activeLesson !== 'how-llm-works') return;
    const timer = setInterval(() => setMindStep((s) => (s + 1) % 7), 1800);
    return () => clearInterval(timer);
  }, [activeLesson]);

  return (
    <div className="space-y-4 sm:space-y-6 max-w-6xl">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold">Learn AI</h1>
        <p className="text-sm text-muted-foreground">
          Interactive visual lessons to understand how AI works. Browse by category or jump straight in.
        </p>
      </div>

      {!activeCategory && !lesson && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((cat, i) => {
            const count = lessons.filter((l) => l.category === cat.id).length;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <GlassCard hover onClick={() => setActiveCategory(cat.id)}>
                  <CardContent>
                    <div className="flex items-center justify-center w-8 h-8 mb-3 text-[var(--neon-blue)]">{icons[cat.icon]}</div>
                    <h3 className="font-semibold text-sm mb-1">{cat.label}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{cat.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{count} lessons</span>
                      <Button size="sm">Browse →</Button>
                    </div>
                  </CardContent>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      )}

      {activeCategory && !lesson && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => setActiveCategory(null)}>
                ← All Topics
              </Button>
              <span className="inline-flex items-center justify-center w-8 h-8 text-[var(--neon-blue)]">{icons[categories.find((c) => c.id === activeCategory)?.icon ?? '']}</span>
              <div>
                <h2 className="font-bold text-lg">{categories.find((c) => c.id === activeCategory)?.label}</h2>
                <p className="text-xs text-muted-foreground">{categories.find((c) => c.id === activeCategory)?.desc}</p>
              </div>
              <span className="text-xs text-muted-foreground ml-auto">{catLessons.length} lessons</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {catLessons.map((l, i) => (
                <motion.div
                  key={l.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <GlassCard hover onClick={() => { setActiveLesson(l.id); setActiveSection(0); }}>
                    <CardContent>
                      <div className="flex items-center justify-center w-8 h-8 mb-3 text-[var(--neon-blue)]">{typeof l.icon === 'string' ? icons[l.icon] : l.icon}</div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-sm">{l.title}</h3>
                        <Badge variant={l.level === 'Beginner' ? 'success' : l.level === 'Intermediate' ? 'warning' : 'danger'} className="text-[10px]">{l.level}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{l.desc}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{l.duration}</span>
                        <Button size="sm">Start</Button>
                      </div>
                    </CardContent>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {lesson && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4 sm:space-y-6"
          >
            <div className="flex items-center gap-3 flex-wrap">
              <Button variant="ghost" size="sm" onClick={() => { setActiveLesson(null); setMindStep(0); }}>
                ← {activeCategory ? 'Lessons' : 'Topics'}
              </Button>
              <span className="inline-flex items-center justify-center w-8 h-8 text-[var(--neon-blue)]">{typeof lesson.icon === 'string' ? icons[lesson.icon] : lesson.icon}</span>
              <div>
                <h2 className="font-bold text-lg">{lesson.title}</h2>
                <p className="text-xs text-muted-foreground">{lesson.desc}</p>
              </div>
              <Badge variant={lesson.level === 'Beginner' ? 'success' : lesson.level === 'Intermediate' ? 'warning' : 'danger'} className="ml-auto">{lesson.level}</Badge>
            </div>

            <div className="flex items-center gap-3">
              <ProgressBar value={((activeSection + 1) / lesson.sections.length) * 100} size="sm" className="flex-1" />
              <span className="text-xs text-muted-foreground font-mono shrink-0">
                {activeSection + 1} / {lesson.sections.length}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <GlassCard>
                  <CardContent>
                    <h3 className="font-semibold mb-2 sm:mb-4">{lesson.sections[activeSection].title}</h3>

                    {lesson.sections[activeSection].visual === 'diagram' && lesson.sections[activeSection].diagram && (
                      <DiagramCard>
                        {/* Special handling for interactive diagrams */}
                        {lesson.sections[activeSection].diagram?.type?.name === 'LLMPipeline' ? (
                          <LLMPipeline activeStep={pipelineStep} setActiveStep={setPipelineStep} />
                        ) : lesson.sections[activeSection].diagram?.type?.name === 'InsideAIMind' ? (
                          <InsideAIMind activeStep={mindStep} />
                        ) : (
                          lesson.sections[activeSection].diagram
                        )}
                      </DiagramCard>
                    )}

                    {lesson.sections[activeSection].points && (
                      <KeyPoints points={lesson.sections[activeSection].points} />
                    )}

                    {lesson.sections[activeSection].content && (
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                        {lesson.sections[activeSection].content}
                      </p>
                    )}

                    {lesson.sections[activeSection].items && (
                      <ItemsList items={lesson.sections[activeSection].items} />
                    )}

                    {lesson.sections[activeSection].steps && (
                      <StepsList steps={lesson.sections[activeSection].steps} />
                    )}

                    {lesson.sections[activeSection].formula && (
                      <div className="mt-4 p-3 sm:p-4 rounded-xl bg-muted/30 border border-border/50 overflow-x-auto">
                        <code className="text-xs sm:text-sm font-mono text-[var(--neon-blue)]">{lesson.sections[activeSection].formula}</code>
                        {lesson.sections[activeSection].formulaDetail && (
                          <p className="text-[10px] sm:text-xs text-muted-foreground mt-2">{lesson.sections[activeSection].formulaDetail}</p>
                        )}
                      </div>
                    )}

                    {lesson.sections[activeSection].note && (
                      <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-[var(--neon-blue)]/5 border border-[var(--neon-blue)]/10">
                        <span className="text-xs font-bold text-[var(--neon-blue)] shrink-0">NOTE</span>
                        <p className="text-xs text-muted-foreground">{lesson.sections[activeSection].note}</p>
                      </div>
                    )}

                    {lesson.sections[activeSection].tip && (
                      <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-[var(--neon-green)]/5 border border-[var(--neon-green)]/10">
                        <span className="text-xs font-bold text-[var(--neon-green)] shrink-0">TIP</span>
                        <p className="text-xs text-muted-foreground">{lesson.sections[activeSection].tip}</p>
                      </div>
                    )}
                  </CardContent>
                </GlassCard>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between">
              <Button
                variant="secondary"
                size="sm"
                disabled={activeSection === 0}
                onClick={() => setActiveSection((s) => Math.max(0, s - 1))}
              >
                ← Previous
              </Button>
              <span className="text-xs text-muted-foreground font-mono">
                Section {activeSection + 1} of {lesson.sections.length}
              </span>
              {activeSection < lesson.sections.length - 1 ? (
                <Button size="sm" onClick={() => setActiveSection((s) => s + 1)}>
                  Next →
                </Button>
              ) : (
                <Button size="sm" onClick={() => { setActiveLesson(null); setMindStep(0); }}>
                  Complete ✓
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
