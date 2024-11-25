import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Droppable } from 'react-beautiful-dnd';
import { GetAllVisaStageCandidates } from '../../../../../../../services';
import { PipelineStageMovementTypes } from '../../../../../../../enums/Pages/PipelineStageMovementTypes.Enum';
import './StageCandidates.Style.scss';
import { CandidatesCard } from './cards';

export const StageCandidatesSection = memo(
  ({
    stageItem,
    stages,
    stageIndex,
    draggingCandidate,
    temporaryMovedCandidates,
    onDraggingCandidateDetailsChanged,
    onLoadedCandidatesChanged,
    isForceToReloadCandidates,
    // getIsDropCandidateDisabled,
    getIsDragCandidateDisabled,
    isDisabledAllDragging,
    isLoading,
    candidatesFilters,
    parentTranslationPath,
    translationPath,
  }) => {
    const [localFilter, setLocalFilter] = useState({
      page: 1,
      limit: 10,
      stage_uuid: null,
    });
    const [isLocalLoading, setIsLocalLoading] = useState(false);
    const isLoadingRef = useRef(null);

    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description this method is to get the candidates details for each stage
     */
    const getStageCandidates = useCallback(async () => {
      if (localFilter.page <= 1) return;
      const response = await GetAllVisaStageCandidates(localFilter);
      isLoadingRef.current = false;
      setIsLocalLoading(false);
      if (response && response.status === 200)
        onLoadedCandidatesChanged(
          {
            candidates: response.data.result.candidate_visas,
            total_candidates: response.data.result.total,
          },
          localFilter.stage_uuid,
          true,
        );
    }, [localFilter, onLoadedCandidatesChanged]);

    /**
     * @param { currentTarget } - html object
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description this method is to handle load more on scroll or scroll not exist
     */
    const onScrollHandler = useCallback(
      ({ currentTarget }) => {
        if (
          (currentTarget.scrollHeight <= currentTarget.clientHeight
            || currentTarget.scrollTop + currentTarget.clientHeight
              >= currentTarget.firstChild.clientHeight - 10)
          && stageItem.candidates.length < stageItem.total_candidates
          && !isLoadingRef.current
        )
          setLocalFilter((items) => ({ ...items, page: items.page + 1 }));
      },
      [stageItem.candidates.length, stageItem.total_candidates],
    );

    // this is to handle the get for candidate on init & local filter change
    useEffect(() => {
      if (localFilter.page > 1) {
        setIsLocalLoading(true);
        isLoadingRef.current = true;
        getStageCandidates();
      }
    }, [getStageCandidates, localFilter]);

    // this is to update the local filter & reset the active page on any of the filter
    // values changed
    useEffect(() => {
      setLocalFilter((items) => ({
        ...candidatesFilters,
        ...items,
        page: 1,
        stage_uuid: stageItem.uuid,
      }));
    }, [stageItem.uuid, isForceToReloadCandidates, candidatesFilters]);

    useEffect(() => {
      if (draggingCandidate && stageItem.uuid === draggingCandidate.stage.uuid) {
        const localDraggingCandidate = stageItem.candidates.find(
          (item) => item.uuid === draggingCandidate.candidate.uuid,
        );
        if (localDraggingCandidate && onDraggingCandidateDetailsChanged)
          onDraggingCandidateDetailsChanged({
            candidate: localDraggingCandidate,
            stage: stageItem,
          });
      }
    }, [
      stageItem.candidates,
      draggingCandidate,
      onDraggingCandidateDetailsChanged,
      stageItem,
    ]);

    return (
      <div className={`visa-stage-candidates-section-wrapper section-wrapper`}>
        <Droppable
          type="candidate"
          droppableId={stageItem.uuid}
          // isDropDisabled={getIsDropCandidateDisabled(stageItem)}
        >
          {(droppableProvided, droppableSnapshot) => (
            <div
              className={`candidates-items-wrapper${
                (droppableSnapshot.isDraggingOver && ' is-dragover') || ''
              }`}
              {...droppableProvided.droppableProps}
              ref={droppableProvided.innerRef}
              onScroll={onScrollHandler}
            >
              <div className="draggable-contents-wrapper">
                {stageItem.candidates
                  .filter(
                    (item) =>
                      !temporaryMovedCandidates.stage_uuid
                      || !temporaryMovedCandidates.candidates.some(
                        (el) => el.uuid === item.uuid,
                      ),
                  )
                  .map((item, index) => (
                    <CandidatesCard
                      key={`candidateItemKey${stageIndex + 1}-${index + 1}${
                        item.uuid
                      }`}
                      candidateItem={item}
                      candidateIndex={index}
                      stageItem={stageItem}
                      stages={stages}
                      getIsDragCandidateDisabled={getIsDragCandidateDisabled}
                      isLocalLoading={isLocalLoading}
                      isDisabledAllDragging={isDisabledAllDragging}
                      isLoading={isLoading}
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                    />
                  ))}
                {stageItem.uuid === temporaryMovedCandidates.stage_uuid
                  && temporaryMovedCandidates.candidates.map((item, index) => (
                    <CandidatesCard
                      key={`candidateTempItemKey${stageIndex + 1}-${index + 1}`}
                      candidateItem={item}
                      candidateIndex={index}
                      stageItem={stageItem}
                      stages={stages}
                      isTempItem
                      getIsDragCandidateDisabled={getIsDragCandidateDisabled}
                      isLocalLoading={isLocalLoading}
                      isDisabledAllDragging={isDisabledAllDragging}
                      isLoading={isLoading}
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                    />
                  ))}
              </div>
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    );
  },
);
StageCandidatesSection.displayName = 'StageCandidatesSection';
StageCandidatesSection.propTypes = {
  stageItem: PropTypes.shape({
    uuid: PropTypes.string,
    total_candidates: PropTypes.number,
    candidates: PropTypes.instanceOf(Array), // this is the candidates that loaded by the first page (bulk candidates)
    move_in_out_type: PropTypes.oneOf(
      Object.values(PipelineStageMovementTypes).map((item) => item.key),
    ),
    actions: PropTypes.instanceOf(Array),
  }).isRequired,
  stageIndex: PropTypes.number.isRequired,
  isForceToReloadCandidates: PropTypes.bool.isRequired,
  draggingCandidate: PropTypes.instanceOf(Object),
  temporaryMovedCandidates: PropTypes.shape({
    candidates: PropTypes.arrayOf(Object),
    stage_uuid: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    is_successfully_confirmed: PropTypes.bool,
  }).isRequired,
  stages: PropTypes.instanceOf(Array).isRequired,
  onLoadedCandidatesChanged: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isDisabledAllDragging: PropTypes.bool.isRequired,
  // getIsDropCandidateDisabled: PropTypes.func.isRequired,
  getIsDragCandidateDisabled: PropTypes.func.isRequired,
  onDraggingCandidateDetailsChanged: PropTypes.func.isRequired,
  candidatesFilters: PropTypes.shape({
    limit: PropTypes.number,
    page: PropTypes.number,
    order_type: PropTypes.oneOf(['ASC', 'DESC']),
    order_by: PropTypes.number,
    search: PropTypes.string,
    start_date: PropTypes.oneOfType([PropTypes.string, Date]),
    end_date: PropTypes.oneOfType([PropTypes.string, Date]),
  }),
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
StageCandidatesSection.defaultProps = {
  draggingCandidate: undefined,
  candidatesFilters: undefined,
};
