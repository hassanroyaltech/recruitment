import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { showError, showSuccess } from 'helpers';
import { DialogComponent } from 'components';
import { DeleteSections } from '../../../../services';

export const SectionsDeleteDialog = ({
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
    const res = await DeleteSections({
      uuid: activeItem.uuid,
    });
    if (res && res.status === 200) {
      if (onSave) onSave();
      showSuccess(t(`${translationPath}section-deleted-successfully`));
    } else showError(t(`${translationPath}section-delete-failed`), res);
    setIsLoading(false);
    isOpenChanged();
  };
  return (
    <DialogComponent
      isConfirm
      dialogContent={
        <div className="d-flex-column-center">
          <span className="fas fa-exclamation-triangle c-danger fa-4x mb-2" />
          <span>{t(`${translationPath}section-delete-description`)}</span>
        </div>
      }
      isSaving={isLoading}
      isOpen={isOpen}
      onSubmit={deleteHandler}
      onCloseClicked={isOpenChanged}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};
SectionsDeleteDialog.propTypes = {
  activeItem: PropTypes.instanceOf(Object).isRequired,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};
SectionsDeleteDialog.defaultProps = {
  translationPath: 'SectionsDeleteDialog.',
};
