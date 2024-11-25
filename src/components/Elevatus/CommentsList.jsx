/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable no-param-reassign */
/**
 * ----------------------------------------------------------------------------------
 * @title CommentsList.jsx
 * ----------------------------------------------------------------------------------
 * This module contains the CommentsList component that renders all comments for a
 * video assessment.
 *
 * ----------------------------------------------------------------------------------
 */
import React, { useMemo, useState } from 'react';
import axios from 'axios';
import urls from 'api/urls';
import moment from 'moment';
import { generateHeaders } from 'api/headers';
import { evassessAPI } from 'api/evassess';
import { TextField, Button } from '@mui/material';
import Rating from '@mui/material/Rating';
import { useTranslation } from 'react-i18next';
import ChatSender from './ChatSender';
import LetterAvatar from '../../components/Elevatus/LetterAvatar';
import ButtonBase from '@mui/material/ButtonBase';
import { LoadableImageEnum, SystemActionsEnum } from '../../enums';
import { LoadableImageComponant } from '../LoadableImage/LoadableImage.Componant';
import defaultUserImage from '../../assets/icons/user-avatar.svg';
import Avatar from '@mui/material/Avatar';
import { StringToColor } from '../../helpers';

/**
 * CommentsList component for the EvassessCandidateModal
 */
const translationPath = 'CommentsListComponent.';
export const CommentsList = (props) => {
  const { t } = useTranslation(props.parentTranslationPath || 'EvaSSESSPipeline');
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [updatedComment, setUpdatedComment] = useState(props.comment.comment);
  const [state, setState] = useState({
    inputs: [],
    user: JSON.parse(localStorage.getItem('user'))?.results,
    page: 0,
    limit: 10,
    replies: [],
    replies_loading: false,
    data: props,
    edit: false,
  });

  /**
   * Update Comments Function
   * @param uuid
   * @param comment
   */
  const updateComment = (uuid, comment) => {
    setIsCommentLoading(true);
    evassessAPI.updateComment(uuid, comment).then((response) => {
      props.comment.comment = response.data.results.comment;
      setState((items) => ({
        ...items,
        edit: false,
      }));
      setIsCommentLoading(false);
    });
  };

  /**
   * handler to add a reply
   */
  const handleAddReply = () => {
    setState((items) => ({
      ...items,
      add_reply_loader: true,
      comments_loading: true,
    }));
    axios
      .put(
        urls.evassess.getComments_WRITE,
        {
          parent_uuid: props.comment.uuid,
          prep_assessment_answer_uuid: props.candidate_uuid,
          comment: props.comment.comment,
        },
        {
          headers: generateHeaders(),
        },
      )
      .then((res) => {
        state.replies.push(res.data.results);
        setState((items) => ({
          ...items,
          add_reply_loader: false,
          comments_loading: false,
          inputs: [],
        }));
      })
      .catch((error) => {
        setState((items) => ({
          ...items,
          add_reply_loader: false,
          comments_loading: false,
          message: error?.response?.data?.message,
          errors: error?.response?.data?.errors,
        }));
      });
  };

  /**
   * Show replies (paginated)
   */
  const showReplies = (uuid) => {
    setState((items) => ({
      ...items,
      replies_loading: true,
    }));
    axios
      .get(urls.evassess.getReplies, {
        headers: generateHeaders(),
        params: {
          comment_uuid: uuid,
          page: state.page,
          limit: state.limit,
        },
      })
      .then((res) => {
        res.data.results.data.forEach((item) => {
          if (!state.replies.includes(item)) state.replies.push(item);
        });
        setState((items) => ({
          ...items,
          loading: false,
          page: state.page + 1,
          replies_page: res.data.results.page,
          replies_per_page: res.data.results.per_page,
          total_replies: res.data.results.total,
          replies_loading: false,
        }));
      });
  };
  const userName = useMemo(
    () =>
      `${props.comment?.user?.first_name} ${props.comment?.user?.last_name}` || '',
    [props?.comment?.user],
  );
  /**
   * Render the component
   * @return {JSX.Element}
   */
  return (
    <div className="w-100 mb-2 comments-list-wrapper">
      <div className="d-flex flex-row align-items-start comment-item px-2 mx-3">
        <div
          className="ml-2-reversed card bg-light-gray flex-grow-1 position-relative px-3 mb-3"
          style={{
            borderLeft: '1px solid #dee2ec',
            borderRadius: '20px',
          }}
        >
          <div className="d-flex-h-between fa-start my-2">
            <div className="d-inline-flex-v-center">
              <div className="d-inline-flex">
                {props.comment.uuid !== props.assessment_uuid && (
                  <LetterAvatar large name={userName} />
                )}
              </div>
              <div className="d-inline-flex-column px-2 pt-1">
                <span className="px-1">
                  <span className="header-text">
                    <span>{props.comment.user.first_name}</span>
                    <span className="px-1">{props.comment.user.last_name}</span>
                  </span>
                  <div className="mx-2 font-size-850 job-title-item badge badge-secondary badge-pill">
                    {props.comment.user.job_title}
                  </div>
                </span>
                <span className="m-0 p-0 font-size-850 text-muted">
                  {props.comment.created_at
                    ? moment(Date.parse(props.comment.created_at)).format(
                      'DD MMM YYYY',
                    )
                    : ''}
                </span>
              </div>
            </div>
            {state.user.user.uuid === props.comment.user.uuid
              && !props.comment.is_rating && (
              <div className="d-inline-flex-v-center px-1 mt-2">
                <ButtonBase
                  onClick={() => props.confirmAlert(props.comment.uuid)}
                  className="btns-icon theme-transparent mx-1"
                >
                  <span className={SystemActionsEnum.delete.icon} />
                </ButtonBase>
                <ButtonBase
                  onClick={() => setState((items) => ({ ...items, edit: true }))}
                  className="btns-icon theme-transparent mx-1"
                >
                  <span className={SystemActionsEnum.edit.icon} />
                </ButtonBase>
              </div>
            )}
          </div>
          <hr className="my-2" />
          <div className="w-100 mt-2 d-flex-v-center">
            <div className="d-inline-flex-center px-2">
              {(props.comment.user?.profile_image?.url && (
                <LoadableImageComponant
                  style={{ width: '40px', height: '40px' }}
                  type={LoadableImageEnum.div.key}
                  alt={userName}
                  tooltipTitle={userName}
                  src={props.comment.user?.profile_image?.url || defaultUserImage}
                />
              )) || (
                <LetterAvatar
                  style={{
                    backgroundColor: StringToColor(userName),
                  }}
                  large
                  name={userName}
                />
              )}
            </div>
            {props.comment.is_rating ? (
              <div id="rating-stars-auto">
                <Rating value={props.comment.comment} readOnly />
              </div>
            ) : (
              <>
                {state.edit ? (
                  <>
                    <TextField
                      fullWidth
                      multiline
                      variant="standard"
                      id="standard"
                      helperText={t(`${translationPath}press-enter-to-update`)}
                      defaultValue={props.comment.comment}
                      onChange={(event) => setUpdatedComment(event.target.value)}
                      // onKeyDown={(e) => {
                      //   if (e.key === 'Enter')
                      //     updateComment(props.comment.uuid, e.target.value);
                      // }}
                      // onBlur={(e) => updateComment(props.comment.uuid, e.target.value)}
                    />
                    {(!updatedComment || updatedComment.length < 3) && (
                      <div className="c-error fz-10">
                        <span>{`${t('Shared:must-be-more-than')} ${2}`}</span>
                      </div>
                    )}
                    <Button
                      disable={!updatedComment || updatedComment.length < 3}
                      onClick={() =>
                        updateComment(props.comment.uuid, updatedComment)
                      }
                    >
                      {isCommentLoading ? (
                        <>
                          <i className="fas fa-circle-notch fa-spin mr-2-reversed" />
                          {t(`${translationPath}sending`)}
                        </>
                      ) : (
                        <>
                          <i className="fa fa-paper-plane mr-2-reversed" />
                          {t(`${translationPath}send`)}
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <p className="font-weight-400 font-size-900 mb-2">
                    {props.comment.comment.includes('\n')
                      ? props.comment.comment.split('\n')?.map((item, index) => (
                        <div
                          key={`commentsSplitKey${index + 1}`}
                          className="d-flex-column"
                        >
                          <span>{item}</span>
                        </div>
                      ))
                      : props.comment.comment}
                  </p>
                )}
              </>
            )}
          </div>
          <div className="d-flex flex-row align-items-center justify-content-between my-2">
            <div className="icon-actions text-left">
              {props.comment.number_replays > 0
                && state.replies.length !== props.comment.number_replays && (
                <ButtonBase
                  className="btns theme-transparent"
                  onClick={(e) => {
                    e.preventDefault();
                    showReplies(props.comment.uuid);
                  }}
                >
                  {state.replies
                      && `${state.replies.length} ${t(`${translationPath}of`)}`}{' '}
                  {props.comment.number_replays} {t(`${translationPath}replies`)}
                  {state.replies_loading && (
                    <i className="fas fa-circle-notch fa-spin mx-2" />
                  )}
                </ButtonBase>
              )}
            </div>
          </div>

          <div id="dynamicInput" style={{ clear: 'both' }} className="clearfix">
            {state.inputs.map((input, i) => (
              <ChatSender
                key={`inputsKeys${i + 1}`}
                uuid={props.uuid}
                assessment_uuid={props.uuid}
                onChange={(value) => {
                  setState((items) => ({ ...items, comment: value }));
                }}
                onSubmit={handleAddReply}
                isSending={state.add_comment_loader}
                hasReply={false}
                placeholder={t(`${translationPath}type-your-comment`)}
              />
            ))}
          </div>
          {state.replies.map((reply, i) => (
            <React.Fragment key={`repliesKeys${i + 1}`}>
              <div className="shadow-none d-flex flex-row mt-1 mb-1">
                <div className="d-flex align-items-center w-10">
                  <a
                    className="avatar avatar-xs rounded-circle bg-transparent"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                  >
                    <img alt="..." src={reply.user.profile_image.url} />
                  </a>
                </div>
                <div className="w-75 px-2">
                  <h5>
                    {reply.user.first_name} {reply.user.last_name}{' '}
                    <span className="text-muted"> {reply.user.job_title}</span>
                  </h5>
                  <h5 className="font-weight-light mb-0">{reply.comment}</h5>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
