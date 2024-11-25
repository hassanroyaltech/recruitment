import styled from 'styled-components';
import { Modal } from 'reactstrap';

export const Header = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  & .form-group {
    margin-bottom: 0px;
  }
`;

// Table styles

export const Actions = styled.div`
  display: flex;
`;

export const AvatarGroup = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-start;
`;
export const Avatar = styled.li`
  align-items: center;
  border: 2px solid white;
  cursor: default;
  display: flex;
  font-size: 11px;
  font-weight: bold;
  height: 24px;
  justify-content: center;
  text-align: center;
  text-transform: capitalize;
  width: 24px;
  &:nth-child(odd) {
    background: #717171;
  }
  &:nth-child(even) {
    background: #d9d9d9;
    margin-left: -5px;
  }
  &:hover {
    z-index: 999;
  }
`;

export const StyledModal = styled(Modal)`
  max-width: 60vw;
  & .modal-header {
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    margin-bottom: 1rem;
  }
  & .modal-content {
    max-height: 90vh;
    overflow: auto;
  }
  & .modal-footer {
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    margin-top: 1rem;
  }
  @media (max-width: 570px) {
    max-width: 100% !important;
  }
`;

export const ActionWrapper = styled.div`
  & {
    border-radius: 0.2rem;
  }
  &:empty {
    display: none;
    background: transparent;
    border: none;
  }
  &:hover .remove-action {
    opacity: 1;
  }
`;

export const HeaderContainer = styled.div`
  margin-top: 2rem;
`;
export const BarContainer = styled.div`
  & label {
    margin-bottom: 1rem;
  }
  & > *:not(:last-child) {
    margin-right: 12px;
    // margin-left: 12px;
  }
`;
