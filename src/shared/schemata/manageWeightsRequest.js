/* Manage Weights Request Schema

Usage Example:
    Check 'src/shared/schemata/baseSchemata.js' for examples

*/
// Import Base Schemata
import { UUID } from './baseSchemata';

// Import yup validation
const yup = require('yup');

/* <-- Manage Weights Request Schema --> */
export const ManageWeightsRequestSchema = yup.object().shape({
  uuid: UUID.required(),
  career_level: yup.number().required(),
  degree_type: yup.number().required(),
  gender: yup.number().required(),
  geolocation: yup.number().required(),
  gpa: yup.number().required(),
  industry: yup.number().required(),
  job_type: yup.number().required(),
  languages: yup.number().required(),
  location: yup.number().required(),
  major: yup.number().required(),
  nationality: yup.number().required(),
  owns_a_vehicle: yup.number().required(),
  right_to_work: yup.number().required(),
  role: yup.number().required(),
  skillset: yup.number().required(),
  willing_to_relocate: yup.number().required(),
  willing_to_travel: yup.number().required(),
  years_of_experience: yup.number().required(),
});
