import React, { useEffect, useState } from 'react';
import { useToasts } from 'react-toast-notifications';
import { geocodeByPlaceId } from 'react-places-autocomplete';
import LetterAvatar from '../../components/Elevatus/LetterAvatar';
import { useOverlayedAvatarStyles } from '../../utils/constants/colorMaps';
// import Moment to format date and time
import moment from 'moment';
import { evameetAPI } from '../../api/evameet';
import { DialogComponent } from '../Dialog/Dialog.Component';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { AvatarsComponent } from '../Avatars/Avatars.Component';
import { isHTML } from '../../helpers';
import { MSTeamsDeleteEvent } from '../../services';
import { useSelector } from 'react-redux';
import { MsTeamsMeetingProvidersEnum } from '../../enums';

const ViewScheduleInterview = (props) => {
  const { t } = useTranslation(props.parentTranslationPath);
  const [eventData] = useState(
    props.data && props.data.event && props.data.event.extendedProps
      ? props.data.event.extendedProps.data
      : [],
  );
  const { addToast } = useToasts(); // Toasts
  const classes = useOverlayedAvatarStyles();
  const userReducer = useSelector((state) => state.userReducer);
  const [state, setState] = useState({
    modal_type: 'view',
    uuid: eventData ? eventData.uuid : '',
    title: eventData ? eventData.title : '',
    user: JSON.parse(localStorage.getItem('user'))?.results,
    radios: eventData ? eventData.color : 'bg-success',
    from_time: eventData ? eventData.from_time : '10:00',
    to_time: eventData ? eventData.to_time : '10:00',
    location: eventData ? eventData.location : '',
    place_id: eventData ? eventData.place_id : '',
    type: eventData && eventData.type && eventData.type === 'offline' ? 1 : 2,
    online_link: eventData ? eventData.online_link : '',
    recruiters: eventData ? eventData.recruiters : [],
    guests: eventData ? eventData.candidates : [],
    candidate_uuid: props.candidate
      ? props.candidate.id
      : eventData && eventData.candidate
        ? eventData.candidate.uuid
        : '0f30281d-a426-46f6-9ba7-4d9757b79b98',
    candidate: props.candidate
      ? props.candidate.id
      : eventData && eventData.candidate
        ? eventData.candidate
        : [],
    interview_date: props.data.date,
    typesList: [
      {
        label: 'online interview',
        value: 2,
      },
      {
        label: 'offline interview',
        value: 1,
      },
    ],
    candidates: props.candidate
      ? [
        {
          email: props.candidate.title,
          uuid: props.candidate.id,
        },
      ]
      : [],
    candidate_name: props.candidate
      ? [props.candidate.title]
      : eventData && eventData.candidate
        ? [eventData.candidate.first_name + eventData.candidate.last_name]
        : [],
    send: eventData ? eventData.send : 1,
    language_id: 1,
    teamsData: [],
    teams: [],
    timezone: eventData && eventData.timezone,
  });

  useEffect(() => {
    if (state.place_id) {
      const data = geocodeByPlaceId(state.place_id);
      data.then((res) =>
        setState((prevState) => ({
          ...prevState,
          address: res[0].formatted_address,
        })),
      );
    }
  }, [state.place_id]);
  /**
   * Cancel meeting Function
   */
  const cancelInterview = () => {
    (eventData?.isMSTeams
    || Object.keys(MsTeamsMeetingProvidersEnum).includes(eventData?.provider)
      ? MSTeamsDeleteEvent({
        user_uuid: userReducer?.results?.user?.uuid,
        meeting_uuid: state.uuid,
      })
      : evameetAPI.cancelScheduleInterview(state.uuid)
    )
      .then(() => {
        addToast('Interview Cancelled Successfully', {
          appearance: 'success',
          autoDismissTimeout: 7000,
          autoDismiss: true,
        });
        props.closeModal();
        if (props.overview) props?.eventsUpdate();
      })
      .catch(() => {
        addToast(<span>Canceled Interview failed!</span>, {
          appearance: 'error',
          autoDismissTimeout: 7000,
          autoDismiss: true,
        });
      });
  };

  return (
    <DialogComponent
      maxWidth="xs"
      dialogTitle={
        <div className="modal-header d-flex-v-center-h-between py-2 px-3 border-0 ">
          <h3 className="h3 mb-0">{state.title}</h3>
          <div>
            <button
              type="button"
              className="close mx-1"
              data-dismiss="modal"
              aria-hidden="true"
              onClick={() => props.closeModal()}
            >
              <i className="fas fa-times" />
            </button>
            {!eventData.isNylasEvent && (
              <button
                type="button"
                className="close mx-1"
                data-dismiss="modal"
                aria-hidden="true"
                onClick={() => cancelInterview()}
              >
                <i className="fas fa-trash " />
              </button>
            )}
          </div>
        </div>
      }
      contentClasses="px-0"
      dialogContent={
        <div className="schedule-interview-management-content-dialog-wrapper">
          {state.modal_type === 'edit' ? (
            <></>
          ) : (
            <>
              {(state.interview_date
                || (eventData.when && eventData.when.object === 'date')) && (
                <div className="px-3 mb-2">
                  <i className="fas fa-calendar mr-2-reversed" />
                  {state.interview_date || eventData.when.date}
                </div>
              )}
              {state.start_time && (
                <div className="px-3 mb-2">
                  <i className="fas fa-clock mr-2-reversed" />
                  {moment(state.from_time, 'HHmmss')
                    .locale(i18next.language)
                    .format('hh:mm A')}
                  <span className="px-1">-</span>
                  {moment(state.to_time, 'HHmmss')
                    .locale(i18next.language)
                    .format('hh:mm A')}
                </div>
              )}
              {eventData.when && eventData.when.object === 'timespan' && (
                <div className="px-3 mb-2">
                  <i className="fas fa-clock mr-2-reversed" />
                  {moment
                    .unix(eventData.when.start_time, 'HHmmss')
                    .locale(i18next.language)
                    .format('hh:mm A')}
                  <span className="px-1">-</span>
                  {moment
                    .unix(eventData.when.end_time, 'HHmmss')
                    .locale(i18next.language)
                    .format('hh:mm A')}
                </div>
              )}
              {eventData.conferencing && eventData.conferencing.provider && (
                <div className="px-3 mb-2">
                  <span>
                    <i className="fas fa-handshake mr-2-reversed" />
                    <span>{t(`${props.translationPath}provider`)}</span>
                  </span>
                  <div>
                    <span>{eventData.conferencing.provider}</span>
                  </div>
                </div>
              )}
              {eventData.conferencing && eventData.conferencing.details && (
                <div className="px-3 mb-2">
                  <span>
                    <i className="fas fa-link mr-2-reversed" />
                    <span>{t(`${props.translationPath}url`)}</span>
                  </span>
                  <div>
                    <span>{eventData.conferencing.details.url}</span>
                  </div>
                </div>
              )}
              {eventData.description && (
                <div className="px-3 mb-2">
                  <span>
                    <i className="fas fa-comment-alt mr-2-reversed" />
                    <span>{t(`${props.translationPath}description`)}</span>
                  </span>
                  <div>
                    {(isHTML(eventData.description) && (
                      <span
                        dangerouslySetInnerHTML={{ __html: eventData.description }}
                      />
                    )) || <span>{eventData.description}</span>}
                  </div>
                </div>
              )}
              {eventData.owner && (
                <div className="px-3 mb-2">
                  <span>
                    <i className="fas fa-user mr-2-reversed" />
                    <span>{t(`${props.translationPath}owner`)}</span>
                  </span>
                  <div>
                    <span>{eventData.owner}</span>
                  </div>
                </div>
              )}
              {eventData.participants && eventData.participants.length > 0 && (
                <div className="px-3 mb-2">
                  <span>
                    <i className="fas fa-users mr-2-reversed" />
                    <span>{t(`${props.translationPath}participants`)}</span>
                  </span>
                  <div>
                    <AvatarsComponent
                      avatars={eventData.participants.map((item) => ({
                        ...item,
                        name: item.name || item.email,
                        displayName: item.name,
                      }))}
                      isSingle
                      idRef="participantsIdRef"
                      parentTranslationPath={props.parentTranslationPath}
                      translationPath={props.translationPath}
                      titleComponent={({ item }) => (
                        <div className="d-flex-column">
                          <div className="my-2">
                            <span>
                              {t(`${props.translationPath}email`)}
                              <span>:</span>
                            </span>
                            <span className="px-1">{item.email}</span>
                          </div>
                          {item.displayName && (
                            <div className="mb-2">
                              <span>
                                {t(`${props.translationPath}name`)}
                                <span>:</span>
                              </span>
                              <span className="px-1">{item.displayName}</span>
                            </div>
                          )}
                          {item.status && (
                            <div className="mb-2">
                              <span>
                                {t(`${props.translationPath}status`)}
                                <span>:</span>
                              </span>
                              <span className="px-1">{item.status}</span>
                            </div>
                          )}
                          {item.phone_number && (
                            <div className="mb-2">
                              <span>
                                {t(`${props.translationPath}phone-number`)}
                                <span>:</span>
                              </span>
                              <span className="px-1">{item.phone_number}</span>
                            </div>
                          )}
                          {item.comment && (
                            <div className="mb-2">
                              <span>
                                {t(`${props.translationPath}comment`)}
                                <span>:</span>
                              </span>
                              <span className="px-1">{item.comment}</span>
                            </div>
                          )}
                        </div>
                      )}
                    />
                  </div>
                </div>
              )}

              {state.timezone && (
                <div className="px-3 mb-2">
                  <i className="fas fa-calendar-times mr-2-reversed" />
                  {state.timezone}
                </div>
              )}

              {state.recruiters && state.recruiters.length > 0 && (
                <div className="px-3 mb-2">
                  <i className="fas fa-users mr-2-reversed" /> Team Members :
                  <div className="d-flex flex-row align-items-start comment-item">
                    {state.recruiters.map((item, key) => (
                      <div className={classes.root} style={{ margin: 6 }} key={key}>
                        <LetterAvatar
                          name={`${item.first_name} ${item.last_name}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {state.guests && state.guests.length > 0 && (
                <div className="px-3 mb-2">
                  <i className="fas fa-users mr-2-reversed" /> Guests :
                  {state.guests.map((item, key) => (
                    <label className="form-control-label d-block mb-3" key={key}>
                      {item.email}
                    </label>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      }
      wrapperClasses="schedule-interview-management-dialog-wrapper"
      isOpen={props.isOpen}
    />
  );
};

export default ViewScheduleInterview;
