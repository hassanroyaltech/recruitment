/* eslint-disable react/no-unused-state */
/* eslint-disable react/sort-comp */
/* eslint-disable react/static-property-placement */
/* eslint-disable react/no-string-refs */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable camelcase */
/**
 * ----------------------------------------------------------------------------------
 * @title ChatSender.jsx
 * ----------------------------------------------------------------------------------
 * This module contains the ChatSender component which allows users to post comments.
 * ----------------------------------------------------------------------------------
 */

import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import {
  IconButton,
  InputAdornment,
  TextField,
  ClickAwayListener,
  Fade,
} from '@mui/material';
import { withTranslation } from 'react-i18next';
import { commonAPI } from '../../api/common';
import { evarecAPI } from '../../api/evarec';
import { evassessAPI } from '../../api/evassess';
import LetterAvatar from '../../components/Elevatus/LetterAvatar';

import { getIsAllowedSubscription } from '../../helpers';
import { SubscriptionServicesEnum } from '../../enums';
import NoPermissionComponent from '../../shared/NoPermissionComponent/NoPermissionComponent';

const translationPath = '';
const parentTranslationPath = 'EvarecCandidateModel';

/**
 * The CandidateChatSender class component
 */
class CandidateChatSender extends React.Component {
  /**
   * Constructor to pass props and initialize state
   * @param props
   */
  constructor(props) {
    super(props);
    this.state = {
      user: JSON.parse(localStorage.getItem('user'))?.results,
      comment: '',
      attachment: null,
      loader: false,
      image_preview: '',
      selectedUser: null,
      anchorE2: null,
      popperOpen: false,
    };
  }

  /**
   * Default props
   * @type {{hasAttach: boolean, hasReply: boolean, id: string}}
   */
  static defaultProps = {
    id: '',
    hasReply: false,
    hasAttach: false,
  };

  /**
   * Handler for comment change
   * @param e
   */
  handleChange = (e) => {
    this.setState({
      comment: e.target.value,
    });
    if (this.props.onChange)
      this.props.onChange({
        comment: e.target.value,
        attachment: this.state.attachment,
      });
  };

  /**
   * Handler to click
   */
  handleClick = () => {
    this.refs.fileUploader.click();
  };

  /**
   * handler to upload a file
   * @param e
   */
  handleFileChange = (e) => {
    /** attach only image or docs */
    let type = 'image';
    if (e.target.files[0].type.includes('image')) type = 'image';
    else type = 'docs';

    if (e.target.files.length) {
      this.setState({
        loader: true,
      });
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      formData.append('type', type);
      formData.append('from_feature', 'prep_assessment'); // Replace the preset name with your own

      commonAPI
        .createMedia(formData)
        .then(({ data }) => {
          this.setState({
            attachment: data.results.original,
            loader: false,
            uploaded: true,
          });
          this.props.onChange({
            comment: this.state.comment,
            attachment: data.results.original,
          });
          setTimeout(() => {
            this.setState({
              uploaded: false,
            });
          }, 2000);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  /**
   * Handler to submit a comment
   */
  handleSubmit = async () => {
    const { comment } = this.state;
    this.props.onSubmit({
      comment,
      attachment: this.state.attachment,
    });

    this.setState({
      comment: '',
      attachment: null,
    });
  };

  // Get the AvgRating, if user click on all user icon
  getAvgRating = () => {
    this.props.setUserRate(this.props.avgRating);
    this.props.setDiscussions(this.props.discussionsList);
  };

  // Get Rating for specific recruiter
  getRecruiterRates = (uuid) => {
    if (this.props.users) {
      // EVA-SSESS
      const avg_rating = this.props.ratingList.filter(
        (e) => e.recruiter?.uuid === uuid,
      );
      this.props.setUserRate(avg_rating?.[0]?.rate);
      // eslint-disable-next-line no-use-before-define
      if (this.props.users)
        evassessAPI
          .getDiscussionFiltered(this.props?.candidateUuid, uuid)
          .then((res) => {
            this.props.setDiscussions(res.data?.results?.data);
          });
      else
        evarecAPI.getDiscussion(this.props.candidateUuid, uuid).then((res) => {
          this.props.setDiscussions(res.data.results.data);
        });
    } else {
      // EVA-REC
      const avg_rating = this.props.candidateRatingList.rates.filter(
        (e) => e.recruiter?.uuid === uuid,
      );
      this.props.setUserRate(avg_rating?.[0]?.rate);
      // eslint-disable-next-line no-use-before-define
      if (this.props.users)
        evassessAPI
          .getDiscussionFiltered(this.props.candidateUuid, uuid)
          .then((res) => {
            this.props.setDiscussions(res.data.results.data);
          });
      else
        evarecAPI.getDiscussion(this.props.candidateUuid, uuid).then((res) => {
          this.props.setDiscussions(res.data.results.data);
        });
    }
  };

  onPopperOpen = (event) => {
    if (
      !getIsAllowedSubscription({
        serviceKey: SubscriptionServicesEnum.EvaRec.key,
        subscriptions: this.props.subscriptions,
      })
    )
      this.setState({ anchorE2: event.currentTarget, popperOpen: true });
  };

  /**
   * Render the component
   * @return {JSX.Element}
   */
  render() {
    const { t } = this.props;
    // Save variables from props
    const {
      hasAttach,
      hasReply,
      isReplying,
      isSending,
      parent_id,
      candidateRatingList,
      expand,
      setExpand,
    } = this.props;

    // Save variables from state
    const { comment, attachment } = this.state;
    return (
      <>
        <div className="candidate-chat-sender-rated">
          <div className="disscusion-title">{t(`${translationPath}discussion`)}</div>
          {candidateRatingList && candidateRatingList.rates.length ? (
            <div className="rated-candidate-list">
              <div
                key="all"
                style={{ cursor: 'pointer' }}
                className="rated-candidate-add-more"
                onClick={this.getAvgRating}
              >
                <i className="fas fa-users" />
              </div>
              {candidateRatingList.rates.slice(0, 3).map((user, index) => (
                <Tooltip
                  key={`${index + 1}-candidate-image`}
                  title={`${user.recruiter?.first_name} ${user.recruiter?.last_name}`}
                >
                  <div
                    className={`rated-candidate-list-item is-sliced ${
                      this.state.selectedUser === user.recruiter?.uuid
                        ? 'is-selected'
                        : ''
                    }`}
                  >
                    <LetterAvatar
                      onClick={() => {
                        this.getRecruiterRates(user.recruiter?.uuid);
                        this.setState({ selectedUser: user.recruiter?.uuid });
                      }}
                      alt="user-profile"
                      name={`${user.recruiter?.first_name} ${user.recruiter?.last_name}`}
                    />
                  </div>
                </Tooltip>
              ))}
              {candidateRatingList.rates.length > 3 && (
                <div
                  key="more"
                  onClick={() => setExpand(!expand)}
                  className="rated-candidate-users"
                >
                  +{candidateRatingList.rates.length - 3}
                </div>
              )}
              {expand && (
                <ClickAwayListener onClickAway={() => setExpand(!expand)}>
                  <Fade in={expand}>
                    <div className="expanded-candidates-wrapper">
                      {candidateRatingList.rates.map((user, index) => (
                        <div
                          key={`${index + 1}-candidate`}
                          className={`rated-candidate-list-item ${
                            this.state.selectedUser === user.recruiter?.uuid
                              ? 'is-selected'
                              : ''
                          }`}
                          onClick={() => {
                            this.getRecruiterRates(user.recruiter?.uuid);
                            this.setState({ selectedUser: user.recruiter?.uuid });
                          }}
                        >
                          <LetterAvatar
                            alt="user-profile"
                            name={`${user.recruiter?.first_name} ${user.recruiter?.last_name}`}
                          />
                          {user.recruiter?.first_name} {user.recruiter?.last_name}
                        </div>
                      ))}
                    </div>
                  </Fade>
                </ClickAwayListener>
              )}
            </div>
          ) : (
            <div className="no-candidates-rated">
              {t(`${translationPath}no-candidates-rated`)}
            </div>
          )}
          {/* {candidateRatingList && (
              <div className="rated-candidates-rating-list d-flex flex-row">
                {users && users.length ? (
                  <React.Fragment>
                    <div
                      key="all"
                      className="rated-candidate-item bg-primary ml-0 mr-2 selected"
                      style={{ cursor: 'pointer' }}
                      onClick={this.getAvgRating}
                    >
                      <i className="fas fa-users" />
                    </div>
                    {expand ? (
                      <Row style={{ marginRight: '0px', marginLeft: '0px' }}>
                        {users.map((user, index) => (
                          <div key={index} className="rated-candidate-item ml-0 mr-2">
                            <LetterAvatar
                              key={index}
                              style={{ cursor: 'pointer' }}
                              onClick={() => {
                                this.getRecruiterRates(user.recruiter?.uuid);
                              }}
                              alt="user-profile"
                              name={`${user.recruiter?.first_name} ${user.recruiter?.last_name}`}
                            />
                          </div>
                        ))}
                      </Row>
                    ) : (
                      <Row style={{ marginRight: '0px', marginLeft: '0px' }}>
                        {users.slice(0, 3).map((user, index) => (
                          <div key={index} className="rated-candidate-item ml-0 mr-2">
                            <LetterAvatar
                              key={index}
                              style={{ cursor: 'pointer' }}
                              onClick={() => {
                                this.getRecruiterRates(user.recruiter?.uuid);
                              }}
                              alt="user-profile"
                              name={`${user.recruiter?.first_name} ${user.recruiter?.last_name}`}
                            />
                          </div>
                        ))}
                      </Row>
                    )}

                    {!expand && users.length > 3 && (
                      <div
                        key="more"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setExpand(true)}
                        className="rated-candidate-item bg-gray ml-0 mr-2"
                      >
                        +
                        {users.length - 3}
                      </div>
                    )}
                  </React.Fragment>
                ) : (
                  <div className="no-candidates-rated">No candidates rated</div>
                )}
              </div>
            )} */}
        </div>

        <div className="candidate-chat-sender-wrapper">
          <div className="d-flex flex-row align-items-center">
            <div className="attach-file-button">
              {hasAttach && !parent_id && (
                <span className="p-2">
                  {this.state.loader ? (
                    <i className="fas fa-circle-notch fa-spin" />
                  ) : (
                    <Tooltip
                      title={t(`${translationPath}attach-a-file`)}
                      aria-label="Attach a file"
                      placement="top"
                    >
                      <span>
                        <IconButton onClick={this.handleClick}>
                          <i className="fas fa-paperclip fa-lg" />
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={this.handleFileChange}
                            id="file"
                            ref="fileUploader"
                            style={{ display: 'none' }}
                          />
                        </IconButton>
                      </span>
                    </Tooltip>
                  )}
                </span>
              )}
            </div>
            <div className="flex-grow-1 border-0 font-14 chat-textfield-wrapper">
              <TextField
                fullWidth
                multiline
                value={this.state.comment}
                onChange={this.handleChange}
                variant="standard"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <div
                        className={`chat-send-button ${
                          // !getIsAllowedPermissionV2({
                          //   permissionId,
                          //   CurrentFeatures.team_discussion.permissionsId,
                          // })
                          // ||
                          isSending || (!comment && !attachment) ? 'is-disabled' : ''
                        }`}
                      >
                        {hasReply && parent_id ? (
                          <IconButton
                            size="small"
                            onMouseEnter={this.onPopperOpen}
                            disabled={
                              // !getIsAllowedPermissionV2({
                              //   permissions: this.props.permissions,
                              //   permissionId: CurrentFeatures.team_discussion.permissionsId,
                              // })
                              // ||
                              isReplying || !this.props.can
                            }
                            onClick={() => this.props.handleAddReply(parent_id)}
                          >
                            {isReplying ? (
                              <i className="fas fa-circle-notch fa-spin" />
                            ) : (
                              <i className="fa fa-reply" />
                            )}
                          </IconButton>
                        ) : (
                          <div onMouseEnter={this.onPopperOpen}>
                            <IconButton
                              size="small"
                              disabled={
                                // !getIsAllowedPermissionV2({
                                //   permissions: this.props.permissions,
                                //   permissionId: CurrentFeatures.team_discussion.permissionsId,
                                // })
                                // ||
                                isSending || (!comment && !attachment)
                              }
                              onClick={this.handleSubmit}
                            >
                              {isSending ? (
                                <i className="fas fa-circle-notch fa-spin" />
                              ) : (
                                <i className="fa fa-paper-plane" />
                              )}
                            </IconButton>
                          </div>
                        )}
                      </div>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </div>
          {hasAttach && this.state.uploaded && (
            <p className="text-success font-12">
              {t(`${translationPath}file-was-uploaded-successfully`)}
            </p>
          )}
        </div>

        <NoPermissionComponent
          anchorEl={this.state.anchorE2}
          popperOpen={this.state.popperOpen}
          setAnchorEl={(value) => this.setState({ anchorE2: value })}
          setPopperOpen={(value) => this.setState({ popperOpen: value })}
        />
      </>
    );
  }
}

export default withTranslation(parentTranslationPath)(CandidateChatSender);
