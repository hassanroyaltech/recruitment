/* eslint-disable max-len */
import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import ButtonBase from '@mui/material/ButtonBase';
import { useSelector } from 'react-redux';
import i18next from 'i18next';
import {
  getErrorByName,
  LanguageUpdateKey,
  showError,
  showSuccess,
} from '../../../../../../helpers';
import {
  getLanguageTitle,
  getNotSelectedLanguage,
  SetupsReducer,
  SetupsReset,
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../../shared';
import {
  CollapseComponent,
  DialogComponent,
  SwitchComponent,
  TooltipsComponent,
} from '../../../../../../components';
import {
  CreateSetupsGroupPermissions,
  GetAllJobCategories,
  GetAllSetupsBranches,
  // GetAllSetupsCategories,
  GetAllSetupsHierarchyLevels,
  GetAllSetupsPositionsTitle,
  GetAllSetupsOrganizationGroup,
  GetAllSetupsPermissions,
  GetAllSetupsPositions,
  // getSetupsCategoriesById,
  getSetupsHierarchy,
  GetSetupsGroupPermissionById,
  UpdateSetupsGroupPermissions,
  GetSetupsEmployeesTotal,
  GetAllSetupsDataSecurityRules,
  GetAllSetupsNewOrganizationGroup,
} from '../../../../../../services';
import {
  CategoriesRulesTypesEnum,
  DynamicFormTypesEnum,
  TeamsRulesOperationsEnum,
} from '../../../../../../enums';
import './GroupPermissionsManagement.Style.scss';
import { numericAndAlphabeticalAndSpecialExpression } from '../../../../../../utils';

export const GroupPermissionsManagementDialog = ({
  isOpen,
  onSave,
  activeItem,
  isOpenChanged,
  translationPath,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isOpenRulesCollapse, setIsOpenRulesCollapse] = useState(false);
  const [totalEffectedEmployees, setTotalEffectedEmployees] = useState(0);
  const [isOpenAccessBranchesCollapse, setIsOpenAccessBranchesCollapse]
    = useState(false);
  // const selectedBranchReducer = useSelector(
  //   (reducerState) => reducerState?.selectedBranchReducer,
  // );
  const [existenceRules] = useState(() =>
    Object.values(TeamsRulesOperationsEnum).map((item) => ({
      ...item,
      value: t(item.value),
    })),
  );
  const [existenceTypes] = useState(() =>
    Object.values(CategoriesRulesTypesEnum)
      .map((item) => ({
        ...item,
        value: t(item.value),
      }))
      .filter((ru) => ru.key !== 'rule_single_hierarchy'),
  );

  const userReducer = useSelector((state) => state?.userReducer);
  const schema = useRef(null);
  const stateInitRef = useRef({
    code: '',
    status: true,
    name: {},
    is_with_rules: false,
    selected_users: [],
    rules: [],
    access_branches: [],
  });
  const [errors, setErrors] = useState(() => ({}));
  const isCodeDisabled = useRef(Boolean(activeItem));

  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is sent new value for state from child
   */
  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  /**
   * @param key
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change the status of any switch
   */
  const onToggleChangedHandler = (key) => (event, newValue) => {
    setState({ id: key, value: newValue });
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
    const response = await GetSetupsGroupPermissionById({
      uuid: activeItem && activeItem.uuid,
    });
    setIsLoading(false);
    if (response && response.status === 200)
      setState({
        id: 'edit',
        value: {
          ...response.data.results,
          is_with_rules: response.data.results.rules.length > 0,
        },
      });
    else {
      showError(t('Shared:failed-to-get-saved-data'), response);
      isOpenChanged();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeItem, t]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to add new rule
   */
  const addRuleHandler = () => {
    const localNames = [...state.rules];
    localNames.push({
      type: null,
      where: null,
      value: null,
    });
    setState({ id: 'rules', value: localNames });
  };

  /**
   * @param index
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to remove rule
   */
  const removeRuleHandler = useCallback(
    (index) => () => {
      const localRules = [...state.rules];
      localRules.splice(index, 1);
      setState({ id: 'rules', value: localRules });
    },
    [state.rules],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to add new access branch
   */
  const addAccessBranchHandler = () => {
    const localNames = [...state.access_branches];
    localNames.push({
      branch_uuid: null,
      permissions: [],
      data_roles: [],
      // categories: [],
    });
    setState({ id: 'access_branches', value: localNames });
  };

  /**
   * @param index
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to remove access branch
   */
  const removeAccessBranchHandler = useCallback(
    (index) => () => {
      const localItems = [...state.access_branches];
      localItems.splice(index, 1);
      setState({ id: 'access_branches', value: localItems });
    },
    [state.access_branches],
  );

  /**
   * @param key - the state key to update
   * @param item - the value of the key to update
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
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
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
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
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle saving
   */
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) {
      if (errors.name) showError(errors.name.message);
      if (errors.rules) showError(errors.rules.message);
      if (errors.access_branches) showError(errors.access_branches.message);
      return;
    }
    setIsLoading(true);
    let response;
    if (activeItem) response = await UpdateSetupsGroupPermissions(state);
    else response = await CreateSetupsGroupPermissions(state);
    setIsLoading(false);
    if (response && (response.status === 200 || response.status === 201)) {
      if (!activeItem)
        window?.ChurnZero?.push([
          'trackEvent',
          `Create a new group permission`,
          `Create a new group permission from setups`,
          1,
          {},
        ]);
      showSuccess(
        t(
          `${translationPath}${
            (activeItem && 'group-updated-successfully')
            || 'group-created-successfully'
          }`,
        ),
      );
      if (onSave) onSave();
      if (isOpenChanged) isOpenChanged();
    } else
      showError(
        t(
          `${translationPath}${
            (activeItem && 'group-update-failed') || 'group-create-failed'
          }`,
        ),
        response,
      );
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is get total employees that applied for this group permissions
   */
  const getSetupsEmployeesTotal = useCallback(async () => {
    if (
      !state.rules
      || state.rules.length === 0
      || state.rules.some((rule) => !rule.type || !rule.value || !rule.where)
    )
      return;
    const response = await GetSetupsEmployeesTotal({ rules: [...state.rules] });
    if (response && response.status === 200)
      setTotalEffectedEmployees(response.data.results.total);
    else showError('', response);
  }, [state.rules]);

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
          id: 'name',
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
      name: yup.lazy((obj) =>
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
      // selected_users: yup.array().nullable().required(t('this-field-is-required')),
      rules: yup
        .array()
        .of(
          yup.object().shape({
            type: yup.string().nullable().required(t('this-field-is-required')),
            where: yup.string().nullable().required(t('this-field-is-required')),
            value: yup.string().nullable().required(t('this-field-is-required')),
          }),
        )
        .nullable()
        .when(
          'is_with_rules',
          (value, field) =>
            (value
              && field.min(
                1,
                `${t('please-select-at-least')} ${1} ${t(`${translationPath}rule`)}`,
              ))
            || field,
        ),
      access_branches: yup
        .array()
        .of(
          yup.object().shape({
            branch_uuid: yup
              .string()
              .nullable()
              .required(t('this-field-is-required')),
            permissions: yup.array().nullable().min(1, t('this-field-is-required')),
            data_roles: yup.array().nullable(),
            // categories: yup.array().nullable().min(1, t('this-field-is-required')),
          }),
        )
        .nullable()
        .min(
          1,
          `${t('please-select-at-least')} ${1} ${t(
            `${translationPath}access-branch`,
          )}`,
        ),
    });
  }, [activeItem, t, translationPath]);

  // this is to call total employees if all rules have values
  useEffect(() => {
    if (
      state.rules
      && state.rules.length > 0
      && state.rules.some((rule) => rule.type && rule.value && rule.where)
    )
      getSetupsEmployeesTotal();
  }, [getSetupsEmployeesTotal, state.rules]);

  return (
    <DialogComponent
      maxWidth="md"
      titleText={(activeItem && 'edit-group') || 'add-new-group'}
      dialogContent={
        <div className="groups-management-content-dialog-wrapper">
          <div className="d-flex px-3">
            <SwitchComponent
              idRef="StatusSwitchRef"
              label="active"
              isChecked={state.status}
              isReversedLabel
              isFlexEnd
              onChange={onToggleChangedHandler('status')}
              parentTranslationPath={parentTranslationPath}
            />
          </div>
          <div className="d-inline-flex">
            <SharedInputControl
              parentTranslationPath={parentTranslationPath}
              title="code"
              editValue={state.code}
              isDisabled={isLoading || (isCodeDisabled && isCodeDisabled.current)}
              isSubmitted={isSubmitted}
              errors={errors}
              errorPath="code"
              stateKey="code"
              pattern={numericAndAlphabeticalAndSpecialExpression}
              onValueChanged={onStateChanged}
            />
          </div>

          <div className="d-flex-v-center-h-end">
            <ButtonBase
              className="btns theme-transparent mx-3 mb-2"
              onClick={addLanguageHandler('name', state.name)}
              disabled={
                isLoading
                || languages.length === 0
                || (state.name && languages.length === Object.keys(state.name).length)
              }
            >
              <span className="fas fa-plus" />
              <span className="px-1">{t('add-language')}</span>
            </ButtonBase>
          </div>
          {state.name
            && Object.entries(state.name).map((item, index) => (
              <React.Fragment key={`namesKey${item[0]}`}>
                {index > 0 && (
                  <div className="d-flex-h-between">
                    <SharedAutocompleteControl
                      editValue={item[0]}
                      placeholder="select-language"
                      title="language"
                      stateKey="name"
                      onValueChanged={(newValue) => {
                        let localItems = { ...state.name };
                        // eslint-disable-next-line prefer-destructuring
                        localItems = LanguageUpdateKey(
                          { [item[0]]: newValue.value },
                          localItems,
                        );
                        onStateChanged({ id: 'name', value: localItems });
                      }}
                      initValues={getNotSelectedLanguage(
                        languages,
                        state.name,
                        index,
                      )}
                      initValuesKey="code"
                      initValuesTitle="title"
                      parentTranslationPath={parentTranslationPath}
                    />
                    <ButtonBase
                      className="btns theme-transparent c-danger mx-3 mt-1 mb-2"
                      onClick={removeLanguageHandler('name', state.name, item[0])}
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
                  parentId="name"
                  errors={errors}
                  errorPath={`name.${[item[0]]}`}
                  title={`${t(`${translationPath}name`)} (${getLanguageTitle(
                    languages,
                    item[0],
                  )})`}
                  isSubmitted={isSubmitted}
                  onValueChanged={onStateChanged}
                />
              </React.Fragment>
            ))}
          {/* {selectedBranchReducer && selectedBranchReducer.is_main_branch && ( */}
          {/*  <div className="px-3"> */}
          {/*    <SharedAPIAutocompleteControl */}
          {/*      isFullWidth */}
          {/*      title="branches" */}
          {/*      errors={errors} */}
          {/*      isSubmitted={isSubmitted} */}
          {/*      stateKey="branches" */}
          {/*      errorPath="branches" */}
          {/*      searchKey="search" */}
          {/*      placeholder="select-branches" */}
          {/*      idRef="branchesAutocompleteRef" */}
          {/*      onValueChanged={onStateChanged} */}
          {/*      editValue={state.branches} */}
          {/*      translationPath={translationPath} */}
          {/*      getDataAPI={GetAllSetupsBranches} */}
          {/*      type={DynamicFormTypesEnum.array.key} */}
          {/*      getItemByIdAPI={GetSetupsBranchesById} */}
          {/*      parentTranslationPath={parentTranslationPath} */}
          {/*      getOptionLabel={(option) => option.name[i18next.language] || option.name.en} */}
          {/*    /> */}
          {/*  </div> */}
          {/* )} */}
          <div className="d-flex px-3 collapse-header-wrapper">
            <ButtonBase
              className={`btns fj-between theme-transparent collapse-btn w-100 mx-0${
                (isOpenRulesCollapse && ' is-open') || ''
              }`}
              onClick={() => setIsOpenRulesCollapse((items) => !items)}
            >
              <div className="d-inline-flex px-2">
                <SwitchComponent
                  idRef="rulesSwitchRef"
                  label="rules"
                  value={state.is_with_rules}
                  isChecked={state.is_with_rules}
                  switchLabelClasses="fw-simi-bold"
                  onChange={(event, newValue) => {
                    event.preventDefault();
                    setState({ id: 'is_with_rules', value: newValue });
                    setState({ id: 'rules', value: [] });
                  }}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              </div>
              <div className="d-inline-flex-v-center">
                <TooltipsComponent
                  title="total-affected-employees"
                  translationPath={translationPath}
                  parentTranslationPath={parentTranslationPath}
                  contentComponent={
                    <span className="px-1">
                      {(state.rules
                        && state.rules.length > 0
                        && `${totalEffectedEmployees} ${
                          totalEffectedEmployees === 1
                            ? t(`${translationPath}employee`)
                            : t(`${translationPath}employees`)
                        }`)
                        || t(`${translationPath}all-employees`)}
                    </span>
                  }
                />
                <span
                  className={`px-2 fas fa-chevron-${
                    (isOpenRulesCollapse && 'up') || 'down'
                  }`}
                />
              </div>
            </ButtonBase>
          </div>

          <CollapseComponent
            isOpen={isOpenRulesCollapse}
            wrapperClasses="w-100"
            component={
              <>
                {state.rules
                  && state.rules.map((item, index) => (
                    <div
                      key={`ruleKey${index + 1}`}
                      className="d-flex-h-between px-2"
                    >
                      <div className="d-flex flex-wrap">
                        <SharedAutocompleteControl
                          isQuarterWidth
                          errors={errors}
                          stateKey="type"
                          disableClearable
                          parentId="rules"
                          parentIndex={index}
                          placeholder="select"
                          editValue={item.type}
                          initValuesTitle="value"
                          isSubmitted={isSubmitted}
                          initValues={existenceTypes}
                          idRef="ruleOneAutocompleteRef"
                          onValueChanged={(newValue) => {
                            if (item.where)
                              onStateChanged({
                                parentId: 'rules',
                                parentIndex: index,
                                id: 'where',
                                value: null,
                              });
                            if (item.value)
                              onStateChanged({
                                parentId: 'rules',
                                parentIndex: index,
                                id: 'value',
                                value: null,
                              });
                            onStateChanged(newValue);
                          }}
                          translationPath={translationPath}
                          errorPath={`rules[${index}].type`}
                          parentTranslationPath={parentTranslationPath}
                        />
                        {item.type && (
                          <SharedAutocompleteControl
                            isQuarterWidth
                            errors={errors}
                            parentId="rules"
                            stateKey="where"
                            parentIndex={index}
                            editValue={item.where}
                            initValuesTitle="value"
                            isSubmitted={isSubmitted}
                            initValues={existenceRules}
                            placeholder="select-condition"
                            onValueChanged={onStateChanged}
                            translationPath={translationPath}
                            errorPath={`rules[${index}].where`}
                            parentTranslationPath={parentTranslationPath}
                          />
                        )}
                        {item.type === CategoriesRulesTypesEnum.rule_position.key
                          && item.where && (
                          <SharedAPIAutocompleteControl
                            isQuarterWidth
                            errors={errors}
                            stateKey="value"
                            parentId="rules"
                            searchKey="search"
                            parentIndex={index}
                            placeholder="select"
                            editValue={item.value}
                            isDisabled={!item.type}
                            isSubmitted={isSubmitted}
                            onValueChanged={onStateChanged}
                            idRef="ruleThreeAutocompleteRef"
                            translationPath={translationPath}
                            getDataAPI={GetAllSetupsPositions}
                            parentTranslationPath={parentTranslationPath}
                            errorPath={`rules[${index}].value`}
                            getOptionLabel={(option) =>
                              option.name[i18next.language] || option.name.en
                            }
                            extraProps={{
                              ...(item.value && { with_than: [item.value] }),
                            }}
                          />
                        )}
                        {item.type === CategoriesRulesTypesEnum.rule_hierarchy.key
                          && item.where && (
                          <SharedAPIAutocompleteControl
                            isQuarterWidth
                            errors={errors}
                            parentId="rules"
                            stateKey="value"
                            searchKey="search"
                            parentIndex={index}
                            placeholder="select"
                            editValue={item.value}
                            isDisabled={!item.type}
                            isSubmitted={isSubmitted}
                            onValueChanged={onStateChanged}
                            getDataAPI={getSetupsHierarchy}
                            idRef="ruleThreeAutocompleteRef"
                            translationPath={translationPath}
                            parentTranslationPath={parentTranslationPath}
                            errorPath={`rules[${index}].value`}
                            getOptionLabel={(option) =>
                              option.name[i18next.language] || option.name.en
                            }
                            extraProps={{
                              ...(item.value && { with_than: [item.value] }),
                            }}
                          />
                        )}
                        {item.type === CategoriesRulesTypesEnum.rule_job_title.key
                          && item.where && (
                          <SharedAPIAutocompleteControl
                            isQuarterWidth
                            errors={errors}
                            parentId="rules"
                            stateKey="value"
                            searchKey="search"
                            parentIndex={index}
                            placeholder="select"
                            editValue={item.value}
                            isDisabled={!item.type}
                            isSubmitted={isSubmitted}
                            onValueChanged={onStateChanged}
                            idRef="ruleThreeAutocompleteRef"
                            getDataAPI={GetAllSetupsPositionsTitle}
                            translationPath={translationPath}
                            parentTranslationPath={parentTranslationPath}
                            errorPath={`rules[${index}].value`}
                            getOptionLabel={(option) =>
                              option.name[i18next.language] || option.name.en
                            }
                            extraProps={{
                              ...(item.value && { with_than: [item.value] }),
                            }}
                          />
                        )}
                        {item.type
                          === CategoriesRulesTypesEnum.rule_hierarchy_level.key
                          && item.where && (
                          <SharedAPIAutocompleteControl
                            isQuarterWidth
                            errors={errors}
                            parentId="rules"
                            stateKey="value"
                            searchKey="search"
                            parentIndex={index}
                            placeholder="select"
                            editValue={item.value}
                            isDisabled={!item.type}
                            isSubmitted={isSubmitted}
                            onValueChanged={onStateChanged}
                            idRef="ruleThreeAutocompleteRef"
                            translationPath={translationPath}
                            getDataAPI={GetAllSetupsHierarchyLevels}
                            parentTranslationPath={parentTranslationPath}
                            errorPath={`rules[${index}].value`}
                            getOptionLabel={(option) =>
                              option.name[i18next.language] || option.name.en
                            }
                            extraProps={{
                              ...(item.value && { with_than: [item.value] }),
                            }}
                          />
                        )}
                        {item.type
                          === CategoriesRulesTypesEnum.rule_job_family.key
                          && item.where && (
                          <SharedAPIAutocompleteControl
                            isQuarterWidth
                            errors={errors}
                            parentId="rules"
                            stateKey="value"
                            searchKey="search"
                            parentIndex={index}
                            placeholder="select"
                            editValue={item.value}
                            isDisabled={!item.type}
                            isSubmitted={isSubmitted}
                            onValueChanged={onStateChanged}
                            idRef="ruleThreeAutocompleteRef"
                            getDataAPI={GetAllJobCategories}
                            translationPath={translationPath}
                            parentTranslationPath={parentTranslationPath}
                            errorPath={`rules[${index}].value`}
                            getOptionLabel={(option) => option.title}
                            extraProps={{
                              ...(item.value && { with_than: [item.value] }),
                            }}
                          />
                        )}
                        {item.type
                          === CategoriesRulesTypesEnum.rule_organization_group.key
                          && item.where && (
                          <SharedAPIAutocompleteControl
                            isQuarterWidth
                            errors={errors}
                            parentId="rules"
                            stateKey="value"
                            searchKey="search"
                            parentIndex={index}
                            placeholder="select"
                            editValue={item.value}
                            isDisabled={!item.type}
                            isSubmitted={isSubmitted}
                            onValueChanged={onStateChanged}
                            idRef="ruleThreeAutocompleteRef"
                            translationPath={translationPath}
                            getDataAPI={GetAllSetupsOrganizationGroup}
                            parentTranslationPath={parentTranslationPath}
                            errorPath={`rules[${index}].value`}
                            getOptionLabel={(option) =>
                              option.name[i18next.language] || option.name.en
                            }
                            extraProps={{
                              ...(item.value && { with_than: [item.value] }),
                            }}
                          />
                        )}
                        {item.type === CategoriesRulesTypesEnum.rule_org_group.key
                          && item.where && (
                          <SharedAPIAutocompleteControl
                            isQuarterWidth
                            errors={errors}
                            parentId="rules"
                            stateKey="value"
                            searchKey="search"
                            parentIndex={index}
                            placeholder="select"
                            editValue={item.value}
                            isDisabled={!item.type}
                            isSubmitted={isSubmitted}
                            onValueChanged={onStateChanged}
                            idRef="ruleThreeAutocompleteRef"
                            translationPath={translationPath}
                            getDataAPI={GetAllSetupsNewOrganizationGroup}
                            parentTranslationPath={parentTranslationPath}
                            errorPath={`rules[${index}].value`}
                            getOptionLabel={(option) =>
                              option.name[i18next.language] || option.name.en
                            }
                            extraProps={{
                              ...(item.value && { with_than: [item.value] }),
                            }}
                          />
                        )}
                      </div>
                      <div className="d-inline-flex">
                        <ButtonBase
                          className="btns-icon theme-transparent c-warning mt-1"
                          onClick={removeRuleHandler(index)}
                        >
                          <span className="fas fa-times" />
                        </ButtonBase>
                      </div>
                    </div>
                  ))}
                <div className="d-flex px-3 mb-3">
                  <ButtonBase
                    className="btns theme-solid px-3 mx-0 w-100"
                    disabled={!state.is_with_rules}
                    onClick={addRuleHandler}
                  >
                    <span className="fas fa-plus" />
                    <span className="px-1">{t(`${translationPath}add-rule`)}</span>
                  </ButtonBase>
                </div>
              </>
            }
          />

          <div className="d-flex px-3 collapse-header-wrapper">
            <ButtonBase
              className={`btns fj-between py-3 theme-transparent collapse-btn w-100 mx-0${
                (isOpenAccessBranchesCollapse && ' is-open') || ''
              }`}
              onClick={() => setIsOpenAccessBranchesCollapse((items) => !items)}
            >
              <span className="header-text px-2">
                {t(`${translationPath}access-branches`)}
              </span>
              <span
                className={`px-2 fas fa-chevron-${
                  (isOpenAccessBranchesCollapse && 'up') || 'down'
                }`}
              />
            </ButtonBase>
          </div>
          <CollapseComponent
            isOpen={isOpenAccessBranchesCollapse}
            wrapperClasses="w-100"
            component={
              <>
                {state.access_branches
                  && state.access_branches.map((item, index) => (
                    <div
                      key={`accessBranchesKey${index + 1}`}
                      className="d-flex-h-between px-2"
                    >
                      <div className="d-flex flex-wrap">
                        <SharedAPIAutocompleteControl
                          isQuarterWidth
                          title="branch"
                          errors={errors}
                          isSubmitted={isSubmitted}
                          stateKey="branch_uuid"
                          errorPath={`access_branches[${index}].branch_uuid`}
                          parentId="access_branches"
                          parentIndex={index}
                          searchKey="search"
                          placeholder="select-branch"
                          idRef="branchesAutocompleteRef"
                          onValueChanged={(newValue) => {
                            onStateChanged(newValue);
                            if (state.access_branches[index].permissions.length)
                              onStateChanged({
                                parentId: 'access_branches',
                                parentIndex: index,
                                id: 'permissions',
                                value: [],
                              });
                            if (state.access_branches[index].data_roles.length)
                              onStateChanged({
                                parentId: 'access_branches',
                                parentIndex: index,
                                id: 'data_roles',
                                value: [],
                              });
                          }}
                          editValue={item.branch_uuid}
                          translationPath={translationPath}
                          getDataAPI={GetAllSetupsBranches}
                          parentTranslationPath={parentTranslationPath}
                          getOptionLabel={(option) =>
                            option.name[i18next.language] || option.name.en
                          }
                          extraProps={{
                            ...(item.branch_uuid && {
                              with_than: [item.branch_uuid],
                            }),
                          }}
                        />
                        {item.branch_uuid && (
                          <SharedAPIAutocompleteControl
                            key={item.branch_uuid}
                            isQuarterWidth
                            errors={errors}
                            title="permissions"
                            isSubmitted={isSubmitted}
                            stateKey="permissions"
                            errorPath={`access_branches[${index}].permissions`}
                            parentId="access_branches"
                            parentIndex={index}
                            onValueChanged={onStateChanged}
                            placeholder="select-permissions"
                            editValue={item.permissions}
                            searchKey="search"
                            idRef="permissionsAutocompleteRef"
                            translationPath={translationPath}
                            getDataAPI={GetAllSetupsPermissions}
                            type={DynamicFormTypesEnum.array.key}
                            parentTranslationPath={parentTranslationPath}
                            isDisabled={isLoading}
                            getOptionLabel={(option) =>
                              option.title[i18next.language] || option.title.en
                            }
                            extraProps={{
                              branch_uuid: item.branch_uuid,
                              status:true,
                              ...(item.permissions?.length && {
                                with_than: item.permissions,
                              }),
                            }}
                          />
                        )}
                        {item.branch_uuid && (
                          <SharedAPIAutocompleteControl
                            isQuarterWidth
                            errors={errors}
                            title="data-security-rules"
                            isSubmitted={isSubmitted}
                            stateKey="data_roles"
                            errorPath={`access_branches[${index}].data_roles`}
                            parentId="access_branches"
                            parentIndex={index}
                            onValueChanged={onStateChanged}
                            searchKey="search"
                            placeholder="select-data-security-rules"
                            editValue={item.data_roles}
                            translationPath={translationPath}
                            getDataAPI={GetAllSetupsDataSecurityRules}
                            extraProps={{
                              company_uuid: item.branch_uuid,
                              ...(item.data_roles?.length && {
                                with_than: item.data_roles,
                              }),
                            }}
                            type={DynamicFormTypesEnum.array.key}
                            parentTranslationPath={parentTranslationPath}
                            isDisabled={isLoading}
                            getOptionLabel={(option) =>
                              (option.name
                                && (option.name[i18next.language] || option.name.en))
                              || 'N/A'
                            }
                          />
                        )}
                      </div>
                      <div className="d-inline-flex">
                        <ButtonBase
                          className="btns-icon theme-transparent c-warning mt-1"
                          onClick={removeAccessBranchHandler(index)}
                        >
                          <span className="fas fa-times" />
                        </ButtonBase>
                      </div>
                    </div>
                  ))}
                <div className="d-flex px-3 mb-3">
                  <ButtonBase
                    className="btns theme-solid px-3 mx-0 w-100"
                    onClick={addAccessBranchHandler}
                  >
                    <span className="fas fa-plus" />
                    <span className="px-1">
                      {t(`${translationPath}add-access-branch`)}
                    </span>
                  </ButtonBase>
                </div>
              </>
            }
          />
          {/* <div className="d-flex px-3"> */}
          {/*  <SharedAPIAutocompleteControl */}
          {/*    isFullWidth */}
          {/*    title="extra-users" */}
          {/*    errors={errors} */}
          {/*    labelValue="extra-users" */}
          {/*    isSubmitted={isSubmitted} */}
          {/*    stateKey="selected_users" */}
          {/*    errorPath="selected_users" */}
          {/*    placeholder="select-users" */}
          {/*    idRef="usersAutocompleteRef" */}
          {/*    onValueChanged={onStateChanged} */}
          {/*    editValue={state.selected_users} */}
          {/*    translationPath={translationPath} */}
          {/*    searchKey="search" */}
          {/*    getDataAPI={GetAllSetupsEmployees} */}
          {/*    type={DynamicFormTypesEnum.array.key} */}
          {/*    extraProps={{ */}
          {/*      ...(state.selected_users?.length && { */}
          {/*        with_than: state.selected_users, */}
          {/*      }), */}
          {/*    }} */}
          {/*    parentTranslationPath={parentTranslationPath} */}
          {/*    getOptionLabel={(option) => `${ */}
          {/*        option.first_name */}
          {/*        && (option.first_name[i18next.language] || option.first_name.en) */}
          {/*      }${ */}
          {/*        option.last_name */}
          {/*        && ` ${option.last_name[i18next.language] || option.last_name.en}` */}
          {/*      }`} */}
          {/*  /> */}
          {/* </div> */}
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

GroupPermissionsManagementDialog.propTypes = {
  activeItem: PropTypes.shape({
    uuid: PropTypes.string,
  }),
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
  onSave: PropTypes.func,
};

GroupPermissionsManagementDialog.defaultProps = {
  isOpenChanged: undefined,
  onSave: undefined,
  activeItem: undefined,
  translationPath: 'GroupPermissionsDialog.',
};
