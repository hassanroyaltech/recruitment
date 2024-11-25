import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import ButtonBase from '@mui/material/ButtonBase';
import { useSelector } from 'react-redux';
import { getErrorByName, showError, showSuccess } from '../../../../../../helpers';
import {
  getLanguageTitle,
  getNotSelectedLanguage,
  PropertiesComponent,
  SetupsReducer,
  SetupsReset,
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../../shared';
import {
  CheckboxesComponent,
  CollapseComponent,
  DialogComponent,
  // SwitchComponent,
} from '../../../../../../components';
import {
  CreateSetupsPermissions,
  GetAllSetupsPermissionsCategories,
  GetSetupsPermissionsById,
  UpdateSetupsPermissions,
} from '../../../../../../services';
import './PermissionsManagement.Style.scss';
import { numericAndAlphabeticalAndSpecialExpression } from '../../../../../../utils';

export const PermissionsManagementDialog = ({
  activeItem,
  isOpen,
  onSave,
  isOpenChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeCategories, setActiveCategories] = useState([]);
  const userReducer = useSelector((state) => state?.userReducer);
  const schema = useRef(null);
  const stateInitRef = useRef({
    // status: true,
    code: '',
    title: {},
    roles_permissions: [],
  });
  const [errors, setErrors] = useState(() => ({}));

  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  // /**
  //  * @param event
  //  * @param newValue
  //  * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
  //  * @Description this method is to change the status of lookups
  //  */
  // const onStatusChangedHandler = (event, newValue) => {
  //   setState({ id: 'status', value: newValue });
  // };

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
    const response = await GetSetupsPermissionsById({
      uuid: activeItem && activeItem.uuid,
    });
    setIsLoading(false);
    if (response && response.status === 200)
      setState({ id: 'edit', value: response.data.results });
    else {
      showError(t('Shared:failed-to-get-saved-data'), response);
      isOpenChanged();
    }
  }, [activeItem, isOpenChanged, t]);
  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to check if the string is html or not
   */
  const getAllSetupsPermissionsCategories = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllSetupsPermissionsCategories();
    setIsLoading(false);
    if (response && response.status === 200)
      setState({ id: 'roles_permissions', value: response.data.results });
    else {
      showError(t('Shared:failed-to-get-saved-data'), response);
      isOpenChanged();
    }
  }, [isOpenChanged, t]);

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
      if (errors.title) showError(errors.title.message);
      return;
    }
    setIsLoading(true);
    let response;
    if (activeItem) response = await UpdateSetupsPermissions(state);
    else response = await CreateSetupsPermissions(state);
    setIsLoading(false);
    if (response && (response.status === 200 || response.status === 201)) {
      showSuccess(
        t(
          `${translationPath}${
            (activeItem && 'permission-updated-successfully')
            || 'permission-created-successfully'
          }`,
        ),
      );
      if (onSave) onSave();
      if (isOpenChanged) isOpenChanged();
    } else
      showError(
        t(
          `${translationPath}${
            (activeItem && 'permission-update-failed') || 'permission-create-failed'
          }`,
        ),
        response,
      );
  };

  /**
   * @param uuid
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get active category index
   */
  const getActiveCategoryIndex = (uuid) =>
    activeCategories.findIndex((item) => item === uuid);

  /**
   * @param items
   * @param key
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get active category index
   */
  const getIsChecked = useMemo(
    () => (items, key) => items.filter((item) => item[key]),
    [],
  );

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  // this to get saved data on edit init
  useEffect(() => {
    if (activeItem) getEditInit();
    else getAllSetupsPermissionsCategories();
  }, [activeItem, getAllSetupsPermissionsCategories, getEditInit]);

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
          id: 'title',
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
      title: yup.lazy((obj) =>
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
  }, [activeItem, t, translationPath]);

  return (
    <DialogComponent
      maxWidth="md"
      titleText={(activeItem && 'edit-permission') || 'add-new-permission'}
      dialogContent={
        <div className="permissions-management-content-dialog-wrapper">
          {/* <div className="d-flex px-2"> */}
          {/*  <SwitchComponent */}
          {/*    idRef="StatusSwitchRef" */}
          {/*    label="active" */}
          {/*    isChecked={state.status} */}
          {/*    isReversedLabel */}
          {/*    isFlexEnd */}
          {/*    onChange={onStatusChangedHandler} */}
          {/*    parentTranslationPath={parentTranslationPath} */}
          {/*  /> */}
          {/* </div> */}
          <div className="d-inline-flex">
            <SharedInputControl
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              title="code"
              editValue={state.code}
              isDisabled={isLoading || activeItem}
              isSubmitted={isSubmitted}
              errors={errors}
              errorPath="code"
              stateKey="code"
              isRequired
              pattern={numericAndAlphabeticalAndSpecialExpression}
              onValueChanged={onStateChanged}
            />
          </div>
          <div className="d-flex-v-center-h-end">
            <ButtonBase
              className="btns theme-transparent mx-3 mb-2"
              onClick={addLanguageHandler('title', state.title)}
              disabled={
                isLoading
                || languages.length === 0
                || (state.title && languages.length === Object.keys(state.title).length)
              }
            >
              <span className="fas fa-plus" />
              <span className="px-1">{t('add-language')}</span>
            </ButtonBase>
          </div>
          {state.title
            && Object.entries(state.title).map((item, index) => (
              <React.Fragment key={`namesKey${index + 1}`}>
                {index > 0 && (
                  <div className="d-flex-h-between">
                    <SharedAutocompleteControl
                      editValue={item[0]}
                      placeholder="select-language"
                      title="language"
                      stateKey="title"
                      onValueChanged={(newValue) => {
                        const localItems = { ...state.title };
                        // eslint-disable-next-line prefer-destructuring
                        localItems[newValue.value] = item[1];
                        delete localItems[item[0]];
                        onStateChanged({
                          id: 'title',
                          value: localItems,
                        });
                      }}
                      initValues={getNotSelectedLanguage(
                        languages,
                        state.title,
                        index,
                      )}
                      initValuesKey="code"
                      initValuesTitle="title"
                      parentTranslationPath={parentTranslationPath}
                    />
                    <ButtonBase
                      className="btns theme-transparent c-danger mx-3 mt-1 mb-2"
                      onClick={removeLanguageHandler('title', state.title, item[0])}
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
                  parentId="title"
                  errors={errors}
                  errorPath={`title.${[item[0]]}`}
                  title={`${t(`${translationPath}name`)} (${getLanguageTitle(
                    languages,
                    item[0],
                  )})`}
                  isSubmitted={isSubmitted}
                  onValueChanged={onStateChanged}
                />
              </React.Fragment>
            ))}
          <div className="categories-permissions-wrapper">
            <span className="permission-checkboxes-wrapper fw-simi-bold px-2">
              <span className="title-wrapper">
                {t(`${translationPath}category-name`)}
              </span>
              <span className="permission-checkboxes-wrapper">
                <div className="permission-checkbox-item-wrapper">
                  {t(`${translationPath}create`)}
                </div>
                <div className="permission-checkbox-item-wrapper">
                  {t(`${translationPath}edit`)}
                </div>
                <div className="permission-checkbox-item-wrapper">
                  {t(`${translationPath}delete`)}
                </div>
                <div className="permission-checkbox-item-wrapper">
                  {t(`${translationPath}view`)}
                </div>
                <div className="permission-checkbox-item-wrapper">
                  {t(`${translationPath}publish`)}
                </div>
              </span>
            </span>
            {state.roles_permissions.map((item, index, parentItems) => (
              <React.Fragment key={`${item.category_uuid}${index + 1}`}>
                <ButtonBase
                  className="btns theme-shared category-btn"
                  onClick={() =>
                    setActiveCategories((items) => {
                      const localItems = [...items];
                      const itemIndex = getActiveCategoryIndex(item.category_uuid);
                      if (itemIndex !== -1) localItems.splice(itemIndex, 1);
                      else localItems.push(item.category_uuid);
                      return localItems;
                    })
                  }
                >
                  <span className="title-wrapper">{item.title}</span>
                  <span className="permission-checkboxes-wrapper">
                    <div className="permission-checkbox-item-wrapper">
                      <CheckboxesComponent
                        idRef={`create${item.category_uuid}-${index + 1}`}
                        singleChecked={
                          item.permissions
                          && getIsChecked(item.permissions, 'create').length
                            === item.permissions.length
                          && getIsChecked(item.permissions, 'create').length > 0
                        }
                        singleIndeterminate={
                          item.permissions
                          && getIsChecked(item.permissions, 'create').length
                            !== item.permissions.length
                          && getIsChecked(item.permissions, 'create').length > 0
                        }
                        label="create"
                        parentTranslationPath={parentTranslationPath}
                        translationPath={translationPath}
                        onSelectedCheckboxClicked={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          let localPermissions = [...item.permissions];
                          if (
                            item.permissions
                            && getIsChecked(item.permissions, 'create').length
                              === item.permissions.length
                            && getIsChecked(item.permissions, 'create').length > 0
                          )
                            localPermissions = localPermissions.map((items) => ({
                              ...items,
                              create: false,
                            }));
                          else
                            localPermissions = localPermissions.map((items) => ({
                              ...items,
                              create: true,
                            }));
                          setState({
                            parentId: 'roles_permissions',
                            parentIndex: index,
                            id: 'permissions',
                            value: localPermissions,
                          });
                        }}
                      />
                    </div>
                    <div className="permission-checkbox-item-wrapper">
                      <CheckboxesComponent
                        idRef={`edit${item.category_uuid}-${index + 1}`}
                        singleChecked={
                          item.permissions
                          && getIsChecked(item.permissions, 'edit').length
                            === item.permissions.length
                          && getIsChecked(item.permissions, 'edit').length > 0
                        }
                        singleIndeterminate={
                          item.permissions
                          && getIsChecked(item.permissions, 'edit').length
                            !== item.permissions.length
                          && getIsChecked(item.permissions, 'edit').length > 0
                        }
                        label={t(`${translationPath}edit`)}
                        parentTranslationPath={parentTranslationPath}
                        translationPath={translationPath}
                        onSelectedCheckboxClicked={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          let localPermissions = [...item.permissions];
                          if (
                            item.permissions
                            && getIsChecked(item.permissions, 'edit').length
                              === item.permissions.length
                            && getIsChecked(item.permissions, 'edit').length > 0
                          )
                            localPermissions = localPermissions.map((items) => ({
                              ...items,
                              edit: false,
                            }));
                          else
                            localPermissions = localPermissions.map((items) => ({
                              ...items,
                              edit: true,
                            }));
                          setState({
                            parentId: 'roles_permissions',
                            parentIndex: index,
                            id: 'permissions',
                            value: localPermissions,
                          });
                        }}
                      />
                    </div>
                    <div className="permission-checkbox-item-wrapper">
                      <CheckboxesComponent
                        idRef={`delete${item.category_uuid}-${index + 1}`}
                        singleChecked={
                          item.permissions
                          && getIsChecked(item.permissions, 'delete').length
                            === item.permissions.length
                          && getIsChecked(item.permissions, 'delete').length > 0
                        }
                        singleIndeterminate={
                          item.permissions
                          && getIsChecked(item.permissions, 'delete').length
                            !== item.permissions.length
                          && getIsChecked(item.permissions, 'delete').length > 0
                        }
                        label={t(`${translationPath}delete`)}
                        onSelectedCheckboxClicked={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          let localPermissions = [...item.permissions];
                          if (
                            item.permissions
                            && getIsChecked(item.permissions, 'delete').length
                              === item.permissions.length
                            && getIsChecked(item.permissions, 'delete').length > 0
                          )
                            localPermissions = localPermissions.map((items) => ({
                              ...items,
                              delete: false,
                            }));
                          else
                            localPermissions = localPermissions.map((items) => ({
                              ...items,
                              delete: true,
                            }));
                          setState({
                            parentId: 'roles_permissions',
                            parentIndex: index,
                            id: 'permissions',
                            value: localPermissions,
                          });
                        }}
                      />
                    </div>
                    <div className="permission-checkbox-item-wrapper">
                      <CheckboxesComponent
                        idRef={`view${item.category_uuid}-${index + 1}`}
                        singleChecked={
                          item.permissions
                          && getIsChecked(item.permissions, 'view').length
                            === item.permissions.length
                          && getIsChecked(item.permissions, 'view').length > 0
                        }
                        singleIndeterminate={
                          item.permissions
                          && getIsChecked(item.permissions, 'view').length
                            !== item.permissions.length
                          && getIsChecked(item.permissions, 'view').length > 0
                        }
                        label={t(`${translationPath}view`)}
                        onSelectedCheckboxClicked={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          let localPermissions = [...item.permissions];
                          if (
                            item.permissions
                            && getIsChecked(item.permissions, 'view').length
                              === item.permissions.length
                            && getIsChecked(item.permissions, 'view').length > 0
                          )
                            localPermissions = localPermissions.map((items) => ({
                              ...items,
                              view: false,
                            }));
                          else
                            localPermissions = localPermissions.map((items) => ({
                              ...items,
                              view: true,
                            }));
                          setState({
                            parentId: 'roles_permissions',
                            parentIndex: index,
                            id: 'permissions',
                            value: localPermissions,
                          });
                        }}
                      />
                    </div>
                    <div className="permission-checkbox-item-wrapper">
                      <CheckboxesComponent
                        idRef={`publish${item.category_uuid}-${index + 1}`}
                        singleChecked={
                          item.permissions
                          && getIsChecked(item.permissions, 'publish').length
                            === item.permissions.length
                          && getIsChecked(item.permissions, 'publish').length > 0
                        }
                        singleIndeterminate={
                          item.permissions
                          && getIsChecked(item.permissions, 'publish').length
                            !== item.permissions.length
                          && getIsChecked(item.permissions, 'publish').length > 0
                        }
                        label={t(`${translationPath}publish`)}
                        onSelectedCheckboxClicked={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          let localPermissions = [...item.permissions];
                          if (
                            item.permissions
                            && getIsChecked(item.permissions, 'publish').length
                              === item.permissions.length
                            && getIsChecked(item.permissions, 'publish').length > 0
                          )
                            localPermissions = localPermissions.map((items) => ({
                              ...items,
                              publish: false,
                            }));
                          else
                            localPermissions = localPermissions.map((items) => ({
                              ...items,
                              publish: true,
                            }));
                          setState({
                            parentId: 'roles_permissions',
                            parentIndex: index,
                            id: 'permissions',
                            value: localPermissions,
                          });
                        }}
                      />
                    </div>
                  </span>
                </ButtonBase>
                <div className="d-flex px-2">
                  {(index < parentItems.length - 1
                    || getActiveCategoryIndex(item.category_uuid) === index) && (
                    <span className="separator-h my-2" />
                  )}
                </div>
                <div className="w-100">
                  <CollapseComponent
                    isOpen={getActiveCategoryIndex(item.category_uuid) === index}
                    component={
                      <PropertiesComponent
                        properties={item.permissions}
                        parentIndex={index}
                        onStateChanged={onStateChanged}
                        subParentId="permissions"
                        parentId="roles_permissions"
                      />
                    }
                  />
                </div>
              </React.Fragment>
            ))}
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

PermissionsManagementDialog.propTypes = {
  activeItem: PropTypes.shape({
    uuid: PropTypes.string,
  }),
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
  onSave: PropTypes.func,
};

PermissionsManagementDialog.defaultProps = {
  isOpenChanged: undefined,
  onSave: undefined,
  activeItem: undefined,
  translationPath: 'PermissionsManagementDialog.',
};
