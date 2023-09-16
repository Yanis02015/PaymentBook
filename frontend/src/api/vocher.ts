import { z } from "zod";
import { MakeRequest } from "./config";
import {
  VocherTypesSchema,
  VochersPerMonthsSchema,
  VochersSchema,
} from "@/schemas/vocher.schema";
import { VocherFormSchema } from "@/schemas/form.schema";

export const getVochers = async () =>
  await MakeRequest.get("vochers").json().then(VochersSchema.parse);

export const getWorkerVochers = async (workerId: string, year: number) =>
  await MakeRequest.get(`vochers/worker/${workerId}?group=month&year=${year}`)
    .json()
    .then(VochersPerMonthsSchema.parse);

export const createVocher = async (vocher: z.infer<typeof VocherFormSchema>) =>
  await MakeRequest.post("vochers", { json: vocher }).json();

export const getVocherTypes = async () =>
  await MakeRequest("vochers/types").json().then(VocherTypesSchema.parse);
