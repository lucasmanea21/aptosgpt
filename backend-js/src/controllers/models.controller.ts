import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { BufferMemory } from "langchain/memory";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { Chroma } from "langchain/vectorstores/chroma";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PineconeClient } from "@pinecone-database/pinecone";
import { PostgrestResponse, SupabaseClient } from "@supabase/supabase-js";
import { createEmbeddings } from "../training/supabase";

// todo: replace with global supabase instance
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_PRIVATE_KEY = process.env.SUPABASE_PRIVATE_KEY || "";

const supabase = new SupabaseClient(SUPABASE_URL, SUPABASE_PRIVATE_KEY);

interface VectorStoreModel {
  id: string;
  provider: string;
  vectorStore: Chroma | PineconeStore;
}

export async function createModel(
  provider: "Chroma" | "Pinecone" | "Supabase"
): Promise<string> {
  let vectorStore;

  const { data, error } = await supabase
    .from("models")
    .insert([{ provider }])
    .select();

  if (error) throw new Error(error.message);

  if (provider === "Chroma") {
  } else if (provider == "Supabase") {
    console.log("data", data);

    createEmbeddings(data[0].id);
  } else {
    throw new Error("Unsupported provider");
  }

  //   @ts-ignore

  return "Success";
}

export async function getModel(id: string): Promise<VectorStoreModel> {
  const { data, error } = await supabase
    .from("models")
    .select()
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("No such model");

  return data;
}

// export async function createEmbeddings {

//   const loader = new DirectoryLoader(
//     "src/document_loaders/example_data/example",
//     {
//       ".json": (path) => new JSONLoader(path, "/texts"),
//       ".jsonl": (path) => new JSONLinesLoader(path, "/html"),
//       ".txt": (path) => new TextLoader(path),
//       ".csv": (path) => new CSVLoader(path, "text"),
//     }
//   );

//   const vectorStore = await SupabaseVectorStore.fromTexts(
//     [fileContent],
//     [{ id: 1 }],
//     new OpenAIEmbeddings(),
//     {
//       client: supabase,
//       tableName: "documents",
//       queryName: "match_documents",
//     }
//   );
// }
