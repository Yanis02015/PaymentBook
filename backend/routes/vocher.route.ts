import express from "express";
import {
  createVocher,
  getVochers,
  getVocher,
  getWorkerVochers,
  getVocherTypes,
} from "../controllers/vocher.controller";

export const vocherRouter = express.Router();

vocherRouter.get("/", getVochers);
vocherRouter.get("/types", getVocherTypes);
vocherRouter.get("/:id", getVocher);
vocherRouter.get("/worker/:workerId", getWorkerVochers);
vocherRouter.post("/", createVocher);
// vocherRouter.delete("/:id", deleteVocher);
