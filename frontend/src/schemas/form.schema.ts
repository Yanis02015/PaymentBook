import * as z from "zod";

export const LoginFormSchema = z.object({
  username: z
    .string()
    .nonempty({ message: "Le nom d'utilisateur ne peux pas être vide." }),
  password: z
    .string()
    .nonempty({ message: "Le mot de passe ne peux pas être vide." }),
});

export const WorkerFormSchema = z.object({
  firstname: z
    .string()
    .nonempty({ message: "Le nom du travailleur ne peux pas être vide." }),
  lastname: z
    .string()
    .nonempty({ message: "Le prénom du travailleur ne peux pas être vide." }),
  matricule: z.string().nonempty({
    message: "La matricule du travailleur ne peux pas être vide.",
  }),
});

export const VocherFormSchema = z.object({
  remuneration: z.coerce
    .number()
    .min(500, "La rémunération du bon ne peut pas être inferieur à 500 DA."),
  quantity: z.coerce.number().min(1, "Le nombre de bon ne peut pas être zéro."),
  workerId: z.string().optional(),
  typeId: z.string(),
  date: z.date(),
});

export const PaymentForMonthSchema = z.object({
  amount: z.coerce
    .number()
    .min(1000, "La somme du versement doit être superieur à 1 000 DA"),
  type: z.enum(["CASH", "GOODS"]),
  description: z
    .string()
    .max(140, "La description est limité à 140 caractères")
    .nullable(),
  workerId: z.string(),
  month: z.coerce.date(),
});
