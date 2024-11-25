// React and reactstrap
import React, { useContext, useEffect, useState } from 'react';
import { Col, Input, Row, TabContent, TabPane } from 'reactstrap';

// Toasts
import { useToasts } from 'react-toast-notifications';

// Styled components
import styled from 'styled-components';

// Drag and Drop
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

// Redux
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  getTestimonials,
  updateTestimonialsInformation,
} from '../../stores/actions/evabrandActions';

// Filepreview and dropzone
import FilesPreview from '../../shared/components/FilesPreview';
import DropzoneWrapper from '../../shared/components/DropzoneWrapper';

// API
import { commonAPI } from '../../api/common';
import { evabrandAPI } from '../../api/evabrand';
// Testimonial component
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { useTranslation } from 'react-i18next';
import Testimonial from '../../pages/evabrand/Testimonial';

// Context api
import { CareerBrandingContext } from '../../pages/evabrand/CareerBrandingContext';

// Modal
import { StandardModal } from './StandardModal';
import { ModalButtons } from '../Buttons/ModalButtons';

const translationPath = '';
const parentTranslationPath = 'EvaBrand';

// File preview

// Dropzone

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
 * Testimonial Modal component
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const TestimonialModal = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  // use dispatch
  const dispatch = useDispatch();
  const { testimonials, isWorking, isSaving, isDeleting } = useSelector(
    ({ evabrandReducer }) => evabrandReducer,
    shallowEqual,
  );

  // Toast notifications
  const { addToast } = useToasts();

  // Required Data
  const user = JSON.parse(localStorage.getItem('user'))?.results;
  const { languageId } = useContext(CareerBrandingContext);

  // Set states for item deletion
  const [isDeletingItem, setIsDeletingItem] = useState(false);

  // Get Data
  const [data, setData] = useState();
  const [information, setInformation] = useState();

  // Tabs
  const [currentTab, setCurrentTab] = useState('tab-1');

  // Testomonial state
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [description, setDescription] = useState('');
  const [shape, setShape] = useState('transform');

  // File uploading
  const [file, setFile] = useState({});
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);

  // Errors state
  const [errors, setErrors] = useState([]);
  // Track Changes on headers tab
  const [headersFlag, setHeadersFlag] = useState(false);

  /**
   *  Get the data from API using the language UUID
   */
  useEffect(() => {
    if (data || !languageId) return;
    dispatch(getTestimonials(languageId)).then(() => {
      setData(testimonials?.mutation);
      setInformation(testimonials?.api?.information);
    });
  }, [testimonials]);

  /**
   * Wrapper to update the data
   * @returns {Promise<void>}
   */
  const updateData = async () => {
    dispatch(updateTestimonialsInformation(languageId, information))
      .then(() => {
        // setData(testimonials?.mutation);
        // setInformation(testimonials?.api?.information);
        addToast(t(`${translationPath}successfully-updated`), {
          appearance: 'success',
          autoDismiss: true,
        });
        setSaveButtonDisabled(true);
        setHeadersFlag(false);
      })
      .catch(() => {
        addToast(t(`${translationPath}error-in-updating-your-changes`), {
          appearance: 'error',
          autoDismiss: true,
        });
      });
  };

  /**
   * Delete an item
   * @param idToDelete
   */
  const deleteItem = async (idToDelete) => {
    setIsDeletingItem(true);
    // Changed dispatch to evabrand, because it does not handle catch case.
    evabrandAPI
      .deleteTestimonials(languageId, idToDelete)
      .then(() => {
        updateData();
        setData(testimonials?.mutation);
        addToast(t(`${translationPath}successfully-deleted`), {
          appearance: 'success',
          autoDismiss: true,
        });
        setIsDeletingItem(false);
      })
      .catch(() => {
        setIsDeletingItem(false);
        addToast(t(`${translationPath}error-in-deleting-image`), {
          appearance: 'error',
          autoDismiss: true,
        });
      });
  };

  /**
   * Drag and Drop logic
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
    const column = testimonials.mutation.columns[source.droppableId];
    // const column = data.columns[source.droppableId];
    const newTaskIds = Array.from(column.tasksIds);
    newTaskIds.splice(source.index, 1);
    newTaskIds.splice(destination.index, 0, draggableId);
    const newColumn = {
      ...column,
      tasksIds: newTaskIds,
    };
    setData({
      ...testimonials.mutation,
      columns: { [newColumn.id]: newColumn },
    });
  };

  /**
   * Add a new testimonial constructor
   */
  const doAddItem = async () => {
    /**
     * Update testimonial through dispatched API
     */
    // Changed dispatch to evabrand, because it does not handle catch case.
    // if (file && name && position && description) {
    evabrandAPI
      .updateTestimonials(languageId, {
        profile_image_uuid: file.uuid,
        employee_full_name: name,
        employee_job_title: position,
        description,
        shape: shape === 'transform',
      })
      .then((res) => {
        addToast(t(`${translationPath}testimonial-successfully-added`), {
          appearance: 'success',
          autoDismiss: true,
        });

        setCurrentTab('tab-2');
        setFile('');
        setName('');
        setPosition('');
        setDescription('');
        setShape('');
        setSaveButtonDisabled(true);
        updateData();
      })
      .catch((error) => {
        setErrors(error?.response?.data?.errors);
        addToast(t(`${translationPath}add-testimonial-failed`), {
          appearance: 'error',
          autoDismissTimeout: 7000,
          autoDismiss: true,
        });
      });
    // }
    // setCurrentTab('tab-2');
  };

  /**
   * Wrapper to delete media
   * @param ObjectToDelete
   * @returns {Promise<void>}
   */
  const deleteMedia = async (ObjectToDelete) => {
    // setIsDeleting(true);

    /**
     * Delete media via API
     */
    commonAPI
      .deleteMedia({
        uuid: ObjectToDelete.uuid,
      })
      .then(() => {
        // setIsDeleting(false);
        setFile('');
      })
      .catch(() => {
        // setIsDeleting(false);
      });
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
    // File !== {} not the correct way to check if obj is empty
    if (Object.keys(file).length !== 0) doAddItem();

    if (headersFlag) updateData();
  };

  /**
   * Render the component
   * @return {JSX.Element}
   */
  return (
    <>
      <StandardModal
        title={t(`${translationPath}testimonials`)}
        subtitle={t(`${translationPath}testimonials-subtitle`)}
        isOpen={props.isOpen}
        isLoading={isWorking || !data}
        onClose={props.closeModal}
        tabs={[t(`${translationPath}header`), t(`${translationPath}reviews`)]}
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
                        setHeadersFlag(true);
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
                        setInformation((information) => ({
                          ...information,
                          section_description: value,
                        }));
                        setSaveButtonDisabled(false);
                        setHeadersFlag(true);
                      }}
                    />
                  </Col>
                </Row>
              </TabPane>
            )}

            <TabPane className="pt-4" key="tab-2" tabId="tab-2">
              {/* Perks DnD */}
              <DragDropContext onDragEnd={onDragEnd}>
                <div>
                  <Droppable droppableId="column-1">
                    {(provided) => (
                      <Column ref={provided.innerRef} {...provided.droppableProps}>
                        <Row>
                          {testimonials?.mutation.columns['column-1'].tasksIds
                            .map((taskId) => testimonials?.mutation.tasks[taskId])
                            .map((task, i) => (
                              <Col key={i} xl={4} xs={6}>
                                <Testimonial
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

                          <span>{t(`${translationPath}add-testimonial`)}</span>
                        </AddItemCard>
                      </Column>
                    )}
                  </Droppable>
                </div>
              </DragDropContext>
            </TabPane>
            <TabPane className="pt-4" tabId="tab-3">
              <>
                <Row className="mb-4">
                  <Col xs="6">
                    <Input
                      className="form-control-alternative"
                      type="text"
                      placeholder={t(`${translationPath}name`)}
                      value={name}
                      onChange={(e) => {
                        const { value } = e.currentTarget;
                        setName(value);
                        // setSaveButtonDisabled(false);
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
                      placeholder={t(`${translationPath}position`)}
                      value={position}
                      onChange={(e) => {
                        const { value } = e.currentTarget;
                        setPosition(value);
                        // setSaveButtonDisabled(false);
                      }}
                    />
                    {errors && errors.employee_job_title ? (
                      errors.employee_job_title.length > 1 ? (
                        errors.employee_job_title.map((error, index) => (
                          <p key={index} className="mb-0 mt-1 text-xs text-danger">
                            {error}
                          </p>
                        ))
                      ) : (
                        <p className="mb-0 mt-1 text-xs text-danger">
                          {errors.employee_job_title}
                        </p>
                      )
                    ) : (
                      ''
                    )}
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col xs="12">
                    <h3 className="mb-1">{t(`${translationPath}photo`)}</h3>
                    <DropzoneWrapper
                      message={
                        <span>
                          <i className="fas fa-file-download fa-2x mr-2-reversed" />
                          <span>
                            {t(
                              `${translationPath}drag-and-drop-or-browse-to-upload-an-image`,
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

                <Row>
                  <Col xs="12">
                    <textarea
                      className="form-control form-control-alternative"
                      rows="3"
                      placeholder={t(`${translationPath}testimonial-description`)}
                      value={description}
                      onChange={(e) => {
                        const { value } = e.currentTarget;
                        setDescription(value);
                        // setSaveButtonDisabled(false);
                      }}
                    />
                    {errors && errors.description ? (
                      errors.description.length > 1 ? (
                        errors.description.map((error, index) => (
                          <p key={index} className="mb-0 mt-1 text-xs text-danger">
                            {error}
                          </p>
                        ))
                      ) : (
                        <p className="mb-0 mt-1 text-xs text-danger">
                          {errors.description}
                        </p>
                      )
                    ) : (
                      ''
                    )}
                  </Col>
                </Row>
                <Row className="mb-1 px-3 mt-3">
                  <Col xs="6" className="mt-2">
                    <div className="h6 font-weight-normal">
                      {t(
                        `${translationPath}testimonial-image-layout-without-transformation`,
                      )}
                    </div>
                  </Col>
                  <Col xs="6" className="mt-2">
                    <RadioGroup
                      aria-label="transparentHeader"
                      name="transparentHeaderRadio"
                      onChange={(e) => {
                        setShape(e?.target?.value);
                        setSaveButtonDisabled(false);
                      }}
                    >
                      <div className="d-flex ">
                        <FormControlLabel
                          checked={shape === 'transform'}
                          value="transform"
                          control={<Radio color="primary" />}
                          label="Yes"
                        />
                        <FormControlLabel
                          checked={shape === 'noTransform'}
                          value="noTransform"
                          control={<Radio color="primary" />}
                          label="No"
                        />
                      </div>
                    </RadioGroup>
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

export default TestimonialModal;
