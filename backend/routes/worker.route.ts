import express from "express";
import {
  createWorker,
  getWorker,
  getWorkers,
  deleteWorker,
} from "../controllers/worker.controller";

export const workerRouter = express.Router();

workerRouter.get("/", getWorkers);
workerRouter.get("/:id", getWorker);
workerRouter.post("/", createWorker);
workerRouter.delete("/", deleteWorker);
