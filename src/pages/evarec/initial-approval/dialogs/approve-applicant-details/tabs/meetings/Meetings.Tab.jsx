import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {
  getIsAllowedPermissionV2,
  getIsAllowedSubscription,
  showError,
  showSuccess,
} from '../../../../../../../helpers';
import {
  MsTeamsMeetingProvidersEnum,
  SubscriptionServicesEnum,
} from '../../../../../../../enums';
import { commonAPI } from '../../../../../../../api/common';
import MeetingType from '../../../../../../../components/Views/ScheduleMeeting/MeetingType';
import MeetingDetails from '../../../../../../../components/Views/ScheduleMeeting/MeetingDetails';
import NoPermissionComponent from '../../../../../../../shared/NoPermissionComponent/NoPermissionComponent';
import { evameetAPI } from '../../../../../../../api/evameet';
import { ManageApplicationsPermissions } from '../../../../../../../permissions';
import { MSTeamsScheduleInterview } from '../../../../../../../services';
import { VitallyTrack } from '../../../../../../../utils/Vitally';

export const MeetingsTab = ({
  job_candidate_uuid,
  candidate,
  type,
  from_feature,
  job_uuid,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [state, setState] = useState({});
  const [disableSendButton, setDisableSendButton] = useState(false);
  const [send, setSend] = useState(false);
  const [provider, setProvider] = useState();
  const [isExpanded, setIsExpanded] = useState(false);
  const [timezones, setTimezones] = useState();
  const { id } = useParams();
  const subscriptions = useSelector(
    (reducerState) => reducerState?.userSubscriptionsReducer?.subscriptions,
  );
  const userReducer = useSelector((state) => state.userReducer);
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const [popperOpen, setPopperOpen] = useState(false);
  // timezones for Modal
  useEffect(() => {
    /**
     * Returns the timezones
     * @returns {Promise<void>}
     */
    const getTimezones = () => {
      commonAPI
        .getTimeZones()
        .then((res) => {
          setTimezones(res.data.results);
        })
        .catch((error) => {
          showError(t('Shared:failed-to-get-saved-data'), error);
        });
    };
    getTimezones();
  }, [t]);

  const getCandidateList = useMemo(
    () => () => candidate && [candidate],
    [candidate],
  );

  /**
   * Function to transform Interview data and send it to API
   * @note interviewData has two structure
   * [Schedule meeting From overview] => doesn't accept relation,
   *  relation_uuid, relation_candidate_uuid
   * [Schedule meeting EVA-REC || eva-ssess] => accept relation,
   *  relation_uuid, relation_candidate_uuid
   */
  const handleSend = () => {
    setDisableSendButton(true);
    const language = JSON.parse(
      localStorage.getItem('user'),
    ).results.language.filter((lang) => lang.code === 'en');
    // Edit Meeting Data
    const interviewData = {
      title: state?.title ? state?.title : null,
      interview_date:
        state?.date
        && (moment(state?.date).locale('en').format('YYYY-MM-DD')
          || moment(Date.now()).locale('en').format('YYYY-MM-DD')),
      from_time: state?.from_time ? `${state?.from_time}:00` : null,
      to_time: state?.to_time ? `${state?.to_time}:00` : null,
      timezone: state?.timezone || null,
      color: state?.radios ? state?.radios : 'bg-success',
      interview_link: state?.interview_link ? state?.interview_link : null,
      location: state?.location ? state?.location : null,
      provider,
      from_feature,
      description: state?.description ? state?.description : null,
      is_send_email:
        (provider !== 'other'
          && (send?.send || (typeof send === 'boolean' && send) || false))
        || false,
      online_link: state?.link ? state?.link : null,
      language_id: language[0]?.id,
      candidates: state?.candidates ? state?.candidates?.map((a) => a) : [],
      relation: type,
      relation_uuid: id || job_uuid,
      relation_candidate_uuid: job_candidate_uuid,
      items: state?.candidates.map((item) => ({
        recruiters: state?.recruiters ? state?.recruiters?.map((a) => a.uuid) : [],
        candidates: (item && [item]) || [],
      })),
    };
    (Object.keys(MsTeamsMeetingProvidersEnum).includes(provider)
      ? MSTeamsScheduleInterview({
        body: interviewData,
        user_uuid: userReducer?.results?.user?.uuid,
      })
      : evameetAPI.scheduleInterview(interviewData)
    )
      .then((res) => {
        if (res?.status === 422) {
          showError(t(`${translationPath}scheduling-interview-failed`), res);
          setDisableSendButton(false);
          return;
        }
        VitallyTrack(
          `Schedule Interview (${provider === 'other' ? 'offline' : provider})`,
        );
        window?.ChurnZero?.push([
          'trackEvent',
          `Schedule meeting (${provider === 'other' ? 'offline' : provider})`,
          'Schedule meeting',
          1,
          {},
        ]);

        showSuccess(t(`${translationPath}interview-scheduled-successfully`));
        setIsExpanded(false);
        setState({});
        setProvider('');
        setDisableSendButton(false);
      })
      .catch((error) => {
        showError(t(`${translationPath}scheduling-interview-failed`), error);

        setDisableSendButton(false);
      });
  };

  const handleSave = () => {};

  const onPopperOpen = (event) => {
    if (
      !getIsAllowedSubscription({
        serviceKey: SubscriptionServicesEnum.EvaRec.key,
        subscriptions,
      })
    ) {
      setAnchorEl(event.currentTarget);
      setPopperOpen(true);
    }
  };

  useEffect(() => {
    if (candidate?.basic_information)
      setState((items) => ({
        ...items,
        candidates: [
          {
            email: candidate?.basic_information?.email,
            first_name: candidate?.basic_information?.first_name,
            last_name: candidate?.basic_information?.last_name,
          },
        ],
      }));
  }, [candidate]);

  return (
    <>
      <div className="candidate-assessment-tab-wrapper questionnaires-tab-wrapper">
        <div className="meeting-assessment-tab-content">
          <Accordion expanded={isExpanded} onMouseEnter={onPopperOpen}>
            <AccordionSummary
              expandIcon={<AddIcon />}
              onClick={() => setIsExpanded(!isExpanded)}
              disabled={
                !getIsAllowedPermissionV2({
                  permissions,
                  permissionId: ManageApplicationsPermissions.ScheduleMeeting.key,
                })
              }
            >
              {t(`${translationPath}schedule-a-meeting`)}
            </AccordionSummary>
            <AccordionDetails>
              <div className="meeting-tab-add-wrapper">
                <MeetingType
                  noModal
                  type={type}
                  state={state}
                  setState={setState}
                  setProvider={setProvider}
                />
                {provider && (
                  <MeetingDetails
                    noBack
                    type={provider}
                    state={state}
                    setState={setState}
                    setSend={setSend}
                    onSave={handleSave}
                    onSend={handleSend}
                    onBack={() => {}}
                    timezones={timezones}
                    applicantsList={getCandidateList()}
                    date={state.date}
                    disableSendButton={disableSendButton}
                  />
                )}
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
        {/* <div className="candidate-assessment-exam-item-wrapper">Content</div> */}
      </div>

      <NoPermissionComponent
        anchorEl={anchorEl}
        popperOpen={popperOpen}
        setAnchorEl={setAnchorEl}
        setPopperOpen={setPopperOpen}
      />
    </>
  );
};

MeetingsTab.propTypes = {
  type: PropTypes.string.isRequired,
  from_feature: PropTypes.string,
  job_candidate_uuid: PropTypes.string.isRequired,
  job_uuid: PropTypes.string.isRequired,
  candidate: PropTypes.instanceOf(Object),
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
};

MeetingsTab.defaultProps = {
  candidate: undefined,
  parentTranslationPath: 'EvarecCandidateModel',
  translationPath: '',
};
