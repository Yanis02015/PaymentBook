import { VocherMonthType, VocherType } from "@/schemas/vocher.schema";
import { WorkerType } from "@/schemas/worker.schema";
import { getFormatedDate } from "@/utils/functions";
import { InvoiceData, InvoiceProduct } from "easyinvoice";

export const buildProductInvoice = (
  vochers: VocherType[]
): InvoiceProduct[] => {
  return vochers.map((vocher) => ({
    description: `${getFormatedDate(vocher.date).fullDate} (${
      vocher.Type?.name
    })`,
    price: vocher.remuneration,
    quantity: `${vocher.quantity}`,
    "tax-rate": 0,
  }));
};

export const buildDataInvoice = async (
  products: InvoiceProduct[],
  worker: WorkerType,
  vocherMonth: VocherMonthType
): Promise<InvoiceData> => {
  const date = getFormatedDate().fullDate;
  const { htmlPrint } = await import("@/configurations/html-print");
  return {
    customize: {
      template: btoa(
        htmlPrint(vocherMonth.Payments, vocherMonth.pay, vocherMonth.rest)
      ),
    },
    sender: {
      company: "OXI LOG",
      address: "Sidi Ali Lebhar",
      zip: "06000",
      city: "Béjaïa",
      country: "Algerie",
    },
    client: {
      company: worker.fullname,
      custom1: worker.matricule,
      custom2: worker.email || undefined,
      custom3: worker.phonenumber || undefined,
      address: worker.address || undefined,
      country: "Algerie",
    },
    "bottom-notice":
      vocherMonth.rest === 0
        ? `Le mois de « ${vocherMonth.month} » à été soldé.`
        : undefined,
    information: {
      number: vocherMonth.month,
      date,
    },
    products,
    settings: {
      locale: "fr-FR",
      currency: "DZD",
    },
    translate: {
      invoice: `Facture mensuel`,
      number: "Mois",
      subtotal: "Sous-total",
      products: "Description",
      quantity: "Quantité",
      price: "Prix",
      total: "Total des missions",
    },
  };
};

export const getMonthInvoiceData = async (
  vocherMonth: VocherMonthType,
  worker: WorkerType
) => {
  const products = buildProductInvoice(vocherMonth.Vochers);
  return await buildDataInvoice(products, worker, vocherMonth);
};
