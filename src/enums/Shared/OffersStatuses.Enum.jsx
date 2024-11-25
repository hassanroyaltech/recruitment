import { OffersActionsEnum } from './OffersActions.Enum';

export const OffersStatusesEnum = {
  Draft: {
    // when you first create the offer
    key: 1,
    status: 'draft',
    actions: [OffersActionsEnum.Edit],
  },
  PendingApproval: {
    // after you create the offer, if you have an approval proccess the offer will have this status
    key: 2,
    status: 'pending-approval',
    actions: [OffersActionsEnum.WithdrawToEdit],
  },
  NotSent: {
    // after being approved or if there is no approval it will get directly to this status
    key: 3,
    status: 'not-sent',
    actions: [OffersActionsEnum.SendToSign],
  },
  WaitingToBeSigned: {
    // after it is sent to candidate to be signed but the candidate didn't sign it yet
    key: 4,
    status: 'waiting-to-be-signed',
    actions: [
      OffersActionsEnum.ViewOffer,
      OffersActionsEnum.Remind,
      OffersActionsEnum.RevokeToEdit,
    ], // change to Draft?
  },
  Completed: {
    // after the candidate signed the offer
    key: 5,
    status: 'completed',
    actions: [OffersActionsEnum.ViewOffer],
  },
  Failed: {
    key: 6,
    status: 'failed',
    actions: [OffersActionsEnum.ViewOffer],
  },
  Rejected: {
    key: 7,
    status: 'rejected',
    actions: [OffersActionsEnum.ViewOffer],
  },
  RejectedByRecipient: {
    key: 8,
    status: 'rejected-by-recipient',
    actions: [OffersActionsEnum.ViewOffer],
  },
  RequestingMoreInfo: {
    key: 9,
    status: 'requesting-more-info',
    actions: [OffersActionsEnum.ViewOffer],
  },
  CompletedAsSecondary: {
    key: 20,
    status: 'completed-as-secondary',
    actions: [OffersActionsEnum.ViewOffer],
    notForUseOutsideOffer: true,
  },
};
