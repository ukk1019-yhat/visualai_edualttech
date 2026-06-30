from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List
import time

from app.services.ai_service import AIService

router = APIRouter()
ai_service = AIService()


class ChatRequest(BaseModel):
    prompt: str
    model: str = "google/gemma-4-31b-it:free"
    stream: bool = False


class ProcessingStep(BaseModel):
    id: str
    label: str
    status: str
    duration: float
    timestamp: float


class ChatResponse(BaseModel):
    id: str
    content: str
    role: str = "assistant"
    model: str = ""
    processing_steps: Optional[List[ProcessingStep]] = None
    prompt_tokens: Optional[int] = None
    completion_tokens: Optional[int] = None
    latency: Optional[float] = None
    cost: Optional[float] = None
    error: Optional[str] = None


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    start_time = time.time()
    steps_config = [
        ("tokenize", "Tokenizing"),
        ("embed", "Embedding"),
        ("attention", "Attention"),
        ("layers", "Transformer Layers"),
        ("reasoning", "Reasoning"),
        ("safety", "Safety"),
    ]

    processing_steps = []
    for step_id, label in steps_config:
        step_start = time.time()
        try:
            await ai_service.simulate_step(step_id)
        except Exception:
            pass
        processing_steps.append(
            ProcessingStep(
                id=step_id,
                label=label,
                status="complete",
                duration=(time.time() - step_start) * 1000,
                timestamp=time.time(),
            )
        )

    result = await ai_service.generate(
        prompt=request.prompt,
        model=request.model,
    )

    total_latency = (time.time() - start_time) * 1000

    return ChatResponse(
        id=f"msg_{int(time.time())}",
        content=result["content"],
        model=result.get("model", request.model),
        processing_steps=processing_steps,
        prompt_tokens=result.get("prompt_tokens"),
        completion_tokens=result.get("completion_tokens"),
        latency=total_latency,
        cost=result.get("cost"),
        error=result.get("error"),
    )
