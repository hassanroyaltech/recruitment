import { HttpServices } from '../helpers';

export const GetAllWorkflowProgress = async ({
  limit,
  page,
  search,
  status = true,
  use_for = 'list', // can be list (with not active spaces) or menu (without pagination)
  is_with_disconnected_flows = false,
  other_than,
  with_than,
  sort_by,
  group_by,
  space_uuid,
  member_uuid,
  flow_uuid,
  user_uuid,
  order,
  recruiter_uuid,
  job_uuid,
  // company_uuid,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/onboarding/${process.env.REACT_APP_VERSION_API}/activities`,

    {
      params: {
        limit,
        page,
        search,
        status,
        use_for,
        is_with_disconnected_flows,
        with_than,
        other_than,
        sort_by,
        group_by,
        space_uuid,
        member_uuid,
        flow_uuid,
        user_uuid,
        order,
        recruiter_uuid,
        job_uuid,
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
export const GetAllWorkflows = async ({
  limit,
  page,
  search,
  status = true,
  use_for = 'dropdown', // can be list (with not active spaces) or menu (without pagination)
  is_with_disconnected_flows = false,
  other_than,
  with_than,
  // company_uuid,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/onboarding/${process.env.REACT_APP_VERSION_API}/workflows`,

    {
      params: {
        limit,
        page,
        search,
        status,
        use_for,
        is_with_disconnected_flows,
        with_than,
        other_than,
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
