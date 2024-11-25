import { DialogComponent, PopoverComponent } from '../../../components';
import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { AnalyticsChartTypesEnum } from '../../../enums';
import { ButtonBase } from '@mui/material';

export const WidgetChartTypeDialog = ({
  isOpen,
  setIsOpen,
  isLoading,
  widget_edit_data,
  // widgetIndex,
  isChartLoading,
  setIsChartLoading,
  updateWidgetDataHandler,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [popoverAttachedWith, setPopoverAttachedWith] = useState(null);
  const [chartTypeValue, setCharTypeValue] = useState('');

  const GetChartTypeHandler = useMemo(
    () =>
      chartTypeValue
      && Object.values(AnalyticsChartTypesEnum).find(
        (item) => chartTypeValue === item.value,
      ).icon,
    [chartTypeValue],
  );

  useEffect(() => {
    setCharTypeValue(widget_edit_data.chart_type);
  }, [widget_edit_data]);

  return (
    <DialogComponent
      titleText="change-chart-type"
      maxWidth="sm"
      dialogContent={
        <div className="d-flex-column my-4">
          <ButtonBase
            className="btns btn-outline-light theme-outline"
            onClick={(e) => setPopoverAttachedWith(e.target)}
          >
            <span className={GetChartTypeHandler} />
            <span className="mx-2 py-2">{t(chartTypeValue)}</span>
          </ButtonBase>
          <PopoverComponent
            idRef="chart-type-ref"
            attachedWith={popoverAttachedWith}
            handleClose={() => setPopoverAttachedWith(null)}
            component={
              <div className="d-flex-column p-2 w-100">
                {Object.values(AnalyticsChartTypesEnum)
                  .filter(
                    (it) =>
                      it.value !== AnalyticsChartTypesEnum.CARD.value
                      && it.value !== AnalyticsChartTypesEnum.MULTIPLE_CARDS.value,
                  )
                  .map((chartType, idx) => (
                    <ButtonBase
                      key={`${idx}-${chartType.key}-popover-chartType`}
                      className="btns theme-transparent m-2"
                      onClick={() => {
                        setCharTypeValue(chartType.value);
                        setPopoverAttachedWith(null);
                      }}
                      style={{
                        justifyContent: 'start',
                      }}
                    >
                      <span className={chartType.icon} />
                      <span className="px-2 mx-2">{t(chartType.value)}</span>
                    </ButtonBase>
                  ))}
              </div>
            }
          />
        </div>
      }
      isSaving={isLoading || isChartLoading}
      isOpen={isOpen}
      isOldTheme
      onSaveClicked={(e) => {
        e.preventDefault();
        updateWidgetDataHandler({
          widget_edit_data,
          // widgetIndex,
          updatedData: { chart_type: chartTypeValue },
          closeDialogHandler: () => setIsOpen(false),
          setIsChartLoading,
        });
      }}
      onCloseClicked={() => setIsOpen(false)}
      onCancelClicked={() => setIsOpen(false)}
      parentTranslationPath={parentTranslationPath}
    />
  );
};

WidgetChartTypeDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  widget_edit_data: PropTypes.shape({
    chart_type: PropTypes.string,
  }).isRequired,
  // widgetIndex: PropTypes.number.isRequired,
  updateWidgetDataHandler: PropTypes.func.isRequired,
  isChartLoading: PropTypes.bool,
  setIsChartLoading: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
};
