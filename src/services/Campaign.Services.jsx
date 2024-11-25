import { HttpServices } from '../helpers';
import { ReportsEnum } from '../enums';

export const GetAllUsersByName = async ({ search, limit, page }) => {
  const queryList = [];
  if (search) queryList.push(`search=${search}`);
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/ats/${
      process.env.REACT_APP_VERSION_API
    }/candidate/logs?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetAllCampaigns = async ({
  title,
  limit,
  page,
  status,
  order_by,
  created_by,
}) => {
  const queryList = [];
  if (title) queryList.push(`title=${title}`);
  if (order_by) queryList.push(`order_by=${order_by}`);
  if (created_by) queryList.push(`created_by=${created_by}`);
  if (status || status === 0) queryList.push(`status=${status}`);
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/campaign/${
      process.env.REACT_APP_VERSION_API
    }/list?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const CreateCampaign = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/campaign/${process.env.REACT_APP_VERSION_API}/campaign`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllChannels = async ({
  title,
  limit,
  page,
  order_by,
  industry_uuid,
  country_uuid,
  job_category_uuid,
  channel_type,
  job_title,
  has_credit,
}) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/campaign/${process.env.REACT_APP_VERSION_API}/channels`,
    {
      title,
      limit,
      page,
      order_by,
      industry_uuid,
      country_uuid,
      job_category_uuid,
      channel_type,
      job_title,
      has_credit,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetAllRecommendedChannels = async ({
  title,
  limit,
  page,
  job_uuid,
}) => {
  const queryList = [];
  if (title) queryList.push(`title=${title}`);
  if (job_uuid) queryList.push(`job_uuid=${job_uuid}`);
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/campaign/${
      process.env.REACT_APP_VERSION_API
    }/channels/recommended?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetAllConnectedChannels = async ({ limit, page }) => {
  const queryList = [];
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/campaign/${
      process.env.REACT_APP_VERSION_API
    }/channels/connected?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetCampaignById = async ({ campaign_uuid }) => {
  const queryList = [];
  if (campaign_uuid) queryList.push(`campaign_uuid=${campaign_uuid}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/campaign/${
      process.env.REACT_APP_VERSION_API
    }/campaign?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetReviewSavedData = async ({ campaign_uuid, review_type }) => {
  const queryList = [];
  if (campaign_uuid) queryList.push(`campaign_uuid=${campaign_uuid}`);
  if (review_type) queryList.push(`review_type=${review_type}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/campaign/${
      process.env.REACT_APP_VERSION_API
    }/review/fields?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const AddChannelsToCampaign = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/campaign/${process.env.REACT_APP_VERSION_API}/cart`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const DeleteChannelsFromCampaign = async (body) => {
  const result = await HttpServices.delete(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/campaign/${process.env.REACT_APP_VERSION_API}/cart`,
    {
      data: body,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetAllReviews = async ({ campaign_uuid, review_type }) => {
  const queryList = [];
  if (campaign_uuid) queryList.push(`campaign_uuid=${campaign_uuid}`);
  if (review_type) queryList.push(`review_type=${review_type}`);
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/campaign/${
      process.env.REACT_APP_VERSION_API
    }/review?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const SaveJobDetailsAndReview = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/campaign/${process.env.REACT_APP_VERSION_API}/review`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const SaveContractsDetails = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/campaign/${process.env.REACT_APP_VERSION_API}/review/contract/fields`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const CampaignRename = async ({ campaign_uuid, title }) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/campaign/${process.env.REACT_APP_VERSION_API}/campaign`,
    {
      campaign_uuid,
      title,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const CampaignCheckout = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/campaign/${process.env.REACT_APP_VERSION_API}/checkout`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const DeleteCampaign = async (body) => {
  const result = await HttpServices.delete(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/campaign/${process.env.REACT_APP_VERSION_API}/campaign`,
    {
      data: body,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetCampaignReport = async ({
  campaign_uuid,
  report_type = ReportsEnum.campaign.key,
}) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/campaign/${process.env.REACT_APP_VERSION_API}/report`,
    {
      campaign_uuid,
      report_type,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllChannelsTaxonomyIndustry = async ({ limit, page }) => {
  const queryList = [];
  if (limit) queryList.push(`limit=${limit}`);
  if (page) queryList.push(`page=${page}`);
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/campaign/${
      process.env.REACT_APP_VERSION_API_V2
    }/taxonomy/industry?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetAllChannelsTaxonomyCategories = async ({ limit, page }) => {
  const queryList = [];
  if (limit) queryList.push(`limit=${limit}`);
  if (page) queryList.push(`page=${page}`);
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/campaign/${
      process.env.REACT_APP_VERSION_API_V2
    }/taxonomy/category?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllChannelsTaxonomyJobs = async ({ limit, page, title }) => {
  const queryList = [];
  if (limit) queryList.push(`limit=${limit}`);
  if (page) queryList.push(`page=${page}`);
  if (title) queryList.push(`title=${title}`);
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/campaign/${
      process.env.REACT_APP_VERSION_API_V2
    }/taxonomy/job-title?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetAllChannelsTaxonomyLocations = async ({ limit, page, title }) => {
  const queryList = [];
  if (limit) queryList.push(`limit=${limit}`);
  if (page) queryList.push(`page=${page}`);
  if (title) queryList.push(`title=${title}`);
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/campaign/${
      process.env.REACT_APP_VERSION_API_V2
    }/taxonomy/location?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetAllChannelsTaxonomyBusinessModel = async ({
  limit,
  page,
  title,
}) => {
  const queryList = [];
  if (limit) queryList.push(`limit=${limit}`);
  if (page) queryList.push(`page=${page}`);
  if (title) queryList.push(`title=${title}`);
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/campaign/${
      process.env.REACT_APP_VERSION_API_V2
    }/taxonomy/business_model?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetAllChannelsTaxonomyCurrency = async ({ limit, page, title }) => {
  const queryList = [];
  if (limit) queryList.push(`limit=${limit}`);
  if (page) queryList.push(`page=${page}`);
  if (title) queryList.push(`title=${title}`);
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/campaign/${
      process.env.REACT_APP_VERSION_API_V2
    }/taxonomy/currencies?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetAllChannelsV2 = async ({
  title,
  limit,
  page,
  order_by,
  has_credit,
  industry_id,
  job_title_id,
  category_id,
  exact_location_id,
  include_location_id,
  business_model,
  currency,
  duration_from,
  duration_to,
  mc_enabled,
  recommended,
  exclude_recommended,
}) => {
  const queryList = [];
  if (limit) queryList.push(`limit=${limit}`);
  queryList.push(`page=${page}`);
  if (title) queryList.push(`title=${title}`);
  if (order_by) queryList.push(`order_by=${order_by}`);
  if (exact_location_id) queryList.push(`exact_location_id=${exact_location_id}`);
  if (include_location_id)
    queryList.push(`include_location_id=${include_location_id}`);
  if (industry_id) queryList.push(`industry_id=${industry_id}`);
  if (job_title_id) queryList.push(`job_title_id=${job_title_id}`);
  if (business_model) queryList.push(`business_model=${business_model}`);
  if (category_id) queryList.push(`category_id=${category_id}`);
  if (currency) queryList.push(`currency=${currency}`);
  if (duration_from || duration_from === 0)
    queryList.push(`duration_from=${duration_from}`);
  if (duration_to || duration_to === 0) queryList.push(`duration_to=${duration_to}`);
  if (typeof has_credit === 'boolean') queryList.push(`has_credit=${has_credit}`);
  if (typeof mc_enabled === 'boolean') queryList.push(`mc_enabled=${mc_enabled}`);
  if (typeof recommended === 'boolean') queryList.push(`recommended=${recommended}`);
  if (typeof exclude_recommended === 'boolean')
    queryList.push(`exclude_recommended=${exclude_recommended}`);
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/campaign/${
      process.env.REACT_APP_VERSION_API_V2
    }/channel?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const ByChannelsCreditsV2 = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/campaign/${process.env.REACT_APP_VERSION_API_V2}/channel/buy`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const VerifyTransactionV2 = async (order_id, campaign_uuid) => {
  const localBody = {
    order_id,
  };
  if (campaign_uuid) localBody.campaign_uuid = campaign_uuid;
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/account/transaction/verify`,
    localBody,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllChannelsCredit = async ({
  title,
  limit,
  page,
  order_by,
  has_credit,
  location_id,
  industry_id,
  job_title_id,
  category_id,
}) => {
  const queryList = [];
  if (limit) queryList.push(`limit=${limit}`);
  if (page) queryList.push(`page=${page}`);
  if (title) queryList.push(`title=${title}`);
  if (order_by) queryList.push(`order_by=${order_by}`);
  if (location_id) queryList.push(`location_id=${location_id}`);
  if (industry_id) queryList.push(`industry_id=${industry_id}`);
  if (job_title_id) queryList.push(`job_title_id=${job_title_id}`);
  if (category_id) queryList.push(`category_id=${category_id}`);
  if (typeof has_credit === 'boolean') queryList.push(`has_credit=${has_credit}`);
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/campaign/${
      process.env.REACT_APP_VERSION_API_V2
    }/channel/credit?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllRecommendedChannelsV2 = async ({
  title,
  limit,
  page,
  job_uuid,
}) => {
  const queryList = [];
  if (title) queryList.push(`title=${title}`);
  if (job_uuid) queryList.push(`job_uuid=${job_uuid}`);
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/campaign/${
      process.env.REACT_APP_VERSION_API_V2
    }/operation/recommended?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetAllCampaignsV2 = async ({
  title,
  limit,
  page,
  status,
  order_by,
  created_by,
  company_uuid,
}) => {
  const queryList = [];
  if (title) queryList.push(`title=${title}`);
  if (company_uuid) queryList.push(`company_uuid=${company_uuid}`);
  if (order_by) queryList.push(`order_by=${order_by}`);
  if (created_by) queryList.push(`created_by=${created_by}`);
  if (status || status === 0) queryList.push(`status=${status}`);
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/campaign/${
      process.env.REACT_APP_VERSION_API_V2
    }/operation?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetSavedDataForCampaign = async ({ campaign_uuid }) => {
  const queryList = [];
  if (campaign_uuid) queryList.push(`campaign_uuid=${campaign_uuid}`);
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/campaign/${
      process.env.REACT_APP_VERSION_API_V2
    }/operation/view?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const CreateCampaignV2 = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/campaign/${process.env.REACT_APP_VERSION_API_V2}/operation`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const DeleteCampaignV2 = async (body) => {
  const result = await HttpServices.delete(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/campaign/${process.env.REACT_APP_VERSION_API_V2}/operation`,
    { data: body },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const AddChannelsToCampaignV2 = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/campaign/${process.env.REACT_APP_VERSION_API_V2}/operation/channel`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const AddContractToCampaignV2 = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/campaign/${process.env.REACT_APP_VERSION_API_V2}/operation/contract`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetAllReviewsV2 = async ({ campaign_uuid }) => {
  const queryList = [];
  if (campaign_uuid) queryList.push(`campaign_uuid=${campaign_uuid}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/campaign/${
      process.env.REACT_APP_VERSION_API_V2
    }/operation/fields?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const SaveCampaignDetails = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/campaign/${process.env.REACT_APP_VERSION_API_V2}/operation/fields`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const CheckCampaignDetails = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/campaign/${process.env.REACT_APP_VERSION_API_V2}/operation/processed`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const CampaignCheckoutV2 = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/campaign/${process.env.REACT_APP_VERSION_API_V2}/operation/pushed`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetCampaignReportV2 = async ({ campaign_uuid }) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/campaign/${process.env.REACT_APP_VERSION_API_V2}/operation/status`,
    {
      params: { campaign_uuid },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const CampaignRenameV2 = async ({ campaign_uuid, title }) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/campaign/${process.env.REACT_APP_VERSION_API_V2}/operation`,
    {
      campaign_uuid,
      title,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
