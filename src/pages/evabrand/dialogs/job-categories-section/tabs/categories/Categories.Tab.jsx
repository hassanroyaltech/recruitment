/* eslint-disable react/no-danger */
import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@mui/material/ButtonBase';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import {
  CategoriesInputControl,
  CategoriesTextEditorControl,
  CategoriesUploaderControl,
} from './controls';
import './Categories.Style.scss';
import { SystemActionsEnum } from '../../../../../../enums';
import { CollapseComponent } from '../../../../../../components';
import { GetReorderDraggedItems } from '../../../../helpers';
import { CategoriesAutocompleteControl } from './controls/CategoriesAutocomplete.Control';
// tab that handles the categories data
export const CategoriesTab = ({
  state,
  onStateChanged,
  errors,
  isSubmitted,
  isAdvancedMode,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [activeCollapse, setActiveCollapse] = useState(0);
  const categoryItemRef = useRef({
    title: '',
    media: null,
    job_category_uuid: '',
  });
  /**
   * method to add or delete category item
   * @param type => 'increment', 'decrement'
   * @param index
   */
  const categoryItemActionClicked = useCallback(
    (type, index) => () => {
      const localCategories
        = (state
          && state.section_data
          && state.section_data.categories && [...state.section_data.categories])
        || [];
      if (type === 'increment') {
        localCategories.splice(index + 1, 0, { ...categoryItemRef.current });
        setActiveCollapse(localCategories.length - 1);
      } else localCategories.splice(index, 1);
      if (onStateChanged)
        onStateChanged({
          parentId: 'section_data',
          id: 'categories',
          value: [...localCategories],
        });
    },
    [onStateChanged, state],
  );

  /**
   * @param index
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle collapse click
   */
  const onCollapseClicked = useCallback(
    (index) => () => {
      setActiveCollapse((item) => (item === index ? null : index));
    },
    [],
  );
  /**
   * @param dropEvent
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to reorder categories items
   */
  const onDragEndHandler = (dropEvent) => {
    const reorderedItems = GetReorderDraggedItems(
      dropEvent,
      (state && state.section_data && state.section_data.categories) || [],
    );
    if (!reorderedItems) return;
    if (onStateChanged)
      onStateChanged({
        parentId: 'section_data',
        id: 'categories',
        value: [...reorderedItems],
      });
  };
  return (
    <div className="categories-tab-wrapper tab-wrapper">
      {!state.section_data
        || !state.section_data.categories
        || (state.section_data.categories.length === 0 && (
          <div className="categories-item-actions-wrapper">
            <ButtonBase
              className="btns theme-solid mx-0"
              onClick={categoryItemActionClicked('increment', 0)}
            >
              <span className="fas fa-plus" />
              <span className="px-1">{t(`${translationPath}add-category`)}</span>
            </ButtonBase>
          </div>
        ))}
      <DragDropContext onDragEnd={onDragEndHandler}>
        <Droppable droppableId="categoriesManagementDroppableId">
          {(droppableProvided) => (
            <div
              className="categories-items-wrapper"
              {...droppableProvided.droppableProps}
              ref={droppableProvided.innerRef}
            >
              {state
                && state.section_data
                && state.section_data.categories
                && state.section_data.categories.map((item, index, items) => (
                  <Draggable
                    key={`categoriesItemKey${index + 1}`}
                    draggableId={`categoriesItemId${index + 1}`}
                    index={index}
                    isDragDisabled={items.length < 2}
                  >
                    {(provided, snapshot) => (
                      <div
                        className={`categories-item-wrapper${
                          (isAdvancedMode && ' is-advanced-mode') || ''
                        }${(snapshot.isDragging && ' is-dragging') || ''}`}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                      >
                        <div className="item-contents-wrapper">
                          {items.length > 1 && (
                            <div className="categories-actions-wrapper">
                              <div
                                className="dragging-btn"
                                {...provided.dragHandleProps}
                              >
                                <span className="fas fa-ellipsis-v" />
                                <span className="fas fa-ellipsis-v" />
                              </div>
                            </div>
                          )}
                          <div className="header-and-body-wrapper">
                            <ButtonBase
                              className={`header-menu-wrapper${
                                (activeCollapse === index && ' is-open-collapse')
                                || ''
                              }`}
                              onClick={onCollapseClicked(index)}
                            >
                              {(!item.title && (
                                <span className="header-text-x2">
                                  <span>{t(`${translationPath}category`)}</span>
                                  <span className="px-1">{index + 1}</span>
                                </span>
                              ))
                                || (isAdvancedMode && (
                                  <span
                                    dangerouslySetInnerHTML={{ __html: item.title }}
                                  />
                                )) || (
                                <span className="header-text-x2">
                                  {item.title}
                                </span>
                              )}
                            </ButtonBase>
                            <CollapseComponent
                              isOpen={activeCollapse === index || !isAdvancedMode}
                              component={
                                <div className="categories-contents-wrapper">
                                  <div className="categories-controls-wrapper">
                                    {!isAdvancedMode && (
                                      <CategoriesInputControl
                                        editValue={item.title}
                                        onValueChanged={onStateChanged}
                                        isSubmitted={isSubmitted}
                                        stateKey="title"
                                        index={index}
                                        parentId="section_data"
                                        subParentId="categories"
                                        errors={errors}
                                        title="title"
                                        placeholder="title"
                                        parentTranslationPath={parentTranslationPath}
                                        translationPath={translationPath}
                                      />
                                    )}
                                    {isAdvancedMode && (
                                      <CategoriesTextEditorControl
                                        idRef="CategoriesItemTitleRef"
                                        editValue={item.title}
                                        onValueChanged={onStateChanged}
                                        isSubmitted={isSubmitted}
                                        stateKey="title"
                                        index={index}
                                        parentId="section_data"
                                        subParentId="categories"
                                        errors={errors}
                                        title="title"
                                        parentTranslationPath={parentTranslationPath}
                                        translationPath={translationPath}
                                      />
                                    )}
                                    <CategoriesAutocompleteControl
                                      editValue={item.job_category_uuid}
                                      onValueChanged={onStateChanged}
                                      isSubmitted={isSubmitted}
                                      stateKey="job_category_uuid"
                                      parentId="section_data"
                                      subParentId="categories"
                                      index={index}
                                      errors={errors}
                                      title="job-category"
                                      placeholder="job-category"
                                      parentTranslationPath={parentTranslationPath}
                                      translationPath={translationPath}
                                    />
                                    <CategoriesUploaderControl
                                      mediaItem={item.media}
                                      onValueChanged={onStateChanged}
                                      isSubmitted={isSubmitted}
                                      urlStateKey="url"
                                      uuidStateKey="uuid"
                                      stateKey="media"
                                      index={index}
                                      parentId="section_data"
                                      subParentId="categories"
                                      errors={errors}
                                      labelValue="upload-image"
                                      parentTranslationPath={parentTranslationPath}
                                      translationPath={translationPath}
                                    />
                                  </div>
                                  {items.length > 1 && (
                                    <div className="categories-actions-wrapper">
                                      <ButtonBase
                                        className="btns theme-shadow c-danger miw-32px ml-2-reversed mr-0-reversed"
                                        onClick={categoryItemActionClicked(
                                          'decrement',
                                          index,
                                        )}
                                      >
                                        <span
                                          className={SystemActionsEnum.delete.icon}
                                        />
                                      </ButtonBase>
                                    </div>
                                  )}
                                </div>
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {state
        && state.section_data
        && state.section_data.categories
        && state.section_data.categories.length > 0 && (
        <div className="d-flex-v-center-h-end w-100 mb-3">
          <ButtonBase
            className="btns theme-solid miw-auto"
            onClick={categoryItemActionClicked(
              'increment',
              state.section_data.categories.length,
            )}
          >
            <span className="fas fa-plus" />
            <span className="px-1">{t('Shared:add')}</span>
          </ButtonBase>
        </div>
      )}
    </div>
  );
};

CategoriesTab.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  isAdvancedMode: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};
CategoriesTab.defaultProps = {
  translationPath: 'CategoriesTab.',
};
