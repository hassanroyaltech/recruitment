import React, { memo } from 'react';
import { Popover } from '@mui/material';
import PropTypes from 'prop-types';
import './Popover.Style.scss';

export const PopoverComponent = memo(
  ({
    component,
    idRef,
    attachedWith,
    handleClose,
    popoverClasses,
    anchorOrigin,
    transformOrigin,
    style,
    paperStyle,
    themeClass,
    withBackdrop,
  }) => {
    const open = Boolean(attachedWith);
    return (
      <Popover
        id={idRef}
        open={open}
        anchorEl={attachedWith}
        onClose={handleClose}
        anchorOrigin={anchorOrigin}
        style={style}
        transformOrigin={transformOrigin}
        PaperProps={{ style: paperStyle }}
        className={`popover-wrapper ${popoverClasses} ${themeClass || ''}${
          (withBackdrop && ' with-backdrop') || ''
        }`}
      >
        {component}
      </Popover>
    );
  },
);

PopoverComponent.displayName = 'PopoverComponent';

PopoverComponent.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.func,
    PropTypes.node,
  ]).isRequired,
  idRef: PropTypes.string.isRequired,
  attachedWith: PropTypes.instanceOf(Object),
  handleClose: PropTypes.func,
  popoverClasses: PropTypes.string,
  themeClass: PropTypes.string,
  style: PropTypes.instanceOf(Object),
  paperStyle: PropTypes.instanceOf(Object),
  anchorOrigin: PropTypes.shape({
    vertical: PropTypes.oneOf(['top', 'bottom', 'left', 'right', 'center']),
    horizontal: PropTypes.oneOf(['top', 'bottom', 'left', 'right', 'center']),
  }),
  transformOrigin: PropTypes.shape({
    vertical: PropTypes.oneOf(['top', 'bottom', 'left', 'right', 'center']),
    horizontal: PropTypes.oneOf(['top', 'bottom', 'left', 'right', 'center']),
  }),
  withBackdrop: PropTypes.bool,
};
export default PopoverComponent;
PopoverComponent.defaultProps = {
  attachedWith: undefined,
  handleClose: undefined,
  popoverClasses: '',
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'center',
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'center',
  },
  style: undefined,
  paperStyle: undefined,
  themeClass: undefined,
  withBackdrop: undefined,
};
