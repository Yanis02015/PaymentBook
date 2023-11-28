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
  delayDuration = 500,
}: PropsWithChildren<{
  content: React.ReactNode;
  className?: string;
  triggerClassName?: string;
  delayDuration?: number;
}>) => (
  <TooltipProvider>
    <Tooltip delayDuration={delayDuration}>
      <TooltipTrigger className={triggerClassName}>{children}</TooltipTrigger>
      <TooltipContent className={className}>{content}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
