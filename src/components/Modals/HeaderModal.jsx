// React and reactstrap
import React, { useContext, useEffect, useState } from 'react';
import { Col, Input, Row, TabContent, TabPane } from 'reactstrap';

// Toast notifications
import { useToasts } from 'react-toast-notifications';

// Styled components
import styled from 'styled-components';

// Drag and Drop
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

// Dropzone and File preview
import DropzoneWrapper from '../../shared/components/DropzoneWrapper';
import FilesPreview from '../../shared/components/FilesPreview';

// API
import { evabrandAPI } from '../../api/evabrand';
import { commonAPI } from '../../api/common';

// Modal
import { StandardModal } from '../../components/Modals/StandardModal';
import { ModalButtons } from '../../components/Buttons/ModalButtons';

// Perk component
import Perk from '../../pages/evabrand/Perk';

// Content
// import { evabrandContent } from 'assets/content/evabrandContent';

// Context API
import { useTranslation } from 'react-i18next';
import { CareerBrandingContext } from '../../pages/evabrand/CareerBrandingContext';

const translationPath = '';
const parentTranslationPath = 'EvaBrand';

/**
 * Icons array
 * @type {string[]}
 */
const IconsArray = [
  'fas fa-chart-line',
  'far fa-chart-bar',
  'fas fa-user-graduate',
  'fas fa-user',
  'fas fa-users',
  'fas fa-paw',
  'fas fa-money-bill-alt',
  'fas fa-futbol',
  'fas fa-plane',
  'fas fa-globe',
  'fas fa-coffee',
  'fas fa-file-medical',
  'fas fa-wheelchair',
  'fas fa-sitemap',
  'fas fa-birthday-cake',
  'fas fa-gift',
  'fas fa-utensils',
  'far fa-smile',
  'fas fa-user-tag',
  'fas fa-user-tie',
  'fas fa-user-shield',
  'fas fa-heart',
  'fas fa-check',
  'fas fa-hand-sparkles',
  'fas fa-child',
];

/**
 * Icons grid
 */
const IconsGrid = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(60px, 60px));
`;

/**
 * Box to contain the icons
 */
const IconBox = styled.div`
  align-items: center;
  border-color: #d7dcdb;
  border-radius: 8px;
  border-style: solid;
  border-width: 2px;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);
  cursor: pointer;
  display: flex;
  height: 60px;
  justify-content: center;
  width: 60px;
  & i {
    color: gray;
    font-size: 1.5rem;
  }
  &.active {
    border-color: var(--primary);
    & i {
      color: var(--primary);
      font-size: 2rem;
    }
  }
`;

/**
 * Columns div
 */
const Column = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 500px;
  padding-top: 1rem;
`;

/**
 * Add perk button div
 */
const AddPerk = styled.div`
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
 * The header modal below the navbar. This is where we set the perks.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const HeaderModal = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  // Toast notification
  const { addToast } = useToasts();

  // Required Data
  const user = JSON.parse(localStorage.getItem('user'))?.results;
  const { languageId } = useContext(CareerBrandingContext);

  // Loading states
  const [isWorking, setIsWorking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingPerk, setIsDeletingPerk] = useState(false);

  // Data
  const [appearance, setAppearance] = useState();
  const [data, setData] = useState();
  // Flag to handle data state, if updated.
  const [updateDataFlag, setUpdateDataFlag] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [icon, setIcon] = useState('');

  // Tabs

  const [currentTab, setCurrentTab] = useState('tab-1');

  // File state for uploads
  const [file, setFile] = useState();
  // Flag to handle File state, if updated.
  const [updateFileFlag, setUpdateFileFlag] = useState(false);
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);

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
        .getPerks(languageId)
        .then((res) => {
          const perks = res?.data?.results?.perk;
          setData({
            tasks: {
              ...perks.reduce(
                (obj, c) => (
                  (obj[c.uuid] = {
                    uuid: c.uuid,
                    icon: c.icon,
                    title: c.title,
                    desc: c.description,
                  }),
                  obj
                ),
                {},
              ),
            },
            columns: {
              'column-1': {
                id: 'column-1',
                tasksIds: perks.map((o) => o.uuid),
              },
            },
            columnOrder: ['column-1'],
            information: res.data.results.information,
          });
        })
        .catch(() => {
          addToast(t(`${translationPath}error-in-getting-data`), {
            appearance: 'error',
            autoDismiss: true,
          });
        });
    };
    getData();

    /**
     * Wrapper to get appearance section data
     * @returns {Promise<void>}
     */
    const getAppearance = async () => {
      /**
       * Get data via API
       */
      evabrandAPI
        .getAppearance(languageId)
        .then((res) => {
          const tempAppearance = res.data.results.appearance;

          setAppearance(tempAppearance);

          /**
           * We need to set the file equal to the video if it exists, otherwise, to the image
           */
          if (tempAppearance?.video_uuid?.uuid) setFile(tempAppearance?.video_uuid);
          else if (
            !tempAppearance?.hero_background_image_uuid.media.includes('blue.jpg')
          )
            setFile(tempAppearance?.hero_background_image_uuid);
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
  const updateData = async () => {
    if (updateFileFlag) {
      setIsWorking(true);
      setIsSaving(true);

      // Initialize empty variables
      let heroBackgroundImageUuid = null;
      let videoUuid = null;

      // Handle hero background image
      if (file?.type === 'image') {
        heroBackgroundImageUuid = file?.uuid;
        videoUuid = null;
      } else if (appearance?.hero_background_image_uuid?.uuid)
        heroBackgroundImageUuid = appearance?.hero_background_image_uuid;
      else heroBackgroundImageUuid = null;

      // Handle video
      if (file?.type === 'video') {
        videoUuid = file?.uuid;
        heroBackgroundImageUuid = null;
      } else if (appearance?.video_uuid?.uuid) videoUuid = appearance?.video_uuid;
      else videoUuid = null;

      const payload = {
        ...appearance,
        language_id: languageId,
        favicon_image_uuid: appearance?.favicon_image_uuid?.uuid || null,
        logo_uuid: appearance?.logo_uuid?.uuid || null,
        hero_background_image_uuid: heroBackgroundImageUuid,
        video_uuid: videoUuid,
      };

      /**
       * Update data via API
       */
      evabrandAPI
        .updateAppearance(languageId, payload)
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
      setUpdateFileFlag(false);
    }
    if (data && updateDataFlag) {
      setIsWorking(true);
      setIsSaving(true);

      /**
       * Update data via API
       */
      evabrandAPI
        .updatePerksInformation(languageId, data.information)
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
      setUpdateDataFlag(false);
    }
  };

  /**
   * Wrapper for deleting a perk
   * @param idToDelete
   * @returns {Promise<void>}
   */
  const deletePerk = async (idToDelete) => {
    setIsDeletingPerk(true);

    /**
     * Delete perk via API
     */
    evabrandAPI
      .deletePerks(languageId, idToDelete)
      .then((res) => {
        const perks = res.data.results.perk;
        setData({
          tasks: {
            ...perks.reduce(
              (obj, c) => (
                (obj[c.uuid] = {
                  uuid: c.uuid,
                  icon: c.icon,
                  title: c.title,
                  desc: c.description,
                }),
                obj
              ),
              {},
            ),
          },
          columns: {
            'column-1': {
              id: 'column-1',
              tasksIds: perks.map((o) => o.uuid),
            },
          },
          columnOrder: ['column-1'],
        });
        setIsDeletingPerk(false);
        addToast(t(`${translationPath}successfully-deleted`), {
          appearance: 'success',
          autoDismiss: true,
        });
      })
      .catch(() => {
        setIsDeletingPerk(false);
        addToast(t(`${translationPath}error-in-deleting-perk`), {
          appearance: 'error',
          autoDismiss: true,
        });
      });
  };

  /**
   * Wrapper to delete media
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
        if (ObjectToDelete?.type === 'video')
          setAppearance((items) => ({ ...items, video_uuid: null }));

        if (ObjectToDelete?.type === 'image')
          setAppearance((items) => ({ ...items, hero_background_image_uuid: null }));

        setFile(null);
        setSaveButtonDisabled(false);
        setUpdateFileFlag(true);
        setIsDeleting(false);
      })
      .catch(() => {
        setIsDeleting(false);
      });
  };

  // DnD Logic

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
   * Wrapper to add a perk
   * @returns {Promise<void>}
   */
  const doAddPerk = async () => {
    setIsWorking(true);
    setIsSaving(true);

    /**
     * Update perks via API
     */
    evabrandAPI
      .updatePerks(languageId, title, icon, desc)
      .then((res) => {
        setIsWorking(false);
        setIsSaving(false);
        const perks = res.data.results.perk;
        setData({
          tasks: {
            ...perks.reduce(
              (obj, c) => (
                (obj[c.uuid] = {
                  uuid: c.uuid,
                  icon: c.icon,
                  title: c.title,
                  desc: c.description,
                }),
                obj
              ),
              {},
            ),
          },
          columns: {
            'column-1': {
              id: 'column-1',
              tasksIds: perks.map((o) => o.uuid),
            },
          },
          columnOrder: ['column-1'],
        });
        addToast(t(`${translationPath}perk-successfully-added`), {
          appearance: 'success',
          autoDismiss: true,
        });
        setTitle('');
        setDesc('');
        setIcon('');
        setSaveButtonDisabled(true);
        setCurrentTab('tab-2');
      })
      .catch(() => {
        setIsWorking(false);
        setIsSaving(false);
        addToast(t(`${translationPath}error-in-adding-perk`), {
          appearance: 'error',
          autoDismiss: true,
        });
      });
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
    if (icon && title) doAddPerk();
  };

  /**
   * Render the component
   * @return {JSX.Element}
   */
  return (
    <>
      <StandardModal
        title={t(`${translationPath}background-appearance`)}
        subtitle={t(`${translationPath}background-appearance-description`)}
        isOpen={props.isOpen}
        isLoading={isWorking || !data}
        onClose={props.closeModal}
        tabs={[
          t(`${translationPath}background-header`),
          t(`${translationPath}perks-&-benefits`),
        ]}
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
        {/* Body */}
        {data && (
          <TabContent activeTab={currentTab}>
            {/* TAB 1 */}
            <TabPane className="pt-4" key="tab-1" tabId="tab-1">
              <Row className="mb-4">
                <Col xs="12">
                  <Input
                    className="form-control-alternative"
                    type="text"
                    placeholder={t(`${translationPath}header-text`)}
                    value={data.information?.section_title || ''}
                    onChange={(e) => {
                      const { value } = e.currentTarget;
                      setData((data) => ({
                        ...data,
                        information: {
                          ...data.information,
                          section_title: value,
                        },
                      }));
                      setSaveButtonDisabled(false);
                      setUpdateDataFlag(true);
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
                    value={data.information?.section_description || ''}
                    onChange={(e) => {
                      const { value } = e.currentTarget;
                      setData((data) => ({
                        ...data,
                        information: {
                          ...data.information,
                          section_description: value,
                        },
                      }));
                      setSaveButtonDisabled(false);
                      setUpdateDataFlag(true);
                    }}
                  />
                </Col>
              </Row>
              <Row className="mb-4">
                <Col xs="12">
                  <h3 className="mb-1">
                    {t(`${translationPath}background-image/video`)}
                  </h3>
                  <p className="font-12 pl-2-reversed">
                    {t(`${translationPath}maximum-size-70-MB`)}
                  </p>
                  <DropzoneWrapper
                    message={
                      <span>
                        <i className="fas fa-file-download fa-2x mr-2-reversed" />
                        <span>
                          {t(
                            `${translationPath}drag-and-drop-or-to-upload-an-image`,
                          )}
                        </span>
                      </span>
                    }
                    accept={'video/*, .jpg, .jpeg, .webp, .png'}
                    value={file}
                    maxSize={70_000_000} // 70 mb
                    onDoneUploading={(newFile) => {
                      setFile({
                        uuid: newFile.uuid,
                        type: newFile.type,
                        media: newFile.url,
                      });
                      setUpdateFileFlag(true);
                      setSaveButtonDisabled(false);
                    }}
                  >
                    {file && (
                      <>
                        <aside className="mt-2 position-relative">
                          <FilesPreview
                            file={{
                              ...file,
                              name: 'video_uuid',
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
            </TabPane>

            {/* TAB 2 */}
            <TabPane className="pt-4" key="tab-2" tabId="tab-2">
              {/* Perks DnD */}
              <DragDropContext onDragEnd={onDragEnd}>
                <div>
                  <Droppable droppableId="column-1" direction="horizontal">
                    {(provided) => (
                      <Column ref={provided.innerRef} {...provided.droppableProps}>
                        <Row>
                          {data.columns['column-1'].tasksIds
                            .map((taskId) => data.tasks[taskId])
                            .map((task, i) => (
                              <Col key={i} xl={4} xs={6}>
                                <Perk
                                  draggableId={task.uuid}
                                  index={i}
                                  key={task.uuid}
                                  task={task}
                                  deletePerk={deletePerk}
                                  isDeleting={isDeletingPerk}
                                />
                              </Col>
                            ))}

                          {provided.placeholder}
                          <Col xl={4} xs={6}>
                            <AddPerk onClick={handleAdding}>
                              <div className="bg-white icon icon-shape shadow rounded-circle mb-2">
                                <i className="fa fa-plus fa-2x text-primary" />
                              </div>

                              <span>{t(`${translationPath}add-perk`)}</span>
                            </AddPerk>
                          </Col>
                        </Row>
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
                  <Col xs="12">
                    <Input
                      className="form-control-alternative"
                      type="text"
                      placeholder="New Perk Title"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.currentTarget.value);
                        setSaveButtonDisabled(false);
                      }}
                    />
                  </Col>
                  <Col xs="12" className="mt-3">
                    <Input
                      className="form-control-alternative"
                      type="text"
                      placeholder="New Perk Description"
                      value={desc}
                      onChange={(e) => {
                        setDesc(e?.currentTarget?.value);
                        setSaveButtonDisabled(false);
                      }}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs="6">
                    <div className="form-control-alternative p-2">
                      <h4 className="pb-1 mb-2 border-bottom text-gray font-weight-normal">
                        Choose Perk Icon
                      </h4>

                      <IconsGrid>
                        {IconsArray.map((ic, i) => (
                          <IconBox
                            key={i}
                            className={`${ic === icon ? 'active' : ''}`}
                            onClick={() => {
                              setIcon(ic);
                              setSaveButtonDisabled(false);
                            }}
                          >
                            <i className={`${ic} `} />
                          </IconBox>
                        ))}
                      </IconsGrid>
                    </div>
                  </Col>
                  <Col
                    xs="6"
                    className="d-flex justify-content-center align-items-center flex-column"
                  >
                    {icon && (
                      <div className="icon icon-xxl icon-shape icon-shape-light shadow rounded-circle mb-2">
                        <i
                          className={`${icon} text-primary`}
                          style={{ fontSize: '3rem' }}
                        />
                      </div>
                    )}
                    {title && <span className="t-90p">{title}</span>}
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

export default HeaderModal;
