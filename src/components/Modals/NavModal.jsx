import React, { useContext, useEffect, useState } from 'react';
import { useToasts } from 'react-toast-notifications';
// Share Components
import { Badge, Col, Row } from 'reactstrap';
import DropzoneWrapper from 'shared/components/DropzoneWrapper';
import FilesPreview from 'shared/components/FilesPreview';
import { evabrandContent } from 'assets/content/evabrandContent';
import { useTranslation } from 'react-i18next';
import { CareerBrandingContext } from '../../pages/evabrand/CareerBrandingContext';
import { evabrandAPI } from '../../api/evabrand';
import { commonAPI } from '../../api/common';
import { StandardModal } from './StandardModal';
import { ModalButtons } from '../Buttons/ModalButtons';

const translationPath = '';
const parentTranslationPath = 'EvaBrand';

// Content

// Forms Validation

const NavModal = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  // use dispatch
  // const dispatch = useDispatch();
  // const { appearance }  = useSelector(
  //   ({ evabrandReducer }) => evabrandReducer,
  //   shallowEqual,
  // );

  // Toast notifications
  const { addToast } = useToasts();

  // Required Data
  const user = JSON.parse(localStorage.getItem('user'))?.results;
  const { languageId } = useContext(CareerBrandingContext);

  // Loading states
  const [isWorking, setIsWorking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Data state
  const [appearance, setAppearance] = useState();
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);

  /**
   *  Get the data from API using the job UUID
  //  */
  // useEffect(() => {
  //   dispatch(getAppearance());
  // }, []);
  /**
   * Effect to prepare the data
   */
  useEffect(() => {
    if (appearance || !languageId) return;

    // setAppearance(appearance);
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
      })
      .then((res) => {
        setIsWorking(false);
        setIsSaving(false);
        addToast(t(`${translationPath}successfully-updated`), {
          appearance: 'success',
          autoDismiss: true,
        });
        setSaveButtonDisabled(true);
      })
      .catch((err) => {
        setIsWorking(false);
        setIsSaving(false);
        addToast(t(`${translationPath}error-in-updating-your-changes`), {
          appearance: 'error',
          autoDismiss: true,
        });
      });
  };

  /**
   * Wrapper to delete media objects
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
        setAppearance((appearance) => ({
          ...appearance,
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
  const saveButtonHandler = () => updateAppearance();

  /**
   * Return the component
   * @return {JSX.Element}
   */
  return (
    <>
      {/* MODAL COMPONENT */}
      <StandardModal
        title={t(`${evabrandContent.navModal.modalTitle}`)}
        subtitle={t(`${translationPath}subtitle`)}
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
        {appearance && (
          <div className="modal-body px-5">
            <Row className="mb-4">
              <Col xs="12">
                <div className="d-flex align-items-center mb-2 ">
                  <h3 className="mb-0 mr-2-reversed">
                    {t(`${translationPath}upload-logo`)}
                  </h3>
                  <Badge size="sm" className="modal-badge text-lowercase">
                    .jpg, .jpeg, .webp, .png
                  </Badge>
                </div>
                <h6 className="h6 text-gray">
                  {t(`${translationPath}upload-subtitle`)}
                </h6>
                <DropzoneWrapper
                  message={
                    <span>
                      <i className="fas fa-file-download fa-2x mr-2-reversed" />
                      <span>
                        {t(
                          `${translationPath}drag-and-drop-or-browse-to-upload-your-logo`,
                        )}
                      </span>
                    </span>
                  }
                  accept=".jpg, .jpeg, .webp, .png"
                  onDoneUploading={(newFile) => {
                    setAppearance((appearance) => ({
                      ...appearance,
                      logo_uuid: {
                        uuid: newFile.uuid,
                        type: newFile.type,
                        media: newFile.url,
                      },
                    }));
                    setSaveButtonDisabled(false);
                  }}
                >
                  {appearance.logo_uuid && (
                    <>
                      <aside className="mt-2 position-relative">
                        <FilesPreview
                          style={{ height: '150px' }}
                          file={{ ...appearance.logo_uuid, name: 'logo_uuid' }}
                          deleteMedia={deleteMedia}
                          isDeleting={isDeleting}
                        />
                      </aside>
                    </>
                  )}
                </DropzoneWrapper>
              </Col>
            </Row>

            <Row>
              <Col xs="12">
                <div className="d-flex align-items-center mb-2 ">
                  <h3 className="mb-0 mr-2-reversed">
                    {t(`${translationPath}upload-favicon`)}
                  </h3>
                  <Badge size="sm" className="modal-badge text-lowercase">
                    .jpg, .jpeg, .webp, .png
                  </Badge>
                </div>
                <h6 className="h6 text-gray">
                  {t(`${translationPath}upload-favicon-description`)}
                </h6>
                <DropzoneWrapper
                  message={
                    <span>
                      <i className="fas fa-file-download fa-2x mr-2-reversed" />
                      <span>
                        {t(
                          `${translationPath}drag-and-drop-or-to-upload-your-favicon`,
                        )}
                      </span>
                    </span>
                  }
                  accept=".jpg, .jpeg, .webp, .png"
                  onDoneUploading={(newFile) => {
                    setAppearance((appearance) => ({
                      ...appearance,
                      favicon_image_uuid: {
                        uuid: newFile.uuid,
                        type: newFile.type,
                        media: newFile.url,
                      },
                    }));
                    setSaveButtonDisabled(false);
                  }}
                >
                  {appearance.favicon_image_uuid && (
                    <>
                      <aside className="mt-2 position-relative">
                        <FilesPreview
                          style={{ height: '150px' }}
                          file={{
                            ...appearance.favicon_image_uuid,
                            name: 'favicon_image_uuid',
                          }}
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
      {/* </Modal> */}
    </>
  );
};

export default NavModal;
