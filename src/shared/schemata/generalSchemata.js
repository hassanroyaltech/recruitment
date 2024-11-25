/* General Schemata are available here. They make use of the Base Schemata.

These include:
    - Advertise
    - LanguageProficiency

Usage Example:
    Check 'src/shared/schemata/baseSchemata.js' for examples

 */
// Import Base Schemata
import { UUID, ArrayOfStrings } from './baseSchemata';

// Import yup validation
const yup = require('yup');

// Advertise object
const Advertise = yup.object().shape({
  free_job_board: yup.string().nullable(),
  providers: yup.array().nullable(),
});

// LanguageProficiency object
const LanguageProficiency = yup.array(
  yup.object().shape({
    score: yup.number().nullable(),
    uuid: UUID,
  }),
);

// Question object
const Question = yup.object().shape({
  title: yup.string().required(),
  time_limit: yup.string().required(),
  number_of_retake: yup.string().required(),
  model_answer: yup.string().nullable(),
  expected_keyword: ArrayOfStrings,
});

// ArrayOfQuestions object
const ArrayOfQuestions = yup.array().of(Question);

/* NOTE: The User object needs to be checked with API compatibility. */
// User object
const User = yup.object().shape({
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  email: yup.string().required(),
  phone: yup.string().required(),
});

// ArrayOfUsers object
const ArrayOfUsers = yup.array().of(User);

export {
  Advertise,
  LanguageProficiency,
  Question,
  ArrayOfQuestions,
  User,
  ArrayOfUsers,
};
