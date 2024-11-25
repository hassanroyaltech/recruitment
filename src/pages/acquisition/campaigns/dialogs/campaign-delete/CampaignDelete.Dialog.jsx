import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { showError, showSuccess } from 'helpers';
import { DialogComponent } from 'components';
import { DeleteCampaignV2 } from 'services';

export const CampaignDeleteDialog = ({
  activeItem,
  isOpen,
  isOpenChanged,
  onSave,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const deleteHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const res = await DeleteCampaignV2({
      campaign_uuid: [activeItem.uuid],
    });
    if (res.status === 202) {
      if (onSave) onSave();
      showSuccess(t(`${translationPath}campaign-deleted-successfully`));
    } else showError(t(`${translationPath}campaign-delete-failed`));
    setIsLoading(false);
    isOpenChanged();
  };
  return (
    <DialogComponent
      isConfirm
      dialogContent={
        <div className="d-flex-column-center">
          <span className="fas fa-exclamation-triangle c-danger fa-4x mb-2" />
          <span>{t(`${translationPath}campaign-delete-description`)}</span>
        </div>
      }
      isOpen={isOpen}
      onSubmit={deleteHandler}
      isSaving={isLoading}
      onCloseClicked={isOpenChanged}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};
CampaignDeleteDialog.propTypes = {
  activeItem: PropTypes.instanceOf(Object).isRequired,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};
CampaignDeleteDialog.defaultProps = {
  translationPath: 'CampaignDeleteDialog.',
};
