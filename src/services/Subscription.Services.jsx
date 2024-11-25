import { HttpServices } from '../helpers';

export const SubscriptionCheckoutProduct = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/subscription/checkout/product`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
