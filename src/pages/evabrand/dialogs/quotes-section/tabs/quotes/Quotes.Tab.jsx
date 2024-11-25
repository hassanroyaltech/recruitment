/* eslint-disable react/no-danger */
import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@mui/material/ButtonBase';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import {
  QuotesInputControl,
  QuotesTextEditorControl,
  QuotesUploaderControl,
} from './controls';
import './Quotes.Style.scss';
// import { SocialMediaShared } from '../../../shared/social-media';
import { GetReorderDraggedItems } from '../../../../helpers';
import { SystemActionsEnum } from '../../../../../../enums';
import { CollapseComponent } from '../../../../../../components';
// tab that handles the quotes data
export const QuotesTab = ({
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
  const quoteItemRef = useRef({
    name: '',
    job_title: '',
    media: null,
    description: '',
    social_media: {
      facebook: '',
      youtube: '',
      linkedin: '',
      twitter: '',
      instagram: '',
      snapchat: '',
      website: '',
    },
  });
  /**
   * method to add or delete quote item
   * @param type => 'increment', 'decrement'
   * @param index
   */
  const quoteItemActionClicked = useCallback(
    (type, index) => () => {
      const localQuotes
        = (state
          && state.section_data
          && state.section_data.quotes && [...state.section_data.quotes])
        || [];
      if (type === 'increment') {
        localQuotes.splice(index + 1, 0, { ...quoteItemRef.current });
        setActiveCollapse(localQuotes.length - 1);
      } else localQuotes.splice(index, 1);
      if (onStateChanged)
        onStateChanged({
          parentId: 'section_data',
          id: 'quotes',
          value: [...localQuotes],
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
   * @Description this method is to reorder quotes items
   */
  const onDragEndHandler = (dropEvent) => {
    const reorderedItems = GetReorderDraggedItems(
      dropEvent,
      (state && state.section_data && state.section_data.quotes) || [],
    );
    if (!reorderedItems) return;
    if (onStateChanged)
      onStateChanged({
        parentId: 'section_data',
        id: 'quotes',
        value: [...reorderedItems],
      });
  };
  return (
    <div className="quotes-tab-wrapper tab-wrapper">
      {!state.section_data
        || !state.section_data.quotes
        || (state.section_data.quotes.length === 0 && (
          <div className="quotes-item-actions-wrapper">
            <ButtonBase
              className="btns theme-solid mx-0"
              onClick={quoteItemActionClicked('increment', 0)}
            >
              <span className="fas fa-plus" />
              <span className="px-1">{t(`${translationPath}add-quote`)}</span>
            </ButtonBase>
          </div>
        ))}
      <DragDropContext onDragEnd={onDragEndHandler}>
        <Droppable droppableId="quotesManagementDroppableId">
          {(droppableProvided) => (
            <div
              className="quotes-items-wrapper"
              {...droppableProvided.droppableProps}
              ref={droppableProvided.innerRef}
            >
              {state
                && state.section_data
                && state.section_data.quotes
                && state.section_data.quotes.map((item, index, items) => (
                  <Draggable
                    key={`quotesItemKey${index + 1}`}
                    draggableId={`quotesItemId${index + 1}`}
                    index={index}
                    isDragDisabled={items.length < 2}
                  >
                    {(provided, snapshot) => (
                      <div
                        className={`quotes-item-wrapper${
                          (isAdvancedMode && ' is-advanced-mode') || ''
                        }${(snapshot.isDragging && ' is-dragging') || ''}`}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                      >
                        <div className="item-contents-wrapper">
                          {items.length > 1 && (
                            <div className="quotes-actions-wrapper">
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
                              {(!item.name && (
                                <span className="header-text-x2">
                                  <span>{t(`${translationPath}quote`)}</span>
                                  <span className="px-1">{index + 1}</span>
                                </span>
                              ))
                                || (isAdvancedMode && (
                                  <span
                                    dangerouslySetInnerHTML={{ __html: item.name }}
                                  />
                                )) || (
                                <span className="header-text-x2">{item.name}</span>
                              )}
                            </ButtonBase>
                            <CollapseComponent
                              isOpen={activeCollapse === index}
                              component={
                                <div className="quotes-contents-wrapper">
                                  <div className="quotes-controls-wrapper">
                                    {!isAdvancedMode && (
                                      <QuotesInputControl
                                        idRef="QuotesInputNameRef"
                                        editValue={item.name}
                                        onValueChanged={onStateChanged}
                                        isSubmitted={isSubmitted}
                                        stateKey="name"
                                        index={index}
                                        parentId="section_data"
                                        subParentId="quotes"
                                        errors={errors}
                                        title="quote-name"
                                        placeholder="quote-name"
                                        parentTranslationPath={parentTranslationPath}
                                        translationPath={translationPath}
                                      />
                                    )}
                                    {!isAdvancedMode && (
                                      <QuotesInputControl
                                        idRef="QuotesInputJobTitleRef"
                                        editValue={item.job_title}
                                        onValueChanged={onStateChanged}
                                        isSubmitted={isSubmitted}
                                        stateKey="job_title"
                                        index={index}
                                        parentId="section_data"
                                        subParentId="quotes"
                                        errors={errors}
                                        title="job-title"
                                        placeholder="job-title"
                                        parentTranslationPath={parentTranslationPath}
                                        translationPath={translationPath}
                                      />
                                    )}
                                    {isAdvancedMode && (
                                      <QuotesTextEditorControl
                                        idRef="QuoteItemNameRef"
                                        editValue={item.name}
                                        onValueChanged={onStateChanged}
                                        isSubmitted={isSubmitted}
                                        stateKey="name"
                                        index={index}
                                        parentId="section_data"
                                        subParentId="quotes"
                                        errors={errors}
                                        title="quote-name"
                                        parentTranslationPath={parentTranslationPath}
                                        translationPath={translationPath}
                                      />
                                    )}
                                    {isAdvancedMode && (
                                      <QuotesTextEditorControl
                                        editValue={item.job_title}
                                        onValueChanged={onStateChanged}
                                        isSubmitted={isSubmitted}
                                        stateKey="job_title"
                                        parentId="section_data"
                                        subParentId="quotes"
                                        index={index}
                                        errors={errors}
                                        title="job-title"
                                        parentTranslationPath={parentTranslationPath}
                                        translationPath={translationPath}
                                      />
                                    )}
                                    <QuotesTextEditorControl
                                      idRef="QuoteDescriptionTextEditorRef"
                                      editValue={item.description}
                                      onValueChanged={onStateChanged}
                                      isSubmitted={isSubmitted}
                                      stateKey="description"
                                      parentId="section_data"
                                      subParentId="quotes"
                                      index={index}
                                      errors={errors}
                                      title="description"
                                      parentTranslationPath={parentTranslationPath}
                                      translationPath={translationPath}
                                    />
                                    <QuotesUploaderControl
                                      mediaItem={item.media}
                                      onValueChanged={onStateChanged}
                                      isSubmitted={isSubmitted}
                                      urlStateKey="url"
                                      uuidStateKey="uuid"
                                      stateKey="media"
                                      index={index}
                                      parentId="section_data"
                                      subParentId="quotes"
                                      errors={errors}
                                      labelValue="upload-image"
                                      parentTranslationPath={parentTranslationPath}
                                      translationPath={translationPath}
                                    />
                                    {/* <SocialMediaShared */}
                                    {/*  errors={errors} */}
                                    {/*  index={index} */}
                                    {/*  subParentItem={item} */}
                                    {/*  isSubmitted={isSubmitted} */}
                                    {/*  onValueChanged={onStateChanged} */}
                                    {/*  parentTranslationPath={parentTranslationPath} */}
                                    {/*  parentId="section_data" */}
                                    {/*  subParentId="quotes" */}
                                    {/*  isWithFacebook */}
                                    {/*  isWithLinkedin */}
                                    {/*  isWithYoutube */}
                                    {/*  isWithTwitter */}
                                    {/*  isWithSnapchat */}
                                    {/*  isWithInstagram */}
                                    {/*  isWithWebsite */}
                                    {/* /> */}
                                  </div>
                                  {items.length > 1 && (
                                    <div className="quotes-actions-wrapper">
                                      <ButtonBase
                                        className="btns theme-shadow c-danger miw-32px ml-2-reversed mr-0-reversed"
                                        onClick={quoteItemActionClicked(
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
        && state.section_data.quotes
        && state.section_data.quotes.length > 0 && (
        <div className="d-flex-v-center-h-end w-100 mb-3">
          <ButtonBase
            className="btns theme-solid miw-auto"
            onClick={quoteItemActionClicked(
              'increment',
              state.section_data.quotes.length,
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

QuotesTab.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  isAdvancedMode: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};
QuotesTab.defaultProps = {
  translationPath: 'QuotesTab.',
};
