import { VocherMonthType, VocherType } from "@/schemas/vocher.schema";
import { WorkerType } from "@/schemas/worker.schema";
import { getFormatedDate } from "@/utils/functions";
import { InvoiceProduct, InvoiceData } from "easyinvoice";

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
  number: string
): Promise<InvoiceData> => {
  const date = getFormatedDate().fullDate;
  const { htmlPrint } = await import("@/configurations/html-print");
  return {
    customize: {
      template: btoa(htmlPrint),
    },
    sender: {
      company: "Fatah Transport",
      address: "Sidi Ali Lebher",
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
      city: "Béjaia",
      country: "Algerie",
      zip: "06000",
    },
    information: {
      number,
      date,
    },
    products,
    settings: {
      locale: "fr-FR",
      currency: "DZD",
    },
    translate: {
      invoice: "Facture",
      number: "Mois",
      subtotal: "Sous-total",
      products: "Description",
      quantity: "Quantité",
      price: "Prix",
    },
  };
};

export const getMonthInvoiceData = async (
  vocherMonth: VocherMonthType,
  worker: WorkerType
) => {
  const products = buildProductInvoice(vocherMonth.Vochers);
  return await buildDataInvoice(products, worker, vocherMonth.month);
};
