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
import { isAuthenticated } from "../middleware/auth";

export const vocherRouter = express.Router();

vocherRouter.get("/", isAuthenticated, getVochers);
vocherRouter.get("/worker/:workerId", isAuthenticated, getWorkerVochers);
vocherRouter.post("/", isAuthenticated, createVocher);

vocherRouter.get("/types", isAuthenticated, getVocherTypes);
vocherRouter.post("/types", isAuthenticated, createVocherTypes);
vocherRouter.delete("/types/:typeId", isAuthenticated, deleteVocherTypes);

vocherRouter.get("/:id", isAuthenticated, getVocher);
// vocherRouter.delete("/:id", deleteVocher);
