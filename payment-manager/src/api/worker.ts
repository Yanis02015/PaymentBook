import { WorkerSchema, WorkersSchema } from "@/schemas/worker.schema";
import { MakeRequest } from "./config";

export const getWorkers = async () =>
  await MakeRequest.get("workers").json().then(WorkersSchema.parse);

export const getWorker = async (id: string) =>
  await MakeRequest.get(`workers/${id}`).json().then(WorkerSchema.parse);
