import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { configureCors as cors } from "./configurations/cors";
import { configureExpressSession as expressSession } from "./configurations/express-session";
import "./configurations/passport";
import { authRouter } from "./routes/auth.route";
import passport from "passport";

export const app = express();

app.use(express.json());
app.use(cors);
app.use(expressSession);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", authRouter);
