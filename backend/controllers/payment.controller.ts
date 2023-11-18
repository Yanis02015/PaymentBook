import { NextFunction, Request, Response } from "express";
import { ExpressError } from "../utils/error";
import { Payment, PaymentType, Vocher } from "@prisma/client";
import {
  PaymentModel,
  SoldeModel,
  VocherModel,
  WorkerModel,
} from "../configurations/db";
import { getMonthLimits } from "../utils/functions";
import { getVochersOfMonth } from "./vocher.controller";
import { getSoldesAmountsAndRest } from "../classes/solde.class";

export const createPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { amount, type, workerId, month } = req.body;
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
      data: req.body,
      select: { amount: true, month: true, description: true, type: true },
    });

    res.status(201).json({ message: "Payment crée avec succès", payment });
  } catch (error) {
    next(error);
  }
};

export const createPaymentOutOfVocher = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { workerId, amount, description } = req.body;

    if (!workerId || !amount)
      throw new ExpressError("Les champs requis doivent être renseigné", 400);
    if (typeof amount != "number" || amount < 1)
      throw new ExpressError("La mountant du versement est incorrect", 400);
    if (description && typeof description != "string")
      throw new ExpressError("Description incorrect", 400);

    const { _sum: _sumPayment } = await PaymentModel.aggregate({
      where: { workerId, outOfVocher: true },
      _sum: {
        amount: true,
      },
    });

    const { _sum: _sumSolde } = await SoldeModel.aggregate({
      where: { workerId },
      _sum: {
        amount: true,
      },
    });

    const { rest } = await getSoldesAmountsAndRest(workerId);

    if (rest.lt(amount))
      throw new ExpressError(
        `Le mountant du versement ne peut pas dépasser ${rest} DA`
      );

    await PaymentModel.create({
      data: {
        amount,
        outOfVocher: true,
        workerId,
        description: description || undefined,
      },
    });

    res.status(201).json({ message: "Versement de solde crée" });
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
      outOfVocher: false,
    },
  });
};
