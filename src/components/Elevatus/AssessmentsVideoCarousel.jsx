/* eslint-disable react/destructuring-assignment */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/**
 * ----------------------------------------------------------------------------------
 * @title AssessmentsVideoCarousel.jsx
 * @author Yanal Kashou
 * ----------------------------------------------------------------------------------
 * This module contains the VideoCarousel component which is a gallery-like viewing
 * mechanism for videos. Used in displaying applicant videos for EVA-SSESS and
 * EVA-REC in the respective candidate modals.
 * ----------------------------------------------------------------------------------
 */

import React, { useState, useEffect } from 'react';
import VideoCard from './VideoCard';

/**
 * AssessmentsVideoCarousel functional component
 */
export const AssessmentsVideoCarousel = (props) => {
  /**
   * Define constructor to pass props and initialize state
   * @param props
   */
  const [isLoading, setIsLoading] = useState(false);
  const [video, setVideo] = useState(props?.videos[0]);
  const [videoIndex, setVideoIndex] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    setVideo(props.videos[videoIndex]);

    // Pass back to parent state
    props.setSelectedVideo(videoIndex);
  }, [videoIndex]);

  useEffect(() => {
    setIsLoading(false);
  }, [video]);

  useEffect(() => {
    setVideoIndex(props.selectedQuestionIndex);
  }, [props.selectedQuestionIndex]);

  /**
   * Render the component
   * @returns {JSX.Element}
   */
  return (
    <div className="carousel-video-content-wrapper">
      {!isLoading && props.videos && (
        <>
          {/* VIDEO */}
          {video?.media_status === 'done' && (
            <div className="btn-vid-container w-100 h-100">
              <VideoCard
                controls
                src={video.media.media}
                poster={video.thumbnail.media}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default AssessmentsVideoCarousel;
