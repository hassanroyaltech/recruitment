import axios from 'axios';
import { generateHeaders } from 'api/headers';

export const sendRequest = async (url, method, data) => {
  try {
    const result = await axios(url, {
      method,
      headers: generateHeaders(),
      data,
    });
    return result.data;
  } catch (error) {
    return error;
  }
};
