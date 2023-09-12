import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { ExpressError } from "../utils/error";

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

export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Erreur lors de la déconnexion :", err);
      next(new ExpressError(err));
    } else {
      console.log("Déconnecté avec succès");
      res.status(200).json({ message: "Déconnecté avec succès" });
    }
  });
};

export const refresh = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated())
    return next(new ExpressError("You are not authenticated", 401));
  res.status(200).json({ message: "You are authenticated" });
};
