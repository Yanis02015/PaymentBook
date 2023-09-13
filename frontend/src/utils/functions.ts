import { format, formatDistanceStrict } from "date-fns";
import { fr } from "date-fns/locale";

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

export const getFormatedDate = (date: Date) => {
  const dayOfWeek = format(date, "iii", { locale: fr });
  const dayInMonth = format(date, "dd", { locale: fr });
  const month = format(date, "LLL", { locale: fr });
  const hourse = format(date, "HH", { locale: fr });
  const minutes = format(date, "mm", { locale: fr });

  return {
    simpleDateWithDayWeek: `${dayOfWeek} ${dayInMonth}, ${month}`,
    simpleTime: `${hourse}:${minutes}`,
    distanceStrict: formatDistanceStrict(new Date(), date),
  };
};

export const formatPayment = (payment: number | string) => {
  return payment.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ".00 DA";
};
