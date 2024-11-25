import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { AssignCandidatesTabs } from '../assign-candidates-to-users/AssignCandidates.Tabs';
import {
  AssessmentTestMembersTypeEnum,
  AvatarsThemesEnum,
  DynamicFormTypesEnum,
  PipelineBulkSelectTypesEnum,
} from '../../../../../../../../../enums';
import {
  AvatarsComponent,
  DialogComponent,
  SwitchComponent,
} from '../../../../../../../../../components';
import {
  SetupsReducer,
  SetupsReset,
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
} from '../../../../../../../../setups/shared';
import {
  ATSPipelineActionsExport,
  GetAllFormsByFeature,
} from '../../../../../../../../../services';
import FormMembersPopover from '../../../../../../../../form-builder-v2/popovers/FormMembers.Popover';
import {
  getErrorByName,
  showError,
  showSuccess,
} from '../../../../../../../../../helpers';
import { useTranslation } from 'react-i18next';
import { array, number, object, string } from 'yup';
import { PipelineExportUsersTypesEnum } from '../../../../../../../../../enums/Shared/PipelineExportUsersTypes.Enum';
import { PipelineExportTypesEnum } from '../../../../../../../../../enums/Shared/PipelineExportTypes.Enum';
import PropTypes from 'prop-types';
import * as yup from 'yup';

const ExportDialog = ({
  job_uuid,
  job_pipeline_uuid,
  pipeline_uuid,
  selectedCandidates,
  isOpen,
  onSave,
  isOpenChanged,
  parentTranslationPath = 'EvaRecPipelines',
  translationPath = 'ExportDialog.',
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [membersPopoverProps, setMembersPopoverProps] = useState({});
  const [errors, setErrors] = useState(() => ({}));
  const [popoverAttachedWith, setPopoverAttachedWith] = useState({
    members: null,
  });

  const [pipelineExportTypesEnum] = useState(
    Object.values(PipelineExportTypesEnum).map((item) => ({
      ...item,
      value: t(`${translationPath}${item.value}`),
    })),
  );

  const stateInitRef = useRef({
    features: [],
    job_uuid,
    job_candidates: [],
    is_with_all_forms: true,
    forms: [],
    is_with_all_offers: true,
    offers: [],
  });
  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );
  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: object().shape({
          features: array(string())
            .nullable()
            .min(1, t('Shared:this-field-is-required'))
            .required(t('Shared:this-field-is-required')),
          job_uuid: string().nullable().required(t('Shared:this-field-is-required')),
          job_candidates: array()
            .of(
              object().shape({
                type: number().nullable(),
                uuid: string().nullable(),
                name: object().nullable(),
              }),
            )
            .nullable()
            .required(
              `${t('Shared:please-select-at-least')} ${1} ${t(
                `${translationPath}member`,
              )}`,
            )
            .min(
              1,
              `${t('Shared:please-select-at-least')} ${1} ${t(
                `${translationPath}member`,
              )}`,
            ),
          is_with_all_forms: yup.boolean().nullable(),
          forms: yup
            .array()
            .nullable()
            .when(
              'is_with_all_forms',
              (value, field) =>
                (!value
                  && field
                    .required(
                      `${t('Shared:please-select-at-least')} ${1} ${t(
                        `${translationPath}form`,
                      )}`,
                    )
                    .min(
                      1,
                      `${t('Shared:please-select-at-least')} ${1} ${t(
                        `${translationPath}form`,
                      )}`,
                    ))
                || field,
            ),
          is_with_all_offers: yup.boolean().nullable(),
          offers: yup
            .array()
            .nullable()
            .when(
              'is_with_all_offers',
              (value, field) =>
                (!value
                  && field
                    .required(
                      `${t('Shared:please-select-at-least')} ${1} ${t(
                        `${translationPath}offer`,
                      )}`,
                    )
                    .min(
                      1,
                      `${t('Shared:please-select-at-least')} ${1} ${t(
                        `${translationPath}offer`,
                      )}`,
                    ))
                || field,
            ),
        }),
      },
      state,
    ).then((result) => {
      setErrors(result);
    });
  }, [state, t, translationPath]);

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
  // Send assessment or reminder depending on isReminder prop
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) {
      if (errors.name) showError(errors.name.message);
      return;
    }
    setIsSaving(true);
    const response = await ATSPipelineActionsExport(state);
    setIsSaving(false);
    if (response && (response.status === 201 || response.status === 200)) {
      showSuccess(t(`${translationPath}reports-exported-successfully`));
      if (onSave) onSave();
      if (isOpenChanged) isOpenChanged();
    } else showError(t(`${translationPath}report-export-failed`), response);
  };
  // Reshape the selected candidates JSON
  const getEditInit = useCallback(async () => {
    const localSelectedCandidates = selectedCandidates.map(
      (item) =>
        (item.bulkSelectType === PipelineBulkSelectTypesEnum.Stage.key && {
          type: PipelineExportUsersTypesEnum.JobStage.key,
          uuid: item.stage.uuid,
          name: item.stage.title,
        }) || {
          type: PipelineExportUsersTypesEnum.JobCandidate.key,
          uuid: item.candidate.uuid,
          stage_uuid: item.stage.uuid,
          name: item.candidate.name,
        },
    );
    setState({
      id: 'job_candidates',
      value: localSelectedCandidates,
    });
  }, [selectedCandidates]);

  useEffect(() => {
    if (selectedCandidates && selectedCandidates.length > 0) void getEditInit();
  }, [selectedCandidates, getEditInit]);

  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  return (
    <DialogComponent
      maxWidth="sm"
      titleText="export"
      contentClasses="px-0"
      dialogContent={
        <div className="export-management-content-dialog-wrapper">
          <div className="box-field-wrapper">
            <div className="inline-label-wrapper">
              <span>{t(`${translationPath}members`)}</span>
            </div>
            <div
              className="invite-box-wrapper"
              onClick={(event) => {
                setMembersPopoverProps({
                  arrayKey: 'job_candidates',
                  popoverTabs: AssignCandidatesTabs,
                  values: state.invitedMember,
                  getListAPIProps: ({ type }) => ({
                    job_uuid,
                    pipeline_uuid,
                    job_pipeline_uuid,
                    ...(type !== AssessmentTestMembersTypeEnum.JobStage.key
                      && state.job_candidates
                      && state.job_candidates.length > 0 && {
                      with_than: state.job_candidates
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
                {state.job_candidates.map((item, index, items) => (
                  <AvatarsComponent
                    key={`selectedCandidatesKey${item.uuid}`}
                    avatar={item}
                    avatarImageAlt="member"
                    onTagBtnClicked={onAvatarDeleteClicked(
                      index,
                      items,
                      'job_candidates',
                    )}
                    avatarTheme={AvatarsThemesEnum.TagAvatar.theme}
                    translationPath={translationPath}
                    parentTranslationPath={parentTranslationPath}
                  />
                ))}
                <span
                  className={`c-gray-primary px-2 pb-2${
                    (state.job_candidates.length > 0 && ' mt-2') || ''
                  }`}
                >
                  {t(`${translationPath}search-members`)}
                </span>
              </div>
            </div>
          </div>
          <div className="box-field-wrapper mt-3 mb-0">
            <div className="inline-label-wrapper"></div>
            {errors.job_candidates && errors.job_candidates.error && isSubmitted && (
              <div className="c-error fz-10 mb-3 px-2">
                <span>{errors.job_candidates.message}</span>
              </div>
            )}
          </div>
          <div className="box-field-wrapper">
            <SharedAutocompleteControl
              isFullWidth
              inlineLabel="features"
              placeholder="select-features"
              errors={errors}
              stateKey="features"
              searchKey="search"
              editValue={state?.features}
              isSubmitted={isSubmitted}
              initValues={pipelineExportTypesEnum}
              onValueChanged={(newValue) => {
                if (
                  !state.is_with_all_offers
                  && !newValue.value.includes(PipelineExportTypesEnum.Offer.key)
                )
                  onStateChanged({
                    id: 'destructObject',
                    value: {
                      offers: [],
                      is_with_all_offers: true,
                    },
                  });

                if (
                  !state.is_with_all_forms
                  && !newValue.value.includes(PipelineExportTypesEnum.Form.key)
                )
                  onStateChanged({
                    id: 'destructObject',
                    value: {
                      forms: [],
                      is_with_all_forms: true,
                    },
                  });

                onStateChanged(newValue);
              }}
              type={DynamicFormTypesEnum.array.key}
              errorPath="features"
              initValuesTitle="value"
              initValuesKey="key"
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          </div>
          {state.features.includes(PipelineExportTypesEnum.Offer.key) && (
            <div className="d-flex-v-center mb-2">
              <span>
                <SwitchComponent
                  idRef="isWithOffersRef"
                  isChecked={state.is_with_all_offers}
                  label="is-with-all-offers"
                  switchLabelClasses="c-black-lighter"
                  isReversedLabel
                  isFlexEnd
                  onChange={(event, isChecked) => {
                    onStateChanged({
                      id: 'is_with_all_offers',
                      value: isChecked,
                    });
                  }}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              </span>
            </div>
          )}
          {!state.is_with_all_offers && (
            <SharedAPIAutocompleteControl
              isFullWidth
              title="offers"
              placeholder="select-offers"
              stateKey="offers"
              onValueChanged={onStateChanged}
              getDataAPI={GetAllFormsByFeature}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              searchKey="search"
              controlWrapperClasses="mb-0"
              extraProps={{
                with_than: state.offers,
                job_uuid: state.job_uuid,
                assign: state.job_candidates,
                feature: PipelineExportTypesEnum.Offer.key,
              }}
              editValue={state.offers || []}
              isSubmitted={isSubmitted}
              errors={errors}
              errorPath="offers"
              getOptionLabel={(option) =>
                `${option.title} (${option.candidate_name || 'N/A'})`
              }
              type={DynamicFormTypesEnum.array.key}
            />
          )}
          {state.features.includes(PipelineExportTypesEnum.Form.key) && (
            <div className="d-flex-v-center mb-2">
              <span>
                <SwitchComponent
                  idRef="isWithFormsRef"
                  isChecked={state.is_with_all_forms}
                  label="is-with-all-forms"
                  switchLabelClasses="c-black-lighter"
                  isReversedLabel
                  isFlexEnd
                  onChange={(event, isChecked) => {
                    onStateChanged({
                      id: 'is_with_all_forms',
                      value: isChecked,
                    });
                  }}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              </span>
            </div>
          )}
          {!state.is_with_all_forms && (
            <SharedAPIAutocompleteControl
              isFullWidth
              title="forms"
              placeholder="select-forms"
              stateKey="forms"
              onValueChanged={onStateChanged}
              getDataAPI={GetAllFormsByFeature}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              searchKey="search"
              controlWrapperClasses="mb-0"
              extraProps={{
                with_than: state.forms,
                assign: state.job_candidates,
                job_uuid: state.job_uuid,
                feature: PipelineExportTypesEnum.Form.key,
              }}
              editValue={state.forms || []}
              isSubmitted={isSubmitted}
              errors={errors}
              errorPath="forms"
              getOptionLabel={(option) =>
                `${option.title} (${option.candidate_name || 'N/A'})`
              }
              type={DynamicFormTypesEnum.array.key}
            />
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
                if (membersPopoverProps.arrayKey === 'job_candidates') {
                  localState.job_candidates = [];
                  if (
                    localNewValues.job_candidates.length
                      === state.job_candidates.length
                    && !localNewValues.job_candidates.some((item) =>
                      state.job_candidates.some(
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
        </div>
      }
      wrapperClasses="export-management-dialog-wrapper"
      isSaving={isSaving}
      saveText="export"
      isOpen={isOpen}
      onSubmit={saveHandler}
      onCancelClicked={isOpenChanged}
      onCloseClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

ExportDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  onSave: PropTypes.func,
  job_uuid: PropTypes.string.isRequired,
  pipeline_uuid: PropTypes.string.isRequired,
  job_pipeline_uuid: PropTypes.string.isRequired,
  selectedCandidates: PropTypes.arrayOf(
    PropTypes.shape({
      stage: PropTypes.instanceOf(Object),
      candidate: PropTypes.instanceOf(Object),
      bulkSelectType: PropTypes.number,
    }),
  ).isRequired,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
};

export default ExportDialog;
