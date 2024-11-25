// Import React Components
import React, { useCallback, useEffect, useState, useReducer, useRef } from 'react';
import moment from 'moment';
// Import Reactstrap components
import { Col, Row } from 'reactstrap';
// Import Loader
import Loader from 'components/Elevatus/Loader';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ButtonBase, Card, CardContent, Divider } from '@mui/material';
import i18next from 'i18next';
import { showError, showSuccess } from '../../../../../../helpers';
import { commonAPI } from '../../../../../../api/common';
import {
  SharedAPIAutocompleteControl,
  SetupsReducer,
  SetupsReset,
  SharedInputControl,
  SharedAutocompleteControl,
} from '../../../../../../pages/setups/shared';
import { SystemActionsEnum, DynamicFormTypesEnum } from '../../../../../../enums';
import TimePickerInput from '../../../../../Elevatus/TimePickerInput';
import {
  AddOpenHours,
  CheckUserEmail,
  CreateNylasEvent,
  GetAllCalendars,
  GetAllSetupsUsers,
  GetAvailability,
  GetOpenHours,
  getSetupsUsersById,
} from '../../../../../../services';
import Datepicker from '../../../../../Elevatus/Datepicker';
import { numericAndAlphabeticalAndSpecialExpression } from '../../../../../../utils';
import './Steps.Style.scss';

const parentTranslationPath = 'EmailIntegrationPage';
const translationPath = 'ScheduleMeeting.';

const MeetingDetailsStep = ({
  candidate_uuid,
  job_uuid,
  candidate,
  confirm,
  setConfirm,
  state,
  onStateChanged,
  confirmEventHandler,
  setActiveStep,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  const [loading, setLoading] = useState(false);
  const [checkedEmails, setCheckedEmails] = useState({});
  const userReducer = useSelector((state) => state?.userReducer);
  const emailIntegrationReducer = useSelector(
    (state) => state?.emailIntegrationReducer,
  );
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const providers = [
    { label: t(`${translationPath}zoom`), value: 'Zoom Meeting' },
    { label: t(`${translationPath}google-meet`), value: 'Google Meet' },
    { label: t(`${translationPath}micorsoft-teams`), value: 'Microsoft Teams' },
  ];

  const GetAllCalendarsHandler = useCallback(async () => {
    const res = await GetAllCalendars({
      user_uuid: userReducer.results.user.uuid,
      access_token: emailIntegrationReducer.access_token,
    });
    if (res.status === 200) {
      showSuccess(res.data.message);
      const filteredCalendars = res.data.body.filter((item) => !item.read_only);
      onStateChanged({ id: 'calendars', value: filteredCalendars });
    } else showError(t('failed-to-get-saved-data'), res.message);
  }, [emailIntegrationReducer, onStateChanged, t, userReducer]);

  const onGuestDeleteHandler = useCallback(
    (currentIndex, items) => () => {
      const localGuests = [...items];
      localGuests.splice(currentIndex, 1);
      onStateChanged({
        id: 'participants',
        value: localGuests,
      });
    },
    [onStateChanged],
  );

  useEffect(() => {
    // get current recruiter calendar
    GetAllCalendarsHandler();
  }, []);

  return (
    <>
      <SharedInputControl
        isFullWidth
        stateKey="title"
        errorPath="title"
        editValue={state.title}
        onValueChanged={onStateChanged}
        labelValue="title"
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        // errors={errors}
        // isSubmitted={isSubmitted}
      />
      <SharedInputControl
        rows={3}
        multiline
        isFullWidth
        stateKey="description"
        errorPath="description"
        editValue={state.description}
        onValueChanged={onStateChanged}
        labelValue="description"
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
        // errors={errors}
        // isSubmitted={isSubmitted}
      />
      <SharedInputControl
        isFullWidth
        stateKey="location"
        errorPath="location"
        editValue={state.location}
        onValueChanged={onStateChanged}
        labelValue="location"
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
      />
      <SharedAutocompleteControl
        isFullWidth
        stateKey="provider"
        errorPath="provider"
        searchKey="search"
        initValues={providers}
        initValuesKey="value"
        initValuesTitle="label"
        editValue={state.provider}
        onValueChanged={onStateChanged} // change dropdown value then reset details values
        labelValue="provider"
        placeholder="select-provider"
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
        sharedClassesWrapper="p-0"
        //   errors={errors}
        // isSubmitted={isSubmitted}
      />
      {state.provider === 'Zoom Meeting' && (
        <>
          <SharedInputControl
            isFullWidth
            stateKey="meeting_code"
            errorPath="meeting_code"
            editValue={state.meeting_code}
            onValueChanged={onStateChanged}
            labelValue="code"
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
          />
          <SharedInputControl
            isFullWidth
            stateKey="password"
            errorPath="password"
            editValue={state.password}
            onValueChanged={onStateChanged}
            labelValue="password"
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
          />
          <SharedInputControl
            isFullWidth
            stateKey="url"
            errorPath="url"
            editValue={state.url}
            onValueChanged={onStateChanged}
            labelValue="url"
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
          />
        </>
      )}
      {state.provider === 'Microsoft Teams' && (
        <>
          <SharedInputControl
            isFullWidth
            stateKey="url"
            errorPath="url"
            editValue={state.url}
            onValueChanged={onStateChanged}
            labelValue="url"
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
          />
        </>
      )}
      {/* participants */}
      <ButtonBase
        // disabled={isDisabledAdd}
        onClick={() =>
          onStateChanged({
            id: 'participants',
            value: [...state.participants, { name: '', email: '' }],
          })
        }
        className="btns theme-solid w-25 mb-4"
      >
        <span className="fas fa-plus" />
        <span className="px-1">{t(`${translationPath}add-guest`)}</span>
      </ButtonBase>

      {state.participants?.map((guest, idx, guests) => (
        <div className="d-flex-v-center" key={idx}>
          <SharedInputControl
            isHalfWidth
            stateKey="name"
            errorPath="name"
            editValue={guest.name}
            onValueChanged={(e) => {
              const participantsArr = [...state.participants];
              participantsArr[idx] = {
                ...participantsArr[idx],
                name: e.value,
              };
              onStateChanged({ id: 'participants', value: participantsArr });
            }}
            labelValue="name"
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            isDisabled={idx === 0 && candidate?.basic_information}
          />
          <SharedInputControl
            isHalfWidth
            stateKey="email"
            errorPath="email"
            editValue={guest.email}
            onInputBlur={(e) => {
              const participantsArr = [...state.participants];
              participantsArr[idx] = {
                ...participantsArr[idx],
                email: e.value,
              };
              onStateChanged({ id: 'participants', value: participantsArr });
            }}
            labelValue="email"
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            isDisabled={idx === 0 && candidate?.basic_information}
          />
          <ButtonBase
            className="btns-icon theme-danger mx-2 mt-1"
            onClick={onGuestDeleteHandler(idx, guests)}
          >
            <span className="fas fa-minus" />
          </ButtonBase>
        </div>
      ))}
      {/* calendars */}
      <SharedAutocompleteControl
        isFullWidth
        stateKey="calendar_id"
        errorPath="calendar_id"
        searchKey="search"
        initValuesKey="id"
        initValuesTitle="name"
        editValue={state.calendar_id}
        initValues={state.calendars}
        onValueChanged={onStateChanged}
        labelValue="calendar"
        placeholder="select-calendar"
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
        sharedClassesWrapper="p-0"
        //   errors={errors}
        // isSubmitted={isSubmitted}
      />
      <div className="d-flex-v-center-h-end">
        <ButtonBase
          onClick={() => setActiveStep(0)}
          className="btns theme-outline m-0 mr-2"
        >
          {t(`${translationPath}back`)}
        </ButtonBase>

        <ButtonBase
          onClick={() => confirmEventHandler()}
          className="btns theme-solid m-0 ml-2"
          disabled={loading || !state.title || !state.provider || !state.calendar_id}
        >
          {t(`${translationPath}create-event`)}
        </ButtonBase>
      </div>
    </>
  );
};

export default MeetingDetailsStep;
