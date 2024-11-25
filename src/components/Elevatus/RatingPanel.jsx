/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import Rating from '@mui/material/Rating';
import LetterAvatar from 'components/Elevatus/LetterAvatar';
import { Row } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { evarecAPI } from '../../api/evarec';
import { evassessAPI } from '../../api/evassess';
import { getIsAllowedPermissionV2, getIsAllowedSubscription } from '../../helpers';
import { SubscriptionServicesEnum } from '../../enums';
import NoPermissionComponent from '../../shared/NoPermissionComponent/NoPermissionComponent';
import { ManageApplicationsPermissions } from '../../permissions';
// React Strap components

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
const translationPath = 'RatingPanelComponent.';
const RatingPanel = ({
  supertitle,
  title,
  rating,
  onRating,
  loading,
  avgRating,
  type,
  candidateRatingList,
  setDiscussions,
  discussions,
  candidateUuid,
  users,
  ratingList,
  parentTranslationPath,
  videoUuid,
  mode,
}) => {
  const { t } = useTranslation(parentTranslationPath || 'EvaSSESSPipeline');
  // State to hold recruiter rate
  const [userRate, setUserRate] = useState(avgRating);
  // State to hold discussions before filtering
  // eslint-disable-next-line no-unused-vars
  const [discussionsList] = useState(discussions);
  // State to Expand Users
  const [expand, setExpand] = useState(false);

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
  // Get the AvgRating, if user click on all user icon
  const getAvgRating = () => {
    setUserRate(avgRating);
    setDiscussions(discussionsList);
  };
  // Get Rating for specific recruiter
  const getRecruiterRates = (uuid) => {
    if (users) {
      // EVA-SSESS
      const avg_rating = ratingList.filter((e) => e.recruiter?.uuid === uuid);
      setUserRate(avg_rating?.[0]?.rate);
      // eslint-disable-next-line no-use-before-define
      getRecruiterDiscussion(uuid);
    } else {
      // EVA-REC
      const avg_rating = candidateRatingList?.rates?.filter(
        (e) => e.recruiter?.uuid === uuid,
      );
      setUserRate(avg_rating?.[0]?.rate);
      // eslint-disable-next-line no-use-before-define
      getRecruiterDiscussion(uuid);
    }
  };
  const getRecruiterDiscussion = (uuid) => {
    if (users)
      evassessAPI.getDiscussionFiltered(candidateUuid, uuid).then((res) => {
        setDiscussions(res?.data?.results?.data);
      });
    else
      evarecAPI.getDiscussion(candidateUuid, uuid).then((res) => {
        setDiscussions(res?.data?.results?.data);
      });
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [popperOpen, setPopperOpen] = useState(false);

  const onPopperOpen = (event) => {
    if (
      !getIsAllowedSubscription({
        defaultServices: SubscriptionServicesEnum,
        subscriptions,
      })
    ) {
      setAnchorEl(event.currentTarget);
      setPopperOpen(true);
    }
  };

  return (
    <>
      <div
        className={`${type}-rating-panel rating-controls-wrapper d-flex flex-row align-items-center justify-content-between`}
      >
        <div className="rating-controls-candidates d-flex flex-column align-items-start">
          {supertitle && (
            <span className="h5 mr-3-reversed text-white">{supertitle}</span>
          )}
          <div className="d-flex-v-center flex-row" onMouseEnter={onPopperOpen}>
            {type === 'discussion' ? (
              <span className="mr-3-reversed mb-2 text-white">{title}</span>
            ) : (
              <span className="mr-3-reversed mb-2 text-gray">{title}</span>
            )}
            <Rating
              disabled={
                (mode === 'ssess' && !videoUuid)
                || !getIsAllowedPermissionV2({
                  permissions,
                  permissionId: ManageApplicationsPermissions.RateApplicants.key,
                })
              }
              value={rating || rating === 0 ? rating : userRate}
              onChange={(event, newValue) => {
                const {
                  target: { value },
                } = event;
                setUserRate(newValue);
                onRating(+value);
              }}
            />
            <span className="ml-2-reversed mb-2" style={{ color: '#ffb800' }}>
              {Number(userRate || 0).toFixed(1)}
            </span>
            {loading ? (
              <span className="ml-4-reversed text-success text-sm mb-2">
                <i className="fas fa-circle-notch fa-spin" />
              </span>
            ) : null}
          </div>
          {type === 'discussion' && !candidateRatingList && (
            <div className="mt-4 rated-candidates d-flex flex-row">
              {users && users.length ? (
                <>
                  <div
                    key="all"
                    className="rated-candidate-item bg-primary mr-1-reversed selected"
                    style={{ cursor: 'pointer' }}
                    role="button"
                    onClick={getAvgRating}
                  >
                    <i className="fas fa-users" />
                  </div>
                  {expand ? (
                    <Row className="mx-0">
                      {users.map((item, index) => (
                        <div
                          key={`usersKey${index + 1}`}
                          className="rated-candidate-item mr-1-reversed"
                        >
                          <LetterAvatar
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              getRecruiterRates(item.recruiter?.uuid);
                            }}
                            alt="user-profile"
                            name={`${item.recruiter?.first_name} ${item.recruiter?.last_name}`}
                          />
                        </div>
                      ))}
                    </Row>
                  ) : (
                    <Row style={{ marginRight: '0px', marginLeft: '0px' }}>
                      {users.slice(0, 3).map((item, index) => (
                        <div
                          key={`usersKey${index + 1}`}
                          className="rated-candidate-item mr-1-reversed"
                        >
                          <LetterAvatar
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              getRecruiterRates(item.recruiter?.uuid);
                            }}
                            name={`${item.recruiter?.first_name} ${item.recruiter?.last_name}`}
                          />
                        </div>
                      ))}
                    </Row>
                  )}

                  {!expand && users.length > 3 && (
                    <div
                      key="more"
                      role="button"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setExpand(true)}
                      className="rated-candidate-item bg-gray mr-1-reversed"
                    >
                      +{users.length - 3}
                    </div>
                  )}
                </>
              ) : (
                <h6 className="h6 text-white">
                  {t(`${translationPath}no-candidates-rated`)}
                </h6>
              )}
            </div>
          )}
          {type === 'discussion' && candidateRatingList ? (
            <div className="mt-4 rated-candidates d-flex flex-row">
              {candidateRatingList && candidateRatingList.rates.length ? (
                <>
                  <div
                    key="all"
                    style={{ cursor: 'pointer' }}
                    role="button"
                    className="rated-candidate-item bg-primary mr-1-reversed selected"
                    onClick={getAvgRating}
                  >
                    <i className="fas fa-users" />
                  </div>
                  {expand ? (
                    <Row style={{ marginRight: '0px', marginLeft: '0px' }}>
                      {candidateRatingList.rates.map((item, index) => (
                        <div
                          key={`candidateRatingListKey${index + 1}`}
                          className="rated-candidate-item mr-1-reversed"
                        >
                          <LetterAvatar
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              getRecruiterRates(item.recruiter?.uuid);
                            }}
                            name={`${item.recruiter?.first_name} ${item.recruiter?.last_name}`}
                          />
                        </div>
                      ))}
                    </Row>
                  ) : (
                    <Row style={{ marginRight: '0px', marginLeft: '0px' }}>
                      {candidateRatingList.rates.slice(0, 3).map((item, index) => (
                        <div
                          key={`candidateRatingRatesListKey${index + 1}`}
                          className="rated-candidate-item mr-1-reversed"
                        >
                          <LetterAvatar
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              getRecruiterRates(item.recruiter?.uuid);
                            }}
                            name={`${item.recruiter?.first_name} ${item.recruiter?.last_name}`}
                          />
                        </div>
                      ))}
                    </Row>
                  )}

                  {!expand && candidateRatingList.rates.length > 3 && (
                    <div
                      key="more"
                      style={{ cursor: 'pointer' }}
                      role="button"
                      onClick={() => setExpand(true)}
                      className="rated-candidate-item bg-gray mr-1-reversed"
                    >
                      +{candidateRatingList.rates.length - 3}
                    </div>
                  )}
                </>
              ) : (
                <h6 className="h6 text-white">
                  {t(`${translationPath}no-candidates-rated`)}
                </h6>
              )}
            </div>
          ) : null}
        </div>
        {type === 'discussion' && (
          <div className="rating-controls-value d-flex flex-column align-items-end">
            <h2 className="h2 mb-0">{Number(userRate || 0).toFixed(1)}</h2>
            <h5 className="h5 text-light-gray mb-0">
              {t(`${translationPath}out-of-5`)}
            </h5>
          </div>
        )}
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

RatingPanel.propTypes = {
  videoUuid: PropTypes.string,
  mode: PropTypes.string,
};

RatingPanel.defaultProps = {
  videoUuid: '',
  mode: 'rec',
};

export default RatingPanel;
