import { NextFunction, Request, Response } from "express";
import { ExpressError } from "../utils/error";
import { Payment, PaymentType, Vocher } from "@prisma/client";
import {
  PaymentModel,
  WorkerModel,
} from "../configurations/db";
import { getMonthLimits } from "../utils/functions";
import { getVochersOfMonth } from "./vocher.controller";

export const createPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { amount, type, workerId, month, description } = req.body;
    if (!amount || !(Number(amount) > 0))
      throw new ExpressError("Le montant du payement n'est pas valide.", 400);
    if (type && ![PaymentType.CASH, PaymentType.GOODS].includes(type))
      throw new ExpressError("Le type de payement est incorrect.", 400);
    if (!workerId)
      throw new ExpressError("Aucun travailleur selectionner.", 400);
    if (!month)
      throw new ExpressError("Aucune date de payement selectionner.", 400);

    const worker = await WorkerModel.findFirst({ where: { id: workerId } });
    if (!worker) throw new ExpressError("Aucun travailleur trouvé.", 404);

    const paymentsOfMonth = await getPaymentsOfMonth(workerId, month);
    const vichersOfMonth = await getVochersOfMonth(workerId, month);

    let totalPayments = 0;
    let totalVochers = 0;
    paymentsOfMonth.forEach((p) => (totalPayments += p.amount.toNumber()));
    vichersOfMonth.forEach(
      (v) => (totalVochers += v.remuneration.toNumber() * v.quantity)
    );
    if (totalPayments > totalVochers)
      throw new ExpressError("Vos versements du mois dépassement la somme dû.");

    if (totalPayments + Number(amount) > totalVochers)
      throw new ExpressError(
        "Le montant saisi est superieur au reste du mois."
      );

    const payment = await PaymentModel.create({
      data: {
        amount,
        description: description || undefined,
        month,
        type,
        workerId,
      },
      select: { amount: true, month: true, description: true, type: true },
    });

    res.status(201).json({ message: "Payment crée avec succès", payment });
  } catch (error) {
    next(error);
  }
};

export const getPaymentsOfMonth = async (
  workerId: string,
  date: Date
): Promise<Payment[]> => {
  const { begin, end } = getMonthLimits(date);

  return await PaymentModel.findMany({
    where: {
      workerId,
      month: {
        gte: begin,
        lte: end,
      },
    },
  });
};

export const deletePayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { paymentId } = req.params;
    await PaymentModel.delete({ where: { id: paymentId } });
    res.status(200).json({ message: "Versement supprimé avec succès" });
  } catch (error) {
    next(error);
  }
};
