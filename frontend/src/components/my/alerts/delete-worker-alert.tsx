import { deleteWorker } from "@/api/worker";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { WorkerType } from "@/schemas/worker.schema";
import { useMutation } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { AlertCircle, Loader2 } from "lucide-react";
import { PropsWithChildren, useState } from "react";

export function DeleteWorkerAlert({
  children,
  worker,
  className,
  canBeDeleted,
}: PropsWithChildren<{
  worker: WorkerType;
  canBeDeleted: boolean;
  className?: string;
}>) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const mutationDeleteWorker = useMutation({
    mutationFn: deleteWorker,
    onSuccess: () => {
      setOpen(false);
      toast({
        title: "Employé supprimé",
        description: `Votre employé ${worker.fullname} à bien étais supprimer`,
      });
    },
    onError: (error: HTTPError) => {
      console.log(error);
      toast({
        title: "Oh oh, ajout de solde échoués",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          className={cn(
            "hover:text-destructive rounded-full p-2 h-auto w-auto",
            className
          )}
          variant="ghost"
          size="icon"
        >
          {children}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Êtes vous sûre de vouloir supprimer cet employé ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            {canBeDeleted ? (
              <span>
                Vous êtes sur le points de supprimer votre employé{" "}
                <strong>{worker.fullname}</strong>, si c'est une erreur cliquer
                sur annuler ou cliquez sur Valider pour confirmer la
                suppression.
              </span>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Alert supression impossible !</AlertTitle>
                <AlertDescription>
                  Vous ne pouvez pas supprimer cet employé car il possède des
                  bons ou un solde.
                </AlertDescription>
              </Alert>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <Button
            onClick={() => mutationDeleteWorker.mutate(worker.id)}
            disabled={mutationDeleteWorker.isLoading || !canBeDeleted}
          >
            {mutationDeleteWorker.isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Valider
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
