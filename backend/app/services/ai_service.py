import asyncio
import random
import time
from typing import Optional
from app.core.config import settings


class AIService:
    def __init__(self):
        self.gemini_client = None

    async def _init_gemini(self):
        if not self.gemini_client and settings.GOOGLE_API_KEY:
            from google import genai
            self.gemini_client = genai.aio.Client(api_key=settings.GOOGLE_API_KEY)

    async def simulate_step(self, step_id: str) -> None:
        delay = random.uniform(0.02, 0.15)
        await asyncio.sleep(delay)

    async def generate(
        self,
        prompt: str,
        model: str = "gemini-2.0-flash",
        max_tokens: Optional[int] = 2048,
    ) -> dict:
        await self._init_gemini()
        start = time.time()

        if self.gemini_client:
            try:
                response = await self.gemini_client.models.generate_content(
                    model=model,
                    contents=prompt,
                    config={"max_output_tokens": max_tokens},
                )
                latency = (time.time() - start) * 1000
                content = response.text or ""
                usage = response.usage_metadata
                pt = usage.prompt_token_count if usage else 0
                ct = usage.candidates_token_count if usage else 0
                return {
                    "content": content,
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
