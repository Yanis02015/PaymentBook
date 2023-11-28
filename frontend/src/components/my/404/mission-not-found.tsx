import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PackageOpen } from "lucide-react";

export const NotFound = ({
  message,
  title,
  onClick,
  onClickMessage,
  className,
}: {
  message: string;
  title?: string;
  onClick?: () => void;
  onClickMessage?: string;
  className?: string;
}) => (
  <div
    className={cn(
      "text-muted-foreground flex flex-col items-center gap-7 text-center",
      className
    )}
  >
    <PackageOpen strokeWidth={1.2} className="h-64 w-64" />
    <div className="space-y-1 font-extralight">
      <h1 className="text-3xl">{title || "Aucun résultat trouvé"}</h1>
      <p>{message}</p>
      {onClick && onClickMessage && (
        <Button onClick={onClick} size="sm" variant="link">
          {onClickMessage}
        </Button>
      )}
    </div>
  </div>
);
