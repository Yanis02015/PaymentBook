import { getMonthInvoiceData } from "@/configurations/print";
import { VocherMonthType } from "@/schemas/vocher.schema";
import { WorkerType } from "@/schemas/worker.schema";

export const getInvoiceData = async ({
  vocherMonth,
  worker,
}: {
  vocherMonth: VocherMonthType;
  worker: WorkerType;
}) => await getMonthInvoiceData(vocherMonth, worker);
