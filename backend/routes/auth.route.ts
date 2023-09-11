import express from "express";
import { login, refresh } from "../controllers/user.controller";

export const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.get("/refresh", refresh);
