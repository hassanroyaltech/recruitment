import axios from 'axios';
import JobBoard from 'utils/JobBoard';
import urls from 'api/urls';
import { generateHeaders } from 'api/headers';

export async function sendQuestionnaire({
  prep_assessment_uuid,
  questionnaire_uuid,
  prep_assessment_candidate_uuid,
}) {
  return await axios.put(
    JobBoard.SEND_QUESTIONNAIRE,
    {
      prep_assessment_uuid,
      questionnaire_uuid,
      prep_assessment_candidate_uuid,
    },
    {
      headers: generateHeaders(),
    },
  );
}

export async function getQuestionnaires({ uuid }) {
  return await axios.get(JobBoard.VIEW_QUESTIONNAIRE, {
    headers: generateHeaders(),
    params: {
      uuid,
    },
  });
}
