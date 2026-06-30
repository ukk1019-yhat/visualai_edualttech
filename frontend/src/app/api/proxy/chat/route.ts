import { NextRequest, NextResponse } from 'next/server';

const BACKEND = 'https://neuralflow-backend.vercel.app/api/chat';

export async function POST(req: NextRequest) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 55000);

  try {
    const body = await req.json();
    const res = await fetch(BACKEND, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    clearTimeout(timeout);
    return NextResponse.json(
      { error: 'Backend unreachable', content: 'The backend is waking up (cold start). Please try again.' },
      { status: 503 }
    );
  }
}
