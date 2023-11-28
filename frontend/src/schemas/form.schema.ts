import { phonenumberRegex } from "@/utils/regex";
import * as z from "zod";

export const LoginFormSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Le nom d'utilisateur ne peux pas être vide." }),
  password: z
    .string()
    .min(1, { message: "Le mot de passe ne peux pas être vide." }),
});

export const WorkerFormSchema = z.object({
  firstname: z
    .string()
    .min(1, { message: "Le nom du travailleur ne peux pas être vide." }),
  lastname: z
    .string()
    .min(1, { message: "Le prénom du travailleur ne peux pas être vide." }),
  matricule: z.string().min(1, {
    message: "La matricule du travailleur ne peux pas être vide.",
  }),

  phonenumber: z
    .string()
    .regex(phonenumberRegex, { message: "Numéro de téléphone mal formé" })
    .optional(),
  address: z.string().optional(),
  birthdate: z.coerce.date().optional(),
  email: z
    .string()
    .email({ message: "Le format de l'email est incorrect" })
    .optional(),
});

export const VocherFormSchema = z.object({
  remuneration: z.coerce
    .number()
    .min(10, "La rémunération du bon ne peut pas être inferieur à 10 DA."),
  quantity: z.coerce.number().min(1, "Le nombre de bon ne peut pas être zéro."),
  description: z
    .string()
    .max(140, "La description est limité à 140 caractères")
    .nullable(),
  workerId: z.string().optional(),
  typeId: z.string(),
  date: z.date(),
});

export const PaymentForMonthSchema = z.object({
  amount: z.coerce
    .number()
    .min(10, "La somme du versement doit être superieur à 10 DA"),
  type: z.enum(["CASH", "GOODS"]),
  description: z
    .string()
    .max(140, "La description est limité à 140 caractères")
    .nullable(),
  workerId: z.string(),
  month: z.coerce.date(),
});

export const PaymentOutOfVocherFormSchema = z.object({
  amount: z.coerce.number(),
  type: z.enum(["CASH", "GOODS"]),
  description: z.string().optional(),
  workerId: z.string().min(1, { message: "Erreur de selection d'employé" }),
});

export const VocherTypeFormSchema = z.object({
  name: z.string().min(2, "Au minimum 2 caractéres"),
  remuneration: z.coerce
    .number()
    .min(10, "La rémunération du bon ne peut pas être inferieur à 10 DA."),
});

export const SoldeFormSchema = z.object({
  amount: z.coerce
    .number()
    .min(1, { message: "Le mountant ne peut pas être inferieur à 1 DA" }),
  description: z.string().optional(),
  workerId: z.string().min(1, { message: "Employé requis" }),
});
