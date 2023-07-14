import express, { Express, Request, Response } from "express";
import http from "http";
import dotenv from "dotenv";
import * as WebSocket from "ws";
import fs from "fs";
import path from "path";

import {
  initalizePinecone,
  runPinecone,
  runPineconePdf,
  runQueryPinecone,
} from "./training/pinecone";

import { createModel, getModel } from "./controllers/models.controller";
import { SupabaseClient } from "@supabase/supabase-js";
import { runChroma } from "./training/chroma";

dotenv.config();

const app: Express = express();
const server = http.createServer(app);
const port = process.env.PORT;

const wss = new WebSocket.Server({ server });

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_PRIVATE_KEY = process.env.SUPABASE_PRIVATE_KEY || "";

export const supabase = new SupabaseClient(SUPABASE_URL, SUPABASE_PRIVATE_KEY);

app.use(express.json());

wss.on("connection", (ws: any) => {
  console.log("Client connected");
  let chain: any = null;
  console.log("chain", chain);

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

      // Initialize the correct provider
      switch (providerData.provider) {
        case "chroma":
        // chain = await initializeChroma(providerData.vectorStore, ws);
        // break;
        case "pinecone":
          chain = await initalizePinecone(providerData.vectorStore, ws);
          break;
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

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

runChroma();

app.post("/models/create", async (req, res) => {
  try {
    const { provider, index } = req.body;
    const model = await createModel(provider, index);
    res.json(model);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/models/:id", async (req, res) => {
  try {
    const model = await getModel(req.params.id);
    res.json(model);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
