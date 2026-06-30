# NeuralFlow

> An interactive AI visualization platform — see inside the mind of large language models in real time.

Built with **Next.js 16**, **FastAPI**, and **OpenRouter**. Explore tokenization, embeddings, attention mechanisms, transformer internals, reasoning chains, and more through live, animated visualizations.

![Stack](https://img.shields.io/badge/Next.js_16-000?logo=nextdotjs)
![Stack](https://img.shields.io/badge/FastAPI-009688?logo=fastapi)
![Stack](https://img.shields.io/badge/OpenRouter-FF6B35?logo=openai)
![Stack](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql)
![Stack](https://img.shields.io/badge/Redis-DC382D?logo=redis)

---

## Pipeline

```
User Input
    │
    ▼
┌─────────────────────────┐
│ 1.  Receiving Prompt    │  ← Input captured from chat interface
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│ 2.  Tokenizing          │  ← Text split into tokens (BPE / tiktoken)
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│ 3.  Embedding           │  ← Tokens mapped to high-dimensional vectors
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│ 4.  Attention           │  ← Q/K/V computation, multi-head attention
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│ 5.  Transformer Layers  │  ← Feed-forward, residual connections, layer norm
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│ 6.  Reasoning           │  ← Autoregressive decoding, step-by-step
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│ 7.  Safety Filters      │  ← Content moderation, guardrails
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│ 8.  Final Answer        │  ← Streamed output to user
└─────────────────────────┘
    │
    ▼
    Response
```

---

## Features

### Playground — Live AI Visualizations

| Page | Description |
|------|-------------|
| **Chat** | Conversational interface with a live pipeline sidebar showing each processing stage in real time. Displays latency, token count, cost, and model info per response. |
| **Token Viewer** | Inspect how text is split into tokens. Hover any token to see its ID, position, and probability. |
| **Embedding Viewer** | Explore words in a 2D/3D vector space. Compare cosine similarity between words, inspect coordinate magnitudes. |
| **Attention Visualizer** | Three views of attention: animated flow lines between tokens, a heatmap of attention weights, and per-head patterns across layers. |
| **Reasoning Timeline** | Chrome DevTools-style waterfall timeline showing each step from prompt receipt to output generation. |
| **Output Stream** | Watch token-by-token generation with animated probability bars and streaming statistics. |

### Learn AI — Interactive Education Platform

14 lessons across 6 categories with custom SVG diagrams and interactive content:

| Category | Lessons |
|----------|---------|
| **📚 AI Fundamentals** | AI Fundamentals (History, AI vs ML vs DL, Types of AI) |
| **⚡ How an LLM Works** | Full Pipeline (interactive), Inside AI's Mind (auto-animated), Autoregressive Generation, Why LLMs Are Powerful |
| **🔬 Deep Dives** | Attention, Tokenization, Neural Networks, Transformers, Embeddings, RL, Diffusion, RAG, MoE, Fine-Tuning |
| **🎮 Interactive Labs** | Coming soon |
| **⚖️ AI Ethics** | Bias & Fairness, Hallucinations, Privacy & Safety, Responsible AI |
| **🏆 Challenges** | Prompt Engineering, Hallucination Detection, Token Optimization, Agent Workflow Design |

### Tools & Infrastructure

| Feature | Description |
|---------|-------------|
| **Agent Builder** | Drag-and-drop visual node editor for constructing AI agent workflows (Prompt → Planner → Research → Coder → Reviewer → Output) |
| **Model Catalog** | Browse and select from Gemma 2, Nemotron 70B, Llama 3.1 70B, and Mistral Large with provider filtering |
| **API Playground** | Interactive API reference with live request/response testing for all endpoints |
| **Architecture Explorer** | Visual overview of 6 major architectures: Transformer, Neural Network, CNN, RNN, GAN, Diffusion |
| **AI Simulator** | Simulate AI inference without an API key — see cost, latency, and token estimates |
| **Usage Dashboard** | Analytics dashboard with weekly usage charts, model distribution, and recent activity |

---

## Architecture

```
┌──────────────────────────────────────────────────────┐
│                    Frontend (Next.js 16)              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐ │
│  │  Chat    │ │  Token   │ │Attention │ │ Agent   │ │
│  │ Playground│ │  Viewer  │ │Visualizer│ │ Builder │ │
│  └──────────┘ └──────────┘ └──────────┘ └─────────┘ │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐ │
│  │ Learn AI │ │  Models  │ │  API Doc │ │Dashboard│ │
│  └──────────┘ └──────────┘ └──────────┘ └─────────┘ │
│                        │                              │
│              Next.js Rewrites (/api/* → :8000)       │
└────────────────────────┬─────────────────────────────┘
                         │ HTTP
┌────────────────────────▼─────────────────────────────┐
│                   Backend (FastAPI)                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐ │
│  │ /api/chat│ │/api/token│ │/api/models│ │/api/viz │ │
│  └──────────┘ └──────────┘ └──────────┘ └─────────┘ │
│                        │                              │
│  ┌─────────────────────┴──────────────────────────┐   │
│  │             AI Service (OpenRouter)            │   │
│  │  Gemma 2 9B  ·  Nemotron 70B  ·  Llama 3.1   │   │
│  └───────────────────────────────────────────────┘   │
│                        │                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐             │
│  │PostgreSQL│ │  Redis   │ │  TikToken│             │
│  └──────────┘ └──────────┘ └──────────┘             │
└──────────────────────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- Python ≥ 3.12
- PostgreSQL 16 (optional — app runs without it)
- Redis 7 (optional — app runs without it)
- OpenRouter API key ([get one free](https://openrouter.ai/keys))

### 1. Clone & Install

```bash
git clone https://github.com/ukk1019-yhat/visualai_edualttech.git
cd visualai_edualttech

# Backend
cd backend
python -m venv .venv
.venv\Scripts\activate     # Windows
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

```bash
# Copy template and add your keys
cp .env.example .env
```

Update `.env` with your OpenRouter API key:

```ini
OPENROUTER_API_KEY=sk-or-v1-your-key-here
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
DEFAULT_MODEL=google/gemma-2-9b-it
```

### 3. Start Development Servers

**Terminal 1 — Backend:**

```bash
cd backend
.venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 — Frontend:**

```bash
cd frontend
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### Docker (Alternative)

```bash
docker compose up -d
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/chat` | Send prompt, get AI response with processing steps |
| `POST` | `/api/tokenize` | Tokenize text using tiktoken |
| `GET` | `/api/models` | List available AI models |
| `GET` | `/api/visualize/attention` | Get attention map data |
| `GET` | `/api/visualize/embeddings` | Get embedding vectors |
| `GET` | `/api/visualize/transformer-layer/{layer}` | Get transformer layer internals |
| `GET` | `/api/health` | Health check |

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 16 (App Router) | React framework with SSR/SSG |
| **Language** | TypeScript | Type safety |
| **Styling** | Tailwind CSS v4 | Utility-first CSS |
| **Animation** | Framer Motion 12 | Page transitions, micro-interactions |
| **3D Viz** | Three.js + D3.js | Embedding space, architecture diagrams |
| **Graph** | React Flow | Agent builder node editor |
| **State** | Zustand | Global state management |
| **Backend** | FastAPI (Python 3.12+) | REST API |
| **Validation** | Pydantic v2 | Request/response validation |
| **Database** | PostgreSQL 16 + SQLAlchemy 2.0 | Persistence |
| **Cache** | Redis 7 | Caching |
| **AI** | OpenRouter (OpenAI-compatible) | Multi-model LLM access |
| **Tokenization** | tiktoken | BPE token encoding |
| **Containers** | Docker Compose | Orchestration |

---

## Project Structure

```
vision/
├── backend/
│   └── app/
│       ├── api/           # Route handlers (chat, tokenize, models, visualize)
│       ├── core/          # Config (pydantic-settings)
│       ├── models/        # SQLAlchemy models
│       ├── schemas/       # Pydantic schemas
│       └── services/      # AI service (OpenRouter integration)
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── (dashboard)/   # Authenticated routes
│       │   │   ├── playground/  # Chat, Token Viewer, Embeddings, etc.
│       │   │   ├── learn/       # Education platform
│       │   │   ├── agent-builder/
│       │   │   ├── models/
│       │   │   ├── simulator/
│       │   │   ├── visualizations/
│       │   │   ├── api-page/
│       │   │   └── dashboard-page/
│       │   ├── layout.tsx       # Root layout (Geist font, dark theme)
│       │   └── page.tsx         # Landing page
│       ├── components/ui/       # Reusable components (Button, Card, Badge, etc.)
│       ├── store/               # Zustand store
│       ├── types/               # TypeScript interfaces
│       └── lib/                 # Utilities (cn, formatters)
├── docker-compose.yml
├── .env.example
└── .gitignore
```

---

## License

MIT
