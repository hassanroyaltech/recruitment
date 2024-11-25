import React from 'react';
import styled from 'styled-components';
import {
  DropdownToggle as CoreDropdownToggle,
  DropdownMenu,
  UncontrolledDropdown,
} from 'reactstrap';

// Components
const Wrapper = styled.div``;
const DropdownToggle = styled(CoreDropdownToggle)`
  align-items: center;
  &:hover {
    background: #f0f2f5;
  }
  cursor: pointer;
  display: flex;
  justify-content: center;
  padding: 0 5px;
`;

export const ActionDropdown = ({ children }) => (
  <Wrapper>
    <UncontrolledDropdown>
      <DropdownToggle tag="span" data-toggle="dropdown">
        <i className="fas fa-ellipsis-h fa-2x" />
      </DropdownToggle>
      <DropdownMenu end>{children}</DropdownMenu>
    </UncontrolledDropdown>
  </Wrapper>
);

export default ActionDropdown;
