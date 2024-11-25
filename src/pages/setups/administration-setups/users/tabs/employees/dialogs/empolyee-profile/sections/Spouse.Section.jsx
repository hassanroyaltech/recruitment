import React, { useEffect, useReducer, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  SharedInputControl,
  SharedAPIAutocompleteControl,
} from '../../../../../../../shared';
import {
  GetAllSetupsNationality,
  getSetupsNationalityById,
} from '../../../../../../../../../services';
import { DynamicFormTypesEnum } from '../../../../../../../../../enums';
import { SwitchComponent } from '../../../../../../../../../components/Switch/Switch.Component';
import {
  GlobalSavingDateFormat,
  showError,
} from '../../../../../../../../../helpers';
import { SetupsReducer, SetupsReset } from '../../../../../../../shared/helpers';
import DatePickerComponent from '../../../../../../../../../components/Datepicker/DatePicker.Component';

export const SpouseForm = ({
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
    name: '',
    nationality_uuid: '',
    birth_date: '',
    marriage_date: '',
    national_number: '',
    passport_number: '',
    is_worker: false,
    company_name: '',
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
    if (activeItem) onSetEditValues();
  }, [activeItem, onSetEditValues]);

  return (
    <div>
      <SwitchComponent
        label="is-worker"
        idRef="CurrentSwitchRef"
        isChecked={state.is_worker}
        translationPath={translationPath}
        onChange={() => onStateChanged({ id: 'is_worker', value: !state.is_worker })}
        parentTranslationPath={parentTranslationPath}
      />
      <SharedInputControl
        errors={errors}
        isHalfWidth
        title="name"
        isSubmitted={isSubmitted}
        stateKey="name"
        errorPath="name"
        onValueChanged={onStateChanged}
        editValue={state.name}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
      />
      <div className="w-t-50 w-p-100 px-2 mb-3">
        <DatePickerComponent
          idRef="birthDateRef"
          minDate=""
          isSubmitted={isSubmitted}
          inputPlaceholder="YYYY-MM-DD"
          value={state.birth_date || ''}
          helperText={(errors.birth_date && errors.birth_date.message) || undefined}
          error={(errors.birth_date && errors.birth_date.error) || false}
          label={t(`${translationPath}birth-date`)}
          onChange={(date) => {
            if (date?.value !== 'Invalid date')
              onStateChanged({ id: 'birth_date', value: date.value });
            else onStateChanged({ id: 'birth_date', value: null });
          }}
          displayFormat={GlobalSavingDateFormat}
          datePickerWrapperClasses="px-0 mb-0"
        />
      </div>
      <div className="w-t-50 w-p-100 px-2 mb-3">
        <DatePickerComponent
          idRef="marriageDateRef"
          minDate=""
          isSubmitted={isSubmitted}
          inputPlaceholder="YYYY-MM-DD"
          value={state.marriage_date || ''}
          helperText={
            (errors.marriage_date && errors.marriage_date.message) || undefined
          }
          error={(errors.marriage_date && errors.marriage_date.error) || false}
          label={t(`${translationPath}marriage-date`)}
          onChange={(date) => {
            if (date?.value !== 'Invalid date')
              onStateChanged({ id: 'marriage_date', value: date.value });
            else onStateChanged({ id: 'marriage_date', value: null });
          }}
          displayFormat={GlobalSavingDateFormat}
          datePickerWrapperClasses="px-0 mb-0"
        />
      </div>
      <SharedAPIAutocompleteControl
        isHalfWidth
        title="nationality-uuid"
        errors={errors}
        isSubmitted={isSubmitted}
        stateKey="nationality_uuid"
        errorPath="nationality_uuid"
        placeholder="select-nationality"
        onValueChanged={onStateChanged}
        editValue={state.nationality_uuid}
        translationPath={translationPath}
        searchKey="search"
        getDataAPI={GetAllSetupsNationality}
        getItemByIdAPI={getSetupsNationalityById}
        type={DynamicFormTypesEnum.select.key}
        parentTranslationPath={parentTranslationPath}
        getOptionLabel={(option) => option?.name?.en || ''}
        extraProps={{
          ...(state.nationality_uuid && { with_than: [state.nationality_uuid] }),
        }}
      />
      <SharedInputControl
        errors={errors}
        isHalfWidth
        title="national-number"
        isSubmitted={isSubmitted}
        stateKey="national_number"
        errorPath="national_number"
        onValueChanged={onStateChanged}
        editValue={state.national_number}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
      />
      <SharedInputControl
        errors={errors}
        isHalfWidth
        title="passport-number"
        isSubmitted={isSubmitted}
        stateKey="passport_number"
        errorPath="passport_number"
        onValueChanged={onStateChanged}
        editValue={state.passport_number}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
      />
      <SharedInputControl
        errors={errors}
        isHalfWidth
        title="company-name"
        isSubmitted={isSubmitted}
        stateKey="company_name"
        errorPath="company_name"
        onValueChanged={onStateChanged}
        editValue={state.company_name}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
      />
    </div>
  );
};

SpouseForm.propTypes = {
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
    birth_date: PropTypes.string,
    marriage_date: PropTypes.string,
  }),
  activeItem: PropTypes.shape({
    uuid: PropTypes.string,
  }),
  isOpenChanged: PropTypes.func,
  filter: PropTypes.shape({
    employee_uuid: PropTypes.string,
  }),
};

SpouseForm.defaultProps = {
  activeItem: undefined,
  lookup: undefined,
  isOpenChanged: undefined,
  translationPath: '',
  filter: undefined,
  parentTranslationPath: '',
  isSubmitted: false,
  errors: {
    birth_date: '',
    marriage_date: '',
  },
};
