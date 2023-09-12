import express from "express";
import {
  createVocher,
  getVochers,
  getVocher,
} from "../controllers/vocher.controller";

export const vocherRouter = express.Router();

vocherRouter.get("/", getVochers);
vocherRouter.get("/:id", getVocher);
vocherRouter.post("/", createVocher);
// vocherRouter.delete("/:id", deleteVocher);
