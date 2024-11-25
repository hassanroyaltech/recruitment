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
  display: flex;
  font-size: 12px;
  height: 24px;
  justify-content: center;
  text-align: center;
  text-transform: uppercase;
  width: 24px;
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
`;

export const ActionWrapper = styled.div`
  & {
    background: #f6f9fc;
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
