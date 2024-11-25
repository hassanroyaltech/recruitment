import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Paper } from '@mui/material';
import React, { useState } from 'react';
import SimpleSortableItem from './SimpleSortable.Item';
import PropTypes from 'prop-types';

export const SimpleSortable = ({ element, data, setDataOrder }) => {
  const [activeId, setActiveId] = useState(null);

  const sensors = [useSensor(PointerSensor)];

  const handleDragStart = ({ active }) => {
    setActiveId(active);
  };

  const handleDragEnd = ({ active, over }) => {
    if (active.id !== over.id) {
      const oldIndex = data.findIndex((item) => item.id === active.id);
      const newIndex = data.findIndex((item) => item.id === over.id);
      const newOrder = arrayMove(data, oldIndex, newIndex);
      setDataOrder(newOrder);
    }
    setActiveId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      <SortableContext
        items={data.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        {data.map((item, index) => (
          <SimpleSortableItem
            key={`SimpleSortableItemKey${item.id}`}
            item={item}
            id={item.id}
            element={element}
            activeId={activeId}
            index={index}
          />
        ))}
        <DragOverlay>
          {activeId ? (
            <Paper elevation={3} sx={{ padding: '0.5rem' }}>
              {element({
                ...data.find((item) => activeId.id === item.id),
                activeId,
              })}
            </Paper>
          ) : null}
        </DragOverlay>
      </SortableContext>
    </DndContext>
  );
};

SimpleSortable.propTypes = {
  element: PropTypes.func,
  data: PropTypes.array,
  setDataOrder: PropTypes.func,
};

SimpleSortable.defaultProps = {
  element: undefined,
  data: [],
  setDataOrder: undefined,
};
