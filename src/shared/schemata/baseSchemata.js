/* Base Schemata are available here.

These include:
    - UUID
    - ArrayOfUUIDs
    - ArrayOfStrings
    - ArrayOfNumbers

Usage Examples:

    # If you want a full printout of the validation
    ArrayOfStrings
        .validate(ExampleArray)
        .then(function(valid) {
        });

    # If you want a boolean
    ArrayOfStrings
        .isValid(ExampleArray)
        .then(function(valid) {
        });

    *** The variable 'valid' will be either an object or a boolean depending on
        the above choice

 */
// Import yup validation
const yup = require('yup');

// UUID4 Regex
const UUIDRegex
  = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

// UUID object
const UUID = yup
  .string()
  .matches(UUIDRegex, 'UUID Version 4 is the required format.')
  .nullable();

// ArrayOfUUIDs object
const ArrayOfUUIDs = yup.array().of(UUID);

// ArrayOfStrings object
const ArrayOfStrings = yup.array().of(yup.string().nullable());

// ArrayOfNumbers object
const ArrayOfNumbers = yup.array().of(yup.number().nullable());

export { UUID, ArrayOfUUIDs, ArrayOfStrings, ArrayOfNumbers };
