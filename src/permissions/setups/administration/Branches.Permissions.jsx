import { MainPermissionsTypesEnum } from '../../../enums';

export const BranchesPermissions = {
  SuperBranches: {
    key: '8675d48c9fc843a8bc2ce6d8292c5dfb',
  },
  AddBranches: {
    key: '6869780f03a440f48f16299c2ec541f4',
    type: MainPermissionsTypesEnum.Add.key,
  },
  UpdateBranches: {
    key: '2d452f1ec93d440cbfe342310769652f',
    type: MainPermissionsTypesEnum.Update.key,
  },
  DeleteBranches: {
    key: '5e89bafa8d15421dac0145ec6722cdea',
    type: MainPermissionsTypesEnum.Delete.key,
  },
  DeleteView: {
    key: '988a2efc883f49b089c63c28446ed3ad',
    type: MainPermissionsTypesEnum.Delete.key,
  },
};
