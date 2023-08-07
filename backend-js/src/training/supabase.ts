import { BufferMemory } from "langchain/memory";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { supabase } from "../websocket";

import {
  JSONLoader,
  JSONLinesLoader,
} from "langchain/document_loaders/fs/json";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "langchain/document_loaders/fs/csv";

dotenv.config();

// First, follow set-up instructions at
// https://js.langchain.com/docs/modules/indexes/vector_stores/integrations/supabase

const privateKey = process.env.SUPABASE_PRIVATE_KEY;
if (!privateKey) throw new Error(`Expected env var SUPABASE_PRIVATE_KEY`);

const url = process.env.SUPABASE_URL;
if (!url) throw new Error(`Expected env var SUPABASE_URL`);

const client = createClient(url, privateKey);

// export const runSupa = async () => {
//   const client = createClient(url, privateKey);
//   const documentId = "1";

//   const { data: document, error } = await supabase
//     .from("documents")
//     .select("*")
//     .eq("id", documentId)
//     .single();

//   if (!document) {
//     return res.status(404).json({ error: "Document not found" });
//   }

//   const vectorStore = await SupabaseVectorStore.fromTexts(
//     [document.content],
//     [{ id: documentId }],
//     new OpenAIEmbeddings(),
//     {
//       client: supabase,
//       tableName: "documents",
//       queryName: "match_documents",
//     }
//   );

//   const resultOne = await vectorStore.similaritySearch(
//     "How's it going, people?",
//     1
//   );

//   console.log(resultOne);
// };

export const initializeSupabase = async (ws: any) => {
  console.log("initializing supabase");

  // Fetch all the data from the documents table
  const { data: documents, error } = await supabase
    .from("documents")
    .select("*");

  if (!documents || documents.length === 0) {
    return;
  }

  // Extract the content from each document
  const documentContents = documents.map((doc) => doc.content);
  const documentIds = documents.map((doc) => ({ id: doc.id.toString() })); // Assuming id is a number, we convert it to a string

  const vectorStore = await SupabaseVectorStore.fromTexts(
    documentContents,
    documentIds,
    new OpenAIEmbeddings(),
    {
      client: supabase,
      tableName: "documents",
      queryName: "match_documents",
    }
  );

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

  const nonStreamingModel = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
  });

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

export const createEmbeddings = async ({ modelId }: { modelId: string }) => {
  const startTime = Date.now(); // Start the timer

  const trainLocal = async () => {
    try {
      const loader = new DirectoryLoader("src/training/data/docs/concepts", {
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

      const enhancedTexts = texts.map((text) => ({
        ...text,
        model_id: modelId,
      }));

      console.log("texts", texts.slice(0, 10));

      const vectorStore = await SupabaseVectorStore.fromDocuments(
        texts,
        new OpenAIEmbeddings(),
        {
          client: client,
          tableName: "documents",
          queryName: "match_documents",
        }
      );

      // Update model_id for the inserted documents
      for (let docId of vectorStore) {
        await client
          .from("documents")
          .update({ model_id: modelId })
          .eq("id", docId);
      }

      console.log("vectorStore", vectorStore);
    } catch (error) {
      console.log("error", error);
    }
  };

  await trainLocal();

  const endTime = Date.now(); // Get the end time
  console.log(`Time taken: ${endTime - startTime}ms`);
};

export const useEmbeddings = async () => {
  const { data: document, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", "16")
    .single();

  if (!document) {
    return;
  }

  const vectorStore = await SupabaseVectorStore.fromTexts(
    [document.content],
    [{ id: "1" }],
    new OpenAIEmbeddings(),
    {
      client: supabase,
      tableName: "documents",
      queryName: "match_documents",
    }
  );

  const resultOne = await vectorStore.similaritySearch(
    "What are Aptos blocks??",
    1
  );

  console.log("resultOne", resultOne);
};
