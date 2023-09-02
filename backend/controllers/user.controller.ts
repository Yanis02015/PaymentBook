import { NextFunction, Request, Response } from "express";
import passport from "passport";

export const login = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", (err: Error | undefined, user: any) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).send("Échec de l'authentification");
    }

    req.logIn(user, (err) => {
      if (err) return next(err);

      // Vous pouvez renvoyer une réponse personnalisée ici
      return res.json("Authentification réussie");
    });
  })(req, res, next);
};
