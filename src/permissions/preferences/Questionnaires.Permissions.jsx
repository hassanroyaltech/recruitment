import { MainPermissionsTypesEnum } from '../../enums';

export const QuestionnairesPermissions = {
  SuperQuestionnaires: {
    key: '220f6b969ec94dbd9b8c02db5d4215f0',
  },
  AddQuestionnaires: {
    key: '19ee6159a424496caeab860e06ba19c9',
    type: MainPermissionsTypesEnum.Add.key,
  },
  UpdateQuestionnaires: {
    key: '89af7c8fb10f438096c30d1fea4f5489',
    type: MainPermissionsTypesEnum.Update.key,
  },
  DeleteQuestionnaires: {
    key: '2ea8266d69954cab8998333b69d30be6',
    type: MainPermissionsTypesEnum.Delete.key,
  },
  ViewQuestionnaires: {
    key: 'fc35c95ba6734652a57df1edfe49103c',
    type: MainPermissionsTypesEnum.View.key,
  },
  IndexQuestionnaires: {
    key: '3926bf662eda4a4eb2e02476e56c4f46',
  },
};
