import { HttpServices } from '../helpers';

export const MarkAllNotificationsAsReaded = async () =>
  await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/notifications/read_all`,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetNotificationsSetttings = async ({ uuid }) =>
  await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${process.env.REACT_APP_VERSION_API}/user/view-notification`,
    {
      params: {
        uuid,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const SaveNotificationSettings = async (body) =>
  await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/user/notification`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
