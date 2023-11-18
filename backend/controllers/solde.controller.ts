import { NextFunction, Request, Response } from "express";
import { ExpressError } from "../utils/error";
import { PaymentModel, SoldeModel, WorkerModel } from "../configurations/db";
import { Decimal } from "@prisma/client/runtime/library";

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

    const { _sum: soldeSum } = await SoldeModel.aggregate({
      where: { workerId },
      _sum: { amount: true },
    });

    const { _sum: PaymentSum } = await PaymentModel.aggregate({
      where: { workerId, outOfVocher: true },
      _sum: { amount: true },
    });
    soldeSum.amount = soldeSum.amount || new Decimal(0);
    PaymentSum.amount = PaymentSum.amount || new Decimal(0);
    const rest = soldeSum.amount.minus(PaymentSum.amount);
    res
      .status(200)
      .json({ amount: soldeSum.amount, rest, payment: PaymentSum.amount });
  } catch (error) {
    next(error);
  }
};
