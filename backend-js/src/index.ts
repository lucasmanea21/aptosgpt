import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { run } from "./langchain";
import { runChroma } from "./training/chroma";
import { runRedis } from "./training/redis";
import { runSupa } from "./training/supabase";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

// run();
// runChroma();
// runRedis();
runSupa();

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
