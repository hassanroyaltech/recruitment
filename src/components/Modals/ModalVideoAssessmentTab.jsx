/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/**
 * ----------------------------------------------------------------------------------
 * @title ModalVideoAssessmentTab.jsx
 * ----------------------------------------------------------------------------------
 * This module contains the EvassessCandidateModal component.
 *
 * This modal has three tabs:
 * - Video Assessment
 * - Evaluation
 * - Questionnaire
 *
 *
 * *** This is the video tab
 * ----------------------------------------------------------------------------------
 */

// React
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import classnames from 'classnames';
import { evassessAPI } from '../../api/evassess';
import { Badge, Progress } from 'reactstrap';
import axios from 'axios';
import ReactBSAlert from 'react-bootstrap-sweetalert';
import urls from 'api/urls';
import { generateHeaders } from 'api/headers';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Container,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import Rating from '@mui/material/Rating';
import { CommentsList } from '../Elevatus/CommentsList';
import Loader from '../Elevatus/Loader';
import ChatSender from '../Elevatus/ChatSender';
import {
  addRating,
  getRecruiterRating,
} from '../../shared/APIs/VideoAssessment/VideosTab';
import { VideoCarousel } from '../Elevatus/VideoCarousel';
import { showError } from '../../helpers';
import {
  GetSemantica,
  SemanticaAnswerSummarization,
  SemanticaCandidateResponseRate,
  SemanticaInterestGauge,
  SemanticaLanguageProficiency,
  SemanticaMentionedKeywords,
  SemanticaModelAnswer,
  SemanticaProfanity,
} from '../../services';
import { TooltipsComponent } from '../Tooltips/Tooltips.Component';
import ButtonBase from '@mui/material/ButtonBase';
import { ChatGPTIcon } from '../../assets/icons';

/**
 * Class component for the candidate modal
 */
const translationPath = 'ModalVideoAssessmentTab.';
const generateFunctions = {
  mentioned_keywords: SemanticaMentionedKeywords,
  candidate_response_rate: SemanticaCandidateResponseRate,
  language_proficiency: SemanticaLanguageProficiency,
  interest_gauge: SemanticaInterestGauge,
  profanity: SemanticaProfanity,
  model_answer: SemanticaModelAnswer,
  answer_summarization: SemanticaAnswerSummarization,
};
export const ModalVideoAssessmentTab = (props) => {
  const { t } = useTranslation(props.parentTranslationPath || 'EvaSSESSPipeline');
  const [state, setState] = useState({
    options: [],
    no_options: false,
    inputs: [],
    class: '',
    id: 0,
    content_id: '',
    tabs: 0,
    content: 0,
    hidden: true,
    display_stage: false,
    rating: 0,
    rating_loader: false,
    rating_msg: '',
    show_relative_keywords: false,
    video_loader: false,
    type: 'details',
    loading: props.candidate_uuid,
    comments_loading: false,
    discussion_loading: false,
    add_comment_loader: false,
    add_reply_loader: false,
    user: JSON.parse(localStorage.getItem('user'))?.results,
    candidates: props.candidate || [],
    replies: [],
    comments_page: 0,
    discussion_page: 0,
    comments_limit: 40,
    discussion_limit: 40,
    comment: [],
    number_of_keyword: 0,
    discussion: [],
    add_discussion_loader: false,
    isDiscussion: false,
    video_avg_rating: 0,
  });
  const [semanticaResponse, setSemanticaResponse] = useState([]);
  const selectedVideo = state.candidates?.videos?.[state.id] || null;
  const [isGenerating, setIsGenerating] = useState(false);
  /**
   * handler to set comments
   * @param uuid
   * @param index
   */
  const handleSelect = useCallback(
    async (uuid, index) => {
      if (uuid) {
        setState((items) => ({
          ...items,
          comments: [],
          comments_loading: true,
        }));

        await axios
          .get(urls.evassess.getComments_GET, {
            headers: generateHeaders(),
            params: {
              prep_assessment_answer_uuid: uuid,
              page: state.comments_page,
              limit: state.comments_limit,
            },
          })
          .then((res) => {
            setState((items) => ({
              ...items,
              comments_page: res.data.results.page,
              comments_per_page: res.data.results.per_page,
              total_comments: res.data.results.total,
              comments: res.data.results.data,
              comments_loading: false,
            }));
          })
          .catch(() => {
            setState((items) => ({
              ...items,
              comments_loading: false,
            }));
          });
      }

      setState((items) => ({
        ...items,
        content_id: index,
        content: index,
        class: 'active',
      }));
    },
    [state.comments_limit, state.comments_page],
  );

  /**
   * Show the relative keywords
   * @param e
   * @param index
   */
  const ShowRelativeKeywords = (e, index) => {
    e.preventDefault();
    setState((items) => ({
      ...items,
      show_relative_keywords: index,
    }));
  };

  /**
   * handler to add a comment
   * @param answer_uuid
   */
  const handleAddComment = (answer_uuid) => async (comment) => {
    setState((items) => ({
      ...items,
      add_comment_loader: true,
      comments_loading: true,
    }));

    evassessAPI
      .addComment(answer_uuid, comment.comment, comment.attachment?.uuid)
      .then((res) => {
        window?.ChurnZero?.push([
          'trackEvent',
          'EVA-SSESS - Write comment',
          'Write comment from EVA-SSESS',
          1,
          {},
        ]);
        state.comments.push(res.data.results);
        setState((items) => ({
          ...items,
          add_comment_loader: false,
          message: res.message,
          comments_loading: false,
          comment: [],
        }));
      })
      .catch((error) => {
        showError('', error);
        setState((items) => ({
          ...items,
          add_comment_loader: false,
          comments_loading: false,
          message: error?.response?.data?.message,
          errors: error?.response?.data?.errors,
        }));
        setTimeout(() => {
          setState((items) => ({
            ...items,
            message: '',
            errors: [],
          }));
        }, 5000);
      });
  };

  /**
   * handler to add/edit the rating
   * @param rating
   */
  const handleRating = (rating) => {
    setState((items) => ({
      ...items,
      rating_loader: true,
    }));
    addRating(rating, state.candidates?.videos?.[state.id]?.uuid)
      .then((res) => {
        setState((items) => {
          let localItems = { ...items };
          if (localItems.candidates?.videos?.[localItems.id])
            localItems.candidates.videos[localItems.id].recruiter.rate
              = res.data.results?.rate;
          localItems = {
            ...localItems,
            rating_loader: false,
            video_avg_rating: res.data.results?.avg_rating,
          };
          return localItems;
        });
      })
      .catch(() => {
        setState((items) => ({
          ...items,
          rating_loader: false,
        }));
      });
  };

  const confirmAlert = (uuid, index, type) => {
    setState((items) => ({
      ...items,
      alert: (
        <ReactBSAlert
          warning
          style={{ display: 'block' }}
          title={t(`${translationPath}are-you-sure`)}
          onConfirm={() => confirmedAlert(uuid, index, type)}
          onCancel={() => hideAlert()}
          showCancel
          confirmBtnBsStyle="danger"
          cancelBtnText={t(`${translationPath}cancel`)}
          cancelBtnBsStyle="success"
          confirmBtnText={t(`${translationPath}yes-delete-it`)}
          btnSize=""
        >
          {t(`${translationPath}revert-description`)}
        </ReactBSAlert>
      ),
    }));
  };

  const DeleteComment = (UUID, index, type) => {
    // const url = urls.evassess.getComments;
    setState((items) => ({
      ...items,
      comments_loading: type === 'comments',
      discussion_loading: type === 'discussion',
    }));
    if (type === 'discussion') evassessAPI.deleteDiscussion(UUID);
    // url = urls.evassess.getDiscussion;

    const func = evassessAPI.deleteComment(UUID);
    func
      .then((res) => {
        if (type === 'comments') state.comments.splice(index, 1);
        else state.discussion.splice(index, 1);
        setState((items) => ({
          ...items,
          add_comment_loader: false,
          discussion_loading: false,
          message: res.message,
          comments_loading: false,
          comment: [],
          alert: (
            <ReactBSAlert
              success
              style={{ display: 'block' }}
              title={t(`${translationPath}deleted`)}
              onConfirm={() => hideAlert()}
              onCancel={() => hideAlert()}
              confirmBtnBsStyle="primary"
              confirmBtnText={t(`${translationPath}ok`)}
              btnSize=""
            >
              {type === 'comments'
                ? t(`${translationPath}comment`)
                : t(`${translationPath}discussion`)}
              <span className="px-1">{t(`${translationPath}has-been-deleted`)}</span>
            </ReactBSAlert>
          ),
        }));
      })
      .catch((error) => {
        setState((items) => ({
          ...items,
          add_comment_loader: false,
          discussion_loading: false,
          comments_loading: false,
          message: error?.response?.data?.message,
          errors: error?.response?.data?.errors,
        }));
        setTimeout(() => {
          setState((items) => ({
            ...items,
            message: '',
            errors: [],
          }));
        }, 5000);
      });
  };

  const confirmedAlert = (uuid, index, type) => {
    setState((items) => ({
      ...items,
      alert: (
        <ReactBSAlert
          warning
          style={{ display: 'block' }}
          title={t(`${translationPath}deleting`)}
          showConfirm={false}
          onConfirm={() => {}}
          showCancel={false}
        />
      ),
    }));
    DeleteComment(uuid, index, type);
  };

  /**
   * Delete a comment
   * @param UUID
   * @param index
   * @param type
   */

  /**
   * Hides the alert
   */
  const hideAlert = () => {
    setState((items) => ({
      ...items,
      alert: null,
    }));
  };

  /**
   * Get the rating of a recruiter
   * @param recruiter_uuid
   */
  const getRecruiterRate = (recruiter_uuid) => {
    setState((items) => ({
      ...items,
      rating_loader: true,
    }));
    getRecruiterRating(recruiter_uuid, state.candidates?.videos?.[state.id]?.uuid)
      .then((res) => {
        state.candidates.videos[state.id].avg_rating
          = res.data.results?.rating?.rate;
        setState((items) => ({
          ...items,
          rating_loader: false,
        }));
      })
      .catch(() => {
        setState((items) => ({
          ...items,
          rating_loader: false,
        }));
      });
  };

  /**
   * Set the selected video
   * @param localSelectedVideo
   */
  const setSelectedVideo = (localSelectedVideo) => {
    const selectedVideo = state.candidates?.videos?.[localSelectedVideo] || null;
    setState((items) => ({
      ...items,
      id: localSelectedVideo,
      video_avg_rating: selectedVideo?.avg_rating,
      show_relative_keywords: false,
    }));
    handleSelect(selectedVideo?.uuid, localSelectedVideo);
  };

  /**
   * This is a setter for the rating loader state.
   * @param _bool
   */
  const setRatingLoader = (_bool) => {
    setState((items) => ({
      ...items,
      rating_loader: _bool,
    }));
  };

  /**
   * A memoized value for the semantica response for the selected video.
   */
  const SemanticaResponseMatched = useMemo(
    () =>
      semanticaResponse.map((item) => ({
        video: state.candidates?.videos?.find(
          (video) => video.uuid === item.answer_uuid,
        ),
        semantica: item,
      })),
    [semanticaResponse, state.candidates?.videos],
  );

  const SemanticaValue = useMemo(
    () =>
      SemanticaResponseMatched.find(
        (item) => item.video?.uuid === selectedVideo?.uuid,
      )?.semantica?.semantica,
    [SemanticaResponseMatched, selectedVideo],
  );
  const answerTranscription = useMemo(
    () =>
      SemanticaResponseMatched.find(
        (item) => item.video?.uuid === selectedVideo?.uuid,
      )?.semantica?.answer_text,
    [SemanticaResponseMatched, selectedVideo],
  );

  /**
   * A handler to get the semantica details of the current video.
   * @param uuid The uuid of the candidate.
   */
  const GetSemanticaHandler = useCallback(
    async (uuid) => {
      if (!state.candidates?.videos?.length) return;
      setState((items) => ({
        ...items,
        loading: true,
      }));

      const response = await GetSemantica({ assessment_candidate_uuid: uuid });
      setState((items) => ({
        ...items,
        loading: false,
      }));

      if (response.status === 200) setSemanticaResponse(response.data.result);
      else showError(t('Shared:failed-to-get-saved-data'), response);
    },
    [state.candidates?.videos?.length, t],
  );

  useEffect(() => {
    const selectedVideo = state.candidates?.videos?.[state.id] || null;
    handleSelect(selectedVideo?.uuid, state.id);
  }, [handleSelect, state.candidates?.videos, state.id]);

  useEffect(() => {
    if (props.candidate?.candidate?.information?.uuid)
      GetSemanticaHandler(props.candidate.candidate.information.uuid);
  }, [GetSemanticaHandler, props.candidate]);

  const GetDynamicSemanticaHandler = useCallback(
    async ({ slug }) => {
      if (
        !state.candidates?.videos?.length
        || !selectedVideo?.uuid
        || !props.candidate?.candidate?.information?.uuid
      )
        return;
      setIsGenerating(slug);
      const response = await generateFunctions[slug]({
        answer_uuid: selectedVideo?.uuid,
      });
      setIsGenerating('');

      if (response.status === 200)
        GetSemanticaHandler(props.candidate?.candidate?.information?.uuid);
      else showError(t('Shared:failed-to-get-saved-data'), response);
    },
    [
      GetSemanticaHandler,
      props.candidate?.candidate?.information?.uuid,
      selectedVideo?.uuid,
      state.candidates?.videos?.length,
      t,
    ],
  );
  /**
   * Render the component
   * @return {JSX.Element}
   */
  return (
    <>
      {state.alert}
      {state.loading && (!semanticaResponse || semanticaResponse?.length === 0) ? (
        <Loader speed={1} color="primary" />
      ) : (
        <>
          <div
            className="d-flex flex-row align-items-start modal-video-assessment flex-wrap"
            style={{ position: 'relative' }}
          >
            <div className="flex-grow-1 d-flex flex-row flex-wrap col-12">
              <div className="d-inline-flex flex-column col-xl-8 col-12">
                {state.video_loader ? (
                  <Loader speed={1} color="primary" />
                ) : (
                  <VideoCarousel
                    setSelectedVideo={setSelectedVideo}
                    videos={state.candidates?.videos}
                    getRecruiterRate={(uuid) => getRecruiterRate(uuid)}
                    videoUuid={selectedVideo?.uuid}
                    ratedUsers={selectedVideo?.rating_list}
                    parentTranslationPath={props.parentTranslationPath}
                    rating={selectedVideo?.recruiter?.rate}
                    onRating={handleRating}
                    loading={state.rating_loader}
                    setLoading={setRatingLoader}
                    avgRating={selectedVideo?.avg_rating}
                  />
                )}
              </div>
              <div className="d-inline-flex flex-column col-xl-4 col-12 px-3 modal-video-assessment-info bg-white">
                <h5 className="h5 text-brand-dark-blue">
                  {t(`${translationPath}video-details`)}
                </h5>
                <div className="h6 font-14 text-gray d-flex-v-center flex-row mb-0">
                  <span className="mb-1">
                    {t(`${translationPath}average-video-rating`)}
                  </span>
                  <div id="rating-stars-auto" className="ml-2-reversed">
                    <Rating value={state.video_avg_rating} readOnly />
                  </div>
                </div>
                {selectedVideo && (
                  <div>
                    <h6 data-id={selectedVideo.answer_text} className="my-4 h6">
                      <span className="text-black">
                        {t(`${translationPath}question`)}
                        <span className="px-1">{state.id + 1}</span>
                      </span>
                      <span className="ml-3-reversed text-gray">
                        {selectedVideo.question.title}
                      </span>
                    </h6>
                    {selectedVideo.is_completed && SemanticaValue && (
                      <>
                        {/* Answer Summary CARD */}
                        <hr className="my-3 mx-2" />
                        <div className="card p-3 semantica-card">
                          <div className="d-flex-v-center-h-between flex-wrap">
                            <div className="h6 font-weight-400 text-brand-dark-blue">
                              {t(`${translationPath}answer-summary`)}
                            </div>
                            {!SemanticaValue?.answer_summarization && (
                              <ButtonBase
                                className="btns theme-outline mb-2"
                                disabled={!!isGenerating}
                                onClick={() =>
                                  GetDynamicSemanticaHandler({
                                    slug: 'answer_summarization',
                                  })
                                }
                              >
                                {`${isGenerating}` === 'answer_summarization' ? (
                                  <span className="fas fa-circle-notch fa-spin m-1" />
                                ) : (
                                  <ChatGPTIcon color="var(--bc-primary)" />
                                )}
                                <span className="mx-1">
                                  {t(`${translationPath}generate-response`)}
                                </span>
                              </ButtonBase>
                            )}
                          </div>
                          {SemanticaValue.answer_summarization && (
                            <div className="mt-2 w-100">
                              <p className="font-14 text-left mb-2">
                                {SemanticaValue.answer_summarization}
                              </p>
                            </div>
                          )}
                          {answerTranscription && (
                            <Accordion>
                              <AccordionSummary
                                expandIcon={<span className="fas fa-chevron-down" />}
                              >
                                <div className="fw-bold">
                                  {t(`${translationPath}transcription`)}
                                </div>
                              </AccordionSummary>
                              <AccordionDetails>
                                <div className="w-100">
                                  <p className="font-14 text-left scrollable-paragraph">
                                    {answerTranscription}
                                  </p>
                                </div>
                              </AccordionDetails>
                            </Accordion>
                          )}
                        </div>
                        <hr className="my-3 mx-2" />
                        {/* KEYWORDS CARD */}
                        <div className="card p-3 semantica-card">
                          <div className="d-flex flex-row flex-wrap align-items-center justify-content-between mb-3">
                            <div className="h6 font-weight-400 text-brand-dark-blue mb-2">
                              <span>
                                {t(`${translationPath}keywords-matched`)}
                                <span>:</span>
                              </span>
                              (
                              {SemanticaValue.matched_keywords?.matched?.length
                                + SemanticaValue.matched_keywords?.relevant
                                  ?.length}{' '}
                              /{' '}
                              {SemanticaValue.matched_keywords?.matched?.length
                                + SemanticaValue.matched_keywords?.relevant?.length
                                + SemanticaValue.matched_keywords?.missing?.length}
                              )
                            </div>
                            <div className="d-flex flex-row align-items-center">
                              <div className="keyword-symbol keyword-matched mx-1" />
                              <div className="font-12 text-gray mr-2-reversed">
                                {t(`${translationPath}matched`)}
                              </div>
                              <div className="keyword-symbol keyword-relevant mx-1" />
                              <div className="font-12 text-gray mr-2-reversed">
                                {t(`${translationPath}relevant`)}
                              </div>
                              <div className="keyword-symbol keyword-missing mx-1" />
                              <div className="font-12 text-gray">
                                {t(`${translationPath}missing`)}
                              </div>
                            </div>
                          </div>
                          <div className="d-flex flex-row align-items-center flex-wrap">
                            {SemanticaValue.matched_keywords?.matched?.map(
                              (matchedKeyword, index) => (
                                <div
                                  key={`selectedVideoQuestionsKey${index + 1}`}
                                  className="mr-2-reversed mb-2"
                                >
                                  <Badge
                                    style={
                                      !state.show_relative_keywords
                                        ? { cursor: 'hand' }
                                        : {
                                          cursor: 'pointer',
                                        }
                                    }
                                    onMouseOver={(e) => {
                                      ShowRelativeKeywords(e, index); // check
                                    }}
                                    onMouseOut={(e) => {
                                      ShowRelativeKeywords(e, index); // check
                                    }}
                                    className={classnames(
                                      'keyword-item header-text c-white',
                                      'keyword-matched',
                                    )}
                                    pill
                                  >
                                    {matchedKeyword}
                                  </Badge>
                                </div>
                              ),
                            )}
                            {SemanticaValue.matched_keywords?.relevant?.map(
                              (relevantKeyword, index) => (
                                <div
                                  key={`selectedVideoQuestionsKey${index + 1}`}
                                  className="mr-2-reversed mb-2"
                                >
                                  <Badge
                                    style={
                                      !state.show_relative_keywords
                                        ? { cursor: 'hand' }
                                        : {
                                          cursor: 'pointer',
                                        }
                                    }
                                    className={classnames(
                                      'keyword-item header-text c-white',
                                      'keyword-relevant',
                                    )}
                                    pill
                                  >
                                    {relevantKeyword}
                                  </Badge>
                                </div>
                              ),
                            )}

                            {SemanticaValue.matched_keywords?.missing?.map(
                              (missingKeyword, index) => (
                                <div
                                  key={`selectedVideoQuestionsKey${index + 1}`}
                                  className="mr-2-reversed mb-2"
                                >
                                  <Badge
                                    style={
                                      !state.show_relative_keywords
                                        ? { cursor: 'hand' }
                                        : {
                                          cursor: 'pointer',
                                        }
                                    }
                                    className={classnames(
                                      'keyword-item header-text c-white',
                                      'keyword-missing',
                                    )}
                                    pill
                                  >
                                    {missingKeyword}
                                  </Badge>
                                </div>
                              ),
                            )}
                          </div>
                        </div>

                        {/* MENTIONED KEYWORDS CARD */}
                        <div className="card my-3 p-3 semantica-card">
                          <div className="d-flex-v-center-h-between flex-wrap mb-3">
                            <div className="h6 font-weight-400 text-brand-dark-blue mb-2">
                              {t(`${translationPath}mentioned-keywords`)}
                            </div>
                            {!SemanticaValue?.mentioned_keywords?.length && (
                              <ButtonBase
                                className="btns theme-outline mb-2"
                                disabled={!!isGenerating}
                                onClick={() =>
                                  GetDynamicSemanticaHandler({
                                    slug: 'mentioned_keywords',
                                  })
                                }
                              >
                                {`${isGenerating}` === 'mentioned_keywords' ? (
                                  <span className="fas fa-circle-notch fa-spin m-1" />
                                ) : (
                                  <ChatGPTIcon color="var(--bc-primary)" />
                                )}
                                <span className="mx-1">
                                  {t(`${translationPath}generate-response`)}
                                </span>
                              </ButtonBase>
                            )}
                          </div>
                          <div className="d-flex flex-row align-items-center flex-wrap">
                            {SemanticaValue.mentioned_keywords?.map(
                              (mentionedKeyword, index) => (
                                <div
                                  key={`selectedVideoQuestionsKey${index + 1}`}
                                  className="mr-2-reversed mb-2"
                                >
                                  <Badge
                                    style={
                                      !state.show_relative_keywords
                                        ? { cursor: 'hand' }
                                        : {
                                          cursor: 'pointer',
                                        }
                                    }
                                    onMouseOver={(e) => {
                                      ShowRelativeKeywords(e, index); // check
                                    }}
                                    onMouseOut={(e) => {
                                      ShowRelativeKeywords(e, index); // check
                                    }}
                                    className={classnames(
                                      'keyword-item header-text c-white',
                                      'keyword-mentioned',
                                    )}
                                    pill
                                  >
                                    {mentionedKeyword}
                                  </Badge>
                                </div>
                              ),
                            )}
                          </div>
                        </div>

                        {/* CANDIDATE RESPONSE RATE CARD */}
                        <hr className="my-3 mx-2" />
                        <div className="card p-3 semantica-card">
                          <>
                            <div className="d-flex-v-center-h-between flex-wrap">
                              <TooltipsComponent
                                title="candidate-response-rate-description"
                                parentTranslationPath={props.parentTranslationPath}
                                translationPath={translationPath}
                                contentComponent={
                                  <div className="h6 font-weight-400 text-black">
                                    {t(`${translationPath}candidate-response-rate`)}
                                  </div>
                                }
                                placement="bottom-start"
                              />
                              {!SemanticaValue.candidate_response_rate?.rating && (
                                <ButtonBase
                                  className="btns theme-outline mb-2"
                                  disabled={!!isGenerating}
                                  onClick={() =>
                                    GetDynamicSemanticaHandler({
                                      slug: 'candidate_response_rate',
                                    })
                                  }
                                >
                                  {`${isGenerating}`
                                  === 'candidate_response_rate' ? (
                                      <span className="fas fa-circle-notch fa-spin m-1" />
                                    ) : (
                                      <ChatGPTIcon color="var(--bc-primary)" />
                                    )}
                                  <span className="mx-1">
                                    {t(`${translationPath}generate-response`)}
                                  </span>
                                </ButtonBase>
                              )}
                            </div>
                            <div className="d-flex flex-row align-items-center w-100">
                              <Progress className="flex-grow-1 p-0 mb-0" multi>
                                <Progress
                                  bar
                                  className="bg-gradient-info"
                                  value={
                                    SemanticaValue.candidate_response_rate?.rating
                                    || 0
                                  }
                                />
                              </Progress>
                              <span className="font-weight-bold text-primary ml-2-reversed">
                                {Math.round(
                                  SemanticaValue.candidate_response_rate?.rating
                                    || 0,
                                  1,
                                )}
                                %
                              </span>
                            </div>
                            {SemanticaValue.candidate_response_rate?.description && (
                              <div className="mt-2 w-100">
                                {SemanticaValue.candidate_response_rate
                                  .description && (
                                  <>
                                    <p className="font-14 text-left fw-bold">
                                      {t(`${translationPath}description`)}
                                    </p>
                                    <p className="font-14 text-left">
                                      {
                                        SemanticaValue.candidate_response_rate
                                          .description
                                      }
                                    </p>
                                  </>
                                )}
                              </div>
                            )}
                          </>
                        </div>

                        {/* MODEL ANSWER CARD */}
                        <hr className="my-3 mx-2" />
                        <div className="card p-3 semantica-card">
                          <>
                            <div className="d-flex-v-center-h-between flex-wrap">
                              <TooltipsComponent
                                title="model-answer-description"
                                parentTranslationPath={props.parentTranslationPath}
                                translationPath={translationPath}
                                contentComponent={
                                  <div className="h6 font-weight-400 text-black">
                                    {t(`${translationPath}model-answer`)}
                                  </div>
                                }
                                placement="bottom-start"
                              />
                              {/*{!SemanticaValue.model_answer?.rate && (*/}
                              {/*  <ButtonBase*/}
                              {/*    className="btns theme-outline mb-2"*/}
                              {/*    disabled={!!isGenerating}*/}
                              {/*    onClick={() =>*/}
                              {/*      GetDynamicSemanticaHandler({*/}
                              {/*        slug: 'model_answer',*/}
                              {/*      })*/}
                              {/*    }*/}
                              {/*  >*/}
                              {/*    {`${isGenerating}` === 'model_answer' ? (*/}
                              {/*      <span className="fas fa-circle-notch fa-spin m-1" />*/}
                              {/*    ) : (*/}
                              {/*      <ChatGPTIcon color="var(--bc-primary)" />*/}
                              {/*    )}*/}
                              {/*    <span className="mx-1">*/}
                              {/*      {t(`${translationPath}generate-response`)}*/}
                              {/*    </span>*/}
                              {/*  </ButtonBase>*/}
                              {/*)}*/}
                            </div>
                            <div className="d-flex flex-row align-items-center w-100">
                              <Progress className="flex-grow-1 p-0 mb-0" multi>
                                <Progress
                                  bar
                                  className="bg-gradient-info"
                                  value={SemanticaValue.model_answer?.rate || 0}
                                />
                              </Progress>
                              <span className="font-weight-bold text-primary ml-2-reversed">
                                {Math.round(
                                  SemanticaValue.model_answer?.rate || 0,
                                  1,
                                )}
                                %
                              </span>
                            </div>
                            {SemanticaValue.model_answer?.model_answer && (
                              <div className="mt-2 w-100">
                                {SemanticaValue.model_answer.model_answer && (
                                  <>
                                    <p className="font-14 text-left fw-bold">
                                      {t(`${translationPath}model-answer`)}
                                    </p>
                                    <p className="font-14 text-left mb-2">
                                      {SemanticaValue.model_answer.model_answer}
                                    </p>
                                  </>
                                )}
                              </div>
                            )}
                          </>
                        </div>

                        {/* LANGUAGE PROFICIENCY CARD */}
                        <hr className="my-3 mx-2" />
                        <div className="card p-3 semantica-card">
                          <>
                            <div className="d-flex-v-center-h-between flex-wrap">
                              <div className="h6 font-weight-400 text-black">
                                {t(`${translationPath}language-proficiency`)}
                              </div>
                              {!SemanticaValue?.language_proficiency?.rating && (
                                <ButtonBase
                                  className="btns theme-outline mb-2"
                                  disabled={!!isGenerating}
                                  onClick={() =>
                                    GetDynamicSemanticaHandler({
                                      slug: 'language_proficiency',
                                    })
                                  }
                                >
                                  {`${isGenerating}` === 'language_proficiency' ? (
                                    <span className="fas fa-circle-notch fa-spin m-1" />
                                  ) : (
                                    <ChatGPTIcon color="var(--bc-primary)" />
                                  )}
                                  <span className="mx-1">
                                    {t(`${translationPath}generate-response`)}
                                  </span>
                                </ButtonBase>
                              )}
                            </div>
                            <div className="d-flex flex-row align-items-center w-100">
                              <Progress className="flex-grow-1 p-0 mb-0" multi>
                                <Progress
                                  bar
                                  className="bg-gradient-info"
                                  value={
                                    SemanticaValue.language_proficiency?.rating || 0
                                  }
                                />
                              </Progress>
                              <span className="font-weight-bold text-primary ml-2-reversed">
                                {Math.round(
                                  SemanticaValue.language_proficiency?.rating || 0,
                                  1,
                                )}
                                %
                              </span>
                            </div>
                            {SemanticaValue.language_proficiency?.description && (
                              <div className="mt-2 w-100">
                                <p className="font-14 text-left mb-2">
                                  {SemanticaValue.language_proficiency.description}
                                </p>
                              </div>
                            )}
                          </>
                        </div>

                        {/* INTEREST GAUGE CARD */}
                        <hr className="my-3 mx-2" />
                        <div className="card p-3 semantica-card">
                          <>
                            <div className="d-flex-v-center-h-between flex-wrap">
                              <div className="h6 font-weight-400 text-black">
                                {t(`${translationPath}interest-gauge`)}
                              </div>
                              {!SemanticaValue.interest_gauge && (
                                <ButtonBase
                                  className="btns theme-outline mb-2"
                                  disabled={!!isGenerating}
                                  onClick={() =>
                                    GetDynamicSemanticaHandler({
                                      slug: 'interest_gauge',
                                    })
                                  }
                                >
                                  {`${isGenerating}` === 'interest_gauge' ? (
                                    <span className="fas fa-circle-notch fa-spin m-1" />
                                  ) : (
                                    <ChatGPTIcon color="var(--bc-primary)" />
                                  )}
                                  <span className="mx-1">
                                    {t(`${translationPath}generate-response`)}
                                  </span>
                                </ButtonBase>
                              )}
                            </div>
                            <div className="d-flex flex-row align-items-center w-100">
                              <Progress className="flex-grow-1 p-0 mb-0" multi>
                                <Progress
                                  bar
                                  className="bg-gradient-info"
                                  value={SemanticaValue.interest_gauge || 0}
                                />
                              </Progress>
                              <span className="font-weight-bold text-primary ml-2-reversed">
                                {Math.round(SemanticaValue.interest_gauge || 0, 1)}%
                              </span>
                            </div>
                          </>
                        </div>

                        {/* PROFANITY CARD */}

                        <hr className="my-3 mx-2" />
                        <div className="card p-3 semantica-card">
                          <>
                            <div className="d-flex flex-row align-items-center justify-content-between">
                              <div className="h6 font-weight-400 text-black">
                                {t(`${translationPath}profanity`)}
                              </div>
                              {!SemanticaValue.profanity?.categories?.length && (
                                <ButtonBase
                                  className="btns theme-outline mb-2"
                                  disabled={!!isGenerating}
                                  onClick={() =>
                                    GetDynamicSemanticaHandler({
                                      slug: 'profanity',
                                    })
                                  }
                                >
                                  {`${isGenerating}` === 'profanity' ? (
                                    <span className="fas fa-circle-notch fa-spin m-1" />
                                  ) : (
                                    <ChatGPTIcon color="var(--bc-primary)" />
                                  )}
                                  <span className="mx-1">
                                    {t(`${translationPath}generate-response`)}
                                  </span>
                                </ButtonBase>
                              )}
                            </div>
                            {SemanticaValue.profanity?.is_impolite
                              && SemanticaValue.profanity?.categories?.length > 0 && (
                              <div>
                                {SemanticaValue.profanity.categories.map(
                                  (profanityCategory) => (
                                    <Badge
                                      key={profanityCategory}
                                      className={classnames(
                                        'keyword-item header-text c-white',
                                        'keyword-matched',
                                      )}
                                      pill
                                    >
                                      {profanityCategory}
                                    </Badge>
                                  ),
                                )}
                              </div>
                            )}
                          </>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
            <Container
              id="evassess-comments-section"
              className="px-0 col-8 ml-0-reversed"
            >
              <hr className="mb-1 mt-3" />
              <div className="h5 m-3 text-brand-dark-blue">
                {`${
                  state?.comments && state?.comments?.length
                    ? state?.comments?.length
                    : ''
                }`}
                <span className="px-1">{t(`${translationPath}comments`)}</span>
              </div>
              <div>
                <ChatSender
                  uuid={selectedVideo?.uuid}
                  assessment_uuid={selectedVideo?.uuid}
                  onSubmit={handleAddComment(selectedVideo?.uuid)}
                  isSending={state.add_comment_loader}
                  hasReply={false}
                  parentTranslationPath={props.parentTranslationPath}
                  placeholder={t(`${translationPath}comment-on-this-video`)}
                />
                {state.errors && state.errors.comment ? (
                  state.errors.comment.length > 1 ? (
                    state.errors.comment.map((error, index) => (
                      <p
                        className="m-0 text-xs text-danger"
                        key={`stateErrorKeys${index + 1}`}
                      >
                        {error}
                      </p>
                    ))
                  ) : (
                    <p className="m-0 text-xs text-danger">{state.errors.comment}</p>
                  )
                ) : null}
              </div>
              <div className="mb-4 scroll_comments">
                {state.loading || state.comments_loading ? (
                  <div />
                ) : (
                  state.comments
                  && (state.comments.length === 0
                    ? null
                    : state.comments.map((comment, index) => (
                      <CommentsList
                        confirmAlert={(uuid) => {
                          confirmAlert(uuid, index, 'comments');
                        }}
                        parentTranslationPath={props.parentTranslationPath}
                        candidate_uuid={selectedVideo.uuid}
                        assessment_uuid={selectedVideo.uuid}
                        uuid={comment.uuid}
                        onChange={(value) => {
                          setState((items) => ({
                            ...items,
                            comment: value,
                          }));
                        }}
                        replies={state.replies}
                        comment={comment}
                        key={`commentsKeys${index + 1}`}
                        add_comment_loader={state.add_comment_loader}
                      />
                    )))
                )}
              </div>
            </Container>
          </div>
        </>
      )}
    </>
  );
};
