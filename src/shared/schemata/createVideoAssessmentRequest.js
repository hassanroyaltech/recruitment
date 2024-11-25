/* Create Video Assessment Request Schema

Usage Example:
    Check 'src/shared/schemata/baseSchemata.js' for examples

*/
// Import Base Schemata
import { UUID, ArrayOfUUIDs, ArrayOfStrings, ArrayOfNumbers } from './baseSchemata';

// Import General Schemata
import {
  Advertise,
  LanguageProficiency,
  ArrayOfQuestions,
  ArrayOfUsers,
} from './generalSchemata';

// Import yup validation
const yup = require('yup');

/* <-- Create Video Assessment Request Schema --> */
export const CreateVideoAssessmentRequestSchema = yup.object().shape({
  language_id: UUID.required(),
  title: yup.string().required(),
  type: yup.number().required(),
  questions: ArrayOfQuestions,
  user_invited: ArrayOfUsers,
  email_subject: yup.string().required(),
  email_body: yup.string().required(),
  deadline: yup.string().required(),
  video_uuid: UUID.nullable(),
  media_uuid: UUID.nullable(),
  pipeline_uuid: UUID.nullable().required(),
  teams_invited: yup.array(),
  is_public: yup.bool().required(),
  category_uuid: UUID.required(),
});
