// Import React Components
import React, { useState } from 'react';
import PropTypes from 'prop-types';

// Import Reactstrap
import { Button, Card, Col, Row } from 'reactstrap';

// Import default Image
import defaultAvatar from 'assets/img/theme/team-6.jpg';

// Import React Social Icons
import { SocialIcon } from 'react-social-icons';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@mui/material';
import { SystemActionsEnum } from '../../../../../enums';
import NoPermissionComponent from '../../../../../shared/NoPermissionComponent/NoPermissionComponent';
import moment from 'moment/moment';
import i18next from 'i18next';
import { GlobalDateFormat } from '../../../../../helpers';

const translationPath = '';
const parentTranslationPath = 'EvarecCandidateModel';

/**
 * Overview Functional Component
 * @param {*} Profile
 */
const OverviewCard = ({
  profile,
  mode,
  onEditProfileClicked,
  hideImage,
  isDisabledEditing,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [anchorEl, setAnchorEl] = useState(null);
  const [popperOpen, setPopperOpen] = useState(false);
  return (
    <Card className="profile-overview-card d-flex flex-row align-items-center justify-content-center flex-wrap">
      {mode && !hideImage && (
        <div className="my-3">
          <div className="profile-overview-avatar">
            <img
              className="avatar rounded-circle text-white img-circle gray-avatar"
              src={profile?.identity?.profile_pic || defaultAvatar}
              alt={
                [
                  profile?.basic_information?.first_name,
                  profile?.basic_information?.last_name,
                ].join(' ') || ''
              }
              width="100%"
              height="100%"
            />
          </div>
        </div>
      )}
      <Row className="flex-grow-1 m-0 d-table">
        {profile && (
          <Col
            className="font-12 profile-overview-left h-100 d-table-cell w-50"
            xs={12}
            sm={6}
          >
            <div className="font-14 text-uppercase d-flex align-items-center">
              <span className="font-weight-bold">
                {[
                  profile.basic_information?.first_name,
                  profile.basic_information?.last_name,
                ].join(' ')}
              </span>
            </div>
            {(profile.position || profile.company) && (
              <div className="font-12">
                {[profile.position, profile.company].join(' at ')}
              </div>
            )}
            <div className="mt-3 text-gray">{profile.address}</div>
            {profile?.identity?.reference_number && (
              <div className="mt-3 text-gray">{`${t(
                `${translationPath}candidate-reference-number`,
              )}: ${profile?.identity?.reference_number}`}</div>
            )}
            {profile?.created_at && (
              <div className="mt-3 w-100 text-gray">{`${t(
                `${translationPath}registered-at`,
              )}: ${moment(profile?.created_at)
                .locale(i18next.language)
                .format(GlobalDateFormat)}`}</div>
            )}

            {profile?.location?.city && (
              <div className="d-flex-v-center  text-gray my-2">
                <span className="text-label m-w-120 text-gray font-weight-bold">
                  {t(`${translationPath}city`)}
                </span>
                {profile && profile?.location?.city}
              </div>
            )}
            {profile && profile?.location?.country.name && (
              <div className="d-flex-v-center  text-gray my-2">
                <span className="text-label m-w-120 text-gray font-weight-bold">
                  {t(`${translationPath}country`)}
                </span>
                {profile && profile?.location?.country.name}
              </div>
            )}

            {profile?.personality_report?.status === 'done' && (
              <div className="mt-3">
                <Button
                  className="px-2 py-2 d-flex flex-row align-items-center bg-white justify-content-center"
                  style={{ borderRadius: 99999, width: 205, height: 35 }}
                  disabled={profile?.personality_report?.status !== 'done'}
                  onClick={() => window.open(profile?.personality_report?.url)}
                >
                  <span className="mr-1 h8">
                    <i className="fa fa-users" />
                    <span className="px-1">
                      {t(`${translationPath}personality-report`)}
                    </span>
                  </span>
                </Button>
              </div>
            )}
          </Col>
        )}
        <Col
          className="font-12 profile-overview-right h-100 d-table-cell w-50 position-relative"
          xs={12}
          sm={12}
        >
          <div className="candidate-personal-info-wrppaer d-flex-v-center-h-between">
            <span>{t(`${translationPath}personal-info`)}</span>
            <div className="d-inline-flex-v-center">
              {onEditProfileClicked && (
                <ButtonBase
                  className="btns-icon theme-transparent"
                  onClick={onEditProfileClicked}
                  disabled={
                    !profile
                    || !profile.identity
                    || !profile.identity.uuid
                    || isDisabledEditing
                  }
                >
                  <span className={SystemActionsEnum.edit.icon} />
                </ButtonBase>
              )}
              {profile && profile.cv_url && (
                <div className="rounded-circle social-button ml-1">
                  <a
                    download
                    target="_blank"
                    rel="noreferrer"
                    href={profile?.cv_url}
                  >
                    <i className="fas fa-download font-14" />
                  </a>
                </div>
              )}
            </div>
          </div>
          <div className="h7 text-gray">
            <span className="text-label">{t(`${translationPath}salutation`)}</span>
            {profile && profile?.basic_information?.salutation}
          </div>
          {mode && (
            <div className="h7 text-gray">
              <span className="text-label">{t(`${translationPath}name`)}</span>
              {`${profile && profile?.basic_information?.first_name} ${
                profile && profile?.basic_information?.last_name
              }`}
            </div>
          )}
          <div className="h7 text-gray">
            <span className="text-label">{t(`${translationPath}phone-number`)}</span>
            {profile && profile?.identity?.phone_number}
          </div>
          <div className="h7 text-gray">
            <span className="text-label">{t(`${translationPath}dob`)}</span>
            {profile && profile?.basic_information?.dob
              ? new Date(profile?.basic_information?.dob).toLocaleDateString()
              : ''}
          </div>
          <div className="h7 text-gray">
            <span className="text-label">{t(`${translationPath}gender`)}</span>
            {profile && profile?.basic_information?.gender}
          </div>
          <div className="h7 text-gray">
            <span className="text-label">{t(`${translationPath}nationality`)}</span>
            {profile && profile?.nationality?.map((item) => item.name).join(', ')}
          </div>
          {profile?.basic_information?.national_id && (
            <div className="h7 text-gray">
              <span className="text-label">
                {t(`${translationPath}national-id`)}
              </span>
              {profile && profile.basic_information.national_id}
            </div>
          )}
          <div className="h7 text-gray">
            <span className="text-label">{t(`${translationPath}address`)}</span>
            {profile && profile?.address}
          </div>
          <div className="h7 text-gray">
            <span className="text-label">{t(`${translationPath}email`)}</span>
            {profile?.identity?.email}
          </div>
          <div className="h7 text-gray">
            <span className="text-label">{t(`${translationPath}zip-code`)}</span>
            {profile && profile?.basic_information?.zip_code}
          </div>
          {/* <hr /> */}
          <div className="d-flex flex-row">
            {profile
              && Object.keys(profile?.social || {}).length > 0
              && Object.keys(profile?.social || {})?.map((item, index) => (
                <div key={`profileSocialKey${index + 1}`}>
                  {profile.social[item] !== null && (
                    <Button className="rounded-circle social-button mt-3 mr-2">
                      <SocialIcon url={profile.social[item]} />
                    </Button>
                  )}
                </div>
              ))}
          </div>
        </Col>
      </Row>
      <NoPermissionComponent
        anchorEl={anchorEl}
        popperOpen={popperOpen}
        setAnchorEl={setAnchorEl}
        setPopperOpen={setPopperOpen}
      />
    </Card>
  );
};

export default OverviewCard;

OverviewCard.propTypes = {
  profile: PropTypes.instanceOf(Object),
  mode: PropTypes.bool,
  isDisabledEditing: PropTypes.bool,
  onEditProfileClicked: PropTypes.func,
  hideImage: PropTypes.bool,
};
OverviewCard.defaultProps = {
  profile: null,
  mode: false,
  isDisabledEditing: false,
  onEditProfileClicked: undefined,
  hideImage: false,
};
