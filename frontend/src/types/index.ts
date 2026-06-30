export interface Token {
  id: number;
  text: string;
  probability: number;
  embedding?: number[];
  position: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  tokens?: Token[];
  latency?: number;
  cost?: number;
  promptTokens?: number;
  completionTokens?: number;
}

export interface ProcessingStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'complete' | 'error';
  duration: number;
  timestamp: number;
}

export interface AttentionMap {
  layer: number;
  head: number;
  source: string[];
  target: string[];
  weights: number[][];
}

export interface ModelConfig {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'google' | 'nvidia' | 'meta' | 'ollama' | 'mistral';
  models: string[];
}

export interface AgentNode {
  id: string;
  type: 'prompt' | 'planner' | 'research' | 'coder' | 'reviewer' | 'output';
  label: string;
  config?: Record<string, unknown>;
  position: { x: number; y: number };
}

export interface AgentEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface CostBreakdown {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latency: number;
  cost: number;
}
