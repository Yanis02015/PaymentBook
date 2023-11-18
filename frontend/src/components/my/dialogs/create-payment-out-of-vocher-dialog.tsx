import { createPaymentOutOfVocher } from "@/api/payment";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { WorkerMiniProfil } from "@/components/utils/worker-mini-profil";
import { PaymentOutOfVocherFormSchema } from "@/schemas/form.schema";
import { WorkerType } from "@/schemas/worker.schema";
import { paymentType } from "@/utils/enum";
import { formatPayment } from "@/utils/functions";
import { queries } from "@/utils/queryKeys";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { AlertCircle, Loader2 } from "lucide-react";
import { PropsWithChildren, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const CreatePaymentOutOfVocherDialog = ({
  worker,
  children,
  className,
  rest,
}: PropsWithChildren<{
  worker: WorkerType;
  className?: string;
  rest: number;
}>) => {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof PaymentOutOfVocherFormSchema>>({
    resolver: zodResolver(PaymentOutOfVocherFormSchema),
    reValidateMode: "onBlur",
    defaultValues: {
      amount: 0,
      type: "CASH",
      description: "",
      workerId: worker.id,
    },
  });

  const onSubmit = (values: z.infer<typeof PaymentOutOfVocherFormSchema>) => {
    mutationCreateSolde.mutate(values);
  };

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mutationCreateSolde = useMutation({
    mutationFn: createPaymentOutOfVocher,
    onSuccess: (_, data) => {
      queryClient.invalidateQueries([queries.soldes, data.workerId]);
      queryClient.invalidateQueries([
        queries.soldes,
        queries.soldeAmount,
        data.workerId,
      ]);
      onOpenChange(false);
      toast({
        title: "Versement ajouté avec succès",
        description: `Le nouveau versement de ${formatPayment(
          data.amount
        )} est ajouté avec succès à l'employé ${worker.fullname}`,
      });
    },
    onError: (error: HTTPError) => {
      console.log(error);
      toast({
        title: "Oh oh, versement échoués",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const watch = form.watch();
  useEffect(() => {
    form.clearErrors("amount");
    if (watch.amount > rest) {
      form.setError("amount", {
        message: `Vous ne pouvez pas verser une somme plus grande que ${formatPayment(
          rest
        )}`,
        type: "maxLength",
      });
    }
  }, [form, rest, watch.amount]);

  const verifyBeforeSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form.getValues("amount") > rest) return;
    form.handleSubmit(onSubmit)(event);
  };

  const onOpenChange = (visibility: boolean) => {
    setOpen(visibility);
    form.reset({
      amount: 0,
      description: "",
      type: "CASH",
      workerId: worker.id,
    });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger className={className}>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Faire un versement hors bon</DialogTitle>
          <DialogDescription>
            Entrez ici les informations du versement hors bon et cliquer sur
            valider.
          </DialogDescription>
        </DialogHeader>

        <WorkerMiniProfil worker={worker} />

        <Form {...form}>
          <form onSubmit={verifyBeforeSubmit} className="space-y-3">
            {form.getFieldState("amount").error?.type == "maxLength" && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Alert dépassement!</AlertTitle>
                <AlertDescription>
                  La somme à versé est très elevé, le maximum que vous puissiez
                  verser est {formatPayment(rest)}.
                  <Button
                    type="button"
                    onClick={() => form.setValue("amount", rest)}
                    variant="link"
                    className="px-1.5 py-0 h-min"
                  >
                    Utiliser cet somme.
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="amount"
              render={({ field, fieldState }) => (
                <FormItem className="grid grid-cols-4 items-center gap-x-4">
                  <FormLabel className="text-right">Somme à verser</FormLabel>
                  <FormControl className="col-span-3">
                    <Input
                      min={0}
                      type="number"
                      placeholder="Somme d'argent à verser"
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
              name="type"
              render={({ field, fieldState }) => (
                <FormItem className="grid grid-cols-4 items-center gap-x-4 w-full">
                  <FormLabel className="text-right">Type</FormLabel>
                  <Select
                    key={field.value}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="col-span-3">
                      <SelectTrigger>
                        <SelectValue placeholder="Selectionner le type de versement" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentType.map((type) => (
                        <SelectItem
                          className="capitalize"
                          key={type}
                          value={type}
                        >
                          {type == "CASH" ? "Liquide" : "Biens matériel"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <FormLabel className="text-right">
                    Description du versement
                  </FormLabel>
                  <FormControl className="col-span-3">
                    <Textarea
                      placeholder="Description du versement"
                      {...field}
                    />
                  </FormControl>
                  {fieldState.invalid && (
                    <FormMessage className="col-span-3 col-start-2" />
                  )}
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose
                type="button"
                className={buttonVariants({ variant: "outline" })}
              >
                Fermer
              </DialogClose>
              <Button disabled={mutationCreateSolde.isLoading} type="submit">
                {mutationCreateSolde.isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Valider
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
