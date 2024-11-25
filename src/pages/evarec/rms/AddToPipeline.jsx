// React, reactstrap
import React, { useMemo, useState } from 'react';
import { Button, Input, ModalBody } from 'reactstrap';
import { evarecAPI } from 'api/evarec';
import { useTranslation } from 'react-i18next';
import { showError, showSuccess } from '../../../helpers';
import { useSelector } from 'react-redux';
import {
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
} from 'pages/setups/shared';
import {
  GetAllActiveJobs,
  GetAllEvaRecPipelineJobs,
  GetAllProviderAccounts,
  GetAllProviderBranches,
} from 'services';
import i18next from 'i18next';
import { PipelineStagesEnum } from '../../../enums';
import { DialogComponent } from '../../../components';

const translationPath = '';
const parentTranslationPath = 'EvarecRecRms';

const AddToPipeline = ({
  isOpen,
  onClose,
  profile_uuid,
  use_for,
  category_code,
  pre_candidate_approval_uuid,
  source,
  candidate_uuid,
  isMultiple,
  items,
  ...props
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [activeJob, setActiveJob] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uuid] = useState(props.uuid);
  const [email] = useState(props.email);
  const [saving, setSaving] = useState(false);
  const [addToPipelineData, setAddToPipelineData] = useState({
    account_uuid: '',
    branch_uuid: '',
    job_uuid: '',
  });
  const userReducer = useSelector((state) => state?.userReducer);
  const accountReducer = useSelector((reducerState) => reducerState?.accountReducer);
  const selectedBranchReducer = useSelector((state) => state?.selectedBranchReducer);

  /**
   * When the 'Apply' button is clicked.
   */
  const onApply = () => {
    setIsSubmitted(true);
    if (!activeJob || !selectedStage) return;
    setSaving(true);
    if (
      props.fromCandidateDatabase
      || props.isShareResume
      || use_for === 'pre_screening_service'
    )
      evarecAPI
        .addToATSFromDatabase(
          activeJob.uuid,
          selectedStage,
          [uuid || profile_uuid],
          use_for,
          category_code,
          pre_candidate_approval_uuid,
          userReducer?.results?.user?.is_provider && addToPipelineData, //check later if working
          addToPipelineData.branch_uuid || selectedBranchReducer.uuid,
          handledItems.completedItems?.map((item) => item.profile_uuid) || [],
          isMultiple,
        )
        .then((res) => {
          window?.ChurnZero?.push([
            'trackEvent',
            'EVA-REC - Add to pipeline',
            'Add to pipeline',
            1,
            {},
          ]);
          setSaving(false);
          setIsSubmitted(false);
          showSuccess(
            (isMultiple && res?.data?.message)
              || t(`${translationPath}added-successfully`),
          );
          // showSuccess(  t(`${translationPath}added-successfully`));
          onClose();
        })
        .catch((error) => {
          setSaving(false);
          showError(t('Shared:failed-to-get-saved-data'), error);
        });
    else
      evarecAPI
        .addToATS(
          uuid,
          activeJob.uuid,
          selectedStage,
          email || selectedEmail,
          handledItems.withEmailsitems?.map(({ uuid, email }) => ({
            rms_uuid: uuid,
            email,
          })) || [],
          isMultiple,
        )
        .then((res) => {
          window?.ChurnZero?.push([
            'trackEvent',
            'EVA-REC - Add to pipeline',
            'Add to pipeline',
            1,
            {},
          ]);
          setSaving(false);
          setIsSubmitted(false);
          showSuccess(
            (isMultiple && res?.data?.message)
              || t(`${translationPath}added-successfully`),
          );
          // showSuccess(t(`${translationPath}added-successfully`));
          onClose();
        })
        .catch((error) => {
          setSaving(false);
          showError(t('Shared:failed-to-get-saved-data'), error);
        });
  };

  /**
   * Return JSX Component
   */
  const handledItems = useMemo(() => {
    if (isMultiple && items && source === 'rms')
      return {
        withEmailsitems: items.filter((item) => item.email),
        noEmailsItems: items.filter((item) => !item.email),
      };
    else if (isMultiple && items && props.fromCandidateDatabase)
      return {
        completedItems: items.filter((item) => item.is_completed_profile),
        noCompletedItems: items.filter((item) => !item.is_completed_profile),
      };
    else return {};
  }, [items, source, props.fromCandidateDatabase, isMultiple]);

  return (
    <DialogComponent
      className="modal-md"
      isOpen={isOpen}
      onCloseClicked={onClose}
      style={{ width: 848, maxWidth: '100%' }}
      dialogContent={
        <div className="min-vh-30">
          <div className="modal-header border-0">
            <h3 className="h3 mb-0 ml-5 mt-3">
              {t(`${translationPath}add-to-pipeline`)}
            </h3>
          </div>
          <ModalBody className="modal-body pt-0 mx-3 px-5">
            <div className="h6 font-weight-normal text-gray mb-0">
              {t(`${translationPath}add-to-pipeline-description`)}.
            </div>
            {isMultiple
            && handledItems?.noEmailsItems?.length > 0
            && source === 'rms' ? (
                <div className="d-flex-v-start flex-wrap">
                  <span className="font-weight-normal text-gray mb-0">
                    {`${t(`${translationPath}selected-no-email`)} (${
                      handledItems?.noEmailsItems?.length
                    }
                 ${t(
                  `${translationPath}${
                    handledItems?.noEmailsItems?.length === 1 ? 'item' : 'items'
                  }`,
                )}), 
                ${t(`${translationPath}will-not-added-pipeline`)}`}
                  .
                  </span>
                  <div className="d-flex-v-center  text-danger">
                    {handledItems?.noEmailsItems?.map((item) => item.name).join(', ')}.
                  </div>
                </div>
              ) : null}
            {isMultiple
            && handledItems?.noCompletedItems?.length > 0
            && props.fromCandidateDatabase ? (
                <div className="d-flex-v-start flex-wrap">
                  <span className="font-weight-normal text-gray mb-0">
                    {`${t(`${translationPath}selected-no-completed`)} (${
                      handledItems?.noCompletedItems?.length
                    }
                 ${t(
                  `${translationPath}${
                    handledItems?.noCompletedItems?.length === 1 ? 'item' : 'items'
                  }`,
                )}), 
                ${t(`${translationPath}will-not-added-pipeline`)}`}
                  .
                  </span>
                  <div className="d-flex-v-center  text-danger">
                    {handledItems?.noCompletedItems
                      ?.map((item) => item.name)
                      .join(', ')}
                  .
                  </div>
                </div>
              ) : null}
            <div className="mt-3">
              {/* if provider then show different dropdowns */}
              {userReducer?.results?.user?.is_provider ? (
                <>
                  <SharedAPIAutocompleteControl
                    isHalfWidth
                    title="account"
                    // errors={errors}
                    searchKey="search"
                    placeholder="select-account"
                    stateKey="account_uuid"
                    isDisabled={saving}
                    // isSubmitted={isSubmitted}
                    editValue={addToPipelineData.account_uuid}
                    errorPath="account_uuid"
                    onValueChanged={(newValue) =>
                      setAddToPipelineData((items) => ({
                        ...items,
                        account_uuid: newValue.value,
                      }))
                    }
                    getDataAPI={GetAllProviderAccounts}
                    parentTranslationPath={parentTranslationPath}
                    getOptionLabel={(option) =>
                      option.name[i18next.language] || option.name.en
                    }
                  />
                  <SharedAPIAutocompleteControl
                    isHalfWidth
                    title="branch"
                    // errors={errors}
                    searchKey="search"
                    placeholder="select-branch"
                    stateKey="branch_uuid"
                    isDisabled={saving || !addToPipelineData.account_uuid}
                    // isSubmitted={isSubmitted}
                    editValue={addToPipelineData.branch_uuid}
                    errorPath="branch_uuid"
                    onValueChanged={(newValue) =>
                      setAddToPipelineData((items) => ({
                        ...items,
                        branch_uuid: newValue.value,
                      }))
                    }
                    getDataAPI={GetAllProviderBranches}
                    extraProps={{
                      is_member:
                        userReducer?.results?.user?.member_type === 'member',
                      account_uuid: addToPipelineData.account_uuid,
                    }}
                    parentTranslationPath={parentTranslationPath}
                    getOptionLabel={(option) =>
                      option.name[i18next.language] || option.name.en
                    }
                  />
                  <SharedAPIAutocompleteControl
                    isHalfWidth
                    title="job"
                    // errors={errors}
                    searchKey="search"
                    placeholder="select-job"
                    stateKey="job_uuid"
                    isDisabled={saving || !addToPipelineData.branch_uuid}
                    // isSubmitted={isSubmitted}
                    editValue={addToPipelineData.job_uuid}
                    errorPath="job_uuid"
                    isEntireObject
                    onValueChanged={({ value }) => {
                      setAddToPipelineData((items) => ({
                        ...items,
                        job_uuid: value && value.uuid,
                      }));
                      setActiveJob(value);
                    }}
                    getDataAPI={GetAllActiveJobs}
                    extraProps={{
                      use_for: 'dropdown',
                      account_uuid: addToPipelineData.account_uuid,
                      company_uuid: addToPipelineData.branch_uuid,
                      profile_uuid: props.uuid,
                    }}
                    parentTranslationPath={parentTranslationPath}
                    optionComponent={(renderProps, option) => (
                      <li
                        {...renderProps}
                        key={option.uuid}
                        style={{
                          cursor: option.is_apply ? 'not-allowed' : '',
                          pointerEvents: option.is_apply ? 'none' : '',
                        }}
                      >
                        <span>{option.title}</span>
                        {option.is_apply && (
                          <span
                            className="mx-2 px-2 py-1 bg-green c-white"
                            style={{ borderRadius: '0.5rem' }}
                          >
                            {t('applied')}
                          </span>
                        )}
                      </li>
                    )}
                    dataKey="jobs"
                  />
                </>
              ) : (
                <>
                  {source === 'rms' ? (
                    <SharedAPIAutocompleteControl
                      placeholder="select-job"
                      title="job"
                      stateKey="uuid"
                      searchKey="search"
                      getDataAPI={GetAllEvaRecPipelineJobs}
                      dataKey="jobs"
                      controlWrapperClasses="px-2"
                      isEntireObject
                      isRequired
                      errors={{
                        uuid: {
                          error: !activeJob || !activeJob.uuid,
                          message: t('Shared:this-field-is-required'),
                        },
                      }}
                      errorPath="uuid"
                      onValueChanged={({ value }) => {
                        setActiveJob(value);
                      }}
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                      extraProps={{
                        candidate_uuid,
                      }}
                      optionComponent={(renderProps, option) => (
                        <li
                          {...renderProps}
                          key={option.uuid}
                          style={{
                            cursor: option.is_apply ? 'not-allowed' : '',
                            pointerEvents: option.is_apply ? 'none' : '',
                          }}
                        >
                          <span>{option.title}</span>
                          {option.is_apply && (
                            <span
                              className="mx-2 px-2 py-1 bg-green c-white"
                              style={{ borderRadius: '0.5rem' }}
                            >
                              {t('applied')}
                            </span>
                          )}
                        </li>
                      )}
                    />
                  ) : (
                    <SharedAPIAutocompleteControl
                      placeholder="select-job"
                      title="job"
                      stateKey="uuid"
                      searchKey="search"
                      getDataAPI={GetAllActiveJobs}
                      dataKey="jobs"
                      controlWrapperClasses="px-2"
                      isEntireObject
                      isRequired
                      errors={{
                        uuid: {
                          error: !activeJob || !activeJob.uuid,
                          message: t('Shared:this-field-is-required'),
                        },
                      }}
                      errorPath="uuid"
                      onValueChanged={({ value }) => {
                        setActiveJob(value);
                      }}
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                      extraProps={{
                        use_for: 'dropdown',
                        profile_uuid: props.uuid,
                      }}
                      optionComponent={(renderProps, option) => (
                        <li
                          {...renderProps}
                          key={option.uuid}
                          style={{
                            cursor: option.is_apply ? 'not-allowed' : '',
                            pointerEvents: option.is_apply ? 'none' : '',
                          }}
                        >
                          <span>{option.title}</span>
                          {option.is_apply && (
                            <span
                              className="mx-2 px-2 py-1 bg-green c-white"
                              style={{ borderRadius: '0.5rem' }}
                            >
                              {t('applied')}
                            </span>
                          )}
                        </li>
                      )}
                    />
                  )}
                </>
              )}
            </div>
            {activeJob && (
              <>
                <div className="font-weight-bold text-gray mt-4 mb-3">
                  {t(
                    `${translationPath}add-the-applicant-to-one-of-the-pipelines-below`,
                  )}
                  :
                </div>
                <SharedAutocompleteControl
                  placeholder="select-pipeline"
                  title="pipeline"
                  stateKey="uuid"
                  getOptionLabel={(option) => option.title}
                  isRequired
                  sharedClassesWrapper="px-2"
                  errors={{
                    uuid: {
                      error: activeJob && !selectedStage,
                      message: t('Shared:this-field-is-required'),
                    },
                  }}
                  initValues={activeJob && activeJob.pipelines}
                  isSubmitted={isSubmitted}
                  errorPath="uuid"
                  initValuesKey="uuid"
                  isEntireObject
                  initValuesTitle="title"
                  onValueChanged={({ value }) => {
                    if (value) {
                      const applyStage = value.stages.find(
                        (item) => item.type === PipelineStagesEnum.APPLIED.key,
                      );
                      if (applyStage) {
                        setSelectedStage(applyStage.uuid);
                        return;
                      }
                    }
                    setSelectedStage(null);
                  }}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
                {!email && !isMultiple && (
                  <>
                    <div className="font-weight-normal text-gray mt-4">
                      {t(`${translationPath}select-stage-description`)}
                    </div>
                    <Input
                      placeholder={t(`${translationPath}email-address`)}
                      className="form-control-alternative"
                      type="email"
                      name="email"
                      autoComplete=""
                      onChange={(e) => setSelectedEmail(e.target.value)}
                      value={selectedEmail}
                    />
                  </>
                )}
                <div className="mt-5 mb-4 d-flex justify-content-center">
                  <Button
                    color="primary"
                    style={{ width: '220px' }}
                    disabled={
                      saving
                      || (isMultiple
                        && source === 'rms'
                        && !handledItems?.withEmailsitems?.length)
                      || (isMultiple
                        && props.fromCandidateDatabase
                        && !handledItems?.completedItems?.length)
                    }
                    onClick={onApply}
                  >
                    {saving && <i className="fas fa-circle-notch fa-spin mr-2" />}
                    {`${
                      saving
                        ? t(`${translationPath}saving`)
                        : t(`${translationPath}save`)
                    }`}
                  </Button>
                </div>
              </>
            )}
          </ModalBody>
        </div>
      }
    />
  );
};

export default AddToPipeline;
