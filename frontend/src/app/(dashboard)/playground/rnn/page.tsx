'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { GlassCard, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const DEFAULT_SEQUENCE = [0.1, 0.8, 0.3, 0.9, 0.2];

type RNNState = {
  input: number;
  hidden: number[];
  output: number;
  gates?: {
    inputGate: number;
    forgetGate: number;
    outputGate: number;
    cellState: number;
  };
};

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

function tanh(x: number): number {
  return Math.tanh(x);
}

function computeRNNStep(
  input: number,
  prevHidden: number[],
  step: number,
  hiddenSize: number
): RNNState {
  const hidden = Array.from({ length: hiddenSize }, (_, i) => {
    const w_ih = 0.5 + i * 0.1;
    const w_hh = 0.3 + i * 0.05;
    const prev = prevHidden[i] ?? 0;
    return tanh(input * w_ih + prev * w_hh + 0.01 * step);
  });
  const output = sigmoid(
    hidden.reduce((sum, h, i) => sum + h * (0.4 + i * 0.1), 0) + 0.02 * step
  );
  return { input, hidden, output };
}

function computeLSTMStep(
  input: number,
  prevHidden: number[],
  prevCell: number[],
  step: number,
  hiddenSize: number
): RNNState & { cellState: number[] } {
  const hidden: number[] = [];
  const cellState: number[] = [];
  let gatesResult: {
    inputGate: number;
    forgetGate: number;
    outputGate: number;
    cellState: number;
  } | undefined;

  for (let i = 0; i < hiddenSize; i++) {
    const ph = prevHidden[i] ?? 0;
    const pc = prevCell[i] ?? 0;
    const f_gate = sigmoid(
      input * (0.3 + i * 0.05) + ph * (0.2 + i * 0.03) + 0.5 + step * 0.01
    );
    const i_gate = sigmoid(
      input * (0.4 + i * 0.04) + ph * (0.3 + i * 0.02) + step * 0.01
    );
    const o_gate = sigmoid(
      input * (0.5 + i * 0.03) + ph * (0.4 + i * 0.01) + step * 0.01
    );
    const c_tilde = tanh(
      input * (0.6 + i * 0.02) + ph * (0.5 + i * 0.01) + step * 0.01
    );
    const c = f_gate * pc + i_gate * c_tilde;
    const h = o_gate * tanh(c);

    if (i === 0) {
      gatesResult = {
        inputGate: i_gate,
        forgetGate: f_gate,
        outputGate: o_gate,
        cellState: c,
      };
    }
    cellState.push(c);
    hidden.push(h);
  }

  const output = sigmoid(
    hidden.reduce((sum, h, i) => sum + h * (0.4 + i * 0.1), 0) + 0.02 * step
  );

  return { input, hidden, output, gates: gatesResult, cellState };
}

export default function RNNPage() {
  const [mode, setMode] = useState<'rnn' | 'lstm'>('rnn');
  const [running, setRunning] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [showGates, setShowGates] = useState(false);
  const [inputText, setInputText] = useState(DEFAULT_SEQUENCE.join(', '));
  const [hiddenSize, setHiddenSize] = useState(4);

  const inputSequence = useMemo(() => {
    const parsed = inputText
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map(Number)
      .filter((n) => !isNaN(n));
    return parsed.length > 0 ? parsed : DEFAULT_SEQUENCE;
  }, [inputText]);

  const numSteps = inputSequence.length;

  const initialHidden = useMemo(() => Array(hiddenSize).fill(0), [hiddenSize]);
  const initialCell = useMemo(() => Array(hiddenSize).fill(0), [hiddenSize]);

  const rnnStates = useMemo(() => {
    const states: RNNState[] = [];
    let prevHidden = [...initialHidden];
    for (let i = 0; i < numSteps; i++) {
      const s = computeRNNStep(inputSequence[i], prevHidden, i, hiddenSize);
      states.push(s);
      prevHidden = [...s.hidden];
    }
    return states;
  }, [inputSequence, initialHidden, hiddenSize, numSteps]);

  const lstmStates = useMemo(() => {
    const states: (RNNState & { cellState: number[] })[] = [];
    let prevHidden = [...initialHidden];
    let prevCell = [...initialCell];
    for (let i = 0; i < numSteps; i++) {
      const s = computeLSTMStep(inputSequence[i], prevHidden, prevCell, i, hiddenSize);
      states.push(s);
      prevHidden = [...s.hidden];
      prevCell = [...s.cellState];
    }
    return states;
  }, [inputSequence, initialHidden, initialCell, hiddenSize, numSteps]);

  const currentStates = mode === 'rnn' ? rnnStates : lstmStates;

  const runSequence = useCallback(async () => {
    setRunning(true);
    setActiveStep(null);
    for (let i = 0; i < numSteps; i++) {
      setActiveStep(i);
      await new Promise((r) => setTimeout(r, 600));
    }
    setActiveStep(null);
    setRunning(false);
  }, [numSteps]);

  const paramCount = mode === 'rnn'
    ? hiddenSize * 2 + hiddenSize
    : hiddenSize * 4 * 2 + hiddenSize;

  const handleResetDefault = useCallback(() => {
    setInputText(DEFAULT_SEQUENCE.join(', '));
    setHiddenSize(4);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputText(e.target.value);
    },
    []
  );

  const hiddenNodeHeight = Math.max(68, 56 + Math.ceil(hiddenSize / 2) * 16);
  const outputY = Math.max(300, 200 + hiddenNodeHeight / 2 + 80);
  const svgHeight = Math.max(480, outputY + 140);

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold">RNN / LSTM Visualizer</h1>
        <p className="text-sm text-muted-foreground">
          Explore how recurrent networks pass hidden state through time steps.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex gap-1 glass rounded-xl p-1">
          <button
            onClick={() => { setMode('rnn'); setShowGates(false); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              mode === 'rnn'
                ? 'bg-primary/10 text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            RNN
          </button>
          <button
            onClick={() => { setMode('lstm'); setShowGates(false); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              mode === 'lstm'
                ? 'bg-primary/10 text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            LSTM
          </button>
        </div>
        {mode === 'lstm' && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowGates(!showGates)}
          >
            {showGates ? 'Hide Gates' : 'Show Gates'}
          </Button>
        )}
        <Button
          variant="primary"
          size="sm"
          onClick={runSequence}
          loading={running}
        >
          Run Sequence
        </Button>
      </div>

      {/* Custom Data Panel */}
      <GlassCard>
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="grid sm:grid-cols-3 gap-4 items-end">
            <div className="sm:col-span-2">
              <Input
                label="Input sequence (comma-separated)"
                id="input-sequence"
                placeholder="e.g. 0.1, 0.8, 0.3, 0.9, 0.2"
                value={inputText}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="hidden-size" className="text-xs font-medium text-muted-foreground block">
                Hidden size: {hiddenSize}
              </label>
              <input
                id="hidden-size"
                type="range"
                min={1}
                max={10}
                step={1}
                value={hiddenSize}
                onChange={(e) => setHiddenSize(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handleResetDefault}>
              Reset Default
            </Button>
          </div>
        </CardContent>
      </GlassCard>

      <GlassCard>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="info">
              {mode === 'rnn' ? 'Vanilla RNN' : 'LSTM'} &middot; Unfolded
            </Badge>
            <div className="flex gap-2">
              <Badge variant="info">{numSteps} steps</Badge>
              <Badge variant="default">hidden size: {hiddenSize}</Badge>
              <Badge variant="success">{paramCount} params</Badge>
            </div>
          </div>

          <div className="overflow-x-auto pb-4">
            <svg
              viewBox={`0 0 ${Math.max(720, numSteps * 220 + 160)} ${svgHeight}`}
              className="min-w-[720px] w-full"
              style={{ minHeight: 360 }}
            >
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="rgba(148,163,184,0.4)" />
                </marker>
                <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#082C4E" />
                </marker>
                <filter id="node-glow">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <AnimatePresence>
                {currentStates.map((state, step) => {
                  const cx = 120 + step * 220;
                  const isActive = activeStep === step;
                  const isDone = activeStep !== null && step < activeStep;
                  const isCurrent = activeStep === step;

                  const nodeColor = isCurrent
                    ? '#082C4E'
                    : isDone
                    ? '#16A34A'
                    : 'rgba(148,163,184,0.3)';

                  const textColor = isCurrent || isDone ? '#fff' : 'rgba(148,163,184,0.6)';

                  const hiddenY = 200;
                  const inputY = 60;
                  const gateY = outputY + 60;

                  return (
                    <motion.g
                      key={`step-${step}-${mode}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: step * 0.05 }}
                    >
                      {/* Step label */}
                      <text
                        x={cx}
                        y={30}
                        textAnchor="middle"
                        className="text-xs font-mono fill-muted-foreground"
                      >
                        t = {step}
                      </text>

                      {/* Hidden state → next hidden state arrow */}
                      {step < numSteps - 1 && (
                        <line
                          x1={cx + 38}
                          y1={hiddenY}
                          x2={cx + 178}
                          y2={hiddenY}
                          stroke={
                            isCurrent
                              ? '#082C4E'
                              : isDone
                              ? '#16A34A'
                              : 'rgba(148,163,184,0.2)'
                          }
                          strokeWidth={isCurrent || isDone ? 2.5 : 1.5}
                          strokeDasharray={isCurrent ? 'none' : '6 4'}
                          markerEnd={isCurrent ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
                          opacity={isCurrent || isDone ? 1 : 0.4}
                        />
                      )}

                      {/* Input → Hidden arrow */}
                      <line
                        x1={cx}
                        y1={inputY + 22}
                        x2={cx}
                        y2={hiddenY - hiddenNodeHeight / 2 + 12}
                        stroke={isActive ? '#082C4E' : 'rgba(148,163,184,0.15)'}
                        strokeWidth={isActive ? 2 : 1}
                        markerEnd={isActive ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
                        opacity={isActive ? 1 : 0.3}
                      />

                      {/* Hidden → Output arrow */}
                      <line
                        x1={cx}
                        y1={hiddenY + hiddenNodeHeight / 2 - 12}
                        x2={cx}
                        y2={outputY - 22}
                        stroke={isActive ? '#082C4E' : 'rgba(148,163,184,0.15)'}
                        strokeWidth={isActive ? 2 : 1}
                        markerEnd={isActive ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
                        opacity={isActive ? 1 : 0.3}
                      />

                      {/* Input node */}
                      <motion.rect
                        x={cx - 34}
                        y={inputY}
                        width={68}
                        height={44}
                        rx={8}
                        fill={
                          isCurrent
                            ? 'rgba(0,212,255,0.15)'
                            : isDone
                            ? 'rgba(0,255,136,0.1)'
                            : 'rgba(148,163,184,0.06)'
                        }
                        stroke={
                          isCurrent
                            ? '#082C4E'
                            : isDone
                            ? '#16A34A'
                            : 'rgba(148,163,184,0.15)'
                        }
                        strokeWidth={isCurrent ? 2 : 1}
                        animate={
                          isCurrent
                            ? { boxShadow: '0 0 12px #082C4E' }
                            : {}
                        }
                      />
                      <text
                        x={cx}
                        y={inputY + 20}
                        textAnchor="middle"
                        className="text-[10px] font-mono"
                        fill={textColor}
                      >
                        x{step}
                      </text>
                      <text
                        x={cx}
                        y={inputY + 36}
                        textAnchor="middle"
                        className="text-[11px] font-mono font-bold"
                        fill={isCurrent ? '#082C4E' : textColor}
                      >
                        {state.input.toFixed(2)}
                      </text>

                      {/* Hidden state node */}
                      <motion.g
                        animate={
                          isCurrent
                            ? { filter: 'url(#node-glow)' }
                            : {}
                        }
                      >
                        <motion.rect
                          x={cx - 38}
                          y={hiddenY - hiddenNodeHeight / 2}
                          width={76}
                          height={hiddenNodeHeight}
                          rx={10}
                          fill={
                            isCurrent
                              ? 'rgba(139,92,246,0.15)'
                              : isDone
                              ? 'rgba(0,255,136,0.1)'
                              : 'rgba(148,163,184,0.06)'
                          }
                          stroke={
                            isCurrent
                              ? '#8B5CF6'
                              : isDone
                              ? '#16A34A'
                              : 'rgba(148,163,184,0.15)'
                          }
                          strokeWidth={isCurrent ? 2 : 1}
                        />
                        <text
                          x={cx}
                          y={hiddenY - hiddenNodeHeight / 2 + 16}
                          textAnchor="middle"
                          className="text-[10px] font-mono"
                          fill={textColor}
                        >
                          h{step}
                        </text>
                        {state.hidden.map((h, i) => (
                          <text
                            key={i}
                            x={cx - 24 + (i % 2) * 48}
                            y={hiddenY - hiddenNodeHeight / 2 + 36 + Math.floor(i / 2) * 16}
                            textAnchor="middle"
                            className="text-[9px] font-mono"
                            fill={
                              isCurrent
                                ? '#082C4E'
                                : isDone
                                ? '#16A34A'
                                : 'rgba(148,163,184,0.5)'
                            }
                          >
                            {h.toFixed(2)}
                          </text>
                        ))}
                      </motion.g>

                      {/* Output node */}
                      <motion.rect
                        x={cx - 34}
                        y={outputY}
                        width={68}
                        height={44}
                        rx={8}
                        fill={
                          isCurrent
                            ? 'rgba(0,212,255,0.15)'
                            : isDone
                            ? 'rgba(0,255,136,0.1)'
                            : 'rgba(148,163,184,0.06)'
                        }
                        stroke={
                          isCurrent
                            ? '#082C4E'
                            : isDone
                            ? '#16A34A'
                            : 'rgba(148,163,184,0.15)'
                        }
                        strokeWidth={isCurrent ? 2 : 1}
                      />
                      <text
                        x={cx}
                        y={outputY + 20}
                        textAnchor="middle"
                        className="text-[10px] font-mono"
                        fill={textColor}
                      >
                        y{step}
                      </text>
                      <text
                        x={cx}
                        y={outputY + 36}
                        textAnchor="middle"
                        className="text-[11px] font-mono font-bold"
                        fill={isCurrent ? '#082C4E' : textColor}
                      >
                        {state.output.toFixed(2)}
                      </text>

                      {/* LSTM Gates visualization */}
                      {mode === 'lstm' && showGates && state.gates && (
                        <motion.g
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <rect
                            x={cx - 44}
                            y={gateY - 24}
                            width={88}
                            height={60}
                            rx={6}
                            fill="rgba(0,212,255,0.05)"
                            stroke="rgba(0,212,255,0.15)"
                            strokeWidth="1"
                          />
                          <text
                            x={cx}
                            y={gateY - 10}
                            textAnchor="middle"
                            className="text-[8px] font-mono fill-muted-foreground"
                          >
                            gates
                          </text>
                          {[
                            { label: 'i', value: state.gates.inputGate, color: '#082C4E' },
                            { label: 'f', value: state.gates.forgetGate, color: '#16A34A' },
                            { label: 'o', value: state.gates.outputGate, color: '#8B5CF6' },
                            { label: 'c', value: state.gates.cellState, color: '#f59e0b' },
                          ].map((g, gi) => (
                            <g key={g.label}>
                              <text
                                x={cx - 34 + gi * 22}
                                y={gateY + 4}
                                textAnchor="middle"
                                className="text-[7px] font-mono"
                                fill={g.color}
                              >
                                {g.label}
                              </text>
                              <rect
                                x={cx - 36 + gi * 22}
                                y={gateY + 8}
                                width={20}
                                height={4}
                                rx={2}
                                fill="rgba(148,163,184,0.1)"
                              />
                              <motion.rect
                                x={cx - 36 + gi * 22}
                                y={gateY + 8}
                                width={Math.max(4, g.value * 20)}
                                height={4}
                                rx={2}
                                fill={g.color}
                                initial={{ width: 0 }}
                                animate={{ width: Math.max(4, g.value * 20) }}
                                transition={{ duration: 0.3, delay: gi * 0.05 }}
                              />
                            </g>
                          ))}
                        </motion.g>
                      )}
                    </motion.g>
                  );
                })}
              </AnimatePresence>

              {/* Legend */}
              <g transform={`translate(20, ${svgHeight - 40})`}>
                <rect x={0} y={0} width={8} height={8} rx={2} fill="#082C4E" opacity={0.6} />
                <text x={12} y={7} className="text-[8px] font-mono fill-muted-foreground">active</text>
                <rect x={70} y={0} width={8} height={8} rx={2} fill="#16A34A" opacity={0.6} />
                <text x={82} y={7} className="text-[8px] font-mono fill-muted-foreground">processed</text>
                <rect x={150} y={0} width={8} height={8} rx={2} fill="rgba(148,163,184,0.3)" opacity={0.6} />
                <text x={162} y={7} className="text-[8px] font-mono fill-muted-foreground">pending</text>
              </g>
            </svg>
          </div>
        </CardContent>
      </GlassCard>

      <GlassCard>
        <CardHeader
          title={mode === 'rnn' ? 'Vanilla RNN' : 'Long Short-Term Memory (LSTM)'}
          action={<Badge variant="info">{mode === 'rnn' ? 'RNN' : 'LSTM'}</Badge>}
        />
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">How it works</h4>
              <p className="text-muted-foreground leading-relaxed">
                {mode === 'rnn'
                  ? 'At each time step, the RNN takes an input xₜ and produces a hidden state hₜ using the previous hidden state hₜ₋₁. The hidden state acts as a "memory" that carries information forward through the sequence.'
                  : 'LSTM extends the RNN with three gates (input, forget, output) and a cell state. The forget gate decides what to discard, the input gate decides what to store, and the output gate controls what to output. This helps solve the vanishing gradient problem.'}
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Architecture</h4>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span>{mode === 'rnn' ? 'Elman RNN' : 'LSTM'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sequence Length</span>
                  <span>{numSteps}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hidden Size</span>
                  <span>{hiddenSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Parameters</span>
                  <span className="text-[#082C4E]">{paramCount.toLocaleString()}</span>
                </div>
                {mode === 'lstm' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gates</span>
                      <span>Input, Forget, Output</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cell State</span>
                      <span className="text-[#082C4E]">{hiddenSize}-d</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {mode === 'rnn' && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground font-mono">
                hₜ = tanh(W<sub>ih</sub> &middot; xₜ + W<sub>hh</sub> &middot; hₜ₋₁ + b<sub>h</sub>)
              </p>
            </div>
          )}

          {mode === 'lstm' && (
            <div className="mt-4 pt-4 border-t border-border space-y-1">
              <p className="text-xs text-muted-foreground font-mono">
                fₜ = &sigma;(W<sub>f</sub> &middot; [hₜ₋₁, xₜ] + b<sub>f</sub>)
              </p>
              <p className="text-xs text-muted-foreground font-mono">
                iₜ = &sigma;(W<sub>i</sub> &middot; [hₜ₋₁, xₜ] + b<sub>i</sub>)
              </p>
              <p className="text-xs text-muted-foreground font-mono">
                c̃ₜ = tanh(W<sub>c</sub> &middot; [hₜ₋₁, xₜ] + b<sub>c</sub>)
              </p>
              <p className="text-xs text-muted-foreground font-mono">
                cₜ = fₜ &odot; cₜ₋₁ + iₜ &odot; c̃ₜ
              </p>
              <p className="text-xs text-muted-foreground font-mono">
                oₜ = &sigma;(W<sub>o</sub> &middot; [hₜ₋₁, xₜ] + b<sub>o</sub>)
              </p>
              <p className="text-xs text-muted-foreground font-mono">
                hₜ = oₜ &odot; tanh(cₜ)
              </p>
            </div>
          )}
        </CardContent>
      </GlassCard>
    </div>
  );
}
