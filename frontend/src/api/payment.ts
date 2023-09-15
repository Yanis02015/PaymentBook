import { PaymentForMonthSchema } from "@/schemas/form.schema";
import { z } from "zod";
import { MakeRequest } from "./config";

export const createPayment = async (
  payment: z.infer<typeof PaymentForMonthSchema>
) => await MakeRequest.post("payments", { json: payment }).json();
