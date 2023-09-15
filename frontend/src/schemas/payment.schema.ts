import { z } from "zod";

export const PaymentSchema = z.object({
  id: z.string(),
  amount: z.coerce.number(),
  type: z.enum(["CASH", "GOODS"]),
  description: z.string().nullable(),
  workerId: z.string(),
  month: z.coerce.date(),
  createdAt: z.coerce.date(),
});

export const PaymentsSchema = z.array(PaymentSchema);
