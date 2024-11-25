import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  GetFormSourceItem,
  GlobalHistory,
  showError,
  showSuccess,
} from '../../../../helpers';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toSnakeCase } from '../../../form-builder/utils/helpers/toSnakeCase';
import {
  DefaultFormsTypesEnum,
  FormsAssignTypesEnum,
  FormsAssistRoleTypesEnum,
  FormsAssistTypesEnum,
  FormsFieldsTypesEnum,
  FormsForTypesEnum,
  FormsMembersTypesEnum,
  FormsRolesEnum,
  FormsStatusesEnum,
  FormsUTMSourcesTypesEnum,
  NavigationSourcesEnum,
} from '../../../../enums';
import {
  CreateBuilderForm,
  CreateBuilderTemplate,
  GenerateSSOKey,
  UpdateBuilderForm,
  UpdateBuilderFormRecipient,
  UpdateBuilderFormRecipientUser,
  UpdateBuilderTemplate,
} from '../../../../services';
import { useEventListener } from '../../../../hooks';
import {
  ButtonBase,
  Chip,
  Grid,
  MenuItem,
  Select,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { DialogComponent } from '../../../../components';
import moment from 'moment';
import i18next from 'i18next';
import {
  rejectedCandidate,
  submittedCandidate,
} from '../../../../stores/actions/candidateActions';
import { CandidateTypes } from '../../../../stores/types/candidateTypes';
import { FormsFieldCollaboratorsTypesEnum } from '../../../../enums/Shared/FormsFieldCollaboratorsTypes.Enum';

export const HeaderSection = ({
  preview,
  setPreview,
  templateData,
  dataSectionItems,
  setIsSubmitted,
  isGlobalLoading,
  getIsValidData,
  isLoadingPDF,
  isFailedToGetSections,
  isLoading,
  setIsLoading,
  setHeaderHeight,
  scrollToField,
  // formsRolesTypes,
  isOpenSideMenu,
  parentTranslationPath,
  translationPath,
  setIsOpenSideMenu,
  systemUserRecipient,
  getSelectedRoleEnumItem,
  getFormStatusEnumItem,
  // UpdateDownLoadPDFRecipientHandler,
  getFilteredRoleTypes,
  pdfDownLoad,
  pdfRef,
  isInitialization,
  ratingAverageData,
}) => {
  const history = GlobalHistory;
  const { t } = useTranslation(parentTranslationPath);
  const headerRef = useRef(null);
  const timerResizeRef = useRef(null);
  const dispatch = useDispatch();
  const candidateReducer = useSelector((state) => state?.candidateReducer);
  const [isOpen, setOpen] = React.useState(false);

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
              && formSourceItem.source_url({ templateData }))
            || ''
          }`,
          '_self',
        );
      } else if (!response || response.message)
        showError(t('Shared:failed-to-get-saved-data'));
    },
    [t, templateData],
  );

  const handleClose = useCallback(async () => {
    const formSourceItem = GetFormSourceItem(templateData.source, templateData.code);
    if (formSourceItem?.closeTab) {
      window.opener = null;
      window.open('', '_self');
      window.close();
      return;
    }
    if (formSourceItem?.isFromSelfService) {
      await selfServiceHandler(formSourceItem);
      return;
    }
    if (templateData.extraQueries.for === FormsForTypesEnum.SystemUser.key)
      if (
        templateData.extraQueries.utmSources === FormsUTMSourcesTypesEnum.Email.key
      )
        history.push('/recruiter/overview');
      else if (history.length > 0) history.goBack();
      else history.push('/recruiter/overview');
    if (formSourceItem && formSourceItem.source_url)
      history.push(formSourceItem.source_url({ templateData }));
  }, [history, selfServiceHandler, templateData]);

  const getActionBasedOnStatus = useMemo(
    () =>
      ({
        template = templateData,
        createTemplateStatus,
        updateTemplateStatus,
        createFormStatus,
        updateFormStatus,
      }) =>
        (!template.uuid && createTemplateStatus)
        || (template.editorRole === FormsRolesEnum.Creator.key
          && template.uuid
          && updateTemplateStatus)
        || (template.editorRole !== FormsRolesEnum.Creator.key
          && !template.formUUID
          && createFormStatus)
        || (template.editorRole !== FormsRolesEnum.Creator.key
          && template.formUUID
          && updateFormStatus),
    [templateData],
  );

  const saveForm = React.useCallback(
    async (isFromUpdate = false) => {
      setIsSubmitted(true);
      if (
        getSelectedRoleEnumItem(templateData.editorRole).isWithGlobalAssign
        && (!templateData.assign || templateData.assign.length === 0)
      ) {
        showError(
          `${t('Shared:please-select-at-least')} ${1} ${t(
            `${translationPath}assign`,
          )}`,
        );
        return;
      }

      if (
        templateData.isWithRecipient
        && templateData.editorRole !== FormsRolesEnum.Creator.key
        && (!templateData.invitedMember || templateData.invitedMember.length === 0)
      ) {
        showError(t(`${translationPath}invited-member-error`));
        return;
      }

      if (
        templateData.isWithRecipient
        && getSelectedRoleEnumItem
        && (!preview.isActive
          || getSelectedRoleEnumItem(preview.role).isWithGlobalInvite)
        && getSelectedRoleEnumItem(templateData.editorRole).isWithGlobalInvite
        && templateData.invitedMember
        && templateData.invitedMember.some(
          (item) =>
            item.type === FormsMembersTypesEnum.Candidates.key
            || item.type === FormsMembersTypesEnum.Stages.key,
        )
        && !templateData.bodyEmail
      ) {
        showError(t(`${translationPath}email-template-error`));
        return;
      }

      const localErrors = getIsValidData();
      if (Object.values(localErrors).some((item) => item.itemId))
        scrollToField(Object.values(localErrors).find((item) => item.itemId).itemId);
      if (Object.keys(localErrors).length > 0) {
        showError('', { errors: localErrors });
        return;
      }

      const template = {
        ...templateData,
        sections: dataSectionItems,
      };
      setIsLoading(true);
      const response = await getActionBasedOnStatus({
        template,
        createTemplateStatus: CreateBuilderTemplate,
        updateTemplateStatus: UpdateBuilderTemplate,
        createFormStatus: CreateBuilderForm,
        updateFormStatus: UpdateBuilderForm,
      })(
        {
          uuid: templateData.formUUID,
          ...toSnakeCase(template),
          workflow_approval_fields: templateData.workflowApprovalFields?.map(
            (it, idx) => ({ ...it, order: idx + 1 }),
          ),
        },
        {
          ...(templateData.extraQueries.for !== FormsForTypesEnum.Candidate.key
            && systemUserRecipient
            && systemUserRecipient.company && {
            company_uuid: systemUserRecipient.company.uuid,
          }),
        },
      );
      if (response && (response.status === 201 || response.status === 200)) {
        if (!templateData?.uuid) {
          const isFlow = templateData?.code === DefaultFormsTypesEnum.Flows.key;
          window?.ChurnZero?.push([
            'trackEvent',
            isFlow
              ? 'Onboarding - build flow'
              : 'Form builder - Creat new form template',
            isFlow ? 'Build Flow' : 'Form builder',
            1,
            {},
          ]);
        }
        if (template.editorRole !== FormsRolesEnum.Creator.key && !template.formUUID)
          window?.ChurnZero?.push([
            'trackEvent',
            'Form builder - Send new form',
            'Send new form',
            1,
            {},
          ]);
        if (
          response.data.message
          === 'The form has been successfully submitted for approval.'
        )
          window?.ChurnZero?.push([
            'trackEvent',
            'Form builder - Form submitted for approval',
            'Form submitted for approval from EVA-REC',
            1,
            {},
          ]);
        showSuccess(
          getActionBasedOnStatus({
            template,
            createTemplateStatus: t(
              `${translationPath}template-created-successfully`,
            ),
            updateTemplateStatus: t(
              `${translationPath}template-updated-successfully`,
            ),
            createFormStatus:
              response.data.message
              || t(`${translationPath}form-created-successfully`),
            updateFormStatus:
              response.data.message
              || t(`${translationPath}form-updated-successfully`),
          }),
        );
        setIsLoading(false);
        if (!isFromUpdate) handleClose();
      } else {
        setIsLoading(false);
        showError(
          t(
            `${translationPath}${getActionBasedOnStatus({
              template,
              createTemplateStatus: 'template-create',
              updateTemplateStatus: 'template-update',
              createFormStatus: 'form-create',
              updateFormStatus: 'form-update',
            })}-failed`,
          ),
          response,
        );
      }
    },
    [
      setIsSubmitted,
      getSelectedRoleEnumItem,
      templateData,
      preview.isActive,
      preview.role,
      getIsValidData,
      scrollToField,
      dataSectionItems,
      setIsLoading,
      getActionBasedOnStatus,
      systemUserRecipient,
      t,
      translationPath,
      handleClose,
    ],
  );

  const handlePreviewChange = () => {
    setPreview((prev) => ({
      ...prev,
      isActive: !prev.isActive,
    }));
  };
  const handleRoleChange = ({ target: { value } }) =>
    setPreview((prev) => ({ ...prev, role: value }));

  const signFormHandler = React.useCallback(
    async (localStatus = undefined, isUpdate = false) => {
      setIsSubmitted(true);
      const form = {
        ...templateData,
        sections: dataSectionItems,
      };
      if (localStatus) form.formStatus = localStatus;
      if (isUpdate) form.isUpdate = isUpdate;

      const localErrors = getIsValidData(form);
      if (Object.values(localErrors).some((item) => item.itemId))
        scrollToField(Object.values(localErrors).find((item) => item.itemId).itemId);
      if (Object.keys(localErrors).length > 0) {
        showError('', { errors: localErrors });
        return;
      }
      setIsLoading(true);
      const response = await (
        (templateData.extraQueries.for === FormsForTypesEnum.Candidate.key
          && UpdateBuilderFormRecipient)
        || UpdateBuilderFormRecipientUser
      )(
        {
          ...toSnakeCase(form),
          form_uuid: templateData.formUUID,
        },
        (templateData.extraQueries.for === FormsForTypesEnum.Candidate.key && {
          token: candidateReducer?.token,
          company_uuid: candidateReducer?.company?.uuid,
          account_uuid: candidateReducer?.account?.uuid,
        })
          || (templateData.extraQueries.for !== FormsForTypesEnum.Candidate.key
            && systemUserRecipient
            && systemUserRecipient.company && {
            company_uuid: systemUserRecipient.company.uuid,
          })
          || undefined,
      );
      setIsLoading(false);
      if (response && response.status === 200) {
        const isFlow = templateData?.code === DefaultFormsTypesEnum.Flows.key;
        const isSystemUser
          = templateData.extraQueries.for === FormsForTypesEnum.SystemUser.key;
        if (!isUpdate && (isSystemUser || !isFlow)) setOpen(true);
        showSuccess(
          t(
            `${translationPath}${isFlow ? 'flow' : 'form'}-${
              (!localStatus && 'updated')
              || (localStatus === FormsStatusesEnum.Rejected.key && 'rejected')
              || 'submitted'
            }-successfully`,
          ),
        );
        if (
          isFlow
          && !isSystemUser
          && localStatus === FormsStatusesEnum.Completed.key
        )
          handleClose();
        if (localStatus)
          dispatch(
            (localStatus === FormsStatusesEnum.Rejected.key
              && rejectedCandidate({
                userUUID: templateData.currentUserUUID,
                formUUID: templateData.formUUID,
              }))
              || submittedCandidate({
                userUUID: templateData.currentUserUUID,
                formUUID: templateData.formUUID,
              }),
          );
      } else
        showError(
          t(
            `${translationPath}form-${
              (!localStatus && 'update')
              || (localStatus === FormsStatusesEnum.Rejected.key && 'reject')
              || 'submit'
            }-failed`,
          ),
          response,
        );
    },
    [
      setIsSubmitted,
      templateData,
      dataSectionItems,
      getIsValidData,
      scrollToField,
      setIsLoading,
      candidateReducer?.token,
      candidateReducer?.company?.uuid,
      candidateReducer?.account?.uuid,
      systemUserRecipient,
      t,
      translationPath,
      handleClose,
      dispatch,
    ],
  );

  const computedStatus = React.useMemo(() => {
    const isFlow = templateData?.code === DefaultFormsTypesEnum.Flows.key;
    const currentStatusItem = Object.values(FormsStatusesEnum).find(
      (item) => item.key === templateData.formStatus,
    );
    return (
      (isFlow && currentStatusItem?.flowStatusLabel && templateData.formUUID
        ? currentStatusItem?.flowStatusLabel
        : currentStatusItem?.status) || 'draft'
    );
  }, [templateData?.code, templateData.formStatus, templateData.formUUID]);

  useEffect(() => {
    setHeaderHeight(headerRef.current.clientHeight);
  }, [setHeaderHeight]);

  useEventListener('resize', () => {
    if (timerResizeRef.current) clearTimeout(timerResizeRef.current);
    timerResizeRef.current = setTimeout(() => {
      setHeaderHeight(headerRef.current.clientHeight);
    }, 250);
  });

  useEffect(() => {
    if (
      candidateReducer
      && templateData?.code !== DefaultFormsTypesEnum.Flows.key
      && templateData.extraQueries.for === FormsForTypesEnum.Candidate.key
      && !getSelectedRoleEnumItem(templateData.editorRole).isWithMultipleSubmit
      && candidateReducer.submittedForms
      && candidateReducer.submittedForms.some(
        (item) => item.formUUID === templateData.formUUID,
      )
      && (candidateReducer.reducer_status === CandidateTypes.SUBMITTED
        || candidateReducer.reducer_status === CandidateTypes.REJECTED)
    )
      setOpen(true);
  }, [
    candidateReducer,
    getSelectedRoleEnumItem,
    templateData?.code,
    templateData.editorRole,
    templateData.extraQueries.for,
    templateData.formUUID,
  ]);

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
          {!preview.isActive && !isGlobalLoading.length > 0 && (
            <>
              <Chip
                icon={
                  <span className="d-inline-flex-center ff-default mx-1 lh-100">
                    <span className="fz-30px">&bull;</span>
                  </span>
                }
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
              }}
              lh="double"
              variant="caption"
              color="dark.$40"
            >
              {t('Shared:changed')}
              {`${moment(templateData.updatedAt)
                .locale(i18next.language)
                .fromNow()}`}
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
        {ratingAverageData?.withRatingFields
        && templateData.isSurvey
        && (templateData?.editorRole !== FormsRolesEnum.Creator.key
          || preview.isActive) ? (
            <Typography variant="h4" lh="rich" px={4}>
              {`${t(`${translationPath}average-rating`)} (${ratingAverageData.avg})`}
            </Typography>
          ) : (
            ''
          )}
        {[FormsRolesEnum.Creator.key, FormsRolesEnum.Sender.key].includes(
          templateData.editorRole,
        ) && (
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
            {preview.isActive && (
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
                    alignItems: 'center',
                    // px: '0.5rem',
                    // py: '0.25rem',
                  },
                }}
                IconComponent={() => (
                  <span className="select-icon px-2 fas fa-caret-down c-gray-primary" />
                )}
                onChange={handleRoleChange}
              >
                {getFilteredRoleTypes().map((item) => (
                  <MenuItem
                    key={`headerFormBuilderTypes${item.key}`}
                    display="flex"
                    className="fa-center"
                    value={item.key}
                  >
                    <span className="d-inline-flex-center ff-default lh-100">
                      <span className="fz-30px c-accent-secondary-lighter">
                        &bull;
                      </span>
                    </span>
                    <Typography className="mx-1 lh-100">{item.value}</Typography>
                  </MenuItem>
                ))}
              </Select>
            )}
            {![FormsRolesEnum.Recipient.key].includes(templateData.editorRole)
              && !preview.isActive
              && !GetFormSourceItem(templateData.source).isView && (
              <ButtonBase
                onClick={() => saveForm()}
                className="btns theme-solid miw-0"
                disabled={
                  isLoading
                    || isGlobalLoading.length > 0
                    || isFailedToGetSections
                    || templateData.extraQueries.isView
                    || (!getFormStatusEnumItem().isEditableForm
                      && (!getSelectedRoleEnumItem(templateData.editorRole)
                        .isEditableIfNotWithRecipient
                        || templateData.isWithRecipient))
                    || +templateData.source
                      === NavigationSourcesEnum.FromSelfServiceToFormBuilder.key
                }
              >
                {t(`${translationPath}save`)}
              </ButtonBase>
            )}
          </>
        )}
        {getSelectedRoleEnumItem(templateData.editorRole).isRecipientBehaviour && (
          <div>
            {((templateData.extraQueries.for === FormsForTypesEnum.SystemUser.key
              && getSelectedRoleEnumItem(templateData.editorRole).isWithUpdateAction)
              || (templateData.extraQueries.for === FormsForTypesEnum.Candidate.key
                && templateData?.code === DefaultFormsTypesEnum.Flows.key)) && (
              <ButtonBase
                className="btns theme-solid miw-0 m-2"
                onClick={() =>
                  signFormHandler(
                    templateData?.code === DefaultFormsTypesEnum.Flows.key
                      && (templateData.formStatus === FormsStatusesEnum.Todo.key
                        || templateData.formStatus === FormsStatusesEnum.Draft.key)
                      ? FormsStatusesEnum.Draft.key
                      : undefined,
                    true,
                  )
                }
                disabled={
                  isLoading
                  || isGlobalLoading.length > 0
                  || isFailedToGetSections
                  || templateData.extraQueries.isView
                  || (!getFormStatusEnumItem().isEditableForm
                    && !getSelectedRoleEnumItem(templateData.editorRole)
                      .isWithMultipleSubmit)
                  || templateData.extraQueries.role
                    === FormsAssistRoleTypesEnum.Viewer.key
                }
              >
                {t(
                  `${translationPath}${
                    templateData?.code === DefaultFormsTypesEnum.Flows.key
                      ? 'save'
                      : 'update'
                  }`,
                )}
              </ButtonBase>
            )}
            {templateData.extraQueries.for === FormsForTypesEnum.SystemUser.key
              && templateData?.code === DefaultFormsTypesEnum.Flows.key
              && templateData.source
                === NavigationSourcesEnum.OnboardingMembersToFormBuilder.key && (
              <>
                <ButtonBase
                  onClick={() => {
                    pdfDownLoad({
                      pdfName: templateData?.title,
                      element: pdfRef.current,
                      ref: pdfRef,
                    });
                  }}
                  disabled={
                    isLoadingPDF || isGlobalLoading.length > 0 || isInitialization
                  }
                  className="btns theme-solid miw-0 m-2"
                  sx={{ mx: 2 }}
                >
                  <span className="fas fa-arrow-down" />
                  <span className="px-1">{t(`${translationPath}download-PDF`)}</span>
                </ButtonBase>
                {/*<ButtonBase*/}
                {/*  onClick={() => {*/}
                {/*    pdfDownLoad({*/}
                {/*      pdfName: templateData?.title,*/}
                {/*      element: pdfRef.current,*/}
                {/*      ref: pdfRef,*/}
                {/*      isBE: true*/}
                {/*    });*/}
                {/*  }}*/}
                {/*  disabled={*/}
                {/*    isLoadingPDF || isGlobalLoading.length > 0 || isInitialization*/}
                {/*  }*/}
                {/*  className="btns theme-solid miw-0 m-2"*/}
                {/*  sx={{ mx: 2 }}*/}
                {/*>*/}
                {/*  <span className="fas fa-arrow-down" />*/}
                {/*  <span className="px-1">{t(`${translationPath}download-PDF`)}</span>*/}
                {/*</ButtonBase>*/}
              </>
            )}
            <ButtonBase
              className="btns theme-solid miw-0 m-2"
              onClick={() => signFormHandler(FormsStatusesEnum.Completed.key)}
              disabled={
                isLoading
                || isGlobalLoading.length > 0
                || isFailedToGetSections
                || templateData.extraQueries.isView
                || (!getFormStatusEnumItem().isEditableForm
                  && !getSelectedRoleEnumItem(templateData.editorRole)
                    .isWithMultipleSubmit)
                || templateData.extraQueries.role
                  === FormsAssistRoleTypesEnum.Viewer.key
              }
            >
              {t(
                `${translationPath}${
                  (getSelectedRoleEnumItem(templateData.editorRole)
                    .isWithMultipleForm
                    && (templateData.extraQueries.for
                    === FormsForTypesEnum.SystemUser.key
                      ? 'save-and-continue'
                      : 'submit'))
                  || 'complete'
                }`,
              )}
            </ButtonBase>
          </div>
        )}
        {(![FormsRolesEnum.Recipient.key].includes(templateData.editorRole)
          || templateData.extraQueries.for === FormsForTypesEnum.SystemUser.key) && (
          <ButtonBase
            onClick={handleClose}
            className="btns-icon theme-transparent ml-3-reversed"
          >
            <span className="fas fa-times" />
          </ButtonBase>
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
              {((templateData.extraQueries.for
                === FormsForTypesEnum.SystemUser.key
                && (templateData.formStatus === FormsStatusesEnum.Completed.key
                  || templateData?.code === DefaultFormsTypesEnum.Flows.key))
                || (templateData.extraQueries.for === FormsForTypesEnum.Candidate.key
                  && candidateReducer
                  && candidateReducer.submittedForms
                  && candidateReducer.submittedForms.some(
                    (item) =>
                      item.formUUID === templateData.formUUID
                      && item.status === CandidateTypes.SUBMITTED,
                  ))) && (
                <>
                  <div className="fw-bold fz-30px pb-3">
                    {t(`${translationPath}thank-you`)}!
                  </div>
                  <div className="pb-3">
                    {t(`${translationPath}form-signed-description`)}
                  </div>
                  <ButtonBase
                    onClick={() => {
                      pdfDownLoad({
                        pdfName: templateData?.title,
                        element: pdfRef.current,
                        ref: pdfRef,
                      });
                    }}
                    disabled={
                      isLoadingPDF
                      || isGlobalLoading.length > 0
                      || isInitialization
                      || (!candidateReducer
                        && templateData.editorRole === FormsRolesEnum.Recipient.key
                        && templateData.extraQueries.for
                          === FormsForTypesEnum.Candidate.key)
                    }
                    className="btns theme-outline"
                    sx={{ mx: 2 }}
                  >
                    <span className="fas fa-arrow-down" />
                    <span className="px-1">
                      {t(`${translationPath}download-PDF`)}
                    </span>
                  </ButtonBase>
                </>
              )}
              {((templateData.extraQueries.for
                === FormsForTypesEnum.SystemUser.key
                && templateData.formStatus === FormsStatusesEnum.Rejected.key)
                || (templateData.extraQueries.for === FormsForTypesEnum.Candidate.key
                  && candidateReducer
                  && candidateReducer.submittedForms
                  && candidateReducer.submittedForms.some(
                    (item) =>
                      item.formUUID === templateData.formUUID
                      && item.status === CandidateTypes.REJECTED,
                  ))) && (
                <>
                  <div className="fw-bold fz-30px pb-3">
                    {t(`${translationPath}thank-you`)}!
                  </div>
                  <div className="pb-3">
                    {t(`${translationPath}form-reject-description`)}
                  </div>
                </>
              )}
              <div className="d-flex-center mt-4">
                {getSelectedRoleEnumItem(templateData.editorRole)
                  .isWithMultipleSubmit && (
                  <ButtonBase
                    className="btns theme-outline"
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    <span className="px-1">{t('Shared:cancel')}</span>
                  </ButtonBase>
                )}
                <div className="c-green-primary">
                  {getSelectedRoleEnumItem(templateData.editorRole)
                    .isWithMultipleForm ? (
                      <ButtonBase className="btns theme-outline" onClick={handleClose}>
                        <span
                          className={`fas fa-arrow-${
                            (i18next.dir() === 'ltr' && 'left') || 'right'
                          }`}
                        />
                        <span className="px-1">{t(`${translationPath}continue`)}</span>
                      </ButtonBase>
                    ) : (
                      t(`${translationPath}form-tab-close-description`)
                    )}
                </div>
              </div>
            </div>
          </div>
        }
        isOpen={isOpen && !isLoading && isGlobalLoading.length === 0}
      />
    </Grid>
  );
};

HeaderSection.propTypes = {
  dataSectionItems: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      isTitleVisibleOnTheFinalDocument: PropTypes.bool,
      isSectionVisibleOnTheFinalDoc: PropTypes.bool,
      sectionTitleDecoration: PropTypes.string,
      sectionTitleFontSize: PropTypes.number,
      isStepper: PropTypes.bool,
      order: PropTypes.number,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          type: PropTypes.oneOf(
            Object.values(FormsFieldsTypesEnum).map((item) => item.key),
          ),
          fillBy: PropTypes.oneOf(
            Object.values(FormsRolesEnum).map((item) => item.key),
          ),
          assign: PropTypes.arrayOf(
            PropTypes.shape({
              type: PropTypes.number,
              uuid: PropTypes.string,
            }),
          ),
          code: PropTypes.string,
          isVisible: PropTypes.bool,
          isRequired: PropTypes.bool,
          isVisibleFinalDoc: PropTypes.bool,
          cardTitle: PropTypes.string,
          description: PropTypes.string,
          icon: PropTypes.instanceOf(Object),
          currency: PropTypes.string,
          charMin: PropTypes.number,
          charMax: PropTypes.number,
          languages: PropTypes.objectOf(
            PropTypes.shape({
              value: PropTypes.oneOfType([
                PropTypes.instanceOf(Array),
                PropTypes.instanceOf(Object),
                PropTypes.string,
                PropTypes.number,
              ]),
              placeholder: PropTypes.string,
              title: PropTypes.string,
              isConditionalHidden: PropTypes.bool,
              isConditionalHiddenValue: PropTypes.bool,
              labelDecorations: PropTypes.string,
              labelFontSize: PropTypes.number,
              hideLabel: PropTypes.bool,
              options: PropTypes.arrayOf(
                PropTypes.shape({
                  id: PropTypes.string,
                  title: PropTypes.string,
                  isVisible: PropTypes.bool,
                  description: PropTypes.string,
                  code: PropTypes.string,
                }),
              ),
            }),
          ),
        }),
      ),
    }),
  ).isRequired,
  // setDataSectionItems: PropTypes.func.isRequired,
  templateData: PropTypes.shape({
    uuid: PropTypes.string,
    currentUserUUID: PropTypes.string,
    code: PropTypes.oneOf(
      Object.values(DefaultFormsTypesEnum).map((item) => item.key),
    ),
    formUUID: PropTypes.string,
    formStatus: PropTypes.oneOf(
      Object.values(FormsStatusesEnum).map((item) => item.key),
    ),
    editorRole: PropTypes.oneOf(
      Object.values(FormsRolesEnum).map((item) => item.key),
    ),
    bodyEmail: PropTypes.string,
    subjectEmail: PropTypes.string,
    attachmentsEmail: PropTypes.arrayOf(PropTypes.string),
    isWithRecipient: PropTypes.bool,
    isWithDelay: PropTypes.bool,
    delayDuration: PropTypes.number,
    isWithDeadline: PropTypes.bool,
    deadlineDays: PropTypes.number,
    assign: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.oneOf(
          Object.values(FormsAssignTypesEnum).map((item) => item.key),
        ),
        uuid: PropTypes.string,
        name: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Object)]),
      }),
    ),
    invitedMember: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.oneOf(
          Object.values(FormsMembersTypesEnum).map((item) => item.key),
        ),
        uuid: PropTypes.string,
        name: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Object)]),
      }),
    ),
    assignToAssist: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.oneOf(
          Object.values(FormsAssistTypesEnum).map((item) => item.key),
        ),
        uuid: PropTypes.string,
        role: PropTypes.oneOf(
          Object.values(FormsAssistRoleTypesEnum).map((item) => item.key),
        ),
        name: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Object)]),
      }),
    ),
    extraQueries: PropTypes.shape({
      jobUUID: PropTypes.string,
      pipelineUUID: PropTypes.string,
      jobPipelineUUID: PropTypes.string,
      assignUUID: PropTypes.string,
      isView: PropTypes.bool,
      role: PropTypes.oneOf(
        Object.values(FormsAssistRoleTypesEnum).map((item) => item.key),
      ),
      for: PropTypes.oneOf(Object.values(FormsForTypesEnum).map((item) => item.key)),
      utmSources: PropTypes.oneOf(
        Object.values(FormsUTMSourcesTypesEnum).map((item) => item.key),
      ),
    }),
    categories: PropTypes.instanceOf(Array),
    createdAt: PropTypes.string,
    description: PropTypes.string,
    isGrid: PropTypes.bool,
    // isNotShareable: PropTypes.bool,
    labelsLayout: PropTypes.oneOf(['row', 'column']),
    languages: PropTypes.instanceOf(Object),
    layout: PropTypes.oneOf(['row', 'column']),
    name: PropTypes.string,
    positionLevel: PropTypes.instanceOf(Array),
    primaryLang: PropTypes.string,
    secondaryLang: PropTypes.string,
    recipient: PropTypes.shape({
      avatar: PropTypes.string,
      name: PropTypes.string,
    }),
    sender: PropTypes.shape({
      avatar: PropTypes.string,
      name: PropTypes.string,
    }),
    source: PropTypes.oneOf(
      Object.values(NavigationSourcesEnum).map((item) => item.key),
    ),
    tags: PropTypes.arrayOf(PropTypes.string),
    title: PropTypes.string,
    updatedAt: PropTypes.string,
    workflowApprovalFields: PropTypes.array,
    isSurvey: PropTypes.bool,
  }).isRequired,
  preview: PropTypes.shape({
    isActive: PropTypes.bool.isRequired,
    role: PropTypes.oneOf(Object.values(FormsRolesEnum).map((item) => item.key))
      .isRequired,
  }).isRequired,
  setPreview: PropTypes.func.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  setIsSubmitted: PropTypes.func.isRequired,
  isGlobalLoading: PropTypes.arrayOf(PropTypes.string).isRequired,
  getIsValidData: PropTypes.func.isRequired,
  isLoadingPDF: PropTypes.bool.isRequired,
  // setIsLoadingPDF: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isFailedToGetSections: PropTypes.bool.isRequired,
  setIsLoading: PropTypes.func.isRequired,
  setHeaderHeight: PropTypes.func.isRequired,
  // SendEmailWithOfferHandler: PropTypes.func.isRequired,
  // getIsFormSource: PropTypes.func.isRequired,
  // UpdateDownLoadPDFRecipientHandler: PropTypes.func.isRequired,
  scrollToField: PropTypes.func.isRequired,
  // formsRolesTypes: PropTypes.instanceOf(Object).isRequired,
  systemUserRecipient: PropTypes.instanceOf(Object),
  // setTemplateData: PropTypes.func.isRequired,
  isOpenSideMenu: PropTypes.bool.isRequired,
  setIsOpenSideMenu: PropTypes.func.isRequired,
  getSelectedRoleEnumItem: PropTypes.func.isRequired,
  getFormStatusEnumItem: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  getFilteredRoleTypes: PropTypes.func.isRequired,
  isInitialization: PropTypes.bool,
  pdfRef: PropTypes.instanceOf(Object),
  pdfDownLoad: PropTypes.func,
  ratingAverageData: PropTypes.instanceOf(Object),
};
