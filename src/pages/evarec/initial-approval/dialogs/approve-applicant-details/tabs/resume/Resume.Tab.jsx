import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

export const ResumeTab = ({ profile, parentTranslationPath, translationPath }) => {
  const { t } = useTranslation(parentTranslationPath);

  return (
    <div className="w-100 candidate-resume-wrapper">
      {profile && profile.cv_url ? (
        profile.cv_url.endsWith('.pdf') ? (
          <embed
            src={profile.cv_url}
            type="application/pdf"
            width="100%"
            height="500px"
          />
        ) : (
          <iframe
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
              profile?.cv_url,
            )}`}
            width="100%"
            title="Resume"
            height="600px"
            frameBorder="0"
          >
            This is an embedded{' '}
            <a target="_blank" href="http://office.com" rel="noreferrer">
              Microsoft Office
            </a>{' '}
            document, powered by{' '}
            <a target="_blank" href="http://office.com/webapps" rel="noreferrer">
              Office Online
            </a>
            .
          </iframe>
        )
      ) : (
        <div className="no-resume-available-title">
          {t(`${translationPath}no-resume-available`)}
        </div>
      )}
    </div>
  );
};

ResumeTab.propTypes = {
  profile: PropTypes.instanceOf(Object),
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
};
ResumeTab.defaultProps = {
  profile: undefined,
  parentTranslationPath: 'EvarecCandidateModel',
  translationPath: '',
};
