"""Callback handlers used in the app."""
from typing import Any, Dict, List
import asyncio

from langchain.callbacks.base import AsyncCallbackHandler,BaseCallbackHandler

from schemas import ChatResponse
from langchain.schema import LLMResult, HumanMessage


class StreamingLLMCallbackHandler(AsyncCallbackHandler):
    """Callback handler for streaming LLM responses."""

    def __init__(self, websocket):
        self.websocket = websocket

    async def on_llm_new_token(self, token: str, **kwargs: Any) -> None:
        resp = ChatResponse(sender="bot", message=token, type="stream")
        print('ran on_llm_new_token')
        await self.websocket.send_json(resp.dict())


class QuestionGenCallbackHandler(AsyncCallbackHandler):
    """Callback handler for question generation."""

    def __init__(self, websocket):
        self.websocket = websocket

    async def on_llm_start(
        self, serialized: Dict[str, Any], prompts: List[str], **kwargs: Any
    ) -> None:
        """Run when LLM starts running."""
        resp = ChatResponse(
            sender="bot", message="Synthesizing question...", type="info"
        )
        await self.websocket.send_json(resp.dict())

class MyCustomAsyncHandler(AsyncCallbackHandler):
    """Async callback handler that can be used to handle callbacks from langchain."""

    async def on_llm_start(
        self, serialized: Dict[str, Any], prompts: List[str], **kwargs: Any
    ) -> None:
        """Run when chain starts running."""
        # print("zzzz....")

        class_name = serialized["name"]
        print("Hi! I just woke up. Your llm is starting")

    async def on_llm_new_token(self, token: str, **kwargs: Any) -> None:
        """Run when chain generates a new token."""
        print("new token:", token)

    async def on_llm_end(self, response: LLMResult, **kwargs: Any) -> None:
        """Run when chain ends running."""
        # print("zzzz....")

        print("Hi! I just woke up. Your llm is ending")
        return