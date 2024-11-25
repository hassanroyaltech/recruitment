import React from 'react';
import { useSortable, defaultAnimateLayoutChanges } from '@dnd-kit/sortable';
import Box from '@mui/material/Box';

const animateLayoutChanges = (args) =>
  args.isSorting || args.wasDragging ? defaultAnimateLayoutChanges(args) : true;

export default function DroppableContainer({
  element,
  children,
  id,
  items,
  ...props
}) {
  const Element = element || Box;
  const {
    over,
    active,
    attributes,
    listeners,
    setNodeRef,
    isDragging,
    transform,
    transition,
  } = useSortable({
    id,
    data: {
      type: 'container',
    },
    animateLayoutChanges,
  });
  const isOverContainer = over
    ? (id === over.id && active?.data.current?.type === 'card')
      || items.includes(over.id)
    : undefined;
  return (
    <Element
      {...props}
      ref={setNodeRef}
      isDragging={isDragging}
      transform={transform}
      isOverContainer={isOverContainer}
      transition={transition}
      handleProps={{
        ...attributes,
        ...listeners,
      }}
      containerId={id}
    >
      {children}
    </Element>
  );
}
