import axios from 'axios';
import urls from 'api/urls';
import { generateHeaders } from 'api/headers';

export const InviteCandidatesToAssessment = (
  prep_assessment_answer_uuid,
  user_invited,
  deadline,
  media_uuid,
  language_id,
) =>
  axios.put(
    urls.evassess.INVITE_CANDIDATE,
    {
      uuid: prep_assessment_answer_uuid,
      user_invited,
      deadline,
      media_uuid,
      language_id,
    },
    {
      headers: generateHeaders(),
    },
  );
export const shareCandidateProfile = (
  prep_assessment_candidates,
  recruiters_emails,
  assessment_uuid,
) =>
  axios.post(
    urls.evassess.SHARE_CANDIDATE,
    {
      prep_assessment_candidates,
      recruiters: recruiters_emails,
      assessment_uuid,
    },
    {
      headers: generateHeaders(),
    },
  );
export const getSharedCandidatesList = (key) =>
  axios.post(
    urls.evassess.VIEW_SHARED_CANDIDATE_WRITE,
    {
      key,
    },
    {
      headers: generateHeaders(),
    },
  );
