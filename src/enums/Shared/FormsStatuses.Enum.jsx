import { FormsActionsEnum } from './FormsActions.Enum';

export const FormsStatusesEnum = {
  Todo: {
    key: 0,
    status: 'todo',
    isEditableForm: true,
    flowStatusLabel: 'in-progress',
    flowStatus: 'not-initiated',
    actions: [FormsActionsEnum.Edit, FormsActionsEnum.View],
  },
  Draft: {
    key: 1,
    status: 'draft',
    flowStatusLabel: 'in-progress',
    flowStatus: 'in-progress',
    isEditableForm: true,
    actions: [FormsActionsEnum.Edit, FormsActionsEnum.View],
  },
  Pending: {
    key: 1,
    status: 'pending',
    flowStatusLabel: 'in-progress',
    isEditableForm: true,
    isForVisa: true,
    actions: [FormsActionsEnum.Edit, FormsActionsEnum.View],
  },
  Completed: {
    key: 2,
    status: 'completed',
    flowStatusLabel: 'completed',
    flowStatus: 'completed',
    actions: [FormsActionsEnum.NotSharableEdit, FormsActionsEnum.View],
  },
  Rejected: {
    key: 3,
    status: 'rejected',
    isEditableForm: false,
    actions: [FormsActionsEnum.View],
  },
  Sent: {
    key: 4,
    status: 'sent',
    isEditableForm: true, // Editable for the recipient and not editable for the sender
    actions: [
      FormsActionsEnum.WithdrawToEdit,
      FormsActionsEnum.View,
      FormsActionsEnum.Remind,
    ],
  },
  PendingApproval: {
    key: 7,
    status: 'pending-approval',
    isEditableForm: false,
    actions: [
      // FormsActionsEnum.RevokeToEdit,
      FormsActionsEnum.WithdrawToEdit,
      FormsActionsEnum.View,
    ],
  },
  Approved: {
    key: 8,
    status: 'approved',
    actions: [FormsActionsEnum.WithdrawToEdit, FormsActionsEnum.View],
  },
  ApprovalCancel: {
    key: 9,
    status: 'approval-cancel',
    isEditableForm: false,
    actions: [FormsActionsEnum.RevokeToEdit, FormsActionsEnum.View],
  },
  ApprovalRejected: {
    key: 10,
    status: 'approval-rejected',
    isEditableForm: false,
    actions: [FormsActionsEnum.RevokeToEdit, FormsActionsEnum.View],
  },
};
