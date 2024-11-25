import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import ButtonBase from '@mui/material/ButtonBase';
import { useSelector } from 'react-redux';
import {
  getErrorByName,
  showError,
  showSuccess,
  LanguageUpdateKey,
} from '../../../../../../helpers';
import {
  getLanguageTitle,
  getNotSelectedLanguage,
  SetupsReducer,
  SetupsReset,
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../../shared';
import { DialogComponent } from '../../../../../../components';
import { PermissionsManagementComponent } from './PermissionsManagementComponent';
import {
  CreateSetupsPermissions,
  GetAllSetupsPermissionsCategories,
  GetSetupsPermissionsById,
  UpdateSetupsPermissions,
} from '../../../../../../services';
import './PermissionsManagement.Style.scss';
import { numericAndAlphabeticalAndSpecialExpression } from '../../../../../../utils';

export const PermissionsManagementDialogV2 = ({
  isOpen,
  onSave,
  activeItem,
  isOpenChanged,
  translationPath,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [languages, setLanguages] = useState([]);
  const [permissionsCategories, setPermissionsCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const userReducer = useSelector((state) => state?.userReducer);
  const schema = useRef(null);
  const stateInitRef = useRef({
    code: "",
    title: {},
    roles_permissions: [],
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
   * @Description this method is sent new value for state from child
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

    if (response && response.status === 200) {
      const { results } = response.data;
      setPermissionsCategories(results);
      setIsLoading(false);
    } else {
      showError(t('Shared:failed-to-get-saved-data'), response);
      setIsLoading(false);
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
      if (!activeItem)
        window?.ChurnZero?.push([
          'trackEvent',
          `Create a new permission`,
          `Create a new permission from setups`,
          1,
          {},
        ]);
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
      if (!activeItem)
        window?.ChurnZero?.push([
          'trackEvent',
          'Create new permission',
          'Create new permission from setups',
          1,
          {},
        ]);
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

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  // this to call errors updater when state changed
  useEffect(() => {
    if (activeItem) getEditInit();
  }, [activeItem, getEditInit]);

  // this to get saved data on edit init
  useEffect(() => {
    getAllSetupsPermissionsCategories();
  }, [getAllSetupsPermissionsCategories]);

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
      dialogContent={
        <div className="permissions-management-content-dialog-wrapper">
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
                || (state.title
                  && languages.length === Object.keys(state.title).length)
                || (activeItem && !state.can_delete)
              }
            >
              <span className="fas fa-plus" />
              <span className="px-1">{t('add-language')}</span>
            </ButtonBase>
          </div>
          {state.title
            && Object.entries(state.title).map((item, index) => (
              <React.Fragment key={`${item[0]}namesKey`}>
                {index > 0 && (
                  <div className="d-flex-h-between">
                    <SharedAutocompleteControl
                      stateKey="title"
                      title="language"
                      editValue={item[0]}
                      placeholder="select-language"
                      onValueChanged={(newValue) => {
                        let localItems = { ...state.title };
                        // eslint-disable-next-line prefer-destructuring
                        localItems = LanguageUpdateKey(
                          { [item[0]]: newValue.value },
                          localItems,
                        );
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
                      isDisabled={activeItem && !state.can_delete}
                    />
                    <ButtonBase
                      className="btns theme-transparent c-danger mx-3 mt-1 mb-2"
                      onClick={removeLanguageHandler('title', state.title, item[0])}
                      disabled={activeItem && !state.can_delete}
                    >
                      <span className="fas fa-times" />
                      <span className="px-1">{t('remove-language')}</span>
                    </ButtonBase>
                  </div>
                )}
                <SharedInputControl
                  errors={errors}
                  parentId="title"
                  stateKey={item[0]}
                  editValue={item[1]}
                  errorPath={`title.${[item[0]]}`}
                  parentTranslationPath={parentTranslationPath}
                  title={`${t(`${translationPath}name`)} (${getLanguageTitle(
                    languages,
                    item[0],
                  )})`}
                  isSubmitted={isSubmitted}
                  onValueChanged={onStateChanged}
                  isDisabled={activeItem && !state.can_delete}
                />
              </React.Fragment>
            ))}
          {permissionsCategories && permissionsCategories.length > 0 && (
            <PermissionsManagementComponent
              state={state}
              data={permissionsCategories}
              onStateChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
            />
          )}
        </div>
      }
      maxWidth="lg"
      isOpen={isOpen}
      isSaving={isLoading}
      onSubmit={saveHandler}
      onCloseClicked={isOpenChanged}
      onCancelClicked={isOpenChanged}
      translationPath={translationPath}
      isEdit={(activeItem && true) || undefined}
      parentTranslationPath={parentTranslationPath}
      wrapperClasses="setups-management-dialog-wrapper"
      titleText={(activeItem && 'edit-permission') || 'add-new-permission'}
    />
  );
};

PermissionsManagementDialogV2.propTypes = {
  activeItem: PropTypes.shape({
    uuid: PropTypes.string,
  }),
  onSave: PropTypes.func,
  isOpenChanged: PropTypes.func,
  translationPath: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
};

PermissionsManagementDialogV2.defaultProps = {
  onSave: undefined,
  activeItem: undefined,
  isOpenChanged: undefined,
  translationPath: 'PermissionsManagementDialog.',
};
