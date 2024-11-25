import { sendRequest } from './api';

export async function getAllActiveJobs(type, sizePerPage, page) {
  return sendRequest(type, 'GET', {
    limit: sizePerPage,
    page,
  });

  //   const requestOptions = {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Accept: 'application/json',
  //       'Accept-Language': lang,
  //       'Accept-Company': localStorage.getItem('company_id'),
  //       Authorization: `Bearer ${user.token}`,
  //     },
  //     params: {
  //       limit: sizePerPage,
  //       page: page,
  //     },
  //   };

  //   const response = await fetch(type, requestOptions);
  //   return await response.json();
}

export async function DeleteJob(uuid, type) {
  return sendRequest(type, 'PUT', {
    uuid,
  });

  //   const requestOptions = {
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Accept: 'application/json',
  //       'Accept-Language': lang,
  //       'Accept-Company': localStorage.getItem('company_id'),
  //       Authorization: `Bearer ${user.token}`,
  //     },
  //     body: JSON.stringify({
  //       uuid: uuid,
  //     }),
  //   };

  //   const response = await fetch(type, requestOptions);
  //   return await response.json();
}
