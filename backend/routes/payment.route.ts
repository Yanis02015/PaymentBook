import express from "express";
import { createPayment } from "../controllers/payment.controller";
import { isAuthenticated } from "../middleware/auth";

export const paymentRouter = express.Router();

paymentRouter.post("/", isAuthenticated, createPayment);
