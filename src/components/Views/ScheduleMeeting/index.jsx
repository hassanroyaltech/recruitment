/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Modal, ModalBody } from 'reactstrap';
// import Moment to format date and time
import moment from 'moment';

// import evarec API
import { evameetAPI } from '../../../api/evameet';
import { commonAPI } from '../../../api/common';

// import toast noticication
import { useToasts } from 'react-toast-notifications';
import { useTranslation } from 'react-i18next';
import MeetingDetails from './MeetingDetails';
import MeetingType from './MeetingType';
import { showError } from '../../../helpers';
import { MsTeamsMeetingProvidersEnum } from '../../../enums';
import {
  MSTeamsScheduleInterview,
  MSTeamsUpdateInterview,
  MSTeamsViewScheduleInterview,
} from '../../../services';
import { useSelector } from 'react-redux';
import useVitally from '../../../hooks/useVitally.Hook';
import { VitallyTrack } from '../../../utils/Vitally';

const translationPath = 'ScheduleMeetingComponent.';
const ScheduleMeeting = (props) => {
  const { t } = useTranslation(props.parentTranslationPath || 'EvaSSESSPipeline');
  // Toast to display alert messages for the user
  const { addToast } = useToasts();
  const [step, setStep] = useState(1);
  const userReducer = useSelector((state) => state.userReducer);
  const { VitallyTrack } = useVitally();
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
  const [timezones, setTimezones] = useState();
  const [applicantsList] = useState(
    (props.candidate_email
      && props.candidate?.title && [
      {
        candidate: {
          uuid: props.selectedCandidates,
          name: props.candidate?.title,
          email: props.candidate_email,
        },
      },
    ])
      || [],
  );

  const handleContinue = (type) => {
    if (type) {
      setProvider(type);
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

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
        .catch((err) => {
          showError(t('Shared:failed-to-get-saved-data'), err);
        });
    };
    getTimezones();
  }, [t]);
  /**
   * Effect to handle view meeting in Edit Action,
   * setStep(2) => to hide meeting type dialog
   */
  useEffect(() => {
    if (props.uuid) {
      setStep(2);
      (props?.isPython
        ? MSTeamsViewScheduleInterview(userReducer?.results?.user?.uuid, props.uuid)
        : evameetAPI.viewScheduleInterview(props.uuid)
      )
        .then((res) => {
          setProvider(res.data.results.provider);
          setState({
            title: res?.data?.results?.title,
            date: res?.data?.results?.interview_Date,
            from_time: res?.data?.results?.from_time.slice(0, 5),
            to_time: res?.data?.results?.to_time.slice(0, 5),
            timezone: res?.data?.results?.timezone,
            radios: res?.data?.results?.color,
            location: res?.data?.results?.location,
            interview_link: res?.data?.results?.interview_link,
            description: res?.data?.results?.description,
            recruiters: res?.data?.results?.recruiters,
            candidates: res?.data?.results?.candidates || [],
          });
        })
        .catch((error) => {
          showError(t('Shared:failed-to-get-saved-data'), error);
        });
    }
  }, [t, props.uuid, props?.isPython, userReducer?.results?.user?.uuid]);
  /**
     * Function to transform Interview data and send it to API
     * @note interviewData has two structure
     * [Schedule meeting From overview] => doesn't accept relation, relation_uuid,
     //  *  relation_candidate_uuid
     * [Schedule meeting EVA-REC || eva-ssess] => accept relation, relation_uuid,
     //  *  relation_candidate_uuid
     */
  const handleSend = () => {
    setDisableSendButton(true);
    const language = JSON.parse(
      localStorage.getItem('user'),
    ).results.language.filter((lang) => lang.code === 'en');
    let interviewData;
    // Edit Meeting Data
    if (props.uuid)
      interviewData = {
        uuid: props.uuid,
        title: state.title ? state.title : null,
        interview_date: state?.date
          ? moment(state.date).locale('en').format('YYYY-MM-DD')
          : props?.data?.date
            || moment(Date.now()).locale('en').format('YYYY-MM-DD'),
        from_time: state?.from_time ? `${state?.from_time}:00` : null,
        to_time: state?.to_time ? `${state?.to_time}:00` : null,
        timezone: state?.timezone || null,
        color: state?.radios ? state?.radios : 'bg-success',
        interview_link: state?.interview_link ? state?.interview_link : null,
        location: state?.location ? state?.location : null,
        provider: provider || null,
        from_feature: props?.from_feature || null,
        description: state?.description ? state?.description : null,
        is_send_email: provider === 'other' ? true : send ? send?.send : false,
        language_id: language?.[0]?.id,
        pipeline_uuid: props.pipeline_uuid,
        items: state.candidates.map((item) => ({
          recruiters: state?.recruiters ? state?.recruiters?.map((a) => a.uuid) : [],
          candidates: (item && [item]) || [],
        })),
      };
    else if (props.overview || props.evaMeet || props.searchDatabase || props.rms)
      interviewData = {
        title: state?.title ? state?.title : null,
        interview_date: state?.date
          ? moment(state?.date).locale('en').format('YYYY-MM-DD')
          : props?.data?.date
            || moment(Date.now()).locale('en').format('YYYY-MM-DD'),
        from_time: state?.from_time ? `${state?.from_time}:00` : null,
        to_time: state?.to_time ? `${state?.to_time}:00` : null,
        timezone: state?.timezone || null,
        color: state?.radios ? state?.radios : 'bg-success',
        interview_link: state?.interview_link ? state?.interview_link : null,
        location: state?.location ? state?.location : null,
        provider: provider || null,
        from_feature: props?.from_feature || null,
        description: state?.description ? state?.description : null,
        is_send_email: provider === 'other' ? true : send ? send?.send : false,
        language_id: language?.[0]?.id,
        items: state.candidates.map((item) => ({
          recruiters: state?.recruiters ? state?.recruiters?.map((a) => a.uuid) : [],
          candidates: (item && [item]) || [],
        })),
      };
    else
      interviewData = {
        title: state?.title ? state?.title : null,
        interview_date: state?.date
          ? moment(state?.date).locale('en').format('YYYY-MM-DD')
          : props?.data?.date
            || moment(Date.now()).locale('en').format('YYYY-MM-DD'),
        from_time: state?.from_time ? `${state?.from_time}:00` : null,
        to_time: state?.to_time ? `${state?.to_time}:00` : null,
        timezone: state?.timezone || null,
        color: state?.radios ? state?.radios : 'bg-success',
        interview_link: state?.interview_link ? state?.interview_link : null,
        location: state?.location ? state?.location : null,
        provider: provider || null,
        from_feature: props?.from_feature || null,
        description: state?.description ? state?.description : null,
        is_send_email: provider === 'other' ? true : send ? send?.send : false,
        online_link: state?.link ? state?.link : null,
        language_id: language?.[0]?.id,
        relation:
          props?.relation && props.relation === 1 ? 'ats' : 'video_assessment',
        relation_uuid: props?.relation_uuid ? props?.relation_uuid : null,
        relation_candidate_uuid: props?.selectedCandidates
          ? props?.selectedCandidates
          : null,
        pipeline_uuid: props.pipeline_uuid,
        items: state.candidates.map((item) => ({
          recruiters: state?.recruiters ? state?.recruiters?.map((a) => a.uuid) : [],
          candidates: (item && [item]) || [],
        })),
      };

    if (props.uuid)
      (Object.keys(MsTeamsMeetingProvidersEnum).includes(provider)
        ? MSTeamsUpdateInterview({
          body: interviewData,
          user_uuid: userReducer?.results?.user?.uuid,
          meeting_uuid: props.uuid,
        })
        : evameetAPI.updateScheduleInterview(interviewData)
      )
        .then(() => {
          addToast(t(`${translationPath}interview-updated-successfully`), {
            appearance: 'success',
            autoDismissTimeout: 7000,
            autoDismiss: true,
          });
          props.closeModal();
          if (props.overview) props.eventsUpdate();
          else if (props?.evaMeet) props.load();

          setDisableSendButton(false);
        })
        .catch((err) => {
          if (err?.response?.data?.errors) {
            const errs = Object.values(err?.response?.data?.errors).map((a) => a[0]);
            addToast(
              <ul>
                {errs.map((e, i) => (
                  <li key={`errorsKey${i + 1}`}>{e}</li>
                ))}
              </ul>,
              {
                appearance: 'error',
                autoDismissTimeout: 7000,
                autoDismiss: true,
              },
            );
          } else
            addToast(t(`${translationPath}interview-update-failed`), {
              appearance: 'error',
              autoDismissTimeout: 7000,
              autoDismiss: true,
            });

          setDisableSendButton(false);
        });
    // Send data to API
    else
      (Object.keys(MsTeamsMeetingProvidersEnum).includes(provider)
        ? MSTeamsScheduleInterview({
          body: interviewData,
          user_uuid: userReducer?.results?.user?.uuid,
        })
        : evameetAPI.scheduleInterview(interviewData)
      )
        .then((res) => {
          if (res?.status === 422) {
            showError(t(`${translationPath}interview-schedule-failed`), res);
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
          props.closeModal();
          if (props.overview) props.eventsUpdate();
          else if (props.evaMeet) props.getData();

          setDisableSendButton(false);
        })
        .catch((err) => {
          if (err?.response?.data?.errors) {
            const errs = Object.values(err?.response?.data?.errors).map((a) => a[0]);
            addToast(
              <ul>
                {errs.map((e, i) => (
                  <li key={`interviewErrorKey${i + 1}`}>{e}</li>
                ))}
              </ul>,
              {
                appearance: 'error',
                autoDismissTimeout: 7000,
                autoDismiss: true,
              },
            );
          } else
            addToast(t(`${translationPath}interview-schedule-failed`), {
              appearance: 'error',
              autoDismissTimeout: 7000,
              autoDismiss: true,
            });

          setDisableSendButton(false);
        });
  };

  const handleSave = () => {};

  return (
    <Modal
      className="modal-dialog-centered"
      isOpen={props.isOpen}
      toggle={props.closeModal}
      style={{ maxWidth: 848 }}
    >
      <div className="modal-header border-0">
        <h3 className="h3 mb-0">{t(`${translationPath}schedule-a-meeting`)}</h3>
        <button
          type="button"
          className="close"
          data-dismiss="modal"
          aria-hidden="true"
          onClick={props.closeModal}
        >
          <i className="fas fa-times" />
        </button>
      </div>
      <ModalBody
        className="modal-body pt-0"
        style={{ maxHeight: '70vh', padding: '0px 62px', overflow: 'auto' }}
      >
        {step === 1 ? (
          <MeetingType
            state={state}
            setState={setState}
            type={state.type}
            onNext={handleContinue}
            parentTranslationPath={props.parentTranslationPath}
          />
        ) : (
          <MeetingDetails
            type={provider}
            state={state}
            setState={setState}
            setSend={setSend}
            onSave={handleSave}
            onSend={handleSend}
            onBack={handleBack}
            parentTranslationPath={props.parentTranslationPath}
            timezones={props.timezones || timezones}
            applicantsList={applicantsList}
            date={(props.data && props.data.date) || null}
            disableSendButton={disableSendButton}
          />
        )}
      </ModalBody>
    </Modal>
  );
};

export default ScheduleMeeting;
