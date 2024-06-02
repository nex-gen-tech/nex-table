import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Popover,
  Text,
} from "@mantine/core";
import { IconAdjustments } from "@tabler/icons-react";
import { useState } from "react";

type NexTableHeaderProps = {
  tableName: string;
  action: React.ReactNode;
};

const NexTableHeader = ({ tableName, action }: NexTableHeaderProps) => {
  const [filter, setFilter] = useState<string>("");

  return (
    <Flex justify={"space-between"} align={"center"} px="lg">
      <Group align="center" gap={8}>
        <h2>{tableName}</h2>
        <Divider orientation="vertical" size={"xs"} />
        <Popover width={300} position="bottom" withArrow shadow="md">
          <Popover.Target>
            <ActionIcon variant="transparent" aria-label="Settings">
              <IconAdjustments
                style={{ width: "70%", height: "70%" }}
                stroke={1.5}
              />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown style={{ zIndex: 1000 }}>
            <Box p="xs">
              <Text>Filters</Text>
              <Group align="center" gap={8}>
                <Group align="center" gap={8}>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </Group>
              </Group>
              <Button>Add Filter</Button>
            </Box>
          </Popover.Dropdown>
        </Popover>
      </Group>
      <h2>{action}</h2>
    </Flex>
  );
};

export default NexTableHeader;
