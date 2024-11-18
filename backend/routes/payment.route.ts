import express from "express";
import {
  createPayment,
  deletePayment,
} from "../controllers/payment.controller";
import { isAuthenticated } from "../middleware/auth";

export const paymentRouter = express.Router();

paymentRouter.post("/", isAuthenticated, createPayment);
paymentRouter.delete("/:paymentId", isAuthenticated, deletePayment);
