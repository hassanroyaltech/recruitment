import axios from 'axios';
import urls from 'api/urls';
import { generateHeaders } from 'api/headers';

export const getVideosList = async (
  assessment_uuid,
  sortBy,
  query,
  question_uuid,
  page,
  limit,
) =>
  await axios.get(urls.evassess.VIDEOS_LIST, {
    headers: generateHeaders(),
    params: {
      uuid: assessment_uuid,
      sort_by: sortBy,
      query,
      question_uuid,
      page,
      limit,
    },
  });

export const addRating = async (rating, prep_assessment_answer_uuid) =>
  axios.post(
    urls.evassess.Rating_WRITE,
    {
      rate: rating,
      prep_assessment_answer_uuid,
    },
    {
      headers: generateHeaders(),
    },
  );
export const getRecruiterRating = async (
  recruiter_uuid,
  prep_assessment_answer_uuid,
) =>
  axios.get(
    urls.evassess.Rating_GET,

    {
      headers: generateHeaders(),
      params: {
        recruiter_uuid,
        prep_assessment_answer_uuid,
      },
    },
  );
