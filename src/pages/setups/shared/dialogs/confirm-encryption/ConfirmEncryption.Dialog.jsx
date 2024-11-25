import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { showError, showSuccess } from '../../../../../helpers';
import { DialogComponent } from '../../../../../components';
import { ToggleLookupEncryptionStatus } from 'services';
const parentTranslationPath = 'SetupsPage';
const translationPath = 'ConfirmEncryptionDialog.';

export const ConfirmEncryptionDialog = memo(
  ({
    isOpen,
    isOpenChanged,
    onSave,
    apiProps,
    saveType,
    // isDynamicService,
    // lookup,
    currentStatus,
    lookupTextName,
  }) => {
    const { t } = useTranslation(parentTranslationPath);
    const [isLoading, setIsLoading] = useState(false);
    const confirmHandler = async (event) => {
      event.preventDefault();
      setIsLoading(true);

      const res = await ToggleLookupEncryptionStatus(apiProps);
      if (res && res.status === 200) {
        if (onSave) onSave(res?.data?.results);
        showSuccess(
          t(
            `${translationPath}${
              res?.data?.results?.status
                ? 'success-encrypted-message'
                : 'success-decrypted-message'
            }`,
          ),
        );
      } else showError(t('Shared:failed-to-get-saved-data'), res);
      setIsLoading(false);
      isOpenChanged();
    };
    return (
      <DialogComponent
        isConfirm
        dialogContent={
          <div className="d-flex-column-center">
            {currentStatus ? (
              <>
                <span className="fas fa-lock-open  fa-4x mb-2" />
                <span>{`${t(`${translationPath}confirm-decryption-message`)} ${
                  lookupTextName || ''
                }`}</span>
              </>
            ) : (
              <>
                <span className="fas fa-lock  fa-4x mb-2" />
                <span>{`${t(`${translationPath}confirm-encryption-message`)} ${
                  lookupTextName || ''
                }`}</span>
              </>
            )}
          </div>
        }
        isOpen={isOpen}
        saveType={saveType}
        onSubmit={
          ((!saveType || saveType === 'submit') && confirmHandler) || undefined
        }
        onSaveClicked={(saveType === 'button' && confirmHandler) || undefined}
        isSaving={isLoading}
        onCloseClicked={isOpenChanged}
        onCancelClicked={isOpenChanged}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        isWithoutConfirmClasses={true}
      />
    );
  },
);

ConfirmEncryptionDialog.displayName = 'ConfirmEncryptionDialog';

ConfirmEncryptionDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  lookupTextName: PropTypes.string,
  currentStatus: PropTypes.bool,
  onSave: PropTypes.func.isRequired,
  apiProps: PropTypes.instanceOf(Object),
  saveType: PropTypes.oneOf(['button', 'submit']),
};
ConfirmEncryptionDialog.defaultProps = {
  apiProps: undefined,
  lookup: undefined,
};
