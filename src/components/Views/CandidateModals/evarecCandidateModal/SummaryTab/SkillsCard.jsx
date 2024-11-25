import React from 'react';
import { Card } from 'reactstrap';
import { useTranslation } from 'react-i18next';

const translationPath = '';
const parentTranslationPath = 'EvarecCandidateModel';

const SkillsCard = ({ profile }) => {
  const { t } = useTranslation(parentTranslationPath);

  return (
    <Card className="profile-skills-card">
      <div className="font-weight-bold font-14 mb-1">
        {t(`${translationPath}skills`)}
      </div>
      <div className="mt-2">
        {profile?.skills?.map((item, index) => (
          <div key={index} className="chip-item small-item mr-1 mb-3">
            {item}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SkillsCard;
