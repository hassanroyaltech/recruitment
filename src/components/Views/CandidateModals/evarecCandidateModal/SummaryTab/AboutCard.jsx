import React from 'react';
import { Card } from 'reactstrap';
import ProfileVideoCard from './ProfileVideoCard';
import { useTranslation } from 'react-i18next';

const translationPath = '';
const parentTranslationPath = 'EvarecCandidateModel';

const AboutCard = ({ profile }) => {
  const { t } = useTranslation(parentTranslationPath);

  return (
    <Card className="profile-about-card">
      <div className="font-weight-bold font-14 mb-1">
        {t(`${translationPath}about`)}
      </div>
      <div className="font-12 mt-2 text-gray">{profile?.description}</div>
      <hr className="my-4" />
      {profile?.video_url && (
        <Card className="p-2 profile-about-video" style={{ borderRadius: 8 }}>
          <div className="w-100 h-100" style={{ maxHeight: 400, borderRadius: 8 }}>
            <ProfileVideoCard video={profile?.video_url} />
          </div>
        </Card>
      )}
    </Card>
  );
};

export default AboutCard;
