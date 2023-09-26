import { createVocher } from "@/api/vocher";
import { cn } from "@/lib/utils";
import { WorkerSchema } from "@/schemas/worker.schema";
import { queries } from "@/utils/queryKeys";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DollarSign, LineChart, Pen, Plus } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { NotFoundBadge } from "./not-found-badge";
import { getFormatedDate } from "@/utils/functions";
import { CreateVocherDialog } from "./dialogs/create-vocher-dialog";

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
  return (
    <div className={cn(className)}>
      <div
        className={cn(
          "gap-4 text-center bg-white rounded-xl pb-5 px-3 space-y-5 relative mt-16 pt-12"
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
        <div className="space-y-2">
          <div className={profilElementClassName}>
            <strong>Adresse:</strong>
            <span>{worker.address || <NotFoundBadge />}</span>
          </div>
          <div className={profilElementClassName}>
            <strong>Tél:</strong>
            <span>{worker.phonenumber || <NotFoundBadge />}</span>
          </div>
          <div className={profilElementClassName}>
            <strong>Email:</strong>
            <span>{worker.email || <NotFoundBadge />}</span>
          </div>
          <div className={profilElementClassName}>
            <strong>D. Naissance:</strong>
            <span>
              {worker.birthdate ? (
                getFormatedDate(worker.birthdate).fullDate
              ) : (
                <NotFoundBadge />
              )}
            </span>
          </div>
        </div>
        <Button variant="outline-green" size="lg">
          <Pen size={17} className="mr-3" /> Modifier le profil
        </Button>
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
          size="sm"
          className="w-full bg-blue-400 hover:bg-blue-400/90 cursor-not-allowed"
        >
          <DollarSign size={17} className="absolute left-4" />
          <p>Effectuer un versement</p>
        </Button>
        <div></div>
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
        onSubmit={mutationCreateVocher.mutate}
        open={dialogVisibility}
        worker={worker}
      />
    </div>
  );
};
