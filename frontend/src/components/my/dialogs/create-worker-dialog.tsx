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
import { cn } from "@/lib/utils";
import { WorkerFormSchema } from "@/schemas/form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type CreateWorkerDialogProps = {
  isLoadind?: boolean;
  onSubmit: (worker: z.infer<typeof WorkerFormSchema>) => void;
  open: boolean;
  onOpenChange: (visibility: boolean) => void;
};

export function CreateWorkerDialog({
  isLoadind,
  onSubmit,
  open,
  onOpenChange,
}: CreateWorkerDialogProps) {
  const form = useForm<z.infer<typeof WorkerFormSchema>>({
    resolver: zodResolver(WorkerFormSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      matriculeId: "",
      matriculeYear: "",
      matriculeWilaya: "",
    },
  });

  useEffect(() => {
    form.reset();
  }, [form, open]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <DialogHeader>
              <DialogTitle>Créer un travailleur</DialogTitle>
              <DialogDescription>
                Entrez ici les informations sur le travailleur. Cliquez sur
                créer lorsque vous avez terminé.
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="firstname"
              render={({ field, fieldState }) => (
                <FormItem className="grid grid-cols-4 items-center gap-x-4">
                  <FormLabel className="text-right">Nom</FormLabel>
                  <FormControl className="col-span-3">
                    <Input placeholder="Nom" {...field} />
                  </FormControl>
                  {fieldState.invalid && (
                    <FormMessage className="col-span-3 col-start-2" />
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastname"
              render={({ field, fieldState }) => (
                <FormItem className="grid grid-cols-4 items-center gap-x-4">
                  <FormLabel className="text-right">Prénom</FormLabel>
                  <FormControl className="col-span-3">
                    <Input placeholder="Prénom" {...field} />
                  </FormControl>
                  {fieldState.invalid && (
                    <FormMessage className="col-span-3 col-start-2" />
                  )}
                </FormItem>
              )}
            />
            <div className="grid grid-cols-4 items-center gap-x-4">
              <FormLabel
                htmlFor="matriculeId"
                className={cn(
                  "text-right",
                  (form.formState.errors.matriculeId?.message ||
                    form.formState.errors.matriculeYear?.message ||
                    form.formState.errors.matriculeWilaya?.message) &&
                    "text-destructive"
                )}
              >
                Matricule
              </FormLabel>
              <div className="grid grid-cols-12 items-center col-span-3 gap-2">
                <FormField
                  control={form.control}
                  name="matriculeId"
                  render={({ field }) => (
                    <FormItem className="col-span-5">
                      <FormControl className="">
                        <Input id="matriculeId" placeholder="ID" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="matriculeYear"
                  render={({ field }) => (
                    <FormItem className="col-span-4">
                      <FormControl className="">
                        <Input placeholder="Année" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="matriculeWilaya"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormControl className="">
                        <Input placeholder="06" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormMessage className="col-span-3 col-start-2 mt-1">
                {form.formState.errors.matriculeId?.message ||
                  form.formState.errors.matriculeYear?.message ||
                  form.formState.errors.matriculeWilaya?.message}
              </FormMessage>
            </div>
            <DialogFooter>
              <Button disabled={isLoadind} type="submit">
                {isLoadind && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Créer un travailleur
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
