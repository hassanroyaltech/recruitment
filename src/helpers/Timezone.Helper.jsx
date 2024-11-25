import moment from 'moment-timezone';
// Function to reorder timezones with the user's current timezone first
export const PrioritizeUserTimezone = (timezones) => {
  let localTimezones = [...(timezones || [])];
  // Guess the user's current timezone
  const currentUserTimezone = moment.tz.guess();

  // Filter out the user's timezone from the list if it exists
  const currentTimezoneItem = localTimezones.find(
    (tz) => tz.key === currentUserTimezone,
  );
  if (!currentTimezoneItem) return;
  localTimezones = timezones.filter((tz) => tz.key !== currentUserTimezone);

  // Prepend the user's timezone to the start of the list
  localTimezones.unshift(currentTimezoneItem);

  return localTimezones;
};
