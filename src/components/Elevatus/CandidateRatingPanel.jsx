import React, { useState, useEffect } from 'react';
import Rating from '@mui/material/Rating';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getIsAllowedPermissionV2, getIsAllowedSubscription } from '../../helpers';
import { SubscriptionServicesEnum } from '../../enums';
import NoPermissionComponent from '../../shared/NoPermissionComponent/NoPermissionComponent';
import { ManageApplicationsPermissions } from '../../permissions';

const translationPath = '';
const parentTranslationPath = 'EvarecCandidateModel';

/**
 * The rating panel where company employees can rate videos and candidates alike.
 * @param supertitle
 * @param title
 * @param ratedUsers
 * @param rating
 * @param onRating
 * @param loading
 * @param avgRating
 * @param getRecruiterRate
 * @param type
 * @returns {JSX.Element}
 * @constructor
 */
const CandidateRatingPanel = ({
  title,
  rating,
  loading,
  userRate,
  onRating,
  reportUrl,
  avgRating,
  setUserRate,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  // eslint-disable-next-line no-unused-vars
  const user = JSON.parse(localStorage.getItem('user'))?.results?.user?.uuid;
  // Rating value placeholder
  const [ratingValue, setRatingValue] = useState(null);
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
  const subscriptions = useSelector(
    (reducerState) => reducerState?.userSubscriptionsReducer?.subscriptions,
  );

  // Effect to update average rating directly after recruiter rate candidate
  useEffect(() => {
    setUserRate(avgRating);
  }, [avgRating]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [popperOpen, setPopperOpen] = useState(false);

  const onPopperOpen = (event) => {
    if (
      !getIsAllowedSubscription({
        serviceKey: SubscriptionServicesEnum.EvaRec.key,
        subscriptions,
      })
    ) {
      setAnchorEl(event.currentTarget);
      setPopperOpen(true);
    }
  };

  return (
    <>
      <div className="candidate-rating-panel">
        <div className="candidate-rating-options">
          <div className="your-rating-wrapper">
            <span className="rating-title">{title}</span>
            <span className="your-rating-title">
              {t(`${translationPath}your-rating`)}{' '}
              {Number(ratingValue || rating).toFixed(1)}
            </span>
            <div onMouseEnter={onPopperOpen} className="rating-loader-wrapper">
              <Rating
                disabled={
                  !getIsAllowedPermissionV2({
                    permissions,
                    permissionId: ManageApplicationsPermissions.RateApplicants.key,
                  })
                }
                value={ratingValue || ratingValue === 0 ? ratingValue : userRate}
                name="simple-controlled"
                onChange={(event, newValue) => {
                  setRatingValue(newValue);
                  onRating(newValue);
                }}
              />
              {loading && (
                <span className="text-success text-sm">
                  <i className="fas fa-circle-notch fa-spin" />
                </span>
              )}
            </div>
          </div>
          <div className="team-rating-wrapper">
            <div className="team-rating-title">
              {t(`${translationPath}team-avarage-rating`)}
            </div>
            <div className="team-rating-value">
              {Number(ratingValue || userRate).toFixed(1)}
            </div>
            <div className="team-rating-title">
              {t(`${translationPath}out-of`)} 5
            </div>
          </div>
        </div>

        {/* <div className="personality-report-wrapper">
        {(reportUrl && reportUrl.status === 'under_processing')
        || getIsAllowedPermissionV2({
          permissions,
          permissionId: ManageApplicationsPermissions.PersonalityAnalysis.key,
        }) ? (
          <Button
            disabled
            className="personality-report-title"
            data-tooltip="Under Processing"
          >
            <i className="fas fa-user" />
            Personality Report
          </Button>
          ) : (
            <a href={reportUrl?.url} target="_blank" rel="noreferrer">
              <Button
                className="personality-report-title"
                data-tooltip="Under Processing"
              >
                <i className="fas fa-user" />
                Personality Report
              </Button>
            </a>
          )}
      </div> */}
      </div>

      <NoPermissionComponent
        anchorEl={anchorEl}
        popperOpen={popperOpen}
        setAnchorEl={setAnchorEl}
        setPopperOpen={setPopperOpen}
      />
    </>
  );
};

export default CandidateRatingPanel;
