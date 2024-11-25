import React, { useEffect, useReducer, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  SharedInputControl,
  SharedAPIAutocompleteControl,
} from '../../../../../../../shared';
import {
  GetAllSetupsCountries,
  getSetupsCountriesById,
  getSetupsPositionsById,
  GetAllSetupsPositions,
} from '../../../../../../../../../services';
import { DynamicFormTypesEnum } from '../../../../../../../../../enums';
import {
  GlobalSavingDateFormat,
  showError,
} from '../../../../../../../../../helpers';
import { SetupsReducer, SetupsReset } from '../../../../../../../shared/helpers';
import DatePickerComponent from '../../../../../../../../../components/Datepicker/DatePicker.Component';

export const ExperienceJobForm = ({
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
    title: '',
    description: '', // TODO: make text area
    country_uuid: '',
    responsibilities: '',
    from_date: '',
    to_date: '',
    reason_to_leave: '',
    position_uuid: '',
    media_uuids: [],
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
        title="title"
        isSubmitted={isSubmitted}
        stateKey="title"
        errorPath="title"
        onValueChanged={onStateChanged}
        editValue={state.title}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
        wrapperClasses="px-2"
      />
      <SharedAPIAutocompleteControl
        isHalfWidth
        title="position-uuid"
        errors={errors}
        isSubmitted={isSubmitted}
        stateKey="position_uuid"
        errorPath="position_uuid"
        placeholder="select-position"
        onValueChanged={onStateChanged}
        editValue={state.position_uuid || ''}
        translationPath={translationPath}
        searchKey="search"
        getDataAPI={GetAllSetupsPositions}
        getItemByIdAPI={getSetupsPositionsById}
        type={DynamicFormTypesEnum.select.key}
        parentTranslationPath={parentTranslationPath}
        getOptionLabel={(option) => option?.name?.en || ''}
        extraProps={{
          ...(state.country_uuid && { with_than: [state.country_uuid] }),
        }}
      />
      <SharedAPIAutocompleteControl
        isHalfWidth
        title="country-uuid"
        errors={errors}
        isSubmitted={isSubmitted}
        stateKey="country_uuid"
        errorPath="country_uuid"
        placeholder="select-country"
        onValueChanged={onStateChanged}
        editValue={state.country_uuid}
        translationPath={translationPath}
        searchKey="search"
        getDataAPI={GetAllSetupsCountries}
        getItemByIdAPI={getSetupsCountriesById}
        type={DynamicFormTypesEnum.select.key}
        parentTranslationPath={parentTranslationPath}
        getOptionLabel={(option) => option?.name?.en || ''}
        extraProps={{
          ...(state.country_uuid && { with_than: [state.country_uuid] }),
        }}
      />
      <div className="d-flex flex-wrap">
        <div className="w-50 w-t-50 w-p-100 px-2 mb-3">
          <DatePickerComponent
            idRef="fromDateRef"
            minDate=""
            isSubmitted={isSubmitted}
            inputPlaceholder="YYYY-MM-DD"
            value={state.from_date || ''}
            helperText={(errors.from_date && errors.from_date.message) || undefined}
            error={(errors.from_date && errors.from_date.error) || false}
            label={t(`${translationPath}from-date`)}
            onChange={(date) => {
              if (date?.value !== 'Invalid date')
                onStateChanged({ id: 'from_date', value: date.value });
              else onStateChanged({ id: 'from_date', value: null });
            }}
            displayFormat={GlobalSavingDateFormat}
            datePickerWrapperClasses="px-0 mb-0"
          />
        </div>
        <div className="w-50 w-t-50 w-p-100 px-2 mb-3">
          <DatePickerComponent
            idRef="toDateRef"
            minDate=""
            isSubmitted={isSubmitted}
            inputPlaceholder="YYYY-MM-DD"
            value={state.to_date || ''}
            helperText={(errors.to_date && errors.to_date.message) || undefined}
            error={(errors.to_date && errors.to_date.error) || false}
            label={t(`${translationPath}to-date`)}
            onChange={(date) => {
              if (date?.value !== 'Invalid date')
                onStateChanged({ id: 'to_date', value: date.value });
              else onStateChanged({ id: 'to_date', value: null });
            }}
            displayFormat={GlobalSavingDateFormat}
            datePickerWrapperClasses="px-0 mb-0"
          />
        </div>
      </div>
      <SharedInputControl
        errors={errors}
        isFullWidth
        title="description"
        isSubmitted={isSubmitted}
        stateKey="description"
        errorPath="description"
        onValueChanged={onStateChanged}
        editValue={state.description}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
        multiline
        rows={3}
        wrapperClasses="px-2"
      />
      <SharedInputControl
        errors={errors}
        isFullWidth
        title="responsibilities"
        isSubmitted={isSubmitted}
        stateKey="responsibilities"
        errorPath="responsibilities"
        onValueChanged={onStateChanged}
        editValue={state.responsibilities}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
        multiline
        rows={3}
        wrapperClasses="px-2"
      />
      <SharedInputControl
        errors={errors}
        isFullWidth
        title="reason-to-leave"
        isSubmitted={isSubmitted}
        stateKey="reason_to_leave"
        errorPath="reason_to_leave"
        onValueChanged={onStateChanged}
        editValue={state.reason_to_leave}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
        multiline
        rows={3}
        wrapperClasses="px-2"
      />
    </div>
  );
};

ExperienceJobForm.propTypes = {
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
    from_date: PropTypes.string,
    to_date: PropTypes.string,
  }),
  activeItem: PropTypes.shape({
    uuid: PropTypes.string,
  }),
  isOpenChanged: PropTypes.func,
  filter: PropTypes.shape({
    employee_uuid: PropTypes.string,
  }),
};

ExperienceJobForm.defaultProps = {
  activeItem: undefined,
  lookup: undefined,
  isOpenChanged: undefined,
  translationPath: '',
  filter: undefined,
  parentTranslationPath: '',
  isSubmitted: false,
  errors: {
    from_date: '',
    to_date: '',
  },
};
