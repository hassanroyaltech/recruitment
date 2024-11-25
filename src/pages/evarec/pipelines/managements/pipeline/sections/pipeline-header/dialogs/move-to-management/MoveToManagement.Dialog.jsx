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
import Avatar from '@mui/material/Avatar';
import { ButtonBase } from '@mui/material';
import i18next from 'i18next';
import {
  getErrorByName,
  GlobalDateFormat,
  showError,
  showSuccess,
  StringToColor,
} from '../../../../../../../../../helpers';
import {
  SetupsReducer,
  SetupsReset,
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../../../../../../setups/shared';
import {
  AvatarsComponent,
  DialogComponent,
  LoadableImageComponant,
} from '../../../../../../../../../components';
import {
  CreateOnboardingInvite,
  GetAllActiveJobs,
  GetAllSetupsBranches,
  GetAllStagesCandidates,
  PipelineMoveTo,
} from '../../../../../../../../../services';
import {
  AvatarsThemesEnum,
  DynamicFormTypesEnum,
  FormsMembersTypesEnum,
  InviteToOnboardingMembersTypesEnum,
  OnboardingTeamsTypesEnum,
  OnboardingTypesEnum,
  PipelineBulkSelectTypesEnum,
  PipelineMoveToTypesEnum,
} from '../../../../../../../../../enums';
import defaultUserImage from '../../../../../../../../../assets/icons/user-avatar.svg';
import './MoveToManagement.Style.scss';
import DatePickerComponent from '../../../../../../../../../components/Datepicker/DatePicker.Component';
import moment from 'moment/moment';
import DirectoriesPopover from '../../../../../../../../onboarding/popovers/directories/Directories.Popover';
import FormMembersPopover from '../../../../../../../../form-builder-v2/popovers/FormMembers.Popover';
import EmailTemplateDialog from '../../../../../../../../form-builder-v2/dialogs/email-template/EmailTemplate.Dialog';
import { MoveToManagementTabsData } from './tabs-data/MoveToManagement.TabsData';
import { VitallyTrack } from '../../../../../../../../../utils/Vitally';

export const MoveToManagementDialog = ({
  selectedCandidates,
  jobUUID,
  jobPipelineUUID,
  activeJob,
  activePipeline,
  onSave,
  isOpen,
  isOpenChanged,
  selectedPipelineMoveToType,
  getTotalSelectedCandidates,
  selectedConfirmedStages,
  onSelectedConfirmedStagesChanged,
  getPipelinePreMoveCheck,
  getIsDisabledTargetStage,
  parentTranslationPath,
  translationPath,
  reinitializeFilteredCandidates,
  showMoveToArchivedAfterSave,
  isFromBulkSelect,
  isShowMoveToOptions,
  titleText,
  preDefinedKeys,
  onboardingTeams,
  isJoinDateDisabled,
  isStartDateDisabled,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const localSelectedCandidatesRef = useRef([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const activePipelineRef = useRef(null);
  const [errors, setErrors] = useState(() => ({}));
  const [popoverAttachedWith, setPopoverAttachedWith] = useState({
    directories: null,
    members: null,
  });
  // const [addedCandidates, setAddedCandidates] = useState([]);
  const [moveToTypes] = useState(
    Object.values(PipelineMoveToTypesEnum).map((item) => ({
      ...item,
      title: t(`${translationPath}${item.title}`),
      description: t(`${translationPath}${item.description}`),
      type: t(`${translationPath}${item.type}`),
    })),
  );
  const [membersPopoverProps, setMembersPopoverProps] = useState({});
  const [localSelectedCandidates, setLocalSelectedCandidates] = useState([]);
  const stateInitRef = useRef({
    job_uuid: null,
    jobPipelineUUID: null,
    selected_candidates: [],
    move_to_type: null, // the type of move (one of PipelineMoveToTypesEnum keys)
    move_to_branch_uuid: null, // if to another branch & job.
    move_to_job_uuid: null, // if to another job in same branch or different.
    moveToJob: null, // just for front end.
    move_to_job_pipeline_uuid: null, // if to another pipeline.
    moveToJobPipeline: null, // just for front end.
    // the new stage uuid (must be no more than the first skippable in the new pipeline).
    move_to_stage_uuid: null,
    notes: null,
    //   related to the flow only
    space_uuid: [],
    folder_uuid: null,
    flow_uuid: null,
    directoriesDetails: [],
    join_date: null,
    expected_joining_date: null,
    start_onboarding_date: null,
    recruiter: [],
    bodyEmail: null,
    subjectEmail: null,
    attachmentsEmail: null,
    emailLanguageId: null,
    emailTemplateUUID: null,
    preMoveResponse: {},
  });
  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );
  const [isOpenDialogs, setIsOpenDialogs] = useState({
    confirmMove: false,
    emailTemplate: false,
  });
  const [addCandidatesManagement, setAddCandidatesManagement] = useState(null);
  const onIsOpenDialogsChanged = useCallback((key, newValue) => {
    setIsOpenDialogs((items) => ({ ...items, [key]: newValue }));
  }, []);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to toggle the page popovers
   */
  const addCandidatesToggleHandler = useCallback(() => {
    setAddCandidatesManagement((item) => !item);
  }, []);

  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is sent new value for state from child
   */
  const onStateChanged = (newValue) => {
    setState(newValue);
  };
  const getIsWithEmailTemplate = useMemo(
    () => state.move_to_type === PipelineMoveToTypesEnum.Flow.key,
    [state.move_to_type],
  );
  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to update errors for form on state changed
   */
  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: yup.object().shape({
          selected_candidates: yup
            .array()
            .min(1, `${t('Shared:please-select-at-least')} ${1} ${t('candidate')}`),
          move_to_type: yup
            .number()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          move_to_branch_uuid: yup
            .string()
            .nullable()
            .when(
              'move_to_type',
              (value, field) =>
                (+value === PipelineMoveToTypesEnum.Job.key
                  && field.required(t('Shared:this-field-is-required')))
                || field,
            ),
          move_to_job_uuid: yup
            .string()
            .nullable()
            .when(
              'move_to_type',
              (value, field) =>
                (+value === PipelineMoveToTypesEnum.Job.key
                  && field.required(t('Shared:this-field-is-required')))
                || field,
            ),
          move_to_job_pipeline_uuid: yup
            .string()
            .nullable()
            .when(
              'move_to_type',
              (value, field) =>
                (+value !== PipelineMoveToTypesEnum.Stage.key
                  && +value !== PipelineMoveToTypesEnum.Flow.key
                  && field.required(t('Shared:this-field-is-required')))
                || field,
            ),
          move_to_stage_uuid: yup
            .string()
            .nullable()
            .when(
              'move_to_type',
              (value, field) =>
                (+value === PipelineMoveToTypesEnum.Stage.key
                  && field.required(t('Shared:this-field-is-required')))
                || field,
            ),
          notes: yup
            .string()
            .nullable()
            .min(
              5,
              `${t('Shared:please-add-at-least')} ${5} ${t(`Shared:characters`)}`,
            ),
          //   only for flows
          space_uuid: yup
            .array()
            .nullable()
            .test(
              'isRequired',
              `${t('Shared:please-select-at-least')} ${1} ${t('directory')}`,
              (value, { parent }) =>
                parent.move_to_type !== PipelineMoveToTypesEnum.Flow.key
                || parent.is_update
                || (value && value.length > 0)
                || (parent.folder_uuid && parent.folder_uuid.length > 0)
                || (parent.flow_uuid && parent.flow_uuid.length > 0),
            ),
          folder_uuid: yup.array().nullable(),
          flow_uuid: yup.array().nullable(),
          join_date: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value, { parent }) =>
                value || parent.move_to_type !== PipelineMoveToTypesEnum.Flow.key,
            ),
          start_date: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value, { parent }) =>
                value || parent.move_to_type !== PipelineMoveToTypesEnum.Flow.key,
            ),
          recruiter: yup
            .array()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value, { parent }) =>
                parent.move_to_type !== PipelineMoveToTypesEnum.Flow.key
                || (value && value.length > 0),
            ),
          bodyEmail: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t(`Shared:this-field-is-required`),
              (value) => value || !getIsWithEmailTemplate,
            ),
          subjectEmail: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t(`Shared:this-field-is-required`),
              (value) => value || !getIsWithEmailTemplate,
            ),
        }),
      },
      state,
    ).then((result) => {
      setErrors(result);
    });
  }, [getIsWithEmailTemplate, state, t]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the total selected candidates
   */
  // const getTotalSelectedCandidates = useMemo(
  //   () => () =>
  //     (localSelectedCandidates
  //       && localSelectedCandidates.reduce((total, item) => {
  //         if (item.bulkSelectType === PipelineBulkSelectTypesEnum.Stage.key)
  //           return total + item.stage.total_candidates;
  //         return total + 1;
  //       }, 0))
  //     || 0,
  //   [localSelectedCandidates]
  // );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle remove the selected candidates
   * from the local & backend JSON
   */
  const onRemoveItemClicked = useCallback(
    ({ element, actualLocalSelected }) =>
      () => {
        // remove the item from the local list
        // and if its bulk select then remove also the confirmation
        if (element.bulkSelectType === PipelineBulkSelectTypesEnum.Stage.key) {
          const newValue = actualLocalSelected.filter(
            (items) => items.stage.uuid !== element.stage.uuid,
          );
          const localConfirmedStages = [...selectedConfirmedStages];
          const confirmedStageIndex = localConfirmedStages.findIndex(
            (item) => item === element.stage.uuid,
          );
          if (confirmedStageIndex !== -1) {
            localConfirmedStages.splice(confirmedStageIndex, 1);
            onSelectedConfirmedStagesChanged(localConfirmedStages);
          }
          setLocalSelectedCandidates(newValue);
        } else {
          const itemIndex = actualLocalSelected.findIndex(
            (item) => item.candidate.uuid === element.candidate.uuid,
          );
          if (itemIndex !== -1) {
            const newValue = [...actualLocalSelected];
            newValue.splice(itemIndex, 1);
            setLocalSelectedCandidates(newValue);
          }
        }
      },
    [onSelectedConfirmedStagesChanged, selectedConfirmedStages],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the return of the selected candidates uuids for the dropdown
   */
  const getSelectedAddedCandidates = useMemo(
    () => () => localSelectedCandidates.map((item) => item.candidate.uuid),
    [localSelectedCandidates],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle saving for the new selected candidates (locally)
   */
  const onSaveAddCandidatesHandler = (newCandidates) => {
    if (!activePipelineRef.current) return;
    const removedSelectedCandidatesWithBulk
      = localSelectedCandidatesRef.current.filter(
        (item) =>
          !newCandidates.some((element) => element.uuid === item.candidate.uuid),
      );
    if (removedSelectedCandidatesWithBulk.length > 0) {
      const localConfirmedStages = selectedConfirmedStages.filter(
        (item) =>
          !removedSelectedCandidatesWithBulk.some(
            (element) => element.stage.uuid === item,
          ),
      );
      onSelectedConfirmedStagesChanged(localConfirmedStages);
    }
    setLocalSelectedCandidates(() =>
      newCandidates.map((item) => ({
        stage: activePipelineRef.current.stages.find(
          (element) => element.uuid === item.stage_uuid,
        ),
        candidate: item,
        bulkSelectType: PipelineBulkSelectTypesEnum.Candidate.key,
      })),
    );
  };

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
   * @Description this method is to handle close for add more candidates
   * on remove the selected candidates at once or save them locally
   * for a temporarily time (until save or close add)
   */
  const onAddCandidatesChanged = ({ value }) => {
    setState({ id: 'move_to_stage_uuid', value: null });
    onSaveAddCandidatesHandler(value);
  };

  const getIsDisabledStage = useMemo(
    () => (stages) => (option) =>
      getIsDisabledTargetStage({
        candidates: localSelectedCandidates,
        targetStageItem: option,
        currentStages: stages,
      }),
    [getIsDisabledTargetStage, localSelectedCandidates],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle saving
   */
  const saveHandler = async (event, isConfirmed) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) {
      if (errors.name) showError(errors.name.message);
      return;
    }
    setIsLoading(true);
    const localState = {
      ...state,
    };
    if (state.move_to_type === PipelineMoveToTypesEnum.Stage.key && !isConfirmed) {
      const response = await getPipelinePreMoveCheck(
        localSelectedCandidates,
        state.move_to_stage_uuid,
      );
      if (response.totalCanMove <= 0) {
        setIsSubmitted(false);
        setState({ id: 'edit', value: stateInitRef.current });
        if (isOpenChanged) isOpenChanged();
        return;
      }
      setState({
        id: 'preMoveResponse',
        value: {
          ...response,
          ...(response.candidatesToMove && {
            candidatesToMove: response.candidatesToMove.map((item) => ({
              uuid: item,
              type: PipelineBulkSelectTypesEnum.Candidate.key,
            })),
          }),
        },
      });

      onIsOpenDialogsChanged('confirmMove', true);
      setIsLoading(false);
      return;
    }
    if (state.move_to_type === PipelineMoveToTypesEnum.Flow.key) {
      localState.onboarding_teams = {};
      localState.invited_members = isFromBulkSelect
        ? reinitializeFilteredCandidates(localSelectedCandidates, true).map(
          (item) => ({
            type:
                item.type === PipelineBulkSelectTypesEnum.Candidate.key
                  ? FormsMembersTypesEnum.Candidates.key
                  : FormsMembersTypesEnum.Stages.key,
            uuid: item.uuid,
            ...(item.type === PipelineBulkSelectTypesEnum.Candidate.key && {
              stage_uuid: item.stage.uuid,
            }),
          }),
        )
        : state.selected_candidates.map((item) => ({
          ...item,
          type: FormsMembersTypesEnum.Candidates.key,
        }));

      Object.values(OnboardingTeamsTypesEnum).forEach((item) => {
        localState.onboarding_teams[item.key] = (state?.[item.key] || []).map(
          (el) => el.value,
        );
      });
      localState.message = state.notes;
      localState.attachments_email = state.attachmentsEmail;
      localState.body_email = state.bodyEmail;
      localState.email_language_id = state.emailLanguageId;
      localState.email_template_uuid = state.emailTemplateUUID;
      localState.subject_email = state.subjectEmail;
    } else
      localState.selected_candidates = reinitializeFilteredCandidates(
        localSelectedCandidates,
      );
    const response = await (
      (state.move_to_type === PipelineMoveToTypesEnum.Flow.key
        && CreateOnboardingInvite)
      || PipelineMoveTo
    )(
      state.move_to_type === PipelineMoveToTypesEnum.Stage.key
        ? {
          ...localState,
          selected_candidates:
              localState.preMoveResponse.candidatesToMove
              || localState.selected_candidates,
        }
        : localState,
    );
    setIsLoading(false);
    if (response && (response.status === 202 || response.status === 200)) {
      setIsSubmitted(false);
      if (state.move_to_type === PipelineMoveToTypesEnum.Job.key)
        window?.ChurnZero?.push([
          'trackEvent',
          'EVA-REC - Move between jobs',
          'Move between jobs',
          1,
          {},
        ]);

      if (
        state.move_to_type === PipelineMoveToTypesEnum.Flow.key
        && !state?.is_update
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
      if (state.move_to_type === PipelineMoveToTypesEnum.Stage.key)
        VitallyTrack('EVA-REC - Move candidate between stages');

      if (
        state.move_to_type === PipelineMoveToTypesEnum.Stage.key
        && showMoveToArchivedAfterSave
      )
        showMoveToArchivedAfterSave(state.move_to_stage_uuid);
      setState({ id: 'edit', value: stateInitRef.current });
      if (onSave) onSave();
      if (isOpenChanged) isOpenChanged();
      showSuccess(
        t(
          `${translationPath}${
            (state.move_to_type === PipelineMoveToTypesEnum.Flow.key
              && 'invitation-created-successfully')
            || 'candidates-moved-successfully'
          }`,
        ),
      );
    } else
      showError(
        t(
          `${translationPath}${
            (state.move_to_type === PipelineMoveToTypesEnum.Flow.key
              && 'invitation-create-failed')
            || 'candidates-move-failed'
          }`,
        ),
        response,
      );
  };

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  // // this to get saved data on edit init
  // useEffect(() => {
  //   if (pipelineUUID && isOpen) GetCandidateDetailsByPipelineUUID(pipelineUUID);
  // }, [pipelineUUID, GetAllEvaRecPipelineNotesHandler, isOpen, filter, isReload]);

  // this is to update the selected candidate to be sent for the backend
  useEffect(() => {
    if (isOpen && localSelectedCandidates)
      setState({
        id: 'selected_candidates',
        value: localSelectedCandidates.map((item) => ({
          type:
            (item.bulkSelectType === PipelineBulkSelectTypesEnum.Stage.key
              && PipelineBulkSelectTypesEnum.Stage.key)
            || PipelineBulkSelectTypesEnum.Candidate.key,
          uuid:
            (item.bulkSelectType === PipelineBulkSelectTypesEnum.Stage.key
              && item.stage.uuid)
            || item.candidate.uuid,
          stage_uuid: item?.candidate?.stage_uuid,
        })),
      });
  }, [isOpen, localSelectedCandidates]);

  // to update the JSON & send the job_uuid & pipeline_uuid to is on init
  useEffect(() => {
    if (isOpen) {
      setState({ id: 'job_uuid', value: jobUUID });
      setState({ id: 'job_pipeline_uuid', value: jobPipelineUUID });
      setState({ id: 'move_to_type', value: selectedPipelineMoveToType });
    }
  }, [isOpen, jobPipelineUUID, jobUUID, selectedPipelineMoveToType]);
  useEffect(() => {
    if (isOpen) {
      let localeTeams = {};
      Object.values(OnboardingTeamsTypesEnum).forEach((item) => {
        localeTeams[item.key] = (onboardingTeams?.[item.key] || []).map((el) => ({
          ...el,
          value: el.uuid,
          type: InviteToOnboardingMembersTypesEnum.UsersAndEmployees.type,
        }));
      });
      setState({ id: 'destructObject', value: localeTeams });
    }
  }, [onboardingTeams, isOpen]);
  useEffect(() => {
    if (isOpen && preDefinedKeys)
      setState({ id: 'destructObject', value: preDefinedKeys });
  }, [preDefinedKeys, isOpen]);
  // this is to update the selected candidates on init & after open the dialog
  useEffect(() => {
    if (isOpen) setLocalSelectedCandidates([...(selectedCandidates || [])]);
  }, [isOpen, selectedCandidates]);

  useEffect(() => {
    activePipelineRef.current = activePipeline;
  }, [activePipeline]);

  useEffect(() => {
    localSelectedCandidatesRef.current = localSelectedCandidates;
  }, [localSelectedCandidates]);

  useEffect(() => {
    if (!isOpen) {
      setLocalSelectedCandidates([]);
      setAddCandidatesManagement(null);
    }
  }, [isOpen]);
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
      maxWidth="md"
      titleText={titleText || 'move-to'}
      contentClasses="px-0"
      isWithFullScreen
      dialogContent={
        <div className="move-to-management-content-dialog-wrapper">
          {(isFromBulkSelect && (
            <div className="selected-candidates-details-section">
              <div className="px-2 c-black-lighter mb-2">
                <span>{getTotalSelectedCandidates(localSelectedCandidates)}</span>
                <span className="px-2">
                  {t(`${translationPath}selected-candidates`)}
                </span>
              </div>
              <div className="selected-candidates-details-items-wrapper">
                {reinitializeFilteredCandidates(localSelectedCandidates, true).map(
                  (element, index) => (
                    <div
                      className="selected-candidates-details-item-wrapper"
                      key={`selectedCandidatesKey${index + 1}`}
                    >
                      <div className="selected-candidates-details-item-body">
                        {element.bulkSelectType
                          !== PipelineBulkSelectTypesEnum.Stage.key && (
                          <div className="d-inline-flex-v-center">
                            {((element.candidate.url || !element.candidate.name) && (
                              <LoadableImageComponant
                                classes="user-image-wrapper"
                                alt={
                                  element.candidate.name
                                  || t(`${translationPath}user-image`)
                                }
                                src={element.candidate.url || defaultUserImage}
                              />
                            )) || (
                              <Avatar
                                style={{
                                  backgroundColor: StringToColor(
                                    element.candidate.name,
                                  ),
                                }}
                              >
                                {(element.candidate.name
                                  && element.candidate.name
                                    .split(' ')
                                    .map((word) => word[0]))
                                  || ''}
                              </Avatar>
                            )}
                            <span className="px-2">
                              {element.candidate.name || 'N/A'}
                            </span>
                          </div>
                        )}
                        {element.bulkSelectType
                          === PipelineBulkSelectTypesEnum.Stage.key && (
                          <div className="d-inline-flex-v-center">
                            <Avatar
                              style={{
                                backgroundColor: StringToColor(element.stage.title),
                              }}
                            >
                              {(element.stage.title
                                && element.stage.title
                                  .split(' ')
                                  .map((word) => word[0]))
                                || ''}
                            </Avatar>
                            <span className="px-2">
                              <span>
                                {t(`${translationPath}entire-stage-description`)}
                              </span>
                              <span className="px-1">
                                <span>&quot;</span>
                                <span>{element.stage.title}</span>
                                <span>&quot;</span>
                              </span>
                              <span>{t(`${translationPath}selected`)}</span>
                              <span className="px-1">
                                <span>(</span>
                                <span className="px-1">
                                  {element.stage.total_candidates}
                                </span>
                                <span>)</span>
                              </span>
                            </span>
                          </div>
                        )}
                        <ButtonBase
                          className="btns-icon theme-transparent"
                          onClick={onRemoveItemClicked({
                            element,
                            // elements,
                            actualLocalSelected: localSelectedCandidates,
                          })}
                        >
                          <span className="fas fa-times" />
                        </ButtonBase>
                      </div>
                    </div>
                  ),
                )}
                {errors.selected_candidates
                  && errors.selected_candidates.error
                  && isSubmitted && (
                  <div className="c-error fz-10 mb-3 px-2">
                    <span>{errors.selected_candidates.message}</span>
                  </div>
                )}
                {!addCandidatesManagement && (
                  <ButtonBase
                    className="btns theme-transparent mx-2 miw-0 mb-3"
                    onClick={addCandidatesToggleHandler}
                  >
                    <span className="px-2">{t('add')}</span>
                  </ButtonBase>
                )}
                {addCandidatesManagement && (
                  <>
                    <SharedAPIAutocompleteControl
                      isQuarterWidth
                      type={DynamicFormTypesEnum.array.key}
                      searchKey="search"
                      title="candidates"
                      isDisabled={isLoading}
                      isSubmitted={isSubmitted}
                      placeholder="select-candidates"
                      stateKey="candidates"
                      onValueChanged={onAddCandidatesChanged}
                      editValue={getSelectedAddedCandidates()}
                      getDataAPI={GetAllStagesCandidates}
                      dataKey="candidate"
                      getDisabledOptions={(option) =>
                        reinitializeFilteredCandidates(localSelectedCandidates).some(
                          (item) =>
                            option.uuid === item.uuid
                            || option.stage_uuid === item.uuid,
                        )
                      }
                      getOptionSelected={(option) =>
                        reinitializeFilteredCandidates(
                          localSelectedCandidates,
                          true,
                        ).some(
                          (item) =>
                            option.uuid === item.candidate.uuid
                            || (item.bulkSelectType
                              === PipelineBulkSelectTypesEnum.Stage.key
                              && option.stage_uuid === item.stage.uuid),
                        )
                      }
                      isEntireObject
                      extraProps={{
                        job_pipeline_uuid: jobPipelineUUID,
                        job_uuid: jobUUID,
                      }}
                      on={(v1, v2, v3) => {
                        console.log(v1, v2, v3);
                      }}
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                      // withExternalChips={false}
                      getOptionLabel={(option) => option.name}
                    />
                    {/*<ButtonBase*/}
                    {/*  className="btns theme-solid mx-2 miw-0 mb-3"*/}
                    {/*  onClick={onSaveAddCandidatesHandler}*/}
                    {/*>*/}
                    {/*  <span className="px-2">{t('save')}</span>*/}
                    {/*</ButtonBase>*/}
                    <ButtonBase
                      className="btns-icon theme-transparent mx-2 miw-0 mb-3 c-warning"
                      onClick={addCandidatesToggleHandler}
                    >
                      <span className="fas fa-times" />
                    </ButtonBase>
                  </>
                )}
              </div>
            </div>
          ))
            || ''}
          {state.move_to_type === PipelineMoveToTypesEnum.Flow.key && (
            <>
              <div className="box-field-wrapper">
                <div className="inline-label-wrapper">
                  <span>{t(`${translationPath}directories`)}</span>
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
                  isDisabled={isStartDateDisabled}
                />
              </div>
              <div className="box-field-wrapper mt--3 mb-3">
                <div className="inline-label-wrapper"></div>
                <div className="description-text c-gray px-2">
                  <span>
                    {t(`${translationPath}start-onboarding-from-description`)}
                  </span>
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
                        setMembersPopoverProps({
                          arrayKey: el.key,
                          popoverTabs: MoveToManagementTabsData,
                          values: state[el.key],
                          getListAPIProps: ({ type }) => ({
                            job_uuid: jobUUID,
                            pipeline_uuid: jobPipelineUUID,
                            job_pipeline_uuid: jobPipelineUUID,
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
                            onTagBtnClicked={onAvatarDeleteClicked(
                              index,
                              items,
                              el.key,
                            )}
                            avatarTheme={AvatarsThemesEnum.TagAvatar.theme}
                            translationPath={translationPath}
                            parentTranslationPath={parentTranslationPath}
                          />
                        ))}
                        <span
                          className={`c-gray-primary px-2 pb-2${
                            (state[el.key].length > 0 && ' mt-2') || ''
                          }`}
                        >
                          {t(`${translationPath}search`)}
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
            </>
          )}
          {isShowMoveToOptions && (
            <div className="move-to-section">
              <div className="px-2 c-black-lighter mb-2">
                <span className="px-2">{t(`${translationPath}move-to`)}</span>
              </div>
              <div className="px-2">
                <SharedAutocompleteControl
                  isQuarterWidth
                  errors={errors}
                  searchKey="search"
                  isDisabled={isLoading}
                  isSubmitted={isSubmitted}
                  initValues={moveToTypes}
                  stateKey="move_to_type"
                  errorPath="move_to_type"
                  initValuesTitle="title"
                  disabledOptions={(option) => option.isDisabled}
                  renderOption={(renderProps, option) => (
                    <li {...renderProps}>
                      <span className="px-1">
                        <span className="d-flex-v-center">
                          <span className="header-text">{option.title}</span>
                          <span className="tags-wrapper">{option.type}</span>
                        </span>
                        <span className="c-gray-primary">{option.description}</span>
                      </span>
                    </li>
                  )}
                  onValueChanged={(newValue) => {
                    if (state.move_to_branch_uuid)
                      setState({ id: 'move_to_branch_uuid', value: null });
                    if (state.move_to_job_uuid)
                      setState({ id: 'move_to_job_uuid', value: null });
                    if (state.moveToJob) setState({ id: 'moveToJob', value: null });
                    if (state.move_to_job_pipeline_uuid)
                      setState({ id: 'move_to_job_pipeline_uuid', value: null });
                    if (state.moveToJobPipeline)
                      setState({ id: 'moveToJobPipeline', value: null });
                    if (state.move_to_stage_uuid)
                      setState({ id: 'move_to_stage_uuid', value: null });
                    if (
                      state.join_date
                      || (state.directoriesDetails
                        && state.directoriesDetails.length > 0)
                    )
                      onStateChanged({
                        id: 'destructObject',
                        value: {
                          space_uuid: null,
                          folder_uuid: null,
                          flow_uuid: null,
                          join_date: null,
                          directoriesDetails: [],
                        },
                      });
                    onStateChanged(newValue);
                  }}
                  title="select-move-type"
                  editValue={state.move_to_type}
                  placeholder="search-by-name"
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />

                {state.move_to_type
                  && state.move_to_type !== PipelineMoveToTypesEnum.Flow.key && (
                  <>
                    {state.move_to_type === PipelineMoveToTypesEnum.Job.key && (
                      <SharedAPIAutocompleteControl
                        isQuarterWidth
                        errors={errors}
                        searchKey="search"
                        title="select-branch"
                        errorPath="move_to_branch_uuid"
                        isDisabled={isLoading}
                        isSubmitted={isSubmitted}
                        placeholder="select-branch"
                        stateKey="move_to_branch_uuid"
                        onValueChanged={(newValue) => {
                          if (state.move_to_job_uuid)
                            setState({ id: 'move_to_job_uuid', value: null });
                          if (state.move_to_job_pipeline_uuid)
                            setState({
                              id: 'move_to_job_pipeline_uuid',
                              value: null,
                            });
                          if (state.moveToJobPipeline)
                            setState({ id: 'moveToJobPipeline', value: null });
                          if (state.moveToJob)
                            setState({ id: 'moveToJob', value: null });
                          if (state.move_to_stage_uuid)
                            setState({ id: 'move_to_stage_uuid', value: null });
                          onStateChanged(newValue);
                        }}
                        editValue={state.move_to_branch_uuid}
                        getDataAPI={GetAllSetupsBranches}
                        extraProps={{
                          ...(state.move_to_branch_uuid && {
                            with_than: [state.move_to_branch_uuid],
                          }),
                        }}
                        parentTranslationPath={parentTranslationPath}
                        translationPath={translationPath}
                        getOptionLabel={(option) =>
                          (option.name
                              && (option.name[i18next.language]
                                || option.name.en
                                || 'N/A'))
                            || 'N/A'
                        }
                      />
                    )}
                    {state.move_to_type === PipelineMoveToTypesEnum.Job.key
                        && state.move_to_branch_uuid && (
                      <SharedAPIAutocompleteControl
                        isQuarterWidth
                        errors={errors}
                        searchKey="search"
                        title="select-job"
                        errorPath="move_to_job_uuid"
                        isDisabled={isLoading}
                        isSubmitted={isSubmitted}
                        placeholder="select-job"
                        stateKey="move_to_job_uuid"
                        dataKey="jobs"
                        isEntireObject
                        onValueChanged={(newValue) => {
                          if (state.move_to_job_pipeline_uuid)
                            setState({
                              id: 'move_to_job_pipeline_uuid',
                              value: null,
                            });
                          if (state.moveToJobPipeline)
                            setState({
                              id: 'moveToJobPipeline',
                              value: null,
                            });
                          if (state.move_to_stage_uuid)
                            setState({ id: 'move_to_stage_uuid', value: null });
                          onStateChanged({
                            ...newValue,
                            value:
                                  (newValue.value && newValue.value.uuid) || null,
                          });
                          onStateChanged({ ...newValue, id: 'moveToJob' });
                        }}
                        editValue={state.move_to_job_uuid}
                        getDataAPI={GetAllActiveJobs}
                        extraProps={{
                          use_for: 'dropdown',
                          ...((activePipeline?.is_same_position && {
                            job_uuid: jobUUID,
                            user_for: 'same_position_title',
                          })
                                || {}),
                          company_uuid: state.move_to_branch_uuid || undefined,
                          ...(state.move_to_job_uuid && {
                            with_than: [state.move_to_job_uuid],
                          }),
                        }}
                        parentTranslationPath={parentTranslationPath}
                        translationPath={translationPath}
                        // getOptionLabel={(option) =>
                        //   (option.name
                        //       && (option.name[i18next.language]
                        //         || option.name.en
                        //         || 'N/A'))
                        //     || 'N/A'
                        // }
                      />
                    )}
                    {(state.move_to_type
                        === PipelineMoveToTypesEnum.Pipeline.key
                        || state.move_to_job_uuid) && (
                      <SharedAutocompleteControl
                        isQuarterWidth
                        errors={errors}
                        searchKey="search"
                        title="select-pipeline"
                        errorPath="move_to_job_pipeline_uuid"
                        isDisabled={isLoading}
                        isSubmitted={isSubmitted}
                        placeholder="select-pipeline"
                        stateKey="move_to_job_pipeline_uuid"
                        isEntireObject
                        onValueChanged={(newValue) => {
                          if (state.move_to_stage_uuid)
                            setState({ id: 'move_to_stage_uuid', value: null });
                          onStateChanged({
                            ...newValue,
                            value: (newValue.value && newValue.value.uuid) || null,
                          });
                          onStateChanged({ ...newValue, id: 'moveToJobPipeline' });
                        }}
                        editValue={state.move_to_job_pipeline_uuid}
                        initValuesKey="uuid"
                        initValuesTitle="title"
                        initValues={
                          (state.moveToJob && state.moveToJob.pipelines)
                            || (activeJob && activeJob.pipelines)
                            || []
                        }
                        parentTranslationPath={parentTranslationPath}
                        translationPath={translationPath}
                        // getOptionLabel={(option) =>
                        //   (option.name
                        //     && (option.name[i18next.language]
                        //       || option.name.en
                        //       || 'N/A'))
                        //   || 'N/A'
                        // }
                      />
                    )}
                    {state.move_to_type === PipelineMoveToTypesEnum.Stage.key && (
                      <SharedAutocompleteControl
                        isQuarterWidth
                        errors={errors}
                        // searchKey="search"
                        title="select-stage"
                        errorPath="move_to_stage_uuid"
                        isDisabled={isLoading}
                        isSubmitted={isSubmitted}
                        placeholder="select-stage"
                        stateKey="move_to_stage_uuid"
                        onValueChanged={onStateChanged}
                        editValue={state.move_to_stage_uuid}
                        initValuesKey="uuid"
                        initValuesTitle="title"
                        initValues={
                          (state.moveToJobPipeline
                              && state.moveToJobPipeline.stages)
                            || (activePipeline && activePipeline.stages)
                            || []
                        }
                        disabledOptions={getIsDisabledStage(
                          (state.moveToJobPipeline
                              && state.moveToJobPipeline.stages)
                              || (activePipeline && activePipeline.stages)
                              || [],
                        )}
                        parentTranslationPath={parentTranslationPath}
                        translationPath={translationPath}
                        // getOptionLabel={(option) =>
                        //   (option.name
                        //     && (option.name[i18next.language]
                        //       || option.name.en
                        //       || 'N/A'))
                        //   || 'N/A'
                        // }
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {state.move_to_type === PipelineMoveToTypesEnum.Flow.key && (
            <>
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
                  isDisabled={isJoinDateDisabled}
                />
              </div>
              {/*<div className="box-field-wrapper mt--3 mb-3">*/}
              {/*  <div className="inline-label-wrapper"></div>*/}
              {/*  <div className="description-text c-gray px-2">*/}
              {/*    <span>{t(`${translationPath}date-joined-description`)}</span>*/}
              {/*  </div>*/}
              {/*</div>*/}

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
            </>
          )}
          {state.move_to_type !== PipelineMoveToTypesEnum.Flow.key && (
            <SharedInputControl
              rows={4}
              multiline
              isFullWidth
              errors={errors}
              wrapperClasses="px-3"
              stateKey="notes"
              errorPath="notes"
              isDisabled={isLoading}
              isSubmitted={isSubmitted}
              editValue={state.notes}
              labelValue="message"
              onValueChanged={onStateChanged}
              placeholder="add-message-to-your-team"
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
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
          {isOpenDialogs.confirmMove && (
            <DialogComponent
              isOpen={isOpenDialogs.confirmMove}
              maxWidth={'sm'}
              dialogContent={
                <div>
                  {/*<div className="d-flex">*/}
                  {/*  {`${t(`${translationPath}total-selected`)} (${*/}
                  {/*    state.preMoveResponse.totalCandidates*/}
                  {/*  }) ${t(`${translationPath}candidates`)}`}*/}
                  {/*</div>*/}
                  <div className="d-flex">
                    {`${t(`${translationPath}total-candidates-to-move`)}`}
                    <span className="px-1 text-green">
                      {`(${state.preMoveResponse.totalCanMove}) ${t(
                        `${translationPath}candidates`,
                      )}`}{' '}
                    </span>
                  </div>
                  {state.preMoveResponse.totalCanNotMove ? (
                    <div className="d-flex">
                      {`${t(`${translationPath}total-candidates-will-not-move`)}`}
                      <span className="px-1 text-red">
                        {' '}
                        {` (${state.preMoveResponse.totalCanNotMove}) ${t(
                          `${translationPath}candidates`,
                        )}`}{' '}
                      </span>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              }
              onCloseClicked={() => onIsOpenDialogsChanged('confirmMove', false)}
              onCancelClicked={() => onIsOpenDialogsChanged('confirmMove', false)}
              saveText={'confirm'}
              titleText={'confirm-move-title'}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              isSaving={isLoading}
              onSaveClicked={(e) => saveHandler(e, true)}
            />
          )}
          {popoverAttachedWith.members && !isLoading && (
            <FormMembersPopover
              {...membersPopoverProps}
              popoverAttachedWith={popoverAttachedWith.members}
              handleClose={() => {
                popoverToggleHandler('members', null);
                setMembersPopoverProps(null);
              }}
              onSave={(newValues) => {
                setState({
                  id: 'destructObject',
                  value: {
                    ...newValues,
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
              slug={
                state.move_to_type === PipelineMoveToTypesEnum.Flow.key
                  ? 'onb_inviting_candidate_to_onboarding'
                  : ''
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
      wrapperClasses="move-to-management-dialog-wrapper"
      isSaving={isLoading}
      isOpen={isOpen}
      cancelClasses="btns theme-transparent"
      saveClasses="btns theme-solid bg-primary"
      onSaveClicked={saveHandler}
      onCloseClicked={isOpenChanged}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

MoveToManagementDialog.propTypes = {
  selectedCandidates: PropTypes.arrayOf(
    PropTypes.shape({
      stage: PropTypes.instanceOf(Object),
      candidate: PropTypes.instanceOf(Object),
      bulkSelectType: PropTypes.number,
    }),
  ),
  activeJob: PropTypes.instanceOf(Object),
  activePipeline: PropTypes.instanceOf(Object),
  selectedPipelineMoveToType: PropTypes.oneOf(
    Object.values(PipelineMoveToTypesEnum).map((item) => item.key),
  ),
  jobUUID: PropTypes.string,
  jobPipelineUUID: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  getIsDisabledTargetStage: PropTypes.func.isRequired,
  onSave: PropTypes.func,
  selectedConfirmedStages: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelectedConfirmedStagesChanged: PropTypes.func.isRequired,
  getPipelinePreMoveCheck: PropTypes.func.isRequired,
  reinitializeFilteredCandidates: PropTypes.func,
  getTotalSelectedCandidates: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
  showMoveToArchivedAfterSave: PropTypes.func,
  isFromBulkSelect: PropTypes.bool,
  isShowMoveToOptions: PropTypes.bool,
  titleText: PropTypes.string,
  preDefinedKeys: PropTypes.instanceOf(Object),
  onboardingTeams: PropTypes.instanceOf(Object),
  isJoinDateDisabled: PropTypes.bool,
  isStartDateDisabled: PropTypes.bool,
};
MoveToManagementDialog.defaultProps = {
  selectedCandidates: [],
  isOpenChanged: undefined,
  jobUUID: undefined,
  activeJob: undefined,
  getTotalSelectedCandidates: undefined,
  activePipeline: undefined,
  selectedPipelineMoveToType: undefined,
  jobPipelineUUID: undefined,
  onSave: undefined,
  translationPath: undefined,
};
