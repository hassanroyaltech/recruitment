import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import moment from 'moment';
import i18next from 'i18next';
import ButtonBase from '@mui/material/ButtonBase';
import {
  getErrorByName,
  GlobalDateFormat,
  showError,
  showSuccess,
} from '../../../../../helpers';
import {
  AddChannelsToCampaignV2,
  AddContractToCampaignV2,
  ByChannelsCreditsV2,
  CampaignCheckoutV2,
  CampaignRenameV2,
  CheckCampaignDetails,
  GetSavedDataForCampaign,
  SaveCampaignDetails,
} from '../../../../../services';
import {
  DialogComponent,
  Inputs,
  LoaderComponent,
  RadiosComponent,
  StepperComponent,
} from '../../../../../components';
import { CampaignManagementStepsV2 } from '../../../shared';
import './CampaignManagementDialog.Style.scss';
import {
  DynamicFormTypesEnum,
  ReviewTypesEnum,
  SystemActionsEnum,
} from '../../../../../enums';
import { CampaignManagementConfirmDialog } from './dialogs';
import { SetupsReducer, SetupsReset } from '../../../../setups/shared';
import { MutateChannelsDataHelper } from '../../helpers/MutateChannelsData.helper';
import { MutateContractsDataHelper } from '../../helpers/MutateContractsData.helper';
import { FlattenFields } from '../../helpers/RecursiveFields.helper';
import { FlattenContractDetails } from '../../helpers/FlattenContractDetails.helper';
import { GetFieldsSchemaHelper } from '../../helpers/GetFieldsSchema.helper';
import { GetIsFieldDisplayedHelper } from '../../helpers/GetIsFieldDisplayed.helper';
import { MutateVonqErrorsHelper } from '../../helpers/MutateVonqErrors.helper';

export const CampaignManagementDialog = ({
  activeItem,
  isOpen,
  onSave,
  isOpenChanged,
  onSessionStart,
  initActiveStep,
  onStartCampaignHandler,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [activeStep, setActiveStep] = useState(initActiveStep || 0);
  const [activeStepperComponent, setActiveStepperComponent] = useState(null);
  const [isActiveEditModeForCampaignName, setIsActiveEditModeForCampaignName]
    = useState(false);
  const [campaignName, setCampaignName] = useState(null);
  const [renameCampaignValue, setRenameCampaignValue] = useState(null);
  const [globalIsLoading, setGlobalIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isOpenCampaignConfirmDialog, setIsOpenCampaignConfirmDialog]
    = useState(false);
  const [isSubmittedName, setIsSubmittedName] = useState(true);
  const [isReload, setIsReload] = useState(false);
  const [isValidateOnlyActiveIndex, setIsValidateOnlyActiveIndex] = useState(false);
  const [isLoadingRename, setIsLoadingRename] = useState(false);
  const [errors, setErrors] = useState(() => ({}));
  const stateInitRef = useRef({
    selectedChannels: [],
    selectedContracts: [],
    totalCost: 0,
  });
  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );
  const stepsDependOnSelectedContracts = useMemo(
    () =>
      state.totalCost > 0
        ? CampaignManagementStepsV2
        : CampaignManagementStepsV2.filter((item) => item.key !== 'payment'),
    [state.totalCost],
  );
  const isWithContracts = useMemo(
    () =>
      stepsDependOnSelectedContracts.some((item) => item.key === 'contractDetails'),
    [stepsDependOnSelectedContracts],
  );
  const activeStepData = useMemo(
    () => stepsDependOnSelectedContracts[activeStep],
    [activeStep, stepsDependOnSelectedContracts],
  );
  const getJobDetailsErrors = useCallback(
    () =>
      yup
        .object()
        .nullable()
        .test(
          'channelsIsRequired',
          t(`${translationPath}please-select-at-least-one-channel`),
          () => state.selectedChannels.length + state.selectedContracts.length > 0,
        )
        .test(
          'jobIsRequired',
          t(`${translationPath}job-details-step-is-required`),
          () =>
            ![...state.selectedChannels, ...state.selectedContracts].some(
              (item) => item.vendor_type === 1,
            )
            || ([...state.selectedChannels, ...state.selectedContracts].some(
              (item) => item.vendor_type === 1,
            )
              && state[ReviewTypesEnum.job.key]
              && Object.keys(state[ReviewTypesEnum.job.key]).length > 0),
        ),
    [state, t, translationPath],
  );

  const getContractDetailsErrors = useCallback(
    () =>
      yup
        .object()
        .nullable()
        .test(
          'channelsIsRequired',
          t(`${translationPath}please-select-at-least-one-channel`),
          () => state.selectedChannels.length + state.selectedContracts.length > 0,
        )
        .test(
          'contractIsRequired',
          t(`${translationPath}contract-details-step-is-required`),
          () =>
            ![...state.selectedChannels, ...state.selectedContracts].some(
              (item) => item.vendor_type === 1,
            )
            || ([...state.selectedChannels, ...state.selectedContracts].some(
              (item) => item.vendor_type === 1,
            )
              && state[ReviewTypesEnum.contract.key]
              && Object.keys(state[ReviewTypesEnum.contract.key]).length > 0),
        ),
    [state, t, translationPath],
  );
  const getCampaignErrors = useCallback(
    () =>
      yup
        .object()
        .nullable()
        .test(
          'channelsIsRequired',
          t(`${translationPath}please-select-at-least-one-channel`),
          () =>
            (state.selectedChannels.length || 0)
              + (state.selectedContracts.length || 0)
            > 0,
        )
        .test(
          'reviewIsRequired',
          t(`${translationPath}review-step-is-required`),
          () =>
            ![...state.selectedChannels, ...state.selectedContracts].some(
              (item) => item.vendor_type === 1,
            )
            || ([...state.selectedChannels, ...state.selectedContracts].some(
              (item) => item.vendor_type === 1,
            )
              && state[ReviewTypesEnum.campaign.key]
              && Object.keys(state[ReviewTypesEnum.campaign.key]).length > 0),
        ),
    [state, t, translationPath],
  );
  const schema = useRef(null);
  const getErrors = useCallback(() => {
    // let localSchema = {
    //   current: yup.object().nullable().shape(schema.current),
    // };
    const campaignFields = FlattenFields(state.campaignData?.campaign_fields || []);
    const contractFields = FlattenContractDetails(
      state.campaignData?.contract_fields || [],
    );
    let localSchema = {
      current: yup.object().shape({
        ...schema.current,
        campaign_fields: GetFieldsSchemaHelper(campaignFields, t),
        contract_fields: GetFieldsSchemaHelper(contractFields, t),
      }),
    };
    if (activeStepData?.key === 'payment')
      localSchema = {
        current: yup.object().shape({
          ...schema.current,
          job: getJobDetailsErrors(),
          // campaign: getCampaignErrors(),
          campaign_fields: GetFieldsSchemaHelper(campaignFields, t),
          contract_fields: GetFieldsSchemaHelper(contractFields, t),
        }),
      };

    getErrorByName(localSchema, {
      ...state,
      ...(state.campaignData && {
        campaign_fields: campaignFields,
        contract_fields: contractFields,
      }),
    }).then((result) => {
      setErrors(result);
    });
  }, [activeStepData?.key, getJobDetailsErrors, state, t]);

  const onStateChanged = useCallback((newValue) => {
    setState(newValue);
  }, []);
  const getIsInvalidChannels = (index) =>
    errors.selectedChannels
    && errors.selectedChannels.error
    && index
      === stepsDependOnSelectedContracts.findIndex((item) => item.key === 'channels');
  const getIsInvalidCampaignDetails = (index) =>
    Object.entries(errors).some(
      (item) => item[0].includes('fields') && item[1].error,
    )
    && index
      === stepsDependOnSelectedContracts.findIndex(
        (item) => item.key === 'campaignDetails',
      );

  const getIsInvalidSteps = (index) =>
    getIsInvalidChannels(index) || getIsInvalidCampaignDetails(index);
  const completedHandler = (index) => {
    if (getIsInvalidSteps(index)) return false;

    return index < activeStep;
  };
  const goToPageHandler = (newIndex) => () => {
    setActiveStep(newIndex);
  };
  const onStepperClick = (newIndex) => {
    const previewsInvalidIndex = stepsDependOnSelectedContracts.findIndex(
      (item, index) => index < newIndex && getIsInvalidSteps(index),
    );
    if (previewsInvalidIndex !== -1) {
      if (previewsInvalidIndex !== activeStep) {
        showError(
          `${t(`${translationPath}please-finish`)} ${t(
            `${translationPath}${stepsDependOnSelectedContracts[previewsInvalidIndex].label}`,
          )} ${t(`${translationPath}first`)}`,
        );
        setActiveStep(previewsInvalidIndex);
      } else {
        setIsValidateOnlyActiveIndex(true);
        setIsSubmitted(true);
        if (activeStep === 0 && errors.selectedChannels)
          showError(t(errors.selectedChannels.message));
        else if (
          ['campaignDetails'].includes(activeStepData.key)
          && Object.keys(errors).toString().includes('campaign_fields')
        )
          showError(t(`${translationPath}please-fill-all-the-mandatory-fields`));
        else showError(t(`${translationPath}please-finish-the-current-step-first`));
      }
      return;
    }
    if (isValidateOnlyActiveIndex) {
      setIsValidateOnlyActiveIndex(false);
      setIsSubmitted(false);
    }
    if (
      (!state.selectedChannels || state.selectedChannels.length === 0)
      && (!state.selectedContracts || state.selectedContracts.length === 0)
    )
      return;
    setActiveStep(newIndex);
  };
  const onSchemaChanged = useCallback(
    (newValue) => {
      schema.current = newValue;
      getErrors();
    },
    [getErrors, state],
  );
  const onSuccessSavingHandler = () => {
    showSuccess(t(`${translationPath}campaign-updated-successfully`));
    if (onSave) onSave();
    if (isOpenChanged) isOpenChanged(true);
  };

  const campaignDetailsSaveHandler = async () => {
    setGlobalIsLoading(true);

    const toSaveDetailsObj = {
      campaign_uuid: activeItem.uuid,
      campaign_fields: state.campaignData.campaign_fields.length
        ? state.campaignData.campaign_fields
        : [],
      contract_fields: state.campaignData.contract_fields?.length
        ? state.campaignData.contract_fields.map((field) => ({
          ...field,
          current_value: GetIsFieldDisplayedHelper(
            state.campaignData.contract_fields,
            field,
          )
            ? field.current_value
            : field.type === DynamicFormTypesEnum.array.key
              ? []
              : null,
        }))
        : [],
    };

    return await SaveCampaignDetails(toSaveDetailsObj);
  };

  const nextHandler = () => {
    if (isSubmitted) {
      setIsSubmitted(false);
      setIsValidateOnlyActiveIndex(false);
    }

    if (!getIsInvalidSteps(activeStep)) setActiveStep((prevState) => prevState + 1);
    else {
      setIsValidateOnlyActiveIndex(true);
      setIsSubmitted(true);
      if (activeStepData.key === 'channels' && errors.selectedChannels)
        showError(t(errors.selectedChannels.message));
      else if (
        ['campaignDetails'].includes(activeStepData.key)
        && Object.keys(errors).toString().includes('campaign_fields')
      )
        showError(t(`${translationPath}please-fill-all-the-mandatory-fields`));
      else showError(t(`${translationPath}please-finish-the-current-step-first`));
    }
  };

  const checkoutCampaignHandler = async () => {
    const response = await CampaignCheckoutV2({
      campaign_uuid: activeItem.uuid,
    });
    setGlobalIsLoading(false);
    if (response && response.status === 200) {
      showSuccess(t(`${translationPath}campaign-updated-successfully`));
      if (onStartCampaignHandler) onStartCampaignHandler();
    } else showError(t(`${translationPath}campaign-update-failed`));
  };

  const checkoutProductHandler = async () => {
    const response = await ByChannelsCreditsV2({
      channels: state.selectedChannels
        .filter((item) => item.final_cost > 0 && item.credit === 0)
        .map((item) => ({
          quantity: 1,
          product_id: item.uuid,
        })),
    });
    if (response && response.status === 200) {
      const session = {
        reset: true,
        products: [{ path: response.data.results.fast_spring_id, quantity: 1 }],
        coupon: 'FREE',
        paymentContact: response.data.results.data,
        checkout: false,
      };
      if (onSessionStart) onSessionStart(session, state);
      // window.fastspring.builder.language(i18next.language);
      // window.fastspring.builder.push(session);
    } else {
      showError(t(`${translationPath}campaign-update-failed`));
      setGlobalIsLoading(false);
    }
  };
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    setIsValidateOnlyActiveIndex(true);
    if (activeStepData.key === 'channels' && !getIsInvalidChannels(activeStep)) {
      onSuccessSavingHandler();
      return;
    }
    if (
      (activeStepData.key === 'campaignDetails'
        || activeStepData.key === 'payment')
      && !getIsInvalidCampaignDetails(1)
    ) {
      const response = await campaignDetailsSaveHandler();
      if (response && response.status === 200) {
        setGlobalIsLoading(false);
        onSuccessSavingHandler();
      } else {
        setGlobalIsLoading(false);
        showError(
          (response && response.data && response.data.message)
            || t(`${translationPath}campaign-update-failed`),
        );
      }
      return;
    }

    if (Object.keys(errors).length > 0)
      if (activeStep === 0 && errors.selectedChannels)
        showError(t(errors.selectedChannels.message));
      else if (
        ['campaignDetails'].includes(activeStepData.key)
        && Object.keys(errors).toString().includes('fields')
      )
        showError(t(`${translationPath}please-fill-all-the-mandatory-fields`));
      else showError(t('Shared:please-fix-all-errors'));
  };
  const payAndStartCampaignHandler = () => {
    if (Object.keys(errors).toString().includes('fields')) {
      setIsSubmitted(true);
      setIsValidateOnlyActiveIndex(true);
      showError(t(`${translationPath}please-fill-all-the-mandatory-fields`));
      return;
    }
    setIsOpenCampaignConfirmDialog(true);
  };
  const startCampaignHandler = async () => {
    setIsOpenCampaignConfirmDialog(false);
    setGlobalIsLoading(true);
    // setState({ id: 'savedSelectedChannels', value: state.selectedChannels });
    const response = await campaignDetailsSaveHandler();
    if (response && response.status !== 200) {
      setGlobalIsLoading(false);
      showError(t(`${translationPath}campaign-update-failed`));
      return;
    }

    if (state.totalCost === 0) {
      const checkResponse = await CheckCampaignDetails({
        campaign_uuid: activeItem.uuid,
      });
      if (checkResponse.status === 200) await checkoutCampaignHandler();
      else {
        setGlobalIsLoading(false);
        showError(
          t(`${translationPath}campaign-update-failed`),
          MutateVonqErrorsHelper(checkResponse),
        );
      }
    } else await checkoutProductHandler();
  };

  const getSavedDataForCampaign = useCallback(
    async () =>
      await GetSavedDataForCampaign({
        campaign_uuid: activeItem.uuid,
      }),
    [activeItem.uuid],
  );

  const getInitActiveStep = useCallback((savedDataForCampaign) => {
    if (
      savedDataForCampaign.campaign_channels?.length > 0
      || savedDataForCampaign?.campaign_contract
    )
      setActiveStep(1);
  }, []);

  const handleRemoveChannel = useCallback(
    async ({ channel, selectedChannels }) => {
      setGlobalIsLoading(true);
      const bodyObj = {
        ...(channel.is_contract
          ? {
            contract_id: '',
          }
          : {
            channels:
                selectedChannels
                  .filter((item) => item.uuid !== channel.uuid)
                  .map((item) => item.uuid) || [],
          }),
        campaign_uuid: activeItem.uuid,
      };
      let response;
      if (channel.is_contract) response = await AddContractToCampaignV2(bodyObj);
      else response = await AddChannelsToCampaignV2(bodyObj);
      setGlobalIsLoading(false);
      if (response && response.status === 200)
        setState({
          id: 'destructObject',
          value: {
            selectedChannels:
              MutateChannelsDataHelper(response.data?.results?.campaign_channels)
              || [],
            selectedContracts: [],
            totalCost:
              (response.data
                && response.data.results
                && response.data.results.cost)
              || 0,
          },
        });
      else
        showError(
          (response && response.data.message)
            || t(`${translationPath}channel-delete-failed`),
        );
    },
    [activeItem.uuid, t, translationPath],
  );
  const getEditInit = useCallback(async () => {
    setGlobalIsLoading(true);
    const campaignResponse = await getSavedDataForCampaign();
    setGlobalIsLoading(false);
    if (!campaignResponse || campaignResponse.status !== 200) {
      showError(t(`${translationPath}failed-to-get-saved-data`), campaignResponse);
      if (isOpenChanged) isOpenChanged();
      return;
    }
    let savedDataForCampaign = null;
    if (campaignResponse.data.results)
      savedDataForCampaign = campaignResponse.data.results;

    setState({
      id: 'edit',
      value: {
        selectedChannels:
          MutateChannelsDataHelper(savedDataForCampaign.campaign_channels) || [],
        selectedContracts:
          (savedDataForCampaign.campaign_contract
            && MutateContractsDataHelper([savedDataForCampaign.campaign_contract]))
          || [],
        savedSelectedChannels:
          (savedDataForCampaign.campaign_channels
            && MutateChannelsDataHelper(savedDataForCampaign.campaign_channels))
          || [],
        savedSelectedContracts:
          (savedDataForCampaign.campaign_contract
            && MutateContractsDataHelper([savedDataForCampaign.campaign_contract]))
          || [],
        campaignData: {
          campaign_fields: savedDataForCampaign.campaign_data || [],
          contract_fields: savedDataForCampaign.contract_data || [],
        },
        totalCost: savedDataForCampaign.cost ? savedDataForCampaign.cost : 0,
        errors: savedDataForCampaign.errors || [],
        canStartCampaign: !!savedDataForCampaign.can_start_campaign,
      },
    });
    if (initActiveStep) return;
    getInitActiveStep(savedDataForCampaign);
  }, [
    getInitActiveStep,
    getSavedDataForCampaign,
    initActiveStep,
    isOpenChanged,
    t,
    translationPath,
  ]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to make payment step disabled if totalCost is 0
   * @return boolean
   */
  const isDisabledStepHandler = useMemo(
    () => (index) => index === 3 && state.totalCost === 0,
    [state.totalCost],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to rename campaign
   */
  const campaignRenameHandler = async () => {
    if (campaignName === renameCampaignValue) {
      setIsActiveEditModeForCampaignName(false);
      setIsSubmittedName(true);
      return;
    }
    setIsSubmittedName(true);
    if (!renameCampaignValue || renameCampaignValue.length > 255) return;
    // showError('Shared:please-fix-all-errors');
    setIsLoadingRename(true);
    const response = await CampaignRenameV2({
      campaign_uuid: activeItem.uuid,
      title: renameCampaignValue,
    });
    setIsLoadingRename(false);
    if (response && response.status === 202) {
      showSuccess(t(`${translationPath}campaign-renamed-successfully`));
      setIsActiveEditModeForCampaignName(false);
      setIsSubmittedName(false);
      setIsReload(true);
      setCampaignName(renameCampaignValue);
    } else {
      showError(
        (response && response.data && response.data.message)
          || t(`${translationPath}campaign-rename-failed`),
      );
      setRenameCampaignValue(campaignName);
    }
  };

  useEffect(() => {
    if (activeItem) getEditInit();
  }, [activeItem, getEditInit]);
  useEffect(() => {
    getErrors();
  }, [getErrors, state, activeStep, globalIsLoading]);
  useEffect(() => {
    schema.current = {
      selectedChannels: yup.lazy((value, obj) => {
        if (obj?.parent?.selectedContracts?.length === 0 && value?.length === 0)
          return yup
            .array()
            .min(1, t(`${translationPath}please-select-at-least-one-channel`));
        else return yup.array();
      }),
      selectedContracts: yup.lazy((value, obj) => {
        if (obj?.parent?.selectedChannels?.length === 0 && value?.length === 0)
          return yup
            .array()
            .min(1, t(`${translationPath}please-select-at-least-one-channel`));
        else return yup.array();
      }),
      job: getJobDetailsErrors(),
      campaign: getCampaignErrors(),
      ...(isWithContracts && { contract: getContractDetailsErrors() }),
    };
  }, [
    getCampaignErrors,
    getContractDetailsErrors,
    getJobDetailsErrors,
    isWithContracts,
    t,
    translationPath,
  ]);

  return (
    <DialogComponent
      maxWidth="lg"
      isFixedHeight
      dialogTitle={
        <div className="campaign-manage-title-dialog-wrapper">
          <div className="title-contents-wrapper">
            <div className="campaign-title-icon-wrapper">
              <span className="fas fa-bullhorn fa-lg" />
            </div>
            <div className="title-contents-items-wrapper">
              <div className="title-header-wrapper">
                {!isActiveEditModeForCampaignName && (
                  <ButtonBase
                    className="btns theme-transparent texts-header mx-0"
                    onClick={() => {
                      if (!campaignName) setCampaignName(activeItem.title);
                      setRenameCampaignValue(activeItem.title);
                      setIsActiveEditModeForCampaignName(true);
                    }}
                  >
                    <span className="c-black-light">
                      <span>{t(`${translationPath}campaign`)}</span>
                      <span>:</span>
                      <span className="px-1">
                        {campaignName || (activeItem && activeItem.title) || 'N/A'}
                      </span>
                    </span>
                  </ButtonBase>
                )}
                {isActiveEditModeForCampaignName && (
                  <div className="d-flex px-2">
                    <span className="mt-2">
                      <span>{t(`${translationPath}campaign`)}</span>
                      <span>:</span>
                    </span>
                    <div className="d-inline-flex w-100 px-2">
                      <Inputs
                        idRef="renameCampaignNameInputRef"
                        value={renameCampaignValue}
                        themeClass="theme-solid"
                        label="campaign-name"
                        inputPlaceholder="campaign-name"
                        parentTranslationPath={parentTranslationPath}
                        translationPath={translationPath}
                        error={
                          !renameCampaignValue || renameCampaignValue.length > 255
                        }
                        isSubmitted={isSubmittedName}
                        helperText={
                          (!renameCampaignValue
                            && t(`${translationPath}campaign-title-is-required`))
                          || `${t(
                            `${translationPath}the-title-can-not-be-more-than`,
                          )} ${255}`
                        }
                        onInputChanged={(event) => {
                          const { value } = event.target;
                          setRenameCampaignValue(value);
                        }}
                      />
                    </div>
                    <div className="d-inline-flex mt-1">
                      <ButtonBase
                        className="btns-icon mx-1 theme-transparent c-secondary"
                        disabled={isLoadingRename}
                        onClick={campaignRenameHandler}
                      >
                        <LoaderComponent
                          isLoading={isLoadingRename}
                          isSkeleton
                          wrapperClasses="position-absolute w-100 h-100 br-100"
                          skeletonStyle={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '100%',
                          }}
                        />
                        <span className={SystemActionsEnum.edit.icon} />
                      </ButtonBase>
                      <ButtonBase
                        className="btns-icon mx-1 theme-transparent c-warning"
                        disabled={isLoadingRename}
                        onClick={() => {
                          setIsActiveEditModeForCampaignName(false);
                          setIsSubmittedName(false);
                        }}
                      >
                        <span className="fas fa-times" />
                      </ButtonBase>
                    </div>
                  </div>
                )}
              </div>
              <div className="title-body-wrapper">
                <div className="title-body-item-wrapper">
                  <span>
                    <span>{t(`${translationPath}job`)}</span>
                    <span>:</span>
                    <span className="px-1">
                      {(activeItem && activeItem.job_title) || 'N/A'}
                    </span>
                  </span>
                  <span className="px-2">
                    <span>{t(`${translationPath}created`)}</span>
                    <span>:</span>
                    <span className="px-1">
                      {(activeItem
                        && activeItem.created_at
                        && moment(activeItem.created_at)
                          .locale(i18next.language)
                          .format(GlobalDateFormat))
                        || 'N/A'}
                    </span>
                  </span>
                </div>
                <div className="title-body-item-wrapper">
                  <StepperComponent
                    steps={stepsDependOnSelectedContracts}
                    activeStep={activeStep}
                    onStepperClick={onStepperClick}
                    isWithControlledCompleted
                    isDisabledAll={globalIsLoading}
                    isDisabled={isDisabledStepHandler}
                    hasError
                    isValidateOnlyActiveIndex={isValidateOnlyActiveIndex}
                    completed={completedHandler}
                    isSubmitted={isSubmitted}
                    connector={
                      <span className="connect-icon fas fa-chevron-right fa-sm" />
                    }
                    dynamicComponentLocationChanger={(component) => {
                      setActiveStepperComponent(component);
                    }}
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                    dynamicComponentProps={{
                      state,
                      schema,
                      activeItem,
                      onSchemaChanged,
                      onStateChanged,
                      isOpenChanged,
                      goToPageHandler,
                      payAndStartCampaignHandler,
                      saveHandler,
                      nextHandler,
                      isSubmitted,
                      globalIsLoading,
                      errors,
                      parentTranslationPath,
                      handleRemoveChannel,
                    }}
                    icon={(index, isCompleted, isInvalid, isDisabled) => (
                      <RadiosComponent
                        idRef={`stepsRadioRef${index + 1}`}
                        value={activeStep === index}
                        isDisabled={isDisabled}
                        checkedIcon={
                          (isInvalid && 'fas fa-exclamation-triangle')
                          || (isCompleted && 'fas fa-check-circle')
                          || undefined
                        }
                        icon={
                          (isInvalid && 'fas fa-exclamation-triangle')
                          || (isCompleted && 'fas fa-check-circle')
                          || undefined
                        }
                        themeClass="theme-line-secondary"
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
          <CampaignManagementConfirmDialog
            onSave={startCampaignHandler}
            isOpen={isOpenCampaignConfirmDialog}
            isOpenChanged={() => setIsOpenCampaignConfirmDialog(false)}
            parentTranslationPath={parentTranslationPath}
          />
        </div>
      }
      dialogContent={
        <div className="campaign-management-content-dialog-wrapper">
          {activeStepperComponent || null}
        </div>
      }
      wrapperClasses="campaign-management-dialog-wrapper"
      // isSaving={globalIsLoading}
      isOpen={isOpen}
      onSubmit={saveHandler}
      onCloseClicked={() => {
        const isReloadParent = activeItem.cost !== state.totalCost || isReload;
        if (isOpenChanged) isOpenChanged(isReloadParent);
      }}
      // onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

CampaignManagementDialog.propTypes = {
  activeItem: PropTypes.shape({
    uuid: PropTypes.string,
    campaign_channels: PropTypes.instanceOf(Array),
    campaign_contracts: PropTypes.instanceOf(Array),
    cost: PropTypes.number,
    title: PropTypes.string,
    job_title: PropTypes.string,
    vendor_type: PropTypes.oneOf([1, 2]),
    created_at: PropTypes.string,
  }),
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  onSessionStart: PropTypes.func,
  onStartCampaignHandler: PropTypes.func,
  initActiveStep: PropTypes.number,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
  onSave: PropTypes.func,
};
CampaignManagementDialog.defaultProps = {
  isOpenChanged: undefined,
  onSave: undefined,
  onSessionStart: undefined,
  initActiveStep: undefined,
  onStartCampaignHandler: undefined,
  translationPath: 'CampaignManagementDialog.',
  activeItem: undefined,
};
