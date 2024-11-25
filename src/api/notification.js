// Axios
import urls from 'api/urls';
import { HttpServices } from '../helpers';

/**
 *
 * @param page
 * @returns {Promise<*>}
 */
const getNotification = async (page) =>
  HttpServices.get(urls.notification.NOTIFY, {
    params: { page },
  });

/**
 *
 * @param data
 * @returns {Promise<*>}
 */
const readNotification = async (data) =>
  HttpServices.post(urls.notification.READ, { notifications_uuids: data });

export const notificationAPI = {
  getNotification,
  readNotification,
};
