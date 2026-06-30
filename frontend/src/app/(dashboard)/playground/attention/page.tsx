'use client';

import { useState, useMemo, useCallback } from 'react';
import { IconWave, IconFire, IconTarget } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { motion } from 'framer-motion';
import { GlassCard, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';

function generateAttention(words: string[], targetWord: string): number[] {
  const idx = words.indexOf(targetWord);
  return words.map((_, i) => {
    if (i === idx) return 0.4 + Math.random() * 0.3;
    const dist = Math.abs(i - idx);
    return Math.max(0.02, 0.5 - dist * 0.08 + (Math.random() - 0.5) * 0.15);
  });
}

function generateAttentionMap(words: string[]): Record<string, number[]> {
  const map: Record<string, number[]> = {};
  words.forEach((w) => { map[w] = generateAttention(words, w); });
  return map;
}

export default function AttentionPage() {
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);
  const [view, setView] = useState('flow');
  const [inputText, setInputText] = useState('The cat sat on the mat');
  const [submittedText, setSubmittedText] = useState('The cat sat on the mat');
  const [numHeads, setNumHeads] = useState(4);

  const words = useMemo(() => submittedText.trim().split(/\s+/).filter(Boolean).slice(0, 8), [submittedText]);

  const attentionMap = useMemo(() => generateAttentionMap(words), [words]);

  const handleApply = useCallback(() => {
    setSubmittedText(inputText);
    setHoveredWord(null);
  }, [inputText]);

  const activeWeights = hoveredWord ? attentionMap[hoveredWord] || [] : [];

  const maxWeight = Math.max(...activeWeights, 0.01);

  return (
    <div className="space-y-4 sm:space-y-6 max-w-6xl">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold">Attention Visualizer</h1>
        <p className="text-sm text-muted-foreground">
          Watch how the model attends to different words. Hover a word to see attention flow.
        </p>
      </div>

      <GlassCard>
        <CardContent className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              label="Sentence (max 8 words)"
              placeholder="Enter a sentence..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApply()}
            />
          </div>
          <div className="w-40">
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">
              Heads: {numHeads}
            </label>
            <input
              type="range"
              min={1}
              max={8}
              value={numHeads}
              onChange={(e) => setNumHeads(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
          <Button onClick={handleApply}>Apply</Button>
        </CardContent>
      </GlassCard>

      <Tabs
        tabs={[
          { id: 'flow', label: 'Flow View', icon: <IconWave size={14} /> },
          { id: 'heatmap', label: 'Heatmap', icon: <IconFire size={14} /> },
          { id: 'heads', label: 'Attention Heads', icon: <IconTarget size={14} /> },
        ]}
        activeTab={view}
        onChange={setView}
      />

      {view === 'flow' && (
        <GlassCard>
          <CardContent className="p-4 sm:p-8">
            <p className="text-center text-base sm:text-lg mb-6 sm:mb-8 font-mono leading-loose">
              {words.map((word, i) => {
                const weight = hoveredWord ? (attentionMap[hoveredWord]?.[i] ?? 0) : 0;
                return (
                  <motion.span
                    key={i}
                    onMouseEnter={() => setHoveredWord(word)}
                    onMouseLeave={() => setHoveredWord(null)}
                    className={`inline-block px-1.5 py-0.5 rounded cursor-pointer transition-all duration-300 mx-0.5 ${
                      hoveredWord === word
                        ? 'bg-primary/20 text-primary font-bold'
                        : hoveredWord
                        ? 'text-muted-foreground'
                        : 'text-foreground hover:bg-muted/50'
                    }`}
                    animate={
                      hoveredWord && hoveredWord !== word
                        ? { opacity: 0.3 + weight * 0.7, scale: 0.9 + weight * 0.1 }
                        : { opacity: 1, scale: 1 }
                    }
                  >
                    {word}
                  </motion.span>
                );
              })}
            </p>

            {/* Flow lines */}
            <svg viewBox={`0 0 ${Math.max(400, words.length * 80)} 140`} className="w-full h-24 sm:h-32">
              {hoveredWord &&
                activeWeights.map((weight, i) => {
                  if (weight < 0.03) return null;
                  const sx = 50 + i * (500 / (words.length - 1));
                  const sy = 15;
                  const ti = words.indexOf(hoveredWord);
                  const ex = 50 + ti * (500 / (words.length - 1));
                  const ey = 115;
                  return (
                    <motion.line
                      key={i}
                      x1={sx}
                      y1={sy}
                      x2={ex}
                      y2={ey}
                      stroke={`rgba(59, 130, 246, ${(weight / maxWeight) * 0.7})`}
                      strokeWidth={Math.max(0.5, (weight / maxWeight) * 6)}
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: weight / maxWeight }}
                      transition={{ duration: 0.4, delay: i * 0.03 }}
                    />
                  );
                })}
            </svg>

            {/* Source labels */}
            <div className="flex justify-center gap-2 sm:gap-4 mt-4">
              {words.map((word, i) => (
                <span
                  key={i}
                  className={`text-xs font-mono px-2 py-1 rounded transition-all ${
                    hoveredWord === word ? 'bg-primary/20 text-primary font-medium' : 'text-muted-foreground'
                  }`}
                >
                  {word}
                </span>
              ))}
            </div>
          </CardContent>
        </GlassCard>
      )}

      {view === 'heatmap' && (
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <GlassCard>
            <CardHeader title="Attention Heatmap" description="Row = source, Column = target" />
            <CardContent>
              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${words.length}, 1fr)` }}>
                {words.map((row, ri) =>
                  words.map((_, ci) => {
                    const w = attentionMap[words[ri]]?.[ci] ?? 0;
                    return (
                      <div
                        key={`${ri}-${ci}`}
                        className="aspect-square rounded-sm transition-all relative group cursor-crosshair"
                        style={{ backgroundColor: `rgba(59, 130, 246, ${Math.min(1, w * 1.8)})` }}
                        title={`"${words[ri]}" → "${words[ci]}": ${(w * 100).toFixed(0)}%`}
                      >
                        <div className="opacity-0 group-hover:opacity-100 absolute inset-0 flex items-center justify-center text-[8px] font-mono text-white bg-black/40 rounded-sm transition-opacity">
                          {(w * 100).toFixed(0)}%
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              <div className="flex justify-between mt-2 text-[10px] text-muted-foreground font-mono">
                <span>0%</span>
                <div className="flex gap-1">
                  {words.map((w, i) => (
                    <span key={i} className="w-8 text-center truncate">{w}</span>
                  ))}
                </div>
                <span>100%</span>
              </div>
            </CardContent>
          </GlassCard>

          <GlassCard>
            <CardHeader title="Attention Distribution" action={<Badge variant="info">Layer 1</Badge>} />
            <CardContent>
              <div className="space-y-4">
                {words.map((word, i) => {
                  const weights = attentionMap[word] || [];
                  return (
                    <div key={word} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-mono font-medium">{word}</span>
                        <span className="text-muted-foreground">
                          max: {(Math.max(...weights) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex gap-0.5 h-4">
                        {weights.map((w, j) => (
                          <div
                            key={j}
                            className="flex-1 rounded-sm transition-all"
                            style={{
                              backgroundColor: `rgba(59, 130, 246, ${Math.min(1, w * 2)})`,
                              height: `${Math.max(20, w * 100)}%`,
                              alignSelf: 'flex-end',
                            }}
                            title={`${word} → ${words[j]}: ${(w * 100).toFixed(0)}%`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </GlassCard>
        </div>
      )}

      {view === 'heads' && (
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, layer) => (
            <GlassCard key={layer}>
              <CardHeader
                title={`Layer ${layer + 1}`}
                action={<Badge variant="purple">{numHeads} heads</Badge>}
              />
              <CardContent>
                <div className="space-y-2">
                  {Array.from({ length: numHeads }).map((_, head) => (
                    <div key={head} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-mono">Head {head + 1}</span>
                        <span className="text-muted-foreground">
                          {['Syntax', 'Semantics', 'Position', 'Coreference'][head]}
                        </span>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: words.length }).map((_, j) => (
                          <div
                            key={j}
                            className="flex-1 h-5 rounded-sm transition-all"
                            style={{
                              backgroundColor: `rgba(59, 130, 246, ${0.2 + Math.random() * 0.6})`,
                            }}
                          >
                            <div className="opacity-0 hover:opacity-100 text-[8px] text-center text-white font-mono transition-opacity">
                              {(Math.random() * 100).toFixed(0)}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
