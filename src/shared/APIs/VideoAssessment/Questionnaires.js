import axios from 'axios';
import urls from 'api/urls';
import { generateHeaders } from 'api/headers';
import { PipelineBulkSelectTypesEnum } from '../../../enums';

export const SendQuestionnaireToCandidate = (
  prep_assessment_uuid,
  questionnaire_uuid,
  prep_assessment_candidate_uuid,
  deadline,
) =>
  axios.put(
    urls.evassess.SEND_QUESTIONNAIRE,
    {
      prep_assessment_uuid,
      questionnaire_uuid,
      prep_assessment_candidate_uuid,
      deadline,
    },
    {
      headers: generateHeaders(),
    },
  );

export const SendQuestionnaireJob = (
  job_uuid,
  questionnaire_uuid,
  candidate_uuid,
  deadline,
  pipeline_uuid,
) =>
  axios.put(
    urls.evarec.ats.SEND_QUESTIONNAIRE,
    {
      job_uuid,
      questionnaire_uuid,
      candidate_uuid: (candidate_uuid || []).map((item) => ({
        type: PipelineBulkSelectTypesEnum.Candidate.key,
        uuid: item,
      })),
      deadline,
      pipeline_uuid,
    },
    {
      headers: generateHeaders(),
    },
  );
export const getQuestionnairesListByPipeline = (pipeline_uuid) =>
  axios.get(urls.questionnaire.LIST_BY_PIPELINE, {
    headers: generateHeaders(),
    params: {
      pipeline_uuid,
    },
  });
