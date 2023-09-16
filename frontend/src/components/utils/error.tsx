import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { PATHS } from "@/utils/paths";

export const Error = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "text-muted-foreground flex flex-col items-center gap-7 text-center",
        className
      )}
    >
      <AlertTriangle strokeWidth={1.2} className="h-48 w-48 sm:h-64 sm:w-64" />
      <div className="space-y-1 font-extralight max-w-2xl">
        <h1 className="text-3xl">Une erreur inattendue s'est produite</h1>
        <div className="pb-4">
          Erreur durant de la récupération de vos informations, vuillez
          réessayer dans quelque instant, ou&nbsp;essayer de vous reconnecter
          maintenant.
        </div>

        <Link to={PATHS.LOGIN}>
          <Button size="sm" variant="link">
            Se connecter
          </Button>
        </Link>
      </div>
    </div>
  );
};
