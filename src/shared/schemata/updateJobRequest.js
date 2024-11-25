/* Update Job Request Schema

Usage Example:
    Check 'src/shared/schemata/baseSchemata.js' for examples

*/
// Import Base Schemata
import { UUID } from './baseSchemata';

// Import CreateJobRequestSchema
import { CreateJobRequestSchema } from './createJobRequest';

// Import yup validation
const yup = require('yup');

// Create the UpdateJobRequestSchema by constructing a UUID object and then concatenating it to
// to the CreateJobRequestSchema
const UUIDSchema = yup.object().shape({
  uuid: UUID.required(),
});

// Perform the concatenation
const UpdateJobRequestSchema = UUIDSchema.concat(CreateJobRequestSchema);

export { UpdateJobRequestSchema };
