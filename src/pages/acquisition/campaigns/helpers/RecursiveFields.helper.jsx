const getEffectedItem = (field, key) => field.find((item) => item.index === key);

export const FlattenFields = (data) => {
  // Initialize an array to collect all field objects
  let flatFields = {};

  // Recursive function to extract fields from sections
  const extractFields = (fields, sectionIndex, parentIndex) => {
    fields.forEach((field, idx) => {
      // Check if the field object contains a 'fields' key
      if (field.fields)
        extractFields(field.fields, sectionIndex, idx); // Recursively extract fields
      else {
        const uniqueFieldKey = `${field.index}-${sectionIndex}-${
          parentIndex ?? ''
        }-${idx}`;
        flatFields[uniqueFieldKey] = {
          ...field,
          ...(field.less_than && {
            affectedByField: getEffectedItem(fields, field.less_than),
          }),
          isActive: true,
        };
      }
    });
  };
  data.forEach((section, index) => {
    extractFields(section.fields, index);
  });

  // Start the extraction with the top-level 'fields' key
  // extractFields(data.fields);

  // Return a new object with all fields flattened
  return flatFields;
};
