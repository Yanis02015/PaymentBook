import { z } from "zod";
import { WorkerSchema } from "./worker.schema";

export const SoldeAmountSchema = z.object({
  amount: z.coerce.number(),
  payment: z.coerce.number(),
  rest: z.coerce.number(),
});

export const SoldeSchema = z.object({
  id: z.string(),
  amount: z.coerce.number(),
  description: z.string().nullable(),
  workerId: z.string(),
  Worker: WorkerSchema.optional(),

  createdAt: z.coerce.date(),
});

export const SoldesSchema = z.array(SoldeSchema);

export type SoldeType = z.infer<typeof SoldeSchema>;
