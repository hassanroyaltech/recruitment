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
import { OpeningsSectionTabs } from '../shared/tabs-data';
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
import { EvaBrandJobLimitsEnum, EvaBrandSectionsEnum } from '../../../../enums';

// dialog to management the section of type openings
export const OpeningsSectionDialog = ({
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
  const [headerSectionTabsData] = useState(() => OpeningsSectionTabs);
  const [errors, setErrors] = useState(() => ({}));
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [isStateChangedInAdvancedMode, setIsStateChangedInAdvancedMode]
    = useState(false);
  const initStateRef = useRef({
    uuid: (activeItem && activeItem.uuid) || null,
    type: EvaBrandSectionsEnum.OpeningsSection.key,
    order: 3,
    layout: 0,
    section_title: '',
    is_hidden: false,
    constants: {
      background_color: '',
      header_title: '',
      sub_header_title: '',
      background_media: null,
    },
    section_data: {
      description: '',
      limit: EvaBrandJobLimitsEnum['2'].key,
    },
  });
  // ref for errors schema for form errors
  const schema = useRef(
    yup.object().shape({
      section_title: yup.string().nullable(),
      layout: yup.number().nullable(),
      // .required(t(`${translationPath}layout-is-required`)),
      constants: yup.object().shape({
        background_color: yup.string().nullable(),
        header_title: yup.string().nullable(),
        sub_header_title: yup.string().nullable(),
        background_media: yup.object().nullable().shape({
          uuid: yup.string().nullable(),
          url: yup.string().nullable(),
        }),
      }),
      section_data: yup
        .object()
        .nullable()
        .shape({
          description: yup.string().nullable(),
          limit: yup
            .number()
            .nullable()
            .required(t(`${translationPath}jobs-limit-is-required`)),
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
        showSuccess(t(`${translationPath}openings-section-updated-successfully`));
      else showSuccess(t(`${translationPath}openings-section-created-successfully`));
      if (onSave) onSave();
    } else if (activeItem && activeItem.uuid)
      showError(t(`${translationPath}openings-section-update-failed`), response);
    else showError(t(`${translationPath}openings-section-create-failed`), response);
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
      if (!editState) return;
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
    getCurrentActiveMode(localState);
    setState({ id: 'edit', value: localState });
  }, [
    activeItem,
    getCurrentActiveMode,
    getEvaBrandSectionById,
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
          && t(`${translationPath}edit-openings-section`))
        || t(`${translationPath}new-openings-section`)
      } (${t(`Shared:${(language && language.code) || ''}`)})`}
      saveText={(activeItem && activeItem.uuid && 'update') || 'create'}
      maxWidth="md"
      minHeight="77vh"
      dialogContent={
        <div
          className={`openings-section-dialog-wrapper section-wrapper${
            (language.code === 'ar' && ' rtl-direction') || ''
          }`}
        >
          <SwitchComponent
            idRef="OpeningsModeSwitchRef"
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
            idRef="OpeningsSectionTabsRef"
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

OpeningsSectionDialog.propTypes = {
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
OpeningsSectionDialog.defaultProps = {
  activeItem: null,
  sections: [],
  translationPath: 'OpeningsSectionDialog.',
};
