import { NextFunction, Request, Response } from "express";
import { ExpressError } from "../utils/error";
import { Prisma, WorkerModel } from "../configurations/db";

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
