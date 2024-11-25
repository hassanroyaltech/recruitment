import { MainPermissionsTypesEnum } from '../../enums';

export const EvaluationsPermissions = {
  SuperEvaluationForms: {
    key: '894b496e43a64ee0926ef23f49ededf1',
  },
  AddNewEvaluationForms: {
    key: '797ac1d1f66c4e6488ac3726ee6cc7d3',
    type: MainPermissionsTypesEnum.Add.key,
  },
  UpdateEvaluationForms: {
    key: '46a8c8d445c44128aaff5197862038f9',
    type: MainPermissionsTypesEnum.Update.key,
  },
  DeleteEvaluationForms: {
    key: 'c8f8a7c3b4ae41c188db12f6b3ec7047',
    type: MainPermissionsTypesEnum.Delete.key,
  },
  ViewEvaluationForms: {
    key: '6454aa21be224ad6a88446d6fbf0a881',
    type: MainPermissionsTypesEnum.View.key,
  },
  IndexEvaluationForms: {
    key: '58e810d297b948378fc15110cb21c0c5',
    type: MainPermissionsTypesEnum.View.key,
  },
};
