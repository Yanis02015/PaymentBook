import { createSolde } from "@/api/solde";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { WorkerMiniProfil } from "@/components/utils/worker-mini-profil";
import { SoldeFormSchema } from "@/schemas/form.schema";
import { WorkerType } from "@/schemas/worker.schema";
import { formatPayment } from "@/utils/functions";
import { queries } from "@/utils/queryKeys";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { Loader2 } from "lucide-react";
import { PropsWithChildren, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const CreateSoldeDialog = ({
  worker,
  children,
  className,
}: PropsWithChildren<{ worker: WorkerType; className?: string }>) => {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof SoldeFormSchema>>({
    resolver: zodResolver(SoldeFormSchema),
    defaultValues: {
      amount: 0,
      description: "",
      workerId: worker.id,
    },
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mutationCreateSolde = useMutation({
    mutationFn: createSolde,
    onSuccess: (_, data) => {
      queryClient.invalidateQueries([queries.soldes, data.workerId]);
      queryClient.invalidateQueries([
        queries.soldes,
        queries.soldeAmount,
        data.workerId,
      ]);
      onOpenChange(false);
      toast({
        title: "Solde ajouté avec succès",
        description: `Le solde de ${formatPayment(
          data.amount
        )} est ajouté avec succès à l'employé ${worker.fullname}`,
      });
    },
    onError: (error: HTTPError) => {
      console.log(error);
      toast({
        title: "Oh oh, ajout de solde échoués",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof SoldeFormSchema>) => {
    mutationCreateSolde.mutate(values);
  };
  const onOpenChange = (visibility: boolean) => {
    form.reset({
      amount: 0,
      description: "",
      workerId: worker.id,
    });
    setOpen(visibility);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger className={className}>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ajouter du solde à l'employé</DialogTitle>
          <DialogDescription>
            Ci-dessous le formulaire d'ajout de solde sans bon
          </DialogDescription>
        </DialogHeader>

        {/* Worker profil */}
        <WorkerMiniProfil worker={worker} />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="amount"
              render={({ field, fieldState }) => (
                <FormItem className="grid grid-cols-4 items-center gap-x-4">
                  <FormLabel className="text-right">Somme à ajouter</FormLabel>
                  <FormControl className="col-span-3">
                    <Input
                      min={0}
                      type="number"
                      placeholder="Somme à ajouter au solde"
                      {...field}
                      onChange={(e) => {
                        e.target.value =
                          e.target.value.charAt(0) == "0" &&
                          e.target.value.length > 1
                            ? e.target.value.slice(1)
                            : e.target.value;
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  {fieldState.invalid && (
                    <FormMessage className="col-span-3 col-start-2" />
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <FormItem className="grid grid-cols-4 items-center gap-x-4">
                  <FormLabel className="text-right">Description</FormLabel>
                  <FormControl className="col-span-3">
                    <Textarea placeholder="Description" {...field} />
                  </FormControl>
                  {fieldState.invalid && (
                    <FormMessage className="col-span-3 col-start-2" />
                  )}
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 pt-3">
              <DialogClose className={buttonVariants({ variant: "outline" })}>
                Fermer
              </DialogClose>
              <Button disabled={mutationCreateSolde.isLoading}>
                {mutationCreateSolde.isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Valider l'ajout du solde
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
