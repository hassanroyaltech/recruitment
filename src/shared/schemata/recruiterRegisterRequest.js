/* Recruiter Register Request Schema - [Step 1]

Usage Example:
    Check 'src/shared/schemata/baseSchemata.js' for examples

*/
// Import yup validation
const yup = require('yup');

/* <-- Recruiter Register Request Schema --> */
export const RecruiterRegisterRequestSchema = yup.object().shape({
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  email: yup.string().required(),
  company_name: yup.string().required(),
  plan_id: yup.number().required(),
});
