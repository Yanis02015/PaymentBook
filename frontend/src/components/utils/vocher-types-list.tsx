import { VocherTypeType } from "@/schemas/vocher.schema";
import { formatPayment } from "@/utils/functions";
import { Button } from "../ui/button";
import { Check, Loader2, Pen, Trash2, X } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { VocherTypeFormSchema } from "@/schemas/form.schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { modifyVocherType } from "@/api/vocher";
import { HTTPError } from "ky";
import { useToast } from "../ui/use-toast";
import { queries } from "@/utils/queryKeys";

export const VocherTypesList = ({
  types,
  deleteType,
}: {
  types?: VocherTypeType[];
  deleteType: (typeId: string) => void;
}) => {
  return (
    <div className="space-y-2">
      {types
        ? types.map((type) => (
            <Row key={type.id} type={type} deleteType={deleteType} />
          ))
        : "Chargement"}
    </div>
  );
};

const Row = ({
  deleteType,
  type,
}: {
  deleteType: (typeId: string) => void;
  type: VocherTypeType;
}) => {
  const [updating, setUpdating] = useState(false);
  const form = useForm<z.infer<typeof VocherTypeFormSchema>>({
    resolver: zodResolver(VocherTypeFormSchema),
    defaultValues: {
      name: type.name,
      remuneration: type.remuneration,
    },
  });

  const handleUpdate = (newUpdate: boolean) => {
    setUpdating(newUpdate);
    form.reset({
      name: type.name,
      remuneration: type.remuneration,
    });
  };

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mutationUpdateType = useMutation({
    mutationFn: modifyVocherType,
    onSuccess: () => {
      queryClient.invalidateQueries([queries.vocherTypes]);
      toast({
        title: "Opération effectué avec succès",
        description: "Votre type à bien étais modfier",
      });
      handleUpdate(false);
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

  const onSubmit = (vocherType: z.infer<typeof VocherTypeFormSchema>) => {
    mutationUpdateType.mutate({ vocherType, typeId: type.id });
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex justify-between bg-muted p-2 rounded-lg gap-3 items-center"
      >
        <div className="font-bold grid grid-cols-12 flex-1 gap-2">
          <div className="text-sm col-span-6">
            {updating ? (
              <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Rémunération de ce type de bon"
                        {...field}
                      />
                    </FormControl>
                    {fieldState.invalid && (
                      <FormMessage className="col-span-3 col-start-2" />
                    )}
                  </FormItem>
                )}
              />
            ) : (
              <p className="line-clamp-1">{type.name}</p>
            )}
          </div>
          <div className="col-span-6">
            {updating ? (
              <FormField
                control={form.control}
                name="remuneration"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
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
                    {fieldState.invalid && <FormMessage className="" />}
                  </FormItem>
                )}
              />
            ) : (
              <span className="text-green-500">
                {formatPayment(type.remuneration)}
              </span>
            )}
          </div>
        </div>
        {updating ? (
          <div>
            <Button
              type="button"
              id="validate"
              variant="ghost"
              className="hover:bg-transparent w-auto h-auto p-1 hover:text-green-500 text-green-500 hover:bg-green-500/20"
              size="icon"
              disabled={mutationUpdateType.isLoading}
              onClick={form.handleSubmit(onSubmit)}
            >
              {mutationUpdateType.isLoading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Check size={16} />
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="hover:bg-transparent w-auto h-auto p-1 hover:text-destructive text-destructive hover:bg-destructive/20"
              size="icon"
              disabled={mutationUpdateType.isLoading}
              onClick={() => handleUpdate(false)}
            >
              <X size={16} />
            </Button>
          </div>
        ) : (
          <div>
            <Button
              type="button"
              variant="ghost"
              className="hover:bg-transparent w-auto h-auto p-1 hover:text-green-500"
              size="icon"
              onClick={() => handleUpdate(true)}
            >
              <Pen size={16} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="hover:bg-transparent w-auto h-auto p-1 hover:text-destructive"
              size="icon"
              onClick={() => deleteType(type.id)}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};
