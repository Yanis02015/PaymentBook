import { getWorkerSoldeAmount } from "@/api/solde";
import { createVocher } from "@/api/vocher";
import { cn } from "@/lib/utils";
import { WorkerSchema, WorkerType } from "@/schemas/worker.schema";
import { formatPayment, getFormatedDate } from "@/utils/functions";
import { queries } from "@/utils/queryKeys";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChevronDown,
  ChevronUp,
  DollarSign,
  LineChart,
  Pen,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { Button, buttonVariants } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { SimpleTooltip } from "../utils/simple-tooltip";
import { CreateVocherDialog } from "./dialogs/create-vocher-dialog";
import { ModifyWorkerDialog } from "./dialogs/modify-worker";
import { NotFoundBadge } from "./not-found-badge";
import { CreateSoldeDialog } from "./dialogs/create-solde-dialog";
import { CreatePaymentOutOfVocherDialog } from "./dialogs/create-payment-out-of-vocher-dialog";

const profilElementClassName =
  "bg-slate-100 flex justify-between text-sm items-center p-2 rounded-lg";

export const WorkerProfil = ({
  worker,
  className,
}: {
  worker: z.infer<typeof WorkerSchema>;
  className?: string;
}) => {
  const queryClient = useQueryClient();

  const [dialogVisibility, setDialogVisibility] = useState(false);

  const { toast } = useToast();
  const mutationCreateVocher = useMutation({
    mutationFn: createVocher,
    onSuccess: () => {
      queryClient.invalidateQueries([queries.vocherPerMonth]);
      setDialogVisibility(false);
      toast({
        title: "Mission crée avec succès!",
        description: `La nouvelle mission du ${worker.fullname} a été crée avec succès.`,
      });
    },
  });

  const { data: solde } = useQuery({
    queryKey: [queries.soldes, queries.soldeAmount, worker.id],
    queryFn: () => getWorkerSoldeAmount(worker.id),
    enabled: !!worker.id,
  });
  return (
    <div className={cn(className)}>
      <div
        className={cn(
          "gap-4 text-center bg-white rounded-xl pb-3 px-3 space-y-5 relative mt-16 pt-12"
        )}
      >
        <div className="w-32 m-auto absolute left-0 right-0 m-auto -top-16">
          <AspectRatio ratio={1} className="rounded-full">
            <img
              src={worker.image}
              alt="Photo by Drew Beamer"
              className="rounded-md object-cover w-full h-full"
            />
          </AspectRatio>
        </div>
        <div>
          <p className="font-semibold text-xl -mb-1">{worker.fullname}</p>
          <span className="text-sm text-muted-foreground">
            {worker.matricule}
          </span>
        </div>
        <AccordionWorkerInformations worker={worker} />
        <ModifyWorkerDialog
          worker={worker}
          className="absolute -top-4 right-1.5"
        >
          <Pen size={17} className="" />
        </ModifyWorkerDialog>
      </div>
      <div className="space-y-2 pt-3 relative">
        <Button
          onClick={() => setDialogVisibility(true)}
          size="sm"
          className="w-full"
        >
          <Plus size={17} className="absolute left-4" /> Ajouter une mission
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="w-full cursor-not-allowed"
        >
          <LineChart size={17} className="absolute left-4" />
          <p>Voir les statistique</p>
        </Button>

        <div className="bg-background border rounded-lg px-3 py-2 space-y-2">
          <p className="text-muted-foreground font-semibold">Solde restant</p>
          <h1 className="text-center text-2xl font-bold text-destructive pb-3 !mt-0">
            {solde
              ? solde?.rest
                ? formatPayment(solde?.rest)
                : "Aucun solde restant"
              : "Chargement..."}
          </h1>
          {solde && (
            <div className="space-y-1 pb-2 text-xs">
              <p>
                Total des anciens soldes:{" "}
                <strong className="text-destructive">
                  {formatPayment(solde.amount)}
                </strong>
              </p>
              <p>
                Total des anciens versement:{" "}
                <strong className="text-green-500">
                  {formatPayment(solde.payment)}
                </strong>
              </p>
            </div>
          )}
          <CreateSoldeDialog
            worker={worker}
            className={buttonVariants({
              size: "sm",
              variant: "outline",
              className: "w-full relative",
            })}
          >
            <Plus size={17} className="absolute left-4" />
            <p>Ajouter un solde</p>
          </CreateSoldeDialog>
          <CreatePaymentOutOfVocherDialog
            className={cn(
              buttonVariants({
                size: "sm",
                className: "w-full relative",
              }),
              "bg-blue-400 hover:bg-blue-400/90"
            )}
            worker={worker}
            rest={solde?.rest || 0}
          >
            <DollarSign size={17} className="absolute left-4" />
            <p>Effectuer un versement</p>
          </CreatePaymentOutOfVocherDialog>
        </div>
      </div>

      <CreateVocherDialog
        onOpenChange={setDialogVisibility}
        onSubmit={mutationCreateVocher.mutate}
        open={dialogVisibility}
        worker={worker}
      />
    </div>
  );
};

const AccordionWorkerInformations = ({ worker }: { worker: WorkerType }) => {
  const [showInformations, setShowInformations] = useState(false);

  return (
    <div className="flex flex-col border-2 border-green-400 p-2 pb-0 rounded-lg">
      <Button
        variant="link"
        className="p-0 h-auto w-auto mr-auto gap-1 hover:text-green-400"
        onClick={() => setShowInformations((h) => !h)}
      >
        {showInformations ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
        {showInformations
          ? "Cacher les information"
          : "Aficher les information"}
      </Button>
      <div
        className={cn(
          "space-y-2 my-2 overflow-hidden flex flex-col justify-end transition-all	max-h-96",
          !showInformations && "max-h-0 my-1"
        )}
      >
        <div className={profilElementClassName}>
          <strong>Adresse:</strong>
          <SimpleTooltip content={worker.address}>
            <span className="line-clamp-1">
              {worker.address || <NotFoundBadge />}
            </span>
          </SimpleTooltip>
        </div>
        <div className={profilElementClassName}>
          <strong>Tél:</strong>
          <span className="line-clamp-1">
            {worker.phonenumber || <NotFoundBadge />}
          </span>
        </div>
        <div className={profilElementClassName}>
          <strong>Email:</strong>
          <span className="line-clamp-1">
            {worker.email || <NotFoundBadge />}
          </span>
        </div>
        <div className={profilElementClassName}>
          <strong>D. Naissance:</strong>
          <span className="line-clamp-1">
            {worker.birthdate ? (
              getFormatedDate(worker.birthdate).fullDate
            ) : (
              <NotFoundBadge />
            )}
          </span>
        </div>
      </div>
    </div>
  );
};
