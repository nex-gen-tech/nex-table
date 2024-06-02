import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { Button, Checkbox, Popover } from "@mantine/core";
import { IconDots, IconGripVertical, IconSettings } from "@tabler/icons-react";
import { Table } from "@tanstack/react-table";
import cx from "clsx";
import { useEffect, useState } from "react";
import classes from "./NexTableActionHeader.module.css";

interface NexHeaderActionType<T> {
  table: Table<T>;
}

const NexHeaderAction = <T,>({ table }: NexHeaderActionType<T>) => {
  const [columns, setColumns] = useState(table.getAllColumns());

  useEffect(() => {
    const columnsToNotDisplay = ["selection", "actions", "id"];
    setColumns(
      table
        .getAllColumns()
        .filter((column) => !columnsToNotDisplay.includes(column.id))
    );
  }, [table]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reorderedColumns = Array.from(columns);
    const [removed] = reorderedColumns.splice(result.source.index, 1);
    reorderedColumns.splice(result.destination.index, 0, removed);

    const updatedColumns = [
      table.getColumn("selection"),
      ...reorderedColumns,
      table.getColumn("actions"),
    ];

    setColumns(reorderedColumns);
    table.setColumnOrder(updatedColumns.map((col) => col?.id as string));
  };

  return (
    <Popover width="max-content" position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Button variant="transparent">
          <IconDots size={16} />
        </Button>
      </Popover.Target>
      <Popover.Dropdown w={250}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="dnd-list" direction="vertical">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {columns.map((column, index) => (
                  <Draggable
                    key={column.id}
                    index={index}
                    draggableId={column.id}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={cx(classes.item, {
                          [classes.itemDragging]: snapshot.isDragging,
                        })}
                      >
                        <div
                          {...provided.dragHandleProps}
                          className={classes.dragHandle}
                        >
                          <IconGripVertical
                            style={{ width: 18, height: 18 }}
                            stroke={1.5}
                          />
                        </div>
                        <Checkbox
                          checked={column.getIsVisible()}
                          disabled={!column.getCanHide()}
                          onChange={column.getToggleVisibilityHandler()}
                          type="checkbox"
                          key={column.id}
                          label={column.columnDef.header as string}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <Button
            size="sm"
            fullWidth
            leftSection={<IconSettings size={14} />}
            onClick={() => {
              console.log("Reset View");
              table.resetColumnOrder();
              table.resetColumnVisibility();
            }}
          >
            Reset View
          </Button>
        </DragDropContext>
      </Popover.Dropdown>
    </Popover>
  );
};

export default NexHeaderAction;
