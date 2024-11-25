import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { ButtonBase } from '@mui/material';
import { PopoverComponent } from '../../../../../../../../../components';
import { SystemActionsEnum } from '../../../../../../../../../enums';
import './StagesNavigator.Style.scss';
import { getIsAllowedPermissionV2 } from '../../../../../../../../../helpers';
import { useSelector } from 'react-redux';
import { ManageVisasPermissions } from '../../../../../../../../../permissions';

export const StagesNavigatorSection = ({
  state,
  activeStage,
  onActiveStageChanged,
  parentTranslationPath,
  translationPath,
  onDragEndHandler,
  isLoading,
  addStageHandler,
  onDeleteStageClicked,
  reorderStagesChangedHandler,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
  const [popoverAttachedWith, setPopoverAttachedWith] = useState(null);
  const [popoverStageIndex, setPopoverStageIndex] = useState(null);

  /**
   * @param stageIndex
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the toggle for the stages popover
   */
  const popoverToggleHandler = useCallback(
    (stageIndex = null) =>
      (event = null) => {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }
        setPopoverStageIndex(stageIndex);
        setPopoverAttachedWith(
          ((stageIndex || stageIndex === 0) && event && event.currentTarget) || null,
        );
      },
    [],
  );

  /**
   * @param stageIndex
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle change the active stage
   */
  const activeStageChangedHandler = useCallback(
    (stageIndex) => () => {
      onActiveStageChanged(stageIndex);
    },
    [onActiveStageChanged],
  );

  return (
    <div className="stages-navigator-section-wrapper section-wrapper">
      <div className="stages-navigator-content-wrapper">
        <div className="d-flex-v-center-h-between py-3">
          <span className="d-inline-flex-v-center">
            <span className="c-gray-primary">{t(`${translationPath}stages`)}</span>
            <span className="d-inline-flex-v-center c-gray">
              <span className="px-1">.</span>
              <span>{state.stages.length}</span>
            </span>
          </span>
          <ButtonBase
            className="btns-icon theme-transparent mx-0"
            onClick={addStageHandler(state.stages)}
          >
            <span className="fas fa-plus" />
          </ButtonBase>
        </div>
        <DragDropContext onDragEnd={onDragEndHandler}>
          <Droppable droppableId="stagesDroppableId">
            {(droppableProvided) => (
              <div
                className="stages-navigator-items-wrapper"
                {...droppableProvided.droppableProps}
                ref={droppableProvided.innerRef}
              >
                {state.stages.map((item, index, items) => (
                  <Draggable
                    key={`stageItemKey${index + 1}`}
                    draggableId={`stageItemId${index + 1}`}
                    index={index}
                    isDragDisabled={
                      items.length < 2
                      || isLoading
                      || !getIsAllowedPermissionV2({
                        permissions,
                        permissionId: ManageVisasPermissions.ManagePipeline.key,
                      })
                    }
                  >
                    {(provided, snapshot) => (
                      <div
                        className={`stages-navigator-item-wrapper${
                          (snapshot.isDragging && ' is-dragging') || ''
                        }${(activeStage === index && ' is-active') || ''}${
                          (popoverStageIndex === index && ' is-focus') || ''
                        }`}
                        {...provided.draggableProps}
                        role="button"
                        tabIndex={0}
                        onClick={activeStageChangedHandler(index)}
                        onKeyUp={() => {}}
                        ref={provided.innerRef}
                      >
                        <div className="stages-navigator-item-section">
                          <span className="number-wrapper">{index + 1}</span>
                          {items.length > 1 && (
                            <div
                              className="dragging-btn"
                              {...provided.dragHandleProps}
                            >
                              <span className="fas fa-ellipsis-v" />
                              <span className="fas fa-ellipsis-v" />
                            </div>
                          )}
                          <div
                            className="stage-tag-wrapper"
                            style={{ backgroundColor: item.stage_color }}
                          >
                            <span
                              className="fas fa-circle"
                              style={{
                                color: item.stage_color,
                                filter: 'brightness(80%)',
                              }}
                            />
                            <span className="px-1">
                              {item.title
                                || `${t(`${translationPath}stage-#`)} ${
                                  activeStage + 1
                                }`}
                            </span>
                          </div>
                        </div>
                        <div className="stages-navigator-item-section">
                          <ButtonBase
                            className="btns-icon theme-transparent mx-2"
                            onClick={popoverToggleHandler(index)}
                          >
                            <span className="fas fa-ellipsis-h" />
                          </ButtonBase>
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
        <div className="d-flex-center">
          <ButtonBase
            className="btns theme-transparent mx-0"
            onClick={addStageHandler(state.stages)}
          >
            <span className="fas fa-plus" />
            <span className="px-2">{t(`${translationPath}add-stage`)}</span>
          </ButtonBase>
        </div>
        {popoverAttachedWith && popoverStageIndex !== null && (
          <PopoverComponent
            idRef="stagesNavigatorSectionPopover"
            attachedWith={popoverAttachedWith}
            handleClose={popoverToggleHandler()}
            popoverClasses="stages-navigator-popover-wrapper"
            component={
              <div className="stages-navigator-items-wrapper">
                <ButtonBase
                  className="btns theme-transparent stages-navigator-popover-btn"
                  onClick={() => {
                    reorderStagesChangedHandler({
                      sourceIndex: popoverStageIndex,
                      destinationIndex: popoverStageIndex - 1,
                    });
                    popoverToggleHandler()();
                  }}
                  disabled={
                    popoverStageIndex === 0
                    || isLoading
                    || !getIsAllowedPermissionV2({
                      permissions,
                      permissionId: ManageVisasPermissions.ManagePipeline.key,
                    })
                  }
                >
                  <span className="fas fa-arrow-up" />
                  <span className="px-2">{t(`${translationPath}move-up`)}</span>
                </ButtonBase>
                <ButtonBase
                  className="btns theme-transparent stages-navigator-popover-btn"
                  onClick={() => {
                    reorderStagesChangedHandler({
                      sourceIndex: popoverStageIndex,
                      destinationIndex: popoverStageIndex + 1,
                    });
                    popoverToggleHandler()();
                  }}
                  disabled={
                    popoverStageIndex === state.stages.length - 1
                    || isLoading
                    || !getIsAllowedPermissionV2({
                      permissions,
                      permissionId: ManageVisasPermissions.ManagePipeline.key,
                    })
                  }
                >
                  <span className="fas fa-arrow-down" />
                  <span className="px-2">{t(`${translationPath}move-down`)}</span>
                </ButtonBase>
                <div className="separator-h my-2" />
                <ButtonBase
                  className="btns theme-transparent stages-navigator-popover-btn"
                  onClick={() => {
                    onDeleteStageClicked(
                      popoverStageIndex,
                      state.stages.find(
                        (item, index) => index === popoverStageIndex,
                      ),
                      state.stages,
                    )();
                    popoverToggleHandler()();
                  }}
                  disabled={
                    (popoverStageIndex >= 0
                      && state.stages.length > popoverStageIndex
                      && !state.stages[popoverStageIndex].can_delete)
                    || isLoading
                  }
                >
                  <span className={SystemActionsEnum.delete.icon} />
                  <span className="px-2">{t(`${translationPath}delete-stage`)}</span>
                </ButtonBase>
              </div>
            }
          />
        )}
      </div>
    </div>
  );
};

StagesNavigatorSection.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  activeStage: PropTypes.number.isRequired,
  onActiveStageChanged: PropTypes.func.isRequired,
  addStageHandler: PropTypes.func.isRequired,
  onDragEndHandler: PropTypes.func.isRequired,
  onDeleteStageClicked: PropTypes.func.isRequired,
  reorderStagesChangedHandler: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};
StagesNavigatorSection.defaultProps = {
  translationPath: '',
};
