import axios from 'axios';
import { generateHeaders } from 'api/headers';

export const getNotesList = (url, params) =>
  axios.get(url, {
    headers: generateHeaders(),
    params,
  });

export const CreatNote = (url, params) =>
  axios.post(url, params, {
    headers: generateHeaders(),
  });
export const DeleteNote = (url, params) =>
  axios.delete(url, {
    params,
    headers: generateHeaders(),
  });
