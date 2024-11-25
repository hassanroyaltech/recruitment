import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { EvaBrandSectionsEnum, SystemActionsEnum } from '../../../../enums';
import './MenuManagement.Style.scss';
import { LoaderComponent } from '../../../../components';
import { GetSectionTitle } from '../../helpers';
import { getIsAllowedPermissionV2 } from '../../../../helpers';
import { EvaBrandPermissions } from '../../../../permissions';

// component that will draw menu
export const MenuManagementSection = ({
  onDragEnd,
  onActionClickedHandler,
  menu,
  addSectionsClicked,
  isLoadingPartial,
  isLoading,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
  // method to get current type values enum object
  const getCurrentType = useMemo(
    () => (type) =>
      Object.values(EvaBrandSectionsEnum).find((item) => item.key === type) || {},
    [],
  );
  // method to send to parent selected action if exist
  // & useCallback to prevent recall on each item map
  const onActionClicked = useCallback(
    (key, item, typeEnum) => () => {
      if (onActionClickedHandler) onActionClickedHandler(key, item, typeEnum);
    },
    [onActionClickedHandler],
  );
  return (
    <div className="menu-management-section-wrapper section-wrapper">
      <div className="menu-card-wrapper">
        <div className="menu-header-wrapper header-text">
          <span>{t(`${translationPath}sections-menu`)}</span>
        </div>
        <div className="menu-body-wrapper">
          <LoaderComponent
            wrapperClasses="d-flex-v-center-h-between flex-wrap p-3"
            numberOfRepeat={3}
            skeletonItems={[
              { variant: 'text', className: 'text-item-loader-wrapper' },
              {
                variant: 'circular',
                className: 'circle-item-loader-wrapper',
              },
              {
                variant: 'circular',
                className: 'circle-item-loader-wrapper',
              },
              {
                variant: 'circular',
                className: 'circle-item-loader-wrapper',
              },
            ]}
            isLoading={isLoading}
          />
          {!isLoading && (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="menuManagementDroppableId">
                {(droppableProvided) => (
                  <div
                    className="menu-items-wrapper"
                    {...droppableProvided.droppableProps}
                    ref={droppableProvided.innerRef}
                  >
                    {menu.map((item, index) => (
                      <Draggable
                        key={`menuItemsDragKey${item.type}${index + 1}`}
                        isDragDisabled={
                          !getCurrentType(item.type).isDraggable || isLoadingPartial
                        }
                        draggableId={`menuItemsDragId${item.type}${index + 1}`}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            className={`menu-item-wrapper${
                              (!getCurrentType(item.type).isDraggable
                                && ' is-not-draggable')
                              || ''
                            }${(snapshot.isDragging && ' is-dragging') || ''}`}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                          >
                            <div className="menu-item-icon-name-wrapper">
                              <span className={getCurrentType(item.type).icon} />
                              <span className="menu-item-name">
                                {GetSectionTitle(
                                  menu,
                                  item,
                                  parentTranslationPath,
                                ) || item.section_title}
                              </span>
                            </div>
                            <div className="menu-item-actions-wrapper">
                              {getCurrentType(item.type).isEditable && (
                                <ButtonBase
                                  className="btns theme-shadow miw-32px mx-1"
                                  onClick={onActionClicked(
                                    SystemActionsEnum.edit.key,
                                    item,
                                    getCurrentType(item.type),
                                  )}
                                  disabled={
                                    !getIsAllowedPermissionV2({
                                      permissions,
                                      permissionId:
                                        EvaBrandPermissions.UpdateEvaBrand.key,
                                    })
                                  }
                                >
                                  <span className={SystemActionsEnum.edit.icon} />
                                </ButtonBase>
                              )}
                              {getCurrentType(item.type).isDeletable && (
                                <ButtonBase
                                  className="btns theme-shadow miw-32px mx-1"
                                  onClick={onActionClicked(
                                    SystemActionsEnum.delete.key,
                                    item,
                                    getCurrentType(item.type),
                                  )}
                                  disabled={
                                    !getIsAllowedPermissionV2({
                                      permissions,
                                      permissionId:
                                        EvaBrandPermissions.DeleteEvaBrand.key,
                                    })
                                  }
                                >
                                  <span className={SystemActionsEnum.delete.icon} />
                                </ButtonBase>
                              )}
                              {getCurrentType(item.type).isDraggable && (
                                <div
                                  className={`dragging-btn mx-1${
                                    ((isLoadingPartial
                                      || !getIsAllowedPermissionV2({
                                        permissions,
                                        permissionId:
                                          EvaBrandPermissions.UpdateEvaBrand.key,
                                      }))
                                      && ' is-disabled')
                                    || ''
                                  }`}
                                >
                                  <span className="fas fa-ellipsis-v" />
                                  <span className="fas fa-ellipsis-v" />
                                </div>
                              )}
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
          )}
        </div>
        <div className="menu-footer-wrapper">
          <ButtonBase
            className="btns-icon theme-transparent"
            onClick={addSectionsClicked}
          >
            <span className="fas fa-plus" />
          </ButtonBase>
        </div>
      </div>
    </div>
  );
};

MenuManagementSection.propTypes = {
  menu: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      isDraggable: PropTypes.bool,
      isDroppable: PropTypes.bool,
    }),
  ),
  onDragEnd: PropTypes.func,
  isLoadingPartial: PropTypes.bool,
  isLoading: PropTypes.bool,
  onActionClickedHandler: PropTypes.func,
  addSectionsClicked: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};
MenuManagementSection.defaultProps = {
  menu: [],
  translationPath: '',
  onDragEnd: undefined,
  isLoadingPartial: false,
  isLoading: false,
  onActionClickedHandler: undefined,
  addSectionsClicked: undefined,
};
