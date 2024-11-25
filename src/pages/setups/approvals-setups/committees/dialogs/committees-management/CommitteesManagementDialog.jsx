import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import ButtonBase from '@mui/material/ButtonBase';
import { useSelector } from 'react-redux';
import i18next from 'i18next';
import { IconButton } from '@mui/material';
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
  UpdateSetupsCommittees,
  GetSetupsCommitteesById,
  CreateSetupsCommittees,
  GetAllSetupsEmployees,
} from '../../../../../../services';
import { DynamicFormTypesEnum } from '../../../../../../enums';
import { numericAndAlphabeticalAndSpecialExpression } from '../../../../../../utils';
import { CommitteesTabs } from '../../../../shared/tabs-data';

export const CommitteesManagementDialog = ({
  activeItem,
  committeeType,
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
    users: [],
    code: '',
    status: true,
    type: committeeType.key,
    name: {},
    external_users: [
      {
        first_name: { en: '' },
        last_name: { en: '' },
        email: '',
      },
    ],
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
    const response = await GetSetupsCommitteesById({
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
   * @param parentId - the value of the parentId to update
   * @param parentIndex - the value of the index to update
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
   * @Description this method is to add new inner language key
   */
  const addInnerLanguageHandler = (key, item, parentId, parentIndex) => () => {
    const localItem = { ...item };
    localItem[getNotSelectedLanguage(languages, localItem, -1)[0].code] = null;
    setState({
      id: key,
      value: localItem,
      parentId,
      parentIndex,
    });
  };

  /**
   * @param key - the state key to update
   * @param item - the value of the key to update
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
   * @Description this method is to add new External user
   */
  const addExternalUserHandler = (key, item) => () => {
    const localItem = [...item];
    localItem.push({
      first_name: { en: '' },
      last_name: { en: '' },
      email: '',
    });
    setState({ id: key, value: localItem });
  };

  /**
   * @param key - the state key to update
   * @param item - the value of the key to update
   * @param parentId - the value of the parentId to update
   * @param parentIndex - the value of the index to update
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
   * @Description this method is to remove inner language key
   */
  const removeInnerLanguageHandler = useCallback(
    (index, lang) => {
      const localItem = { ...state };
      delete localItem.external_users[index].first_name[lang];
      delete localItem.external_users[index].last_name[lang];
      onStateChanged({
        id: 'edit',
        value: localItem,
      });
    },
    [state],
  );

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
      if (errors.name) showError(errors.name.message); // why show error when we can validate field?
      return;
    }
    setIsLoading(true);
    let response;
    if (activeItem) response = await UpdateSetupsCommittees(state);
    else response = await CreateSetupsCommittees(state);
    setIsLoading(false);
    if (response && (response.status === 200 || response.status === 201)) {
      showSuccess(
        t(
          `${translationPath}${
            (activeItem && 'committee-updated-successfully')
            || 'committee-created-successfully'
          }`,
        ),
      );
      if (onSave) onSave();
      if (isOpenChanged) isOpenChanged();
    } else
      showError(
        t(
          `${translationPath}${
            (activeItem && 'committee-update-failed') || 'committee-create-failed'
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
        .when(
          'profile_type', // what is profile type?
          (value) =>
            (+value === 1
              && yup.string().nullable().required(t('this-field-is-required')))
            || yup.string().nullable(),
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
      users: yup
        .array()
        .nullable()
        .min(
          1,
          `${t('please-select-at-least')} ${1} ${t(`${translationPath}employee`)}`,
        ),
      ...(committeeType.key === CommitteesTabs[1].key && {
        external_users: yup
          .array()
          .nullable()
          .of(
            yup.object().shape({
              first_name: yup.lazy((obj) =>
                yup.object().shape(
                  Object.keys(obj).reduce(
                    (newMap, key) => ({
                      ...newMap,
                      [key]: yup
                        .string()
                        .nullable()
                        .required(t('this-field-is-required'))
                        .trim(t('trim-description')),
                    }),
                    {},
                  ),
                ),
              ),
              last_name: yup.lazy((obj) =>
                yup.object().shape(
                  Object.keys(obj).reduce(
                    (newMap, key) => ({
                      ...newMap,
                      [key]: yup
                        .string()
                        .nullable()
                        .required(t('this-field-is-required'))
                        .trim(t('trim-description')),
                    }),
                    {},
                  ),
                ),
              ),
              email: yup
                .string()
                .email(t('invalid-email'))
                .nullable()
                .required(t('this-field-is-required')),
            }),
          ),
      }),
    });
  }, [
    state.profile_type,
    t,
    translationPath,
    committeeType.valueSingle,
    committeeType.key,
  ]);

  return (
    <DialogComponent
      maxWidth="md"
      titleText={
        (activeItem && `edit-${committeeType.valueSingle}`)
        || `add-${committeeType.valueSingle}`
      }
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
                  errorPath={errors.name ? 'name' : `name.${[item[0]]}`}
                  title={`${t(`${translationPath}name`)} (${getLanguageTitle(
                    languages,
                    item[0],
                  )})`}
                  isSubmitted={isSubmitted}
                  onValueChanged={onStateChanged}
                />
              </React.Fragment>
            ))}
          <div className="d-inline-flex c-black header-text pb-3 px-3">
            <span>{t(`${translationPath}employees`)}</span>
          </div>
          <div className="d-flex flex-wrap px-3">
            <SharedAPIAutocompleteControl
              idRef="usersAutocompleteRef"
              editValue={state.users}
              title="employees"
              placeholder="select-employees"
              stateKey="users"
              errorPath="users"
              isSubmitted={isSubmitted}
              errors={errors}
              getDataAPI={GetAllSetupsEmployees}
              searchKey="search"
              uniqueKey="user_uuid"
              getOptionLabel={(option) =>
                `${
                  (option.first_name
                    && (option.first_name[i18next.language] || option.first_name.en))
                  || ''
                }${
                  (option.last_name
                    && ` ${
                      option.last_name[i18next.language] || option.last_name.en
                    }`)
                  || ''
                }` || 'N/A'
              }
              type={DynamicFormTypesEnum.array.key}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onValueChanged={onStateChanged}
              isFullWidth
              extraProps={{
                type: committeeType.key,
                ...(state.users?.length && { with_than: state.users }),
              }}
            />
          </div>
          {committeeType.key === CommitteesTabs[1].key && (
            <>
              <div className="d-inline-flex c-black header-text pb-3 px-3">
                <span>{t(`${translationPath}external-users`)}</span>
              </div>
              <div className="d-flex-v-center-h-end">
                <ButtonBase
                  className="btns theme-transparent mx-3 mb-2"
                  onClick={() => {
                    addExternalUserHandler('external_users', state.external_users)();
                  }}
                >
                  <span className="fas fa-plus" />
                  <span className="px-1">
                    {t(`${translationPath}add-external-user`)}
                  </span>
                </ButtonBase>
              </div>
              {state.external_users
                && state.external_users.map((item, index) => (
                  <React.Fragment key={`${index + 1}-external-user`}>
                    <div className="px-3">
                      <div className="px-2 d-flex align-items-start">
                        <SharedInputControl
                          isFullWidth
                          title="email"
                          errors={errors}
                          stateKey="email"
                          errorPath={`external_users[${index}].email`}
                          parentIndex={index}
                          editValue={item.email}
                          parentId="external_users"
                          isSubmitted={isSubmitted}
                          onValueChanged={onStateChanged}
                          translationPath={translationPath}
                          parentTranslationPath={parentTranslationPath}
                        />
                        <IconButton
                          onClick={() => {
                            state.external_users.splice(index, 1);
                            setState({
                              id: 'external_users',
                              value: state.external_users,
                            });
                          }}
                        >
                          <span className="fas fa-trash-alt c-danger fa-xs" />
                        </IconButton>
                      </div>
                      <div className="d-flex-v-center-h-end">
                        <ButtonBase
                          className="btns theme-transparent mx-3 mb-2"
                          onClick={() => {
                            addInnerLanguageHandler(
                              'first_name',
                              item.first_name,
                              'external_users',
                              index,
                            )();
                            addInnerLanguageHandler(
                              'last_name',
                              item.last_name,
                              'external_users',
                              index,
                            )();
                          }}
                          disabled={
                            isLoading
                            || languages.length === 0
                            || (item.first_name
                              && languages.length
                                === Object.keys(item.first_name).length)
                          }
                        >
                          <span className="fas fa-plus" />
                          <span className="px-1">{t('add-language')}</span>
                        </ButtonBase>
                      </div>
                      {item.first_name
                        && Object.entries(item.first_name).map((el, i) => (
                          <React.Fragment key={`namesKey${el[0]}`}>
                            {i > 0 && (
                              <div className="d-flex-h-between">
                                <SharedAutocompleteControl
                                  editValue={el[0]}
                                  placeholder="select-language"
                                  title="language"
                                  stateKey="user_name"
                                  onValueChanged={(newValue) => {
                                    let localState = { ...state };
                                    // eslint-disable-next-line prefer-destructuring
                                    ['first_name', 'last_name'].forEach(
                                      (nameKey) => {
                                        localState.external_users[index][nameKey]
                                          = LanguageUpdateKey(
                                            { [el[0]]: newValue.value },
                                            localState.external_users[index][
                                              nameKey
                                            ],
                                          );
                                      },
                                    );
                                    onStateChanged({
                                      id: 'edit',
                                      value: localState,
                                    });
                                  }}
                                  initValues={getNotSelectedLanguage(
                                    languages,
                                    item.first_name,
                                    i,
                                  )}
                                  initValuesKey="code"
                                  initValuesTitle="title"
                                  parentTranslationPath={parentTranslationPath}
                                />
                                <ButtonBase
                                  className="btns theme-transparent c-danger mx-3 mt-1 mb-2"
                                  onClick={() => {
                                    removeInnerLanguageHandler(index, el[0]);
                                  }}
                                >
                                  <span className="fas fa-times" />
                                  <span className="px-1">
                                    {t('remove-language')}
                                  </span>
                                </ButtonBase>
                              </div>
                            )}
                            <SharedInputControl
                              title={`${t(
                                `${translationPath}first-name`,
                              )} (${getLanguageTitle(languages, el[0])})`}
                              isHalfWidth
                              stateKey={el[0]}
                              editValue={el[1]}
                              parentIndex={index}
                              subParentId="first_name"
                              parentId="external_users"
                              isSubmitted={isSubmitted}
                              onValueChanged={onStateChanged}
                              parentTranslationPath={parentTranslationPath}
                              errorPath={`external_users[${index}].first_name.${el[0]}`}
                              errors={errors}
                            />
                            <SharedInputControl
                              title={`${t(
                                `${translationPath}last-name`,
                              )} (${getLanguageTitle(languages, el[0])})`}
                              isHalfWidth
                              stateKey={el[0]}
                              parentIndex={index}
                              subParentId="last_name"
                              parentId="external_users"
                              isSubmitted={isSubmitted}
                              onValueChanged={onStateChanged}
                              editValue={item.last_name[el[0]]}
                              parentTranslationPath={parentTranslationPath}
                              errorPath={`external_users[${index}].last_name.${el[0]}`}
                              errors={errors}
                            />
                          </React.Fragment>
                        ))}
                    </div>
                    {state.external_users.length > 1 && <hr />}
                  </React.Fragment>
                ))}
            </>
          )}
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

CommitteesManagementDialog.propTypes = {
  activeItem: PropTypes.shape({
    uuid: PropTypes.string,
  }),
  committeeType: PropTypes.oneOf(Object.values(CommitteesTabs).map((item) => item))
    .isRequired,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
  onSave: PropTypes.func,
};
CommitteesManagementDialog.defaultProps = {
  isOpenChanged: undefined,
  onSave: undefined,
  activeItem: undefined,
  translationPath: 'CommitteesManagementDialog.',
};
