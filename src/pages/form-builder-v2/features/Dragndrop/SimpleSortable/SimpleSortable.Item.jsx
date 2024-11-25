import { useSortable } from '@dnd-kit/sortable';
import React from 'react';
import PropTypes from 'prop-types';

const SimpleSortableItem = ({ id, element, item, activeId, index }) => {
  const { setNodeRef, attributes, listeners } = useSortable({ id: id });

  return (
    <div
      style={{ width: '100%' }}
      ref={setNodeRef}
      {...attributes}
      // {...listeners}
    >
      {element({ ...item, activeId, listeners }, index)}
    </div>
  );
};

export default SimpleSortableItem;

SimpleSortableItem.propTypes = {
  element: PropTypes.func,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.shape({})]),
  item: PropTypes.shape({}),
  activeId: PropTypes.shape({}),
  index: PropTypes.number,
};

SimpleSortableItem.defaultProps = {
  element: undefined,
  id: undefined,
  item: undefined,
  activeId: undefined,
  index: undefined,
};
