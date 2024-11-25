import { HttpServices } from '../helpers';
import { AnalyticsChartTypesEnum } from '../enums';

export const GetAllFeaturesList = async ({ is_static }) =>
  await HttpServices.get(
    `${process.env.REACT_APP_ANALYTICS_SDB_API}/dropdown/features`,
    { params: { is_static } },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GenerateReport = async ({
  reportType,
  uuids,
  from_date,
  to_date,
  filters,
}) =>
  await HttpServices.post(
    `${process.env.REACT_APP_ANALYTICS_SDB_API}/dynamic-analytics/${reportType}/generate-report`,
    {
      user_uuid: uuids,
      from_date,
      to_date,
      ...filters,
      ...(filters.match_job_uuid && {
        match_job_uuid: Array.isArray(filters.match_job_uuid)
          ? filters.match_job_uuid[0]
          : filters.match_job_uuid,
      }),
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetAllReports = async (filters) =>
  await HttpServices.get(`${process.env.REACT_APP_ANALYTICS_SDB_API}/reports`, {
    params: filters,
  })
    .then((data) => data)
    .catch((error) => error.response);

export const GetAllDashboards = async (filters) =>
  await HttpServices.get(
    `${process.env.REACT_APP_ANALYTICS_SDB_API}/dashboards/dropdown`,
    { params: filters },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetAllLibraryTemplates = async (filters) =>
  await HttpServices.get(
    `${process.env.REACT_APP_ANALYTICS_SDB_API}/static-analytics/templates`,
    { params: filters },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const CreateCustomDashboard = async (body) =>
  await HttpServices.post(
    `${process.env.REACT_APP_ANALYTICS_SDB_API}/dashboards/custom-dashboard`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const UpdateCustomDashboard = async (body) =>
  await HttpServices.put(
    `${process.env.REACT_APP_ANALYTICS_SDB_API}/dashboards/custom-dashboard`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetCustomDashboardById = async ({ uuid }) =>
  await HttpServices.get(
    `${process.env.REACT_APP_ANALYTICS_SDB_API}/dashboards/custom-dashboard/view`,
    {
      params: { uuid },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetStaticAnalytics = async (filters) =>
  await HttpServices.get(
    `${process.env.REACT_APP_ANALYTICS_SDB_API}/static-analytics/index`,
    { params: filters },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const RenderCustomDashboard = async (filters) =>
  await HttpServices.post(
    `${process.env.REACT_APP_ANALYTICS_SDB_API}/dashboards/custom-dashboard/render`,
    filters,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const CreateCustomDashboardWidget = async (filters) =>
  await HttpServices.post(
    `${process.env.REACT_APP_ANALYTICS_SDB_API}/custom-dashboard/dynamic`,
    filters,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const UpdateCustomDashboardWidget = async (filters) =>
  await HttpServices.put(
    `${process.env.REACT_APP_ANALYTICS_SDB_API}/custom-dashboard/dynamic`,
    filters,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const MoveWidgetToCustomDashboard = async ({
  report_uuid,
  dashboard_uuid,
  is_dynamic,
}) =>
  await HttpServices.post(
    `${process.env.REACT_APP_ANALYTICS_SDB_API}/custom-dashboard/report`,
    {
      report_uuid,
      dashboard_uuid,
      is_dynamic,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const DeleteCustomDashboardWidget = async ({
  uuid,
  dashboard_uuid,
  is_dynamic,
}) =>
  await HttpServices.delete(
    `${process.env.REACT_APP_ANALYTICS_SDB_API}/custom-dashboard/report`,
    {
      data: {
        uuid,
        dashboard_uuid,
        is_dynamic,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetAllAnalyticsFiltersDropdown = async ({ slug }) =>
  await HttpServices.get(
    `${process.env.REACT_APP_ANALYTICS_SDB_API}/dropdown/filters`,
    {
      params: {
        slug,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetAllAnalyticsSummarizeDropdown = async ({ slug }) =>
  await HttpServices.get(
    `${process.env.REACT_APP_ANALYTICS_SDB_API}/dropdown/summarize`,
    {
      params: {
        feature: slug,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetAllAnalyticsProjectionDropdown = async ({ slug }) =>
  await HttpServices.get(
    `${process.env.REACT_APP_ANALYTICS_SDB_API}/dropdown/projection`,
    {
      params: {
        slug,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetDynamicAnalytics = async ({ reportType, filters, end_point }) =>
  await HttpServices.post(
    `${
      end_point
        ? end_point
        : `${process.env.REACT_APP_ANALYTICS_SDB_API}/dynamic-analytics/${reportType}/index`
    }`,
    {
      ...filters,
      ...(filters.match_job_uuid && {
        match_job_uuid: Array.isArray(filters.match_job_uuid)
          ? filters.match_job_uuid[0]
          : filters.match_job_uuid,
      }),
      chart_type: AnalyticsChartTypesEnum.BAR.value,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const PinAndUnpinDashboard = async ({ is_pinned, uuid }) =>
  await HttpServices.put(
    `${process.env.REACT_APP_ANALYTICS_SDB_API}/dashboards/custom-dashboard/pinned`,
    { is_pinned, uuid },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const DeleteCustomDashboard = async ({ uuid }) =>
  await HttpServices.delete(
    `${process.env.REACT_APP_ANALYTICS_SDB_API}/dashboards/custom-dashboard`,
    { data: { uuid } },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const DuplicateCustomDashboard = async ({ uuid }) =>
  await HttpServices.post(
    `${process.env.REACT_APP_ANALYTICS_SDB_API}/dashboards/duplicate-dashboard`,
    { uuid },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetAllAnalyticsOfferContentDropdown = async ({ company_uuid, slug }) =>
  await HttpServices.get(
    `${process.env.REACT_APP_ANALYTICS_SDB_API}/dropdown/${
      slug === 'form_template' ? 'template-content' : 'offer-content'
    }`,
    {
      params: {
        company_uuid,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const AddStaticWidgetToCustomDashboard = async (body) =>
  await HttpServices.post(
    `${process.env.REACT_APP_ANALYTICS_SDB_API}/custom-dashboard/static`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetAllUsersPython = async ({
  limit = 10,
  page = 1,
  search,
  user_type,
  category_uuid,
  status = true,
  committeeType,
  use_for = 'dropdown',
  other_than,
  with_than,
  company_uuid,
  custom_header = null,
  all_users,
}) => {
  const queryList = [];
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);
  if (search) queryList.push(`query=${search}`);
  if (user_type || user_type === 0) queryList.push(`user_type=${user_type}`);
  if (category_uuid) queryList.push(`category_uuid=${category_uuid}`);
  if (status && use_for !== 'dropdown') queryList.push(`status=${status}`);
  if (committeeType) queryList.push(`user_for=${committeeType}`);
  if (use_for) queryList.push(`use_for=${use_for}`);
  if (all_users) queryList.push(`all_users=${all_users}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_ANALYTICS_SDB_API}/dropdown/users?${queryList.join(
      '&',
    )}`,
    {
      params: {
        with_than,
        other_than,
      },
      headers:
        {
          ...(company_uuid && {
            'Accept-Company': company_uuid,
          }),
          ...(custom_header && custom_header),
        } || undefined,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GenerateAnalyticsReport = async (filters) =>
  await HttpServices.post(
    `${process.env.REACT_APP_ANALYTICS_SDB_API}/static-analytics/${filters.feature}/generate-report`,
    null,
    { params: filters },
  )
    .then((data) => data)
    .catch((error) => error.response);
export const GetAnalyticsDetailedView = async (filters) =>
  await HttpServices.get(
    `${process.env.REACT_APP_ANALYTICS_SDB_API}/static-analytics/${filters.feature}/detailed-view`,
    { params: filters },
  )
    .then((data) => data)
    .catch((error) => error.response);
