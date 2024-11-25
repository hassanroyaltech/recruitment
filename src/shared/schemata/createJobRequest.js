/* Create Job Request Schema

Usage Example:
    Check 'src/shared/schemata/baseSchemata.js' for examples

*/
// Import Base Schemata
import { UUID, ArrayOfUUIDs, ArrayOfStrings, ArrayOfNumbers } from './baseSchemata';

// Import General Schemata
import { Advertise, LanguageProficiency } from './generalSchemata';

// Import yup validation
const yup = require('yup');

/* <-- Create Job Request Schema --> */
export const CreateJobRequestSchema = yup.object().shape({
  address: yup.string().nullable(),
  advertise: Advertise.nullable(),
  career_level_uuid: ArrayOfUUIDs.nullable(),
  city: yup.string().nullable(),
  country_uuid: UUID.nullable(),

  // Check
  deadline: yup.string().nullable(),

  degree_type: ArrayOfUUIDs.nullable(),
  departments: yup.array().nullable(),
  description: yup.string().nullable(),
  evaluation_uuid: yup.string().nullable(),
  from_date: yup.string().nullable(),
  gender: yup.string().nullable(),
  gpa: yup.number().nullable(),
  industry_uuid: ArrayOfUUIDs.nullable(),
  is_externally: yup.bool().nullable(),
  is_feature: yup.bool().nullable(),
  is_internally: yup.bool().nullable(),
  is_schedule: yup.bool().nullable(),
  language_proficiency: LanguageProficiency.nullable(),
  language_uuid: UUID.nullable(),
  lat: yup.string().nullable(),
  long: yup.string().nullable(),
  major_uuid: ArrayOfUUIDs.nullable(),
  max_salary: yup.number().nullable(),
  min_salary: yup.number().nullable(),
  nationality_uuid: ArrayOfUUIDs.nullable(),
  owns_a_car: yup.bool().nullable(),
  pipeline_uuid: UUID.nullable(),
  profile_builder_uuid: UUID.nullable(),
  questionnaire_uuid: UUID.nullable(),

  // Add custom validation for this one
  // ele-1245514
  reference_number: yup.string().nullable(),

  requirements: yup.string().nullable(),
  skills: ArrayOfStrings.nullable(),
  teams_invite: yup.array().nullable(),
  title: yup.string().required(),
  to_date: yup.string().nullable(),
  type_uuid: ArrayOfUUIDs.nullable(),
  visa_sponsorship: yup.bool().nullable(),
  willing_to_relocate: yup.bool().nullable(),
  willing_to_travel: yup.bool().nullable(),
  years_of_experience: ArrayOfNumbers.nullable(),
});
