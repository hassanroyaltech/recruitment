/* eslint-disable react/prop-types,react/destructuring-assignment */
// React and reactstrap
import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
// Context API
import { useTranslation } from 'react-i18next';
// Require module
import * as yup from 'yup';
import { CategoriesAutocompleteControl } from './controls';
import { getErrorByName, showError, showSuccess } from '../../../../helpers';
import { DialogComponent, TabsComponent } from '../../../../components';
import { SignupRequirementsDialogTabs } from '../shared';
import {
  BulkUpdateSignupRequirements,
  GetAllSignupRequirements,
} from '../../../../services';
import './SignupRequirementsManagement.Style.scss';

const translationPath = '';
const parentTranslationPath = 'EvaBrand';

/**
 * Signup requirements modal component
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export const SignupRequirementsManagementDialog = ({
  isOpen,
  language_uuid,
  isShowCategory,
  language,
  isOpenChanged,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [errors, setErrors] = useState({});
  const [signupRequirementsTabsData] = useState(() => SignupRequirementsDialogTabs);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const initStateRef = useRef({
    changedCategoriesRequirements: [],
    activeCategoryRequirements: null,
    categoriesRequirements: [],
  });
  // Tabs
  // ref for errors schema for form errors
  const schema = useRef(
    yup.object().shape({
      category_uuid: yup.string().nullable(),
      // .required(t(`${translationPath}job-category-is-required`)),
      activeCategoryRequirements: yup
        .object()
        .nullable()
        .shape({
          profile: yup.object().shape({
            dynamic_properties: yup
              .array()
              .of(
                yup.object().shape({
                  uuid: yup
                    .string()
                    .nullable()
                    .when('value', (value, field) =>
                      value
                        ? field.required(t('Shared:this-field-is-required'))
                        : field,
                    ),
                }),
              )
              .nullable(),
          }),
        }),
      categoriesRequirements: yup
        .array()
        .nullable()
        .min(1, t(`${translationPath}please-select-at-least-one-job-category`)),
    }),
  );
  // method to reset all state values (with lazy load)
  const reset = (values) => ({
    ...values,
  });
  // reducer to update the state on edit or rest or only single item
  const reducer = useCallback((state, action) => {
    if (action.id === 'reset') return reset(action.value);
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return { ...action.value };
  }, []);
  // state with useReducer react hook
  const [state, setState] = useReducer(
    reducer,
    JSON.parse(JSON.stringify(initStateRef.current)),
    reset,
  );
  // a method to update errors for form on state changed
  const getErrors = useCallback(() => {
    getErrorByName(schema, state).then((result) => {
      setErrors(result);
    });
  }, [state]);
  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get saved data & init it
   */
  const getAllSignupRequirements = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllSignupRequirements({
      language_uuid,
    });
    setIsLoading(false);
    if (response && response.status === 200) {
      let initDto = response.data.results;
      initDto = initDto.map((item) => ({
        ...item,
        language_uuid,
        questions: item.questions || [],
      }));
      setState({
        id: 'edit',
        value: {
          ...(initStateRef.current || {}),
          category_uuid:
            (response.data.results.length > 0
              && response.data.results[0].category_uuid)
            || null,
          activeCategoryRequirements:
            (initDto.length > 0 && {
              ...initDto[0],
            })
            || null,
          categoriesRequirements: initDto,
        },
      });
    } else {
      showError(t('Shared:failed-to-get-saved-data'), response);
      isOpenChanged();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language_uuid, t]);

  // /**
  //  * Handler for 'Save' button
  //  * @returns {*}
  //  */
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    // updateData();
    if (state.changedCategoriesRequirements.length === 0) {
      isOpenChanged();
      return;
    }
    setIsLoading(true);
    const localToSaveItems = [
      ...state.changedCategoriesRequirements.map((item) => ({
        ...item,
        dynamic_properties: (item?.dynamic_properties || []).map(
          ({ uuid, value }) => ({
            uuid,
            value,
          }),
        ),
      })),
    ];
    const response = await BulkUpdateSignupRequirements(localToSaveItems);
    setIsLoading(false);
    if (!response || response.message) {
      showError(
        response?.message
          || t(`${translationPath}signup-requirements-update-failed`),
      );
      return;
    }
    const successIndex = [];
    let failedItems = response.filter((item) => item instanceof Error);
    response.map((item, index) => {
      if (!(item instanceof Error)) successIndex.splice(0, 0, index);
      return undefined;
    });
    successIndex.map((item) => {
      localToSaveItems.splice(item, 1);
      return undefined;
    });
    failedItems = failedItems.reduce(
      (total, item) =>
        (item?.response?.data?.errors
          && total.concat(
            Object.entries(item.response.data.errors).map((el) => ({
              key: (JSON.parse(item.config?.data)?.category_title || '') + el[0],
              value: `${JSON.parse(item.config?.data)?.category_title || ''} - ${
                el[1]
              }`,
            })),
          ))
        || total,
      [],
    );
    if (localToSaveItems.length > 0) {
      if (localToSaveItems.length !== state.changedCategoriesRequirements.length)
        setState({ id: 'changedCategoriesRequirements', value: localToSaveItems });
      showError(
        (failedItems && failedItems.length > 0 && (
          <ul className="mb-0">
            {failedItems.map((item) => (
              <li key={item.key}>{item.value}</li>
            ))}
          </ul>
        ))
          || t(`${translationPath}signup-requirements-update-failed`),
      );
    } else {
      window?.ChurnZero?.push([
        'trackEvent',
        'Eva Brand - Sign up requirements',
        'Sign up requirements',
        1,
        {},
      ]);
      showSuccess(t(`${translationPath}signup-requirements-updated-successfully`));
      isOpenChanged();
    }
  };

  // method to update state on child update it
  const onStateChanged = (newValue) => {
    setState(newValue);
    setIsChanged(true);
  };

  /**
   * Prepare by getting the signup requirements data
   */
  useEffect(() => {
    if (language_uuid) getAllSignupRequirements();
  }, [getAllSignupRequirements, language_uuid]);

  // To update errors when state change
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);
  /**
   * Return the SignupRequirements Modal
   * @return {JSX.Element}
   */
  return (
    <DialogComponent
      titleText={`${t(`${translationPath}signup-requirements`)} (${t(
        `Shared:${language?.code}`,
      )})`}
      saveText="update"
      maxWidth="md"
      // tabs={[t(`${translationPath}general`), t(`${translationPath}questionnaire`)]}
      // subtitle={t(`${translationPath}signup-requirements-subtitle`)}
      dialogContent={
        <div className="signup-requirements-dialog px-2">
          <div className="c-gray-primary">
            <span>{t(`${translationPath}signup-requirements-subtitle`)}</span>
          </div>
          <div className="d-flex-v-center-h-end">
            <CategoriesAutocompleteControl
              translationPath={translationPath}
              isSubmitted={isSubmitted}
              editValue={state.category_uuid}
              title="job-category"
              placeholder="select-job-category"
              parentTranslationPath={parentTranslationPath}
              errors={errors}
              isDisabled={isLoading || !isShowCategory}
              onValueChanged={(newValue) => {
                setState(newValue);
                if (!newValue.value) {
                  setState({
                    id: 'activeCategoryRequirements',
                    value: null,
                  });
                  return;
                }
                const currentActiveRequirements = state.categoriesRequirements.find(
                  (item) => item.category_uuid === newValue.value,
                );
                setState({
                  id: 'activeCategoryRequirements',
                  value: currentActiveRequirements,
                });
              }}
              stateKey="category_uuid"
            />
          </div>
          <TabsComponent
            data={signupRequirementsTabsData}
            currentTab={currentTab}
            labelInput="label"
            idRef="SignupRequirementsTabsRef"
            isWithLine
            isPrimary
            onTabChanged={(event, newTab) => {
              setCurrentTab(newTab);
            }}
            isDisabled={isLoading}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            dynamicComponentProps={{
              state,
              onStateChanged,
              isLoading,
              translationPath,
              parentTranslationPath,
              isShowCategory,
              isSubmitted,
              errors,
            }}
          />
        </div>
      }
      isSaving={isLoading}
      isOpen={isOpen}
      saveIsDisabled={!isChanged}
      isOldTheme
      isEdit
      onSubmit={saveHandler}
      // cancelButtonHandler
      onCloseClicked={isOpenChanged}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
    />
  );
};

SignupRequirementsManagementDialog.prototype = {
  isOpen: PropTypes.bool.isRequired,
  language: PropTypes.instanceOf(Object).isRequired,
  language_uuid: PropTypes.string,
  isShowCategory: PropTypes.bool,
  isOpenChanged: PropTypes.func.isRequired,
};

SignupRequirementsManagementDialog.defaultProps = {
  language_uuid: undefined,
  isShowCategory: false,
};
