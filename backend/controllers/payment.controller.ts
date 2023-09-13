import { NextFunction, Request, Response } from "express";
import { ExpressError } from "../utils/error";
import { PaymentType } from "@prisma/client";
import { PaymentModel, WorkerModel } from "../configurations/db";

export const createPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { amount, type, workerId, date } = req.body;
    if (!amount)
      throw new ExpressError("Le montant du payement est requis.", 400);
    if (type && ![PaymentType.CASH, PaymentType.GOODS].includes(type))
      throw new ExpressError("Le type de payement est incorrect.", 400);
    if (!workerId)
      throw new ExpressError("Aucun travailleur selectionner.", 400);
    if (!date)
      throw new ExpressError("Aucune date de payement selectionner.", 400);

    const worker = await WorkerModel.findFirst({ where: { id: workerId } });
    if (!worker) throw new ExpressError("Aucun travailleur trouvé.", 404);
    const payment = await PaymentModel.create({
      data: req.body,
      select: { amount: true, date: true, description: true, type: true },
    });

    res.status(201).json({ message: "Payment crée avec succès", payment });
  } catch (error) {
    next(error);
  }
};
