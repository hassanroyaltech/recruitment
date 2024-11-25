import React from 'react';
import VideoCard from 'components/Elevatus/VideoCard';
import defaultThumbnail from 'assets/img/theme/image-thumbnail.jpg';
import { useTranslation } from 'react-i18next';

const translationPath = '';
const parentTranslationPath = 'EvarecCandidateModel';

const ProfileVideoCard = ({ video }) => {
  const { t } = useTranslation(parentTranslationPath);

  return (
    <div className="video-content-wrapper">
      <div className="video-content d-flex align-items-center justify-content-center">
        {video ? (
          <div className="w-100 h-100">
            <VideoCard
              controls
              src={video}
              poster={video.thumbnail?.media || defaultThumbnail}
            />
          </div>
        ) : (
          <h5 className="h5 text-white">
            {t(`${translationPath}no-videos-available`)}
          </h5>
        )}
      </div>
    </div>
  );
};

export default ProfileVideoCard;
