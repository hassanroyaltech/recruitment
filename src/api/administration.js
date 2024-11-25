import axios from 'api/middleware';
import urls from './urls';
import { generateHeaders } from './headers';

/**
 * Gets the url to redirect to
 * @returns {Promise<AxiosResponse<any>>}
 */
const getIntegrationsURL = async () => axios.get(urls.administration.integrations, {
  headers: generateHeaders(),
});

/**
 * Gets all billing plans data
 * @returns {Promise<AxiosResponse<any>>}
 */
const GetAllServices = async () => axios.get(urls.administration.services, {
  headers: generateHeaders(),
});

/**
 * Check service action
 * @returns {Promise<AxiosResponse<any>>}
 */
const CheckServicesAction = async (serviceUuid) => axios.post(
  urls.administration.checkAction,
  {
    service_uuid: serviceUuid,
  },
  {
    headers: generateHeaders(),
  },
);

/**
 * Gets check out data
 * @returns {Promise<AxiosResponse<any>>}
 */
const GetCheckOutData = async (serviceUuid, type) => axios.post(
  urls.administration.checkOut,
  {
    service_uuid: serviceUuid,
    type,
  },
  {
    headers: generateHeaders(),
  },
);

/**
 * Gets check out product
 * @returns {Promise<AxiosResponse<any>>}
 */
const GetCheckOutProductData = async (relation, relation_data) => axios.post(
  urls.administration.checkOutProduct,
  {
    relation,
    relation_data,
  },
  {
    headers: generateHeaders(),
  },
);

/**
 * Gets check out offline
 * @returns {Promise<AxiosResponse<any>>}
 */
const CheckOutOffline = async (body) => axios.post(
  urls.administration.checkOut,
  {
    ...body,
  },
  {
    headers: generateHeaders(),
  },
);

/**
 * Cancel offline plan
 * @returns {Promise<AxiosResponse<any>>}
 */
const CancelOfflinePlan = async (serviceUuid) => axios.delete(urls.administration.checkOut, {
  headers: generateHeaders(),
  params: {
    service_uuid: serviceUuid,
  },
});

/**
 * Cancel offline plan
 * @returns {Promise<AxiosResponse<any>>}
 */
const CancelDowngradePlan = async (serviceUuid) => axios.post(urls.administration.cancelDowngrade,
  {
    service_uuid: serviceUuid,
  },
  {
    headers: generateHeaders(),
  });

/**
 * Gets all transactions data
 * @returns {Promise<AxiosResponse<any>>}
 */
const GetAllTransactions = async (pageIndex, transactionId) => axios.get(
  `${urls.administration.transactions}?page=${pageIndex}&transaction_id=${transactionId}`,
  {
    headers: generateHeaders(),
  },
);

/**
 * Gets all transactions data
 * @returns {Promise<AxiosResponse<any>>}
 */
const GetAllFilteredTransactions = async (pageIndex, rowsPerPage, orderBy, transactionId) => axios.get(
  `${urls.administration.transactions}?page=${pageIndex}&limit=${rowsPerPage}&order_by=${orderBy}&transaction_id=${transactionId}`,
  {
    headers: generateHeaders(),
  },
);

/**
 * Verify Transaction
 * @returns {Promise<AxiosResponse<any>>}
 */
const VerifyTransaction = async (order_id, campaign_uuid) => {
  const localBody = {
    order_id,
  };
  if (campaign_uuid) localBody.campaign_uuid = campaign_uuid;
  return axios.post(urls.administration.verifyTransactions, localBody, {
    headers: generateHeaders(),
  });
};

/**
 * Gets Current plan data
 * @returns {Promise<AxiosResponse<any>>}
 */
const GetCurrentPlan = async (payload) => axios.get(`${urls.administration.currentPlan}`, {
  headers: generateHeaders(payload),
});

/**
 * Cancel Subscription
 * @returns {Promise<AxiosResponse<any>>}
 */
const CancelSubscription = async (service_uuid) => axios.delete(urls.administration.cancelSubscription, {
  headers: generateHeaders(),
  params: {
    service_uuid,
  },
});

/**
 * Stop Subscription
 * @returns {Promise<AxiosResponse<any>>}
 */
const StopSubscription = async (service_uuid) => axios.post(
  urls.administration.reverseSubscription,
  {
    service_uuid,
  },
  {
    headers: generateHeaders(),
  },
);

export const administrationAPI = {
  GetAllServices,
  GetCurrentPlan,
  CheckOutOffline,
  GetCheckOutData,
  StopSubscription,
  CancelOfflinePlan,
  VerifyTransaction,
  getIntegrationsURL,
  CancelSubscription,
  GetAllTransactions,
  CancelDowngradePlan,
  CheckServicesAction,
  GetCheckOutProductData,
  GetAllFilteredTransactions,
};
