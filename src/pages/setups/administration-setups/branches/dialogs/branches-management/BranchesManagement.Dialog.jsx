import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import ButtonBase from '@mui/material/ButtonBase';
import { useDispatch, useSelector } from 'react-redux';
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
  SharedColorPickerControl,
  SharedInputControl,
  SharedPhoneControl,
  SharedUploaderControl,
} from '../../../../shared';
import {
  CheckboxesComponent,
  DialogComponent,
  SwitchComponent,
} from '../../../../../../components';
import {
  CreateSetupsBranches,
  GetAllCompanyLanguages,
  GetAllSetupsBranches,
  GetAllSetupsCurrencies,
  GetAllSetupsOrganizationGroup, GetAllSetupsUserBranches,
  GetSetupsBranchesById,
  GetSetupsCurrenciesById,
  getSetupsOrganizationGroupById,
  UpdateSetupsBranches
} from '../../../../../../services';
import {
  numericAndAlphabeticalAndSpecialExpression,
  onlyEnglishSmall,
  phoneExpression,
} from '../../../../../../utils';
import { DynamicFormTypesEnum } from '../../../../../../enums';
import { companyIdTypes } from '../../../../../../stores/types/companyIdTypes';
import { updateSelectedBranch } from '../../../../../../stores/actions/selectedBranchActions';
import { updateBranches } from '../../../../../../stores/actions/branchesActions';

export const BranchesManagementDialog = ({
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
  const [branchesExtraProps, setBranchesExtraProps] = useState(null);
  const userReducer = useSelector((state) => state?.userReducer);
  const branchesReducer = useSelector((state) => state?.branchesReducer);
  const accountReducer = useSelector((reducerState) => reducerState?.accountReducer);
  const translateLanguagesRef = useRef([]);
  const selectedBranchReducer = useSelector(
    (reducerState) => reducerState?.selectedBranchReducer,
  );
  const stateInitRef = useRef({
    code: '',
    status: true,
    name: {},
    business_type_uuid: null,
    branch_type_uuid: null,
    phone: null,
    location: null,
    currency_uuid: null,
    parent_uuid: null,
    logo_uuid: null,
    logo_url: null,
    sub_domain: null,
    mainColor: null,
    is_shareable: false,
    branch_shareable: [],
    translate_languages: [],
    clone_lookup: false,
    can_update_domain: true,
  });
  const [errors, setErrors] = useState(() => ({}));
  const isCodeDisabled = useRef(Boolean(activeItem));

  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );
  const dispatch = useDispatch();

  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is send new value for state from child
   */
  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  /**
   * @param key
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change the status of lookups
   */
  const onSwitchChangedHandler = (key) => (event, newValue) => {
    setState({ id: key, value: newValue });
  };

  /**
   * @param key
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
   * @Description this method is to change the value of clone_lookup
   */
  const onCheckBoxChangedHandler = (key) => (event) => {
    event.preventDefault();
    event.stopPropagation();
    setState({ id: key, value: !state[key] });
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
          name: yup.lazy((obj) =>
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
          // business_type_uuid: yup
          //   .string()
          //   .nullable()
          //   .required(t('this-field-is-required')),
          // branch_type_uuid: yup
          //   .string()
          //   .nullable()
          //   .required(t('this-field-is-required')),
          organization_group_uuid: yup
            .string()
            .nullable()
            .required(t('this-field-is-required')),
          currency_uuid: yup
            .string()
            .nullable()
            .required(t('this-field-is-required')),
          logo_uuid: yup.string().nullable().required(t('this-field-is-required')),
          // logo: yup
          //   .string()
          //   .nullable()
          //   .required(t('this-field-is-required')),
          is_shareable: yup.boolean().nullable(),
          sub_domain: yup
            .string()
            .nullable()
            .required(t('this-field-is-required'))
            .when('can_update_domain', {
              is: true,
              then: yup
                .string()
                .nullable()
                .matches(onlyEnglishSmall, {
                  message: t('Shared:subdomain-description'),
                  excludeEmptyString: true,
                }),
            }),
          branch_shareable: yup
            .array()
            .nullable()
            .when(
              'is_shareable',
              (value, field) =>
                (value && field.required(t('this-field-is-required'))) || field,
            ),
          location: yup.string().nullable().required(t('this-field-is-required')),
          translate_languages: yup
            .array()
            .of(
              yup.object().shape({
                code: yup.string().nullable().required(t('this-field-is-required')),
                visible: yup
                  .boolean()
                  .nullable()
                  .required(t('this-field-is-required')),
              }),
            )
            .test({
              name: 'one-true',
              message: `${t('please-select-at-least')} ${1} ${t('language')}`,
              test: (val) => val && val.some((item) => item.visible),
            }),
          phone: yup
            .string()
            .nullable()
            .required(t('this-field-is-required'))
            .matches(phoneExpression, {
              message: t('invalid-phone-number'),
              excludeEmptyString: true,
            }),
        }),
      },
      state,
    ).then((result) => {
      setErrors(result);
    });
  }, [activeItem, state, t]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to check if the string is html or not
   */
  const getEditInit = useCallback(async () => {
    setIsLoading(true);
    const response = await GetSetupsBranchesById({
      uuid: activeItem && activeItem.uuid,
    });
    setIsLoading(false);
    if (response && response.status === 200) {
      translateLanguagesRef.current = translateLanguagesRef.current.map((item) => ({
        ...item,
        visible:
          response.data.results.translate_languages?.some(
            (element) => element.code === item.code && element.visible,
          ) || false,
      }));
      setState({
        id: 'edit',
        value: {
          ...response.data.results,
          translate_languages: translateLanguagesRef.current,
        },
      });
    } else {
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

  const getAllSetupsUserBranches = useCallback(async () => {
    const response = await GetAllSetupsUserBranches();
    if (response && response.status === 200) {
      const {
        data: { results },
      } = response;

      if(activeItem){
        const selectedBranch = results.companies.find((item)=>item.uuid === activeItem.uuid);
        if (selectedBranch)
          dispatch(updateSelectedBranch(selectedBranch || null));
      }

      dispatch(
        updateBranches({
          results: results.companies,
          totalCount: results.companies.length,
          excluded_countries: results?.excluded_countries,
        }),
      );
    } else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [dispatch, t]);
  
  
  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle saving
   */
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) {
      if (errors.name) showError(errors.name.message);
      return;
    }
    setIsLoading(true);
    const localState = {
      ...state,
      translate_languages: [...state.translate_languages],
    };
    localState.translate_languages.map((item) => {
      delete item.value;
      return item;
    });
    let response;
    // console.log(localState)
    if (activeItem) response = await UpdateSetupsBranches(localState);
    else response = await CreateSetupsBranches(localState);

    if (response && (response.status === 200 || response.status === 201)) {
      await getAllSetupsUserBranches();

      showSuccess(
        t(
          `${translationPath}${
            (activeItem && 'branch-setups-updated-successfully')
            || 'branch-setups-created-successfully'
          }`,
        ),
      );
      if (onSave) onSave();
      if (isOpenChanged) isOpenChanged();
    } else
      showError(
        t(
          `${translationPath}${
            (activeItem && 'branch-setups-update-failed')
            || 'branch-setups-create-failed'
          }`,
        ),
        response,
      );
    setIsLoading(false);
  };

  /**
   * @param newValue - the current file
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle updating the uploading the logo
   */
  const onUploadChanged = (newValue) => {
    setState({
      id: 'logo_uuid',
      value:
        (newValue.value && newValue.value.length > 0 && newValue.value[0].uuid)
        || null,
    });
    setState({
      id: 'logo_url',
      value:
        (newValue.value && newValue.value.length > 0 && newValue.value[0].url)
        || null,
    });
  };

  const getAllCompanyLanguages = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllCompanyLanguages();
    setIsLoading(false);
    if (response && response.status === 200) {
      translateLanguagesRef.current = Object.keys(response.data.results).map(
        (item) => ({
          code: item,
          value: t(`Shared:LanguageChangeComponent.${item}`),
          visible: false,
        }),
      );
      setState({
        id: 'translate_languages',
        value: translateLanguagesRef.current,
      });
    } else {
      showError(t('Shared:failed-to-get-saved-data'), response);
      if (isOpenChanged) isOpenChanged();
    }
  }, [isOpenChanged, t]);

  const getIsCheckedLanguageHandler = useCallback((item) => item.visible, []);

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  // this to get saved data on edit init
  useEffect(() => {
    if (activeItem && state.translate_languages.length > 0) getEditInit();
  }, [state.translate_languages.length, activeItem, getEditInit]);

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

  // this method to fill branches extra props on edit to exclude current branch
  useEffect(() => {
    if (activeItem) setBranchesExtraProps({ other_than: activeItem.uuid });
  }, [activeItem]);

  // this is to get all the available languages for the current company
  useEffect(() => {
    getAllCompanyLanguages();
  }, [getAllCompanyLanguages]);

  return (
    <DialogComponent
      maxWidth="md"
      titleText={(activeItem && 'edit-branch-setups') || 'add-new-branch-setups'}
      dialogContent={
        <div className="setups-management-content-dialog-wrapper">
          <div className="d-flex px-3">
            <SwitchComponent
              idRef="StatusSwitchRef"
              label="active"
              isChecked={state.status}
              isReversedLabel
              isFlexEnd
              onChange={onSwitchChangedHandler('status')}
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
              isRequired
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
                  isRequired
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

          {/* <SharedAutocompleteControl */}
          {/*  editValue={state.parent_uuid} */}
          {/*  placeholder="select-parent" */}
          {/*  title="parent" */}
          {/*  stateKey="parent_uuid" */}
          {/*  helper_name={DynamicFormHelpersEnum['business-types'].key} */}
          {/*  errorPath="parent_uuid" */}
          {/*  onValueChanged={onStateChanged} */}
          {/*  isSubmitted={isSubmitted} */}
          {/*  errors={errors} */}
          {/*  parentTranslationPath={parentTranslationPath} */}
          {/*  translationPath={translationPath} */}
          {/* /> */}
          {/* <SharedAutocompleteControl */}
          {/*  editValue={state.business_type_uuid} */}
          {/*  title="business-type" */}
          {/*  placeholder="select-business-type" */}
          {/*  stateKey="business_type_uuid" */}
          {/*  helper_name={DynamicFormHelpersEnum['business-types'].key} */}
          {/*  errorPath="business_type_uuid" */}
          {/*  onValueChanged={onStateChanged} */}
          {/*  isSubmitted={isSubmitted} */}
          {/*  errors={errors} */}
          {/*  parentTranslationPath={parentTranslationPath} */}
          {/*  translationPath={translationPath} */}
          {/* /> */}
          {/* <SharedAutocompleteControl */}
          {/*  editValue={state.branch_type_uuid} */}
          {/*  placeholder="select-branch-type" */}
          {/*  title="branch-type" */}
          {/*  stateKey="branch_type_uuid" */}
          {/*  helper_name={DynamicFormHelpersEnum['business-types'].key} */}
          {/*  errorPath="branch_type_uuid" */}
          {/*  onValueChanged={onStateChanged} */}
          {/*  isSubmitted={isSubmitted} */}
          {/*  errors={errors} */}
          {/*  parentTranslationPath={parentTranslationPath} */}
          {/*  translationPath={translationPath} */}
          {/* /> */}
          <SharedPhoneControl
            editValue={state.phone}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            stateKey="phone"
            title="phone"
            errorPath="phone"
            errors={errors}
            isRequired
            isSubmitted={isSubmitted}
            onValueChanged={onStateChanged}
            excludeCountries={branchesReducer?.branches?.excluded_countries}
          />
          <SharedInputControl
            editValue={state.location}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            stateKey="location"
            title="location"
            errorPath="location"
            isRequired
            errors={errors}
            isSubmitted={isSubmitted}
            onValueChanged={onStateChanged}
          />
          <SharedInputControl
            errors={errors}
            title="sub-domain"
            stateKey="sub_domain"
            errorPath="sub_domain"
            isSubmitted={isSubmitted}
            editValue={state.sub_domain}
            onValueChanged={onStateChanged}
            isRequired
            endAdornment={
              <div className="end-adornment-wrapper">
                <span className="px-2">{process.env.REACT_APP_DOMAIN}</span>
              </div>
            }
            startAdornment={
              <div className="start-adornment-wrapper">
                <span className="px-2">https://</span>
              </div>
            }
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            isDisabled={!state?.can_update_domain}
          />
          <SharedAPIAutocompleteControl
            editValue={state.currency_uuid}
            placeholder="select-currency"
            title="currency"
            stateKey="currency_uuid"
            getDataAPI={GetAllSetupsCurrencies}
            errorPath="currency_uuid"
            isRequired
            getOptionLabel={(option) =>
              option.title[i18next.language] || option.title.en
            }
            extraProps={{
              ...accountReducer,
              with_than: (state.currency_uuid && [state.currency_uuid]) || null,
            }}
            errors={errors}
            searchKey="search"
            getItemByIdAPI={GetSetupsCurrenciesById}
            isSubmitted={isSubmitted}
            onValueChanged={onStateChanged}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
          <div className="px-3">
            <SharedAPIAutocompleteControl
              isFullWidth
              title="business-group"
              placeholder="select-business-group"
              errors={errors}
              isSubmitted={isSubmitted}
              stateKey="organization_group_uuid"
              errorPath="organization_group_uuid"
              searchKey="search"
              isRequired
              idRef="organizationsAutocompleteRef"
              onValueChanged={onStateChanged}
              editValue={state.organization_group_uuid}
              translationPath={translationPath}
              getDataAPI={GetAllSetupsOrganizationGroup}
              getItemByIdAPI={getSetupsOrganizationGroupById}
              parentTranslationPath={parentTranslationPath}
              getOptionLabel={(option) =>
                option.name[i18next.language] || option.name.en
              }
              extraProps={{
                with_than:
                  (state.organization_group_uuid && [
                    state.organization_group_uuid,
                  ])
                  || null,
              }}
            />
          </div>
          {!activeItem && (
            <div className="d-inline-flex px-3 mb-2">
              <CheckboxesComponent
                isDisabled={isLoading}
                idRef="cloneCheckboxIdRef"
                label="clone-lookup-description"
                translationPath={translationPath}
                singleChecked={state.clone_lookup || false}
                parentTranslationPath={parentTranslationPath}
                onSelectedCheckboxClicked={onCheckBoxChangedHandler('clone_lookup')}
              />
            </div>
          )}
          <div className="px-3">
            <CheckboxesComponent
              isDisabled={isLoading}
              idRef="languagesCheckboxesIdRef"
              data={state.translate_languages}
              error={
                errors['translate_languages'] && errors['translate_languages'].error
              }
              helperText={
                errors['translate_languages']
                && errors['translate_languages'].message
              }
              isSubmitted={isSubmitted}
              labelInput="value"
              isRow
              isRequired
              labelValue="branch-languages"
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              checked={getIsCheckedLanguageHandler}
              onSelectedCheckboxChanged={(item, index, isChecked) => {
                setState({
                  parentId: 'translate_languages',
                  parentIndex: index,
                  id: 'visible',
                  value: isChecked,
                });
              }}
            />
          </div>
          <div className="d-inline-flex px-3 mb-2">
            <SwitchComponent
              idRef="IsSharableSwitchRef"
              label="is-shareable-description"
              isChecked={state.is_shareable}
              onChange={onSwitchChangedHandler('is_shareable')}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          </div>
          {state && state.is_shareable && (
            <div className="px-3">
              <SharedAPIAutocompleteControl
                isFullWidth
                title="branches"
                errors={errors}
                isSubmitted={isSubmitted}
                stateKey="branch_shareable"
                errorPath="branch_shareable"
                searchKey="search"
                placeholder="select-branches"
                idRef="branchesAutocompleteRef"
                onValueChanged={onStateChanged}
                editValue={state.branch_shareable}
                translationPath={translationPath}
                getDataAPI={GetAllSetupsBranches}
                type={DynamicFormTypesEnum.array.key}
                getItemByIdAPI={GetSetupsBranchesById}
                extraProps={{
                  ...branchesExtraProps,
                  with_than:
                    (state.branch_shareable && state.branch_shareable) || null,
                }}
                parentTranslationPath={parentTranslationPath}
                getOptionLabel={(option) =>
                  option.name[i18next.language] || option.name.en
                }
              />
            </div>
          )}
          <div className="px-3">
            <SharedColorPickerControl
              editValue={state.mainColor}
              labelValue="brand-color"
              stateKey="mainColor"
              isSubmitted={isSubmitted}
              errors={errors}
              wrapperClasses="small-control px-0"
              errorPath="mainColor"
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          </div>
          <SharedUploaderControl
            for_account
            editValue={
              state.logo_uuid
              && state.logo_url && [
                { uuid: state.logo_uuid, url: state.logo_url, type: 'image' },
              ]
            }
            onValueChanged={onUploadChanged}
            stateKey="logo"
            labelValue="branch-logo"
            isRequired
            isSubmitted={isSubmitted}
            errors={errors}
            errorPath="logo_uuid"
            labelClasses="theme-primary"
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
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

BranchesManagementDialog.propTypes = {
  activeItem: PropTypes.shape({
    uuid: PropTypes.string,
  }),
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
  onSave: PropTypes.func,
};
BranchesManagementDialog.defaultProps = {
  isOpenChanged: undefined,
  onSave: undefined,
  activeItem: undefined,
  translationPath: 'BranchesManagementDialog.',
};
