// React and reactstrap
import React, { useContext, useEffect, useState } from 'react';
import { Col, FormGroup, Input, Row, TabContent, TabPane } from 'reactstrap';

// Toasts
import { useToasts } from 'react-toast-notifications';

// Dropzone
import DropzoneWrapper from 'shared/components/DropzoneWrapper';

// File preview
import FilesPreview from 'shared/components/FilesPreview';

// Loader
import { BoardsLoader } from 'shared/Loaders';

// Helpers
import {
  matchYoutubeUrl,
  matchVimeoUrl,
  UrlValidationMessage,
} from 'utils/functions/helpers';

// Content
// import { evabrandContent } from 'assets/content/evabrandContent';

// Context
import { useTranslation } from 'react-i18next';
import { CareerBrandingContext } from '../../pages/evabrand/CareerBrandingContext';

// APIs
import { evabrandAPI } from '../../api/evabrand';
import { commonAPI } from '../../api/common';
import { ModalButtons } from '../Buttons/ModalButtons';
import { StandardModal } from './StandardModal';

const translationPath = '';
const parentTranslationPath = 'EvaBrand';

/**
 * About Us Section Modal
 *
 * Contains the capability to change the header and subheader of the career portal
 * and upload/link a company video
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const AboutUsModal = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  const { addToast } = useToasts(); // Toasts

  // Required Data
  const user = JSON.parse(localStorage.getItem('user'))?.results;

  const { languageId } = useContext(CareerBrandingContext);
  const [isWorking, setIsWorking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Get Appearance
  const [data, setData] = useState();

  // Errors
  const [errors, setErrors] = useState([]);

  // URL validation
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [videoType, setVideoType] = useState();
  const [currentValue, setCurrentValue] = useState('');
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
  const [description, setDescription] = useState(false);
  const [sectionFlag, setSectionFlag] = useState(false);

  /**
   * Get the about us section data
   */
  useEffect(() => {
    if (data || !languageId) return;

    /**
     * Get data constructor
     * @returns {Promise<void>}
     */
    const getData = async () => {
      evabrandAPI
        .getAboutUs(languageId)
        .then((res) => {
          // Save results data
          const { results } = res.data;
          // Set a default video type for the input
          // results.about_us.marketing_video_type = 'Youtube';
          setVideoType(results.about_us.marketing_video_type);
          // Set data state
          setData(results);
        })
        .catch((error) => {
          addToast(t(`${translationPath}error-in-getting-data`), {
            appearance: 'error',
            autoDismiss: true,
          });
          setErrors(error?.response?.data?.errors);
        });
    };
    getData();
  }, [languageId]);

  // Update Data
  const updateInformation = async () => {
    // return;
    if (sectionFlag) {
      setIsWorking(true);
      setIsSaving(true);
      evabrandAPI
        .updateAboutUsInformation(languageId, data)
        .then(() => {
          setIsWorking(false);
          setIsSaving(false);
          addToast(t(`${translationPath}successfully-updated`), {
            appearance: 'success',
            autoDismiss: true,
          });
          setSaveButtonDisabled(true);
          setSectionFlag(false);
        })
        .catch((error) => {
          setIsWorking(false);
          setIsSaving(false);
          addToast(t(`${translationPath}error-in-updating-your-changes`), {
            appearance: 'error',
            autoDismiss: true,
          });
          setErrors(error?.response?.data?.errors);
        });
    }
  };

  const updateAboutUs = async () => {
    if (isValidUrl || description) {
      setIsWorking(true);
      setIsSaving(true);
      evabrandAPI
        .updateAboutUs(languageId, data)
        .then(() => {
          setIsWorking(false);
          setIsSaving(false);
          addToast(t(`${translationPath}successfully-updated`), {
            appearance: 'success',
            autoDismiss: true,
          });
          setSaveButtonDisabled(true);
          setDescription(false);
        })
        .catch((error) => {
          setIsWorking(false);
          setIsSaving(false);
          addToast(t(`${translationPath}error-in-updating-your-changes`), {
            appearance: 'error',
            autoDismiss: true,
          });
          setErrors(error?.response?.data?.errors);
        });
    }
  };

  // Tabs
  const [currentTab, setCurrentTab] = useState('tab-1');

  // Media Logic
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteMedia = async (ObjectToDelete) => {
    setIsDeleting(true);
    // return;
    commonAPI
      .deleteMedia({
        uuid: ObjectToDelete.uuid,
      })
      .then(() => {
        setIsDeleting(false);
        // eslint-disable-next-line no-shadow
        setData((data) => ({
          ...data,
          about_us: {
            ...data.about_us,
            [ObjectToDelete.name]: null,
          },
        }));
      })
      .catch(() => {
        setIsDeleting(false);
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
  const saveButtonHandler = () => {
    updateInformation();
    updateAboutUs();
    // if (currentTab === 'tab-1') {
    //   return updateInformation();
    // }
    // return updateAboutUs();
  };

  /**
   * Return JSX
   */
  return (
    <>
      {/* MODAL COMPONENT */}
      <StandardModal
        title={t(`${translationPath}about-us`)}
        subtitle={t(`${translationPath}about-us-description`)}
        isOpen={props.isOpen}
        isLoading={isWorking || !data}
        onClose={props.closeModal}
        tabs={[t(`${translationPath}header`), t(`${translationPath}content`)]}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
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
        {/* TAB CONTENT */}
        {data && (
          <TabContent activeTab={currentTab}>
            <TabPane className="pt-4" key="tab-1" tabId="tab-1">
              <Row className="mb-4">
                <Col xs="12">
                  <Input
                    className="form-control-alternative"
                    type="text"
                    placeholder={t(`${translationPath}header-title`)}
                    value={data?.information?.section_title || ''}
                    onChange={(e) => {
                      const { value } = e.currentTarget;
                      // eslint-disable-next-line no-shadow
                      setData((data) => ({
                        ...data,
                        information: {
                          ...data.information,
                          section_title: value,
                        },
                      }));
                      setSaveButtonDisabled(false);
                      setSectionFlag(true);
                    }}
                  />
                  {errors
                    && errors?.section_title
                    && errors?.section_title.map((error, index) => (
                      <p key={index} className="mb-0 mt-1 text-xs text-danger">
                        {error}
                      </p>
                    ))}
                </Col>
              </Row>
              <Row className="mb-4">
                <Col xs="12">
                  <Input
                    className="form-control-alternative"
                    type="text"
                    placeholder={t(`${translationPath}header-description`)}
                    value={data.information?.section_description || ''}
                    onChange={(e) => {
                      const { value } = e.currentTarget;
                      // eslint-disable-next-line no-shadow
                      setData((data) => ({
                        ...data,
                        information: {
                          ...data.information,
                          section_description: value,
                        },
                      }));
                      setSaveButtonDisabled(false);
                      setSectionFlag(true);
                    }}
                  />
                  {errors
                    && errors?.section_description
                    && errors?.section_description.map((error, index) => (
                      <p key={index} className="mb-0 mt-1 text-xs text-danger">
                        {error}
                      </p>
                    ))}
                </Col>
              </Row>
            </TabPane>

            {/* Video Tab */}
            <TabPane className="pt-4" key="tab-2" tabId="tab-2">
              <Row>
                <Col lg="12">
                  <FormGroup>
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label className="form-control-label" htmlFor="mainDescription">
                      {t(`${translationPath}description`)}
                    </label>
                    <textarea
                      id="mainDescription"
                      className="form-control"
                      rows="3"
                      placeholder=""
                      name="mainDescription"
                      value={data.about_us?.description}
                      onChange={(e) => {
                        const { value } = e.currentTarget;
                        // eslint-disable-next-line no-shadow
                        setData((data) => ({
                          ...data,
                          about_us: {
                            ...data.about_us,
                            description: value,
                          },
                        }));
                        setSaveButtonDisabled(false);
                        setDescription(true);
                      }}
                    />
                    {errors && errors?.description ? (
                      <p className="mb-0 mt-1 text-xs text-danger">
                        {errors?.description?.[0]}
                      </p>
                    ) : null}
                  </FormGroup>
                </Col>
              </Row>
              <Row className="mb-4">
                <Col xs="6">
                  <label className="form-control-label" htmlFor="videoSource">
                    {t(`${translationPath}video-source`)}
                  </label>
                  <Input
                    id="videoSource"
                    className="form-control-alternative"
                    type="select"
                    value={data.about_us.marketing_video_type || 'default'}
                    onChange={(e) => {
                      const { value } = e.currentTarget;
                      setVideoType(value);
                      if (value === 'Youtube')
                        setIsValidUrl(matchYoutubeUrl(currentValue));
                      else if (value === 'Vimeo')
                        setIsValidUrl(matchVimeoUrl(currentValue));
                      else if (value === 'upload' || value === 'None')
                        setIsValidUrl(true);

                      // eslint-disable-next-line no-shadow
                      setData((data) => ({
                        ...data,
                        about_us: {
                          ...data.about_us,
                          marketing_video_type: value,
                        },
                      }));
                      setSaveButtonDisabled(false);
                    }}
                  >
                    <option value="default" aria-label="default option" disabled>
                      {t(`${translationPath}select-video-source`)}
                    </option>
                    {['Youtube', 'Vimeo', 'upload', 'None'].map((o, i) => (
                      <option key={i} value={o}>
                        {o}
                      </option>
                    ))}
                  </Input>
                </Col>
                {data.about_us.marketing_video_type !== 'upload' && (
                  <Col xs="6">
                    <label className="form-control-label" htmlFor="videoLink">
                      {t(`${translationPath}video-link`)}
                    </label>
                    <Input
                      id="videoLink"
                      className="form-control-alternative"
                      type="text"
                      disabled={data?.about_us?.marketing_video_type === 'None'}
                      placeholder={`Add a ${data.about_us.marketing_video_type} video URL`}
                      value={data.about_us.marketing_video}
                      onChange={(e) => {
                        const { value } = e.currentTarget;
                        setCurrentValue(value);
                        if (videoType === 'Youtube')
                          setIsValidUrl(matchYoutubeUrl(value));
                        else if (videoType === 'Vimeo')
                          setIsValidUrl(matchVimeoUrl(value));
                        else if (videoType === 'upload') setIsValidUrl(true);

                        // eslint-disable-next-line no-shadow
                        setData((data) => ({
                          ...data,
                          about_us: {
                            ...data.about_us,
                            marketing_video: value,
                          },
                        }));
                        setSaveButtonDisabled(false);
                      }}
                    />
                    <UrlValidationMessage
                      isValidUrl={isValidUrl}
                      currentValue={currentValue}
                      videoType={videoType}
                    />
                  </Col>
                )}
              </Row>
              {data.about_us.marketing_video_type === 'upload' && (
                <Row>
                  <Col xs="12">
                    <DropzoneWrapper
                      message={
                        <span>
                          <i className="fas fa-file-download fa-2x mr-2-reversed" />
                          <span>
                            {t(
                              `${translationPath}drag-and-drop-or-to-upload-an-video`,
                            )}
                          </span>
                        </span>
                      }
                      accept={'video/*'}
                      maxSize={1.5e8}
                      onDoneUploading={(newFile) => {
                        // eslint-disable-next-line no-shadow
                        setData((data) => ({
                          ...data,
                          about_us: {
                            ...data.about_us,
                            marketing_video: newFile.url,
                            marketing_video_type: 'upload',
                            video_uuid: {
                              uuid: newFile.uuid,
                              type: newFile.type,
                              media: newFile.url,
                            },
                          },
                        }));
                        setSaveButtonDisabled(false);
                      }}
                    >
                      {(data.about_us.video_uuid !== null
                        && data.about_us.video_uuid[0] !== undefined
                        && data.about_us.video_uuid.length > 0)
                        || (data.about_us.video_uuid !== null
                          && data.about_us.video_uuid.media && (
                          <>
                            <aside className="mt-2 position-relative">
                              <FilesPreview
                                file={{
                                  ...data.about_us.video_uuid,
                                  name: 'video_uuid',
                                }}
                                deleteMedia={deleteMedia}
                                isDeleting={isDeleting}
                              />
                            </aside>
                          </>
                        ))}
                    </DropzoneWrapper>
                  </Col>
                </Row>
              )}
            </TabPane>
          </TabContent>
        )}
      </StandardModal>
    </>
  );
};

export default AboutUsModal;
