import { WorkerFormSchema } from "@/schemas/form.schema";
import { WorkerSchema, WorkersSchema } from "@/schemas/worker.schema";
import { z } from "zod";
import { MakeRequest } from "./config";

export const getWorkers = async () =>
  await MakeRequest.get("workers").json().then(WorkersSchema.parse);

export const getWorker = async (id: string) =>
  await MakeRequest.get(`workers/${id}`).json().then(WorkerSchema.parse);

export const createWorker = async (worker: z.infer<typeof WorkerFormSchema>) =>
  await MakeRequest.post("workers", { json: worker }).json();
