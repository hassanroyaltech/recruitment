// import React components
import React, { Component } from 'react';
import AddIcon from '@mui/icons-material/Add';
import moment from 'moment';
// import react strap components
import { Badge, CardBody, Col, Progress, Row } from 'reactstrap';

// import HTTP request config
import axios from 'axios';
import urls from '../../api/urls';
import { generateHeaders } from '../../api/headers';
import { evarecAPI } from '../../api/evarec';

// import bootstrap components
import ReactBSAlert from 'react-bootstrap-sweetalert';

import Tooltip from '@mui/material/Tooltip';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  MenuItem,
  Tabs,
  Tab,
  TextField,
} from '@mui/material';
import Rating from '@mui/material/Rating';
import Autocomplete from '@mui/material/Autocomplete';
import { withTranslation } from 'react-i18next';
import { CommentsList } from './CommentsList';
import Loader from './Loader';
import ChatSender from './ChatSender';
// Selector
// import shared API
// TODO :Refactoring
import {
  addRating,
  getRecruiterRating,
} from '../../shared/APIs/VideoAssessment/VideosTab';
import { AssessmentsVideoCarousel } from './AssessmentsVideoCarousel';
import DatePickerComponent from '../Datepicker/DatePicker.Component';
import { GlobalSavingDateFormat } from '../../helpers';
import { SemanticaComponent } from './Semantica.Component';
import { VitallyTrack } from '../../utils/Vitally';

const translationPath = '';
const parentTranslationPath = 'EvarecCandidateModel';

/**
 * VideoAssessmentModal class component
 * @returns  {JSX}
 */
class VideoAssessmentModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      loading: !this.props.candidate_uuid,
      comments_loading: false,
      discussion_loading: false,
      add_comment_loader: false,
      add_reply_loader: false,
      user: JSON.parse(localStorage.getItem('user'))?.results,
      candidates: this.props.candidate || [],
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
      answerRating: undefined,
      isExpanded: false,
    };
    this.handleChange.bind(this);
  }

  // Invoked once the component is render
  componentDidMount() {
    // Invoke getInvitedVideoAsessmentsList() function
    this.getInvitedVideoAsessmentsList(
      this.props.jobUuid,
      this.props.candidate_uuid,
    );
    const videos
      = this.state.assessments?.[this.state.tabValue]?.assessment?.videos || null;
    const selectedVideo
      = (videos
        && videos.length
        && this.state.assessments?.[this.state.tabValue]?.assessment?.videos[
          this.state.id
        ])
      || null;
    this.handleSelect(selectedVideo?.uuid, this.state.id);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedQuestion !== this.state.selectedQuestion) {
      const videos
        = this.state.assessments?.[this.state.tabValue]?.assessment?.videos || null;
      const selectedVideo
        = (videos
          && videos.length
          && this.state.assessments?.[this.state.tabValue]?.assessment?.videos[
            this.state.id
          ])
        || null;
      this.handleSelect(selectedVideo?.uuid, this.state.id);
    }
  }

  /**
   * Get invited video assessments list
   * @param job_uuid
   * @param candidate_uuid
   * @returns {Promise<AxiosResponse<any>>}
   */
  getInvitedVideoAsessmentsList = (job_uuid, candidate_uuid) => {
    evarecAPI.getInvitedVideoAsessments(job_uuid, candidate_uuid).then((res) => {
      this.setState({
        assessments: res.data.results,
      });

      // this.handleSelect(res?.data?.results[0]?.assessment?.identifier?.uuid, this.state.id);
      // Get Personality Report URL From Video Assessments Data
      for (let i = 0; i < res.data.results.length; i += 1)
        if (res.data.results[i].assessment.length !== 0) {
          this.props.setReportUrl(
            res.data.results[i].assessment?.more?.personality_report,
          );
          break;
        }
    });
  };

  handleSetCurrentVideo = (id) => {
    this.setState({
      id,
      tabs: id,
      content_id: id,
      content: id,
      type: 'details',
      rating: 0,
      rating_msg: '',
      video_loader: !this.state.video_loader,
    });
    setTimeout(() => {
      this.setState({
        video_loader: !this.state.video_loader,
      });
    }, 1000);
  };

  /**
   * Handler for types
   */
  handleSetType = (type, uuid, index) => (e) => {
    e.preventDefault();
    if (uuid) {
      this.setState({
        comments: [],
        comments_loading: true,
      });
      if (type === 'comments')
        axios
          .get(urls.evassess.getComments_GET, {
            headers: generateHeaders(),
            params: {
              prep_assessment_answer_uuid: uuid,
              page: this.state.comments_page,
              limit: this.state.comments_limit,
            },
          })
          .then((res) => {
            this.setState({
              comments_page: res.data.results.page,
              comments_per_page: res.data.results.per_page,
              total_comments: res.data.results.total,
              comments: res.data.results.data,
              // comments: commentsMockData,
            });
            this.setState({
              comments_loading: false,
            });
          })
          .catch(() => {
            this.setState({
              comments_loading: false,
            });
          });
    }

    this.setState({
      content_id: index,
      content: index,
      type,
      class: 'active',
    });
  };

  /**
   * Show relative keywords (Semantica connector)
   */
  ShowRelativeKeywords = (e, index) => {
    e.preventDefault();
    this.setState({
      show_relative_keywords: index,
    });
  };

  /**
   * Handler to add a comment
   */
  handleAddComment = (answer_uuid) => async (comment) => {
    this.setState({
      add_comment_loader: true,
      comments_loading: true,
    });
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
        this.state.comments.push(res.data.results);
        this.setState({
          add_comment_loader: false,
          message: res.message,
          comments_loading: false,
          comment: [],
        });
      })
      .catch((error) => {
        this.setState({
          add_comment_loader: false,
          comments_loading: false,
          message: error?.response?.data?.message,
          errors: error?.response?.data?.errors,
        });
        setTimeout(() => {
          this.setState({
            message: '',
            errors: [],
          });
        }, 5000);
      });
  };

  /**
   * Handler to add to a discussion
   */
  handleAddDiscussion = () => async (discussion) => {
    this.setState({
      add_discussion_loader: true,
      discussion_loading: true,
    });
    await axios
      .post(
        urls.evassess.getDiscussion,
        {
          candidate_uuid: this.props.candidate.candidate.information.uuid,
          comment: discussion.comment ? discussion.comment : 'Attached File',
          media_uuid: discussion.attachment && discussion.attachment.uuid,
        },
        {
          headers: generateHeaders(),
        },
      )
      .then((res) => {
        const { discussion: discussionList } = this.state;
        discussionList.push({
          ...res.data.results,
        });
        this.setState({
          add_discussion_loader: false,
          message: res.message,
          discussion_loading: false,
          discussion: discussionList,
        });
        window?.ChurnZero?.push([
          'trackEvent',
          'Send a message in a discussion',
          'EVA-SESS send a message in a discussion a candidate modal',
          1,
          {},
        ]);
      })
      .catch((error) => {
        this.setState({
          add_discussion_loader: false,
          discussion_loading: false,
          message: error?.response?.data?.message,
          errors: error?.response?.data?.errors,
        });
        setTimeout(() => {
          this.setState({
            message: '',
            errors: [],
          });
        }, 5000);
      });
  };

  /**
   * handler to add/edit the rating
   * @param rating
   */
  handleRating = (rating) => {
    this.setState({
      rating_loader: true,
    });
    this.setState({ answerRating: rating });
    const _video
      = this.state.assessments?.[this.state.assessmentIndex]?.assessment?.videos?.[
        this.state.id
      ];
    addRating(rating, _video?.uuid)
      // addRating(rating, this.state.candidates?.videos?.[this.state.id]?.uuid)
      .then((res) => {
        if (_video) _video.avg_rating = res.data.results?.rate;

        this.setState({
          rating_loader: false,
        });
      })
      .catch(() => {
        this.setState({
          rating_loader: false,
        });
      });
  };

  // Will be removed
  findCandidate = (uuid) => {
    axios
      .get(urls.evassess.findCandidate, {
        headers: generateHeaders(),
        params: {
          uuid,
        },
      })
      .then((res) => {
        this.setState(
          {
            id: 0,
            candidates: {
              ...res.data.results,
              videos:
                res.data.results.videos?.sort((a, b) => a.order - b.order) || [],
            },
            loading: false,
          },
          () => {},
        );
      })
      .catch(() => {
        // console.error();
      });
  };

  confirmAlert = (uuid, index, type) => {
    this.setState({
      alert: (
        <ReactBSAlert
          warning
          style={{ display: 'block' }}
          title="Are you sure?"
          onConfirm={() => this.confirmedAlert(uuid, index, type)}
          onCancel={() => this.hideAlert()}
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
    });
  };

  confirmedAlert = (uuid, index, type) => {
    this.setState({
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
    });
    this.DeleteComment(uuid, index, type);
  };

  DeleteComment = (UUID, index, type) => {
    let url = urls.evassess.getComments_WRITE;
    // const { user } = this.state;
    this.setState({
      comments_loading: type === 'comments',
      discussion_loading: type === 'discussion',
    });
    if (type === 'discussion') url = urls.evassess.getDiscussion_WRITE;

    axios
      .delete(url, {
        headers: generateHeaders(),
        params: {
          uuid: UUID,
        },
      })
      .then((res) => {
        if (type === 'comments') this.state.comments.splice(index, 1);
        else this.state.discussion.splice(index, 1);

        this.setState({
          add_comment_loader: false,
          discussion_loading: false,
          message: res.message,
          comments_loading: false,
          comment: [],
        });
        this.setState({
          alert: (
            <ReactBSAlert
              success
              style={{ display: 'block' }}
              title="Deleted!"
              onConfirm={() => this.hideAlert()}
              onCancel={() => this.hideAlert()}
              confirmBtnBsStyle="primary"
              confirmBtnText="Ok"
              btnSize=""
            >
              {type === 'comments' ? 'Comment ' : 'Discussion '} has been deleted.
            </ReactBSAlert>
          ),
        });
      })
      .catch((error) => {
        this.setState({
          add_comment_loader: false,
          discussion_loading: false,
          comments_loading: false,
          message: error?.response?.data?.message,
          errors: error?.response?.data?.errors,
        });
        setTimeout(() => {
          this.setState({
            message: '',
            errors: [],
          });
        }, 5000);
      });
  };

  hideAlert = () => {
    this.setState({
      alert: null,
    });
  };

  handleToggleDiscussion = () => {
    if (this.props.candidate.candidate.information.uuid && !this.state.isDiscusson) {
      this.setState({
        discussion: [],
        discussion_loading: true,
      });
      axios
        .get(urls.evassess.getDiscussion_GET, {
          headers: generateHeaders(),
          params: {
            candidate_uuid: this.props.candidate.candidate.information.uuid,
            page: this.state.discussion_page,
            limit: this.state.discussion_limit,
          },
        })
        .then((res) => {
          this.setState({
            discussion_page: res.data.results.page,
            discussion_per_page: res.data.results.per_page,
            total_discussion: res.data.results.total,
            discussion: res.data.results.data,
            // discussion: discussionsMockData,
            discussion_loading: false,
          });
        })
        .catch(() => {
          this.setState({
            discussion_loading: false,
          });
        });
    }

    this.setState({ isDiscussion: !this.state.isDiscussion });
  };

  /**
   * Get the rating of a specific recruiter (used when filtering by recruiter)
   * @param recruiter_uuid
   */
  getRecruiterRate = (recruiter_uuid) => {
    this.setState({
      rating_loader: true,
    });
    getRecruiterRating(
      recruiter_uuid,
      this.state.candidates?.videos?.[this.state.id]?.uuid,
    )
      .then((res) => {
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.candidates.videos[this.state.id].avg_rating
          = res.data.results?.rating?.rate;
        this.setState({
          rating_loader: false,
        });
      })
      .catch(() => {
        this.setState({
          rating_loader: false,
        });
      });
  };

  // onChange function to handle selected video assessment
  handleChange = (name) => (value) => {
    this.setState(
      {
        [name]: value.uuid,
      },
      function () {
        this.getVideoAssessmentsQuestion();
      },
    );
  };

  // Function to get the index of selected video assessment
  getVideoAssessmentsQuestion = () => {
    for (let i = 0; i < this.state.assessments?.length; i += 1)
      if (this.state.assessments?.[i].identifier.uuid === this.state.assessmentType)
        this.setState({
          assessmentIndex: i,
        });
  };

  /**
   * handler to set comments
   * @param uuid
   * @param index
   */
  handleSelect = (uuid, index) => {
    if (uuid) {
      this.setState({
        comments: [],
        comments_loading: true,
      });

      axios
        .get(urls.evassess.getComments_GET, {
          headers: generateHeaders(),
          params: {
            prep_assessment_answer_uuid: uuid,
            page: this.state.comments_page,
            limit: this.state.comments_limit,
          },
        })
        .then((res) => {
          this.setState({
            comments_page: res.data.results.page,
            comments_per_page: res.data.results.per_page,
            total_comments: res.data.results.total,
            comments: res.data.results.data,
            // comments: commentsMockData,
          });
          this.setState({
            comments_loading: false,
          });
        })
        .catch(() => {
          this.setState({
            comments_loading: false,
          });
        });
    }

    this.setState({
      content_id: index,
      content: index,
      class: 'active',
      loading: false,
    });
  };

  /**
   * Set the selected video
   * @param _selectedVideo
   */
  setSelectedVideo = (_selectedVideo) => {
    this.setState({
      id: _selectedVideo,
      loading: true,
    });
    const videos
      = this.state.assessments?.[this.state.assessmentIndex]?.assessment?.videos
      || null;

    const selectedVideo
      = (videos
        && videos.length
        && this.state.assessments?.[this.state.assessmentIndex]?.assessment?.videos[
          this.state.id
        ])
      || null;
    this.handleSelect(selectedVideo?.uuid, _selectedVideo);
  };

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  // Function to send selected video assessment
  sendVideoAssessment = async () => {
    this.setState({
      videoAssessmentLoadings: true,
    });
    const selectedVideos
      = this.state.selectedVideo
      && this.state.selectedVideo.map((item) => ({
        value: item.uuid,
        title: item.title,
      }));
    evarecAPI
      .SendVideoAssessment(
        this.props.jobUuid,
        selectedVideos,
        [this.props.candidate_uuid],
        this.state.newDeadline,
        this.props.type,
      )
      .then(() => {
        this.setState({
          videoAssessmentLoadings: false,
          newDeadline: '',
          selectedVideo: [],
        });
        this.getInvitedVideoAsessmentsList(
          this.props.jobUuid,
          this.props.candidate_uuid,
        );
        VitallyTrack('EVA-SSESS - Invite candidate to the assessment');
      })
      .catch(() => {
        this.setState({
          videoAssessmentLoadings: false,
        });
      });
  };

  handleStateChange = (state, value) => {
    this.setState({ state: value });
  };

  /**
   * Render the component
   * @return {JSX.Element}
   */
  render() {
    const { t } = this.props;
    // const { isDiscussion } = this.state;
    // Variable hold all assessments video
    const videos
      = this.state.assessments?.[this.state.tabValue]?.assessment?.videos || null;

    // Variable hold current video => specific video
    const selectedVideo
      = (videos
        && videos.length
        && this.state.assessments?.[this.state.tabValue]?.assessment?.videos[
          this.state.id
        ])
      || null;

    // Return
    return (
      <div className="questionnaires-tab-wrapper">
        <div className="">
          <Accordion expanded={this.state.isExpanded}>
            <AccordionSummary
              onClick={() =>
                this.setState((prevState) => ({
                  isExpanded: !prevState.isExpanded,
                }))
              }
              expandIcon={
                <Tooltip
                  title={
                    this.state.isExpanded
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
                  value={this.state.selectedVideo}
                  options={this.props.listOfVideoAssessments || []}
                  filterSelectedOptions
                  getOptionLabel={(option) => option.title}
                  onChange={(e, newValue) =>
                    this.setState({ selectedVideo: newValue })
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
                    <DatePickerComponent
                      idRef="date"
                      minDate={moment().add(1, 'days').format('YYYY-MM-DD')}
                      inputPlaceholder="YYYY-MM-DD"
                      themeClass="theme-outline"
                      value={this.state.newDeadline || ''}
                      onChange={(date) => {
                        this.setState({ newDeadline: date?.value });
                      }}
                      displayFormat={GlobalSavingDateFormat}
                      datePickerWrapperClasses="px-0 gray-outline"
                    />
                  </div>
                  <div className="send-button">
                    <Button
                      onClick={() => this.sendVideoAssessment()}
                      disabled={
                        !this.state.selectedVideo.length === 0
                        || !this.state.newDeadline
                        || this.state.videoAssessmentLoadings
                      }
                    >
                      {`${
                        this.state.videoAssessmentLoadings
                          ? t(`${translationPath}sending`)
                          : t(`${translationPath}send`)
                      }`}
                      {this.state.videoAssessmentLoadings && (
                        <i className="fas fa-circle-notch fa-spin ml-2-reversed" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
          {this.state.assessments && this.state.assessments.length > 0 && (
            <div className="select-questionnaire-tab-wrapper">
              <Tabs
                scrollButtons="auto"
                variant="scrollable"
                value={this.state.tabValue}
                onChange={(event, newValue) => {
                  this.handleChange('assessmentType');
                  this.setState({ tabValue: newValue, assessmentIndex: newValue });
                }}
              >
                {this.state.assessments?.map((item, index) => (
                  <Tab
                    key={index}
                    label={item.identifier.title}
                    onClick={() => {
                      if (item.assessment && item.assessment.videos)
                        this.setState({
                          selectedQuestion: item.assessment.videos[0].question.title,
                        });
                      else
                        this.setState({
                          selectedQuestion: 0,
                        });
                    }}
                  />
                ))}
              </Tabs>
            </div>
          )}
          <div className="select-questions-wrapper">
            <div className="section-title-wrapper d-flex-v-center">
              <div className="section-title">
                {this.state.assessments?.[this.state.tabValue]?.identifier.title}
              </div>
              <div className="section-description">
                {t(`${translationPath}team-avarage-rating`)}{' '}
                {selectedVideo?.avg_rating || 0} {t(`${translationPath}out-of`)} 5.0
                {/*{t(`${translationPath}team-avarage-rating`)} {' '} 5.0*/}
                {/*<br/>*/}
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
                    ? videos[this.state?.selectedQuestionIndex]?.question?.title
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
                        this.setState({ selectedQuestion: item.question.title });
                        this.setState({ selectedQuestionIndex: index });
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
        {this.state.alert}
        {this.state.loading ? (
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
                              this.state.selectedQuestionIndex === 0
                                ? 'is-disabled'
                                : ''
                            }`}
                          >
                            <Button
                              disabled={this.state.selectedQuestionIndex === 0}
                              onClick={() => {
                                this.setState((prevState) => ({
                                  selectedQuestionIndex:
                                    prevState.selectedQuestionIndex - 1,
                                }));
                                this.setState({ answerRating: null });
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
                              {this.state.id + 1}
                            </span>
                            <span className="question-name">
                              {t(`${translationPath}team-avarage-rating`)}:{' '}
                              {this.state.answerRating || selectedVideo?.avg_rating}{' '}
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
                              this.state.selectedQuestionIndex === videos.length - 1
                                ? 'is-disabled'
                                : ''
                            }`}
                          >
                            <Button
                              disabled={
                                this.state.selectedQuestionIndex
                                === videos.length - 1
                              }
                              onClick={() => {
                                this.setState((prevState) => ({
                                  selectedQuestionIndex:
                                    prevState.selectedQuestionIndex + 1,
                                }));
                                this.setState({ answerRating: null });
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
                            {/* {selectedVideo.question.model_answer.text && (
                              // && getIsAllowedPermissionV2({
                              //     permissions: this.props.permissions,
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
                                      value={
                                        selectedVideo.question.model_answer.score
                                      }
                                    />
                                  </Progress>
                                  <span className="font-weight-bold text-primary ml-2-reversed">
                                    {Math.round(
                                      selectedVideo.question.model_answer.score,
                                      1
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
                            )} */}
                            <div className="d-flex flex-column carousel-video-content-content-wrapper">
                              {this.state.video_loader ? (
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
                                    setSelectedVideo={this.setSelectedVideo}
                                    videos={videos}
                                    getRecruiterRate={(uuid) =>
                                      this.getRecruiterRate(uuid)
                                    }
                                    ratedUsers={selectedVideo?.rating_list}
                                    rating={selectedVideo?.avg_rating}
                                    onRating={this.handleRating}
                                    loading={this.state.rating_loader}
                                    avgRating={selectedVideo?.avg_rating}
                                    selectedQuestionIndex={
                                      this.state.selectedQuestionIndex
                                    }
                                    handleStateChange={this.handleStateChange}
                                  />
                                )
                              )}
                            </div>
                            <SemanticaComponent
                              setLoading={(value) => {
                                this.setState({
                                  isLoading: value,
                                });
                              }}
                              assessments={this.state.assessments}
                              selectedAssessmentIndex={
                                this.state.assessmentIndex || 0
                              }
                              candidate={this.props.candidate}
                              selectedVideo={selectedVideo}
                              videos={videos}
                            />
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="video-card-question-title rate-answer pt-3 pr-4-reversed pl-4-reversed">
                  <div
                    className={`previous-question ${
                      this.state.selectedQuestionIndex === 0 ? 'is-disabled' : ''
                    }`}
                  >
                    <Button
                      disabled={this.state.selectedQuestionIndex === 0}
                      onClick={() => {
                        this.setState((prevState) => ({
                          selectedQuestionIndex: prevState.selectedQuestionIndex - 1,
                        }));
                        this.setState({ answerRating: null });
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
                      {this.state.id + 1}
                    </span>
                    <span className="question-name">
                      {t(`${translationPath}rate-answer`)}:{' '}
                      {selectedVideo?.avg_rating || 0}
                    </span>
                    <div className="question-rating">
                      <Rating
                        value={
                          this.state.answerRating
                          || selectedVideo?.recruiter?.rate
                          || 0
                        }
                        onChange={(event, newValue) => this.handleRating(newValue)}
                      />
                    </div>
                  </div>
                  <div
                    className={`next-question ${
                      this.state.selectedQuestionIndex === videos.length - 1
                        ? 'is-disabled'
                        : ''
                    }`}
                  >
                    <Button
                      disabled={
                        this.state.selectedQuestionIndex === videos.length - 1
                      }
                      onClick={() => {
                        this.setState((prevState) => ({
                          selectedQuestionIndex: prevState.selectedQuestionIndex + 1,
                        }));
                        this.setState({ answerRating: null });
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
                        onSubmit={this.handleAddComment(selectedVideo?.uuid)}
                        isSending={this.state.add_comment_loader}
                        hasReply={false}
                        placeholder={t(`${translationPath}comment-on-this-video`)}
                      />
                    </div>
                    {this.state.errors && this.state.errors.comment ? (
                      this.state.errors.comment.length > 1 ? (
                        this.state.errors.comment.map((error, key) => (
                          <p className="m-0 text-xs text-danger" key={key}>
                            {error}
                          </p>
                        ))
                      ) : (
                        <p className="m-0 text-xs text-danger">
                          {this.state.errors.comment}
                        </p>
                      )
                    ) : null}
                    <div className="mb-4 scroll_comments">
                      {this.state.loading || this.state.comments_loading ? (
                        <div />
                      ) : (
                        this.state.comments
                        && (this.state.comments.length === 0
                          ? null
                          : this.state.comments.map((comment, index) => (
                            <CommentsList
                              confirmAlert={(uuid) => {
                                this.confirmAlert(uuid, index, 'comments');
                              }}
                              candidate_uuid={selectedVideo.uuid}
                              assessment_uuid={selectedVideo.uuid}
                              uuid={comment.uuid}
                              onChange={(value) => {
                                this.setState({
                                  comment: value,
                                });
                              }}
                              replies={this.state.replies}
                              comment={comment}
                              key={index}
                              add_comment_loader={this.state.add_comment_loader}
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
  }
}

export default withTranslation(parentTranslationPath)(VideoAssessmentModal);
