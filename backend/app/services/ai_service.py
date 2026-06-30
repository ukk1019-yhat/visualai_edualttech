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

    def _map_model(self, model: str) -> str:
        model_mapping = {
            "gemma-4-31b-it": "google/gemma-4-31b-it:free",
            "gemma-4-26b-a4b-it": "google/gemma-4-26b-a4b-it:free",
            "gemma-3-12b-it": "google/gemma-3-12b-it",
            "gpt-4o": "openai/gpt-4o",
            "gpt-4o-mini": "openai/gpt-4o-mini",
            "gpt-4-turbo": "openai/gpt-4-turbo",
            "claude-3-opus": "anthropic/claude-3-opus",
            "claude-3-sonnet": "anthropic/claude-3-sonnet",
            "claude-3-haiku": "anthropic/claude-3-haiku",
            "gemini-1.5-pro": "google/gemini-1.5-pro",
            "gemini-1.5-flash": "google/gemini-1.5-flash",
            "nemotron-70b": "nvidia/llama-3.1-nemotron-70b-instruct",
            "llama-3.1-70b": "meta-llama/llama-3.1-70b-instruct",
            "llama-3.1-8b": "meta-llama/llama-3.1-8b-instruct",
            "mistral-large": "mistralai/mistral-large",
        }
        if "/" in model:
            return model
        return model_mapping.get(model, f"openai/{model}")

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
        mapped_model = self._map_model(model)
        start = time.time()

        if self.openrouter_client:
            try:
                response = await self.openrouter_client.chat.completions.create(
                    model=mapped_model,
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
                    "cost": self._calculate_cost(mapped_model, pt, ct),
                    "model": mapped_model,
                }
            except Exception as e:
                return {
                    "content": f"⚠️ API Error: {str(e)}",
                    "prompt_tokens": 0,
                    "completion_tokens": 0,
                    "latency": (time.time() - start) * 1000,
                    "cost": 0.0,
                    "model": mapped_model,
                    "error": str(e),
                }

        return {
            "content": f"This is a simulated response to: '{prompt}'. Set OPENROUTER_API_KEY in backend/.env to get real AI responses.",
            "prompt_tokens": len(prompt.split()) * 2,
            "completion_tokens": 50,
            "latency": (time.time() - start) * 1000,
            "cost": 0.0,
            "model": mapped_model,
        }

    def _calculate_cost(self, model: str, prompt_tokens: int, completion_tokens: int) -> float:
        pricing = {
            "google/gemma-4-31b-it:free": {"input": 0.0, "output": 0.0},
            "google/gemma-4-26b-a4b-it:free": {"input": 0.0, "output": 0.0},
            "google/gemma-3-12b-it": {"input": 0.0, "output": 0.0},
            "openai/gpt-4o": {"input": 0.0000025, "output": 0.00001},
            "openai/gpt-4o-mini": {"input": 0.00000015, "output": 0.0000006},
            "anthropic/claude-3-opus": {"input": 0.000015, "output": 0.000075},
            "anthropic/claude-3-sonnet": {"input": 0.000003, "output": 0.000015},
            "google/gemini-1.5-pro": {"input": 0.0000035, "output": 0.0000105},
            "google/gemini-1.5-flash": {"input": 0.00000035, "output": 0.00000105},
            "nvidia/llama-3.1-nemotron-70b-instruct": {"input": 0.0, "output": 0.0},
            "meta-llama/llama-3.1-70b-instruct": {"input": 0.00000059, "output": 0.00000079},
            "meta-llama/llama-3.1-8b-instruct": {"input": 0.00000006, "output": 0.00000006},
        }

        if model not in pricing:
            return 0.0

        p = pricing[model]
        return (prompt_tokens * p["input"]) + (completion_tokens * p["output"])
