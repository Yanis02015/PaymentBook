import * as z from "zod";

export const LoginFormSchema = z.object({
  username: z
    .string()
    .nonempty({ message: "Le nom d'utilisateur ne peux pas être vide." }),
  password: z
    .string()
    .nonempty({ message: "Le mot de passe ne peux pas être vide." }),
});
