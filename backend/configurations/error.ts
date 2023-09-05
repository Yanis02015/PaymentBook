import { NextFunction, Request, Response } from "express";
import { ExpressException } from "../utils/types";

export const catchError = (
  err: ExpressException,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || 500; // Utilisez 500 si aucun statut n'est défini
  const message = err.message || "Erreur interne du serveur";

  res.status(statusCode).json({ message });
};
