// React and reactstrap
import React, { useContext, useEffect, useState } from 'react';
import { Col, Row } from 'reactstrap';

// Toast notifications
import { useToasts } from 'react-toast-notifications';

// Color Picker
import ColorPicker from 'shared/components/ColorPicker';

// Modal components
import { ModalButtons } from 'components/Buttons/ModalButtons';
import { StandardModal } from 'components/Modals/StandardModal';

// Content
// import { evabrandContent } from 'assets/content/evabrandContent';

// Context API
import { CareerBrandingContext } from 'pages/evabrand/CareerBrandingContext';

// API
import { evabrandAPI } from 'api/evabrand';

// M-UI
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useTranslation } from 'react-i18next';

const translationPath = '';
const parentTranslationPath = 'EvaBrand';

/**
 * Color modal component to select the color palette of the portal
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const ColorModal = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  const { addToast } = useToasts(); // Toasts

  // Required Data
  const user = JSON.parse(localStorage.getItem('user'))?.results;
  const { languageId } = useContext(CareerBrandingContext);

  // Loading states
  const [isWorking, setIsWorking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Get Appearance
  const [appearance, setAppearance] = useState();
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);

  // States to Handle Fonts Option
  const [langTitle, setLangTitle] = useState(
    user?.language?.filter((ele) => ele?.id === languageId),
  );

  const arabicFonts = ['Cairo'];
  const englishFonts = ['Ubuntu', 'Open Sans', 'sans-serif', 'arial', 'Helvatica'];

  /**
   * Effect to prepare data
   */
  useEffect(() => {
    if (appearance || !languageId) return;

    /**
     * Get data from API
     * @returns {Promise<void>}
     */
    const getAppearance = async () => {
      evabrandAPI
        .getAppearance(languageId)
        .then((res) => {
          setAppearance(res.data.results.appearance);
        })
        .catch(() => {
          addToast(t(`${translationPath}error-in-getting-data`), {
            appearance: 'error',
            autoDismiss: true,
          });
        });
    };
    getAppearance();
  }, [languageId]);

  const fixedRadioButtonHandler = (event) => {
    const result = event.target.value;
    if (result === 'fixed')
      setAppearance((appearance) => ({
        ...appearance,
        header_action: true,
      }));
    else
      setAppearance((appearance) => ({
        ...appearance,
        header_action: false,
      }));

    setSaveButtonDisabled(false);
  };

  const pictureShape = (event) => {
    const result = event.target.value;
    if (result === 'square')
      setAppearance((appearance) => ({
        ...appearance,
        shape: true,
      }));
    else
      setAppearance((appearance) => ({
        ...appearance,
        shape: false,
      }));

    setSaveButtonDisabled(false);
  };
  /**
   * Wrapper to update data
   * @returns {Promise<void>}
   */
  const updateAppearance = async () => {
    setIsWorking(true);
    setIsSaving(true);

    /**
     * Update data via API
     */
    evabrandAPI
      .updateAppearance(languageId, {
        ...appearance,
        language_id: languageId,
        favicon_image_uuid: appearance.favicon_image_uuid?.uuid || null,
        logo_uuid: appearance.logo_uuid?.uuid || null,
        hero_background_image_uuid:
          appearance.hero_background_image_uuid?.uuid || null,
        video_uuid: appearance.video_uuid?.uuid || null,
        header_text_color: appearance?.header_text_color || appearance?.theme_color,
        general_text_color:
          appearance?.general_text_color || appearance?.theme_color,
        header_action: appearance?.header_action || false,
        font:
          appearance?.font === null
            ? langTitle?.length > 0
              ? langTitle[0]?.code === 'en'
                ? 'Ubuntu'
                : 'Cairo'
              : null
            : appearance?.font,
      })
      .then(() => {
        setIsWorking(false);
        setIsSaving(false);
        addToast(t(`${translationPath}successfully-updated`), {
          appearance: 'success',
          autoDismiss: true,
        });
        setSaveButtonDisabled(true);
      })
      .catch(() => {
        setIsWorking(false);
        setIsSaving(false);
        addToast(t(`${translationPath}error-in-updating-your-changes`), {
          appearance: 'error',
          autoDismiss: true,
        });
      });
  };

  /**
   * Handler for 'Cancel' button
   * @returns {*}
   */
  const cancelButtonHandler = () => props.closeModal();

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
    <>
      {/* MODAL COMPONENT */}
      <StandardModal
        title={t(`${translationPath}set-your-main-color-palette`)}
        subtitle={t(`${translationPath}color-subtitle`)}
        isOpen={props.isOpen}
        isLoading={isWorking || !appearance}
        onClose={props.closeModal}
        languageTag={user?.language.filter((l) => l.id === languageId)[0].title}
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
          <div className="mt-5">
            <Row>
              <Col xs="12" sm="6" className="mb-2">
                <ColorPicker
                  label="Theme color"
                  color={appearance?.theme_color}
                  onChange={(color) => {
                    setAppearance((appearance) => ({
                      ...appearance,
                      theme_color: color.hex,
                    }));
                    setSaveButtonDisabled(false);
                  }}
                />
              </Col>
              <Col xs="12" sm="6" className="mb-2">
                <ColorPicker
                  label={t(`${translationPath}background-color`)}
                  color={appearance?.hero_background_color}
                  onChange={(color) => {
                    setAppearance((appearance) => ({
                      ...appearance,
                      hero_background_color: color.hex,
                    }));
                    setSaveButtonDisabled(false);
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col xs="12" sm="6" className="mb-2">
                <ColorPicker
                  label={t(`${translationPath}primary-button-color`)}
                  color={appearance?.primary_button_color}
                  onChange={(color) => {
                    setAppearance((appearance) => ({
                      ...appearance,
                      primary_button_color: color.hex,
                    }));
                    setSaveButtonDisabled(false);
                  }}
                />
              </Col>
              <Col xs="12" sm="6" className="mb-2">
                <ColorPicker
                  label={t(`${translationPath}secondary-button-color`)}
                  color={appearance?.secondary_button_color}
                  onChange={(color) => {
                    setAppearance((appearance) => ({
                      ...appearance,
                      secondary_button_color: color.hex,
                    }));
                    setSaveButtonDisabled(false);
                  }}
                />
              </Col>
              <Col xs="12" sm="6" className="mb-2">
                <ColorPicker
                  label={t(`${translationPath}general-text-color`)}
                  color={appearance?.general_text_color}
                  onChange={(color) => {
                    setAppearance((appearance) => ({
                      ...appearance,
                      general_text_color: color.hex,
                    }));
                    setSaveButtonDisabled(false);
                  }}
                />
              </Col>
              <Col xs="12" sm="6" className="mb-2">
                <ColorPicker
                  label={t(`${translationPath}header-text-color`)}
                  color={appearance?.header_text_color}
                  onChange={(color) => {
                    setAppearance((appearance) => ({
                      ...appearance,
                      header_text_color: color.hex,
                    }));
                    setSaveButtonDisabled(false);
                  }}
                />
              </Col>
              {/* <Row> */}
              <Col xs="12" sm="6" className="mt-2">
                <div className="h6 font-weight-normal">
                  {t(
                    `${translationPath}transparent-navigation-bar-will-become-fixed-when-you-scroll-down`,
                  )}
                </div>
              </Col>
              <Col xs="12" sm="6" className="mt-2">
                <RadioGroup
                  aria-label="transparentHeader"
                  name="transparentHeaderRadio"
                  // value={"fixed"}
                  onChange={fixedRadioButtonHandler}
                >
                  <div className="d-flex ">
                    <FormControlLabel
                      checked={!!appearance.header_action}
                      value="fixed"
                      control={<Radio color="primary" />}
                      label={t(`${translationPath}yes`)}
                    />
                    <FormControlLabel
                      checked={!appearance.header_action}
                      value="notfixed"
                      control={<Radio color="primary" />}
                      label={t(`${translationPath}no`)}
                    />
                  </div>
                </RadioGroup>
              </Col>
              <Col xs="12" sm="6" className="mt-2">
                <div className="h6 font-weight-normal">
                  {t(`${translationPath}sections-images-layout-shape`)}
                </div>
              </Col>
              <Col xs="12" sm="6" className="mt-2">
                <RadioGroup
                  aria-label="transparentHeader"
                  name="transparentHeaderRadio"
                  onChange={pictureShape}
                >
                  <div className="d-flex ">
                    <FormControlLabel
                      checked={!appearance.shape}
                      value="circle"
                      control={<Radio color="primary" />}
                      label={t(`${translationPath}circle`)}
                    />
                    <FormControlLabel
                      checked={!!appearance.shape}
                      value="square"
                      control={<Radio color="primary" />}
                      label={t(`${translationPath}square`)}
                    />
                  </div>
                </RadioGroup>
              </Col>
              <Col xs="12" sm="6" className="mt-2">
                <div className="h6 font-weight-normal">
                  {t(`${translationPath}career-portal-layout-font`)}
                </div>
              </Col>
              <Col xs="12" sm="6" className="px-2 mt-2">
                <Autocomplete
                  fullWidth
                  autoHighlight
                  options={
                    langTitle?.length > 0
                      ? langTitle[0]?.code === 'en'
                        ? englishFonts
                        : arabicFonts
                      : []
                  }
                  getOptionLabel={(option) => option}
                  isOptionEqualToValue={(option) => option}
                  id="font"
                  name="font"
                  label={t(`${translationPath}font`)}
                  variant="outlined"
                  value={appearance?.font}
                  onChange={(e, value) => {
                    setAppearance((appearance) => ({
                      ...appearance,
                      font: value,
                    }));
                    setSaveButtonDisabled(false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t(`${translationPath}font`)}
                      variant="outlined"
                      inputProps={{
                        ...params.inputProps,
                      }}
                      value={appearance?.font}
                    />
                  )}
                />
              </Col>
              <small className="px-3 mt-3">
                {t(`${translationPath}hint-recommended-size-for-images`)} <br />{' '}
                {t(`${translationPath}circle`)}: 182 * 182 px ,{' '}
                {t(`${translationPath}square`)}: 182 * 240 px
              </small>
              {/* </Row> */}
            </Row>
          </div>
        )}
      </StandardModal>
    </>
  );
};

export default ColorModal;
