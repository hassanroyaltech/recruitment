// React and reactstrap
import React, { useState } from 'react';
import { Button } from 'reactstrap';

// Styled components
import styled from 'styled-components';

// Drag indicator icon
import { DragIndicator } from 'shared/icons';

// Drag and drop capability
import { Draggable } from 'react-beautiful-dnd';

// Stylesheet
import 'assets/scss/elevatus/_evabrand.scss';
import { useTranslation } from 'react-i18next';

const translationPath = '';
const parentTranslationPath = 'EvaBrand';

// Dynamically styled div
const ImageWrapper = styled.div`
  border: ${(props) => (props.isDragging ? '2px solid #1f4ab2' : '')};
  border-radius: ${(props) => (props.isDragging ? '8px' : '0px')};
`;

/**
 * Draggable Section constructor. These are the various sections that we can
 * drag and drop.
 * @param Component
 * @param order
 * @param imgSrc
 * @param noDrag
 * @param draggableId
 * @param index
 * @param task
 * @param toggleVisibility
 * @param editable
 * @param rest
 * @returns {JSX.Element}
 * @constructor
 */
const DraggableSection = ({
  component: Component,
  order,
  imgSrc,
  noDrag,
  draggableId,
  index,
  task,
  toggleVisibility,
  editable,
  ...rest
}) => {
  const { t } = useTranslation(parentTranslationPath);
  // Open state
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Handler to close modals
   */
  const closeModal = () => {
    setIsOpen(false);
  };

  /**
   * Return JSX
   */
  return (
    <Draggable draggableId={draggableId} index={index}>
      {(provided, snapshot) => (
        <React.Fragment>
          <ImageWrapper
            id="image-wrapper"
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
          >
            <img id="styled-img" src={imgSrc} alt="styled-img" />
            <div id="toolbar" className="image-wrapper-toolbar">
              {editable && (
                <Button
                  className="btn nav-link bg-white form-control-alternative"
                  onClick={() => setIsOpen(true)}
                >
                  <i className="fas fa-pen mr-2-reversed" />
                  {t(`${translationPath}edit`)}
                </Button>
              )}

              <DragIndicator
                className="drag-handler bg-white rounded form-control-alternative mr-2 ml-2"
                style={{
                  height: '29px',
                  padding: '0px 4px',
                  maxWidth: '30px',
                  opacity: '1',
                }}
              />

              <Button
                className="btn nav-link bg-white form-control-alternative"
                onClick={() => toggleVisibility(task.id, task.visible)}
              >
                {task && task.visible ? (
                  <i className="fas fa-eye" />
                ) : (
                  <i className="fas fa-eye-slash" />
                )}
              </Button>
            </div>
            {isOpen && (
              <Component isOpen={isOpen} closeModal={closeModal} {...rest} />
            )}
          </ImageWrapper>
        </React.Fragment>
      )}
    </Draggable>
  );
};
export default DraggableSection;
