import { WorkerSchema as Worker } from "@/schemas/worker.schema";
import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import { SortedButtonColumn } from "../../components/utils/table/sortedButtonColumn";
import { TableAvatar } from "../../components/utils/table/table-avatar";

export type FunctionsWorkersColumn = {
  delete: (id: string) => void;
};

const wokersColumnsName: { [key: string]: string | undefined } = {
  firstname: "Nom",
  lastname: "Prénom",
  matricule: "Matricule",
} as const;

export const getWorkersColumnName = (name: string) => {
  return wokersColumnsName[name] || name;
};

export const workersColumns = (): ColumnDef<z.infer<typeof Worker>>[] => [
  {
    header: "Profil",
    cell: ({ row }) => (
      <TableAvatar
        image={row.original.image}
        name={`${row.original.firstname} ${row.original.lastname}`}
      />
    ),
  },
  {
    accessorKey: "firstname",
    header: ({ column }) => <SortedButtonColumn column={column} name="Nom" />,
  },
  {
    accessorKey: "lastname",
    header: ({ column }) => (
      <SortedButtonColumn column={column} name="Prénom" />
    ),
  },
  {
    accessorKey: "matricule",
    header: "Matricule",
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const worker = row.original;
  //     return <DropdownWorkerMenu worker={worker} />;
  //   },
  // },
];

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
// export const workersColumns_OLD = (
//   functions: FunctionsWorkersColumn
// ): ColumnDef<z.infer<typeof Worker>>[] => [
//   {
//     // TODO: Add image in worker model and configure image here
//     header: "Profil",
//     cell: (/*{ row } */) => (
//       // to get value -> row.original.image
//       <TableAvatar image="https://github.com/shadcn.png" name="Yanis Oulhaci" />
//     ),
//     enableSorting: false,
//     enableHiding: false,
//   },
//   {
//     accessorKey: "Firstname",
//     header: ({ column }) => (
//       <SortedButtonColumn column={column} name="Nom et prénom" />
//     ),
//     cell: ({ row }) => `${row.original.Firstname} ${row.original.Lastname}`,
//   },
//   {
//     accessorKey: "Email",
//     header: ({ column }) => <SortedButtonColumn column={column} name="Email" />,
//   },
//   {
//     accessorKey: "Roles",
//     header: ({ column }) => <SortedButtonColumn column={column} name="Role" />,
//     cell: ({ row }) => row.original.Roles.join(" - "),
//   },
//   {
//     accessorKey: "Status",
//     header: "Status", // TODO: Faire un badge ou une icon vert/rouge en fonction
//     cell: ({ row }) =>
//       row.original.Status ? (
//         <Badge className="bg-blue/80">Actif</Badge>
//       ) : (
//         <Badge className="bg-red-500/80">Inactif</Badge>
//       ),
//   },
//   {
//     id: "actions",
//     cell: ({ row }) => {
//       const worker = row.original;
//       return <DropdownWorkerMenu worker={worker} functions={functions} />;
//     },
//   },
// ];
