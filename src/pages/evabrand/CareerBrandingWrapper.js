// React
import React, { useState, useEffect } from 'react';

// Redux
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  getContentLayoutOrder,
  updateContentLayoutOrder,
} from 'stores/actions/evabrandActions';

// Stylesheet
import 'assets/scss/elevatus/_evabrand.scss';

// Toast
import { ToastProvider } from 'react-toast-notifications';

// Loader
import { BoardsLoader } from 'shared/Loaders';

// Drag and drop capability
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

// Assets
import LogoImg from 'assets/images/career-branding/logo.png';
import HeaderImg from 'assets/images/career-branding/header.png';
import FooterImg from 'assets/images/career-branding/footer.png';
import OpeningsImg from 'assets/images/career-branding/openings.png';
import AboutImg from 'assets/images/career-branding/about.png';
import ClientsImg from 'assets/images/career-branding/clients.png';
import TeamImg from 'assets/images/career-branding/team.png';
import GalleryImg from 'assets/images/career-branding/gallery.png';
import TestImg from 'assets/images/career-branding/test.png';

// Sections and header
import { useTranslation } from 'react-i18next';
import DraggableSection from './DraggableSection';
import Section from './Section';
import HeaderBar from './HeaderBar';

// Modals
import NavModal from '../../components/Modals/NavModal';
import AboutUsModal from '../../components/Modals/AboutUsModal';
import HeaderModal from '../../components/Modals/HeaderModal';
import ClientsModal from '../../components/Modals/ClientsModal';
import FooterModal from '../../components/Modals/FooterModal';
import GalleryModal from '../../components/Modals/GalleryModal';
import TeamModal from '../../components/Modals/TeamModal';
import TestimonialModal from '../../components/Modals/TestimonialModal';
import RecentOpeningsModal from '../../components/Modals/RecentOpeningsModal';

// Context
import { CareerBrandingContext } from './CareerBrandingContext';
import { useTitle } from '../../hooks';
import TimelineHeader from '../../components/Elevatus/TimelineHeader';

const translationPath = '';
const parentTranslationPath = 'EvaBrand';

/**
 * A constructor that wraps the career branding components
 * @returns {JSX.Element}
 * @constructor
 */
const CareerBrandingWrapper = () => {
  const userLanguageId = JSON.parse(localStorage.getItem('user'))?.results
    ?.language[0].id;

  const { t } = useTranslation(parentTranslationPath);
  // Get Language
  const [language, setLanguage] = useState(userLanguageId || '');
  // use dispatch
  const dispatch = useDispatch();
  const { contentLayoutOrder } = useSelector(
    ({ evabrandReducer }) => evabrandReducer,
    shallowEqual,
  );

  // Set section state
  const [sections, setSections] = useState();
  // const [sectionData, setSectionData] = useState();

  useTitle(t(`${translationPath}eva-brand`));

  /**
   *  Get the data from API using the job UUID
   */
  useEffect(() => {
    dispatch(getContentLayoutOrder(language));
  }, []);

  // Order Logic
  useEffect(() => {
    // If sections is not null, do nothing
    // if (sections) return;

    /**
     * Constructor that gets the sections to be displayed
     * Uses the evabrandAPI to get
     *
     * @returns {Promise<void>}
     */
    // const isSubscribed = true;
    // Set sections state
    if (contentLayoutOrder)
      setSections({
        tasks: {
          position_list: {
            id: 'position_list',
            visible: contentLayoutOrder?.sections.filter(
              (s) => s.title === 'position_list',
            )[0].visible,
            imgSrc: OpeningsImg,
            editable: false,
            component: RecentOpeningsModal,
          },
          about_us: {
            id: 'about_us',
            visible: contentLayoutOrder?.sections.filter(
              (s) => s.title === 'about_us',
            )[0].visible,
            imgSrc: AboutImg,
            editable: true,
            component: AboutUsModal,
          },
          gallery: {
            id: 'gallery',
            visible: contentLayoutOrder?.sections.filter(
              (s) => s.title === 'gallery',
            )[0].visible,
            imgSrc: GalleryImg,
            editable: true,
            component: GalleryModal,
          },
          testimonial: {
            id: 'testimonial',
            visible: contentLayoutOrder?.sections.filter(
              (s) => s.title === 'testimonial',
            )[0].visible,
            imgSrc: TestImg,
            editable: true,
            component: TestimonialModal,
          },
          employee: {
            id: 'employee',
            visible: contentLayoutOrder?.sections.filter(
              (s) => s.title === 'employee',
            )[0].visible,
            imgSrc: TeamImg,
            editable: true,
            component: TeamModal,
          },
          client: {
            id: 'client',
            visible: contentLayoutOrder?.sections.filter(
              (s) => s.title === 'client',
            )[0].visible,
            imgSrc: ClientsImg,
            editable: true,
            component: ClientsModal,
          },
        },
        columns: {
          'column-1': {
            id: 'column-1',
            tasksIds: contentLayoutOrder?.sections
              .sort((a, b) => a.order - b.order)
              .map((o) => o.title),
          },
        },
        columnOrder: ['column-1'],
      });

    // .catch((err) => console.error(err));

    // return function cleanup() {
    //   isSubscribed = false;
    // };
  }, [contentLayoutOrder]);

  // Dragging states
  const [didOrderOnce, setDidOrderOnce] = useState(false);
  const [didToggleOnce, setDidToggleOnce] = useState(false);

  /**
   * Handler for when dragging
   * @param result
   */
  const onDragEnd = (result) => {
    // Temporary constructors
    const { destination, source, draggableId } = result;

    // If we drag outside; do nothing.
    if (!destination || result.reason === 'CANCEL') return;

    // If we drag to the same column, on the same index; do nothing.
    if (
      destination.droppableId === source.droppableId
      && destination.index === source.index
    )
      return;

    // Do Order Now
    const column = sections.columns[source.droppableId];
    const newTaskIds = Array.from(column.tasksIds);
    newTaskIds.splice(source.index, 1);
    newTaskIds.splice(destination.index, 0, draggableId);
    const newColumn = {
      ...column,
      tasksIds: newTaskIds,
    };
    setSections((sections) => ({
      ...sections,
      columns: { [newColumn.id]: newColumn },
    }));
    if (!didOrderOnce) setDidOrderOnce(true);
  };

  // Post new order to API
  useEffect(() => {
    // Cancel
    if (!sections || (!didOrderOnce && !didToggleOnce)) return;

    // Construct sectionData
    const sectionData = sections.columns['column-1'].tasksIds.map((t, i) => ({
      order: i + 1,
      title: t,
      visible: sections.tasks[t].visible,
    }));

    // Update section data
    dispatch(
      updateContentLayoutOrder({ language_id: language, sections: sectionData }),
    );

    // This will allow toggling again
    setDidToggleOnce(false);
    setDidOrderOnce(false);
  }, [didOrderOnce, didToggleOnce]);

  /**
   * Toggle the visibility of a section
   * @param idToToggle
   * @param currentState
   */
  const toggleVisibility = (idToToggle, currentState) => {
    if (!didToggleOnce) setDidToggleOnce(true);

    setSections({
      ...sections,
      tasks: {
        ...sections.tasks,
        [idToToggle]: { ...sections.tasks[idToToggle], visible: !currentState },
      },
    });
  };

  /**
   * Set a new language
   * @param newLanguageId
   */
  const setNewLanguage = (newLanguageId) => {
    dispatch(getContentLayoutOrder(newLanguageId));
    setLanguage(newLanguageId);
  };

  /**
   * Return JSX
   */
  return (
    <ToastProvider placement="top-center">
      <div id="main-cb-wrapper" className="py-4">
        {/* eslint-disable-next-line react/jsx-no-undef */}
        <CareerBrandingContext.Provider value={{ languageId: language }}>
          <HeaderBar setNewLanguage={setNewLanguage} />
        </CareerBrandingContext.Provider>
        {/* Sections */}
        {(!sections || !language) && <BoardsLoader style={{ width: '100%' }} />}
        {sections && language && (
          <CareerBrandingContext.Provider value={{ languageId: language }}>
            <div id="main-cb-wrapper-inner">
              <Section imgSrc={LogoImg} component={NavModal} noDrag />
              <Section imgSrc={HeaderImg} component={HeaderModal} noDrag />
              <DragDropContext onDragEnd={onDragEnd}>
                <div id="col-cb-wrapper" className="d-flex flex-column">
                  <Droppable droppableId="column-1">
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps}>
                        {sections.columns['column-1'].tasksIds
                          .map((taskId) => sections.tasks[taskId])
                          .map((task, i) => (
                            <DraggableSection
                              editable={task.editable}
                              draggableId={task.id}
                              index={i}
                              key={task.id}
                              imgSrc={task.imgSrc}
                              component={task.component}
                              task={task}
                              toggleVisibility={toggleVisibility}
                            />
                          ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </DragDropContext>
              <Section imgSrc={FooterImg} component={FooterModal} noDrag />
            </div>
          </CareerBrandingContext.Provider>
        )}
      </div>
      <TimelineHeader name="EVA-BRAND" />
    </ToastProvider>
  );
};
export default CareerBrandingWrapper;
