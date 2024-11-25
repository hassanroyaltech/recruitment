import React, {
  memo,
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
import i18next from 'i18next';
import { useSelector } from 'react-redux';
import {
  getErrorByName,
  LanguageUpdateKey,
  showError,
  showSuccess,
} from '../../../../../helpers';
import {
  getLanguageTitle,
  getNotSelectedLanguage,
  SetupsReducer,
  SetupsReset,
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../index';
import { DialogComponent, SwitchComponent } from '../../../../../components';
import { numericAndAlphabeticalAndSpecialExpression } from '../../../../../utils';
import { DynamicService } from 'services';

export const LookupsManagementDialog = memo(
  ({
    activeItem,
    lookup,
    isOpen,
    onSave,
    isOpenChanged,
    parentTranslationPath,
    translationPath,
    updateSuccessMessage,
    updateFailedMessage,
    createSuccessMessage,
    createFailedMessage,
    withDescription,
    isDynamicService,
    isForVisa,
  }) => {
    const { t } = useTranslation(parentTranslationPath);
    const [isLoading, setIsLoading] = useState(false);
    const [languages, setLanguages] = useState([]);
    const userReducer = useSelector((state) => state?.userReducer);
    const accountReducer = useSelector(
      (reducerState) => reducerState?.accountReducer,
    );
    const [isSubmitted, setIsSubmitted] = useState(false);
    const stateInitRef = useRef({
      code: '',
      account_uuid: null,
      status: true,
      [lookup.mainKey || 'name']: {},
      ...(lookup.extraParams && (lookup.extraParams || {})),
      description: null,
    });
    const [errors, setErrors] = useState(() => ({}));
    const [extraErrors, setExtraErrors] = useState(() => ({ atTheEnd: {} }));
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
    const onStateChanged = useCallback((newValue) => {
      setState(newValue);
    }, []);

    /**
     * @param newValue
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description this method is sent new value for the end component errors from child
     */
    const onExtraErrorsChanged = useCallback((newValue) => {
      setExtraErrors((items) => ({ ...items, ...newValue }));
    }, []);

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
            [lookup.parentKey || 'parentKey']: yup
              .string()
              .nullable()
              .test(
                'isRequired',
                t('this-field-is-required'),
                (value) => value || !lookup.parentKey,
              ),
            [lookup.extraInputState || 'extraInputKey']: yup
              .string()
              .nullable()
              .test(
                'isRequired',
                t('this-field-is-required'),
                (value) => value || !lookup.extraInputState,
              ),
            [lookup.mainKey || 'name']: yup.lazy((obj) =>
              yup
                .object()
                .shape(
                  Object.keys(obj).reduce(
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
    }, [
      activeItem,
      lookup.extraInputState,
      lookup.mainKey,
      lookup.parentKey,
      state,
      t,
    ]);

    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description this method is to check if the string is html or not
     */
    const getEditInit = useCallback(async () => {
      setIsLoading(true);
      const payload = {
        uuid: activeItem && activeItem.uuid,
        account_uuid: accountReducer.account_uuid || '',
        ...(activeItem
          && activeItem.uuid
          && !isDynamicService
          && (lookup.getExtraParams || lookup.extraParams)),
        ...(isDynamicService && { dynamic_code: lookup.dynamic_code }),
      };
      const response = await (isDynamicService ? DynamicService : lookup.viewAPI)(
        isDynamicService
          ? {
            params: payload,
            method: 'get',
            path: `${lookup.path}/view`,
          }
          : payload,
      );
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
      (key, item, code, desc) => () => {
        const localItem = { ...item };
        delete localItem[code];

        const localDesc = { ...desc };
        if (localDesc?.[code]) delete localDesc?.[code];

        setState({ id: key, value: localItem });
        setState({ id: 'description', value: localDesc });
      },
      [],
    );

    const getExtraComponents = useMemo(
      // eslint-disable-next-line react/display-name
      () => (extraComponent, errorsKey) => {
        const ToDisplayExtraComponent = extraComponent;
        return (
          <ToDisplayExtraComponent
            activeItem={activeItem}
            isParentLoading={isLoading}
            isParentSubmitted={isSubmitted}
            parentState={state}
            onParentStateChanged={onStateChanged}
            extraErrors={extraErrors}
            onExtraErrorsChanged={onExtraErrorsChanged}
            errorsKey={errorsKey}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        );
      },
      [
        activeItem,
        extraErrors,
        isLoading,
        isSubmitted,
        onExtraErrorsChanged,
        onStateChanged,
        parentTranslationPath,
        state,
        translationPath,
      ],
    );

    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description this method is to handle saving
     */
    const saveHandler = async (event) => {
      event.preventDefault();
      setIsSubmitted(true);
      if (
        Object.keys(errors).length > 0
        || Object.values(extraErrors).some((item) => Object.keys(item || {}).length > 0)
      ) {
        if (errors[lookup.mainKey || 'name'])
          showError(errors[lookup.mainKey || 'name'].message);
        return;
      }
      setIsLoading(true);
      let response;
      const body = {
        ...state,
        ...(lookup.extraParams && lookup.extraParams),
        ...(lookup.createExtraParams && !activeItem && lookup.createExtraParams),
        ...(lookup.updateExtraParams
          && !isDynamicService
          && activeItem
          && lookup.updateExtraParams),
        ...(state?.description?.en || state?.description?.ar
          ? {
            description: {
              ...(state?.description?.en && { en: state?.description?.en }),
              ...(state?.description?.ar && { ar: state?.description?.ar }),
            },
          }
          : { description: null }),
        ...(isDynamicService && { dynamic_code: lookup.dynamic_code }),
      };
      if (activeItem)
        response = await (isDynamicService ? DynamicService : lookup.updateAPI)(
          isDynamicService
            ? {
              body,
              path: lookup.path,
              method: 'put',
            }
            : body,
        );
      else
        response = await (isDynamicService ? DynamicService : lookup.createAPI)(
          isDynamicService
            ? {
              body,
              path: lookup.path,
              method: 'post',
            }
            : body,
        );
      setIsLoading(false);
      if (response && (response.status === 200 || response.status === 201)) {
        showSuccess(
          t(
            `${translationPath}${
              (activeItem && updateSuccessMessage) || createSuccessMessage
            }`,
          ),
        );
        if (onSave) onSave();
        if (isOpenChanged) isOpenChanged();
      } else
        showError(
          t(
            `${translationPath}${
              (activeItem && updateFailedMessage) || createFailedMessage
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
            id: lookup.mainKey || 'name',
            value: {
              [localEnLanguage.code]: null,
            },
          });
      }
    }, [activeItem, languages, lookup.mainKey]);

    // this is to add account_uuid to all states
    useEffect(() => {
      if (accountReducer && accountReducer.account_uuid)
        setState({ id: 'account_uuid', value: accountReducer.account_uuid });
    }, [accountReducer]);

    return (
      <DialogComponent
        maxWidth="md"
        titleText={
          (activeItem && `edit-${lookup.valueSingle}`) || `add-${lookup.valueSingle}`
        }
        contentClasses="px-0"
        dialogContent={
          <div className="lookups-management-content-dialog-wrapper">
            <div className="d-flex px-2">
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
            {lookup.parentAPI && lookup.parentKey && (
              <div className="d-flex px-3">
                <SharedAPIAutocompleteControl
                  editValue={state[lookup.parentKey]}
                  placeholder={`select-${lookup.parentTitle}`}
                  title={lookup.parentTitle}
                  stateKey={lookup.parentKey}
                  getDataAPI={lookup.parentAPI}
                  errorPath={lookup.parentKey}
                  getOptionLabel={(option) =>
                    option[lookup.titleKey][i18next.language]
                    || option[lookup.titleKey].en
                  }
                  errors={errors}
                  isFullWidth
                  searchKey="search"
                  getItemByIdAPI={lookup.parentByIdAPI}
                  isSubmitted={isSubmitted}
                  onValueChanged={onStateChanged}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  extraProps={{
                    ...(state[lookup.parentKey] && {
                      with_than: [state[lookup.parentKey]],
                    }),
                  }}
                />
              </div>
            )}

            <div className="d-flex-v-center-h-end">
              <ButtonBase
                className="btns theme-transparent mx-3 mb-2"
                onClick={addLanguageHandler(
                  lookup.mainKey || 'name',
                  state[lookup.mainKey || 'name'],
                )}
                disabled={
                  isLoading
                  || languages.length === 0
                  || (state[lookup.mainKey || 'name']
                    && languages.length
                      === Object.keys(state[lookup.mainKey || 'name']).length)
                }
              >
                <span className="fas fa-plus" />
                <span className="px-1">{t('add-language')}</span>
              </ButtonBase>
            </div>
            {state[lookup.mainKey || 'name']
              && Object.entries(state[lookup.mainKey || 'name']).map((item, index) => (
                <React.Fragment key={`namesKey${item[0]}`}>
                  {index > 0 && (
                    <div className="d-flex-h-between">
                      <SharedAutocompleteControl
                        editValue={item[0]}
                        placeholder="select-language"
                        title="language"
                        stateKey="name"
                        onValueChanged={(newValue) => {
                          let localItems = { ...state[lookup.mainKey || 'name'] };
                          // eslint-disable-next-line prefer-destructuring
                          localItems = LanguageUpdateKey(
                            { [item[0]]: newValue.value },
                            localItems,
                          );
                          onStateChanged({
                            id: lookup.mainKey || 'name',
                            value: localItems,
                          });
                        }}
                        initValues={getNotSelectedLanguage(
                          languages,
                          state[lookup.mainKey || 'name'],
                          index,
                        )}
                        initValuesKey="code"
                        initValuesTitle="title"
                        parentTranslationPath={parentTranslationPath}
                      />
                      <ButtonBase
                        className="btns theme-transparent c-danger mx-3 mt-1 mb-2"
                        onClick={removeLanguageHandler(
                          lookup.mainKey || 'name',
                          state[lookup.mainKey || 'name'],
                          item[0],
                          state.description,
                        )}
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
                    parentId={lookup.mainKey || 'name'}
                    errors={errors}
                    errorPath={`${lookup.mainKey || 'name'}.${[item[0]]}`}
                    title={`${
                      isForVisa
                        ? t(
                          `${translationPath}name-in-${getLanguageTitle(
                            languages,
                            item[0],
                          ).toLowerCase()}`,
                        )
                        : `${t(`${translationPath}name`)} (${getLanguageTitle(
                          languages,
                          item[0],
                        )})`
                    }`}
                    isSubmitted={isSubmitted}
                    onValueChanged={onStateChanged}
                  />
                  {(withDescription || lookup.isWithDescription) && (
                    <SharedInputControl
                      editValue={state.description?.[item[0]]}
                      parentTranslationPath={parentTranslationPath}
                      stateKey={item[0]}
                      parentId="description"
                      errors={errors}
                      errorPath={`description.${[item[0]]}`}
                      title={`${t(
                        `${translationPath}description`,
                      )} (${getLanguageTitle(languages, item[0])})`}
                      isSubmitted={isSubmitted}
                      onValueChanged={onStateChanged}
                      multiline
                      rows={3}
                    />
                  )}
                </React.Fragment>
              ))}

            {lookup.extraInputState && (
              <div className="d-flex">
                <SharedInputControl
                  parentTranslationPath={parentTranslationPath}
                  title={lookup.extraInputTitle}
                  placeholder={lookup.extraInputPlaceholder}
                  editValue={state[lookup.extraInputState]}
                  pattern={lookup.extraInputPattern}
                  isDisabled={isLoading}
                  isSubmitted={isSubmitted}
                  errors={errors}
                  errorPath={lookup.extraInputState}
                  stateKey={lookup.extraInputState}
                  min={lookup.extraInputMin}
                  type={lookup.extraInputType}
                  onValueChanged={onStateChanged}
                />
              </div>
            )}
            {lookup.atTheEndComponent
              && getExtraComponents(lookup.atTheEndComponent, 'atTheEnd')}
          </div>
        }
        wrapperClasses="lookups-management-dialog-wrapper"
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
  },
);

LookupsManagementDialog.displayName = 'LookupsManagementDialog';

LookupsManagementDialog.propTypes = {
  activeItem: PropTypes.shape({
    uuid: PropTypes.string,
  }),
  lookup: PropTypes.shape({
    key: PropTypes.number,
    label: PropTypes.string,
    valueSingle: PropTypes.string,
    parentKey: PropTypes.string,
    parentTitle: PropTypes.string,
    extraInputState: PropTypes.string,
    extraInputMin: PropTypes.number,
    extraInputTitle: PropTypes.string,
    extraInputPattern: PropTypes.string,
    extraInputPlaceholder: PropTypes.string,
    mainKey: PropTypes.string,
    extraInputType: PropTypes.string,
    titleKey: PropTypes.string,
    parentAPI: PropTypes.func,
    updateAPI: PropTypes.func,
    createAPI: PropTypes.func,
    viewAPI: PropTypes.func,
    listAPI: PropTypes.func,
    deleteAPI: PropTypes.func,
    parentByIdAPI: PropTypes.func,
    atTheEndComponent: PropTypes.oneOfType([
      PropTypes.elementType,
      PropTypes.func,
      PropTypes.node,
    ]),
    extraParams: PropTypes.instanceOf(Object), // for shared between all
    getAllExtraParams: PropTypes.instanceOf(Object), // for get all only
    createExtraParams: PropTypes.instanceOf(Object), // for create only
    updateExtraParams: PropTypes.instanceOf(Object), // for update only
    getExtraParams: PropTypes.instanceOf(Object), // for view only
    deleteExtraParams: PropTypes.instanceOf(Object), // for delete only
    isWithDescription: PropTypes.bool,
    path: PropTypes.string,
    dynamic_code: PropTypes.string,
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  updateSuccessMessage: PropTypes.string,
  createSuccessMessage: PropTypes.string,
  updateFailedMessage: PropTypes.string,
  createFailedMessage: PropTypes.string,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
  onSave: PropTypes.func,
  withDescription: PropTypes.bool,
  isDynamicService: PropTypes.bool,
  isForVisa: PropTypes.bool,
};
LookupsManagementDialog.defaultProps = {
  isOpenChanged: undefined,
  onSave: undefined,
  activeItem: undefined,
  updateSuccessMessage: 'personal-classification-updated-successfully',
  createSuccessMessage: 'personal-classification-created-successfully',
  updateFailedMessage: 'personal-classification-update-failed',
  createFailedMessage: 'personal-classification-create-failed',
  translationPath: 'LookupsManagementDialog.',
  withDescription: undefined,
  isDynamicService: undefined,
  isForVisa: undefined,
};
