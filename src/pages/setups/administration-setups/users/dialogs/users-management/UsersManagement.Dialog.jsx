import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import * as yup from 'yup';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AccessTab, InformationTab } from './tabs';
import { SetupsUsersTypesEnums } from '../../../../../../enums';
import { getErrorByName, showError, showSuccess } from '../../../../../../helpers';
import {
  SetupsReset,
  SetupsReducer,
  getNotSelectedLanguage,
} from '../../../../shared';
import {
  DialogComponent,
  SwitchComponent,
  TabsComponent,
} from '../../../../../../components';
import {
  CreateSetupsUsers,
  UpdateSetupsUsers,
  getSetupsUsersById,
  GetAllSetupsPermissionsCategories,
} from '../../../../../../services';
import { emailExpression } from '../../../../../../utils';

export const UsersManagementDialog = ({
  onSave,
  isOpen,
  userType,
  activeItem,
  isOpenChanged,
  translationPath,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [saveClickedCount, setSaveClickedCount] = useState(0);
  const [permissionsCategories, setPermissionsCategories] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const userReducer = useSelector((state) => state?.userReducer);
  const schema = useRef(null);
  const account_uuid = JSON.parse(localStorage.getItem('account'))
    ? JSON.parse(localStorage.getItem('account')).account_uuid
    : '';
  const stateInitRef = useRef({
    account_uuid,
    code: '',
    first_name: {},
    second_name: null,
    third_name: null,
    last_name: {},
    email: '',
    user_type: null,
    is_cc_email: true,
    is_master: true,
    is_active: true,
    user_access: [
      {
        status: true,
        company_uuid: '',
        category_uuid: [],
        permissions: [],
        role_permissions: [],
      },
    ],
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
    const response = await getSetupsUsersById({
      uuid: activeItem && activeItem.uuid,
    });
    setIsLoading(false);
    if (response && response.status === 200)
      setState({
        id: 'edit',
        value: { account_uuid, ...response.data.results },
      });
    else {
      showError(t('Shared:failed-to-get-saved-data'), response);
      isOpenChanged();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeItem, t]);

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
      response = await UpdateSetupsUsers({
        ...state,
        email: state?.email?.toLowerCase(),
      });
    else
      response = await CreateSetupsUsers({
        ...state,
        email: state?.email?.toLowerCase(),
      });
    setIsLoading(false);
    if (response && (response.status === 200 || response.status === 201)) {
      window?.ChurnZero?.push([
        'trackEvent',
        'Create a new user',
        'Create a new user from setups',
        1,
        {},
      ]);
      showSuccess(
        t(
          `${translationPath}${
            (activeItem && 'user-updated-successfully')
            || 'user-created-successfully'
          }`,
        ),
      );
      if (onSave) onSave();
      if (isOpenChanged) isOpenChanged();
    } else
      showError(
        t(
          `${translationPath}${
            (activeItem && 'user-update-failed') || 'user-create-failed'
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
    setState({ id: 'is_active', value: newValue });
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

  // this to init errors schema
  useEffect(() => {
    const itemSchema = yup.object({
      company_uuid: yup
        .string()
        .nullable()
        .min(
          1,
          `${t('please-select-at-least')} ${1} ${t(
            `${translationPath}${userType.valueSingle}-company`,
          )}`,
        ),
      category_uuid: yup
        .array()
        .nullable()
        .min(
          1,
          `${t('please-select-at-least')} ${1} ${t(
            `${translationPath}${userType.valueSingle}-category`,
          )}`,
        ),
      permissions: yup
        .array()
        .nullable()
        .min(
          1,
          `${t('please-select-at-least')} ${1} ${t(
            `${translationPath}${userType.valueSingle}-permission`,
          )}`,
        ),
    });

    schema.current = yup.object().shape({
      user_access: yup
        .array()
        .nullable()
        .when('is_master', (is_master, field) => {
          if (!is_master)
            return field
              .of(itemSchema)
              .min(1, `${t('please-add-at-least')} ${1} ${t('item')}`)
              .required(`${t('please-add-at-least')} ${1} ${t('item')}`);

          return field;
        }),
      category_uuid: yup
        .array()
        .nullable()
        .min(
          1,
          `${t('please-select-at-least')} ${1} ${t(
            `${translationPath}${userType.valueSingle}-category`,
          )}`,
        ),
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
      user_type: yup.string().nullable().required(t('this-field-is-required')),
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
      last_name: yup.lazy((obj) =>
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
    });
  }, [activeItem, t, translationPath, userType.valueSingle]);

  // this is to get the permissions categories on init
  useEffect(() => {
    getAllSetupsPermissionsCategories();
  }, [getAllSetupsPermissionsCategories]);

  return (
    <DialogComponent
      maxWidth="lg"
      titleText={
        (activeItem && `edit-${userType.valueSingle}`)
        || `add-new-${userType.valueSingle}`
      }
      dialogContent={
        <div className="setups-management-content-dialog-wrapper">
          <div className="d-flex px-3 pb-0">
            <SwitchComponent
              isFlexEnd
              label="active"
              isReversedLabel
              idRef="StatusSwitchRef"
              isChecked={state.is_active}
              onChange={onStatusChangedHandler}
              parentTranslationPath={parentTranslationPath}
            />
          </div>
          <div className="pb-4">
            <TabsComponent
              isPrimary
              isWithLine
              labelInput="label"
              currentTab={activeTab}
              idRef="usersManagementTabsRef"
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              data={
                (!state.is_master && [{ label: 'info' }, { label: 'access' }]) || [
                  { label: 'info' },
                ]
              }
              onTabChanged={(event, currentTab) => setActiveTab(currentTab)}
            />
          </div>
          {activeTab === 0 && (
            <InformationTab
              state={state}
              errors={errors}
              setState={setState}
              isLoading={isLoading}
              languages={languages}
              activeItem={activeItem}
              isSubmitted={isSubmitted}
              onStateChanged={onStateChanged}
              translationPath={translationPath}
              addLanguageHandler={addLanguageHandler}
              removeLanguageHandler={removeLanguageHandler}
              parentTranslationPath={parentTranslationPath}
            />
          )}
          {activeTab === 1 && !state.is_master && (
            <AccessTab
              state={state}
              errors={errors}
              setState={setState}
              isSubmitted={isSubmitted}
              saveClickedCount={saveClickedCount}
              onStateChanged={onStateChanged}
              translationPath={translationPath}
              permissionsCategories={permissionsCategories}
              parentTranslationPath={parentTranslationPath}
            />
          )}
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

UsersManagementDialog.propTypes = {
  activeItem: PropTypes.shape({
    uuid: PropTypes.string,
  }),
  userType: PropTypes.oneOf(Object.values(SetupsUsersTypesEnums).map((item) => item))
    .isRequired,
  onSave: PropTypes.func,
  isOpenChanged: PropTypes.func,
  translationPath: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
};
UsersManagementDialog.defaultProps = {
  onSave: undefined,
  activeItem: undefined,
  isOpenChanged: undefined,
  translationPath: 'UsersInfoDialog.',
};
