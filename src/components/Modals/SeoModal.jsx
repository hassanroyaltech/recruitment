// React and reactstrap
import React, { useContext, useEffect, useState } from 'react';
import { Badge, Col, FormGroup, Input, Row } from 'reactstrap';

// Toast notifications
import { useToasts } from 'react-toast-notifications';

// Input
import CreatableSelect from 'react-select/creatable';

// Dropzone
import DropzoneWrapper from '../../shared/components/DropzoneWrapper';

// Filepreview
import FilesPreview from '../../shared/components/FilesPreview';

// API
import { evabrandAPI } from '../../api/evabrand';
import { commonAPI } from '../../api/common';

// Components for modal
import { ModalButtons } from '../../components/Buttons/ModalButtons';
import { StandardModal } from '../../components/Modals/StandardModal';

// Content
// import { evabrandContent } from 'assets/content/evabrandContent';

// Context API
import { useTranslation } from 'react-i18next';
import { CareerBrandingContext } from '../../pages/evabrand/CareerBrandingContext';

const translationPath = '';
const parentTranslationPath = 'EvaBrand';

/**
 * SEO Modal component, allows us to configure keywords, title, and an image for SEO.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const SeoModal = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  // Toast notifications
  const { addToast } = useToasts();

  // Required Data
  const { languageId } = useContext(CareerBrandingContext);
  const user = JSON.parse(localStorage.getItem('user'))?.results;
  const [data, setData] = useState();

  // Loading states
  const [isWorking, setIsWorking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);

  /**
   * Effect to prepare data
   */
  useEffect(() => {
    if (data || !languageId) return;

    /**
     * Get data via API
     * @returns {Promise<void>}
     */
    const getData = async () => {
      evabrandAPI
        .getSeo(languageId)
        .then((res) => {
          setData(res.data.results.seo_home_page);
        })
        .catch(() => {
          addToast(t(`${translationPath}error-in-getting-data`), {
            appearance: 'error',
            autoDismiss: true,
          });
        });
    };
    getData();
  }, [languageId]);

  /**
   * Wrapper to update data
   * @returns {Promise<void>}
   */
  const updateData = async () => {
    setIsWorking(true);
    setIsSaving(true);

    /**
     * Update via API
     */
    evabrandAPI
      .updateSeo(languageId, data)
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
   * Wrapper to delete an object
   * @param ObjectToDelete
   * @returns {Promise<void>}
   */
  const deleteMedia = async (ObjectToDelete) => {
    setIsDeleting(true);

    /**
     * Delete via API
     */
    commonAPI
      .deleteMedia({
        uuid: ObjectToDelete.uuid,
      })
      .then(() => {
        setIsDeleting(false);
        setData((data) => ({
          ...data,
          [ObjectToDelete.name]: null,
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
  const saveButtonHandler = () => updateData();

  /**
   * Render the component
   * @return {JSX.Element}
   */
  return (
    <>
      {/* MODAL COMPONENT */}
      <StandardModal
        title={t(`${translationPath}search-engine-optimization`)}
        subtitle={t(`${translationPath}search-engine-subtitle`)}
        isOpen={props.isOpen}
        isLoading={isWorking || !data}
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
        {/* MODAL BODY */}
        {data && (
          <div className="mt-5">
            <Row className="mb-4">
              <Col xs="12">
                <Input
                  className="form-control-alternative"
                  type="text"
                  placeholder={t(`${translationPath}website-title`)}
                  value={data.title}
                  onChange={(e) => {
                    const { value } = e.currentTarget;
                    setData((data) => ({ ...data, title: value }));
                    setSaveButtonDisabled(false);
                  }}
                />
              </Col>
            </Row>
            <Row className="mb-4">
              <Col xs="12">
                <textarea
                  className="form-control form-control-alternative"
                  rows="3"
                  placeholder={t(`${translationPath}website-description`)}
                  value={data.description}
                  onChange={(e) => {
                    const { value } = e.currentTarget;
                    setData((data) => ({ ...data, description: value }));
                    setSaveButtonDisabled(false);
                  }}
                />
              </Col>
            </Row>

            <Row className="mb-4">
              <Col xs="12">
                <FormGroup>
                  <label
                    className="form-control-label text-gray font-weight-400"
                    htmlFor="seoKeywords"
                  >
                    {t(`${translationPath}keywords`)}
                  </label>
                  <CreatableSelect
                    isMulti
                    name="seoKeywords"
                    isClearable={false}
                    noOptionsMessage={() => null}
                    formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
                    onChange={(newValues, a) => {
                      if (newValues === null)
                        setData((data) => ({
                          ...data,
                          keywords: null,
                        }));
                      else
                        setData((data) => ({
                          ...data,
                          keywords: newValues.map((k) => k.value).join(','),
                        }));

                      setSaveButtonDisabled(false);
                    }}
                    value={
                      data.keywords !== null
                        ? data.keywords.split(',').map((k) => ({
                          label: k,
                          value: k,
                        }))
                        : null
                    }
                    placeholder={t(`${translationPath}keywords`)}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col xs="12">
                <div className="d-flex align-items-center mb-2 ">
                  <h3 className="mb-0 mr-2-reversed">
                    {t(`${translationPath}upload-your-seo-image`)}
                  </h3>
                  <Badge size="sm" className="modal-badge text-lowercase">
                    .jpg, .jpeg, .webp, .png
                  </Badge>
                </div>
                <DropzoneWrapper
                  message={
                    <span>
                      <i className="fas fa-file-download fa-2x mr-2-reversed" />
                      <span>
                        {t(
                          `${translationPath}drag-and-drop-or-browse-to-upload-a-photo`,
                        )}
                      </span>
                    </span>
                  }
                  accept=".jpg, .jpeg, .webp, .png"
                  onDoneUploading={(newFile) => {
                    setData((data) => ({
                      ...data,
                      image_uuid: {
                        uuid: newFile.uuid,
                        type: newFile.type,
                        media: newFile.url,
                      },
                    }));
                    setSaveButtonDisabled(false);
                  }}
                >
                  {data.image_uuid && data.image_uuid.uuid && (
                    <>
                      <aside className="mt-2 position-relative">
                        <FilesPreview
                          style={{ height: '150px' }}
                          file={{ ...data.image_uuid, name: 'image_uuid' }}
                          deleteMedia={deleteMedia}
                          isDeleting={isDeleting}
                        />
                      </aside>
                    </>
                  )}
                </DropzoneWrapper>
              </Col>
            </Row>
          </div>
        )}
      </StandardModal>
    </>
  );
};

export default SeoModal;
