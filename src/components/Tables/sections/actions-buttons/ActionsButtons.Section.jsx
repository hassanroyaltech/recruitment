import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TooltipsComponent } from '../../../Tooltips/Tooltips.Component';
import { ButtonBase } from '@mui/material';
import { SystemActionsEnum } from '../../../../enums';

export const ActionsButtonsSection = ({
  tableActions,
  tooltipPlacement,
  row,
  tableActionsOptions,
  isDisabledActions,
  rowIndex,
  onActionClickedHandler,
  parentTranslationPath,
  translationPath,
}) => {
  const [activeTooltip, setActiveTooltip] = useState({
    rowIndex: -1,
    actionIndex: -1,
  });

  return (
    <div className="actions-buttons-section">
      {tableActions.map((item, actionIndex) => (
        <div className="d-inline-flex" key={`${item.key}-${rowIndex + 1}`}>
          <TooltipsComponent
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            isOpen={
              activeTooltip.rowIndex === rowIndex
              && activeTooltip.actionIndex === actionIndex
            }
            titleComponent={
              tableActionsOptions.tooltipTitle
              || (tableActionsOptions.getTooltipTitle
                && tableActionsOptions.getTooltipTitle({
                  row,
                  rowIndex,
                  actionEnum: item,
                }))
            }
            placement={tooltipPlacement}
            contentComponent={
              <ButtonBase
                disabled={
                  (tableActionsOptions
                    && tableActionsOptions.getDisabledAction
                    && tableActionsOptions.getDisabledAction(row, rowIndex, item))
                  || isDisabledActions
                }
                onClick={onActionClickedHandler(item, row, rowIndex)}
                onMouseOver={() =>
                  setActiveTooltip({
                    actionIndex,
                    rowIndex,
                  })
                }
                onMouseOut={() =>
                  setActiveTooltip({
                    actionIndex: -1,
                    rowIndex: -1,
                  })
                }
                className={`btns-icon theme-transparent mx-1 ${item.color || ''}`}
              >
                <span className={item.icon} />
              </ButtonBase>
            }
          />
        </div>
      ))}
    </div>
  );
};

ActionsButtonsSection.propTypes = {
  tableActions: PropTypes.arrayOf(
    PropTypes.oneOf(Object.values(SystemActionsEnum).map((item) => item)),
  ).isRequired,
  row: PropTypes.instanceOf(Object).isRequired,
  tooltipPlacement: PropTypes.oneOf([
    'top-start',
    'top',
    'top-end',
    'left-start',
    'left',
    'left-end',
    'right-start',
    'right',
    'right-end',
    'bottom-start',
    'bottom',
    'bottom-end',
  ]),
  tableActionsOptions: PropTypes.shape({
    label: PropTypes.string,
    cellClasses: PropTypes.string,
    isSticky: PropTypes.bool,
    left: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    right: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    isResizable: PropTypes.bool,
    headerComponent: PropTypes.oneOfType([
      PropTypes.elementType,
      PropTypes.func,
      PropTypes.node,
    ]),
    component: PropTypes.oneOfType([
      PropTypes.elementType,
      PropTypes.func,
      PropTypes.node,
    ]),
    getDisabledAction: PropTypes.func,
    getTooltipTitle: PropTypes.func,
    getActionTitle: PropTypes.func,
    tooltipTitle: PropTypes.oneOfType([
      PropTypes.elementType,
      PropTypes.func,
      PropTypes.string,
      PropTypes.node,
    ]),
  }).isRequired,
  isDisabledActions: PropTypes.bool.isRequired,
  rowIndex: PropTypes.number.isRequired,
  onActionClickedHandler: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};
ActionsButtonsSection.defaultProps = {
  translationPath: '',
};
