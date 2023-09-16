import { YearsWorkerSchema } from "@/schemas/worker.schema";
import { MakeRequest } from "./config";

export const getYearsOfWorker = async (workerId: string) =>
  await MakeRequest.get(`workers/years/${workerId}`)
    .json()
    .then(YearsWorkerSchema.parse);
