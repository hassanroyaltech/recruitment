import React from 'react';
import { CardBody, Col, Row } from 'reactstrap';
import altImage from 'assets/img/theme/image-thumbnail.jpg';
import VideoCard from 'components/Elevatus/VideoCard';
import Loader from 'components/Elevatus/Loader';
import { Container } from '@mui/material';
import { useTranslation } from 'react-i18next';

const translationPath = '';
const parentTranslationPath = 'EvarecCandidateModel';

const VideoTab = ({ video, loading }) => {
  const { t } = useTranslation(parentTranslationPath);

  return (
    <div className="d-flex flex-column">
      {loading ? (
        <CardBody className="text-center">
          <Row>
            <Col xl={12}>
              <Loader width="730px" height="49vh" speed={1} color="primary" />
            </Col>
          </Row>
        </CardBody>
      ) : (
        <div className="video-content-wrapper py-0">
          <div
            className="bg-black d-flex align-items-center justify-content-center candidate-video-wrapper mt-3"
            style={{ minHeight: 350 }}
          >
            {video ? (
              video.is_completed ? (
                <h5 className="h5 text-white">
                  {t(`${translationPath}the-candidate-hasnt-applied-yet`)}
                </h5>
              ) : (
                // ) : video.media_status !== 'done' ? (
                //   <h5 className="h5 text-muted position-absolute">
                //     The video is processing
                //     {' '}
                //     <i className="fas fa-circle-notch fa-spin" />
                //   </h5>
                // )
                <div className="w-100 h-100">
                  <VideoCard
                    controls
                    className="w-100"
                    height={100}
                    style={{ minHeight: 350 }}
                    src={video}
                    poster={video.thumbnail?.media || altImage}
                  />
                </div>
              )
            ) : (
              <h5 className="h5 text-white">
                {t(`${translationPath}no-videos-available-for-this-candidate`)}
              </h5>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoTab;
