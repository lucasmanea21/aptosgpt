import express, { Request, Response } from "express";
import { createModel, getModel } from "../controllers/models.controller";

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    // const { provider } = req.body;
    const provider = "Supabase";
    const model = await createModel(provider);
    res.json(model);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const model = await getModel(req.params.id);
    res.json(model);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
