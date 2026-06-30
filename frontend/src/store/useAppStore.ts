import { create } from 'zustand';
import type { Message, ProcessingStep, ModelConfig, CostBreakdown } from '@/types';

interface AppState {
  messages: Message[];
  processingSteps: ProcessingStep[];
  currentPrompt: string;
  isProcessing: boolean;
  selectedModel: string;
  modelConfigs: ModelConfig[];
  costBreakdown: CostBreakdown | null;
  theme: 'dark' | 'light';
  sidebarOpen: boolean;

  setCurrentPrompt: (prompt: string) => void;
  addMessage: (message: Message) => void;
  setProcessing: (processing: boolean) => void;
  setProcessingSteps: (steps: ProcessingStep[]) => void;
  updateProcessingStep: (id: string, updates: Partial<ProcessingStep>) => void;
  setSelectedModel: (model: string) => void;
  setCostBreakdown: (cost: CostBreakdown | null) => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  clearChat: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  messages: [],
  processingSteps: [],
  currentPrompt: '',
  isProcessing: false,
  selectedModel: 'gemma-4-31b-it',
  modelConfigs: [
    { id: 'google-gemma', name: 'Google Gemma', provider: 'google', models: ['gemma-4-31b-it', 'gemma-4-26b-a4b-it', 'gemma-3-12b-it'] },
    { id: 'nvidia', name: 'NVIDIA', provider: 'nvidia', models: ['nemotron-70b'] },
    { id: 'meta', name: 'Meta', provider: 'meta', models: ['llama-3.1-70b', 'llama-3.1-8b'] },
    { id: 'mistral', name: 'Mistral', provider: 'mistral', models: ['mistral-large'] },
  ],
  costBreakdown: null,
  theme: 'dark',
  sidebarOpen: true,

  setCurrentPrompt: (prompt) => set({ currentPrompt: prompt }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setProcessing: (processing) => set({ isProcessing: processing }),
  setProcessingSteps: (steps) => set({ processingSteps: steps }),
  updateProcessingStep: (id, updates) =>
    set((state) => ({
      processingSteps: state.processingSteps.map((step) =>
        step.id === id ? { ...step, ...updates } : step
      ),
    })),
  setSelectedModel: (model) => set({ selectedModel: model }),
  setCostBreakdown: (cost) => set({ costBreakdown: cost }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  clearChat: () => set({ messages: [], processingSteps: [], costBreakdown: null }),
}));
