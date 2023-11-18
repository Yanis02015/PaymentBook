import express from "express";
import {
  createWorker,
  getWorker,
  getWorkers,
  getMissionsYears,
  modifyWorker,
} from "../controllers/worker.controller";
import { isAuthenticated } from "../middleware/auth";

export const workerRouter = express.Router();

workerRouter.get("/", isAuthenticated, getWorkers);
workerRouter.get("/:id", isAuthenticated, getWorker);
workerRouter.post("/", isAuthenticated, createWorker);
workerRouter.get("/years/:workerId", isAuthenticated, getMissionsYears);
workerRouter.put("/:workerId", isAuthenticated, modifyWorker);
