import axios from 'axios';
import { generateHeaders } from 'api/headers';
import RecuiterPreference from '../../../utils/RecuiterPreference';

export const CreateOffer = (params) =>
  axios.post(RecuiterPreference.OFFER_WRITE, params, {
    headers: generateHeaders(),
  });
export const UpdateOffer = (params) =>
  axios.put(RecuiterPreference.OFFER_WRITE, params, {
    headers: generateHeaders(),
  });

export const FindOffer = (uuid) =>
  axios.request(RecuiterPreference.OFFER_GET, {
    method: 'view',
    params: {
      uuid,
    },
    headers: generateHeaders(),
  });

export const DeleteOffer = (uuid) =>
  axios.delete(RecuiterPreference.OFFER_WRITE, {
    params: {
      uuid,
    },
    headers: generateHeaders(),
  });

export const getOfferData = (params) =>
  axios.get(RecuiterPreference.OFFER_GET, {
    params,
    headers: generateHeaders(),
  });
export const getOfferReferenceNumber = () =>
  axios.get(RecuiterPreference.OFFER_REFERENCE_NUMBER, {
    headers: generateHeaders(),
  });
