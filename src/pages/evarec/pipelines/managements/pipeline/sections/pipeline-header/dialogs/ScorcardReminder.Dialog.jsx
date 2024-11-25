import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import {
  getErrorByName,
  showError,
  showSuccess,
} from '../../../../../../../../helpers';
import * as yup from 'yup';
import {
  AvatarsComponent,
  DialogComponent,
} from '../../../../../../../../components';
import {
  AvatarsThemesEnum,
  ScorecardAssigneeTypesEnum,
  WorkflowsPeriodTypesEnum,
} from '../../../../../../../../enums';

import './ScorecardReminder.Style.scss';
import Hint from '../../../../../../../recruiter-preference/Scorecard/ScorecaredBuilder/components/BulbHint/Hint.Component';
import {
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../../../../../setups/shared';
import {
  JobScorecardManualReminder,
  ScorecardManualReminder,
} from '../../../../../../../../services';
import i18next from 'i18next';
import { ButtonBase } from '@mui/material';
const parentTranslationPath = 'EvaRecPipelines';
const translationPath = 'ScorecardReminderDialog.';
export const ScorecardReminderDialog = ({
  job_uuid,
  pipeline_uuid,
  job_pipeline_uuid,
  titleText,
  isOpen,
  // onSave,
  isOpenChanged,
  scorecardData,
  scorecard_uuid,
  dataKey,
  onSave,
  candidateScorecardUUID,
  onSaveReminder,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [periodTypes] = useState(() =>
    Object.values(WorkflowsPeriodTypesEnum).map((item) => ({
      ...item,
      value: t(`${translationPath}${item.value}`),
    })),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(() => ({}));
  const [state, setState] = useState({
    has_reminder: true,
    period_type: '',
    period: '',
    send_as_email: true,
    send_as_notification: true,
  });
  const sendHandler = async (event) => {
    event.preventDefault();
    if (
      Object.keys(errors).length > 0
      || (!state?.send_as_email && !state?.send_as_notification)
    ) {
      if (errors.members) showError(errors.members.message);
      if (!state?.send_as_email && !state?.send_as_notification)
        showError(t(`${translationPath}please-select-reminder-type`));
      return;
    }
    setIsLoading(true);
    const response = await (candidateScorecardUUID
      ? ScorecardManualReminder
      : JobScorecardManualReminder)({
      ...state,
      candidate_score_card_uuid: candidateScorecardUUID,
      committee_members: state?.members.map((item) => item?.value),
      job_score_card_uuid: scorecardData?.uuid || '',
    });
    setIsLoading(false);
    if (response?.status === 200) {
      showSuccess(t(`${translationPath}reminder-send-success`));
      if (onSaveReminder)
        onSaveReminder({
          value: {
            has_reminder: state.has_reminder,
            period_type: state.period_type,
            period: state.period,
          },
        });
      isOpenChanged();
    } else showError(t(`${translationPath}failed-send-reminder`), response);
  };
  const getEditInit = useCallback(async () => {
    if (scorecardData)
      setState((items) => ({
        ...items,
        has_reminder: scorecardData?.has_reminder,
        period_type: scorecardData?.period_type,
        period: scorecardData?.period,
        members:
          scorecardData?.[dataKey]?.map((item) => ({
            ...item,
            value: item.uuid,
            type: ScorecardAssigneeTypesEnum.UsersAndEmployees.type,
          })) || [],
      }));
  }, [scorecardData, dataKey]);

  useEffect(() => {
    getEditInit();
  }, [getEditInit]);

  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: yup.object().shape({
          members: yup
            .array()
            .nullable()
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
  }, [state, t]);

  useEffect(() => {
    getErrors();
  }, [getErrors]);
  const reminderPeriodHandler = (key, type) => () => {
    let localResponsePeriod = state?.[key] || 0;
    if (type === 'increment') localResponsePeriod += 1;
    else localResponsePeriod -= 1;
    setState((items) => ({
      ...items,
      period: localResponsePeriod,
    }));
  };
  const getItemName = useCallback(
    (item) => item.label || `${item.first_name || ''} ${item.last_name || ''}` || '',
    [],
  );
  const handleRemoveAssignee = (arrayKey, value) => {
    setState((items) => ({
      ...items,
      [arrayKey]: (items?.[arrayKey] || []).filter((item) => item?.value !== value),
    }));
  };
  return (
    <DialogComponent
      maxWidth="sm"
      titleText={titleText}
      wrapperClasses="scorecard-reminder-dialog-wrapper"
      contentClasses="px-0"
      dialogContent={
        <div className="px-3">
          <div className="d-flex pt-2 score-reminder-section ">
            <span className="c-neutral-scale-3 w-150-px">
              {t(`${translationPath}remind-about`)}
            </span>
            <div className="d-block w-100 px-3 px-sm-0">
              {`${t(`${translationPath}complete`)} `}
              {scorecardData?.title?.[i18next.language]
                || scorecardData?.title?.en
                || ''}
            </div>
          </div>
          <div className="d-flex pt-3 score-reminder-section ">
            <span className="c-neutral-scale-3 w-150-px">
              {t(`${translationPath}send-reminder-to`)}
            </span>
            <div className="d-block px-3   w-100 p-end-0px">
              <div className="reminder-avatars w-100">
                {state?.members?.map((item) => (
                  <AvatarsComponent
                    key={`decisionMakers${item.value}`}
                    avatar={{
                      ...item,
                      name:
                        typeof getItemName(item) === 'string'
                          ? getItemName(item)
                          : 'N/A',
                    }}
                    avatarImageAlt="member"
                    onTagBtnClicked={() =>
                      handleRemoveAssignee('members', item.value)
                    }
                    avatarTheme={AvatarsThemesEnum.TagAvatar.theme}
                    translationPath={translationPath}
                    parentTranslationPath={parentTranslationPath}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="d-flex pt-2 score-reminder-section ">
            <span className="c-neutral-scale-3 w-150-px">
              {t(`${translationPath}send-as`)}
            </span>
            <div className="d-block px-3 w-100 px-sm-0">
              <div className="d-flex-v-center">
                <ButtonBase
                  className="btns btns-icon theme-transparent mx-0"
                  onClick={() => {
                    setState((items) => ({
                      ...items,
                      send_as_notification: !items.send_as_notification,
                    }));
                  }}
                >
                  <span
                    className={`fas fa-toggle-${
                      state?.send_as_notification ? 'on c-black' : 'off'
                    }`}
                  />
                </ButtonBase>
                <span className="c-neutral-scale-3  fz-12px px-1 font-weight-400">
                  {t(`${translationPath}notification`)}
                </span>
              </div>
              <div className="d-flex-v-center">
                <ButtonBase
                  className="btns btns-icon theme-transparent mx-0"
                  onClick={() => {
                    setState((items) => ({
                      ...items,
                      send_as_email: !items.send_as_email,
                    }));
                  }}
                >
                  <span
                    className={`fas fa-toggle-${
                      state?.send_as_email ? 'on c-black' : 'off'
                    }`}
                  />
                </ButtonBase>
                <span className="c-neutral-scale-3 fz-12px px-1 font-weight-400">
                  {t(`${translationPath}email`)}
                </span>
              </div>
            </div>
          </div>
          <hr className="c-gray my-0" />
          <div className="d-flex pt-2 score-reminder-section ">
            <span className="c-neutral-scale-3 w-150-px">
              {t(`${translationPath}message`)}
            </span>
            <div className="d-block px-3 w-100 px-sm-0">
              <SharedInputControl
                isFullWidth={true}
                stateKey="description"
                searchKey="search"
                placeholder="optional-message"
                themeClass="theme-transparent"
                wrapperClasses="mt-0 mb-2"
                fieldClasses={'w-100'}
                innerInputWrapperClasses="border-0"
                onValueChanged={(newValue) =>
                  setState((items) => ({
                    ...items,
                    message: newValue?.value,
                  }))
                }
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                editValue={state.message || ''}
              />
            </div>
          </div>

          <hr className="c-gray my-0" />
          <div className="d-flex-v-center-h-between pt-2">
            <span className="fz-14px c-black font-weight-600">
              {t(`${translationPath}task-auto-reminders`)}
            </span>
            <ButtonBase
              className="btns btns-icon theme-transparent mx-0"
              onClick={() => {
                setState((items) => ({
                  ...items,
                  has_reminder: !items.has_reminder,
                }));
              }}
            >
              <span
                className={`fas fa-toggle-${
                  state?.has_reminder ? 'on c-black' : 'off'
                }`}
              />
            </ButtonBase>
          </div>
          <div className="d-flex pt-1 score-reminder-section">
            <span className="c-neutral-scale-3 w-150-px">
              {t(`${translationPath}send-every`)}
            </span>
            <div className="d-block px-3 px-sm-0">
              <div className="d-inline-flex-v-center  flex-sm-col">
                <div className="d-inline-flex px-2 m-w-165px">
                  <SharedInputControl
                    editValue={state?.period}
                    stateKey="period"
                    onValueChanged={(newValue) => {
                      setState((items) => ({
                        ...items,
                        period: newValue?.value,
                      }));
                    }}
                    type="number"
                    min={0}
                    floatNumbers={0}
                    startAdornment={
                      <ButtonBase
                        className="btns theme-solid miw-32px w-32px h-32px bg-gray-lighter c-gray-primary"
                        disabled={!state?.period || state?.period <= 0}
                        onClick={reminderPeriodHandler('period', 'decrement', 1)}
                      >
                        <span className="fas fa-minus" />
                      </ButtonBase>
                    }
                    endAdornment={
                      <ButtonBase
                        className="btns theme-solid miw-32px w-32px h-32px bg-gray-lighter c-gray-primary"
                        onClick={reminderPeriodHandler('period', 'increment', 1)}
                      >
                        <span className="fas fa-plus" />
                      </ButtonBase>
                    }
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                    isFullWidth
                  />
                </div>
                <div className="d-inline-flex px-2">
                  <SharedAutocompleteControl
                    editValue={state.period_type}
                    placeholder="select-period"
                    stateKey="period_type"
                    onValueChanged={(newValue) => {
                      setState((items) => ({
                        ...items,
                        period_type: newValue?.value,
                      }));
                    }}
                    initValues={periodTypes}
                    disableClearable
                    initValuesTitle="value"
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                    isFullWidth
                  />
                </div>
              </div>
            </div>
          </div>
          <Hint title={t(`${translationPath}scorecard-reminder-description`)} />
        </div>
      }
      // contentFooterClasses="px-2"
      // saveCancelWrapperClasses="px-2"
      isSaving={isLoading}
      isOpen={isOpen}
      titleIcon="far fa-clock"
      saveText="save-and-send"
      cancelText="discard"
      onSaveClicked={sendHandler}
      onCloseClicked={isOpenChanged}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

ScorecardReminderDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  titleText: PropTypes.string,
  scorecardData: PropTypes.instanceOf(Object),
  isOpenChanged: PropTypes.func,
  dataKey: PropTypes.string,
  onSave: PropTypes.func,
  candidateScorecardUUID: PropTypes.string,
};
ScorecardReminderDialog.defaultProps = {
  titleText: 'task-automated-reminder',
};
