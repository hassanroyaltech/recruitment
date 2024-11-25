import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  ButtonBase,
  Divider,
} from '@mui/material';
import './Offers.Style.scss';
import { TemplateBrowserDialog } from './Dialogs/TemplateBrowser.Dialog';
import {
  GetAllEmailTemplates,
  GetAllOffers,
  CreateOffer,
  GetAllFormTemplates,
  GetAllFormsTypes,
  GetAllTags,
  DeleteOffer,
  OfferStatusChange,
  SendFormReminder,
  GetMultipleMedias,
} from 'services';
import { EmailTemplateDialog } from './Dialogs/EmailTemplateView.Dialog';
import { useEventListener } from 'hooks';
import {
  showError,
  showSuccess,
  GlobalHistory,
  GlobalDisplayDateTimeFormat,
  getIsAllowedPermissionV2,
  GlobalDisplayDateFormat,
} from 'helpers';
import { PopoverComponent, DialogComponent } from 'components';
import { OffersStatusesEnum } from 'enums/Shared/OffersStatuses.Enum';
import i18next from 'i18next';
import moment from 'moment';
import {
  NavigationSourcesEnum,
  OffersActionsEnum,
  FormRejectionReasonsEnum,
  FormRequestMoreInfoEnum,
  DefaultFormsTypesEnum,
} from '../../../../../enums';
import { preferencesAPI } from 'api/preferences';
import { SendOfferMethodsEnum } from 'enums/Shared/SendOfferMethods.Enum';
import { ManualFormsManagementDialog } from './Dialogs/ManualFormsManagement.Dialog';
import { PreviewOfferDialog } from './Dialogs/PreviewOffer.Dialog';
import { SharedInputControl } from 'pages/setups/shared';
import { OfferStatusManagementDialog } from './Dialogs/OfferStatusManagement.Dialog';
import { useSelector } from 'react-redux';
import {
  ManageFormBuilderOffersPermissions,
  ManageFormBuilderTypesPermissions,
  ManageApplicationsPermissions,
} from 'permissions';
import { VisaFormPermissions } from '../../../../../permissions/visas/VisaForm.Permissions';
import { DeadlineExtendDialog } from './Dialogs/DeadlineExtend.Dialog';

export const OffersTab = ({
  candidate_uuid,
  translationPath,
  form_builder,
  stage_uuid,
  pipeline_uuid,
  job_uuid,
  code,
  isForm,
  defaultStatus,
  manualFormsTitle,
  isBlankPage,
  formSource,
  onDetailsChanged,
  parentTranslationPath,
  selectedCandidateDetails,
  onChangeTheActiveJobData,
  activeJobPipelineUUID,
}) => {
  const bodyRef = useRef(null);
  const { t } = useTranslation(parentTranslationPath);
  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState(null);
  const [selectedTemplateType, setSelectedTemplateType] = useState(null);
  const [isDeadlineExtendDialog, setIsDeadlineExtendDialog] = useState(false);
  const [offersList, setOffersList] = useState({
    results: [],
    totalCount: 0,
    approved_by: null,
    file_uuid: null,
    is_manual: false,
    histories: [],
    create: {
      manual: true,
      auto: true,
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
    search: '',
    status: '',
    code,
  });
  const [offerData, setOfferData] = useState({
    name: '',
    description: '',
    stage_uuid: '',
    pipeline_uuid: '',
    job_uuid: '',
    candidate_uuid: '',
    type_uuid: '',
    template_uuid: '',
    send_way_type: SendOfferMethodsEnum.WebForm.key,
    email_template_uuid: '',
    body_email: '',
    subject_email: '',
    attachments_email: [],
    status: null,
  });
  const [templateTypesList, setTemplateTypesList] = useState([]);
  const [popoverAttachedWith, setPopoverAttachedWith] = useState({
    templateMenu: null,
  });
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [isDeletedOffer, setIsDeletedOffer] = useState(false);
  const [isOfferStatusManagementDialog, setIsOfferStatusManagementDialog]
    = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [createOfferStep, setCreateOfferStep] = useState(0);
  const [isOpenManualFormsDialog, setIsOpenManualFormsDialog] = useState(false);
  const [expandedAccordions, setExpandedAccordions] = useState([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const isLoadingRef = useRef(false);
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );
  const onPopoverAttachedWithChanged = useCallback((key, newValue) => {
    setPopoverAttachedWith((items) => ({ ...items, [key]: newValue }));
  }, []);

  const popoverToggleHandler = useCallback(
    (popoverKey, event = null) => {
      onPopoverAttachedWithChanged(
        popoverKey,
        (event && event.currentTarget) || null,
      );
    },
    [onPopoverAttachedWithChanged],
  );
  const getCandidateOffersHandler = useCallback(async () => {
    isLoadingRef.current = true;
    setIsLoading(true);
    const res = await GetAllOffers({
      candidate_uuid,
      job_uuid,
      ...filter,
    });
    isLoadingRef.current = true;
    setIsLoading(false);
    if (res && res.status === 200)
      if (filter.page === 1)
        setOffersList({
          results: res.data.results.forms || [],
          totalCount: res.data.paginate?.total || 0,
          create: res.data.results.create,
        });
      else
        setOffersList((items) => ({
          results: items.results.concat(res.data.results.forms || []),
          totalCount: res.data.paginate.total || 0,
          create: res.data.results.create,
        }));
    else setOffersList({ results: [], totalCount: 0 });
  }, [candidate_uuid, filter, job_uuid]);

  const CreateOfferHandler = useCallback(
    async (template) => {
      setIsLoading(true);
      const response = await CreateOffer({
        ...offerData,
        template_uuid: template.uuid,
        description: template.description,
        title: template.title,
        pipeline_uuid,
        stage_uuid,
        candidate_uuid,
        job_uuid,
        status: OffersStatusesEnum.NotSent.key, // change later to draft when approval is implemented
        // status: OffersStatusesEnum.Draft.key,
      });
      if (response && (response.status === 201 || response.status === 200)) {
        showSuccess(t(`${translationPath}offer-created-successfully`));
        GlobalHistory.push(
          `/form-builder/info?${
            activeJobPipelineUUID ? `pipeline_uuid=${activeJobPipelineUUID}&` : ''
          }&form_uuid=${
            response.data?.results?.uuid
          }&source=${formSource}&editorRole=sender&template_uuid=${
            response.data?.results?.template_uuid
          }&template_type_uuid=${response.data?.results?.type_uuid}&status=${
            response.data?.results?.status
          }`, // from the backend if it has approval then status will be returned as pending, if not it will be notSent
        );
      } else showError(t('Shared:failed-to-get-saved-data'), response);
      setIsLoading(false);
    },
    [
      offerData,
      pipeline_uuid,
      stage_uuid,
      candidate_uuid,
      job_uuid,
      t,
      translationPath,
      activeJobPipelineUUID,
      formSource,
    ],
  );

  const onScrollHandler = useCallback(() => {
    if (
      bodyRef.current.offsetHeight + bodyRef.current.scrollTop
        >= bodyRef.current.scrollHeight - 5
      && offersList.results.length < offersList.totalCount
      && !isLoadingRef.current
    )
      setFilter((items) => ({ ...items, page: items.page + 1 }));
  }, [offersList]);

  const DeleteOfferHandler = useCallback(
    async (isDisabledCreateNew, offerUUID) => {
      if (!offerUUID) return;
      setIsLoading(true);
      const response = await DeleteOffer({ data: { uuid: [offerUUID] } });
      if (response && (response.status === 201 || response.status === 200)) {
        showSuccess(
          t(
            `${translationPath}${
              (isForm && 'form') || 'offer'
            }-deleted-successfully`,
          ),
        );
        setFilter((items) => ({
          ...items,
          page: 1,
          search: '',
          status: '',
        }));
        if (onDetailsChanged && isDisabledCreateNew)
          onDetailsChanged({
            jobDetailsChanges: {
              form_builder: {
                sent_multiple_request: true,
              },
            },
          });
        setIsDeletedOffer(true);
        setConfirmDeleteDialog(false);
      } else showError(t('Shared:failed-to-get-saved-data'), response);
      setIsLoading(false);
    },
    [t, translationPath, isForm, onDetailsChanged],
  );

  const getTypesHandler = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllFormsTypes({
      job_stage_uuid: stage_uuid,
    });
    if (response && response.status === 200)
      setTemplateTypesList(response.data?.results);
    else showError(t('Shared:failed-to-get-saved-data'), response);
    setIsLoading(false);
  }, [stage_uuid, t]);

  const offerStatusChangeHandler = useCallback(
    async (actionKey, offer_uuid) => {
      setIsLoading(true);
      const response = await OfferStatusChange({
        status: actionKey,
        uuid: offer_uuid,
      });
      setIsLoading(false);
      if (response && response.status === 200) {
        setFilter((items) => ({ ...items, page: 1 }));
        showSuccess(t(`${translationPath}form-status-updated-successfully`));
      } else showError(t(`${translationPath}form-status-update-failed`), response);
    },
    [t, translationPath],
  );

  const SendReminderHandler = useCallback(
    async (offer_uuid) => {
      setIsLoading(true);
      const resTemplate = await preferencesAPI.getTemplateBySlug(
        'reminder_form_builder',
        i18next.language,
        activeJobPipelineUUID,
      );
      const response = await SendFormReminder({
        form_uuid: offer_uuid,
        subject_email: resTemplate?.data?.results?.translation?.subject,
        body_email: resTemplate?.data?.results?.translation?.body,
        attachments_email: resTemplate?.data?.results?.attachment,
      });
      setIsLoading(false);
      if (response && (response.status === 200 || response.status === 201)) {
        showSuccess(t(`${translationPath}reminder-sent-successfully`));
        setFilter((items) => ({ ...items, page: 1 }));
      } else showError(t(`${translationPath}failed-to-send-reminder`), response);
    },
    [activeJobPipelineUUID, t, translationPath],
  );

  const PreviewOfferHandler = useCallback(
    async (offer) => {
      setIsLoading(true);
      const response = await GetMultipleMedias({
        uuids: [offer?.file_uuid],
      });
      setIsLoading(false);
      if (response && (response.status === 200 || response.status === 201)) {
        showSuccess(t(`${translationPath}file-retrieved-successfully`));
        setPreviewData({
          file: response.data?.results?.data?.[0]?.original,
          upload_offer_status: offer.status,
        });
        setIsPreviewOpen(true);
      } else showError(t(`${translationPath}failed-to-get-file`), response);
    },
    [t, translationPath],
  );

  const offerStatusesHandler = useCallback(
    (actionKey, offer) => () => {
      if (actionKey === OffersActionsEnum.WithdrawToEdit.key) {
        offerStatusChangeHandler(OffersActionsEnum.WithdrawToEdit.key, offer.uuid);
        return;
      }
      if (actionKey === OffersActionsEnum.RevokeToEdit.key) {
        offerStatusChangeHandler(OffersActionsEnum.RevokeToEdit.key, offer.uuid);
        return;
      }
      if (actionKey === OffersActionsEnum.Remind.key) {
        SendReminderHandler(offer.uuid);
        return;
      }
      if (actionKey === OffersActionsEnum.Edit.key)
        if (isBlankPage) {
          window.open(
            `${process.env.REACT_APP_HEADERS}/form-builder/info?${
              activeJobPipelineUUID ? `pipeline_uuid=${activeJobPipelineUUID}&` : ''
            }form_uuid=${
              offer?.uuid
            }&source=${formSource}&editorRole=sender&template_uuid=${
              offer?.template_uuid
            }&template_type_uuid=${offer?.type_uuid}&status=${offer?.status}`,
            '_blank',
          );
          return;
        } else
          return GlobalHistory.push(
            `/form-builder/info?${
              activeJobPipelineUUID ? `pipeline_uuid=${activeJobPipelineUUID}&` : ''
            }form_uuid=${
              offer?.uuid
            }&source=${formSource}&editorRole=sender&template_uuid=${
              offer?.template_uuid
            }&template_type_uuid=${offer?.type_uuid}&status=${offer?.status}`,
          );
      if (actionKey === OffersActionsEnum.ViewOffer.key)
        return GlobalHistory.push(
          `/form-builder/info?${
            activeJobPipelineUUID ? `pipeline_uuid=${activeJobPipelineUUID}&` : ''
          }form_uuid=${offer?.uuid}&source=${
            NavigationSourcesEnum.FromOfferViewToFormBuilder.key
          }&editorRole=sender&template_uuid=${
            offer?.template_uuid
          }&template_type_uuid=${offer?.type_uuid}&status=${offer?.status}`,
        );
      if (actionKey === OffersActionsEnum.PreviewOffer.key)
        PreviewOfferHandler(offer);
    },
    [
      isBlankPage,
      activeJobPipelineUUID,
      formSource,
      PreviewOfferHandler,
      offerStatusChangeHandler,
      SendReminderHandler,
    ],
  );

  const updatePage = useCallback(async () => {
    setSelectedItem(null);
    setIsLoading(true);
    setFilter((items) => ({ ...items, page: 1 }));
    if (onChangeTheActiveJobData) onChangeTheActiveJobData(true);
  }, [onChangeTheActiveJobData]);

  useEffect(() => {
    getCandidateOffersHandler();
  }, [getCandidateOffersHandler, filter]);

  useEffect(() => {
    if (code !== DefaultFormsTypesEnum.Visa.key) getTypesHandler();
  }, [code, getTypesHandler]);

  useEventListener('scroll', onScrollHandler, bodyRef.current);

  return (
    <div className="d-flex-column-center">
      <div className="top-header d-flex-h-between mb-2 full-width">
        {/* <ButtonBase onClick={() => {}} className="btns theme-transparent">
          {t(`${translationPath}all-items`)}
          <span className="fas fa-chevron-down px-2" />
        </ButtonBase> */}
        <div></div>
        <div>
          <ButtonBase
            onClick={() => {
              setIsOpenManualFormsDialog(true);
            }}
            disabled={
              (code !== DefaultFormsTypesEnum.Visa.key
                && !getIsAllowedPermissionV2({
                  permissionId:
                    ManageFormBuilderOffersPermissions.UploadManualOfferStatus.key,
                  permissions: permissionsReducer,
                }))
              || (code === DefaultFormsTypesEnum.Visa.key
                && !getIsAllowedPermissionV2({
                  permissionId: VisaFormPermissions.AddVisaForm.key,
                  permissions: permissionsReducer,
                }))
              || isLoading
              || !selectedCandidateDetails?.can_create_new_offer
              || (form_builder
                && !form_builder.sent_multiple_request
                && !isDeletedOffer)
              || (offersList.create && !offersList.create.manual)
            }
            className="btns theme-transparent"
          >
            <span className="fas fa-handshake" />
            <span className="px-1">
              {t(
                `${translationPath}${
                  (code === DefaultFormsTypesEnum.Visa.key
                    && 'create-new-visa-form')
                  || 'manual-offer'
                }`,
              )}
            </span>
          </ButtonBase>
          {code !== DefaultFormsTypesEnum.Visa.key && (
            <ButtonBase
              onClick={(e) => {
                popoverToggleHandler('templateType', e);
              }}
              disabled={
                isLoading
                || !selectedCandidateDetails?.can_create_new_offer
                || (form_builder
                  && !form_builder.sent_multiple_request
                  && !isDeletedOffer)
                || !getIsAllowedPermissionV2({
                  defaultPermissions: {
                    SuperFormBuilderType:
                      ManageFormBuilderTypesPermissions.SuperFormBuilderType,
                    SendOffer: ManageApplicationsPermissions.SendOffer,
                    SendContract: ManageApplicationsPermissions.SendContract,
                  },
                  permissions: permissionsReducer,
                })
              }
              className="btns theme-transparent"
            >
              <span className="fas fa-plus" />
              <span className="px-1">{t(`${translationPath}create-new`)}</span>
            </ButtonBase>
          )}
        </div>
      </div>

      <div className="d-flex-h-between full-width">
        <div>
          {/* <ButtonBase className="btns theme-transparent sm-btn">
            <span>{t(`${translationPath}show`)}</span>
          </ButtonBase> */}
          {code !== DefaultFormsTypesEnum.Visa.key && (
            <ButtonBase
              onClick={(e) => {
                popoverToggleHandler('status', e);
              }}
              className="btns theme-transparent"
            >
              {filter.status
                ? Object.values(OffersStatusesEnum)?.find(
                  (item) => item.key === filter.status,
                )?.status
                : t(`${translationPath}all-statuses`)}
              <span className="fas fa-chevron-down px-2" />
            </ButtonBase>
          )}
        </div>
        <div>
          {searchExpanded ? (
            <SharedInputControl
              idRef="searchRef"
              title="search"
              placeholder="search"
              // themeClass="theme-filled"
              stateKey="search"
              endAdornment={
                <span
                  className="end-adornment-wrapper"
                  onClick={() => setSearchExpanded(false)}
                  onKeyDown={() => setSearchExpanded(false)}
                  role="button"
                  tabIndex={0}
                >
                  <span className="fas fa-search" />
                </span>
              }
              onValueChanged={(newValue) => {
                setFilter((items) => ({ ...items, search: newValue?.value || '' }));
              }}
              parentTranslationPath={parentTranslationPath}
              editValue={filter.search}
            />
          ) : (
            <ButtonBase
              className="btns-icon theme-transparent"
              onClick={() => setSearchExpanded(true)}
            >
              <span className="fas fa-search" />
            </ButtonBase>
          )}
          {/* <ButtonBase className="btns theme-transparent sm-btn">
            {t(`${translationPath}filter`)}
          </ButtonBase> */}
          {/* <ButtonBase className="btns theme-transparent sm-btn">
            <span>{t(`${translationPath}sort`)}</span>
          </ButtonBase>
          <ButtonBase className="btns-icon theme-transparent m-0">
            <span className="fas fa-ellipsis-h" />
          </ButtonBase> */}
        </div>
      </div>

      <div className="mt-3 mb-3 full-width">
        <Divider />
      </div>
      <div
        style={{ overflow: 'auto', maxHeight: '60vh', width: '100%' }}
        ref={bodyRef}
      >
        <div>
          {/* Offers list */}
          {offersList
            && offersList.results
            && offersList.results.map((offer, offerIdx) => (
              <div key={`offer-${offerIdx}`}>
                <div
                  key={offer.uuid}
                  style={{ backgroundColor: '#fff' }}
                  className="pt-4"
                >
                  <div className="d-flex-h-between full-width px-2">
                    <div className="d-flex">
                      <div className="mx-2">
                        <span className="fa-2x fas fa-file" />
                      </div>
                      <div className="mx-2">
                        <div className="offer-title">{offer.title}</div>
                        <div className="offer-details">
                          <span className="fz-12px">
                            {`${t(`${translationPath}created-by`)} ${
                              offer.created_by?.name?.[i18next.language]
                              || offer.created_by?.name?.en
                            } ${moment(offer.created_at).format(
                              GlobalDisplayDateTimeFormat,
                            )}`}
                          </span>
                        </div>
                        {offer.deadline_date && (
                          <div className="offer-details">
                            <span className="fz-12px">
                              {`${t(`${translationPath}deadline-at`)} ${moment(
                                offer.deadline_date,
                              ).format(GlobalDisplayDateFormat)}`}
                            </span>
                          </div>
                        )}
                        <div className="offer-steps">
                          <span className="fz-12px">
                            {t(`${translationPath}created`)}
                          </span>
                          {offer.status
                            === OffersStatusesEnum.PendingApproval.key && (
                            <>
                              <ButtonBase className="btns-icon theme-transparent m-0">
                                <span className="fas fa-long-arrow-alt-right" />
                              </ButtonBase>
                              <span className="fz-12px">
                                {t(`${translationPath}on-review`)}
                              </span>
                            </>
                          )}
                          {offer.status === OffersStatusesEnum.Draft.key && (
                            <>
                              <ButtonBase className="btns-icon theme-transparent m-0">
                                <span className="fas fa-long-arrow-alt-right" />
                              </ButtonBase>
                              <span className="fz-12px">
                                {t(`${translationPath}draft`)}
                              </span>
                            </>
                          )}
                          {offer.status === OffersStatusesEnum.Completed.key && (
                            <>
                              <ButtonBase className="btns-icon theme-transparent m-0">
                                <span className="fas fa-long-arrow-alt-right" />
                              </ButtonBase>
                              <span className="fz-12px">
                                {t(`${translationPath}signed`)}
                              </span>
                            </>
                          )}
                          {offer.approved_by && (
                            <>
                              {/*<ButtonBase className="btns-icon theme-transparent m-0">*/}
                              {/*  <span className="fas fa-long-arrow-alt-right" />*/}
                              {/*</ButtonBase>*/}
                              <span className="fz-12px">
                                {`${t(`${translationPath}approved-by`)} ${
                                  offer.approved_by?.name?.[i18next.language]
                                  || offer.approved_by?.name?.en
                                }`}
                              </span>
                            </>
                          )}
                          {offer.status
                            === OffersStatusesEnum.WaitingToBeSigned.key && (
                            <>
                              <ButtonBase className="btns-icon theme-transparent m-0">
                                <span className="fas fa-long-arrow-alt-right" />
                              </ButtonBase>
                              <span className="fz-12px">
                                {t(`${translationPath}sent`)}
                              </span>
                            </>
                          )}
                        </div>
                        <div className="form-status">
                          <span
                            className="fz-12px p-1"
                            style={{ backgroundColor: '#24253314' }}
                          >
                            {t(
                              `${translationPath}${
                                Object.values(OffersStatusesEnum).find(
                                  (item) => item.key === offer.status,
                                )?.status
                              }`,
                            )}
                          </span>
                        </div>
                        {offer.status
                          === OffersStatusesEnum.RejectedByRecipient.key && (
                          <div className="offer-rejection my-2 fz-12px">
                            Rejection reason:
                            <span className="px-1">
                              {
                                Object.values(FormRejectionReasonsEnum)?.find(
                                  (item) =>
                                    parseInt(item.key)
                                    === parseInt(offer.reject_details?.key),
                                )?.label
                              }
                            </span>
                            <br />
                            {offer.reject_details?.description
                              && `More details: ${offer.reject_details.description}`}
                          </div>
                        )}
                        {offer.status
                          === OffersStatusesEnum.RequestingMoreInfo.key && (
                          <div className="offer-more-info my-2 fz-12px">
                            Requested information:
                            <span className="px-1">
                              {
                                Object.values(FormRequestMoreInfoEnum)?.find(
                                  (item) =>
                                    parseInt(item.key)
                                    === parseInt(offer.more_info_details?.key),
                                )?.label
                              }
                            </span>
                            <br />
                            {offer.more_info_details?.description
                              && `More details: ${offer.more_info_details.description}`}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="d-flex fj-end">
                      <div className="d-flex fa-start fj-end max-width-fit">
                        {Object.values(OffersStatusesEnum)
                          .find((item) => item.key === offer.status)
                          ?.actions?.filter(
                            (it) =>
                              !(it === OffersActionsEnum.Remind && offer.is_manual),
                          )
                          .map((item) => (
                            <ButtonBase
                              key={`${offer.uuid}${item.key}`}
                              className="btns theme-outline sm-btn"
                              disabled={
                                isLoading
                                || (code === DefaultFormsTypesEnum.Visa.key
                                  && !getIsAllowedPermissionV2({
                                    permissionId:
                                      VisaFormPermissions.UpdateVisaForm.key,
                                    permissions: permissionsReducer,
                                  }))
                              }
                              onClick={offerStatusesHandler(item.key, offer)}
                            >
                              <span className="px-1">
                                {t(
                                  `${translationPath}${
                                    (item.value === 'edit'
                                      && isForm
                                      && 'edit-form')
                                    || item.value
                                  }`,
                                )}
                              </span>
                            </ButtonBase>
                          ))}
                      </div>
                      <div className="more-btns">
                        <ButtonBase
                          onClick={(e) => {
                            popoverToggleHandler('templateMenu', e);
                            setSelectedItem(offer);
                          }}
                          className="btns-icon theme-transparent m-0"
                        >
                          <span className="fas fa-ellipsis-h" />
                        </ButtonBase>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Accordion
                      key={`offer-${offerIdx}`}
                      expanded={expandedAccordions.includes(offerIdx)}
                      onChange={(e, ex) => {
                        setExpandedAccordions((items) => {
                          if (ex) return [...items, offerIdx];
                          else return items.filter((it) => it !== offerIdx);
                        });
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<span className="fas fa-chevron-down" />}
                      >
                        <span className="fw-bold fz-12px">
                          {t(`${translationPath}history`)}
                        </span>
                      </AccordionSummary>
                      <AccordionDetails>
                        {offer.histories
                          && offer.histories.map((historyItem, historyIdx) => (
                            <div
                              key={`offer-${offerIdx}-history-item-${historyIdx}`}
                              className="my-2"
                            >
                              <div className="d-flex-h-between">
                                <div className="fz-12px">{historyItem.message}</div>
                                <div className="fz-12px">
                                  {moment(historyItem.created_at).format(
                                    GlobalDisplayDateTimeFormat,
                                  )}
                                </div>
                              </div>
                              <div className="mt-1 full-width">
                                <Divider />
                              </div>
                            </div>
                          ))}
                      </AccordionDetails>
                    </Accordion>
                  </div>
                </div>
                <div className="my-3 full-width">
                  <Divider />
                </div>
              </div>
            ))}
        </div>
      </div>
      {/* {createOfferStep === 1 && (
        <CreateNewOfferDialog
          isOpen={createOfferStep === 1}
          candidate_uuid={candidate_uuid}
          onSave={(method) => {
            setOfferData((items) => ({ ...items, send_way_type: method }));
            setCreateOfferStep(2);
          }}
          onClose={() => {
            setCreateOfferStep(0);
            setOfferData((items) => ({ ...items, send_way_type: null }));
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )} */}
      {createOfferStep === 2 && (
        <TemplateBrowserDialog
          templateType="email"
          isOpen={createOfferStep === 2}
          candidate_uuid={candidate_uuid}
          onSave={(method) => {
            setSelectedEmailTemplate(method);
            setOfferData((items) => ({ ...items, email_template_uuid: method?.id }));
            setCreateOfferStep(3);
          }}
          onClose={() => {
            setOfferData((items) => ({ ...items, send_way_type: null }));
            setCreateOfferStep(0);
          }}
          getAllData={GetAllEmailTemplates}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
      {createOfferStep === 3 && (
        <EmailTemplateDialog
          isOpen={createOfferStep === 3}
          candidate_uuid={candidate_uuid}
          onSave={(emailData, selectedLanguage) => {
            const data = emailData?.translation.find(
              (item) => selectedLanguage === item.language?.code,
            );
            setOfferData((items) => ({
              ...items,
              body_email: data?.body,
              subject_email: data?.subject,
              attachments_email:
                emailData.attachment?.map(
                  (item) => item.original?.uuid || item.uuid,
                ) || [],
            }));
            setCreateOfferStep(4);
          }}
          onClose={() => {
            setOfferData((items) => ({ ...items, send_way_type: null }));
            setSelectedEmailTemplate(null);
            setCreateOfferStep(0);
          }}
          selectedEmailTemplate={selectedEmailTemplate}
          setSelectedEmailTemplate={setSelectedEmailTemplate}
          offerData={offerData}
          setOfferData={setOfferData}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
      {createOfferStep === 4 && (
        <TemplateBrowserDialog
          templateType="offer"
          isOpen={createOfferStep === 4}
          candidate_uuid={candidate_uuid}
          onSave={(template) => {
            setOfferData((items) => ({
              ...items,
              template_uuid: template?.uuid,
              description: template?.description,
              title: template?.title,
            }));
            CreateOfferHandler(template);
          }}
          onClose={() => {
            setOfferData((items) => ({ ...items, send_way_type: null }));
            setSelectedEmailTemplate(null);
            setCreateOfferStep(0);
          }}
          selectedTemplateType={selectedTemplateType}
          setSelectedTemplateType={(type) => {
            setSelectedTemplateType(type);
            setOfferData((items) => ({ ...items, type_uuid: type?.uuid }));
          }}
          isDisabledOfferType={offersList.create && !offersList.create.auto}
          getAllData={GetAllFormTemplates}
          getAllTags={GetAllTags}
          getAllTypes={GetAllFormsTypes}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
      <PopoverComponent
        idRef="templateTypePopoverRef"
        attachedWith={popoverAttachedWith?.templateType}
        handleClose={() => popoverToggleHandler('templateType')}
        component={
          <div className="d-flex-column">
            {templateTypesList
              && templateTypesList.map((type) => (
                <ButtonBase
                  key={type.uuid}
                  className="btns theme-transparent fj-start"
                  onClick={() => {
                    popoverToggleHandler('templateType');
                    setSelectedTemplateType(type);
                    setOfferData((items) => ({ ...items, type_uuid: type?.uuid }));
                    setCreateOfferStep(2);
                  }}
                  disabled={
                    type.code === DefaultFormsTypesEnum.Offers.key
                    && offersList.create
                    && !offersList.create.auto
                  }
                >
                  <span className="px-2">{type.name}</span>
                </ButtonBase>
              ))}
          </div>
        }
      />
      <PopoverComponent
        idRef="statusesPopoverRef"
        attachedWith={popoverAttachedWith?.status}
        handleClose={() => popoverToggleHandler('status')}
        component={
          <div className="d-flex-column">
            {[
              {
                key: null,
                status: 'all-statuses',
              },
              ...Object.values(OffersStatusesEnum),
            ].map((status) => (
              <ButtonBase
                key={status.key}
                className="btns theme-transparent fj-start"
                onClick={() => {
                  popoverToggleHandler('status');
                  setFilter((items) => ({ ...items, status: status.key }));
                }}
              >
                <span className="px-2">
                  {t(`${translationPath}${status.status}`)}
                </span>
              </ButtonBase>
            ))}
          </div>
        }
      />
      <PopoverComponent
        idRef="templateMenuPopoverRef"
        attachedWith={popoverAttachedWith?.templateMenu}
        handleClose={() => popoverToggleHandler('templateMenu')}
        component={
          <div className="d-flex-column">
            {code !== DefaultFormsTypesEnum.Visa.key && (
              <ButtonBase
                className="btns theme-transparent fj-start"
                onClick={() => {
                  setIsOfferStatusManagementDialog(true);
                  popoverToggleHandler('templateMenu');
                }}
                disabled={
                  !getIsAllowedPermissionV2({
                    permissionId:
                      ManageFormBuilderOffersPermissions.UpdateOfferStatus.key,
                    permissions: permissionsReducer,
                  })
                }
              >
                <span className="px-2">{t(`${translationPath}update-status`)}</span>
              </ButtonBase>
            )}
            {selectedItem && selectedItem.deadline_date && (
              <ButtonBase
                className="btns theme-transparent fj-start"
                onClick={() => {
                  setIsDeadlineExtendDialog(true);
                  popoverToggleHandler('templateMenu');
                }}
              >
                <span className="px-2">
                  {t(`${translationPath}extend-deadline-date`)}
                </span>
              </ButtonBase>
            )}
            <ButtonBase
              className="btns theme-transparent fj-start"
              disabled={
                !selectedItem
                || selectedItem.status !== OffersStatusesEnum.Draft.key
                || (code === DefaultFormsTypesEnum.Visa.key
                  && !getIsAllowedPermissionV2({
                    permissionId: VisaFormPermissions.DeleteVisaForm.key,
                    permissions: permissionsReducer,
                  }))
              }
              onClick={() => {
                setConfirmDeleteDialog(true);
                popoverToggleHandler('templateMenu');
              }}
            >
              <span className="px-2">{t(`${translationPath}delete`)}</span>
            </ButtonBase>
          </div>
        }
      />
      <DialogComponent
        isConfirm
        dialogContent={
          <div className="d-flex-column-center">
            <span className="fas fa-exclamation-triangle c-danger fa-4x mb-2" />
            <span>
              {t(
                `${translationPath}${
                  (isForm && 'form') || 'offer'
                }-delete-description`,
              )}
            </span>
          </div>
        }
        isSaving={isLoading}
        isOpen={confirmDeleteDialog}
        onSubmit={(e) => {
          e.preventDefault();
          DeleteOfferHandler(
            form_builder && !form_builder.sent_multiple_request,
            selectedItem && selectedItem.uuid,
          );
        }}
        onCloseClicked={() => setConfirmDeleteDialog(false)}
        onCancelClicked={() => setConfirmDeleteDialog(false)}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
      {isOpenManualFormsDialog && (
        <ManualFormsManagementDialog
          isOpen={isOpenManualFormsDialog}
          onClose={() => setIsOpenManualFormsDialog(false)}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          code={code}
          isForm={isForm}
          isBlankPage={isBlankPage}
          defaultStatus={defaultStatus}
          formSource={formSource}
          manualFormsTitle={manualFormsTitle}
          candidate_uuid={candidate_uuid}
          job_uuid={job_uuid}
          stage_uuid={stage_uuid}
          next_approved={form_builder.next_approved}
          reloadList={() => updatePage()}
          // setIsDeletedOffer={setIsDeletedOffer}
        />
      )}
      {isDeadlineExtendDialog && (
        <DeadlineExtendDialog
          isOpen={isDeadlineExtendDialog}
          onClose={() => setIsDeadlineExtendDialog(false)}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onSave={() => {
            void updatePage();
          }}
          currentDeadlineDate={selectedItem.deadline_date}
          form_uuid={selectedItem.uuid}
        />
      )}
      {isOfferStatusManagementDialog && (
        <OfferStatusManagementDialog
          selectedItem={selectedItem}
          isOpen={isOfferStatusManagementDialog}
          onClose={() => setIsOfferStatusManagementDialog(false)}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          candidate_uuid={candidate_uuid}
          job_uuid={job_uuid}
          next_approved={form_builder.next_approved}
          reloadList={() => updatePage()}
          // setIsDeletedOffer={setIsDeletedOffer}
        />
      )}
      {isPreviewOpen && previewData && (
        <PreviewOfferDialog
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          previewData={previewData}
        />
      )}
    </div>
  );
};

OffersTab.propTypes = {
  candidate_uuid: PropTypes.string.isRequired,
  form_builder: PropTypes.shape({
    sent_multiple_request: PropTypes.bool,
    next_approved: PropTypes.bool,
  }),
  parentTranslationPath: PropTypes.string,
  stage_uuid: PropTypes.string,
  pipeline_uuid: PropTypes.string,
  job_uuid: PropTypes.string,
  code: PropTypes.oneOf(
    Object.values(DefaultFormsTypesEnum).map((item) => item.key),
  ),
  defaultStatus: PropTypes.oneOf(
    Object.values(OffersStatusesEnum).map((item) => item.key),
  ),
  formSource: PropTypes.oneOf(
    Object.values(NavigationSourcesEnum).map((item) => item.key),
  ),
  manualFormsTitle: PropTypes.string,
  isForm: PropTypes.bool,
  isBlankPage: PropTypes.bool,
  onDetailsChanged: PropTypes.func,
  translationPath: PropTypes.string,
  selectedCandidateDetails: PropTypes.shape({
    can_create_new_offer: PropTypes.bool,
  }),
  onChangeTheActiveJobData: PropTypes.func,
  activeJobPipelineUUID: PropTypes.string,
};
OffersTab.defaultProps = {
  parentTranslationPath: 'EvarecCandidateModel',
  translationPath: 'OffersTab.',
  formSource: NavigationSourcesEnum.FromOfferToFormBuilder.key,
  stage_uuid: undefined,
  form_builder: undefined,
  pipeline_uuid: undefined,
  job_uuid: undefined,
  code: undefined,
  selectedCandidateDetails: undefined,
  onChangeTheActiveJobData: undefined,
  activeJobPipelineUUID: undefined,
};
