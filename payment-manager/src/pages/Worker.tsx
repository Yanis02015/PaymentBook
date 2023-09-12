import { getWorker } from "@/api/worker";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PATHS } from "@/utils/paths";
import { queries } from "@/utils/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export default function Worker() {
  const { id } = useParams();
  const { data } = useQuery({
    queryKey: [queries.workers, id],
    queryFn: () => getWorker(id as string),
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
      {data?.firstname}
    </>
  );
}
