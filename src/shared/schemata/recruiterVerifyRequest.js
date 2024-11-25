/* Recruiter Verify Request Schema - [Step 2]

Usage Example:
    Check 'src/shared/schemata/baseSchemata.js' for examples

*/
// Import yup validation
const yup = require('yup');

/* <-- Recruiter Verify Request Schema --> */
export const RecruiterVerifyRequestSchema = yup.object().shape({
  key: yup.string().required(),
});
