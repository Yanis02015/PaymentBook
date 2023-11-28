import { deletePayment } from "@/api/payment";
import { useToast } from "@/components/ui/use-toast";
import { PaymentItem } from "@/pages/Month";
import { PaymentType } from "@/schemas/payment.schema";
import { queries } from "@/utils/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { AlertDialog } from "../alert-dialog";

export const DeletePaymentAlert = ({
  open,
  setOpen,
  payment,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  payment: PaymentType;
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mutationDeleteVocher = useMutation({
    mutationFn: deletePayment,
    onSuccess: () => {
      queryClient.invalidateQueries([queries.vocherPerMonth]);
      queryClient.invalidateQueries([queries.yearsWorker]);
      queryClient.invalidateQueries([queries.payments]);
      setOpen(false);
      toast({
        title: "Payment supprimé avec succès!",
        description: `Le versement a été supprimé avec succès.`,
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
      onAccept={() => mutationDeleteVocher.mutate(payment.id)}
      onRefusal={() => setOpen(false)}
      title="ALERTE: Suppression d'un versement"
      description="Vous êtes sur le point de supprimer le versement suivant:"
      isLoading={mutationDeleteVocher.isLoading}
    >
      <PaymentItem payment={payment} hideActions />
    </AlertDialog>
  );
};
