/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';

import AssessmentCard from './AssessmentCard';
import { Can } from '../../../utils/functions/permissions';

const primaryButton = 0;
const keyCodes = {
  enter: 13,
  escape: 27,
  arrowDown: 40,
  arrowUp: 38,
  tab: 9,
};
const Div = styled.div``;

const Item = ({
  candidate,
  index,
  isSelected,
  isGhosting,
  selectionCount,
  parentTranslationPath,
  setSelectedColumn,
  stage_uuid,
  isPipelineLoading,
  selectedColumn,
  isDraggingDisabled,
  remainingCreditsLimit,
  currentAssessment,
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

  const performAction = () => {
    const { toggleSelectionInGroup, task } = rest;
    toggleSelectionInGroup(task.id);
  };

  const onClick = (e) => {
    if (e.defaultPrevented) return;

    if (e.button !== primaryButton) return;

    // marking the event as used
    e.preventDefault();
    performAction(e);
  };

  return (
    <Draggable
      index={index}
      draggableId={candidate.id}
      isDragDisabled={
        isDraggingDisabled
        || remainingCreditsLimit === 0
        || !Can('create', 'move_candidates')
      }
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
            <AssessmentCard
              {...rest}
              stage_uuid={stage_uuid}
              handleClick={onClick}
              selectedColumn={selectedColumn}
              isPipelineLoading={isPipelineLoading}
              setSelectedColumn={setSelectedColumn}
              dragHandleProps={provided.dragHandleProps}
              isNew={candidate.is_new}
              isCompleted={candidate.is_completed}
              comments={candidate.total_comments}
              avg_rating={candidate.avg_rating}
              title={candidate.name}
              subtitle={candidate.email}
              rating={candidate.rating}
              uuid={candidate.id}
              candidate={candidate}
              profile_image={candidate.profile_image}
              user_uuid={candidate.user_uuid}
              isSelected={isSelected}
              isGhosting={isGhosting}
              parentTranslationPath={parentTranslationPath}
              selectionCount={shouldShowSelection ? selectionCount : false}
              candidate_email={candidate.email}
              similarity={candidate.similarity}
              isDraggable={!isDraggingDisabled}
              remainingCreditsLimit={remainingCreditsLimit}
              currentAssessment={currentAssessment}
            />
          </Div>
        );
      }}
    </Draggable>
  );
};
export default Item;
