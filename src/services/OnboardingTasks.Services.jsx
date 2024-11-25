import { HttpServices } from '../helpers';

export const GetAllOnboardingTasks = async ({
  limit,
  page,
  search,
  status = true,
  use_for = 'dropdown',
  other_than,
  with_than,
  company_uuid,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/onboarding/${process.env.REACT_APP_VERSION_API}/tasks/list`,
    {
      params: {
        limit,
        page,
        query: search,
        status,
        use_for,
        with_than,
        other_than,
      },
      headers:
        (company_uuid && {
          'Accept-Company': company_uuid,
        })
        || undefined,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetOnboardingTasksVariables = async ({
  limit,
  page,
  search,
  status,
  use_for = 'dropdown',
  other_than,
  with_than,
  space_uuid,
  member,
  folder_uuid,
  company_uuid,
  sort_by,
  order,
  group_by,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/onboarding/${process.env.REACT_APP_VERSION_API}/tasks/variables`,

    {
      params: {
        limit,
        page,
        query: search,
        status,
        use_for,
        space_uuid,
        folder_uuid,
        member,
        with_than,
        other_than,
        sort_by,
        order,
        group_by,
      },
      headers:
        (company_uuid && {
          'Accept-Company': company_uuid,
        })
        || undefined,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetOnboardingTasksAssignedToAssist = async ({
  limit,
  page,
  search,
  status,
  use_for = 'dropdown',
  other_than,
  with_than,
  member,
  type,
  company_uuid,
  sort_by,
  order,
  group_by,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/onboarding/${process.env.REACT_APP_VERSION_API}/tasks/assigned-to-assist`,

    {
      params: {
        limit,
        page,
        query: search,
        status,
        use_for,
        member,
        with_than,
        other_than,
        type,
        sort_by,
        order,
        group_by,
      },
      headers:
        (company_uuid && {
          'Accept-Company': company_uuid,
        })
        || undefined,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetOnboardingTasksAssignedToView = async ({
  limit,
  page,
  search,
  status,
  use_for = 'dropdown',
  other_than,
  with_than,
  member,
  type,
  company_uuid,
  sort_by,
  order,
  group_by,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/onboarding/${process.env.REACT_APP_VERSION_API}/tasks/assigned-to-view`,

    {
      params: {
        limit,
        page,
        query: search,
        status,
        use_for,
        type,
        member,
        with_than,
        other_than,
        sort_by,
        order,
        group_by,
      },
      headers:
        (company_uuid && {
          'Accept-Company': company_uuid,
        })
        || undefined,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
