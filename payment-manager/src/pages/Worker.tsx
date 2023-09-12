import { getWorker } from "@/api/worker";
import { AspectRatio } from "@/components/ui/aspect-ratio";
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
      {worker && (
        <div className="flex gap-4 items-center">
          <div className="w-44">
            <AspectRatio ratio={1} className="rounded-full">
              <img
                src={worker.image}
                alt="Photo by Drew Beamer"
                className="rounded-md object-cover w-full h-full"
              />
            </AspectRatio>
          </div>
          <div className="text-xl">
            <ul>
              <li>
                Nom: <strong>{worker.firstname}</strong>
              </li>
              <li>
                Prénom: <strong>{worker.lastname}</strong>
              </li>
              <li>
                Matricule: <strong>{worker.matricule}</strong>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
