import { VocherItem } from "@/pages/Month";
import { AlertDialog } from "../alert-dialog";
import { VocherType } from "@/schemas/vocher.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteVocher } from "@/api/vocher";
import { useToast } from "@/components/ui/use-toast";
import { queries } from "@/utils/queryKeys";
import { HTTPError } from "ky";

export const DeleteVocherAlert = ({
  open,
  setOpen,
  vocher,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  vocher: VocherType;
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mutationDeleteVocher = useMutation({
    mutationFn: deleteVocher,
    onSuccess: () => {
      queryClient.invalidateQueries([queries.vocherPerMonth]);
      queryClient.invalidateQueries([queries.yearsWorker]);
      setOpen(false);
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
  return (
    <AlertDialog
      open={open}
      onAccept={() => mutationDeleteVocher.mutate(vocher.id)}
      onRefusal={() => setOpen(false)}
      title="ALERTE: Suppression d'un bon"
      description="Vous êtes sur le point de supprimer le bon suivant:"
      isLoading={mutationDeleteVocher.isLoading}
    >
      <VocherItem vocher={vocher} hideActions />
    </AlertDialog>
  );
};
