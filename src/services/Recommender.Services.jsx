import { HttpServices } from '../helpers';

export const GetProfileRecommendation = async ({ profile_uuid, job_uuid }) =>
  await HttpServices.post(
    `${process.env.REACT_APP_AI_API}/recommender/gpt/profile`,

    {
      profile_uuid,
      job_uuid,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetResumeRecommendation = async ({ media_uuid, job_uuid }) =>
  await HttpServices.post(
    `${process.env.REACT_APP_AI_API}/recommender/gpt/resume`,

    {
      media_uuid,
      job_uuid,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetCandidateSectionRecommendation = async ({
  user_uuid,
  profile_language_uuid,
  job_uuid,
  word_limit = 2500,
  regenerate = false,
  sectionName,
}) =>
  await HttpServices.post(
    `${process.env.REACT_APP_AI_API}/recommender/candidate/${sectionName}`,

    {
      user_uuid,
      profile_language_uuid,
      job_uuid,
      word_limit,
      regenerate,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetResumeSectionRecommendation = async ({
  job_uuid,
  media_uuid,
  word_limit = 2500,
  regenerate = false,
  sectionName,
}) =>
  await HttpServices.post(
    `${process.env.REACT_APP_AI_API}/recommender/resume/${sectionName}`,

    {
      job_uuid,
      media_uuid,
      word_limit,
      regenerate,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const AddResumeToPipeline = async ({ job_uuid, stage_uuid, items }) =>
  await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/rms/${process.env.REACT_APP_VERSION_API}/add-ats`,

    {
      job_uuid,
      stage_uuid,
      items,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GenerateFullProfileRecommendation = async ({
  user_uuid,
  profile_language_uuid,
  job_uuid,
  word_limit = 2500,
  regenerate = false,
}) =>
  await HttpServices.post(
    `${process.env.REACT_APP_AI_API}/recommender/candidate/push`,

    {
      user_uuid,
      profile_language_uuid,
      job_uuid,
      word_limit,
      regenerate,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GenerateFullResumeRecommendation = async ({
  media_uuid,
  job_uuid,
  word_limit = 2500,
  regenerate = false,
}) =>
  await HttpServices.post(
    `${process.env.REACT_APP_AI_API}/recommender/resume/push`,

    {
      media_uuid,
      job_uuid,
      word_limit,
      regenerate,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
