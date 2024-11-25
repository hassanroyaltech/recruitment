import React from 'react';
import styled from 'styled-components';
import { DragIndicator as CoreDragIndicator } from 'shared/icons';
import { Draggable } from 'react-beautiful-dnd';
import { Button } from 'reactstrap';

const Wrapper = styled.div`
  align-items: center;
  background: white;
  border: ${(props) => (props.isDragging ? '2px solid var(--primary)' : '')};
  border-radius: ${(props) => (props.isDragging ? '8px' : '0px')};
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);
  cursor: pointer;
  display: flex;
  height: 100px;
  justify-content: center;
  margin: 0 auto;
  margin-bottom: 1.5rem;
  position: relative;
  width: 250px;
`;

const DeleteButton = styled(Button)`
  background: transparent;
  background-color: transparent;
  padding: 0;
  position: absolute;
  right: 10px;
  top: 10px;
  transform: none;
  transition: none;
  z-index: 1000;
  &:hover {
    background: transparent;
    background-color: transparent;
  }
`;

const DragIndicator = styled(CoreDragIndicator)`
  left: 10px;
  position: absolute;
  top: 10px;
`;

const Img = styled.img`
  max-height: 90px;
  max-width: 120px;
  object-fit: cover;
`;

const getItemStyle = (isDragging, draggableStyle) => ({
  ...draggableStyle,
  position: isDragging ? 'fixed' : 'relative',
  left: isDragging ? '400px' : '0',
});

const Client = ({ draggableId, index, task, isDeleting, deleteItem }) => (
  <Draggable draggableId={draggableId} index={index}>
    {(provided, snapshot) => (
      <div>
        <Wrapper
          className="hover-on-this"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
          style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
        >
          <div className="d-flex flex-column align-items-center">
            <Img src={task.media} alt={`client-${index}`} />
          </div>
          {/* Button */}
          <DragIndicator
            className="drag-handler bg-white rounded form-control-alternative mr-2-reversed"
            style={{
              height: '29px',
              padding: '0px 4px',
              maxWidth: '30px',
              opacity: '0.5',
            }}
          />
          <DeleteButton
            type="button"
            data-placement="center"
            title="Delete Client"
            onClick={(e) => {
              e.stopPropagation();
              deleteItem(task.pk_uuid);
            }}
            className="btn shadow-none btn-icon-only rounded-circle to-show-this"
          >
            {isDeleting && <i className="fas fa-circle-notch fa-spin" />}
            {!isDeleting && (
              <span className="btn-inner--icon">
                <i className="fas fa-trash" />
              </span>
            )}
          </DeleteButton>
        </Wrapper>

        {provided.placeholder}
      </div>
    )}
  </Draggable>
);

export default Client;
