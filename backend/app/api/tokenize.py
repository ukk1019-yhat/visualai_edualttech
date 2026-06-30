from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
import tiktoken

router = APIRouter()


class TokenizeRequest(BaseModel):
    text: str
    model: str = "gpt-4o"


class TokenInfo(BaseModel):
    id: int
    text: str
    position: int


class TokenizeResponse(BaseModel):
    tokens: List[TokenInfo]
    total_tokens: int
    model: str


@router.post("/tokenize", response_model=TokenizeResponse)
async def tokenize(request: TokenizeRequest):
    try:
        encoding = tiktoken.encoding_for_model(request.model)
    except KeyError:
        encoding = tiktoken.get_encoding("cl100k_base")

    ids = encoding.encode(request.text)
    tokens = encoding.decode_tokens_bytes(ids)

    token_list = [
        TokenInfo(
            id=ids[i],
            text=tokens[i].decode("utf-8", errors="replace"),
            position=i,
        )
        for i in range(len(ids))
    ]

    return TokenizeResponse(
        tokens=token_list,
        total_tokens=len(ids),
        model=request.model,
    )
