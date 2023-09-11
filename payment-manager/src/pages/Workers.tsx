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
    <div className="space-y-5 container">
      <h1 className="sm:text-3xl text-2xl font-semibold tracking-tight mt-10">
        Liste des travailleurs
      </h1>
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
