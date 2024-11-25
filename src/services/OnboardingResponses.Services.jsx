import { HttpServices } from '../helpers';

export const GetOnboardingResponses = async ({
  limit,
  page,
  search,
  status,
  use_for = 'dropdown', // can be list (with not active spaces) or menu (without pagination)
  is_with_disconnected_flows = false,
  other_than,
  with_than,
  group_by,
  sort_by,
  member,
  task,
  user_uuid,
  order,
  // company_uuid,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/onboarding/${process.env.REACT_APP_VERSION_API}/responses`,

    {
      params: {
        limit,
        page,
        query: search,
        status,
        use_for,
        is_with_disconnected_flows,
        with_than,
        other_than,
        group_by,
        sort_by,
        member,
        task,
        user_uuid,
        order,
      },
      // headers:
      //   (company_uuid && {
      //     'Accept-Company': company_uuid,
      //   })
      //   || undefined,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetOnboardingResponsesAssignedToView = async ({
  limit,
  page,
  search,
  status,
  use_for = 'dropdown', // can be list (with not active spaces) or menu (without pagination)
  is_with_disconnected_flows = false,
  other_than,
  with_than,
  group_by,
  sort_by,
  member,
  task,
  user_uuid,
  order,
  // company_uuid,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/onboarding/${process.env.REACT_APP_VERSION_API}/responses/assigned-to-view`,

    {
      params: {
        limit,
        page,
        query: search,
        status,
        use_for,
        is_with_disconnected_flows,
        with_than,
        other_than,
        group_by,
        sort_by,
        member,
        task,
        user_uuid,
        order,
      },
      // headers:
      //   (company_uuid && {
      //     'Accept-Company': company_uuid,
      //   })
      //   || undefined,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
