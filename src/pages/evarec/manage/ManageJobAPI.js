import JobBoard from '../../../utils/JobBoard';
import { generateHeaders } from '../../../api/headers';

export async function getRMSJobs(limit) {
  const requestOptions = {
    method: 'GET',
    headers: generateHeaders(),
    params: {
      limit,
    },
  };

  const response = await fetch(JobBoard.RMS_JOBS_LIST, requestOptions);
  return await response.json();
}
export async function DeleteJob(uuid, type) {
  const requestOptions = {
    method: 'PUT',
    headers: generateHeaders(),
    body: JSON.stringify({
      uuid,
    }),
  };

  const response = await fetch(type, requestOptions);
  return await response.json();
}
