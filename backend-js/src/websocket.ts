import * as WebSocket from "ws";
import http from "http";

import { SupabaseClient } from "@supabase/supabase-js";
import { initalizePinecone, runQueryPinecone } from "./training/pinecone";
import { initializeSupabase } from "./training/supabase";

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_PRIVATE_KEY = process.env.SUPABASE_PRIVATE_KEY || "";

export const supabase = new SupabaseClient(SUPABASE_URL, SUPABASE_PRIVATE_KEY);

export function setupWebSocketServer(server: http.Server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws: any) => {
    console.log("Client connected");
    let chain: any = null;
    // console.log("chain", chain);

    ws.on("message", async (message: any) => {
      // Parse the incoming message
      const data = JSON.parse(message);

      // Check if it's an initialization message
      if (data.type === "init") {
        // Extract provider ID
        const providerName = data.name;
        console.log("initializing...");

        // Fetch the provider from Supabase
        const { data: providerData, error } = await supabase
          .from("models")
          .select("provider, vectorStore")
          .eq("name", providerName)
          .single();

        if (error) {
          console.log("Error fetching provider: ", error);
          ws.send(JSON.stringify({ error: "Error fetching provider" }));
          return;
        }

        console.log("providerData.vectorStore", providerData.vectorStore);

        const provider = "supabase";
        // Initialize the correct provider
        // switch (providerData.provider) {
        switch (provider) {
          // case "chroma":
          // // chain = await initializeChroma(providerData.vectorStore, ws);
          // // break;
          // case "pinecone":
          //   chain = await initalizePinecone(providerData.vectorStore, ws);
          //   break;
          case "supabase":
            chain = await initializeSupabase(ws);
          default:
            ws.send(JSON.stringify({ error: "Invalid provider ID" }));
        }

        console.log("chain", chain);
      } else if (data.type === "query") {
        // Perform the query
        // @ts-ignore
        const { response, newChain } = await runQueryPinecone({
          ws: ws,
          query: data.query,
          chain: chain,
        });

        // ws.send(JSON.stringify(chain));
        response &&
          ws.send(
            JSON.stringify({ sender: "bot", message: response, type: "end" })
          );
      }
    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });

  console.log("WebSocket server setup complete");
}
