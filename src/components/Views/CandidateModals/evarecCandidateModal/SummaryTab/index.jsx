// Import React Components0
import React, { useState } from 'react';

// Import Classnames
import classnames from 'classnames';

// Import Reactstrap Components
import { Button, Col, Row } from 'reactstrap';

// Import Custom Components
import { useTranslation } from 'react-i18next';
import ProfileTab from './ProfileTab';
import ResumeTab from './ResumeTab';

const translationPath = '';
const parentTranslationPath = 'EvarecRecSearch';

/**
 * Summary Tab Functional Components
 * @param {*} profile
 */

const SummaryTab = ({ profile, mode, company_uuid, onEditProfileClicked }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [tab, setTab] = useState('profile');

  return (
    <>
      {mode ? (
        <ProfileTab
          profile={profile}
          mode
          company_uuid={company_uuid}
          onEditProfileClicked={onEditProfileClicked}
        />
      ) : (
        <Col xs={12} sm={12} md={10} lg={8} className="ml-2 mt-1">
          {profile.cv_url && (
            <Row>
              <Col xs={6}>
                <Button
                  className={classnames(
                    'profile-select-button text-gray w-100',
                    tab === 'profile' && 'active-button',
                  )}
                  onClick={() => setTab('profile')}
                >
                  {t(`${translationPath}profile`)}
                </Button>
              </Col>
              <Col xs={6}>
                <Button
                  className={classnames(
                    'profile-select-button text-gray w-100',
                    tab === 'resume' && 'active-button',
                  )}
                  onClick={() => setTab('resume')}
                >
                  {t(`${translationPath}resume`)}
                </Button>
              </Col>
            </Row>
          )}
          <div className="mt-4">
            {tab === 'profile' ? (
              <ProfileTab
                profile={profile}
                company_uuid={company_uuid}
                onEditProfileClicked={onEditProfileClicked}
              />
            ) : (
              <ResumeTab profile={profile} />
            )}
          </div>
        </Col>
      )}
    </>
  );
};

export default SummaryTab;
