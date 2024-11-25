import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import {
  getErrorByName,
  getIsAllowedPermissionV2,
  showError,
  showSuccess,
} from '../../../../../../../../helpers';
import * as yup from 'yup';
import { DialogComponent } from '../../../../../../../../components';
import { ScorecardAssigneeTypesEnum } from '../../../../../../../../enums';
import ButtonBase from '@mui/material/ButtonBase';

import ScorecardAssignComponent from '../../../../../../create/components/scorecard-assign/ScorecardAssign.Component';
import { ScorecardReminderDialog } from './ScorcardReminder.Dialog';
import {
  AssignScorecardMembers,
  AssignScorecardMembersToCandidate,
} from '../../../../../../../../services';
import item from '../../../../../../../evassess/pipeline/Item';
import { ScorecardPermissions } from '../../../../../../../../permissions';
import { useSelector } from 'react-redux';
const parentTranslationPath = 'EvaRecPipelines';
const translationPath = 'AssignScorecardDialog.';
export const AssignScorecardDialog = ({
  job_uuid,
  pipeline_uuid,
  job_pipeline_uuid,
  titleText,
  isOpen,
  onSave,
  isOpenChanged,
  scorecardData,
  scorecard_uuid,
  jobRequisitionUUID,
  candidateScorecardUUID,
  isReminderDisabled,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );
  const [errors, setErrors] = useState(() => ({}));
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenReminder, setIsOpenReminder] = useState(false);
  const [scorecardState, setScorecardState] = useState({
    decision_makers: [],
    committee_members: [],
    score_card_uuid: {},
    has_reminder: true,
    message: '',
    period_type: '',
    period: '',
  });
  const saveHandler = async (event) => {
    event.preventDefault();
    if (Object.keys(errors).length > 0) {
      if (errors.committee_members) showError(errors.committee_members.message);
      if (errors.decision_makers) showError(errors.decision_makers.message);
      return;
    }

    setIsLoading(true);
    const response = await (candidateScorecardUUID
      ? AssignScorecardMembersToCandidate
      : AssignScorecardMembers)({
      ...scorecardState,
      committee_members: scorecardState?.committee_members.map(
        (item) => item?.value,
      ),
      decision_makers: scorecardState?.decision_makers.map((item) => item?.value),
      job_score_card_uuid: scorecardData?.uuid,
    });
    setIsLoading(false);
    if (response?.status === 200) {
      showSuccess(t(`${translationPath}members-assigned-success`));
      if (onSave)
        onSave({
          value: {
            ...(response?.data?.results || {}),
            has_reminder: scorecardState.has_reminder,
            period_type: scorecardState.period_type,
            period: scorecardState.period,
          },
          isReload: true,
        });
      isOpenChanged();
    } else showError(t(`${translationPath}failed-assign-members`), response);
  };

  const getEditInit = useCallback(async () => {
    if (scorecardData)
      setScorecardState({
        decision_makers:
          scorecardData?.decision_makers?.map((item) => ({
            ...item,
            value: item.uuid,
            type: ScorecardAssigneeTypesEnum.UsersAndEmployees.type,
          })) || [],
        committee_members:
          scorecardData?.committee_members?.map((item) => ({
            ...item,
            value: item.uuid,
            type: ScorecardAssigneeTypesEnum.UsersAndEmployees.type,
          })) || [],
        score_card_uuid: {
          uuid: scorecard_uuid,
          min_committee_members:
            scorecardData?.card_setting?.min_committee_members || '',
        },
        has_reminder: scorecardData?.has_reminder,
        period_type: scorecardData?.period_type,
        period: scorecardData?.period,
        candidate_score_card_uuid: candidateScorecardUUID,
      });
  }, [scorecardData, scorecard_uuid, candidateScorecardUUID]);

  useEffect(() => {
    getEditInit();
  }, [getEditInit]);

  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: yup.object().shape({
          decision_makers: yup
            .array()
            .nullable()
            .min(
              1,
              `${t('Shared:please-select-at-least')} ${1} ${t(
                `${translationPath}decision-makers`,
              )}`,
            ),
          committee_members: yup
            .array()
            .nullable()
            .min(
              scorecardState?.score_card_uuid?.min_committee_members || 1,
              `${t('Shared:please-select-at-least')} ${
                scorecardState?.score_card_uuid?.min_committee_members || 1
              } ${t(`${translationPath}assign-members`)}`,
            ),
        }),
      },
      scorecardState,
    ).then((result) => {
      setErrors(result);
    });
  }, [scorecardState, t]);

  useEffect(() => {
    getErrors();
  }, [getErrors]);

  const onSaveReminder = ({ value }) => {
    setScorecardState((items) => ({
      ...items,
      has_reminder: value.has_reminder,
      period_type: value.period_type,
      period: value.period,
    }));
    if (onSave) onSave({ value });
  };

  return (
    <DialogComponent
      maxWidth="sm"
      titleText={titleText}
      contentClasses="px-0"
      dialogContent={
        <div className="px-4">
          <ScorecardAssignComponent
            jobUUID={job_uuid}
            isViewCommittee={true}
            isViewDecisionMakers={true}
            isViewReminder={true}
            isViewMessage={true}
            form={scorecardState}
            setForm={setScorecardState}
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            jobRequisitionUUID={jobRequisitionUUID}
            isAssignDisabled={
              !getIsAllowedPermissionV2({
                permissionId: ScorecardPermissions.ScorecardEditAssignee.key,
                permissions: permissionsReducer,
              })
            }
          />
          <div className="d-flex ">
            <ButtonBase
              className="btns theme-transparent miw-0 text-gray mx-0"
              disabled={isLoading || isReminderDisabled}
              onClick={() => setIsOpenReminder(true)}
            >
              {t(`${translationPath}manage-settings`)}
              <span className="fas fa-arrow-up px-2 rotate-45-reverse pt-1" />
            </ButtonBase>
          </div>
          {isOpenReminder && (
            <ScorecardReminderDialog
              isOpen={isOpenReminder}
              isOpenChanged={() => setIsOpenReminder(false)}
              scorecardData={{ ...scorecardData, ...scorecardState }}
              dataKey={'committee_members'}
              // onSave={onSave}
              candidateScorecardUUID={candidateScorecardUUID}
              onSaveReminder={onSaveReminder}
            />
          )}
        </div>
      }
      contentFooterClasses="px-0"
      saveCancelWrapperClasses="px-3"
      isSaving={isLoading}
      isOpen={isOpen}
      saveText="assign"
      cancelText="discard"
      onSubmit={saveHandler}
      onCloseClicked={isOpenChanged}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

AssignScorecardDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  titleText: PropTypes.string,
  scorecardData: PropTypes.instanceOf(Object),
  job_uuid: PropTypes.string,
  onSave: PropTypes.func,
  isOpenChanged: PropTypes.func,
  scorecard_uuid: PropTypes.string,
  jobRequisitionUUID: PropTypes.string,
  candidateScorecardUUID: PropTypes.string,
};
AssignScorecardDialog.defaultProps = {
  titleText: 'assign-members-title',
};
