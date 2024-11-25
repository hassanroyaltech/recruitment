import { HttpServices } from '../helpers';
import { FormsFollowOrderTypes, FormsSubmissionsLevelsTypesEnum } from '../enums';

export const GetAllOnboardingFlows = async ({
  limit,
  page,
  search,
  status = true,
  use_for = 'dropdown', // can be list (with not active spaces) or menu (without pagination)
  other_than,
  with_than,
  company_uuid,
  sort_by,
  order,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/onboarding/${process.env.REACT_APP_VERSION_API}/flows`,

    {
      params: {
        limit,
        page,
        query: search,
        status,
        use_for,
        with_than,
        other_than,
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

export const GetOnboardingFlowURL = async ({
  uuid,
  email,
  forType,
  editor_role,
  role_type,
  type_of_submission = FormsSubmissionsLevelsTypesEnum.FormLevel.key,
  follow_order = FormsFollowOrderTypes.No.key,
  company_uuid,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/onboarding/${process.env.REACT_APP_VERSION_API}/get-member-flow`,

    {
      params: {
        uuid,
        email,
        for: forType,
        editor_role,
        type_of_submission,
        follow_order,
        role_type,
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

export const GetOnboardingFlowURLRecipient = async ({
  uuid,
  email,
  forType,
  editor_role,
  role_type,
  company_uuid,
  token,
  follow_order = FormsFollowOrderTypes.No.key,
  account_uuid,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/onboarding/${process.env.REACT_APP_VERSION_API}/get-member-flow`,

    {
      params: {
        uuid,
        email,
        for: forType,
        editor_role,
        follow_order,
        role_type,
      },
      headers:
        (company_uuid && {
          customHeaders: true,
          'Accept-Company': company_uuid,
          'recipient-token': token,
          'Accept-Account': account_uuid,
          Authorization: null,
        })
        || undefined,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllOnboardingDirectoriesMove = async ({
  type, // one of OnboardingTypesEnum
  uuid,
  space_uuid,
  folder_uuid,
  order, // start from one
}) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/onboarding/${process.env.REACT_APP_VERSION_API}/move`,
    {
      type, // one of OnboardingTypesEnum
      uuid,
      space_uuid,
      folder_uuid,
      order,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetAllOnboardingDirectoriesLink = async ({
  uuid,
  space_uuids,
  folder_uuids,
  // order, // start from one
}) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/onboarding/${process.env.REACT_APP_VERSION_API}/flows/link`,
    {
      uuid,
      space_uuids,
      folder_uuids,
      // order,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
