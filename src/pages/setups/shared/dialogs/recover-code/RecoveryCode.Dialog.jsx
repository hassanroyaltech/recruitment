import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { DialogComponent } from '../../../../../components';
import { GetSecurityMFARecoveryCodes } from '../../../../../services';
import { copyTextToClipboard, showError } from '../../../../../helpers';
import Chip from '@mui/material/Chip';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import { ButtonBase } from '@mui/material';
import { NavItem } from 'reactstrap';

export const RecoveryCodeDialog = ({
  isOpen,
  isOpenChanged,
  parentTranslationPath,
  translationPath,
  authenticatedAppDataEmail,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState(false);

  const RecoveryCode = async () => {
    setIsLoading(true);
    const response = await GetSecurityMFARecoveryCodes({
      user_email: authenticatedAppDataEmail,
    });
    setIsLoading(false);
    if (response && (response.status === 200 || response.status === 201))
      setRecoveryCodes(response.data.results);
    else showError(t('Shared:failed-to-get-saved-data'), response);
  };

  return (
    <DialogComponent
      titleText="recovery_code"
      maxWidth="sm"
      dialogContent={
        <div className="recovery-code-dialog-wrapper">
          <div className="body-item-wrapper">
            <p className="m-3"> {t(`${translationPath}recovery-description`)}</p>
            <div className="mb-2 ml-3 d-flex ">
              <ButtonBase
                onClick={() => RecoveryCode()}
                className="btns theme-solid py-2 px-3 mt-1"
              >
                <span>{t(`${translationPath}show-recovery-codes`)}</span>
              </ButtonBase>
              {recoveryCodes?.codes && (
                <NavItem
                  color="link"
                  className="btn nav-link nav-link-shadow font-weight-normal"
                  onClick={() =>
                    copyTextToClipboard(recoveryCodes?.codes?.join('\n'))
                  }
                >
                  <span>{t(`${translationPath}copy-recovery-code`)}</span>
                  <i className="fas fa-copy" />
                </NavItem>
              )}
            </div>
            <div className="ml-4">
              {recoveryCodes?.codes?.map((codes) => (
                <Chip
                  className="p-1 my-1 d-block width-150-px"
                  key={codes}
                  label={codes || ''}
                  icon={<AccountBoxOutlinedIcon />}
                />
              ))}
            </div>
          </div>
        </div>
      }
      isOpen={isOpen}
      isOldTheme
      onCloseClicked={isOpenChanged}
      isSaving={isLoading}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

RecoveryCodeDialog.propTypes = {
  isOpen: PropTypes.bool,
  isOpenChanged: PropTypes.func,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
  authenticatedAppDataEmail: PropTypes.string,
};
