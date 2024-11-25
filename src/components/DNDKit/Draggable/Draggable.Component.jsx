import { CSS } from '@dnd-kit/utilities';
import { useDraggable } from '@dnd-kit/core';
import PropTypes from 'prop-types';

const DraggableComponent = ({ id, data, disabled, getComponent }) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useDraggable({
    id,
    data,
    disabled,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
  };

  return (
    getComponent
    && getComponent(style, {
      attributes,
      isDragging,
      listeners,
      setNodeRef,
      setActivatorNodeRef,
      transform,
      transition,
    })
  );
};

DraggableComponent.propTypes = {
  id: PropTypes.string.isRequired,
  data: PropTypes.instanceOf(Object),
  disabled: PropTypes.bool,
  getComponent: PropTypes.func,
};

export default DraggableComponent;
