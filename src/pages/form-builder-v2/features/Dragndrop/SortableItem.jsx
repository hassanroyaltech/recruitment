import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import Box from '@mui/material/Box';

export default function SortableItem({ element, children, disabled, id, ...props }) {
  const Element = element || Box;
  const { setNodeRef, listeners, isDragging, transform, transition } = useSortable({
    id,
  });
  return (
    <Element
      {...props}
      ref={disabled ? undefined : setNodeRef}
      id={id}
      isDragging={isDragging}
      transition={transition}
      transform={transform}
      listeners={listeners}
    >
      {children}
    </Element>
  );
}
