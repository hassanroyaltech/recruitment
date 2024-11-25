import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { useSelector } from 'react-redux';
import moment from 'moment';
import {
  getErrorByName,
  GlobalSavingDateFormat,
  showError,
  showSuccess,
} from '../../../../../../helpers';
import {
  SetupsReducer,
  SetupsReset,
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../../shared';
import { DialogComponent, SwitchComponent } from '../../../../../../components';
import {
  CreateSetupsPositions,
  getSetupsPositionsById,
  UpdateSetupsPositions,
  GetAllSetupsContractTypes,
  getSetupsContractTypesById,
  GetSetupsCareerLevelsById,
  GetAllSetupsCareerLevels,
  GetAllSetupsIndustries,
  GetSetupsIndustriesById,
  GetAllSetupsNationality,
  getSetupsNationalityById,
  GetAllSetupsJobMajors,
  GetSetupsJobMajorsById,
  GetAllSetupsDegreeTypes,
  GetSetupsDegreeTypesById,
  GetAllSetupsSkills,
  GetSetupsSkillById,
  GetAllSetupsCurrencies,
  GetSetupsCurrenciesById,
  getSetupsHierarchy,
  GetAllSetupsPositionsTitle,
  getSetupsPositionTitleById,
  GetAllSetupsJobsTitles,
  getSetupsJobsTitlesById,
  GetAllSetupsUsers,
} from '../../../../../../services';
import {
  DynamicFormTypesEnum,
  SetupsYearsOfExperiencesEnum,
} from '../../../../../../enums';
import {
  numbersExpression,
  numericAndAlphabeticalAndSpecialExpression,
} from '../../../../../../utils';
import { TextEditorControls } from '../../../../../evabrand/dialogs/shared/contols-for-sections/controls';
import DatePickerComponent from '../../../../../../components/Datepicker/DatePicker.Component';
import { array, number, object, ref, string } from 'yup';

export const PositionsManagementDialog = ({
  activeItem,
  isOpen,
  onSave,
  isOpenChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [yearsOfExperiencesEnum] = useState(() =>
    Object.values(SetupsYearsOfExperiencesEnum),
  );
  const [, setLanguages] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const userReducer = useSelector((state) => state?.userReducer);
  const schema = useRef(null);
  const stateInitRef = useRef({
    code: '',
    code_alias: '',
    status: true,
    degree_uuid: null,
    industry_uuid: null,
    contract_uuid: null,
    career_level_uuid: null,
    responsible_for: null,
    reports_to_uuid: null,
    years_of_experience: null,
    liaises_with: null,
    job_description: null,
    job_requirements: null,
    job_major_uuid: [],
    skills_uuid: [],
    salary_scale: [],
    position_title_uuid: null,
    line_manager_uuid: null,
    job_title_uuid: null,
    location: null,
    number_of_position: 0,
    overlappe_from: null,
    overlappe_to: null,
    is_overlappe: false,
  });
  const [errors, setErrors] = useState(() => ({}));

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

  /**
   * @param event
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change the status of lookups
   */
  const onStatusChangedHandler = (event, newValue) => {
    setState({ id: 'status', value: newValue });
  };

  /**
   * @param event
   * @param newValue
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
   * @Description this method is to change the status of is_overlappe
   */
  const onOverlapChangedHandler = (event, newValue) => {
    setState({ id: 'is_overlappe', value: newValue });
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to check if the string is html or not
   */
  const getErrors = useCallback(() => {
    if (schema.current)
      getErrorByName(schema, state).then((result) => {
        setErrors(result);
      });
    else
      setTimeout(() => {
        getErrors();
      });
  }, [state]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to check if the string is html or not
   */
  const getEditInit = useCallback(async () => {
    setIsLoading(true);
    const response = await getSetupsPositionsById({
      uuid: activeItem && activeItem.uuid,
    });
    setIsLoading(false);
    if (response && response.status === 200)
      setState({ id: 'edit', value: response.data.results });
    else {
      showError(t('Shared:failed-to-get-saved-data'), response);
      isOpenChanged();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeItem, t]);

  // /**
  //  * @param key - the state key to update
  //  * @param item - the value of the key to update
  //  * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
  //  * @Description this method is to add new language key
  //  */
  // const addLanguageHandler = (key, item) => () => {
  //   const localItem = { ...item };
  //   localItem[getNotSelectedLanguage(languages, localItem, -1)[0].code] = null;
  //   setState({ id: key, value: localItem });
  // };

  // /**
  //  * @param key - the state key to update
  //  * @param item - the value of the key to update
  //  * @param code - the code to delete
  //  * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
  //  * @Description this method is to remove language key
  //  */
  // const removeLanguageHandler = useCallback(
  //   (key, item, code) => () => {
  //     const localItem = { ...item };
  //     delete localItem[code];
  //     setState({ id: key, value: localItem });
  //   },
  //   [],
  // );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to add new nationality item
   */
  const addNationalityHandler = () => {
    const localNationalities = [...state.salary_scale];
    localNationalities.push({
      nationality_uuid: null,
      salary_lower: null,
      salary_upper: null,
      currency_uuid: null,
    });
    setState({ id: 'salary_scale', value: localNationalities });
  };

  /**
   * @param index
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to remove salary_scale
   */
  const removeNationalityHandler = useCallback(
    (index) => () => {
      const localItems = [...state.salary_scale];
      localItems.splice(index, 1);
      setState({ id: 'salary_scale', value: localItems });
    },
    [state.salary_scale],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle saving
   */
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) return;

    setIsLoading(true);
    const payload = {
      ...state,
      salary_scale: state.salary_scale?.map((item) => ({
        ...item,
        salary_lower: `${item.salary_lower}`,
        salary_upper: `${item.salary_upper}`,
      })),
    };
    let response;
    if (activeItem) response = await UpdateSetupsPositions(payload);
    else response = await CreateSetupsPositions(payload);
    setIsLoading(false);
    if (
      response
      && (response.status === 200 || response.status === 201 || response.status === 202)
    ) {
      showSuccess(
        t(
          `${translationPath}${
            (activeItem && 'position-updated-successfully')
            || 'position-created-successfully'
          }`,
        ),
      );
      if (onSave) onSave();
      if (isOpenChanged) isOpenChanged();
    } else
      showError(
        t(
          `${translationPath}${
            (activeItem && 'position-update-failed') || 'position-create-failed'
          }`,
        ),
        response,
      );
  };

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  // this to get saved data on edit init
  useEffect(() => {
    if (activeItem) getEditInit();
  }, [activeItem, getEditInit]);

  // this to get languages
  useEffect(() => {
    if (userReducer && userReducer.results && userReducer.results.language)
      setLanguages(userReducer.results.language);
    else {
      showError(t('Shared:failed-to-get-languages'));
      isOpenChanged();
    }
  }, [isOpenChanged, t, userReducer]);

  // this to init errors schema
  useEffect(() => {
    schema.current = object().shape({
      code: string()
        .nullable()
        .test(
          'isRequired',
          t('this-field-is-required'),
          (value) => value || activeItem,
        ),
      reports_to_uuid: string().nullable().required(t('this-field-is-required')),
      number_of_position: number().nullable().required(t('this-field-is-required')),
      salary_scale: array()
        .of(
          object().shape({
            nationality_uuid: string()
              .nullable()
              .required(t('this-field-is-required')),
            currency_uuid: string().nullable().required(t('this-field-is-required')),
            salary_lower: number()
              .nullable()
              .required(t('this-field-is-required'))
              .lessThan(
                ref('salary_upper'),
                t(`${translationPath}minimum-salary-must-be-less-than-maximum`),
              ),
            salary_upper: number().nullable().required(t('this-field-is-required')),
          }),
        )
        .nullable(),
      position_title_uuid: string().nullable().required(t('this-field-is-required')),
      job_title_uuid: string().nullable().required(t('this-field-is-required')),
    });
  }, [activeItem, t, translationPath]);

  return (
    <DialogComponent
      maxWidth="md"
      titleText={(activeItem && 'edit-position') || 'add-position'}
      contentClasses="px-0"
      dialogContent={
        <div className="setups-management-content-dialog-wrapper">
          <div className="d-flex px-3">
            <SwitchComponent
              idRef="StatusSwitchRef"
              label="active"
              isChecked={state.status}
              isReversedLabel
              isFlexEnd
              onChange={onStatusChangedHandler}
              parentTranslationPath={parentTranslationPath}
            />
          </div>
          <div className="d-inline-flex">
            <SharedInputControl
              parentTranslationPath={parentTranslationPath}
              title="code"
              editValue={state.code}
              isDisabled={isLoading}
              isSubmitted={isSubmitted}
              errors={errors}
              errorPath="code"
              stateKey="code"
              isRequired
              pattern={numericAndAlphabeticalAndSpecialExpression}
              onValueChanged={onStateChanged}
            />
            <SharedInputControl
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              title="code-alias"
              editValue={state.code_alias}
              isDisabled={isLoading}
              isSubmitted={isSubmitted}
              errors={errors}
              errorPath="code_alias"
              stateKey="code_alias"
              pattern={numericAndAlphabeticalAndSpecialExpression}
              onValueChanged={onStateChanged}
            />
          </div>

          <div className="d-flex flex-wrap px-2">
            <SharedAPIAutocompleteControl
              idRef="positionTitleAutocompleteRef"
              editValue={state.position_title_uuid}
              title="position-title"
              placeholder="select-position-title"
              stateKey="position_title_uuid"
              getDataAPI={GetAllSetupsPositionsTitle}
              errorPath="position_title_uuid"
              getOptionLabel={(option) =>
                option.name[i18next.language] || option.name.en
              }
              errors={errors}
              searchKey="search"
              getItemByIdAPI={getSetupsPositionTitleById}
              isSubmitted={isSubmitted}
              onValueChanged={onStateChanged}
              isHalfWidth
              isRequired
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              extraProps={{
                ...(state.position_title_uuid && {
                  with_than: [state.position_title_uuid],
                }),
              }}
            />
            <SharedAPIAutocompleteControl
              idRef="jobTitleAutocompleteRef"
              editValue={state.job_title_uuid}
              title="jobs-titles"
              placeholder="select-jobs-titles"
              stateKey="job_title_uuid"
              getDataAPI={GetAllSetupsJobsTitles}
              errorPath="job_title_uuid"
              getOptionLabel={(option) =>
                option.name[i18next.language] || option.name.en
              }
              errors={errors}
              searchKey="search"
              isRequired
              getItemByIdAPI={getSetupsJobsTitlesById}
              isSubmitted={isSubmitted}
              onValueChanged={onStateChanged}
              isHalfWidth
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              extraProps={{
                ...(state.job_title_uuid && { with_than: [state.job_title_uuid] }),
              }}
            />
          </div>
          <SharedInputControl
            errors={errors}
            isSubmitted={isSubmitted}
            title="number-of-position"
            pattern={numbersExpression}
            stateKey="number_of_position"
            errorPath="number_of_position"
            onValueChanged={onStateChanged}
            translationPath={translationPath}
            editValue={state.number_of_position}
            parentTranslationPath={parentTranslationPath}
          />

          <div className="d-flex px-3">
            <div className="d-inline-flex">
              <SwitchComponent
                label="is-overlap"
                idRef="overlapSwitchRef"
                isChecked={state.is_overlappe}
                translationPath={translationPath}
                onChange={onOverlapChangedHandler}
                parentTranslationPath={parentTranslationPath}
              />
            </div>
          </div>

          {state.is_overlappe && (
            <div className="px-3 d-flex">
              <div className="pr-2-reversed w-50">
                <DatePickerComponent
                  minDate=""
                  isSubmitted={isSubmitted}
                  idRef="fromOverlapDateRef"
                  inputPlaceholder="YYYY-MM-DD"
                  value={state.overlappe_from || ''}
                  label={t(`${translationPath}from`)}
                  helperText={
                    (errors.overlappe_from && errors.overlappe_from.message)
                    || undefined
                  }
                  error={
                    (errors.overlappe_from && errors.overlappe_from.error) || false
                  }
                  onChange={(date) => {
                    if (date?.value !== 'Invalid date')
                      onStateChanged({ id: 'overlappe_from', value: date.value });
                    else onStateChanged({ id: 'overlappe_from', value: null });

                    onStateChanged({ id: 'overlappe_to', value: null });
                  }}
                  displayFormat={GlobalSavingDateFormat}
                  datePickerWrapperClasses="px-0"
                />
              </div>
              <div className="w-50">
                <DatePickerComponent
                  isSubmitted={isSubmitted}
                  idRef="toOverlapDateRef"
                  inputPlaceholder="YYYY-MM-DD"
                  value={state.overlappe_to || ''}
                  label={t(`${translationPath}to`)}
                  minDate={moment(state.overlappe_from).toDate()}
                  helperText={
                    (errors.overlappe_to && errors.overlappe_to.message) || undefined
                  }
                  error={(errors.overlappe_to && errors.overlappe_to.error) || false}
                  onChange={(date) => {
                    if (date?.value !== 'Invalid date')
                      onStateChanged({ id: 'overlappe_to', value: date.value });
                    else onStateChanged({ id: 'overlappe_to', value: null });
                  }}
                  displayFormat={GlobalSavingDateFormat}
                  datePickerWrapperClasses="px-0"
                />
              </div>
            </div>
          )}

          <div className="d-inline-flex c-black header-text pb-3 px-3 pt-4">
            <span>{t(`${translationPath}contract`)}</span>
          </div>
          <div className="d-flex flex-wrap px-3">
            <SharedAPIAutocompleteControl
              idRef="contractTypeAutocompleteRef"
              editValue={state.contract_uuid}
              title="contract-type"
              placeholder="select-contract-type"
              stateKey="contract_uuid"
              getDataAPI={GetAllSetupsContractTypes}
              errorPath="contract_uuid"
              getOptionLabel={(option) =>
                option.name[i18next.language] || option.name.en
              }
              errors={errors}
              searchKey="search"
              getItemByIdAPI={getSetupsContractTypesById}
              isSubmitted={isSubmitted}
              onValueChanged={onStateChanged}
              isFullWidth
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              extraProps={{
                ...(state.contract_uuid && { with_than: [state.contract_uuid] }),
              }}
            />
          </div>
          <div className="d-flex flex-wrap px-2">
            <SharedAPIAutocompleteControl
              idRef="contractTypeAutocompleteRef"
              editValue={state.career_level_uuid}
              title="career-level"
              placeholder="select-career-level"
              stateKey="career_level_uuid"
              getDataAPI={GetAllSetupsCareerLevels}
              errorPath="career_level_uuid"
              getOptionLabel={(option) =>
                option.name[i18next.language] || option.name.en
              }
              errors={errors}
              searchKey="search"
              getItemByIdAPI={GetSetupsCareerLevelsById}
              isSubmitted={isSubmitted}
              onValueChanged={onStateChanged}
              isHalfWidth
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              extraProps={{
                ...(state.career_level_uuid && {
                  with_than: [state.career_level_uuid],
                }),
              }}
            />
            <SharedAutocompleteControl
              idRef="yearsOfExperienceAutocompleteRef"
              editValue={state.years_of_experience}
              title="years-of-experience"
              placeholder="select-years-of-experience"
              stateKey="years_of_experience"
              errorPath="years_of_experience"
              errors={errors}
              isSubmitted={isSubmitted}
              onValueChanged={onStateChanged}
              initValues={yearsOfExperiencesEnum}
              initValuesKey="key"
              initValuesTitle="value"
              isHalfWidth
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
            <SharedAPIAutocompleteControl
              idRef="degreeTypeAutocompleteRef"
              editValue={state.degree_uuid}
              title="degree"
              placeholder="select-degree"
              stateKey="degree_uuid"
              getDataAPI={GetAllSetupsDegreeTypes}
              errorPath="degree_uuid"
              getOptionLabel={(option) =>
                option.name[i18next.language] || option.name.en
              }
              errors={errors}
              searchKey="search"
              getItemByIdAPI={GetSetupsDegreeTypesById}
              isSubmitted={isSubmitted}
              onValueChanged={onStateChanged}
              isHalfWidth
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              extraProps={{
                ...(state.degree_uuid && { with_than: [state.degree_uuid] }),
              }}
            />
            <SharedAPIAutocompleteControl
              idRef="industryAutocompleteRef"
              editValue={state.industry_uuid}
              title="industry"
              placeholder="select-industry"
              stateKey="industry_uuid"
              getDataAPI={GetAllSetupsIndustries}
              errorPath="industry_uuid"
              getOptionLabel={(option) =>
                option.name[i18next.language] || option.name.en
              }
              errors={errors}
              searchKey="search"
              getItemByIdAPI={GetSetupsIndustriesById}
              isSubmitted={isSubmitted}
              onValueChanged={onStateChanged}
              isHalfWidth
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              extraProps={{
                ...(state.industry_uuid && { with_than: [state.industry_uuid] }),
              }}
            />
          </div>

          <div className="d-inline-flex c-black header-text pb-3 px-3 pt-4">
            <span>{t(`${translationPath}salary-scale`)}</span>
          </div>
          <div className="d-flex-v-center-h-end">
            <ButtonBase
              className="btns theme-transparent mx-3 mb-2"
              onClick={addNationalityHandler}
            >
              <span className="fas fa-plus" />
              <span className="px-1">{t(`${translationPath}add-nationality`)}</span>
            </ButtonBase>
          </div>
          {((state.salary_scale && state.salary_scale) || []).map((item, index) => (
            <div className="d-flex" key={`nationalitiesKey${index + 1}`}>
              <div className="d-flex flex-wrap px-2">
                <SharedAPIAutocompleteControl
                  editValue={item.nationality_uuid}
                  title="nationality"
                  placeholder="select-nationality"
                  getDataAPI={GetAllSetupsNationality}
                  getOptionLabel={(option) =>
                    option.name[i18next.language] || option.name.en
                  }
                  isRequired
                  errors={errors}
                  searchKey="search"
                  stateKey="nationality_uuid"
                  parentIndex={index}
                  parentId="salary_scale"
                  errorPath={`salary_scale[${index}].nationality_uuid`}
                  getItemByIdAPI={getSetupsNationalityById}
                  isSubmitted={isSubmitted}
                  onValueChanged={onStateChanged}
                  isQuarterWidth
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  extraProps={{
                    ...(item.nationality_uuid && {
                      with_than: [item.nationality_uuid],
                    }),
                  }}
                />
                <SharedAPIAutocompleteControl
                  isQuarterWidth
                  isRequired
                  errors={errors}
                  title="currency"
                  searchKey="search"
                  stateKey="currency_uuid"
                  parentIndex={index}
                  isSubmitted={isSubmitted}
                  editValue={item.currency_uuid}
                  placeholder="select-currency"
                  onValueChanged={onStateChanged}
                  translationPath={translationPath}
                  parentId="salary_scale"
                  getDataAPI={GetAllSetupsCurrencies}
                  getItemByIdAPI={GetSetupsCurrenciesById}
                  parentTranslationPath={parentTranslationPath}
                  errorPath={`salary_scale[${index}].currency_uuid`}
                  getOptionLabel={(option) =>
                    option.title[i18next.language] || option.title.en
                  }
                  extraProps={{
                    ...(item.currency_uuid && { with_than: [item.currency_uuid] }),
                  }}
                />
                <SharedInputControl
                  editValue={item.salary_lower}
                  parentTranslationPath={parentTranslationPath}
                  parentId="salary_scale"
                  stateKey="salary_lower"
                  isRequired
                  errors={errors}
                  errorPath={`salary_scale[${index}].salary_lower`}
                  type="number"
                  min={0}
                  floatNumbers={3}
                  title={t(`${translationPath}minimum-salary`)}
                  parentIndex={index}
                  isQuarterWidth
                  isSubmitted={isSubmitted}
                  onValueChanged={onStateChanged}
                />
                <SharedInputControl
                  editValue={item.salary_upper}
                  parentTranslationPath={parentTranslationPath}
                  parentId="salary_scale"
                  isRequired
                  stateKey="salary_upper"
                  errors={errors}
                  errorPath={`salary_scale[${index}].salary_upper`}
                  type="number"
                  min={0}
                  floatNumbers={3}
                  title={t(`${translationPath}maximum-salary`)}
                  parentIndex={index}
                  isQuarterWidth
                  isSubmitted={isSubmitted}
                  onValueChanged={onStateChanged}
                />
              </div>
              <ButtonBase
                className="btns-icon theme-transparent c-danger mr-2-reversed mt-1 mb-2"
                onClick={removeNationalityHandler(index)}
              >
                <span className="fas fa-times" />
              </ButtonBase>
            </div>
          ))}
          <div className="d-inline-flex c-black header-text pb-3 px-3 pt-4">
            <span>{t(`${translationPath}extra-information`)}</span>
          </div>
          <div className="d-flex px-3 flex-wrap">
            <SharedAPIAutocompleteControl
              idRef="jobMajorAutocompleteRef"
              editValue={state.job_major_uuid}
              title="job-majors"
              placeholder="select-job-majors"
              stateKey="job_major_uuid"
              getDataAPI={GetAllSetupsJobMajors}
              errorPath="job_major_uuid"
              getOptionLabel={(option) =>
                option.name[i18next.language] || option.name.en
              }
              errors={errors}
              searchKey="search"
              getItemByIdAPI={GetSetupsJobMajorsById}
              isSubmitted={isSubmitted}
              onValueChanged={onStateChanged}
              isFullWidth
              type={DynamicFormTypesEnum.array.key}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              extraProps={{
                ...(state.job_major_uuid?.length && {
                  with_than: [...state.job_major_uuid],
                }),
              }}
            />
            <SharedAPIAutocompleteControl
              idRef="skillsAutocompleteRef"
              editValue={state.skills_uuid}
              title="skills"
              placeholder="select-skills"
              stateKey="skills_uuid"
              getDataAPI={GetAllSetupsSkills}
              errorPath="skills_uuid"
              getOptionLabel={(option) =>
                option.name[i18next.language] || option.name.en
              }
              errors={errors}
              searchKey="search"
              getItemByIdAPI={GetSetupsSkillById}
              isSubmitted={isSubmitted}
              onValueChanged={onStateChanged}
              isFullWidth
              type={DynamicFormTypesEnum.array.key}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              extraProps={{
                ...(state.skills_uuid?.length && {
                  with_than: [...state.skills_uuid],
                }),
              }}
            />
            <SharedAPIAutocompleteControl
              idRef="select-link-manager-autocomplete-id"
              editValue={state.line_manager_uuid}
              title="line-manager"
              placeholder="select-link-manager"
              stateKey="line_manager_uuid"
              getDataAPI={GetAllSetupsUsers}
              errorPath="line_manager_uuid"
              getOptionLabel={(option) =>
                `${
                  option.first_name
                  && (option.first_name[i18next.language] || option.first_name.en)
                }${
                  option.last_name
                  && ` ${option.last_name[i18next.language] || option.last_name.en}`
                }` || 'N/A'
              }
              errors={errors}
              searchKey="search"
              isSubmitted={isSubmitted}
              onValueChanged={onStateChanged}
              isFullWidth
              type={DynamicFormTypesEnum.select.key}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              extraProps={{
                all_users: 1,
                ...(state.line_manager_uuid && {
                  with_than: [state.line_manager_uuid],
                }),
              }}
            />
            <SharedInputControl
              title="location"
              errors={errors}
              isSubmitted={isSubmitted}
              stateKey="location"
              onValueChanged={onStateChanged}
              errorPath="location"
              isFullWidth
              editValue={state.location}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          </div>
          <div className="px-3 mb-2">
            <TextEditorControls
              idRef="JobSharedDescriptionRef"
              editValue={state.job_description}
              onValueChanged={onStateChanged}
              isSubmitted={isSubmitted}
              stateKey="job_description"
              errors={errors}
              title="job-description"
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          </div>
          <div className="px-3">
            <TextEditorControls
              idRef="ReqSharedDescriptionRef"
              editValue={state.job_requirements}
              onValueChanged={onStateChanged}
              isSubmitted={isSubmitted}
              stateKey="job_requirements"
              errors={errors}
              title="job-requirements"
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          </div>
          <div className="d-inline-flex c-black header-text pb-3 px-3 pt-4">
            <span>{t(`${translationPath}hierarchy`)}</span>
          </div>
          <SharedAPIAutocompleteControl
            errors={errors}
            title="belong-to"
            placeholder="select"
            stateKey="reports_to_uuid"
            errorPath="reports_to_uuid"
            isSubmitted={isSubmitted}
            onValueChanged={onStateChanged}
            getDataAPI={getSetupsHierarchy}
            searchKey="search"
            isRequired
            idRef="reportsToAutocompleteRef"
            translationPath={translationPath}
            editValue={state.reports_to_uuid}
            parentTranslationPath={parentTranslationPath}
            getOptionLabel={(option) =>
              option.name[i18next.language] || option.name.en
            }
            extraProps={{
              ...(state.reports_to_uuid && { with_than: [state.reports_to_uuid] }),
            }}
          />
          <SharedInputControl
            errors={errors}
            isSubmitted={isSubmitted}
            stateKey="responsible_for"
            onValueChanged={onStateChanged}
            errorPath="responsible_for"
            editValue={state.responsible_for}
            parentTranslationPath={parentTranslationPath}
            title={t(`${translationPath}responsible-for`)}
          />
          <div className="pt-4">
            <SharedInputControl
              errors={errors}
              title="liaises-with"
              stateKey="liaises_with"
              errorPath="liaises_with"
              isSubmitted={isSubmitted}
              pattern={numbersExpression}
              editValue={state.liaises_with}
              onValueChanged={onStateChanged}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
            />
          </div>
        </div>
      }
      wrapperClasses="setups-management-dialog-wrapper"
      isSaving={isLoading}
      isOpen={isOpen}
      isEdit={(activeItem && true) || undefined}
      onSubmit={saveHandler}
      onCloseClicked={isOpenChanged}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

PositionsManagementDialog.propTypes = {
  activeItem: PropTypes.shape({
    uuid: PropTypes.string,
  }),
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
  onSave: PropTypes.func,
};
PositionsManagementDialog.defaultProps = {
  isOpenChanged: undefined,
  onSave: undefined,
  activeItem: undefined,
  translationPath: 'PreScreeningApprovalManagement.',
};
