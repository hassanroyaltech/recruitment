import { ManageApplicationsPermissions } from 'permissions';

export const PipelineDetailsSectionEnum = {
  Info: {
    key: 1,
    icon: 'fas fa-info',
    always_enabled: true,
  },
  Logs: {
    key: 2,
    icon: 'far fa-clock',
    permissionId: ManageApplicationsPermissions.ViewLogs.key,
  },
  Notes: {
    key: 3,
    icon: 'far fa-comment-alt',
    permissionId: ManageApplicationsPermissions.NotesEvaRecApplication.key,
  },
  Settings: {
    key: 4,
    icon: 'fas fa-cog',
    isDisabled: true,
    is_hidden: true,
    permissionId: '',
  },
  PipelineTasks: {
    key: 5,
    icon: 'fas fa-random',
    is_hidden: true,
    permissionId: '',
  },
};
