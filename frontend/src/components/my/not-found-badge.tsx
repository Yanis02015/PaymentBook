import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

export const NotFoundBadge = ({
  content = "Non renseigné",
  className,
}: {
  className?: string;
  content?: string;
}) => (
  <Badge
    variant="secondary"
    className={cn(
      "text-gray-50 font-normal rounded-md hover:none hover:bg-gray-400/60 bg-gray-400/60",
      className
    )}
  >
    {content}
  </Badge>
);
