/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { evameetAPI } from 'api/evameet';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useToasts } from 'react-toast-notifications';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import MeetingType from '../Views/ScheduleMeeting/MeetingType';
import MeetingDetails from '../Views/ScheduleMeeting/MeetingDetails';
import { commonAPI } from '../../api/common';
import {
  getIsAllowedPermissionV2,
  getIsAllowedSubscription,
  showError,
} from '../../helpers';
import {
  MsTeamsMeetingProvidersEnum,
  PipelineBulkSelectTypesEnum,
  SubscriptionServicesEnum,
} from '../../enums';
import NoPermissionComponent from '../../shared/NoPermissionComponent/NoPermissionComponent';
import { RMSPermissions } from '../../permissions';
import { InterviewDetailsComponent } from './InterviewDetails/InterviewDetails.Component';
import { MSTeamsScheduleInterview } from '../../services';
import { VitallyTrack } from '../../utils/Vitally';

const translationPath = '';
const parentTranslationPath = 'EvarecCandidateModel';

export const CandidateMeetingsComponent = ({
  type,
  from_feature,
  activeJobPipelineUUID,
  selectedConfirmedStages,
  totalSelectedCandidates,
  candidateList,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const { addToast } = useToasts();
  const [state, setState] = useState({
    candidates: [
      {
        first_name: '',
        last_name: '',
        email: '',
      },
    ],
  });
  const [disableSendButton, setDisableSendButton] = useState(false);
  const [send, setSend] = useState(false);
  const [provider, setProvider] = useState();
  const [isExpanded, setIsExpanded] = useState(false);
  const [timezones, setTimezones] = useState();
  const { id } = useParams();
  const userReducer = useSelector((state) => state.userReducer);

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
    let interviewData = {
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
      is_send_email: provider === 'other' ? true : send ? send?.send : false,
      online_link: state?.link ? state?.link : null,
      language_id: language[0]?.id,
      relation: type,
      relation_uuid: id,
      relation_candidate_uuid:
        candidateList?.[0]
        && (candidateList[0].candidate?.uuid || candidateList[0].uuid),
      pipeline_uuid: activeJobPipelineUUID,
      items: [
        ...(state.candidates
          ?.filter(
            (item) =>
              !selectedConfirmedStages
              || selectedConfirmedStages.length === 0
              || !item.stage_uuid
              || !selectedConfirmedStages.includes(item.stage_uuid),
          )
          ?.map((item) => ({
            recruiters: state?.recruiters
              ? state?.recruiters?.map((a) => a.uuid)
              : [],
            candidates: (item && [item]) || [],
          })) || []),
        ...((selectedConfirmedStages
          && selectedConfirmedStages.length > 0
          && selectedConfirmedStages.map((item) => ({
            recruiters: state?.recruiters
              ? state?.recruiters?.map((a) => a.uuid)
              : [],
            candidates: [
              { type: PipelineBulkSelectTypesEnum.Stage.key, uuid: item },
            ],
          })))
          || []),
      ],
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

        addToast(t(`${translationPath}interview-scheduled-successfully`), {
          appearance: 'success',
          autoDismissTimeout: 7000,
          autoDismiss: true,
        });
        setIsExpanded(false);
        setState({});
        setProvider();
        setDisableSendButton(false);
      })
      .catch((error) => {
        showError(t(`${translationPath}scheduling-interview-failed`), error);

        setDisableSendButton(false);
      });
  };

  const handleSave = () => {};

  const subscriptions = useSelector(
    (reducerState) => reducerState?.userSubscriptionsReducer?.subscriptions,
  );
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const [popperOpen, setPopperOpen] = useState(false);

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
                  permissionId: RMSPermissions.ScheduleAMeeting.key,
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
                    date={state.date}
                    selectedConfirmedStages={selectedConfirmedStages}
                    totalSelectedCandidates={totalSelectedCandidates}
                    disableSendButton={disableSendButton}
                    applicantsList={candidateList}
                  />
                )}
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
        {candidateList.length === 1 && (
          <div className="interviews-wrapper mb-3">
            <Accordion>
              <AccordionSummary>
                {t(`${translationPath}interviews`)}
              </AccordionSummary>
              <AccordionDetails>
                <div className="meeting-tab-list-interviews-wrapper">
                  <InterviewDetailsComponent
                    candidate_uuid={candidateList[0]?.identity?.uuid}
                  />
                </div>
              </AccordionDetails>
            </Accordion>
          </div>
        )}
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

CandidateMeetingsComponent.propTypes = {
  type: PropTypes.string.isRequired,
  from_feature: PropTypes.string,
  activeJobPipelineUUID: PropTypes.string,
  selectedConfirmedStages: PropTypes.arrayOf(PropTypes.string),
  totalSelectedCandidates: PropTypes.number,
  candidateList: PropTypes.arrayOf(
    PropTypes.shape({
      candidate: PropTypes.shape({ uuid: PropTypes.string }),
      uuid: PropTypes.string,
    }),
  ),
};

export default CandidateMeetingsComponent;
