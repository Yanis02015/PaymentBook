import { getYearsOfWorker } from "@/api/utils";
import { getWorkerVochers } from "@/api/vocher";
import { getWorker } from "@/api/worker";
import { NotFound } from "@/components/my/404/mission-not-found";
import { PaymentMonthCard } from "@/components/my/month-payment-card";
import { PaymentMonthCardSheleton } from "@/components/my/skeletons/payment-month-card-sheleton";
import { WorkerProfil } from "@/components/my/worker-profil";
import { YearsCaroussel } from "@/components/my/years-carousel";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Error404 } from "@/components/utils/error";
import { cn } from "@/lib/utils";
import { PATHS } from "@/utils/paths";
import { queries } from "@/utils/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { ArrowLeftIcon } from "lucide-react";
import { useCallback } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

export default function Worker() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const setYear = useCallback(
    (year: number) => {
      setSearchParams({ year: year.toString() });
      return year;
    },
    [setSearchParams]
  );
  // const year = searchParams.get("year");

  const { data: years } = useQuery({
    queryKey: [queries.yearsWorker, id],
    queryFn: () => getYearsOfWorker(id as string),
    enabled: Boolean(id),
    retry(failureCount, error) {
      if (error instanceof HTTPError && error.response.status == 404)
        return false;
      if (failureCount > 3) return false;
      return true;
    },
  });

  const {
    data: worker,
    isError,
    error,
  } = useQuery({
    queryKey: [queries.workers, id],
    queryFn: () => getWorker(id as string),
    enabled: Boolean(id),
    retry(failureCount, error) {
      if (error instanceof HTTPError && error.response.status == 404)
        return false;
      if (failureCount > 3) return false;
      return true;
    },
  });

  const getSelectedYear = useCallback(() => {
    const year = Number(searchParams.get("year"));
    const currentYear = new Date().getFullYear();
    if (year) return year;
    if (!years || years.length == 0) return currentYear;
    const indexCurrentYear = years.findIndex((y) => y.year == currentYear);
    return indexCurrentYear == -1 ? years[0].year : currentYear;
  }, [searchParams, years]);

  const { data: vochers, isLoading } = useQuery({
    queryKey: [queries.vocherPerMonth, id, getSelectedYear()],
    queryFn: () => getWorkerVochers(id as string, getSelectedYear()),
    enabled: Boolean(years),
  });

  if (error && error instanceof HTTPError && error.response.status == 404)
    return <Error404 />;
  return (
    <div>
      <Link
        to={PATHS.WORKERS}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute top-4 select-none"
        )}
      >
        <ArrowLeftIcon className="w-4 h-4 mr-2" /> Retourner en arriere
      </Link>

      {/* TODO: Delete ? */}
      <div className="py-3"></div>

      <div className={cn("flex flex-col-reverse gap-4", "md:flex-row")}>
        <div className="flex-1 max-w-full overflow-hidden -m-5 p-5">
          {/* Year list */}
          {years && (
            <YearsCaroussel
              years={years}
              selectedYear={getSelectedYear()}
              onSelectYear={(y) => {
                setYear(y);
              }}
            />
          )}

          {isLoading && (
            <div className="space-y-8">
              {new Array(4).fill(0).map((_, i) => (
                <PaymentMonthCardSheleton key={i} />
              ))}
            </div>
          )}
          {vochers && worker && (
            <div className="space-y-8">
              {vochers?.map((vocher) => (
                <PaymentMonthCard
                  key={vocher.month}
                  vocherPerMonth={vocher}
                  worker={worker}
                />
              ))}
              {vochers.length == 0 && (
                <NotFound
                  className="pt-20"
                  message={
                    years?.length == 0 && !Number(searchParams.get("year"))
                      ? `Aucune mission ni transaction trouvé pour M. ${worker.fullname}`
                      : `Aucune mission ni transaction trouvé pour l'année ${getSelectedYear()}`
                  }
                />
              )}
            </div>
          )}
        </div>
        <div className="relative w-full md:w-[300px] md:h-[auto] h-max">
          {worker ? (
            <WorkerProfil
              vocherLength={vochers?.length || 0}
              worker={worker}
              className="h-fit sticky top-20 w-full w-full md:w-[300px]"
            />
          ) : isError ? (
            "error"
          ) : (
            <Skeleton className="h-full md:w-[300px]" />
          )}
        </div>
      </div>
    </div>
  );
}
