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

dotenv.config();

const app: Express = express();
const server = http.createServer(app);
const port = process.env.PORT;
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws: any) => {
  console.log("Client connected");
  let chain: any = null;

  initalizePinecone(ws).then((res) => {
    chain = res;
  });

  ws.on("message", async (message: any) => {
    const response = await runQueryPinecone({
      ws: ws,
      query: message.toString(),
      chain: chain,
    });

    ws.send(JSON.stringify({ sender: "bot", message: response, type: "end" }));
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

// runPineconePdf();

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
