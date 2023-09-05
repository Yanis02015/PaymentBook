import session from "express-session";

const SECRET_KEY_TOKEN = process.env.SECRET_KEY_TOKEN as string;
const _24H = 1000 * 60 * 60 * 24;
export const configureExpressSession = session({
  secret: SECRET_KEY_TOKEN,
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: "lax",
    httpOnly: true,
    maxAge: _24H,
    secure: false,
  },
});
