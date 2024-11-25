/* eslint-disable no-console */
/* eslint-disable operator-assignment */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 * -----------------------------------------------------------------------------------
 * @title DiscussionForm.jsx
 * -----------------------------------------------------------------------------------
 * This module contains the DiscussionForm component which we use in the candidate
 * modals.
 * -----------------------------------------------------------------------------------
 */

// React components
import React, { useState, useEffect } from 'react';

// API Endpoints
import urls from 'api/urls';

// React Alert Dialog
import ReactBSAlert from 'react-bootstrap-sweetalert';

// Import Evarec API
import { evarecAPI } from 'api/evarec';

// Import shared components
import { Can } from 'utils/functions/permissions';
import Skeleton from '@mui/material/Skeleton';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import CandidateChatSender from './CandidateChatSender';
import CandidateRatingPanel from './CandidateRatingPanel';
import { CandidateDiscussionsList } from './CandidateDiscussionsList';
import {
  addNewDiscussion,
  DeleteDiscussion,
} from '../../shared/APIs/VideoAssessment/Discussions';
import { evassessAPI } from '../../api/evassess';
import { showError, getIsAllowedPermissionV2 } from 'helpers';
import { ManageApplicationsPermissions } from 'permissions';

const translationPath = '';
const parentTranslationPath = 'EvarecCandidateModel';

// Permissions

/**
 * The DiscussionForm functional component
 * @param uuid
 * @param candidateUuid
 * @param getDiscussion
 * @param addDiscussion
 * @param type
 * @returns {JSX.Element}
 * @constructor
 */
const CandidateDiscussionForm = ({
  // Props passed to DiscussionForm Component
  uuid,
  type,
  reportUrl,
  getDiscussion,
  candidateUuid,
  wrapperClasses,
  totalScorecardComponent,
  isShowScorecard,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  const user = JSON.parse(localStorage.getItem('user'))?.results?.user?.uuid;
  // States
  const [discussion, setDiscussion] = useState('');
  const [discussions, setDiscussions] = useState([]);

  // The sate to collect the discussions with pagination
  const [discussionsList, setDiscussionsList] = useState([]);
  const [replies, setReplies] = useState([]);
  const [total, setTotal] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [adding, setAdding] = useState(false);
  const [errors, setErrors] = useState({});
  const [DeleteAlert, setDeleteAlert] = useState(null);
  const [ratingLoader, setRatingLoader] = useState(false);
  const [candidateRatingList, setCandidateRatingList] = useState();
  const [ratings, setRatings] = useState(0);
  const [rateValue, setRateValue] = useState(0);
  const [users, setUsers] = useState();
  const [ratingList, setRatingList] = useState();
  const [isChangedReplies, setIsChangedReplies] = useState(false);

  const [expand, setExpand] = useState(false);
  // State to hold recruiter rate
  const [userRate, setUserRate] = useState(0);

  const subscriptions = useSelector(
    (reducerState) => reducerState?.userSubscriptionsReducer?.subscriptions,
  );
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );

  /**
   * Get Candidates Rating List Function eva-ssess
   * @param {candidateUuid,user}
   */
  const getCandidateRatingVA = () => {
    evassessAPI
      .getRecruiterRate(candidateUuid, user)
      .then((res) => {
        setRatings(res.data.results.avg_rating);
        setUserRate(res.data.results.avg_rating);
        setRatingList(res.data.results.rates);
        setUsers(res.data.results.rates);
        setRateValue(
          res.data?.results?.rates.filter((e) => e.recruiter?.uuid === user)?.[0]
            ?.rate,
        );
      })
      .catch((err) => {
        console.error(err);
      });
  };

  /**
   * Effect to get invited users, then the avg_rating
   */
  useEffect(() => {
    if (type === 'prep_assessment')
      // evassessAPI.getAssessment(uuid).then((res) => {
      //   setUsers(res.results.teams_invited);
      getCandidateRatingVA();
    //   });
  }, []);

  /**
   * Get Discussion List Function
   * @param {candidateUuid, page, limit}
   */
  const handleToggleDiscussion = async (localCandidateUuid, localPage) => {
    if (
      getDiscussion
      && !getIsAllowedPermissionV2({
        permissions,
        permissionId:
          ManageApplicationsPermissions.DiscussionInEvaRecApplication.key,
      })
    ) {
      setIsLoaded(true);
      return;
    }
    if (localPage > 1) setLoadingMore(true);
    else setLoadingMore(false);

    if (getDiscussion) {
      let params = null;
      if (type === 'prep_assessment')
        params = {
          candidate_uuid: localCandidateUuid,
          page: localPage,
          limit: pageSize,
        };
      else
        params = {
          job_candidate_uuid: localCandidateUuid,
          page: localPage,
          limit: pageSize,
        };

      /**
       * Get discussion list from API
       */
      getDiscussion(params)
        .then((res) => {
          // If discussion items have not been loaded then set the discussions and
          // create the discussions list
          if (localPage === 1) {
            setDiscussions(res.data?.results?.data);
            setDiscussionsList([...(res.data?.results?.data || [])]);
            setIsLoaded(true);
          }
          // If the discussion items have been loaded and we are loading more, then
          // we add the stored discussion list and the retrieved data and set the
          // discussion state accordingly. We also maintain the new discussion list by
          // appending to it the new items.
          if (localPage > 1)
            setDiscussions(
              [...discussionsList, ...res.data.results.data],
              setDiscussionsList([
                ...discussionsList,
                ...(res.data?.results?.data || []),
              ]),
            );

          // We set other pages
          setTotal(res.data?.results?.total);
          setPage(res.data?.results?.page);
          setPageSize(res.data?.results?.per_page);
          setLoadingMore(false);
        })
        .catch((error) => {
          setErrors(error?.response?.data?.errors);
          setLoadingMore(false);
          setIsLoaded(false);
        });
    }
  };

  /**
   * Get Candidates Rating List Function EVA-Rec
   * @param {candidateUuid}
   */
  const getCandidateRating = () => {
    evarecAPI
      .getCandidateRating(candidateUuid)
      .then((res) => {
        setCandidateRatingList(res.data.results);
        setRatings(res.data.results.avg_rating);
        setUserRate(res.data.results.avg_rating);
        setRateValue(
          res.data?.results?.rates.filter((e) => e.recruiter?.uuid === user)?.[0]
            ?.rate,
        );
      })
      .catch((err) => {
        console.error(err);
      });
  };
  useEffect(() => {
    if (candidateUuid) {
      if (type !== 'prep_assessment') getCandidateRating();
      setPage((item) => (item > 1 ? 1 : item));
      /**
       * Load the first 50 discussion comments
       * and set the page for the next load
       */
      handleToggleDiscussion(candidateUuid, 1);
    }
  }, [candidateUuid]);

  /**
   * Hide alert
   */
  const hideAlert = () => {
    setDeleteAlert(null);
  };

  /**
   * Add Comment to Discussion Function
   * @param discussion
   */
  const handleAddDiscussion = () => {
    setAdding(true);
    let params = null;
    const url
      = type === 'prep_assessment'
        ? urls.evassess.getDiscussion_WRITE
        : urls.evarec.ats.DISCUSSION_WRITE;

    if (type === 'prep_assessment')
      params = {
        candidate_uuid: candidateUuid,
        comment: discussion.comment ? discussion.comment : 'Attached File',
        media_uuid: discussion.attachment && discussion.attachment.uuid,
      };
    else
      params = {
        job_candidate_uuid: candidateUuid,
        comment: discussion.comment ? discussion.comment : 'Attached File',
        media_uuid: discussion.attachment && discussion.attachment.uuid,
      };

    /**
     * Add a discussion comment
     */
    addNewDiscussion(url, params).then((res) => {
      if (res.statusCode === 200) {
        discussions.push(res.results);
        setDiscussions(discussions);
        window?.ChurnZero?.push([
          'trackEvent',
          'Send a message in a discussion',
          'Send a message in a discussion a candidate modal',
          1,
          {},
        ]);
      } else {
        showError(t('Shared:failed-to-get-saved-data'), res);
        setErrors(res.errors);
      }

      setDiscussion('');
      setAdding(false);
    });
  };

  /**
   * Delete comment from Discussion Function
   * @param uuid
   * @param index
   */
  const handleDeleteDiscussion = (id, index, category) => {
    setAdding(true);
    const params = {
      uuid: id,
    };
    const url
      = type === 'prep_assessment'
        ? urls.evassess.getDiscussion_WRITE
        : urls.evarec.ats.DISCUSSION_WRITE;
    DeleteDiscussion(url, params).then((res) => {
      if (res.statusCode === 200) {
        if (category === 'reply') {
          discussions[index].number_replays = discussions[index].number_replays - 1;
          setIsChangedReplies((item) => !item);
          console.log('discussionReply to be fixed sending to child', discussions);
          setDiscussions(discussions);
        } else {
          setDiscussion('');
          discussions.splice(index, 1);
          setDiscussions(discussions);
        }
        hideAlert();
      } else setErrors(res.errors);

      setAdding(false);
    });
  };

  /**
   * Alert to be shown 'after' deletion confirmation
   * @param uuid
   * @param index
   */
  const confirmedAlert = (id, index, category) => {
    setDeleteAlert(
      <ReactBSAlert
        warning
        style={{ display: 'block' }}
        title={t(`${translationPath}deleting`)}
        showConfirm={false}
        onConfirm={() => {}}
        showCancel={false}
      />,
    );
    handleDeleteDiscussion(id, index, category);
  };

  /**
   * Confirmation of deletion alert
   * @param uuid
   * @param index
   */
  const confirmAlert = (id, index, category) => {
    setDeleteAlert(
      <ReactBSAlert
        warning
        style={{ display: 'block' }}
        title={t(`${translationPath}are-you-sure`)}
        onConfirm={() => confirmedAlert(id, index, category)}
        onCancel={() => hideAlert()}
        showCancel
        confirmBtnBsStyle="danger"
        cancelBtnText={t(`${translationPath}cancel`)}
        cancelBtnBsStyle="success"
        confirmBtnText={t(`${translationPath}yes-delete-it`)}
        btnSize=""
      >
        {t(`${translationPath}you-wont-be-able-to-revert-this`)}
      </ReactBSAlert>,
    );
  };

  /**
   * handler to add/edit the rating
   * @param rating
   */
  const handleRating = (rate) => {
    if (type === 'prep_assessment') {
      setRatingLoader(true);
      evassessAPI.rateCandidate(candidateUuid, rate.toFixed(0)).then((res) => {
        // Set the new recruiter rate value for stars
        setRateValue(res.data.results.rate);
        // update average rating value
        setRatings(res.data.results.avg_rating);
        setUserRate(res.data.results.avg_rating);
        getCandidateRatingVA();
        // set loading to false
        setRatingLoader(false);
      });
    } else {
      setRatingLoader(true);
      evarecAPI.rateCandidate(candidateUuid, rate).then((res) => {
        // Set the new recruiter rate value for stars
        setRateValue(res.data.results.rate);
        // update average rating value
        setRatings(res.data.results.avg_rating);
        setUserRate(res.data.results.avg_rating);
        // get candidate ratings list after new rate
        getCandidateRating();
        // set loading to false
        setRatingLoader(false);
      });
    }
  };

  return (
    <div className={wrapperClasses || 'discussion-form'}>
      {DeleteAlert}
      <div className="discussion-content">
        <div className="discussion-rating">
          {isShowScorecard ? (
            totalScorecardComponent
          ) : (
            <CandidateRatingPanel
              users={users}
              type="discussion"
              rating={rateValue}
              avgRating={ratings}
              userRate={userRate}
              reportUrl={reportUrl}
              key={`candidatePanelKey${candidateUuid}`}
              title={t(`${translationPath}rate-candidate`)}
              loading={ratingLoader}
              supertitle={t(`${translationPath}discussion`)}
              onRating={handleRating}
              ratingList={ratingList}
              setUserRate={setUserRate}
              discussions={discussions}
              candidateUuid={candidateUuid}
              setDiscussions={setDiscussions}
              candidateRatingList={candidateRatingList}
              can={Can('edit', 'ats') || Can('create', 'ats')}
            />
          )}
        </div>

        <div className="discussion-list overflow-auto">
          <div className="mb-3 scroll_comments p-4">
            {discussions
              && discussions.length > 0
              && discussions?.map((item, i) => (
                <CandidateDiscussionsList
                  t={t}
                  key={`${i + 1}-discussion${candidateUuid}`}
                  index={i}
                  type={type}
                  uuid={item.uuid}
                  replies={replies}
                  discussion={item}
                  assessment_uuid={uuid}
                  discussionUser={item.user}
                  component="discussion"
                  isChangedReplies={isChangedReplies}
                  discussions={discussions}
                  candidate_uuid={candidateUuid}
                  add_discussion_loader={adding}
                  onChange={(value) => setDiscussion(value)}
                  confirmAlert={(commentUUID, commentType) => {
                    confirmAlert(commentUUID, i, commentType);
                  }}
                  can={Can('edit', 'ats') || Can('create', 'ats')}
                />
              ))}
            {!isLoaded && (
              <div className="disscussion-list-skeleton-wrapper">
                <div className="d-flex mb-3">
                  <Skeleton
                    className="mr-2-reversed"
                    variant="circular"
                    width={50}
                    height={50}
                  />
                  <Skeleton variant="rectangular" width={200} height={45} />
                </div>
                <div className="d-flex mb-3">
                  <Skeleton
                    className="mr-2-reversed"
                    variant="circular"
                    width={50}
                    height={50}
                  />
                  <Skeleton variant="rectangular" width={200} height={40} />
                </div>
                <div className="d-flex mb-3">
                  <Skeleton
                    className="mr-2-reversed"
                    variant="circular"
                    width={50}
                    height={50}
                  />
                  <Skeleton variant="rectangular" width={200} height={40} />
                </div>
                <div className="d-flex mb-3">
                  <Skeleton
                    className="mr-2-reversed"
                    variant="circular"
                    width={50}
                    height={50}
                  />
                  <Skeleton variant="rectangular" width={200} height={40} />
                </div>
              </div>
            )}
            {isLoaded && total > 10 && discussions.length > 0 && (
              <>
                {loadingMore ? (
                  <div className="d-flex flex-row justify-content-center">
                    <i className="fas fa-circle-notch fa-spin float-left" />
                  </div>
                ) : (
                  <>
                    <div className="d-flex flex-row justify-content-center">
                      <a
                        className="font-size-850 cursor-pointer"
                        onClick={() =>
                          handleToggleDiscussion(candidateUuid, page + 1)
                        }
                        disabled={
                          !getIsAllowedPermissionV2({
                            permissions,
                            permissionId:
                              ManageApplicationsPermissions
                                .DiscussionInEvaRecApplication.key,
                          })
                        }
                      >
                        {t(`${translationPath}view-more`)}
                      </a>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
          <>
            <CandidateChatSender
              hasAttach
              uuid={uuid}
              users={users}
              expand={expand}
              hasReply={false}
              value={discussion}
              isSending={adding}
              rating={rateValue}
              subscriptions={subscriptions}
              permissions={permissions}
              avgRating={ratings}
              setExpand={setExpand}
              assessment_uuid={uuid}
              loading={ratingLoader}
              onRating={handleRating}
              ratingList={ratingList}
              setUserRate={setUserRate}
              discussions={discussions}
              candidateUuid={candidateUuid}
              onSubmit={handleAddDiscussion}
              candidate_uuid={candidateUuid}
              setDiscussions={setDiscussions}
              discussionsList={discussionsList}
              candidateRatingList={candidateRatingList}
              onChange={(value) => setDiscussion(value)}
              can={Can('edit', 'ats') || Can('create', 'ats')}
            />

            {errors?.discussion ? (
              errors.discussion.length > 1 ? (
                errors.discussion.map((error, index) => (
                  <p key={index} className="m-0 text-xs text-danger">
                    {error}
                  </p>
                ))
              ) : (
                <p className="m-o text-xs text-danger">{errors.discussion}</p>
              )
            ) : (
              ''
            )}
          </>
        </div>
      </div>
    </div>
  );
};

export default CandidateDiscussionForm;
