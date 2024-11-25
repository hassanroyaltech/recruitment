// Import React Components
import React, { useCallback, useState } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ButtonBase, Card } from '@mui/material';
import i18next from 'i18next';
import {
  showError,
  GlobalTimeFormatWithA,
  showSuccess,
  GlobalSavingDateFormat,
} from '../../../../../../helpers';
import { SharedAPIAutocompleteControl } from '../../../../../../pages/setups/shared';
import { DynamicFormTypesEnum } from '../../../../../../enums';
import {
  GetAllSetupsUsers,
  GetAvailability,
  GetOpenHours,
} from '../../../../../../services';
import DatePickerComponent from '../../../../../Datepicker/DatePicker.Component';
const parentTranslationPath = 'EmailIntegrationPage';
const translationPath = 'ScheduleMeeting.';

const Availability = ({
  confirm,
  setConfirm,
  state,
  onStateChanged,
  setActiveStep,
  confirmed,
  setConfirmed,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  //   const [state, setState] = useState({
  //     duration: null,
  //     emails: [],
  //     free_busy: [],
  //   });

  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  // const [checkedEmails, setCheckedEmails] = useState({});
  //   const [unconnectedEmails, setUnconnectedEmails] = useState([]);
  const userReducer = useSelector((state) => state?.userReducer);
  const emailIntegrationReducer = useSelector(
    (state) => state?.emailIntegrationReducer,
  );
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  const GetAvailabilityHandler = useCallback(async () => {
    const selectedRecuruitersEmails = state.emails.map((user) => user.email);
    const selectedRecuruitersUUIDs = state.emails.map((user) => user.uuid);

    setLoading(true);
    const users = state.emails.map((user) => user.uuid);
    const openHours = await GetOpenHours({
      user_uuid: userReducer.results.user.uuid,
      users: [...selectedRecuruitersUUIDs, userReducer.results.user.uuid],
    });
    const roundToNearest5Minutes = (time) => Math.round(time / (5 * 60)) * (5 * 60);
    const start_time
      = moment(`${state.start_time} 12:00 AM`, 'YYYY-MM-DD HH:mm A').unix()
    const end_time = roundToNearest5Minutes(
      moment(`${state.start_time} 11:59 PM`, 'YYYY-MM-DD HH:mm A').unix()
    );
    if (openHours.status === 200) {
      const res = await GetAvailability({
        user_uuid: userReducer.results.user.uuid,
        start_time,
        end_time,
        emails: [...selectedRecuruitersEmails, emailIntegrationReducer.email],
        duration_minutes: state.duration,
        interval_minutes: state.duration,
        open_hours: openHours.data.body,
      });
      if (res.status === 200) {
        setIsSubmitted(true);
        showSuccess(res.data.message);
        setAvailableTimeSlots(res.data?.body?.time_slots);
      } else showError(t('failed-to-get-saved-data'), res.message);
    } else showError(t('failed-to-get-saved-data'), openHours.message);

    setLoading(false);
  }, [emailIntegrationReducer, t, userReducer, state]);

  return (
    <div className="d-flex-column">
      <span>{t(`${translationPath}select-duration`)}</span>
      <div className="d-flex mb-3">
        {[15, 30, 45, 60].map((duration) => (
          <ButtonBase
            key={duration}
            onClick={() => onStateChanged({ id: 'duration', value: duration })}
            style={{ flexBasis: '50%' }}
          >
            <Card
              className="d-flex flex-row align-items-center justify-content-between m-2 p-2"
              style={{
                borderStyle: (state.duration === duration && 'outset') || 'none',
              }}
            >
              <div className="d-flex-column-center">
                <span className="fas fa-clock c-primary fa-2x mb-2" />
                <span>{`${duration} ${t(`${translationPath}minutes`)}`}</span>
              </div>
            </Card>
          </ButtonBase>
        ))}
      </div>
      <span>{t(`${translationPath}recruiters-label`)}</span>
      <SharedAPIAutocompleteControl
        isEntireObject
        isFullWidth
        placeholder={t('select-recruiters')}
        stateKey="emails"
        errorPath="emails"
        onValueChanged={onStateChanged}
        idRef="emails"
        getOptionLabel={(option) =>
          `${
            option.first_name
            && (option.first_name[i18next.language] || option.first_name.en)
          }${
            option.last_name
            && ` ${option.last_name[i18next.language] || option.last_name.en}`
          }`
        }
        type={DynamicFormTypesEnum.array.key}
        getDataAPI={GetAllSetupsUsers}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
        searchKey="search"
        wrapperClasses="mb-2 mt-2"
        extraProps={{
          committeeType: 'all',
        }}
        controlWrapperClasses="mb-1"
      />
      <div className="d-flex">
        <div
          className="d-flex-column-center mb-4 my-1"
          style={{ maxHeight: '25rem' }}
        >
          <DatePickerComponent
            disablePast
            inputPlaceholder="YYYY-MM-DD"
            value={state.start_time || ''}
            helperText={t('this-field-is-required')}
            label={t(`${translationPath}date`)}
            onChange={(date) => {
              if (date?.value !== 'Invalid date')
                onStateChanged({ id: 'start_time', value: date.value });
              else onStateChanged({ id: 'start_time', value: null });
            }}
            displayFormat={GlobalSavingDateFormat}
            datePickerWrapperClasses="px-0"
            inline={true}
          />
          <ButtonBase
            onClick={GetAvailabilityHandler}
            className={`btns theme-solid mt-2 ${isSubmitted ? 'w-100' : 'w-50'}`}
            disabled={!state.duration || !state.start_time}
          >
            {t(`${translationPath}get-availability`)}
          </ButtonBase>
        </div>
        {availableTimeSlots?.length ? (
          <div
            className="mb-4 mx-2 p-2 w-100"
            style={{ overflow: 'scroll', maxHeight: '20rem' }}
          >
            {availableTimeSlots.map((item, idx) => (
              <div
                className={`${confirm[idx] ? 'd-flex' : ''} w-100`}
                key={item.start_time}
              >
                <div className="w-100 mr-1">
                  <ButtonBase
                    className={`mb-2 w-100 btns ${
                      confirmed[idx] ? 'theme-selected' : 'theme-un-selected'
                    }`}
                    onClick={() =>
                      !confirm[idx]
                        ? setConfirm({ [idx]: item })
                        : setConfirm({ idx: false })
                    }
                  >
                    {moment
                      .unix(item.start_time)
                      .locale(i18next.language)
                      .format(GlobalTimeFormatWithA)}
                  </ButtonBase>
                </div>
                {confirm[idx] && (
                  <div className="w-100 ml-1">
                    <ButtonBase
                      className="w-50 btns theme-solid w-100"
                      key={idx}
                      onClick={() => {
                        setConfirmed({ [idx]: item });
                        setConfirm({ idx: false });
                      }}
                    >
                      {t(`${translationPath}confirm`)}
                    </ButtonBase>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          (isSubmitted && (
            <div
              className="mb-4 mx-2 p-2 w-100"
              style={{ overflow: 'scroll', maxHeight: '20rem' }}
            >
              <span>{t(`${translationPath}no-time-slots`)}</span>
            </div>
          )) || <></>
        )}
      </div>
      <div className="d-flex-v-center-h-end">
        {/* <ButtonBase
          className="w-50 btns theme-solid w-100 m-0 mr-2"
          onClick={() => {
            // setActiveStep(1);
            setActiveStep(0);
          }}
        >
          {t(`${translationPath}back`)}
        </ButtonBase> */}
        <ButtonBase
          className="btns theme-solid m-0 mr-2"
          onClick={() => {
            // setActiveStep(2);
            setActiveStep(1);
          }}
          disabled={!Object.values(confirmed)?.[0]?.start_time}
        >
          {t(`${translationPath}next`)}
        </ButtonBase>
      </div>
    </div>
  );
};

export default Availability;
