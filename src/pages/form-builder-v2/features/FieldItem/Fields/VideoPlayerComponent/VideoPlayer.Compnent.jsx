import React, { memo, useState, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';

import './VideoPlayer.Style.scss';

export const VideoPlayerComponent = memo(
  ({ idRef, wrapperClasses, labelClasses, labelValue, src, name }) => {
    const videoRef = useRef(null);
    const [started, setStarted] = useState(false);

    const handleStart = () => {
      setStarted(true);
      if (videoRef?.current) {
        videoRef.current.setAttribute('controls', true);
        videoRef.current.play();
      }
    };
    const type = useMemo(
      () => (val) => {
        const temp = val?.split('.');
        if (temp) return temp.pop();
      },
      [],
    );

    return (
      <div
        className={`w-100  p-relative video-component-wrapper  ${wrapperClasses} ${
          started && 'video-has-started'
        } `}
      >
        <video id={idRef} ref={videoRef} className="video-item">
          <source src={src} type={`video/${type(name)}`} />
          <track kind="captions" srcLang="en" label="English" default />
          Your browser does not support the video tag.
        </video>
        {labelValue && (
          <span className={`video-place-holder p-absolute${labelClasses || ''} `}>
            {labelValue}
          </span>
        )}
        {!started && (
          <button
            className="d-inline-flex-center video-play-button"
            onClick={(e) => {
              handleStart(e);
            }}
          >
            <i className="fas fa-caret-right"></i>
          </button>
        )}
      </div>
    );
  },
);

VideoPlayerComponent.displayName = 'VideoPlayerComponent';

VideoPlayerComponent.propTypes = {
  idRef: PropTypes.string,
  wrapperClasses: PropTypes.string,
  labelClasses: PropTypes.string,
  labelValue: PropTypes.string,
  src: PropTypes.string,
  name: PropTypes.string,
};

VideoPlayerComponent.defaultProps = {
  idRef: 'VideoRef',
  wrapperClasses: '',
  labelClasses: '',
  labelValue: undefined,
  src: '',
  name: '',
};
