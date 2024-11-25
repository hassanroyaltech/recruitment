import { useSortable } from '@dnd-kit/sortable';
import React from 'react';
import PropTypes from 'prop-types';

const SimpleSortableItem = ({ id, element, item, activeId }) => {
  const { setNodeRef, attributes, listeners } = useSortable({ id: id });

  return (
    <div
      style={{ width: '100%' }}
      ref={setNodeRef}
      {...attributes}
      // {...listeners}
    >
      {element({ ...item, activeId, listeners })}
    </div>
  );
};

export default SimpleSortableItem;

SimpleSortableItem.propTypes = {
  element: PropTypes.func,
  id: PropTypes.shape({}),
  item: PropTypes.shape({}),
  activeId: PropTypes.shape({}),
};

SimpleSortableItem.defaultProps = {
  element: undefined,
  id: undefined,
  item: undefined,
  activeId: undefined,
};
