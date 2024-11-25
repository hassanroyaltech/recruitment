// Import React Components
import React, { useState } from 'react';
import { SharedUploaderControl } from 'pages/setups/shared';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { UploaderPageEnum } from 'enums';
import { UploadFilesForDataFlow } from 'services';

const translationPath = 'PassportUpload.';

const PassportUploadSection = ({
  parentTranslationPath,
  state,
  errors,
  isSubmitted,
  onStateChanged,
  isLoading,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [files, setFiles] = useState([]);

  return (
    <div className="section-item-wrapper w-100">
      <div className="section-item-title">{t(`${translationPath}passport`)}</div>
      <SharedUploaderControl
        editValue={files || []}
        onValueChanged={(uploaded) => {
          const uploadedValue = (uploaded.value?.length && uploaded.value) || [];
          onStateChanged({
            parentId: 'passport',
            id: 'files',
            value: uploaded.value
              ? (uploadedValue.length
                  && uploadedValue.map((val) => ({
                    media_uuid: val.media_uuid,
                    category: '',
                  })))
                || uploadedValue
              : uploaded,
          });
          setFiles(uploadedValue);
        }}
        stateKey="files"
        labelValue="files"
        isSubmitted={isSubmitted}
        errors={errors}
        errorPath="passport.files"
        labelClasses="theme-primary"
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        fileTypeText="files"
        isFullWidth
        uploaderPage={UploaderPageEnum.EmployeeProfile}
        multiple
        CustomUploader={{
          dataKey: 'date',
          status: 200,
          api: UploadFilesForDataFlow,
          key: 'media_uuid',
          dataKeyIndex: 0,
        }}
      />
    </div>
  );
};

export default PassportUploadSection;

PassportUploadSection.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  state: PropTypes.shape({
    passport: PropTypes.shape({
      files: PropTypes.arrayOf({
        media_uuid: PropTypes.string,
        category: PropTypes.string,
      }),
    }),
  }),
  errors: PropTypes.instanceOf(Object),
  isSubmitted: PropTypes.bool,
  onStateChanged: PropTypes.func,
  isLoading: PropTypes.bool,
};

PassportUploadSection.defaultProps = {
  state: undefined,
  errors: undefined,
  isSubmitted: false,
  onStateChanged: undefined,
  isLoading: false,
};
