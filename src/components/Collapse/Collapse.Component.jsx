import React, { memo, useRef } from 'react';
import Collapse from '@mui/material/Collapse';
import PropTypes from 'prop-types';
import { useOnClickOutside } from '../../hooks';

export const CollapseComponent = memo(
  ({
    isOpen,
    top,
    component,
    onClickOutside,
    wrapperClasses,
    isCentered,
    onExit,
    orientation,
    collapsedSize,
    style,
  }) => {
    const collapseRef = useRef(null);
    useOnClickOutside(collapseRef, onClickOutside);
    return (
      <Collapse
        in={isOpen}
        ref={collapseRef}
        className={`collapse-wrapper${
          (wrapperClasses && ` ${wrapperClasses}`) || ''
        }${isCentered ? ' is-centered' : ''}`}
        style={{ top, ...(style || {}) }}
        onExit={onExit}
        orientation={orientation}
        collapsedSize={collapsedSize}
      >
        {component}
      </Collapse>
    );
  },
);
CollapseComponent.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  component: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.func,
    PropTypes.node,
  ]).isRequired,
  onClickOutside: PropTypes.func,
  onExit: PropTypes.func,
  top: PropTypes.number,
  wrapperClasses: PropTypes.string,
  isCentered: PropTypes.bool,
  style: PropTypes.object,
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  collapsedSize: PropTypes.number,
};
CollapseComponent.defaultProps = {
  onClickOutside: () => {},
  top: undefined,
  orientation: undefined,
  collapsedSize: undefined,
  onExit: undefined,
  wrapperClasses: undefined,
  style: undefined,
  isCentered: false,
};
CollapseComponent.displayName = 'Collapse Component';
