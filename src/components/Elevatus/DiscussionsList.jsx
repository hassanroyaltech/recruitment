/**
 * -----------------------------------------------------------------------------------
 * @title DiscussionsList.jsx
 * -----------------------------------------------------------------------------------
 * This module contains the DiscussionsList component which renders all the comments
 * and replies in the discussion section.
 * -----------------------------------------------------------------------------------
 */
import React, { Component } from 'react';
import { Button, CardBody } from 'reactstrap';
import axios from 'axios';
import urls from 'api/urls';
import moment from 'moment';
import { generateHeaders } from 'api/headers';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import { evarecAPI } from 'api/evarec';
import i18next, { t } from 'i18next';
import { addDiscussionReply } from '../../shared/APIs/VideoAssessment/Discussions';
import LetterAvatar from './LetterAvatar';
import ButtonBase from '@mui/material/ButtonBase';
import { SystemActionsEnum } from '../../enums';
import { showError } from 'helpers';

/**
 * DiscussionsList class component
 */
export class DiscussionsList extends Component {
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
      localComment: this.props.discussion.comment,
      helperText: this.props.t('press-enter-to-update'),
    };
  }

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
   * Update Discussion Function
   * @param uuid
   * @param index
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
            helperText: this.props.t('press-enter-to-update'),
          });
        } else {
          this.props.discussion.comment = response.data.results.comment;
          this.setState({
            edit: false,
            helperText: this.props.t('press-enter-to-update'),
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
   * Display replies for specific Discussion
   * @param uuid
   * @returns {Promise}
   */
  showReplies(uuid) {
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
          page: this.state.page,
          limit: this.state.limit,
        },
      })
      .then((res) => {
        res.data.results.data.forEach((item) => {
          if (!this.state.replies.includes(item)) this.state.replies.push(item);
        });
        this.setState({
          loading: false,
          page: this.state.page + 1,
          replies_page: res.data.results.page,
          replies_per_page: res.data.results.per_page,
          total_replies: res.data.results.total,
          replies_loading: false,
          repliesVisible: true,
        });
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
    return (
      <div className="w-100">
        <div className="d-flex flex-row align-items-start discussion-item">
          <div
            className="mt-3 mr-3-reversed"
            style={{
              minWidth: 40,
              minHeight: 40,
              width: 40,
              height: 40,
            }}
          >
            {this.props.discussion?.uuid !== this.props.candidate_uuid && (
              <Tooltip
                title={this.state?.user?.user?.first_name[0]}
                aria-label="Attach a file"
                placement="top"
              >
                <span>
                  <LetterAvatar
                    large
                    name={`${
                      this.state?.user?.user?.first_name[i18next.language]?.[0]
                      || this.state?.user?.user?.first_name?.en?.[0]
                    } ${
                      this.state?.user?.user?.last_name[i18next.language]?.[0]
                      || this.state?.user?.user?.last_name?.en?.[0]
                    }`}
                  />
                </span>
              </Tooltip>
              // <img
              //   alt="..."
              //   className="avatar avatar-md rounded-circle w-100 h-100"
              //   src={
              //     this.props.discussion.user.profile_image.url
              //     || require('assets/img/theme/team-1.jpg')
              //   }
              //   style={{ borderWidth: 2 }}
              // />
            )}
          </div>
          <div className="flex-grow-1 p-3 mx-2 position-relative discussion-card">
            <div className="mb-1">
              <div className="d-flex-h-between">
                <div className="d-flex-v-center flex-wrap header-text">
                  <span>
                    <span>{this.props.discussion?.user?.first_name}</span>
                    <span className="px-1">
                      {this.props.discussion?.user?.last_name}
                    </span>
                  </span>
                </div>
                {/* flattened icons */}
                {this.props.can && (
                  <div className="d-inline-flex-v-center px-2">
                    {this.state?.user?.user?.uuid
                      === this.props.discussion.user?.uuid && (
                      <>
                        <ButtonBase
                          onClick={() =>
                            this.props.confirmAlert(
                              this.props.discussion.uuid,
                              'discussion',
                            )
                          }
                          className="btns-icon theme-transparent"
                        >
                          <span className={SystemActionsEnum.delete.icon} />
                        </ButtonBase>
                        <ButtonBase
                          onClick={() => this.setState({ edit: true })}
                          className="btns-icon theme-transparent mx-1"
                        >
                          <span className={SystemActionsEnum.edit.icon} />
                        </ButtonBase>
                      </>
                    )}
                    <ButtonBase
                      onClick={() => this.appendInput()}
                      className="btns-icon theme-transparent"
                    >
                      <span className="fas fa-reply" />
                    </ButtonBase>
                    {this.props.discussion.media?.url && (
                      <a
                        download
                        target="_blank"
                        href={this.props.discussion.media?.url}
                        rel="noreferrer"
                        className="mx-1"
                      >
                        <i className="fas fa-download cursor-pointer px-1 float-right" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* VIEWING DISCUSSIONS */}
            <div className="w-100 mt-2">
              {this.props.discussion?.comment ? (
                <>
                  {this.state.edit ? (
                    <>
                      <TextField
                        fullWidth
                        multiline
                        variant="standard"
                        id="standard"
                        helperText={this.state.helperText}
                        value={this.state.localComment}
                        onKeyDown={(e) => {
                          if (
                            e.key === 'Enter'
                            && e.target.value
                            && e.target.value.length > 2
                          ) {
                            this.setState({
                              helperText: this.props.t('updating'),
                            });
                            this.updateDiscussion(
                              this.props.discussion.uuid,
                              e.target.value,
                            );
                          }
                        }}
                        onChange={(e) => {
                          const {
                            target: { value },
                          } = e;
                          this.setState({
                            localComment: value,
                          });
                        }}
                        // onBlur={(e) => this.updateDiscussion(this.props.discussion.uuid, e.target.value)}
                      />
                      {(!this.state.localComment
                        || this.state.localComment.length < 3) && (
                        <div className="c-error fz-10">
                          <span>{`${this.props.t(
                            'Shared:must-be-more-than',
                          )} ${2}`}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="font-size-850 font-weight-400 mb-2">
                      {this.props.discussion.comment}
                    </p>
                  )}
                </>
              ) : null}
              {this.state.replies_loading && this.state.repliesVisible === false ? (
                <>
                  <i className="fas fa-circle-notch fa-spin float-left mt-3" />
                </>
              ) : (
                <>
                  {this.props.discussion.number_replays > 0
                    && this.state.replies.length === 0 && (
                    <ButtonBase
                      className="btns theme-transparent mb-2"
                      onClick={(e) => {
                        e.preventDefault();
                        this.showReplies(this.props.discussion.uuid);
                      }}
                    >
                        Show replies
                    </ButtonBase>
                  )}
                </>
              )}
            </div>

            {/* DISCUSSION COMMENTS */}
            {this.state.replies.map((reply, i) => (
              <React.Fragment key={`repliesDKeys${i + 1}`}>
                <div className="shadow-none d-flex flex-row mt-1 mb-1">
                  <div className="d flex align-items-center w-10">
                    <a
                      className="avatar avatar-xs rounded-circle bg-transparent"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                    >
                      <img alt="..." src={reply.user.profile_image.url} />
                    </a>
                  </div>
                  <div className="w-100 px-2 pb-2">
                    <div className="d-flex-h-between">
                      <div className="d-flex flex-wrap">
                        <span className="header-text">
                          <span>{reply.user?.first_name}</span>
                          <span className="px-1">{reply.user?.last_name}</span>
                        </span>
                        <span>{reply.user.job_title}</span>
                      </div>

                      {this.state?.user?.user?.uuid === reply.user?.uuid && (
                        <div className="d-inline-flex">
                          <ButtonBase
                            onClick={() =>
                              this.props.confirmAlert(reply?.uuid, 'reply')
                            }
                            className="btns-icon theme-transparent"
                          >
                            <span className={SystemActionsEnum.delete.icon} />
                          </ButtonBase>
                          <ButtonBase
                            onClick={() =>
                              this.setState({ editReply: true, index: i })
                            }
                            className="btns-icon theme-transparent"
                          >
                            <span className={SystemActionsEnum.edit.icon} />
                          </ButtonBase>
                        </div>
                      )}
                    </div>

                    {this.state.editReply && this.state.index === i ? (
                      <TextField
                        fullWidth
                        multiline
                        variant="standard"
                        id="standard"
                        helperText={this.state.helperText}
                        defaultValue={reply.comment}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            this.setState({
                              helperText: 'Updating ...',
                            });
                            this.updateDiscussion(reply.uuid, e.target.value, i);
                          }
                        }}
                        // onBlur={(e) => this.updateDiscussion(this.props.discussion.uuid, e.target.value)}
                      />
                    ) : (
                      <div className="pt-2">{reply.comment}</div>
                    )}
                  </div>
                </div>
              </React.Fragment>
            ))}
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
                    {this.props.t('view-more')}
                  </a>
                )}
              </>
            )}
            <div id="dynamicInput" style={{ clear: 'both' }} className="clearfix">
              {this.state.inputs.map((input, id) => (
                <React.Fragment key={id}>
                  <CardBody
                    className="border border-gray p-2 bg-white"
                    style={{ borderRadius: 27, flex: 'unset' }}
                  >
                    <div className="d-flex flex-row align-items-center">
                      <div
                        className="flex-grow-1 border-0 p-2 font-14"
                        style={{
                          maxHeight: 150,
                          overflow: 'auto',
                          width: 'calc(100% - 150px)',
                          color: 'black',
                          position: 'relative',
                        }}
                      >
                        <div
                          contentEditable
                          aria-label="input"
                          id={`chat-sender-content-${id}`}
                          onInput={(e) => {
                            this.setState({
                              reply: {
                                comment: e.currentTarget.innerText,
                              },
                            });
                          }}
                          suppressContentEditableWarning
                        />
                        {!this.state.reply.comment && (
                          <>
                            <span
                              className="text-gray"
                              style={{
                                position: 'absolute',
                                top: 8,
                                left: 8,
                                pointerEvents: 'none',
                              }}
                            >
                              {this.props?.t('type-your-reply')}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="m-1" style={{ width: 40, height: 40 }}>
                        <Button
                          color="primary"
                          disabled={!this.state.reply.comment}
                          onClick={this.handleAddReply}
                          className="btn btn-primary rounded-circle w-100 h-100 p-0"
                        >
                          {this.state.add_reply_loader ? (
                            <i className="fas fa-circle-notch fa-spin" />
                          ) : (
                            <i className="fa fa-paper-plane" />
                          )}
                        </Button>
                      </div>
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
                  </CardBody>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        <div className="my-2 text-center w-100 font-12" style={{ color: '#bebdbd' }}>
          {this.props.discussion.created_at
            ? moment(Date.parse(this.props.discussion.created_at)).format(
              'DD MMM YYYY',
            )
            : ''}
        </div>
      </div>
    );
  }
}
