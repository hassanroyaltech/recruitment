import React from 'react';
import styled from 'styled-components';
import DragIndicatorIcon from 'assets/icons/drag-indicator.svg';
import { Button as CoreButton } from 'reactstrap';

const DragImg = styled.img`
  cursor: -webkit-grab;
  cursor: -moz-grab;
  cursor: grab;
  opacity: 0.3;
  transition: 0.3s ease;
  &:hover {
    opacity: 0.5;
  }
`;
export const DragIndicator = (props) => (
  <React.Fragment>
    <DragImg src={DragIndicatorIcon} alt="drag-indicator" {...props} />
  </React.Fragment>
);

const Button = styled(CoreButton)`
  &:hover {
    background: #f2f2f2;
  }
  &.plain-icon:hover {
    background: transparent;
  }
  &:focus,
  &:hover {
    box-shadow: none;
  }
`;

export const IconButton = ({ onClick, icon, ...rest }) => {
  const handleClick = () => {
    if (onClick) onClick();
  };
  return (
    <Button color="#000" type="button" onClick={handleClick} {...rest}>
      <span className="btn-inner--icon">{icon && icon}</span>
    </Button>
  );
};
