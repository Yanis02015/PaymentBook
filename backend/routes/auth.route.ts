import express from "express";
import { login } from "../controllers/user.controller";
import { isAuthenticated } from "../middleware/auth";

export const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.get("/", isAuthenticated, (req, res) => {
  res.send("ok");
});
