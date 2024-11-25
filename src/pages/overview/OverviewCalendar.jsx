// React and reactstrap
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Row,
} from 'reactstrap';

// Calendar
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import arLocale from '@fullcalendar/core/locales/ar';

import urls from '../../api/urls';
import { commonAPI } from '../../api/common';

// Schedule Interview components
import ViewScheduleInterview from '../../components/Elevatus/ViewScheduleInterview';
import ScheduleMeeting from '../../components/Views/ScheduleMeeting';
import Loader from '../../components/Elevatus/Loader';

// Permissions
import { Can } from '../../utils/functions/permissions';
import { formatDate } from '../../utils/functions/helpers';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  GetGlobalRoute,
  GlobalDateTimeFormat,
  HttpServices,
  showError,
} from '../../helpers';
import {
  GetAllMSTeamsMeetings,
  GetAllNylasEvents,
  GetNylasUserDetails,
  MSTeamsViewScheduleInterview,
} from '../../services';
import moment from 'moment';
import {
  EmailIntegrationStatusesEnum,
  MeetingFromFeaturesEnum,
  MsTeamsMeetingProvidersEnum,
} from '../../enums';
import { updateEmailIntegration } from '../../stores/actions/emailIntegrationActions';

const translationPath = '';
const parentTranslationPath = 'Overview';

/**
 * Component class that returns the OverviewCalendar
 */
export const OverviewCalendar = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  const isMountedRef = useRef(true);
  const userReducer = useSelector((state) => state.userReducer);
  const isInitLoadRef = useRef(true);
  const [emailIntegrationFilters, setEmailIntegrationFilters] = useState({
    limit: 100,
    offset: 0, // page number
    starts_after: null,
    ends_before: null,
    isAfterCalendarInitialized: false,
    user_uuid: userReducer?.results?.user?.uuid,

  });
  const [isDetailsReturned, setIsDetailsReturned] = useState(false);
  const dispatch = useDispatch();
  const calendarRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [loadingMsTeams, setLoadingMsTeams] = useState(true);
  const tokenReducer = useSelector((state) => state?.tokenReducer);
  const emailIntegrationReducer = useSelector(
    (state) => state?.emailIntegrationReducer,
  );
  const [state, setState] = useState({
    events: [],
    user: JSON.parse(localStorage.getItem('user'))?.results,
    languages: JSON.parse(localStorage.getItem('user'))?.results?.language,
    en_lang: JSON.parse(localStorage.getItem('user'))?.results?.language?.filter(
      (lang) => lang.code === 'en',
    ),
    ar_lang: JSON.parse(localStorage.getItem('user'))?.results?.language?.filter(
      (lang) => lang.code === 'ar',
    ),
    currentLanguage: i18next.language,
  });

  /**
   * Create the calendar
   * @returns {{start: Date, end: Date}}
   */
  const createCalendar = useCallback(() => {
    if (calendarRef.current) return;
    const calendarEl = document.getElementById('calendar');
    const d = new Date();
    d.setDate(d.getDate() - 1);
    calendarRef.current = new Calendar(calendarEl, {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      selectable: true,
      headerToolbar: false,
      locale: i18next.language === 'ar' ? arLocale : null,
      editable: true,
      selectConstraint: {
        start: d,
      },
      views: {
        pastAndFutureView: {
          visibleRange(currentDate) {
            // Generate a new date for manipulating in the next step
            const startDate = new Date(currentDate.valueOf());
            const endDate = new Date(currentDate.valueOf());

            // Adjust the start & end dates, respectively
            startDate.setDate(startDate.getDate() - 1); // One day in the past
            endDate.setDate(endDate.getDate() + 2); // Two days into the future

            return { start: startDate, end: endDate };
          },
        },
      },
      events: state.events,
      // Add new event
      select: (info) => {
        if (Can('create', 'schedule-interview'))
          setState((items) => ({
            ...items,
            modalAdd: true,
            startDate: info.startStr,
            date: formatDate(info.startStr),
            endDate: info.endStr,
            radios: 'bg-info',
            uuid: info.uuid,
            id: info.uuid,
            title: info.title,
            event: info,
          }));
      },
      // Edit calendar event action
      eventClick: ({ event }) => {
        setState((items) => ({
          ...items,
          modalView: true,
          uuid: event.uuid,
          id: event.uuid,
          title: event.title,
          date: formatDate(event.start),
          eventDescription: event.extendedProps.description,
          radios: 'bg-info',
          event,
        }));
      },
      viewDidMount: ({ view: { activeStart, activeEnd } }) => {
        setEmailIntegrationFilters((items) => ({
          ...items,
          starts_after: moment(activeStart, GlobalDateTimeFormat).unix(),
          ends_before: moment(activeEnd, GlobalDateTimeFormat).unix(),
          isAfterCalendarInitialized: true,
        }));
      },
      datesSet: ({ view: { activeStart, activeEnd } }) => {
        setEmailIntegrationFilters((items) => ({
          ...items,
          starts_after: moment(activeStart, GlobalDateTimeFormat).unix(),
          ends_before: moment(activeEnd, GlobalDateTimeFormat).unix(),
          isAfterCalendarInitialized: true,
        }));
      },
    });
    calendarRef.current.render();
    props.setCurrentDate(calendarRef.current.view.title);
  }, [props, state.events]);

  /**
   * this method is to return the current enum for email integration (Nylas)
   */
  const getEmailIntegrationStatus = useMemo(
    () => (key) =>
      Object.values(EmailIntegrationStatusesEnum).find((item) => item.key === key)
      || {},
    [],
  );

  /**
   * this method is to return the events list for email integration (Nylas)
   */
  const getAllNylasEvents = useCallback(async () => {

    if (
      !emailIntegrationReducer
      || !emailIntegrationFilters.isAfterCalendarInitialized
      || !emailIntegrationReducer.calendar_id
      || !emailIntegrationReducer.user_uuid
      || !emailIntegrationReducer.access_token
      || userReducer?.results?.user?.uuid !== emailIntegrationReducer.user_uuid
    )
      return;
    const localLoadedEvents = [];
    const eventsRecursiveLoader = async (offset) => {
      const response = await GetAllNylasEvents({
        user_uuid: userReducer?.results?.user?.uuid,
        calendar_id: emailIntegrationReducer.calendar_id,
        ...emailIntegrationFilters,
        offset,
      });
      if (response && response.status === 200) {
        const localEvents = response.data.body.map((event) => ({
          isNylasEvent: true,
          allDay: true,
          uuid: event.id,
          className: event.when.object === 'timespan' ? 'bg-primary' : 'bg-red',
          title: event.title,
          description: event.description,
          start:
            event.when.object === 'timespan'
              ? moment
                .unix(event.when.start_time)
                .locale('en')
                .format(GlobalDateTimeFormat)
              : event.when.date,
          end:
            event.when.object === 'timespan'
              ? moment
                .unix(event.when.end_time)
                .locale('en')
                .format(GlobalDateTimeFormat)
              : event.when.date,
          id: event.id,
          data: { ...event, isNylasEvent: true },
        }));
        localLoadedEvents.push(...localEvents);
        if (localEvents.length === emailIntegrationFilters.limit)
          await eventsRecursiveLoader(offset + 1);
      } else
        showError(
          t(
            offset === 0
              ? 'Shared:failed-to-get-saved-data'
              : `${translationPath}failed-to-get-all-your-email-events`,
          ),
          response,
        );
    };
    await eventsRecursiveLoader(emailIntegrationFilters.offset);
    setState((items) => {
      const localEvents = items.events.filter((event) => !event.isNylasEvent);
      return {
        ...items,
        events: [...localEvents, ...localLoadedEvents],
      };
    });
  }, [
    emailIntegrationFilters,
    emailIntegrationReducer,
    t,
    userReducer?.results?.user?.uuid,
  ]);

  const msTeamsViewScheduleInterview = useCallback(async () => {
    if (
      !emailIntegrationFilters?.starts_after
      || !emailIntegrationFilters?.ends_before
      || !userReducer?.results?.user?.uuid
    )
      return;
    setLoadingMsTeams(true);
    const localLoadedEvents = [];
    const eventsRecursiveLoader = async (page = 1) => {
      const response = await MSTeamsViewScheduleInterview({
        user_uuid: userReducer?.results?.user?.uuid,
        from_time: moment
          .unix(emailIntegrationFilters?.starts_after)
          .locale('en')
          .format('YYYY-MM-DD'),
        to_time: moment
          .unix(emailIntegrationFilters?.ends_before)
          .locale('en')
          .format('YYYY-MM-DD'),
        page,
      });
      if (response && response.status === 200) {
        const localEvents = response.data.data
          .filter((interview) => interview.status !== 'Cancelled')
          .map((event) => ({
            uuid: event.uuid,
            allDay: true,
            className: event.color ? event.color : 'bg-red',
            title: event.title,
            start: event.interview_date,
            end: event.interview_date,
            id: event.uuid,
            isMSTeams: true,
            data: { ...event, isMSTeams: true },
          }));
        localLoadedEvents.push(...localEvents);
        if (localLoadedEvents.length < response.data?.paginate?.total)
          await eventsRecursiveLoader(page + 1);
      }
    };
    await eventsRecursiveLoader();
    if (localLoadedEvents?.length > 0)
      setState((items) => {
        const localEvents = items.events.filter((event) => !event.isMSTeams);
        return {
          ...items,
          events: [...localEvents, ...localLoadedEvents],
        };
      });
    setLoadingMsTeams(false);
  }, [
    emailIntegrationFilters?.starts_after,
    emailIntegrationFilters?.ends_before,
    userReducer?.results?.user?.uuid,
  ]);

  useEffect(() => {
    msTeamsViewScheduleInterview();
  }, [msTeamsViewScheduleInterview]);

  // this is to update the status of email integrations on refresh to make sure the Nylas integration still valid
  const getEmailIntegrationDetails = useCallback(async () => {
    if (!userReducer?.results?.user?.uuid) return;
    // Get user details for email integration if user is authenticated with Nylas
    const nylasUserDetails = await GetNylasUserDetails({
      user_uuid: userReducer?.results?.user?.uuid,
    });

    window?.ChurnZero?.push([
      'setAttribute',
      'contact',
      'Connected to nylas email integration',
      nylasUserDetails?.data?.body
      && nylasUserDetails?.data?.body?.sync_state === 'running'
        ? 'Yes'
        : 'No',
    ]);

    if (nylasUserDetails && nylasUserDetails.status === 200)
      dispatch(updateEmailIntegration(nylasUserDetails.data.body));
    else dispatch(updateEmailIntegration(null));
    setTimeout(() => {
      setIsDetailsReturned((item) => (!item ? true : item));
    });
  }, [dispatch, userReducer?.results?.user?.uuid]);
  /**
   * Get the list of interviews from the API
   */
  const getInterviews = useCallback(async () => {
    HttpServices.get(urls.overview.interviews_GET)
      .then((Interviews) => {
        if (!isMountedRef.current) return;
        const localInterviews = Interviews.data.results.interviews
          .filter(
            (interview) =>
              !(
                interview.status === 'Cancelled'
                || Object.keys(MsTeamsMeetingProvidersEnum).includes(interview.provider)
              ),
          )
          .map((interview) => ({
            uuid: interview.uuid,
            allDay: true,
            className: interview.color ? interview.color : 'bg-red',
            title: interview.title,
            start: interview.interview_Date,
            end: interview.interview_Date,
            id: interview.uuid,
            data: interview,
          }));
        setState((items) => ({
          ...items,
          events: localInterviews,
        }));
        // setState((items) => ({ ...items, events: localInterviews }));
        setLoading(false);
      })
      .catch((error) => {
        if (!isMountedRef.current) return;
        setLoading(false);
        showError(t('Shared:failed-to-get-saved-data'), error);
        setState((items) => ({
          ...items,
          type: 'error',
          message: error?.response?.data?.message,
          errors: error?.response?.data?.errors,
        }));
      });
  }, [t]);

  /**
   * Get timezones from the API
   * @returns {Promise<void>}
   */
  const getTimezones = () => {
    commonAPI
      .getTimeZones()
      .then((res) => {
        if (isMountedRef.current)
          setState((items) => ({
            ...items,
            timezones: res.data.results,
          }));
      })
      .catch(() => {});
  };

  /**
   * Change the view of the calendar
   * @param newView
   */
  const changeView = (newView) => {
    calendarRef.current.changeView(newView);
    setState((items) => ({
      ...items,
      currentDate: calendarRef.current.view.title,
    }));
    props.setCurrentDate(calendarRef.current.view.title);
  };

  // this is to update the status of email integrations on refresh to make sure the Nylas integration still valid
  useEffect(() => {
    if (
      isInitLoadRef.current
      && userReducer
      // && emailIntegrationReducer
      // && emailIntegrationReducer.access_token
      && !GetGlobalRoute()?.from?.startsWith('/el/')
    )
      getEmailIntegrationDetails();
    else setIsDetailsReturned((item) => (!item ? true : item));

    isInitLoadRef.current = false;
  }, [emailIntegrationReducer, getEmailIntegrationDetails]);

  useEffect(() => {
    if (state.events && !loading)
      if (!calendarRef.current) createCalendar();
      else {
        calendarRef.current.removeAllEvents(); // Clear existing events
        calendarRef.current.addEventSource(state.events); // Add updated events
        calendarRef.current.refetchEvents(); // Re-fetch events from the event source
        calendarRef.current.render();
      }
  }, [createCalendar, loading, state.events]);

  useEffect(() => {
    if (
      !loadingMsTeams
      && emailIntegrationFilters.isAfterCalendarInitialized
      && emailIntegrationReducer
      && emailIntegrationReducer.access_token
      && getEmailIntegrationStatus(emailIntegrationReducer.sync_state).isValid
    )
      getAllNylasEvents();
  }, [
    emailIntegrationFilters.isAfterCalendarInitialized,
    emailIntegrationReducer,
    getAllNylasEvents,
    getEmailIntegrationStatus,
    loadingMsTeams,
  ]);

  useEffect(() => {
    if (tokenReducer && tokenReducer.token && isDetailsReturned) {
      setLoading(true);
      getInterviews();
      getTimezones();
    }
  }, [isDetailsReturned, getInterviews, tokenReducer]);

  useEffect(
    () => () => {
      isMountedRef.current = false;
    },
    [],
  );

  const eventsUpdate = () => {
    props.rerenderCalendarHandler();
  };
  /**
   * Render the JSX of the main component
   * @returns {JSX.Element}
   */

  return (
    <>
      {loading ? (
        <CardBody className="text-center">
          <Loader />
        </CardBody>
      ) : (
        <>
          <div className="header header-dark bg-primary pb-6 content__title content__title--calendar">
            <Container fluid>
              <div className="header-body pb-5">
                <div className="d-flex-v-center-h-between flex-wrap py-4">
                  <div className="d-inline-flex">
                    <h6 className="fullcalendar-title h2 text-white d-inline-block mb-0 mr-1">
                      {state.currentDate || calendarRef.current?.view?.title}
                    </h6>
                    <Breadcrumb
                      className="d-none d-md-inline-block ml-lg-4"
                      listClassName="breadcrumb-links breadcrumb-dark"
                    >
                      <BreadcrumbItem>
                        <a href="#pablo" onClick={(e) => e.preventDefault()}>
                          <i className="fas fa-home" />
                        </a>
                      </BreadcrumbItem>
                      <BreadcrumbItem>
                        <a href="#pablo" onClick={(e) => e.preventDefault()}>
                          {t(`${translationPath}overview`)}
                        </a>
                      </BreadcrumbItem>
                      <BreadcrumbItem aria-current="page" className="active">
                        {t(`${translationPath}calendar`)}
                      </BreadcrumbItem>
                    </Breadcrumb>
                  </div>
                  <div className="d-inline-flex flex-wrap">
                    <Button
                      className="fullcalendar-btn-prev btn-neutral"
                      color="default"
                      onClick={() => {
                        calendarRef.current.prev();
                        setState((items) => ({
                          ...items,
                          currentDate: calendarRef.current.view.title,
                        }));
                        props.setCurrentDate(calendarRef.current.view.title);
                      }}
                      size="sm"
                    >
                      <i className="fas fa-angle-left" />
                    </Button>
                    <Button
                      className="fullcalendar-btn-next btn-neutral"
                      color="default"
                      onClick={() => {
                        calendarRef.current.next();
                        setState((items) => ({
                          ...items,
                          currentDate: calendarRef.current.view.title,
                        }));
                        props.setCurrentDate(calendarRef.current.view.title);
                      }}
                      size="sm"
                    >
                      <i className="fas fa-angle-right" />
                    </Button>
                    <Button
                      className="btn-neutral"
                      color="default"
                      data-calendar-view="month"
                      onClick={() => changeView('dayGridMonth')}
                      size="sm"
                    >
                      {t(`${translationPath}month`)}
                    </Button>
                    <Button
                      className="btn-neutral"
                      color="default"
                      data-calendar-view="basicWeek"
                      onClick={() => changeView('dayGridWeek')}
                      size="sm"
                    >
                      {t(`${translationPath}week`)}
                    </Button>
                    <Button
                      className="btn-neutral"
                      color="default"
                      data-calendar-view="basicDay"
                      onClick={() => changeView('dayGridDay')}
                      size="sm"
                    >
                      {t(`${translationPath}day`)}
                    </Button>
                  </div>
                </div>
              </div>
            </Container>
          </div>
          <Container className="mt--6" fluid>
            <Row>
              <div className="col">
                <Card className="card-calendar">
                  <CardHeader>
                    <h5 className="h3 mb-0">{t(`${translationPath}calendar`)}</h5>
                  </CardHeader>
                  <CardBody className="p-0">
                    <div className="calendar" data-toggle="calendar" id="calendar" />
                  </CardBody>
                </Card>
              </div>
            </Row>
          </Container>
        </>
      )}
      {state.modalAdd && state.timezones && Can('create', 'schedule-interview') && (
        <ScheduleMeeting
          overview
          from_feature={MeetingFromFeaturesEnum.EvaMeet.key}
          eventsUpdate={eventsUpdate}
          timezones={state.timezones}
          data={state}
          isOpen={state.modalAdd}
          closeModal={() => setState((items) => ({ ...items, modalAdd: false }))}
          toggle={() => setState((items) => ({ ...items, modalChange: false }))}
          selectedCandidates={[]}
          user={state.user}
          languages={JSON.parse(localStorage.getItem('user'))?.results?.language}
        />
      )}
      {state.modalView && state.timezones && Can('view', 'schedule-interview') && (
        <ViewScheduleInterview
          timezones={state.timezones}
          data={state}
          isOpen={state.modalView}
          closeModal={() => setState((items) => ({ ...items, modalView: false }))}
          toggle={() => setState((items) => ({ ...items, modalView: false }))}
          selectedCandidates={[]}
          user={state.user}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          languages={JSON.parse(localStorage.getItem('user'))?.results?.language}
          overview
          eventsUpdate={eventsUpdate}
        />
      )}
    </>
  );
};

export default OverviewCalendar;
