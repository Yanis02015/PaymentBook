import {
  PaymentForMonthSchema,
  PaymentOutOfVocherFormSchema,
} from "@/schemas/form.schema";
import { z } from "zod";
import { MakeRequest } from "./config";

export const createPayment = async (
  payment: z.infer<typeof PaymentForMonthSchema>
) => await MakeRequest.post("payments", { json: payment }).json();

export const createPaymentOutOfVocher = async (
  payment: z.infer<typeof PaymentOutOfVocherFormSchema>
) => await MakeRequest.post("payments/out-of-vocher", { json: payment }).json();
