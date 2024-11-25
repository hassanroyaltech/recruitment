import axios from 'axios';
import { generateHeaders } from 'api/headers';

export const getCandidateEvaluation = (url, params) =>
  axios.get(url, {
    params,
    headers: generateHeaders(),
  });

export const addEvaluation = (url, params) =>
  axios.post(url, params, {
    headers: generateHeaders(),
  });
