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
  showError,
  showSuccess,
} from '../../../../../../../../../helpers';
import * as yup from 'yup';
import {
  AvatarsComponent,
  DialogComponent,
} from '../../../../../../../../../components';
import {
  AssessmentTestMembersTypeEnum,
  AssignCandidatesToUsersTypesEnum,
  AssigneeTypesEnum,
  AvatarsThemesEnum,
  DynamicFormTypesEnum,
  PipelineBulkSelectTypesEnum,
} from '../../../../../../../../../enums';
import FormMembersPopover from '../../../../../../../../form-builder-v2/popovers/FormMembers.Popover';

import '../FormInviteManagement.Style.scss';
import { AssignCandidatesTabs } from './AssignCandidates.Tabs';
import {
  ATSUpdateAssignedUser,
  GetAllSetupsUsers,
  getSetupsUsersById,
} from '../../../../../../../../../services';
import i18next from 'i18next';

export const AssignCandidatesToUsersDialog = ({
  job_uuid,
  pipeline_uuid,
  job_pipeline_uuid,
  selectedCandidates,
  titleText,
  isOpen,
  isOpenChanged,
  parentTranslationPath,
  translationPath,
  onSave,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [membersPopoverProps, setMembersPopoverProps] = useState({});
  const [errors, setErrors] = useState(() => ({}));
  const [popoverAttachedWith, setPopoverAttachedWith] = useState({
    members: null,
  });

  const stateInitRef = useRef({
    invitedMember: [],
    assigned_user_uuid: null,
    assigned_user_type: null,
  });
  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );
  const [assigneeTypes] = useState(
    Object.values(AssigneeTypesEnum).map((item) => ({
      ...item,
      value: t(`${translationPath}${item.value}`),
    })),
  );

  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: yup.object().shape({
          assigned_user_uuid: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          assigned_user_type: yup
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
    const localeState = {
      candidate_uuid: state?.invitedMember,
      assigned_user_uuid: state?.assigned_user_uuid,
      assigned_user_type: state?.assigned_user_type,
      job_uuid,
    };
    setIsSaving(true);
    const response = await ATSUpdateAssignedUser(localeState);
    setIsSaving(false);
    if (response && (response.status === 201 || response.status === 200)) {
      showSuccess(t(`${translationPath}user-employee-assigned-successfully`));
      if (onSave) onSave();
      if (isOpenChanged) isOpenChanged();
    } else showError(t(`${translationPath}user-employee-assign-failed`), response);
  };
  // Reshape the selected candidates JSON
  const getEditInit = useCallback(async () => {
    const localSelectedCandidates = selectedCandidates.map(
      (item) =>
        (item.bulkSelectType === PipelineBulkSelectTypesEnum.Stage.key && {
          type: AssignCandidatesToUsersTypesEnum.JobStage.key,
          uuid: item.stage.uuid,
          name: item.stage.title,
        }) || {
          type: AssignCandidatesToUsersTypesEnum.JobCandidate.key,
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
              <span>{t(`${translationPath}invited-members`)}</span>
            </div>
            <div
              className="invite-box-wrapper"
              onClick={(event) => {
                setMembersPopoverProps({
                  arrayKey: 'invitedMember',
                  popoverTabs: AssignCandidatesTabs,
                  values: state.invitedMember,
                  getListAPIProps: ({ type }) => ({
                    job_uuid: job_uuid,
                    pipeline_uuid,
                    job_pipeline_uuid,
                    ...(type !== AssessmentTestMembersTypeEnum.JobStage.key
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
            <SharedAutocompleteControl
              isFullWidth
              inlineLabel="assignee-type"
              placeholder="select-assignee-type"
              errors={errors}
              stateKey="assigned_user_type"
              searchKey="search"
              editValue={state?.assigned_user_type}
              isSubmitted={isSubmitted}
              initValues={assigneeTypes}
              onValueChanged={(newValue) => {
                const localState = {
                  ...state,
                  assigned_user_type: newValue.value,
                  assigned_user_uuid: '',
                };
                onStateChanged({ id: 'edit', value: localState });
              }}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              errorPath="assigned_user_type"
              initValuesTitle={'value'}
              initValuesKey="key"
            />
          </div>
          <div className="box-field-wrapper">
            {state.assigned_user_type && (
              <>
                {state.assigned_user_type === AssigneeTypesEnum.Employee.key && (
                  <SharedAPIAutocompleteControl
                    isFullWidth
                    inlineLabel="assignee"
                    stateKey="assigned_user_uuid"
                    errorPath="assigned_user_uuid"
                    placeholder="select-assignee"
                    onValueChanged={onStateChanged}
                    idRef="assignee"
                    getOptionLabel={(option) =>
                      `${
                        option.first_name
                        && (option.first_name[i18next.language] || option.first_name.en)
                      }${
                        option.last_name
                        && ` ${
                          option.last_name[i18next.language] || option.last_name.en
                        }`
                      }${
                        (!option.has_access
                          && state.assignee !== option.uuid
                          && ` ${t('Shared:dont-have-permissions')}`)
                        || ''
                      }`
                    }
                    type={DynamicFormTypesEnum.select.key}
                    getDataAPI={GetAllSetupsUsers}
                    getItemByIdAPI={getSetupsUsersById}
                    errors={errors}
                    isSubmitted={isSubmitted}
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                    searchKey="search"
                    editValue={state.assigned_user_uuid}
                    extraProps={{
                      committeeType: 'all',
                      ...(state.assigned_user_uuid && {
                        with_than: [state.assigned_user_uuid],
                      }),
                    }}
                    getDisabledOptions={(option) => !option.has_access}
                  />
                )}
                {state.assigned_user_type === AssigneeTypesEnum.User.key && (
                  <SharedAPIAutocompleteControl
                    isFullWidth
                    inlineLabel="assignee"
                    stateKey="assigned_user_uuid"
                    errorPath="assigned_user_uuid"
                    placeholder="select-assignee"
                    onValueChanged={onStateChanged}
                    editValue={state.assigned_user_uuid}
                    searchKey="search"
                    getDataAPI={GetAllSetupsUsers}
                    errors={errors}
                    isSubmitted={isSubmitted}
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                    getOptionLabel={(option) =>
                      `${
                        option.first_name
                        && (option.first_name[i18next.language] || option.first_name.en)
                      }${
                        option.last_name
                        && ` ${
                          option.last_name[i18next.language] || option.last_name.en
                        }`
                      }`
                    }
                    extraProps={{
                      ...(state.assigned_user_uuid && {
                        with_than: [state.assigned_user_uuid],
                      }),
                    }}
                  />
                )}
              </>
            )}
          </div>

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
        </div>
      }
      wrapperClasses="form-invite-management-dialog-wrapper"
      isSaving={isSaving}
      isOpen={isOpen}
      onSubmit={saveHandler}
      onCancelClicked={isOpenChanged}
      onCloseClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

AssignCandidatesToUsersDialog.propTypes = {
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
  titleText: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
};
AssignCandidatesToUsersDialog.defaultProps = {
  titleText: 'assign-candidates-to-user-employee',
  parentTranslationPath: 'EvaRecPipelines',
  translationPath: 'AssignCandidatesDialog.',
};
