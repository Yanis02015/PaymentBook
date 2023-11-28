import { Button } from "@/components/ui/button";
import { usePrintInvoiceMonth } from "@/hooks/use-print-invoice-month";
import { cn } from "@/lib/utils";
import { VocherMonthType } from "@/schemas/vocher.schema";
import { WorkerType } from "@/schemas/worker.schema";
import { Loader2, Printer } from "lucide-react";

export const PrintButton = ({
  vocherMonth,
  worker,
  className,
}: {
  vocherMonth: VocherMonthType;
  worker: WorkerType;
  className?: string;
}) => {
  const printMonthInvoice = usePrintInvoiceMonth();
  const onPrint = () => printMonthInvoice.mutate({ vocherMonth, worker });

  return (
    <div className={cn("m-auto flex justify-end", className)}>
      <Button
        onClick={onPrint}
        className="gap-3 font-semibold print-button md:bg-primary  md:hover:bg-primary md:text-background md:hover:text-background"
        variant="outline"
        disabled={printMonthInvoice.isLoading}
      >
        {printMonthInvoice.isLoading ? (
          <Loader2 strokeWidth={2.3} className="animate-spin" />
        ) : (
          <Printer strokeWidth={2.3} />
        )}

        {printMonthInvoice.isLoading ? (
          "Impression en cours"
        ) : (
          <span className="print-text transition-all ease-out duration-200">
            Imprimer la facture
          </span>
        )}
      </Button>
    </div>
  );
};
