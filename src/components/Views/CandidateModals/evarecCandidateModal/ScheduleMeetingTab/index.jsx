// Import React Components
import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useReducer,
  useMemo,
} from 'react';
import * as yup from 'yup';
// Import Reactstrap components
import { Col, Row } from 'reactstrap';
import i18next from 'i18next';
import Loader from 'components/Elevatus/Loader';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { ButtonBase } from '@mui/material';
import {
  showError,
  GlobalTimeFormatWithA,
  getErrorByName,
  showSuccess,
} from '../../../../../helpers';
import OpenHours from './steps/OpenHours.Step';
import Availability from './steps/Availability.Step';
import { CreateNylasEvent, GetOpenHours } from '../../../../../services';
import MeetingDetails from './steps/MeetingDetails.Step';
import {
  SharedAPIAutocompleteControl,
  SetupsReducer,
  SetupsReset,
} from '../../../../../pages/setups/shared';
import { StepperComponent, RadiosComponent } from '../../../..';
import { ScheduleMeetingSteps } from './ScheduleMeeting.Steps';
import { VitallyTrack } from '../../../../../utils/Vitally';

const parentTranslationPath = 'EmailIntegrationPage';
const translationPath = 'EvarecCandidateModal.';

const ScheduleMeetingTab = ({
  candidate_uuid,
  job_uuid,
  candidate,
  setBookDialogOpen,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState({});
  const [confirmed, setConfirmed] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [activeStepperComponent, setActiveStepperComponent] = useState(null);
  const [isValidateOnlyActiveIndex, setIsValidateOnlyActiveIndex] = useState(false);
  const [scheduleMeetingSteps] = useState(() => ScheduleMeetingSteps);
  const [errors, setErrors] = useState(() => ({}));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentOpenHours, setCurrentOpenHours] = useState();
  const schema = useRef(null);

  const userReducer = useSelector((state) => state?.userReducer);
  const emailIntegrationReducer = useSelector(
    (state) => state?.emailIntegrationReducer,
  );

  const stateInitRef = useRef({
    emails: [],
    duration: null,
    start_time: null,
    end_time: null,
    title: '',
    location: '',
    description: '',
    provider: '',
    meeting_code: null,
    password: null,
    url: null,
    participants: [],
    details: null, // if provider is zoom or teams (meeting_code, url, password)
    calendar_id: '',
    calendars: [],
  });
  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );
  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  const getIsInvalidSteps = (index) => false;

  const completedHandler = (index) => {
    if (getIsInvalidSteps(index)) return false;
    return index < activeStep;
  };

  const onStepperClick = (newIndex) => {
    const previewsInvalidIndex = ScheduleMeetingSteps.findIndex(
      (item, index) => index < newIndex, // get is invalid
    );
    if (previewsInvalidIndex !== -1) {
      if (previewsInvalidIndex !== activeStep) {
        showError(
          `${t(`${translationPath}please-finish`)} ${t(
            `${translationPath}${ScheduleMeetingSteps[previewsInvalidIndex].label}`,
          )} ${t(`${translationPath}first`)}`,
        );
        setActiveStep(previewsInvalidIndex);
      } else {
        setIsValidateOnlyActiveIndex(true);
        setIsSubmitted(true);
        // if (activeStep === 0 && errors.selectedChannels)
        //   showError(t(errors.selectedChannels.message));
        // else if (
        //   (activeStep === 1 || activeStep === 2)
        //   && (Object.keys(errors).toString().includes(ReviewTypesEnum.campaign.key)
        //     || Object.keys(errors).toString().includes(ReviewTypesEnum.job.key))
        // )
        //   showError(t(`${translationPath}please-fill-all-the-mandatory-fields`));
        // else showError(t(`${translationPath}please-finish-the-current-step-first`));
      }
      return;
    }
    if (isValidateOnlyActiveIndex) {
      setIsValidateOnlyActiveIndex(false);
      setIsSubmitted(false);
    }
    if (!state.selectedChannels || state.selectedChannels.length === 0) return;
    setActiveStep(newIndex);
  };

  const isDisabledStepHandler = useMemo(
    () => (index) => index === 1 || index === 1 || index === 2,
    [],
  );

  const getErrors = useCallback(() => {
    let localSchema = {
      current: yup.object().nullable().shape(schema.current),
    };
    if (activeStep === 3)
      localSchema = {
        current: yup.object().shape({
          ...schema.current,
          // job: getJobDetailsErrors(),
          // campaign: getCampaignErrors(),
        }),
      };
    getErrorByName(localSchema, state).then((result) => {
      setErrors(result);
    });
  }, [activeStep, state]);

  const onSchemaChanged = useCallback(
    (newValue) => {
      schema.current = newValue;
      getErrors();
    },
    [getErrors],
  );

  const confirmEventHandler = useCallback(async () => {
    const recruiters = state.emails?.map((item) => ({
      email: item.email,
      name: `${item.first_name?.en} ${item.last_name?.en}`,
    }));
    const res = await CreateNylasEvent({
      user_uuid: userReducer.results.user.uuid,
      access_token: emailIntegrationReducer.access_token,
      title: state.title,
      location: state.location,
      description: state.description,
      busy: 'true',
      start_time: Object.values(confirmed)?.[0]?.start_time,
      end_time: Object.values(confirmed)?.[0]?.end_time,
      time_zone: 'Etc/GMT+3', // change
      auto_create: state.provider === 'Google Meet' ? 'true' : 'false',
      provider: state.provider,
      ...(state.provider === 'Zoom Meeting' || state.provider === 'Microsoft Teams'
        ? {
          details: {
            ...(state.provider === 'Zoom Meeting' && {
              meeting_code: state.meeting_code,
              password: state.password,
            }),
            url: state.url,
          },
        }
        : {
          details: { },
        }),
      participants: [...state.participants, ...recruiters],
      calendar_id: state.calendar_id,
    });
    if (res.status === 200) {
      VitallyTrack(
        `Schedule Interview (${
          state.provider === 'other' ? 'offline' : state.provider
        })`,
      );
      window?.ChurnZero?.push([
        'trackEvent',
        `Schedule meeting (${
          state.provider !== 'other'
            ? (state.provider || '').toUpperCase()
            : 'Offline'
        })`,
        `Schedule meeting (${
          state.provider !== 'other'
            ? (state.provider || '').toUpperCase()
            : 'Offline'
        })`,
        1,
        {},
      ]);
      showSuccess(res.data.message);
      if (setBookDialogOpen) setBookDialogOpen(false);
    } else showError(t('failed-to-get-saved-data'), res.message);
  }, [emailIntegrationReducer, state, t, userReducer, confirmed, setBookDialogOpen]);

  // const GetOpenHoursHandler = useCallback(async () => {
  //   const openHours = await GetOpenHours({
  //     user_uuid: userReducer.results.user.uuid,
  //     users: [userReducer.results.user.uuid],
  //   });
  //   if (openHours?.status === 200)
  //     if (openHours.data?.body?.length) {
  //       setCurrentOpenHours(openHours.data.body);
  //       setActiveStep(1);
  //     }
  // }, [userReducer]);

  // useEffect(() => {
  //   // check if current user has open hours anc if yes then skip the first step
  //   GetOpenHoursHandler();
  // }, [GetOpenHoursHandler]);

  useEffect(() => {
    if (candidate)
      onStateChanged({
        id: 'participants',
        value: [
          {
            name: `${candidate.basic_information.first_name} ${candidate.basic_information.last_name}`,
            email: candidate.basic_information.email,
          },
        ],
      });
  }, [candidate]);

  return (
    <Row>
      {loading && <Loader width="730px" height="49vh" speed={1} color="primary" />}
      {!loading && (
        <Col className="d-flex flex-column pb-2">
          <StepperComponent
            wrapperClasses="overflow-reset-x"
            steps={scheduleMeetingSteps}
            activeStep={activeStep}
            onStepperClick={onStepperClick}
            isWithControlledCompleted
            // isDisabledAll={globalIsLoading}
            isDisabled={isDisabledStepHandler}
            hasError
            isValidateOnlyActiveIndex={isValidateOnlyActiveIndex}
            completed={completedHandler}
            isSubmitted={isSubmitted}
            connector={<span className="connect-icon fas fa-chevron-right fa-sm" />}
            // dynamicComponentLocationChanger={(component) => {
            //   setActiveStepperComponent(component);
            // }}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            dynamicComponentProps={{
              state,
              schema,
              // activeItem,
              onSchemaChanged,
              onStateChanged,
              // isOpenChanged,
              // goToPageHandler,
              // payAndStartCampaignHandler,
              // saveHandler,
              // nextHandler,
              isSubmitted,
              // globalIsLoading,
              errors,
              parentTranslationPath,
              confirm,
              setConfirm,
              confirmEventHandler,
              setActiveStep,
              confirmed,
              setConfirmed,
            }}
            icon={(index, isCompleted, isInvalid, isDisabled) => (
              <RadiosComponent
                idRef={`stepsRadioRef${index + 1}`}
                value={activeStep === index}
                isDisabled={isDisabled}
                checkedIcon={
                  (isInvalid && 'fas fa-exclamation-triangle')
                  || (isCompleted && 'fas fa-check-circle')
                  || undefined
                }
                icon={
                  (isInvalid && 'fas fa-exclamation-triangle')
                  || (isCompleted && 'fas fa-check-circle')
                  || undefined
                }
                themeClass="theme-line-secondary"
              />
            )}
          />
        </Col>
      )}
    </Row>
  );
};

export default ScheduleMeetingTab;
