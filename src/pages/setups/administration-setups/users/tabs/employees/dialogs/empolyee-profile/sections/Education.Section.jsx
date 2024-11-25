import React, { useEffect, useReducer, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  SharedInputControl,
  SharedAPIAutocompleteControl,
  SharedUploaderControl,
  SharedAutocompleteControl,
} from '../../../../../../../shared';
import {
  GetAllSetupsCountries,
  getSetupsCountriesById,
  GetAllSetupsMajors,
  getSetupsMajorsById,
  GetAllSetupsUniversities,
  getSetupsUniversitiesById,
  GetSetupsDegreeTypesById,
  GetAllSetupsDegreeTypes,
  GetMultipleMedias,
} from '../../../../../../../../../services';
import {
  DynamicFormTypesEnum,
  UploaderPageEnum,
} from '../../../../../../../../../enums';
import {
  GlobalSavingDateFormat,
  showError,
} from '../../../../../../../../../helpers';
import { SetupsReducer, SetupsReset } from '../../../../../../../shared/helpers';
import DatePickerComponent from '../../../../../../../../../components/Datepicker/DatePicker.Component';

export const EducationForm = ({
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
    degree_uuid: '',
    major_uuid: '',
    university_uuid: '',
    country_uuid: '',
    gpa: '',
    from_date: '',
    to_date: '',
    note: '',
    media_uuids: [],
    media_data: [],
    employee_uuid: '',
  });
  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  /**
   * GPA mapping
   */
  const gpaDescription = [
    { id: '90', title: t(`${translationPath}excellent`) },
    { id: '80', title: t(`${translationPath}very-good`) },
    { id: '70', title: t(`${translationPath}good`) },
    { id: '60', title: t(`${translationPath}pass`) },
    { id: '50', title: t(`${translationPath}weak`) },
  ];

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
          Object.entries(res.data.results).forEach((item) => {
            onStateChanged({ id: item[0], value: item[1] });
            if (item[0] === 'media_uuids')
              item[1]?.length
                && GetMultipleMedias({ uuids: item[1] }).then((mediaData) => {
                  if (mediaData?.status === 200)
                    onStateChanged({
                      id: 'media_data',
                      value:
                        mediaData?.data?.results?.data
                        && mediaData.data.results.data.map((result) => result.original),
                    });
                  else showError(t('Shared:failed-to-get-saved-data'));
                });
          });
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
      <SharedAPIAutocompleteControl
        isHalfWidth
        title="degree-uuid"
        errors={errors}
        isSubmitted={isSubmitted}
        stateKey="degree_uuid"
        errorPath="degree_uuid"
        placeholder="select-degree"
        onValueChanged={onStateChanged}
        editValue={state.degree_uuid}
        translationPath={translationPath}
        searchKey="search"
        getDataAPI={GetAllSetupsDegreeTypes}
        getItemByIdAPI={GetSetupsDegreeTypesById}
        type={DynamicFormTypesEnum.select.key}
        parentTranslationPath={parentTranslationPath}
        getOptionLabel={(option) => option?.name?.en || ''}
        extraProps={{
          ...(state.degree_uuid && { with_than: [state.degree_uuid] }),
        }}
      />
      <SharedAPIAutocompleteControl
        isHalfWidth
        title="major-uuid"
        errors={errors}
        isSubmitted={isSubmitted}
        stateKey="major_uuid"
        errorPath="major_uuid"
        placeholder="select-major"
        onValueChanged={onStateChanged}
        editValue={state.major_uuid}
        translationPath={translationPath}
        searchKey="search"
        getDataAPI={GetAllSetupsMajors}
        getItemByIdAPI={getSetupsMajorsById}
        type={DynamicFormTypesEnum.select.key}
        parentTranslationPath={parentTranslationPath}
        getOptionLabel={(option) => option?.name?.en || ''}
        extraProps={{
          ...(state.major_uuid && { with_than: [state.major_uuid] }),
        }}
      />
      <SharedAPIAutocompleteControl
        isHalfWidth
        title="university-uuid"
        errors={errors}
        isSubmitted={isSubmitted}
        stateKey="university_uuid"
        errorPath="university_uuid"
        placeholder="select-university"
        onValueChanged={onStateChanged}
        editValue={state.university_uuid}
        translationPath={translationPath}
        searchKey="search"
        getDataAPI={GetAllSetupsUniversities}
        getItemByIdAPI={getSetupsUniversitiesById}
        type={DynamicFormTypesEnum.select.key}
        parentTranslationPath={parentTranslationPath}
        getOptionLabel={(option) => option?.name?.en || ''}
        extraProps={{
          ...(state.university_uuid && { with_than: [state.university_uuid] }),
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
      <SharedAutocompleteControl
        isHalfWidth
        editValue={state.gpa || null}
        placeholder={t(`${translationPath}select-gpa`)}
        title={t(`${translationPath}gpa`)}
        stateKey="gpa"
        onValueChanged={onStateChanged}
        initValuesKey="id"
        initValuesTitle="title"
        getOptionLabel={(option) => option.title}
        initValues={gpaDescription}
        errors={errors}
        errorPath="gpa"
        isSubmitted={isSubmitted}
      />
      <SharedInputControl
        errors={errors}
        isHalfWidth
        title="note"
        isSubmitted={isSubmitted}
        stateKey="note"
        errorPath="note"
        onValueChanged={onStateChanged}
        editValue={state.note}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
      />
      <SharedUploaderControl
        editValue={state?.media_data || []}
        onValueChanged={(uploaded) => {
          const uploadedValue = (uploaded.value?.length && uploaded.value) || [];
          onStateChanged({
            id: 'media_uuids',
            value: uploaded.value
              ? (uploadedValue.length && uploadedValue.map((val) => val.uuid))
                || uploadedValue
              : uploaded,
          });
          onStateChanged({
            id: 'media_data',
            value: uploadedValue,
          });
        }}
        stateKey="media_data"
        labelValue="media-uuids"
        isSubmitted={isSubmitted}
        errors={errors}
        errorPath="media_data"
        labelClasses="theme-primary"
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        fileTypeText="files"
        isFullWidth
        uploaderPage={UploaderPageEnum.EmployeeProfile}
        multiple
      />
    </div>
  );
};

EducationForm.propTypes = {
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

EducationForm.defaultProps = {
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
