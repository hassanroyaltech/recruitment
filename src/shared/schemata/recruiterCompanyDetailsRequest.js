/* Recruiter Company Details Request Schema - [Step 4]

Usage Example:
    Check 'src/shared/schemata/baseSchemata.js' for examples

*/
// Import Base Schemata
import { UUID } from './baseSchemata';

// Import yup validation
const yup = require('yup');

/* <-- Recruiter Company Details Request Schema --> */
export const RecruiterCompanyDetailsRequestSchema = yup.object().shape({
  company_name: yup.string().required(),
  web_site: yup.string().required(),
  city: yup.string().required(),
  mobile: yup.string().required(),
  country_id: UUID.required(),
  industry_id: UUID.required(),
  company_size_id: UUID.required(),
  about_us_id: UUID.required(),
});
