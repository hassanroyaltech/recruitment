import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  SetupsReducer,
  SetupsReset,
  SharedAPIAutocompleteControl,
} from '../../../setups/shared';
import {
  getErrorByName,
  GlobalDateFormat,
  showError,
  showSuccess,
} from '../../../../helpers';
import * as yup from 'yup';
import {
  CreateOnboardingInvite,
  GetAllActiveJobs,
  GetJobById,
  GetOnboardingFolderById,
  GetOnboardingSpaceById,
} from '../../../../services';
import { AvatarsComponent, DialogComponent } from '../../../../components';
import {
  AvatarsThemesEnum,
  FormsMembersTypesEnum,
  InviteToOnboardingMembersTypesEnum,
  OnboardingTeamsTypesEnum,
  OnboardingTypesEnum,
} from '../../../../enums';
import FormMembersPopover from '../../../form-builder-v2/popovers/FormMembers.Popover';
import './InviteManagement.Style.scss';
import DirectoriesPopover from '../../popovers/directories/Directories.Popover';
import ButtonBase from '@mui/material/ButtonBase';
import moment from 'moment';
import i18next from 'i18next';
import DatePickerComponent from '../../../../components/Datepicker/DatePicker.Component';
import { FormInviteTabsData } from './tabs-data/FormInvite.TabsData';
import { VitallyTrack } from '../../../../utils/Vitally';
import { useSelector } from 'react-redux';
import { MoveToManagementTabsData } from '../../../evarec/pipelines/managements/pipeline/sections/pipeline-header/dialogs/move-to-management/tabs-data/MoveToManagement.TabsData';
import EmailTemplateDialog from '../../../form-builder-v2/dialogs/email-template/EmailTemplate.Dialog';

const InviteManagementDialog = ({
  space_uuid,
  folder_uuid,
  invited_members,
  titleText,
  isOpen,
  onSave,
  isOpenChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const selectedBranchReducer = useSelector((state) => state?.selectedBranchReducer);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState(() => ({}));
  const [popoverAttachedWith, setPopoverAttachedWith] = useState({
    members: null,
    directories: null,
  });
  const stateInitRef = useRef({
    space_uuid: (space_uuid && [space_uuid]) || [],
    folder_uuid: (folder_uuid && [folder_uuid]) || [],
    flow_uuid: [],
    directoriesDetails: [],
    invited_members,
    join_date: null,
    start_date: null,
    message: null,
    job_uuid: null,
    recruiter: [],
  });
  const [isOpenDialogs, setIsOpenDialogs] = useState({
    emailTemplate: false,
  });
  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );
  const [membersPopoverProps, setMembersPopoverProps] = useState({});
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
   * @Description this method is to get form errors
   */
  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: yup.object().shape({
          space_uuid: yup
            .array()
            .nullable()
            .test(
              'isRequired',
              `${t('Shared:please-select-at-least')} ${1} ${t('directory')}`,
              (value, { parent }) =>
                (value && value.length > 0)
                || (parent.folder_uuid && parent.folder_uuid.length > 0)
                || (parent.flow_uuid && parent.flow_uuid.length > 0),
            ),
          folder_uuid: yup.array().nullable(),
          flow_uuid: yup.array().nullable(),
          invited_members: yup
            .array()
            .of(
              yup.object().shape({
                type: yup.number().nullable(),
                uuid: yup.string().nullable(),
              }),
            )
            .nullable()
            .min(1, `${t('Shared:please-select-at-least')} ${1} ${t('member')}`),

          start_date: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          join_date: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          job_uuid: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          recruiter: yup
            .array()
            .nullable()
            .min(1, t('Shared:this-field-is-required')),
          message: yup.string().nullable(),
          bodyEmail: yup
            .string()
            .nullable()
            .required(t(`Shared:this-field-is-required`)),
          subjectEmail: yup
            .string()
            .nullable()
            .required(t(`Shared:this-field-is-required`)),
        }),
      },
      state,
    ).then((result) => {
      setErrors(result);
    });
  }, [state, t]);

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
  const onIsOpenDialogsChanged = useCallback((key, newValue) => {
    setIsOpenDialogs((items) => ({ ...items, [key]: newValue }));
  }, []);
  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the deleted of the directory
   */
  const onDirectoryDeleteClicked = useCallback(
    (index, item, items, localState) => (event) => {
      event.preventDefault();
      event.stopPropagation();
      const localItems = [...items];
      const currentState = { ...localState };
      const stateKey
        = (item.type === OnboardingTypesEnum.Spaces.key && 'space_uuid')
        || (item.type === OnboardingTypesEnum.Folders.key && 'folder_uuid')
        || 'flow_uuid';
      const directoryArrayIndex = currentState[stateKey].indexOf(item.uuid);
      if (directoryArrayIndex !== -1) {
        currentState[stateKey].splice(directoryArrayIndex, 1);
        setState({
          id: stateKey,
          value: currentState[stateKey],
        });
      }
      localItems.splice(index, 1);
      setState({
        id: 'directoriesDetails',
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
    setIsLoading(true);
    let localState = { ...state, onboarding_teams: {} };
    Object.values(OnboardingTeamsTypesEnum).forEach((item) => {
      localState.onboarding_teams[item.key] = (state?.[item.key] || []).map(
        (el) => el.value,
      );
    });
    localState.attachments_email = state.attachmentsEmail;
    localState.body_email = state.bodyEmail;
    localState.email_language_id = state.emailLanguageId;
    localState.email_template_uuid = state.emailTemplateUUID;
    localState.subject_email = state.subjectEmail;
    const response = await CreateOnboardingInvite(localState);
    setIsLoading(false);
    if (response && response.status === 200) {
      if (
        (state?.invited_members || []).some(
          (item) => item?.type === FormsMembersTypesEnum.Candidates.key,
        )
      ) {
        VitallyTrack('Onboarding - Invite Candidate to onboarding');
        window?.ChurnZero?.push([
          'trackEvent',
          'Onboarding - Move candidate to flow',
          'Move candidate to flow',
          1,
          {},
        ]);
      }
      showSuccess(t(`${translationPath}invitation-created-successfully`));
      if (onSave) onSave();
      if (isOpenChanged) isOpenChanged();
    } else showError(t(`${translationPath}invitation-create-failed`), response);
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the current selected space and/or folder details
   */
  const getActiveConnections = useCallback(
    async ({ querySpace, queryFolder }) => {
      const promises = [];
      const localDirectoriesDetails = [];
      if (querySpace) promises.push(GetOnboardingSpaceById({ uuid: querySpace }));
      if (queryFolder) promises.push(GetOnboardingFolderById({ uuid: queryFolder }));
      setIsLoading(true);
      const response = await Promise.all(promises);
      setIsLoading(false);
      if (response && response.some((item) => item.status === 200)) {
        const successResults = response.filter((item) => item.status === 200);
        successResults.map((item) => {
          if (item.data.results.uuid === querySpace)
            localDirectoriesDetails.push({
              ...item.data.results,
              type: OnboardingTypesEnum.Spaces.key,
              uuid: item.data.results.uuid,
              name: item.data.results.title,
            });
          else
            localDirectoriesDetails.push({
              ...item.data.results,
              type: OnboardingTypesEnum.Folders.key,
              uuid: item.data.results.uuid,
              name: item.data.results.title,
            });
          return undefined;
        });
        if (successResults.length === promises.length)
          setState({
            id: 'directoriesDetails',
            value: localDirectoriesDetails,
          });
        if (successResults.length !== promises.length) {
          response
            .filter((item) => item.status !== 200)
            .map((item) => showError(t('Shared:failed-to-get-saved-data'), item));
          isOpenChanged();
        }
      } else {
        showError(t('Shared:failed-to-get-saved-data'));
        isOpenChanged();
      }
    },
    [isOpenChanged, t],
  );
  const onActiveJobChange = useCallback(
    async (job_uuid, invitedMembers) => {
      const localeValue = {
        job_uuid,
      };
      Object.values(OnboardingTeamsTypesEnum).forEach((item) => {
        localeValue[item.key] = [];
      });
      if (
        (invitedMembers || []).some(
          (item) => item?.type === FormsMembersTypesEnum.Candidates.key,
        )
      )
        localeValue.invited_members = invitedMembers.filter(
          (item) => item.type !== FormsMembersTypesEnum.Candidates.key,
        );

      setState({
        id: 'destructObject',
        value: localeValue,
      });
      setIsLoading(true);
      const response = await GetJobById({
        job_uuid,
        company_uuid: selectedBranchReducer.uuid,
      });
      setIsLoading(false);
      if (response.status === 200) {
        const onboardingTeams = response.data?.results?.job?.onboarding_teams;
        if (onboardingTeams) {
          let localeTeams = {};
          Object.values(OnboardingTeamsTypesEnum).forEach((item) => {
            localeTeams[item.key] = (onboardingTeams?.[item.key] || []).map(
              (el) => ({
                ...el,
                value: el.uuid,
                type: InviteToOnboardingMembersTypesEnum.UsersAndEmployees.type,
              }),
            );
          });
          setState({ id: 'destructObject', value: localeTeams });
        }
      }
    },
    [selectedBranchReducer.uuid],
  );
  useEffect(() => {
    if (space_uuid || folder_uuid)
      getActiveConnections({
        querySpace: space_uuid,
        queryFolder: folder_uuid,
      });
  }, [folder_uuid, getActiveConnections, space_uuid]);

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);
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

  return (
    <DialogComponent
      maxWidth="sm"
      titleText={titleText}
      contentClasses="px-0"
      dialogContent={
        <div className="invite-management-content-dialog-wrapper">
          <div className="box-field-wrapper">
            <div className="inline-label-wrapper">
              <span>{t(`${translationPath}job`)}</span>
            </div>
            <SharedAPIAutocompleteControl
              isFullWidth
              editValue={state.job_uuid}
              disableClearable={true}
              placeholder="select-job"
              title="job"
              stateKey="job_uuid"
              getOptionLabel={(option) => option.title}
              searchKey="search"
              getDataAPI={GetAllActiveJobs}
              extraProps={{
                ...(state.job_uuid && {
                  with_than: [state.job_uuid],
                }),
              }}
              dataKey="jobs"
              controlWrapperClasses="px-2"
              errorPath={'job_uuid'}
              isSubmitted={isSubmitted}
              errors={errors}
              onValueChanged={(newValue) =>
                onActiveJobChange(newValue.value, state.invited_members)
              }
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          </div>
          <div className="box-field-wrapper">
            <div className="inline-label-wrapper">
              <span>{t(`${translationPath}members`)}</span>
            </div>
            <div
              className="invite-box-wrapper"
              onClick={(event) => {
                if (!state.job_uuid || isLoading) return;
                setMembersPopoverProps({
                  arrayKey: 'invited_members',
                  popoverTabs: FormInviteTabsData,
                  values: state.invited_members,
                  jobUUID: state.job_uuid,
                  getListAPIProps: ({ type }) => ({
                    ...(type === FormsMembersTypesEnum.Employees.key && {
                      all_employee: 1,
                    }),
                    ...(type === FormsMembersTypesEnum.Candidates.key && {
                      only_with_than: false,
                    }),
                    ...(state.invited_members
                      && state.invited_members.length > 0 && {
                      with_than: state.invited_members
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
                {state.invited_members.map((item, index, items) => (
                  <AvatarsComponent
                    key={`invitedMembersKey${item.uuid}`}
                    avatar={item}
                    avatarImageAlt="member"
                    onTagBtnClicked={onAvatarDeleteClicked(
                      index,
                      items,
                      'invited_members',
                    )}
                    avatarTheme={AvatarsThemesEnum.TagAvatar.theme}
                    translationPath={translationPath}
                    parentTranslationPath={parentTranslationPath}
                  />
                ))}
                <span
                  className={`c-gray-primary px-2${
                    (state.invited_members.length > 0 && ' mt-2') || ''
                  }`}
                >
                  {state.job_uuid
                    ? t(`${translationPath}search-member`)
                    : t(`${translationPath}select-job-first`)}
                </span>
              </div>
            </div>
          </div>
          <div className="box-field-wrapper mt--3 mb-0">
            <div className="inline-label-wrapper"></div>
            {errors.invited_members
              && errors.invited_members.error
              && isSubmitted && (
              <div className="c-error fz-10 mb-3 px-2">
                <span>{errors.invited_members.message}</span>
              </div>
            )}
          </div>
          <div className="box-field-wrapper">
            <div className="inline-label-wrapper">
              <span>{t(`${translationPath}move-to`)}</span>
            </div>
            <div
              className="invite-box-wrapper"
              onClick={(event) => popoverToggleHandler('directories', event)}
              onKeyUp={() => {}}
              role="button"
              tabIndex={0}
            >
              <div className="invite-box-body-wrapper">
                {state.directoriesDetails.map((item, index, items) => (
                  <AvatarsComponent
                    key={`invitedDirectoryKey${item.uuid}`}
                    avatar={item}
                    avatarImageAlt="directory"
                    onTagBtnClicked={onDirectoryDeleteClicked(
                      index,
                      item,
                      items,
                      state,
                    )}
                    avatarTheme={AvatarsThemesEnum.TagAvatar.theme}
                    translationPath={translationPath}
                    parentTranslationPath={parentTranslationPath}
                  />
                ))}
                <span
                  className={`c-gray-primary px-2${
                    (state.directoriesDetails.length > 0 && ' mt-2') || ''
                  }`}
                >
                  {t(`${translationPath}search-directory`)}
                </span>
              </div>
            </div>
          </div>
          <div className="box-field-wrapper mt--3 mb-0">
            <div className="inline-label-wrapper"></div>
            {errors.space_uuid && errors.space_uuid.error && isSubmitted && (
              <div className="c-error fz-10 mb-3 px-2">
                <span>{errors.space_uuid.message}</span>
              </div>
            )}
          </div>

          <div className="box-field-wrapper">
            <div className="inline-label-wrapper">
              <span>{t(`${translationPath}start-onboarding-from`)}</span>
            </div>
            <DatePickerComponent
              isFullWidth
              inputPlaceholder={`${t('Shared:eg')} ${moment()
                .locale(i18next.language)
                .format(GlobalDateFormat)}`}
              value={state.start_date || ''}
              errors={errors}
              isSubmitted={isSubmitted}
              displayFormat={GlobalDateFormat}
              disableMaskedInput
              fieldClasses="px-2"
              errorPath="start_date"
              stateKey="start_date"
              disablePast
              onDelayedChange={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          </div>

          <div className="box-field-wrapper mt--3 mb-3">
            <div className="inline-label-wrapper"></div>
            <div className="description-text c-gray px-2">
              <span>{t(`${translationPath}start-onboarding-from-description`)}</span>
            </div>
          </div>
          {Object.values(OnboardingTeamsTypesEnum).map((el) => (
            <React.Fragment key={el.key}>
              <div className="box-field-wrapper">
                <div className="inline-label-wrapper">
                  <span>{t(`${translationPath}${el.value}`)}</span>
                </div>
                <div
                  className="invite-box-wrapper"
                  onClick={(event) => {
                    if (!state.job_uuid || isLoading) return;
                    setMembersPopoverProps({
                      arrayKey: el.key,
                      popoverTabs: MoveToManagementTabsData,
                      values: state[el.key],
                      getListAPIProps: ({ type }) => ({
                        // job_uuid: jobUUID,
                        // pipeline_uuid: jobPipelineUUID,
                        // job_pipeline_uuid: jobPipelineUUID,
                        ...(state[el.key]
                          && state[el.key].length > 0 && {
                          with_than: state[el.key]
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
                    {(state[el.key] || []).map((item, index, items) => (
                      <AvatarsComponent
                        key={`${el.key}Key${item.value}`}
                        avatar={item}
                        avatarImageAlt="member"
                        onTagBtnClicked={onAvatarDeleteClicked(index, items, el.key)}
                        avatarTheme={AvatarsThemesEnum.TagAvatar.theme}
                        translationPath={translationPath}
                        parentTranslationPath={parentTranslationPath}
                      />
                    ))}
                    <span
                      className={`c-gray-primary px-2 pb-2${
                        (state?.[el.key]?.length > 0 && ' mt-2') || ''
                      }`}
                    >
                      {state.job_uuid
                        ? t(`${translationPath}search`)
                        : t(`${translationPath}select-job-first`)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="box-field-wrapper mt--3 mb-0">
                <div className="inline-label-wrapper"></div>
                {errors[el.key] && errors[el.key].error && isSubmitted && (
                  <div className="c-error fz-10 mb-3 px-2">
                    <span>{errors[el.key].message}</span>
                  </div>
                )}
              </div>
            </React.Fragment>
          ))}
          <div className="box-field-wrapper">
            <div className="inline-label-wrapper">
              <span>{t(`${translationPath}date-joined`)}</span>
            </div>
            <DatePickerComponent
              isFullWidth
              inputPlaceholder={`${t('Shared:eg')} ${moment()
                .locale(i18next.language)
                .format(GlobalDateFormat)}`}
              value={state.join_date || ''}
              errors={errors}
              isSubmitted={isSubmitted}
              displayFormat={GlobalDateFormat}
              disableMaskedInput
              fieldClasses="px-2"
              errorPath="join_date"
              stateKey="join_date"
              disablePast
              onDelayedChange={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          </div>
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
          {/*<div className="px-2">*/}
          {/*  <ButtonBase*/}
          {/*    className="btns theme-transparent w-100 my-3 fj-start"*/}
          {/*    onClick={() => setIsOpenCollapse((item) => !item)}*/}
          {/*  >*/}
          {/*    <span>{t(`${translationPath}optional`)}</span>*/}
          {/*    <span*/}
          {/*      className={`px-2 fas fa-chevron-${*/}
          {/*        (isOpenCollapse && 'up') || 'down'*/}
          {/*      }`}*/}
          {/*    />*/}
          {/*  </ButtonBase>*/}
          {/*</div>*/}
          {/*<CollapseComponent*/}
          {/*  isOpen={isOpenCollapse}*/}
          {/*  wrapperClasses="w-100"*/}
          {/*  component={*/}
          {/*    <div className="invite-collapse-content-wrapper">*/}
          {/*      <div className="box-field-wrapper">*/}
          {/*        <div className="inline-label-wrapper">*/}
          {/*          <span>{t(`${translationPath}message`)}</span>*/}
          {/*        </div>*/}
          {/*        <SharedInputControl*/}
          {/*          placeholder="message-description"*/}
          {/*          isFullWidth*/}
          {/*          editValue={state.message}*/}
          {/*          isDisabled={isLoading}*/}
          {/*          isSubmitted={isSubmitted}*/}
          {/*          errors={errors}*/}
          {/*          errorPath="message"*/}
          {/*          stateKey="message"*/}
          {/*          onValueChanged={onStateChanged}*/}
          {/*          multiline*/}
          {/*          rows={4}*/}
          {/*          parentTranslationPath={parentTranslationPath}*/}
          {/*          translationPath={translationPath}*/}
          {/*        />*/}
          {/*      </div>*/}
          {/*    </div>*/}
          {/*  }*/}
          {/*/>*/}
          {popoverAttachedWith.members && (
            <FormMembersPopover
              {...membersPopoverProps}
              popoverAttachedWith={popoverAttachedWith.members}
              handleClose={() => {
                popoverToggleHandler('members', null);
              }}
              onSave={(newValue) => {
                onStateChanged({
                  id: 'destructObject',
                  value: {
                    ...newValue,
                  },
                });
              }}
            />
          )}
          {/*isLoading is to prevent open the popover before finishing loading for selected space and/or folder from parent*/}
          {popoverAttachedWith.directories && !isLoading && (
            <DirectoriesPopover
              arrayKey="directoriesDetails"
              values={state.directoriesDetails}
              popoverAttachedWith={popoverAttachedWith.directories}
              handleClose={() => {
                popoverToggleHandler('directories', null);
              }}
              onSave={(newValue) => {
                const localSpaces = newValue.directoriesDetails
                  .filter((item) => item.type === OnboardingTypesEnum.Spaces.key)
                  .map((item) => item.uuid);
                const localFolders = newValue.directoriesDetails
                  .filter((item) => item.type === OnboardingTypesEnum.Folders.key)
                  .map((item) => item.uuid);
                const localFlows = newValue.directoriesDetails
                  .filter((item) => item.type === OnboardingTypesEnum.Flows.key)
                  .map((item) => item.uuid);

                onStateChanged({
                  id: 'destructObject',
                  value: {
                    space_uuid: localSpaces,
                    folder_uuid: localFolders,
                    flow_uuid: localFlows,
                    directoriesDetails: newValue.directoriesDetails,
                  },
                });
              }}
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
              slug="onb_inviting_candidate_to_onboarding"
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
      wrapperClasses="invite-management-dialog-wrapper"
      isSaving={isLoading}
      isOpen={isOpen}
      onSubmit={saveHandler}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

InviteManagementDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
  titleText: PropTypes.string,
  isOpenChanged: PropTypes.func.isRequired,
  space_uuid: PropTypes.string,
  folder_uuid: PropTypes.string,
  invited_members: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(
        Object.values(FormsMembersTypesEnum).map((item) => item.key),
      ),
      uuid: PropTypes.string,
    }),
  ),
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
};
InviteManagementDialog.defaultProps = {
  titleText: 'invite-members',
  invited_members: [],
  parentTranslationPath: 'OnboardingPage',
  translationPath: '',
};

export default InviteManagementDialog;
