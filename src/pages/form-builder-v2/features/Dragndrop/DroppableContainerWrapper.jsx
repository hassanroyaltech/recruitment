import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import Box from '@mui/material/Box';

export default function Droppable({ element, children, ...props }) {
  const Element = element || Box;
  const { isOver, setNodeRef } = useDroppable({
    id: 'droppableWrapper',
  });

  return (
    <Element {...props} setNodeRef={setNodeRef} isOver={isOver}>
      {children}
    </Element>
  );
}
