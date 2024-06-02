// src/components/NexPagination.tsx
import { Flex, Group, Pagination, Select, Text } from "@mantine/core";
import type { Table } from "@tanstack/react-table";

interface NexPaginationProps<T> {
  table: Table<T>;
}

const NexPagination = <T,>({ table }: NexPaginationProps<T>) => {
  return (
    <Flex align={"center"} justify={"space-between"} h={70}>
      <Group align="center" gap={8}>
        <Text c="dimmed">Showing</Text>
        <Group align="center" gap={8}>
          <Select
            size="sm"
            w={70}
            value={table.getState().pagination.pageSize.toString()}
            onChange={(value) => {
              table.setPageSize(Number(value));
            }}
            data={["10", "15", "20", "25", "30", "35", "40", "45", "50"]}
          />
          <Text c="dimmed">Rows of</Text>
          <Text>{table.getRowCount()}</Text>
          <Text c="dimmed">Rows</Text>
        </Group>
      </Group>

      <Pagination
        withControls
        withEdges
        total={table.getPageCount()}
        onChange={(page) => table.setPageIndex(page - 1)}
      />
    </Flex>
  );
};

export default NexPagination;
