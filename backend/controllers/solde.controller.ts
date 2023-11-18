import { NextFunction, Request, Response } from "express";
import { ExpressError } from "../utils/error";
import { PaymentModel, SoldeModel, WorkerModel } from "../configurations/db";
import { Decimal } from "@prisma/client/runtime/library";
import { getSoldesAmountsAndRest } from "../classes/solde.class";

export const createSolde = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { amount, description, workerId } = req.body;
    if (!amount || !workerId)
      throw new ExpressError("Tous les champs sont requis", 400);

    if (typeof amount != "number" || amount <= 0)
      throw new ExpressError("Le mountant dû est incorrect", 400);

    await WorkerModel.findUniqueOrThrow({
      where: { id: workerId },
    });

    await SoldeModel.create({
      data: { amount, workerId, description: description || undefined },
    });
    res.status(201).json({ message: "Solde crée avec succès" });
  } catch (error) {
    next(error);
  }
};

export const getSoldesByWorkerId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { workerId } = req.params;
    await WorkerModel.findUniqueOrThrow({
      where: { id: workerId },
    });

    const soldes = await SoldeModel.findMany({ where: { workerId } });
    res.status(200).json(soldes);
  } catch (error) {
    next(error);
  }
};

export const getSoldeAmountByWorkerId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { workerId } = req.params;
    await WorkerModel.findUniqueOrThrow({
      where: { id: workerId },
    });

    const { payment, rest, amount } = await getSoldesAmountsAndRest(workerId);
    res.status(200).json({ amount, rest, payment });
  } catch (error) {
    next(error);
  }
};
