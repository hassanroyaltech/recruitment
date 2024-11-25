import { HttpServices } from '../helpers';

export const GetAllApproveApplicants = async ({
  limit,
  page,
  search,
  category_code,
  status = true,
  use_for = 'dropdown',
  with_than,
  assigned_user_uuid,
  toSaveFilter,
  tags,
}) => {
  const queryList = [];
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);
  if (search) queryList.push(`query=${search}`);
  // if (status) queryList.push(`status=${status}`);
  if (use_for) queryList.push(`use_for=${use_for}`);
  if (category_code) queryList.push(`category_code=${category_code}`);
  if (assigned_user_uuid?.user_uuid || assigned_user_uuid)
    queryList.push(
      `assigned_user_uuid=${assigned_user_uuid.user_uuid || assigned_user_uuid}`,
    );
  const localCandidateProperties = [...(toSaveFilter?.candidate_property || [])];
  if (toSaveFilter?.candidate_property) delete toSaveFilter?.candidate_property;
  const candidatePropertiesParams = {};
  localCandidateProperties?.map((item, index) => {
    candidatePropertiesParams[`candidate_property[${index}][uuid]`] = item.uuid;
    candidatePropertiesParams[`candidate_property[${index}][value]`]
      = typeof item.value === 'string' ? item.value : item.value;
    return undefined;
  });
  const localDynamicCandidateProperties = [
    ...(toSaveFilter?.dynamic_properties || []),
  ];
  if (toSaveFilter?.dynamic_properties) delete toSaveFilter?.dynamic_properties;
  const dynamicCandidatePropertiesParams = {};
  localDynamicCandidateProperties
    ?.filter((item) => item?.value?.length > 0)
    .map((item, index) => {
      dynamicCandidatePropertiesParams[`dynamic_properties[${index}][uuid]`]
        = item.uuid;
      dynamicCandidatePropertiesParams[`dynamic_properties[${index}][value]`]
        = item.value;
      return undefined;
    });

  const tagsParams = {};
  tags
    ?.filter((item) => item)
    ?.map((item, idx) => {
      tagsParams[`tag[${idx}][key]`] = item.key;
      tagsParams[`tag[${idx}][value]`]
        = typeof item.value === 'string'
          ? [item.value]
          : item.value?.map((val) => val?.uuid);
      return undefined;
    });

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${
      process.env.REACT_APP_VERSION_API
    }/pre-approval?${queryList.join('&')}`,
    {
      params: {
        with_than,
        ...(toSaveFilter || {}),
        ...tagsParams,
        ...candidatePropertiesParams,
        ...dynamicCandidatePropertiesParams,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetApprovalById = async ({ uuid }) => {
  const queryList = [];
  if (uuid) queryList.push(`pre_candidate_approval_uuid=${uuid}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${
      process.env.REACT_APP_VERSION_API
    }/pre-approval/view-approval?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const ApprovalUpdateAssignedUser = async ({
  pre_candidate_uuid,
  assigned_user_type,
  assigned_user_uuid,
}) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/pre-approval/candidate/assigned`,
    {
      pre_candidate_uuid,
      assigned_user_type,
      assigned_user_uuid: assigned_user_uuid?.user_uuid || assigned_user_uuid,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetApprovalEvaluations = async ({
  pre_candidate_approval_uuid,
  category_code,
}) => {
  const queryList = [];
  if (pre_candidate_approval_uuid)
    queryList.push(`pre_candidate_approval_uuid=${pre_candidate_approval_uuid}`);
  if (category_code) queryList.push(`category_code=${category_code}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${
      process.env.REACT_APP_VERSION_API
    }/recruiter-form?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateApprovalEvaluation = async (
  { pre_candidate_uuid, category_code },
  body,
) => {
  const queryList = [];
  if (pre_candidate_uuid) queryList.push(`pre_candidate_uuid=${pre_candidate_uuid}`);
  if (category_code) queryList.push(`category_code=${category_code}`);
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${
      process.env.REACT_APP_VERSION_API
    }/recruiter-form?${queryList.join('&')}`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllAppliedFor = async ({ pre_candidate_uuid, limit, page }) => {
  const queryList = [];
  if (pre_candidate_uuid) queryList.push(`uuid=${pre_candidate_uuid}`);
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/ats/${
      process.env.REACT_APP_VERSION_API
    }/candidate/jobs?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllApprovalAttachments = async ({ pre_candidate_approval_uuid }) => {
  const queryList = [];
  if (pre_candidate_approval_uuid)
    queryList.push(`pre_candidate_approval_uuid=${pre_candidate_approval_uuid}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${
      process.env.REACT_APP_VERSION_API
    }/pre-approval/candidate/attachment?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const SaveApprovalAttachment = async ({
  pre_candidate_approval_uuid,
  media_uuid,
}) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/pre-approval/candidate/attachment`,
    {
      media_uuid,
      pre_candidate_approval_uuid,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllApprovalTags = async ({ pre_candidate_approval_uuid }) => {
  const queryList = [];
  if (pre_candidate_approval_uuid)
    queryList.push(`pre_candidate_approval_uuid=${pre_candidate_approval_uuid}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${
      process.env.REACT_APP_VERSION_API
    }/pre-approval/candidate/tags?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

// export const AssignToPipeline = async ({ candidate_uuid }) => {
//   const queryList = [];
//   if (candidate_uuid) queryList.push(`candidate_uuid=${candidate_uuid}`);
//
//   const result = await HttpServices.get(
//     `${process.env.REACT_APP_DOMIN_API}/api/${
//       process.env.REACT_APP_VERSION_API
//     }/initial-approval/assign?${queryList.join('&')}`,
//   )
//     .then((data) => data)
//     .catch((error) => error.response);
//   return result;
// };

export const UpdateApprovalStatus = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/pre-approval/approval-status`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllApprovalSteps = async ({ pre_candidate_uuid, category_code }) => {
  const queryList = [];
  if (pre_candidate_uuid) queryList.push(`pre_candidate_uuid=${pre_candidate_uuid}`);
  if (category_code) queryList.push(`category_code=${category_code}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${
      process.env.REACT_APP_VERSION_API
    }/pre-approval/approval-steps?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
