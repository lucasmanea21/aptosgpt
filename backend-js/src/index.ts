import express, { Express, Request, Response } from "express";
import http from "http";
import dotenv from "dotenv";
import * as WebSocket from "ws";

import { SupabaseClient } from "@supabase/supabase-js";
import { runChroma } from "./training/chroma";
import { setupWebSocketServer } from "./websocket"; // Add this line
import { createEmbeddings, useEmbeddings } from "./training/supabase";

const modelsRoutes = require("./routes/models.routes.ts"); // Add this line

dotenv.config();

const app: Express = express();
const server = http.createServer(app);
const port = process.env.PORT;

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_PRIVATE_KEY = process.env.SUPABASE_PRIVATE_KEY || "";

export const supabase = new SupabaseClient(SUPABASE_URL, SUPABASE_PRIVATE_KEY);

app.use(express.json());
app.use("/models", modelsRoutes);

setupWebSocketServer(server);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

// createEmbeddings();
// useEmbeddings();

// runChroma();

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
