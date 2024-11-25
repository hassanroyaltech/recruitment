import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Droppable } from 'react-beautiful-dnd';
import { GetPipelineStageCandidates } from '../../../../../../../../../services';
import { PipelineStageMovementTypes } from '../../../../../../../../../enums/Pages/PipelineStageMovementTypes.Enum';
import './StageCandidates.Style.scss';
import { CandidatesCard } from './cards';

export const StageCandidatesSection = memo(
  ({
    stageItem,
    stages,
    stageIndex,
    isBulkSelect,
    selectedCandidates,
    draggingCandidate,
    temporaryMovedCandidates,
    onDraggingCandidateDetailsChanged,
    selectedAllLoadedStageCandidates,
    selectCandidateChangeHandler,
    onLoadedCandidatesChanged,
    onCandidateClickedHandler,
    isForceToReloadCandidates,
    onSelectedCandidatesChanged,
    getIsSelectedCandidate,
    getIsDropCandidateDisabled,
    getIsDragCandidateDisabled,
    isDisabledAllDragging,
    isLoading,
    pipeline_uuid,
    job_uuid,
    candidatesFilters,
    // setCandidatesFilters,
    // firstPageStagesCandidates,
    parentTranslationPath,
    translationPath,
  }) => {
    const [localFilter, setLocalFilter] = useState({
      page: 1,
      limit: 10,
      pipeline_uuid: null,
      job_uuid: null,
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
      const response = await GetPipelineStageCandidates(localFilter);
      isLoadingRef.current = false;
      setIsLocalLoading(false);
      if (response && response.status === 200)
        onLoadedCandidatesChanged(
          {
            candidates: response.data.results.candidate,
            total_candidates: response.data.results.total_with_filters,
            total_before_filter: response.data.results.total,
          },
          localFilter.stage_uuid,
          true,
        );
      // else
      //   setCandidates({
      //     // results: [
      //     //   {
      //     //     uuid: 'f498d547-c6b4-48ec-bce4-74d071bff205',
      //     //     name: 'Aladdin Mohammad 1',
      //     //     apply_at: 1648621753,
      //     //     score: 50,
      //     //     email: 'a.alawadat+14@elevatus.io',
      //     //     profile_uuid: 'd143442b-974c-4d0e-ad26-51ae4bf67e29',
      //     //     is_new: true,
      //     //   },
      //     //   {
      //     //     uuid: '492a3064-99de-4dc6-8cb5-c251fe78c3a9',
      //     //     name: 'Aladdin Mohammad 2',
      //     //     apply_at: 1648621723,
      //     //     score: 100,
      //     //     email: 'a.alawadat+14@elevatus.io',
      //     //     profile_uuid: 'd143442b-974c-4d0e-ad26-51ae4bf67e29',
      //     //     is_new: false,
      //     //     profile_pic:
      //     //       'https://devapi.elevatustesting.xyz/load/media/?u=0bda9e79-1748-4a45-a2b4-0b51a7ed2980&q=candidate/profile_picture/2022/04/0bda9e79-1748-4a45-a2b4-0b51a7ed2980/original/3XEVorXD1LZAqSaPzTtaWQx0wEIemyuPYKtRLnQ2.jpg',
      //     //   },
      //     // ],
      //     results: [],
      //     totalCount: 0,
      //   });
    }, [localFilter, onLoadedCandidatesChanged]);

    /**
     * @param candidateItem - object
     * @param candidateIndex - number
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description this method is to send the clicked candidate to the parent
     */
    const onCandidateClick = useCallback(
      (candidateItem, candidateIndex) => (event) => {
        event.preventDefault();
        if (onCandidateClickedHandler)
          onCandidateClickedHandler(candidateItem, stageItem, candidateIndex);
      },
      [onCandidateClickedHandler, stageItem],
    );

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
      if (
        localFilter.job_uuid
        && localFilter.pipeline_uuid
        && localFilter.page > 1
      ) {
        setIsLocalLoading(true);
        isLoadingRef.current = true;
        getStageCandidates();
      }
    }, [getStageCandidates, localFilter]);

    // this is to update the local filter & reset the active page on any of the filter
    // values changed
    useEffect(() => {
      setLocalFilter((items) => ({
        ...items,
        ...candidatesFilters,
        page: 1,
        pipeline_uuid,
        job_uuid,
        stage_uuid: stageItem.uuid,
      }));
    }, [
      job_uuid,
      pipeline_uuid,
      stageItem.uuid,
      isForceToReloadCandidates,
      candidatesFilters,
    ]);

    // this is to handle the change for selected candidate on load more data
    useEffect(() => {
      if (
        selectedAllLoadedStageCandidates.indexOf(stageItem.uuid) !== -1
        && stageItem.candidates.length
          > selectedCandidates.filter(
            (candidate) => candidate.stage.uuid === stageItem.uuid,
          ).length
      ) {
        const currentStageSelectedCandidates = selectedCandidates.filter(
          (candidate) => candidate.stage.uuid === stageItem.uuid,
        );
        const notSelectedCandidates = stageItem.candidates
          .filter(
            (item) =>
              !currentStageSelectedCandidates.some(
                (element) => element.candidate.uuid === item.uuid,
              ),
          )
          .map((item) => ({
            stage: stageItem,
            candidate: item,
          }));
        if (notSelectedCandidates.length === 0) return;
        onSelectedCandidatesChanged([
          ...selectedCandidates,
          ...notSelectedCandidates,
        ]);
      }
    }, [
      stageItem.candidates.length,
      selectedAllLoadedStageCandidates,
      stageItem,
      selectedCandidates,
      onSelectedCandidatesChanged,
    ]);

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
      <div
        className={`stage-candidates-section-wrapper section-wrapper${
          (isBulkSelect && ' is-bulk-select') || ''
        }`}
      >
        <Droppable
          type="candidate"
          droppableId={stageItem.uuid}
          isDropDisabled={getIsDropCandidateDisabled(stageItem)}
        >
          {(droppableProvided, droppableSnapshot) => (
            <div
              className={`candidates-items-wrapper${
                (droppableSnapshot.isDraggingOver && ' is-dragover') || ''
              }`}
              {...droppableProvided.droppableProps}
              ref={droppableProvided.innerRef}
              id={`stageId${stageItem.uuid}`}
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
                      key={`candidateItemKey${stageIndex + 1}-${index + 1}`}
                      candidateItem={item}
                      candidateIndex={index}
                      stageItem={stageItem}
                      stages={stages}
                      getIsSelectedCandidate={getIsSelectedCandidate}
                      getIsDragCandidateDisabled={getIsDragCandidateDisabled}
                      selectCandidateChangeHandler={selectCandidateChangeHandler}
                      isLocalLoading={isLocalLoading}
                      isDisabledAllDragging={isDisabledAllDragging}
                      onCandidateClick={onCandidateClick}
                      isBulkSelect={isBulkSelect}
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
                      getIsSelectedCandidate={getIsSelectedCandidate}
                      getIsDragCandidateDisabled={getIsDragCandidateDisabled}
                      selectCandidateChangeHandler={selectCandidateChangeHandler}
                      isLocalLoading={isLocalLoading}
                      isDisabledAllDragging={isDisabledAllDragging}
                      onCandidateClick={onCandidateClick}
                      isBulkSelect={isBulkSelect}
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
  isBulkSelect: PropTypes.bool.isRequired,
  isForceToReloadCandidates: PropTypes.bool.isRequired,
  selectedCandidates: PropTypes.arrayOf(
    PropTypes.shape({
      stage: PropTypes.instanceOf(Object),
      candidate: PropTypes.instanceOf(Object),
      bulkSelectType: PropTypes.number,
    }),
  ).isRequired,
  draggingCandidate: PropTypes.instanceOf(Object),
  temporaryMovedCandidates: PropTypes.shape({
    candidates: PropTypes.arrayOf(Object),
    stage_uuid: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    is_successfully_confirmed: PropTypes.bool,
  }).isRequired,
  selectedAllLoadedStageCandidates: PropTypes.arrayOf(PropTypes.string).isRequired,
  stages: PropTypes.instanceOf(Array).isRequired,
  // firstPageStagesCandidates: PropTypes.instanceOf(Array).isRequired,
  onSelectedCandidatesChanged: PropTypes.func.isRequired,
  onLoadedCandidatesChanged: PropTypes.func.isRequired,
  getIsSelectedCandidate: PropTypes.func.isRequired,
  onCandidateClickedHandler: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isDisabledAllDragging: PropTypes.bool.isRequired,
  getIsDropCandidateDisabled: PropTypes.func.isRequired,
  getIsDragCandidateDisabled: PropTypes.func.isRequired,
  selectCandidateChangeHandler: PropTypes.func.isRequired,
  onDraggingCandidateDetailsChanged: PropTypes.func.isRequired,
  pipeline_uuid: PropTypes.string.isRequired,
  job_uuid: PropTypes.string,
  candidatesFilters: PropTypes.shape({
    order_type: PropTypes.oneOf(['ASC', 'DESC']),
    order_by: PropTypes.number,
    search: PropTypes.string,
  }),
  setCandidatesFilters: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
StageCandidatesSection.defaultProps = {
  draggingCandidate: undefined,
  job_uuid: undefined,
  candidatesFilters: undefined,
  setCandidatesFilters: undefined,
};
