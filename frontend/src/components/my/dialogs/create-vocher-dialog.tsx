import { getVocherTypes } from "@/api/vocher";
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
import { VocherFormSchema } from "@/schemas/form.schema";
import { WorkerSchema } from "@/schemas/worker.schema";
import { queries } from "@/utils/queryKeys";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Settings, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { DatePicker } from "../date-picker";
import { VocherTypesSettingsDialog } from "./vocher-types-settings-dialog";

type CreateVocherDialogProps = {
  isLoadind?: boolean;
  onSubmit: (vocher: z.infer<typeof VocherFormSchema>) => void;
  open: boolean;
  onOpenChange: (visibility: boolean) => void;
  worker: z.infer<typeof WorkerSchema>;
};

export function CreateVocherDialog({
  isLoadind,
  onSubmit,
  open,
  onOpenChange,
  worker,
}: CreateVocherDialogProps) {
  const [vocherTypesDialogVisibility, setVocherTypesDialogVisibility] =
    useState(false);
  const form = useForm<z.infer<typeof VocherFormSchema>>({
    resolver: zodResolver(VocherFormSchema),
    defaultValues: {
      date: new Date(),
      quantity: 0,
      remuneration: 0,
      workerId: "",
      typeId: undefined,
    },
  });

  useEffect(() => {
    form.reset();
    form.setValue("workerId", worker.id);
    console.log("useEffect");
  }, [form, open, worker.id]);

  const {
    data: vocherTypes,
    isLoading: isLoadindVocherTypes,
    isError: isErrorVocherTypes,
  } = useQuery({
    queryKey: [queries.vocherTypes],
    queryFn: getVocherTypes,
  });

  const updateRemuneration = (typeId: string) => {
    const oldRemunerationIsAuto =
      vocherTypes?.find((v) => v.id == form.getValues("typeId"))
        ?.remuneration === form.getValues("remuneration");

    const remuneration = vocherTypes?.find((v) => v.id == typeId)?.remuneration;
    if (
      remuneration &&
      (!form.getValues("remuneration") || oldRemunerationIsAuto)
    )
      form.setValue("remuneration", remuneration);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle mission</DialogTitle>
              <DialogDescription>
                Entrez ici les informations de la missions. Cliquez sur créer
                une fois terminé.
              </DialogDescription>
            </DialogHeader>

            {/* Worker profil */}
            <div className="flex gap-3 items-center bg-slate-100 rounded-lg p-3">
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
            </div>

            {/* Number of vocher */}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field, fieldState }) => (
                <FormItem className="grid grid-cols-4 items-center gap-x-4">
                  <FormLabel className="text-right">Nombre de bon</FormLabel>
                  <FormControl className="col-span-3">
                    <Input
                      min={0}
                      type="number"
                      placeholder="Nombre de bon"
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

            {/* Type of vocher */}
            <FormField
              control={form.control}
              name="typeId"
              render={({ field, fieldState }) => (
                <FormItem className="grid grid-cols-4 items-center gap-x-4 w-full">
                  <FormLabel className="text-right">Type de bon</FormLabel>
                  <div className="col-span-3 flex gap-2">
                    <Select
                      key={field.value}
                      onValueChange={(typeId) => {
                        updateRemuneration(typeId);
                        field.onChange(typeId);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl className="flex-1">
                        <SelectTrigger>
                          <SelectValue placeholder="Selectionner le type de bon" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadindVocherTypes ? (
                          <div className="text-sm py-3 flex justify-center items-center">
                            <Loader2
                              strokeWidth={3}
                              className="mr-2 h-4 w-4 animate-spin"
                            />
                            Récupération des types
                          </div>
                        ) : isErrorVocherTypes ? (
                          <div className="text-sm py-3 flex justify-center items-center text-destructive font-bold">
                            <X strokeWidth={4} className="mr-2 h-4 w-4" />
                            Error lors de la récupération des donnée!
                          </div>
                        ) : (
                          vocherTypes.map((type) => (
                            <SelectItem
                              className="capitalize"
                              key={type.id}
                              value={type.id}
                            >
                              {type.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={() => setVocherTypesDialogVisibility(true)}
                      type="button"
                      size="icon"
                      variant="outline"
                    >
                      <Settings />
                    </Button>
                  </div>
                  {fieldState.invalid && (
                    <FormMessage className="col-span-3 col-start-2" />
                  )}
                </FormItem>
              )}
            />

            {/* Rémunération */}
            <FormField
              control={form.control}
              name="remuneration"
              render={({ field, fieldState }) => (
                <FormItem className="grid grid-cols-4 items-center gap-x-4">
                  <FormLabel className="text-right">Rémunération</FormLabel>
                  <FormControl className="col-span-3">
                    <Input
                      min={0}
                      type="number"
                      placeholder="Rémunération pour chaque bon"
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

            {/* Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field, fieldState }) => (
                <FormItem className="grid grid-cols-4 items-center gap-x-4">
                  <FormLabel className="text-right">Date des bons</FormLabel>
                  <DatePicker
                    className="col-span-3"
                    date={field.value}
                    setDate={field.onChange}
                  />
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
                Ajouter la mission
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
      <VocherTypesSettingsDialog
        types={vocherTypes}
        onOpenChange={setVocherTypesDialogVisibility}
        open={vocherTypesDialogVisibility}
      />
    </Dialog>
  );
}
