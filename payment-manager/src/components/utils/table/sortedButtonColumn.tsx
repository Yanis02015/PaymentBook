import { Button } from "@/components/ui/button";
import { Column } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export const SortedButtonColumn = <TData, TValue>({
  column,
  name,
}: {
  column: Column<TData, TValue>;
  name: string;
}) => {
  return (
    <Button
      variant="ghost"
      className="-ml-4"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {name}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
};
