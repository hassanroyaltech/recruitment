import { GetIsFieldDisplayedHelper } from './GetIsFieldDisplayed.helper';

export const FlattenContractDetails = (data = []) => {
  const localData = {};
  data.forEach((field) => {
    localData[field.index] = {
      ...field,
      isActive: GetIsFieldDisplayedHelper(data, field),
    };
  });
  return localData;
};
