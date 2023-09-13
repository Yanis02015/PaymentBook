import * as z from "zod";
import { WorkerSchema } from "./worker.schema";

export const VocherTypeSchepa = z.object({
  id: z.string(),
  name: z.string(),
  remuneration: z.string(),
  createdAt: z.string(),
});

export const VocherSchema = z.object({
  id: z.string(),
  remuneration: z.string(),
  quantity: z.number(),
  workerId: z.string(),
  Worker: WorkerSchema.optional(),
  typeId: z.string(),
  Type: VocherTypeSchepa.optional(),
  date: z.string(),
  createdAt: z.string(),
});

export const VocherTypesSchema = z.array(VocherTypeSchepa);
export const VochersSchema = z.array(VocherSchema);

export const VochersPerMonthSchema = z.object({
  month: z.string(),
  total: z.number(),
  pay: z.number(),
  rest: z.number(),
  Vochers: VochersSchema,
});

export const VochersPerMonthsSchema = z.array(VochersPerMonthSchema);
