import express from "express";
import {
  createWorker,
  getWorker,
  getWorkers,
  deleteWorker,
  getMissionsYears,
} from "../controllers/worker.controller";

export const workerRouter = express.Router();

workerRouter.get("/", getWorkers);
workerRouter.get("/:id", getWorker);
workerRouter.post("/", createWorker);
workerRouter.get("/years/:workerId", getMissionsYears);
// workerRouter.delete("/:id", deleteWorker);
