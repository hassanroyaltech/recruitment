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
import {
  SetupsReducer,
  SetupsReset,
  SharedAPIAutocompleteControl,
} from '../../../../../../../setups/shared';
import {
  getErrorByName,
  GlobalHistory,
  showError,
} from '../../../../../../../../helpers';
import * as yup from 'yup';
import {
  AvatarsComponent,
  DialogComponent,
} from '../../../../../../../../components';
import {
  AvatarsThemesEnum,
  DefaultFormsTypesEnum,
  FormsAssignTypesEnum,
  FormsMembersTypesEnum,
  NavigationSourcesEnum,
  PipelineBulkSelectTypesEnum,
} from '../../../../../../../../enums';
import FormMembersPopover from '../../../../../../../form-builder-v2/popovers/FormMembers.Popover';
import EmailTemplateDialog from '../../../../../../../form-builder-v2/dialogs/email-template/EmailTemplate.Dialog';
import ButtonBase from '@mui/material/ButtonBase';
import {
  GetAllBuilderTemplates,
  GetBuilderFormTypes,
} from '../../../../../../../../services';
import './FormInviteManagement.Style.scss';
import { FormAssignTabs } from '../../../../../../../form-builder-v2/tabs-data/FormAssign.Tabs';
import { FormInvitedMembersTabs } from '../../../../../../../form-builder-v2/tabs-data/FormInvitedMembers.Tabs';

export const FormInviteManagementDialog = ({
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
}) => {
  const { t } = useTranslation(parentTranslationPath);
  // const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [membersPopoverProps, setMembersPopoverProps] = useState({});
  const [errors, setErrors] = useState(() => ({}));
  const [popoverAttachedWith, setPopoverAttachedWith] = useState({
    members: null,
    directories: null,
  });
  const [isOpenDialogs, setIsOpenDialogs] = useState({
    emailTemplate: false,
  });
  const stateInitRef = useRef({
    assign: [],
    invitedMember: [],
    bodyEmail: null,
    subjectEmail: null,
    attachmentsEmail: null,
    emailLanguageId: null,
    emailTemplateUUID: null,
    is_with_recipient: null,
  });
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

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get if the email template is required
   */
  const getIsWithEmailTemplate = useMemo(
    () =>
      state.invitedMember.some(
        (item) =>
          item.type === FormsMembersTypesEnum.Candidates.key
          || item.type === FormsMembersTypesEnum.Stages.key,
      ),
    [state.invitedMember],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get form errors
   */
  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: yup.object().shape({
          is_with_recipient: yup.bool().nullable(),
          assign: yup
            .array()
            .of(
              yup.object().shape({
                type: yup.number().nullable(),
                uuid: yup.string().nullable(),
                name: yup.string().nullable(),
              }),
            )
            .nullable()
            .min(
              1,
              `${t('Shared:please-select-at-least')} ${1} ${t(
                `${translationPath}candidate`,
              )}`,
            ),
          code: yup.string().nullable().required(t('Shared:this-field-is-required')),
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
            .when(
              'is_with_recipient',
              (value, field) =>
                (value
                  && field.min(
                    1,
                    `${t('Shared:please-select-at-least')} ${1} ${t(
                      `${translationPath}member`,
                    )}`,
                  ))
                || field,
            ),
          bodyEmail: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t(`${translationPath}email-template-error`),
              (value) => value || !getIsWithEmailTemplate,
            ),
          subjectEmail: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t(`${translationPath}email-template-error`),
              (value) => value || !getIsWithEmailTemplate,
            ),
        }),
      },
      state,
    ).then((result) => {
      setErrors(result);
    });
  }, [getIsWithEmailTemplate, state, t, translationPath]);

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

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the deleted for one of the avatar items like invitedMembers
   */
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

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle saving
   */
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) {
      if (errors.name) showError(errors.name.message);
      return;
    }
    sessionStorage.setItem('bulkFormState', JSON.stringify(state));
    GlobalHistory.push(
      `/forms?${
        job_pipeline_uuid ? `pipeline_uuid=${job_pipeline_uuid}&` : ''
      }source=${NavigationSourcesEnum.PipelineBulkToFormBuilder.key}&${
        job_uuid ? `job_uuid=${job_uuid}&` : ''
      }editor_role=sender&template_uuid=${state.template_uuid}&code=${state.code}`,
    );
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
  const getEditInit = useCallback(async () => {
    const assignCandidates = selectedCandidates.map(
      (item) =>
        (item.bulkSelectType === PipelineBulkSelectTypesEnum.Stage.key && {
          type: FormsAssignTypesEnum.JobStage.key,
          uuid: item.stage.uuid,
          name: item.stage.title,
        }) || {
          type: FormsAssignTypesEnum.JobCandidate.key,
          uuid: item.candidate.uuid,
          stage_uuid: item.stage.uuid,
          name: item.candidate.name,
        },
    );
    setState({
      id: 'assign',
      value: assignCandidates,
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
                  arrayKey: 'assign',
                  popoverTabs: FormAssignTabs,
                  values: state.assign,
                  getListAPIProps: ({ type }) => ({
                    job_uuid: job_uuid,
                    pipeline_uuid,
                    job_pipeline_uuid,
                    ...(type !== FormsAssignTypesEnum.JobStage.key
                      && state.assign
                      && state.assign.length > 0 && {
                      with_than: state.assign
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
                {state.assign.map((item, index, items) => (
                  <AvatarsComponent
                    key={`assignKey${item.uuid}`}
                    avatar={item}
                    avatarImageAlt="member"
                    onTagBtnClicked={onAvatarDeleteClicked(index, items, 'assign')}
                    avatarTheme={AvatarsThemesEnum.TagAvatar.theme}
                    translationPath={translationPath}
                    parentTranslationPath={parentTranslationPath}
                  />
                ))}
                <span
                  className={`c-gray-primary px-2 pb-2${
                    (state.assign.length > 0 && ' mt-2') || ''
                  }`}
                >
                  {t(`${translationPath}search-candidates`)}
                </span>
              </div>
            </div>
          </div>
          <div className="box-field-wrapper">
            <SharedAPIAutocompleteControl
              isFullWidth
              inlineLabel="form-type"
              placeholder="select-form-type"
              errors={errors}
              stateKey="code"
              searchKey="search"
              editValue={state.code}
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
              getDataAPI={GetBuilderFormTypes}
              parentTranslationPath={parentTranslationPath}
              errorPath="code"
              uniqueKey="code"
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
          {state.code && (
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
                    id: 'is_with_recipient',
                    value: newValue.value ? newValue.value.is_with_recipient : null,
                  });
                  if (!newValue.value || !newValue.value.is_with_recipient)
                    onStateChanged({
                      id: 'destructObject',
                      value: {
                        invitedMember: [],
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
                getDataAPI={GetAllBuilderTemplates}
                parentTranslationPath={parentTranslationPath}
                errorPath="template_uuid"
                getOptionLabel={(option) => option.title || 'N/A'}
                optionComponent={(renderProps, option) => (
                  <li {...renderProps} key={option['uuid']}>
                    <span>
                      <span>{option.title || 'N/A'}</span>
                      {option.is_with_recipient && (
                        <span className="px-1">
                          ({t(`${translationPath}shareable`)})
                        </span>
                      )}
                    </span>
                  </li>
                )}
                extraProps={{
                  // is_not_shareable: code ? undefined : true,
                  code: state.code,
                }}
              />
            </div>
          )}
          {state.is_with_recipient && state.template_uuid && (
            <div className="box-field-wrapper">
              <div className="inline-label-wrapper">
                <span>{t(`${translationPath}invited-members`)}</span>
              </div>
              <div
                className="invite-box-wrapper"
                onClick={(event) => {
                  setMembersPopoverProps({
                    arrayKey: 'invitedMember',
                    values: state.invitedMember,
                    popoverTabs: FormInvitedMembersTabs,
                    getPropsByType: ({ type }) =>
                      ((type === FormsMembersTypesEnum.Candidates.key
                        || type === FormsMembersTypesEnum.Stages.key) && {
                        isWithThanOnly: true,
                      })
                      || {},
                    getListAPIProps: ({ type }) => ({
                      job_uuid,
                      pipeline_uuid,
                      job_pipeline_uuid,
                      ...(type === FormsMembersTypesEnum.Employees.key && {
                        all_employee: 1,
                      }),
                      ...(type === FormsMembersTypesEnum.Candidates.key
                      || FormsMembersTypesEnum.Stages.key
                        ? {
                          with_than: state.assign
                            .filter(
                              (item) =>
                                type !== FormsMembersTypesEnum.Candidates.key
                                  || item.type
                                    === FormsAssignTypesEnum.JobCandidate.key,
                            )
                            .map((item) => item.uuid),
                        }
                        : state.invitedMember
                          && state.invitedMember.filter((item) => item.type === type)
                            .length > 0 && {
                          with_than: state.invitedMember
                            .filter((item) => item.type === type)
                            .map((item) => item.uuid),
                        }),
                    }),
                    // dropdownsProps: {
                    //   job_uuid: job_uuid,
                    //   job_pipeline_uuid,
                    //   // stage_uuid: state.extraQueries.stageUUID,
                    //   selected_candidates: state.invitedMember.map(
                    //     (item) => item.uuid
                    //   ),
                    // },
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
          )}
          <div className="box-field-wrapper mt--3 mb-0">
            <div className="inline-label-wrapper"></div>
            {errors.invitedMember && errors.invitedMember.error && isSubmitted && (
              <div className="c-error fz-10 mb-3 px-2">
                <span>{errors.invitedMember.message}</span>
              </div>
            )}
          </div>
          {getIsWithEmailTemplate && (
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
                if (membersPopoverProps.arrayKey === 'assign') {
                  localState.invitedMember = [];
                  if (
                    localNewValues.assign.length === state.assign.length
                    && !localNewValues.assign.some((item) =>
                      state.assign.some((element) => element.uuid !== item.uuid),
                    )
                  )
                  // this code is to add the new assign also for invited member

                    // this condition is to return if no change made
                    return;
                }

                // const newInvitedUsers = localNewValues.assign
                //   .filter(
                //     (item) =>
                //       !state.invitedMember.some(
                //         (element) => element.uuid === item.uuid
                //       )
                //   )
                //   .map((element) => ({
                //     ...element,
                //     type: FormsMembersTypesEnum.Candidates.key,
                //   }));
                // localState.invitedMember.push(...newInvitedUsers);
                // localState.invitedMember = localState.invitedMember.filter(
                //   (item) =>
                //     item.type !== FormsMembersTypesEnum.Candidates.key
                //     || localNewValues.assign.some(
                //       (element) => element.uuid === item.uuid
                //     )
                // );

                setState({
                  id: 'destructObject',
                  value: {
                    ...localState,
                    ...localNewValues,
                  },
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
      // isSaving={isLoading}
      isOpen={isOpen}
      saveText="save-and-continue"
      onSubmit={saveHandler}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

FormInviteManagementDialog.propTypes = {
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
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
};
FormInviteManagementDialog.defaultProps = {
  titleText: 'send-form',
  invited_members: [],
  parentTranslationPath: 'FormBuilderPage',
  translationPath: '',
};
