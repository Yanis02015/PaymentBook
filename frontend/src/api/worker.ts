import { WorkerFormSchema } from "@/schemas/form.schema";
import { WorkerSchema, WorkersSchema } from "@/schemas/worker.schema";
import { z } from "zod";
import { MakeRequest } from "./config";
import { generateMatricule } from "@/utils/functions";

export const getWorkers = async () =>
  await MakeRequest.get("workers").json().then(WorkersSchema.parse);

export const getWorker = async (id: string) =>
  await MakeRequest.get(`workers/${id}`).json().then(WorkerSchema.parse);

export const createWorker = async (
  worker: z.infer<typeof WorkerFormSchema>
) => {
  if (worker.matriculeId.length < 6)
    worker.matriculeId = `0${worker.matriculeId}`;
  return await MakeRequest.post("workers", {
    json: {
      ...worker,
      matricule: generateMatricule(worker),
    },
  }).json();
};

export const modifyWorker = async ({
  workerId,
  worker,
}: {
  worker: z.infer<typeof WorkerFormSchema>;
  workerId: string;
}) =>
  (
    await MakeRequest.put(`workers/${workerId}`, {
      json: {
        ...worker,
        matricule: generateMatricule(worker),
      },
    })
  ).json();

export const deleteWorker = async ({
  workerId,
  password,
}: {
  workerId: string;
  password?: string;
}) =>
  await MakeRequest.delete(`workers/${workerId}`, {
    json: { password },
  }).json();
