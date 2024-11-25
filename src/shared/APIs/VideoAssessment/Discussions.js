import { generateHeaders } from 'api/headers';

export const addNewDiscussion = async (url, params) => {
  try {
    const requestOptions = {
      method: 'POST',
      headers: generateHeaders(),
      body: JSON.stringify(params),
    };

    const response = await fetch(url, requestOptions);
    return await response.json();
  } catch (e) {
    return e;
  }
};
export const addDiscussionReply = async (url, params) => {
  const requestOptions = {
    method: 'PUT',
    headers: generateHeaders(),
    body: JSON.stringify(params),
  };

  const response = await fetch(url, requestOptions);
  return await response.json();
};
export const DeleteDiscussion = async (url, params) => {
  const requestOptions = {
    method: 'DELETE',
    headers: generateHeaders(),
    body: JSON.stringify(params),
  };

  const response = await fetch(url, requestOptions);
  return await response.json();
};
