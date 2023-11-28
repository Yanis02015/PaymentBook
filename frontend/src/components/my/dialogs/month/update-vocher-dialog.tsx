import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
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
import { VocherFormSchema } from "@/schemas/form.schema";
import { VocherType } from "@/schemas/vocher.schema";
import { handleChangeNumberInput } from "@/utils/functions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DatePicker } from "../../date-picker";
import { queries } from "@/utils/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getVocherTypes, modifyVocher } from "@/api/vocher";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { HTTPError } from "ky";
import { VocherItem } from "@/pages/Month";
import { Textarea } from "@/components/ui/textarea";

export const UpdateVocherDialog = ({
  vocher,
  open,
  setOpen,
}: {
  vocher: VocherType;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const form = useForm<z.infer<typeof VocherFormSchema>>({
    resolver: zodResolver(VocherFormSchema),
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mutationModifyVocher = useMutation({
    mutationFn: modifyVocher,
    onSuccess: () => {
      queryClient.invalidateQueries([queries.vocherPerMonth]);
      onOpenChange(false);
      toast({
        title: "Mission crée avec succès!",
        description: `La mission a été modifiè avec succès.`,
      });
    },
    onError: (error: HTTPError) => {
      console.log(error);
      toast({
        title: "Oh oh, erreur lors de la création du bon",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof VocherFormSchema>) =>
    mutationModifyVocher.mutate({ vocher: values, vocherId: vocher.id });

  const onOpenChange = (visibility: boolean) => {
    setOpen(visibility);
  };

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

  useEffect(() => {
    form.reset({
      quantity: vocher.quantity,
      remuneration: vocher.remuneration,
      typeId: vocher.typeId,
      date: vocher.date,
      description: vocher.description || "",
    });
  }, [
    form,
    vocher.date,
    vocher.description,
    vocher.quantity,
    vocher.remuneration,
    vocher.typeId,
  ]);
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Modifier un bon</DialogTitle>
          <DialogDescription>
            Ci-dessous le formulaire pour la modification d'un bon déjà existant
          </DialogDescription>
        </DialogHeader>

        <VocherItem vocher={vocher} hideActions />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        handleChangeNumberInput(e, field.onChange);
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
                        handleChangeNumberInput(e, field.onChange);
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
              <Button
                type="button"
                onClick={() => onOpenChange(false)}
                variant="outline"
              >
                Annuler les modification
              </Button>
              <Button
                disabled={mutationModifyVocher.isLoading}
                type="submit"
                variant="destructive"
              >
                {mutationModifyVocher.isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Valider les modifications
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
