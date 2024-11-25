// all functions are moved to api/preferences

import axios from 'axios';
import { generateHeaders } from 'api/headers';
import RecuiterPreference from '../../../utils/RecuiterPreference';

export const CreateEvaluation = (params) =>
  axios.post(RecuiterPreference.EVALUATION_WRITE, params, {
    headers: generateHeaders(),
  });
export const UpdateEvaluation = (params) =>
  axios.put(RecuiterPreference.EVALUATION_WRITE, params, {
    headers: generateHeaders(),
  });

export const FindEvaluation = (uuid) =>
  axios.request(RecuiterPreference.EVALUATION_GET, {
    method: 'view',
    params: {
      uuid,
    },
    headers: generateHeaders(),
  });

export const DeleteEvaluation = (uuid) =>
  axios.delete(RecuiterPreference.EVALUATION_WRITE, {
    params: {
      uuid,
    },
    headers: generateHeaders(),
  });

export const getEvaluationData = (params) =>
  axios.get(RecuiterPreference.EVALUATION_GET, {
    params,
    headers: generateHeaders(),
  });
