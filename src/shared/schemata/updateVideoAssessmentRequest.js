/* Update Video Assessment Request Schema

Usage Example:
    Check 'src/shared/schemata/baseSchemata.js' for examples

*/
// Import Base Schemata
import { UUID } from './baseSchemata';

// Import CreateJobRequestSchema
import { CreateVideoAssessmentRequestSchema } from './createVideoAssessmentRequest';

// Import yup validation
const yup = require('yup');

// Create the UpdateVideoAssessmentRequestSchema by constructing a UUID object and then concatenating it to
// to the CreateVideoAssessmentRequestSchema
const UUIDSchema = yup.object().shape({
  uuid: UUID.required(),
});

// Perform the concatenation
const UpdateVideoAssessmentRequestSchema = UUIDSchema.concat(
  CreateVideoAssessmentRequestSchema,
);

export { UpdateVideoAssessmentRequestSchema };
