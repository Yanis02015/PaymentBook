import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SECRET_KEY_TOKEN = process.env.SECRET_KEY_TOKEN as string;
const _24H = 1000 * 60 * 60 * 24;
const _2MIN = 1000 * 60 * 2;
export const configureExpressSession = session({
  secret: SECRET_KEY_TOKEN,
  store: new PrismaSessionStore(prisma, {
    checkPeriod: _2MIN,
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
  }),
  resave: false,
  saveUninitialized: true,
  rolling: true,
  cookie: {
    sameSite: "lax",
    httpOnly: true,
    maxAge: _24H,
    secure: false,
  },
});
