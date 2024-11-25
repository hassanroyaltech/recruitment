/* eslint-disable no-param-reassign */
import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import ButtonBase from '@mui/material/ButtonBase';
import { GetAllCalendars } from '../../services';
import { showError, showSuccess } from '../../helpers';
// import OpenHoursStep from '../../components/Views/CandidateModals/evarecCandidateModal/ScheduleMeetingTab/steps/OpenHours.Step';
import ScheduleMeetingTab from '../../components/Views/CandidateModals/evarecCandidateModal/ScheduleMeetingTab';
import { DialogComponent } from '../../components';
import '@nylas/components-agenda';

const parentTranslationPath = 'EmailIntegrationPage';
const translationPath = 'EmailIntegrationCalendarPage.';

const EmailsIntegrationCalendar = () => {
  const { t } = useTranslation(parentTranslationPath);
  const initialEventRef = useRef(false);
  const btnRef = useRef();
  const [calendars, setCalendars] = useState([]);
  const [bookDialogOpen, setBookDialogOpen] = useState(false);
  const userReducer = useSelector((state) => state?.userReducer);
  const emailIntegrationReducer = useSelector(
    (state) => state?.emailIntegrationReducer,
  );
  const scheduleEditorScriptRef = useRef(null);

  useEffect(() => {
    const existingScript = document.getElementById('schedule-editor-script');
    if (!existingScript) {
      scheduleEditorScriptRef.current = document.createElement('script');
      scheduleEditorScriptRef.current.type = 'text/javascript';
      scheduleEditorScriptRef.current.id = 'schedule-editor-script';
      scheduleEditorScriptRef.current.src
        = 'https://schedule.nylas.com/schedule-editor/v1.0/schedule-editor.js';
      scheduleEditorScriptRef.current.setAttribute('crossorigin', 'anonymous');
      scheduleEditorScriptRef.current.setAttribute(
        'integrity',
        'sha384-NyZ0JOk4FWFor3vkOPh0rM8gQ8sMtLSQmPLyddBmm4pJ9SikxHY/0Q/t0rPisPUU',
      );
      document.head.appendChild(scheduleEditorScriptRef.current);
    }
  }, []);

  useEffect(() => {
    btnRef.current = document.getElementById('schedule-editor');
    if (btnRef?.current && emailIntegrationReducer && !initialEventRef.current) {
      initialEventRef.current = true;
      btnRef.current.addEventListener('click', () => {
        // Prompt the Schedule Editor when a user clicks on the button
        window.nylas.scheduler.show({
          auth: {
            // Account <ACCESS_TOKEN> with active calendar scope
            accessToken: emailIntegrationReducer.access_token,
          },
          style: {
            // Style the Schedule Editor
            tintColor: '#32325d',
            backgroundColor: 'white',
          },
          defaults: {
            event: {
              title: '30-min Coffee Meeting',
              duration: 30,
            },
          },
        });
      });
    }
  }, [emailIntegrationReducer]);

  useEffect(
    () => () => {
      if (scheduleEditorScriptRef.current)
        document.head.removeChild(scheduleEditorScriptRef.current);
    },
    [],
  );

  useEffect(
    () => () => {
      if (initialEventRef?.current && btnRef?.current)
        btnRef.current.removeEventListener('click');
    },
    [],
  );

  const GetAllCalendarsHandler = useCallback(async () => {
    const res = await GetAllCalendars({
      user_uuid: userReducer.results.user.uuid,
      access_token: emailIntegrationReducer.access_token,
    });
    if (res.status === 200) {
      showSuccess(res.data.message);
      setCalendars(res.data.body);
    } else showError(t('failed-to-get-saved-data'), res.message);
  }, [emailIntegrationReducer, t, userReducer]);

  useEffect(() => {
    // get current recruiter calendar
    GetAllCalendarsHandler();
  }, [GetAllCalendarsHandler]);

  return (
    <div className="email-integration-calendar-page page-wrapper">
      <div className="page-header-wrapper px-3 pb-3">
        <span className="header-text-x2 d-flex mb-1">
          {t(`${translationPath}email-integration-calendar`)}
        </span>
        <span className="description-text">
          {t(`${translationPath}email-integration-calendar-description`)}
        </span>
      </div>
      <div className="d-flex-v-center-h-end">
        <ButtonBase
          ref={btnRef}
          id="schedule-editor"
          className="btns theme-solid mb-2"
          // disabled={emailIntegrationReducer?.access_token}
        >
          <span className="px-1">{t(`${translationPath}open-schedular`)}</span>
        </ButtonBase>
        <ButtonBase
          className="btns theme-solid mb-2"
          onClick={() => setBookDialogOpen(true)}
          // disabled={emailIntegrationReducer?.access_token}
        >
          <span className="px-1">{t(`${translationPath}book-meeting`)}</span>
        </ButtonBase>
      </div>
      <nylas-agenda
        access_token={emailIntegrationReducer.access_token}
        id="bf76dd17-16bc-49e6-8125-4210976efd90"
        calendar_ids={
          (calendars.length && calendars.map((item) => item.id).join(',')) || ''
        }
        allow_date_change
        color_by="event"
        eagerly_fetch_events
        header_type="full"
        show_no_events_message
        theme="theme-5"
        // allowed_dates
        // auto_time_box
        // click_action
        // condensed_view
        // hide_current_time
        // hide_ticks
        // prevent_zoom
        // show_as_busy
      />
      {/* <div className="w-50 px-3 pb-3">
        <div className="mt-2 mb-4 header-text">
          {t(`${translationPath}open-hours`)}
        </div>
        <OpenHoursStep isStep={false} />
      </div> */}
      <DialogComponent
        maxWidth="md"
        titleText="book-meeting"
        contentClasses="px-0"
        dialogContent={<ScheduleMeetingTab setBookDialogOpen={setBookDialogOpen} />}
        wrapperClasses="lookups-management-dialog-wrapper"
        isOpen={bookDialogOpen}
        onCloseClicked={() => setBookDialogOpen(false)}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
    </div>
  );
};

export default EmailsIntegrationCalendar;
