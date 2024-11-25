import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  MenuItem,
  Popover,
  Tab,
  Tabs,
  TextField,
} from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import Autocomplete from '@mui/material/Autocomplete';
import Rating from '@mui/material/Rating';
import { Badge, CardBody, Col, Progress, Row } from 'reactstrap';
import axios from 'axios';
import ReactBSAlert from 'react-bootstrap-sweetalert';
import { useTranslation } from 'react-i18next';
import Loader from '../../../../../../../components/Elevatus/Loader';
import { showError } from '../../../../../../../helpers';
import { AssessmentsVideoCarousel } from '../../../../../../../components/Elevatus/AssessmentsVideoCarousel';
import ChatSender from '../../../../../../../components/Elevatus/ChatSender';
import { CommentsList } from '../../../../../../../components/Elevatus/CommentsList';
import {
  addRating,
  getRecruiterRating,
} from '../../../../../../../shared/APIs/VideoAssessment/VideosTab';
import { evarecAPI } from '../../../../../../../api/evarec';
import { generateHeaders } from '../../../../../../../api/headers';
import urls from '../../../../../../../api/urls';
import { GetSemantica } from '../../../../../../../services';

export const VideoAssessmentTab = ({
  type,
  candidate,
  job_candidate_uuid,
  candidate_uuid,
  job_uuid,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [videos] = useState([]);
  const [selectedVideo] = useState(null);
  // const [reportUrl, setReportUrl] = useState(null);

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
    loading: !job_candidate_uuid,
    listOfVideoAssessments: [],
    comments_loading: false,
    discussion_loading: false,
    add_comment_loader: false,
    add_reply_loader: false,
    user: JSON.parse(localStorage.getItem('user'))?.results,
    candidates: candidate || [],
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
    assessments: [],
    assessmentType: '',
    assessmentIndex: 0,
    newDeadline: '',
    anchorEl: null,
    selectedVideo: [],
    isLoadingVideo: false,
    tabValue: 0,
    videoAssessmentLoadings: false,
    selectedQuestion: 0,
    selectedQuestionIndex: 0,
    answerRating: 0,
    isExpanded: false,
  });

  /**
   * Get invited video assessments list
   */
  const getInvitedVideoAsessmentsList = async () => {
    const response = await GetSemantica({
      assessment_candidate_uuid: job_candidate_uuid,
    });
    console.log({ response });
    evarecAPI
      .getInvitedVideoAsessments(job_uuid, candidate_uuid)
      .then((res) => {
        setState((items) => ({
          ...items,
          assessments: res.data.results,
        }));

        // handleSelect(res?.data?.results[0]?.assessment?.identifier?.uuid, state.id);
        // Get Personality Report URL From Video Assessments Data
        // for (let i = 0; i < res.data.results.length; i += 1)
        //   if (res.data.results[i].assessment.length !== 0) {
        //     setReportUrl(res.data.results[i].assessment?.more?.personality_report);
        //     break;
        //   }
      })
      .catch(() => {});
  };

  /**
   * Show relative keywords (Semantica connector)
   */
  const ShowRelativeKeywords = (e, index) => {
    e.preventDefault();
    setState((items) => ({
      ...items,
      show_relative_keywords: index,
    }));
  };

  /**
   * Handler to add a comment
   */
  const handleAddComment = (answer_uuid) => async (comment) => {
    setState((items) => ({
      ...items,
      add_comment_loader: true,
      comments_loading: true,
    }));
    await axios
      .post(
        urls.evassess.getComments_WRITE,
        {
          prep_assessment_answer_uuid: answer_uuid,
          comment: comment.comment,
          media_uuid: comment.attachment?.uuid,
        },
        {
          headers: generateHeaders(),
        },
      )
      .then((res) => {
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
      answerRating: rating,
    }));
    const _video
      = state.assessments?.[state.assessmentIndex]?.assessment?.videos?.[state.id];
    addRating(rating, _video?.uuid)
      // addRating(rating, state.candidates?.videos?.[state.id]?.uuid)
      .then((res) => {
        if (_video) _video.avg_rating = res.data.results?.rate;

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

  const confirmAlert = (uuid, index) => {
    setState((items) => ({
      ...items,
      alert: (
        <ReactBSAlert
          warning
          style={{ display: 'block' }}
          title="Are you sure?"
          onConfirm={() => confirmedAlert(uuid, index, type)}
          onCancel={() => hideAlert()}
          showCancel
          confirmBtnBsStyle="danger"
          cancelBtnText="Cancel"
          cancelBtnBsStyle="success"
          confirmBtnText="Yes, delete it!"
          btnSize=""
        >
          You won&apos;t be able to revert this!
        </ReactBSAlert>
      ),
    }));
  };

  const confirmedAlert = (uuid, index) => {
    setState((items) => ({
      ...items,
      alert: (
        <ReactBSAlert
          warning
          style={{ display: 'block' }}
          title="Deleting ..."
          showConfirm={false}
          onConfirm={() => {}}
          showCancel={false}
        />
      ),
    }));
    DeleteComment(uuid, index);
  };

  const DeleteComment = (UUID, index) => {
    let url = urls.evassess.getComments_WRITE;
    // const { user } = state;
    setState((items) => ({
      ...items,
      comments_loading: type === 'comments',
      discussion_loading: type === 'discussion',
    }));
    if (type === 'discussion') url = urls.evassess.getDiscussion_WRITE;

    axios
      .delete(url, {
        headers: generateHeaders(),
        params: {
          uuid: UUID,
        },
      })
      .then((res) => {
        setState((items) => ({
          ...items,
          discussion: items?.discussion.splice(index, 1),
          add_comment_loader: false,
          discussion_loading: false,
          message: res.message,
          comments_loading: false,
          comment: [],
          alert: (
            <ReactBSAlert
              success
              style={{ display: 'block' }}
              title="Deleted!"
              onConfirm={() => hideAlert()}
              onCancel={() => hideAlert()}
              confirmBtnBsStyle="primary"
              confirmBtnText="Ok"
              btnSize=""
            >
              {type === 'comments' ? 'Comment ' : 'Discussion '} has been deleted.
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

  const hideAlert = () => {
    setState((items) => ({
      ...items,
      alert: null,
    }));
  };

  /**
   * Get the rating of a specific recruiter (used when filtering by recruiter)
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

  // onChange function to handle selected video assessment
  const handleChange = (name) => (value) => {
    setState(
      (items) => ({
        ...items,
        [name]: value.uuid,
      }),
      () => {
        getVideoAssessmentsQuestion();
      },
    );
  };

  // Function to get the index of selected video assessment
  const getVideoAssessmentsQuestion = () => {
    for (let i = 0; i < state.assessments?.length; i += 1)
      if (state.assessments?.[i].identifier.uuid === state.assessmentType)
        setState((items) => ({
          ...items,
          assessmentIndex: i,
        }));
  };

  /**
   * handler to set comments
   * @param uuid
   * @param index
   */
  const handleSelect = (uuid, index) => {
    if (uuid) {
      setState((items) => ({
        ...items,
        comments: [],
        comments_loading: true,
      }));

      axios
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
            // comments: commentsMockData,
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
      loading: false,
    }));
  };

  /**
   * Set the selected video
   * @param _selectedVideo
   */
  const selectedVideoHandler = (_selectedVideo) => {
    setState((items) => ({
      ...items,
      id: _selectedVideo,
      loading: true,
    }));
    const videos
      = state.assessments?.[state.assessmentIndex]?.assessment?.videos || null;

    const selectedVideo
      = (videos
        && videos.length
        && state.assessments?.[state.assessmentIndex]?.assessment?.videos[state.id])
      || null;
    handleSelect(selectedVideo?.uuid, _selectedVideo);
  };

  const handleClick = (event) => {
    setState((items) => ({
      ...items,
      anchorEl: event.currentTarget,
    }));
  };

  const handleClose = () => {
    setState((items) => ({
      ...items,
      anchorEl: null,
    }));
  };

  // Function to send selected video assessment
  const sendVideoAssessment = async () => {
    setState((items) => ({
      ...items,
      videoAssessmentLoadings: true,
    }));
    const selectedVideos
      = state.selectedVideo
      && state.selectedVideo.map((item) => ({
        value: item.uuid,
        title: item.title,
      }));
    evarecAPI
      .SendVideoAssessment(
        job_uuid,
        selectedVideos,
        [job_candidate_uuid],
        state.newDeadline,
        type,
      )
      .then(() => {
        setState((items) => ({
          ...items,
          videoAssessmentLoadings: false,
        }));
        getInvitedVideoAsessmentsList(job_uuid, job_candidate_uuid);
      })
      .catch(() => {
        setState((items) => ({
          ...items,
          videoAssessmentLoadings: false,
        }));
      });
  };

  const handleStateChange = (newValue, value) => {
    setState((items) => ({
      ...items,
      state: value,
    }));
  };

  const getEditInit = useCallback(() => {
    // Invoke getInvitedVideoAsessmentsList() function
    getInvitedVideoAsessmentsList(job_uuid, job_candidate_uuid);
    evarecAPI
      .getVideoAssessments()
      .then((res) => {
        setState((items) => ({
          ...items,
          listOfVideoAssessments: res.data?.results,
        }));
      })
      .catch((error) => {
        showError(t(`${translationPath}error-in-getting-video-assessments`), error);
      });
    const localVideos
      = state.assessments?.[state.tabValue]?.assessment?.videos || null;
    const selectedVideo
      = (localVideos
        && localVideos.length
        && state.assessments?.[state.tabValue]?.assessment?.videos[state.id])
      || null;
    handleSelect(selectedVideo?.uuid, state.id);
  }, []);

  useEffect(() => {
    getEditInit();
  }, [getEditInit]);

  useEffect(() => {}, []);

  return (
    <div className="questionnaires-tab-wrapper">
      <div className="">
        <Accordion expanded={state.isExpanded}>
          <AccordionSummary
            onClick={() =>
              setState((prevState) => ({
                ...prevState,
                isExpanded: !prevState.isExpanded,
              }))
            }
            expandIcon={
              <Tooltip
                title={
                  state.isExpanded
                    ? t(`${translationPath}close`)
                    : t(`${translationPath}add`)
                }
              >
                <AddIcon />
              </Tooltip>
            }
          >
            {t(`${translationPath}send-new-video-assessment`)}
          </AccordionSummary>
          <AccordionDetails>
            <div className="questionnaires-tab-add-wrapper">
              <Autocomplete
                multiple
                options={state.listOfVideoAssessments || []}
                filterSelectedOptions
                getOptionLabel={(option) => option.title}
                onChange={(e, newValue) =>
                  setState((items) => ({
                    ...items,
                    selectedVideo: newValue,
                  }))
                }
                renderInput={(params) => (
                  <TextField
                    fullWidth
                    {...params}
                    variant="outlined"
                    label={t(`${translationPath}select-video-assessment`)}
                  />
                )}
              />
              <div className="select-question-wrapper">
                <div className="date-picker-button-wrapper">
                  <Button onClick={handleClick}>
                    <div className="">
                      <i className="fa fa-calendar-alt pr-2" />
                      {state.newDeadline || t(`${translationPath}set-deadline`)}
                    </div>
                  </Button>
                </div>
                <Popover
                  open={Boolean(state.anchorEl)}
                  anchorEl={state.anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                >
                  <TextField
                    id="date"
                    type="date"
                    variant="standard"
                    value={state.newDeadline || ''}
                    defaultValue={state.newDeadline || ''}
                    onChange={(event) => {
                      const { value } = event.target;
                      setState((items) => ({
                        ...items,
                        newDeadline: value,
                      }));
                      handleClose();
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Popover>
                <div className="send-button">
                  <Button
                    onClick={() => sendVideoAssessment()}
                    disabled={
                      !state.selectedVideo.length === 0
                      || !state.newDeadline
                      || state.videoAssessmentLoadings
                    }
                  >
                    {`${
                      state.videoAssessmentLoadings
                        ? t(`${translationPath}sending`)
                        : t(`${translationPath}send`)
                    }`}
                    {state.videoAssessmentLoadings && (
                      <i className="fas fa-circle-notch fa-spin ml-2-reversed" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
        {state.assessments && state.assessments.length > 0 && (
          <div className="select-questionnaire-tab-wrapper">
            <Tabs
              scrollButtons="auto"
              variant="scrollable"
              value={state.tabValue}
              onChange={(event, newValue) => {
                handleChange('assessmentType');
                setState((items) => ({
                  ...items,
                  tabValue: newValue,
                }));
              }}
            >
              {state.assessments?.map((item, index) => (
                <Tab
                  key={index}
                  label={item.identifier.title}
                  onClick={() => {
                    if (item.assessment && item.assessment.videos)
                      setState((items) => ({
                        ...items,
                        selectedQuestion: item.assessment.videos[0].question.title,
                      }));
                    else
                      setState((items) => ({
                        ...items,
                        selectedQuestion: 0,
                      }));
                  }}
                />
              ))}
            </Tabs>
          </div>
        )}
        <div className="select-questions-wrapper">
          <div className="section-title-wrapper d-flex-v-center">
            <div className="section-title">
              {state.assessments?.[state.tabValue]?.identifier.title}
            </div>
            <div className="section-description">
              {t(`${translationPath}team-avarage-rating`)}:{' '}
              {selectedVideo?.avg_rating || 0} {t(`${translationPath}out-of`)} 5.0
              <div className="section-rating">
                <Rating
                  value={
                    selectedVideo?.avg_rating || selectedVideo?.avg_rating === 0
                      ? selectedVideo?.avg_rating
                      : 0
                  }
                  readOnly
                />
              </div>
            </div>
          </div>
          <div className="question-select-stage">
            <TextField
              select
              variant="outlined"
              value={
                videos && videos[0]
                  ? videos[state?.selectedQuestionIndex]?.question?.title
                  : 0
              }
              disabled={!videos}
            >
              {videos ? (
                videos?.map((item, index) => (
                  <MenuItem
                    value={item.question.title}
                    key={`${index + 1}-question`}
                    onClick={() => {
                      setState((items) => ({
                        ...items,
                        selectedQuestion: item.question.title,
                        selectedQuestionIndex: index,
                      }));
                    }}
                  >
                    {item.question.title}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value={0}>
                  {t(`${translationPath}no-questions-available`)}
                </MenuItem>
              )}
            </TextField>
          </div>
        </div>
      </div>
      {state.alert}
      {state.loading ? (
        <CardBody className="text-center">
          <Row>
            <Col xl="12">
              <Loader width="730px" height="49vh" speed={1} color="primary" />
            </Col>
          </Row>
        </CardBody>
      ) : (
        <div className="assessments-video-carousel-wrapper candidate-assessments-wrapper">
          {videos && videos[0] ? (
            <>
              <div className="flex-grow-1 d-flex flex-row col-12">
                {selectedVideo && (
                  <div className="d-flex flex-column col-4 modal-video-assessment-info bg-white">
                    <div>
                      <div className="video-card-question-title">
                        <div
                          className={`previous-question ${
                            state.selectedQuestionIndex === 0 ? 'is-disabled' : ''
                          }`}
                        >
                          <Button
                            disabled={state.selectedQuestionIndex === 0}
                            onClick={() => {
                              setState((prevState) => ({
                                ...prevState,
                                selectedQuestionIndex:
                                  prevState.selectedQuestionIndex - 1,
                                answerRating: null,
                              }));
                            }}
                          >
                            <i className="fa fa-chevron-left pr-2" />
                            {t(`${translationPath}previous`)}
                          </Button>
                        </div>
                        <div className="video-card-question-title-wrapper">
                          <span className="question-number">
                            {t(`${translationPath}question`)}
                            {' #'}
                            {state.id + 1}
                          </span>
                          <span className="question-name">
                            {t(`${translationPath}team-avarage-rating`)}:{' '}
                            {state.answerRating || selectedVideo?.avg_rating}{' '}
                            {t(`${translationPath}out-of`)} 5.0
                          </span>
                          <div className="question-rating">
                            <Rating
                              value={
                                selectedVideo?.avg_rating
                                || selectedVideo?.avg_rating === 0
                                  ? selectedVideo?.avg_rating
                                  : 0
                              }
                              readOnly
                            />
                          </div>
                        </div>
                        <div
                          className={`next-question ${
                            state.selectedQuestionIndex === videos.length - 1
                              ? 'is-disabled'
                              : ''
                          }`}
                        >
                          <Button
                            disabled={
                              state.selectedQuestionIndex === videos.length - 1
                            }
                            onClick={() => {
                              setState((prevState) => ({
                                ...prevState,
                                selectedQuestionIndex:
                                  prevState.selectedQuestionIndex + 1,
                                answerRating: null,
                              }));
                            }}
                          >
                            {t(`${translationPath}next`)}
                            <i className="fa fa-chevron-right pl-2-reversed" />
                          </Button>
                        </div>
                      </div>
                      <hr className="mb-2" />
                      {selectedVideo.is_completed && (
                        <>
                          {/* MODEL ANSWER CARD */}
                          {selectedVideo.question.model_answer.text && (
                            // && getIsAllowedPermissionV2({
                            //     permissions,
                            //     permissionId: CurrentFeatures.ai_model_answer.permissionsId,
                            //   })
                            <div className="card p-3 semantica-card">
                              <div className="d-flex flex-row align-items-center justify-content-between">
                                <div className="h6 font-weight-400 text-black">
                                  {t(`${translationPath}model-answer`)}:{' '}
                                </div>
                                <Tooltip
                                  title={t(`${translationPath}computed-by-EVA`)}
                                  aria-label="Semantica A.I."
                                >
                                  <i className="fas fa-atom float-right text-gray" />
                                </Tooltip>
                              </div>
                              <div className="d-flex flex-row align-items-center w-100">
                                <Progress className="flex-grow-1 p-0 mb-0" multi>
                                  <Progress
                                    bar
                                    className="bg-gradient-info"
                                    value={selectedVideo.question.model_answer.score}
                                  />
                                </Progress>
                                <span className="font-weight-bold text-primary ml-2-reversed">
                                  {Math.round(
                                    selectedVideo.question.model_answer.score,
                                    1,
                                  )}
                                  %
                                </span>
                              </div>
                              <div className="mt-2 d-flex flex-row align-items-center w-100">
                                <p className="font-14 text-left">
                                  {selectedVideo.question.model_answer.text}
                                </p>
                              </div>
                            </div>
                          )}
                          <div className="d-flex flex-column carousel-video-content-content-wrapper">
                            {state.video_loader ? (
                              <CardBody className="text-center">
                                <Row>
                                  <Col xl="12">
                                    <Loader
                                      width="730px"
                                      height="49vh"
                                      speed={1}
                                      color="primary"
                                    />
                                  </Col>
                                </Row>
                              </CardBody>
                            ) : (
                              selectedVideo && (
                                <AssessmentsVideoCarousel
                                  setSelectedVideo={selectedVideoHandler}
                                  videos={videos}
                                  getRecruiterRate={(uuid) => getRecruiterRate(uuid)}
                                  ratedUsers={selectedVideo?.rating_list}
                                  rating={selectedVideo?.avg_rating}
                                  onRating={handleRating}
                                  loading={state.rating_loader}
                                  avgRating={selectedVideo?.avg_rating}
                                  selectedQuestionIndex={state.selectedQuestionIndex}
                                  handleStateChange={handleStateChange}
                                />
                              )
                            )}
                          </div>
                          {/* KEYWORDS CARD */}
                          {selectedVideo.question.keyword.length > 0 && (
                            // && getIsAllowedPermissionV2({
                            //     permissions,
                            //     permissionId: CurrentFeatures.ai_keywords.permissionsId,
                            //   })
                            <div className="keywords-card-wrapper">
                              <div className="d-flex flex-row flex-wrap align-items-center justify-content-between mb-1">
                                <div className="h6 font-weight-600 text-brand-dark-blue">
                                  <span>
                                    {t(`${translationPath}keywords-matched`)}:
                                  </span>
                                </div>
                                <div className="d-flex flex-row align-items-center">
                                  <div className="keyword-symbol keyword-mentioned mx-1" />
                                  <div className="font-12 text-gray mr-3-reversed">
                                    {t(`${translationPath}mentioned`)}
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
                                {selectedVideo.question.keyword.map(
                                  (item, index) => (
                                    <div
                                      key={`questionsKeywordKeys${index + 1}`}
                                      className={`mr-2-reversed mb-1 keyword-item-color ${
                                        item.is_found
                                          ? 'keyword-mentioned-color'
                                          : 'keyword-missing-color'
                                      }`}
                                    >
                                      <Badge
                                        pill
                                        style={
                                          !state.show_relative_keywords
                                          && state.show_relative_keywords !== 0
                                            ? { cursor: 'hand' }
                                            : {
                                              cursor: 'pointer',
                                            }
                                        }
                                        onMouseOver={(e) => {
                                          if (!item.is_found)
                                            ShowRelativeKeywords(e, index);
                                        }}
                                        onMouseOut={(e) => {
                                          if (!item.is_found)
                                            ShowRelativeKeywords(e, index);
                                        }}
                                      >
                                        {item.title}
                                      </Badge>
                                    </div>
                                  ),
                                )}
                                {selectedVideo.question.keyword.map((item, index) =>
                                  item.related.length > 0
                                  && state.show_relative_keywords === index
                                    ? item.related.map((el, itemIndex) => (
                                      <div
                                        key={`questionKeywordRelatedKey${
                                          index + 1
                                        }-${itemIndex + 1}`}
                                        className="mr-2-reversed mb-1"
                                      >
                                        <Badge
                                          className="keyword-relevant keyword-item"
                                          pill
                                        >
                                          {el} <i className="fa fa-angle-down" />
                                        </Badge>
                                      </div>
                                    ))
                                    : null,
                                )}
                              </div>
                            </div>
                          )}
                          <hr className="mb-2" />
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="video-card-question-title rate-answer pt-3 pr-4-reversed pl-4-reversed">
                <div
                  className={`previous-question ${
                    state.selectedQuestionIndex === 0 ? 'is-disabled' : ''
                  }`}
                >
                  <Button
                    disabled={state.selectedQuestionIndex === 0}
                    onClick={() => {
                      setState((prevState) => ({
                        ...prevState,
                        selectedQuestionIndex: prevState.selectedQuestionIndex - 1,
                        answerRating: null,
                      }));
                    }}
                  >
                    <i className="fa fa-chevron-left pr-2" />
                    {t(`${translationPath}previous`)}
                  </Button>
                </div>
                <div className="video-card-question-title-wrapper">
                  <span className="question-number">
                    {t(`${translationPath}question`)}
                    {' #'}
                    {state.id + 1}
                  </span>
                  <span className="question-name">
                    {t(`${translationPath}rate-answer`)}:{' '}
                    {selectedVideo?.avg_rating || 0}
                  </span>
                  <div className="question-rating">
                    <Rating
                      value={
                        state.answerRating || state.answerRating === 0
                          ? state.answerRating
                          : selectedVideo?.avg_rating
                      }
                      onChange={(event, newValue) => handleRating(newValue)}
                    />
                  </div>
                </div>
                <div
                  className={`next-question ${
                    state.selectedQuestionIndex === videos.length - 1
                      ? 'is-disabled'
                      : ''
                  }`}
                >
                  <Button
                    disabled={state.selectedQuestionIndex === videos.length - 1}
                    onClick={() => {
                      setState((prevState) => ({
                        ...prevState,
                        selectedQuestionIndex: prevState.selectedQuestionIndex + 1,
                        answerRating: null,
                      }));
                    }}
                  >
                    {t(`${translationPath}next`)}
                    <i className="fa fa-chevron-right pl-2-reversed" />
                  </Button>
                </div>
              </div>
              <hr className="chat-sender-hr" />
              {selectedVideo && (
                <div className="video-assessment-chat-sender-wrapper">
                  <div className="chat-sender-over-wrapper">
                    <ChatSender
                      uuid={selectedVideo?.uuid}
                      assessment_uuid={selectedVideo?.uuid}
                      onSubmit={handleAddComment(selectedVideo?.uuid)}
                      isSending={state.add_comment_loader}
                      hasReply={false}
                      placeholder={t(`${translationPath}comment-on-this-video`)}
                    />
                  </div>
                  {state.errors && state.errors.comment ? (
                    state.errors.comment.length > 1 ? (
                      state.errors.comment.map((error, key) => (
                        <p className="m-0 text-xs text-danger" key={key}>
                          {error}
                        </p>
                      ))
                    ) : (
                      <p className="m-0 text-xs text-danger">
                        {state.errors.comment}
                      </p>
                    )
                  ) : null}
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
                            key={`commentsListKey${index + 1}`}
                            add_comment_loader={state.add_comment_loader}
                          />
                        )))
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="no-questions-title">
              {t(`${translationPath}no-questions-available`)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

VideoAssessmentTab.propTypes = {
  candidate: PropTypes.instanceOf(Object),
  response: PropTypes.instanceOf(Object),
  type: PropTypes.string.isRequired,
  job_candidate_uuid: PropTypes.string.isRequired,
  candidate_uuid: PropTypes.string.isRequired,
  job_uuid: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
};

VideoAssessmentTab.defaultProps = {
  candidate: undefined,
  response: undefined,
  parentTranslationPath: 'EvarecCandidateModel',
  translationPath: '',
};
