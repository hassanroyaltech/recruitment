import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  GetFormSourceItem,
  GlobalHistory,
  showError,
  showSuccess,
} from '../../../../helpers';
import axios from 'axios';
import {
  Grid,
  Stack,
  Chip,
  Select,
  Typography,
  IconButton,
  MenuItem,
  Switch,
  ButtonBase,
} from '@mui/material';
import {
  CrossIcon,
  ArrowRightIcon,
  CornerDownIcon,
  IndicatorIcon,
} from '../../icons';
import Modal from '../../components/Modal';
import ActionModalBody from './ActionModal';
import { toSnakeCase } from '../../utils/helpers/toSnakeCase';

import urls from '../../../../api/urls';
import { generateHeaders } from '../../../../api/headers';
import {
  SignForm,
  UpdateOffer,
  GetOfferRecipientPDF,
  RejectForm,
  RequestFormMoreInfo,
  GenerateSSOKey,
  sendOfferToBulkSelectedCandidates,
} from 'services';
import { OffersStatusesEnum } from 'enums/Shared/OffersStatuses.Enum';
import { useSelector } from 'react-redux';

// FIX why using 2 differnt modals at the same component?
// TODO prefer using the Modal with design that form-builder follows could be fount in '../../compnonents/Modal';
import { DialogComponent } from 'components';
import {
  FormRejectionReasonsEnum,
  FormRequestMoreInfoEnum,
  NavigationSourcesEnum,
  TemplateRolesEnum,
} from '../../../../enums';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { SharedInputControl, SharedAutocompleteControl } from 'pages/setups/shared';
import { useEventListener, useQuery } from '../../../../hooks';
import { VitallyTrack } from '../../../../utils/Vitally';

export default function Header({
  preview,
  setPreview,
  templateData,
  dataSectionItems,
  lastTimeChanged,
  offerData,
  setIsSubmitted,
  isGlobalLoading,
  isValidOffer,
  queryStatus,
  errors,
  getIsValidData,
  isLoadingPDF,
  setIsLoadingPDF,
  isLoading,
  setIsLoading,
  setHeaderHeight,
  SendEmailWithOfferHandler,
  getIsFormSource,
  getSourceItem,
  scrollToField,
  setDataSectionItems,
  setTemplateData,
  isOpenSideMenu,
  setIsOpenSideMenu,
  pdfDownLoad,
  pdfRef,
  isFromBulkSelect,
  parentTranslationPath,
}) {
  const history = GlobalHistory;
  const { search } = useLocation();
  const { t } = useTranslation('Shared');
  const headerRef = useRef(null);
  const timerResizeRef = useRef(null);
  const [isOpen, setOpen] = React.useState(false);
  const offersValidationWithDatabaseReducer = useSelector(
    (reducerState) => reducerState?.offersValidationWithDatabaseReducer,
  );
  const modalRevokeBodyText = `If you unpublish the form, this will mean that the recipient will no longer be able to see the form via the link you sent. To make the form available for recipient again, you will have to publish it on again.
Are you sure you want to unpublish the form?`;
  const modalWithdrawBodyText = `If you unpublish the form, the members will no longer be able to see the form you requested to approve. To make the form available for members, you will have to sent it once again.
Are you sure you want to withdraw the form from review?`;
  const candidateUserReducer = useSelector((state) => state?.candidateUserReducer);
  const [showRequestMoreInfoDialog, setShowRequestMoreInfoDialog] = useState(false);
  const [showRejectConfirmDialog, setShowRejectConfirmDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState({
    key: null,
    description: '',
  });
  const [requestMoreInfo, setRequestMoreInfo] = useState({
    key: null,
    description: '',
  });
  const [rejectionAttempted, setRejectionAttempted] = useState(false);
  const [requestMoreInfoAttempted, setRequestMoreInfoAttempted] = useState(false);
  const query = useQuery();

  const handleWithdraw = () => {
    // TODO widthdraw modal action
  };
  const handleRevoke = () => {
    // TODO revoke modal action
  };

  const sendData = async () => {
    if (Object.values(errors).filter((item) => item).length) {
      showError('Please fill fields with only valid formats');
      return;
    }
    const template = { ...templateData, sections: dataSectionItems };
    setIsLoading(true);
    if (!templateData.uuid)
      await axios
        .post(
          urls.formBuilder.CREATE_TEMPLATE,
          {
            ...toSnakeCase(template),
            type_uuid: templateData.typeUUID,
            primaryFontFamily: templateData.primaryFontFamily,
            workflow_approval_fields: templateData.workflowApprovalFields?.map(
              (it, idx) => ({ ...it, order: idx + 1 }),
            ),
          },
          { headers: generateHeaders() },
        )
        .then(() => {
          showSuccess('Form template created successfully');
          if (templateData.typeUUID)
            history.push(
              `/recruiter/form-builder?template_type_uuid=${templateData.typeUUID}`,
            );
          else history.push(`/recruiter/form-builder`);
        })
        .catch((error) => {
          setIsLoading(false);
          showError('', error);
        });
    else
      await axios
        .put(
          urls.formBuilder.UPDATE_TEMPLATE,
          {
            ...toSnakeCase(template),
            uuid: templateData.uuid,
            primaryFontFamily: templateData.primaryFontFamily,
            workflow_approval_fields: templateData.workflowApprovalFields?.map(
              (it, idx) => ({ ...it, order: idx + 1 }),
            ),
          },
          { headers: generateHeaders() },
        )
        .then(() => {
          showSuccess('Form template updated successfully');
          if (templateData.typeUUID)
            history.push(
              `/recruiter/form-builder?template_type_uuid=${templateData.typeUUID}`,
            );
          else history.push(`/recruiter/form-builder`);
        })
        .catch((error) => {
          setIsLoading(false);
          showError('', error);
        });
  };

  // Will be removed when old form builder is removed
  const selfServiceHandler = useCallback(
    async (formSourceItem) => {
      const response = await GenerateSSOKey();
      if (response && response.status === 201) {
        const { results } = response.data;
        const account_uuid = localStorage.getItem('account_uuid');
        const user
          = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'));
        window.open(
          `${process.env.REACT_APP_SELFSERVICE_URL}/accounts/login?token_key=${
            results.key
          }&account_uuid=${account_uuid}${
            user?.results?.user?.uuid
              ? `&user_uuid=${user?.results?.user?.uuid}`
              : ''
          }&redirect_path=${
            (formSourceItem.source_url
              && formSourceItem.source_url({
                templateData,
                offerData,
                query,
              }))
            || ''
          }`,
          '_self',
        );
      } else if (!response || response.message)
        showError(t('Shared:failed-to-get-saved-data'));
    },
    [t, query, templateData, offerData],
  );

  const sendOffer = React.useCallback(async () => {
    setIsSubmitted(true);
    if (
      isFromBulkSelect
      && (!templateData.assign || templateData.assign.length === 0)
    ) {
      showError(
        `${t('Shared:please-select-at-least')} ${1} ${t(
          `${parentTranslationPath}:assign`,
        )}`,
      );
      return;
    }
    if (Object.values(errors).filter((item) => item).length) {
      showError('Please fill fields with only valid formats');
      return;
    }
    const isValidData = getIsValidData(
      TemplateRolesEnum.Sender.key,
      templateData.primaryLang,
      templateData.secondaryLang,
      dataSectionItems,
    );
    if (isValidData?.data?.errors?.length > 0) {
      if (isValidData?.data?.errors?.some((item) => item.id))
        scrollToField(isValidData?.data?.errors?.find((item) => item.id).id);
      showError('', isValidData);
      return;
    }
    const template = {
      ...templateData,
      sections: dataSectionItems,
      status: OffersStatusesEnum.WaitingToBeSigned.key,
      name: templateData.name || 'Untitled',
    };
    setIsLoading(true);
    const response = await (isFromBulkSelect
      ? sendOfferToBulkSelectedCandidates
      : UpdateOffer)({
      uuid: offerData.uuid,
      ...toSnakeCase(template),
      status: OffersStatusesEnum.WaitingToBeSigned.key,
    });
    if (response && (response.status === 201 || response.status === 200)) {
      VitallyTrack('EVA-REC - Send Offer');
      window?.ChurnZero?.push([
        'trackEvent',
        'Send offer',
        'Send new offer to candidate',
        1,
        {},
      ]);
      showSuccess(
        t(`${(getIsFormSource() && 'form') || 'offer'}-updated-successfully`),
      );
      if (
        !templateData.isNotShareable
        && !response.data.results.is_manual
        && response.data.results.status === OffersStatusesEnum.Draft.key
      )
        SendEmailWithOfferHandler(offerData.uuid);
      else {
        setIsLoading(false);
        const formSourceItem = GetFormSourceItem(
          query.get('source') && parseInt(query.get('source')),
          offerData.code,
        );
        if (formSourceItem?.isFromSelfService) {
          await selfServiceHandler(formSourceItem);
          return;
        }
        if (formSourceItem && formSourceItem.source_url && isFromBulkSelect)
          history.push(formSourceItem.source_url({ templateData }));
        history.push(
          (getSourceItem().source_url
            && getSourceItem().source_url({ offerData, templateData }))
            || `/recruiter/job/manage/pipeline/${offerData.jobUuid}?${
              offerData.pipelineUuid
                ? `pipeline_uuid=${offerData.pipelineUuid}&`
                : ''
            }candidate_uuid=${offerData.candidateUuid}&source=${
              NavigationSourcesEnum.FromFormBuilderToPipeline.key
            }`,
        );
      }
    } else {
      setIsLoading(false);
      showError(t('Shared:failed-to-get-saved-data'), response);
    }
  }, [
    setIsSubmitted,
    isFromBulkSelect,
    templateData,
    errors,
    getIsValidData,
    dataSectionItems,
    setIsLoading,
    offerData,
    t,
    parentTranslationPath,
    scrollToField,
    getIsFormSource,
    SendEmailWithOfferHandler,
    query,
    history,
    getSourceItem,
    selfServiceHandler,
  ]);

  const handleClose = () => {
    const formSourceItem = GetFormSourceItem(
      query.get('source') && parseInt(query.get('source')),
      offerData.code,
    );
    if (formSourceItem?.isFromSelfService) {
      selfServiceHandler(formSourceItem);
      return;
    }
    if (!queryStatus)
      if (templateData.typeUUID)
        return history.push(
          `/recruiter/form-builder?template_type_uuid=${templateData.typeUUID}`,
        );
    if (offerData?.jobUuid)
      return history.push(
        `/recruiter/job/manage/pipeline/${offerData.jobUuid}?${
          offerData.pipelineUuid ? `pipeline_uuid=${offerData.pipelineUuid}&` : ''
        }candidate_uuid=${offerData.candidateUuid}&source=${
          NavigationSourcesEnum.FromFormBuilderToPipeline.key
        }`,
      );
    if (formSourceItem && formSourceItem.source_url)
      history.push(formSourceItem.source_url({ templateData }));
    // history.push('/recruiter/form-builder');
  };

  const handlePreviewChange = () => {
    setPreview((prev) => ({
      ...prev,
      isActive: !prev.isActive,
    }));
    if (!preview.isActive)
      history.push(
        `/form-builder/info${search}${
          offerData.pipelineUuid ? `?pipeline_uuid=${offerData.pipelineUuid}&` : ''
        }`,
      );
    // TODO figure out why goBack is not working
    //history.goBack();
    else
      history.push(
        `/form-builder/edit${search}${
          offerData.pipelineUuid ? `?pipeline_uuid=${offerData.pipelineUuid}&` : ''
        }`,
      );
  };

  const handleRoleChange = ({ target: { value } }) =>
    setPreview((prev) => ({ ...prev, role: value }));

  const handleShareableChange = (e, isChecked) => {
    setTemplateData((items) => {
      items.isNotShareable = isChecked;
      return { ...items };
    });
    setDataSectionItems((data) => {
      if (!isChecked) return data;
      const localData = { ...data };
      let isChanged = false;
      Object.entries(localData).map(([key, value]) => {
        value.items.map((item, index) => {
          if (item.fillBy !== 'sender') {
            localData[key].items[index].fillBy = 'sender';
            if (!isChanged) isChanged = true;
          }
          return undefined;
        });
        return undefined;
      });
      if (!isChanged) return data;
      return localData;
    });
  };

  const signFormHandler = React.useCallback(async () => {
    setIsSubmitted(true);
    if (Object.values(errors).filter((item) => item).length) {
      showError('Please fill fields with only valid formats');
      return;
    }
    const form = {
      ...offerData,
      sections: dataSectionItems,
    };
    const errs = getIsValidData(
      TemplateRolesEnum.Recipient.key,
      form.primaryLang,
      form.secondaryLang,
      dataSectionItems,
    );
    if (errs.data?.errors?.[errs.data?.errors?.length - 1]?.id)
      scrollToField(errs.data.errors[errs.data.errors.length - 1].id);
    if (errs.data.errors.length > 0) {
      showError('', errs);
      return;
    }
    setIsLoading(true);
    const response = await SignForm({
      body: {
        ...toSnakeCase(form),
        form_uuid: offerData.uuid,
      },
      token: candidateUserReducer?.token,
      company_uuid: candidateUserReducer?.company?.uuid,
      account_uuid: candidateUserReducer?.account?.uuid,
    });
    setIsLoading(false);
    if (response.status === 200 && response.data.results.saved === true) {
      setOpen(true);
      sessionStorage.setItem('signed', 'signed');
    } else showError('failed-to-get-saved-data', response);
  }, [
    candidateUserReducer?.account?.uuid,
    candidateUserReducer?.company?.uuid,
    candidateUserReducer?.token,
    dataSectionItems,
    getIsValidData,
    offerData,
    setIsSubmitted,
    errors,
    scrollToField,
    setIsLoading,
  ]);

  const computedStatus = React.useMemo(
    () =>
      // if (offerData)
      //   if (offerData.status === OfferApprovalStatus.APPROVED.key)
      //     return (
      //       Object.values(OffersStatusesEnum).find(
      //         (item) =>
      //           item.key === parseInt(queryStatus)
      //           || item.key === parseInt(offerData?.status)
      //       )?.status || 'Draft'
      //     );
      //   else if (offerData.status === OfferApprovalStatus.OPENED.key)
      //     if (
      //       parseInt(queryStatus) === OffersStatusesEnum.NotSent.key
      //       || parseInt(offerData.status) === OffersStatusesEnum.NotSent.key
      //       || parseInt(queryStatus) === OffersStatusesEnum.Draft.key
      //       || parseInt(offerData.status) === OffersStatusesEnum.Draft.key
      //     )
      //       return (
      //         Object.values(OffersStatusesEnum).find(
      //           (item) =>
      //             item.key === parseInt(queryStatus)
      //             || item.key === parseInt(offerData?.status)
      //         )?.status || 'Draft'
      //       );
      //     else return OffersStatusesEnum.PendingApproval.status;
      //   else
      //     return (
      //       Object.values(OffersStatusesEnum).find(
      //         (item) => item.key === parseInt(offerData?.status)
      //       )?.status || 'Draft'
      //     );
      // else
      Object.values(OffersStatusesEnum).find(
        (item) => item.key === parseInt(offerData?.status),
      )?.status || 'draft',
    [offerData],
  );

  const downloadPDFHandler = useCallback(async () => {
    if (!candidateUserReducer) return;
    setIsLoadingPDF(true);
    const response = await GetOfferRecipientPDF({
      uuid: offerData.uuid,
      token: candidateUserReducer.token,
      company_uuid: candidateUserReducer.company?.uuid,
      account_uuid: candidateUserReducer.account?.uuid,
    });
    setIsLoadingPDF(false);
    if (response && response.status === 200) {
      const link = document.createElement('a');
      const file_url = URL.createObjectURL(response.data);
      link.setAttribute('target', '_blank');
      link.download = offerData.title;
      link.href = file_url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else showError(t('failed-to-download-pdf'), response);
  }, [candidateUserReducer, offerData.title, offerData.uuid, t]);

  const rejectOfferHandler = useCallback(async () => {
    setRejectionAttempted(true);
    if (!rejectionReason.key) return;
    setIsLoading(true);
    const response = await RejectForm({
      body: {
        reject_details: rejectionReason,
        form_uuid: offerData?.uuid,
      },
      token: candidateUserReducer?.token,
      company_uuid: candidateUserReducer?.company?.uuid,
      account_uuid: candidateUserReducer?.account?.uuid,
    });
    setIsLoading(false);
    if (response.status === 200 || response.status === 201) {
      showSuccess('Offer is rejected successfully!');
      setShowRejectConfirmDialog(false);
      setOpen(true);
      sessionStorage.setItem('signed', 'rejected');
    } else showError('Failed to reject offer!');
  }, [candidateUserReducer, rejectionReason, offerData]);

  const requestOfferChangeHandler = useCallback(async () => {
    setRequestMoreInfoAttempted(true);
    if (!requestMoreInfo.key) return;

    setIsLoading(true);
    const response = await RequestFormMoreInfo({
      body: {
        more_info_details: requestMoreInfo,
        form_uuid: offerData?.uuid,
      },
      token: candidateUserReducer?.token,
      company_uuid: candidateUserReducer?.company?.uuid,
      account_uuid: candidateUserReducer?.account?.uuid,
    });
    setIsLoading(false);
    if (response.status === 200 || response.status === 201) {
      setShowRequestMoreInfoDialog(false);
      showSuccess('Change request sent successfully!');
      setOpen(true);
      sessionStorage.setItem('signed', 'request-more-info');
    } else showError('Failed to send change request!');
  }, [candidateUserReducer, requestMoreInfo, offerData]);

  useEffect(() => {
    if (sessionStorage.getItem('signed')) setOpen(true);
  }, []);

  useEffect(() => {
    setHeaderHeight(headerRef.current.clientHeight);
  }, [setHeaderHeight]);

  useEventListener('resize', () => {
    if (timerResizeRef.current) clearTimeout(timerResizeRef.current);
    timerResizeRef.current = setTimeout(() => {
      setHeaderHeight(headerRef.current.clientHeight);
    }, 250);
  });

  useEffect(
    () => () => {
      if (timerResizeRef.current) clearTimeout(timerResizeRef.current);
    },
    [],
  );

  return (
    <Grid
      container
      ref={headerRef}
      sx={{
        padding: (theme) => theme.spacing(4.5, 5, 4.5, 8),
        boxShadow: '0px -1px 0px 0px #F4F4F4 inset',
        background: (theme) => theme.palette.light.main,
        minHeight: 92,
      }}
    >
      <Grid item container xs direction="column" alignItems="flex-start">
        <Stack direction="row" justifyContent="flex-start" alignItems="center">
          <Typography variant="h3" lh="rich">
            {templateData.title}
          </Typography>
          {!preview.isActive && (
            <>
              <Chip
                icon={<IndicatorIcon sx={{ color: 'dark.$40' }} />}
                label={t(computedStatus)}
                variant="xs"
                bg="darka6"
                sx={{
                  mr: 1.5,
                  ml: 2.5,
                  pr: 2,
                  pl: 0.5,
                  py: 0.5,
                  color: 'dark.$60',
                  '> .MuiChip-icon': {
                    m: 0,
                    fontSize: 18,
                    color: 'dark.$40',
                  },
                }}
              />
              {/* <IconButton aria-label="more options">
                <MoreIcon />
              </IconButton> */}
            </>
          )}
        </Stack>
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          sx={{ mt: 2 }}
        >
          {!preview.isActive && (
            <Typography
              sx={{
                fontSize: 11,
                height: 21,
                // ml: 2.5
              }}
              lh="double"
              variant="caption"
              color="dark.$40"
            >
              {t('Shared:changed')}
              {lastTimeChanged}
              {t('Shared:ago')}
            </Typography>
          )}
          {preview.isActive && (
            <Typography sx={{ height: 21 }} variant="caption" color="dark.$40">
              {t('Shared:preview-mode')}
            </Typography>
          )}
        </Stack>
      </Grid>
      <Stack
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        flexWrap="wrap"
      >
        {['creator', 'sender'].includes(templateData.editorRole)
          && (['review'].includes(queryStatus) ? (
            <Modal
              width={480}
              title="Withdraw to make changes?"
              component={
                <ActionModalBody
                  bodyText={modalWithdrawBodyText}
                  btnText="withdraw"
                  handleAction={handleWithdraw}
                />
              }
            >
              <ButtonBase className="btns theme-outline miw-0">
                Withdraw to edit
              </ButtonBase>
            </Modal>
          ) : ['public'].includes(queryStatus) ? (
            <Modal
              width={480}
              title="Revoke public access?"
              component={
                <ActionModalBody
                  bodyText={modalRevokeBodyText}
                  btnText="Revoke"
                  handleAction={handleRevoke}
                />
              }
            >
              <ButtonBase className="btns theme-outline miw-0">
                Revoke public access
              </ButtonBase>
            </Modal>
          ) : (
            <>
              <Switch className="my-2" onChange={handlePreviewChange} />
              <Typography
                sx={{
                  margin: (theme) => theme.spacing(0, 5, 0, 2),
                  userSelect: 'none',
                }}
              >
                {t('Shared:preview-mode')}
              </Typography>
              <Switch
                className="my-2"
                checked={templateData.isNotShareable}
                disabled={!['creator'].includes(templateData.editorRole)}
                onChange={handleShareableChange}
              />
              <Typography
                sx={{
                  margin: (theme) => theme.spacing(0, 5, 0, 2),
                  userSelect: 'none',
                }}
              >
                {t('Shared:not-sharable')}
              </Typography>
              <Select
                id="popper-select-role-preview"
                value={preview.role}
                variant="standard"
                disableUnderline
                sx={{
                  border: (theme) => `1px solid ${theme.palette.dark.$8}`,
                  p: 0.5,
                  ml: -1.5,
                  mr: 2,
                  '.MuiSelect-select': {
                    display: 'flex',
                  },
                }}
                IconComponent={CornerDownIcon}
                onChange={handleRoleChange}
              >
                <MenuItem display="flex" value="sender">
                  <IndicatorIcon sx={{ color: 'secondary.$80' }} />
                  <Typography sx={{ mr: 1 }}>{t('Shared:sender')}</Typography>
                </MenuItem>
                <MenuItem value="recipient">
                  <IndicatorIcon sx={{ color: 'secondary.$80' }} />
                  <Typography sx={{ mr: 1 }}>{t('Shared:recipient')}</Typography>
                </MenuItem>
              </Select>
              {['creator'].includes(templateData.editorRole)
                && !preview.isActive && (
                <ButtonBase
                  onClick={sendData}
                  disabled={
                    isLoading
                      || isGlobalLoading.length > 0
                      || +templateData.source
                        === NavigationSourcesEnum.FromSelfServiceToFormBuilder.key
                  }
                  className="btns theme-solid miw-0"
                >
                  {t('Shared:save-continue')}
                </ButtonBase>
              )}
              {['sender'].includes(templateData.editorRole)
                && queryStatus?.toString()
                  !== OffersStatusesEnum.Completed.key.toString()
                && queryStatus?.toString()
                  !== OffersStatusesEnum.CompletedAsSecondary.key.toString()
                && queryStatus?.toString()
                  !== OffersStatusesEnum.WaitingToBeSigned.key.toString()
                && +templateData.source
                  !== NavigationSourcesEnum.FromSelfServiceToFormBuilder.key
                && +templateData.source
                  !== NavigationSourcesEnum.FromOfferViewToFormBuilder.key
                && !(
                  (templateData.status
                    === OffersStatusesEnum.RequestingMoreInfo.key
                    || templateData.status
                      === OffersStatusesEnum.RejectedByRecipient.key
                    || templateData.status === OffersStatusesEnum.Rejected.key)
                  && templateData?.source
                  && [
                    NavigationSourcesEnum.TasksSelfServiceToFormBuilder.key,
                    NavigationSourcesEnum.TasksSelfServicesToOfferBuilder.key,
                    NavigationSourcesEnum.FromOfferToFormBuilder.key,
                  ].includes(+templateData.source)
                ) && (
                <ButtonBase
                  onClick={sendOffer}
                  className="btns theme-solid miw-0"
                  disabled={
                    isLoading
                      || isGlobalLoading.length > 0
                      || (offersValidationWithDatabaseReducer
                        && offersValidationWithDatabaseReducer.hasValidation
                        && !isValidOffer)
                  }
                >
                  <span>
                    {preview.isActive
                      ? 'Use this template'
                      : (['sender'].includes(templateData.editorRole)
                            && templateData.isNotShareable
                            && 'save')
                          || 'Continue'}
                  </span>
                  <span className="px-1">
                    <ArrowRightIcon />
                  </span>
                </ButtonBase>
              )}
            </>
          ))}
        {['recipient'].includes(templateData.editorRole) ? (
          <div>
            <ButtonBase
              className="btns theme-solid miw-0 m-2"
              onClick={signFormHandler}
              disabled={isLoading || isGlobalLoading.length > 0}
            >
              Accept
            </ButtonBase>
            <ButtonBase
              className="btns theme-solid bg-secondary miw-0 m-2"
              onClick={() => setShowRequestMoreInfoDialog(true)}
              disabled={isLoading || isGlobalLoading.length > 0}
            >
              Request Information
            </ButtonBase>
            <ButtonBase
              className="btns theme-outline miw-0 m-2"
              onClick={() => setShowRejectConfirmDialog(true)}
              disabled={isLoading || isGlobalLoading.length > 0}
            >
              Reject
            </ButtonBase>
          </div>
        ) : (
          <IconButton
            onClick={handleClose}
            aria-label="close"
            sx={{ padding: '2px', ml: (theme) => theme.spacing(8) }}
            disabled={
              ['creator'].includes(templateData?.editorRole) || isFromBulkSelect
                ? false
                : !offerData?.jobUuid
            }
          >
            <CrossIcon />
          </IconButton>
        )}
        <ButtonBase
          className={`btns-icon theme-transparent mx-2 side-menu-btn${
            (isOpenSideMenu && ' is-active') || ''
          }`}
          onClick={() => {
            setIsOpenSideMenu((item) => !item);
          }}
        >
          <span className="fas fa-bars" />
        </ButtonBase>
      </Stack>
      <DialogComponent
        maxWidth="md"
        dialogContent={
          <div className="d-flex-center mt-4">
            <div className="d-flex-column p-4">
              {sessionStorage.getItem('signed') === 'signed' && (
                <>
                  <div className="fw-bold fz-30px pb-3">Thank you!</div>
                  <div className="pb-3">
                    Your offer has been signed. We will get in touch with you as soon
                    as receive email notification.
                    {templateData?.downloadPdfOffer
                      ? ' Download a copy of the form you signed below.'
                      : ''}
                  </div>
                  {templateData?.downloadPdfOffer ? (
                    <ButtonBase
                      onClick={() => {
                        pdfDownLoad({
                          pdfName: templateData?.name || templateData?.title,
                          element: pdfRef.current,
                          ref: pdfRef,
                        });
                      }}
                      disabled={
                        isLoadingPDF
                        || isGlobalLoading?.length > 0
                        || !candidateUserReducer
                      }
                      className="btns theme-outline miw-0"
                      sx={{ mx: 2 }}
                    >
                      <span>
                        <ArrowRightIcon sx={{ transform: 'rotate(90deg)' }} />
                      </span>
                      <span className="mx-1">Download PDF</span>
                    </ButtonBase>
                  ) : null}
                </>
              )}
              {sessionStorage.getItem('signed') === 'rejected' && (
                <>
                  <div className="fw-bold fz-30px pb-3">Thank you!</div>
                  <div className="pb-3">
                    Your offer has been rejected successfully.
                  </div>
                </>
              )}
              {sessionStorage.getItem('signed') === 'request-more-info' && (
                <>
                  <div className="fw-bold fz-30px pb-3">Thank you!</div>
                  <div className="pb-3">
                    Request for more info regarding your offer has been sent
                    successfully.
                  </div>
                </>
              )}
              <div className="c-green-primary d-flex-h-center mt-4">{`(  You may close this tab at any time  )`}</div>
            </div>
          </div>
        }
        isOpen={isOpen}
      />
      {showRejectConfirmDialog && (
        <DialogComponent
          maxWidth="sm"
          dialogContent={
            <div className="d-flex-column px-4">
              <div className="mt-3">{'Please select your rejection reason:'}</div>
              <SharedAutocompleteControl
                isFullWidth
                errors={
                  rejectionAttempted && !rejectionReason?.key
                    ? {
                      rejectionReason: {
                        message: 'Please make sure to at least choose one option',
                        error: true,
                      },
                    }
                    : {}
                }
                searchKey="search"
                initValuesKey="key"
                isDisabled={isLoading}
                initValuesTitle="label"
                initValues={Object.values(FormRejectionReasonsEnum)}
                stateKey="rejectionReason"
                errorPath="rejectionReason"
                onValueChanged={(e) => {
                  setRejectionReason((items) => ({
                    ...items,
                    key: e.value,
                  }));
                }}
                editValue={rejectionReason?.key}
                placeholder="Select rejection reason"
                isSubmitted={rejectionAttempted}
              />
              <div className="mb-1">{'Please specify your rejection reasons:'}</div>
              <SharedInputControl
                rows={3}
                multiline
                isFullWidth
                errors={errors}
                isDisabled={isLoading}
                // isSubmitted={isSubmitted}
                wrapperClasses=""
                editValue={rejectionReason.description}
                onValueChanged={(e) =>
                  setRejectionReason((items) => ({
                    ...items,
                    description: e.value,
                  }))
                }
                placeholder="Please enter your rejection reason"
                stateKey="rejectionReason"
              />
            </div>
          }
          isOpen={showRejectConfirmDialog}
          saveType="button"
          onSaveClicked={() => rejectOfferHandler()}
          onCloseClicked={() => {
            setShowRejectConfirmDialog(false);
            setRejectionReason({ key: null, description: '' });
            setRejectionAttempted(false);
          }}
          onCancelClicked={() => {
            setShowRejectConfirmDialog(false);
            setRejectionReason({ key: null, description: '' });
            setRejectionAttempted(false);
          }}
          titleText="Rejection reason dialog"
          saveText="Confirm rejection"
        />
      )}
      {showRequestMoreInfoDialog && (
        <DialogComponent
          maxWidth="sm"
          dialogContent={
            <div className="d-flex-column px-4">
              <div className="mt-3 mb-1">
                {'Please let us know what do you need to know:'}
              </div>
              <SharedAutocompleteControl
                isFullWidth
                errors={
                  requestMoreInfoAttempted && !requestMoreInfo?.key
                    ? {
                      requestMoreInfo: {
                        message: 'Please make sure to at least choose one option',
                        error: true,
                      },
                    }
                    : {}
                }
                searchKey="search"
                initValuesKey="key"
                isDisabled={isLoading}
                initValuesTitle="label"
                initValues={Object.values(FormRequestMoreInfoEnum)}
                stateKey="requestMoreInfo"
                errorPath="requestMoreInfo"
                onValueChanged={(e) => {
                  setRequestMoreInfo((items) => ({
                    ...items,
                    key: e.value,
                  }));
                }}
                editValue={requestMoreInfo?.key}
                placeholder="Request more info about:"
                isSubmitted={requestMoreInfoAttempted}
              />
              <div className="mb-1">{"Let's hear from you!"}</div>
              <SharedInputControl
                rows={3}
                multiline
                isFullWidth
                isDisabled={isLoading}
                // isSubmitted={isSubmitted}
                wrapperClasses=""
                editValue={requestMoreInfo.description}
                onValueChanged={(e) =>
                  setRequestMoreInfo((items) => ({
                    ...items,
                    description: e.value,
                  }))
                }
                placeholder="Please let us know what do you need to know"
                stateKey="requestMoreInfo"
              />
            </div>
          }
          isOpen={showRequestMoreInfoDialog}
          saveType="button"
          onSaveClicked={() => requestOfferChangeHandler()}
          onCloseClicked={() => {
            setShowRequestMoreInfoDialog(false);
            setRequestMoreInfo({ key: null, description: '' });
            setRequestMoreInfoAttempted(false);
          }}
          onCancelClicked={() => {
            setShowRequestMoreInfoDialog(false);
            setRequestMoreInfo({ key: null, description: '' });
            setRequestMoreInfoAttempted(false);
          }}
          titleText="Request change dialog"
          saveText="Send request"
        />
      )}
    </Grid>
  );
}
