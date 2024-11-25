import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { FormsRolesEnum, UploaderPageEnum } from '../../../../../enums';

import { SharedUploaderControl } from '../../../../setups/shared';
import VideoPlayer from 'react-video-js-player';
import { VideoPlayerComponent } from './VideoPlayerComponent/VideoPlayer.Compnent';

const parentTranslationPath = 'FormBuilderPage';
const VideoField = React.memo(
  ({
    placeholder,
    handleSetValue,
    initialValue,
    disabled,
    isSubmitted,
    id,
    wrapperClasses,
    type,
    preview,
    role,
    fillBy,
    style,

    files,
    attachmentButtonLabel,
    pdfRef,
    getIsValueDisplay,
  }) => {
    const [localValues, setLocalValues] = React.useState(files || []);
    const [inputFiles, setInputFiles] = React.useState([]);
    const onUploadChanged = (newValue) => {
      const localItems = [...newValue.value];
      setInputFiles(newValue.value);
      setLocalValues(localItems);
      handleSetValue(localItems);
    };
    useEffect(() => {
      setInputFiles(files);
    }, []);
    useEffect(() => {
      handleSetValue(localValues);
    }, [localValues, handleSetValue]);

    return (
      <div className="meet-team-field-parent onboarding-gallery">
        {!pdfRef
        && (!disabled
          || (getIsValueDisplay
            && !getIsValueDisplay({ fillBy, type, isFromField: true }))) ? (
            <SharedUploaderControl
              isFullWidth
              sharedClassesWrapper="my-2"
              uploaderPage={UploaderPageEnum.OnboardingSingleVideo}
              translationPath=""
              fileTypeText="videos"
              stateKey="video_uuid"
              // company_uuid={company_uuid}
              errorPath="video_uuid"
              isDisabled={disabled}
              isSubmitted={isSubmitted}
              editValue={inputFiles}
              labelClasses="theme-primary"
              onValueChanged={onUploadChanged}
              parentTranslationPath={parentTranslationPath}
              uploaderBtnText={attachmentButtonLabel}
            />
          ) : null}
        <div className="d-flex">
          {!pdfRef
          && getIsValueDisplay
          && getIsValueDisplay({ fillBy, type, isFromField: true })
          && localValues?.length > 0 ? (
              <div className="multiple-media-cont">
                {localValues.map((file, index) => (
                  <VideoPlayerComponent
                    key={`${file.uuid}video${index}`}
                    src={file.url}
                    wrapperClasses="onboarding-gallery-item"
                    labelValue={placeholder || ''}
                    name={file.name}
                  />
                ))}
              </div>
            ) : null}
        </div>
      </div>
    );
  },
);
VideoField.displayName = 'VideoField';
export default VideoField;
