/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 * -----------------------------------------------------------------------------------
 * @title DiscussionsList.jsx
 * -----------------------------------------------------------------------------------
 * This module contains the DiscussionsList component which renders all the comments
 * and replies in the discussion section.
 * -----------------------------------------------------------------------------------
 */
import React, { Component } from 'react';
import axios from 'axios';
import urls from 'api/urls';
import moment from 'moment';
import { generateHeaders } from 'api/headers';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import { evarecAPI } from 'api/evarec';
import { Button, IconButton } from '@mui/material';
import { addDiscussionReply } from '../../shared/APIs/VideoAssessment/Discussions';
import LetterAvatar from './LetterAvatar';
import { showError } from 'helpers';
import { t } from 'i18next';

const translationPath = '';

/**
 * CandidateDiscussionsList class component
 */
export class CandidateDiscussionsList extends Component {
  /**
   * Constructor to pass props and initialize state
   * @param props
   */
  constructor(props) {
    super(props);
    this.state = {
      inputs: [],
      user: JSON.parse(localStorage.getItem('user'))?.results,
      page: 1,
      limit: 3,
      replies: [],
      replies_loading: false,
      data: this.props,
      reply: '',
      repliesVisible: false,
      edit: false,
      editReply: false,
      index: null,
      helperText: this.props?.t(`${translationPath}press-enter-to-update`),
      showReply: false,
    };
  }

  /**
   * Update Discussion Function
   * @param uuid
   * @param comment
   */
  updateDiscussion = (uuid, comment, index) => {
    const url
      = this.props.type === 'prep_assessment'
        ? urls.evassess.getDiscussion_WRITE
        : urls.evarec.ats.DISCUSSION_WRITE;
    evarecAPI
      .updateDiscussion(url, uuid, comment)
      .then((response) => {
        if (this.state.editReply) {
          this.state.replies[index].comment = response?.data?.results?.comment;
          this.setState({
            editReply: false,
            index: null,
            helperText: this.props?.t(`${translationPath}press-enter-to-update`),
          });
        } else {
          this.props.discussion.comment = response.data.results.comment;
          this.setState({
            edit: false,
            helperText: this.props?.t(`${translationPath}press-enter-to-update`),
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.isChangedReplies !== this.props.isChangedReplies)
      this.showReplies(prevProps.uuid, 1);
  }

  /**
   * hanlder to add reply to discussion
   * @returns {Promise}
   */
  handleAddReply = () => {
    this.setState({
      add_reply_loader: true,
      discussions_loading: true,
    });
    let params = null;
    const url
      = this.props.type === 'prep_assessment'
        ? urls.evassess.getDiscussionReplies_WRITE
        : urls.evarec.ats.DISCUSSION_REPLY_WRITE;

    if (this.props.type === 'prep_assessment')
      params = {
        parent_uuid: this.props.discussion.uuid,
        candidate_uuid: this.props.candidate_uuid,
        comment: this.state.reply.comment,
      };
    else
      params = {
        parent_uuid: this.props.discussion.uuid,
        job_candidate_uuid: this.props.candidate_uuid,
        comment: this.state.reply.comment,
      };

    /**
     * Add reply via API
     */
    addDiscussionReply(url, params).then((res) => {
      if (res.statusCode === 200) {
        this.state.replies.push(res.results);
        // Update Number of replies for discussion
        this.props.discussion.number_replays
          = this.props.discussion.number_replays + 1;
        this.setState({
          add_reply_loader: false,
          discussions_loading: false,
          inputs: [],
          reply: {
            comment: '',
          },
        });
        window?.ChurnZero?.push([
          'trackEvent',
          'Send a message in a discussion',
          'Send a message in a discussion a candidate modal',
          1,
          {},
        ]);
      } else {
        this.setState({
          add_reply_loader: false,
          discussions_loading: false,
          message: res?.message,
          errors: res?.errors,
        });
        showError(t('Shared:failed-to-get-saved-data'), res);
      }
    });
  };

  /**
   * Append input method
   */
  appendInput() {
    this.setState({ inputs: [] });
    const newInput = `input-${this.state.inputs.length}`;
    this.setState((prevState) => ({
      inputs: prevState.inputs.concat([newInput]),
    }));
  }

  /**
   * Display replies for specific Discussion
   * @param uuid
   * @param localPage
   * @returns {Promise}
   */
  showReplies(uuid, localPage) {
    this.setState({
      replies_loading: true,
    });
    const url
      = this.props.type === 'prep_assessment'
        ? urls.evassess.getDiscussionReplies_GET
        : urls.evarec.ats.DISCUSSION_REPLY_GET;

    /**
     * Get replies via API
     */
    axios
      .get(url, {
        headers: generateHeaders(),
        params: {
          discussion_uuid: uuid,
          page: localPage || this.state.page,
          limit: this.state.limit,
        },
      })
      .then((res) => {
        this.setState((prevState) => ({
          ...prevState,
          loading: false,
          page: localPage ? localPage + 1 : prevState.page + 1,
          replies_page: res.data.results.page,
          replies_per_page: res.data.results.per_page,
          total_replies: res.data.results.total,
          replies:
            localPage === 1 || prevState.page === 1
              ? res.data.results.data
              : res.data.results.data.forEach((item) => {
                if (!prevState.replies.includes(item))
                  prevState.replies.push(item);
              }),
          replies_loading: false,
          repliesVisible: true,
        }));
      })
      .catch((err) => {
        console.error(err);
      });
  }

  /**
   * Render the component
   * @returns {JSX.Element}
   */
  render() {
    const t = this.props?.t;
    return (
      <div className="w-100">
        <div className="d-flex-column align-items-start discussion-item">
          <div className="d-flex discussion-avatar-comments-wrapper">
            <Tooltip
              title={`${this.props.discussionUser?.first_name} ${this.props.discussionUser?.last_name}`}
              placement="left"
            >
              <div className="discussion-avatar">
                <LetterAvatar
                  large
                  name={`${this.props.discussionUser?.first_name} ${this.props.discussionUser?.last_name}`}
                />
              </div>
            </Tooltip>

            <div
              className="discussion-card"
              onMouseEnter={() => this.setState({ showReply: true })}
            >
              {/* {this.props.index === 0 && (
                <div className="candidate-chat-title-wrapper">
                  <div className="candidate-chat-title">
                    {this.props.discussion?.user?.first_name}
                    {' '}
                    {this.props.discussion?.user?.last_name}
                  </div>
                </div>
              )} */}
              <div
                className="chat-actions"
                onMouseLeave={() => this.setState({ showReply: false })}
              >
                {this.props.can && (
                  <>
                    {this.state?.user?.user?.uuid
                      === this.props.discussion.user?.uuid && (
                      <>
                        <i
                          onClick={() =>
                            this.props.confirmAlert(
                              this.props.discussion.uuid,
                              'discussion',
                            )
                          }
                          className="fas fa-trash cursor-pointer px-1 float-right"
                        />
                        <i
                          onClick={() => this.setState({ edit: true })}
                          className="fas fa-edit cursor-pointer px-1 float-right"
                        />
                      </>
                    )}
                    <i
                      onClick={() => this.appendInput()}
                      className="fas fa-reply cursor-pointer px-1 float-right"
                      disabled
                    />
                    {this.props.discussion.media?.url && (
                      <a
                        download
                        target="_blank"
                        href={this.props.discussion.media?.url}
                      >
                        <i
                          // onClick={() => this.props.confirmAlert(this.props.discussion.uuid)}
                          className="fas fa-download cursor-pointer px-1 float-right"
                        />
                      </a>
                    )}
                  </>
                )}
              </div>

              {/* VIEWING DISCUSSIONS */}
              <div className="w-100 mt-2">
                {this.props.discussion?.comment ? (
                  <>
                    {this.state.edit ? (
                      <TextField
                        fullWidth
                        multiline
                        variant="standard"
                        id="standard"
                        helperText={this.state.helperText}
                        defaultValue={this.props.discussion.comment}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            this.setState({
                              helperText: t(`${translationPath}updating`),
                            });
                            this.updateDiscussion(
                              this.props.discussion.uuid,
                              e.target.value,
                            );
                          }
                        }}
                        // onBlur={(e) => this.updateDiscussion(this.props.discussion.uuid, e.target.value)}
                      />
                    ) : (
                      <p className="disscussions-text">
                        {this.props.discussion.comment}
                      </p>
                    )}
                  </>
                ) : null}
                <div className="show-more-replies-button">
                  {this.props.discussion.number_replays > 0
                    && this.state.replies.length === 0 && (
                    <Button
                      disabled={
                        this.state.replies_loading
                          && this.state.repliesVisible === false
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        this.showReplies(this.props.discussion.uuid);
                      }}
                    >
                      {t(`${translationPath}show-replies`)}
                      {this.state.replies_loading
                          && this.state.repliesVisible === false && (
                        <div className="loading-more-replies">
                          <i className="fas fa-circle-notch fa-spin float-left mt-3" />
                        </div>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {this.props.discussion.number_replays > 0 && <hr className="m-2 " />}
          {/* REPLIES TO DISCUSSION */}
          {this.state.replies_loading && this.state.repliesVisible === true ? (
            <i className="fas fa-circle-notch fa-spin float-left mt-3" />
          ) : (
            <>
              {this.props.discussion.number_replays > 1
                && this.state.repliesVisible === true
                && this.state.replies.length
                  !== this.props.discussion.number_replays && (
                <a
                  className="h7 cursor-pointer text-center float-left mt-3 mb-2"
                  href={(e) => e.preventDefault()}
                  onClick={(e) => this.showReplies(this.props.discussion.uuid)}
                >
                  {t(`${translationPath}view-more`)}
                </a>
              )}
            </>
          )}
          <div>
            {this.state.inputs.map((input, id) => (
              <React.Fragment key={id}>
                <div className="discussion-comments-field">
                  <div className="discussion-comments-field-button">
                    <TextField
                      variant="standard"
                      value={this.state.reply.comment}
                      onChange={(e) => {
                        this.setState({
                          reply: {
                            comment: e.target.value,
                          },
                        });
                      }}
                    />
                    <IconButton
                      size="small"
                      disabled={!this.state.reply.comment}
                      onClick={this.handleAddReply}
                    >
                      {this.state.add_reply_loader ? (
                        <i className="fas fa-circle-notch fa-spin" />
                      ) : (
                        <i className="fa fa-paper-plane" />
                      )}
                    </IconButton>
                  </div>
                  {!this.state.reply.comment && (
                    <>
                      <span className="text-gray font-12">
                        {t(`${translationPath}type-your-reply`)}
                      </span>
                    </>
                  )}

                  {this.state.errors?.discussion ? (
                    this.state.errors.discussion.length > 1 ? (
                      this.state.errors.discussion.map((error, index) => (
                        <p key={index} className="m-0 text-xs text-danger">
                          {error}
                        </p>
                      ))
                    ) : (
                      <p className="m-o text-xs text-danger">
                        {this.state.errors.discussion}
                      </p>
                    )
                  ) : (
                    ''
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* DISCUSSION COMMENTS */}
        <div className="discussion-comments-wrapper">
          {this.state.replies.map((reply, i) => (
            <React.Fragment key={i}>
              <div className="discussion-comments-item">
                <div className="">
                  <div>
                    <div className="title-wrapper">
                      {reply.user?.first_name} {reply.user?.last_name}{' '}
                      <span className="text-muted"> {reply.user.job_title}</span>
                    </div>
                    {this.state?.user?.user?.uuid === reply.user?.uuid && (
                      <>
                        <i
                          onClick={() =>
                            this.props.confirmAlert(reply?.uuid, 'reply', i)
                          }
                          className="fas fa-trash cursor-pointer px-1 float-right"
                        />
                        <i
                          onClick={() =>
                            this.setState({ editReply: true, index: i })
                          }
                          className="fas fa-edit cursor-pointer px-1 float-right"
                        />
                      </>
                    )}
                  </div>
                  {this.state.editReply && this.state.index === i ? (
                    <TextField
                      fullWidth
                      multiline
                      variant="standard"
                      helperText={this.state.helperText}
                      defaultValue={reply.comment}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          this.setState({
                            helperText: t(`${translationPath}updating`),
                          });
                          this.updateDiscussion(reply.uuid, e.target.value, i);
                        }
                      }}
                      // onBlur={(e) => this.updateDiscussion(this.props.discussion.uuid, e.target.value)}
                    />
                  ) : (
                    <h5 className="font-weight-light mb-0">{reply.comment}</h5>
                  )}
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className="my-2 text-center w-100 font-12" style={{ color: '#bebdbd' }}>
          {this.props.discussion.created_at
            && this.props.discussions?.length === this.props.index + 1
            && moment(Date.parse(this.props.discussion.created_at)).format(
              'DD MMM YYYY',
            )}
        </div>
      </div>
    );
  }
}

export default CandidateDiscussionsList;
