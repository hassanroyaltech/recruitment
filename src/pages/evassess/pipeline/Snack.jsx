import React from 'react';
import { DefaultToast as DefaultToastCore } from 'react-toast-notifications';
import styled from 'styled-components';
import { Button as CoreButton } from 'reactstrap';

const DefaultToast = styled(DefaultToastCore)`
  & .react-toast-notifications__toast__dismiss-button {
    display: none;
  }
`;
const CustomWrapper = styled.div``;
const Button = styled(CoreButton)`
  background: rgba(0, 102, 68, 0.2);
  color: rgb(0, 102, 68) !important;
  float: right;
`;
const Snack = ({ children, onDismiss, onUndo, ...props }) => (
  <DefaultToast {...props}>
    <CustomWrapper>
      {children}
      {onUndo && (
        <Button
          className="btn btn-sm btn-icon"
          color="link"
          type="button"
          onClick={onUndo}
        >
          Undo
        </Button>
      )}{' '}
    </CustomWrapper>
  </DefaultToast>
);

export default Snack;
