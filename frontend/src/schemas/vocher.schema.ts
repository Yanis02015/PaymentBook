import * as z from "zod";
import { WorkerSchema } from "./worker.schema";
import { PaymentsSchema } from "./payment.schema";

export const VocherTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  remuneration: z.coerce.number(),
  createdAt: z.coerce.date(),
});

export const VocherSchema = z.object({
  id: z.string(),
  remuneration: z.coerce.number(),
  quantity: z.number(),
  workerId: z.string(),
  Worker: WorkerSchema.optional(),
  typeId: z.string(),
  Type: VocherTypeSchema.optional(),
  date: z.coerce.date(),
  createdAt: z.coerce.date(),
});

export const VocherTypesSchema = z.array(VocherTypeSchema);
export const VochersSchema = z.array(VocherSchema);

export const VochersPerMonthSchema = z.object({
  month: z.string(), // This is a title like : « Septembre 2023 »
  date: z.coerce.date(),
  total: z.number(),
  pay: z.number(),
  rest: z.number(),
  Vochers: VochersSchema,
  Payments: PaymentsSchema,
});

export const VochersPerMonthsSchema = z.array(VochersPerMonthSchema);

export type VocherType = z.infer<typeof VocherSchema>;
export type VocherMonthType = z.infer<typeof VochersPerMonthSchema>;
export type VocherTypeType = z.infer<typeof VocherTypeSchema>;
