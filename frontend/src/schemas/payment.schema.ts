import { paymentType } from "@/utils/enum";
import { z } from "zod";

export const PaymentSchema = z.object({
  id: z.string(),
  amount: z.coerce.number(),
  type: z.enum(paymentType),
  description: z.string().nullable(),
  workerId: z.string(),
  month: z.coerce.date(),
  createdAt: z.coerce.date(),
});

export const PaymentsSchema = z.array(PaymentSchema);

export type PaymentType = z.infer<typeof PaymentSchema>;
