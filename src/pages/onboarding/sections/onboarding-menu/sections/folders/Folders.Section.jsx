import React from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@mui/material/ButtonBase';
import { CollapseComponent, TooltipsComponent } from '../../../../../../components';
import {
  OnboardingMenuForSourceEnum,
  OnboardingTypesEnum,
  SystemActionsEnum,
} from '../../../../../../enums';
import { FlowsSection } from '../flows/Flows.Section';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAllowedPermissionV2 } from '../../../../../../helpers';
import {
  ManageDirectoryPermissions,
  ManageFlowPermissions,
  ManageFolderPermissions,
} from '../../../../../../permissions';

export const FoldersSection = ({
  folders,
  isLoading,
  space_uuid,
  droppableId,
  currentURLQueriesRef,
  onConnectionsClicked,
  getIsOpenCollapse,
  forSource,
  currentDraggingItem,
  getIsActiveCollapseItem,
  onDragOverItemHandler,
  onCurrentDraggingItemChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );
  return (
    <div className="folders-items-wrapper">
      {folders
        .filter(
          (item) =>
            !currentDraggingItem.item
            || currentDraggingItem.dragItemType !== OnboardingTypesEnum.Folders.key
            || currentDraggingItem.item.uuid !== item.uuid
            || (currentDraggingItem.item.uuid === item.uuid
              && currentDraggingItem.item.space_uuid !== item.space_uuid),
        )
        .map((item, index, items) => (
          <div
            className={`folder-item-wrapper onboarding-menu-item-wrapper${
              (isLoading && ' is-disabled') || ''
            }`}
            key={`${droppableId}${item.uuid}`}
          >
            <div
              className="onboarding-menu-item-body-wrapper"
              onDragOver={onDragOverItemHandler({
                item,
                currentDragOverNumber: index + 1,
                isLastItem: index === items.length - 1,
                isFirstItem: index === 0,
                itemSpaceUUID: space_uuid,
                itemFolderUUID: item.uuid,
                dragOverType: OnboardingTypesEnum.Folders.key,
              })}
            >
              <div className="btns-and-actions-wrapper">
                <ButtonBase
                  disabled={
                    isLoading
                    || (!getIsAllowedPermissionV2({
                      permissionId: ManageFolderPermissions.ViewFolder.key,
                      permissions: permissionsReducer,
                    })
                      && forSource?.key !== OnboardingMenuForSourceEnum.Invitations.key)
                  }
                  className={`btns theme-transparent${
                    ((currentURLQueriesRef.current.folder_uuid === item.uuid
                      || (getIsActiveCollapseItem
                        && getIsActiveCollapseItem({
                          type: OnboardingTypesEnum.Folders.key,
                          space_uuid,
                          item,
                        })))
                      && ' is-active')
                    || ''
                  }`}
                  onClick={onConnectionsClicked({
                    space_uuid,
                    folder_uuid: item.uuid,
                    isCollapseAction: true,
                  })}
                >
                  <span className="btns-content">
                    <span
                      className={`fas fa-chevron-${
                        (getIsOpenCollapse({
                          space_uuid,
                          folder_uuid: item.uuid,
                        })
                          && 'up')
                        || 'down'
                      }`}
                    />
                    <span className={`px-2 ${item.icon}`} />
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
                                dragItemType: OnboardingTypesEnum.Folders.key,
                                itemSpaceUUID: space_uuid,
                                itemFolderUUID: item.uuid,
                                item: item,
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
                                  permissionId:
                                    ManageFolderPermissions.UpdateFolder.key,
                                  permissions: permissionsReducer,
                                })
                            }
                            onClick={onConnectionsClicked({
                              key: OnboardingTypesEnum.Folders.key,
                              space_uuid,
                              folder_uuid: item.uuid,
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
                                  permissionId:
                                    ManageFolderPermissions.DeleteFolder.key,
                                  permissions: permissionsReducer,
                                })
                            }
                            onClick={onConnectionsClicked({
                              key: OnboardingTypesEnum.Folders.key,
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

            <CollapseComponent
              isOpen={getIsOpenCollapse({
                space_uuid,
                folder_uuid: item.uuid,
              })}
              wrapperClasses="w-100"
              component={
                <div className="folder-collapse-content-wrapper collapse-content-wrapper">
                  <FlowsSection
                    isLoading={isLoading}
                    flows={item.flows}
                    forSource={forSource}
                    space_uuid={space_uuid}
                    folder_uuid={item.uuid}
                    onDragOverItemHandler={onDragOverItemHandler}
                    onCurrentDraggingItemChanged={onCurrentDraggingItemChanged}
                    currentDraggingItem={currentDraggingItem}
                    droppableId={`${space_uuid}${item.uuid}`}
                    translationPath={translationPath}
                    parentTranslationPath={parentTranslationPath}
                    onConnectionsClicked={onConnectionsClicked}
                  />
                  {forSource.isWithAddActions
                    && (!currentDraggingItem.item || currentDraggingItem.isMoved) && (
                    <>
                      <ButtonBase
                        className="btns theme-transparent"
                        disabled={
                          currentDraggingItem.isMoved
                            || !getIsAllowedPermissionV2({
                              permissionId: ManageFlowPermissions.CreateFlow.key,
                              permissions: permissionsReducer,
                            })
                        }
                        onClick={onConnectionsClicked({
                          key: OnboardingTypesEnum.Flows.key,
                          space_uuid,
                          folder_uuid: item.uuid,
                        })}
                      >
                        <span className="fas fa-plus" />
                        <span className="px-2">
                          {t(`${translationPath}add-flow`)}
                        </span>
                      </ButtonBase>
                      <ButtonBase
                        className="btns theme-transparent"
                        disabled={
                          currentDraggingItem.isMoved
                            || !getIsAllowedPermissionV2({
                              permissionId: ManageFlowPermissions.CreateFlow.key,
                              permissions: permissionsReducer,
                            })
                        }
                        onClick={onConnectionsClicked({
                          key: OnboardingTypesEnum.Flows.key,
                          space_uuid,
                          folder_uuid: item.uuid,
                          isSurvey: true,
                        })}
                      >
                        <span className="fas fa-plus" />
                        <span className="px-2">
                          {t(`${translationPath}add-survey`)}
                        </span>
                      </ButtonBase>
                    </>
                  )}
                </div>
              }
            />
          </div>
        ))}
    </div>
  );
};

FoldersSection.propTypes = {
  folders: PropTypes.arrayOf(PropTypes.instanceOf(Object)).isRequired,
  currentDraggingItem: PropTypes.shape({
    isForLink: PropTypes.bool,
    dragItemType: PropTypes.oneOf(
      Object.values(OnboardingTypesEnum).map((item) => item.key),
    ),
    isMoved: PropTypes.bool, // needed to know if the current dragging is finish dragging and specify location or link
    newItemDetails: PropTypes.instanceOf(Object), // needed to save the current new location during saving the move or link
    itemSpaceUUID: PropTypes.string,
    itemFolderUUID: PropTypes.string,
    item: PropTypes.instanceOf(Object),
  }).isRequired,
  onCurrentDraggingItemChanged: PropTypes.func.isRequired,
  onDragOverItemHandler: PropTypes.func.isRequired,
  currentURLQueriesRef: PropTypes.shape({
    current: PropTypes.shape({
      space_uuid: PropTypes.string,
      folder_uuid: PropTypes.string,
    }),
  }).isRequired,
  isLoading: PropTypes.bool.isRequired,
  space_uuid: PropTypes.string,
  droppableId: PropTypes.string,
  forSource: PropTypes.oneOf(
    Object.values(OnboardingMenuForSourceEnum).map((item) => item),
  ).isRequired,
  onConnectionsClicked: PropTypes.func.isRequired,
  getIsOpenCollapse: PropTypes.func.isRequired,
  getIsActiveCollapseItem: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
FoldersSection.defaultProps = {
  droppableId: 'spaceDisconnectedFoldersDroppableId',
};
