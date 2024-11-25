import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import ButtonBase from '@mui/material/ButtonBase';
import { useSelector } from 'react-redux';
import i18next from 'i18next';
import { getErrorByName, showError, showSuccess } from '../../../../../helpers';
import {
  getLanguageTitle,
  getNotSelectedLanguage,
  SetupsReducer,
  SetupsReset,
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../../setups/shared';
import {
  CheckboxesComponent,
  DialogComponent,
  SwitchComponent,
} from '../../../../../components';
import {
  GetAllSetupsUsers,
  getSetupsUsersById,
  GetAllSetupsGender,
  getSetupsHierarchy,
  GetAllJobCategories,
  getSetupsGenderById,
  GetAllSetupsSponsors,
  GetAllSetupsProjects,
  GetAllSetupsPositions,
  UpdateSetupsEmployees,
  GetAllSetupsLocations,
  GetAllSetupsReligions,
  CreateSetupsEmployees,
  getSetupsSponsorsById,
  getSetupsProjectsById,
  getSetupsEmployeesById,
  getSetupsLocationsById,
  getSetupsPositionsById,
  GetAllSetupsNationality,
  getSetupsNationalityById,
  GetAllSetupsContractTypes,
  GetAllSetupsMaritalStatus,
  getSetupsContractTypesById,
  GetAllSetupsOrganizationGroup,
  getSetupsOrganizationGroupById,
  getSetupsReligionsById,
} from '../../../../../services';
import { DynamicFormTypesEnum } from '../../../../../enums';
import './EmployeesManagement.Style.scss';
import {
  numericAndAlphabeticalAndSpecialExpression,
  phoneExpression,
} from '../../../../../utils';
import Datepicker from '../../../../../components/Elevatus/Datepicker';
import { UploaderPageEnum } from '../../../../../enums/Pages/UploaderPage.Enum';
import { UploaderControls } from '../../../../evabrand/dialogs/shared/contols-for-sections/controls';

export const EmployeeManagementDialog = ({
  onSave,
  isOpen,
  activeItem,
  isOpenChanged,
  translationPath,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const userReducer = useSelector((state) => state?.userReducer);
  const schema = useRef(null);
  const account_uuid = JSON.parse(localStorage.getItem('account'))
    ? JSON.parse(localStorage.getItem('account')).account_uuid
    : '';
  const stateInitRef = useRef({
    account_uuid,
    code: '',
    first_name: { en: null, ar: null },
    second_name: { en: null, ar: null },
    third_name: { en: null, ar: null },
    last_name: { en: null, ar: null },
    email: null,
    national_number: null,
    passport_number: null,
    birth_date: null,
    marital_status: null,
    photo: null,
    gender: null,
    religion: null,
    is_citizen: null,
    direct_manager_uuid: null,
    sponsor_uuid: null,
    hierarchy_uuid: null,
    project_uuid: null,
    location_uuid: null,
    position_uuid: null,
    contract_uuid: null,
    category_uuid: null,
    salary_scale_uuid: null,
    work_type: null,
    hiring_date: null,
    joining_date: null,
    extension: null,
    phone: null,
    related_uuid: null,
    facebook_account_link: null,
    twitter_account_link: null,
    linkedin_account_link: null,
    skype_account_link: null,
    organization_group_uuid: null,
    status: true,
    with_access: true,
  });

  const [errors, setErrors] = useState(() => ({}));

  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  /**
   * @param newValue
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
   * @Description this method is to send a new value for state from child
   */
  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  /**
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
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
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
   * @Description this method is to check if the string is html or not
   */
  const getEditInit = useCallback(async () => {
    setIsLoading(true);
    const response = await getSetupsEmployeesById({
      uuid: activeItem && activeItem.uuid,
    });
    setIsLoading(false);
    if (response && response.status === 200)
      setState({ id: 'edit', value: { account_uuid, ...response.data.results } });
    // else showError(t('Shared:failed-to-get-saved-data'), response);
    // isOpenChanged();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeItem, t]);

  /**
   * @param key - the state key to update
   * @param item - the value of the key to update
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
   * @Description this method is to add new language key
   */
  const addLanguageHandler = (key, item) => () => {
    const localItem = { ...item };
    localItem[getNotSelectedLanguage(languages, localItem, -1)[0].code] = null;
    setState({ id: key, value: localItem });
  };

  /**
   * @param key - the state key to update
   * @param item - the value of the key to update
   * @param code - the code to delete
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
   * @Description this method is to remove language key
   */
  const removeLanguageHandler = useCallback(
    (key, item, code) => () => {
      const localItem = { ...item };
      delete localItem[code];
      setState({ id: key, value: localItem });
    },
    [],
  );

  /**
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
   * @Description this method is to handle saving
   */
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);

    if (Object.keys(errors).length > 0) return;

    setIsLoading(true);
    let response;
    if (activeItem)
      response = await UpdateSetupsEmployees({
        ...state,
        email: state?.email?.toLowerCase(),
      });
    else
      response = await CreateSetupsEmployees({
        ...state,
        email: state?.email?.toLowerCase(),
      });
    setIsLoading(false);
    if (response && (response.status === 200 || response.status === 201)) {
      window?.ChurnZero?.push([
        'trackEvent',
        'Create a new employee',
        'Create a new employee from evarec',
        1,
        {},
      ]);

      showSuccess(
        t(
          `${translationPath}${
            (activeItem && 'employee-updated-successfully')
            || 'employee-created-successfully'
          }`,
        ),
      );
      if (onSave) onSave();
      if (isOpenChanged) isOpenChanged();
    } else
      showError(
        t(
          `${translationPath}${
            (activeItem && 'employee-update-failed') || 'employee-create-failed'
          }`,
        ),
        response,
      );
  };

  /**
   * @param event
   * @param newValue
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
   * @Description this method is to change the status of lookups
   */
  const onStatusChangedHandler = (event, newValue) => {
    setState({ id: 'status', value: newValue });
  };

  /**
   * @param event
   * @param newValue
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
   * @Description this method is to change the status of lookups
   */
  const onIsCitizenChangedHandler = (event, newValue) => {
    setState({ id: 'is_citizen', value: newValue });
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

  useEffect(() => {
    if (!activeItem) {
      const localEnLanguage = languages.find((item) => item.code === 'en');
      if (localEnLanguage)
        setState({
          id: ['first_name', 'second_name', 'third_name', 'last_name'],
          value: {
            [localEnLanguage.code]: null,
          },
        });
    }
  }, [activeItem, languages]);

  // this to init errors schema
  useEffect(() => {
    schema.current = yup.object().shape({
      code: yup
        .string()
        .nullable()
        .test(
          'isRequired',
          t('this-field-is-required'),
          (value) => value || activeItem,
        ),
      email: yup.string().nullable().required(t('this-field-is-required')),
      first_name: yup.lazy((obj) =>
        yup
          .object()
          .shape(
            Object.keys(obj).reduce(
              (newMap, key) => ({
                ...newMap,
                [key]: yup.string().nullable().required(t('this-field-is-required')),
              }),
              {},
            ),
          )
          .nullable()
          .test(
            'isRequired',
            `${t('please-add-at-least')} ${1} ${t('name')}`,
            (value) => value && Object.keys(value).length > 0,
          ),
      ),
      second_name: yup.lazy((obj) =>
        yup
          .object()
          .shape(
            Object.keys(obj).reduce(
              (newMap, key) => ({
                ...newMap,
                [key]: yup.string().nullable().required(t('this-field-is-required')),
              }),
              {},
            ),
          )
          .nullable()
          .test(
            'isRequired',
            `${t('please-add-at-least')} ${1} ${t('name')}`,
            (value) => value && Object.keys(value).length > 0,
          ),
      ),
      third_name: yup.lazy((obj) =>
        yup
          .object()
          .shape(
            Object.keys(obj).reduce(
              (newMap, key) => ({
                ...newMap,
                [key]: yup.string().nullable().required(t('this-field-is-required')),
              }),
              {},
            ),
          )
          .nullable()
          .test(
            'isRequired',
            `${t('please-add-at-least')} ${1} ${t('name')}`,
            (value) => value && Object.keys(value).length > 0,
          ),
      ),
      last_name: yup.lazy((obj) =>
        yup
          .object()
          .shape(
            Object.keys(obj || {}).reduce(
              (newMap, key) => ({
                ...newMap,
                [key]: yup.string().nullable().required(t('this-field-is-required')),
              }),
              {},
            ),
          )
          .nullable()
          .test(
            'isRequired',
            `${t('please-add-at-least')} ${1} ${t('name')}`,
            (value) => value && Object.keys(value).length > 0,
          ),
      ),
      phone: yup
        .string()
        .nullable()
        .matches(phoneExpression, {
          message: t('invalid-phone-number'),
          excludeEmptyString: true,
        }),
    });
  }, [activeItem, t, translationPath]);

  return (
    <DialogComponent
      maxWidth="lg"
      titleText={(activeItem && 'edit-employee') || 'add-new-employee'}
      dialogContent={
        <div className="setups-management-content-dialog-wrapper">
          <SwitchComponent
            isFlexEnd
            isReversedLabel
            label="active"
            idRef="StatusSwitchRef"
            isChecked={state.status}
            onChange={onStatusChangedHandler}
            parentTranslationPath={parentTranslationPath}
          />
          <div className="d-inline-flex ml--2-reversed">
            <SharedInputControl
              title="code"
              errors={errors}
              stateKey="code"
              errorPath="code"
              editValue={state.code}
              isDisabled={isLoading}
              isSubmitted={isSubmitted}
              onValueChanged={onStateChanged}
              pattern={numericAndAlphabeticalAndSpecialExpression}
              parentTranslationPath={parentTranslationPath}
            />
          </div>
          <div className="d-flex">
            <SharedAPIAutocompleteControl
              isHalfWidth
              title="select-category"
              editValue={state.category_uuid}
              idRef="categoriesAutocompleteRef"
              getOptionLabel={(option) =>
                option?.[
                  (i18next.language !== 'en' && `title_${i18next.language}`)
                    || 'title'
                ] || ''
              }
              errors={errors}
              stateKey="category_uuid"
              isSubmitted={isSubmitted}
              errorPath="category_uuid"
              placeholder="select-category"
              getDataAPI={GetAllJobCategories}
              onValueChanged={onStateChanged}
              translationPath={translationPath}
              type={DynamicFormTypesEnum.array.key}
              parentTranslationPath={parentTranslationPath}
              extraProps={{
                ...(state.category_uuid?.length && {
                  with_than: state.category_uuid,
                }),
              }}
            />
            <div className="w-50">
              <UploaderControls
                isHalfWidth
                errors={errors}
                urlStateKey="url"
                labelValue="photo"
                uuidStateKey="uuid"
                typeStateKey="type"
                isSubmitted={isSubmitted}
                translationPath={translationPath}
                mediaItem={state.photo || undefined}
                uploaderPage={UploaderPageEnum.Employee}
                parentTranslationPath={parentTranslationPath}
                onValueChanged={(newValue) =>
                  onStateChanged({
                    id: 'photo',
                    value: newValue && newValue.value,
                  })
                }
              />
            </div>
          </div>

          <div className="d-flex-v-center-h-end">
            <ButtonBase
              className="btns theme-transparent mx-3 mb-2"
              onClick={() => {
                addLanguageHandler('first_name', state.first_name)();
                addLanguageHandler('second_name', state.second_name)();
                addLanguageHandler('third_name', state.third_name)();
                addLanguageHandler('last_name', state.last_name)();
              }}
              disabled={
                isLoading
                || languages.length === 0
                || (state.first_name
                  && languages.length === Object.keys(state.first_name).length)
              }
            >
              <span className="fas fa-plus" />
              <span className="px-1">{t('add-language')}</span>
            </ButtonBase>
          </div>
          {state.first_name
            && Object.entries(state.first_name).map((item, index) => (
              <React.Fragment key={`namesKey${index + 1}`}>
                {index > 0 && (
                  <div className="d-flex-h-between">
                    <SharedAutocompleteControl
                      editValue={item[0]}
                      placeholder="select-language"
                      title="language"
                      stateKey="user_name"
                      onValueChanged={(newValue) => {
                        const localState = { ...state };
                        // eslint-disable-next-line prefer-destructuring
                        localState.first_name[newValue.value] = item[1];
                        // eslint-disable-next-line max-len
                        localState.second_name[newValue.value]
                          = localState.second_name[item[0]];
                        localState.third_name[newValue.value]
                          = localState.third_name[item[0]];
                        localState.last_name[newValue.value]
                          = localState.last_name[item[0]];
                        delete localState.last_name[item[0]];
                        delete localState.third_name[item[0]];
                        delete localState.second_name[item[0]];
                        delete localState.first_name[item[0]];
                        onStateChanged({ id: 'edit', value: localState });
                      }}
                      initValues={getNotSelectedLanguage(
                        languages,
                        state.first_name,
                        index,
                      )}
                      initValuesKey="code"
                      initValuesTitle="title"
                      parentTranslationPath={parentTranslationPath}
                    />
                    <ButtonBase
                      className="btns theme-transparent c-danger mx-3 mt-1 mb-2"
                      onClick={() => {
                        removeLanguageHandler(
                          'last_name',
                          state.last_name,
                          item[0],
                        )();
                        removeLanguageHandler(
                          'third_name',
                          state.third_name,
                          item[0],
                        )();
                        removeLanguageHandler(
                          'second_name',
                          state.second_name,
                          item[0],
                        )();
                        removeLanguageHandler(
                          'first_name',
                          state.first_name,
                          item[0],
                        )();
                      }}
                    >
                      <span className="fas fa-times" />
                      <span className="px-1">{t('remove-language')}</span>
                    </ButtonBase>
                  </div>
                )}
                <SharedInputControl
                  editValue={item[1]}
                  parentTranslationPath={parentTranslationPath}
                  stateKey={item[0]}
                  parentId="first_name"
                  errors={errors}
                  errorPath={`first_name.${[item[0]]}`}
                  title={`${t(`${translationPath}first-name`)} (${getLanguageTitle(
                    languages,
                    item[0],
                  )})`}
                  isSubmitted={isSubmitted}
                  onValueChanged={onStateChanged}
                  isHalfWidth
                />
                <SharedInputControl
                  editValue={state.second_name[item[0]]}
                  parentTranslationPath={parentTranslationPath}
                  stateKey={item[0]}
                  parentId="second_name"
                  errors={errors}
                  errorPath={`second_name.${[item[0]]}`}
                  title={`${t(`${translationPath}second-name`)} (${getLanguageTitle(
                    languages,
                    item[0],
                  )})`}
                  isSubmitted={isSubmitted}
                  onValueChanged={onStateChanged}
                  isHalfWidth
                />
                <SharedInputControl
                  editValue={state.third_name[item[0]]}
                  parentTranslationPath={parentTranslationPath}
                  stateKey={item[0]}
                  parentId="third_name"
                  errors={errors}
                  errorPath={`third_name.${[item[0]]}`}
                  title={`${t(`${translationPath}third-name`)} (${getLanguageTitle(
                    languages,
                    item[0],
                  )})`}
                  isSubmitted={isSubmitted}
                  onValueChanged={onStateChanged}
                  isHalfWidth
                />
                <SharedInputControl
                  editValue={(state.last_name && state.last_name[item[0]]) || ''}
                  parentTranslationPath={parentTranslationPath}
                  stateKey={item[0]}
                  parentId="last_name"
                  errors={errors}
                  errorPath={`last_name.${[item[0]]}`}
                  title={`${t(`${translationPath}last-name`)} (${getLanguageTitle(
                    languages,
                    item[0],
                  )})`}
                  isSubmitted={isSubmitted}
                  onValueChanged={onStateChanged}
                  isHalfWidth
                />
              </React.Fragment>
            ))}
          <div className="d-flex flex-wrap px-2 pt-3">
            <SharedInputControl
              isQuarterWidth
              errors={errors}
              title="email"
              isSubmitted={isSubmitted}
              stateKey="email"
              errorPath="email"
              editValue={state.email}
              onValueChanged={onStateChanged}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
            />
            <SharedInputControl
              min={0}
              isQuarterWidth
              errors={errors}
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
              isQuarterWidth
              errors={errors}
              title="passport-number"
              isSubmitted={isSubmitted}
              stateKey="passport_number"
              errorPath="passport_number"
              onValueChanged={onStateChanged}
              editValue={state.passport_number}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
            />
          </div>
          <div className="d-flex flex-wrap px-2">
            {/* <SharedInputControl
              title="phone"
              type="number"
              isQuarterWidth
              errors={errors}
              stateKey="phone"
              errorPath="phone"
              editValue={state.phone}
              isSubmitted={isSubmitted}
              onValueChanged={onStateChanged}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
            /> */}
            <SharedInputControl
              editValue={state.phone}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              stateKey="phone"
              title="phone"
              errorPath="phone"
              errors={errors}
              isSubmitted={isSubmitted}
              onValueChanged={onStateChanged}
              isQuarterWidth
            />
            <SharedAPIAutocompleteControl
              isQuarterWidth
              title="gender"
              errors={errors}
              stateKey="gender"
              searchKey="search"
              errorPath="gender"
              editValue={state.gender}
              isSubmitted={isSubmitted}
              idRef="dobAutocompleteRef"
              placeholder="select-gender"
              onValueChanged={onStateChanged}
              getDataAPI={GetAllSetupsGender}
              translationPath={translationPath}
              getItemByIdAPI={getSetupsGenderById}
              parentTranslationPath={parentTranslationPath}
              getOptionLabel={(option) =>
                option.name[i18next.language] || option.name.en
              }
              extraProps={{
                ...(state.gender && { with_than: [state.gender] }),
              }}
            />
            <SharedAPIAutocompleteControl
              isQuarterWidth
              errors={errors}
              title="marital-status"
              stateKey="marital_status_uuid"
              isSubmitted={isSubmitted}
              errorPath="marital_status_uuid"
              onValueChanged={onStateChanged}
              editValue={state.marital_status_uuid}
              translationPath={translationPath}
              placeholder="select-marital-status"
              idRef="marital_status_uuidAutocompleteRef"
              getDataAPI={GetAllSetupsMaritalStatus}
              parentTranslationPath={parentTranslationPath}
              getOptionLabel={(option) =>
                option.name[i18next.language] || option.name.en
              }
              extraProps={{
                ...(state.marital_status_uuid && {
                  with_than: [state.marital_status_uuid],
                }),
              }}
            />
            <SharedAPIAutocompleteControl
              isQuarterWidth
              errors={errors}
              title="religion"
              searchKey="search"
              stateKey="religion_uuid"
              errorPath="religion_uuid"
              editValue={state.religion_uuid}
              isSubmitted={isSubmitted}
              idRef="religion_uuidAutocompleteRef"
              placeholder="select-religion"
              onValueChanged={onStateChanged}
              translationPath={translationPath}
              getDataAPI={GetAllSetupsReligions}
              getItemByIdAPI={getSetupsReligionsById}
              parentTranslationPath={parentTranslationPath}
              getOptionLabel={(option) =>
                option.name[i18next.language] || option.name.en
              }
              extraProps={{
                ...(state.religion_uuid && { with_than: [state.religion_uuid] }),
              }}
            />
            <SharedAPIAutocompleteControl
              isQuarterWidth
              errors={errors}
              searchKey="search"
              title="nationality"
              stateKey="nationality_uuid"
              errorPath="nationality_uuid"
              isSubmitted={isSubmitted}
              editValue={state.nationality_uuid}
              onValueChanged={onStateChanged}
              placeholder="select-nationality"
              translationPath={translationPath}
              getDataAPI={GetAllSetupsNationality}
              getItemByIdAPI={getSetupsNationalityById}
              parentTranslationPath={parentTranslationPath}
              getOptionLabel={(option) =>
                option.name[i18next.language] || option.name.en
              }
              extraProps={{
                ...(state.nationality_uuid && {
                  with_than: [state.nationality_uuid],
                }),
              }}
            />
            <SharedAPIAutocompleteControl
              isQuarterWidth
              errors={errors}
              searchKey="search"
              title="direct-manager"
              stateKey="direct_manager_uuid"
              errorPath="direct_manager_uuid"
              isSubmitted={isSubmitted}
              editValue={state.direct_manager_uuid}
              onValueChanged={onStateChanged}
              placeholder="direct-manager"
              translationPath={translationPath}
              getDataAPI={GetAllSetupsUsers}
              getItemByIdAPI={getSetupsUsersById}
              parentTranslationPath={parentTranslationPath}
              getOptionLabel={(option) => {
                const firstName
                  = (option.first_name
                    && (option.first_name[i18next.language] || option.first_name.en))
                  || '';
                const lastName
                  = (option.last_name
                    && (option.last_name[i18next.language] || option.last_name.en))
                  || '';
                return (
                  (firstName && lastName && `${firstName} ${lastName}`)
                  || firstName
                  || lastName
                  || t(`${translationPath}name-not-found`)
                );
              }}
              extraProps={{
                ...(state.direct_manager_uuid && {
                  with_than: [state.direct_manager_uuid],
                }),
              }}
            />
            <SharedAPIAutocompleteControl
              isQuarterWidth
              errors={errors}
              searchKey="search"
              title="sponsor"
              stateKey="sponsor_uuid"
              errorPath="sponsor_uuid"
              isSubmitted={isSubmitted}
              editValue={state.sponsor_uuid}
              onValueChanged={onStateChanged}
              placeholder="sponsor"
              translationPath={translationPath}
              getDataAPI={GetAllSetupsSponsors}
              getItemByIdAPI={getSetupsSponsorsById}
              parentTranslationPath={parentTranslationPath}
              getOptionLabel={(option) =>
                option.name[i18next.language] || option.name.en
              }
            />
            <SharedAPIAutocompleteControl
              isQuarterWidth
              errors={errors}
              searchKey="search"
              title="hierarchy"
              stateKey="hierarchy_uuid"
              errorPath="hierarchy_uuid"
              isSubmitted={isSubmitted}
              editValue={state.hierarchy_uuid}
              onValueChanged={onStateChanged}
              placeholder="hierarchy"
              translationPath={translationPath}
              getDataAPI={getSetupsHierarchy}
              parentTranslationPath={parentTranslationPath}
              getOptionLabel={(option) =>
                option.name[i18next.language] || option.name.en
              }
              extraProps={{
                ...(state.hierarchy_uuid && { with_than: [state.hierarchy_uuid] }),
              }}
            />
            <SharedAPIAutocompleteControl
              isQuarterWidth
              errors={errors}
              searchKey="search"
              title="project"
              stateKey="project_uuid"
              errorPath="project_uuid"
              isSubmitted={isSubmitted}
              editValue={state.project_uuid}
              onValueChanged={onStateChanged}
              placeholder="project"
              translationPath={translationPath}
              getDataAPI={GetAllSetupsProjects}
              getItemByIdAPI={getSetupsProjectsById}
              parentTranslationPath={parentTranslationPath}
              getOptionLabel={(option) =>
                option.name[i18next.language] || option.name.en
              }
            />
            <SharedAPIAutocompleteControl
              isQuarterWidth
              errors={errors}
              searchKey="search"
              title="location"
              stateKey="location_uuid"
              errorPath="location_uuid"
              isSubmitted={isSubmitted}
              editValue={state.location_uuid}
              onValueChanged={onStateChanged}
              placeholder="location"
              translationPath={translationPath}
              getDataAPI={GetAllSetupsLocations}
              getItemByIdAPI={getSetupsLocationsById}
              parentTranslationPath={parentTranslationPath}
              getOptionLabel={(option) =>
                option.name[i18next.language] || option.name.en
              }
              extraProps={{
                ...(state.location_uuid && { with_than: [state.location_uuid] }),
              }}
            />
            <SharedAPIAutocompleteControl
              isQuarterWidth
              errors={errors}
              searchKey="search"
              title="position"
              stateKey="position_uuid"
              errorPath="position_uuid"
              isSubmitted={isSubmitted}
              editValue={state.position_uuid}
              onValueChanged={onStateChanged}
              placeholder="position"
              translationPath={translationPath}
              getDataAPI={GetAllSetupsPositions}
              getItemByIdAPI={getSetupsPositionsById}
              parentTranslationPath={parentTranslationPath}
              getOptionLabel={(option) =>
                option.name[i18next.language] || option.name.en
              }
              extraProps={{
                ...(state.position_uuid && { with_than: [state.position_uuid] }),
              }}
            />
            <SharedAPIAutocompleteControl
              isQuarterWidth
              errors={errors}
              searchKey="search"
              title="contract"
              stateKey="contract_uuid"
              errorPath="contract_uuid"
              isSubmitted={isSubmitted}
              editValue={state.contract_uuid}
              onValueChanged={onStateChanged}
              placeholder="contract"
              translationPath={translationPath}
              getDataAPI={GetAllSetupsContractTypes}
              getItemByIdAPI={getSetupsContractTypesById}
              parentTranslationPath={parentTranslationPath}
              getOptionLabel={(option) =>
                option.name[i18next.language] || option.name.en
              }
            />
            <SharedInputControl
              isQuarterWidth
              type="number"
              title="salary"
              errors={errors}
              stateKey="salary"
              errorPath="salary"
              editValue={state.salary}
              isSubmitted={isSubmitted}
              onValueChanged={onStateChanged}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
            />
            <SharedInputControl
              isQuarterWidth
              errors={errors}
              title="job-title"
              stateKey="job_title"
              errorPath="job_title"
              isSubmitted={isSubmitted}
              editValue={state.job_title}
              onValueChanged={onStateChanged}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
            />
            <SharedAPIAutocompleteControl
              isQuarterWidth
              errors={errors}
              searchKey="search"
              isSubmitted={isSubmitted}
              title="business-group"
              stateKey="organization_group_uuid"
              errorPath="organization_group_uuid"
              onValueChanged={onStateChanged}
              placeholder="organization-group"
              translationPath={translationPath}
              editValue={state.organization_group_uuid}
              getDataAPI={GetAllSetupsOrganizationGroup}
              parentTranslationPath={parentTranslationPath}
              getItemByIdAPI={getSetupsOrganizationGroupById}
              getOptionLabel={(option) =>
                option.name[i18next.language] || option.name.en
              }
              extraProps={{
                ...(state.organization_group_uuid && {
                  with_than: [state.organization_group_uuid],
                }),
              }}
            />
            <SharedInputControl
              isQuarterWidth
              errors={errors}
              title="extension"
              stateKey="extension"
              errorPath="extension"
              isSubmitted={isSubmitted}
              editValue={state.extension}
              onValueChanged={onStateChanged}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
            />
            <CheckboxesComponent
              wrapperClasses="px-2 mt-1"
              idRef="withAccessRef"
              singleChecked={state.with_access}
              label={t(`${translationPath}has-access-to-the-system`)}
              onSelectedCheckboxChanged={(event, checked) => {
                setState({ id: 'with_access', value: checked });
              }}
            />
            <SwitchComponent
              label="is-citizen"
              idRef="StatusSwitchRef"
              isChecked={state.is_citizen}
              translationPath={translationPath}
              onChange={onIsCitizenChangedHandler}
              parentTranslationPath={parentTranslationPath}
            />
          </div>
          <div className="d-flex px-3 pt-4">
            <div className="w-50 mr-4-reversed">
              <Datepicker
                minDate=""
                isSubmitted={isSubmitted}
                error={errors.birth_date}
                inputPlaceholder="YYYY-MM-DD"
                value={state.birth_date || ''}
                helperText={t('this-field-is-required')}
                label={t(`${translationPath}date-of-birth`)}
                onChange={(date) => {
                  if (date !== 'Invalid date')
                    setState({ id: 'birth_date', value: date });
                  else setState({ id: 'birth_date', value: null });
                }}
              />
            </div>
            <div className="w-50 mr-4-reversed">
              <Datepicker
                minDate=""
                isSubmitted={isSubmitted}
                error={errors.hiring_date}
                inputPlaceholder="YYYY-MM-DD"
                value={state.hiring_date || ''}
                helperText={t('this-field-is-required')}
                label={t(`${translationPath}hiring-date`)}
                onChange={(date) => {
                  if (date !== 'Invalid date')
                    setState({ id: 'hiring_date', value: date });
                  else setState({ id: 'hiring_date', value: null });
                }}
              />
            </div>
            <div className="w-50 mr-4-reversed">
              <Datepicker
                minDate=""
                isSubmitted={isSubmitted}
                error={errors.joining_date}
                inputPlaceholder="YYYY-MM-DD"
                value={state.joining_date || ''}
                helperText={t('this-field-is-required')}
                label={t(`${translationPath}joining-date`)}
                onChange={(date) => {
                  if (date !== 'Invalid date')
                    setState({ id: 'joining_date', value: date });
                  else setState({ id: 'joining_date', value: null });
                }}
              />
            </div>
            {/* <div className="w-50"> */}
            {/*  <TimezonesAutocompleteControl */}
            {/*    title="" */}
            {/*    idRef="timezone" */}
            {/*    stateKey="timezone" */}
            {/*    labelValue="time-zone" */}
            {/*    wrapperClasses="w-100" */}
            {/*    placeholder="timezone" */}
            {/*    editValue={state.timezone} */}
            {/*    translationPath={translationPath} */}
            {/*    parentTranslationPath={parentTranslationPath} */}
            {/*    onValueChanged={(newValue) =>
            setState({ id: 'timezone', value: newValue.value })} */}
            {/*  /> */}
            {/* </div> */}
          </div>
          <div className="d-flex flex-wrap pt-3">
            <SharedInputControl
              wrapperClasses="w-25"
              errors={errors}
              title="facebook"
              isSubmitted={isSubmitted}
              onValueChanged={onStateChanged}
              stateKey="facebook_account_link"
              errorPath="facebook_account_link"
              translationPath={translationPath}
              editValue={state.facebook_account_link}
              parentTranslationPath={parentTranslationPath}
            />
            <SharedInputControl
              wrapperClasses="w-25"
              errors={errors}
              title="twitter"
              isSubmitted={isSubmitted}
              onValueChanged={onStateChanged}
              stateKey="twitter_account_link"
              errorPath="twitter_account_link"
              translationPath={translationPath}
              editValue={state.twitter_account_link}
              parentTranslationPath={parentTranslationPath}
            />
            <SharedInputControl
              wrapperClasses="w-25"
              errors={errors}
              title="linkedin"
              isSubmitted={isSubmitted}
              onValueChanged={onStateChanged}
              stateKey="linkedin_account_link"
              errorPath="linkedin_account_link"
              translationPath={translationPath}
              editValue={state.linkedin_account_link}
              parentTranslationPath={parentTranslationPath}
            />
            <SharedInputControl
              wrapperClasses="w-25"
              title="skype"
              errors={errors}
              isSubmitted={isSubmitted}
              stateKey="skype_account_link"
              errorPath="skype_account_link"
              onValueChanged={onStateChanged}
              translationPath={translationPath}
              editValue={state.skype_account_link}
              parentTranslationPath={parentTranslationPath}
            />
          </div>
        </div>
      }
      isOpen={isOpen}
      isSaving={isLoading}
      onSubmit={saveHandler}
      onCloseClicked={isOpenChanged}
      onCancelClicked={isOpenChanged}
      translationPath={translationPath}
      isEdit={(activeItem && true) || undefined}
      parentTranslationPath={parentTranslationPath}
      wrapperClasses="setups-management-dialog-wrapper"
    />
  );
};

EmployeeManagementDialog.propTypes = {
  activeItem: PropTypes.shape({
    uuid: PropTypes.string,
  }),
  onSave: PropTypes.func,
  isOpenChanged: PropTypes.func,
  translationPath: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
};
EmployeeManagementDialog.defaultProps = {
  onSave: undefined,
  activeItem: undefined,
  isOpenChanged: undefined,
  translationPath: 'UsersInfoDialog.',
};
