import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import {
  getErrorByName,
  HtmlToText,
  isHTML,
  showError,
  showSuccess,
} from '../../../../helpers';
import { HeaderSectionTabs } from '../shared/tabs-data/HeaderSection.Tabs';
import {
  DialogComponent,
  SwitchComponent,
  TabsComponent,
} from '../../../../components';
import {
  GetEvaBrandSectionById,
  CreateEvaBrandSection,
  UpdateEvaBrandSection,
} from '../../../../services';
import { urlExpression } from '../../../../utils';
import {
  EvaBrandSectionsEnum,
  EvaBrandUploaderMediaTypesEnum,
  NavigationLinkTypesEnum,
} from '../../../../enums';

// dialog to management the section of type header
export const HeaderSectionDialog = ({
  language_uuid,
  language,
  sections,
  activeItem,
  isOpen,
  onSave,
  isOpenChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [headerSectionTabsData] = useState(() => HeaderSectionTabs);
  const [errors, setErrors] = useState(() => ({}));
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [isStateChangedInAdvancedMode, setIsStateChangedInAdvancedMode]
    = useState(false);
  // method to get the init call to action button value by language code
  const getInitCallToActionValue = useCallback(
    () =>
      (language && language.code === 'en' && 'Call To Action') || 'الذهاب إلى الحدث',
    [language],
  );
  const initStateRef = useRef({
    uuid: (activeItem && activeItem.uuid) || null,
    type: EvaBrandSectionsEnum.Header.key,
    order: 1,
    layout: 0,
    section_title: '',
    isExternalUrl: false,
    is_hidden: false,
    constants: {
      background_color: '',
      header_title: '',
      sub_header_title: '',
      background_media: null,
    },
    section_data: {
      description: '',
      has_call_to_action: false,
      action_title: getInitCallToActionValue(),
      link_type: null,
      link: null,
    },
  });
  // ref for errors schema for form errors
  const schema = useRef(
    yup.object().shape({
      section_title: yup.string().nullable(),
      isExternalUrl: yup.bool().nullable(),
      layout: yup.number().nullable(),
      // .required(t(`${translationPath}layout-is-required`)),
      constants: yup
        .object()

        .when('isExternalUrl', (isExternalUrl) => {
          // noinspection JSIncompatibleTypesComparison
          if (isExternalUrl)
            return yup.object().shape({
              background_color: yup.string().nullable(),
              header_title: yup.string().nullable(),
              sub_header_title: yup.string().nullable(),
              background_media: yup.object().nullable().shape({
                uuid: yup.string().nullable(),
                url: yup.string().nullable(),
                // .matches(youtubeVideoExpression, t('invalid-youtube-url')),
              }),
            });
          return yup.object().shape({
            background_color: yup.string().nullable(),
            header_title: yup.string().nullable(),
            sub_header_title: yup.string().nullable(),
            background_media: yup.object().nullable().shape({
              uuid: yup.string().nullable(),
              url: yup.string().nullable(),
            }),
          });
        }),
      section_data: yup
        .object()
        .nullable()
        .shape({
          description: yup.string().nullable(),
          action_title: yup.string().nullable(),
          has_call_to_action: yup.bool().nullable(),
          link_type: yup
            .number()
            .nullable()
            .when(
              'has_call_to_action',
              (value, field) =>
                (value
                  && field.required(t(`${translationPath}link-type-is-required`)))
                || field,
            ),
          link: yup
            .string()
            .nullable()
            .when('link_type', (type, field) => {
              // noinspection JSIncompatibleTypesComparison
              if (!type && type !== 0) return field;
              if (+type === NavigationLinkTypesEnum.Hyperlink.key)
                return field
                  .matches(urlExpression, {
                    message: t(`${translationPath}invalid-external-url`),
                    excludeEmptyString: true,
                  })
                  .when(
                    'has_call_to_action',
                    (value, secondField) =>
                      (value
                        && secondField.required(
                          t(`${translationPath}link-is-required`),
                        ))
                      || secondField,
                  );
              return field.when(
                'has_call_to_action',
                (value, secondField) =>
                  (value
                    && secondField.required(t(`${translationPath}link-is-required`)))
                  || secondField,
              );
            }),
        }),
    }),
  );
  // method to reset all state values (with lazy load)
  const reset = (values) => ({
    ...values,
  });
  // reducer to update the state on edit or rest or only single item
  const reducer = useCallback((state, action) => {
    if (action.index || action.index === 0) {
      const localState = { ...state };
      if (action.subParentId)
        localState[action.parentId][action.subParentId][action.index][action.id]
          = action.value;
      else if (action.parentId)
        localState[action.parentId][action.index][action.id] = action.value;
      else localState[action.id][action.index] = action.value;
      return localState;
    }
    if (action.subParentId)
      return {
        ...state,
        [action.parentId]: {
          ...state[action.parentId],
          [action.subParentId]: {
            ...state[action.parentId][action.subParentId],
            [action.id]: action.value,
          },
        },
      };
    if (action.parentId)
      return {
        ...state,
        [action.parentId]: {
          ...state[action.parentId],
          [action.id]: action.value,
        },
      };
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
  // method to update state on child update it
  const onStateChanged = (newValue) => {
    setState(newValue);
    if (isAdvancedMode && !isStateChangedInAdvancedMode)
      setIsStateChangedInAdvancedMode(true);
  };
  // method to mode on child update it
  const onModeChangedHandler = (event, newValue) => {
    // if (!newValue && isStateChangedInAdvancedMode) {
    setState({
      id: 'edit',
      value: {
        ...state,
        constants: {
          ...state.constants,
          header_title: HtmlToText(state.constants.header_title || ''),
          sub_header_title: HtmlToText(state.constants.sub_header_title || ''),
        },
      },
    });
    setIsStateChangedInAdvancedMode(false);
    // }
    setIsAdvancedMode(newValue);
  };
  /**
   * @param localState
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get if isAdvanced or not
   * @Return bool
   */
  const getIsAdvanced = useCallback(
    (localState) =>
      isHTML(localState.constants.header_title)
      || isHTML(localState.constants.sub_header_title),
    [],
  );
  // submit savingHandler method to save object to backend
  // if all errors are valid
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (errors.layout && errors.layout.error) {
      showError(errors.layout.message);
      return;
    }
    if (Object.keys(errors).length > 0) {
      if (activeTab !== 0 && Object.keys(errors)[0].includes('constants'))
        setActiveTab(0);
      else if (activeTab !== 1 && Object.keys(errors)[0].includes('['))
        setActiveTab(1);
      else if (activeTab !== 2 && Object.keys(errors)[0].includes('layout'))
        setActiveTab(2);
      Object.values(errors).map((item) => showError(item.message));
      return;
    }
    setIsLoading(true);
    const saveDto = {
      language_uuid,
      ...state,
      is_advanced: getIsAdvanced(state),
      ...state.constants,
      background_media_uuid:
        (state.constants.background_media
          && state.constants.background_media.uuid)
        || null,
    };
    const response
      = (activeItem && activeItem.uuid && (await UpdateEvaBrandSection(saveDto)))
      || (await CreateEvaBrandSection(saveDto));
    setIsLoading(false);
    if (response && (response.status === 201 || response.status === 200)) {
      if (activeItem && activeItem.uuid)
        showSuccess(t(`${translationPath}header-section-updated-successfully`));
      else showSuccess(t(`${translationPath}header-section-created-successfully`));
      if (onSave) onSave();
    } else if (activeItem && activeItem.uuid)
      showError(t(`${translationPath}header-section-update-failed`), response);
    else showError(t(`${translationPath}header-section-create-failed`), response);
  };
  /**
   * method to get current section data on edit by uuid
   * @param section_uuid
   */
  const getEvaBrandSectionById = useCallback(async (section_uuid) => {
    setIsLoading(true);
    const result = await GetEvaBrandSectionById({ section_uuid });
    setIsLoading(false);
    return result;
  }, []);
  /**
   * @param editState
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to if data include any change by advance mode
   */
  const getCurrentActiveMode = useCallback(
    (editState) => {
      if (!editState || !editState.constants) return;
      if (getIsAdvanced(editState)) {
        setIsAdvancedMode(true);
        setIsStateChangedInAdvancedMode(true);
      }
    },
    [getIsAdvanced],
  );
  /**
   * method to handle current section data on edit
   */
  const editInit = useCallback(async () => {
    let response = null;
    let localState = { ...activeItem };
    if (activeItem.uuid) {
      response = await getEvaBrandSectionById(activeItem.uuid);
      if (response && response.status === 201)
        localState = { ...localState, ...response.data.results };
      else {
        showError(t(`${translationPath}failed-to-get-saved-data`), response);
        if (isOpenChanged) isOpenChanged();
      }
    }
    if (!localState.section_data) localState.section_data = {};
    if (
      localState.constants
      && localState.constants.background_media
      && localState.constants.background_media.type
        === EvaBrandUploaderMediaTypesEnum.Youtube.key
    )
      localState.isExternalUrl = true;
    if (!localState.section_data.action_title)
      localState.section_data.action_title = getInitCallToActionValue();
    getCurrentActiveMode(localState);
    setState({ id: 'edit', value: localState });
  }, [
    activeItem,
    getCurrentActiveMode,
    getEvaBrandSectionById,
    getInitCallToActionValue,
    isOpenChanged,
    t,
    translationPath,
  ]);
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);
  useEffect(() => {
    if (activeItem) editInit();
  }, [activeItem, editInit]);

  return (
    <DialogComponent
      titleText={`${
        (activeItem
          && activeItem.uuid
          && t(`${translationPath}edit-header-section`))
        || t(`${translationPath}new-header-section`)
      } (${t(`Shared:${(language && language.code) || ''}`)})`}
      saveText={(activeItem && activeItem.uuid && 'update') || 'create'}
      maxWidth="md"
      minHeight="77vh"
      dialogContent={
        <div
          className={`header-section-dialog-wrapper section-wrapper${
            (language.code === 'ar' && ' rtl-direction') || ''
          }`}
        >
          <SwitchComponent
            idRef="HeaderModeSwitchRef"
            label="is-advanced-mode-description"
            isChecked={isAdvancedMode}
            isReversedLabel
            isFlexEnd
            onChange={onModeChangedHandler}
            parentTranslationPath={parentTranslationPath}
          />
          <div className="section-description-wrapper">
            <span className="description-text">
              {t(`${translationPath}section-description`)}
            </span>
          </div>
          <TabsComponent
            data={headerSectionTabsData}
            currentTab={activeTab}
            labelInput="label"
            idRef="HeaderSectionTabsRef"
            isWithLine
            isPrimary
            onTabChanged={(event, currentTab) => {
              setActiveTab(currentTab);
            }}
            parentTranslationPath={parentTranslationPath}
            dynamicComponentProps={{
              sections,
              state,
              onStateChanged,
              errors,
              isSubmitted,
              isAdvancedMode,
              parentTranslationPath,
              translationPath,
            }}
          />
        </div>
      }
      isSaving={isLoading}
      isOpen={isOpen}
      isOldTheme
      isEdit={(activeItem && activeItem.uuid && true) || undefined}
      onSubmit={saveHandler}
      onCloseClicked={isOpenChanged}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
    />
  );
};

HeaderSectionDialog.propTypes = {
  language_uuid: PropTypes.string.isRequired,
  language: PropTypes.instanceOf(Object).isRequired,
  sections: PropTypes.instanceOf(Array),
  activeItem: PropTypes.instanceOf(Object),
  isOpen: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};
HeaderSectionDialog.defaultProps = {
  activeItem: null,
  sections: [],
  translationPath: 'HeaderSectionDialog.',
};
