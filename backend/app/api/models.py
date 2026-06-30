from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()


class ModelInfo(BaseModel):
    id: str
    name: str
    provider: str
    description: str
    context_window: int
    pricing: dict


class ModelsResponse(BaseModel):
    models: List[ModelInfo]


@router.get("/models", response_model=ModelsResponse)
async def list_models():
    models = [
        ModelInfo(
            id="gemma-2-2b-it",
            name="Gemma 2 2B",
            provider="google",
            description="Google's lightweight open model — free on OpenRouter",
            context_window=8192,
            pricing={"input": 0.0, "output": 0.0},
        ),
        ModelInfo(
            id="gemma-2-9b-it",
            name="Gemma 2 9B",
            provider="google",
            description="Google's efficient open model with strong quality — free on OpenRouter",
            context_window=8192,
            pricing={"input": 0.0, "output": 0.0},
        ),
        ModelInfo(
            id="gemma-2-27b-it",
            name="Gemma 2 27B",
            provider="google",
            description="Google's largest open Gemma model — free on OpenRouter",
            context_window=8192,
            pricing={"input": 0.0, "output": 0.0},
        ),
        ModelInfo(
            id="nemotron-70b",
            name="Nemotron 70B",
            provider="nvidia",
            description="NVIDIA's Llama-based instruct model — free on OpenRouter",
            context_window=131072,
            pricing={"input": 0.0, "output": 0.0},
        ),
        ModelInfo(
            id="llama-3.1-70b",
            name="Llama 3.1 70B",
            provider="meta",
            description="Meta's open-source large language model",
            context_window=128000,
            pricing={"input": 0.0, "output": 0.0},
        ),
    ]
    return ModelsResponse(models=models)
