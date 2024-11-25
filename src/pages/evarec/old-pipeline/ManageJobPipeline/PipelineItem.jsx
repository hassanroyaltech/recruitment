// React
import React from 'react';

// Styled components
import styled from 'styled-components';

// Draggable capability
import { Draggable } from 'react-beautiful-dnd';

// JobCard accepting names and match percentage
import JobCard from './JobCard';
import { Can } from '../../../../utils/functions/permissions';

const primaryButton = 0;
const keyCodes = {
  enter: 13,
  escape: 27,
  arrowDown: 40,
  arrowUp: 38,
  tab: 9,
};
const Div = styled.div``;

/**
 * Main function component to return a PipelineItem
 * @param candidate
 * @param index
 * @param isSelected
 * @param isGhosting
 * @param selectionCount
 * @param rest
 * @returns {JSX.Element}
 */
const PipelineItem = ({
  candidate,
  index,
  isSelected,
  isGhosting,
  selectionCount,
  piplineUuid,
  stages,
  isDisabled,
  ...rest
}) => {
  const onKeyDown = (event, provided, snapshot) => {
    if (event.defaultPrevented) return;

    if (snapshot.isDragging) return;

    if (event.keyCode !== keyCodes.enter) return;

    // we are using the event for selection
    event.preventDefault();

    performAction(event);
  };

  const wasToggleInSelectionGroupKeyUsed = (e) => {
    const isUsingWinOrLinux
      = navigator.platform.indexOf('Linux') >= 0
      || navigator.platform.indexOf('Win') >= 0;
    return isUsingWinOrLinux ? e.ctrlKey : e.metaKey;
  };

  const performAction = (e) => {
    const { toggleSelection, toggleSelectionInGroup, task } = rest;

    // if (wasToggleInSelectionGroupKeyUsed(e)) {
    //   toggleSelectionInGroup(task.id);
    //   return;
    // }
    toggleSelectionInGroup(task.id);
    // toggleSelection(task.id);
  };

  const onClick = (e) => {
    if (e.defaultPrevented) return;

    if (e.button !== primaryButton) return;

    // marking the event as used
    e.preventDefault();
    performAction(e);
  };
  /**
   * Return the JSX of the component
   * @return {JSX.Element}
   */
  return (
    <Draggable
      isDragDisabled={isDisabled || !Can('create', 'move_candidates')}
      draggableId={candidate.id}
      index={index}
    >
      {(provided, snapshot) => {
        const shouldShowSelection = snapshot.isDragging && selectionCount > 1;
        return (
          <Div
            {...provided.draggableProps}
            ref={provided.innerRef}
            onKeyDown={(e) => onKeyDown(e, provided, snapshot)}
            isDragging={snapshot.isDragging}
          >
            <JobCard
              {...rest}
              handleClick={onClick}
              dragHandleProps={provided.dragHandleProps}
              isNew={candidate.is_new}
              isCompleted={candidate.is_completed}
              title={candidate.name}
              subtitle={candidate.email}
              reference_number={candidate.reference_number}
              applicant_number={candidate.applicant_number}
              job_uuid={candidate.job_uuid}
              num_of_discussion={candidate.num_of_discussion}
              // rating={candidate.rating}
              candidate_uuid={candidate.candidate_uuid}
              uuid={candidate.id}
              profile_image={candidate.profile_image}
              user_uuid={candidate.user_uuid}
              isSelected={isSelected}
              isGhosting={isGhosting}
              score={candidate.score}
              applied_at={candidate.register_at}
              profile_uuid={candidate.profile_uuid}
              selectionCount={shouldShowSelection ? selectionCount : false}
              pipeline_uuid={piplineUuid}
              stages={stages}
              isDisabled={isDisabled}
            />
          </Div>
        );
      }}
    </Draggable>
  );
};
export default PipelineItem;
