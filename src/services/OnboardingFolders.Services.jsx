import { HttpServices } from '../helpers';
// this is to return the folders & how many folders & flows inside of it
export const GetAllOnboardingFolders = async ({
  limit,
  page,
  search,
  status = true,
  use_for = 'dropdown', // can be list (with not active folders) or menu (without pagination)
  other_than,
  with_than,
  company_uuid,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/onboarding/${process.env.REACT_APP_VERSION_API}/folders`,

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

export const GetOnboardingFolderById = async ({ uuid }) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/onboarding/${process.env.REACT_APP_VERSION_API}/folders/view`,
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

export const CreateOnboardingFolders = async (state) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/onboarding/${process.env.REACT_APP_VERSION_API}/folders`,
    state,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateOnboardingFolders = async (state) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/onboarding/${process.env.REACT_APP_VERSION_API}/folders`,
    state,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteOnboardingFolders = async (params) => {
  const result = await HttpServices.delete(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/onboarding/${process.env.REACT_APP_VERSION_API}/folders`,
    {
      params,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
