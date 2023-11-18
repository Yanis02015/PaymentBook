import { PropsWithChildren } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export const SimpleTooltip = ({
  children,
  content,
  className,
  triggerClassName,
}: PropsWithChildren<{
  content: React.ReactNode;
  className?: string;
  triggerClassName?: string;
}>) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger className={triggerClassName}>{children}</TooltipTrigger>
      <TooltipContent className={className}>{content}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
