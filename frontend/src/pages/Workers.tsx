import { createWorker, getWorkers } from "@/api/worker";
import { DataTable } from "@/components/utils/table/data-table";
import { WorkerSchema } from "@/schemas/worker.schema";
import { workersColumns } from "@/utils/table/columns";
import { queries } from "@/utils/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { CreateWorkerDialog } from "@/components/my/create-worker-dialog";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Workers() {
  const [createWorkerDialogVisibility, setCreateWorkerDialogVisibility] =
    useState(false);
  const { data, isLoading } = useQuery({
    queryKey: [queries.workers],
    queryFn: getWorkers,
  });

  const navigate = useNavigate();

  const onSelectWorker = ({ id }: z.infer<typeof WorkerSchema>) => {
    navigate(id);
  };

  const queryCliet = useQueryClient();

  const mutationCreateWorker = useMutation({
    mutationFn: createWorker,
    onSuccess: () => {
      queryCliet.invalidateQueries([queries.workers]);
      setCreateWorkerDialogVisibility(false);
    },
  });

  return (
    <div className="space-y-5">
      <h1 className="sm:text-3xl text-2xl font-semibold tracking-tight">
        Liste des travailleurs
      </h1>
      <DataTable
        onRowClick={onSelectWorker}
        onAddRow={() => setCreateWorkerDialogVisibility(true)}
        headerFilter
        pagination
        isLoading={isLoading}
        columns={workersColumns()}
        data={data || []}
      />

      <CreateWorkerDialog
        open={createWorkerDialogVisibility}
        onOpenChange={setCreateWorkerDialogVisibility}
        onSubmit={(worker) => mutationCreateWorker.mutate(worker)}
        isLoadind={mutationCreateWorker.isLoading}
      />
    </div>
  );
}
