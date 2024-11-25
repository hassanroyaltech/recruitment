import { HttpServices } from '../helpers';

export const GetSemantica = async ({ assessment_candidate_uuid }) =>
  await HttpServices.get(
    `${process.env.REACT_APP_SEMANTICA_API}/semantica/`,

    {
      params: { assessment_candidate_uuid },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const SemanticaMentionedKeywords = async ({
  answer_uuid,
  word_limit = 300,
  regenerate = false,
}) =>
  await HttpServices.post(
    `${process.env.REACT_APP_SEMANTICA_API}/semantica/mentioned_keywords`,

    {
      answer_uuid,
      word_limit,
      regenerate,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const SemanticaCandidateResponseRate = async ({
  answer_uuid,
  word_limit = 300,
  regenerate = false,
}) =>
  await HttpServices.post(
    `${process.env.REACT_APP_SEMANTICA_API}/semantica/candidate_response_rate`,

    {
      answer_uuid,
      word_limit,
      regenerate,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const SemanticaLanguageProficiency = async ({
  answer_uuid,
  word_limit = 300,
  regenerate = false,
}) =>
  await HttpServices.post(
    `${process.env.REACT_APP_SEMANTICA_API}/semantica/language_proficiency`,

    {
      answer_uuid,
      word_limit,
      regenerate,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
export const SemanticaInterestGauge = async ({
  answer_uuid,
  word_limit = 300,
  regenerate = false,
}) =>
  await HttpServices.post(
    `${process.env.REACT_APP_SEMANTICA_API}/semantica/interest_gauge`,

    {
      answer_uuid,
      word_limit,
      regenerate,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const SemanticaProfanity = async ({
  answer_uuid,
  word_limit = 300,
  regenerate = false,
}) =>
  await HttpServices.post(
    `${process.env.REACT_APP_SEMANTICA_API}/semantica/profanity`,

    {
      answer_uuid,
      word_limit,
      regenerate,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const SemanticaModelAnswer = async ({
  answer_uuid,
  word_limit = 300,
  regenerate = false,
}) =>
  await HttpServices.post(
    `${process.env.REACT_APP_SEMANTICA_API}/semantica/model_answer`,

    {
      answer_uuid,
      word_limit,
      regenerate,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
export const SemanticaAnswerSummarization = async ({
  answer_uuid,
  word_limit = 300,
  regenerate = false,
}) =>
  await HttpServices.post(
    `${process.env.REACT_APP_SEMANTICA_API}/semantica/summarization`,

    {
      answer_uuid,
      word_limit,
      regenerate,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
export const GetSemanticaAssessmentSummary = async ({ assessment_candidate_uuid }) =>
  await HttpServices.get(
    `${process.env.REACT_APP_SEMANTICA_API}/semantica/candidate/`,

    {
      params: { assessment_candidate_uuid },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
export const GenerateSemanticaAssessmentSummary = async (body) =>
  await HttpServices.post(
    `${process.env.REACT_APP_SEMANTICA_API}/semantica/candidate/summarization`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
