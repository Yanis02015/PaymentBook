import { createVocherTypes, deleteVocherTypes } from "@/api/vocher";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { VocherTypeFormSchema } from "@/schemas/form.schema";
import { VocherTypesSchema } from "@/schemas/vocher.schema";
import { formatPayment } from "@/utils/functions";
import { queries } from "@/utils/queryKeys";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { Loader2, Pen, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AlertDialog } from "./alert-dialog";
import { useEffect, useState } from "react";

export const VocherTypesSettingsDialog = ({
  open,
  onOpenChange,
  types,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  types: z.infer<typeof VocherTypesSchema> | undefined;
}) => {
  const { toast } = useToast();
  const [selectedTypeToDelete, setSelectedTypeToDelete] = useState("");
  const [confirmeDeletingTypeVisibility, setConfirmeDeletingTypeVisibility] =
    useState(false);
  const form = useForm<z.infer<typeof VocherTypeFormSchema>>({
    resolver: zodResolver(VocherTypeFormSchema),
    defaultValues: {
      name: "",
      remuneration: 0,
    },
  });
  const onSubmit = (vocherType: z.infer<typeof VocherTypeFormSchema>) => {
    mutationCreateVocherType.mutate(vocherType);
  };

  const deleteType = (id: string) => {
    setSelectedTypeToDelete(id);
    setConfirmeDeletingTypeVisibility(true);
  };

  const queryClient = useQueryClient();

  const mutationCreateVocherType = useMutation({
    mutationFn: createVocherTypes,
    onSuccess: () => {
      queryClient.invalidateQueries([queries.vocherTypes]);
      onOpenChange(false);
    },
    onError: (error: HTTPError) => {
      console.log(error);
      toast({
        title: "Le type n'a pas pu être crée!",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const mutationDeleteVocherType = useMutation({
    mutationFn: deleteVocherTypes,
    onSuccess: () => {
      queryClient.invalidateQueries([queries.vocherTypes]);
      setConfirmeDeletingTypeVisibility(false);
    },
    onError: (error: HTTPError) => {
      console.log(error);
      toast({
        title: "Le type n'a pas pu être crée!",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  useEffect(() => {
    form.reset();
  }, [form, open]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <DialogHeader>
              <DialogTitle>Catalogue des types de bon</DialogTitle>
              <DialogDescription>
                Configurez ici les type de bon possible.
              </DialogDescription>
            </DialogHeader>

            {/* New vocher type */}
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormItem className="grid grid-cols-4 items-center gap-x-4">
                  <FormLabel className="text-right">Nom du type</FormLabel>
                  <FormControl className="col-span-3">
                    <Input
                      type="text"
                      placeholder="Nom du type de bon"
                      {...field}
                    />
                  </FormControl>
                  {fieldState.invalid && (
                    <FormMessage className="col-span-3 col-start-2" />
                  )}
                </FormItem>
              )}
            />

            {/* New vocher remuneration */}
            <FormField
              control={form.control}
              name="remuneration"
              render={({ field, fieldState }) => (
                <FormItem className="grid grid-cols-4 items-center gap-x-4">
                  <FormLabel className="text-right">Rémunération</FormLabel>
                  <FormControl className="col-span-3">
                    <Input
                      type="number"
                      placeholder="Rémunération de ce type de bon"
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

            {/* Actions buttons */}
            <DialogFooter>
              <Button
                size="sm"
                disabled={mutationCreateVocherType.isLoading}
                type="submit"
              >
                {mutationCreateVocherType.isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Créer un nouveau type
              </Button>
            </DialogFooter>

            <Separator orientation="horizontal" />
            <DialogDescription>Liste des types de bons</DialogDescription>

            <ScrollArea className="max-h-[400px]">
              <div className="space-y-2">
                {types
                  ? types.map((t) => (
                      <div
                        key={t.id}
                        className="flex justify-between bg-muted p-2 rounded-lg"
                      >
                        <div className="font-bold grid grid-cols-12 flex-1 gap-2">
                          <span className="text-sm col-span-4">{t.name}</span>
                          <span className="text-green-500  col-span-8">
                            {formatPayment(t.remuneration)}
                          </span>
                        </div>
                        <div>
                          <Button
                            type="button"
                            variant="ghost"
                            className="hover:bg-transparent w-auto h-auto p-1 hover:text-green-500"
                            size="icon"
                            disabled
                          >
                            <Pen size={16} />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            className="hover:bg-transparent w-auto h-auto p-1 hover:text-destructive"
                            size="icon"
                            onClick={() => deleteType(t.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    ))
                  : "Chargement"}
              </div>
            </ScrollArea>
          </form>
        </Form>
      </DialogContent>
      <AlertDialog
        title="Êtes vous sûr?"
        description={
          <>
            Vous être sur le point de supprimer le type{" "}
            <strong className="text-destructive">
              {types?.find((t) => t.id == selectedTypeToDelete)?.name}
            </strong>
            , cliquer sur valider pour confirmer.
          </>
        }
        open={confirmeDeletingTypeVisibility}
        onAccept={() => mutationDeleteVocherType.mutate(selectedTypeToDelete)}
        onRefusal={() => setConfirmeDeletingTypeVisibility(false)}
        isLoading={mutationDeleteVocherType.isLoading}
      />
    </Dialog>
  );
};
