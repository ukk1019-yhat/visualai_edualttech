import { NextRequest, NextResponse } from 'next/server';

const BACKEND = 'https://neuralflow-backend.vercel.app/api/chat';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  try {
    const res = await fetch(BACKEND, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({
      id: `msg_${Date.now()}`,
      content: "Hello! I'm running in offline mode. The backend is warming up — please try again in a moment.",
      role: 'assistant',
      model: body?.model || 'poolside/laguna-m.1:free',
      processing_steps: [],
      prompt_tokens: 0,
      completion_tokens: 0,
      latency: 0,
      cost: 0.0,
    });
  }
}
