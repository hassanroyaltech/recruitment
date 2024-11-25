import React, { useEffect, useReducer, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { SharedInputControl } from '../../../../../../../shared';
import {
  GlobalSavingDateFormat,
  showError,
} from '../../../../../../../../../helpers';
import { SetupsReducer, SetupsReset } from '../../../../../../../shared/helpers';
import DatePickerComponent from '../../../../../../../../../components/Datepicker/DatePicker.Component';

export const MedicalProfileForm = ({
  lookup,
  translationPath,
  parentTranslationPath,
  setStateFunc,
  isSubmitted,
  setIsLoading,
  errors,
  activeItem,
  isOpenChanged,
  filter,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const stateInitRef = useRef({
    medical_case: '',
    date: '',
    note: '',
    employee_uuid: '',
  });
  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is send new value for state from child
   */
  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  const onSetEditValues = useCallback(() => {
    lookup.viewAPI({ uuid: activeItem.uuid }).then((res) => {
      if (res && res.status === 200) {
        if (res.data?.results)
          Object.entries(res.data.results).forEach((item) =>
            onStateChanged({ id: item[0], value: item[1] }),
          );
        else showError(t('Shared:failed-to-get-saved-data'), res);
        setIsLoading(false);
      } else {
        showError(t('Shared:failed-to-get-saved-data'), res);
        setIsLoading(false);
        isOpenChanged();
      }
    });
  }, [activeItem, lookup, isOpenChanged, setIsLoading, t]);

  useEffect(() => {
    if (filter?.employee_uuid)
      onStateChanged({ id: 'employee_uuid', value: filter.employee_uuid });
  }, [filter]);

  useEffect(() => {
    setStateFunc(state);
  }, [state, setStateFunc]);

  useEffect(() => {
    activeItem && onSetEditValues();
  }, [activeItem, onSetEditValues]);

  return (
    <div>
      <SharedInputControl
        errors={errors}
        isFullWidth
        title="medical-case"
        isSubmitted={isSubmitted}
        stateKey="medical_case"
        errorPath="medical_case"
        onValueChanged={onStateChanged}
        editValue={state.medical_case}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
        wrapperClasses="px-2"
      />
      <div className="w-t-50 w-p-100 px-2 mb-3">
        <DatePickerComponent
          idRef="dateRef"
          minDate=""
          isSubmitted={isSubmitted}
          inputPlaceholder="YYYY-MM-DD"
          value={state.date || ''}
          helperText={(errors.date && errors.date.message) || undefined}
          error={(errors.date && errors.date.error) || false}
          label={t(`${translationPath}date`)}
          onChange={(date) => {
            if (date?.value !== 'Invalid date')
              onStateChanged({ id: 'date', value: date.value });
            else onStateChanged({ id: 'date', value: null });
          }}
          displayFormat={GlobalSavingDateFormat}
          datePickerWrapperClasses="px-0 mb-0"
        />
      </div>
      <SharedInputControl
        errors={errors}
        isFullWidth
        title="note"
        isSubmitted={isSubmitted}
        stateKey="note"
        errorPath="note"
        onValueChanged={onStateChanged}
        editValue={state.note}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
        multiline
        rows={3}
        wrapperClasses="px-2"
      />
    </div>
  );
};

MedicalProfileForm.propTypes = {
  lookup: PropTypes.shape({
    key: PropTypes.number,
    label: PropTypes.string,
    valueSingle: PropTypes.string,
    feature_name: PropTypes.string,
    updateAPI: PropTypes.func,
    createAPI: PropTypes.func,
    viewAPI: PropTypes.func,
    listAPI: PropTypes.func,
    deleteAPI: PropTypes.func,
  }),
  translationPath: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  setStateFunc: PropTypes.func.isRequired,
  isSubmitted: PropTypes.bool,
  setIsLoading: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    date: PropTypes.string,
  }),
  activeItem: PropTypes.shape({
    uuid: PropTypes.string,
  }),
  isOpenChanged: PropTypes.func,
  filter: PropTypes.shape({
    employee_uuid: PropTypes.string,
  }),
};

MedicalProfileForm.defaultProps = {
  activeItem: undefined,
  lookup: undefined,
  isOpenChanged: undefined,
  translationPath: '',
  filter: undefined,
  parentTranslationPath: '',
  isSubmitted: false,
  errors: {
    date: '',
  },
};
