import React from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@mui/material/ButtonBase';
import { TooltipsComponent } from '../../../../../../components';
import {
  OnboardingMenuForSourceEnum,
  OnboardingTypesEnum,
  SystemActionsEnum,
} from '../../../../../../enums';
import { getIsAllowedPermissionV2 } from '../../../../../../helpers';
import {
  ManageDirectoryPermissions,
  ManageFlowPermissions,
} from '../../../../../../permissions';
import { useSelector } from 'react-redux';

export const FlowsSection = ({
  flows,
  isLoading,
  space_uuid,
  folder_uuid,
  currentDraggingItem,
  onCurrentDraggingItemChanged,
  droppableId,
  forSource,
  onDragOverItemHandler,
  onConnectionsClicked,
  parentTranslationPath,
  translationPath,
}) => {
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );
  return (
    <div className="flows-items-wrapper">
      {flows
        .filter(
          (item) =>
            !currentDraggingItem.item
            || currentDraggingItem.isForLink
            || currentDraggingItem.dragItemType !== OnboardingTypesEnum.Flows.key
            || currentDraggingItem.item.uuid !== item.uuid
            || (currentDraggingItem.item.uuid === item.uuid
              && currentDraggingItem.item.space_uuid !== item.space_uuid)
            || (currentDraggingItem.item.uuid === item.uuid
              && currentDraggingItem.item.space_uuid === item.space_uuid
              && currentDraggingItem.item.folder_uuid !== item.folder_uuid),
        )
        .map((item, index, items) => (
          <div
            className={`flow-item-wrapper onboarding-menu-item-wrapper${
              (isLoading && ' is-disabled') || ''
            }`}
            key={`flowItemKey${droppableId}${index + 1}${item.uuid}${
              space_uuid || ''
            }${folder_uuid || ''}`}
            onDragOver={onDragOverItemHandler({
              item,
              currentDragOverNumber: index + 1,
              isSameDraggingItem:
                currentDraggingItem.item
                && currentDraggingItem.item.uuid === item.uuid
                && currentDraggingItem.item.folder_uuid === item.folder_uuid
                && currentDraggingItem.item.space_uuid === item.space_uuid,
              itemSpaceUUID: space_uuid,
              itemFolderUUID: folder_uuid,
              isLastItem: index === items.length - 1,
              isFirstItem: index === 0,
              dragOverType: OnboardingTypesEnum.Flows.key,
            })}
          >
            <div className="onboarding-menu-item-body-wrapper">
              <div className="btns-and-actions-wrapper">
                <ButtonBase
                  className="btns theme-transparent"
                  disabled={
                    isLoading
                    || (!getIsAllowedPermissionV2({
                      permissionId: ManageFlowPermissions.ViewFlow.key,
                      permissions: permissionsReducer,
                    })
                      && forSource?.key !== OnboardingMenuForSourceEnum.Invitations.key)
                  }
                  onClick={onConnectionsClicked({
                    key: OnboardingTypesEnum.Flows.key,
                    space_uuid,
                    folder_uuid,
                    selectedItem: item,
                    actionKey: SystemActionsEnum.view.key,
                  })}
                >
                  <span className="btns-content">
                    <span className="far fa-dot-circle" />
                    <TooltipsComponent
                      title={
                        ((!currentDraggingItem.item
                          || currentDraggingItem.isMoved)
                          && item.title)
                        || ''
                      }
                      contentComponent={
                        <span className="title-text px-2">{item.title}</span>
                      }
                    />
                  </span>
                </ButtonBase>
                {forSource.isWithActions
                  && (!currentDraggingItem.item || currentDraggingItem.isMoved) && (
                  <div className="btns-actions-wrapper">
                    <TooltipsComponent
                      title="move"
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                      contentComponent={
                        <span>
                          <ButtonBase
                            className="dragging-btn btns-icon theme-transparent"
                            disabled={
                              currentDraggingItem.isMoved
                                || !getIsAllowedPermissionV2({
                                  permissionId:
                                    ManageDirectoryPermissions.ManageReorder.key,
                                  permissions: permissionsReducer,
                                })
                            }
                            draggable
                            onDrag={() => {
                              onCurrentDraggingItemChanged({
                                isMoved: false,
                                dragItemType: OnboardingTypesEnum.Flows.key,
                                itemSpaceUUID: space_uuid,
                                itemFolderUUID: folder_uuid,
                                item,
                              });
                            }}
                          >
                            <span className="fas fa-ellipsis-v" />
                            <span className="fas fa-ellipsis-v" />
                          </ButtonBase>
                        </span>
                      }
                    />
                    <TooltipsComponent
                      title="link"
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                      contentComponent={
                        <span>
                          <ButtonBase
                            className="dragging-btn btns-icon theme-transparent"
                            disabled={
                              currentDraggingItem.isMoved
                                || !getIsAllowedPermissionV2({
                                  permissionId:
                                    ManageDirectoryPermissions.ManageLinkFlow.key,
                                  permissions: permissionsReducer,
                                })
                            }
                            draggable
                            onDrag={() => {
                              onCurrentDraggingItemChanged({
                                isForLink: true,
                                dragItemType: OnboardingTypesEnum.Flows.key,
                                itemSpaceUUID: space_uuid,
                                itemFolderUUID: folder_uuid,
                                item,
                              });
                            }}
                          >
                            <span className="fas fa-link" />
                          </ButtonBase>
                        </span>
                      }
                    />
                    <TooltipsComponent
                      title="edit"
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                      contentComponent={
                        <span>
                          <ButtonBase
                            className="btns-icon theme-transparent"
                            disabled={
                              currentDraggingItem.isMoved
                                || !getIsAllowedPermissionV2({
                                  permissionId: ManageFlowPermissions.UpdateFlow.key,
                                  permissions: permissionsReducer,
                                })
                            }
                            onClick={onConnectionsClicked({
                              key: OnboardingTypesEnum.Flows.key,
                              space_uuid,
                              folder_uuid,
                              selectedItem: item,
                              actionKey: SystemActionsEnum.edit.key,
                            })}
                          >
                            <span className={SystemActionsEnum.edit.icon} />
                          </ButtonBase>
                        </span>
                      }
                    />
                    <TooltipsComponent
                      title="delete"
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                      contentComponent={
                        <span>
                          <ButtonBase
                            className="btns-icon theme-transparent"
                            disabled={
                              currentDraggingItem.isMoved
                                || !getIsAllowedPermissionV2({
                                  permissionId: ManageFlowPermissions.DeleteFlow.key,
                                  permissions: permissionsReducer,
                                })
                            }
                            onClick={onConnectionsClicked({
                              key: OnboardingTypesEnum.Flows.key,
                              space_uuid,
                              folder_uuid: item.uuid,
                              selectedItem: item,
                              actionKey: SystemActionsEnum.delete.key,
                            })}
                          >
                            <span className={SystemActionsEnum.delete.icon} />
                          </ButtonBase>
                        </span>
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

FlowsSection.propTypes = {
  flows: PropTypes.arrayOf(PropTypes.instanceOf(Object)).isRequired,
  currentDraggingItem: PropTypes.shape({
    isForLink: PropTypes.bool,
    isMoved: PropTypes.bool, // needed to know if the current dragging is finish dragging and specify location or link
    newItemDetails: PropTypes.instanceOf(Object), // needed to save the current new location during saving the move or link
    dragItemType: PropTypes.oneOf(
      Object.values(OnboardingTypesEnum).map((item) => item.key),
    ),
    item: PropTypes.instanceOf(Object),
  }).isRequired,
  onDragOverItemHandler: PropTypes.func.isRequired,
  onCurrentDraggingItemChanged: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  space_uuid: PropTypes.string,
  folder_uuid: PropTypes.string,
  droppableId: PropTypes.string,
  forSource: PropTypes.oneOf(
    Object.values(OnboardingMenuForSourceEnum).map((item) => item),
  ).isRequired,
  onConnectionsClicked: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
FlowsSection.defaultProps = {
  droppableId: 'spaceDisconnectedFlowsDroppableId',
};
