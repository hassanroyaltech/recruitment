/* eslint-disable react/no-danger */
import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import ButtonBase from '@mui/material/ButtonBase';
import { useTranslation } from 'react-i18next';
import {
  GridInputControl,
  GridTextEditorControl,
  GridTypeAutocompleteControl,
  GridUploaderControl,
} from './controls';
import {
  EvaBrandGridMediaTypesEnum,
  SystemActionsEnum,
} from '../../../../../../enums';
import './Grids.Style.scss';
import { GridIconsControl } from './controls/GridIcons.Control';
import { GetReorderDraggedItems } from '../../../../helpers';
import { CollapseComponent } from '../../../../../../components';
// tab that handles the navigation menu data
export const GridsTab = ({
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
  const gridItemRef = useRef({
    title: '',
    sub_title: '',
    type: null,
    media: null,
    description: '',
  });
  /**
   * method to add or delete grid item
   * @param type => 'increment', 'decrement'
   * @param index
   */
  const gridItemActionClicked = useCallback(
    (type, index) => () => {
      const localGrids
        = (state
          && state.section_data
          && state.section_data.grids && [...state.section_data.grids])
        || [];
      if (type === 'increment') {
        localGrids.splice(index + 1, 0, { ...gridItemRef.current });
        setActiveCollapse(localGrids.length - 1);
      } else localGrids.splice(index, 1);
      if (onStateChanged)
        onStateChanged({
          parentId: 'section_data',
          id: 'grids',
          value: [...localGrids],
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
   * @Description this method is to reorder grids items
   */
  const onDragEndHandler = (dropEvent) => {
    const reorderedItems = GetReorderDraggedItems(
      dropEvent,
      (state && state.section_data && state.section_data.grids) || [],
    );
    if (!reorderedItems) return;
    if (onStateChanged)
      onStateChanged({
        parentId: 'section_data',
        id: 'grids',
        value: [...reorderedItems],
      });
  };
  return (
    <div className="grids-tab-wrapper tab-wrapper">
      {!state.section_data
        || !state.section_data.grids
        || (state.section_data.grids.length === 0 && (
          <div className="grids-item-actions-wrapper">
            <ButtonBase
              className="btns theme-solid mx-0"
              onClick={gridItemActionClicked('increment', 0)}
            >
              <span className="fas fa-plus" />
              <span className="px-1">{t(`${translationPath}add-grid`)}</span>
            </ButtonBase>
          </div>
        ))}
      <DragDropContext onDragEnd={onDragEndHandler}>
        <Droppable droppableId="gridsManagementDroppableId">
          {(droppableProvided) => (
            <div
              className="grids-items-wrapper"
              {...droppableProvided.droppableProps}
              ref={droppableProvided.innerRef}
            >
              {state
                && state.section_data
                && state.section_data.grids
                && state.section_data.grids.map((item, index, items) => (
                  <Draggable
                    key={`gridsItemKey${index + 1}`}
                    draggableId={`gridsItemId${index + 1}`}
                    index={index}
                    isDragDisabled={items.length < 2}
                  >
                    {(provided, snapshot) => (
                      <div
                        className={`grids-item-wrapper${
                          (isAdvancedMode && ' is-advanced-mode') || ''
                        }${(snapshot.isDragging && ' is-dragging') || ''}`}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                      >
                        <div className="item-contents-wrapper">
                          {items.length > 1 && (
                            <div className="grids-actions-wrapper">
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
                                  <span>{t(`${translationPath}grid`)}</span>
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
                              isOpen={activeCollapse === index}
                              component={
                                <div className="grids-contents-wrapper">
                                  <div className="grids-controls-wrapper">
                                    {!isAdvancedMode && (
                                      <GridInputControl
                                        idRef="GridInputTitleRef"
                                        editValue={item.title}
                                        onValueChanged={onStateChanged}
                                        isSubmitted={isSubmitted}
                                        stateKey="title"
                                        index={index}
                                        parentId="section_data"
                                        subParentId="grids"
                                        errors={errors}
                                        title="grid-title"
                                        placeholder="grid-title"
                                        parentTranslationPath={parentTranslationPath}
                                        translationPath={translationPath}
                                      />
                                    )}
                                    {!isAdvancedMode && (
                                      <GridInputControl
                                        idRef="GridInputSubtitleRef"
                                        editValue={item.sub_title}
                                        onValueChanged={onStateChanged}
                                        isSubmitted={isSubmitted}
                                        stateKey="sub_title"
                                        index={index}
                                        parentId="section_data"
                                        subParentId="grids"
                                        errors={errors}
                                        title="grid-subtitle"
                                        placeholder="grid-subtitle"
                                        parentTranslationPath={parentTranslationPath}
                                        translationPath={translationPath}
                                      />
                                    )}
                                    {isAdvancedMode && (
                                      <GridTextEditorControl
                                        idRef="GridItemTitleRef"
                                        editValue={item.title}
                                        onValueChanged={onStateChanged}
                                        isSubmitted={isSubmitted}
                                        stateKey="title"
                                        parentId="section_data"
                                        subParentId="grids"
                                        index={index}
                                        errors={errors}
                                        title="grid-title"
                                        parentTranslationPath={parentTranslationPath}
                                        translationPath={translationPath}
                                      />
                                    )}
                                    {isAdvancedMode && (
                                      <GridTextEditorControl
                                        idRef="GridItemSubtitleRef"
                                        editValue={item.sub_title}
                                        onValueChanged={onStateChanged}
                                        isSubmitted={isSubmitted}
                                        stateKey="sub_title"
                                        parentId="section_data"
                                        subParentId="grids"
                                        index={index}
                                        errors={errors}
                                        title="grid-subtitle"
                                        parentTranslationPath={parentTranslationPath}
                                        translationPath={translationPath}
                                      />
                                    )}
                                    <GridTextEditorControl
                                      editValue={item.description}
                                      onValueChanged={onStateChanged}
                                      isSubmitted={isSubmitted}
                                      stateKey="description"
                                      parentId="section_data"
                                      subParentId="grids"
                                      index={index}
                                      errors={errors}
                                      title="grid-description"
                                      parentTranslationPath={parentTranslationPath}
                                      translationPath={translationPath}
                                    />
                                    <GridTypeAutocompleteControl
                                      gridItem={item}
                                      editValue={item.type}
                                      onValueChanged={onStateChanged}
                                      isSubmitted={isSubmitted}
                                      stateKey="type"
                                      index={index}
                                      parentId="section_data"
                                      subParentId="grids"
                                      errors={errors}
                                      title="grid-media-type"
                                      placeholder="select-grid-media-type"
                                      parentTranslationPath={parentTranslationPath}
                                      translationPath={translationPath}
                                    />
                                    {item.type
                                      === EvaBrandGridMediaTypesEnum.Icon.key && (
                                      <GridIconsControl
                                        gridItem={item}
                                        editValue={
                                          (item.media && item.media.url)
                                          || item.media
                                          || ''
                                        }
                                        onValueChanged={onStateChanged}
                                        isSubmitted={isSubmitted}
                                        stateKey="media"
                                        index={index}
                                        parentId="section_data"
                                        subParentId="grids"
                                        errors={errors}
                                        // title="grid-icon"
                                        // placeholder="select-grid-icon"
                                        // parentTranslationPath={parentTranslationPath}
                                        // translationPath={translationPath}
                                      />
                                    )}
                                    {item.type
                                      === EvaBrandGridMediaTypesEnum.Image.key && (
                                      <GridUploaderControl
                                        gridItem={item}
                                        mediaItem={item.media}
                                        onValueChanged={onStateChanged}
                                        isSubmitted={isSubmitted}
                                        urlStateKey="url"
                                        uuidStateKey="uuid"
                                        index={index}
                                        parentId="section_data"
                                        subParentId="grids"
                                        stateKey="media"
                                        errors={errors}
                                        labelValue="upload-grid-image"
                                        parentTranslationPath={parentTranslationPath}
                                        translationPath={translationPath}
                                      />
                                    )}
                                  </div>
                                  {items.length > 1 && (
                                    <div className="grids-actions-wrapper">
                                      <ButtonBase
                                        className="btns theme-shadow c-danger miw-32px ml-2-reversed mr-0-reversed"
                                        onClick={gridItemActionClicked(
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
        && state.section_data.grids
        && state.section_data.grids.length > 0 && (
        <div className="d-flex-v-center-h-end w-100 mb-3">
          <ButtonBase
            className="btns theme-solid miw-auto"
            onClick={gridItemActionClicked(
              'increment',
              state.section_data.grids.length,
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

GridsTab.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  isAdvancedMode: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};
GridsTab.defaultProps = {
  translationPath: 'GridsTab.',
};
