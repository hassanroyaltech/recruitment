import React, { useCallback, useEffect, useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { getErrorByName, GlobalDateFormat } from '../../../../../helpers';
import { DialogComponent } from '../../../../../components';
import { SetupsReducer, SetupsReset } from '../../../../setups/shared';
import i18next from 'i18next';
import moment from 'moment';
import DatePickerComponent from '../../../../../components/Datepicker/DatePicker.Component';

export const VisaFiltersDialog = ({
  candidatesFilters,
  isOpen,
  onSave,
  isOpenChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const [state, setState] = useReducer(
    SetupsReducer,
    {
      start_date: candidatesFilters.start_date,
      end_date: candidatesFilters.end_date,
    },
    SetupsReset,
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get form errors
   */
  const getErrors = useCallback(async () => {
    const result = await getErrorByName(
      {
        current: yup.object().shape({
          start_date: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          end_date: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
        }),
      },
      state,
    );
    setErrors(result);
  }, [state, t]);

  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is sent new value for state from child
   */
  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  /**
   * @param event
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle saving the stages & pipeline template
   */
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    if (onSave) onSave(state);
    if (isOpenChanged) isOpenChanged();
  };

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  return (
    <DialogComponent
      isWithFullScreen
      titleText="filters"
      maxWidth="xs"
      contentFooterClasses="px-0 pb-0"
      contentClasses="px-3 pb-0"
      wrapperClasses="visa-used-confirm-dialog-wrapper"
      dialogContent={
        <div className="visa-used-confirm-dialog-content-wrapper px-3">
          <DatePickerComponent
            isFullWidth
            labelValue="start-date"
            inputPlaceholder={`${t('Shared:eg')} ${moment()
              .locale(i18next.language)
              .format(GlobalDateFormat)}`}
            value={state.start_date || ''}
            errors={errors}
            isSubmitted={isSubmitted}
            displayFormat={GlobalDateFormat}
            errorPath="start_date"
            stateKey="start_date"
            maxDate={(state.end_date && moment(state.end_date)) || undefined}
            onDelayedChange={onStateChanged}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
          <DatePickerComponent
            isFullWidth
            labelValue="end-date"
            inputPlaceholder={`${t('Shared:eg')} ${moment()
              .locale(i18next.language)
              .format(GlobalDateFormat)}`}
            value={state.end_date || ''}
            errors={errors}
            isSubmitted={isSubmitted}
            displayFormat={GlobalDateFormat}
            errorPath="end_date"
            stateKey="end_date"
            minDate={(state.start_date && moment(state.start_date)) || undefined}
            onDelayedChange={onStateChanged}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        </div>
      }
      isOpen={isOpen}
      onSubmit={saveHandler}
      onCancelClicked={isOpenChanged}
      onCloseClicked={isOpenChanged}
      parentTranslationPath="Shared"
    />
  );
};

VisaFiltersDialog.propTypes = {
  candidatesFilters: PropTypes.shape({
    limit: PropTypes.number,
    page: PropTypes.number,
    order_type: PropTypes.oneOf(['ASC', 'DESC']),
    order_by: PropTypes.number,
    search: PropTypes.string,
    start_date: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Object),
    ]),
    end_date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Object)]),
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  onSave: PropTypes.func,
};
VisaFiltersDialog.defaultProps = {
  onSave: undefined,
};
