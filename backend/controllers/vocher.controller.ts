import { NextFunction, Request, Response } from "express";
import {
  PaymentModel,
  VocherModel,
  VocherTypeModel,
  WorkerModel,
} from "../configurations/db";
import { ExpressError } from "../utils/error";
import {
  formatMonthYearName,
  getMonthLimits,
  getYearLimits,
  groupVocher,
  isDateValid,
} from "../utils/functions";
import { Vocher } from "@prisma/client";
import { getPaymentsOfMonth } from "./payment.controller";

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
    const { year } = req.query;
    const date = getYearLimits(year as string);
    const vochers = await VocherModel.findMany({
      where: {
        workerId,
        date, // This is not createdAt
      },
      include: { Type: true },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (!vochers) return next(new ExpressError("Aucun bon trouvé", 404));

    const { group } = req.query;
    if (group == "month") {
      const payments = await PaymentModel.findMany({
        where: { workerId, month: date },
        orderBy: {
          createdAt: "asc",
        },
      });
      return res.status(200).json(groupVocher(vochers, payments));
    }

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
    const { remuneration, quantity, workerId, typeId, date, description } =
      req.body;
    let requireField = "";
    if (!remuneration || typeof remuneration != "number")
      requireField = "rémuneration";
    else if (!quantity || typeof quantity != "number")
      requireField = "quantité";
    else if (!workerId) requireField = "travailleur";
    else if (!typeId) requireField = "type";
    if (requireField)
      return next(
        new ExpressError(`Le champ ${requireField} est requis.`, 400)
      );
    if (
      !!description &&
      (typeof description != "string" || description.length > 140)
    )
      throw new ExpressError("La description n'est pas valide", 400);

    const worker = await WorkerModel.findFirst({ where: { id: workerId } });
    if (!worker) return next(new ExpressError("Aucun travailleur trouvé", 404));

    const vochers = await VocherModel.create({
      data: {
        remuneration,
        quantity,
        workerId,
        typeId,
        date,
        description: description || null,
      },
    });
    res.status(200).json(vochers);
  } catch (error) {
    next(error);
  }
};

export const getVocherTypes = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const types = await VocherTypeModel.findMany();
    res.status(200).json(types);
  } catch (error) {
    next(error);
  }
};

export const createVocherTypes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, remuneration } = req.body;
    if (!name)
      throw new ExpressError("Le nom du bon ne peut pas être vide", 400);
    if (!remuneration)
      throw new ExpressError("La rémunération est requis", 400);
    if (remuneration < 10)
      throw new ExpressError(
        "La rémunération ne peux pas être inferieur à 10 Da",
        400
      );
    const type = await VocherTypeModel.findFirst({ where: { name } });
    if (type) throw new ExpressError(`Le type "${type.name}" existe déjà`, 400);

    await VocherTypeModel.create({ data: { name, remuneration } });
    res.status(200).json({ message: "Type crée avec succès" });
  } catch (error) {
    next(error);
  }
};

export const modifyVocherType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { typeId } = req.params;
    if (!typeId) throw new ExpressError("L'id est requis", 400);
    const type = await VocherTypeModel.findFirst({ where: { id: typeId } });
    if (!type) throw new ExpressError(`Le type n'existe pas`, 404);

    let { name, remuneration } = req.body;
    if (!name && !remuneration)
      throw new ExpressError("Aucun champ saisi", 400);

    if (name == type.name || typeof name != "string") name = undefined;
    if (remuneration == type.remuneration || typeof remuneration != "number")
      remuneration = undefined;

    if (!name && !remuneration)
      throw new ExpressError("Aucun modification effectue", 400);

    await VocherTypeModel.update({
      where: { id: typeId },
      data: { name, remuneration },
    });
    res.status(200).json({ message: "Type mise à jour avec succès" });
  } catch (error) {
    next(error);
  }
};

export const deleteVocherTypes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { typeId } = req.params;
    if (!typeId) throw new ExpressError("L'id est requis", 400);
    const type = await VocherTypeModel.findFirst({ where: { id: typeId } });
    if (!type) throw new ExpressError(`Le type n'existe pas`, 404);

    await VocherTypeModel.delete({ where: { id: typeId } });
    res.status(200).json({ message: "Type a été supprimé avec succès" });
  } catch (error) {
    next(error);
  }
};

export const getWorkerMonth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { date: dateStr } = req.query;
    const { workerId } = req.params;
    if (typeof dateStr != "string" || !isDateValid(dateStr))
      throw new ExpressError("Date mal formé", 400);
    await WorkerModel.findUniqueOrThrow({ where: { id: workerId } });

    const date = new Date(dateStr);
    const paymentsOfMonth = await getPaymentsOfMonth(workerId, date);
    const vochersOfMonth = await getVochersOfMonth(workerId, date);

    let result = groupVocher(vochersOfMonth, paymentsOfMonth);
    if (result.length == 0)
      result.push({
        month: formatMonthYearName(date),
        date,
        pay: 0,
        Payments: [],
        rest: 0,
        total: 0,
        Vochers: [],
      });
    if (result.length != 1) {
      console.log(result);
      throw new ExpressError("Taille du tableau non valide", 500);
    }
    res.status(200).json(result[0]);
  } catch (error) {
    next(error);
  }
};

// Function
export const getVochersOfMonth = async (
  workerId: string,
  date: Date
): Promise<Vocher[]> => {
  const { begin, end } = getMonthLimits(date);

  return await VocherModel.findMany({
    where: {
      workerId,
      date: {
        gte: begin,
        lte: end,
      },
    },
    include: { Type: true },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const modifyVocher = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { vocherId } = req.params;
    const { remuneration, quantity, typeId, date } = req.body;
    let { description } = req.body;
    if (
      (!!remuneration && typeof remuneration != "number") ||
      (!!quantity && typeof quantity != "number") ||
      (!!typeId && typeof typeId != "string") ||
      (!!date && typeof date != "string") ||
      (!!description &&
        (typeof description != "string" || description.length > 140))
    )
      throw new ExpressError("Types error", 400);

    if (typeId)
      await VocherTypeModel.findUniqueOrThrow({ where: { id: typeId } });
    if (date && !isDateValid(date))
      throw new ExpressError("Date mal formé", 400);

    if (remuneration && remuneration < 10)
      throw new ExpressError(
        "La rémuneration ne peut pas être inferieur à 10DA",
        400
      );
    if (quantity && quantity < 1)
      throw new ExpressError("L'quantité ne peut pas être inferieur à 1", 400);

    await VocherModel.update({
      where: { id: vocherId },
      data: {
        date,
        quantity,
        remuneration,
        typeId,
        description: description || null,
      },
    });

    res.status(200).json({ message: "Bon modifié avec succès" });
  } catch (error) {
    next(error);
  }
};

export const deleteVocher = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { vocherId } = req.params;
    await VocherModel.delete({ where: { id: vocherId } });
    res.status(200).json({ message: "Mission supprimé" });
  } catch (error) {
    next(error);
  }
};
