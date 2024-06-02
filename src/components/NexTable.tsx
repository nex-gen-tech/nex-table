/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Checkbox, Table } from "@mantine/core";
import {
  CellContext,
  ColumnDef,
  ColumnOrderState,
  PaginationState,
  RowSelectionState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CSSProperties, useEffect, useMemo, useState } from "react";

import { Menu } from "@mantine/core";
import { IconDots } from "@tabler/icons-react";
import NexPagination from "./NexPagination";
import NexHeaderAction from "./NexTableActionHeader";
import NexTableHeader from "./NexTableHeader";

interface Identifiable {
  id: string;
}

export type QueryType = {
  pagination?: PaginationState;
  selectedRows?: RowSelectionState;
};

// Define the action column
const createActionColumn = <T extends Identifiable>(
  cellAction: (context: CellContext<T, unknown>) => JSX.Element
): NexColumnDefProps<T> => ({
  id: "actions",
  header: NexHeaderAction,
  cell: (context) => (
    <Menu>
      <Menu.Target>
        <Button variant="transparent">
          <IconDots size={16} />
        </Button>
      </Menu.Target>
      <Menu.Dropdown>{cellAction(context)}</Menu.Dropdown>
    </Menu>
  ),
  size: 50,
  minSize: 50,
  maxSize: 50,
});

const createSelectionColumn = <
  T extends Identifiable
>(): NexColumnDefProps<T> => ({
  id: "selection",
  header: ({ table }) => (
    <Checkbox
      checked={table.getIsAllRowsSelected()}
      indeterminate={table.getIsSomeRowsSelected()}
      onChange={table.getToggleAllRowsSelectedHandler()}
    />
  ),
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      disabled={!row.getCanSelect()}
      onChange={row.getToggleSelectedHandler()}
    />
  ),
});

export type NexColumnDefProps<T> = ColumnDef<T> & {
  isNotVisible?: boolean;
  id?: keyof T | "selection" | "actions";
};

interface NexTableProps<T extends Identifiable> {
  data: T[];
  columns: NexColumnDefProps<T>[];
  cellAction?: (context: CellContext<T, unknown>) => JSX.Element;
  tableName?: string;
  config?: {
    enableRowSelection?: boolean;
    defaultRowToSelect?: keyof T;
    disablePagination?: boolean;
  };
  rowCount: number;
  paginationState: PaginationState;
  tableActions?: React.ReactNode;
  setQueryChange: React.Dispatch<React.SetStateAction<QueryType>>;
}

const NexTable = <T extends Identifiable>({
  data,
  columns,
  tableName,
  cellAction,
  paginationState,
  rowCount,
  setQueryChange,
  config,
  tableActions,
}: NexTableProps<T>) => {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  useEffect(() => {
    setColumnVisibility(
      columns.reduce((acc, column) => {
        acc[String(column.id)] = !column.isNotVisible;
        return acc;
      }, {} as VisibilityState)
    );
  }, [columns]);
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  useEffect(() => {
    const order = columns.map((c) => c.id!);
    if (cellAction) {
      order.push("actions");
    }
    if (config?.enableRowSelection) {
      order.unshift("selection");
    }
    setColumnOrder(order);
  }, [columns, cellAction, config?.enableRowSelection]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const memoizedData = useMemo(() => data, [data]);
  const memoizedColumns = useMemo(() => {
    const cols = [...columns];
    if (cellAction) {
      cols.push(createActionColumn<T>(cellAction));
    }
    if (config?.enableRowSelection) {
      cols.unshift(createSelectionColumn<T>());
    }
    return cols;
  }, [columns, cellAction, config?.enableRowSelection]);

  const [pagination, setPagination] = useState<PaginationState>(
    paginationState || {
      pageIndex: 0,
      pageSize: 10,
    }
  );

  const table = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    defaultColumn: {
      minSize: 100,
      maxSize: 300,
    },
    state: {
      pagination,
      columnVisibility,
      columnOrder,
      rowSelection,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onRowSelectionChange: setRowSelection,
    getRowId: (row: T) => String(row[config?.defaultRowToSelect || "id"]),
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    rowCount: rowCount,
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),
    enableMultiRowSelection: true,
  });

  useEffect(() => {
    setQueryChange((prev) => ({
      ...prev,
      pagination: table.getState().pagination,
      selectedRows: table.getState().rowSelection,
    }));
  }, [
    setQueryChange,
    table.getState().pagination,
    table.getState().rowSelection,
    config,
  ]);

  const stickyActionColumnStyle: CSSProperties = {
    right: 0,
    background: "white",
    position: "sticky",
  };

  const stickySelectionColumnStyle: CSSProperties = {
    left: 0,
    background: "white",
    position: "sticky",
  };

  const columnStyleCss = (id: string) => {
    if (id === "actions") {
      return { ...stickyActionColumnStyle, zIndex: 1 };
    }
    if (id === "selection") {
      return { ...stickySelectionColumnStyle, zIndex: 1 };
    }
    return {};
  };

  const headerStyleCss = (id: string) => {
    if (id === "actions") {
      return { ...stickyActionColumnStyle, zIndex: 1 };
    }
    if (id === "selection") {
      return { ...stickySelectionColumnStyle, zIndex: 1 };
    }
    return {};
  };

  return (
    <>
      <NexTableHeader tableName={tableName || ""} action={tableActions} />
      <div style={{ height: `calc(100vh - 130px)`, overflow: "auto" }}>
        <Table.ScrollContainer minWidth={800} h={"100%"}>
          <Table highlightOnHover h={"100%"}>
            <Table.Thead
              style={{
                zIndex: 999,
                position: "sticky",
                top: 0,
                left: 0,
                backgroundColor: "white",
              }}
            >
              {table.getHeaderGroups().map((headerGroup) => (
                <Table.Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Table.Th
                      key={header.id}
                      style={{
                        ...headerStyleCss(header.id),
                        whiteSpace: "nowrap",
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </Table.Th>
                  ))}
                </Table.Tr>
              ))}
            </Table.Thead>
            <Table.Tbody>
              {table.getRowModel().rows.map((row) => (
                <Table.Tr
                  key={row.id}
                  bg={
                    row.getIsSelected()
                      ? "var(--mantine-color-blue-light)"
                      : undefined
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <Table.Td
                      key={cell.id}
                      style={{
                        ...columnStyleCss(cell.column.id),
                        whiteSpace: "nowrap",
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </div>
      {!config?.disablePagination && <NexPagination table={table} />}
    </>
  );
};

export default NexTable;
