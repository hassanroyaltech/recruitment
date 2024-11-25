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
import { MenuSectionTabs } from '../shared/tabs-data';
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
import { EvaBrandSectionsEnum, NavigationLinkTypesEnum } from '../../../../enums';
import { SetupsReducer, SetupsReset } from '../../../setups/shared';

// dialog to management the section of type header
export const MenuSectionDialog = ({
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
  const [menuSectionTabsData] = useState(() => MenuSectionTabs);
  const [errors, setErrors] = useState(() => ({}));
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [isStateChangedInAdvancedMode, setIsStateChangedInAdvancedMode]
    = useState(false);
  const initStateRef = useRef({
    uuid: (activeItem && activeItem.uuid) || null,
    type: EvaBrandSectionsEnum.Menu.key,
    order: 1,
    layout: 0,
    section_title: '',
    is_hidden: false,
    constants: {
      background_color: '',
      background_media: null,
    },
    section_data: {
      company_logo: null,
      company_favicon: null,
      secondary_logo: null,
      nav_items: [
        {
          title: '',
          type: null,
          link: null,
        },
      ],
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
          company_logo: yup.object().nullable().shape({
            uuid: yup.string().nullable(),
            media: yup.string().nullable(),
          }),
          company_favicon: yup.object().nullable().shape({
            uuid: yup.string().nullable(),
            media: yup.string().nullable(),
          }),
          secondary_logo: yup.object().nullable().shape({
            uuid: yup.string().nullable(),
            media: yup.string().nullable(),
          }),
          nav_items: yup.array().of(
            yup.object().shape({
              title: yup
                .string()
                .nullable()
                .required(t(`${translationPath}title-is-required`)),
              type: yup
                .number()
                .nullable()
                .required(t(`${translationPath}link-type-is-required`)),
              link: yup
                .string()
                .nullable()
                .when('type', (type, field) => {
                  // noinspection JSIncompatibleTypesComparison
                  if (!type && type !== 0) return field;
                  if (+type === NavigationLinkTypesEnum.Hyperlink.key)
                    return field
                      .matches(urlExpression, {
                        message: t(`${translationPath}invalid-external-url`),
                        excludeEmptyString: true,
                      })
                      .required(t(`${translationPath}link-is-required`));
                  return field.required(t(`${translationPath}link-is-required`));
                }),
              nav_items: yup.array().of(
                yup.object().shape({
                  title: yup
                    .string()
                    .nullable()
                    .required(t(`${translationPath}title-is-required`)),
                  type: yup
                    .number()
                    .nullable()
                    .required(t(`${translationPath}link-type-is-required`)),
                  link: yup
                    .string()
                    .nullable()
                    .when('type', (type, field) => {
                      // noinspection JSIncompatibleTypesComparison
                      if (!type && type !== 0) return field;
                      if (+type === NavigationLinkTypesEnum.Hyperlink.key)
                        return field
                          .matches(urlExpression, {
                            message: t(`${translationPath}invalid-external-url`),
                            excludeEmptyString: true,
                          })
                          .required(t(`${translationPath}link-is-required`));
                      return field.required(t(`${translationPath}link-is-required`));
                    }),
                }),
              ),
            }),
          ),
        }),
    }),
  );
  // state with useReducer react hook
  const [state, setState] = useReducer(
    SetupsReducer,
    JSON.parse(JSON.stringify(initStateRef.current)),
    SetupsReset,
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
        section_data: {
          ...state.section_data,
          nav_items: state.section_data.nav_items?.map((item) => ({
            ...item,
            title: HtmlToText(item.title || ''),
          })),
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
      localState.section_data.nav_items.some((item) => isHTML(item.title)),
    [],
  );
  // submit savingHandler method to save object to backend
  // if all errors are valid
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (errors.layout && errors.layout.error) return;
    // showError(errors.layout.message);

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
      section_data: {
        ...state.section_data,
        company_logo_uuid:
          state.section_data.company_logo && state.section_data.company_logo.uuid,
        company_favicon_uuid:
          state.section_data.company_favicon
          && state.section_data.company_favicon.uuid,
        secondary_logo_uuid:
          state.section_data.secondary_logo
          && state.section_data.secondary_logo.uuid,
      },
    };
    const response
      = (activeItem && activeItem.uuid && (await UpdateEvaBrandSection(saveDto)))
      || (await CreateEvaBrandSection(saveDto));
    setIsLoading(false);
    if (response && (response.status === 201 || response.status === 200)) {
      if (activeItem && activeItem.uuid)
        showSuccess(t(`${translationPath}menu-section-updated-successfully`));
      else showSuccess(t(`${translationPath}menu-section-created-successfully`));
      if (onSave) onSave();
    } else if (activeItem && activeItem.uuid)
      showError(t(`${translationPath}menu-section-update-failed`), response);
    else showError(t(`${translationPath}menu-section-create-failed`), response);
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
    if (!localState.section_data)
      localState.section_data = {
        company_logo: null,
        company_favicon: null,
        nav_items: [],
      };
    if (
      !localState.section_data.nav_items
      || localState.section_data.nav_items.length === 0
    )
      localState.section_data.nav_items = [
        {
          title: '',
          type: null,
          link: null,
        },
      ];
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
          && t(`${translationPath}edit-menu-section`))
        || t(`${translationPath}new-menu-section`)
      } (${t(`Shared:${(language && language.code) || ''}`)})`}
      saveText={(activeItem && activeItem.uuid && 'update') || 'create'}
      maxWidth="md"
      minHeight="77vh"
      dialogContent={
        <div className="menu-section-dialog-wrapper section-wrapper">
          <SwitchComponent
            idRef="MenuModeSwitchRef"
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
            data={menuSectionTabsData}
            currentTab={activeTab}
            labelInput="label"
            idRef="MenuSectionTabsRef"
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
              language,
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

MenuSectionDialog.propTypes = {
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
MenuSectionDialog.defaultProps = {
  activeItem: null,
  sections: [],
  translationPath: 'MenuSectionDialog.',
};
