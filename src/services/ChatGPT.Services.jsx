import { HttpServices } from '../helpers';

export const GPTGenerateAssessment = async ({
  job_title,
  year_of_experience,
  word_limit,
  regenerate = true,
  is_with_keywords,
  is_with_model_answer,
  language,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_AI_API}/gpt/generate/technical_assessment`,
    {
      params: {
        job_title,
        word_limit,
        regenerate,
        is_with_keywords,
        is_with_model_answer,
        language,
        ...((year_of_experience || year_of_experience === 0) && {
          year_of_experience,
        }),
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GPTGenerateEmailTemplate = async ({
  purpose,
  word_limit,
  regenerate = true,
  language,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_AI_API}/gpt/generate/email_template`,
    {
      params: {
        purpose,
        word_limit,
        regenerate,
        language,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GPTGenerateModelAnswer = async ({
  question,
  word_limit,
  regenerate = true,
  language,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_AI_API}/gpt/generate/model_answer`,
    {
      params: {
        question,
        word_limit,
        regenerate,
        language,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GPTGenerateExpectedKeywords = async ({
  question,
  word_limit,
  regenerate = true,
  language,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_AI_API}/gpt/generate/expected_keywords`,
    {
      params: {
        question,
        word_limit,
        regenerate,
        language,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GPTGenerateQuestionnaire = async ({
  job_title,
  year_of_experience,
  word_limit,
  regenerate = true,
  is_with_keywords = false,
  is_with_model_answer = false,
  language,
  number_of_questions = 1,
  type,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_AI_API}/gpt/generate/questionnaire`,
    {
      params: {
        job_title,
        word_limit,
        type,
        regenerate,
        is_with_keywords,
        is_with_model_answer,
        number_of_questions,
        language,
        ...((year_of_experience || year_of_experience === 0) && {
          year_of_experience,
        }),
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GPTGenerateEvaluation = async ({
  job_title,
  year_of_experience,
  word_limit,
  regenerate = true,
  language,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_AI_API}/gpt/generate/evaluation`,
    {
      params: {
        job_title,
        year_of_experience,
        word_limit,
        regenerate,
        language,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GPTAutoFillJobPost = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_AI_API}/gpt/autofill/post`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GPTGenerateJobDescription = async ({
  job_title,
  year_of_experience,
  word_limit,
  regenerate = true,
  language,
  only_description = true,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_AI_API}/gpt/generate/job_description`,
    {
      params: {
        job_title,
        word_limit,
        regenerate,
        language,
        only_description,
        ...((year_of_experience || year_of_experience === 0) && {
          year_of_experience,
        }),
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GPTGenerateJobRequirements = async ({
  job_title,
  year_of_experience,
  word_limit,
  regenerate = true,
  language,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_AI_API}/gpt/generate/job_requirements`,
    {
      params: {
        job_title,
        word_limit,
        regenerate,
        language,
        ...((year_of_experience || year_of_experience === 0) && {
          year_of_experience,
        }),
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GPTOptimizeJobDescription = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_AI_API}/gpt/optimize/job_description`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GPTOptimizeJobRequirements = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_AI_API}/gpt/optimize/job_requirements`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
