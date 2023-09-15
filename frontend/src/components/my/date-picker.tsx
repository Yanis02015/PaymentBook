import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FormControl } from "../ui/form";

export const DatePicker = ({
  date,
  setDate,
  className,
}: {
  date: Date;
  setDate: (date: Date) => void;
  className?: string;
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl className={className}>
          <Button
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              format(date, "PPP", { locale: fr })
            ) : (
              <span>Selectionner une date</span>
            )}
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent side="top" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          locale={fr}
          onSelect={(d) => d && setDate(d)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
