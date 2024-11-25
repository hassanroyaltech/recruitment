import { MainPermissionsTypesEnum } from '../enums';

export const EvaMeetPermissions = {
  SuperEvaMeet: {
    key: '56f99994f0b24542a222f4360a698529',
  },
  AddEvaMeet: {
    key: '91045233e0504adc8545f61e95281b64',
    type: MainPermissionsTypesEnum.Add.key,
  },
  UpdateEvaMeet: {
    key: 'a311061395054f01979089613829279a',
    type: MainPermissionsTypesEnum.Update.key,
  },
  DeleteEvaMeet: {
    key: '70e7d6c8487d49e59e5176e0e615937d',
    type: MainPermissionsTypesEnum.Delete.key,
  },
  ViewEvaMeet: {
    key: '36b4a3468dd649c7a5ac7512aa600531',
    type: MainPermissionsTypesEnum.View.key,
  },
  ViewPreviouslyRecordedVideoInEvaMeet: {
    key: '5e5b3a19f07c4304a8a07a9b1dc11595',
    type: MainPermissionsTypesEnum.View.key,
  },
};
