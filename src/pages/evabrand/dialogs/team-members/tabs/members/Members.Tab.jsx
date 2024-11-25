/* eslint-disable react/no-danger */
import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@mui/material/ButtonBase';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import {
  MembersInputControl,
  MembersTextEditorControl,
  MembersUploaderControl,
} from './controls';
import './Members.Style.scss';
import { SocialMediaShared } from '../../../shared/social-media';
import { SystemActionsEnum } from '../../../../../../enums';
import { GetReorderDraggedItems } from '../../../../helpers';
import { CollapseComponent } from '../../../../../../components';
// tab that handles the navigation menu data
export const MembersTab = ({
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
  const memberItemRef = useRef({
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
   * method to add or delete member item
   * @param type => 'increment', 'decrement'
   * @param index
   */
  const memberItemActionClicked = useCallback(
    (type, index) => () => {
      const localMembers
        = (state
          && state.section_data
          && state.section_data.members && [...state.section_data.members])
        || [];
      if (type === 'increment') {
        localMembers.splice(index + 1, 0, { ...memberItemRef.current });
        setActiveCollapse(localMembers.length - 1);
      } else localMembers.splice(index, 1);
      if (onStateChanged)
        onStateChanged({
          parentId: 'section_data',
          id: 'members',
          value: [...localMembers],
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
   * @Description this method is to reorder members items
   */
  const onDragEndHandler = (dropEvent) => {
    const reorderedItems = GetReorderDraggedItems(
      dropEvent,
      (state && state.section_data && state.section_data.members) || [],
    );
    if (!reorderedItems) return;
    if (onStateChanged)
      onStateChanged({
        parentId: 'section_data',
        id: 'members',
        value: [...reorderedItems],
      });
  };
  return (
    <div className="members-tab-wrapper tab-wrapper">
      {!state.section_data
        || !state.section_data.members
        || (state.section_data.members.length === 0 && (
          <div className="members-item-actions-wrapper">
            <ButtonBase
              className="btns theme-solid mx-0"
              onClick={memberItemActionClicked('increment', 0)}
            >
              <span className="fas fa-plus" />
              <span className="px-1">{t(`${translationPath}add-member`)}</span>
            </ButtonBase>
          </div>
        ))}
      <DragDropContext onDragEnd={onDragEndHandler}>
        <Droppable droppableId="membersManagementDroppableId">
          {(droppableProvided) => (
            <div
              className="members-items-wrapper"
              {...droppableProvided.droppableProps}
              ref={droppableProvided.innerRef}
            >
              {state
                && state.section_data
                && state.section_data.members
                && state.section_data.members.map((item, index, items) => (
                  <Draggable
                    key={`membersItemKey${index + 1}`}
                    draggableId={`membersItemId${index + 1}`}
                    index={index}
                    isDragDisabled={items.length < 2}
                  >
                    {(provided, snapshot) => (
                      <div
                        className={`members-item-wrapper${
                          (isAdvancedMode && ' is-advanced-mode') || ''
                        }${(snapshot.isDragging && ' is-dragging') || ''}`}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                      >
                        <div className="item-contents-wrapper">
                          {items.length > 1 && (
                            <div className="members-actions-wrapper">
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
                                  <span>{t(`${translationPath}member`)}</span>
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
                                <div className="members-contents-wrapper">
                                  <div className="members-controls-wrapper">
                                    {!isAdvancedMode && (
                                      <MembersInputControl
                                        idRef="MembersInputNameRef"
                                        editValue={item.name}
                                        onValueChanged={onStateChanged}
                                        isSubmitted={isSubmitted}
                                        stateKey="name"
                                        index={index}
                                        parentId="section_data"
                                        subParentId="members"
                                        errors={errors}
                                        title="member-name"
                                        placeholder="member-name"
                                        parentTranslationPath={parentTranslationPath}
                                        translationPath={translationPath}
                                      />
                                    )}
                                    {!isAdvancedMode && (
                                      <MembersInputControl
                                        idRef="MembersInputJobTitleRef"
                                        editValue={item.job_title}
                                        onValueChanged={onStateChanged}
                                        isSubmitted={isSubmitted}
                                        stateKey="job_title"
                                        index={index}
                                        parentId="section_data"
                                        subParentId="members"
                                        errors={errors}
                                        title="job-title"
                                        placeholder="job-title"
                                        parentTranslationPath={parentTranslationPath}
                                        translationPath={translationPath}
                                      />
                                    )}
                                    {isAdvancedMode && (
                                      <MembersTextEditorControl
                                        idRef="MemberItemNameRef"
                                        editValue={item.name}
                                        onValueChanged={onStateChanged}
                                        isSubmitted={isSubmitted}
                                        stateKey="name"
                                        index={index}
                                        parentId="section_data"
                                        subParentId="members"
                                        errors={errors}
                                        title="member-name"
                                        parentTranslationPath={parentTranslationPath}
                                        translationPath={translationPath}
                                      />
                                    )}
                                    {isAdvancedMode && (
                                      <MembersTextEditorControl
                                        editValue={item.job_title}
                                        onValueChanged={onStateChanged}
                                        isSubmitted={isSubmitted}
                                        stateKey="job_title"
                                        parentId="section_data"
                                        subParentId="members"
                                        index={index}
                                        errors={errors}
                                        title="job-title"
                                        parentTranslationPath={parentTranslationPath}
                                        translationPath={translationPath}
                                      />
                                    )}
                                    <MembersTextEditorControl
                                      idRef="MemberDescriptionTextEditorRef"
                                      editValue={item.description}
                                      onValueChanged={onStateChanged}
                                      isSubmitted={isSubmitted}
                                      stateKey="description"
                                      parentId="section_data"
                                      subParentId="members"
                                      index={index}
                                      errors={errors}
                                      title="description"
                                      parentTranslationPath={parentTranslationPath}
                                      translationPath={translationPath}
                                    />
                                    <MembersUploaderControl
                                      mediaItem={item.media}
                                      onValueChanged={onStateChanged}
                                      isSubmitted={isSubmitted}
                                      urlStateKey="url"
                                      uuidStateKey="uuid"
                                      stateKey="media"
                                      index={index}
                                      parentId="section_data"
                                      subParentId="members"
                                      errors={errors}
                                      labelValue="upload-image"
                                      parentTranslationPath={parentTranslationPath}
                                      translationPath={translationPath}
                                    />
                                    <SocialMediaShared
                                      errors={errors}
                                      index={index}
                                      subParentItem={item}
                                      isSubmitted={isSubmitted}
                                      onValueChanged={onStateChanged}
                                      parentTranslationPath={parentTranslationPath}
                                      parentId="section_data"
                                      subParentId="members"
                                      isWithFacebook
                                      isWithLinkedin
                                      isWithYoutube
                                      isWithTwitter
                                      isWithSnapchat
                                      isWithInstagram
                                      // isWithWebsite
                                    />
                                  </div>
                                  {items.length > 1 && (
                                    <div className="members-actions-wrapper">
                                      <ButtonBase
                                        className="btns theme-shadow c-danger miw-32px ml-2-reversed mr-0-reversed"
                                        onClick={memberItemActionClicked(
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
        && state.section_data.members
        && state.section_data.members.length > 0 && (
        <div className="d-flex-v-center-h-end w-100 mb-3">
          <ButtonBase
            className="btns theme-solid miw-auto"
            onClick={memberItemActionClicked(
              'increment',
              state.section_data.members.length,
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

MembersTab.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  isAdvancedMode: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};
MembersTab.defaultProps = {
  translationPath: 'MembersTab.',
};
