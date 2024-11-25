/* eslint-disable react/no-danger */
import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@mui/material/ButtonBase';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import {
  ImagesInputControl,
  ImagesTextEditorControl,
  ImagesUploaderControl,
} from './controls';
import './Images.Style.scss';
import { SystemActionsEnum } from '../../../../../../enums';
import { CollapseComponent } from '../../../../../../components';
import { GetReorderDraggedItems } from '../../../../helpers';
// tab that handles the images data
export const ImagesTab = ({
  state,
  onStateChanged,
  errors,
  isSubmitted,
  isAdvancedMode,
  isSlider,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [activeCollapse, setActiveCollapse] = useState(0);
  const imageItemRef = useRef({
    title: '',
    media: null,
    description: '',
  });
  /**
   * method to add or delete image item
   * @param type => 'increment', 'decrement'
   * @param index
   */
  const imageItemActionClicked = useCallback(
    (type, index) => () => {
      const localImages
        = (state
          && state.section_data
          && state.section_data.medias && [...state.section_data.medias])
        || [];
      if (type === 'increment') {
        localImages.splice(index + 1, 0, { ...imageItemRef.current });
        setActiveCollapse(localImages.length - 1);
      } else localImages.splice(index, 1);
      if (onStateChanged)
        onStateChanged({
          parentId: 'section_data',
          id: 'medias',
          value: [...localImages],
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
   * @Description this method is to reorder images items
   */
  const onDragEndHandler = (dropEvent) => {
    const reorderedItems = GetReorderDraggedItems(
      dropEvent,
      (state && state.section_data && state.section_data.medias) || [],
    );
    if (!reorderedItems) return;
    if (onStateChanged)
      onStateChanged({
        parentId: 'section_data',
        id: 'medias',
        value: [...reorderedItems],
      });
  };
  return (
    <div className="images-tab-wrapper tab-wrapper">
      {!state.section_data
        || !state.section_data.medias
        || (state.section_data.medias.length === 0 && (
          <div className="images-item-actions-wrapper">
            <ButtonBase
              className="btns theme-solid mx-0"
              onClick={imageItemActionClicked('increment', 0)}
            >
              <span className="fas fa-plus" />
              <span className="px-1">{t(`${translationPath}add-image`)}</span>
            </ButtonBase>
          </div>
        ))}
      <DragDropContext onDragEnd={onDragEndHandler}>
        <Droppable droppableId="imagesManagementDroppableId">
          {(droppableProvided) => (
            <div
              className="images-items-wrapper"
              {...droppableProvided.droppableProps}
              ref={droppableProvided.innerRef}
            >
              {state
                && state.section_data
                && state.section_data.medias
                && state.section_data.medias.map((item, index, items) => (
                  <Draggable
                    key={`imagesItemKey${index + 1}`}
                    draggableId={`imagesItemId${index + 1}`}
                    index={index}
                    isDragDisabled={items.length < 2}
                  >
                    {(provided, snapshot) => (
                      <div
                        className={`images-item-wrapper${
                          (isAdvancedMode && ' is-advanced-mode') || ''
                        }${(snapshot.isDragging && ' is-dragging') || ''}`}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                      >
                        <div className="item-contents-wrapper">
                          {items.length > 1 && (
                            <div className="images-actions-wrapper">
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
                                  <span>{t(`${translationPath}image`)}</span>
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
                                <div className="images-contents-wrapper">
                                  <div className="images-controls-wrapper">
                                    {!isAdvancedMode && (
                                      <ImagesInputControl
                                        editValue={item.title}
                                        onValueChanged={onStateChanged}
                                        isSubmitted={isSubmitted}
                                        stateKey="title"
                                        index={index}
                                        parentId="section_data"
                                        subParentId="medias"
                                        errors={errors}
                                        title="title"
                                        placeholder="title"
                                        parentTranslationPath={parentTranslationPath}
                                        translationPath={translationPath}
                                      />
                                    )}
                                    {isAdvancedMode && (
                                      <ImagesTextEditorControl
                                        idRef="ImagesItemTitleRef"
                                        editValue={item.title}
                                        onValueChanged={onStateChanged}
                                        isSubmitted={isSubmitted}
                                        stateKey="title"
                                        index={index}
                                        parentId="section_data"
                                        subParentId="medias"
                                        errors={errors}
                                        title="title"
                                        parentTranslationPath={parentTranslationPath}
                                        translationPath={translationPath}
                                      />
                                    )}
                                    <ImagesUploaderControl
                                      imageItem={item.media}
                                      onValueChanged={onStateChanged}
                                      isSubmitted={isSubmitted}
                                      urlStateKey="url"
                                      uuidStateKey="uuid"
                                      stateKey="media"
                                      index={index}
                                      parentId="section_data"
                                      subParentId="medias"
                                      errors={errors}
                                      labelValue="upload-image"
                                      isSlider={isSlider}
                                      parentTranslationPath={parentTranslationPath}
                                      translationPath={translationPath}
                                    />
                                    <ImagesTextEditorControl
                                      editValue={item.description}
                                      onValueChanged={onStateChanged}
                                      isSubmitted={isSubmitted}
                                      stateKey="description"
                                      parentId="section_data"
                                      subParentId="medias"
                                      index={index}
                                      errors={errors}
                                      title="description"
                                      parentTranslationPath={parentTranslationPath}
                                      translationPath={translationPath}
                                    />
                                  </div>
                                  {items.length > 1 && (
                                    <div className="images-actions-wrapper">
                                      <ButtonBase
                                        className="btns theme-shadow c-danger miw-32px ml-2-reversed mr-0-reversed"
                                        onClick={imageItemActionClicked(
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
        && state.section_data.medias
        && state.section_data.medias.length > 0 && (
        <div className="d-flex-v-center-h-end w-100 mb-3">
          <ButtonBase
            className="btns theme-solid miw-auto"
            onClick={imageItemActionClicked(
              'increment',
              state.section_data.medias.length,
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

ImagesTab.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  isAdvancedMode: PropTypes.bool.isRequired,
  isSlider: PropTypes.bool,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};
ImagesTab.defaultProps = {
  translationPath: 'ImagesTab.',
  isSlider: false,
};
