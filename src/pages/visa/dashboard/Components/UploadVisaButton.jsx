import React, { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { UploaderTypesEnum } from '../../../../enums';
import { UploadVisaCsv } from '../../../../services';
import {
  getIsAllowedPermissionV2,
  showError,
  showSuccess,
} from '../../../../helpers';
import ButtonBase from '@mui/material/ButtonBase';
import { VisasPermissions } from '../../../../permissions';
import { useTranslation } from 'react-i18next';

export const UploadVisaButton = ({
  onSave,
  permissions,
  translationPath,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const fileRef = useRef();

  const UploadFileHandler = useCallback(
    async (file) => {
      const response = await UploadVisaCsv({ file: file.target.files[0] });
      if (response?.status === 200) {
        showSuccess(t(`${translationPath}file-uploaded-successfully`), response);
        onSave();
      } else showError(t('Shared:failed-to-get-saved-data'), response);
    },
    [onSave, t, translationPath],
  );

  return (
    <ButtonBase
      className="btns theme-transparent mx-2 mb-3"
      onClick={() => {
        fileRef.current.click();
      }}
      disabled={
        !getIsAllowedPermissionV2({
          permissionId: VisasPermissions.AddVisa.key,
          permissions,
        })
      }
    >
      <input
        style={{ display: 'none' }}
        type="file"
        accept={UploaderTypesEnum.CSV.accept}
        onChange={(file) => {
          UploadFileHandler(file);
        }}
        max="1"
        ref={fileRef}
      />
      <span className="fas fa-upload" />
      <span className="px-1">{t(`${translationPath}upload-csv`)}</span>
    </ButtonBase>
  );
};

UploadVisaButton.propTypes = {
  onSave: PropTypes.func.isRequired,
  permissions: PropTypes.array,
  translationPath: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
};
