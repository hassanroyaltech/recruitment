/* eslint-disable jsx-a11y/aria-role */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/prop-types */
/**
 * ----------------------------------------------------------------------------------
 * @title ChatSender.jsx
 * ----------------------------------------------------------------------------------
 * This module contains the ChatSender component which allows users to post comments.
 * ----------------------------------------------------------------------------------
 */
import React, { useRef, useState } from 'react';
import { Button, CardBody } from 'reactstrap';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { useSelector } from 'react-redux';
import LetterAvatar from './LetterAvatar';
import { commonAPI } from '../../api/common';
import { getIsAllowedSubscription, showError } from '../../helpers';
import { SubscriptionServicesEnum } from '../../enums';
import NoPermissionComponent from '../../shared/NoPermissionComponent/NoPermissionComponent';

/**
 * The ChatSender class component
 */
const translationPath = 'ChatSenderComponent.';
const ChatSender = ({
  id,
  placeholder,
  hasAttach,
  hasReply,
  isReplying,
  isSending,
  parent_id,
  onChange,
  onSubmit,
  can,
  handleAddReply,
  assessment_uuid,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath || 'EvaSSESSPipeline');
  const [state, setState] = useState(() => ({
    user: JSON.parse(localStorage.getItem('user'))?.results,
    comment: '',
    attachment: null,
    loader: false,
    image_preview: '',
  }));
  const fileUploaderRef = useRef(null);

  // const permissions = useSelector(
  //     (reducerState) => reducerState?.permissionsReducer?.permissions,
  // );
  const subscriptions = useSelector(
    (reducerState) => reducerState?.userSubscriptionsReducer?.subscriptions,
  );

  /**
   * Handler for comment change
   * @param e
   */
  const handleChange = (e) => {
    const { attachment } = state;
    const { innerText } = e.currentTarget;
    setState((items) => ({
      ...items,
      comment: innerText,
    }));
    if (onChange)
      onChange({
        comment: innerText,
        attachment,
      });
  };

  /**
   * Handler to click
   * @param e
   */
  const handleClick = (e) => {
    fileUploaderRef.current.click();
  };

  /**
   * handler to upload a file
   * @param e
   */
  const handleFileChange = (e) => {
    /** attach only image or docs */
    let type = 'image';
    if (e.target.files?.[0].type.includes('image')) type = 'image';
    else type = 'docs';

    if (e.target.files.length) {
      setState((items) => ({
        ...items,
        loader: true,
      }));
      const formData = new FormData();
      formData.append('file', e.target?.files?.[0]);
      formData.append('type', type);
      formData.append('from_feature', 'prep_assessment'); // Replace the preset name with your own

      commonAPI
        .createMedia(formData)
        .then(({ data }) => {
          setState((items) => ({
            ...items,
            attachment: data.results.original,
            loader: false,
            uploaded: true,
          }));
          if (onChange)
            onChange({
              comment: state.comment,
              attachment: data.results.original,
            });
          setTimeout(() => {
            setState((items) => ({
              ...items,
              uploaded: false,
            }));
          }, 2000);
        })
        .catch((e) => {
          showError(t('Shared:failed-to-get-saved-data'), e);
          setState((items) => ({
            ...items,
            loader: false,
            uploaded: false,
          }));
        });
    }
  };
  /**
   * Handler to submit a comment
   */
  const handleSubmit = async () => {
    const { comment, attachment } = state;
    onSubmit({
      comment,
      attachment,
    });

    // This is the easy way to reset the comment content to an empty string.
    // The way the state has been built is convoluted and this was the hack previous
    // devs added. I'm keeping it because it might take too long to fix.
    document.getElementById(`chat-sender-content-${id}`).innerHTML = '';
    setState((items) => ({
      ...items,
      comment: '',
      attachment: null,
    }));
  };

  /**
   * Render the component
   * @return {JSX.Element}
   */
  // Save variables from props

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

  // Save variables from state
  return (
    <>
      <CardBody
        className={`chat-sender border border-gray p-2 m-3 ${
          assessment_uuid ? 'bg-white' : 'bg-gray-light'
        }`}
      >
        <div className="d-flex flex-row align-items-center">
          <LetterAvatar
            large
            name={`${
              state.user.user.first_name[i18next.language]?.[0]
              || state.user.user.first_name?.en?.[0]
            } ${
              state.user.user.last_name?.[i18next.language]?.[0]
              || state.user.user.last_name?.en?.[0]
            }`}
          />
          <div
            className="flex-grow-1 border-0 p-2 font-14"
            style={{
              maxHeight: 150,
              minHeight: 40,
              overflow: 'auto',
              width: 'calc(100% - 150px)',
              color: 'black',
              position: 'relative',
            }}
          >
            <div
              contentEditable={Boolean(assessment_uuid)}
              role="textarea"
              id={`chat-sender-content-${id}`}
              name="comment"
              onInput={handleChange}
              suppressContentEditableWarning
            />
            {!state.comment ? (
              <span
                className="text-gray"
                style={{
                  position: 'absolute',
                  top: 8,
                  left: (i18next.dir() === 'ltr' && 8) || 'initial',
                  right: (i18next.dir() === 'rtl' && 8) || 'initial',
                  pointerEvents: 'none',
                }}
              >
                {placeholder || t(`${translationPath}type-your-comment`)}
              </span>
            ) : null}
          </div>
          {hasAttach && !parent_id ? (
            <span className="p-2">
              {state.loader ? (
                <i className="fas fa-circle-notch fa-spin" />
              ) : (
                <Tooltip
                  title={t(`${translationPath}attach-a-file`)}
                  placement="top"
                >
                  <i
                    role="button"
                    className="fas fa-paperclip fa-lg"
                    onClick={handleClick}
                  >
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleFileChange}
                      id="file"
                      ref={fileUploaderRef}
                      style={{ display: 'none' }}
                    />
                  </i>
                </Tooltip>
              )}
            </span>
          ) : null}
          <div className="m-1" style={{ width: 50, height: 50 }}>
            {hasReply && parent_id ? (
              <div style={{ width: 50, height: 50 }} onMouseEnter={onPopperOpen}>
                <Button
                  color="primary"
                  disabled={isReplying || !can}
                  onClick={() => handleAddReply(parent_id)}
                  className="btn btn-primary rounded-circle w-100 h-100 p-0"
                >
                  {isReplying ? (
                    <i className="fas fa-circle-notch fa-spin" />
                  ) : (
                    <i className="fa fa-reply" />
                  )}
                </Button>
              </div>
            ) : (
              <div style={{ width: 50, height: 50 }} onMouseEnter={onPopperOpen}>
                <Button
                  color="primary"
                  disabled={
                    isSending || (!state.comment && !state.attachment)
                    // || !getIsAllowedPermissionV2(
                    //   permissions,
                    //   permissionId: CurrentFeatures.team_discussion.permissionsId,
                    // )
                  }
                  onClick={handleSubmit}
                  className="btn btn-primary rounded-circle w-100 h-100 p-0"
                >
                  {isSending ? (
                    <i className="fas fa-circle-notch fa-spin" />
                  ) : (
                    <i className="fa fa-paper-plane" />
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
        {hasAttach && state.uploaded && (
          <p className="text-success font-12">
            {t(`${translationPath}file-uploaded-successfully`)}
          </p>
        )}
      </CardBody>

      <NoPermissionComponent
        anchorEl={anchorEl}
        popperOpen={popperOpen}
        setAnchorEl={setAnchorEl}
        setPopperOpen={setPopperOpen}
      />
    </>
  );
};

export default ChatSender;
