import { WorkerSchema } from "@/schemas/worker.schema";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { z } from "zod";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { LineChart, Pen, Plus } from "lucide-react";

const profilElementClassName =
  "bg-slate-100 flex justify-between text-sm items-center p-2 rounded-lg";

export const WorkerProfil = ({
  worker,
  className,
}: {
  worker: z.infer<typeof WorkerSchema>;
  className?: string;
}) => {
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
            <span>Ighil Ouazoug Béjaia</span>
          </div>
          <div className={profilElementClassName}>
            <strong>Tél:</strong>
            <span>0541494361</span>
          </div>
          <div className={profilElementClassName}>
            <strong>Tél:</strong>
            <span>0541494361</span>
          </div>
        </div>
        <Button variant="outline-green" size="lg">
          <Pen size={17} className="mr-2" /> Modifier le profil
        </Button>
      </div>
      <div className="space-y-2 pt-3">
        <Button size="sm" className="w-full">
          <Plus size={17} className="mr-2" /> Ajouter une mission
        </Button>
        <Button variant="outline" size="sm" className="w-full">
          <LineChart size={17} className="float-left" />
          <p>Voir les statistique</p>
        </Button>
      </div>
    </div>
  );
};
