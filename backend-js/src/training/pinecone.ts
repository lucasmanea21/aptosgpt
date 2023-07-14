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
import { BufferMemory, ConversationSummaryMemory } from "langchain/memory";
import { OpenAI } from "langchain/llms/openai";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";

dotenv.config();

export const runPineconePdf = async () => {
  const client = new PineconeClient();

  await client.init({
    apiKey: process.env.PINECONE_API_KEY || "",
    environment: process.env.PINECONE_ENVIRONMENT || "",
  });

  const pineconeIndex = client.Index("test");

  const loader = new PDFLoader(
    "training/data/bible/The-Holy-Bible-King-James-Version.pdf"
  );

  const docs = await loader.loadAndSplit();

  console.log("loading done. starting pinecone upload");

  const res = await PineconeStore.fromDocuments(docs, new OpenAIEmbeddings(), {
    pineconeIndex,
  });

  console.log("res", res);
};

export const runPinecone = async () => {
  const client = new PineconeClient();

  await client.init({
    apiKey: process.env.PINECONE_API_KEY || "",
    environment: process.env.PINECONE_ENVIRONMENT || "",
  });

  const pineconeIndex = client.Index("test");

  const loader = new DirectoryLoader("training/data/bible", {
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

export const initalizePinecone = async (vectorStoreData: any, ws: any) => {
  console.log("ran initalization");
  const client = new PineconeClient();
  await client.init({
    apiKey: process.env.PINECONE_API_KEY || "",
    environment: process.env.PINECONE_ENVIRONMENT || "",
  });
  const pineconeIndex = client.Index("test"); // You might want to get this from `vectorStoreData`

  const nonStreamingModel = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
  });
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

  console.log("pineconeIndex", pineconeIndex);

  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    { pineconeIndex: pineconeIndex } // Use the data from `vectorStoreData`
  );

  console.log("vectorStore", vectorStore);

  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorStore.asRetriever(),

    {
      memory: new BufferMemory({
        returnMessages: true,
        memoryKey: "chat_history",
      }),
      // @ts-ignore
      verbose: true,
      questionGeneratorChainOptions: {
        llm: nonStreamingModel,
      },
    }
  );

  return chain;
};

export const runQueryPinecone = async ({
  ws,
  query,
  chain,
}: {
  ws: any;
  query: string;
  chain: ConversationalRetrievalQAChain;
}) => {
  console.log("query", query);
  try {
    console.log("chain.memory", chain.memory);
    // const chat_history = chain.memory.get("chat_history");
    const response = await chain.call({
      question: query,
    });

    return { response: response.text, newChain: chain };
  } catch (error) {
    console.log("error", error);
  }
};
