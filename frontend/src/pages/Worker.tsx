import { getWorkerVochers } from "@/api/vocher";
import { getWorker } from "@/api/worker";
import { PaymentMonthCard } from "@/components/my/month-payment-card";
import { WorkerProfil } from "@/components/my/worker-profil";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PATHS } from "@/utils/paths";
import { queries } from "@/utils/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export default function Worker() {
  const { id } = useParams();
  const { data: worker } = useQuery({
    queryKey: [queries.workers, id],
    queryFn: () => getWorker(id as string),
    enabled: Boolean(id),
  });

  const { data: vochers } = useQuery({
    queryKey: [queries.vocherPerMonth, id],
    queryFn: () => getWorkerVochers(id as string),
    enabled: Boolean(id),
  });

  return (
    <>
      <Link
        to={PATHS.WORKERS}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute top-4 select-none"
        )}
      >
        <ArrowLeftIcon className="w-4 h-4 mr-2" /> Retourner en arriere
      </Link>
      <div className="py-3"></div>
      {worker && vochers && (
        <div className={cn("flex flex-col-reverse gap-4", "md:flex-row")}>
          <div className="flex-1 max-w-full md:pt-16 overflow-hidden space-y-4 relative">
            {vochers?.map((vocher) => (
              <PaymentMonthCard
                key={vocher.month}
                vocherPerMonth={vocher}
                worker={worker}
              />
            ))}
          </div>
          <h2 className="text-md font-semibold md:hidden mt-10">
            Les verssements de l'année 2023
          </h2>
          <div className="relative w-full md:w-[300px] md:h-[auto] h-max">
            <WorkerProfil
              worker={worker}
              className="h-fit sticky top-20 w-full w-full md:w-[300px]"
            />
          </div>
        </div>
      )}
    </>
  );
}
