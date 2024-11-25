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
import { DialogComponent, SwitchComponent } from '../../../../../../components';
import {
  CreateSetupsTeams,
  GetAllSetupsUsers,
  GetSetupsTeamById,
  getSetupsUsersById,
  UpdateSetupsTeams,
} from '../../../../../../services';
import { numericAndAlphabeticalAndSpecialExpression } from '../../../../../../utils';
import { DynamicFormTypesEnum } from '../../../../../../enums';

export const TeamsManagementDialog = ({
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
  const userReducer = useSelector((state) => state?.userReducer);
  const schema = useRef(null);
  const stateInitRef = useRef({
    code: '',
    status: true,
    title: {},
    user_uuid: [],
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
    const response = await GetSetupsTeamById({
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
    if (activeItem) response = await UpdateSetupsTeams(state);
    else response = await CreateSetupsTeams(state);
    setIsLoading(false);
    if (response && (response.status === 200 || response.status === 201)) {
      showSuccess(
        t(
          `${translationPath}${
            (activeItem && 'team-updated-successfully')
            || 'team-created-successfully'
          }`,
        ),
      );
      if (onSave) onSave();
      if (isOpenChanged) isOpenChanged();
    } else
      showError(
        t(
          `${translationPath}${
            (activeItem && 'team-update-failed') || 'team-create-failed'
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
            `${t('please-add-at-least')} ${1} ${t('title')}`,
            (value) => value && Object.keys(value).length > 0,
          ),
      ),
      user_uuid: yup
        .array()
        .nullable()
        .min(
          1,
          `${t('please-select-at-least')} ${1} ${t(`${translationPath}user`)}`,
        ),
    });
  }, [activeItem, t, translationPath]);

  return (
    <DialogComponent
      maxWidth="md"
      titleText={(activeItem && 'edit-team') || 'add-team'}
      contentClasses="px-0"
      dialogContent={
        <div className="teams-management-content-dialog-wrapper">
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
              <React.Fragment key={`titlesKey${item[0]}`}>
                {index > 0 && (
                  <div className="d-flex-h-between">
                    <SharedAutocompleteControl
                      editValue={item[0]}
                      placeholder="select-language"
                      title="language"
                      stateKey="title"
                      onValueChanged={(newValue) => {
                        let localItems = { ...state.title };
                        // eslint-disable-next-line prefer-destructuring
                        localItems = LanguageUpdateKey(
                          { [item[0]]: newValue.value },
                          localItems,
                        );
                        onStateChanged({ id: 'title', value: localItems });
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
                  title={`${t(`${translationPath}title`)} (${getLanguageTitle(
                    languages,
                    item[0],
                  )})`}
                  isSubmitted={isSubmitted}
                  onValueChanged={onStateChanged}
                />
              </React.Fragment>
            ))}
          <div className="d-flex px-3">
            <SharedAPIAutocompleteControl
              isFullWidth
              title="users"
              errors={errors}
              labelValue="users"
              isSubmitted={isSubmitted}
              stateKey="user_uuid"
              errorPath="user_uuid"
              placeholder="select-users"
              idRef="usersAutocompleteRef"
              onValueChanged={onStateChanged}
              editValue={state.user_uuid}
              translationPath={translationPath}
              searchKey="search"
              getDataAPI={GetAllSetupsUsers}
              getItemByIdAPI={getSetupsUsersById}
              type={DynamicFormTypesEnum.array.key}
              parentTranslationPath={parentTranslationPath}
              getOptionLabel={(option) =>
                `${
                  option.first_name
                  && (option.first_name[i18next.language] || option.first_name.en)
                }${
                  option.last_name
                  && ` ${option.last_name[i18next.language] || option.last_name.en}`
                }`
              }
              extraProps={{
                ...(state.user_uuid?.length && { with_than: state.user_uuid }),
              }}
            />
          </div>
        </div>
      }
      wrapperClasses="teams-management-dialog-wrapper"
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

TeamsManagementDialog.propTypes = {
  activeItem: PropTypes.shape({
    uuid: PropTypes.string,
  }),
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
  onSave: PropTypes.func,
};
TeamsManagementDialog.defaultProps = {
  isOpenChanged: undefined,
  onSave: undefined,
  activeItem: undefined,
  translationPath: 'TeamsManagementDialog.',
};
