import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

type AlertDialogType = {
  open: boolean;
  title: string;
  description: React.ReactNode;
  onAccept: () => void;
  onRefusal: () => void;
  isLoading?: boolean;
};

export function AlertDialog({
  open,
  title,
  description,
  onAccept,
  onRefusal,
  isLoading,
}: AlertDialogType) {
  return (
    <Dialog open={open} onOpenChange={onRefusal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onRefusal}>
            Annuler
          </Button>
          <Button
            disabled={isLoading}
            className="font-normal"
            onClick={onAccept}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Valider
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
