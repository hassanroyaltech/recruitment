/* eslint-disable max-len */
/**
 * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
 * @Description This method is to handle subscription
 */
// import { getDataFromObject } from './Middleware.Helper';

export const getIsAllowedSubscription = ({
  defaultServices, // This is the default list to compare
  // This is the subscriptions list that usually come from the reducer
  // or the backend must be an array of UUIDs
  subscriptions,
  serviceKey,
  slugId,
  allowEmptyService,
  slugKey = 'slug',
  statusKey = 'status',
  featuresKey = 'features',
  defaultServiceKey = 'key', // The key for the default permissions if the permissions type is enum (Object)
  remainingDaysKey = 'remaining_days', // The key for the default permissions if the permissions type is enum (Object)
}) => true;
// const localSubscriptionList = (typeof defaultServices === 'object'
//     && Object.values(defaultServices).map((item) => getDataFromObject(item, defaultServiceKey, true)))
//   || defaultServices
//   || [];
// return (
//   (allowEmptyService
//     && localSubscriptionList.length === 0
//     && !serviceKey
//     && !slugId)
//   || (slugId
//     && subscriptions
//     && subscriptions.some(
//       (subscription) => subscription[featuresKey]
//         && subscription[featuresKey].some(
//           (feature) => feature[slugKey] === slugId && feature[statusKey],
//         ),
//     ))
//   || (!slugId
//     && subscriptions
//     && subscriptions.some(
//       (subscription) => subscription[remainingDaysKey] > 0
//         && ((serviceKey && subscription.service === serviceKey)
//           || (!serviceKey && localSubscriptionList.includes(subscription.service))),
//     ))
// );
