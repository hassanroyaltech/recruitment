/* eslint-disable react/no-danger */
import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import {
  MediasInputControl,
  MediasTextEditorControl,
  MediasUploaderControl,
} from './controls';
import './MediaAndTextMedias.Style.scss';
import { SystemActionsEnum } from '../../../../../../enums';
import { GetReorderDraggedItems } from '../../../../helpers';
import { CollapseComponent, SwitchComponent } from '../../../../../../components';

// tab to handle media adding
export const MediaAndTextMediasTab = ({
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
  const mediasItemRef = useRef({
    description: '',
    isExternalUrl: false,
    media: null,
  });
  /**
   * method to add or delete medias item
   * @param type => 'increment', 'decrement'
   * @param index
   */
  const mediaItemActionClicked = useCallback(
    (type, index) => () => {
      const localMedias
        = (state
          && state.section_data
          && state.section_data.medias && [...state.section_data.medias])
        || [];
      if (type === 'increment') {
        localMedias.splice(index + 1, 0, { ...mediasItemRef.current });
        setActiveCollapse(localMedias.length - 1);
      } else localMedias.splice(index, 1);
      if (onStateChanged)
        onStateChanged({
          parentId: 'section_data',
          id: 'medias',
          value: [...localMedias],
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
    <div className="medias-tab-wrapper tab-wrapper">
      {!state.section_data
        || !state.section_data.medias
        || (state.section_data.medias.length === 0 && (
          <div className="medias-item-actions-wrapper">
            <ButtonBase
              className="btns theme-solid mx-0"
              onClick={mediaItemActionClicked('increment', 0)}
            >
              <span className="fas fa-plus" />
              <span className="px-1">{t(`${translationPath}add-media`)}</span>
            </ButtonBase>
          </div>
        ))}
      <DragDropContext onDragEnd={onDragEndHandler}>
        <Droppable droppableId="mediasManagementDroppableId">
          {(droppableProvided) => (
            <div
              className="medias-items-wrapper"
              {...droppableProvided.droppableProps}
              ref={droppableProvided.innerRef}
            >
              {state
                && state.section_data
                && state.section_data.medias
                && state.section_data.medias.map((item, index, items) => (
                  <Draggable
                    key={`mediasItemKey${index + 1}`}
                    draggableId={`mediasItemId${index + 1}`}
                    index={index}
                    isDragDisabled={items.length < 2}
                  >
                    {(provided, snapshot) => (
                      <div
                        className={`medias-item-wrapper${
                          (isAdvancedMode && ' is-advanced-mode') || ''
                        }${(snapshot.isDragging && ' is-dragging') || ''}`}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                      >
                        <div className="item-contents-wrapper">
                          {items.length > 1 && (
                            <div className="medias-actions-wrapper">
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
                                  <span>{t(`${translationPath}media`)}</span>
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
                                <div className="medias-contents-wrapper">
                                  <div className="medias-controls-wrapper">
                                    <MediasTextEditorControl
                                      editValue={item.description}
                                      onValueChanged={onStateChanged}
                                      isSubmitted={isSubmitted}
                                      stateKey="description"
                                      parentId="section_data"
                                      subParentId="medias"
                                      index={index}
                                      errors={errors}
                                      title="media-description"
                                      parentTranslationPath={parentTranslationPath}
                                      translationPath={translationPath}
                                    />
                                    {item.isExternalUrl && (
                                      <MediasInputControl
                                        idRef="externalLinkInputRef"
                                        editValue={
                                          (item.media && item.media.url) || ''
                                        }
                                        onValueChanged={onStateChanged}
                                        isSubmitted={isSubmitted}
                                        parentId="section_data"
                                        subParentId="medias"
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
                                      <MediasUploaderControl
                                        mediaItem={item.media}
                                        onValueChanged={onStateChanged}
                                        isSubmitted={isSubmitted}
                                        urlStateKey="url"
                                        uuidStateKey="uuid"
                                        typeStateKey="type"
                                        index={index}
                                        parentId="section_data"
                                        subParentId="medias"
                                        stateKey="media"
                                        errors={errors}
                                        labelValue="upload-media"
                                        parentTranslationPath={parentTranslationPath}
                                        translationPath={translationPath}
                                      />
                                    )}
                                    <div className="switch-controls-wrapper control-wrapper">
                                      <SwitchComponent
                                        idRef="youtubeLinkSwitchRef"
                                        label="youtube-link"
                                        isChecked={item.isExternalUrl || false}
                                        isReversedLabel
                                        isFlexEnd
                                        onChange={(event, newValue) => {
                                          onStateChanged({
                                            parentId: 'section_data',
                                            subParentId: 'medias',
                                            index,
                                            id: 'isExternalUrl',
                                            value: newValue,
                                          });
                                          onStateChanged({
                                            parentId: 'section_data',
                                            subParentId: 'medias',
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
                                    <div className="medias-actions-wrapper">
                                      <ButtonBase
                                        className="btns theme-shadow c-danger miw-32px ml-2-reversed mr-0-reversed"
                                        onClick={mediaItemActionClicked(
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
            onClick={mediaItemActionClicked(
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

MediaAndTextMediasTab.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  isAdvancedMode: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
