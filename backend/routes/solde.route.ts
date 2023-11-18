import { Router } from "express";
import {
  createSolde,
  getSoldeAmountByWorkerId,
  getSoldesByWorkerId,
} from "../controllers/solde.controller";
import { isAuthenticated } from "../middleware/auth";

export const soldeRouter = Router();

soldeRouter.get("/:workerId", isAuthenticated, getSoldesByWorkerId);
soldeRouter.get("/amount/:workerId", isAuthenticated, getSoldeAmountByWorkerId);
soldeRouter.post("/", isAuthenticated, createSolde);
