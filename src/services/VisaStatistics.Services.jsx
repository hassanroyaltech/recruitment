import { HttpServices } from '../helpers';

export const GetAllVisaStatistics = async ({ company, is_expired = false }) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_VISA_API}/dashboard-statistics`,
    {
      params: {
        company,
        is_expired,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
