from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import chat, tokenize, visualize, models
from app.core.config import settings

app = FastAPI(
    title="EAT Neural Flow API",
    description="AI Visualization Platform Backend",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/api", tags=["chat"])
app.include_router(tokenize.router, prefix="/api", tags=["tokenize"])
app.include_router(visualize.router, prefix="/api", tags=["visualize"])
app.include_router(models.router, prefix="/api", tags=["models"])


@app.get("/api/health")
async def health():
    return {"status": "ok", "version": "0.1.0"}


def start():
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
