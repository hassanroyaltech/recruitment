import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  SetupsReducer,
  SetupsReset,
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
} from '../../../../../../../../setups/shared';
import {
  getErrorByName,
  GlobalHistory,
  showError,
  showSuccess,
} from '../../../../../../../../../helpers';
import * as yup from 'yup';
import {
  AvatarsComponent,
  DialogComponent,
} from '../../../../../../../../../components';
import {
  AvatarsThemesEnum,
  DefaultFormsTypesEnum,
  NavigationSourcesEnum,
  OfferAssignTypesEnum,
  OffersStatusesEnum,
  PipelineBulkSelectTypesEnum,
} from '../../../../../../../../../enums';
import FormMembersPopover from '../../../../../../../../form-builder-v2/popovers/FormMembers.Popover';
import EmailTemplateDialog from '../../../../../../../../form-builder-v2/dialogs/email-template/EmailTemplate.Dialog';
import ButtonBase from '@mui/material/ButtonBase';
import {
  GetAllFormsTypes,
  GetAllFormTemplates,
  SendBulkManualOffer,
  SendBulkOfferReminder,
} from '../../../../../../../../../services';
import '../FormInviteManagement.Style.scss';
import { OffersMembersTabs } from './OffersMembers.Tabs';
import { preferencesAPI } from '../../../../../../../../../api/preferences';
import i18next from 'i18next';

export const OffersInviteManagementDialog = ({
  job_uuid,
  pipeline_uuid,
  job_pipeline_uuid,
  selectedCandidates,
  // selectedConfirmedStages,
  titleText,
  isOpen,
  // onSave,
  isOpenChanged,
  parentTranslationPath,
  translationPath,
  isReminder,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  // const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [membersPopoverProps, setMembersPopoverProps] = useState({});
  const [errors, setErrors] = useState(() => ({}));
  const [popoverAttachedWith, setPopoverAttachedWith] = useState({
    members: null,
  });
  const [isOpenDialogs, setIsOpenDialogs] = useState({
    emailTemplate: false,
  });
  const stateInitRef = useRef({
    invitedMember: [],
    bodyEmail: null,
    subjectEmail: null,
    attachmentsEmail: null,
    emailLanguageId: null,
    emailTemplateUUID: null,
    is_not_shareable: null,
    offer_status: OffersStatusesEnum.Draft.key,
  });
  const [offerStatuses] = useState(() =>
    Object.values(OffersStatusesEnum).map((item) => ({
      ...item,
      status: t(`Shared:${item.status}`),
    })),
  );
  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is sent new value for state from child
   */
  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: yup.object().shape({
          template_type_uuid: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          template_uuid: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          invitedMember: yup
            .array()
            .of(
              yup.object().shape({
                type: yup.number().nullable(),
                uuid: yup.string().nullable(),
                name: yup.object().nullable(),
              }),
            )
            .nullable()
            .min(
              1,
              `${t('Shared:please-select-at-least')} ${1} ${t(
                `${translationPath}member`,
              )}`,
            ),
          offer_status: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) => value || !state.is_not_shareable,
            ),
          ...(!isReminder
            && !state.is_not_shareable && {
            bodyEmail: yup
              .string()
              .nullable()
              .test(
                'isRequired',
                t(`${translationPath}email-template-error`),
                (value) => value,
              ),
            subjectEmail: yup
              .string()
              .nullable()
              .test(
                'isRequired',
                t(`${translationPath}email-template-error`),
                (value) => value,
              ),
          }),
        }),
      },
      state,
    ).then((result) => {
      setErrors(result);
    });
  }, [isReminder, state, t, translationPath]);

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

  const onAvatarDeleteClicked = useCallback(
    (index, items, key) => (event) => {
      event.preventDefault();
      event.stopPropagation();
      const localItems = [...items];
      localItems.splice(index, 1);
      setState({
        id: key,
        value: localItems,
      });
    },
    [],
  );

  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) {
      if (errors.name) showError(errors.name.message);
      return;
    }
    setIsLoading(true);
    if (isReminder) {
      const resTemplate = await preferencesAPI.getTemplateBySlug(
        'reminder_form_builder',
        i18next.language,
        job_pipeline_uuid,
      );
      const localeState = {
        subject_email: resTemplate?.data?.results?.translation?.subject,
        body_email: resTemplate?.data?.results?.translation?.body,
        attachments_email: resTemplate?.data?.results?.attachment,
        template_type_uuid: state.template_type_uuid,
        template_uuid: state.template_uuid,
        invited_member: state?.invitedMember,
        job_pipeline_uuid,
        job_uuid,
      };
      const response = await SendBulkOfferReminder(localeState);
      setIsLoading(false);
      if (response && (response.status === 201 || response.status === 200)) {
        showSuccess(t(`${translationPath}reminder-sent-successfully`));
        if (isOpenChanged) isOpenChanged();
      } else showError(t(`${translationPath}failed-to-send-reminder`), response);
    } else if (
      state?.is_not_shareable
      && state?.offer !== OffersStatusesEnum.Draft.key
    ) {
      const localeState = {
        offer_status: state?.offer_status,
        template_type_uuid: state.template_type_uuid,
        template_uuid: state.template_uuid,
        invited_member: state?.invitedMember,
        job_pipeline_uuid,
        job_uuid,
      };
      const response = await SendBulkManualOffer(localeState);
      setIsLoading(false);
      if (response && (response.status === 201 || response.status === 200)) {
        showSuccess(t(`offer-created-successfully`));
        if (isOpenChanged) isOpenChanged();
      } else showError(t(`failed-to-create-offer`), response);
    } else {
      sessionStorage.setItem(
        'bulkFormState',
        JSON.stringify({
          ...state,
          offer_status: OffersStatusesEnum.Draft.key,
        }),
      );

      GlobalHistory.push(
        `/form-builder/info?${
          job_pipeline_uuid ? `pipeline_uuid=${job_pipeline_uuid}&` : ''
        }source=${NavigationSourcesEnum.PipelineBulkToFormBuilderV1.key}&${
          job_uuid ? `job_uuid=${job_uuid}&` : ''
        }editorRole=sender&template_uuid=${state.template_uuid}&template_type_uuid=${
          state.template_type_uuid
        }
      &status=${OffersStatusesEnum.Draft.key}`,
      );
    }
  };

  /**
   * @param key
   * @param newValue - bool
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the change of is open dialog from child
   */
  const onIsOpenDialogsChanged = useCallback((key, newValue) => {
    setIsOpenDialogs((items) => ({ ...items, [key]: newValue }));
  }, []);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the data on edit
   */

  // Reshape the selected candidates JSON
  const getEditInit = useCallback(async () => {
    const localSelectedCandidates = selectedCandidates.map(
      (item) =>
        (item.bulkSelectType === PipelineBulkSelectTypesEnum.Stage.key && {
          type: OfferAssignTypesEnum.JobStage.key,
          uuid: item.stage.uuid,
          name: item.stage.title,
        }) || {
          type: OfferAssignTypesEnum.JobCandidate.key,
          uuid: item.candidate.uuid,
          stage_uuid: item.stage.uuid,
          name: item.candidate.name,
        },
    );
    setState({
      id: 'invitedMember',
      value: localSelectedCandidates,
    });
  }, [selectedCandidates]);

  useEffect(() => {
    if (selectedCandidates && selectedCandidates.length > 0) getEditInit();
  }, [selectedCandidates, getEditInit]);

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  return (
    <DialogComponent
      maxWidth="sm"
      titleText={titleText}
      contentClasses="px-0"
      dialogContent={
        <div className="form-invite-management-content-dialog-wrapper">
          <div className="box-field-wrapper">
            <div className="inline-label-wrapper">
              <span>{t(`${translationPath}selected-candidates`)}</span>
            </div>
            <div
              className="invite-box-wrapper"
              onClick={(event) => {
                setMembersPopoverProps({
                  arrayKey: 'invitedMember',
                  popoverTabs: OffersMembersTabs,
                  values: state.invitedMember,
                  getListAPIProps: ({ type }) => ({
                    job_uuid: job_uuid,
                    pipeline_uuid,
                    job_pipeline_uuid,
                    ...(type !== OfferAssignTypesEnum.JobStage.key
                      && state.invitedMember
                      && state.invitedMember.length > 0 && {
                      with_than: state.invitedMember
                        .filter((item) => item.type === type)
                        .map((item) => item.uuid),
                    }),
                  }),
                });
                popoverToggleHandler('members', event);
              }}
              onKeyUp={() => {}}
              role="button"
              tabIndex={0}
            >
              <div className="invite-box-body-wrapper">
                {state.invitedMember.map((item, index, items) => (
                  <AvatarsComponent
                    key={`invitedMembersKey${item.uuid}`}
                    avatar={item}
                    avatarImageAlt="member"
                    onTagBtnClicked={onAvatarDeleteClicked(
                      index,
                      items,
                      'invitedMember',
                    )}
                    avatarTheme={AvatarsThemesEnum.TagAvatar.theme}
                    translationPath={translationPath}
                    parentTranslationPath={parentTranslationPath}
                  />
                ))}
                <span
                  className={`c-gray-primary px-2 pb-2${
                    (state.invitedMember.length > 0 && ' mt-2') || ''
                  }`}
                >
                  {t(`${translationPath}search-members`)}
                </span>
              </div>
            </div>
          </div>
          <div className="box-field-wrapper mt-3 mb-0">
            <div className="inline-label-wrapper"></div>
            {errors.invitedMember && errors.invitedMember.error && isSubmitted && (
              <div className="c-error fz-10 mb-3 px-2">
                <span>{errors.invitedMember.message}</span>
              </div>
            )}
          </div>
          <div className="box-field-wrapper">
            <SharedAPIAutocompleteControl
              isFullWidth
              inlineLabel="template-type"
              placeholder="select-template-type"
              errors={errors}
              stateKey="template_type_uuid"
              searchKey="search"
              editValue={state.template_type_uuid}
              // isDisabled={isLoading}
              isSubmitted={isSubmitted}
              onValueChanged={(newValue) => {
                if (state.template_uuid)
                  onStateChanged({
                    id: 'template_uuid',
                    value: null,
                  });

                onStateChanged({
                  ...newValue,
                  value: newValue.value || null,
                });
              }}
              translationPath={translationPath}
              getDataAPI={GetAllFormsTypes}
              parentTranslationPath={parentTranslationPath}
              errorPath="template_type_uuid"
              filterOptions={(options) =>
                options.filter(
                  (item) => item.code !== DefaultFormsTypesEnum.Flows.key,
                )
              }
              getOptionLabel={(option) => option.name || 'N/A'}
              // extraProps={{
              //   // is_not_shareable: code ? undefined : true,
              //   code: state.code,
              // }}
            />
          </div>
          {state.template_type_uuid && (
            <div className="box-field-wrapper">
              <SharedAPIAutocompleteControl
                isFullWidth
                inlineLabel="template"
                isEntireObject
                placeholder="select-template"
                errors={errors}
                stateKey="template_uuid"
                searchKey="search"
                editValue={state.template_uuid}
                // isDisabled={isLoading}
                isSubmitted={isSubmitted}
                onValueChanged={(newValue) => {
                  onStateChanged({
                    id: 'is_not_shareable',
                    value: newValue.value ? newValue.value.is_not_shareable : null,
                  });
                  if (newValue?.value?.is_not_shareable)
                    onStateChanged({
                      id: 'destructObject',
                      value: {
                        // invitedMember: [],
                        bodyEmail: null,
                        subjectEmail: null,
                        attachmentsEmail: null,
                        emailLanguageId: null,
                        emailTemplateUUID: null,
                      },
                    });

                  onStateChanged({
                    ...newValue,
                    value: (newValue.value && newValue.value.uuid) || null,
                  });
                }}
                translationPath={translationPath}
                getDataAPI={GetAllFormTemplates}
                parentTranslationPath={parentTranslationPath}
                errorPath="template_uuid"
                getOptionLabel={(option) => option.title || 'N/A'}
                optionComponent={(renderProps, option) => (
                  <li {...renderProps} key={option['uuid']}>
                    <span>
                      <span>{option.title || 'N/A'}</span>
                      {!option.is_not_shareable && (
                        <span className="px-1">
                          ({t(`${translationPath}shareable`)})
                        </span>
                      )}
                    </span>
                  </li>
                )}
                extraProps={{
                  status: true,
                  use_for: 'dropdown',
                  form_type_uuid: state.template_type_uuid,
                  all: true,
                  ...(isReminder && {
                    all: false,
                    is_not_shareable: false,
                  }),
                }}
              />
            </div>
          )}
          {state.template_type_uuid && state?.is_not_shareable && (
            <div className="box-field-wrapper">
              <SharedAutocompleteControl
                isFullWidth
                errors={errors}
                searchKey="search"
                initValuesKey="key"
                isDisabled={isLoading}
                initValuesTitle="status"
                isSubmitted={isSubmitted}
                initValues={offerStatuses}
                stateKey="offer_status"
                errorPath="offer_status"
                onValueChanged={onStateChanged}
                inlineLabel="status"
                editValue={state.offer_status}
                placeholder="status"
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                getOptionLabel={(option) => option.status}
              />
            </div>
          )}
          {!isReminder && !state?.is_not_shareable && state?.template_uuid && (
            <div className="box-field-wrapper">
              <div className="inline-label-wrapper">
                <span>{t(`${translationPath}invitation-email-template`)}</span>
              </div>
              <div>
                <ButtonBase
                  className="btns theme-transparent"
                  onClick={() => {
                    onIsOpenDialogsChanged('emailTemplate', true);
                  }}
                >
                  <span className="fas fa-cog" />
                  <span className="mx-2">
                    {t(`${translationPath}manage-template`)}
                  </span>
                </ButtonBase>
                {isSubmitted && errors && errors['bodyEmail'] && (
                  <div className="c-error fz-10 px-2 my-2">
                    <span>{errors['bodyEmail'].message}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {popoverAttachedWith.members && (
            <FormMembersPopover
              {...membersPopoverProps}
              popoverAttachedWith={popoverAttachedWith.members}
              handleClose={() => {
                popoverToggleHandler('members', null);
                setMembersPopoverProps(null);
              }}
              onSave={(newValues) => {
                const localNewValues = { ...newValues };
                const localState = { ...state };
                if (membersPopoverProps.arrayKey === 'invitedMember') {
                  localState.invitedMember = [];
                  if (
                    localNewValues.invitedMember.length
                      === state.invitedMember.length
                    && !localNewValues.invitedMember.some((item) =>
                      state.invitedMember.some(
                        (element) => element.uuid !== item.uuid,
                      ),
                    )
                  )
                    return;
                }
                setState({
                  id: 'destructObject',
                  value: {
                    ...localState,
                    ...localNewValues,
                  },
                });
              }}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {isOpenDialogs.emailTemplate && (
            <EmailTemplateDialog
              editValue={
                (state.bodyEmail || state.subjectEmail) && {
                  bodyEmail: state.bodyEmail,
                  subjectEmail: state.subjectEmail,
                  attachmentsEmail: state.attachmentsEmail,
                  emailLanguageId: state.emailLanguageId,
                  emailTemplateUUID: state.emailTemplateUUID,
                }
              }
              isOpen={isOpenDialogs.emailTemplate}
              isOpenChanged={() => {
                onIsOpenDialogsChanged('emailTemplate', false);
              }}
              onSave={(newValues) => {
                setState({
                  id: 'destructObject',
                  value: newValues,
                });
              }}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
            />
          )}
        </div>
      }
      wrapperClasses="form-invite-management-dialog-wrapper"
      isSaving={isLoading}
      isOpen={isOpen}
      saveText={isReminder ? 'send' : 'save-and-continue'}
      onSubmit={saveHandler}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

OffersInviteManagementDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  job_uuid: PropTypes.string.isRequired,
  pipeline_uuid: PropTypes.string.isRequired,
  job_pipeline_uuid: PropTypes.string.isRequired,
  // selectedConfirmedStages: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedCandidates: PropTypes.arrayOf(
    PropTypes.shape({
      stage: PropTypes.instanceOf(Object),
      candidate: PropTypes.instanceOf(Object),
      bulkSelectType: PropTypes.number,
    }),
  ).isRequired,
  // onSave: PropTypes.func,
  titleText: PropTypes.string,
  isReminder: PropTypes.bool,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
};
OffersInviteManagementDialog.defaultProps = {
  titleText: 'send-offer',
  invited_members: [],
  parentTranslationPath: 'FormBuilderPage',
  translationPath: '',
};
