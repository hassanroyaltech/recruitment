import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useReducer,
  useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import { getErrorByName, showError, showSuccess } from '../../../../helpers';
import {
  SetupsReducer,
  SetupsReset,
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../shared';

import { useTitle } from '../../../../hooks';

import { Button } from 'reactstrap';
import * as yup from 'yup';
import { emailExpression, phoneExpression } from '../../../../utils';
import {
  GetAccountEmailMaskingSetting,
  GetCompanyEmailMaskingSetting,
  RetryVerifyAccountEmailMaskingDomain,
  RetryVerifyCompanyEmailMaskingDomain,
  UpdateAccountEmailMaskingSetting,
  UpdateCompanyEmailMaskingSetting,
  VerifyAccountEmailMaskingDomain,
  VerifyCompanyEmailMaskingDomain,
} from '../../../../services/SetupsEmailMaskingSettings.Services';
import { SwitchComponent } from '../../../../components';
import CNameTable from './components/CNameTable.Compnent';
import { GetAllSetupsBranches } from '../../../../services';
import i18next from 'i18next';
import { useSelector } from 'react-redux';
import { EmailMaskingStatuses } from '../../../../enums/Shared/EmailMaskingStatuses.Enum';

const translationPath = 'EmailMasking.';
const parentTranslationPath = 'SetupsPage';
const EmailMasking = () => {
  const { t } = useTranslation(parentTranslationPath);
  const isMountedRef = useRef(true);
  const selectedBranchReducer = useSelector((state) => state?.selectedBranchReducer);
  useTitle(t(`${translationPath}candidates-settings`));
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [responseData, setResponseData] = useState({});
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [reload, setReload] = useState(false);
  const [isForCompany, setIsForCompany] = useState(false);
  const stateInitRef = useRef({
    from_domain: '',
    from_email: '',
    from_name: '',
    uuid: '',
  });
  const [errors, setErrors] = useState(() => ({}));
  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  /**
   * @params {id, updateMessage}
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change the candidate settings
   */
  const getErrors = useCallback(() => {
    const re = new RegExp('@' + state.from_domain + '$');
    getErrorByName(
      {
        current: yup
          .object()
          .shape({
            // ...(isForCompany && {
            //   uuid: yup
            //     .string()
            //     .nullable()
            //     .required(t('this-field-is-required')),
            // }),
            from_name: yup.string().required(t('this-field-is-required')).nullable(),
            from_email: yup
              .string()
              .nullable()
              .matches(emailExpression, {
                message: t('Shared:invalid-email'),
                excludeEmptyString: true,
              })
              .required(t('this-field-is-required'))
              .when('from_domain', {
                is: (value) => Boolean(value),
                then: yup
                  .string()
                  .nullable()
                  .matches(re, t(`${translationPath}Domain not allowed`)),
                otherwise: yup.string().nullable(),
              }),

            from_domain: yup
              .string()
              .required(t('this-field-is-required'))
              .nullable(),
          })
          .nullable(),
      },
      state,
    ).then((result) => {
      setErrors(result);
    });
  }, [state, t]);
  useEffect(() => {
    getErrors();
  }, [getErrors]);
  const updateHandler = async (event, newValue) => {
    setIsLoading(true);
    const response = await (isForCompany
      ? UpdateCompanyEmailMaskingSetting
      : UpdateAccountEmailMaskingSetting)(
      {
        uuid: state.uuid,
        value: {
          from_name: state?.from_name,
          from_email: (state?.from_email || '').toLowerCase(),
          from_domain: (state?.from_domain || '').toLowerCase(),
        },
      },
      selectedCompany || '',
    );
    if (!isMountedRef.current) return;
    setIsLoading(false);
    setReload(!reload);
    if (response && response.status === 202)
      showSuccess(t(`${translationPath}email-masking-changed-successfully`));
    else showError(t(`${translationPath}email-masking-change-failed`), response);
  };

  const getEmailMaskingSetting = useCallback(async () => {
    if (isForCompany && !selectedCompany) return;
    setIsLoading(true);
    const response = await (isForCompany
      ? GetCompanyEmailMaskingSetting({ company_uuid: selectedCompany })
      : GetAccountEmailMaskingSetting());
    isMountedRef.current = true;
    setIsLoading(false);
    setIsSubmitted(false);
    if (response && (response.status === 200 || response.status === 202)) {
      const {
        data: { results },
      } = response;
      setResponseData(results);
      setState({
        id: 'edit',
        value: {
          company_uuid: results?.company_uuid || '',
          uuid: results?.uuid,
          ...results?.value,
        },
      });
    } else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [isForCompany, selectedCompany, reload, t]);

  const verifyDomain = useCallback(
    async ({ uuid, isForCompany, company_uuid, isRetry }) => {
      if (isForCompany && !company_uuid) return;
      setIsLoading(true);
      let response = {};
      if (isRetry)
        response = await (isForCompany
          ? RetryVerifyCompanyEmailMaskingDomain({ uuid }, company_uuid)
          : RetryVerifyAccountEmailMaskingDomain({ uuid }));
      else
        response = await (isForCompany
          ? VerifyCompanyEmailMaskingDomain({ uuid }, company_uuid)
          : VerifyAccountEmailMaskingDomain({ uuid }));

      setIsLoading(false);
      setReload((item) => !item);
      if (response && (response.status === 200 || response.status === 202))
        response?.data?.message && showSuccess(response?.data?.message);
      else showError(t('Shared:failed-to-get-saved-data'), response);
    },
    [t],
  );
  useEffect(() => {
    getEmailMaskingSetting();
  }, [getEmailMaskingSetting]);
  const isDisabledMemo = useMemo(
    () => isLoading || !isMountedRef.current,
    [isLoading],
  );
  const isShowStatus = useMemo(
    () =>
      !isLoading
      && state.from_domain === responseData?.value?.from_domain
      && responseData?.value?.verification_status
      && isMountedRef.current,
    [
      isLoading,
      responseData?.value?.from_domain,
      responseData?.value?.verification_status,
      state.from_domain,
    ],
  );

  const submitForm = () => {
    setIsSubmitted(true);
    if (Object.values(errors || {}).length) return;
    updateHandler();
  };
  const changeFromAccountToCompany = useCallback(
    (value) => {
      setIsForCompany(value);
      setSelectedCompany(value ? selectedBranchReducer?.uuid : '');
    },
    [selectedBranchReducer?.uuid],
  );

  return (
    <div className="settings-candidates-page-wrapper px-4 pt-4">
      <div className="page-header-wrapper px-3 pb-3">
        <span className="header-text-x2 d-flex mb-1">
          {t(`${translationPath}email-masking-settings`)}
        </span>
        <span className="description-text">
          {t(`${translationPath}email-masking-description`)}
        </span>
      </div>
      <div className="separator-h mb-3" />
      <div className="page-body-wrapper px-2">
        <div className="setups-card-wrapper">
          <div className="setups-content-wrapper">
            <div className="setups-card-body-wrapper ">
              <div className="body-item-wrapper d-flex-v-center-h-between">
                <span className="header-text">
                  {t(`${translationPath}email-masking`)}
                  <span>
                    {` `}
                    {t(
                      `${translationPath}${
                        isForCompany ? 'for-company' : 'for-account'
                      }`,
                    )}
                  </span>
                  {isShowStatus && (
                    <span
                      className={`${
                        EmailMaskingStatuses[
                          responseData?.value?.verification_status
                        ].color
                      } fz-14px px-1`}
                    >
                      (
                      {t(
                        `${translationPath}${
                          EmailMaskingStatuses[
                            responseData?.value?.verification_status
                          ].key
                        }`,
                      )}
                      )
                    </span>
                  )}
                  {isMountedRef.current
                    && responseData?.value?.from_domain
                    && (!responseData?.value?.verification_status
                      || (responseData?.value?.verification_status
                        === EmailMaskingStatuses.Pending.value
                        && responseData?.value?.canonical_names?.length === 0))
                    && state.from_domain === responseData?.value?.from_domain && (
                    <Button
                      className="mx-2"
                      type="button"
                      onClick={() => {
                        verifyDomain({
                          uuid: state?.uuid,
                          isForCompany,
                          company_uuid: selectedCompany,
                        });
                      }}
                      color="primary"
                      disabled={isDisabledMemo}
                    >
                      {t(`${translationPath}verify-domain`)}
                    </Button>
                  )}
                  {isMountedRef.current
                    && responseData?.value?.from_domain
                    && responseData?.value?.verification_status
                      === EmailMaskingStatuses.Failed.value
                    && state.from_domain === responseData?.value?.from_domain && (
                    <Button
                      className="mx-2"
                      type="button"
                      onClick={() => {
                        verifyDomain({
                          uuid: state?.uuid,
                          isForCompany,
                          company_uuid: selectedCompany,
                          isRetry: true,
                        });
                      }}
                      color="primary"
                      disabled={isDisabledMemo}
                    >
                      {t(`${translationPath}retry-verification`)}
                    </Button>
                  )}
                </span>
                <div>
                  <SwitchComponent
                    idRef="changeFromAccountToCompany"
                    label="chang-account-to-company"
                    isChecked={isForCompany}
                    labelPlacement={'end'}
                    onChange={(e, value) => changeFromAccountToCompany(value)}
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                    isDisabled={isDisabledMemo}
                  />
                </div>
              </div>
              <div className="body-item-wrapper">
                {isMountedRef.current && (
                  <>
                    {isForCompany && selectedCompany && (
                      <SharedAPIAutocompleteControl
                        title="branch"
                        disableClearable
                        errors={errors}
                        errorPath={`company_uuid`}
                        isHalfWidth
                        wrapperClasses="my-2"
                        controlWrapperClasses={'my-0'}
                        searchKey="search"
                        stateKey="uuid"
                        isRequired={true}
                        isSubmitted={isSubmitted}
                        placeholder="select-branch"
                        idRef="branchAutocompleteRef"
                        getDataAPI={GetAllSetupsBranches}
                        editValue={selectedCompany}
                        getOptionLabel={(option) =>
                          (option.name
                            && (option.name[i18next.language]
                              || option.name.en
                              || 'N/A'))
                          || 'N/A'
                        }
                        onValueChanged={(newVal) => {
                          setSelectedCompany(newVal?.value || '');
                        }}
                        translationPath={translationPath}
                        parentTranslationPath={parentTranslationPath}
                        extraProps={
                          (selectedCompany && {
                            with_than: [selectedCompany],
                          })
                          || undefined
                        }
                        isDisabled={isDisabledMemo}
                      />
                    )}
                    <SharedInputControl
                      editValue={state?.from_domain || ''}
                      onValueChanged={(newVal) => {
                        setState({
                          id: 'from_domain',
                          value: (newVal?.value || '').toLowerCase() || '',
                        });
                      }}
                      stateKey="from_domain"
                      idRef="fromDomainEmailMaskingREf"
                      title="from-domain"
                      placeholder="from-domain-place-holder"
                      isHalfWidth
                      translationPath={translationPath}
                      parentTranslationPath={parentTranslationPath}
                      wrapperClasses="my-2"
                      isSubmitted={isSubmitted}
                      isRequired={true}
                      errors={errors}
                      errorPath={'from_domain'}
                      isDisabled={isDisabledMemo}
                    />
                    <SharedInputControl
                      editValue={state?.from_email || ''}
                      onValueChanged={(newVal) => {
                        setState({
                          id: 'from_email',
                          value: (newVal?.value || '').toLowerCase() || '',
                        });
                      }}
                      stateKey="from_email"
                      idRef="fromEmailEmailMaskingREf"
                      title="from-email"
                      placeholder="from-email-place-holder"
                      isHalfWidth
                      translationPath={translationPath}
                      parentTranslationPath={parentTranslationPath}
                      wrapperClasses="my-2"
                      isSubmitted={isSubmitted}
                      isRequired
                      errors={errors}
                      errorPath="from_email"
                      isDisabled={isDisabledMemo}
                    />
                    <SharedInputControl
                      editValue={state?.from_name || ''}
                      onValueChanged={(newVal) => {
                        setState({
                          id: 'from_name',
                          value: newVal?.value || '',
                        });
                      }}
                      stateKey="from_name"
                      isDisabled={isDisabledMemo}
                      idRef="fromNameEmailMaskingREf"
                      title="from-name"
                      placeholder="from-name-place-holder"
                      isHalfWidth
                      translationPath={translationPath}
                      parentTranslationPath={parentTranslationPath}
                      wrapperClasses="my-2"
                      isSubmitted={isSubmitted}
                      isRequired
                      errors={errors}
                      errorPath="from_name"
                    />
                    {isShowStatus
                      && responseData?.value?.canonical_names?.length > 0 && (
                      <>
                        <div className="body-item-wrapper c-black-light mb-2 mt-3">
                          <span>
                            {t(`${translationPath}c-name-records-label`)}
                          </span>
                        </div>
                        <CNameTable
                          tablData={responseData?.value?.canonical_names || []}
                        />
                      </>
                    )}

                    <div className="d-flex-center mt-2">
                      <Button
                        className=" "
                        type="button"
                        onClick={() => {
                          submitForm();
                        }}
                        color="primary"
                        disabled={isDisabledMemo}
                      >
                        {t(`Shared:save`)}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailMasking;
