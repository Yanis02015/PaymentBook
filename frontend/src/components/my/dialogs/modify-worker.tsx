import { modifyWorker } from "@/api/worker";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { WorkerFormSchema } from "@/schemas/form.schema";
import { WorkerType } from "@/schemas/worker.schema";
import {
  destructuringMatricule,
  generateMatricule,
  getFormatedDate,
} from "@/utils/functions";
import { queries } from "@/utils/queryKeys";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { CalendarIcon, Loader2 } from "lucide-react";
import { PropsWithChildren, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const ModifyWorkerDialog = ({
  children,
  worker,
  className,
}: PropsWithChildren<{ worker: WorkerType; className?: string }>) => {
  const [open, setOpen] = useState(false);

  const matriculeStructured = destructuringMatricule(worker.matricule);
  const form = useForm<z.infer<typeof WorkerFormSchema>>({
    resolver: zodResolver(WorkerFormSchema),
    defaultValues: {
      address: worker.address || undefined,
      birthdate: worker.birthdate || undefined,
      email: worker.email || undefined,
      firstname: worker.firstname,
      lastname: worker.lastname,
      matriculeId: matriculeStructured?.matriculeID || "",
      matriculeYear: matriculeStructured?.matriculeYear || "",
      matriculeWilaya: matriculeStructured?.matriculeWilaya || "",
      phonenumber: worker.phonenumber || undefined,
    },
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mutationUpdateWorker = useMutation({
    mutationFn: modifyWorker,
    onSuccess: () => {
      queryClient.invalidateQueries([queries.workers, worker.id]);
      onOpenChange(false);
    },
    onError: (error: HTTPError) => {
      console.log(error);
      toast({
        title: "Oh oh, modifications échoués",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof WorkerFormSchema>) => {
    mutationUpdateWorker.mutate({ worker: values, workerId: worker.id });
  };
  const { firstname, lastname, address, birthdate, email, phonenumber } =
    form.watch();
  const matricule = generateMatricule(form.watch());

  const hasNoChange = useMemo(() => {
    if (
      worker.matricule == matricule &&
      worker.firstname == firstname &&
      worker.lastname == lastname &&
      worker.address == address &&
      worker.birthdate == birthdate &&
      worker.phonenumber == phonenumber &&
      worker.email == email
    )
      return true;
    return false;
  }, [
    address,
    birthdate,
    email,
    firstname,
    lastname,
    matricule,
    phonenumber,
    worker.address,
    worker.birthdate,
    worker.email,
    worker.firstname,
    worker.lastname,
    worker.matricule,
    worker.phonenumber,
  ]);

  const onOpenChange = (visibility: boolean) => {
    form.reset({
      address: worker.address || undefined,
      birthdate: worker.birthdate || undefined,
      email: worker.email || undefined,
      firstname: worker.firstname,
      lastname: worker.lastname,
      matriculeId: matriculeStructured?.matriculeID || "",
      matriculeYear: matriculeStructured?.matriculeYear || "",
      matriculeWilaya: matriculeStructured?.matriculeWilaya || "",
      phonenumber: worker.phonenumber || undefined,
    });
    setOpen(visibility);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "hover:text-green-400 rounded-full p-2 h-auto w-auto",
          className
        )}
      >
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Modifier le profil de l'employé</DialogTitle>
          <DialogDescription>
            Veuillez saisir les nouvelle information de l'employé
          </DialogDescription>
        </DialogHeader>

        {/* Form here */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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

            <FormField
              control={form.control}
              name="birthdate"
              render={({ field, fieldState }) => (
                <FormItem className="grid grid-cols-4 items-center gap-x-4">
                  <FormLabel className="text-right">
                    Date de naissance
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "col-span-3 pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            getFormatedDate(field.value).fullDate
                          ) : (
                            <span>Selectionne une date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {fieldState.invalid && (
                    <FormMessage className="col-span-3 col-start-2" />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phonenumber"
              render={({ field, fieldState }) => (
                <FormItem className="grid grid-cols-4 items-center gap-x-4">
                  <FormLabel className="text-right">
                    Numéro de téléphone
                  </FormLabel>
                  <FormControl className="col-span-3">
                    <Input
                      type="tel"
                      placeholder="Numéro de téléphone"
                      {...field}
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
              name="email"
              render={({ field, fieldState }) => (
                <FormItem className="grid grid-cols-4 items-center gap-x-4">
                  <FormLabel className="text-right">Email</FormLabel>
                  <FormControl className="col-span-3">
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  {fieldState.invalid && (
                    <FormMessage className="col-span-3 col-start-2" />
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field, fieldState }) => (
                <FormItem className="grid grid-cols-4 items-center gap-x-4">
                  <FormLabel className="text-right">Adresse</FormLabel>
                  <FormControl className="col-span-3">
                    <Textarea placeholder="Adresse" {...field} />
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

            <DialogFooter className="gap-2 pt-3">
              <DialogClose className={buttonVariants({ variant: "outline" })}>
                Fermer
              </DialogClose>
              <Button disabled={hasNoChange || mutationUpdateWorker.isLoading}>
                {mutationUpdateWorker.isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {hasNoChange
                  ? "Aucune modification faite"
                  : "Valider les modifications"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
