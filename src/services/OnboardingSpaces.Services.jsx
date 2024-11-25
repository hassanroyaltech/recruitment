import { HttpServices } from '../helpers';
// this is to return the spaces & how many subFolders & flows inside of it
export const GetAllOnboardingSpaces = async ({
  limit,
  page,
  search,
  status = true,
  use_for = 'dropdown', // can be list (with not active spaces) or menu (without pagination)
  other_than,
  with_than,
  company_uuid,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/onboarding/${process.env.REACT_APP_VERSION_API}/spaces`,

    {
      params: {
        limit,
        page,
        search,
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

export const GetAllOnboardingDirectory = async ({
  // search,
  // status = true,
  // use_for = 'dropdown', // can be list (with not active spaces) or menu (without pagination)
  // other_than,
  // with_than,
  company_uuid,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/onboarding/${process.env.REACT_APP_VERSION_API}/directory`,

    {
      params: {
        // search,
        // status,
        // use_for,
        // with_than,
        // other_than,
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

export const GetOnboardingSpaceById = async ({ uuid }) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/onboarding/${process.env.REACT_APP_VERSION_API}/spaces/view`,
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

export const CreateOnboardingSpaces = async (state) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/onboarding/${process.env.REACT_APP_VERSION_API}/spaces`,
    state,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateOnboardingSpaces = async (state) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/onboarding/${process.env.REACT_APP_VERSION_API}/spaces`,
    state,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteOnboardingSpaces = async (params) => {
  const result = await HttpServices.delete(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/onboarding/${process.env.REACT_APP_VERSION_API}/spaces`,
    {
      params,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
