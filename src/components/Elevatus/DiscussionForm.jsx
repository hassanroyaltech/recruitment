/* eslint-disable react/jsx-indent-props */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable operator-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable no-shadow */
/* eslint-disable no-nested-ternary */
/**
 * -----------------------------------------------------------------------------------
 * @title DiscussionForm.jsx
 * -----------------------------------------------------------------------------------
 * This module contains the DiscussionForm component which we use in the candidate
 * modals.
 * -----------------------------------------------------------------------------------
 */

// React components
import React, { useState, useEffect, useCallback, useMemo } from 'react';

// API Endpoints
import urls from 'api/urls';

// React Alert Dialog
import ReactBSAlert from 'react-bootstrap-sweetalert';

// Import Evarec API
import { evarecAPI } from 'api/evarec';

// Import shared components
import { useTranslation } from 'react-i18next';
import { useToasts } from 'react-toast-notifications';
import { useSelector } from 'react-redux';
import Loader from './Loader';
import ChatSender from './ChatSender';
import RatingPanel from './RatingPanel';
import { DiscussionsList } from './DiscussionsList';
import {
  addNewDiscussion,
  DeleteDiscussion,
} from '../../shared/APIs/VideoAssessment/Discussions';
import { evassessAPI } from '../../api/evassess';
import { getIsAllowedPermissionV2, showError } from '../../helpers';
import {
  ManageApplicationsPermissions,
  ManageAssessmentsPermissions,
} from '../../permissions';
import i18next from 'i18next';

// Permissions

/**
 * The DiscussionForm functional component
 * @param uuid
 * @param candidateUuid
 * @param getDiscussion
 * @param addDiscussion
 * @param type
 * @param rating
 * @param avgRating
 * @param ratedUsers
 * @returns {JSX.Element}
 * @constructor
 */
const translationPath = 'DiscussionFormComponent.';
const DiscussionForm = ({
  // Props passed to DiscussionForm Component
  uuid,
  candidateUuid,
  getDiscussion,
  type,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath || 'EvaSSESSPipeline');
  const user = JSON.parse(localStorage.getItem('user'))?.results?.user?.uuid;
  // States
  const [discussion, setDiscussion] = useState('');
  const [discussions, setDiscussions] = useState([]);
  const { addToast } = useToasts(); // Toasts

  const [replies] = useState([]);
  const [total, setTotal] = useState(null);
  const [page, setPage] = useState(1);
  const [, setPageSize] = useState(0);
  const [loading, setLoading] = useState(false);
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
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );

  /**
   * Get Candidates Rating List Function eva-ssess
   * @param {candidateUuid,user}
   */
  const getCandidateRatingVA = useCallback(async () => {
    evassessAPI
      .getRecruiterRate(candidateUuid, user)
      .then((res) => {
        const { results } = res.data;
        if (results) {
          setRatings(results?.avg_rating);
          setRatingList(results?.rates);
          setUsers(results?.rates);
          setRateValue(
            results?.rates?.filter((e) => e.recruiter?.uuid === user)?.[0]?.rate,
          );
        }
      })
      .catch(() => {
        addToast(t(`${translationPath}error-in-getting-data`), {
          appearance: 'error',
          autoDismiss: true,
        });
      });
  }, [candidateUuid, user]);
  /**
   * Effect to get invited users, then the avg_rating
   */
  useEffect(() => {
    if (type === 'prep_assessment')
      // evassessAPI.getAssessment(uuid).then((res) => {
      //   setUsers(res.results.teams_invited);
      getCandidateRatingVA();
    //   });
  }, [getCandidateRatingVA, type]);
  /**
   * Get Candidates Rating List Function EVA-Rec
   * @param {candidateUuid}
   */
  const getCandidateRating = useCallback(async () => {
    await evarecAPI
      .getCandidateRating(candidateUuid)
      .then((res) => {
        const { results } = res.data;
        if (results) {
          setCandidateRatingList(results);
          setRatings(results?.avg_rating);
          setRateValue(
            results?.rates.filter((e) => e.recruiter?.uuid === user)?.[0]?.rate,
          );
        }
      })
      .catch(() => {
        addToast(t(`${translationPath}error-in-getting-data`), {
          appearance: 'error',
          autoDismiss: true,
        });
      });
  }, [candidateUuid, user]);
  /**
   * Get Discussion List Function
   * @param {candidateUuid, page, limit}
   */
  const handleToggleDiscussion = useCallback(
    async (candidateUuid, page) => {
      if (page === 1) setLoading(true);

      if (page > 1) setLoadingMore(true);

      if (getDiscussion) {
        let params = null;
        if (type === 'prep_assessment')
          params = {
            candidate_uuid: candidateUuid,
            page,
            limit: 10,
          };
        else
          params = {
            job_candidate_uuid: candidateUuid,
            page,
            limit: 10,
          };

        /**
         * Get discussion list from API
         */
        await getDiscussion(params)
          .then((res) => {
            // If discussion items have not been loaded then set the discussions and
            // create the discussions list
            if (page === 1) {
              setDiscussions(res.data?.results?.data);
              setIsLoaded(true);
            }
            // If the discussion items have been loaded and we are loading more, then
            // we add the stored discussion list and the retrieved data and set the
            // discussion state accordingly. We also maintain the new discussion list by
            // appending to it the new items.
            if (page > 1)
              setDiscussions((items) => [
                ...items,
                ...(res?.data?.results?.data || []),
              ]);

            // We set other pages
            setTotal(res.data?.results?.total);
            setPage(res.data?.results?.page);
            setPageSize(res.data?.results?.per_page);
            setLoadingMore(false);
            setLoading(false);
          })
          .catch((error) => {
            setErrors(error?.response?.data?.errors);
            setLoadingMore(false);
            setLoading(false);
          });
      }
    },
    [type],
  );
  useEffect(() => {
    if (candidateUuid) {
      if (type !== 'prep_assessment') getCandidateRating();

      /**
       * Load the first 50 discussion comments
       * and set the page for the next load
       */
      handleToggleDiscussion(candidateUuid, 1);
    }
  }, [candidateUuid, getCandidateRating, handleToggleDiscussion, type]);

  /**
   * Add Comment to Discussion Function
   * @param discussion
   */
  const handleAddDiscussion = (discussion) => {
    setLoading(true);
    setAdding(true);
    let params = null;
    const url
      = type === 'prep_assessment'
        ? urls.evassess.getDiscussion_WRITE
        : urls.evarec.ats.DISCUSSION_WRITE;

    if (type === 'prep_assessment')
      params = {
        candidate_uuid: candidateUuid,
        comment: discussion.comment
          ? discussion.comment
          : t(`${translationPath}attached-file`),
        media_uuid: discussion.attachment && discussion.attachment.uuid,
      };
    else
      params = {
        job_candidate_uuid: candidateUuid,
        comment: discussion.comment
          ? discussion.comment
          : t(`${translationPath}attached-file`),
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
      setLoading(false);
    });
  };

  /**
   * Delete comment from Discussion Function
   * @param uuid
   * @param index
   * @param category
   */
  const handleDeleteDiscussion = (uuid, index, category) => {
    setLoading(true);
    setAdding(true);
    const params = {
      uuid,
    };
    const url
      = type === 'prep_assessment'
        ? urls.evassess.getDiscussion_WRITE
        : urls.evarec.ats.DISCUSSION_WRITE;
    DeleteDiscussion(url, params).then((res) => {
      if (res.statusCode === 200) {
        if (category === 'reply') {
          discussions[index].number_replays = discussions[index].number_replays - 1;
          setDiscussions(discussions);
        } else {
          setDiscussion('');
          discussions.splice(index, 1);
          setDiscussions(discussions);
        }
        hideAlert();
      } else setErrors(res.errors);

      setAdding(false);
      setLoading(false);
    });
  };

  /**
   * Alert to be shown 'after' deletion confirmation
   * @param uuid
   * @param index
   */
  const confirmedAlert = (uuid, index, category) => {
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
    handleDeleteDiscussion(uuid, index, category);
  };

  /**
   * Confirmation of deletion alert
   * @param uuid
   * @param index
   */
  const confirmAlert = (uuid, index, category) => {
    setDeleteAlert(
      <ReactBSAlert
        warning
        style={{ display: 'block' }}
        title={t(`${translationPath}are-you-sure`)}
        onConfirm={() => confirmedAlert(uuid, index, category)}
        onCancel={() => hideAlert()}
        showCancel
        confirmBtnBsStyle="danger"
        cancelBtnText={t(`${translationPath}cancel`)}
        cancelBtnBsStyle="success"
        confirmBtnText={t(`${translationPath}yes-delete-it`)}
        btnSize=""
      >
        {t(`${translationPath}revert-description`)}
      </ReactBSAlert>,
    );
  };

  /**
   * Hide alert
   */
  const hideAlert = () => {
    setDeleteAlert(null);
  };

  /**
   * handler to add/edit the rating
   * @param rating
   */
  const handleRating = (rating) => {
    if (type === 'prep_assessment') {
      setRatingLoader(true);
      evassessAPI
        .rateCandidate(candidateUuid, rating.toFixed(0))
        .then((res) => {
          const { results } = res.data;

          // Set the new recruiter rate value for stars
          setRateValue(results?.rate);
          // update average rating value
          setRatings(results?.avg_rating);
          getCandidateRatingVA();
          // set loading to false
          setRatingLoader(false);
        })
        .catch(() => {
          addToast(t(`${translationPath}error-in-getting-data`), {
            appearance: 'error',
            autoDismiss: true,
          });
        });
    } else {
      setRatingLoader(true);
      evarecAPI
        .rateCandidate(candidateUuid, rating)
        .then((res) => {
          const { results } = res.data;
          // Set the new recruiter rate value for stars
          setRateValue(results?.rate);
          // update average rating value
          setRatings(results?.avg_rating);
          // get candidate ratings list after new rate
          getCandidateRating();
          // set loading to false
          setRatingLoader(false);
        })
        .catch(() => {
          addToast(t(`${translationPath}error-in-getting-data`), {
            appearance: 'error',
            autoDismiss: true,
          });
        });
    }
  };

  // For check if type Eva-Rec or Eva-Sess and check discussion permission
  const checkDiscussionPermissionDueToType = useMemo(
    () =>
      getIsAllowedPermissionV2({
        permissions,
        permissionId:
          type === 'prep_assessment'
            ? ManageAssessmentsPermissions.DiscussionInEvaSsessApplication.key
            : ManageApplicationsPermissions.DiscussionInEvaRecApplication.key,
      }),
    [permissions, type],
  );

  return (
    <div
      className={`discussion-form-${i18next.language === 'ar' ? 'left' : 'right'}`}
    >
      {DeleteAlert}
      <div className="discussion-content">
        {loading ? (
          <Loader speed={1} color="primary" />
        ) : (
          <div className="discussion-rating">
            <RatingPanel
              supertitle={t(`${translationPath}discussion`)}
              type="discussion"
              title={t(`${translationPath}discussion`)}
              // ratedUsers={ratedUsers}
              users={users}
              rating={rateValue}
              onRating={handleRating}
              loading={ratingLoader}
              avgRating={ratings}
              candidateRatingList={candidateRatingList}
              ratingList={ratingList}
              parentTranslationPath={parentTranslationPath}
              candidateUuid={candidateUuid}
              discussions={discussions}
              setDiscussions={setDiscussions}
            />
          </div>
        )}
        <div className="discussion-list overflow-auto">
          <div className="mb-3 d-flex flex-wrap scroll_comments p-4">
            {loading ? (
              <Loader speed={1} color="primary" />
            ) : (
              // If no discussions exist (total = 0), then we display then we keep it empty
              discussions.map((item, i) => (
                <DiscussionsList
                  t={t}
                  type={type}
                  confirmAlert={(uuid, type) => {
                    confirmAlert(uuid, i, type);
                  }}
                  candidate_uuid={candidateUuid}
                  assessment_uuid={uuid}
                  uuid={item.uuid}
                  parentTranslationPath={parentTranslationPath}
                  onChange={(value) => {
                    setDiscussion(value);
                  }}
                  index={i}
                  replies={replies}
                  discussion={item}
                  key={`discussionsKey${i + 1}`}
                  add_discussion_loader={adding}
                  can={checkDiscussionPermissionDueToType}
                />
              ))
            )}
            {isLoaded
              && total > 10
              && discussions.length > 0
              && (loadingMore ? (
                <div className="d-flex flex-row justify-content-center">
                  <i className="fas fa-circle-notch fa-spin float-left" />
                </div>
              ) : (
                <div className="d-flex flex-row justify-content-center">
                  <a
                    role="button"
                    className="font-size-850 cursor-pointer"
                    onClick={() => handleToggleDiscussion(candidateUuid, page + 1)}
                  >
                    {t(`${translationPath}view-more`)}
                  </a>
                </div>
              ))}
          </div>
          {!loading && (
            <>
              <ChatSender
                uuid={uuid}
                candidate_uuid={candidateUuid}
                assessment_uuid={uuid}
                value={discussion}
                onChange={(value) => setDiscussion(value)}
                onSubmit={handleAddDiscussion}
                isSending={adding}
                hasAttach
                hasReply={false}
                placeholder={t(`${translationPath}discuss-away`)}
                can={checkDiscussionPermissionDueToType}
              />
              {errors?.discussion ? (
                errors.discussion.length > 1 ? (
                  errors.discussion.map((error, index) => (
                    <p
                      key={`discussionErrorKeys${index + 1}`}
                      className="m-0 text-xs text-danger"
                    >
                      {error}
                    </p>
                  ))
                ) : (
                  <p className="m-0 text-xs text-danger">{errors.discussion}</p>
                )
              ) : (
                ''
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscussionForm;
