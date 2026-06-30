'use client';

import React, { useState, useCallback } from 'react';
import { IconNote, IconClipboard, IconSearch, IconCode, IconCheck, IconRocket } from '@/components/ui/Icons';
import { motion } from 'framer-motion';
import { GlassCard, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const nodeTypes = [
  { type: 'prompt', label: 'Prompt', icon: <IconNote size={16} />, color: 'from-[#082C4E] to-blue-600', desc: 'User input entry point' },
  { type: 'planner', label: 'Planner', icon: <IconClipboard size={16} />, color: 'from-purple-500 to-[#8B5CF6]', desc: 'Break down tasks' },
  { type: 'research', label: 'Research', icon: <IconSearch size={16} />, color: 'from-emerald-500 to-[#16A34A]', desc: 'Search & retrieve info' },
  { type: 'coder', label: 'Coder', icon: <IconCode size={16} />, color: 'from-orange-500 to-red-500', desc: 'Write & execute code' },
  { type: 'reviewer', label: 'Reviewer', icon: <IconCheck size={16} />, color: 'from-yellow-500 to-amber-600', desc: 'Validate output quality' },
  { type: 'output', label: 'Output', icon: <IconRocket size={16} />, color: 'from-[#16A34A] to-emerald-600', desc: 'Final response' },
];

interface AgentNode {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
  color?: string;
}

const nodeColors: Record<string, string> = {
  prompt: 'from-[#082C4E] to-blue-600',
  planner: 'from-purple-500 to-[#8B5CF6]',
  research: 'from-emerald-500 to-[#16A34A]',
  coder: 'from-orange-500 to-red-500',
  reviewer: 'from-yellow-500 to-amber-600',
  output: 'from-[#16A34A] to-emerald-600',
};

const defaultNodes: AgentNode[] = [
  { id: '1', type: 'prompt', label: 'Prompt', x: 0, y: 0, color: nodeColors.prompt },
  { id: '2', type: 'planner', label: 'Planner', x: 220, y: 0, color: nodeColors.planner },
  { id: '3', type: 'research', label: 'Research', x: 440, y: -70, color: nodeColors.research },
  { id: '4', type: 'coder', label: 'Coder', x: 440, y: 70, color: nodeColors.coder },
  { id: '5', type: 'reviewer', label: 'Reviewer', x: 660, y: 0, color: nodeColors.reviewer },
  { id: '6', type: 'output', label: 'Output', x: 880, y: 0, color: nodeColors.output },
];

export default function AgentBuilderPage() {
  const [nodes, setNodes] = useState<AgentNode[]>(defaultNodes);
  const [dragging, setDragging] = useState<string | null>(null);

  const handleMouseDown = useCallback((id: string) => setDragging(id), []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging) return;
      const svg = (e.target as SVGElement).closest('svg');
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const x = e.clientX - rect.left - 80;
      const y = e.clientY - rect.top - 25;
      setNodes((prev) =>
        prev.map((n) => (n.id === dragging ? { ...n, x: Math.max(0, x), y } : n))
      );
    },
    [dragging]
  );

  const handleMouseUp = useCallback(() => setDragging(null), []);

  return (
    <div className="space-y-4 sm:space-y-6 max-w-6xl">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold">Agent Builder</h1>
        <p className="text-sm text-muted-foreground">
          Drag and drop to build custom AI agent workflows. Connect nodes to create pipelines.
        </p>
      </div>

      <GlassCard>
        <div className="p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Badge variant="info">Workflow</Badge>
              <span className="text-xs text-muted-foreground">{nodes.length} nodes</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setNodes(defaultNodes.map((n) => ({ ...n, x: 0, y: 0 })))}
              >
                Reset
              </Button>
              <Button size="sm">Run Workflow</Button>
            </div>
          </div>

          <div
            className="relative overflow-hidden rounded-xl bg-muted/20 border border-border"
            style={{ minHeight: 400 }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <svg
              className="w-full"
              viewBox="-50 -120 1050 250"
              style={{ minHeight: 400 }}
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Edges */}
              {nodes.slice(0, -1).map((node, i) => (
                <motion.path
                  key={`edge-${node.id}`}
                  d={`M${node.x + 80} ${node.y + 25} L${nodes[i + 1].x} ${nodes[i + 1].y + 25}`}
                  stroke="rgba(59, 130, 246, 0.3)"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="6,4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                />
              ))}

              {/* Nodes */}
              {nodes.map((node, i) => {
                const typeDef = nodeTypes.find((t) => t.type === node.type);
                return (
                  <motion.g
                    key={node.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08 }}
                    className={dragging === node.id ? 'cursor-grabbing' : 'cursor-grab'}
                    onMouseDown={() => handleMouseDown(node.id)}
                  >
                    <defs>
                      <linearGradient id={`node-bg-${node.id}`}>
                        <stop offset="0%" stopColor={node.color?.split(' ')[0]?.replace('from-', '') || '#3b82f6'} />
                        <stop offset="100%" stopColor={node.color?.split(' ')[1] || '#6366f1'} />
                      </linearGradient>
                    </defs>

                    <rect
                      x={node.x}
                      y={node.y}
                      width={160}
                      height={50}
                      rx={12}
                      className={`fill-[var(--card)] stroke-[var(--border)] transition-all ${
                        dragging === node.id ? 'stroke-primary shadow-lg' : ''
                      }`}
                      strokeWidth={dragging === node.id ? 2 : 1}
                    />
                    <rect
                      x={node.x + 2}
                      y={node.y + 2}
                      width={156}
                      height={46}
                      rx={11}
                      fill={`url(#node-bg-${node.id})`}
                      opacity={0.12}
                    />
                    <text
                      x={node.x + 80}
                      y={node.y + 30}
                      textAnchor="middle"
                      className="fill-foreground text-xs font-medium font-sans"
                    >
                      {typeDef?.icon} {node.label}
                    </text>
                  </motion.g>
                );
              })}
            </svg>
          </div>
        </div>
      </GlassCard>

      {/* Available nodes */}
      <GlassCard>
        <CardHeader title="Available Nodes" description="Drag these onto the canvas to build your workflow" />
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {nodeTypes.map((node) => (
              <div
                key={node.type}
                className="glass rounded-xl p-3 sm:p-4 text-center cursor-pointer hover:border-primary/30 transition-all border border-border"
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${node.color} flex items-center justify-center text-lg mx-auto mb-2`}>
                  {node.icon}
                </div>
                <p className="text-xs font-medium">{node.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 hidden sm:block">{node.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </GlassCard>
    </div>
  );
}
