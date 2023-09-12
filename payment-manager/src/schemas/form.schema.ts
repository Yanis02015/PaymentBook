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
