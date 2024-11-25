import React, { useMemo, useState, useEffect, useCallback } from 'react';
import PT from 'prop-types';
import { Box, styled, Chip, Typography, Divider, Button } from '@mui/material';
import Person from '../../../../components/Person';
import InputTextToggler from './InputTextToggler';
import {
  FormDownloadEnum,
  FormsAssistRoleTypesEnum,
  FormsMembersTypesEnum,
  FormsRolesEnum,
  FormsAssistTypesEnum,
  FormsStatusesEnum,
  NavigationSourcesEnum,
  FormsForTypesEnum,
  FormsUTMSourcesTypesEnum,
  FormsAssignTypesEnum,
  DefaultFormsTypesEnum,
  FormsFieldAssistTypesEnum,
} from '../../../../../../enums';
// import { useQuery } from '../../../../../hooks';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  GetFormSourceItem,
  GlobalDisplayDateTimeFormat,
} from '../../../../../../helpers';
import { ArrowRightIcon, IndicatorIcon } from '../../../../../form-builder/icons';
import moment from 'moment';
import i18next from 'i18next';
import { PopoverComponent, AvatarsComponent } from '../../../../../../components';
import ButtonBase from '@mui/material/ButtonBase';
import FormMembersPopover from '../../../../popovers/FormMembers.Popover';
import EmailTemplateDialog from '../../../../dialogs/email-template/EmailTemplate.Dialog';
import { FormAssistTabs } from '../../../../tabs-data/FormAssist.Tabs';
import { FormInvitedMembersTabs } from '../../../../tabs-data/FormInvitedMembers.Tabs';
import { FormAssignTabs } from '../../../../tabs-data/FormAssign.Tabs';

const OptionBox = styled(Box)`
  display: flex;
  justify-content: flex-start;
  padding: 10px 0;
  & > .MuiTypography-root {
    flex: 0 80px;
    margin-right: 8px;
  }
  & > .MuiBox-root {
    flex: 1;
  }
`;

function InfoRoute({
  preview,
  isLoadingPDF,
  isSubmitted,
  isGlobalLoading,
  templateData,
  setTemplateData,
  parentTranslationPath,
  translationPath,
  getSelectedRoleEnumItem,
  UpdateDownLoadFilesSenderHandler,
  // UpdateDownLoadPDFRecipientHandler,
  pdfRef,
  pdfDownLoad,
  isLoading,
  isInitialization,
}) {
  const candidateReducer = useSelector((state) => state?.candidateReducer);
  const {
    title,
    name,
    sender,
    recipient,
    // status,
    description,
    editorRole,
    descriptionForm,
  } = templateData;
  const { t } = useTranslation(parentTranslationPath);
  const [isOpenEmailTemplate, setIsOpenEmailTemplate] = useState(false);
  const [templateTitle, setTemplateTitle] = useState({
    text: title,
    isText: true,
  });
  const [popoverAttachedWith, setPopoverAttachedWith] = useState({
    members: null,
    download: null,
  });
  const [membersPopoverProps, setMembersPopoverProps] = useState({});
  const [formTitle, setFormTitle] = useState({
    text: name ? name : 'Untitled',
    isText: true,
  });
  const [templateDescription, setTemplateDescription] = useState({
    text: description,
    isText: true,
  });
  const [formDescription, setFormDescription] = useState({
    text: descriptionForm ? descriptionForm : t(`Shared:edit-description`),
    isText: true,
  });

  useEffect(() => {
    if (title) setTemplateTitle((prev) => ({ ...prev, text: title }));
  }, [title]);

  useEffect(() => {
    if (name) setFormTitle((prev) => ({ ...prev, text: name }));
  }, [name]);

  useEffect(() => {
    if (description)
      setTemplateDescription((prev) => ({ ...prev, text: description }));
  }, [description]);

  useEffect(() => {
    if (descriptionForm)
      setFormDescription((prev) => ({ ...prev, text: descriptionForm }));
  }, [descriptionForm]);

  const handleRenameTitleChange = ({ target: { value } }) => {
    setTemplateTitle(value);
  };

  const handleRenameFormTitleChange = ({ target: { value } }) => {
    setFormTitle(value);
  };

  const handleRenameDescriptionChange = ({ target: { value } }) =>
    setTemplateDescription(value);

  const handleRenameFormDescriptionChange = ({ target: { value } }) =>
    setFormDescription(value);

  const handleRenameTitleSubmit = (e) => {
    e.preventDefault();
    if (templateTitle.text || templateTitle) {
      setTemplateTitle({ text: templateTitle.text || templateTitle, isText: true });
      setTemplateData((prev) => ({
        ...prev,
        title: templateTitle.text || templateTitle,
      }));
    }
  };

  const handleRenameFormTitleSubmit = (e) => {
    e.preventDefault();
    if (formTitle.text || formTitle) {
      setFormTitle({ text: formTitle.text || formTitle, isText: true });
      setTemplateData((prev) => ({ ...prev, name: formTitle.text || formTitle }));
    }
  };

  const handleRenameDescriptionSubmit = (e) => {
    e.preventDefault();
    setTemplateDescription({
      text: Object.hasOwn(templateDescription, 'text')
        ? templateDescription.text
        : templateDescription,
      isText: true,
    });
    setTemplateData((prev) => ({
      ...prev,
      description: Object.hasOwn(templateDescription, 'text')
        ? templateDescription.text
        : templateDescription,
    }));
  };

  const handleRenameFormDescriptionSubmit = (e) => {
    e.preventDefault();
    setFormDescription({
      text: Object.hasOwn(formDescription, 'text')
        ? formDescription.text
        : formDescription,
      isText: true,
    });
    setTemplateData((prev) => ({
      ...prev,
      descriptionForm: Object.hasOwn(formDescription, 'text')
        ? formDescription.text
        : formDescription,
    })); // change
  };

  const handleTitleDoubleClick = () => {
    if (editorRole !== FormsRolesEnum.Recipient.key)
      if (templateTitle.text || templateTitle)
        setTemplateTitle((prev) => ({
          ...(prev.text ? prev : { text: prev }),
          isText: !prev.isText,
        }));
  };

  const handleFormTitleDoubleClick = () => {
    if (editorRole !== FormsRolesEnum.Recipient.key)
      if (formTitle.text || formTitle)
        setFormTitle((prev) => ({
          ...(prev.text ? prev : { text: prev }),
          isText: !prev.isText,
        }));
  };

  const handleDescDoubleClick = () => {
    if (editorRole !== FormsRolesEnum.Recipient.key)
      if (templateDescription.text || templateDescription)
        setTemplateDescription((prev) => ({
          ...(prev.text ? prev : { text: prev }),
          isText: !prev.isText,
        }));
  };

  const handleFormDescDoubleClick = () => {
    if (editorRole !== FormsRolesEnum.Recipient.key)
      if (formDescription.text || formDescription)
        setFormDescription((prev) => ({
          ...(prev.text ? prev : { text: prev }),
          isText: !prev.isText,
        }));
  };

  const computedStatus = useMemo(
    () =>
      Object.values(FormsStatusesEnum).find(
        (item) => item.key === templateData.formStatus,
      )?.status || 'draft',
    [templateData?.formStatus],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to toggle the page popovers part 2
   */
  const onPopoverAttachedWithChanged = useCallback((key, newValue) => {
    setPopoverAttachedWith((items) => ({ ...items, [key]: newValue }));
  }, []);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to toggle the page popovers part 1
   */
  const popoverToggleHandler = useCallback(
    (popoverKey, event = null) => {
      onPopoverAttachedWithChanged(
        popoverKey,
        (event && event.currentTarget) || null,
      );
    },
    [onPopoverAttachedWithChanged],
  );

  const membersPopoverToggleHandler = useCallback(
    (membersPopoverPropsItem) => (event) => {
      setMembersPopoverProps(membersPopoverPropsItem);
      popoverToggleHandler('members', event);
    },
    [popoverToggleHandler],
  );

  const getAssistMembers = useMemo(
    () =>
      ({ role }) =>
        (templateData.assignToAssist
          && templateData.assignToAssist.filter((item) => item.role === role))
        || [],
    [templateData.assignToAssist],
  );

  const infoData = [
    {
      fieldName: t(`Shared:template-name`),
      content:
        editorRole === FormsRolesEnum.Creator.key && !preview.isActive ? (
          <InputTextToggler
            initialValue={templateTitle}
            setInitialValue={setTemplateTitle}
            handleRenameItemChange={handleRenameTitleChange}
            handleRenameItemSubmit={handleRenameTitleSubmit}
            handleDoubleClick={handleTitleDoubleClick}
          />
        ) : Object.hasOwn(templateTitle, 'text') ? (
          templateTitle.text
        ) : (
          templateTitle
        ),
      isVisible: true,
    },
    {
      fieldName: t(`Shared:template-description`),
      content:
        editorRole === FormsRolesEnum.Creator.key && !preview.isActive ? (
          <InputTextToggler
            initialValue={templateDescription}
            setInitialValue={setTemplateDescription}
            handleRenameItemChange={handleRenameDescriptionChange}
            handleRenameItemSubmit={handleRenameDescriptionSubmit}
            handleDoubleClick={handleDescDoubleClick}
          />
        ) : Object.hasOwn(templateDescription, 'text') ? (
          templateDescription.text
        ) : (
          templateDescription
        ),
      isVisible: true,
    },
    {
      fieldName: t(`Shared:form-name`),
      content:
        editorRole === FormsRolesEnum.Sender.key
        && (!templateData.formStatus
          || templateData.formStatus === FormsStatusesEnum.Draft.key)
        && !preview.isActive ? (
            <InputTextToggler
              initialValue={formTitle}
              setInitialValue={setFormTitle}
              handleRenameItemChange={handleRenameFormTitleChange}
              handleRenameItemSubmit={handleRenameFormTitleSubmit}
              handleDoubleClick={handleFormTitleDoubleClick}
            />
          ) : Object.hasOwn(formTitle, 'text') ? (
            formTitle.text
          ) : (
            formTitle
          ),
      isVisible: editorRole !== FormsRolesEnum.Creator.key,
    },
    {
      fieldName: 'form-description',
      content:
        editorRole === FormsRolesEnum.Sender.key
        && (!templateData.formStatus
          || templateData.formStatus === FormsStatusesEnum.Draft.key)
        && !preview.isActive ? (
            <InputTextToggler
              initialValue={formDescription}
              setInitialValue={setFormDescription}
              handleRenameItemChange={handleRenameFormDescriptionChange}
              handleRenameItemSubmit={handleRenameFormDescriptionSubmit}
              handleDoubleClick={handleFormDescDoubleClick}
            />
          ) : Object.hasOwn(formDescription, 'text') ? (
            formDescription.text
          ) : (
            formDescription
          ),
      isVisible: editorRole !== FormsRolesEnum.Creator.key,
    },
    {
      fieldName: 'spaces',
      content: (
        <div className="tags-wrapper-v2">
          {templateData.spaces
            && templateData.spaces.map((item) => (
              <div key={`spacesKeys${item.uuid}`} className="tag-wrapper">
                <span>{item.title}</span>
              </div>
            ))}
        </div>
      ),
      isVisible: templateData.spaces && templateData.spaces.length > 0,
    },
    {
      fieldName: 'folders',
      content: (
        <div className="tags-wrapper-v2">
          {templateData.folders
            && templateData.folders.map((item) => (
              <div key={`foldersKeys${item.uuid}`} className="tag-wrapper">
                <span>{item.title}</span>
              </div>
            ))}
        </div>
      ),
      isVisible: templateData.folders && templateData.folders.length > 0,
    },
    {
      fieldName: t(`Shared:sender`),
      content: <Person avatar={sender.avatar} name={sender.name} />,
      isVisible: true,
    },
    {
      fieldName: t(`Shared:recipient`),
      content: <Person avatar={recipient.avatar} name={recipient.name} />,
      isVisible: Boolean(recipient.name),
    },
    {
      fieldName: t(`Shared:status`),
      content: (
        <Chip
          icon={<IndicatorIcon sx={{ color: 'dark.$40' }} />}
          label={t(computedStatus)}
          variant="xs"
          bg="darka6"
          sx={{
            mr: 1.5,
            pr: 2,
            py: 0.5,
            color: 'dark.$60',
            '> .MuiChip-icon': {
              m: 0,
              fontSize: 18,
              color: 'dark.$40',
            },
          }}
        />
      ),
      isVisible: true,
    },
    {
      fieldName: t(`Shared:created-at`),
      content:
        templateData.createdAt
        && moment(templateData.createdAt)
          .locale(i18next.language)
          .format(GlobalDisplayDateTimeFormat),
      isVisible: Boolean(templateData.createdAt),
    },
    {
      fieldName: t(`Shared:last-activity`),
      content: moment(templateData.updatedAt)
        .locale(i18next.language)
        .format(GlobalDisplayDateTimeFormat),
      isVisible: true,
    },
    {
      fieldName: t(`Shared:copy`),
      content: (
        <Button
          onClick={(e) => {
            if (editorRole === FormsRolesEnum.Recipient.key)
              pdfDownLoad({
                pdfName: templateData?.title,
                element: pdfRef.current,
                ref: pdfRef,
              });
            else popoverToggleHandler('download', e);
          }}
          disabled={
            isLoadingPDF
            || isGlobalLoading.length > 0
            || isInitialization
            || isLoading
            || (!candidateReducer
              && editorRole === FormsRolesEnum.Recipient.key
              && templateData.extraQueries.for === FormsForTypesEnum.Candidate.key)
          }
          startIcon={<ArrowRightIcon sx={{ transform: 'rotate(90deg)' }} />}
          variant="border"
          size="m"
          sx={{ mr: 2 }}
        >
          Download
        </Button>
      ),
      isVisible: editorRole !== FormsRolesEnum.Creator.key,
    },
    {
      fieldName: 'assign',
      content: (
        <>
          <AvatarsComponent
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            idRef="assignAvatarsRef"
            avatarImageAlt="assign"
            avatars={templateData.assign}
            isDisabled={preview.isActive}
            onEndBtnClicked={membersPopoverToggleHandler({
              arrayKey: 'assign',
              values: templateData.assign,
              popoverTabs: FormAssignTabs,
              // visibleFormMembers: [
              //   FormsAssignTypesEnum.JobStage.key,
              //   FormsAssignTypesEnum.JobCandidate.key,
              // ],
              getListAPIProps: ({ type }) => ({
                job_uuid: templateData.extraQueries.jobUUID,
                pipeline_uuid: templateData.extraQueries.pipelineUUID,
                job_pipeline_uuid: templateData.extraQueries.jobPipelineUUID,
                ...(templateData.assign
                  && type !== FormsAssignTypesEnum.JobStage.key
                  && templateData.assign.length > 0 && {
                  with_than: templateData.assign
                    .filter((item) => item.type === type)
                    .map((item) => item.uuid),
                }),
              }),
              isDisabled: Boolean(templateData.formUUID),
            })}
            onGroupClicked={membersPopoverToggleHandler({
              arrayKey: 'assign',
              values: templateData.assign,
              popoverTabs: FormAssignTabs,
              // visibleFormMembers: [
              //   FormsAssignTypesEnum.JobStage.key,
              //   FormsAssignTypesEnum.JobCandidate.key,
              // ],
              getListAPIProps: ({ type }) => ({
                job_uuid: templateData.extraQueries.jobUUID,
                pipeline_uuid: templateData.extraQueries.pipelineUUID,
                job_pipeline_uuid: templateData.extraQueries.jobPipelineUUID,
                ...(templateData.assign
                  && type !== FormsAssignTypesEnum.JobStage.key
                  && templateData.assign.length > 0 && {
                  with_than: templateData.assign
                    .filter((item) => item.type === type)
                    .map((item) => item.uuid),
                }),
              }),
              isDisabled: Boolean(templateData.formUUID),
            })}
          />
          {isSubmitted
            && (!templateData.assign || templateData.assign.length === 0) && (
            <div className="c-error fz-10 px-2 my-2">
              <span>{`${t('Shared:please-select-at-least')} ${1} ${t(
                `${translationPath}assign`,
              )}`}</span>
            </div>
          )}
        </>
      ),
      isVisible:
        getSelectedRoleEnumItem
        && (!preview.isActive
          || getSelectedRoleEnumItem(preview.role).isWithGlobalAssign)
        && getSelectedRoleEnumItem(editorRole).isWithGlobalAssign,
      isInvalid: Boolean(
        isSubmitted
          && getSelectedRoleEnumItem
          && (!preview.isActive
            || getSelectedRoleEnumItem(preview.role).isWithGlobalAssign)
          && getSelectedRoleEnumItem(editorRole).isWithGlobalAssign
          && (!templateData.assign || templateData.assign.length === 0),
      ),
    },
    {
      fieldName: 'invited-members',
      content: (
        <AvatarsComponent
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          idRef="invitedMembersAvatarsRef"
          avatarImageAlt="invited-member"
          avatars={templateData.invitedMember}
          isDisabled={preview.isActive}
          onEndBtnClicked={membersPopoverToggleHandler({
            arrayKey: 'invitedMember',
            values: templateData.invitedMember,
            popoverTabs: FormInvitedMembersTabs,
            // visibleFormMembers: Object.values(FormsMembersTypesEnum).map(
            //   (item) => item.key
            // ),
            getPropsByType: ({ type }) =>
              ((type === FormsMembersTypesEnum.Candidates.key
                || type === FormsMembersTypesEnum.Stages.key) && {
                isWithThanOnly: true,
              })
              || {},
            getListAPIProps: ({ type }) => ({
              job_uuid: templateData.extraQueries.jobUUID,
              pipeline_uuid: templateData.extraQueries.pipelineUUID,
              job_pipeline_uuid: templateData.extraQueries.jobPipelineUUID,
              ...(type === FormsMembersTypesEnum.Employees.key && {
                all_employee: 1,
              }),
              ...(type === FormsMembersTypesEnum.Candidates.key
              || type === FormsMembersTypesEnum.Stages.key
                ? {
                  with_than: templateData.assign
                    .filter(
                      (item) =>
                        type !== FormsMembersTypesEnum.Candidates.key
                          || item.type === FormsAssignTypesEnum.JobCandidate.key,
                    )
                    .map((item) => item.uuid),
                }
                : templateData.invitedMember
                  && templateData.invitedMember.filter((item) => item.type === type)
                    .length > 0 && {
                  with_than: templateData.invitedMember
                    .filter((item) => item.type === type)
                    .map((item) => item.uuid),
                }),
            }),
            // dropdownsProps: {
            //   job_uuid: templateData.extraQueries.jobUUID,
            //   job_pipeline_uuid: templateData.extraQueries.pipelineUUID,
            //   stage_uuid: templateData.extraQueries.stageUUID,
            //   selected_candidates: templateData.invitedMember.map(
            //     (item) => item.uuid
            //   ),
            // },
            isDisabled: Boolean(templateData.formUUID),
          })}
          onGroupClicked={membersPopoverToggleHandler({
            arrayKey: 'invitedMember',
            popoverTabs: FormInvitedMembersTabs,
            values: templateData.invitedMember,
            getPropsByType: ({ type }) =>
              ((type === FormsMembersTypesEnum.Candidates.key
                || type === FormsMembersTypesEnum.Stages.key) && {
                isWithThanOnly: true,
              })
              || {},
            getListAPIProps: ({ type }) => ({
              job_uuid: templateData.extraQueries.jobUUID,
              pipeline_uuid: templateData.extraQueries.pipelineUUID,
              job_pipeline_uuid: templateData.extraQueries.jobPipelineUUID,
              ...(type === FormsMembersTypesEnum.Employees.key && {
                all_employee: 1,
              }),
              ...(type === FormsMembersTypesEnum.Candidates.key
              || type === FormsMembersTypesEnum.Stages.key
                ? {
                  with_than: templateData.assign
                    .filter(
                      (item) =>
                        type !== FormsMembersTypesEnum.Candidates.key
                          || item.type === FormsAssignTypesEnum.JobCandidate.key,
                    )
                    .map((item) => item.uuid),
                }
                : templateData.invitedMember
                  && templateData.invitedMember.filter((item) => item.type === type)
                    .length > 0 && {
                  with_than: templateData.invitedMember
                    .filter((item) => item.type === type)
                    .map((item) => item.uuid),
                }),
            }),
            // dropdownsProps: {
            //   job_uuid: templateData.extraQueries.jobUUID,
            //   job_pipeline_uuid: templateData.extraQueries.pipelineUUID,
            //   stage_uuid: templateData.extraQueries.stageUUID,
            //   selected_candidates: templateData.invitedMember.map(
            //     (item) => item.uuid
            //   ),
            // },
            isDisabled: Boolean(templateData.formUUID),
          })}
        />
      ),
      isVisible:
        templateData.isWithRecipient
        && getSelectedRoleEnumItem
        && (!preview.isActive
          || getSelectedRoleEnumItem(preview.role).isWithGlobalInvite)
        && getSelectedRoleEnumItem(editorRole).isWithGlobalInvite,
    },
    {
      fieldName: 'assign-to-assist',
      content: (
        <AvatarsComponent
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          idRef="assignToAssistAvatarsRef"
          avatarImageAlt="assigned-member"
          avatars={getAssistMembers({
            role: FormsAssistRoleTypesEnum.Editor.key,
          })}
          isDisabled={preview.isActive}
          onEndBtnClicked={membersPopoverToggleHandler({
            arrayKey: 'assignToAssist',
            values: getAssistMembers({
              role: FormsAssistRoleTypesEnum.Editor.key,
            }),
            popoverTabs:
              templateData.code === DefaultFormsTypesEnum.Flows.key
                ? FormAssistTabs
                : FormAssistTabs.filter(
                  (item) =>
                    item.props.type
                      !== FormsFieldAssistTypesEnum.Collaborators.key,
                ),
            isDisabled: templateData.formUUID,
            getIsDisabledItem: ({ memberItem }) =>
              getAssistMembers({
                role: FormsAssistRoleTypesEnum.Viewer.key,
              }).some((item) =>(item.uuid && item.uuid === memberItem.uuid) || (item.key && item.key === memberItem.key)),
            getListAPIProps: () => ({
              all_employee: 1,
              ...(getAssistMembers({
                role: FormsAssistRoleTypesEnum.Editor.key,
              }).length > 0 && {
                with_than: getAssistMembers({
                  role: FormsAssistRoleTypesEnum.Editor.key,
                }).map((item) => item.uuid),
              }),
            }),
            extraStateData: { role: FormsAssistRoleTypesEnum.Editor.key },
          })}
          onGroupClicked={membersPopoverToggleHandler({
            arrayKey: 'assignToAssist',
            values: getAssistMembers({
              role: FormsAssistRoleTypesEnum.Editor.key,
            }),
            popoverTabs:
              templateData.code === DefaultFormsTypesEnum.Flows.key
                ? FormAssistTabs
                : FormAssistTabs.filter(
                  (item) =>
                    item.props.type
                      !== FormsFieldAssistTypesEnum.Collaborators.key,
                ),
            getIsDisabledItem: ({ memberItem }) =>
              getAssistMembers({
                role: FormsAssistRoleTypesEnum.Viewer.key,
              }).some((item) =>(item.uuid && item.uuid === memberItem.uuid) || (item.key && item.key === memberItem.key)),
            getListAPIProps: () => ({
              all_employee: 1,
              ...(getAssistMembers({
                role: FormsAssistRoleTypesEnum.Editor.key,
              }).length > 0 && {
                with_than: getAssistMembers({
                  role: FormsAssistRoleTypesEnum.Editor.key,
                }).map((item) => item.uuid),
              }),
            }),
            extraStateData: { role: FormsAssistRoleTypesEnum.Editor.key },
          })}
        />
      ),
      isVisible:
        templateData.isWithRecipient
        && getSelectedRoleEnumItem
        && (!preview.isActive
          || getSelectedRoleEnumItem(preview.role).isWithGlobalAssignToAssist)
        && getSelectedRoleEnumItem(editorRole).isWithGlobalAssignToAssist,
    },
    {
      fieldName: 'assign-to-view',
      content: (
        <AvatarsComponent
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          idRef="assignToViewAvatarsRef"
          avatarImageAlt="assigned-member"
          avatars={getAssistMembers({
            role: FormsAssistRoleTypesEnum.Viewer.key,
          })}
          isDisabled={preview.isActive}
          onEndBtnClicked={membersPopoverToggleHandler({
            arrayKey: 'assignToAssist',
            values: getAssistMembers({
              role: FormsAssistRoleTypesEnum.Viewer.key,
            }),
            popoverTabs:
              templateData.code === DefaultFormsTypesEnum.Flows.key
                ? FormAssistTabs
                : FormAssistTabs.filter(
                  (item) =>
                    item.props.type
                      !== FormsFieldAssistTypesEnum.Collaborators.key,
                ),
            getIsDisabledItem: ({ memberItem }) =>
              getAssistMembers({
                role: FormsAssistRoleTypesEnum.Editor.key,
              }).some((item) =>(item.uuid && item.uuid === memberItem.uuid) || (item.key && item.key === memberItem.key)),
            getListAPIProps: () => ({
              all_employee: 1,
              ...(getAssistMembers({
                role: FormsAssistRoleTypesEnum.Viewer.key,
              }).length > 0 && {
                with_than: getAssistMembers({
                  role: FormsAssistRoleTypesEnum.Viewer.key,
                }).map((item) => item.uuid),
              }),
            }),
            extraStateData: { role: FormsAssistRoleTypesEnum.Viewer.key },
          })}
          onGroupClicked={membersPopoverToggleHandler({
            arrayKey: 'assignToAssist',
            values: getAssistMembers({
              role: FormsAssistRoleTypesEnum.Viewer.key,
            }),
            popoverTabs:
              templateData.code === DefaultFormsTypesEnum.Flows.key
                ? FormAssistTabs
                : FormAssistTabs.filter(
                  (item) =>
                    item.props.type
                      !== FormsFieldAssistTypesEnum.Collaborators.key,
                ),
            getIsDisabledItem: ({ memberItem }) =>
              getAssistMembers({
                role: FormsAssistRoleTypesEnum.Editor.key,
              }).some((item) =>(item.uuid && item.uuid === memberItem.uuid) || (item.key && item.key === memberItem.key)),
            getListAPIProps: () => ({
              all_employee: 1,
              ...(getAssistMembers({
                role: FormsAssistRoleTypesEnum.Viewer.key,
              }).length > 0 && {
                with_than: getAssistMembers({
                  role: FormsAssistRoleTypesEnum.Viewer.key,
                }).map((item) => item.uuid),
              }),
            }),
            extraStateData: { role: FormsAssistRoleTypesEnum.Viewer.key },
          })}
        />
      ),
      isVisible:
        templateData.isWithRecipient
        && getSelectedRoleEnumItem
        && (!preview.isActive
          || getSelectedRoleEnumItem(preview.role).isWithGlobalAssignToView)
        && getSelectedRoleEnumItem(editorRole).isWithGlobalAssignToView,
    },
    {
      fieldName: 'invitation-email-template',
      content: (
        <>
          <ButtonBase
            className="btns theme-transparent"
            onClick={() => {
              setIsOpenEmailTemplate(true);
            }}
          >
            <span className="fas fa-cog" />
            <span className="mx-2">{t(`${translationPath}manage-template`)}</span>
          </ButtonBase>
          {isSubmitted
            && templateData.invitedMember
            && templateData.invitedMember.some(
              (item) =>
                item.type === FormsMembersTypesEnum.Candidates.key
                || item.type === FormsMembersTypesEnum.Stages.key,
            )
            && !templateData.bodyEmail && (
            <div className="c-error fz-10 px-2 my-2">
              <span>{t(`${translationPath}email-template-error`)}</span>
            </div>
          )}
        </>
      ),
      isVisible:
        templateData.isWithRecipient
        && getSelectedRoleEnumItem
        && (!preview.isActive
          || getSelectedRoleEnumItem(preview.role).isWithGlobalInvite)
        && getSelectedRoleEnumItem(editorRole).isWithGlobalInvite
        && templateData.invitedMember.some(
          (item) =>
            item.type === FormsMembersTypesEnum.Candidates.key
            || item.type === FormsMembersTypesEnum.Stages.key,
        ),
      isInvalid: Boolean(
        isSubmitted
          && templateData.isWithRecipient
          && templateData.invitedMember
          && templateData.invitedMember.some(
            (item) =>
              item.type === FormsMembersTypesEnum.Candidates.key
              || item.type === FormsMembersTypesEnum.Stages.key,
          )
          && !templateData.bodyEmail,
      ),
    },
  ];

  return (
    <Box
      sx={{
        ml: 3,
        my: 1,
      }}
    >
      {infoData
        .filter((x) => x.isVisible)
        .map(({ fieldName, content, isInvalid }) => (
          <OptionBox key={fieldName}>
            <Typography
              display="flex"
              color="dark.$80"
              variant="body13"
              lh="double"
              className={(isInvalid && 'c-error') || ''}
            >
              {t(`${translationPath}${fieldName}`)}
            </Typography>
            <Box display="flex" alignItems="center">
              <Typography variant="body14">{content}</Typography>
            </Box>
          </OptionBox>
        ))}
      <Divider sx={{ ml: -5, my: 3 }} />
      <PopoverComponent
        idRef="downloadPopoverRef"
        attachedWith={popoverAttachedWith.download}
        handleClose={() => popoverToggleHandler('download', null)}
        component={
          <div className="d-flex-column p-2">
            {Object.values(FormDownloadEnum).map((item) => (
              <ButtonBase
                key={`formDownloadEnumKey${item.key}`}
                className="btns theme-transparent mx-0 miw-0 c-gray-primary fj-start"
                onClick={() => {
                  if (item.key === 'pdf')
                    pdfDownLoad({
                      pdfName: templateData?.title,
                      element: pdfRef.current,
                      ref: pdfRef,
                    });
                  else
                    UpdateDownLoadFilesSenderHandler({
                      path: item.path,
                      key: item.key,
                      successMsg: item.success,
                      type: item.responseType,
                    });
                  popoverToggleHandler('download', null);
                }}
              >
                <span> {item.value}</span>
              </ButtonBase>
            ))}
          </div>
        }
      />
      {popoverAttachedWith.members && (
        <FormMembersPopover
          {...membersPopoverProps}
          popoverAttachedWith={popoverAttachedWith.members}
          handleClose={() => {
            popoverToggleHandler('members', null);
            setMembersPopoverProps(null);
          }}
          onSave={(state) => {
            const localState = { ...state };

            setTemplateData((items) => {
              if (membersPopoverProps.arrayKey === 'assignToAssist') {
                // this logic is to keep the old one that does not have the same role
                // for example when update assign to edit role the view one needs to be same
                items.assignToAssist = items.assignToAssist.filter(
                  (item) => item.role !== membersPopoverProps.extraStateData.role,
                );
                localState.assignToAssist.push(...items.assignToAssist);
              } else if (membersPopoverProps.arrayKey === 'assign') {
                // this code is to add the new assign also for invited member

                // this condition is to return if no change made
                if (
                  localState.assign.length === templateData.assign.length
                  && !localState.assign.some((item) =>
                    templateData.assign.some(
                      (element) => element.uuid !== item.uuid,
                    ),
                  )
                )
                  return items;

                const newInvitedUsers = localState.assign
                  .filter(
                    (item) =>
                      !items.invitedMember.some(
                        (element) => element.uuid === item.uuid,
                      ),
                  )
                  .map((element) => ({
                    ...element,
                    type:
                      element.type === FormsAssignTypesEnum.JobStage.key
                        ? FormsMembersTypesEnum.Stages.key
                        : FormsMembersTypesEnum.Candidates.key,
                  }));
                items.invitedMember.push(...newInvitedUsers);
                items.invitedMember = items.invitedMember.filter(
                  (item) =>
                    (item.type !== FormsMembersTypesEnum.Candidates.key
                      && item.type !== FormsMembersTypesEnum.Stages.key)
                    || localState.assign.some((element) => element.uuid === item.uuid),
                );
              }
              return {
                ...items,
                ...localState,
              };
            });
          }}
          // listAPIProps={
          //   (templateData.extraQueries.assignUUID && {
          //     with_than: [templateData.extraQueries.assignUUID],
          //   })
          //   || undefined
          // }
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
      {isOpenEmailTemplate && (
        <EmailTemplateDialog
          editValue={
            (templateData.bodyEmail || templateData.subjectEmail) && {
              bodyEmail: templateData.bodyEmail,
              subjectEmail: templateData.subjectEmail,
              attachmentsEmail: templateData.attachmentsEmail,
              emailLanguageId: templateData.emailLanguageId,
              emailTemplateUUID: templateData.emailTemplateUUID,
            }
          }
          isDisabled={
            GetFormSourceItem(templateData.source).isView || preview.isActive
          }
          isOpen={isOpenEmailTemplate}
          isOpenChanged={() => {
            setIsOpenEmailTemplate(false);
          }}
          onSave={(state) => {
            setTemplateData((items) => ({
              ...items,
              ...state,
            }));
          }}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
    </Box>
  );
}

InfoRoute.propTypes = {
  pdfRef: PT.instanceOf(Object),
  isLoadingPDF: PT.bool,
  preview: PT.shape({
    isActive: PT.bool,
    role: PT.string,
  }),
  templateData: PT.shape({
    uuid: PT.string,
    formUUID: PT.string,
    name: PT.string,
    descriptionForm: PT.string,
    title: PT.string,
    bodyEmail: PT.string,
    subjectEmail: PT.string,
    emailTemplateUUID: PT.string,
    emailLanguageId: PT.string,
    source: PT.oneOf(Object.values(NavigationSourcesEnum).map((item) => item.key)),
    attachmentsEmail: PT.arrayOf(PT.string),
    spaces: PT.instanceOf(Array),
    folders: PT.instanceOf(Array),
    sender: PT.shape({
      name: PT.string,
      avatar: PT.string,
    }),
    recipient: PT.shape({
      name: PT.string,
      avatar: PT.string,
    }),
    isWithRecipient: PT.bool,
    isWithDelay: PT.bool,
    delayDuration: PT.number,
    isWithDeadline: PT.bool,
    deadlineDays: PT.number,
    assign: PT.arrayOf(
      PT.shape({
        type: PT.oneOf(Object.values(FormsAssignTypesEnum).map((item) => item.key)),
        uuid: PT.string,
        name: PT.oneOfType([PT.string, PT.instanceOf(Object)]),
      }),
    ),
    invitedMember: PT.arrayOf(
      PT.shape({
        type: PT.oneOf(Object.values(FormsMembersTypesEnum).map((item) => item.key)),
        uuid: PT.string,
        name: PT.oneOfType([PT.string, PT.instanceOf(Object)]),
      }),
    ),
    assignToAssist: PT.arrayOf(
      PT.shape({
        type: PT.oneOf(Object.values(FormsAssistTypesEnum).map((item) => item.key)),
        uuid: PT.string,
        role: PT.oneOf(
          Object.values(FormsAssistRoleTypesEnum).map((item) => item.key),
        ),
        name: PT.oneOfType([PT.string, PT.instanceOf(Object)]),
      }),
    ),
    extraQueries: PT.shape({
      jobUUID: PT.string,
      pipelineUUID: PT.string,
      jobPipelineUUID: PT.string,
      stageUUID: PT.string,
      assignUUID: PT.string,
      isView: PT.bool,
      isLoading: PT.bool,
      for: PT.oneOf(Object.values(FormsForTypesEnum).map((item) => item.key)),
      role: PT.oneOf(
        Object.values(FormsAssistRoleTypesEnum).map((item) => item.key),
      ),
      utmSources: PT.oneOf(
        Object.values(FormsUTMSourcesTypesEnum).map((item) => item.key),
      ),
    }),
    createdAt: PT.string,
    status: PT.bool,
    description: PT.string,
    editorRole: PT.string,
    formStatus: PT.number,
    updatedAt: PT.string,
  }).isRequired,
  setTemplateData: PT.func,
  getSelectedRoleEnumItem: PT.func,
  isSubmitted: PT.bool.isRequired,
  isGlobalLoading: PT.arrayOf(PT.string).isRequired,
  UpdateDownLoadFilesSenderHandler: PT.func.isRequired,
  // UpdateDownLoadPDFRecipientHandler: PT.func.isRequired,
  parentTranslationPath: PT.string.isRequired,
  translationPath: PT.string.isRequired,
  pdfDownLoad: PT.func,
  isLoading: PT.bool,
  isInitialization: PT.bool,
};

InfoRoute.defaultProps = {
  preview: {
    isActive: false,
    role: '',
  },
  sender: {
    name: '',
    avatar: '',
  },
  recipient: {
    name: '',
    avatar: '',
  },
};

export default InfoRoute;
