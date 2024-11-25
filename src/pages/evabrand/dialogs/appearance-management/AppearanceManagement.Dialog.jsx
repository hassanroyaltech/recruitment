/* eslint-disable */
// React and reactstrap
// noinspection JSUnresolvedVariable

import React, { useCallback, useEffect, useState } from 'react';

// Color Picker
import ColorPicker from 'shared/components/ColorPicker';

// Modal components
import { ModalButtons } from 'components/Buttons/ModalButtons';
import { StandardModal } from 'components/Modals/StandardModal';

// M-UI
import { useTranslation } from 'react-i18next';
import {
  GetEvaBrandAppearanceByLanguageId,
  UpdateEvaBrandAppearance,
} from '../../../../services';
import { RGBAToHexA, showError, showSuccess } from '../../../../helpers';
import { RadiosComponent } from '../../../../components';
import { AppearanceUploaderControl, FontsAutocompleteControl } from './controls';
import { GlobalStyleManagementSection } from './sections';
import './AppearanceManagement.Style.scss';

const translationPath = '';
const parentTranslationPath = 'EvaBrand';

/**
 * Color modal component to select the color palette of the portal
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export const AppearanceManagementDialog = (props) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t } = useTranslation(parentTranslationPath);

  // Required Data
  // Loading states
  const [isWorking, setIsWorking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Get Appearance
  const [appearance, setAppearance] = useState();
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);

  // States to Handle Fonts Option
  const getAppearance = useCallback(async () => {
    const response = await GetEvaBrandAppearanceByLanguageId({
      language_uuid: props.language_uuid,
    });
    if (response && response.status === 200) {
      const results = { ...response.data.results };
      setAppearance({
        header_text_color: results.header_text_color || null,
        font: results.font || null,
        general_text_color:
          results.general_text_color || results.theme_color || null,
        theme_color: results.theme_color,
        primary_button_color: results.prime_button_color || null,
        secondary_button_color: results.secondary_button_color || null,
        background_color: results.background_color || null,
        login_background_color: results.login_background_color || null,
        drawer_text_color: results.drawer_text_color || null,
        image_shaping: results.image_shaping ? results.image_shaping : 0,
        login_background_media: results.login_background_media || null,
        fixed_nav: results.fixed_nav || false,
        fixed_social_media: results.fixed_social_media || false,
        show_secondary_logo: results.show_secondary_logo || false,
        show_ai_score: results.show_ai_score || false,
        is_transparent_menu: results.is_transparent_menu || false,
        titles_style:
          (results.titles_style && JSON.parse(results.titles_style)) || null,
        sub_titles_style:
          (results.sub_titles_style && JSON.parse(results.sub_titles_style)) || null,
        descriptions_style:
          (results.descriptions_style && JSON.parse(results.descriptions_style)) ||
          null,
      });
    } else {
      showError(t(`${translationPath}error-in-getting-data`), response);
      if (props.closeModal) props.closeModal();
    }
  }, []);
  /**
   * Effect to prepare data
   */
  useEffect(() => {
    if (appearance || !props.language_uuid) return;

    /**
     * Get data from API
     * @returns {Promise<void>}
     */

    getAppearance();
  }, [props.language_uuid]);

  /**
   * Handler for 'Cancel' button
   * @returns {*}
   */
  const cancelButtonHandler = () => props.closeModal();
  /**
   * Wrapper to update data
   * @returns {Promise<void>}
   */
  const updateAppearance = async () => {
    setIsSubmitted(true);
    if (!appearance || !appearance.font) return;
    setIsWorking(true);
    setIsSaving(true);
    /**
     * Update data via API
     */

    const response = await UpdateEvaBrandAppearance({
      language_uuid: props.language_uuid,
      header_text_color: appearance.header_text_color || null,
      font: appearance.font || null,
      general_text_color:
        appearance.general_text_color || appearance.theme_color || null,
      theme_color: appearance.theme_color,
      prime_button_color: appearance.primary_button_color || null,
      fixed_nav: appearance.fixed_nav || false,
      secondary_button_color: appearance.secondary_button_color || null,
      background_color: appearance.background_color || null,
      login_background_color: appearance.login_background_color || null,
      drawer_text_color: appearance.drawer_text_color || null,
      login_background_media_uuid:
        (appearance.login_background_media &&
          appearance.login_background_media.uuid) ||
        null,
      image_shaping: appearance.image_shaping ? appearance.image_shaping : 0,
      fixed_social_media: appearance.fixed_social_media || false,
      show_secondary_logo: appearance.show_secondary_logo || false,
      show_ai_score: appearance.show_ai_score || false,
      is_transparent_menu: appearance.is_transparent_menu || false,
      titles_style:
        (appearance.titles_style && JSON.stringify(appearance.titles_style)) || null,
      sub_titles_style:
        (appearance.sub_titles_style &&
          JSON.stringify(appearance.sub_titles_style)) ||
        null,
      descriptions_style:
        (appearance.descriptions_style &&
          JSON.stringify(appearance.descriptions_style)) ||
        null,
    });
    if (response && response.status === 200) {
      setIsWorking(false);
      setIsSaving(false);
      showSuccess(t(`${translationPath}successfully-updated`));
      setSaveButtonDisabled(true);
      cancelButtonHandler();
    } else {
      setIsWorking(false);
      setIsSaving(false);
      showError(t(`${translationPath}error-in-updating-your-changes`), response);
    }
  };

  /**
   * Handler for 'Save' button
   * @returns {*}
   */
  const saveButtonHandler = () => updateAppearance();

  /**
   * Render the component
   * @return {JSX.Element}
   */
  return (
    <StandardModal
      title={t(`${translationPath}set-your-main-color-palette`)}
      subtitle={t(`${translationPath}color-subtitle`)}
      isOpen={props.isOpen}
      isLoading={isWorking || !appearance}
      onClose={props.closeModal}
      languageTag={(props.language && props.language.title) || ''}
      buttons={
        <ModalButtons
          cancelButton
          cancelButtonHandler={cancelButtonHandler}
          saveButton
          saveButtonDisabled={saveButtonDisabled}
          saveButtonHandler={saveButtonHandler}
          isSaving={isSaving}
        />
      }
    >
      {/* Modal body */}
      {appearance && (
        <div className="appearance-management-dialog-wrapper mt-5">
          <div>
            <div className="control-wrapper">
              <ColorPicker
                label={t(`${translationPath}theme-color`)}
                color={appearance?.theme_color}
                onChange={(color) => {
                  setAppearance((appearance) => ({
                    ...appearance,
                    theme_color: RGBAToHexA(color.rgb),
                  }));
                  setSaveButtonDisabled(false);
                }}
              />
            </div>
            <div className="control-wrapper">
              <ColorPicker
                label={t(`${translationPath}button-text-color`)}
                color={appearance?.background_color}
                onChange={(color) => {
                  setAppearance((appearance) => ({
                    ...appearance,
                    background_color: RGBAToHexA(color.rgb),
                  }));
                  setSaveButtonDisabled(false);
                }}
              />
            </div>
          </div>
          <div>
            <div className="control-wrapper">
              <ColorPicker
                label={t(`${translationPath}primary-button-color`)}
                color={appearance?.primary_button_color}
                onChange={(color) => {
                  setAppearance((appearance) => ({
                    ...appearance,
                    primary_button_color: RGBAToHexA(color.rgb),
                  }));
                  setSaveButtonDisabled(false);
                }}
              />
            </div>
            <div className="control-wrapper">
              <ColorPicker
                label={t(`${translationPath}secondary-button-color`)}
                color={appearance?.secondary_button_color}
                onChange={(color) => {
                  setAppearance((appearance) => ({
                    ...appearance,
                    secondary_button_color: RGBAToHexA(color.rgb),
                  }));
                  setSaveButtonDisabled(false);
                }}
              />
            </div>
            <div className="control-wrapper">
              <ColorPicker
                label={t(`${translationPath}general-text-color`)}
                color={appearance?.general_text_color}
                onChange={(color) => {
                  setAppearance((appearance) => ({
                    ...appearance,
                    general_text_color: RGBAToHexA(color.rgb),
                  }));
                  setSaveButtonDisabled(false);
                }}
              />
            </div>
            <div className="control-wrapper">
              <ColorPicker
                label={t(`${translationPath}header-text-color`)}
                color={appearance?.header_text_color}
                onChange={(color) => {
                  setAppearance((appearance) => ({
                    ...appearance,
                    header_text_color: RGBAToHexA(color.rgb),
                  }));
                  setSaveButtonDisabled(false);
                }}
              />
            </div>
            <div className="control-wrapper">
              <ColorPicker
                label={t(`${translationPath}login-background-color`)}
                color={appearance?.login_background_color}
                onChange={(color) => {
                  setAppearance((appearance) => ({
                    ...appearance,
                    login_background_color: RGBAToHexA(color.rgb),
                  }));
                  setSaveButtonDisabled(false);
                }}
              />
            </div>
            <div className="control-wrapper">
              <ColorPicker
                label={t(`${translationPath}drawer-text-color`)}
                color={appearance?.drawer_text_color}
                onChange={(color) => {
                  setAppearance((appearance) => ({
                    ...appearance,
                    drawer_text_color: RGBAToHexA(color.rgb),
                  }));
                  setSaveButtonDisabled(false);
                }}
              />
            </div>
            {/* d-inline-flex flex-wrap */}
            <div className="w-100 px-2 mb-2">
              <RadiosComponent
                idRef="fixedNavigationRef"
                name="fixedNavigationName"
                labelInput="value"
                valueInput="key"
                labelValue="transparent-navigation-bar-will-become-fixed-when-you-scroll-down"
                value={appearance.fixed_nav}
                data={[
                  {
                    key: true,
                    value: 'yes',
                  },
                  {
                    key: false,
                    value: 'no',
                  },
                ]}
                parentTranslationPath={parentTranslationPath}
                translationPathForData={translationPath}
                translationPath={translationPath}
                onSelectedRadioChanged={(event, newValue) => {
                  setAppearance((items) => ({
                    ...items,
                    fixed_nav: newValue === 'true',
                  }));
                  setSaveButtonDisabled(false);
                }}
              />
            </div>
            {/* d-inline-flex flex-wrap */}
            {/*<div className="w-100 px-2 mb-2">*/}
            {/*  <RadiosComponent*/}
            {/*    idRef="imageShapingRef"*/}
            {/*    name="imageShapingName"*/}
            {/*    labelInput="value"*/}
            {/*    valueInput="key"*/}
            {/*    labelValue="sections-images-layout-shape"*/}
            {/*    value={appearance.image_shaping}*/}
            {/*    data={[*/}
            {/*      {*/}
            {/*        key: 0,*/}
            {/*        value: 'circle',*/}
            {/*      },*/}
            {/*      {*/}
            {/*        key: 1,*/}
            {/*        value: 'square',*/}
            {/*      },*/}
            {/*    ]}*/}
            {/*    parentTranslationPath={parentTranslationPath}*/}
            {/*    translationPathForData={translationPath}*/}
            {/*    translationPath={translationPath}*/}
            {/*    onSelectedRadioChanged={(event, newValue) => {*/}
            {/*      setAppearance((items) => ({*/}
            {/*        ...items,*/}
            {/*        image_shaping: +newValue,*/}
            {/*      }));*/}
            {/*      setSaveButtonDisabled(false);*/}
            {/*    }}*/}
            {/*  />*/}
            {/*</div>*/}
            {/* d-inline-flex flex-wrap */}
            <div className="w-100 px-2 mb-2">
              <RadiosComponent
                idRef="fixedSocialMediaRef"
                name="fixedSocialMediaName"
                labelInput="value"
                valueInput="key"
                labelValue="fixed-social-media-description"
                value={appearance.fixed_social_media}
                data={[
                  {
                    key: true,
                    value: 'yes',
                  },
                  {
                    key: false,
                    value: 'no',
                  },
                ]}
                parentTranslationPath={parentTranslationPath}
                translationPathForData={translationPath}
                translationPath={translationPath}
                onSelectedRadioChanged={(event, newValue) => {
                  setAppearance((items) => ({
                    ...items,
                    fixed_social_media: newValue === 'true',
                  }));
                  setSaveButtonDisabled(false);
                }}
              />
            </div>
            <div className="w-100 px-2 mb-2">
              <RadiosComponent
                idRef="showSecondaryLogoRef"
                name="showSecondaryLogoName"
                labelInput="value"
                valueInput="key"
                labelValue="show-secondary-logo-description"
                value={appearance.show_secondary_logo}
                data={[
                  {
                    key: true,
                    value: 'yes',
                  },
                  {
                    key: false,
                    value: 'no',
                  },
                ]}
                parentTranslationPath={parentTranslationPath}
                translationPathForData={translationPath}
                translationPath={translationPath}
                onSelectedRadioChanged={(event, newValue) => {
                  setAppearance((items) => ({
                    ...items,
                    show_secondary_logo: newValue === 'true',
                  }));
                  setSaveButtonDisabled(false);
                }}
              />
            </div>
            <div className="w-100 px-2 mb-2">
              <RadiosComponent
                idRef="showAIScoreRef"
                name="showAIScoreName"
                labelInput="value"
                valueInput="key"
                labelValue="show-ai-description"
                value={appearance.show_ai_score}
                data={[
                  {
                    key: true,
                    value: 'yes',
                  },
                  {
                    key: false,
                    value: 'no',
                  },
                ]}
                parentTranslationPath={parentTranslationPath}
                translationPathForData={translationPath}
                translationPath={translationPath}
                onSelectedRadioChanged={(event, newValue) => {
                  setAppearance((items) => ({
                    ...items,
                    show_ai_score: newValue === 'true',
                  }));
                  setSaveButtonDisabled(false);
                }}
              />
            </div>
            <div className="w-100 px-2 mb-2">
              <RadiosComponent
                idRef="isTransparentMenuRef"
                name="isTransparentMenuName"
                labelInput="value"
                valueInput="key"
                labelValue="is-transparent-menu-description"
                value={appearance.is_transparent_menu}
                data={[
                  {
                    key: true,
                    value: 'yes',
                  },
                  {
                    key: false,
                    value: 'no',
                  },
                ]}
                parentTranslationPath={parentTranslationPath}
                translationPathForData={translationPath}
                translationPath={translationPath}
                onSelectedRadioChanged={(event, newValue) => {
                  setAppearance((items) => ({
                    ...items,
                    is_transparent_menu: newValue === 'true',
                  }));
                  setSaveButtonDisabled(false);
                }}
              />
            </div>
            <div className="c-gray-primary control-wrapper fw-simi-bold fz-default">
              <div>{t(`${translationPath}career-portal-layout-font`)}</div>
            </div>
            <FontsAutocompleteControl
              editValue={(appearance && appearance.font) || null}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              inputLabel="font"
              placeholder="font"
              // errors={errors}
              isSubmitted={isSubmitted}
              stateKey="font"
              isRequired
              language={props.language}
              onValueChanged={(newValue) => {
                setAppearance((items) => ({
                  ...items,
                  [newValue.id]: newValue.value,
                }));
                setSaveButtonDisabled(false);
              }}
            />
            <AppearanceUploaderControl
              idRef="loginMediaRef"
              mediaItem={appearance.login_background_media || undefined}
              onValueChanged={(newValue) => {
                setAppearance((items) => ({
                  ...items,
                  [newValue.id]: newValue.value,
                }));
                setSaveButtonDisabled(false);
              }}
              isSubmitted={isSubmitted}
              parentId="login_background_media"
              urlStateKey="url"
              uuidStateKey="uuid"
              labelValue="upload-login-image"
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
            <GlobalStyleManagementSection
              idRef="sectionsTitleRef"
              value={(appearance && appearance.titles_style) || undefined}
              onValueChanged={(newValue) => {
                setAppearance((items) => ({ ...items, titles_style: newValue }));
                setSaveButtonDisabled(false);
              }}
              labelValue="sections-title"
              parentTranslationPath={parentTranslationPath}
            />
            <GlobalStyleManagementSection
              idRef="sectionsSubtitleRef"
              value={(appearance && appearance.sub_titles_style) || undefined}
              onValueChanged={(newValue) => {
                setAppearance((items) => ({ ...items, sub_titles_style: newValue }));
                setSaveButtonDisabled(false);
              }}
              labelValue="sections-subtitle"
              parentTranslationPath={parentTranslationPath}
            />
            <GlobalStyleManagementSection
              idRef="sectionsDescriptionRef"
              value={(appearance && appearance.descriptions_style) || undefined}
              onValueChanged={(newValue) => {
                setAppearance((items) => ({
                  ...items,
                  descriptions_style: newValue,
                }));
                setSaveButtonDisabled(false);
              }}
              labelValue="sections-description"
              parentTranslationPath={parentTranslationPath}
            />
            <small className="d-flex px-2 mt-3">
              {t(`${translationPath}hint-recommended-size-for-images`)} <br />{' '}
              {t(`${translationPath}circle`)}: 182 * 182 px ,{' '}
              {t(`${translationPath}square`)}: 182 * 240 px
            </small>
            {/* </Row> */}
          </div>
        </div>
      )}
    </StandardModal>
  );
};
