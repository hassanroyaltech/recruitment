import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { showError, showSuccess } from '../../../../../helpers';
import { DialogComponent } from '../../../../../components';
import { DeleteResume } from '../../../../../services';

export const ResumeDeleteDialog = ({
  rms_uuid,
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
    const res = await DeleteResume({
      rms_uuid,
    });
    if (!(res && res.status && res.status !== 200)) {
      if (onSave) onSave();
      showSuccess(t(`${translationPath}resume-deleted-successfully`));
    } else
      showError(
        (res?.data?.errors
          && ((typeof res.data.errors === 'object' && (
            <ul className="mb-0">
              {Object.entries(res.data.errors).map((item) => (
                <li key={item[0]}>{item[1]}</li>
              ))}
            </ul>
          ))
            || res.data.message))
          || t(`${translationPath}resume-delete-failed`),
      );
    setIsLoading(false);
    isOpenChanged();
  };
  return (
    <DialogComponent
      isConfirm
      dialogContent={
        <div className="d-flex-column-center">
          <span className="fas fa-exclamation-triangle c-danger fa-4x mb-2" />
          <span>{t(`${translationPath}resume-delete-description`)}</span>
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
ResumeDeleteDialog.propTypes = {
  rms_uuid: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};
ResumeDeleteDialog.defaultProps = {
  translationPath: 'ResumeDeleteDialog.',
};
