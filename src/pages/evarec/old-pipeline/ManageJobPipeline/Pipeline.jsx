import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { useToasts } from 'react-toast-notifications';
import { DragIndicator } from '../../../../shared/icons';
import {
  Input,
  InputGroup,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  Button,
} from 'reactstrap';
import { Can } from '../../../../utils/functions/permissions';
import Tooltip from '@mui/material/Tooltip';

// API
import { evarecAPI } from 'api/evarec';

// URLs
import urls from '../../../../api/urls';

// Styled components
import {
  Container,
  ColumnContainer,
  StageBarWrapper,
  StageInfo,
  StageActions,
  InfiniteScrollWrapper,
  StageTitleWrapper,
} from '../../../../components/Styled/Pipeline';

// Pipeline Item
import { generateHeaders } from '../../../../api/headers';
import { CheckboxesComponent } from '../../../../components';
import { useTranslation } from 'react-i18next';
import { showError } from '../../../../helpers';
import PipelineItem from './PipelineItem';

const translationPath = '';
const parentTranslationPath = 'EvarecRecManage';

const Pipeline = (props) => {
  const { t } = useTranslation(parentTranslationPath);

  const { addToast } = useToasts(); // Toasts

  const selectColumn = () => {
    props.setSelectedTaskIds(props.stage.candidatesIds);
    props.setSelectedColumn(props.stage.id);
  };

  const selectCandidate = (id) => {
    if (props.selectedTaskIds.indexOf(id) === -1)
      props.setSelectedTaskIds([...props.selectedTaskIds, id]);
    else {
      const localTaskIds = [...props.selectedTaskIds];
      localTaskIds.splice(localTaskIds.indexOf(id), 1);
      props.setSelectedTaskIds([...localTaskIds]);
    }
  };

  // useEffect(() => {
  //   // if (props.selectedColumn !== props.stage.id) {
  //   //   props.unselectAll();
  //   //   return;
  //   // }
  //   // props.setSelectedTaskIds(props.stage.candidatesIds);
  // }, [props.selectedColumn]);

  const [currentPage, setCurrentPage] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [sort, setSort] = useState(null);

  const loadMore = async () => {
    setIsLoadingMore(true);
    evarecAPI
      .getPipelineStage(props.match.params.id, props.stage.id, sort, props?.filter)
      .then((res) => {
        const { results } = res.data;

        if (results) {
          props.addNewCandidates(props.stage.id, results.candidate);
          setCurrentPage((item) => item + 1);
        }
        setIsLoadingMore(false);
      })
      .catch((error) => {
        setIsLoadingMore(false);
        showError(t('Shared:failed-to-get-saved-data'), error);
      });
  };

  // Change Stage Title
  const [showInputs, setShowInput] = useState(false);
  const [stageTitle, setStageTitle] = useState(props.stage.title);
  const [isWorking, setIsWorking] = useState(false);

  const sortingCriteria = [
    {
      id: 0,
      title: t(`${translationPath}score-low-to-high`),
      order_type: 'ASC',
      order_by: 1,
    },
    {
      id: 1,
      title: t(`${translationPath}score-high-to-low`),
      order_type: 'DESC',
      order_by: 1,
    },
    {
      id: 2,
      title: t(`${translationPath}applied-date-old-to-new`),
      order_type: 'ASC',
      order_by: 2,
    },
    {
      id: 3,
      title: t(`${translationPath}applied-date-new-to-old`),
      order_type: 'DESC',
      order_by: 2,
    },
  ];

  const showJobCandidateModalHandler = (
    v1,
    v2,
    v3,
    v4,
    v5,
    v6,
    v7,
    v8,
    v9,
    v10,
    v11,
    v12,
  ) => {
    if (currentPage > 0) setCurrentPage(0);
    props.showJobCandidateModal(v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12);
  };
  useEffect(() => {
    if (sort) {
      setIsLoadingMore(true);
      evarecAPI
        .getPipelineStage(props.match.params.id, props.stage.id, sort, props?.filter)
        .then((res) => {
          const { results } = res.data;

          if (results) {
            props.sortCandidates(props.stage.id, results.candidate);
            setCurrentPage((item) => item + 1);
          }
          setIsLoadingMore(false);
        })
        .catch((error) => {
          setIsLoadingMore(false);
          showError(t('Shared:failed-to-get-saved-data'), error);
        });
    }
  }, [t, sort]);

  const changeStageTitle = async () => {
    setIsWorking(true);

    await axios
      .put(
        urls.evarec.ats.UPDATE_STAGE,
        {
          stage_uuid: props.stage.id,
          title: stageTitle,
        },
        {
          headers: generateHeaders(),
        },
      )
      .then((res) => {
        addToast(t(`${translationPath}stage-title-updated`), {
          appearance: 'success',
          autoDismiss: true,
        });
        setIsWorking(false);
        setShowInput(false);
        props.changeStageTitle(props.stage.id, stageTitle);
      })
      .catch((error) => {
        setIsWorking(false);
        showError(t('Shared:failed-to-get-saved-data'), error);
      });
  };

  return (
    <Draggable draggableId={props.stage.id} index={props.index}>
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
                      <span>{props.stage?.total_with_filters}</span>
                    </span>
                  </div>
                )}
                {showInputs && (
                  <div className="d-flex">
                    <InputGroup>
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
                      <InputGroup addonType="prepend">
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
                          disabled={
                            isWorking || !stageTitle || stageTitle.length < 3
                          }
                        >
                          {isWorking && <i className="fas fa-spinner fa-pulse" />}
                          {!isWorking && <i className="fas fa-check" />}
                        </Button>
                      </InputGroup>
                    </InputGroup>
                  </div>
                )}
                {showInputs && (!stageTitle || stageTitle.length < 3) && (
                  <div className="c-error fz-10px">
                    <span>{`${t('Shared:must-be-more-than')} ${2}`}</span>
                  </div>
                )}
              </StageTitleWrapper>
              {/* <p className='font-14 m-0'>
                {' '}
                {props.stage.candidatesIds
                  ? `${props.stage.candidatesIds.length}  Applicants`
                  : '0 Applicants'}
              </p> */}
            </StageInfo>
            {(Can('edit', 'ats') || Can('create', 'ats')) && (
              <>
                <StageActions className="stage-actions">
                  <UncontrolledDropdown className="d-inline-flex-v-center">
                    <Tooltip title="Sort">
                      <span>
                        <DropdownToggle
                          className="btn-sm justfiy-self-end form-control-alternative text-gray btn"
                          tag="span"
                        >
                          <i className="fas fa-sort-amount-up" />
                        </DropdownToggle>
                      </span>
                    </Tooltip>
                    <DropdownMenu end>
                      {sortingCriteria.map((v, index) => (
                        <DropdownItem
                          key={index}
                          color="link"
                          onClick={() => {
                            setCurrentPage(0);
                            setSort(v);
                          }}
                          className="btn-sm justfiy-self-end text-dark"
                        >
                          {v.title}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </UncontrolledDropdown>
                  <DragIndicator {...provided.dragHandleProps} />
                  <CheckboxesComponent
                    idRef={`stage${props.stage.id}`}
                    singleChecked={props.selectedColumn === props.stage.id}
                    onSelectedCheckboxChanged={selectColumn}
                  />
                </StageActions>
              </>
            )}
          </StageBarWrapper>
          <div
            id="sortable6"
            className="p-0 ats-cards scroll_content_y overflow-auto scroll-content"
          >
            <Droppable
              isDragDisabled={props.isDisabled}
              droppableId={props.stage.id}
              type="candidate"
            >
              {(provided, snapshot) => (
                <Container
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  isDraggingOver={snapshot.isDraggingOver}
                >
                  {props.candidates.map((candidate, i) => {
                    const isSelected = props.selectedTaskIds.includes(candidate.id);
                    const isGhosting
                      = isSelected
                      && props.draggingTaskId
                      && props.draggingTaskId !== candidate.id;
                    return (
                      <PipelineItem
                        {...props}
                        showJobCandidateModal={showJobCandidateModalHandler}
                        key={candidate.id}
                        candidate={candidate}
                        index={i}
                        task={candidate}
                        isSelected={isSelected}
                        isGhosting={isGhosting}
                        isDisabled={props.isDisabled}
                        selectionCount={props.selectedTaskIds.length}
                        setSelected={selectCandidate}
                        stages={Object.values(props?.data?.stages)}
                      />
                    );
                  })}
                  {provided.placeholder}
                  {props?.candidates
                    && props?.stage?.total_with_filters > props?.candidates?.length && (
                    <InfiniteScrollWrapper className="my-4">
                      <Button
                        disabled={isLoadingMore}
                        onClick={loadMore}
                        color="primary"
                        className="btn-sm mt-2"
                      >
                        {isLoadingMore && (
                          <>
                            <i className="fas fa-spinner fa-pulse mr-1-reversed" />
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

export default Pipeline;
