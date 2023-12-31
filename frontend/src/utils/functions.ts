import { WorkerFormSchema } from "@/schemas/form.schema";
import { format, formatDistanceStrict } from "date-fns";
import { fr } from "date-fns/locale";
import { z } from "zod";

export const removeAccents = (text: string) => {
  const accent = [
    /[\300-\306]/g,
    /[\340-\346]/g, // A, a
    /[\310-\313]/g,
    /[\350-\353]/g, // E, e
    /[\314-\317]/g,
    /[\354-\357]/g, // I, i
    /[\322-\330]/g,
    /[\362-\370]/g, // O, o
    /[\331-\334]/g,
    /[\371-\374]/g, // U, u
    /[\321]/g,
    /[\361]/g, // N, n
    /[\307]/g,
    /[\347]/g, // C, c
  ];
  const noaccent = [
    "A",
    "a",
    "E",
    "e",
    "I",
    "i",
    "O",
    "o",
    "U",
    "u",
    "N",
    "n",
    "C",
    "c",
  ];
  for (let i = 0; i < accent.length; i++) {
    text = text.replace(accent[i], noaccent[i]);
  }
  return text;
};

export const isDev = () =>
  !import.meta.env.MODE || import.meta.env.MODE === "development";

export const getWebsiteDomaine = () => import.meta.env.VITE_WEBSITE_DOMAINE;

export const isSameSite = () =>
  import.meta.env.VITE_API_DOMAINE === import.meta.env.VITE_WEBSITE_DOMAINE;

export const formatEventFormToJson = (
  event: React.FormEvent<HTMLFormElement>
) => {
  const myJson: { [key: string]: string } = {};
  const formData = new FormData(event.currentTarget);
  formData.forEach((value, key) => (myJson[key] = value.toString()));
  return myJson;
};

export const getFormatedDate = (date?: Date) => {
  if (!date) date = new Date();
  const dayOfWeek = format(date, "iii", { locale: fr });
  const dayInMonth = format(date, "dd", { locale: fr });
  const month = format(date, "LLL", { locale: fr });
  const hourse = format(date, "HH", { locale: fr });
  const minutes = format(date, "mm", { locale: fr });
  const simpleTime = `${hourse}:${minutes}`;

  const fullDate = format(date, "P", { locale: fr });
  const fullDateTime = `${fullDate} ${simpleTime}`;
  const fullMonth = format(date, "MMMM", { locale: fr });
  const year = format(date, "uuuu", { locale: fr });
  const monthYear = `${fullMonth} ${year}`;

  return {
    simpleDateWithDayWeek: `${dayOfWeek} ${dayInMonth}, ${month}`,
    distanceStrict: formatDistanceStrict(new Date(), date),
    fullDateTime,
    simpleTime,
    fullDate,
    fullMonth,
    monthYear,
    year,
  };
};

export const formatPayment = (payment: number | string) => {
  payment = Number(payment);

  return (
    payment
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0") // Une espace tous les 3 chiffres
      .replace(".", ",") + "\u00A0DA"
  );
};

export const formatPaymentForInvoice = (payment: number | string) => {
  payment = Number(payment);

  return (
    payment
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ") // Une espace tous les 3 chiffres
      .replace(".", ",") + " DZD"
  );
};

export const destructuringMatricule = (matricule: string) => {
  const matTab = matricule.split("-");
  if (matTab.length < 3) return;
  return {
    matriculeID: matTab[0],
    matriculeYear: matTab[1],
    matriculeWilaya: matTab[2],
  };
};

// export const generateMatricule = (id: string, year: string, wilaya: string) => {
//   if (id.length < 6) id = `0${id}`;
//   return `${id}-${year}-${wilaya}`;
// };
export const generateMatricule = ({
  matriculeId: id,
  matriculeYear: year,
  matriculeWilaya: wilaya,
}: z.infer<typeof WorkerFormSchema>) => {
  if (id.length < 6) id = `0${id}`;
  return `${id}-${year}-${wilaya}`;
};

export const monthToDate = (monthYear: string) => {
  const tab = monthYear.split("-");
  if (tab.length != 2) return;
  const month = Number(tab[0]);
  const year = Number(tab[1]);
  if (!Number.isInteger(month) || !Number.isInteger(year)) return;
  if (month > 12 || month < 1 || year < 1) return;

  return new Date(year, month - 1);
};

export const inputTextToValidPrice = (value: string) => {
  if (!value) return "0";
  if (value.startsWith("0")) value = value.replace(/^0+/, "");

  value = value.replace(/,/g, ".");
  console.log(value);

  if (value && !value.match(/^\d{1,}(\.\d{0,4})?$/)) return;
  return value || undefined;
};

export const handleChangeNumberInput = (
  event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
) => {
  const newValue = inputTextToValidPrice(event.target.value);
  if (!newValue) return;
  event.target.value = newValue;

  onChange(event);
};
