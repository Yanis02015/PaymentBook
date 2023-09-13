import { z } from "zod";

export const PaymentSchema = z.object({
  id: z.string(),
  amount: z.string(),
  type: z.enum(["CASH", "GOODS"]),
  description: z.string().nullable(),
  workerId: z.string(),
  date: z.string(),
  createdAt: z.string(),
});

export const PaymentsSchema = z.array(PaymentSchema);
