import express from "express";
import { login, refresh, logout } from "../controllers/user.controller";

export const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.get("/logout", logout);
authRouter.get("/refresh", refresh);
