import React, { useMemo, useState, useEffect, useCallback } from 'react';
import PT from 'prop-types';
import {
  Box,
  styled,
  Chip,
  Typography,
  Divider,
  Button,
  ButtonBase,
} from '@mui/material';
import { IndicatorIcon, ArrowRightIcon } from '../../../icons';
import Person from '../../../components/Person';
import InputTextToggler from './InputTextToggler';
import {
  TemplateRolesEnum,
  FormDownloadEnum,
  FormsAssignTypesEnum,
  FormsMembersTypesEnum,
  OfferAssignTypesEnum,
} from '../../../../../enums';
import { OffersStatusesEnum } from 'enums/Shared/OffersStatuses.Enum';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { AvatarsComponent, PopoverComponent } from '../../../../../components';
import { FormAssignTabs } from '../../../../form-builder-v2/tabs-data/FormAssign.Tabs';
import FormMembersPopover from '../../../../form-builder-v2/popovers/FormMembers.Popover';
import { OfferAssignTabs } from '../tabs-data/OfferAssign.Tabs';

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
  templateData,
  lastTimeChanged,
  templateCreationTime,
  setTemplateData,
  offerData,
  // UpdateDownLoadPDFSenderHandler,
  UpdateDownLoadPDFRecipientHandler,
  UpdateDownLoadFilesSenderHandler,
  pdfDownLoad,
  isGlobalLoading,
  pdfRef,
  parentTranslationPath,
  translationPath,
  isFromBulkSelect,
  errors,
  isSubmitted,
}) {
  const candidateUserReducer = useSelector((state) => state?.candidateUserReducer);
  const {
    title,
    name,
    sender,
    recipient,
    status,
    description,
    editorRole,
    descriptionForm,
  } = templateData;
  const { t } = useTranslation('Shared');
  const [isLoadingPDF, setIsLoadingPDF] = useState(false);
  const [downloadPopover, setDownloadPopover] = useState(null);
  // const query = useQuery();
  // const [queryStatus, setQueryStatus] = useState(query.get('status'));
  const [templateTitle, setTemplateTitle] = useState({
    text: title,
    isText: true,
  });
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
  const [popoverAttachedWith, setPopoverAttachedWith] = useState({
    members: null,
    download: null,
  });
  const [membersPopoverProps, setMembersPopoverProps] = useState({});
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
    if (editorRole !== 'recipient')
      if (templateTitle.text || templateTitle)
        setTemplateTitle((prev) => ({
          ...(prev.text ? prev : { text: prev }),
          isText: !prev.isText,
        }));
  };

  const handleFormTitleDoubleClick = () => {
    if (editorRole !== 'recipient')
      if (formTitle.text || formTitle)
        setFormTitle((prev) => ({
          ...(prev.text ? prev : { text: prev }),
          isText: !prev.isText,
        }));
  };

  const handleDescDoubleClick = () => {
    if (editorRole !== 'recipient')
      if (templateDescription.text || templateDescription)
        setTemplateDescription((prev) => ({
          ...(prev.text ? prev : { text: prev }),
          isText: !prev.isText,
        }));
  };

  const handleFormDescDoubleClick = () => {
    if (editorRole !== 'recipient')
      if (formDescription.text || formDescription)
        setFormDescription((prev) => ({
          ...(prev.text ? prev : { text: prev }),
          isText: !prev.isText,
        }));
  };

  const computedStatus = useMemo(
    () =>
      // if(offerData)
      //   if (offerData.approvedStatus === OfferApprovalStatus.APPROVED.key)
      //     return (
      //       Object.values(OffersStatusesEnum).find(
      //         (item) =>
      //           item.key === parseInt(queryStatus)
      //           || item.key === parseInt(offerData?.status)
      //       )?.status || 'Draft'
      //     );
      //   else if (offerData.approvedStatus === OfferApprovalStatus.OPENED.key)
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
      //       Object.values(OfferApprovalStatus).find(
      //         (item) => item.key === parseInt(offerData?.approvedStatus)
      //       )?.status || 'Draft'
      //     );
      // else
      Object.values(OffersStatusesEnum).find(
        (item) => item.key === parseInt(offerData?.status),
      )?.status || 'draft',
    [offerData],
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

  const membersPopoverToggleHandler = useCallback(
    (membersPopoverPropsItem) => (event) => {
      setMembersPopoverProps(membersPopoverPropsItem);
      popoverToggleHandler('members', event);
    },
    [popoverToggleHandler],
  );

  const infoData = [
    {
      fieldName: t(`Shared:template-name`),
      content:
        editorRole === 'creator' && !preview.isActive ? (
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
        editorRole === 'creator' && !preview.isActive ? (
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
        editorRole === 'sender'
        && (!status
          || parseInt(status) === OffersStatusesEnum.Draft.key
          || parseInt(status) === OffersStatusesEnum.NotSent.key)
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
      isVisible: editorRole !== 'creator',
    },
    {
      fieldName: t(`Shared:form-description`),
      content:
        editorRole === 'sender'
        && (!status
          || parseInt(status) === OffersStatusesEnum.Draft.key
          || parseInt(status) === OffersStatusesEnum.NotSent.key)
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
      isVisible: editorRole !== 'creator',
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
      content: templateCreationTime,
      isVisible: !!templateCreationTime,
    },
    {
      fieldName: t(`Shared:last-activity`),
      content: lastTimeChanged,
      isVisible: true,
    },
    {
      fieldName: t(`Shared:copy`),
      content: (
        <>
          <Button
            onClick={(e) => {
              if (editorRole === 'recipient')
                pdfDownLoad({
                  pdfName: templateData?.name || templateData?.title,
                  element: pdfRef.current,
                  ref: pdfRef,
                });
              else popoverToggleHandler('download', e);
            }}
            disabled={
              isLoadingPDF
              || isGlobalLoading?.length > 0
              || (!candidateUserReducer
                && editorRole === TemplateRolesEnum.Recipient.key)
            }
            startIcon={<ArrowRightIcon sx={{ transform: 'rotate(90deg)' }} />}
            variant="border"
            size="m"
            sx={{ mr: 2 }}
          >
            Download
          </Button>
          <PopoverComponent
            idRef="customViewPopoverRef"
            attachedWith={popoverAttachedWith.download}
            handleClose={() => popoverToggleHandler('download', null)}
            component={
              <div className="d-flex-column p-2">
                {Object.values(FormDownloadEnum).map((item) => (
                  <ButtonBase
                    key={item.key}
                    className="btns theme-transparent mx-0 miw-0 c-gray-primary fj-start"
                    onClick={() => {
                      item.key === FormDownloadEnum.pdf.key
                        ? pdfDownLoad({
                          pdfName: templateData?.name || templateData?.title,
                          element: pdfRef.current,
                          ref: pdfRef,
                        })
                        : UpdateDownLoadFilesSenderHandler({
                          path: item.offerPath,
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
        </>
      ),
      isVisible:
        editorRole === TemplateRolesEnum.Sender.key
        || (editorRole === TemplateRolesEnum.Recipient.key
          && templateData?.downloadPdfOffer),
    },
    {
      fieldName: t(`${t(`${parentTranslationPath}:selected-candidates`)}`),
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
              getListAPIProps: ({ type }) => ({
                job_uuid: templateData.extraQueries.jobUUID,
                pipeline_uuid: templateData.extraQueries.pipelineUUID,
                job_pipeline_uuid: templateData.extraQueries.jobPipelineUUID,
                ...(templateData.assign
                  && type !== OfferAssignTypesEnum.JobStage.key
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
              popoverTabs: OfferAssignTabs,
              getListAPIProps: ({ type }) => ({
                job_uuid: templateData.extraQueries.jobUUID,
                pipeline_uuid: templateData.extraQueries.pipelineUUID,
                job_pipeline_uuid: templateData.extraQueries.jobPipelineUUID,
                ...(templateData.assign
                  && type !== OfferAssignTypesEnum.JobStage.key
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
            && isFromBulkSelect
            && (!templateData.assign || templateData.assign.length === 0) && (
            <div className="c-error fz-10 px-2 my-2">
              <span>{`${t('Shared:please-select-at-least')} ${1} ${t(
                `${parentTranslationPath}:assign`,
              )}`}</span>
            </div>
          )}
        </>
      ),
      isVisible: !preview.isActive && isFromBulkSelect,
    },
  ];

  // useEffect(() => {
  //   const localQueryStatus = query.get('status');
  //   if (localQueryStatus) setQueryStatus(localQueryStatus);
  // }, [query]);

  return (
    <Box
      sx={{
        ml: 3,
        my: 1,
      }}
    >
      {infoData
        .filter(
          (x) =>
            ((editorRole === 'recipient'
              && [
                'Form name',
                'Form description',
                'Sender',
                'Created at',
                'Last activity',
                'Copy',
                'Recipient',
              ].includes(x.fieldName))
              || editorRole !== 'recipient')
            && x.isVisible,
        )
        .map(({ fieldName, content }) => (
          <OptionBox key={fieldName}>
            <Typography
              display="flex"
              alignItems="center"
              color="dark.$80"
              variant="body13"
              lh="double"
            >
              {fieldName}
            </Typography>
            <Box display="flex" alignItems="center">
              <Typography variant="body14">{content}</Typography>
            </Box>
          </OptionBox>
        ))}
      <Divider sx={{ ml: -5, my: 3 }} />
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
              if (
                localState.assign.length === templateData.assign.length
                && !localState.assign.some((item) =>
                  templateData.assign.some((element) => element.uuid !== item.uuid),
                )
              )
                return items;

              const newInvitedUsers = localState.assign.filter(
                (item) =>
                  !items.invitedMember.some((element) => element.uuid === item.uuid),
              );
              items.invitedMember.push(...newInvitedUsers);
              items.invitedMember = items.invitedMember.filter(
                (item) =>
                  (item.type !== OfferAssignTypesEnum.JobCandidate.key
                    && item.type !== OfferAssignTypesEnum.JobStage.key)
                  || localState.assign.some((element) => element.uuid === item.uuid),
              );

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
    </Box>
  );
}

InfoRoute.propTypes = {
  preview: PT.shape({
    isActive: PT.bool,
    role: PT.string,
  }),
  templateData: PT.shape({
    name: PT.string,
    title: PT.string,
    sender: PT.shape({
      name: PT.string,
      avatar: PT.string,
    }),
    recipient: PT.shape({
      name: PT.string,
      avatar: PT.string,
    }),
    createdAt: PT.string,
    status: PT.number,
    description: PT.string,
    editorRole: PT.string,
    downloadPdfOffer: PT.bool,
  }).isRequired,
  lastTimeChanged: PT.oneOfType([PT.string, PT.number]).isRequired,
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
