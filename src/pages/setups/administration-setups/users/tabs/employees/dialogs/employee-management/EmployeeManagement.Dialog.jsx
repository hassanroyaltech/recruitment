import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import {
  getErrorByName,
  showError,
  showSuccess,
} from '../../../../../../../../helpers';
import {
  getNotSelectedLanguage,
  SetupsReducer,
  SetupsReset,
} from '../../../../../../shared';
import { DialogComponent, TabsComponent } from '../../../../../../../../components';
import {
  UpdateSetupsEmployees,
  CreateSetupsEmployees,
  getSetupsEmployeesById,
  GetAllSetupsPermissionsCategories,
} from '../../../../../../../../services';
import './EmployeesManagement.Style.scss';
import { EmployeeManagementTabs } from '../../../../../../shared/tabs-data';
import { emailExpression, phoneExpression } from '../../../../../../../../utils';

export const EmployeeManagementDialog = ({
  onSave,
  isOpen,
  activeItem,
  isOpenChanged,
  translationPath,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [employeeTabsData] = useState(() => EmployeeManagementTabs);
  const [isLoading, setIsLoading] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [saveClickedCount, setSaveClickedCount] = useState(0);
  const [permissionsCategories, setPermissionsCategories] = useState([]);
  const userReducer = useSelector((state) => state?.userReducer);
  const selectedBranchReducer = useSelector((state) => state?.selectedBranchReducer);
  const [activeTab, setActiveTab] = useState(0);
  const account_uuid = JSON.parse(localStorage.getItem('account'))
    ? JSON.parse(localStorage.getItem('account')).account_uuid
    : '';
  const stateInitRef = useRef({
    account_uuid,
    company_uuid: (selectedBranchReducer && selectedBranchReducer.uuid) || null,
    code: '',
    first_name: {},
    second_name: null,
    third_name: null,
    last_name: {},
    email: null,
    position_uuid: null,
    position_title_uuid: null,
    gender_uuid: null,
    marital_status_uuid: null,
    religion_uuid: null,
    nationality_uuid: null,
    hiring_date: null,
    joining_date: null,
    national_number: null,
    passport_number: null,
    category_uuid: [],
    status: true,
    direct_manager_uuid: null,
    is_head_of_department: null,
    birth_date: null,
    sponsor_uuid: null,
    hierarchy_uuid: null,
    contract_type_uuid: null,
    project_uuid: null,
    work_type_uuid: null,
    salary: null,
    phone: null,
    user_access: [
      {
        company_uuid: '',
        permissions: [],
        role_permissions: [],
      },
    ],
    // branch_uuid: [],
    // is_citizen: null,
    // location_uuid: null,
    // extension: null,
    // facebook_account_link: null,
    // twitter_account_link: null,
    // linkedin_account_link: null,
    // skype_account_link: null,
    // organization_group_uuid: null,
    // user_type: '',
    // with_access: true,
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
    getErrorByName(
      {
        current: yup.object().shape({
          code: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('this-field-is-required'),
              (value) => value || activeItem,
            ),
          email: yup
            .string()
            .nullable()
            .matches(emailExpression, {
              message: t('invalid-email'),
              excludeEmptyString: true,
            })
            .required(t('this-field-is-required')),
          status: yup.number().nullable().required(t('this-field-is-required')),
          // hierarchy_uuid: yup.string().nullable().required(t('this-field-is-required')),
          category_uuid: yup
            .array()
            .nullable()
            .min(1, `${t('please-add-at-least')} ${1} ${t('category')}`),
          // position_uuid: yup.string().nullable().required(t('this-field-is-required')),
          gender_uuid: yup.string().nullable(),
          marital_status_uuid: yup.string().nullable(),
          national_number: yup.string().nullable(),
          religion_uuid: yup.string().nullable(),
          birth_date: yup.string().nullable(),
          nationality_uuid: yup.string().nullable(),
          hiring_date: yup.string().nullable(),
          joining_date: yup.string().nullable(),
          // position_title_uuid: yup
          //   .string()
          //   .nullable()
          //   .required(t('this-field-is-required')),
          phone: yup
            .string()
            .nullable()
            .matches(phoneExpression, {
              message: t('invalid-phone-number'),
              excludeEmptyString: true,
            })
            .required(t('this-field-is-required')),
          user_access: yup
            .array()
            .nullable()
            .of(
              yup
                .object()
                .nullable()
                .shape({
                  company_uuid: yup
                    .string()
                    .nullable()
                    .required(t('this-field-is-required')),
                  permissions: yup
                    .array()
                    .nullable()
                    .min(
                      1,
                      `${t('please-select-at-least')} ${1} ${t('permission')}`,
                    ),
                  role_permissions: yup
                    .array()
                    .nullable()
                    .min(
                      1,
                      `${t('please-select-at-least')} ${1} ${t('permission')}`,
                    ),
                }),
            )
            .required(`${t('please-add-at-least')} ${1} ${t('access')}`),
          // user_type: yup.string().nullable().required(t('this-field-is-required')),
          first_name: yup.lazy((obj) =>
            yup
              .object()
              .shape(
                Object.keys(obj || {}).reduce(
                  (newMap, key) => ({
                    ...newMap,
                    [key]: yup
                      .string()
                      .nullable()
                      .required(t('this-field-is-required')),
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
                Object.keys(obj || {}).reduce(
                  (newMap, key) => ({
                    ...newMap,
                    [key]: yup.string().nullable(),
                  }),
                  {},
                ),
              )
              .nullable(),
          ),
          third_name: yup.lazy((obj) =>
            yup
              .object()
              .shape(
                Object.keys(obj || {}).reduce(
                  (newMap, key) => ({
                    ...newMap,
                    [key]: yup.string().nullable(),
                  }),
                  {},
                ),
              )
              .nullable(),
          ),
          last_name: yup.lazy((obj) =>
            yup
              .object()
              .shape(
                Object.keys(obj || {}).reduce(
                  (newMap, key) => ({
                    ...newMap,
                    [key]: yup
                      .string()
                      .nullable()
                      .required(t('this-field-is-required')),
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
        }),
      },
      state,
    ).then((result) => {
      setErrors(result);
    });
  }, [activeItem, state, t]);

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
    setSaveClickedCount((item) => item + 1);

    const keys = Object.keys(errors);
    if (keys.length) {
      if (keys.every((key) => key.startsWith('user_access') && activeTab === 0))
        setActiveTab(1);
      else if (!keys.some((key) => key.startsWith('user_access'))) setActiveTab(0);
      return;
    }

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
        'Create a new employee from setups',
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
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the permissions categories on init
   */
  const getAllSetupsPermissionsCategories = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllSetupsPermissionsCategories();
    setIsLoading(false);
    if (response && response.status === 200) {
      const { results } = response.data;
      setPermissionsCategories(results);
    } else {
      showError(t('Shared:failed-to-get-saved-data'), response);
      isOpenChanged();
    }
  }, [isOpenChanged, t]);

  // /**
  //  * @param event
  //  * @param newValue
  //  * @author Manaf Hijazi (m.hijazi@elevatus.io)
  //  * @Description this method is to change the status of lookups
  //  */
  // const onIsCitizenChangedHandler = (event, newValue) => {
  //   setState({ id: 'is_citizen', value: newValue });
  // };

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
          id: ['first_name', 'last_name'],
          value: {
            [localEnLanguage.code]: null,
          },
        });
    }
  }, [activeItem, languages]);

  // this is to get the permissions categories on init
  useEffect(() => {
    getAllSetupsPermissionsCategories();
  }, [getAllSetupsPermissionsCategories]);

  return (
    <DialogComponent
      maxWidth="lg"
      titleText={(activeItem && 'edit-employee') || 'add-new-employee'}
      dialogContent={
        <div className="setups-management-content-dialog-wrapper">
          <TabsComponent
            isPrimary
            isWithLine
            labelInput="label"
            idRef="employeeTabsRef"
            tabsContentClasses="pt-3"
            data={employeeTabsData}
            currentTab={activeTab}
            translationPath={translationPath}
            onTabChanged={(event, currentTab) => {
              setActiveTab(currentTab);
            }}
            parentTranslationPath={parentTranslationPath}
            dynamicComponentProps={{
              state,
              errors,
              onStateChanged,
              isSubmitted,
              saveClickedCount,
              isLoading,
              languages,
              addLanguageHandler,
              permissionsCategories,
              removeLanguageHandler,
              parentTranslationPath,
              translationPath,
            }}
          />
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
