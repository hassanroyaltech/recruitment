// React and reactstrap
import React, { useContext, useEffect, useState } from 'react';
import { Col, Input, Row, TabContent, TabPane } from 'reactstrap';

// Toast notifications
import { useToasts } from 'react-toast-notifications';

// Styled components
import styled from 'styled-components';

// Drag and Drop
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

// Dropzone
import DropzoneWrapperMulti from 'shared/components/DropzoneWrapperMulti';

// File preview
import FilesPreview from 'shared/components/FilesPreview';

// API
import axios from 'api/middleware';
import urls from 'api/urls';
import { generateHeaders } from 'api/headers';
import { evabrandAPI } from 'api/evabrand';

// Modal components
import { StandardModal } from 'components/Modals/StandardModal';
import { ModalButtons } from 'components/Buttons/ModalButtons';

// helpers
// import { returnTrue, returnFalse } from 'utils/functions/helpers';

// Context API
import { CareerBrandingContext } from '../../pages/evabrand/CareerBrandingContext';

// Shared component
import Client from '../../pages/evabrand/Client';
import { useTranslation } from 'react-i18next';

const translationPath = '';
const parentTranslationPath = 'EvaBrand';

/**
 * Styled column div
 */
const Column = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 500px;
  padding-top: 1rem;
`;

/**
 * Styled item card div
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
 * ClientsModal component where companies can list their existing clients and
 * upload their logos
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const ClientsModal = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  // Toasts
  const { addToast } = useToasts();

  // Required Data
  const user = JSON.parse(localStorage.getItem('user'))?.results;
  const { languageId } = useContext(CareerBrandingContext);

  // Loading states
  const [isWorking, setIsWorking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingItem, setIsDeletingItem] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get Data
  const [data, setData] = useState();
  const [initialInformation, setInitialInformation] = useState();
  const [information, setInformation] = useState();

  // Set file state (for uploading)
  const [files, setFiles] = useState([]);

  // Tabs states
  const [currentTab, setCurrentTab] = useState('tab-1');
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);

  /**
   * Setter for the 'data' state
   * @param newData
   */
  const setNewData = (newData) => {
    setIsWorking(true);
    setData({
      tasks: {
        ...newData.reduce(
          // eslint-disable-next-line no-return-assign
          (obj, c) =>
            (
              // eslint-disable-next-line no-param-reassign
              (obj[c.pk_uuid] = {
                uuid: c.uuid,
                media: c.media,
                pk_uuid: c.pk_uuid,
                // eslint-disable-next-line no-sequences
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
    setIsWorking(false);
  };

  /**
   * Prepare data
   */
  useEffect(() => {
    if (data || !languageId) return;

    /**
     * Get data from API
     * @returns {Promise<void>}
     */
    const getData = async () => {
      evabrandAPI
        .getClients(languageId)
        .then((res) => {
          const clients = res.data?.results.client;
          setNewData(clients);
          setInformation(res.data?.results.information);
          setInitialInformation(res.data?.results.information);
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
      .updateClientsInformation(languageId, information)
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
   * Wrapper to delete an item
   * @param idToDelete
   * @returns {Promise<void>}
   */
  const deleteItem = async (idToDelete) => {
    setIsDeletingItem(true);

    /**
     * Delete item via API
     */
    evabrandAPI
      .deleteClients(languageId, idToDelete)
      .then((res) => {
        const clients = res.data.results.client;
        setNewData(clients);
        setIsDeletingItem(false);
        addToast(t(`${translationPath}successfully-deleted`), {
          appearance: 'success',
          autoDismiss: true,
        });
      })
      .catch(() => {
        setIsDeletingItem(false);
        addToast(t(`${translationPath}error-in-deleting-image`), {
          appearance: 'error',
          autoDismiss: true,
        });
      });
  };

  const doAddItem = async () => {
    setIsWorking(true);
    // eslint-disable-next-line no-unused-expressions,no-shadow,array-callback-return
    files.length > 0
      && files.map((file, index) => {
        evabrandAPI
          .addClient(languageId, file)
          .then((res) => {
            const clients = res.data.results.client;
            setNewData(clients);
            setSaveButtonDisabled(true);
          })
          .catch(() => {
            setIsWorking(false);
            addToast(t(`${translationPath}error-in-adding-client`), {
              appearance: 'error',
              autoDismiss: true,
            });
          });
      });
    addToast(t(`${translationPath}client-successfully-added`), {
      appearance: 'success',
      autoDismiss: true,
    });
    setFiles([]);
    setIsWorking(false);
    setCurrentTab('tab-2');
  };

  /**
   * Delete object
   * @param ObjectToDelete
   * @returns {Promise<void>}
   */
  const deleteMedia = async (ObjectToDelete) => {
    setIsDeleting(true);
    await axios
      .delete(urls.common.media, {
        params: {
          uuid: ObjectToDelete.uuid,
        },
        headers: generateHeaders(),
      })
      .then((res) => {
        setIsDeleting(false);
        setFiles([]);
      })
      .catch((err) => {
        setIsDeleting(false);
        console.error(err.response);
      });
  };

  /**
   * Drag and drop logic
   * @param result
   */
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
    // eslint-disable-next-line no-shadow
    setData((data) => ({
      ...data,
      columns: { [newColumn.id]: newColumn },
    }));
  };

  // Add Form Logic
  const handleAdding = () => {
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
    updateData();

    if (files.length > 0) doAddItem();
  };

  return (
    <React.Fragment>
      {/* MODAL COMPONENT */}
      <StandardModal
        title={t(`${translationPath}clients`)}
        subtitle={t(
          `${translationPath}showcase-your-happy-clients-and-partners-and-upload-their-logos`,
        )}
        isOpen={props.isOpen}
        isLoading={isWorking || !data}
        onClose={props.closeModal}
        tabs={[t(`${translationPath}header`), t(`${translationPath}clients-logos`)]}
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
        {/* TABS */}
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
                        // eslint-disable-next-line no-shadow
                        setInformation((information) => ({
                          ...information,
                          section_title: value,
                        }));
                        setSaveButtonDisabled(false);
                      }}
                    />
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
                        // eslint-disable-next-line no-shadow
                        setInformation((information) => ({
                          ...information,
                          section_description: value,
                        }));
                        setSaveButtonDisabled(false);
                      }}
                    />
                  </Col>
                </Row>
              </TabPane>
            )}

            {/* TAB 2 */}
            <TabPane className="pt-4" key="tab-2" tabId="tab-2">
              {/* Perks DnD */}
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

                          <span>{t(`${translationPath}add-logo`)}</span>
                        </AddItemCard>
                      </Column>
                    )}
                  </Droppable>
                </div>
              </DragDropContext>
            </TabPane>

            {/* THIRD TAB (THIS SHOULD BE OOP) */}
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

export default ClientsModal;
