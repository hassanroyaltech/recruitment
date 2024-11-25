// Import React Components
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase, Card, CardContent, Divider } from '@mui/material';
import LetterAvatar from 'components/Elevatus/LetterAvatar';
import DOMPurify from 'dompurify';
import { useSelector } from 'react-redux';
// import moment from 'moment';
// import i18next from 'i18next';
import { SystemActionsEnum } from '../../../../../enums';
// import {
//   TooltipsComponent,
// } from '../../../..';
import {
  GetExpandedThread,
  GetNylasFile,
  ReplyToEmail,
  UpdateEmail,
} from '../../../../../services';
import {
  showError,
  showSuccess,
  //  GlobalSecondaryDateFormat,
} from '../../../../../helpers';
import EmailComposer from './EmailComposer';
import { generateHeaders } from '../../../../../api/headers';

const parentTranslationPath = 'EmailIntegrationPage';
const translationPath = 'EmailDetailsPage.';

const Email = ({
  threadData,
  setThreadData,
  backHandler,
  candidate_uuid,
  scope,
  job_uuid,
  showMainReply,
  setShowMainReply,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [showReply, setShowReply] = useState({});
  // const [activeTooltip, setActiveTooltip] = useState({
  //   star: false,
  // });
  const [loading, setLoading] = useState(false);
  const [expandedData, setExpandedData] = useState(null);
  const userReducer = useSelector((state) => state?.userReducer);
  const emailIntegrationReducer = useSelector(
    (state) => state?.emailIntegrationReducer,
  );
  const [downloadableIDs, setDownloadableIDs] = useState([]);
  const [downloadedFiles, setDownloadedFiles] = useState([]);
  const [allDownloadedFiles, setAllDownloadedFiles] = useState([]);
  const [replyValue, setReplyValue] = useState([]);

  // const toggleTooltip = (icon) => {
  //   setActiveTooltip(((activeItem) => ({ ...activeItem, [icon]: false })));
  // };

  const ReplyToEmailHandler = useCallback(
    async (messageId, body) => {
      const res = await ReplyToEmail({ reply_to_message_id: messageId, ...body });
      if (res?.status === 200) {
        showSuccess(res.data.message);
        backHandler();
      } else showError(t('Shared:failed-to-get-saved-data'));
    },
    [backHandler, t],
  );

  const DownloadFileHandler = useCallback(
    async (file_id) => {
      if (scope === 'external') {
        // TODO: Remove from here
        const fetchedResource = await fetch(
          `${process.env.REACT_APP_API_NYLAS_BASE_URL}/files/download?user_uuid=${userReducer.results.user.uuid}&access_token=${emailIntegrationReducer.access_token}&file_id=${file_id}`,
          {
            method: 'get',
            headers: generateHeaders(),
          },
        );
        const blobbed = await fetchedResource.blob();
        const url = window.URL.createObjectURL(new Blob([blobbed]));
        if (blobbed?.type?.includes('image'))
          setDownloadedFiles((items) => ({
            ...items,
            [file_id]: url,
          }));
      }
      if (scope === 'candidate_modal') {
        const response = await GetNylasFile({
          user_uuid: userReducer.results.user.uuid,
          file_id,
          is_candidate: true,
        });
        if (response && response.status === 200) {
          setDownloadedFiles((items) => ({
            ...items,
            [file_id]: response.data.results?.url,
          }));
          setAllDownloadedFiles((items) => ({
            ...items,
            [file_id]: response.data.results?.url,
          }));
        }
      }
    },
    [emailIntegrationReducer, userReducer, scope],
  );

  const GetExpandedThreadHandler = useCallback(async () => {
    setLoading(true);
    const res = await GetExpandedThread({
      user_uuid: userReducer.results.user.uuid,
      thread_id: threadData.id,
    });
    if (res.status === 200) {
      setExpandedData(res.data.body);
      // getAttachments
      const fileIds = [];
      const downloadableFileIds = [];
      res.data.body.forEach((item) => {
        item.attachments
          .forEach((file) => {
            fileIds.push(file.id);
            downloadableFileIds.push(file.id);
          });
      });
      console.log( downloadableFileIds," res.data.body")
      setDownloadableIDs(downloadableFileIds);
    } else showError('failed');
    setLoading(false);
  }, [threadData, userReducer]);

  const downloadMultipleFiles = useCallback(async () => {
    await Promise.all(
      downloadableIDs.map(async (fileId) => DownloadFileHandler(fileId)),
    );

  }, [DownloadFileHandler, downloadableIDs]);

  const GetBodyHandler = (body) => {
    if (Object.keys(downloadedFiles).length) {
      const newBody = Object.keys(downloadedFiles)?.map((file) =>
        body?.replace('cid:', '')?.replace(file, downloadedFiles[file]),
      );
      return (
        <div
          className="body mt-4 pr-2"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: newBody[newBody.length - 1] }}
        />
      );
    }
    return (
      <div
        className="body mt-4 pr-2"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(body) }}
      />
    );
  };

  const UpdateEmailHandler = useCallback(
    async (body) => {
      setLoading(true);
      const res = await UpdateEmail(body);
      if (res.status === 200) {
        showSuccess(res.data.message);
        if (scope === 'external') GetExpandedThreadHandler();
        else if (scope === 'candidate_modal') {
          const edited = [...threadData.messages].map((message) => {
            if (message.id === body.message_id) return res.data.body;
            return message;
          });
          setThreadData({ ...threadData, messages: edited });
        }
      } else showError('failed');
      setLoading(false);
    },
    [GetExpandedThreadHandler, scope, setThreadData, threadData],
  );

  useEffect(() => {
    console.log(downloadableIDs)
    if (downloadableIDs && downloadableIDs.length) downloadMultipleFiles();
  }, [downloadMultipleFiles, downloadableIDs]);

  useEffect(() => {
    // get expanded thread to get bodies
    if (scope === 'external') GetExpandedThreadHandler();
    else {
      const downloadableFileIds = [];

      expandedData.forEach((item) => {
        item.attachments.forEach((file) => {
          downloadableFileIds.push(file.id);
        });
      });
      setDownloadableIDs(downloadableFileIds);
    }
  }, [GetExpandedThreadHandler, scope, threadData]);

  return (
    <div className="view-email-container">
      <div className="view-email-subject">
        <ButtonBase
          className="btns-icon theme-transparent mr-1-reversed c-primary"
          onClick={backHandler}
        >
          <div>
            <span className={SystemActionsEnum.back.icon} />
          </div>
        </ButtonBase>
      </div>
      <Card>
        <CardContent>
          <span className="header-text-x2 d-flex mb-1">{threadData?.subject}</span>
          <div className="mb-4 mt-3">
            <Divider />
          </div>
          {/*{JSON.stringify(expandedData)}*/}
          {expandedData
            && expandedData.length
            && expandedData.map((message, idx) => (
              <>

                <div className="view-email-body" key={message.grant_id}>
                  <div className="email-avatar">
                    <LetterAvatar name={(message && message.from_[0]?.email) || ''} />
                  </div>
                  <div style={{ width: '100%' }}>
                    <div className="email-header-wrapper">
                      <div className="sender">
                        <span className="">
                          {message?.from_[0].name || message?.from_[0].email}
                        </span>
                        {message?.from_[0].name && (
                          <span className="c-gray ml-2">{`<${message?.from_[0].email}>`}</span>
                        )}
                      </div>
                      <div>
                        {scope === 'external' && (
                          <>
                            <ButtonBase
                              className="btns-icon theme-transparent mr-1-reversed c-primary"
                              onClick={() =>
                                UpdateEmailHandler({
                                  user_uuid: userReducer.results.user.uuid,
                                  message_id: message.id,
                                  unread: expandedData?.length
                                    ? expandedData?.[expandedData.length - idx - 1]?.unread
                                    : message.unread,
                                })
                              }
                            >
                              <div>
                                {loading ? (
                                  <span className="fas fa-spinner fa-spin" />
                                ) : (
                                  <span
                                    className={
                                      expandedData?.[expandedData.length - idx - 1]
                                        ?.unread || message.unread
                                        ? SystemActionsEnum.closedEnvelope.icon
                                        : SystemActionsEnum.openEnvelope.icon
                                    }
                                  />
                                )}
                              </div>
                            </ButtonBase>
                            <ButtonBase
                              className="btns-icon theme-transparent mr-1-reversed c-primary"
                              onClick={() =>
                                UpdateEmailHandler({
                                  user_uuid: userReducer.results.user.uuid,
                                  access_token: emailIntegrationReducer.access_token,
                                  message_id: message.id,
                                  starred: expandedData?.length
                                    ? expandedData?.[expandedData.length - idx - 1]?.starred
                                    : message.starred,
                                })
                              }
                            >
                              <div>
                                {loading ? (
                                  <span className="fas fa-spinner fa-spin" />
                                ) : (
                                  <span
                                    className={
                                      expandedData?.[expandedData.length - idx - 1]
                                        ?.starred || message.starred
                                        ? SystemActionsEnum?.filledStar?.icon
                                        : SystemActionsEnum?.emptyStar?.icon
                                    }
                                  />
                                )}
                              </div>
                            </ButtonBase>
                          </>
                        )}
                        <ButtonBase
                          className="btns-icon theme-transparent mr-1-reversed c-primary"
                          onClick={() => {
                            setShowReply((items) => ({
                              ...items,
                              [idx]: !items[idx],
                            }));
                          }}
                          disabled={!emailIntegrationReducer.access_token}
                        >
                          <div>
                            <span className={SystemActionsEnum.reply.icon} />
                          </div>
                        </ButtonBase>
                      </div>
                    </div>
                    {GetBodyHandler(
                      message.body === ''
                        ? message.body
                        : message.body
                            || expandedData?.find((item) => item.id === message.id)
                              ?.body,
                    )}
                    {/* <div className="date">
                      {moment
                        .unix(message.date)
                        .locale(i18next.language)
                        .format(GlobalSecondaryDateFormat)}
                  </div> */}

                    {message?.attachments?.length ? (
                      <>
                        <Divider className="my-4" />
                        <div className="d-flex mt-1 att-cont">
                          {message.attachments.map(
                            (file, index) =>
                              file.content_disposition !== 'inline' && (
                                <div
                                  key={`messageFileKey${index + 1}`}
                                  className="att-block-cont"
                                >
                                  {JSON.stringify(downloadedFiles)}
                                  <a
                                    download={file.filename}
                                    key={file.id}
                                    href={
                                      downloadedFiles[file.id]
                                      || allDownloadedFiles[file.id]
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="d-flex-column-center"
                                  >
                                    {downloadedFiles[file.id] ? (
                                      <img
                                        src={downloadedFiles[file.id]}
                                        width="180"
                                        alt="attachment"
                                      />
                                    ) : (
                                      <span
                                        className={`c-primary m-2 fa-4x ${SystemActionsEnum.file.icon}`}
                                      />
                                    )}
                                    <span className="d-flex-center mt-2 att-text">
                                      {file.filename}
                                    </span>
                                  </a>
                                </div>
                              ),
                          )}
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
                {showReply[idx] && (
                  <div className="reply-composer ml-4">
                    <EmailComposer
                      backHandler={backHandler}
                      candidate_uuid={candidate_uuid}
                      scope={scope}
                      job_uuid={job_uuid}
                      ReplyToEmailHandler={(body) =>
                        ReplyToEmailHandler(message.id, body)
                      }
                    />
                  </div>
                )}
                <div className="my-4">
                  <Divider />
                </div>
              </>
            ))}
          {showMainReply && (
            <div className="reply-composer ml-4 mb-4">
              <EmailComposer
                backHandler={backHandler}
                candidate_uuid={candidate_uuid}
                scope={scope}
                job_uuid={job_uuid}
                ReplyToEmailHandler={(body) =>
                  ReplyToEmailHandler(
                    threadData.messages[threadData.messages.length - 1].id,
                    body,
                  )
                }
                replyValue={replyValue}
              />
            </div>
          )}
          <div className="email-view-actions">
            <ButtonBase
              className="btns theme-solid"
              onClick={() => {
                setReplyValue({
                  to: threadData?.messages?.[threadData.messages.length - 1]?.from,
                });
                setShowMainReply(true);
              }}
              disabled={!emailIntegrationReducer.access_token}
            >
              <div>
                <span className={`${SystemActionsEnum.reply.icon} mr-2`} />
                {t(`${translationPath}reply`)}
              </div>
            </ButtonBase>
            <ButtonBase
              className="btns theme-solid"
              onClick={() => {
                setReplyValue({
                  to: threadData?.messages?.[threadData.messages.length - 1]?.from,
                  cc: threadData?.messages?.[threadData.messages.length - 1]?.cc,
                });
                setShowMainReply(true);
              }}
              disabled={!emailIntegrationReducer.access_token}
            >
              <div>
                <span className={`${SystemActionsEnum.replyAll.icon} mr-2`} />
                {t(`${translationPath}reply-all`)}
              </div>
            </ButtonBase>
            <ButtonBase
              className="btns theme-solid"
              onClick={() => {
                setReplyValue({
                  body: `<br/>---------- Forwarded message ---------<br/>${expandedData?.[0]?.body}`,
                });
                setShowMainReply(true);
              }}
              disabled={!emailIntegrationReducer.access_token}
            >
              <div>
                <span className={`${SystemActionsEnum.forward.icon} mr-2`} />
                {t(`${translationPath}forward`)}
              </div>
            </ButtonBase>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Email;

Email.propTypes = {
  threadData: PropTypes.shape({
    id: PropTypes.string,
    subject: PropTypes.string,
    messages: PropTypes.arrayOf({ id: PropTypes.string }),
  }),
  setThreadData: PropTypes.func,
  backHandler: PropTypes.func.isRequired,
  candidate_uuid: PropTypes.string,
  scope: PropTypes.oneOf(['candidate_modal', 'external']).isRequired,
  job_uuid: PropTypes.string,
  showMainReply: PropTypes.func.isRequired,
  setShowMainReply: PropTypes.func.isRequired,
};

Email.defaultProps = {
  threadData: undefined,
  setThreadData: undefined,
  candidate_uuid: undefined,
  job_uuid: undefined,
};
