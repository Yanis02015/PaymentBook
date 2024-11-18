import { cn } from "@/lib/utils";
import { WorkerSchema, WorkerType } from "@/schemas/worker.schema";
import { getFormatedDate } from "@/utils/functions";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import {
  ChevronDown,
  ChevronUp,
  LineChart,
  Pen,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { Button } from "../ui/button";
import { SimpleTooltip } from "../utils/simple-tooltip";
import { DeleteWorkerAlert } from "./alerts/delete-worker-alert";
import { CreateVocherDialog } from "./dialogs/create-vocher-dialog";
import { ModifyWorkerDialog } from "./dialogs/modify-worker";
import { NotFoundBadge } from "./not-found-badge";

const profilElementClassName =
  "bg-slate-100 flex justify-between text-sm items-center p-2 rounded-lg";

export const WorkerProfil = ({
  worker,
  vocherLength,
  className,
}: {
  worker: z.infer<typeof WorkerSchema>;
  className?: string;
  vocherLength: number;
}) => {
  const [dialogVisibility, setDialogVisibility] = useState(false);

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
        <div className="absolute -top-4 right-1.5 flex flex-col">
          <ModifyWorkerDialog worker={worker} className="">
            <Pen size={17} />
          </ModifyWorkerDialog>
          <DeleteWorkerAlert worker={worker} canBeDeleted={vocherLength == 0}>
            <Trash2 size={17} />
          </DeleteWorkerAlert>
        </div>
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
      </div>

      <CreateVocherDialog
        onOpenChange={setDialogVisibility}
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
