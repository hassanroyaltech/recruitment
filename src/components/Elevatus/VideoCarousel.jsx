/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 * ----------------------------------------------------------------------------------
 * @title VideoCarousel.jsx
 * @author Yanal Kashou
 * ----------------------------------------------------------------------------------
 * This module contains the VideoCarousel component which is a gallery-like viewing
 * mechanism for videos. Used in displaying applicant videos for EVA-SSESS and
 * EVA-REC in the respective candidate modals.
 * ----------------------------------------------------------------------------------
 */

// React
import React, { useState, useRef, useEffect } from 'react';
import { Container, IconButton, Tooltip } from '@mui/material';
import { Can } from 'utils/functions/permissions';
import { useTranslation } from 'react-i18next';
import VideoCard from './VideoCard';
import RatingPanel from './RatingPanel';

/**
 * VideoCarousel functional component
 */
const translationPath = 'VideoCarouselComponent.';
export function VideoCarousel(props) {
  const { t } = useTranslation(props.parentTranslationPath || 'EvaSSESSPipeline');
  /**
   * Define constructor to pass props and initialize state
   * @param props
   */
  const scrollRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [videos] = useState(props?.videos);
  const [video, setVideo] = useState(props?.videos?.[0]);
  const [videoIndex, setVideoIndex] = useState(0);

  /**
   * Go to the next video
   */
  const next = () => {
    const index = videoIndex;
    const { length } = videos;
    if (index < length - 1) setVideoIndex(index + 1);
    document.getElementById(`video-thumb-${index}`).scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  };

  /**
   * Return to the previous video
   */
  const prev = () => {
    const index = videoIndex;
    if (index > 0) setVideoIndex(index - 1);
    document.getElementById(`video-thumb-${index}`).scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'end',
    });
  };

  useEffect(() => {
    setIsLoading(true);
    setVideo(videos[videoIndex]);

    // Pass back to parent state
    props.setSelectedVideo(videoIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoIndex, videos]);

  useEffect(() => {
    setIsLoading(false);
  }, [video]);

  /**
   * Render the component
   * @returns {JSX.Element}
   */
  return (
    <Container className="px-0 mb-2 eva-ssess-video-carousel-wrapper p-relative">
      <div className="video-content-wrapper">
        <div className="video-content align-items-center justify-content-center btn-vid-container ">
          {!isLoading && props.videos && (
            <>
              {/* VIDEO */}
              {video && video.media_status === 'done' ? (
                <div className="btn-vid-container w-100 h-100">
                  <VideoCard
                    controls
                    src={video.media.media}
                    poster={video.thumbnail.media}
                  />
                </div>
              ) : (
                <div className="video-under-progress btn-vid-container w-100 h-100">
                  {t(`${translationPath}question-is-not-answered-yet`)}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <RatingPanel
        mode="ssess"
        title={t(`${translationPath}rate`)}
        getRecruiterRate={props.getRecruiterRate}
        videoUuid={props.videoUuid}
        ratedUsers={props.ratedUsers}
        rating={props.rating}
        onRating={props.onRating}
        loading={props.loading}
        setLoading={props.setLoading}
        avgRating={props.avgRating}
        parentTranslationPath={props.parentTranslationPath}
        can={Can('edit', 'ats') || Can('create', 'ats')}
      />
      {/* THUMBS */}
      {videos.length > 1 && (
        <div className="carousel-thumbs-buttons">
          <IconButton disabled={videoIndex === 0} onClick={() => prev()}>
            <i className="fas fa-chevron-left" />
          </IconButton>
          <IconButton
            disabled={videoIndex + 1 === videos?.length}
            onClick={() => next()}
          >
            <i className="fas fa-chevron-right" />
          </IconButton>
        </div>
      )}

      {videos.length > 1 && (
        <div className="d-flex flex-row mx-0 px-0 col-12 mt-3 carousel-content-wrapper overflow-auto">
          {props.videos && (
            <div ref={scrollRef} className="carousel-scroll carousel-image-wrapper">
              {/* IMAGE CAROUSEL */}
              {videos.map((param, index) => (
                <React.Fragment key={`videos${index + 1}`}>
                  {param.media_status === 'done' ? (
                    <Tooltip title={`Q${index + 1} ${param.question.title}`}>
                      <div className="carousel-image-item">
                        <img
                          id={`video-thumb-${index}`}
                          src={param.thumbnail.media}
                          alt={index}
                          className={`px-0 carousel-thumb ${
                            index === videoIndex ? 'selected' : ''
                          }`}
                          onClick={() => {
                            setVideoIndex(index);
                            document
                              .getElementById(`video-thumb-${index}`)
                              .scrollIntoView({
                                behavior: 'smooth',
                                block: 'nearest',
                                inline: 'start',
                              });
                          }}
                        />
                      </div>
                    </Tooltip>
                  ) : (
                    <Tooltip
                      title={`Q${index + 1} ${param.question.title} ${t(
                        `${translationPath}question-is-not-answered-yet`,
                      )}`}
                      enterDelay={500}
                      leaveDelay={200}
                    >
                      <div
                        id={`video-thumb-1-${index + 1}`}
                        className={`px-0 carousel-thumb not-answered ${
                          index === videoIndex ? 'selected' : null
                        }`}
                        onClick={() => setVideoIndex(index)}
                      >
                        {t(`${translationPath}question-is-not-answered-yet`)}
                      </div>
                    </Tooltip>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      )}
    </Container>
  );
}
