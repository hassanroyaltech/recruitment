/* eslint-disable react/no-danger */
import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@mui/material/ButtonBase';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import {
  StoriesInputControl,
  StoriesTextEditorControl,
  StoriesUploaderControl,
} from './controls';
import './Stories.Style.scss';
import { SystemActionsEnum } from '../../../../../../enums';
import { CollapseComponent, SwitchComponent } from '../../../../../../components';
import { GetReorderDraggedItems } from '../../../../helpers';
// tab that handles the stories items
export const StoriesTab = ({
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
  const storyItemRef = useRef({
    title: '',
    subtitle: '',
    description: '',
    isExternalUrl: false,
    media: null,
  });
  /**
   * method to add or delete story item
   * @param type => 'increment', 'decrement'
   * @param index
   */
  const storyItemActionClicked = useCallback(
    (type, index) => () => {
      const localStories
        = (state
          && state.section_data
          && state.section_data.stories && [...state.section_data.stories])
        || [];
      if (type === 'increment') {
        localStories.splice(index + 1, 0, { ...storyItemRef.current });
        setActiveCollapse(localStories.length - 1);
      } else localStories.splice(index, 1);
      if (onStateChanged)
        onStateChanged({
          parentId: 'section_data',
          id: 'stories',
          value: [...localStories],
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
   * @Description this method is to reorder stories items
   */
  const onDragEndHandler = (dropEvent) => {
    const reorderedItems = GetReorderDraggedItems(
      dropEvent,
      (state && state.section_data && state.section_data.stories) || [],
    );
    if (!reorderedItems) return;
    if (onStateChanged)
      onStateChanged({
        parentId: 'section_data',
        id: 'stories',
        value: [...reorderedItems],
      });
  };
  return (
    <div className="stories-tab-wrapper tab-wrapper">
      {!state.section_data
        || !state.section_data.stories
        || (state.section_data.stories.length === 0 && (
          <div className="stories-item-actions-wrapper">
            <ButtonBase
              className="btns theme-solid mx-0"
              onClick={storyItemActionClicked('increment', 0)}
            >
              <span className="fas fa-plus" />
              <span className="px-1">{t(`${translationPath}add-story`)}</span>
            </ButtonBase>
          </div>
        ))}
      <DragDropContext onDragEnd={onDragEndHandler}>
        <Droppable droppableId="storiesManagementDroppableId">
          {(droppableProvided) => (
            <div
              className="stories-items-wrapper"
              {...droppableProvided.droppableProps}
              ref={droppableProvided.innerRef}
            >
              {state
                && state.section_data
                && state.section_data.stories
                && state.section_data.stories.map((item, index, items) => (
                  <Draggable
                    key={`storiesItemKey${index + 1}`}
                    draggableId={`storiesItemId${index + 1}`}
                    index={index}
                    isDragDisabled={items.length < 2}
                  >
                    {(provided, snapshot) => (
                      <div
                        className={`stories-item-wrapper${
                          (isAdvancedMode && ' is-advanced-mode') || ''
                        }${(snapshot.isDragging && ' is-dragging') || ''}`}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                      >
                        <div className="item-contents-wrapper">
                          {items.length > 1 && (
                            <div className="stories-actions-wrapper">
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
                                  <span>{t(`${translationPath}story`)}</span>
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
                                <div className="stories-contents-wrapper">
                                  <div className="stories-controls-wrapper">
                                    {!isAdvancedMode && (
                                      <StoriesInputControl
                                        idRef="StoriesInputItemTitleRef"
                                        editValue={item.title}
                                        onValueChanged={onStateChanged}
                                        isSubmitted={isSubmitted}
                                        stateKey="title"
                                        index={index}
                                        parentId="section_data"
                                        subParentId="stories"
                                        errors={errors}
                                        title="story-title"
                                        placeholder="story-title"
                                        parentTranslationPath={parentTranslationPath}
                                        translationPath={translationPath}
                                      />
                                    )}
                                    {!isAdvancedMode && (
                                      <StoriesInputControl
                                        idRef="StoriesItemSubtitleRef"
                                        editValue={item.subtitle}
                                        onValueChanged={onStateChanged}
                                        isSubmitted={isSubmitted}
                                        stateKey="subtitle"
                                        index={index}
                                        parentId="section_data"
                                        subParentId="stories"
                                        errors={errors}
                                        title="story-subtitle"
                                        placeholder="story-subtitle"
                                        parentTranslationPath={parentTranslationPath}
                                        translationPath={translationPath}
                                      />
                                    )}
                                    {isAdvancedMode && (
                                      <StoriesTextEditorControl
                                        idRef="StoriesItemTitleRef"
                                        editValue={item.title}
                                        onValueChanged={onStateChanged}
                                        isSubmitted={isSubmitted}
                                        stateKey="title"
                                        index={index}
                                        parentId="section_data"
                                        subParentId="stories"
                                        errors={errors}
                                        title="story-title"
                                        parentTranslationPath={parentTranslationPath}
                                        translationPath={translationPath}
                                      />
                                    )}
                                    {isAdvancedMode && (
                                      <StoriesTextEditorControl
                                        idRef="StoriesItemSubtitleRef"
                                        editValue={item.subtitle}
                                        onValueChanged={onStateChanged}
                                        isSubmitted={isSubmitted}
                                        stateKey="subtitle"
                                        parentId="section_data"
                                        subParentId="stories"
                                        index={index}
                                        errors={errors}
                                        title="story-subtitle"
                                        parentTranslationPath={parentTranslationPath}
                                        translationPath={translationPath}
                                      />
                                    )}
                                    <StoriesTextEditorControl
                                      editValue={item.description}
                                      onValueChanged={onStateChanged}
                                      isSubmitted={isSubmitted}
                                      stateKey="description"
                                      parentId="section_data"
                                      subParentId="stories"
                                      index={index}
                                      errors={errors}
                                      title="story-description"
                                      parentTranslationPath={parentTranslationPath}
                                      translationPath={translationPath}
                                    />
                                    {item.isExternalUrl && (
                                      <StoriesInputControl
                                        idRef="externalLinkInputRef"
                                        isMediaInput
                                        editValue={
                                          (item.media && item.media.url) || ''
                                        }
                                        onValueChanged={onStateChanged}
                                        isSubmitted={isSubmitted}
                                        parentId="section_data"
                                        subParentId="stories"
                                        stateKey="media"
                                        index={index}
                                        errors={errors}
                                        title="youtube-link"
                                        placeholder="youtube-link-example"
                                        parentTranslationPath={parentTranslationPath}
                                        translationPath={translationPath}
                                      />
                                    )}
                                    {!item.isExternalUrl && (
                                      <StoriesUploaderControl
                                        mediaItem={item.media}
                                        onValueChanged={onStateChanged}
                                        isSubmitted={isSubmitted}
                                        urlStateKey="url"
                                        uuidStateKey="uuid"
                                        typeStateKey="type"
                                        index={index}
                                        parentId="section_data"
                                        subParentId="stories"
                                        stateKey="media"
                                        errors={errors}
                                        labelValue="upload-story-media"
                                        parentTranslationPath={parentTranslationPath}
                                        translationPath={translationPath}
                                      />
                                    )}
                                    <div className="switch-controls-wrapper control-wrapper w-100">
                                      <SwitchComponent
                                        idRef="youtubeLinkSwitchRef"
                                        label="youtube-link"
                                        isChecked={item.isExternalUrl || false}
                                        isReversedLabel
                                        isFlexEnd
                                        onChange={(event, newValue) => {
                                          onStateChanged({
                                            parentId: 'section_data',
                                            subParentId: 'stories',
                                            index,
                                            id: 'isExternalUrl',
                                            value: newValue,
                                          });
                                          onStateChanged({
                                            parentId: 'section_data',
                                            subParentId: 'stories',
                                            index,
                                            id: 'media',
                                            value: null,
                                          });
                                        }}
                                        parentTranslationPath={parentTranslationPath}
                                        translationPath={translationPath}
                                      />
                                    </div>
                                  </div>
                                  {items.length > 1 && (
                                    <div className="stories-actions-wrapper">
                                      <ButtonBase
                                        className="btns theme-shadow c-danger miw-32px ml-2-reversed mr-0-reversed"
                                        onClick={storyItemActionClicked(
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
        && state.section_data.stories
        && state.section_data.stories.length > 0 && (
        <div className="d-flex-v-center-h-end w-100 mb-3">
          <ButtonBase
            className="btns theme-solid miw-auto"
            onClick={storyItemActionClicked(
              'increment',
              state.section_data.stories.length,
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

StoriesTab.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  isAdvancedMode: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};
StoriesTab.defaultProps = {
  translationPath: 'StoriesTab.',
};
