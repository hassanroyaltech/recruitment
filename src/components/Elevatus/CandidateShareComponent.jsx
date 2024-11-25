/**
 * -----------------------------------------------------------------------------------
 * @title CandidateShareComponent.jsx
 * @author Manaf Hijazi
 * -----------------------------------------------------------------------------------
 * This module contains the CandidateShareComponent component which we use in the EVA-REC.
 * -----------------------------------------------------------------------------------
 */
import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';
import Autocomplete from '@mui/material/Autocomplete';
import { useParams } from 'react-router-dom';
import { Button, Divider } from '@mui/material';
import { useToasts } from 'react-toast-notifications';
import { useTranslation } from 'react-i18next';
import { evarecAPI } from '../../api/evarec';
import urls from '../../api/urls';
import { GlobalDisplayDateTimeFormat, showError } from '../../helpers';
import { GetAllEvaRecPipelineTeams, GetAllCandidateFeedback } from '../../services';
import ButtonBase from '@mui/material/ButtonBase';
import { LoaderComponent } from '../Loader/Loader.Component';
import moment from 'moment/moment';
import { CandidateFeedbackStatusesEnum } from '../../enums';
import { VitallyTrack } from '../../utils/Vitally';

const translationPath = '';
const parentTranslationPath = 'EvarecCandidateModel';

export const CandidateShareComponent = ({
  type,
  jobCandidate,
  candidate_uuid,
  job_uuid,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  const defaultState = {
    recruiters_emails: [],
    job_candidates: [],
    job_uuid: '',
    message: '',
  };
  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return { ...action.value };
  }, []);
  const [state, setState] = useReducer(reducer, defaultState);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState([]);
  const [ExitingEmails, setExitingEmails] = useState([]);
  const [options, setOptions] = useState([]);
  const [filter, setFilter] = useState({});
  const [reload, setReload] = useState({});
  const { addToast } = useToasts(); // Toasts
  const { id } = useParams();
  const [feedbackList, setFeedbackList] = useState({
    results: [],
    totalCount: 0,
    lastPage: 1,
  });
  const [feedbackListFilter, setFeedbackListFilter] = useState({
    page: 1,
    limit: 5,
  });

  useEffect(() => {
    setState({ id: 'job_candidates', value: [jobCandidate] });
    setState({ id: 'job_uuid', value: id });
  }, [id, jobCandidate]);

  const getInvitedMembers = useCallback(async () => {
    const url
      = type === 'ats'
        ? urls.evarec.ats.GET_INVITED_TEAM
        : `${urls.evassess.InvitedRecruiters}`;
    evarecAPI
      .getInvitedTeamsOnJob(url, id, [jobCandidate], null, type)
      .then((response) => {
        if (response.data.statusCode === 200) {
          const members = response.data.results.map((team) => ({
            label: team?.name ? team?.name : team,
            value: team?.uuid,
          }));
          setEmails(members);
          setExitingEmails(members);
        }
      });
  }, [id, jobCandidate, type]);

  const getData = useCallback(async () => {
    setLoading(true);
    const response = await GetAllEvaRecPipelineTeams({});
    setLoading(false);
    if (response && response.status === 200) setTeamMembers(response.data.results);
    else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [t]);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    getInvitedMembers();
  }, [getInvitedMembers, filter]);

  /**
   * Share handler
   * @returns {Promise<void>}
   */
  const onShareHandler = async () => {
    setLoading(true);
    const ExitingEmailsuser = ExitingEmails.map((index) => index.value);
    evarecAPI
      .shareATSProfile({
        ...state,
        recruiters_emails: state.recruiters_emails.filter(
          (item) => !ExitingEmailsuser.includes(item),
        ),
      })
      .then(() => {
        VitallyTrack('EVA-REC - Share Candidate');
        window?.ChurnZero?.push([
          'trackEvent',
          'EVA-REC - Share candidate profile',
          'Share candidate profile from EVA-REC',
          1,
          {},
        ]);
        setLoading(false);
        setFilter((prev) => ({ ...prev }));
        setState({ id: 'message', value: '' });
        addToast(t(`${translationPath}candidate-profile-shared-successfully`), {
          appearance: 'success',
          autoDismiss: true,
        });
        setReload((prev) => ({ ...prev }));
      })
      .catch((error) => {
        setLoading(false);

        showError(t(`${translationPath}candidate-profile-share-failed`), error);
      });
  };

  const GetFeedbackListHandler = useCallback(async () => {
    setLoading(true);
    let response = await GetAllCandidateFeedback({
      candidate_uuid,
      job_uuid,
      page: feedbackListFilter.page,
      limit: feedbackListFilter.limit,
    });
    setLoading(false);
    if (response?.status === 202)
      setFeedbackList({
        results: response.data.results,
        totalCount: response.data.paginate.total || 0,
        lastPage: response.data.paginate.lastPage || 1,
      });
    else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [job_uuid, candidate_uuid, feedbackListFilter, t]);

  const CandidateFeedbackStatuses = useMemo(
    () =>
      Object.values(CandidateFeedbackStatusesEnum).reduce((a, v) => {
        a[v.value] = v.label;
        return a;
      }, {}),
    [],
  );

  useEffect(() => {
    if (emails) {
      const ids = emails.map((email) => email.value);
      const filteredMembers = teamMembers.filter(
        (member) => !ids.includes(member.value),
      );
      setOptions(filteredMembers);
    }
  }, [emails, teamMembers]);

  useEffect(() => {
    GetFeedbackListHandler().catch(() =>
      showError(t('Shared:failed-to-get-saved-data')),
    );
  }, [t, GetFeedbackListHandler, feedbackListFilter, reload]);

  return (
    <div className="candidate-share-component-wrapper">
      <div className="candidate-share-content">
        <div className="candidate-share-title">
          {t(`${translationPath}share-candidate`)}
        </div>
        <div className="candidate-share-body">
          <div className="team-member-wrapper">
            <div className="team-member-title">
              {t(`${translationPath}team-members`)}
            </div>
            <div className="team-member-content">
              <div className="team-member-field">
                <Autocomplete
                  multiple
                  options={options}
                  getOptionDisabled={(option) => option.isDisabled}
                  value={emails}
                  filterSelectedOptions
                  getOptionLabel={(option) => option.label}
                  onChange={(e, newValue) => {
                    setState({
                      id: 'recruiters_emails',
                      value: newValue.map((item) => item.value),
                    });
                    setEmails(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      {...params}
                      variant="outlined"
                      label={t(`${translationPath}add-team-members`)}
                    />
                  )}
                />
              </div>
              {/* <div className="team-member-button">
                <Button>
                  <i className="fas fa-plus" />
                </Button>
              </div> */}
            </div>
          </div>
          <div className="message-wrapper">
            <div className="message-title">{t(`${translationPath}message`)}</div>
            <div className="message-field">
              <TextField
                fullWidth
                multiline
                variant="outlined"
                value={state.message}
                label={t(`${translationPath}type-your-message-here`)}
                onChange={(e) => {
                  const {
                    target: { value },
                  } = e;
                  setState({ id: 'message', value });
                }}
              />
            </div>
          </div>
          <div
            className={`send-button-wrapper ${
              loading
              || !state.message
              || (state.recruiters_emails.length === 0 && emails.length === 0)
                ? 'is-disabled'
                : ''
            }`}
          >
            <Button
              onClick={onShareHandler}
              disabled={
                loading
                || !state.message
                || (state.recruiters_emails.length === 0 && emails.length === 0)
              }
            >
              {t(`${translationPath}send`)}
              {loading && (
                <span className="pl-2 text-white text-sm">
                  <i className="fas fa-circle-notch fa-spin" />
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
      {/*  Feedback */}
      {loading && (
        <LoaderComponent
          isLoading={loading}
          isSkeleton
          wrapperClasses="my-4"
          skeletonItems={[
            {
              variant: 'rectangular',
              style: { minHeight: 30, marginTop: 5, marginBotton: 5 },
            },
          ]}
          numberOfRepeat={6}
        />
      )}
      {feedbackList.results.length > 0 && !loading && (
        <div className="mt-4">
          <div className="d-flex-v-center-h-between mb-3">
            <div className="fw-bold fz-18px">
              {t(`${translationPath}feedback-list`)}
            </div>
            <div>
              <ButtonBase
                className="btns btns-icon theme-transparent mx-2"
                onClick={() => {
                  setFeedbackListFilter((prev) => ({
                    ...prev,
                    page: prev.page - 1,
                  }));
                }}
                disabled={feedbackListFilter.page === 1}
              >
                <span className="fas fa-chevron-left mx-2" />
              </ButtonBase>
              <ButtonBase
                className="btns btns-icon theme-transparent mx-2"
                onClick={() => {
                  setFeedbackListFilter((prev) => ({
                    ...prev,
                    page: prev.page + 1,
                  }));
                }}
                disabled={feedbackListFilter.page === feedbackList.lastPage}
              >
                <span className="fas fa-chevron-right" />
              </ButtonBase>
            </div>
          </div>
          <div>
            {feedbackList.results.map((item) => (
              <React.Fragment key={item.feedback_by_user.uuid}>
                <div className="d-flex-column bg-white py-3 px-4 mb-3">
                  <div className="d-flex-column my-2">
                    <div className="mb-2">
                      <span className="fw-bold">{t(`${translationPath}name`)}</span>
                      <span className="mx-1">:</span>
                      <span>{item.feedback_by_user.name}</span>
                    </div>
                    <div className="mb-2">
                      <span className="fw-bold">{t(`${translationPath}email`)}</span>
                      <span className="mx-1">:</span>
                      <span>{item.feedback_by_user.email}</span>
                    </div>
                    {typeof item.recommended === 'boolean' && (
                      <div className="mb-2">
                        <span className="fw-bold">
                          {t(`${translationPath}recommendation`)}
                        </span>
                        <span className="mx-1">:</span>
                        <span>
                          {item.recommended
                            ? t(`${translationPath}recommended`)
                            : t(`${translationPath}not-recommended`)}
                        </span>
                      </div>
                    )}
                    {item.feedback && (
                      <div className="mb-2">
                        <span className="fw-bold">
                          {t(`${translationPath}feedback`)}
                        </span>
                        <span className="mx-1">:</span>
                        <span>{item.feedback}</span>
                      </div>
                    )}
                    <div className="mb-2">
                      <span className="fw-bold">
                        {t(`${translationPath}created-at`)}
                      </span>
                      <span className="mx-1">:</span>
                      <span>
                        {moment(item.created_at).format(GlobalDisplayDateTimeFormat)}
                      </span>
                    </div>
                    {CandidateFeedbackStatusesEnum.PENDING.value !== item.status && (
                      <div className="mb-2">
                        <span className="fw-bold">
                          {t(`${translationPath}updated-at`)}
                        </span>
                        <span className="mx-1">:</span>
                        <span>
                          {moment(item.updated_at).format(
                            GlobalDisplayDateTimeFormat,
                          )}
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="fw-bold">
                        {t(`${translationPath}status`)}
                      </span>
                      <span className="mx-1">:</span>
                      <span>
                        {t(
                          `${translationPath}${
                            CandidateFeedbackStatuses?.[item.status]
                          }`,
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="my-3 full-width">
                  <Divider />
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

CandidateShareComponent.propTypes = {
  type: PropTypes.string.isRequired,
  jobCandidate: PropTypes.string.isRequired,
  candidate_uuid: PropTypes.string,
  job_uuid: PropTypes.string,
};

export default CandidateShareComponent;
