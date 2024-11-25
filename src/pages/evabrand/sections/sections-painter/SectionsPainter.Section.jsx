import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@mui/material';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { LoadableImageComponant, LoaderComponent } from '../../../../components';
import {
  EvaBrandSectionsEnum,
  EvaBrandThemesEnum,
  LoadableImageEnum,
  SystemActionsEnum,
} from '../../../../enums';
import './SectionsPainter.Style.scss';
import { getIsAllowedPermissionV2 } from '../../../../helpers';
import { EvaBrandPermissions } from '../../../../permissions';

export const SectionsPainterSection = ({
  sections,
  onDragEnd,
  onSectionActionClicked,
  isLoading,
  isLoadingPartial,
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
  // method to get current layout values enum object
  const getSectionTheme = useMemo(
    () => (layout, type) =>
      Object.values(EvaBrandThemesEnum).find(
        (item) => item.key === layout && item.supportedSections.includes(type),
      ) || {},
    [],
  );
  // method to send selected action to parent without multiple call
  const sectionActionClicked = useCallback(
    (key, item, index) => () => {
      if (onSectionActionClicked) onSectionActionClicked(key, item, index);
    },
    [onSectionActionClicked],
  );
  return (
    <div className="sections-painter-section-wrapper section-wrapper">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="sectionsPainterDroppableId">
          {(droppableProvided) => (
            <div
              className="sections-items-wrapper"
              {...droppableProvided.droppableProps}
              ref={droppableProvided.innerRef}
            >
              {sections.map((item, index) => (
                <Draggable
                  key={`sectionPainterKey${item.type}${index + 1}`}
                  isDragDisabled={
                    !getCurrentType(item.type).isDraggable || isLoadingPartial
                  }
                  draggableId={`menuItemsDragId${item.type}${index + 1}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      className={`sections-item-wrapper${
                        (!getCurrentType(item.type).isDraggable
                          && ' is-not-draggable')
                        || ''
                      }${(snapshot.isDragging && ' is-dragging') || ''}`}
                      {...provided.draggableProps}
                      ref={provided.innerRef}
                    >
                      <LoadableImageComponant
                        classes="background-loader"
                        src={getSectionTheme(item.layout, item.type).drawerImage}
                        alt={
                          item.section_title
                          || t(`${translationPath}section-background`)
                        }
                        type={LoadableImageEnum.image.key}
                      />
                      <div className="section-actions-wrapper">
                        {getCurrentType(item.type).isEditable && (
                          <ButtonBase
                            className="btns theme-shadow miw-32px mx-1"
                            onClick={sectionActionClicked(
                              SystemActionsEnum.edit.key,
                              item,
                              getCurrentType(item.type),
                            )}
                            disabled={
                              !getIsAllowedPermissionV2({
                                permissions,
                                permissionId: EvaBrandPermissions.UpdateEvaBrand.key,
                              })
                            }
                          >
                            <span className={SystemActionsEnum.edit.icon} />
                          </ButtonBase>
                        )}
                        {getCurrentType(item.type).isDeletable && (
                          <ButtonBase
                            className="btns theme-shadow miw-32px mx-1"
                            onClick={sectionActionClicked(
                              SystemActionsEnum.delete.key,
                              item,
                            )}
                            disabled={
                              !getIsAllowedPermissionV2({
                                permissions,
                                permissionId: EvaBrandPermissions.DeleteEvaBrand.key,
                              })
                            }
                          >
                            <span className={SystemActionsEnum.delete.icon} />
                          </ButtonBase>
                        )}
                        {getCurrentType(item.type).isHideable && (
                          <ButtonBase
                            className="btns theme-shadow miw-32px mx-1"
                            disabled={
                              !getIsAllowedPermissionV2({
                                permissions,
                                permissionId: EvaBrandPermissions.UpdateEvaBrand.key,
                              })
                              || isLoadingPartial
                              || isLoading
                            }
                            onClick={sectionActionClicked(
                              SystemActionsEnum.view.key,
                              item,
                            )}
                          >
                            <LoaderComponent
                              isLoadingPartial={isLoadingPartial}
                              isSkeleton
                              wrapperClasses="position-absolute w-100 h-100"
                              skeletonStyle={{ width: '100%', height: '100%' }}
                            />
                            <span
                              className={
                                (item.is_hidden && SystemActionsEnum.view.iconAlt)
                                || SystemActionsEnum.view.icon
                              }
                            />
                          </ButtonBase>
                        )}
                        {getCurrentType(item.type).isDraggable && (
                          <div
                            className={`dragging-btn${
                              ((isLoadingPartial
                                || !getIsAllowedPermissionV2({
                                  permissions,
                                  permissionId:
                                    EvaBrandPermissions.UpdateEvaBrand.key,
                                }))
                                && ' is-disabled')
                              || ''
                            }`}
                            {...provided.dragHandleProps}
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
    </div>
  );
};

SectionsPainterSection.propTypes = {
  sections: PropTypes.instanceOf(Array),
  onDragEnd: PropTypes.func.isRequired,
  onSectionActionClicked: PropTypes.func,
  isLoadingPartial: PropTypes.bool,
  isLoading: PropTypes.bool,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};
SectionsPainterSection.defaultProps = {
  sections: [],
  onSectionActionClicked: undefined,
  isLoadingPartial: false,
  isLoading: false,
  translationPath: 'SectionsPainterSection.',
};
