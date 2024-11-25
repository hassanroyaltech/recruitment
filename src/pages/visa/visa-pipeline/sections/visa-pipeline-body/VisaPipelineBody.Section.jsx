import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './VisaPipelineBody.Style.scss';
import { StageCandidatesSection } from './sections';
import { GetReorderDraggedItems } from '../../../../evabrand/helpers';
import {
  UpdateVisaStagesReorder,
  VisaCandidateMoveTo,
} from '../../../../../services';
import {
  getIsAllowedPermissionV2,
  showError,
  showSuccess,
} from '../../../../../helpers';
import { VisaDefaultStagesEnum } from '../../../../../enums';
import i18next from 'i18next';
import { useSelector } from 'react-redux';
import { lighten } from '@mui/material';
import { VisaUsedConfirmDialog } from '../../dialogs';
import { ManageVisasPermissions } from '../../../../../permissions';

export const VisaPipelineBodySection = ({
  pipelineDetails,
  isLoading,
  onIsLoadingChanged,
  onPipelineDetailsChanged,
  isForceToReloadCandidates,
  getIsDroppableSelectedCandidates,
  getFilteredCandidates,
  isDisabledAllDragging,
  onIsDisabledAllDraggingChanged,
  candidatesFilters,
  onIsOpenDialogsChanged,
  isOpenDialogs,
  onLoadedCandidatesChanged,
  temporaryMovedCandidates,
  onTemporaryMovedCandidatesChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  // for current dragging candidate item (in bulk select mode or not)
  const [draggingCandidate, setDraggingCandidate] = useState(null);
  const [draggingCandidateDetails, setDraggingCandidateDetails] = useState(null);
  const confirmMoveTimesRef = useRef(null);
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
  // const [isOpenCandidateDetailsDialog, setIsOpenCandidateDetailsDialog] = useState(false);

  /**
   * @param stageItem
   * @param stageIndex
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the if the stage accept external candidates
   */
  // const getIsDropCandidateDisabled = useCallback(
  //   (stageItem) =>
  //     true,
  //   // || !getIsDroppableSelectedCandidates(stageItem.uuid),
  //   []
  // );

  /**
   * @param newValue - object
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the update the dragging candidate details from child
   */
  const onDraggingCandidateDetailsChanged = useCallback((newValue) => {
    setDraggingCandidateDetails(newValue);
  }, []);

  /**
   * @param stageItem
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the if the stage can accept to remove any candidate from it
   */
  const getIsDragCandidateDisabled = useMemo(
    () => (stageItem) =>
      stageItem.value === VisaDefaultStagesEnum.Used.key
      || stageItem.value === VisaDefaultStagesEnum.Declined.key
      || !getIsAllowedPermissionV2({
        permissions,
        permissionId: ManageVisasPermissions.ManageStatus.key,
      }),
    [permissions],
  );

  const onUndoCandidateMoveHandler = (border_number) => () => {
    if (confirmMoveTimesRef.current) clearTimeout(confirmMoveTimesRef.current);
    if (border_number) {
      onIsLoadingChanged(false);
      onIsOpenDialogsChanged('visaUsedConfirm', false);
    }
    onIsDisabledAllDraggingChanged(false);
    onTemporaryMovedCandidatesChanged({
      candidates: [],
      stage_uuid: null,
      stage_title: null,
      is_successfully_confirmed: false,
    });
  };

  const candidatesMoveHandler = (
    candidate_visa_uuid,
    stage_uuid,
    border_number = null,
  ) => {
    // Start timeout
    confirmMoveTimesRef.current = setTimeout(async () => {
      const confirmResponse = await VisaCandidateMoveTo({
        candidate_visa_uuid,
        stage_uuid,
        border_number,
      });
      if (border_number) onIsLoadingChanged(false);

      // removed because there is loading for the candidates from start will happen
      // onIsDisabledAllDraggingChanged(false);
      if (confirmResponse && confirmResponse.status === 200) {
        if (border_number) onIsOpenDialogsChanged('visaUsedConfirm', false);
        onTemporaryMovedCandidatesChanged({
          is_successfully_confirmed: true,
        });
      } else {
        if (!border_number) {
          onIsDisabledAllDraggingChanged(false);
          onIsLoadingChanged(false);
          onTemporaryMovedCandidatesChanged({
            candidates: [],
            stage_uuid: null,
            stage_title: null,
            is_successfully_confirmed: false,
          });
        }
        showError(
          t(
            `${translationPath}${
              (border_number && 'confirm-and-stage-change-failed')
              || 'candidate-stage-change-failed'
            }`,
          ),
          confirmResponse,
        );
      }
    }, 5001);

    // ToastPipeline
    showSuccess(t(`${translationPath}candidate-moved-successfully`), {
      actionHandler: onUndoCandidateMoveHandler(border_number),
      position: 'bottom-center',
      pauseOnHover: false,
      style: { minWidth: 400 },
    });
  };

  /**
   * @param dropEvent
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to reorder stages items or change the dragged candidate stage
   */
  const onDragEndHandler = async (dropEvent) => {
    if (draggingCandidate) setDraggingCandidate(null);
    if (!dropEvent.destination) return;

    if (dropEvent.type === 'candidate') {
      if (
        dropEvent.destination.index === dropEvent.source.index
        && dropEvent.destination.droppableId === dropEvent.source.droppableId
      )
        return;
      if (
        !getIsDroppableSelectedCandidates({
          stageUUID: dropEvent.destination.droppableId,
          isWithMessage: true,
          currentStages: pipelineDetails.stages,
          toCheckCandidates: [],
          currentDraggingCandidate: draggingCandidate,
        })
      )
        return;
      const localSelectedCandidates = [draggingCandidateDetails];
      const localTargetStageItem = pipelineDetails.stages.find(
        (stage) => stage.uuid === dropEvent.destination.droppableId,
      );
      setDraggingCandidateDetails(null);
      const remainingCandidatesAfterFilter = getFilteredCandidates({
        candidates: localSelectedCandidates,
        targetStageItem: localTargetStageItem,
        isWithMessage: true,
      });
      if (
        !remainingCandidatesAfterFilter
        || remainingCandidatesAfterFilter.length === 0
      )
        return;
      onIsDisabledAllDraggingChanged(true);
      onTemporaryMovedCandidatesChanged({
        candidates: remainingCandidatesAfterFilter.map((item) => ({
          ...item.candidate,
        })),
        stage_uuid: localTargetStageItem.uuid,
        stage_title: localTargetStageItem.title,
        is_successfully_confirmed: false,
      });

      if (localTargetStageItem.value === VisaDefaultStagesEnum.Used.key) {
        onIsOpenDialogsChanged('visaUsedConfirm', true);
        return;
      }
      candidatesMoveHandler(
        remainingCandidatesAfterFilter[0].candidate.uuid,
        dropEvent.destination.droppableId,
      );
    }
    if (
      dropEvent.type !== 'stages'
      || dropEvent.destination.index === dropEvent.source.index
    )
      return;
    const reorderedItems = GetReorderDraggedItems(
      dropEvent,
      (pipelineDetails && pipelineDetails.stages) || [],
    );
    if (!reorderedItems) return;
    const toSaveReorderedStages = [...(reorderedItems || [])];
    onIsLoadingChanged(true);
    const response = await UpdateVisaStagesReorder({
      stages: toSaveReorderedStages.map((item, index) => ({
        uuid: item.uuid,
        order: index,
      })),
    });
    onIsLoadingChanged(false);
    if (response && response.status === 200) {
      reorderedItems.map((item, index) => {
        // eslint-disable-next-line no-param-reassign
        item.order = index;
        return undefined;
      });
      showSuccess(t(`${translationPath}stages-reordered-successfully`));
      onPipelineDetailsChanged({ ...pipelineDetails, stages: reorderedItems });
    } else showError(t(`${translationPath}stages-reorder-failed`));
  };

  /**
   * @param dropEvent
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to save the selected candidateItem on the start of dragging
   */
  const onDragStartHandler = (dropEvent) => {
    if (dropEvent.type !== 'candidate') return;
    const localStageItem = pipelineDetails.stages.find(
      (item) => item.uuid === dropEvent.source.droppableId,
    );
    if (localStageItem)
      setDraggingCandidate({
        stage: localStageItem,
        candidate: {
          uuid: dropEvent.draggableId,
        },
      });
  };

  /**
   * @param wheelEvent
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is move the scroll to the left or right on scroll over stages (during candidate dragging)
   * not working properly because of the library bug
   */
  const onScrollHandler = (wheelEvent) => {
    if (!draggingCandidate) return;
    if (i18next.dir() === 'ltr')
      wheelEvent.currentTarget.scrollTo({
        top: 0,
        left:
          wheelEvent.currentTarget.scrollLeft
          + wheelEvent.deltaY
          + ((wheelEvent.deltaY < 0 && -300) || +300),
        behavior: 'smooth',
      });
    else
      wheelEvent.currentTarget.scrollTo({
        top: 0,
        left:
          wheelEvent.currentTarget.scrollLeft
          - wheelEvent.deltaY
          + ((wheelEvent.deltaY > 0 && -300) || +300),
        behavior: 'smooth',
      });
  };

  useEffect(
    () => () => {
      if (confirmMoveTimesRef.current) clearTimeout(confirmMoveTimesRef.current);
    },
    [],
  );

  return (
    <div className="visa-pipeline-body-section-wrapper section-wrapper">
      <DragDropContext onDragEnd={onDragEndHandler} onDragStart={onDragStartHandler}>
        <Droppable
          direction="horizontal"
          type="stages"
          droppableId="stageManagementDroppableId"
        >
          {(droppableProvided) => (
            <div
              className="stages-items-wrapper"
              {...droppableProvided.droppableProps}
              ref={droppableProvided.innerRef}
              onWheel={onScrollHandler}
            >
              {pipelineDetails.stages
                && pipelineDetails.stages.map(
                  (item, index, items) =>
                    item.candidates && (
                      <Draggable
                        key={`stageItemKey${item.uuid}${index + 1}`}
                        draggableId={item.uuid}
                        index={index}
                        isDragDisabled={
                          items.length < 2
                          || isLoading
                          || isDisabledAllDragging
                          || !getIsAllowedPermissionV2({
                            permissions,
                            permissionId: ManageVisasPermissions.ManagePipeline.key,
                          })
                        }
                      >
                        {(provided, snapshot) => (
                          <div
                            className={`stage-item-wrapper${
                              ((items.length < 2
                                || isLoading
                                || isDisabledAllDragging)
                                && ' is-disabled')
                              || ''
                            }${(snapshot.isDragging && ' is-dragging') || ''}`}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                          >
                            <div
                              className="item-content-wrapper"
                              style={
                                (item.stage_color && {
                                  backgroundColor: lighten(item.stage_color, 0.2),
                                })
                                || {}
                              }
                            >
                              <div className="item-header-wrapper">
                                <span className="d-flex-v-center">
                                  <div
                                    className="stage-tag-wrapper"
                                    style={
                                      (item.stage_color && {
                                        backgroundColor: item.stage_color,
                                      })
                                      || {}
                                    }
                                  >
                                    <span
                                      className="fas fa-circle"
                                      style={
                                        (item.stage_color && {
                                          color: item.stage_color,
                                          filter: 'brightness(80%)',
                                        })
                                        || {}
                                      }
                                    />
                                    <span className="px-1">{item.title}</span>
                                  </div>
                                  <span>{item.candidates.length}</span>
                                  <span className="px-1">
                                    {t(`${translationPath}of`)}
                                  </span>
                                  <span>{item.total_candidates || 0}</span>
                                  {(item.stage_limit || item.stage_limit === 0) && (
                                    <span className="text-nowrap">
                                      <span className="px-1">
                                        {t(`${translationPath}max`)}
                                      </span>
                                      <span>({item.stage_limit})</span>
                                    </span>
                                  )}
                                </span>
                              </div>
                              <div className="item-body-wrapper">
                                <StageCandidatesSection
                                  stageItem={item}
                                  stageIndex={index}
                                  stages={items}
                                  draggingCandidate={draggingCandidate}
                                  draggingCandidateDetails={draggingCandidateDetails}
                                  temporaryMovedCandidates={temporaryMovedCandidates}
                                  onLoadedCandidatesChanged={
                                    onLoadedCandidatesChanged
                                  }
                                  onDraggingCandidateDetailsChanged={
                                    onDraggingCandidateDetailsChanged
                                  }
                                  isForceToReloadCandidates={
                                    isForceToReloadCandidates
                                  }
                                  // getIsDropCandidateDisabled={
                                  //   getIsDropCandidateDisabled
                                  // }
                                  getIsDragCandidateDisabled={
                                    getIsDragCandidateDisabled
                                  }
                                  isDisabledAllDragging={isDisabledAllDragging}
                                  isLoading={isLoading}
                                  candidatesFilters={candidatesFilters}
                                  isOpenDialogsChanged={isOpenDialogs}
                                  onIsOpenDialogsChanged={onIsOpenDialogsChanged}
                                  parentTranslationPath={parentTranslationPath}
                                  translationPath={translationPath}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ),
                )}
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {isOpenDialogs.visaUsedConfirm
        && temporaryMovedCandidates.candidates.length > 0 && (
        <VisaUsedConfirmDialog
          candidateItem={temporaryMovedCandidates.candidates[0]}
          stageTitle={temporaryMovedCandidates.stage_title}
          isOpen={isOpenDialogs.visaUsedConfirm}
          onSave={({ border_number }) => {
            candidatesMoveHandler(
              temporaryMovedCandidates.candidates[0].uuid,
              temporaryMovedCandidates.stage_uuid,
              border_number,
            );
          }}
          isLoading={isLoading}
          onIsLoadingChanged={onIsLoadingChanged}
          isOpenChanged={() => {
            onUndoCandidateMoveHandler()();
            onIsOpenDialogsChanged('visaUsedConfirm', false);
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
    </div>
  );
};

VisaPipelineBodySection.propTypes = {
  pipelineDetails: PropTypes.instanceOf(Object).isRequired,
  temporaryMovedCandidates: PropTypes.shape({
    candidates: PropTypes.arrayOf(Object),
    stage_uuid: PropTypes.string,
    stage_title: PropTypes.string,
    is_successfully_confirmed: PropTypes.bool,
  }).isRequired,
  onTemporaryMovedCandidatesChanged: PropTypes.func.isRequired,
  onLoadedCandidatesChanged: PropTypes.func.isRequired,
  onPipelineDetailsChanged: PropTypes.func.isRequired,
  getFilteredCandidates: PropTypes.func.isRequired,
  getIsDroppableSelectedCandidates: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onIsLoadingChanged: PropTypes.func.isRequired,
  isDisabledAllDragging: PropTypes.bool.isRequired,
  onIsDisabledAllDraggingChanged: PropTypes.func.isRequired,
  isForceToReloadCandidates: PropTypes.bool.isRequired,
  search: PropTypes.string,
  candidatesFilters: PropTypes.shape({
    limit: PropTypes.number,
    page: PropTypes.number,
    order_type: PropTypes.oneOf(['ASC', 'DESC']),
    order_by: PropTypes.number,
    search: PropTypes.string,
    start_date: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Object),
    ]),
    end_date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Object)]),
  }),
  onIsOpenDialogsChanged: PropTypes.func,
  isOpenDialogs: PropTypes.shape({
    stagesManagement: PropTypes.bool,
    visaUsedConfirm: PropTypes.bool,
  }),
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};

VisaPipelineBodySection.defaultProps = {
  candidatesFilters: undefined,
  setCandidatesFilters: undefined,
  onIsOpenDialogsChanged: undefined,
  isOpenDialogs: undefined,
};
