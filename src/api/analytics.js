/** ********************************************************************
 *
 * Module Name: analytics.
 * Original Author: Esraa Shabrani.
 * Function Creation Date: 22/3/2021.
 * Return Value: Exports Functions.
 * Description: Service Contains all APIs used through analytics.
 *
 ********************************************************************* */
// Axios
import axios from 'api/middleware';

// Headers
import { generateHeaders } from 'api/headers';

// URLs
import urls from 'api/urls';

/**
 * Function Name: getTemplateData.
 * Return Value: JSON.
 * Arguments: - .
 * Description: This Function will Return Template data from
 * GET template API.
 */
async function getTemplateData() {
  return axios.get(urls.Analytics.TEMPLATES, {
    headers: generateHeaders(),
  });
}
/**
 * Function Name: createDashboard.
 * Return Value: JSON.
 * Arguments: Title(String), Reports(Array) .
 * Description: This Function will Create new Custom
 * Dashboard .
 */
async function createDashboard(title, reports) {
  return axios.post(
    urls.Analytics.DASHBOARD_WRITE,
    {
      title,
      reports,
    },
    {
      headers: generateHeaders(),
    },
  );
}

/**
 * Function Name: updateDashboard.
 * Return Value: JSON.
 * Arguments: UUID(String), Title(String), Reports(Array) .
 * Description: This Function will Update Custom
 * Dashboard .
 */
async function updateDashboard(uuid, title, reports) {
  return axios.put(
    urls.Analytics.DASHBOARD_WRITE,
    {
      dashboard_uuid: uuid,
      title,
      reports,
    },
    {
      headers: generateHeaders(),
    },
  );
}

/**
 * Function Name: viewDashboard.
 * Return Value: JSON.
 * Arguments: UUID (String).
 * Description: This Function will View Specific Custom
 * Dashboard .
 */
async function viewDashboard(uuid, category, fromDate, toDate, jobUuid, userUuid, page, limit) {
  return axios.get(urls.Analytics.DASHBOARD_GET,
    {
      params: {
        dashboard_uuid: uuid,
        category,
        from_date: fromDate || '',
        to_date: toDate || '',
        job_uuid: jobUuid || '',
        period: fromDate ? null : 'biannual',
        user_uuid: userUuid || '',
        page: page + 1 || '',
        limit: limit || '',
      },
      headers: generateHeaders(),
    });
}

/**
 * Function Name: deleteDashboard.
 * Return Value: JSON.
 * Arguments: UUID (String).
 * Description: This Function will Delete Specific Custom
 * Dashboard .
 */
async function deleteDashboard(uuid) {
  return axios.delete(
    urls.Analytics.DASHBOARD_WRITE, {
      headers: generateHeaders(),
      params: {
        dashboard_uuid: uuid,
      },
    },
  );
}

/**
 * Function Name: getDashboards.
 * Return Value: JSON.
 * Arguments: - .
 * Description: This Function will Return Dashboard Dropdown menu.
 */
async function getDashboards() {
  return axios.get(urls.Analytics.DASHBOARD_DROPDOWN, {
    headers: generateHeaders(),
  });
}

/**
 * Function Name: updateReport.
 * Return Value: JSON.
 * Arguments: Object {
 * dashboard_uuid,
    report_uuid,
    template_uuid,
    title,
    desc,
    type,
    chart_type,
 * }.
 * Description: This Function will Update Report in Specific
 * Custom Dashboard .
 */
async function updateReport(data) {
  return axios.put(
    urls.Analytics.REPORT,
    data,
    {
      headers: generateHeaders(),
    },
  );
}

/**
 * Function Name: deleteReport.
 * Return Value: JSON.
 * Arguments: dashboardUuid (String), reportUuid (String).
 * Description: This Function will Delete Report in Specific Custom
 * Dashboard .
 */
async function deleteReport(dashboardUuid, reportUuid) {
  return axios.delete(
    urls.Analytics.REPORT, {
      headers: generateHeaders(),
      params: {
        dashboard_uuid: dashboardUuid,
        report_uuid: reportUuid,
      },
    },
  );
}
/**
 * Function Name: getAnalyticsData.
 * Return Value: JSON.
 * Arguments: category (String), from_date(string), to_date, job_uuid.
 * Description: This Function will View Analytics data for default Views .
 */
async function getAnalyticsData(category, fromDate, toDate, jobUuid, userUuid, page, limit) {
  return axios.get(urls.Analytics.INDEX,
    {
      params: {
        category,
        from_date: fromDate || '',
        to_date: toDate || '',
        job_uuid: jobUuid || '',
        period: fromDate ? null : 'biannual',
        user_uuid: userUuid || '',
        page: page + 1 || '',
        limit: limit || '',
      },
      headers: generateHeaders(),
    });
}
/**
 * Function Name: getUsers.
 * Return Value: JSON.
 * Arguments: - .
 * Description: This Function will Return Users Dropdown menu.
 */
async function getUsers() {
  return axios.get(urls.preferences.USERS_DROPDOWN, {
    headers: generateHeaders(),
  });
}
export const analyticsAPI = {
  getTemplateData,
  createDashboard,
  updateDashboard,
  viewDashboard,
  deleteDashboard,
  getDashboards,
  updateReport,
  deleteReport,
  getAnalyticsData,
  getUsers,
};
