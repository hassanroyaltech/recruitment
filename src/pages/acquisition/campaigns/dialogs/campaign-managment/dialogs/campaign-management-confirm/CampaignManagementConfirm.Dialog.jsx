import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { DialogComponent } from 'components';

export const CampaignManagementConfirmDialog = ({
  isOpen,
  isOpenChanged,
  onSave,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  return (
    <DialogComponent
      isConfirm
      isWithoutConfirmClasses
      dialogContent={
        <div className="d-flex-column-center">
          <span className="fas fa-question-circle c-green-primary fa-4x mb-2" />
          <span>
            {t(`${translationPath}campaign-management-confirm-description`)}
          </span>
        </div>
      }
      isOpen={isOpen}
      saveType="button"
      onSaveClicked={onSave}
      onCloseClicked={isOpenChanged}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};
CampaignManagementConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};
CampaignManagementConfirmDialog.defaultProps = {
  translationPath: 'CampaignManagementConfirmDialog.',
};
