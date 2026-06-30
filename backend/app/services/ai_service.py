import asyncio
import random
import time
from typing import Optional
from app.core.config import settings


class AIService:
    def __init__(self):
        self.client = None

    async def _init_client(self):
        if not self.client and settings.GOOGLE_API_KEY:
            from openai import AsyncOpenAI
            self.client = AsyncOpenAI(
                api_key=settings.GOOGLE_API_KEY,
                base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
            )

    async def simulate_step(self, step_id: str) -> None:
        delay = random.uniform(0.02, 0.15)
        await asyncio.sleep(delay)

    async def generate(
        self,
        prompt: str,
        model: str = "gemini-2.0-flash",
        max_tokens: Optional[int] = 2048,
    ) -> dict:
        await self._init_client()
        start = time.time()

        if self.client:
            try:
                response = await self.client.chat.completions.create(
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
            "content": f"This is a simulated response to: '{prompt}'. Set GOOGLE_API_KEY in backend/.env to get real AI responses.",
            "prompt_tokens": len(prompt.split()) * 2,
            "completion_tokens": 50,
            "latency": (time.time() - start) * 1000,
            "cost": 0.0,
            "model": model,
        }
