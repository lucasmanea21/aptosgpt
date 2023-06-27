import express, { Express, Request, Response } from "express";
import http from "http";
import dotenv from "dotenv";
import * as WebSocket from "ws";

import { runPinecone, runQueryPinecone } from "./training/pinecone";

dotenv.config();

const app: Express = express();
const server = http.createServer(app);
const port = process.env.PORT;
const wss = new WebSocket.Server({ server });

const expressWs = require("express-ws")(app);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

// runPinecone();

wss.on("connection", (ws: any) => {
  console.log("Client connected");

  ws.on("message", async (message: any) => {
    const response = runQueryPinecone({ ws: ws, query: message.toString() });

    ws.send(JSON.stringify({ sender: "bot", message: response, type: "end" }));
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
