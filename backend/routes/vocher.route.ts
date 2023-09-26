import express from "express";
import {
  createVocher,
  getVochers,
  getVocher,
  getWorkerVochers,
  getVocherTypes,
  createVocherTypes,
  deleteVocherTypes,
} from "../controllers/vocher.controller";

export const vocherRouter = express.Router();

vocherRouter.get("/", getVochers);
vocherRouter.get("/worker/:workerId", getWorkerVochers);
vocherRouter.post("/", createVocher);

vocherRouter.get("/types", getVocherTypes);
vocherRouter.post("/types", createVocherTypes);
vocherRouter.delete("/types/:typeId", deleteVocherTypes);

vocherRouter.get("/:id", getVocher);
// vocherRouter.delete("/:id", deleteVocher);
