import { Decimal } from "@prisma/client/runtime/library";
import { PaymentModel, SoldeModel } from "../configurations/db";

export const getSoldesAmountsAndRest = async (workerId: string) => {
  const { _sum: soldeSum } = await SoldeModel.aggregate({
    where: { workerId },
    _sum: { amount: true },
  });

  const { _sum: PaymentSum } = await PaymentModel.aggregate({
    where: { workerId, outOfVocher: true },
    _sum: { amount: true },
  });
  soldeSum.amount = soldeSum.amount || new Decimal(0);
  PaymentSum.amount = PaymentSum.amount || new Decimal(0);
  const rest = soldeSum.amount.minus(PaymentSum.amount);

  return { amount: soldeSum.amount, payment: PaymentSum.amount, rest };
};
