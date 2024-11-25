import { DialogComponent } from '../../../components';
import { SetupsReducer, SetupsReset } from '../../setups/shared';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import DatePickerComponent from '../../../components/Datepicker/DatePicker.Component';

export const CustomDateFilterDialog = ({
  isOpen,
  setIsOpen,
  parentTranslationPath,
  setFilters,
  filters,
  isReturnValue,
  setSelectedDateRange,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const stateInitRef = useRef({
    from_date: null,
    to_date: null,
  });
  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );
  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  useEffect(() => {
    onStateChanged({
      id: 'edit',
      value: {
        from_date: filters.from_date,
        to_date: filters.to_date,
      },
    });
    setIsSubmitted(false);
  }, [filters]);

  return (
    <DialogComponent
      titleText="custom-date"
      // saveText={save}
      maxWidth="sm"
      dialogContent={
        <div className="d-flex flex-wrap">
          <div className="w-50">
            <DatePickerComponent
              // isHalfWidth
              datePickerWrapperClasses="px-0"
              idRef="fromDateRef"
              maxDate={
                (state.to_date && new Date(state.to_date)) || moment().toDate()
              }
              inputPlaceholder="YYYY-MM-DD"
              value={state.from_date || ''}
              parentTranslationPath={parentTranslationPath}
              label="from-date"
              onChange={(date) => {
                if (date?.value !== 'Invalid date')
                  onStateChanged({ id: 'from_date', value: date.value });
                else onStateChanged({ id: 'from_date', value: null });
              }}
              helperText={t('this-field-is-required')}
              error={!state.from_date}
              isSubmitted={isSubmitted}
            />
          </div>
          <div className="w-50 px-2">
            <DatePickerComponent
              // isHalfWidth
              datePickerWrapperClasses="px-0"
              idRef="toDateRef"
              maxDate={moment().toDate()}
              minDate={state.from_date && new Date(state.from_date)}
              inputPlaceholder="YYYY-MM-DD"
              value={state.to_date || ''}
              parentTranslationPath={parentTranslationPath}
              label="to-date"
              onChange={(date) => {
                if (date?.value !== 'Invalid date')
                  onStateChanged({ id: 'to_date', value: date.value });
                else onStateChanged({ id: 'to_date', value: null });
              }}
              helperText={t('this-field-is-required')}
              error={!state.to_date}
              isSubmitted={isSubmitted}
            />
          </div>
        </div>
      }
      isOpen={isOpen}
      isOldTheme
      onSubmit={(e) => {
        e.preventDefault();
        setSelectedDateRange(
          !state.from_date && !state.to_date ? 'default' : 'custom',
        );

        if (
          !state.from_date
          && !state.to_date
          && !filters.from_date
          && !filters.to_date
        ) {
          setIsOpen(false);
          return;
        }
        setIsSubmitted(true);
        if (
          (!state.from_date || !state.to_date)
          && !(!state.from_date && !state.to_date)
        )
          return;
        if (isReturnValue)
          setFilters({
            from_date: state.from_date,
            to_date: state.to_date,
            date_filter_type:
              !state.from_date && !state.to_date ? 'default' : 'custom',
          });
        else
          setFilters((items) => ({
            ...items,
            from_date: state.from_date,
            to_date: state.to_date,
            date_filter_type:
              !state.from_date && !state.to_date ? 'default' : 'custom',
          }));
        setIsOpen(false);
      }}
      onCloseClicked={() => {
        if (!state.from_date || !state.to_date || !isSubmitted)
          setSelectedDateRange('default');

        setIsOpen(false);
      }}
      onCancelClicked={() => {
        if (!state.from_date || !state.to_date || !isSubmitted)
          setSelectedDateRange('default');

        setIsOpen(false);
      }}
      parentTranslationPath={parentTranslationPath}
      saveIsDisabled={
        (!state.from_date || !state.to_date) && !(!state.from_date && !state.to_date)
      }
    />
  );
};

CustomDateFilterDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  setFilters: PropTypes.func.isRequired,
  filters: PropTypes.shape({
    from_date: PropTypes.string,
    to_date: PropTypes.string,
  }).isRequired,
  setSelectedDateRange: PropTypes.func.isRequired,
  isReturnValue: PropTypes.bool,
};
