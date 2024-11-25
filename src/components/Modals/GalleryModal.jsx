// React and reactstrap
import React, { useContext, useEffect, useState } from 'react';
import { Col, Input, Row, TabContent, TabPane } from 'reactstrap';

// Toast notifications
import { useToasts } from 'react-toast-notifications';

// Styled components
import styled from 'styled-components';

// Drag and Drop
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

// Dropzone and filepreview
import FilesPreview from '../../shared/components/FilesPreview';
import DropzoneWrapperMulti from '../../shared/components/DropzoneWrapperMulti';

// Client component

// Modal components
import { StandardModal } from '../../components/Modals/StandardModal';
import { ModalButtons } from '../../components/Buttons/ModalButtons';

// API
import { evabrandAPI } from '../../api/evabrand';
import { commonAPI } from '../../api/common';

// Client
// import { evabrandContent } from 'assets/content/evabrandContent';
import Client from '../../pages/evabrand/Client';

// Content

// Context API
import { CareerBrandingContext } from '../../pages/evabrand/CareerBrandingContext';
import { useTranslation } from 'react-i18next';

const translationPath = '';
const parentTranslationPath = 'EvaBrand';

/**
 * Custom column div
 */
const Column = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 500px;
  padding-top: 1rem;
`;

/**
 * Custom item card
 */
const AddItemCard = styled.div`
  align-items: center;
  background: var(--bgprimary);
  border-radius: 3px;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);
  color: white;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  margin-bottom: 1.5rem;
  min-height: 100px;
  position: relative;
  width: 250px;
`;

/**
 * Gallery modal component, used to add a photo gallery on the portal.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const GalleryModal = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  // Toast notifications
  const { addToast } = useToasts();

  // Required Data
  const user = JSON.parse(localStorage.getItem('user'))?.results;
  const { languageId } = useContext(CareerBrandingContext);

  // Loading states
  const [isWorking, setIsWorking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingItem, setIsDeletingItem] = useState(false);

  // Get Data
  const [data, setData] = useState();
  const [information, setInformation] = useState();

  // Files (for uploading)
  const [file, setFile] = useState('');
  const [files, setFiles] = useState([]);
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);

  // Tabs
  const [currentTab, setCurrentTab] = useState('tab-1');

  // Error Messages State
  const [errorMessage, setErrorMessage] = useState(null);
  /**
   * Wrapper to set the 'data' state
   * @param newData
   */
  const setNewData = (newData) => {
    setData({
      tasks: {
        ...newData.reduce(
          (obj, c) => (
            (obj[c.pk_uuid] = {
              uuid: c.uuid,
              media: c.media,
              pk_uuid: c.pk_uuid,
            }),
            obj
          ),
          {},
        ),
      },
      columns: {
        'column-1': {
          id: 'column-1',
          tasksIds: newData.map((o) => o.pk_uuid),
        },
      },
      columnOrder: ['column-1'],
    });
  };

  /**
   * Effect to prepare and get data
   */
  useEffect(() => {
    if (data || !languageId) return;

    /**
     * Get data via API
     * @returns {Promise<void>}
     */
    const getData = async () => {
      evabrandAPI
        .getGallery(languageId)
        .then((res) => {
          const dataObject = res.data.results.gallery;
          setNewData(dataObject);
          setInformation(res.data.results.information);
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
     * Update data via API
     */
    evabrandAPI
      .updateGalleryInformation(languageId, information)
      .then(() => {
        setIsWorking(false);
        setIsSaving(false);
        addToast(t(`${translationPath}successfully-updated`), {
          appearance: 'success',
          autoDismiss: true,
        });
        setSaveButtonDisabled(true);
        setErrorMessage(null);
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
   * Wrapper to delete an item
   * @param idToDelete
   * @returns {Promise<void>}
   */
  const deleteItem = async (idToDelete) => {
    setIsDeletingItem(true);
    setIsWorking(true);

    /**
     * Delete item via API
     */
    evabrandAPI
      .deleteGallery(languageId, idToDelete)
      .then((res) => {
        const dataObject = res.data.results.gallery;
        setNewData(dataObject);
        setIsDeletingItem(false);
        setIsWorking(false);
        addToast(t(`${translationPath}successfully-deleted`), {
          appearance: 'success',
          autoDismiss: true,
        });
      })
      .catch(() => {
        setIsDeletingItem(false);
        setIsWorking(false);
        addToast(t(`${translationPath}error-in-deleting-image`), {
          appearance: 'error',
          autoDismiss: true,
        });
      });
  };

  // DnD Logic

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // If we drag outside; do nothing. ▼
    if (!destination || result.reason === 'CANCEL') return;

    // If we drag to the same column, on the same index; do nothing. ▼
    if (
      destination.droppableId === source.droppableId
      && destination.index === source.index
    )
      return;

    // Do Order Now ▼
    const column = data.columns[source.droppableId];
    const newTaskIds = Array.from(column.tasksIds);
    newTaskIds.splice(source.index, 1);
    newTaskIds.splice(destination.index, 0, draggableId);
    const newColumn = {
      ...column,
      tasksIds: newTaskIds,
    };
    setData((data) => ({
      ...data,
      columns: { [newColumn.id]: newColumn },
    }));
  };

  /**
   * Wrapper to add an item to the gallery
   * @returns {Promise<void>}
   */
  const doAddItem = async () => {
    setIsWorking(true);
    // eslint-disable-next-line no-unused-expressions,no-shadow
    files.length > 0
      && files.forEach((file) => {
        /**
         * Add item via API
         */
        evabrandAPI
          .addGallery(languageId, file)
          .then((res) => {
            const dataObject = res.data.results.gallery;
            setNewData(dataObject);
            setSaveButtonDisabled(true);
          })
          .catch(() => {
            setIsWorking(false);
            addToast(t(`${translationPath}error-in-adding-image`), {
              appearance: 'error',
              autoDismiss: true,
            });
          });
      });

    setIsWorking(false);
    addToast(t(`${translationPath}successfully-added`), {
      appearance: 'success',
      autoDismiss: true,
    });
    setCurrentTab('tab-2');
  };

  /**
   * Wrapper to delete media
   * @param ObjectToDelete
   * @param index
   * @returns {Promise<void>}
   */
  const deleteMedia = async (ObjectToDelete, index) => {
    setIsDeleting(true);
    setIsWorking(true);
    const tempFiles = files;

    /**
     * Delete media via API
     */
    commonAPI
      .deleteMedia({
        uuid: ObjectToDelete.uuid,
      })
      .then((res) => {
        setIsDeleting(false);
        setIsWorking(false);
        setFile('');
        setFiles(tempFiles.splice(index, 1));
      })
      .catch((err) => {
        setIsDeleting(false);
        setIsWorking(false);
      });
  };

  /**
   * Switches to the 3rd tab
   */
  const handleAdding = () => {
    setFiles([]);
    setCurrentTab('tab-3');
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
    // Validation on Header and SubHeader before send API Request
    if (!information.section_title || !information.section_description) {
      if (!information.section_title)
        setErrorMessage((errorMessage) => ({
          ...errorMessage,
          title: t(`${translationPath}header-field-is-required`),
        }));

      if (!information.section_description)
        setErrorMessage((errorMessage) => ({
          ...errorMessage,
          desc: t(`${translationPath}subheader-field-is-required`),
        }));

      return;
    }
    updateData();
    doAddItem();
  };

  /**
   * Render the component
   * @return {JSX.Element}
   */
  return (
    <React.Fragment>
      <StandardModal
        title={t(`${translationPath}gallery`)}
        subtitle={t(`${translationPath}gallery-subheader`)}
        isOpen={props.isOpen}
        isLoading={isWorking || !data}
        onClose={props.closeModal}
        tabs={[t(`${translationPath}header`), t(`${translationPath}images`)]}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        languageTag={user?.language.filter((l) => l.id === languageId)[0].title}
        buttons={
          <ModalButtons
            cancelButton
            cancelButtonHandler={cancelButtonHandler}
            saveButton
            saveButtonHandler={saveButtonHandler}
            saveButtonDisabled={saveButtonDisabled}
            isSaving={isSaving}
          />
        }
      >
        {/* Body */}
        {data && (
          <TabContent activeTab={currentTab}>
            {/* TAB 1 */}
            {information && (
              <TabPane className="pt-4" key="tab-1" tabId="tab-1">
                <Row className="mb-4">
                  <Col xs="12">
                    <Input
                      className="form-control-alternative"
                      type="text"
                      placeholder={t(`${translationPath}header-text`)}
                      value={information.section_title}
                      onChange={(e) => {
                        const { value } = e.currentTarget;
                        setInformation((information) => ({
                          ...information,
                          section_title: value,
                        }));
                        setSaveButtonDisabled(false);
                      }}
                    />
                    {errorMessage && errorMessage?.title?.length > 0 && (
                      <p className="mb-0 mt-1 text-xs text-danger">
                        {errorMessage?.title}
                      </p>
                    )}
                  </Col>
                </Row>
                <Row className="mb-4">
                  <Col xs="12">
                    <Input
                      className="form-control-alternative"
                      type="text"
                      placeholder={t(`${translationPath}subheader-text`)}
                      value={information.section_description}
                      onChange={(e) => {
                        const { value } = e.currentTarget;
                        setInformation((information) => ({
                          ...information,
                          section_description: value,
                        }));
                        setSaveButtonDisabled(false);
                      }}
                    />
                    {errorMessage && errorMessage?.desc?.length > 0 && (
                      <p className="mb-0 mt-1 text-xs text-danger">
                        {errorMessage?.desc}
                      </p>
                    )}
                  </Col>
                </Row>
              </TabPane>
            )}

            {/* TAB 2 */}
            <TabPane className="py-4" key="tab-2" tabId="tab-2">
              {/* DnD */}
              <DragDropContext onDragEnd={onDragEnd}>
                <div>
                  <Droppable droppableId="column-1">
                    {(provided) => (
                      <Column ref={provided.innerRef} {...provided.droppableProps}>
                        <Row>
                          {data.columns['column-1'].tasksIds
                            .map((taskId) => data.tasks[taskId])
                            .map((task, i) => (
                              <Col key={i} xl={4} xs={6}>
                                <Client
                                  draggableId={task.pk_uuid}
                                  index={i}
                                  key={task.pk_uuid}
                                  task={task}
                                  deleteItem={deleteItem}
                                  isDeleting={isDeletingItem}
                                />
                              </Col>
                            ))}
                        </Row>
                        {provided.placeholder}
                        <AddItemCard onClick={handleAdding}>
                          <div className="bg-white icon icon-shape shadow rounded-circle mb-2">
                            <i className="fa fa-plus fa-2x text-primary" />
                          </div>

                          <span>{t(`${translationPath}add-new-image`)}</span>
                        </AddItemCard>
                      </Column>
                    )}
                  </Droppable>
                </div>
              </DragDropContext>
            </TabPane>

            {/* TAB 3 */}
            <TabPane className="pt-4" tabId="tab-3">
              <React.Fragment>
                <Row className="mb-4">
                  <Col xs="12">
                    <DropzoneWrapperMulti
                      feature="career_portal"
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
                        setIsWorking(true);
                        // eslint-disable-next-line no-shadow
                        setFiles(
                          newFile.map((file) => ({
                            uuid: file.uuid,
                            type: file.type,
                            media: file.url,
                          })),
                        );
                        setIsWorking(false);
                        setSaveButtonDisabled(false);
                      }}
                    >
                      {files
                        && files.length > 0
                        // eslint-disable-next-line no-shadow
                        && files.map((file, index) => (
                          <React.Fragment key={index}>
                            <aside className="mt-2 position-relative">
                              <FilesPreview
                                file={{
                                  ...file,
                                  index,
                                }}
                                deleteMedia={deleteMedia}
                                isDeleting={isDeleting}
                              />
                            </aside>
                          </React.Fragment>
                        ))}
                    </DropzoneWrapperMulti>
                  </Col>
                </Row>
              </React.Fragment>
            </TabPane>
          </TabContent>
        )}
      </StandardModal>
    </React.Fragment>
  );
};

export default GalleryModal;
