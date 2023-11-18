import express from "express";
import {
  createPayment,
  createPaymentOutOfVocher,
} from "../controllers/payment.controller";
import { isAuthenticated } from "../middleware/auth";

export const paymentRouter = express.Router();

paymentRouter.post("/", isAuthenticated, createPayment);
paymentRouter.post("/out-of-vocher", isAuthenticated, createPaymentOutOfVocher);
