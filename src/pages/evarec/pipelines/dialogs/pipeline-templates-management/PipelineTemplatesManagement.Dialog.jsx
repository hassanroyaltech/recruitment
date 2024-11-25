/* eslint-disable max-len */
// noinspection JSValidateTypes

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
import {
  CreatePipelineStage,
  GetAllEvaRecPipelineStages,
  GetAllPipelineAnnotations,
  GetAllPipelineQuestionnaires,
  GetMultipleMedias,
  UpdateEvaRecPipelineTemplate,
  UpdatePipelineStage,
} from '../../../../../services';
import { getErrorByName, showError, showSuccess } from '../../../../../helpers';
import { DialogComponent, TabsComponent } from '../../../../../components';
import {
  ConfirmDeleteDialog,
  SetupsReducer,
  SetupsReset,
} from '../../../../setups/shared';
import { PipelineTemplatesTabs } from '../../../shared';
import './PipelineTemplatesManagement.Style.scss';
import { PipelineStagePreconditionTypesEnum } from '../../../../../enums';

export const PipelineTemplatesManagementDialog = ({
  activePipelineItem,
  activeItem,
  isOpen,
  onSave,
  isOpenChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [pipelineTemplatesTabsData] = useState(() => PipelineTemplatesTabs);
  const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openActionCollapseIndex, setOpenActionCollapseIndex] = useState(null);
  const [isOpenActionsCollapse, setIsOpenActionsCollapse] = useState(false);
  const [isOpenTeamWorkflowCollapse, setIsOpenTeamWorkflowCollapse]
    = useState(false);
  const [isOpenPreconditionCollapse, setIsOpenPreconditionCollapse]
    = useState(false);
  const changedStagesRef = useRef([]);
  const isChangedPipelineRef = useRef(false);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [activeStage, setActiveStage] = useState(0);
  const [emailAnnotations, setEmailAnnotations] = useState([]);
  const [pipelineQuestionnaires, setPipelineQuestionnaires] = useState([]);

  const [state, setState] = useReducer(
    SetupsReducer,
    {
      uuid: null,
      stages: [],
      language_id: null,
      title: null,
      description: null,
      tags: [],
      is_visible_on_candidate: false,
      ability_to_move_form_builder: false,
      form_builder_types: [],
      is_same_position: false,
    },
    SetupsReset,
  );

  /**
   * @Description this method is to get active stage precondition type enum item by key
   */
  const getActiveStagePreconditionTypeByKey = useMemo(
    () => (key) =>
      Object.values(PipelineStagePreconditionTypesEnum).find(
        (item) => item.key === key,
      ),
    [],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get form errors
   */
  const getErrors = useCallback(async () => {
    const result = await getErrorByName(
      {
        current: yup.object().shape({
          title: yup
            .string()
            .nullable()
            .min(
              3,
              `${t('Shared:this-field-must-be-more-than')} ${3} ${t('characters')}`,
            )
            .max(
              255,
              `${t('Shared:this-field-must-be-less-than')} ${255} ${t(
                'characters',
              )}`,
            )
            .required(t('this-field-is-required')),
          language_id: yup.string().nullable().required(t('this-field-is-required')),
          description: yup
            .string()
            .nullable()
            .min(
              3,
              `${t('Shared:this-field-must-be-more-than')} ${3} ${t('characters')}`,
            )
            .required(t('this-field-is-required')),
          ability_to_move_form_builder: yup.boolean().nullable(),
          form_builder_types: yup
            .array()
            .of(yup.string())
            .nullable()
            .when(
              'ability_to_move_form_builder',
              (value, field) =>
                (value
                  && field.min(
                    1,
                    `${t('Shared:please-add-at-least')} ${1} ${t('form-type')}`,
                  ))
                || field,
            ),
          stages: yup
            .array()
            .of(
              yup.object().shape({
                title: yup
                  .string()
                  .nullable()
                  .required(t('Shared:this-field-is-required'))
                  .min(
                    3,
                    `${t('Shared:this-field-must-be-more-than')} ${3} ${t(
                      'characters',
                    )}`,
                  )
                  .max(
                    255,
                    `${t('Shared:this-field-must-be-less-than')} ${255} ${t(
                      'characters',
                    )}`,
                  ),
                is_skippable: yup.boolean().nullable(),
                is_skippable_disabled: yup.boolean().nullable(),
                is_hide_external_provider: yup.boolean().nullable(),
                is_hide_external_provider_disabled: yup.boolean().nullable(),
                can_delete: yup.boolean().nullable(),
                stage_limit: yup
                  .number()
                  .nullable()
                  .min(1, `${t('Shared:this-field-must-be-more-than')} ${1}`),
                is_with_timeframe: yup.boolean().nullable(),
                timeframe_duration: yup
                  .number()
                  .nullable()
                  .when(
                    'is_with_timeframe',
                    (value, field) =>
                      (value
                        && field
                          .required(t('this-field-is-required'))
                          .min(
                            1,
                            `${t('Shared:this-field-must-be-more-than')} ${1}`,
                          ))
                      || field,
                  ),
                timeframe_duration_type: yup
                  .number()
                  .nullable()
                  .when(
                    'is_with_timeframe',
                    (value, field) =>
                      (value && field.required(t('this-field-is-required')))
                      || field,
                  ),
                is_with_workflows: yup.boolean().nullable(),
                workflows: yup
                  .array()
                  .nullable()
                  .of(
                    yup.object().shape({
                      transaction_key: yup
                        .number()
                        .nullable()
                        .required(t('this-field-is-required')),
                      template_uuid: yup.string().nullable(),
                    }),
                  )
                  .when(
                    'is_with_workflows',
                    (value, field) =>
                      (value
                        && field.min(
                          1,
                          `${t('Shared:please-add-at-least')} ${1} ${t(
                            `${translationPath}stage-workflows`,
                          )}`,
                        ))
                      || field,
                  ),

                is_with_precondition: yup.boolean().nullable(),
                precondition: yup
                  .array()
                  .nullable()
                  .of(
                    yup.object().shape({
                      type: yup
                        .number()
                        .nullable()
                        .required(t('this-field-is-required')),
                      template_type: yup
                        .array()
                        .of(yup.string())
                        .nullable()
                        .when(
                          'type',
                          (value, field) =>
                            (value
                              && +value
                                === getActiveStagePreconditionTypeByKey(+value).key
                              && getActiveStagePreconditionTypeByKey(+value)
                                .templateTypesVersion
                              && field.min(
                                1,
                                `${t('Shared:please-add-at-least')} ${1} ${t(
                                  `${translationPath}template-type`,
                                )}`,
                              ))
                            || field,
                        ),
                      template_status: yup
                        .array()
                        .of(yup.number())
                        .nullable()
                        .when(
                          'type',
                          (value, field) =>
                            (value
                              && +value
                                === getActiveStagePreconditionTypeByKey(+value).key
                              && getActiveStagePreconditionTypeByKey(+value)
                                .isWithTemplateStatus
                              && field.min(
                                1,
                                `${t('Shared:please-add-at-least')} ${1} ${t(
                                  `${translationPath}form-status`,
                                )}`,
                              ))
                            || field,
                        ),
                      template_uuid: yup
                        .array()
                        .of(yup.string())
                        .nullable()
                        .when(
                          'type',
                          (value, field) =>
                            (value
                              && +value
                                === getActiveStagePreconditionTypeByKey(+value).key
                              && getActiveStagePreconditionTypeByKey(+value)
                                .templateType
                              && field.min(
                                1,
                                `${t('Shared:please-add-at-least')} ${1} ${t(
                                  `${translationPath}template`,
                                )}`,
                              ))
                            || field,
                        ),
                      job_target: yup
                        .array()
                        .of(yup.string())
                        .nullable()
                        .when(
                          'type',
                          (value, field) =>
                            (value
                              && +value
                                === PipelineStagePreconditionTypesEnum.JobTargets.key
                              && field.min(
                                1,
                                `${t('Shared:please-add-at-least')} ${1} ${t(
                                  `${translationPath}job-target`,
                                )}`,
                              ))
                            || field,
                        ),
                      budgeted_type: yup
                        .array()
                        .of(yup.string())
                        .nullable()
                        .when(
                          'type',
                          (value, field) =>
                            (value
                              && +value
                                === PipelineStagePreconditionTypesEnum.JobTypes.key
                              && field.min(
                                1,
                                `${t('Shared:please-add-at-least')} ${1} ${t(
                                  `${translationPath}job-type`,
                                )}`,
                              ))
                            || field,
                        ),
                      scorecard_status: yup
                        .number()
                        .nullable()
                        .when(
                          'type',
                          (value, field) =>
                            (value
                              && +value
                                === PipelineStagePreconditionTypesEnum.Scorecard.key
                              && field.required(
                                t(
                                  `${translationPath}please-select-scorecard-status`,
                                ),
                              ))
                            || field,
                        ),
                      final_elimination: yup
                        .array()
                        .of(
                          yup.object().shape({
                            uuid: yup
                              .string()
                              .nullable()
                              .required(t('Shared:this-field-is-required')),
                            number: yup
                              .number()
                              .nullable()
                              .required(t('Shared:this-field-is-required')),
                          }),
                        )
                        .nullable()
                        .when(
                          'type',
                          (value, field) =>
                            (value
                              && +value
                                === PipelineStagePreconditionTypesEnum.FinalElimination
                                  .key
                              && field.min(
                                1,
                                `${t('Shared:please-add-at-least')} ${1} ${t(
                                  `${translationPath}final-elimination`,
                                )}`,
                              ))
                            || field,
                        ),
                    }),
                  )
                  .when(
                    'is_with_precondition',
                    (value, field) =>
                      (value
                        && field.min(
                          1,
                          `${t('Shared:please-add-at-least')} ${1} ${t(
                            `${translationPath}precondition`,
                          )}`,
                        ))
                      || field,
                  ),

                is_with_actions: yup.boolean().nullable(),
                actions: yup
                  .array()
                  .of(
                    yup.object().shape({
                      type: yup
                        .number()
                        .nullable()
                        .required(t('this-field-is-required')),
                      relation_uuid: yup.string().nullable(),
                      // available_for_duration: yup
                      //   .number()
                      //   .nullable()
                      //   .when(
                      //     'type',
                      //     (value, field) =>
                      //       (+value
                      //         === PipelineStageActionsTypesEnum.VideoAssessment.key
                      //         && field.required(t('this-field-is-required')))
                      //       || field
                      //   ),
                      // available_for_duration_type: yup
                      //   .number()
                      //   .nullable()
                      //   .when(
                      //     'type',
                      //     (value, field) =>
                      //       (+value
                      //         === PipelineStageActionsTypesEnum.VideoAssessment.key
                      //         && field.required(t('this-field-is-required')))
                      //       || field
                      //   ),
                      email_subject: yup
                        .string()
                        .nullable()
                        .required(t('this-field-is-required')),
                      email_annotations: yup.string().nullable(),
                      email_body: yup
                        .string()
                        .nullable()
                        .required(t('this-field-is-required')),
                      attachments: yup.array().nullable(),
                    }),
                  )
                  .nullable()
                  .when(
                    'is_with_actions',
                    (value, field) =>
                      (value
                        && field.min(
                          1,
                          `${t('Shared:please-add-at-least')} ${1} ${t(
                            `${translationPath}stage-action`,
                          )}`,
                        ))
                      || field,
                  ),
                // start for candidate actions
                is_with_candidate_actions: yup.boolean().nullable(),
                is_every_actions: yup.boolean().nullable(),
                candidate_actions: yup
                  .array()
                  .nullable()
                  .of(
                    yup.object().shape({
                      type: yup
                        .number()
                        .nullable()
                        .required(t('Shared:this-field-is-required')),
                      form_types: yup.array().of(yup.string()).nullable(),
                      // .when(
                      //   'type',
                      //   (value, field) =>
                      //     (value
                      //       && +value
                      //         === PipelineStageCandidateActionsEnum.Offers.key
                      //       && field.min(
                      //         1,
                      //         `${t('Shared:please-add-at-least')} ${1} ${t(
                      //           `${translationPath}form-type`
                      //         )}`
                      //       ))
                      //     || field
                      // ),
                    }),
                  )
                  .when(
                    'is_with_candidate_actions',
                    (value, field) =>
                      (value
                        && field.when(
                          'is_every_actions',
                          (subValue, subField) =>
                            (!subValue
                              && subField.min(
                                1,
                                `${t('Shared:please-add-at-least')} ${1} ${t(
                                  `${translationPath}candidate-action`,
                                )}`,
                              ))
                            || subField,
                        ))
                      || field,
                  ),
                //
                is_with_responsibility: yup.boolean().nullable(),
                is_everyone_move_in: yup.boolean().nullable(),
                responsible_move_in: yup
                  .array()
                  .nullable()
                  .of(
                    yup.object().shape({
                      relation_type: yup
                        .number()
                        .nullable()
                        .required(t('this-field-is-required')),
                      relation_uuid: yup
                        .string()
                        .nullable()
                        .required(t('this-field-is-required')),
                    }),
                  )
                  .when(
                    'is_with_responsibility',
                    (value, field) =>
                      (value
                        && field.when(
                          'is_everyone_move_in',
                          (subValue, subField) =>
                            (!subValue
                              && subField.min(
                                1,
                                `${t('Shared:please-add-at-least')} ${1} ${t(
                                  `${translationPath}responsible-to-move-candidate-in`,
                                )}`,
                              ))
                            || subField,
                        ))
                      || field,
                  ),
                is_everyone_move_out: yup.boolean().nullable(),
                responsible_move_out: yup
                  .array()
                  .nullable()
                  .of(
                    yup.object().shape({
                      relation_type: yup
                        .number()
                        .nullable()
                        .required(t('this-field-is-required')),
                      relation_uuid: yup
                        .string()
                        .nullable()
                        .required(t('this-field-is-required')),
                    }),
                  )
                  .when(
                    'is_with_responsibility',
                    (value, field) =>
                      (value
                        && field.when(
                          'is_everyone_move_out',
                          (subValue, subField) =>
                            (!subValue
                              && subField.min(
                                1,
                                `${t('Shared:please-add-at-least')} ${1} ${t(
                                  `${translationPath}responsible-to-move-candidate-out`,
                                )}`,
                              ))
                            || subField,
                        ))
                      || field,
                  ),
                responsible_move_to: yup
                  .array()
                  .nullable()
                  .of(
                    yup.object().shape({
                      relation_type: yup
                        .number()
                        .nullable()
                        .required(t('this-field-is-required')),
                      relation_uuid: yup
                        .string()
                        .nullable()
                        .required(t('this-field-is-required')),
                    }),
                  ),
                is_auto_move: yup.boolean().nullable(),
              }),
            )
            .nullable()
            .min(
              1,
              `${t('Shared:please-add-at-least')} ${1} ${t(
                `${translationPath}stage`,
              )}`,
            ),
        }),
      },
      state,
    );
    setErrors(result);
  }, [getActiveStagePreconditionTypeByKey, state, t, translationPath]);

  /**
   * @attachmentsUUIDs - Array of uuids
   * @statePaths - Object to the path for saving the results of full files
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the get for attachments details on change template or initialization
   */
  const getAttachmentsDetails = useCallback(
    async (attachmentsUUIDs = [], statePaths) => {
      if (attachmentsUUIDs.length === 0) return;
      const mediaResponse = await GetMultipleMedias({
        uuids: attachmentsUUIDs,
      });
      if (
        mediaResponse
        && mediaResponse.status === 200
        && mediaResponse.data.results.data.length > 0
      )
        setState({
          ...statePaths,
          value: mediaResponse.data.results.data.map((item) => item.original),
        });
      else showError(t('Shared:failed-to-get-uploaded-file'), mediaResponse);
    },
    [t],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return all saved stages
   */
  const getAllSavedStages = useMemo(
    () => (excludedUUID, currentStages) =>
      currentStages.filter((item) => item.uuid && item.uuid !== excludedUUID),
    [],
  );

  /**
   * @param {stageIndex, isRemove, isReorderStage, oldStageLocation}
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this is to identify which method has been changed but not saved yet
   */
  const onStageChanged = useCallback(
    ({ stageIndex, isRemove, isReorderStage, oldStageLocation }) => {
      if (isReorderStage) {
        const itemIndex = changedStagesRef.current.indexOf(oldStageLocation);
        if (itemIndex !== -1)
          changedStagesRef.current.splice(itemIndex, 1, stageIndex);
        return;
      }
      const itemIndex = changedStagesRef.current.indexOf(stageIndex);
      if (itemIndex === -1) changedStagesRef.current.push(stageIndex);
      if (isRemove && itemIndex !== -1)
        changedStagesRef.current.splice(itemIndex, 1);
    },
    [],
  );

  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this is to change the active focus stage
   */
  const onActiveStageChanged = useCallback((newValue) => {
    setActiveStage(newValue);
  }, []);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get update the state
   */
  const onStateChanged = useCallback(
    (newValue) => {
      setState(newValue);
      if (
        (newValue.parentIndex || newValue.parentIndex === 0)
        && newValue.id !== 'uuid'
      )
        onStageChanged({ stageIndex: newValue.parentIndex });
      if (activeTab === 1) isChangedPipelineRef.current = true;
    },
    [activeTab, onStageChanged],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get update the isLoading
   */
  const onIsLoadingChanged = (newValue) => {
    setIsLoading(newValue);
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get all stages on edit
   */
  const getAllEvaRecPipelineStages = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllEvaRecPipelineStages({
      uuid:
        (activeItem && activeItem.uuid)
        || (activePipelineItem && activePipelineItem.pipeline.uuid),
    });
    setIsLoading(false);
    if (response && response.status === 200) {
      setState({
        id: 'edit',
        value: {
          ...response.data.results.pipeline,
          stages: response.data.results.stages,
        },
      });
      // return the attachments details on initialization
      response.data.results.stages.map((stage, index) => {
        stage.actions.map((action, actionIndex) => {
          getAttachmentsDetails(action.attachments || [], {
            parentId: 'stages',
            parentIndex: index,
            subParentId: 'actions',
            subParentIndex: actionIndex,
            id: 'attachmentsFullFiles',
          });
          return undefined;
        });
        return undefined;
      });
    } else {
      showError(t('Shared:failed-to-get-saved-data'), response);
      if (isOpenChanged) isOpenChanged();
    }
  }, [activeItem, activePipelineItem, getAttachmentsDetails, isOpenChanged, t]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the name if the stages that will be removed
   */
  const getStagesNames = useCallback(
    () =>
      changedStagesRef.current && (
        <ul className="px-3 mb-0">
          {changedStagesRef.current.map((item) => (
            <li key={`stagesKeys${item}`}>
              {state.stages[item].title
                || `${t(`${translationPath}stage-#`)} ${item + 1}`}
            </li>
          ))}
        </ul>
      ),
    [state.stages, t, translationPath],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the close for the staging dialog
   */
  const onCancelHandler = useCallback(() => {
    // || isChangedPipelineRef.current
    if (changedStagesRef.current.length > 0) setIsOpenConfirmDialog(true);
    else if (isOpenChanged) isOpenChanged();
  }, [isOpenChanged]);

  /**
   * @param key - expected values 'actions', 'team-workflow'
   * @param itemIndex - collapse item index
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the toggle for the collapses
   */
  const collapseToggleHandler = useCallback(
    (key, itemIndex = undefined) =>
      () => {
        if (key === 'actions') setIsOpenActionsCollapse((item) => !item);
        if (key === 'precondition') setIsOpenPreconditionCollapse((item) => !item);
        if (key === 'team-workflow') setIsOpenTeamWorkflowCollapse((item) => !item);
        if (key === 'action')
          setOpenActionCollapseIndex((item) =>
            itemIndex !== item ? itemIndex : null,
          );
      },
    [],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get all pipeline annotations
   */
  const getAllPipelineAnnotations = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllPipelineAnnotations();
    setIsLoading(false);
    if (response && response.status === 200)
      setEmailAnnotations(response.data.results.keys);
    else {
      showError(t('Shared:failed-to-get-saved-data'), response);
      if (isOpenChanged) isOpenChanged();
    }
  }, [isOpenChanged, t]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get all pipeline questionnaires on edit
   */
  const getAllPipelineQuestionnaires = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllPipelineQuestionnaires({
      pipeline_uuid: state.uuid,
    });
    setIsLoading(false);
    if (response && response.status === 200)
      setPipelineQuestionnaires(response.data.results);
    else {
      showError(t('Shared:failed-to-get-saved-data'), response);
      if (isOpenChanged) isOpenChanged();
    }
  }, [isOpenChanged, state.uuid, t]);

  const activeStageOpenInvalidCollapsesHandler = useCallback(
    (stageIndex) => {
      if (
        Object.keys(errors).some((item) =>
          item.includes(`stages[${stageIndex}].actions`),
        )
      ) {
        if (!isOpenActionsCollapse) collapseToggleHandler('actions')();
        const firstInvalidAction = Object.keys(errors).find((item) =>
          item.includes(`stages[${stageIndex}].actions`),
        );
        if (firstInvalidAction && firstInvalidAction.includes('.type')) return;
        const invalidActionIndex
          = firstInvalidAction
          && firstInvalidAction.split('actions[').pop().split('].')[0];
        if (invalidActionIndex && openActionCollapseIndex !== +invalidActionIndex)
          collapseToggleHandler('action', +invalidActionIndex)();
      }
      if (
        !isOpenTeamWorkflowCollapse
        && Object.keys(errors).some((item) =>
          item.includes(`stages[${stageIndex}].workflows`),
        )
      )
        collapseToggleHandler('team-workflow')();
      if (
        !isOpenPreconditionCollapse
        && Object.keys(errors).some((item) =>
          item.includes(`stages[${stageIndex}].precondition`),
        )
      )
        collapseToggleHandler('precondition')();
    },
    [
      collapseToggleHandler,
      errors,
      isOpenActionsCollapse,
      isOpenPreconditionCollapse,
      isOpenTeamWorkflowCollapse,
      openActionCollapseIndex,
    ],
  );

  /**
   * @param index
   * @param isLastStageChanged - if it's the last unsaved changed stage
   * @param isBulkSaving - if this method called from template save button
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle saving for each stage
   */
  const saveStagesHandler = async (index, isLastStageChanged, isBulkSaving) => {
    if (changedStagesRef.current.indexOf(index) === -1) return;
    if (Object.keys(errors).length > 0) {
      if (errors.stages) {
        showError(errors.stages.message);
        return;
      }
      if (Object.keys(errors).some((item) => item.includes(`stages[${index}]`))) {
        activeStageOpenInvalidCollapsesHandler(index);
        return;
      }
    }
    setIsLoading(true);
    let response;
    if (state.stages[index].uuid)
      response = await UpdatePipelineStage(state.stages[index]);
    else response = await CreatePipelineStage(state.stages[index]);
    setIsLoading(false);
    if (response && (response.status === 201 || response.status === 202)) {
      if (!isBulkSaving || isLastStageChanged)
        showSuccess(
          t(
            `${translationPath}${
              (state.stages[index].uuid && 'stage-updated-successfully')
              || 'stage-created-successfully'
            }`,
          ),
        );
      if (isLastStageChanged && Object.keys(errors).length === 0) {
        if (onSave) onSave();
        if (isOpenChanged) isOpenChanged();
      } else if (!isBulkSaving) {
        const changedStageLocation = changedStagesRef.current.indexOf(index);
        if (changedStageLocation !== -1)
          changedStagesRef.current.splice(changedStageLocation, 1);
        onStateChanged({
          parentId: 'stages',
          parentIndex: index,
          id: 'uuid',
          value: response.data.results.uuid,
        });
        if (Object.keys(errors).length > 0) {
          const firstInvalidStageIndex = Object.keys(errors).findIndex((item) =>
            item.startsWith('stages'),
          );
          if (firstInvalidStageIndex !== -1) setActiveStage(firstInvalidStageIndex);
          else setActiveTab(1);
        }
      }
    } else
      showError(
        t(
          `${translationPath}${
            (activeItem && 'stage-update-failed') || 'stage-create-failed'
          }`,
        ),
        response,
      );
  };

  /**
   * @param index
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle saving the stages & pipeline template
   */
  const saveHandler = (index) => async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (
      changedStagesRef.current.length === 0
      && !isChangedPipelineRef.current
      && Object.keys(errors).length === 0
    ) {
      if (isOpenChanged) isOpenChanged();
      return;
    }
    if (index === -1 || isChangedPipelineRef.current) {
      const keys = Object.keys(errors);
      if (index === -1 && keys.length) {
        if (keys.every((key) => key.startsWith('stages'))) {
          setActiveTab(0);
          // to open the first (changed) invalid stage then its collapses if (has errors)
          const firstInvalidStage = Object.keys(errors).find(
            (item) =>
              item.startsWith(`stages[`)
              && changedStagesRef.current.includes(
                +item.split('stages[').pop().split('].')[0],
              ),
          );
          const invalidStageIndex
            = firstInvalidStage
            && firstInvalidStage.split('stages[').pop().split('].')[0];
          if (invalidStageIndex) {
            setActiveStage(+invalidStageIndex);
            activeStageOpenInvalidCollapsesHandler(+invalidStageIndex);
          }
        }
        if (errors.stages) showError(errors.stages.message);
        return;
      }

      if (isChangedPipelineRef.current) {
        setIsLoading(true);
        const response = await UpdateEvaRecPipelineTemplate(state);
        setIsLoading(false);
        if (response && response.status === 202)
          if (!changedStagesRef.current.length && isOpenChanged) {
            showSuccess(t(`${translationPath}template-saved-successfully`));
            if (onSave) onSave();
            isOpenChanged();
          } else
            changedStagesRef.current.map((item, i, items) =>
              saveStagesHandler(item, i === items.length - 1, true),
            );
        else showError(t(`${translationPath}template-save-failed`), response);
      } else
        changedStagesRef.current.map((item, i, items) =>
          saveStagesHandler(item, i === items.length - 1, true),
        );
    } else await saveStagesHandler(index, changedStagesRef.current.length === 1);
  };

  // this is to get the saved stages by pipeline uuid on init
  useEffect(() => {
    if (activeItem || activePipelineItem) getAllEvaRecPipelineStages();
  }, [activeItem, activePipelineItem, getAllEvaRecPipelineStages]);

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  // This is to return all email annotations
  useEffect(() => {
    getAllPipelineAnnotations();
  }, [getAllPipelineAnnotations]);

  // This is to return all email annotations
  useEffect(() => {
    if (state.uuid) getAllPipelineQuestionnaires();
  }, [getAllPipelineQuestionnaires, state.uuid]);

  return (
    <DialogComponent
      isWithFullScreen
      titleText={`${(activeItem && 'edit-template') || 'add-new-template'}`}
      maxWidth="lg"
      // maxWidth="xs"
      contentFooterClasses="px-0 pb-0"
      contentClasses="px-0 pb-0"
      wrapperClasses="pipeline-template-dialog-wrapper"
      dialogContent={
        <div className="pipeline-template-management-dialog-content-wrapper">
          <TabsComponent
            isPrimary
            isWithLine
            labelInput="label"
            idRef="pipelineTemplatesTabsRef"
            data={pipelineTemplatesTabsData}
            currentTab={activeTab}
            translationPath={translationPath}
            onTabChanged={(event, currentTab) => {
              setActiveTab(currentTab);
            }}
            parentTranslationPath={parentTranslationPath}
            dynamicComponentProps={{
              state,
              isSubmitted,
              isLoading,
              errors,
              saveHandler,
              isOpenChanged,
              activeItem,
              activePipelineItem,
              activeStage,
              collapseToggleHandler,
              onActiveStageChanged,
              onStateChanged,
              openActionCollapseIndex,
              isOpenActionsCollapse,
              isOpenTeamWorkflowCollapse,
              isOpenPreconditionCollapse,
              onIsLoadingChanged,
              getAllSavedStages,
              onCancelHandler,
              onStageChanged,
              changedStagesRef,
              emailAnnotations,
              pipelineQuestionnaires,
              parentTranslationPath,
              translationPath,
            }}
          />
          {isOpenConfirmDialog && (
            <ConfirmDeleteDialog
              isConfirmOnly
              onSave={() => {
                if (isOpenChanged) isOpenChanged();
              }}
              saveType="button"
              isOpenChanged={() => {
                setIsOpenConfirmDialog(false);
              }}
              descriptionMessage="close-confirm-description"
              extraDescription={getStagesNames()}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              isOpen={isOpenConfirmDialog}
            />
          )}
        </div>
      }
      isSaving={isLoading}
      isOpen={isOpen}
      // dialogActions={(
      //   <div className="w-100 px-3 pb-3">
      //     <ButtonBase
      //       className="btns theme-solid w-100 mx-0 p-3"
      //       disabled={isLoading}
      //       onClick={addStageHandler}
      //     >
      //       <LoaderComponent
      //         isLoading={isLoading}
      //         isSkeleton
      //         wrapperClasses="position-absolute w-100 h-100"
      //         skeletonStyle={{ width: '100%', height: '100%' }}
      //       />
      //       <span>{t(`${translationPath}add-stage`)}</span>
      //     </ButtonBase>
      //   </div>
      // )}
      onCloseClicked={onCancelHandler}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

PipelineTemplatesManagementDialog.propTypes = {
  activePipelineItem: PropTypes.instanceOf(Object),
  activeItem: PropTypes.instanceOf(Object),
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
  onSave: PropTypes.func,
};
PipelineTemplatesManagementDialog.defaultProps = {
  activeItem: undefined,
  activePipelineItem: undefined,
  isOpenChanged: undefined,
  onSave: undefined,
  translationPath: 'PipelineTemplatesManagementDialog.',
};
