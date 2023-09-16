import { Payment, Vocher } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

type VocherPerMonth = {
  month: string;
  date: Date;
  total: number;
  pay: number;
  rest: number;
  Vochers: Vocher[];
  Payments: Payment[];
}[];

export const groupVocher = (
  vochers: Vocher[],
  payements: Payment[]
): VocherPerMonth => {
  if (!vochers) return [];

  const vocherPerMonth: VocherPerMonth = [];

  vochers.forEach((vocher) => {
    let moisAnnee = formatMonthYearName(getMonthLimits(vocher.date).begin);
    const index = vocherPerMonth.findIndex((v) => v.month == moisAnnee);

    if (index == -1) {
      vocherPerMonth.push({
        month: moisAnnee,
        date: vocher.date,
        pay: 0,
        rest: 0,
        total: 0,
        Vochers: [vocher],
        Payments: [],
      });
    } else {
      vocherPerMonth[index].Vochers.push(vocher);
    }
  });

  payements.forEach((payment) => {
    let moisAnnee = formatMonthYearName(payment.month);

    const index = vocherPerMonth.findIndex((v) => v.month == moisAnnee);

    if (index == -1) {
      vocherPerMonth.push({
        month: moisAnnee,
        date: payment.month,
        pay: 0,
        rest: 0,
        total: 0,
        Vochers: [],
        Payments: [payment],
      });
    } else {
      vocherPerMonth[index].Payments.push(payment);
    }
  });

  // Triez les virements par date, du plus ancien au plus récent
  vocherPerMonth.sort((a, b) => a.date.getTime() - b.date.getTime());

  return vocherPerMonth.map((monthVocher) => {
    let total = 0;
    let pay = 0;
    monthVocher.Vochers.forEach(
      (v) => (total += v.remuneration.toNumber() * v.quantity)
    );
    monthVocher.Payments.forEach((p) => (pay += p.amount.toNumber()));
    monthVocher.total = total;
    monthVocher.pay = pay;
    monthVocher.rest = total - pay;
    return monthVocher;
  });
};

const formatMonthYearName = (date: Date) => {
  const moisAnnee = `${date.toLocaleString("fr-FR", {
    month: "long",
  })} ${date.getFullYear()}`;

  return moisAnnee.charAt(0).toUpperCase() + moisAnnee.slice(1);
};

export const getMonthLimits = (date: Date) => {
  const dateRecherchee = new Date(date);
  const anneeRecherchee = dateRecherchee.getFullYear();
  const moisRecherche = dateRecherchee.getMonth();

  // Créer une date de début de mois
  const begin = new Date(anneeRecherchee, moisRecherche, 1);

  // Trouver le dernier jour du mois suivant (pour obtenir la fin du mois actuel)
  const end = new Date(anneeRecherchee, moisRecherche + 1, 0);

  return {
    begin,
    end,
  };
};

export const getYearLimits = (year: string) => {
  const yearNbr = Number(year);
  if (!yearNbr) return;
  return {
    gte: getBeginOfYear(yearNbr),
    lt: getBeginOfYear(yearNbr + 1),
  };
};

export const getBeginOfYear = (year: number) => new Date(year, 0, 1);
