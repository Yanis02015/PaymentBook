import { SoldeAmountSchema, SoldeSchema } from "@/schemas/solde.schema";
import { MakeRequest } from "./config";
import { SoldeFormSchema } from "@/schemas/form.schema";
import { z } from "zod";

export const getWorkerSoldes = async (workerId: string) =>
  await MakeRequest(`soldes/${workerId}`).json().then(SoldeSchema.parse);

export const getWorkerSoldeAmount = async (workerId: string) =>
  await MakeRequest(`soldes/amount/${workerId}`)
    .json()
    .then(SoldeAmountSchema.parse);

export const createSolde = async (solde: z.infer<typeof SoldeFormSchema>) =>
  await MakeRequest.post("soldes", { json: solde }).json();
