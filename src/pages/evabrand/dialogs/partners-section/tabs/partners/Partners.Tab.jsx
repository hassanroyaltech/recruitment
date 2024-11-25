/* eslint-disable react/no-danger */
import React, { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@mui/material/ButtonBase';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import { PartnersInputControl, PartnersUploaderControl } from './controls';
import './Partners.Style.scss';
import { SystemActionsEnum } from '../../../../../../enums';
import { CollapseComponent } from '../../../../../../components';
import { GetReorderDraggedItems } from '../../../../helpers';
// tab that handles the partner tab data
export const PartnersTab = ({
  state,
  onStateChanged,
  errors,
  isSubmitted,
  isAdvancedMode,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const partnerItemRef = useRef({
    media: null,
    partner_url: '',
  });
  /**
   * method to add or delete partner item
   * @param type => 'increment', 'decrement'
   * @param index
   */
  const partnerItemActionClicked = useCallback(
    (type, index) => () => {
      const localPartners
        = (state
          && state.section_data
          && state.section_data.partners && [...state.section_data.partners])
        || [];
      if (type === 'increment')
        localPartners.splice(index + 1, 0, { ...partnerItemRef.current });
      else localPartners.splice(index, 1);
      if (onStateChanged)
        onStateChanged({
          parentId: 'section_data',
          id: 'partners',
          value: [...localPartners],
        });
    },
    [onStateChanged, state],
  );
  /**
   * @param dropEvent
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to reorder grids items
   */
  const onDragEndHandler = (dropEvent) => {
    const reorderedItems = GetReorderDraggedItems(
      dropEvent,
      (state && state.section_data && state.section_data.partners) || [],
    );
    if (!reorderedItems) return;
    if (onStateChanged)
      onStateChanged({
        parentId: 'section_data',
        id: 'partners',
        value: [...reorderedItems],
      });
  };
  return (
    <div className="partners-tab-wrapper tab-wrapper">
      {!state.section_data
        || !state.section_data.partners
        || (state.section_data.partners.length === 0 && (
          <div className="partners-item-actions-wrapper">
            <ButtonBase
              className="btns theme-solid mx-0"
              onClick={partnerItemActionClicked('increment', 0)}
            >
              <span className="fas fa-plus" />
              <span className="px-1">{t(`${translationPath}add-partner`)}</span>
            </ButtonBase>
          </div>
        ))}
      <DragDropContext onDragEnd={onDragEndHandler}>
        <Droppable droppableId="partnersManagementDroppableId">
          {(droppableProvided) => (
            <div
              className="partners-items-wrapper"
              {...droppableProvided.droppableProps}
              ref={droppableProvided.innerRef}
            >
              {state
                && state.section_data
                && state.section_data.partners
                && state.section_data.partners.map((item, index, items) => (
                  <Draggable
                    key={`partnersItemKey${index + 1}`}
                    draggableId={`partnersItemId${index + 1}`}
                    index={index}
                    isDragDisabled={items.length < 2}
                  >
                    {(provided, snapshot) => (
                      <div
                        className={`partners-item-wrapper${
                          (snapshot.isDragging && ' is-dragging') || ''
                        }`}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                      >
                        <div className="item-contents-wrapper">
                          {items.length > 1 && (
                            <div className="partners-actions-wrapper">
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
                            <ButtonBase className="header-menu-wrapper" disabled>
                              {(!item.title && (
                                <span className="header-text-x2">
                                  <span>{t(`${translationPath}partner`)}</span>
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
                              isOpen
                              component={
                                <div className="partners-contents-wrapper">
                                  <div className="partners-controls-wrapper">
                                    <PartnersInputControl
                                      idRef="externalLinkInputRef"
                                      editValue={item.partner_url || ''}
                                      onValueChanged={onStateChanged}
                                      isSubmitted={isSubmitted}
                                      parentId="section_data"
                                      subParentId="partners"
                                      stateKey="partner_url"
                                      index={index}
                                      errors={errors}
                                      title="partner-link"
                                      placeholder="partner-link-example"
                                      parentTranslationPath={parentTranslationPath}
                                      translationPath={translationPath}
                                    />
                                    <PartnersUploaderControl
                                      mediaItem={item.media}
                                      onValueChanged={onStateChanged}
                                      isSubmitted={isSubmitted}
                                      urlStateKey="url"
                                      uuidStateKey="uuid"
                                      stateKey="media"
                                      index={index}
                                      parentId="section_data"
                                      subParentId="partners"
                                      errors={errors}
                                      labelValue="upload-image"
                                      parentTranslationPath={parentTranslationPath}
                                      translationPath={translationPath}
                                    />
                                  </div>
                                  {items.length > 1 && (
                                    <div className="partners-actions-wrapper">
                                      <ButtonBase
                                        className="btns theme-shadow c-danger miw-32px ml-2-reversed mr-0-reversed"
                                        onClick={partnerItemActionClicked(
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
        && state.section_data.partners
        && state.section_data.partners.length > 0 && (
        <div className="d-flex-v-center-h-end w-100 mb-3">
          <ButtonBase
            className="btns theme-solid miw-auto"
            onClick={partnerItemActionClicked(
              'increment',
              state.section_data.partners.length,
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

PartnersTab.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  isAdvancedMode: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};
PartnersTab.defaultProps = {
  translationPath: 'PartnersTab.',
};
