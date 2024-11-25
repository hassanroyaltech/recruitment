// import OpenHoursStep from './steps/OpenHours.Step';
import Availability from './steps/Availability.Step';
import MeetingDetailsStep from './steps/MeetingDetails.Step';

export const ScheduleMeetingSteps = [
  // {
  //   key: 'openHours',
  //   label: 'open-hours',
  //   component: OpenHoursStep,
  // },
  {
    key: 'availability',
    label: 'availability',
    component: Availability,
  },
  {
    key: 'meetingDetails',
    label: 'meetingDetails',
    component: MeetingDetailsStep,
  },
];
