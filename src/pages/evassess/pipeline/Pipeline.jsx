/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { useState, useEffect } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import urls from 'api/urls';
import { useToasts } from 'react-toast-notifications';

import { DragIndicator } from 'shared/icons';
import { Input, InputGroup, Button } from 'reactstrap';
// Styled components
import {
  Container,
  ColumnContainer,
  StageBarWrapper,
  StageInfo,
  StageActions,
  InfiniteScrollWrapper,
  StageTitleWrapper,
} from 'components/Styled/Pipeline';

import { Can } from 'utils/functions/permissions';
import { CheckboxesComponent } from 'components';
import { useTranslation } from 'react-i18next';
import Item from './Item';
import { HttpServices, showError } from '../../../helpers';

/**
 * EVA-SSESS Pipeline component
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const translationPath = 'PipelineComponent.';
export const Pipeline = (props) => {
  const { t } = useTranslation(props.parentTranslationPath);
  /**
   * Toast notifications
   */
  const { addToast } = useToasts();

  /**
   * Pagination states
   */
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  /**
   * Stage title states
   */
  const [showInputs, setShowInput] = useState(false);
  const [stageTitle, setStageTitle] = useState(props.stage.title);
  const [isWorking, setIsWorking] = useState(false);
  const [candidatesData, setCandidatesData] = useState([]);

  const selectColumn = () => {
    props.setSelectedTaskIds(props.stage.candidatesIds);
    props.setSelectedColumn(props.stage.id);
    props.setSelectedStageTitle(props.stage.title);
    props.setSelectedTaskItems(
      props.candidates?.map((item) => ({ ...item, stage_uuid: props.stage?.id })),
    );
  };

  useEffect(() => {
    setCandidatesData(
      props.candidates?.map((item) => ({ ...item, stage_uuid: props.stage?.id })),
    );
  }, [props.candidates, props.stage.id]);

  const selectCandidate = (id) => {
    if (props.selectedTaskIds.indexOf(id) === -1)
      props.setSelectedTaskIds([...props.selectedTaskIds, id]);
    else {
      const localTaskIds = [...props.selectedTaskIds];
      localTaskIds.splice(localTaskIds.indexOf(id), 1);
      props.setSelectedTaskIds([...localTaskIds]);
    }
  };

  /**
   * Load more applicants
   * @returns {Promise<void>}
   */
  const loadMore = async () => {
    setIsLoadingMore(true);
    await HttpServices.get(urls.evassess.PIPELINE_STAGE, {
      params: {
        uuid: props?.match?.params?.id,
        stage_uuid: props?.stage?.id,
        limit: 30,
        page: currentPage + 1,
        query: props.filters?.query || null,
        applied_date: props.filters?.applied_date || null,
        is_completed: props?.filters?.completeness?.id,
        candidate_order_by: props?.filters?.sort?.candidate_order_by,
        order_by: props?.filters?.sort?.order_by,
      },
    })
      .then((res) => {
        props.addNewCandidates(props?.stage?.id, res.data.results.candidate);
        setCurrentPage((items) => items + 1);
        setIsLoadingMore(false);
      })
      .catch((error) => {
        setIsLoadingMore(false);
        showError(t('Shared:failed-to-get-saved-data'), error);
      });
  };

  /**
   * Change the stage title
   * @returns {Promise<void>}
   */
  const changeStageTitle = async () => {
    setIsWorking(true);

    await HttpServices.put(urls.evassess.PIPELINE_ADD_STAGE, {
      stage_uuid: props?.stage?.id,
      title: stageTitle,
    })
      .then(() => {
        addToast(t(`${translationPath}stage-title-updated-successfully`), {
          appearance: 'success',
          autoDismiss: true,
        });
        setIsWorking(false);
        setShowInput(false);
        props.changeStageTitle(props?.stage?.id, stageTitle);
      })
      .catch((error) => {
        setIsWorking(false);

        showError(t(`${translationPath}stage-title-update-failed`), error);
      });
  };

  /**
   * Render the pipeline
   * @returns {JSX.Element}
   */
  return (
    <Draggable draggableId={props?.stage?.id} index={props.index}>
      {(provided, snapshot) => (
        <ColumnContainer
          {...provided.draggableProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
          id={`stage-${props.id}`}
          className={props.className}
        >
          <StageBarWrapper className="stage-bar-wrapper">
            <StageInfo className="stage-info">
              <StageTitleWrapper className="font-16 text-capitalize m-0 stage-title-wrapper">
                {/* <i className={props.stage.icon} /> */}
                {!showInputs && (
                  <div
                    tabIndex={0}
                    role="button"
                    className="d-flex-center"
                    onDoubleClick={() => {
                      setShowInput(true);
                    }}
                  >
                    <span className="c-primary fz-default">{props.stage.title}</span>
                    <span className="c-gray fz-default fw-default text-nowrap px-2">
                      <span>{props?.candidates?.length}</span>
                      <span className="px-1">{t(`${translationPath}of`)}</span>
                      <span>{props.stage?.total_candidates_with_filters}</span>
                    </span>
                  </div>
                  // <>
                  //   <h6
                  //     role="button"
                  //     tabIndex={0}
                  //     onDoubleClick={() => {
                  //       setShowInput(true);
                  //     }}
                  //     className="text-black mb-0 h6"
                  //   >
                  //     <span>{props.stage.title}</span>
                  //     <span className="text-gray m-0 px-2">
                  //       {props.stage?.total_candidates_with_filters >= 0
                  //       && props.stage?.total_candidates_with_filters
                  //         <= props.stage?.totalCandidates
                  //       && Object.values(props?.filters).filter((item) => item !== null)
                  //         .length > 0
                  //         ? `${props.stage?.total_candidates_with_filters} ${t(
                  //           `${translationPath}of`,
                  //         )} ${props.stage?.totalCandidates}`
                  //         : props.stage?.totalCandidates}
                  //     </span>
                  //   </h6>
                  // </>
                )}
                {showInputs && (
                  <div className="d-flex">
                    <InputGroup addonType="prepend">
                      <Input
                        disabled={isWorking}
                        className="form-control-sm"
                        id="stageTitle"
                        type="text"
                        name="stageTitle"
                        value={stageTitle}
                        onChange={(e) => {
                          setStageTitle(e.currentTarget.value);
                        }}
                      />
                      <Button
                        className="btn btn-sm btn-secondary"
                        color="secondary"
                        onClick={() => {
                          setShowInput(false);
                          setStageTitle(props.stage.title);
                        }}
                        disabled={isWorking}
                      >
                        <i className="fas fa-times text-danger" />
                      </Button>
                      <Button
                        className="btn btn-sm btn-secondary"
                        color="secondary"
                        onClick={changeStageTitle}
                        disabled={isWorking || !stageTitle || stageTitle.length < 3}
                      >
                        {isWorking && <i className="fas fa-circle-notch fa-spin" />}
                        {!isWorking && <i className="fas fa-check" />}
                      </Button>
                    </InputGroup>
                  </div>
                )}
                {showInputs && (!stageTitle || stageTitle.length < 3) && (
                  <div className="c-error fz-10px">
                    <span>{`${t('Shared:must-be-more-than')} ${2}`}</span>
                  </div>
                )}
              </StageTitleWrapper>
            </StageInfo>
            {(Can('edit', 'video_assessment')
              || Can('create', 'video_assessment')) && (
              <>
                <StageActions className="stage-actions">
                  <DragIndicator {...provided.dragHandleProps} />
                  <CheckboxesComponent
                    idRef={`stage${props?.stage?.id}`}
                    isDisabled={props.isPipelineLoading}
                    singleChecked={props.selectedColumn === props?.stage?.id}
                    onSelectedCheckboxChanged={() => {
                      if (props.stage.id === props.selectedColumn)
                        props.unselectAll();
                      else selectColumn();
                    }}
                  />
                </StageActions>
              </>
            )}
          </StageBarWrapper>
          <div
            id="sortable6"
            className="p-0 ats-cards scroll_content_y overflow-auto scroll-content"
          >
            <Droppable droppableId={props?.stage?.id} type="candidate">
              {(localProvided, localSnapshot) => (
                <Container
                  ref={localProvided.innerRef}
                  {...localProvided.droppableProps}
                  isDraggingOver={localSnapshot.isDraggingOver}
                >
                  {candidatesData
                    && candidatesData.map((candidate, i) => {
                      const isSelected = props.selectedTaskIds.includes(
                        candidate?.id,
                      );
                      const isGhosting
                        = isSelected
                        && props.draggingTaskId
                        && props.draggingTaskId !== candidate?.id;
                      return (
                        <Item
                          {...props}
                          key={`candidatesKey${i + 1}`}
                          candidate={candidate}
                          index={i}
                          task={candidate}
                          isSelected={isSelected}
                          isGhosting={isGhosting}
                          stage_uuid={candidate.stage_uuid}
                          selectedColumn={props.selectedColumn}
                          isPipelineLoading={props.isPipelineLoading}
                          setSelectedColumn={props.setSelectedColumn}
                          parentTranslationPath={props.parentTranslationPath}
                          selectionCount={props.selectedTaskIds.length}
                          setSelected={selectCandidate}
                          setSelectedTaskItems={props.setSelectedTaskItems}
                          isDraggingDisabled={props.isDraggingDisabled}
                        />
                      );
                    })}
                  {localProvided.placeholder}
                  {props.candidates
                    && props.stage.total_candidates_with_filters
                      > props.candidates.length && (
                    <InfiniteScrollWrapper className="my-4">
                      <Button
                        disabled={isLoadingMore}
                        onClick={loadMore}
                        color="primary"
                        className="btn-sm mt-2"
                      >
                        {isLoadingMore && (
                          <>
                            <i className="fas fa-circle-notch fa-spin mr-1-reversed" />
                            <span>{t(`${translationPath}loading`)}</span>
                          </>
                        )}
                        {!isLoadingMore && (
                          <>
                            <i className="fas fa-sync-alt mr-1-reversed" />
                            <span>{t(`${translationPath}load-more`)}</span>
                          </>
                        )}
                      </Button>
                    </InfiniteScrollWrapper>
                  )}
                </Container>
              )}
            </Droppable>
          </div>
        </ColumnContainer>
      )}
    </Draggable>
  );
};
