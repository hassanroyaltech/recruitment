import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Popper, Fade, Button } from '@mui/material';
import { GlobalHistory } from '../../helpers';
import './NoPermissionComponent.scss';

export const NoPermissionComponent = ({
  anchorEl,
  popperOpen,
  setAnchorEl,
  setPopperOpen,
  placement,
  themeColor,
}) => {
  const { t } = useTranslation('Shared');
  const menuItemHistory = localStorage.getItem('menuItemHistory');

  const onPopperClose = () => {
    setPopperOpen(false);
    setAnchorEl(null);
  };

  return (
    <Popper
      transition
      open={popperOpen}
      anchorEl={anchorEl}
      placement={placement}
      className="no-permission-component-wrapper"
    >
      <Fade in={popperOpen}>
        <div
          onMouseLeave={onPopperClose}
          className="no-permission-component-content"
        >
          {/* <div className="permission-arrow" /> */}
          <div
            className={`permission-title-wrapper 
             ${
    themeColor
               || (menuItemHistory === 'assessment' ? 'is-assessment' : '')
    }`}
          >
            <i className="fas fa-info-circle pr-3-reversed" />
            <div className="permission-title">
              {t('you-dont-have-access-please-upgrade-your-plan')}
            </div>
          </div>
          <div
            className={`no-permission-action 
              ${
    themeColor || menuItemHistory === 'assessment' ? 'is-assessment' : ''
    }`}
          >
            <Button
              onClick={() =>
                GlobalHistory.push(
                  `/recruiter/billing/billing-plans?id=${menuItemHistory}`,
                )
              }
            >
              {t('upgrade-your-plan')}
            </Button>
          </div>
        </div>
      </Fade>
    </Popper>
  );
};

NoPermissionComponent.propTypes = {
  anchorEl: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.func,
    PropTypes.node,
    PropTypes.object,
  ]),
  placement: PropTypes.string,
  themeColor: PropTypes.string,
  popperOpen: PropTypes.bool.isRequired,
  setAnchorEl: PropTypes.func.isRequired,
  setPopperOpen: PropTypes.func.isRequired,
};

NoPermissionComponent.defaultProps = {
  placement: 'bottom',
  anchorEl: undefined,
  themeColor: '',
};

export default NoPermissionComponent;
