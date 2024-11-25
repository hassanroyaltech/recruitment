import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { SharedUploaderControl } from '../../../pages/setups/shared';
import { UploaderPageEnum } from '../../../enums';
// import PropTypes from 'prop-types';

export const VideoCvSection = ({
  state,
  onStateChanged,
  errors,
  isSubmitted,
  isLoading,
  company_uuid,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  /**
   * @param newValue - the current file
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle updating the uploading the logo
   */
  const onUploadChanged = (newValue) => {
    onStateChanged({
      id: 'video_uuid',
      value: (newValue.value.length && newValue.value[0].uuid) || null,
    });

    onStateChanged({
      id: 'video',
      value: newValue.value || [],
    });
  };
  // useEffect(() => {
  //     if(state.video_uuid && (!localVideoItem || localVideoItem.uuid !== state.video_uuid))
  //         getLocalVideoItem()
  // }, [state.video_uuid]);

  return (
    <div className="section-item-wrapper">
      <div className="section-item-title">{t('video-cv')}</div>
      <div className="section-item-description">{t('video-cv-description')}</div>
      <div className="section-item-body-wrapper px-2">
        <SharedUploaderControl
          isFullWidth
          errors={errors}
          uploaderPage={UploaderPageEnum.ProfileCVVideo}
          translationPath=""
          fileTypeText="videos"
          stateKey="video_uuid"
          company_uuid={company_uuid}
          errorPath="video_uuid"
          isDisabled={isLoading}
          isSubmitted={isSubmitted}
          editValue={state.video}
          labelClasses="theme-primary"
          uploaderBtnText="browse-videos"
          onValueChanged={onUploadChanged}
          parentTranslationPath={parentTranslationPath}
        />
      </div>
    </div>
  );
};

VideoCvSection.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  state: PropTypes.instanceOf(Object).isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  company_uuid: PropTypes.string,
};
