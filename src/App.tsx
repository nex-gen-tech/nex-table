import { MantineProvider, Menu } from "@mantine/core";
import "@mantine/core/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { CellContext } from "@tanstack/react-table";
import { useState } from "react";

import NexTable, { NexColumnDefProps, QueryType } from "./components/NexTable";
import { useUsersTable } from "./table/_hooks/useUsers";
import { UserType } from "./table/_type/user.zod";

const columns: NexColumnDefProps<UserType>[] = [
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "first_name",
    accessorKey: "first_name",
    header: "First Name",
  },
  {
    id: "id",
    accessorKey: "id",
    header: "ID",
    isNotVisible: true,
  },
  {
    id: "last_name",
    accessorKey: "last_name",
    header: "Last Name",
    enableHiding: false,
  },
  {
    id: "created_at",
    accessorKey: "created_at",
    header: "Created At",
  },
  {
    id: "is_active",
    accessorKey: "is_active",
    header: "Is Active",
  },
  {
    id: "updated_at",
    accessorKey: "updated_at",
    header: "Created At",
  },
];

const cellAction = (context: CellContext<UserType, unknown>) => (
  <>
    <Menu.Item onClick={() => console.log("Action 1", context.row.original)}>
      Action 1
    </Menu.Item>
    <Menu.Item onClick={() => console.log("Action 2", context.row.original)}>
      Action 2
    </Menu.Item>
    <Menu.Item onClick={() => console.log("Action 3", context.row.original)}>
      Action 3
    </Menu.Item>
  </>
);

const Home = () => {
  const [query, setQueryChange] = useState<QueryType>({
    pagination: {
      pageIndex: 0,
      pageSize: 10,
    },
    selectedRows: {},
  });

  const { data } = useUsersTable(query);

  return (
    <div>
      <NexTable<UserType>
        tableName="Users List"
        tableActions={<div>Table Actions</div>}
        data={data?.users || []}
        rowCount={data?.total || 0}
        columns={columns}
        paginationState={query?.pagination || { pageIndex: 0, pageSize: 10 }}
        setQueryChange={setQueryChange}
        cellAction={cellAction}
        config={{
          enableRowSelection: true,
          defaultRowToSelect: "id",
          // disablePagination: true,
        }}
      />
    </div>
  );
};

export default function App() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider
        defaultColorScheme="dark"
        forceColorScheme="light"
        classNamesPrefix="nexg"
        withCssVariables
      >
        <Home />
      </MantineProvider>
    </QueryClientProvider>
  );
}
