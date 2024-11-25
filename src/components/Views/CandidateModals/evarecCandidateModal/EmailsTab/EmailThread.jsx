// Import React Components
import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@mui/material';
import { useSelector } from 'react-redux';
import Loader from 'components/Elevatus/Loader';
import { SystemActionsEnum } from '../../../../../enums';
import { RadiosComponent, DialogComponent } from '../../../..';
import '@nylas/components-mailbox';
import Email from './Email';
import {
  GetAllCandidateEmails,
  GetAllEmails,
  SyncCandidateEmails,
  UpdateThread,
} from '../../../../../services';
import { SharedInputControl } from '../../../../../pages/setups/shared/controls/SharedInput.Control';
import {
  getErrorByName,
  getIsAllowedPermissionV2,
  GlobalHistory,
  GlobalSavingDateFormat,
  showError,
  showSuccess,
} from '../../../../../helpers';
import './MailBox.scss';
import moment from 'moment/moment';
import i18next from 'i18next';
import LetterAvatar from '../../../../Elevatus/LetterAvatar';
import { CreateAnApplicationPermissions } from '../../../../../permissions';
const parentTranslationPath = 'EmailIntegrationPage';
const translationPath = 'MailBoxPage.';

const EmailThread = ({
  candidate_uuid,
  job_uuid,
  scope,
  candidate,
  openComposer,
  filterValue,
  in_folder
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const emailRef = useRef();
  const [threadsList, setThreadsList] = useState(null);
  const [expandedEmail, setExpandedEmail] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [selectedPage, setSelectedPage] = useState(1);
  // const [nextCallback, setNextCallback] = useState( threadsList?.next_cursor || null);
  const [prevCallback, setPrevCallback] = useState(  null);

  const emailIntegrationReducer = useSelector(
    (state) => state?.emailIntegrationReducer,
  );
  // const [totalPages, setTotalPages] = useState([1]);
  const advFiltersRef = useRef({
    subject: null,
    any_email: null,
    to: null,
    from: null,
    cc: null,
    bcc: null,
    unread: null,
    starred: null,
    not_in: null,
  });
  const [advancedFilters, setAdvancedFilers] = useState(advFiltersRef.current);
  const userReducer = useSelector((state) => state?.userReducer);
  const [filter, setFilter] = useState({
    limit: 10,
    query: '0',
  });
  const [loading, setLoading] = useState(false);
  const [showMainReply, setShowMainReply] = useState(false);
  const [errors, setErrors] = useState(() => ({}));

  const changeFilter = useCallback((key, val) => {
    setFilter((items) => ({ ...items, [key]: val }));
  }, []);
  const paginate = useCallback(()=>{

  },[])
  const resetFilter = useCallback(() => {
    setFilter({
      limit: 10,
      query: '0',
    });
  }, []);

  const schema = useRef(
    yup.object().shape({
      any_email: yup.string().email().nullable(),
      cc: yup.string().email().nullable(),
      bcc: yup.string().email().nullable(),
    }),
  );

  const getCandidateEmailsList = useCallback(async () => {
    setLoading(true);
    const candidateThreads = await GetAllCandidateEmails({
      user_uuid: userReducer.results.user.uuid,
      candidate_uuid,
      email: candidate?.basic_information?.email,
      job_uuid,
      ...filter,
      page: selectedPage,
    });
    if (candidateThreads?.status === 200) {
      if (candidateThreads.data?.results?.results)
        setThreadsList(candidateThreads.data.results.results);
    } else showError(t('failed-to-get-saved-data'), candidateThreads?.data?.message);
    setLoading(false);
  }, [userReducer, candidate_uuid, candidate, job_uuid, filter, t]);

  const syncCandidateMailbox = useCallback(async () => {
    setLoading(true);
    // TODO: Add pop up to ask user if he wants to proceed with sync
    const res = await SyncCandidateEmails({
      user_uuid: userReducer.results.user.uuid,
      candidate_uuid,
      // candidate_email,
      job_uuid,
      // limit,
      // offset,
    });
    if (res?.status === 200) {
      showSuccess(res?.data?.message);
      if (candidate_uuid) getCandidateEmailsList();
    } else showError(t('Shared:failed-to-get-saved-data'), res?.data?.message);
    setLoading(false);
  }, [
    candidate_uuid,
    emailIntegrationReducer,
    getCandidateEmailsList,
    job_uuid,
    t,
    userReducer,
  ]);

  const getExternalMailboxThreadsHandler = useCallback(async () => {
    setLoading(true);
    const candidateThreads = await GetAllEmails({
      user_uuid: userReducer.results.user.uuid, // limit: 30,
      ...filter,
      in_folder:
        filterValue === 'all' || filterValue === 'starred' ? undefined : filterValue,
      starred: (filterValue === 'starred' && true) || null,
    });
    if (candidateThreads?.status === 200) {
      if (candidateThreads.data?.body) setThreadsList(candidateThreads.data.body);
    } else showError(t('failed-to-get-saved-data'), candidateThreads?.data?.message);
    setLoading(false);
  }, [userReducer, emailIntegrationReducer, filter, filterValue, t]);

  const UpdateThreadHandler = useCallback(async (body) => {
    setLoading(true);
    const res = await UpdateThread(body);
    if (res.status === 200) showSuccess(res.data.message);
    else showError('failed');
    setLoading(false);
  }, []);

  const setStarred = useCallback(
    async (thread) => {
      if (!thread) return; // Early return if thread is not provided

      const { uuid: userUuid } = userReducer.results.user;
      const { access_token: accessToken } = emailIntegrationReducer;

      try {
        await UpdateThreadHandler({
          user_uuid: userUuid,
          access_token: accessToken,
          thread_id: thread.id,
          starred: !thread.starred,
        });

        // Call the appropriate function based on candidate_uuid
        if (candidate_uuid) getCandidateEmailsList();
        else getExternalMailboxThreadsHandler();
      } catch (error) {
        console.error('Error updating thread:', error);
        // Optionally handle the error, e.g., show a notification to the user
      }
    },
    [
      UpdateThreadHandler,
      emailIntegrationReducer.access_token,
      userReducer.results.user.uuid,
      candidate_uuid, // Added candidate_uuid as a dependency
    ],
  );

  const setUnread = useCallback(
    async (thread) => {
      if (!thread) return; // Early return if thread is not provided
      const { uuid: userUuid } = userReducer.results.user;
      const { access_token: accessToken } = emailIntegrationReducer;
      try {
        await UpdateThreadHandler({
          user_uuid: userUuid,
          access_token: accessToken,
          thread_id: thread.id,
          unread: false,
        });
        setExpandedEmail(thread);

      } catch (error) {
        console.error('Error updating thread:', error);
        // Optionally handle the error, e.g., show a notification to the user
      }
    },
    [
      UpdateThreadHandler,
      emailIntegrationReducer.access_token,
      userReducer.results.user.uuid,
      candidate_uuid, // Added candidate_uuid as a dependency
    ],
  );
  useEffect(() => {
    if (!emailRef?.current) return;
    emailRef.current.all_threads = threadsList;
    console.log(emailRef.current);
    emailRef.current.addEventListener('manifestLoaded', (e) => {
      console.log('manifestLoaded');
      const emailContainer = Array.from(
        e.srcElement?.shadowRoot?.childNodes,
      )?.[1]?.getElementsByClassName('email-container')?.[0]?.childNodes?.[0]
        ?.shadowRoot;
      if (emailContainer) {
        const backButton = Array.from(emailContainer.childNodes)?.[3].querySelector(
          '[title="Return to Mailbox"]',
        );
        if (backButton) backButton.click();
        const emailContainers = Array.from(
          e.srcElement?.shadowRoot?.childNodes,
        )?.[1]?.getElementsByClassName('email-container');
        Array.from(emailContainers).forEach((item) => {
          const attachment = Array.from(
            Array.from(item.childNodes)[0].shadowRoot.childNodes,
          )[3].getElementsByClassName('attachment desktop')[0];
          if (attachment) attachment.setAttribute('style', 'display:none;');
        });
      }
    });
    emailRef.current.addEventListener('click', (e) => {
      e.stopImmediatePropagation();

      if (e?.detail?.thread) {
        setExpandedEmail(e.detail.thread);
        if (e.detail.thread.unread)
          UpdateThreadHandler({
            user_uuid: userReducer.results.user.uuid,
            thread_id: e.detail.thread.id,
            mark_as_read: true,
            mark_as_unread: false,
          });
      }
      if (filterValue === 'drafts') setShowMainReply(true);
    });
    emailRef.current.addEventListener('draftThreadEvent', (e) => {});
    emailRef.current.addEventListener('onChangeSelectedReadStatus', (e) => {});
    emailRef.current.addEventListener('onStarSelected', (e) => {
      e.stopImmediatePropagation();

      UpdateThreadHandler({
        user_uuid: userReducer.results.user.uuid,
        access_token: emailIntegrationReducer.access_token,
        thread_id: e.detail.starredThreads[0].id,
        star: e.detail.starredThreads[0].starred,
        unstar: !e.detail.starredThreads[0].starred,
      });
    });
    emailRef.current.addEventListener('refreshClicked', (e) => {});
    emailRef.current.addEventListener('onSelectOneClicked', (e) => {});
    emailRef.current.addEventListener('onSelectAllClicked', (e) => {});
    emailRef.current.addEventListener('returnToMailbox', (e) => {});
  }, [
    UpdateThreadHandler,
    emailIntegrationReducer,
    filterValue,
    threadsList,
    userReducer,
  ]);

  useEffect(() => {
    if (candidate_uuid) getCandidateEmailsList();
    else getExternalMailboxThreadsHandler();
  }, [
    getCandidateEmailsList,
    candidate_uuid,
    filter,
    getExternalMailboxThreadsHandler,
  ]);

  const MINUTE_MS = 600000;

  useEffect(() => {
    if (scope === 'external') {
      const interval = setInterval(() => {
        getExternalMailboxThreadsHandler();
      }, MINUTE_MS);

      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getErrors = useCallback(async () => {
    const result = await getErrorByName(schema, advancedFilters);
    setErrors(result);
    if (Object.keys(result).length) return result;
    return null;
  }, [advancedFilters]);

  const resetAdvancedFilter = useCallback(() => {
    setAdvancedFilers(advFiltersRef.current);
  }, []);

  useEffect(() => {
    getErrors();
  }, [advancedFilters, getErrors]);

  useEffect(() => {
    console.log(prevCallback)
  }, [prevCallback]);
  return (
    <>
      {!expandedEmail && (
        <div className="mb-2">
          <div className="email-header-actions">
            <div>
              <ButtonBase
                className="btns-icon theme-transparent mr-1-reversed c-primary"
                onClick={() => setShowFilter((item) => !item)}
              >
                <div>
                  <span className={SystemActionsEnum.filter.icon} />
                </div>
              </ButtonBase>
              {/* {(!filterValue) && (
                <ButtonBase
                  className="btns-icon theme-transparent mr-1-reversed c-primary"
                  onClick={syncCandidateMailbox}
                  disabled={!emailIntegrationReducer || emailIntegrationReducer.sync_state === 'stopped'}
                >
                  <div>
                    <span className={SystemActionsEnum.sync.icon} />
                  </div>
                </ButtonBase>
              )} */}
              <ButtonBase
                className="btns-icon theme-transparent mr-1-reversed c-primary"
                onClick={() => resetFilter()}
              >
                <div>
                  <span className={SystemActionsEnum.refresh.icon} />
                </div>
              </ButtonBase>
            </div>
            <div>
              <div className="d-flex">
                <ButtonBase
                  className="btns-icon theme-transparent mr-1-reversed c-primary"
                  onClick={() => {
                    changeFilter('offset', selectedPage === 1 ? null :prevCallback);
                    setSelectedPage(selectedPage - 1);
                  }}
                  disabled={selectedPage === 1}
                >
                  <div>
                    <span className={SystemActionsEnum.leftAngle.icon} />
                  </div>
                </ButtonBase>
                <ButtonBase className="btns-icon mr-1-reversed theme-transparent">
                  <div>
                    <span>{selectedPage}</span>
                  </div>
                </ButtonBase>
                <ButtonBase
                  className="btns-icon theme-transparent mr-1-reversed c-primary"
                  onClick={async () => {
                    try {
                      setPrevCallback(threadsList.next_cursor);
                      await changeFilter('offset', threadsList.next_cursor);
                      setSelectedPage(prevPage => prevPage + 1);
                    } catch (error) {
                      console.error("Error during pagination:", error);
                    }
                  }}
                  disabled={threadsList?.length < 10}
                >
                  <div>
                    <span className={SystemActionsEnum.rightAngle.icon} />
                  </div>
                </ButtonBase>
                <ButtonBase
                  className="btns theme-solid mb-2"
                  onClick={() => openComposer()}
                  disabled={
                    !emailIntegrationReducer
                    || emailIntegrationReducer.sync_state === 'stopped'
                    || emailIntegrationReducer?.sync_state?.includes('invalid')
                    || emailIntegrationReducer?.billing_state === 'cancelled'
                  }
                >
                  <div>
                    <span className={`${SystemActionsEnum.edit.icon} mr-1`} />
                    {t(`${translationPath}compose`)}
                  </div>
                </ButtonBase>
              </div>
            </div>
          </div>
          {showFilter && (
            <div className="emails-filters-section">
              {!filterValue && (
                <RadiosComponent
                  idRef="filter"
                  valueInput="value"
                  labelInput="key"
                  themeClass="theme-line"
                  value={filter.query}
                  data={[
                    {
                      key: 'both',
                      value: '0',
                    },
                    {
                      key: 'to_candidate',
                      value: '1',
                    },
                    {
                      key: 'to_others',
                      value: '2',
                    },
                  ]}
                  onSelectedRadioChanged={(e, value) => changeFilter('query', value)}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  translationPathForData={translationPath}
                />
              )}
              {filterValue && (
                <div>
                  <ButtonBase
                    className="btns-icon theme-transparent mr-1-reversed c-primary"
                    onClick={() => {
                      resetAdvancedFilter();
                      resetFilter();
                    }}
                  >
                    <span className="end-adornment-wrapper">
                      <span className="fas fa-trash" />
                    </span>
                  </ButtonBase>
                  <ButtonBase
                    className="btns-icon theme-transparent mr-1-reversed c-primary"
                    onClick={() => setShowAdvancedSearch((item) => !item)}
                  >
                    <span className="end-adornment-wrapper">
                      <span className="fas fa-sliders-h" />
                    </span>
                  </ButtonBase>
                  <span>{t(`${translationPath}advanced-filters`)}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {loading && <Loader width="730px" height="49vh" speed={1} color="primary" />}
      <div style={{ display: expandedEmail || loading ? 'none' : 'block' }}>
        <div className={'mail-box-container'}>
          <div className={'email-container'}>
            {threadsList?.threads?.length > 0 ? (
              threadsList.threads.map((thread, i) => (
                <div key={i}>
                  <div className={`email-row condensed show_star ${thread.unread ? "unread" : "read"}`}>
                    <div className="from-star">
                      <div className="starred">
                        <ButtonBase
                          id="thread-star-"
                          className={thread.starred ? 'starred' : ''}
                          value=""
                          role="switch"
                          aria-checked={thread.starred}
                          onClick={() => setStarred(thread)}
                          aria-label="Star button for thread "
                        ></ButtonBase>
                      </div>
                      <div className="from-message-count">
                        <div className="default-avatar">
                          {thread?.participants?.length > 0 ? (
                            (() => {
                              const filteredParticipants
                                = thread.participants.filter(
                                  (participant) =>
                                    participant.email
                                    !== emailIntegrationReducer.email,
                                );
                              const lastParticipant
                                = filteredParticipants[
                                  filteredParticipants.length - 1
                                ]; // Safely access the last participant

                              if (lastParticipant)
                                return lastParticipant.name ? ( // Check if the name exists and is not empty
                                  <div className="default-avatar">
                                    {lastParticipant.name[0]
                                      || lastParticipant.email[0]}
                                    {/* Show first letter or fallback */}
                                  </div>
                                ) : (
                                  <p>Participant has no name</p>
                                );
                              else return <p>No participants available</p>;
                            })()
                          ) : (
                            <p>No participants available</p>
                          )}
                        </div>
                        <div className="from-participants">
                          <div className="participants-name">
                            {thread?.participants?.length > 0 ? (
                              (() => {
                                const filteredParticipants
                                  = thread.participants.filter(
                                    (participant) =>
                                      participant.email
                                      !== emailIntegrationReducer.email,
                                  );
                                const lastParticipant = filteredParticipants.at(-1); // Get the last participant
                                return lastParticipant ? (
                                  <span>{lastParticipant.name}</span>
                                ) : (
                                  <p>No participants available</p>
                                );
                              })()
                            ) : (
                              <p>No participants available</p>
                            )}
                          </div>
                          <div className="participants-count">
                            {thread?.participants?.length}
                          </div>
                        </div>
                        <span className="thread-message-count"></span>
                      </div>
                    </div>
                    <ButtonBase
                      className="subject-snippet-date"
                      onClick={() => {
                        setUnread(thread)

                      }}
                    >
                      <div className="snippet-attachment-container">
                        <div className="desktop-subject-snippet">
                          <span className="subject">{thread?.subject}</span>
                          <span className="snippet">{thread?.snippet}</span>
                        </div>
                      </div>
                      <div className="date">
                        <span>
                          {moment
                            .unix(thread?.latest_message_received_date)
                            .format('HH:mm A')}
                        </span>
                      </div>
                    </ButtonBase>
                    <ButtonBase
                      className="mobile-subject-snippet"
                      onClick={() => {
                        setExpandedEmail(thread);
                      }}
                    >
                      <span className="subject">{thread?.subject}</span>
                      <span className="snippet">{thread?.snippet}</span>
                    </ButtonBase>
                  </div>
                </div>
              ))
            ) : (
              <p>No threads available</p>
            )}
          </div>
        </div>
        {/*<nylas-mailbox*/}
        {/*  show_star={scope === 'external'}*/}
        {/*  show_reply*/}
        {/*  show_reply_all*/}
        {/*  show_forward*/}
        {/*  ref={emailRef}*/}
        {/*  show_thread_checkbox={false}*/}
        {/*  items_per_page={10}*/}
        {/*  keyword_to_search={false}*/}
        {/*/>*/}
      </div>
      {expandedEmail && !loading && (
        <Email
          threadData={expandedEmail}
          setThreadData={setExpandedEmail}
          backHandler={() => {
            setExpandedEmail(null);
            resetFilter();
          }}
          candidate_uuid={candidate_uuid}
          scope={scope}
          job_uuid={job_uuid}
          showMainReply={showMainReply}
          setShowMainReply={setShowMainReply}
        />
      )}
      <DialogComponent
        titleText="advanced-filters"
        dialogContent={
          <div className="d-flex-column-center">
            <SharedInputControl
              isFullWidth
              editValue={advancedFilters.any_email || ''}
              onValueChanged={(newValue) =>
                setAdvancedFilers((items) => ({
                  ...items,
                  any_email: newValue.value,
                }))
              }
              title={t(`${translationPath}by-email`)}
              stateKey="any_email"
              idRef="any_email"
              themeClass="theme-solid"
              errors={errors}
              errorPath="any_email"
            />
            <SharedInputControl
              isFullWidth
              editValue={advancedFilters.from || ''}
              onValueChanged={(newValue) =>
                setAdvancedFilers((items) => ({ ...items, from: newValue.value }))
              }
              title={t(`${translationPath}from`)}
              stateKey="from"
              idRef="from"
              themeClass="theme-solid"
            />
            <SharedInputControl
              isFullWidth
              editValue={advancedFilters.to || ''}
              onValueChanged={(newValue) =>
                setAdvancedFilers((items) => ({ ...items, to: newValue.value }))
              }
              title={t(`${translationPath}to`)}
              stateKey="to"
              idRef="to"
              themeClass="theme-solid"
            />
            <SharedInputControl
              isFullWidth
              editValue={advancedFilters.cc || ''}
              onValueChanged={(newValue) =>
                setAdvancedFilers((items) => ({ ...items, cc: newValue.value }))
              }
              title={t(`${translationPath}cc`)}
              stateKey="cc"
              idRef="cc"
              themeClass="theme-solid"
              errors={errors}
              errorPath="cc"
            />
            <SharedInputControl
              isFullWidth
              editValue={advancedFilters.subject || ''}
              onValueChanged={(newValue) =>
                setAdvancedFilers((items) => ({ ...items, subject: newValue.value }))
              }
              title={t(`${translationPath}subject`)}
              stateKey="subject"
              idRef="subject"
              themeClass="theme-solid"
            />
            {/* <SharedInputControl
              isFullWidth
              editValue={advancedFilters.not_in || ''}
              onValueChanged={(newValue) => setAdvancedFilers((items) => ({ ...items, not_in: newValue.value }))}
              title={t(`${translationPath}not-in`)}
              stateKey="not_in"
              idRef="not_in"
              themeClass="theme-solid"
            /> */}
          </div>
        }
        isOpen={showAdvancedSearch}
        onSubmit={async (e) => {
          e.preventDefault();
          const errorsObj = await getErrors();
          if (!errorsObj) {
            setFilter((items) => ({ ...items, ...advancedFilters }));
            setShowAdvancedSearch(false);
          }
        }}
        // isSaving={isLoading}
        onCloseClicked={() => setShowAdvancedSearch(false)}
        onCancelClicked={() => setShowAdvancedSearch(false)}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        saveIsDisabled={
          Object.values(advancedFilters).filter((item) => item).length === 0
        }
      />
    </>
  );
};

export default EmailThread;
