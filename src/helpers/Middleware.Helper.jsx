/* eslint-disable import/no-mutable-exports */
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { useDispatch } from 'react-redux';
import { showError, showSuccess } from './Toasters.Helper';
import {
  DefaultFormsTypesEnum,
  NavigationSourcesEnum,
  ProfileSourcesTypesEnum,
} from '../enums';
import { GetAllApproveApplicants } from '../services';
import { useEffect, useState } from 'react';
import { ReadFontFaces } from './TextEditor.Helper';

export let GlobalTranslate = null;
export let GlobalHistory = null;
export let GlobalRemoveAllToasts = null;
export let GlobalLocation = null;
export let GlobalDispatch = null;
export let GlobalFullAccess = false;
let GlobalCompanyId = null;
let GlobalAccountUuid = null;
// let globalIsLoading = null;
let setGlobalIsLoading = null;
export let GlobalToast = null;
export const GlobalSearchDelay = 700;
export const GlobalInputDelay = 350;
export const GlobalDateFormat = 'DD MMM, YYYY';
export const GlobalSecondaryDateFormat = 'DD/MM/YYYY';
export const GlobalHijriDateFormat = 'iDD iMMM iYYYY';
export const GlobalSecondHijriDateFormat = 'iDD/iMM/iYYYY';
export const GlobalSavingHijriDateFormat = 'iYYYY-iMM-iDD';
export const GlobalSavingDateFormat = 'YYYY-MM-DD';
export const GlobalTimeFormat = 'HH:mm:ss';
export const GlobalTimeFormatWithA = 'HH:mm A';
export const GlobalDateTimeFormat = 'YYYY-MM-DDTHH:mm:ssZ';
export const GlobalDisplayDateTimeFormat = 'YYYY-MM-DD hh:mm:ss A';
export const GlobalDisplayDateFormat = 'YYYY-MM-DD';
export const GlobalDateAndTimeFormat = 'YYYY-MM-DD hh:mm:ss';
export const ResetActiveItem = null;
export const GloabalValidationOptions = {
  // to ignore the transform for value for example translation
  // the value with only check the value before change
  strict: false,
  abortEarly: false, // to prevent stop validated on the first error (not recommended for forms)
  stripUnknown: false, // to ignore unknown variables
  recursive: true, // if false will ignore the subscheme
  context: null, // use to send a value for when (extra keys) (only objects) ex:- on https://www.npmjs.com/package/yup#mixedwhenkeys-string--arraystring-builder-object--value-schema-schema-schema
};
let logoutAction = null;
let setRerender = null;
let GlobalAfterSideMenuComponent = null;
let GlobalOnboardingMenuFilter = null;
let GlobalConnectionsFilter = null;
let renderVar = false;
let GlobalRoute = null;
let setRenderVar = null;
export const SetGlobalRerender = (setRender, render) => {
  renderVar = render;
  setRenderVar = setRender;
};
export const GlobalRerender = () => {
  setRenderVar(!renderVar);
};
export const GetGlobalRerender = () => renderVar;

export const InitGlobalRoute = ({ route }) => {
  GlobalRoute = route;
};
export const GetGlobalRoute = () => GlobalRoute;
export const PushSpentTime = () => {
  const storedTime = Number(localStorage.getItem('storedTime') || 0);
  if (storedTime) {
    let hours = (Date.now() - storedTime) / 1000;
    hours = (hours / (60 * 60)).toFixed(2);
    window?.ChurnZero?.push([
      'trackEvent',
      'EVA-REC - Time spent on the platform',
      'Time spent on the platform from EVA-REC',
      hours,
      {},
    ]);
  }
};
export const MiddlewareHelper = () => {
  const { addToast, removeAllToasts } = useToasts();
  GlobalTranslate = useTranslation();
  GlobalHistory = useHistory();
  GlobalLocation = useLocation();
  GlobalDispatch = useDispatch();
  GlobalToast = addToast;
  GlobalRemoveAllToasts = removeAllToasts;
  const location = GlobalLocation;
  const [route, setRoute] = useState(
    GetGlobalRoute() || {
      //--> it can be replaced with useRef or localStorage
      to: location.pathname,
      from: location.pathname,
    },
  );

  useEffect(() => {
    setRoute((prev) => ({ to: location.pathname, from: prev.to }));
  }, [location]);
  useEffect(() => {
    InitGlobalRoute({ route });
  }, [route]);
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const storedTime = Number(localStorage.getItem('storedTime') || 0);
      const tabCount = Number(localStorage.getItem('tabCount') || 0);
      if (
        event?.currentTarget?.performance?.navigation?.type === 0
        && tabCount === 1
        && storedTime
      ) {
        PushSpentTime();
        localStorage.removeItem('storedTime');
        localStorage.removeItem('tabCount');
      } else
        localStorage.setItem('tabCount', String((tabCount && tabCount - 1) || 0));
    };
    const tabCount = Number(localStorage.getItem('tabCount') || 0);
    const storedTime = Number(localStorage.getItem('storedTime') || 0);
    if (!storedTime) localStorage.setItem('storedTime', String(Date.now()));

    localStorage.setItem('tabCount', String(tabCount + 1));
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      handleBeforeUnload();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  useEffect(() => {
    ReadFontFaces();
  }, []);
  return null;
};

export const GetGlobalCompanyId = () => GlobalCompanyId;
export const SetGlobalCompanyId = (newValue) => {
  GlobalCompanyId = newValue;
};
export const GlobalAfterSideMenuComponentState = (newValue) => {
  GlobalAfterSideMenuComponent = newValue;
};
export const SetGlobalAfterSideMenuComponent = (newValue) => {
  if (GlobalAfterSideMenuComponent) GlobalAfterSideMenuComponent(newValue);
};

export const GlobalOnboardingMenuFilterState = (newValue) => {
  GlobalOnboardingMenuFilter = newValue;
};
export const SetGlobalOnboardingMenuFilter = (newValue) => {
  if (GlobalOnboardingMenuFilter) GlobalOnboardingMenuFilter(newValue);
};

export const GlobalConnectionsFilterState = (newValue) => {
  GlobalConnectionsFilter = newValue;
};
export const SetGlobalConnectionsFilter = (newValue) => {
  if (GlobalConnectionsFilter) GlobalConnectionsFilter(newValue);
};

export const ChangeGlobalIsLoading = (newValue) => {
  if (setGlobalIsLoading) setGlobalIsLoading(newValue);
};
export const SetGlobalIsLoading = (setIsLoading) => {
  setGlobalIsLoading = setIsLoading;
  // globalIsLoading = isLoading;
};

export const GetGlobalAccountUuid = () => GlobalAccountUuid;
export const SetGlobalAccountUuid = (newValue) => {
  GlobalAccountUuid = newValue;
};

export const GetGlobalFullAccess = () => GlobalFullAccess;
export const SetGlobalFullAccess = (newValue) => {
  GlobalFullAccess = newValue;
};

export const rerenderCallback = (callback) => {
  setRerender = callback;
};

export const rerenderUpdate = (component) => {
  if (setRerender) setRerender(component);
};

export function setLogoutAction(callback) {
  logoutAction = callback;
}

export function LogoutAction() {
  return logoutAction;
}

export const getDownloadableLink = (url) => url;
export const floatHandler = (value, maxFloatNumbers) => {
  const valueAfterSplit = value.toString().split('.');
  if (valueAfterSplit.length === 2 && valueAfterSplit[1].length > maxFloatNumbers)
    return Number(value).toFixed(maxFloatNumbers);
  if (valueAfterSplit.length === 2 && valueAfterSplit[1].length <= maxFloatNumbers)
    return Number(value).toFixed(valueAfterSplit[1].length);
  return Number(value).toFixed(0);
};
export const getDataFromObject = (dataItem, key, isReturnAsIs) => {
  if (!key)
    return (
      (typeof dataItem !== 'object' && (isReturnAsIs ? dataItem : `${dataItem}`))
      || ''
    );
  if (!key.includes('.'))
    return (
      (dataItem[key] !== null
        && dataItem[key] !== undefined
        && (isReturnAsIs ? dataItem[key] : `${dataItem[key]}`))
      || ''
    );
  let a = dataItem;
  key.split('.').map((item) => {
    if (a) a = a[item];
    return item;
  });
  return a;
};

/**
 * @param textToCopy - text to add to clipboard
 * @param successMessage - text message for success
 * @param failedMessage - text message for failed
 * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
 * @Description this method is to copy to clipboard if the
 * browser is legacy
 */
function fallbackCopyTextToClipboard(textToCopy, successMessage, failedMessage) {
  const textArea = document.createElement('textarea');
  textArea.value = textToCopy;

  // Avoid scrolling to bottom
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.position = 'fixed';

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    if (successful) showSuccess(successMessage);
    else showError(failedMessage);
  } catch (err) {
    showError(failedMessage, err);
  }

  document.body.removeChild(textArea);
}

/**
 * @param textToCopy - text to add to clipboard
 * @param successMessage - text message for success
 * @param failedMessage - text message for failed
 * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
 * @Description this method is to handle copping the text to the clipboard
 */
export const copyTextToClipboard = (
  textToCopy,
  successMessage = GlobalTranslate.t('Shared:copy-to-clipboard-success'),
  failedMessage = GlobalTranslate.t('Shared:copy-to-clipboard-failed'),
) => {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(textToCopy, successMessage, failedMessage);
    return;
  }
  navigator.clipboard.writeText(textToCopy).then(
    () => {
      showSuccess(successMessage);
    },
    (err) => {
      showError(failedMessage, err);
    },
  );
};

/**
 * @param str
 * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
 * @Description this method is to check if the string is html or not
 */
export const isHTML = (str) => {
  const doc = new DOMParser().parseFromString(str, 'text/html');
  return Array.from(doc.body.childNodes).some((node) => node.nodeType === 1);
};

/**
 * @param str
 * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
 * @Description this method is to check if the string is UUID or not
 */
export const IsUUID = (str = '') =>
  (str ? str : '').match(
    '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$',
  );

/**
 * @param obj - object to get all of its nested keys
 * @param prefix - the previous value for nested objects (not required at first call)
 * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
 * @Description this method is to check if the string is html or not
 */
export const getKeysForNestedObj = (obj, prefix = '') =>
  Object.keys(obj).reduce((res, el) => {
    if (Array.isArray(obj[el])) return res;
    if (typeof obj[el] === 'object' && obj[el] !== null)
      return [...res, ...getKeysForNestedObj(obj[el], `${prefix + el}.`)];

    return [...res, prefix + el];
  }, []);

export const getErrorByName = (
  schemaObject,
  valueOrState,
  fieldName = undefined,
  type = undefined,
  validationPackage = 'yup',
) => {
  if (validationPackage === 'yup') {
    if (!schemaObject || !schemaObject.current)
      return {
        message: undefined,
        messages: [],
        error: true,
        type: undefined,
      };
    return schemaObject.current
      .validate(
        (typeof valueOrState === 'object' && valueOrState)
          || (fieldName && { [fieldName]: valueOrState })
          || null,
        GloabalValidationOptions,
      )
      .then(() => ({}))
      .catch((error) => {
        if (fieldName) {
          const itemIndex = error.inner.findIndex((item) => item.path === fieldName);
          if (itemIndex === -1)
            return {
              message: 'Please make sure the path of fieldKey is correct',
              messages: error.errors || [],
              error: true,
              type: undefined,
            };

          return {
            message: error.inner[itemIndex].message,
            messages: error.errors || [],
            error: true,
            type: undefined,
          };
        }
        const errorsObjects = {};
        error?.inner?.map((item) => {
          errorsObjects[item.path] = {
            message: item.message,
            messages: item.messages || [],
            error: (item.message && true) || false,
            type: undefined,
          };
          return undefined;
        });
        return errorsObjects;
      });
  }
  if (
    !schemaObject.current
    || schemaObject.current.error
    || !schemaObject.current.error.details
  )
    return {
      message: undefined,
      messages: undefined,
      error: true,
      type: undefined,
    };

  const item = schemaObject.current.error.details.find(
    (element) =>
      (!Number.isNaN(fieldName) && element.path.includes(fieldName))
      || (Number.isNaN(fieldName)
        && !fieldName.includes('.')
        && element.path.includes(fieldName))
      || (Number.isNaN(fieldName)
        && fieldName.includes('.')
        && element.path.length >= fieldName.split('.').length
        && element.path.slice(0, fieldName.split('.').length).join('.') === fieldName),
  );
  if (!item || (type && item.type !== type))
    return {
      message: undefined,
      messages: undefined,
      error: false,
      type: undefined,
    };

  return {
    message: item.message,
    messages: item.messages,
    error: true,
    type: undefined,
  };
};

/**
 * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
 * @Description this method is to generate random UUID
 */
// eslint-disable-next-line no-bitwise
export const generateUUIDV4 = () =>
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(
      16,
    ),
  );

/**
 * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
 * @Description this method is to get current enum for form navigation source or even not form
 */
export const GetFormSourceItem = (source, code = DefaultFormsTypesEnum.Forms.key) =>
  (source
    && Object.values(NavigationSourcesEnum).find((item) => source === item.key)) || {
    source_url: () => `/recruiter/form-builder?activeTab=1&code=${code}`,
    isForm: false,
    isView: false,
  };

export const GetScorecardSourceItem = (source) =>
  (source
    && Object.values(NavigationSourcesEnum).find((item) => source === item.key)) || {
    source_url: () => `/recruiter/recruiter-preference/scorecard`,
    isForm: false,
    isView: false,
  };
export const HtmlToText = (str = '') => str.replaceAll(/(&nbsp;|<([^>]+)>)/gi, '');

/**
 * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
 * @Description this method is to get all approve applicants
 */
export async function getAllApproveApplicantsHandler({
  filter,
  setIsLoading,
  isLoadingRef,
  afterCallHandler,
}) {
  let checkboxFilterCleared = {};
  Object.keys(filter.filters?.checkboxFilters || {}).forEach((check) => {
    if (filter.filters.checkboxFilters?.[check])
      checkboxFilterCleared = { ...checkboxFilterCleared, [check]: true };
  });
  const toSaveFilter = {
    ...filter,
    ...filter.filters,
    ...checkboxFilterCleared,
    search: filter?.filters?.query,
    source_type: filter.filters?.source_type?.key,
    source_uuid:
      filter.filters?.source_type?.key
      && (((filter.filters?.source_type?.key === ProfileSourcesTypesEnum.Agency.key
        || filter.filters?.source_type?.key
          === ProfileSourcesTypesEnum.University.key)
        && filter.filters?.source?.user_uuid)
        || filter.filters?.source?.uuid),
    ...(filter.filter?.job?.uuid && { match_job_uuid: filter.filter.job.uuid }),
  };
  delete toSaveFilter?.query;
  delete toSaveFilter?.source;
  delete toSaveFilter?.filters;
  delete toSaveFilter?.custom_tags;
  delete toSaveFilter?.checkboxFilters;
  delete toSaveFilter?.filter?.job;
  if (!toSaveFilter?.candidate_registered) delete toSaveFilter?.candidate_registered;
  if (!toSaveFilter?.candidate_applied) delete toSaveFilter?.candidate_applied;
  setIsLoading(true);
  const response = await GetAllApproveApplicants({
    toSaveFilter: {
      ...toSaveFilter,
      job_type: toSaveFilter.job_type?.map((item) => item.uuid),
      degree_type: toSaveFilter.degree_type?.map((item) => item.uuid),
      category_uuid: toSaveFilter.category_uuid?.map((item) => item?.uuid || item),
      career_level: toSaveFilter.career_level?.map((item) => item.uuid),
      academic_certificate: toSaveFilter.academic_certificate?.map(
        (item) => item.uuid,
      ),
      interested_position_title: toSaveFilter.interested_position_title?.map(
        (item) => item.uuid,
      ),
      country: toSaveFilter.country?.map((item) => item.uuid),
      industry: toSaveFilter.industry?.map((item) => item.uuid),
      language: toSaveFilter.language?.map((item) => item.uuid),
      major: toSaveFilter.major?.map((item) => item.uuid),
      nationality: toSaveFilter.nationality?.map((item) => item.uuid),
      gender: toSaveFilter.gender?.uuid,
      has_assignee: toSaveFilter.has_assignee?.key,
      candidate_property: [],
      dynamic_properties: toSaveFilter.candidate_property,
      assigned_employee_uuid: toSaveFilter.assigned_employee_uuid?.map(
        (item) => item?.user_uuid,
      ),
      assigned_user_uuid: toSaveFilter.assigned_user_uuid?.map((item) => item?.uuid),
      ...(toSaveFilter.national_id && {
        national_id: toSaveFilter.national_id,
      }),
      ...(toSaveFilter.candidate_name && {
        candidate_name: toSaveFilter.candidate_name,
      }),
      ...(toSaveFilter.reference_number && {
        reference_number: toSaveFilter.reference_number,
      }),
      ...(toSaveFilter.applicant_number && {
        applicant_number: toSaveFilter.applicant_number,
      }),
      ...(toSaveFilter.candidate_registered && {
        candidate_registered: 1,
      }),
      ...(toSaveFilter.candidate_applied && {
        candidate_applied: 1,
      }),
      ...(toSaveFilter.candidate_type?.value && {
        candidate_type: (toSaveFilter.candidate_type?.value || '').toLowerCase(),
      }),
    },
    tags: filter?.tags,
  });
  if (isLoadingRef) isLoadingRef.current = false;
  setIsLoading(false);
  afterCallHandler(response);
}

export const ShallowEqual = (obj1, obj2) => {
  if (obj1 === obj2) return true;
  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) 
    return false;
  

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (let key of keys1) 
    if (obj1[key] !== obj2[key]) return false;
  

  return true;
}

export const DownloadLinkHelper = `${process.env.REACT_APP_DOMIN_PHP_API_GET}/${process.env.REACT_APP_PREFIX_API}/download`;
