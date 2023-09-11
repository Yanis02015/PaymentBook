import { getWorkers } from "@/api/worker";
import { workersColumns } from "@/utils/columns";
import { DataTable } from "@/components/utils/table/data-table";
import { queries } from "@/utils/queryKeys";
import { useQuery } from "@tanstack/react-query";

export default function Workers() {
  const { data, isLoading } = useQuery({
    queryKey: [queries.workers],
    queryFn: getWorkers,
  });

  return (
    <div className="">
      <DataTable
        headerFilter
        pagination
        isLoading={isLoading}
        columns={workersColumns()}
        data={data || []}
      />
    </div>
  );
}
