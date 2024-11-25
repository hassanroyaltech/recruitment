// React and reactstrap
import React from 'react';
import { Button as CoreButton } from 'reactstrap';

// Toast notifications
import { DefaultToast as DefaultToastCore } from 'react-toast-notifications';

// Styled components
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const translationPath = '';
const parentTranslationPath = 'EvarecRecModals';

// Modify style of toast
const DefaultToast = styled(DefaultToastCore)`
  & .react-toast-notifications__toast__dismiss-button {
    display: none;
  }
`;

// Add a div wrapper
const CustomWrapper = styled.div``;

// Define a styled button
const Button = styled(CoreButton)`
  background: rgba(0, 102, 68, 0.2);
  color: rgb(0, 102, 68) !important;
  float: right;
`;

/**
 * IMPORTANT: EXPLANATION REQUIRED
 * What the hell is a Snack?
 *
 * @param children
 * @param onDismiss
 * @param onUndo
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const Snack = ({ children, onDismiss, onUndo, ...props }) => {
  const { t } = useTranslation(parentTranslationPath);

  return (
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
            {t(`${translationPath}undo`)}
          </Button>
        )}{' '}
      </CustomWrapper>
    </DefaultToast>
  );
};

export default Snack;
