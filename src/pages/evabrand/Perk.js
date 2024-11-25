// React and reactstrap
import React from 'react';
import { Button } from 'reactstrap';

// Styled components
import styled from 'styled-components';

// Icons
import { DragIndicator } from 'shared/icons';

// Drag and drop
import { Draggable } from 'react-beautiful-dnd';

// Stylesheet
import 'assets/scss/elevatus/_evabrand.scss';
import { useTranslation } from 'react-i18next';

const translationPath = '';
const parentTranslationPath = 'EvaBrand';

/**
 * Perks wrapper styled div
 */
const PerkWrapper = styled.div`
  border: ${(props) => (props.isDragging ? '2px solid var(--primary)' : '')};
  border-radius: ${(props) => (props.isDragging ? '8px' : '0px')};
`;

/**
 * Colors array
 * @type {string[]}
 */
const colors = [
  'primary',
  'warning',
  'info',
  'danger',
  'purple',
  'orange',
  'misty',
  'rose',
];

/**
 * Get style
 * @param isDragging
 * @param draggableStyle
 * @returns {{left: (string), position: (string)}}
 */
const getItemStyle = (isDragging, draggableStyle) => ({
  ...draggableStyle,
  position: isDragging ? 'fixed' : 'relative',
  left: isDragging ? '400px' : '0',
});

/**
 * Perk constructor
 * @param draggableId
 * @param index
 * @param task
 * @param isDeleting
 * @param deletePerk
 * @returns {JSX.Element}
 * @constructor
 */
const Perk = ({ draggableId, index, task, isDeleting, deletePerk }) => {
  const { t } = useTranslation(parentTranslationPath);

  return (
    <Draggable draggableId={draggableId} index={index}>
      {(provided, snapshot) => (
        <div>
          <PerkWrapper
            id="perk-wrapper"
            className="hover-on-this"
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
            style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
          >
            <div className="d-flex flex-column align-items-center">
              <div className="icon icon-md icon-shape icon-shape-light shadow rounded-circle mb-2">
                <i className={`${task.icon} fa-2x`} />
              </div>

              <span>{task.title}</span>
            </div>
            {/* Button */}
            <DragIndicator
              id="drag-indicator"
              className="drag-handler bg-white rounded form-control-alternative mr-2-reversed"
              style={{
                height: '29px',
                padding: '0px 4px',
                maxWidth: '30px',
                opacity: '0.5',
              }}
            />
            <Button
              id="delete-button"
              type="button"
              data-placement="center"
              title={t(`${translationPath}delete-perk`)}
              onClick={(e) => {
                e.stopPropagation();
                deletePerk(task.uuid);
              }}
              className="btn shadow-none btn-icon-only rounded-circle to-show-this"
            >
              {isDeleting && <i className="fas fa-circle-notch fa-spin" />}
              {!isDeleting && (
                <span className="btn-inner--icon">
                  <i className="fas fa-trash" />
                </span>
              )}
            </Button>
          </PerkWrapper>

          {provided.placeholder}
        </div>
      )}
    </Draggable>
  );
};

export default Perk;
