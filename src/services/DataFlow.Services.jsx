import { HttpServices } from '../helpers';

export const GetDataFlowDropdown = async ({
  //   limit,
  //   page,
  // search,
  use_for = 'dropdown',
  with_than,
  type,
}) => {
  const queryList = [];
  //   if (limit || limit === 0) queryList.push(`limit=${limit}`);
  //   if (page || page === 0) queryList.push(`page=${page}`);
  // if (search) queryList.push(`query=${search}`);
  if (use_for) queryList.push(`use_for=${use_for}`);
  if (type) queryList.push(`type=${type}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_API_DATAFLOW}/internal/user/dropdown?${queryList.join(
      '&',
    )}`,
    {
      params: { with_than },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const CreateCandidateCase = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_API_DATAFLOW}/internal/user/create_case`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UploadFilesForDataFlow = async ({ files }) => {
  const formData = new FormData();
  formData.append('files', files);
  const result = await HttpServices.post(
    `${process.env.REACT_APP_API_DATAFLOW}/media`,
    formData,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetDataFlowCase = async ({ DFREFNUMBER }) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_API_DATAFLOW}/internal/user/get_case_details`,
    {
      params: { DFREFNUMBER, EXCLUDEDOCUMETFILESTREAM: true },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetDataFlowCases = async ({
  limit = 20,
  page = 1,
  use_for = 'dropdown',
  crn,
  name,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_API_DATAFLOW}/internal/user/cases`,
    {
      params: {
        limit,
        page,
        use_for,
        crn,
        name,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
