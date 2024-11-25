import { SelectedBranchTypes } from '../stores/types/SelectedBranchTypes';
import { tokenTypes } from '../stores/types/tokenTypes';
import { UserTypes } from '../stores/types/userTypes';
import { EmailIntegrationAccountTypes } from '../stores/types/emailIntegrationTypes';
import {
  GlobalDispatch,
  GlobalHistory,
  GlobalRemoveAllToasts,
  PushSpentTime
} from './Middleware.Helper';
import { removeAllPendingRequestsRecord } from '../api/middleware';
import { removeAllPendingRequestsRecordHttp } from './HttpMethod.Helper';
import { storageService } from '../utils/functions/storage';

export const LogoutHelper = (isWithoutRedirect = false, isWithoutRemoveToasts = false) => {
  GlobalDispatch({
    type: SelectedBranchTypes.DELETE,
  });
  GlobalDispatch({
    type: tokenTypes.DELETE,
  });
  GlobalDispatch({
    type: UserTypes.DELETE,
  });
  GlobalDispatch({
    type: EmailIntegrationAccountTypes.DELETE,
  });
  PushSpentTime();
  removeAllPendingRequestsRecord();
  removeAllPendingRequestsRecordHttp();
  if (GlobalRemoveAllToasts && !isWithoutRemoveToasts) GlobalRemoveAllToasts();
  storageService.clearLocalStorage();
  // Redirect
  if (GlobalHistory && !isWithoutRedirect) GlobalHistory.push('/el/login');
};
