import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { TooltipsComponent } from '../../../Tooltips/Tooltips.Component';
import { ButtonBase } from '@mui/material';
import { SystemActionsEnum } from '../../../../enums';
import { useTranslation } from 'react-i18next';
import PopoverComponent from '../../../Popover/Popover.Component';
import './ActionsPopover.Style.scss';

export const ActionsPopoverSection = ({
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
  const { t } = useTranslation(parentTranslationPath);
  const [popoverTooltip, setPopoverTooltip] = useState(-1);
  const [activeTooltip, setActiveTooltip] = useState({
    actionIndex: -1,
    rowIndex: -1,
  });
  const [popoverAttachedWith, setPopoverAttachedWith] = useState(null);

  /**
   * @param event
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the toggle for the actions popover
   */
  const popoverToggleHandler = useCallback((event = null) => {
    setPopoverAttachedWith((event && event.currentTarget) || null);
  }, []);

  return (
    <div className="actions-popover-section">
      <div className="d-inline-flex">
        <TooltipsComponent
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isOpen={popoverTooltip === rowIndex}
          titleComponent={
            (tableActionsOptions.label
              && t(`${translationPath}${tableActionsOptions.label}`))
            || t('Shared:actions')
          }
          placement={tooltipPlacement}
          contentComponent={
            <ButtonBase
              disabled={isDisabledActions}
              onClick={popoverToggleHandler}
              onMouseOver={() => setPopoverTooltip(rowIndex)}
              onMouseOut={() => setPopoverTooltip(-1)}
              className={`btns-icon theme-transparent c-gray-primary mx-1`}
            >
              <span className="fas fa-ellipsis-h" />
            </ButtonBase>
          }
        />
      </div>

      <PopoverComponent
        idRef="tableActionsPopoverRef"
        attachedWith={popoverAttachedWith}
        handleClose={() => popoverToggleHandler(null)}
        popoverClasses="table-actions-popover-wrapper"
        component={
          <div className="table-actions-wrapper">
            {tableActions.map((item, actionIndex, items) => (
              <div
                className="actions-popover-item"
                key={`${item.key}-${rowIndex + 1}`}
              >
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
                    <>
                      <ButtonBase
                        disabled={
                          (tableActionsOptions
                            && tableActionsOptions.getDisabledAction
                            && tableActionsOptions.getDisabledAction(
                              row,
                              rowIndex,
                              item,
                            ))
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
                        className="btns theme-transparent mx-0 actions-popover-btn"
                      >
                        <span className={item.icon} />
                        <span className="px-2">
                          {(tableActionsOptions.getActionTitle
                            && tableActionsOptions.getActionTitle({
                              row,
                              rowIndex,
                              actionEnum: item,
                            }))
                            || t(item.value)
                            || ''}
                        </span>
                      </ButtonBase>
                      {actionIndex < items.length - 1 && (
                        <div className="separator-h" />
                      )}
                    </>
                  }
                />
              </div>
            ))}
          </div>
        }
      />
    </div>
  );
};

ActionsPopoverSection.propTypes = {
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
  isDisabledActions: PropTypes.bool,
  rowIndex: PropTypes.number.isRequired,
  onActionClickedHandler: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};
ActionsPopoverSection.defaultProps = {
  translationPath: '',
  isDisabledActions: undefined,
};
