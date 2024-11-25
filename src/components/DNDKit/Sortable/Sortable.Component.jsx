import { useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const animateLayoutChanges = ({ isSorting, wasDragging }) =>
  !(isSorting || wasDragging);
const SortableComponent = ({ id, data, getUseSortable, getComponent }) => {
  const {
    attributes,
    isDragging,
    isSorting,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
    data,
    animateLayoutChanges,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    if (getUseSortable)
      getUseSortable({
        attributes,
        isDragging,
        isSorting,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
      });
  }, [
    attributes,
    getUseSortable,
    isDragging,
    isSorting,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  ]);

  return (
    getComponent
    && getComponent(style, {
      attributes,
      isDragging,
      isSorting,
      listeners,
      setNodeRef,
      setActivatorNodeRef,
      transform,
      transition,
    })
  );
};

SortableComponent.propTypes = {
  id: PropTypes.string.isRequired,
  data: PropTypes.instanceOf(Object),
  getUseSortable: PropTypes.func,
  getComponent: PropTypes.func,
};

export default memo(SortableComponent);
