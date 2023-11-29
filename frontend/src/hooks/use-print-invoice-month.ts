import { getInvoiceData } from "@/api/print";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import easyinvoice from "easyinvoice";

export const usePrintInvoiceMonth = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: getInvoiceData,
    onSuccess: async (invoiceData) => {
      const result = await easyinvoice.createInvoice(invoiceData);
      easyinvoice.print(result.pdf);
    },
    onError: () => {
      toast({
        title: "Oh oh, impression échoués",
        description:
          "Assurez vous d'avoir une connexion internet durant l'impression.",
        variant: "destructive",
      });
    },
  });
};
