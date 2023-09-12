import { NextFunction, Request, Response } from "express";
import { ExpressError } from "../utils/error";
import { Prisma } from "../configurations/db";

export const createWorker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstname, lastname, matricule } = req.body;
    if (!firstname || !lastname || !matricule)
      throw new ExpressError("required", 400);

    const workers = await Prisma.worker.create({
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
    const workers = await Prisma.worker.findMany();
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
    const worker = await Prisma.worker.findUnique({ where: { id } });
    if (!worker) throw new ExpressError("Aucun employé trouvé", 404);
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
    const worker = await Prisma.worker.delete({ where: { id } });
    if (!worker) throw new ExpressError("Aucun employé trouvé", 404);
    res.status(200).json(worker);
  } catch (error) {
    next(error);
  }
};
