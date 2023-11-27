import { VocherFormSchema, VocherTypeFormSchema } from "@/schemas/form.schema";
import {
  VocherTypesSchema,
  VochersPerMonthSchema,
  VochersPerMonthsSchema,
  VochersSchema,
} from "@/schemas/vocher.schema";
import { z } from "zod";
import { MakeRequest } from "./config";

export const getVochers = async () =>
  await MakeRequest.get("vochers").json().then(VochersSchema.parse);

export const getWorkerVochers = async (workerId: string, year: number) =>
  await MakeRequest.get(`vochers/worker/${workerId}?group=month&year=${year}`)
    .json()
    .then(VochersPerMonthsSchema.parse);

export const createVocher = async (vocher: z.infer<typeof VocherFormSchema>) =>
  await MakeRequest.post("vochers", { json: vocher }).json();

export const getVocherTypes = async () =>
  (
    await MakeRequest("vochers/types").json().then(VocherTypesSchema.parse)
  ).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

export const createVocherTypes = async (
  vocherType: z.infer<typeof VocherTypeFormSchema>
) => await MakeRequest.post("vochers/types", { json: vocherType }).json();

export const modifyVocherType = async ({
  vocherType,
  typeId,
}: {
  vocherType: z.infer<typeof VocherTypeFormSchema>;
  typeId: string;
}) =>
  await MakeRequest.put(`vochers/types/${typeId}`, { json: vocherType }).json();

export const deleteVocherTypes = async (typeId: string) =>
  await MakeRequest.delete(`vochers/types/${typeId}`).json();

export const getVochersByMonth = async ({
  date,
  workerId,
}: {
  date: Date;
  workerId: string;
}) =>
  await MakeRequest(`vochers/month/${workerId}`, {
    searchParams: { date: date.toISOString() },
  })
    .json()
    .then(VochersPerMonthSchema.parse);

export const modifyVocher = async ({
  vocherId,
  vocher,
}: {
  vocherId: string;
  vocher: z.infer<typeof VocherFormSchema>;
}) => await MakeRequest.put(`vochers/${vocherId}`, { json: vocher }).json();

export const deleteVocher = async (vocherId: string) =>
  await MakeRequest.delete(`vochers/${vocherId}`).json();
