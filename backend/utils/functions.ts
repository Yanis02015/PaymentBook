import { Vocher } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

type VocherPerMonth = {
  month: string;
  total: number;
  pay: number;
  rest: number;
  Vochers: Vocher[];
  // TODO: Adding Payments: Payment[];
}[];

export const groupVocher = (vochers: Vocher[]): VocherPerMonth => {
  if (!vochers) return [];

  // Triez les virements par date, du plus ancien au plus récent
  vochers.sort((a, b) => a.date.getTime() - b.date.getTime());

  const vocherPerMonth: VocherPerMonth = [];

  vochers.forEach((vocher) => {
    const date = new Date(vocher.date);
    let moisAnnee = `${date.toLocaleString("fr-FR", {
      month: "long",
    })} ${date.getFullYear()}`;

    moisAnnee = moisAnnee.charAt(0).toUpperCase() + moisAnnee.slice(1);

    const index = vocherPerMonth.findIndex((v) => v.month == moisAnnee);

    if (index == -1) {
      vocherPerMonth.push({
        month: moisAnnee,
        pay: 0,
        rest: 0,
        total: 0,
        Vochers: [vocher],
      });
    } else {
      vocherPerMonth[index].Vochers.push(vocher);
    }
  });

  return vocherPerMonth.map((monthVocher) => {
    let total = 0;
    monthVocher.Vochers.forEach((v) => (total += v.remuneration.toNumber()));
    monthVocher.total = total;
    return monthVocher;
  });
};
