import asyncio
import random
import time
from typing import Optional
from app.core.config import settings


class AIService:
    def __init__(self):
        self.openrouter_client = None

    async def _init_openrouter(self):
        if not self.openrouter_client and settings.OPENROUTER_API_KEY:
            from openai import AsyncOpenAI
            self.openrouter_client = AsyncOpenAI(
                api_key=settings.OPENROUTER_API_KEY,
                base_url=settings.OPENROUTER_BASE_URL,
                default_headers={
                    "HTTP-Referer": settings.OPENROUTER_SITE_URL,
                    "X-Title": settings.OPENROUTER_SITE_NAME,
                },
            )

    async def simulate_step(self, step_id: str) -> None:
        delay = random.uniform(0.02, 0.15)
        await asyncio.sleep(delay)

    async def generate(
        self,
        prompt: str,
        model: str = "google/gemma-4-31b-it:free",
        max_tokens: Optional[int] = 2048,
    ) -> dict:
        await self._init_openrouter()
        start = time.time()

        if self.openrouter_client:
            try:
                response = await self.openrouter_client.chat.completions.create(
                    model=model,
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=max_tokens,
                )
                latency = (time.time() - start) * 1000
                usage = response.usage
                pt = usage.prompt_tokens if usage else 0
                ct = usage.completion_tokens if usage else 0
                return {
                    "content": response.choices[0].message.content or "",
                    "prompt_tokens": pt,
                    "completion_tokens": ct,
                    "latency": latency,
                    "cost": 0.0,
                    "model": model,
                }
            except Exception as e:
                return {
                    "content": f"⚠️ API Error: {str(e)}",
                    "prompt_tokens": 0,
                    "completion_tokens": 0,
                    "latency": (time.time() - start) * 1000,
                    "cost": 0.0,
                    "model": model,
                    "error": str(e),
                }

        return {
            "content": f"This is a simulated response to: '{prompt}'. Set OPENROUTER_API_KEY in backend/.env to get real AI responses.",
            "prompt_tokens": len(prompt.split()) * 2,
            "completion_tokens": 50,
            "latency": (time.time() - start) * 1000,
            "cost": 0.0,
            "model": model,
        }
