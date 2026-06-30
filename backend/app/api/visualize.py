from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()


class AttentionHead(BaseModel):
    layer: int
    head: int
    source_indices: List[int]
    target_indices: List[int]
    weights: List[List[float]]


class AttentionResponse(BaseModel):
    tokens: List[str]
    attention_heads: List[AttentionHead]


class EmbeddingPoint(BaseModel):
    word: str
    x: float
    y: float
    z: float
    magnitude: float


class EmbeddingResponse(BaseModel):
    points: List[EmbeddingPoint]
    dimensions: int


@router.get("/visualize/attention", response_model=AttentionResponse)
async def get_attention(text: str = Query("The cat sat on the mat")):
    tokens = text.split()

    import random
    heads = []
    for layer in range(4):
        for head in range(4):
            weights = []
            for i in range(len(tokens)):
                row = []
                for j in range(len(tokens)):
                    row.append(random.random() * 0.5 + 0.1)
                weights.append(row)
            heads.append(
                AttentionHead(
                    layer=layer,
                    head=head,
                    source_indices=list(range(len(tokens))),
                    target_indices=list(range(len(tokens))),
                    weights=weights,
                )
            )

    return AttentionResponse(tokens=tokens, attention_heads=heads)


@router.get("/visualize/embeddings", response_model=EmbeddingResponse)
async def get_embeddings(words: str = Query("dog cat tiger lion car")):
    word_list = [w.strip() for w in words.split(",") if w.strip()]

    import random
    points = []
    for word in word_list:
        random.seed(hash(word))
        points.append(
            EmbeddingPoint(
                word=word,
                x=random.uniform(-1, 1),
                y=random.uniform(-1, 1),
                z=random.uniform(-1, 1),
                magnitude=random.uniform(0.5, 1.5),
            )
        )

    return EmbeddingResponse(points=points, dimensions=1536)


@router.get("/visualize/transformer-layer/{layer}")
async def get_transformer_layer(layer: int):
    """Get data for a specific transformer layer visualization."""
    import random
    random.seed(layer)
    return {
        "layer": layer,
        "hidden_size": 768,
        "num_heads": 12,
        "activation_stats": {
            "mean": random.uniform(-0.1, 0.1),
            "std": random.uniform(0.8, 1.2),
            "max": random.uniform(2.0, 4.0),
            "min": random.uniform(-4.0, -2.0),
        },
        "head_importance": [random.random() for _ in range(12)],
    }
