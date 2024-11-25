/* eslint-disable no-param-reassign */
import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { DialogComponent } from '../../../..';
import EmailsIntegrationSettings from '../../../../../pages/mailbox/EmailIntegrationSettings.Component';

export const EmailsIntegrationSettingsDialog = ({
  isOpen,
  isOpenChanged,
  translationPath,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  return (
    <DialogComponent
      maxWidth="sm"
      isFixedHeight
      zIndex={1000}
      dialogTitle={t(`${translationPath}emails-integration-settings`)}
      dialogContent={<EmailsIntegrationSettings />}
      isOpen={isOpen}
      onCloseClicked={isOpenChanged}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

EmailsIntegrationSettingsDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};

EmailsIntegrationSettingsDialog.defaultProps = {
  isOpenChanged: undefined,
  translationPath: 'EmailsIntegrationSettingsDialog.',
};
