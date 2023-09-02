import session from "express-session";

export const configureExpressSession = session({
  secret: "secret_key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: "lax",
    httpOnly: true,
    maxAge: 1000 * 3600 * 1000,
    secure: false,
  },
});
