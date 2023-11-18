import { NextFunction, Request, Response } from "express";
import { ExpressError } from "../utils/error";
import {
  PaymentModel,
  Prisma,
  SoldeModel,
  VocherModel,
  WorkerModel,
} from "../configurations/db";
import { Worker } from "@prisma/client";

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
    const { workerId } = req.params;
    const { password } = req.body;
    const { _count: relations } = await WorkerModel.findUniqueOrThrow({
      where: { id: workerId },
      include: {
        _count: { select: { Payments: true, Soldes: true, Vochers: true } },
      },
    });
    const hasRelation =
      relations.Payments > 0 || relations.Soldes > 0 || relations.Vochers > 0;
    if (!password && (typeof password != "string" || hasRelation))
      throw new ExpressError(
        "L'employé ne peut pas être supprimer de cette façon, car possede des relations",
        400
      );

    if (hasRelation) {
      if (password != process.env.ADMIN_PASSWORD)
        throw new ExpressError("Mot de passe incorrecte", 400);

      await SoldeModel.deleteMany({ where: { workerId } });
      await VocherModel.deleteMany({ where: { workerId } });
      await PaymentModel.deleteMany({ where: { workerId } });
    }
    await WorkerModel.delete({ where: { id: workerId } });
    res.status(200).json({ message: "Employé supprimé avec succès" });
  } catch (error) {
    next(error);
  }
};

export const getMissionsYears = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { workerId } = req.params;
    if (!workerId) throw new ExpressError("Aucun travailleur selectionné", 400);

    const worker = await WorkerModel.findFirst({ where: { id: workerId } });
    if (!worker) throw new ExpressError("Travailleur non trouvé", 404);

    const years = await getYearsWorkerJob(workerId);
    const castedYears = years.map((y) => ({
      ...y,
      vochers: parseInt(y.vochers.toString(), 10),
    }));

    res.status(200).json(castedYears);
  } catch (error) {
    next(error);
  }
};

export const modifyWorker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { workerId } = req.params;
    let {
      matricule,
      firstname,
      lastname,
      address,
      birthdate,
      email,
      phonenumber,
    } = req.body;

    const worker = await WorkerModel.findUniqueOrThrow({
      where: { id: workerId },
    });
    const newWorker = getWorkerToUpdate(
      {
        matricule,
        firstname,
        lastname,
        address,
        birthdate,
        email,
        phonenumber,
      },
      worker
    );

    await WorkerModel.update({ where: { id: workerId }, data: newWorker });
    res.status(200).json({ message: "Employé modifié avec succès" });
  } catch (error) {
    next(error);
  }
};

// Function
export const getYearsWorkerJob = async (
  workerId: string
): Promise<{ year: number; vochers: bigint }[]> => {
  return await Prisma.$queryRaw`
  SELECT 
    EXTRACT(YEAR FROM date) as year,
    COUNT(*) as vochers
  FROM 
    Vocher
  WHERE
    workerId=${workerId}
  GROUP BY 
    year
  ORDER BY 
    year DESC;
`;
};

const getWorkerToUpdate = (
  newWorker: {
    matricule?: string;
    firstname?: string;
    lastname?: string;
    phonenumber?: string;
    address?: string;
    birthdate?: string;
    email?: string;
  },
  {
    matricule,
    firstname,
    lastname,
    address,
    birthdate,
    email,
    phonenumber,
  }: Worker
) => {
  if (newWorker.matricule == matricule) newWorker.matricule = undefined;
  if (newWorker.firstname == firstname) newWorker.firstname = undefined;
  if (newWorker.lastname == lastname) newWorker.lastname = undefined;
  if (newWorker.address == address) newWorker.address = undefined;
  if (newWorker.phonenumber == phonenumber) newWorker.phonenumber = undefined;
  if (newWorker.email == email) newWorker.email = undefined;
  if (newWorker.birthdate == birthdate) newWorker.birthdate = undefined;

  return newWorker;
};
