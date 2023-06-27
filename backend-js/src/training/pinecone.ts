import { ChatOpenAI } from "langchain/chat_models/openai";
import { PineconeClient } from "@pinecone-database/pinecone";
import * as dotenv from "dotenv";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { ChatMessageHistory, BufferWindowMemory } from "langchain/memory";
import {
  JSONLoader,
  JSONLinesLoader,
} from "langchain/document_loaders/fs/json";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { TextLoader } from "langchain/document_loaders/fs/text";

import { ConversationalRetrievalQAChain } from "langchain/chains";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { HumanChatMessage, AIChatMessage } from "langchain/schema";

import { MyCallbackHandler } from "../callbacks";

dotenv.config();

export const runPinecone = async () => {
  const client = new PineconeClient();

  console.log("process.env.PINECONE_API_KEY", process.env.PINECONE_API_KEY);

  await client.init({
    apiKey: process.env.PINECONE_API_KEY || "",
    environment: process.env.PINECONE_ENVIRONMENT || "",
  });

  const pineconeIndex = client.Index("test");

  const loader = new DirectoryLoader("training/data/docs/concepts", {
    ".json": (path) => new JSONLoader(path, "/texts"),
    ".jsonl": (path) => new JSONLinesLoader(path, "/html"),
    ".txt": (path) => new TextLoader(path),
    ".md": (path) => new TextLoader(path),
    ".csv": (path) => new CSVLoader(path, "text"),
  });

  const docs = await loader.load();

  const splitter = new CharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 0,
  });
  const texts = await splitter.splitDocuments(docs);

  const res = await PineconeStore.fromDocuments(texts, new OpenAIEmbeddings(), {
    pineconeIndex,
  });

  console.log("res", res);
};

const pastMessages: any = [
  new HumanChatMessage("My name's Jonas"),
  new AIChatMessage("Nice to meet you, Jonas!"),
];

// const memory = new BufferMemory({
//   chatHistory: new ChatMessageHistory(pastMessages),
//   memoryKey: "chat_history", // Must be set to "chat_history"
// });

export const runQueryPinecone = async ({
  ws,
  query,
}: {
  ws: any;
  query: string;
}) => {
  const client = new PineconeClient();
  await client.init({
    apiKey: process.env.PINECONE_API_KEY || "",
    environment: process.env.PINECONE_ENVIRONMENT || "",
  });
  const pineconeIndex = client.Index("test");

  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    { pineconeIndex }
  );

  const history = new ChatMessageHistory();

  const model = new ChatOpenAI({
    streaming: true,
    callbacks: [
      {
        handleLLMNewToken(token) {
          ws.send(
            JSON.stringify({ sender: "bot", message: token, type: "stream" })
          );
        },
      },
    ],
    modelName: "gpt-3.5-turbo",
  });

  try {
    const chain = ConversationalRetrievalQAChain.fromLLM(
      model,
      vectorStore.asRetriever(),
      {
        verbose: true,
        memory: new BufferWindowMemory({
          returnMessages: true,
          memoryKey: "history",
        }),
      }
    );

    // const newChain = ConversationalRetrievalQAChain.fromLLM(
    //   model,
    //   vectorStore.asRetriever(),
    //   {
    //     memory: new BufferMemory({
    //       memoryKey: "chat_history", // Must be set to "chat_history"
    //     }),
    //   }
    // );

    console.log("query", query);
    const response = await chain.call({
      question: query,
    });

    // const newResponse = await newChain.call({
    //   question: query,
    // });

    pastMessages.push(new AIChatMessage(response.text));
    console.log(response.text);
    return response.text;
  } catch (error) {
    console.log("error", error);
  }
};
