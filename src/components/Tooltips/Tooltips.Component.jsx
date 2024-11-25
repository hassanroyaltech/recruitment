import React, { memo, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import Zoom from '@mui/material/Zoom';
import Fade from '@mui/material/Fade';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import './Tooltips.Style.scss';

export const TooltipsComponent = memo(
  ({
    title,
    contentComponent,
    parentTranslationPath,
    translationPath,
    transition,
    enterDelay,
    leaveDelay,
    arrow,
    isDisabled,
    isDisabledArrow,
    isOpen,
    onOpen,
    onClose,
    onClick,
    placement,
    titleComponent,
    tooltipOpenControlled,
    tooltipCloseControlled,
  }) => {
    const { t } = useTranslation(parentTranslationPath);
    const [localIsOpen, setLocalIsOpen] = useState(
      typeof isOpen === 'undefined' ? false : isOpen,
    );
    const getCurrentTransition = () => {
      if (transition === 'zoom') return Zoom;
      if (transition === 'fade') return Fade;
      return undefined;
    };

    /**
     * @param newValue - boolean value
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description this method is to control the open and close from local
     */
    const localControl = useCallback(
      (newValue) => () => {
        setLocalIsOpen(newValue);
      },
      [],
    );

    return (
      <Tooltip
        className="tooltip-wrapper"
        open={typeof isOpen === 'undefined' ? localIsOpen : isOpen}
        onClose={onClose}
        onOpen={onOpen}
        onClick={onClick}
        TransitionComponent={getCurrentTransition()}
        title={
          titleComponent
          || (title
            && translationPath !== undefined
            && t(`${translationPath}${title}`))
          || title
          || ''
        }
        PopperProps={{
          className:
            'MuiTooltip-popper MuiTooltip-popperArrow tooltip-popover-wrapper',
        }}
        enterDelay={enterDelay}
        leaveDelay={leaveDelay}
        arrow={arrow && !isDisabledArrow}
        disableFocusListener={isDisabled}
        disableHoverListener={isDisabled}
        disableTouchListener={isDisabled}
        onFocus={
          tooltipOpenControlled
            ? tooltipOpenControlled
            : (typeof isOpen === 'undefined' && localControl(true)) || undefined
        }
        onMouseOut={
          tooltipCloseControlled
            ? tooltipCloseControlled
            : (typeof isOpen === 'undefined' && localControl(false)) || undefined
        }
        onMouseOver={
          tooltipCloseControlled
            ? tooltipCloseControlled
            : (typeof isOpen === 'undefined' && localControl(true)) || undefined
        }
        onBlur={
          tooltipCloseControlled
            ? tooltipCloseControlled
            : (typeof isOpen === 'undefined' && localControl(false)) || undefined
        }
        placement={
          (placement
            && placement === 'left-reversed'
            && ((i18next.dir() === 'rtl' && 'right') || 'left'))
          || (placement
            && placement === 'right-reversed'
            && ((i18next.dir() === 'rtl' && 'left') || 'right'))
          || placement
          || undefined
        }
      >
        {contentComponent}
      </Tooltip>
    );
  },
);

TooltipsComponent.displayName = 'TooltipsComponent';

TooltipsComponent.propTypes = {
  enterDelay: PropTypes.number,
  leaveDelay: PropTypes.number,
  contentComponent: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.func,
    PropTypes.node,
  ]),
  titleComponent: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.func,
    PropTypes.node,
  ]),
  title: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
  arrow: PropTypes.bool,
  isDisabledArrow: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isOpen: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  onClick: PropTypes.func,
  tooltipOpenControlled: PropTypes.func,
  tooltipCloseControlled: PropTypes.func,
  transition: PropTypes.oneOf(['zoom', 'fade', 'off']),
  placement: PropTypes.oneOf([
    'bottom-end',
    'bottom-start',
    'bottom',
    'left-end',
    'left-start',
    'left',
    'right-end',
    'right-start',
    'right',
    'top-end',
    'top-start',
    'top',
    'left-reversed',
    'right-reversed',
  ]),
};
TooltipsComponent.defaultProps = {
  enterDelay: 300,
  leaveDelay: 300,
  transition: 'zoom',
  title: undefined,
  titleComponent: '',
  contentComponent: undefined,
  parentTranslationPath: undefined,
  translationPath: undefined,
  isOpen: undefined,
  arrow: true,
  isDisabledArrow: false,
  isDisabled: false,
  onOpen: undefined,
  onClose: undefined,
  onClick: undefined,
  placement: 'top',
};
