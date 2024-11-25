// Import React Components
import React, { useCallback, useEffect, useState } from 'react';
// Import Reactstrap components
import { Col, Row } from 'reactstrap';
// Import Loader
import Loader from 'components/Elevatus/Loader';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ButtonBase, Card, CardContent, Divider } from '@mui/material';
import { showError, showSuccess } from '../../../../../../helpers';
import { commonAPI } from '../../../../../../api/common';
import {
  SharedInputControl,
  SharedAutocompleteControl,
} from '../../../../../../pages/setups/shared/controls';
import { SystemActionsEnum } from '../../../../../../enums';
import TimePickerInput from '../../../../../Elevatus/TimePickerInput';
import { AddOpenHours, GetOpenHours } from '../../../../../../services';

const parentTranslationPath = 'EmailIntegrationPage';
const translationPath = 'ScheduleMeeting.';

const OpenHoursStep = ({
  candidate_uuid,
  job_uuid,
  candidate,
  setActiveStep,
  isStep,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [state, setState] = useState({
    timezone: null,
    days: [
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ],
  });
  const [loading, setLoading] = useState(false);
  const [timezones, setTimezones] = useState();

  const userReducer = useSelector((state) => state?.userReducer);
  const emailIntegrationReducer = useSelector(
    (state) => state?.emailIntegrationReducer,
  );

  const AddOpenHoursHandler = useCallback(async () => {
    setLoading(true);

    const res = await AddOpenHours({
      user_uuid: userReducer.results.user.uuid,
      emails: [emailIntegrationReducer.email],
      days: state.days.filter((day) => day === 0 || day),
      timezone: state.timezone,
      start: state.start,
      end: state.end,
    });
    if (res.status === 200) {
      showSuccess(res.data.message);
      if (isStep) setActiveStep(1);
    } else showError(t('failed-to-get-saved-data'), res.message);

    setLoading(false);
  }, [emailIntegrationReducer, isStep, setActiveStep, state, t, userReducer]);

  const GetOpenHoursHandler = useCallback(async () => {
    setLoading(true);

    const openHours = await GetOpenHours({
      user_uuid: userReducer.results.user.uuid,
      users: [userReducer.results.user.uuid],
    });
    if (openHours?.status === 200) {
      showSuccess(openHours.data.message);
      if (openHours.data?.body?.[0])
        setState({
          days: openHours.data.body[0].days,
          start: openHours.data.body[0].start,
          end: openHours.data.body[0].end,
          timezone: openHours.data.body[0].timezone,
        });
    } else showError(t('failed-to-get-saved-data'), openHours.message);

    setLoading(false);
  }, [t, userReducer]);

  useEffect(() => {
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

  useEffect(() => {
    if (userReducer?.results?.user?.uuid) GetOpenHoursHandler();
  }, [GetOpenHoursHandler, userReducer]);

  return (
    <>
      {/* <div className="mb-4">{t(`${translationPath}specify-open-hours`)}</div> */}
      <div className="d-flex w-100">
        <div className="d-flex-column w-50">
          <span className="mb-2">{t(`${translationPath}select-week-days`)}</span>
          <div className="d-flex w-100">
            {[
              { title: 'm', value: 0 },
              { title: 't', value: 1 },
              { title: 'w', value: 2 },
              { title: 'th', value: 3 },
              { title: 'f', value: 4 },
              { title: 'sa', value: 5 },
              { title: 'su', value: 6 },
            ].map((day) => (
              <ButtonBase
                key={day.value}
                className={`btns-icon theme-${
                  state.days[day.value] === day.value ? 'solid' : 'outline'
                } mr-1-reversed ${
                  state.days[day.value] === day.value ? 'c-white' : 'c-secondary'
                }`}
                onClick={() =>
                  setState((items) => {
                    const newArr = [...items.days];
                    newArr[day.value]
                      = newArr[day.value] === day.value ? undefined : day.value;
                    return { ...items, days: newArr };
                  })
                }
              >
                <div>
                  <span>{t(`${translationPath}${day.title}`)}</span>
                </div>
              </ButtonBase>
            ))}
          </div>
        </div>
        <div className="d-flex w-50">
          <div className="w-50 mr-2">
            <TimePickerInput
              value={state.start}
              onChange={(time) => {
                setState((prevState) => ({
                  ...prevState,
                  start: time,
                }));
              }}
              // isSubmitted={isSubmitted}
              // errors={errors}
              errorPath="start"
              labelValue={t(`${translationPath}start-time`)}
            />
          </div>
          <div className="w-50 ml-2">
            <TimePickerInput
              value={state.end}
              onChange={(time) => {
                state.start && time > state.start
                  ? setState((prevState) => ({
                    ...prevState,
                    end: time,
                    end_error: '',
                  }))
                  : setState((prevState) => ({
                    ...prevState,
                    end_error: t(`${translationPath}valid-date-time-description`),
                  }));
              }}
              // isSubmitted={isSubmitted}
              // errors={errors}
              errorPath="end"
              labelValue={t(`${translationPath}end-time`)}
            />
            <p>{state?.end_error}</p>
          </div>
        </div>
      </div>
      <SharedAutocompleteControl
        editValue={state.timezone || null}
        placeholder={t(`${translationPath}timezone`)}
        stateKey="timezone"
        onValueChanged={(newValue) =>
          setState((items) => ({ ...items, timezone: newValue.value }))
        }
        getOptionLabel={(option) => option.title}
        initValues={timezones}
        errorPath="timezone"
        labelValue={t(`${translationPath}select-timezone`)}
        sharedClassesWrapper="p-0 mb-4"
        // errors={errors}
        // isSubmitted={isSubmitted}
      />
      <ButtonBase
        onClick={() => AddOpenHoursHandler()}
        className="btns theme-solid m-0"
        disabled={loading}
      >
        {isStep ? t(`${translationPath}next`) : t(`${translationPath}save`)}
      </ButtonBase>
    </>
  );
};

export default OpenHoursStep;
