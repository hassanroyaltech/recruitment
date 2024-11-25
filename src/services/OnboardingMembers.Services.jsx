import { HttpServices } from '../helpers';

export const GetAllOnboardingMembers = async ({
  limit,
  page,
  search,
  status = true,
  use_for = 'dropdown',
  other_than,
  with_than,
  space_uuid,
  folder_uuid,
  company_uuid,
  user_uuid,
  member,
  sort_by,
  order,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/onboarding/${process.env.REACT_APP_VERSION_API}/members`,

    {
      params: {
        limit,
        page,
        query: search,
        status,
        use_for,
        space_uuid,
        folder_uuid,
        with_than,
        other_than,
        user_uuid,
        member,
        sort_by,
        order,
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

export const GetOnboardingMembersById = async ({ uuid }) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/onboarding/${process.env.REACT_APP_VERSION_API}/members/view`,

    {
      params: {
        uuid,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const ExportFlowsByMembersUUIDS = async ({ members_uuids }) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/onboarding/${process.env.REACT_APP_VERSION_API}/members/export`,

    {
      members_uuids,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetOnboardingMemberDetails = async ({ member_uuid }) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/onboarding/${process.env.REACT_APP_VERSION_API}/members/journey`,
    {
      params: { member_uuid },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
