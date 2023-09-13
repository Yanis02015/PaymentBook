import { PrismaClient } from "@prisma/client";

export const Prisma = new PrismaClient().$extends({
  result: {
    worker: {
      fullname: {
        needs: { firstname: true, lastname: true },
        compute(worker) {
          return `${worker.firstname} ${worker.lastname}`;
        },
      },
      image: {
        compute(worker) {
          return `${process.env.API_DOMAINE}/images/${worker.image}`;
        },
      },
    },
  },
});

export const WorkerModel = Prisma.worker;
export const VocherModel = Prisma.vocher;
export const PaymentModel = Prisma.payment;
