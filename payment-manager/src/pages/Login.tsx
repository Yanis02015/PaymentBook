import { login } from "@/api/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginFormSchema } from "@/schemas/form.schema";
import { PATHS } from "@/utils/paths";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

export default function Login() {
  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  const submitMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate(PATHS.DASHBOARD);
    },
  });

  // 2. Define a submit handler.
  function submit(values: z.infer<typeof LoginFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    submitMutation.mutate(values);
    console.log(values);
  }

  return (
    <div className="sm:container px-3 flex justify-center pt-20">
      <div className="sm:w-96 w-full p-8 rounded-lg bg-white shadow">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                Se connecter
              </h1>
              <p className="text-sm text-muted-foreground">
                Entrez vos informations d'authentification
              </p>
            </div>
            <FormField
              control={form.control}
              disabled={submitMutation.isLoading}
              name="username"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Nom d'utilisateur</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  {fieldState.invalid && <FormMessage />}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              disabled={submitMutation.isLoading}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  {fieldState.invalid && <FormMessage />}
                </FormItem>
              )}
            />
            <Button disabled={submitMutation.isLoading} type="submit">
              {submitMutation.isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Se connecter
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
