// noinspection ES6PreferShortImport
import { DefaultFormsTypesEnum } from '../Pages/DefaultFormsTypes.Enum';

export const FormsRolesEnum = {
  Creator: {
    key: 'creator',
    value: 'static-field',
    popoverValue: 'static-field-filled-by-admin',
    isDefault: true,
    isWithViewSidebar: true, // to show the sidebar for the user in the preview
    isWithAssignToAssist: false,
    isWithAssignToView: false,
    isWithGlobalAssignToAssist: true, // required to decide whither the current role can change the assist (on form level)
    isWithGlobalAssignToView: true, // required to decide whither the current role can change the view (on form level)
    isFieldPreview: true,
    isVisibleInAllForms: false, // mean hidden or visible in all form users types
    hiddenInFormDropdowns: [], // mean hidden in what form role
    visibleInFormDropdowns: [DefaultFormsTypesEnum.Flows.key], // means visible in what form role
    isEnabledTypography: true, // to make the typography enable on Creator only
  },
  Sender: {
    key: 'sender',
    value: 'sender',
    popoverValue: 'sender',
    isDefault: true,
    canBeFilledByOtherRoles: [
      {
        key: 'creator',
      },
    ],
    isWithViewSidebar: true, // to show the sidebar for the user in the preview
    isWithAssignToAssist: false,
    isWithAssignToView: false,
    isEditableIfNotWithRecipient: true, // to allow the save if the current role is exist & is_with_recipient is false
    isWithGlobalAssign: true, // required to decide whither the current role can change the assign (on form level)
    isWithGlobalInvite: true, // required to decide whither the current role can change the invite (on form level)
    isWithGlobalAssignToAssist: true, // required to decide whither the current role can change the assist (on form level)
    isWithGlobalAssignToView: true, // required to decide whither the current role can change the view (on form level)
    isFieldPreview: true,
    isVisibleInAllForms: true, // mean hidden or visible in all form users types
    hiddenInFormDropdowns: [DefaultFormsTypesEnum.Flows.key], // mean hidden in what form role
    visibleInFormDropdowns: [], // means visible in what form role
    isWithRoleTypeCompareOnly: true, // to check only on role type without check assign to assist or invite
  },
  Recipient: {
    key: 'recipient',
    value: 'recipient',
    popoverValue: 'recipient',
    canBeFilledByOtherRoles: [
      {
        key: 'creator',
      },
    ],
    isWithUpdateAction: true,
    isWithViewSidebar: true, // to show the sidebar for the user in the preview
    isRecipientBehaviour: true, // to make sure the fields and menu etc. behave the same on all locations
    isWithAssignToAssist: false,
    isWithAssignToView: false,
    isFieldPreview: false, // to control whether the field is preview as value or with input but disabled
    isHiddenIfWithoutRecipient: true,
    isVisibleInAllForms: true, // mean hidden or visible in all form users types
    hiddenInFormDropdowns: [DefaultFormsTypesEnum.Flows.key], // mean hidden in what form role
    visibleInFormDropdowns: [], // means visible in what form role
    isWithGlobalInvite: true, // required to decide whither the current role can change the invite (on form level)
    isWithRoleTypeCompareOnly: true, // to check only on role type without check assign to assist or invite
  },
  InvitedMembers: {
    key: 'invited_members',
    value: 'invited-members',
    popoverValue: 'invited-members',
    isRecipientBehaviour: true, // to make sure the fields and menu etc. behave the same on all locations
    isWithAssignToAssist: true,
    isWithMultipleSubmit: true, // to allow the user to submit the form more than once
    isWithAssignToView: true,
    isHiddenOnFieldLevelAssign: true, // to hide the not assigned to me field if the current user submission field level
    isWithGlobalSubmission: true, // to determine if the current role can fill all field with this role even if not exist in any assign array when value is 1 or not set
    isWithGlobalAssignToAssist: true, // required to decide whither the current role can change the assist (on form level)
    isWithGlobalAssignToView: true, // required to decide whither the current role can change the view (on form level)
    isWithMultipleForm: true, // this is to help decide whether the candidate can go back to answer more or not
    isFieldPreview: false,
    isVisibleInAllForms: false, // mean hidden or visible in all form users types
    hiddenInFormDropdowns: [], // mean hidden in what form role
    visibleInFormDropdowns: [DefaultFormsTypesEnum.Flows.key], // means visible in what form role
    // isWithUpdateAction: true
  },
  Variables: {
    key: 'variables',
    value: 'variables',
    popoverValue: 'mark-as-variable',
    popoverDescription: 'mark-as-variable-description',
    isRecipientBehaviour: true, // to make sure the fields and menu etc. behave the same on all locations
    isHiddenIfNotAssignToMe: true, // to hide the fields if not assign to the current user
    isSwitch: true,
    minAssignToAssist: 1,
    isWithGlobalAssignToAssist: true, // required to decide whither the current role can change the assist (on form level)
    isWithGlobalAssignToView: true, // required to decide whither the current role can change the view (on form level)
    isWithMultipleSubmit: true, // to allow the user to submit the form more than once
    isWithAssignToAssist: true,
    isWithAssignToView: true,
    isWithMultipleForm: true,
    isFieldPreview: false,
    isVisibleInAllForms: false, // mean hidden or visible in all form users types
    hiddenInFormDropdowns: [], // mean hidden in what form role
    visibleInFormDropdowns: [DefaultFormsTypesEnum.Flows.key], // means visible in what form role
    // isWithUpdateAction: true
  },
};
