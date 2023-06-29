"""Main entrypoint for the app."""
from dotenv import load_dotenv

load_dotenv()

import logging
from typing import Optional

from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.templating import Jinja2Templates

from langchain.vectorstores.base import VectorStore
from langchain.chat_models import ChatOpenAI
from langchain.callbacks.base import BaseCallbackHandler
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import DeepLake
from langchain.chains import RetrievalQA

from callback import QuestionGenCallbackHandler, StreamingLLMCallbackHandler, MyCustomAsyncHandler
# from query_data import get_chain
from schemas import ChatResponse

app = FastAPI()
templates = Jinja2Templates(directory="templates")
vectorstore: Optional[VectorStore] = None

# code from the other implementation

embeddings = OpenAIEmbeddings(disallowed_special=())
retriever = None

@app.on_event("startup")
async def startup_event():
    # Load vectorstore
    global retriever
    db = DeepLake(dataset_path="hub://lucasmanea/aptos-extended-new", read_only=True, embedding_function=embeddings)

    retriever = db.as_retriever()
    retriever.search_kwargs['distance_metric'] = 'cos'
    retriever.search_kwargs['fetch_k'] = 100
    retriever.search_kwargs['maximal_marginal_relevance'] = True
    retriever.search_kwargs['k'] = 10


@app.get("/")
async def get(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

class MyCustomSyncHandler(BaseCallbackHandler):
    def __init__(self, websocket):
        self.websocket = websocket

    async def on_llm_new_token(self, token: str, **kwargs) -> None:
        resp = ChatResponse(sender="bot", message=token, type="stream")
        await self.websocket.send_json(resp.dict())



@app.websocket("/chat")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    question_handler = QuestionGenCallbackHandler(websocket)
    stream_handler = StreamingLLMCallbackHandler(websocket)
    async_handler = MyCustomAsyncHandler()
    sync_handler = MyCustomSyncHandler(websocket)
    chat_history = []

    model = ChatOpenAI(model_name='gpt-4', streaming=True, callbacks=[sync_handler], verbose=True) # switch to 'gpt-4'

    # qa_chain = ConversationalRetrievalChain.from_llm(model, retriever=retriever)


    # Use the below line instead of the above line to enable tracing
    # Ensure `langchain-server` is running
    # qa_chain = get_chain(vectorstore, question_handler, stream_handler, tracing=True)

    while True:
        try:
            # Receive and send back the client message
            question = await websocket.receive_text()
            print(question)

            resp = ChatResponse(sender="you", message=question, type="stream")
            await websocket.send_json(resp.dict())

            # chat_history.append([HumanMessage(content=question)])
            # Construct a response
            start_resp = ChatResponse(sender="bot", message="", type="start")
            await websocket.send_json(start_resp.dict())

            # result = await model.agenerate(
            #   chat_history
            # )

            chain = RetrievalQA.from_chain_type(llm=model, chain_type="stuff", retriever=retriever)
            result = await chain.acall(inputs=question)
     
            chat_history.append((question, result))

            print(result)
            end_resp = ChatResponse(sender="bot", message=result['result'], type="end")
            print(end_resp.dict())
            await websocket.send_json(end_resp.dict())
        except WebSocketDisconnect:
            logging.info("websocket disconnect")
            break
        except Exception as e:
            logging.error(e)
            resp = ChatResponse(
                sender="bot",
                message="Sorry, something went wrong. Try again.",
                type="error",
            )
            await websocket.send_json(resp.dict())


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=9000)
