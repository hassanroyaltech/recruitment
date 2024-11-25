/**
 * ----------------------------------------------------------------------------------
 * @title TeamModal.jsx
 * ----------------------------------------------------------------------------------
 * @note When deleting an employee, data are being returned in a different format,
 * which is why the data are retrieved again from the API. They should be
 * standardized in the laravel backend.
 */

// React and reactstrap
import React, { useContext, useEffect, useState } from 'react';
import {
  Col,
  Input,
  InputGroup,
  InputGroupText,
  Row,
  TabContent,
  TabPane,
} from 'reactstrap';

// API
import axios from 'api/middleware';
import urls from 'api/urls';
import { generateHeaders } from 'api/headers';

// Toast notifications
import { useToasts } from 'react-toast-notifications';

// Styled components
import styled from 'styled-components';

// Drag and Drop
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

// Filespreview and dropzone
import FilesPreview from 'shared/components/FilesPreview';
import DropzoneWrapper from 'shared/components/DropzoneWrapper';

// Content
// import { evabrandContent } from 'assets/content/evabrandContent';

// Context API
import { useTranslation } from 'react-i18next';
import { CareerBrandingContext } from '../../pages/evabrand/CareerBrandingContext';

// Helpers
import { mutateTeams } from '../../utils/functions/mutators';

// Modal
import { StandardModal } from './StandardModal';
import { ModalButtons } from '../Buttons/ModalButtons';

// Team member component
import TeamMember from '../../pages/evabrand/TeamMember';

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
 * Styled item div
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
 * Team modal where we can add team members and their designation and descriptions
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const TeamModal = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  // Toast notifications
  const { addToast } = useToasts();

  // Required Data
  const user = JSON.parse(localStorage.getItem('user'))?.results;
  const { languageId } = useContext(CareerBrandingContext);

  // Loading states
  const [isWorking, setIsWorking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Tabs
  const [currentTab, setCurrentTab] = useState('tab-1');

  // Data states
  const [data, setData] = useState();
  const [information, setInformation] = useState();
  const [errors, setErrors] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingItem, setIsDeletingItem] = useState(false);

  // Fields
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');

  // Upload
  const [file, setFile] = useState({});
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);

  /**
   * Mutator
   * @param newData
   */
  const setNewData = (newData) => {
    setData(mutateTeams(newData));
  };

  /**
   * Get data via API
   * @returns {Promise<void>}
   */

  const getData = async () => {
    await axios
      .get(urls.evabrand.employee_GET, {
        params: {
          language_id: languageId,
        },
        headers: generateHeaders(),
      })
      .then((res) => {
        setNewData(res.data.results.employee);
        setInformation(res.data.results.information);
      })
      .catch((err) => {
        console.error(err);
        addToast(t(`${translationPath}error-in-getting-data`), {
          appearance: 'error',
          autoDismiss: true,
        });
      });
  };

  /**
   * Effect to prepare data
   */
  useEffect(() => {
    if (data || !languageId) return;
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
    await axios
      .put(
        urls.evabrand.information_employee,
        {
          ...information,
          language_id: languageId,
        },
        {
          headers: generateHeaders(),
        },
      )
      .then((res) => {
        setIsWorking(false);
        setIsSaving(false);
        if (currentTab === 'tab-1')
          addToast(t(`${translationPath}successfully-updated`), {
            appearance: 'success',
            autoDismiss: true,
          });
      })
      .catch((error) => {
        setIsWorking(false);
        setIsSaving(false);
        addToast(error?.response?.data?.message, {
          appearance: 'error',
          autoDismiss: true,
        });
        setErrors(error?.response?.data?.errors);
      });
  };

  /**
   * Wrapper for deleting items (employees)
   * @param idToDelete
   * @returns {Promise<void>}
   */
  const deleteItem = async (idToDelete) => {
    setIsDeletingItem(true);

    /**
     * Delete item via API
     */
    await axios
      .delete(urls.evabrand.employee_WRITE, {
        params: {
          uuid: idToDelete,
          language_id: languageId,
        },
        headers: generateHeaders(),
      })
      .then((response) => {
        setIsWorking(true);
        getData();
        setIsWorking(false);
        setIsDeletingItem(false);
        addToast(t(`${translationPath}successfully-deleted`), {
          appearance: 'success',
          autoDismiss: true,
        });
      })
      .catch(() => {
        setIsDeletingItem(false);
        addToast(t(`${translationPath}error-in-deleting-employee`), {
          appearance: 'error',
          autoDismiss: true,
        });
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
    setData((data) => ({
      ...data,
      columns: { [newColumn.id]: newColumn },
    }));
  };

  /**
   * Wrapper to add an employee item
   * @returns {Promise<void>}
   */
  const doAddItem = async () => {
    setIsWorking(true);
    setIsSaving(true);

    /**
     * Add item via API
     */
    await axios
      .put(
        urls.evabrand.employee_WRITE,
        {
          language_id: languageId,
          profile_image_uuid: file.uuid,
          employee_full_name: name,
          employee_position: position,
          twitter_url: twitter,
          facebook_url: facebook,
          linkedin_url: linkedin,
          github_url: github,
        },
        {
          headers: generateHeaders(),
        },
      )
      .then((res) => {
        setIsWorking(false);
        setIsSaving(false);
        setNewData(res.data.results.employee);
        addToast(t(`${translationPath}team-member-successfully-added`), {
          appearance: 'success',
          autoDismiss: true,
        });
        setFile({});
        setCurrentTab('tab-2');
        setSaveButtonDisabled(true);
      })
      .catch((error) => {
        setIsWorking(false);
        setIsSaving(false);
        setErrors(error?.response?.data?.errors);
      });
  };

  /**
   * Wrapper to delete a media object
   * @param ObjectToDelete
   * @returns {Promise<void>}
   */
  const deleteMedia = async (ObjectToDelete) => {
    setIsDeleting(true);

    /**
     * Delete via API
     */
    await axios
      .delete(urls.common.media, {
        params: {
          uuid: ObjectToDelete.uuid,
        },
        headers: generateHeaders(),
      })
      .then((res) => {
        setIsDeleting(false);
        setFile({});
      })
      .catch((err) => {
        setIsDeleting(false);
      });
  };

  const resolveUrl = (url) => {
    if (url.includes('https://')) return url;

    if (url.includes('http://')) return url;

    return `https://${url}`;
  };

  /**
   * Switches to the 3rd tab
   */
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
    if (name && position && file !== {}) {
      doAddItem();
      setName('');
      setPosition('');
      setFacebook('');
      setTwitter('');
      setLinkedin('');
      setGithub('');
    }

    updateData();
  };

  /**
   * Render the component
   * @return {JSX.Element}
   */
  return (
    <>
      <StandardModal
        title={t(`${translationPath}employees`)}
        subtitle={t(
          `${translationPath}show-the-people-who-are-behind-the-success-of-your-company-department`,
        )}
        className="modal-dialog-centered no-overflow-modal no-overflow-modal-content"
        isOpen={props.isOpen}
        isLoading={isWorking || !data}
        onClose={props.closeModal}
        tabs={[t(`${translationPath}header`), t(`${translationPath}team-members`)]}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        languageTag={user?.language.filter((l) => l.id === languageId)[0].title}
        buttons={
          <ModalButtons
            cancelButton
            cancelButtonHandler={cancelButtonHandler}
            saveButton
            saveButtonDisabled={
              currentTab === 'tab-3'
                ? !name || !position || saveButtonDisabled
                : saveButtonDisabled
            }
            saveButtonHandler={saveButtonHandler}
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
                      placeholder={t(`${translationPath}header-title`)}
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
                  </Col>
                </Row>
                <Row className="mb-4">
                  <Col xs="12">
                    <Input
                      className="form-control-alternative"
                      type="text"
                      placeholder={t(`${translationPath}subheader-title`)}
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
                  </Col>
                </Row>
              </TabPane>
            )}

            {/* TAB 2 */}
            <TabPane className="pt-4" key="tab-2" tabId="tab-2">
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
                                <TeamMember
                                  draggableId={task.uuid}
                                  index={i}
                                  key={task.uuid}
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
                          <span>{t(`${translationPath}add-team-member`)}</span>
                        </AddItemCard>
                      </Column>
                    )}
                  </Droppable>
                </div>
              </DragDropContext>
            </TabPane>

            {/* TAB 3 */}
            <TabPane className="pt-4" tabId="tab-3">
              <>
                <Row className="mb-4">
                  <Col xs="6">
                    <Input
                      className="form-control-alternative"
                      type="text"
                      placeholder={t(`${translationPath}employee-name`)}
                      value={name}
                      onChange={(e) => {
                        const { value } = e.currentTarget;
                        setName(value);
                      }}
                    />
                    {errors && errors.employee_full_name ? (
                      errors.employee_full_name.length > 1 ? (
                        errors.employee_full_name.map((error, index) => (
                          <p key={index} className="mb-0 mt-1 text-xs text-danger">
                            {error}
                          </p>
                        ))
                      ) : (
                        <p className="mb-0 mt-1 text-xs text-danger">
                          {errors.employee_full_name}
                        </p>
                      )
                    ) : (
                      ''
                    )}
                  </Col>
                  <Col xs="6">
                    <Input
                      className="form-control-alternative"
                      type="text"
                      placeholder={t(`${translationPath}employee-postion`)}
                      value={position}
                      onChange={(e) => {
                        const { value } = e.currentTarget;
                        setPosition(value);
                      }}
                    />
                    {errors && errors.employee_position ? (
                      errors.employee_position.length > 1 ? (
                        errors.employee_position.map((error, index) => (
                          <p key={index} className="mb-0 mt-1 text-xs text-danger">
                            {error}
                          </p>
                        ))
                      ) : (
                        <p className="mb-0 mt-1 text-xs text-danger">
                          {errors.employee_position}
                        </p>
                      )
                    ) : (
                      ''
                    )}
                  </Col>
                </Row>

                {/* Upload Photo Section */}
                <Row className="mb-4">
                  <Col xs="12">
                    <h3 className="mb-1">{t(`${translationPath}image`)}</h3>
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
                        setFile({
                          uuid: newFile.uuid,
                          type: newFile.type,
                          media: newFile.url,
                        });
                        setSaveButtonDisabled(false);
                      }}
                    >
                      {file && (
                        <>
                          <aside className="mt-2 position-relative">
                            <FilesPreview
                              file={{
                                ...file,
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

                {/* Input fields for social media urls */}
                <Row>
                  <Col xs="6" className="mb-2">
                    <InputGroup>
                      <InputGroup addonType="prepend">
                        <InputGroupText>
                          <i className="fab fa-facebook fa-2x" />
                        </InputGroupText>
                        <InputGroupText className="text-gray">
                          https://
                        </InputGroupText>
                      </InputGroup>
                      <Input
                        type="text"
                        // value={facebook}
                        placeholder="www.facebook.com/janedoe"
                        onChange={(e) => {
                          const { value } = e.currentTarget;
                          setFacebook(resolveUrl(value));
                        }}
                      />
                    </InputGroup>
                    {errors && errors.facebook_url ? (
                      errors.facebook_url.length > 1 ? (
                        errors.facebook_url.map((error, index) => (
                          <p key={index} className="mb-0 mt-1 text-xs text-danger">
                            {error}
                          </p>
                        ))
                      ) : (
                        <p className="mb-0 mt-1 text-xs text-danger">
                          {errors.facebook_url}
                        </p>
                      )
                    ) : (
                      ''
                    )}
                  </Col>
                  <Col xs="6" className="mb-2">
                    <InputGroup>
                      <InputGroup addonType="prepend">
                        <InputGroupText>
                          <i className="fab fa-twitter fa-2x" />
                        </InputGroupText>
                        <InputGroupText className="text-gray">
                          https://
                        </InputGroupText>
                      </InputGroup>
                      <Input
                        type="text"
                        // value={twitter}
                        placeholder="www.twitter.com/johndoe"
                        onChange={(e) => {
                          const { value } = e.currentTarget;
                          setTwitter(resolveUrl(value));
                        }}
                      />
                    </InputGroup>
                    {errors && errors.twitter_url ? (
                      errors.twitter_url.length > 1 ? (
                        errors.twitter_url.map((error, index) => (
                          <p key={index} className="mb-0 mt-1 text-xs text-danger">
                            {error}
                          </p>
                        ))
                      ) : (
                        <p className="mb-0 mt-1 text-xs text-danger">
                          {errors.twitter_url}
                        </p>
                      )
                    ) : (
                      ''
                    )}
                  </Col>
                </Row>

                <Row>
                  <Col xs="6" className="mb-2">
                    <InputGroup>
                      <InputGroup addonType="prepend">
                        <InputGroupText>
                          <i className="fab fa-linkedin fa-2x" />
                        </InputGroupText>
                        <InputGroupText className="text-gray">
                          https://
                        </InputGroupText>
                      </InputGroup>
                      <Input
                        type="text"
                        // value={linkedin}
                        placeholder="www.linkedin.com/in/johndoe"
                        onChange={(e) => {
                          const { value } = e.currentTarget;
                          setLinkedin(resolveUrl(value));
                        }}
                      />
                    </InputGroup>
                    {errors && errors.linkedin_url ? (
                      errors.linkedin_url.length > 1 ? (
                        errors.linkedin_url.map((error, index) => (
                          <p key={index} className="mb-0 mt-1 text-xs text-danger">
                            {error}
                          </p>
                        ))
                      ) : (
                        <p className="mb-0 mt-1 text-xs text-danger">
                          {errors.linkedin_url}
                        </p>
                      )
                    ) : (
                      ''
                    )}
                  </Col>
                  <Col xs="6" className="mb-2">
                    <InputGroup>
                      <InputGroup addonType="prepend">
                        <InputGroupText>
                          <i className="fab fa-github fa-2x" />
                        </InputGroupText>
                        <InputGroupText className="text-gray">
                          https://
                        </InputGroupText>
                      </InputGroup>
                      <Input
                        type="text"
                        // value={github}
                        placeholder="www.github.com/janedoe"
                        onChange={(e) => {
                          const { value } = e.currentTarget;
                          setGithub(resolveUrl(value));
                        }}
                      />
                    </InputGroup>
                    {errors && errors.github_url ? (
                      errors.github_url.length > 1 ? (
                        errors.github_url.map((error, index) => (
                          <p key={index} className="mb-0 mt-1 text-xs text-danger">
                            {error}
                          </p>
                        ))
                      ) : (
                        <p className="mb-0 mt-1 text-xs text-danger">
                          {errors.github_url}
                        </p>
                      )
                    ) : (
                      ''
                    )}
                  </Col>
                </Row>
              </>
            </TabPane>
          </TabContent>
        )}
      </StandardModal>
    </>
  );
};

export default TeamModal;
