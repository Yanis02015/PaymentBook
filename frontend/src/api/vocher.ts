import { z } from "zod";
import { MakeRequest } from "./config";
import { VochersPerMonthsSchema, VochersSchema } from "@/schemas/vocher.schema";
import { VocherFormSchema } from "@/schemas/form.schema";

export const getVochers = async () =>
  await MakeRequest.get("vochers").json().then(VochersSchema.parse);

export const getWorkerVochers = async (workerId: string) =>
  await MakeRequest.get(`vochers/worker/${workerId}?group=month`)
    .json()
    .then(VochersPerMonthsSchema.parse);

export const createVocher = async (vocher: z.infer<typeof VocherFormSchema>) =>
  await MakeRequest.post("vochers", { json: vocher }).json();
