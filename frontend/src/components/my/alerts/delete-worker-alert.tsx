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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { WorkerType } from "@/schemas/worker.schema";
import { PATHS } from "@/utils/paths";
import { queries } from "@/utils/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { AlertCircle, Loader2 } from "lucide-react";
import { PropsWithChildren, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  const quetyClient = useQueryClient();
  const navigate = useNavigate();
  const mutationDeleteWorker = useMutation({
    mutationFn: deleteWorker,
    onSuccess: () => {
      onOpenChange(false);
      quetyClient.invalidateQueries([queries.workers]);
      quetyClient.invalidateQueries([queries.workers, worker.id]);
      quetyClient.invalidateQueries([queries.vocherPerMonth, worker.id]);
      quetyClient.invalidateQueries([queries.soldeAmount, worker.id]);
      quetyClient.invalidateQueries([queries.soldes, worker.id]);
      quetyClient.invalidateQueries([worker.id]);
      toast({
        title: "Employé supprimé",
        description: `Votre employé ${worker.fullname} à bien étais supprimer`,
      });
      navigate(PATHS.WORKERS);
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

  const [password, setPassword] = useState("");
  const [deleteAnyway, setDeleteAnyway] = useState(false);
  const onOpenChange = (visibility: boolean) => {
    setOpen(visibility);
    setPassword("");
    setDeleteAnyway(false);
  };
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
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
              <>
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Alert supression impossible !</AlertTitle>
                  <AlertDescription>
                    Vous ne pouvez pas supprimer cet employé car il possède des
                    bons ou un solde.
                    <Button
                      type="button"
                      onClick={() => setDeleteAnyway(true)}
                      variant="link"
                      className="px-1.5 py-0 h-min"
                    >
                      Supprimer quand même
                    </Button>
                  </AlertDescription>
                </Alert>
                {deleteAnyway && (
                  <div className="py-3">
                    <Label htmlFor="confime-password">Mot de passe</Label>
                    <Input
                      id="confime-password"
                      type="password"
                      aria-label="confirme-password"
                      autoComplete="off"
                      autoSave="false"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <p className="mt-1 text-destructive font-bold">
                      En continuant vous allez supprimer l'employé, tous ses
                      versements, tous ses bons et tout son solde, êtes vous sûr
                      de vouloir continuer ?
                    </p>
                  </div>
                )}
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <Button
            onClick={() =>
              mutationDeleteWorker.mutate({
                workerId: worker.id,
                password: deleteAnyway ? password : undefined,
              })
            }
            disabled={
              mutationDeleteWorker.isLoading || (!canBeDeleted && !deleteAnyway)
            }
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
