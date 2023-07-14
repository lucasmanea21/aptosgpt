import { BufferMemory } from "langchain/memory";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { Chroma } from "langchain/vectorstores/chroma";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PineconeClient } from "@pinecone-database/pinecone";
import { PostgrestResponse, SupabaseClient } from "@supabase/supabase-js";

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
  provider: "Chroma" | "Pinecone",
  index: string
): Promise<string> {
  let vectorStore;

  if (provider === "Chroma") {
  } else if (provider === "Pinecone") {
    const client = new PineconeClient();
    await client.init({
      apiKey: process.env.PINECONE_API_KEY || "",
      environment: process.env.PINECONE_ENVIRONMENT || "",
    });
    const pineconeIndex = client.Index(index);

    vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings(),
      { pineconeIndex }
    );

    const model = new ChatOpenAI({
      streaming: true,
      // callbacks: [
      //   {
      //     handleLLMNewToken(token) {
      //       ws.send(
      //         JSON.stringify({ sender: "bot", message: token, type: "stream" })
      //       );
      //     },
      //   },
      // ],
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
      }
    );

    console.log("chain", chain);
  } else {
    throw new Error("Unsupported provider");
  }

  //   @ts-ignore
  const { data, error }: PostgrestResponse<VectorStoreModel> = await supabase
    .from("models")
    .insert([{ provider, vectorStore }]);

  if (error) throw new Error(error.message);

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
