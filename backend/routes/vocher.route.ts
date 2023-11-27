import express from "express";
import {
  createVocher,
  getVochers,
  getVocher,
  getWorkerVochers,
  getVocherTypes,
  createVocherTypes,
  deleteVocherTypes,
  modifyVocherType,
  getWorkerMonth,
  modifyVocher,
  deleteVocher,
} from "../controllers/vocher.controller";
import { isAuthenticated } from "../middleware/auth";

export const vocherRouter = express.Router();

vocherRouter.get("/", isAuthenticated, getVochers);
vocherRouter.get("/worker/:workerId", isAuthenticated, getWorkerVochers);
vocherRouter.get("/month/:workerId", isAuthenticated, getWorkerMonth);
vocherRouter.post("/", isAuthenticated, createVocher);
vocherRouter.put("/:vocherId", isAuthenticated, modifyVocher);
vocherRouter.delete("/:vocherId", isAuthenticated, deleteVocher);

vocherRouter.get("/types", isAuthenticated, getVocherTypes);
vocherRouter.post("/types", isAuthenticated, createVocherTypes);
vocherRouter.put("/types/:typeId", isAuthenticated, modifyVocherType);
vocherRouter.delete("/types/:typeId", isAuthenticated, deleteVocherTypes);

vocherRouter.get("/:id", isAuthenticated, getVocher);
// vocherRouter.delete("/:id", deleteVocher);
