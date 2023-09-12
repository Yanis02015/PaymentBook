import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { configureCors as cors } from "./configurations/cors";
import { configureExpressSession as expressSession } from "./configurations/express-session";
import "./configurations/passport";
import { authRouter } from "./routes/auth.route";
import passport from "passport";
import { workerRouter } from "./routes/worker.route";
import { vocherRouter } from "./routes/vocher.route";
import { catchError } from "./configurations/error";
import path from "path";

export const app = express();

app.use(express.json());
app.use(cors);
app.use(expressSession);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  "/images",
  express.static(path.join(__dirname, "../save/images/workers"))
);

app.use("/api/auth", authRouter);
app.use("/api/workers", workerRouter);
app.use("/api/vochers", vocherRouter);

app.use(catchError);
