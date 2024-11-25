import axios from 'axios';
import urls from 'api/urls';
import { generateHeaders } from 'api/headers';

export const getAssessmentPipeline = (
  prep_assessment_uuid,
  filters,
  page = 1,
  limit = 30,
) =>
  axios.get(urls.evassess.PIPELINE, {
    headers: generateHeaders(),
    params: {
      uuid: prep_assessment_uuid,
      limit,
      page,
      query: filters?.query || null,
      applied_date: filters?.applied_date || null,
      is_completed: filters?.completeness?.id,
      candidate_order_by: filters?.sort?.candidate_order_by,
      order_by: filters?.sort?.order_by,
      language_proficiency: filters?.language_proficiency,
    },
  });

export const OrderStages = (prep_assessment_uuid, stage_uuid) =>
  axios.put(
    urls.evassess.STAGE_ORDER,
    {
      prep_assessment_uuid,
      uuid: stage_uuid,
    },
    {
      headers: generateHeaders(),
    },
  );

export const MoveCandidateStage = (
  prep_assessment_uuid,
  prep_assessment_stage_uuid,
  prep_assessment_candidate_uuid,
) =>
  axios.put(
    urls.evassess.MOVE_STAGE,
    {
      prep_assessment_uuid,
      prep_assessment_stage_uuid,
      prep_assessment_candidate_uuid,
    },
    {
      headers: generateHeaders(),
    },
  );
export const MoveCandidateStageAction = (move_id, action, is_completed) =>
  axios.put(
    urls.evassess.MOVE_STAGE,
    {
      move_id,
      action: true,
      is_completed,
    },
    {
      headers: generateHeaders(),
    },
  );
