import { NextFunction, Request, Response } from "express";
import { VocherModel, WorkerModel } from "../configurations/db";
import { ExpressError } from "../utils/error";
import { groupVocher } from "../utils/functions";
import { Prisma } from "@prisma/client";

export const getVochers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vochers = await VocherModel.findMany();
    res.status(200).json(vochers);
  } catch (error) {
    next(error);
  }
};

export const getVocher = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const vocher = await VocherModel.findFirst({ where: { id } });
    if (!vocher) return next(new ExpressError("Aucun bon trouvé", 404));

    res.status(200).json(vocher);
  } catch (error) {
    next(error);
  }
};
export const getWorkerVochers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { workerId } = req.params;
    const vochers = await VocherModel.findMany({
      where: { workerId },
      include: { Type: true },
    });
    if (!vochers) return next(new ExpressError("Aucun bon trouvé", 404));

    const { group } = req.query;
    if (group == "month") return res.status(200).json(groupVocher(vochers));

    res.status(200).json(vochers);
  } catch (error) {
    console.log(error);

    next(error);
  }
};

export const createVocher = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { remuneration, quantity, workerId, typeId } = req.body;
    let requireField = "";
    if (!remuneration) requireField = "rémuneration";
    else if (!quantity) requireField = "quantité";
    else if (!workerId) requireField = "travailleur";
    else if (!typeId) requireField = "type";
    if (requireField)
      return next(
        new ExpressError(`Le champ ${requireField} est requis.`, 400)
      );

    const worker = await WorkerModel.findFirst({ where: { id: workerId } });
    if (!worker) return next(new ExpressError("Aucun travailleur trouvé", 404));

    const vochers = await VocherModel.create(req.body);
    res.status(200).json(vochers);
  } catch (error) {
    next(error);
  }
};
