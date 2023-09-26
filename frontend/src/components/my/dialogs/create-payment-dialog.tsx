import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { PaymentForMonthSchema } from "@/schemas/form.schema";
import { VochersPerMonthSchema } from "@/schemas/vocher.schema";
import { WorkerSchema } from "@/schemas/worker.schema";
import { paymentType } from "@/utils/enum";
import { formatPayment, getFormatedDate } from "@/utils/functions";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Textarea } from "../../ui/textarea";
import { PaymentPayRest } from "../payment-pay-rest";

type CreatePaymentForMonthDialogProps = {
  isLoadind?: boolean;
  onSubmit: (payment: z.infer<typeof PaymentForMonthSchema>) => void;
  open: boolean;
  onOpenChange: (visibility: boolean) => void;
  worker: z.infer<typeof WorkerSchema>;
  vocherPerMonth: z.infer<typeof VochersPerMonthSchema>;
};

export const CreatePaymentForMonthDialog = ({
  isLoadind,
  onSubmit,
  open,
  onOpenChange,
  worker,
  vocherPerMonth,
}: CreatePaymentForMonthDialogProps) => {
  const form = useForm<z.infer<typeof PaymentForMonthSchema>>({
    resolver: zodResolver(PaymentForMonthSchema),
    defaultValues: {
      amount: 0,
      description: "",
      month: vocherPerMonth.date,
      type: "CASH",
      workerId: worker.id,
    },
  });

  useEffect(() => {
    form.reset();
    form.setValue("workerId", worker.id);
    form.setValue("month", vocherPerMonth.date);
  }, [form, vocherPerMonth.date, open, worker.id]);

  useEffect(() => {
    form.clearErrors("amount");
    if (form.watch("amount") > vocherPerMonth.rest) {
      form.setError("amount", {
        message: `Vous ne pouvez pas verser une somme plus grande que ${formatPayment(
          vocherPerMonth.rest
        )}`,
        type: "maxLength",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, vocherPerMonth.rest, form.watch().amount]);
  const verifyBeforeSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form.getValues("amount") > vocherPerMonth.rest) return;
    form.handleSubmit(onSubmit)(event);
  };
  return (
    <Dialog modal open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px]">
        <Form {...form}>
          <form onSubmit={verifyBeforeSubmit} className="grid gap-4 py-4">
            <DialogHeader>
              <DialogTitle>
                Effectuer un verssement pour{" "}
                {getFormatedDate(vocherPerMonth.date).monthYear}
              </DialogTitle>
              <DialogDescription>
                Entrez ici les informations de la missions. Cliquez sur créer
                une fois terminé.
              </DialogDescription>
            </DialogHeader>

            {/* Worker profil */}
            <div className="flex flex-wrap gap-3 items-center bg-slate-100 rounded-lg p-3">
              <Avatar className="w-14 h-14">
                <AvatarImage src={worker.image} />
                <AvatarFallback>{worker.fullname.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{worker.fullname}</h3>
                <p className="text-muted-foreground text-xs">
                  {worker.matricule}
                </p>
              </div>
              <h3 className=" bg-green-400/70 text-white py-2 px-4 rounded-lg font-bold text-xl ml-auto capitalize">
                {getFormatedDate(vocherPerMonth.date).monthYear}
              </h3>
            </div>

            <PaymentPayRest
              pay={vocherPerMonth.pay}
              rest={vocherPerMonth.rest}
              total={vocherPerMonth.total}
              mini
            />

            <p>{form.getFieldState("amount").error?.type}</p>
            {/* Alert rest < pay */}
            {form.getFieldState("amount").error?.type == "maxLength" && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Alert dépassement!</AlertTitle>
                <AlertDescription>
                  La somme à versé est très elevé, le maximum que vous puissiez
                  verser est {formatPayment(vocherPerMonth.rest)}.
                  <Button
                    type="button"
                    onClick={() => form.setValue("amount", vocherPerMonth.rest)}
                    variant="link"
                    className="px-1.5 py-0 h-min"
                  >
                    Utiliser cet somme.
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Payment amount */}
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

            {/* Payment type */}
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

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <FormItem className="grid grid-cols-4 items-center gap-x-4">
                  <FormLabel className="text-right">Description</FormLabel>
                  <FormControl className="col-span-3">
                    <Textarea
                      placeholder="Description du verssement"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  {fieldState.invalid && (
                    <FormMessage className="col-span-3 col-start-2" />
                  )}
                </FormItem>
              )}
            />

            {/* Actions buttons */}
            <DialogFooter>
              <Button disabled={isLoadind} type="submit">
                {isLoadind && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Valider le versement
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
