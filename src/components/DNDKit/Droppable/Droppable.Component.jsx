import { memo } from 'react';
import PropTypes from 'prop-types';
import { useDroppable } from '@dnd-kit/core';

const DroppableComponent = ({ id, data, getComponent }) => {
  const { setNodeRef } = useDroppable({
    id,
    data,
  });
  return getComponent && getComponent({ setDroppableNodeRef: setNodeRef });
};

DroppableComponent.propTypes = {
  id: PropTypes.string.isRequired,
  getComponent: PropTypes.func.isRequired,
  data: PropTypes.instanceOf(Object),
};

export default memo(DroppableComponent);
