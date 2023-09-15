import express from "express";
import { createPayment } from "../controllers/payment.controller";

export const paymentRouter = express.Router();

paymentRouter.post("/", createPayment);
