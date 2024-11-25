/* Recruiter Set Access Request Schema - [Step 3]

Usage Example:
    Check 'src/shared/schemata/baseSchemata.js' for examples

*/
// Import yup validation
const yup = require('yup');

/* <-- Recruiter Set Access Request Schema  --> */
export const RecruiterSetAccessRequestSchema = yup.object().shape({
  sub_domain: yup.string().required(),
  password: yup.string().required(),
  password_confirmation: yup.string().required(),
});
