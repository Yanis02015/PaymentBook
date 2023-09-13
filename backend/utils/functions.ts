import { Vocher } from "@prisma/client";

type VocherPerMonth = { [key: string]: Vocher[] };

export const groupVocher = (vochers: Vocher[]): VocherPerMonth => {
  if (!vochers) return {};

  // Triez les virements par date, du plus ancien au plus récent
  vochers.sort((a, b) => a.date.getTime() - b.date.getTime());

  const virementsParMois: VocherPerMonth = {};

  vochers.forEach((vocher) => {
    const date = new Date(vocher.date);
    const moisAnnee = `${date.toLocaleString("default", {
      month: "long",
    })} ${date.getFullYear()}`;

    if (!virementsParMois[moisAnnee]) {
      virementsParMois[moisAnnee] = [];
    }

    virementsParMois[moisAnnee].push(vocher);
  });

  return virementsParMois;
};
