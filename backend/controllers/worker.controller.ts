import { NextFunction, Request, Response } from "express";
import { ExpressError } from "../utils/error";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createWorker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstname, lastname, matricule } = req.body;
    if (!firstname || !lastname || !matricule)
      throw new ExpressError("required", 400);

    const workers = await prisma.worker.create({
      data: { firstname, lastname, matricule },
    });
    res.status(201).json(workers);
  } catch (error) {
    next(error);
  }
};

export const getWorkers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const workers = await prisma.worker.findMany();
    if (!workers) throw new ExpressError("Aucun employé trouvé", 404);
    res.status(200).json(workers);
  } catch (error) {
    next(error);
  }
};

export const getWorker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const worker = await prisma.worker.findUnique({ where: { id } });
    if (worker) throw new ExpressError("Aucun employé trouvé", 404);
    res.status(200).json(worker);
  } catch (error) {
    next(error);
  }
};

export const deleteWorker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const worker = await prisma.worker.delete({ where: { id } });
    if (worker) throw new ExpressError("Aucun employé trouvé", 404);
    res.status(200).json(worker);
  } catch (error) {
    next(error);
  }
};
