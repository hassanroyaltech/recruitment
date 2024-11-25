// React and reactstrap
import React, { useCallback, useState } from 'react';
import { Card } from 'reactstrap';

import { useTranslation } from 'react-i18next';

import i18next from 'i18next';
import {
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../../setups/shared';
import { styled } from '@mui/material/styles';
import { PlusIcon } from '../../../../../assets/icons';
import { ButtonBase } from '@mui/material';

import {
  AvatarsThemesEnum,
  ScorecardAssigneeTypesEnum,
  WorkflowsPeriodTypesEnum,
} from '../../../../../enums';

import FormMembersPopover from '../../../../form-builder-v2/popovers/FormMembers.Popover';
import { GetAllScorecardTemplates } from '../../../../../services';
import { AvatarsComponent } from '../../../../../components';
import './ScorecardAssign.Style.scss';
import { ScorecardAssignTabs } from './ScorecardAssign.Tabs';
const SectionLabel = styled('span')(() => ({
  width: '150px',
}));

export default function ScorecardAssignComponent({
  edit,
  form,
  setForm,
  jobUUID,
  isViewDecisionMakers,
  isViewCommittee,
  isViewSelectScorecard,
  isViewReminder,
  translationPath,
  parentTranslationPath,
  isViewReminderInputs,
  isViewMessage,
  jobRequisitionUUID,
  isAssignDisabled,
}) {
  const { t } = useTranslation(parentTranslationPath);
  const [periodTypes] = useState(() =>
    Object.values(WorkflowsPeriodTypesEnum).map((item) => ({
      ...item,
      value: t(item.value),
    })),
  );
  const [assignDialogState, setAssignDialogState] = useState({
    attachedWith: false,
    stateKey: '',
  });
  const getItemName = useCallback(
    (item) => item.label || `${item.first_name || ''} ${item.last_name || ''}` || '',
    [],
  );

  const handleRemoveAssignee = (arrayKey, value) => {
    setForm((items) => ({
      ...items,
      [arrayKey]: (items?.[arrayKey] || []).filter((item) => item?.value !== value),
    }));
  };
  const responsePeriodHandler = (key, type) => () => {
    let localResponsePeriod = form?.[key] || 0;
    if (type === 'increment') localResponsePeriod += 1;
    else localResponsePeriod -= 1;
    setForm((items) => ({
      ...items,
      period: localResponsePeriod,
    }));
  };

  /**
   * Return JSX
   */
  return (
    <div className="job-management-evaluate-step">
      {isViewSelectScorecard && (
        <>
          <div className="d-flex pt-2 evaluate-section ">
            <SectionLabel>{t(`${translationPath}scorecard`)}</SectionLabel>
            <div className="d-block px-3 px-sm-0">
              <SharedAPIAutocompleteControl
                isEntireObject={true}
                title="scorecard"
                isQuarterWidth
                controlWrapperClasses="mx-0 px-0 mb-1"
                searchKey="search"
                placeholder="select-scorecard"
                stateKey="scorecard"
                // isSubmitted={isSubmitted}
                isDisabled={!form?.can_edit_score_card}
                editValue={form?.score_card_uuid?.uuid}
                onValueChanged={(newValue) =>
                  setForm((items) => ({
                    ...items,
                    score_card_uuid: newValue.value,
                  }))
                }
                extraProps={{
                  status: true,
                  ...(form?.score_card_uuid?.uuid && {
                    with_than: [form?.score_card_uuid?.uuid],
                  }),
                }}
                getDataAPI={GetAllScorecardTemplates}
                parentTranslationPath={parentTranslationPath}
                getOptionLabel={(option) =>
                  option?.title?.[i18next.language]
                  || option?.title?.en
                  || 'Untitled'
                }
              />
              <div
                className="mt-1 mb-2 fz-12px font-weight-normal text-gray"
                style={{ opacity: 0.66 }}
              >
                {t(`${translationPath}select-scorecard-description`)}
              </div>
            </div>
          </div>
          <hr className="my-0" />
        </>
      )}
      {isViewCommittee && (
        <>
          <div className="d-flex pt-3 evaluate-section ">
            <SectionLabel>{t(`${translationPath}assign-members`)}</SectionLabel>
            <div className="d-block w-100 px-3 px-sm-0">
              {form.score_card_uuid?.min_committee_members
                && form?.committee_members?.length
                  < form.score_card_uuid?.min_committee_members && (
                <div className="mt-1 mb-2 fz-12px font-weight-normal text-gray">
                  {`${t(`${translationPath}min-committee-members`)} (${
                    form.score_card_uuid?.min_committee_members
                  })`}
                </div>
              )}
              {form?.committee_members?.map((item) => (
                <AvatarsComponent
                  key={`committeeMembers${item.value}`}
                  avatar={{
                    ...item,
                    name:
                      typeof getItemName(item) === 'string'
                        ? getItemName(item)
                        : 'N/A',
                  }}
                  isDisabled={isAssignDisabled}
                  avatarImageAlt="member"
                  onTagBtnClicked={() =>
                    handleRemoveAssignee('committee_members', item.value)
                  }
                  avatarTheme={AvatarsThemesEnum.TagAvatar.theme}
                  translationPath={translationPath}
                  parentTranslationPath={parentTranslationPath}
                />
              ))}
              <ButtonBase
                className="btns theme-transparent mt-2 mx-0"
                onClick={(event) =>
                  setAssignDialogState({
                    attachedWith: (event && event.currentTarget) || null,
                    stateKey: 'committee_members',
                  })
                }
                disabled={isAssignDisabled}
              >
                <span className="fas fa-plus pr-2" />
                {t(`${translationPath}assign`)}
              </ButtonBase>
              <div
                className="mt-1 mb-2 fz-12px font-weight-normal text-gray"
                style={{ opacity: 0.66 }}
              >
                {t(`${translationPath}assign-members-description`)}
              </div>
            </div>
          </div>
          <hr className="my-0" />
        </>
      )}
      {isViewDecisionMakers && (
        <>
          <div className="d-flex pt-3 evaluate-section">
            <SectionLabel>{t(`${translationPath}decision-makers`)}</SectionLabel>
            <div className="d-block w-100 px-3 px-sm-0">
              {form?.decision_makers?.map((item) => (
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
                  isDisabled={isAssignDisabled}
                  onTagBtnClicked={() =>
                    handleRemoveAssignee('decision_makers', item.value)
                  }
                  avatarTheme={AvatarsThemesEnum.TagAvatar.theme}
                  translationPath={translationPath}
                  parentTranslationPath={parentTranslationPath}
                />
              ))}
              <ButtonBase
                className="btns theme-transparent mt-2 mx-0"
                onClick={(event) =>
                  setAssignDialogState({
                    attachedWith: (event && event.currentTarget) || null,
                    stateKey: 'decision_makers',
                  })
                }
                disabled={isAssignDisabled}
              >
                <span className="fas fa-plus pr-2" />
                {t(`${translationPath}assign`)}
              </ButtonBase>
              <div
                className="mt-1 mb-2 fz-12px font-weight-normal text-gray"
                style={{ opacity: 0.66 }}
              >
                {t(`${translationPath}decision-makers-description`)}
              </div>
            </div>
          </div>
          <hr className="my-0" />
        </>
      )}

      {isViewMessage && (
        <>
          <div className="d-flex pt-2 evaluate-section">
            <SectionLabel> {t(`${translationPath}message`)}</SectionLabel>
            <div className="d-block px-3 w-100 px-sm-0">
              <SharedInputControl
                isFullWidth={true}
                stateKey="message"
                searchKey="search"
                placeholder="optional-message"
                themeClass="theme-transparent"
                wrapperClasses="mt-0 mb-2"
                fieldClasses={'w-100'}
                innerInputWrapperClasses="border-0"
                onValueChanged={(newValue) =>
                  setForm((items) => ({
                    ...items,
                    message: newValue.value,
                  }))
                }
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                editValue={form.message || ''}
              />
            </div>
          </div>
          <hr className="my-0" />
        </>
      )}

      {isViewReminder && (
        <>
          <div className="d-flex-v-center-h-between pt-2">
            <span className="fz-14px c-black font-weight-600">
              {t(`${translationPath}task-auto-reminders`)}
            </span>
            <ButtonBase
              className="btns btns-icon theme-transparent mx-0"
              onClick={() => {
                setForm((items) => ({
                  ...items,
                  has_reminder: !items.has_reminder,
                }));
              }}
            >
              <span
                className={`fas fa-toggle-${
                  form?.has_reminder ? 'on c-black' : 'off'
                }`}
              />
            </ButtonBase>
          </div>
          {isViewReminderInputs && form?.has_reminder && (
            <div className="d-flex pt-1 evaluate-section">
              <SectionLabel>{t(`${translationPath}send-every`)}</SectionLabel>
              <div className="d-block w-50 px-3 px-sm-0">
                <div className="d-inline-flex-v-center  flex-sm-col">
                  <div className="d-inline-flex px-2 ">
                    <SharedInputControl
                      editValue={form?.period}
                      stateKey="period"
                      onValueChanged={(newValue) => {
                        setForm((items) => ({
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
                          disabled={!form?.period || form?.period <= 0}
                          onClick={responsePeriodHandler('period', 'decrement', 1)}
                        >
                          <span className="fas fa-minus" />
                        </ButtonBase>
                      }
                      endAdornment={
                        <ButtonBase
                          className="btns theme-solid miw-32px w-32px h-32px bg-gray-lighter c-gray-primary"
                          onClick={responsePeriodHandler('period', 'increment', 1)}
                        >
                          <span className="fas fa-plus" />
                        </ButtonBase>
                      }
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                      isFullWidth
                    />
                  </div>
                  {/*<div></div>*/}
                  <div className="d-inline-flex px-2">
                    <SharedAutocompleteControl
                      editValue={form.period_type}
                      placeholder="select-period"
                      // title="condition"
                      stateKey="period_type"
                      onValueChanged={(newValue) => {
                        setForm((items) => ({
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
          )}
        </>
      )}
      {assignDialogState?.attachedWith && (
        <FormMembersPopover
          arrayKey="invited_members"
          values={form?.[assignDialogState.stateKey]}
          popoverTabs={ScorecardAssignTabs}
          isWithJobsFilter={false}
          popoverAttachedWith={assignDialogState?.attachedWith}
          handleClose={() => {
            setAssignDialogState((items) => ({ ...items, attachedWith: null }));
          }}
          getListAPIProps={() => ({
            with_than: [],
            ...(jobRequisitionUUID && { job_requisition_uuid: jobRequisitionUUID }),
          })}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onSave={(newValue) => {
            setForm((items) => ({
              ...items,
              [assignDialogState.stateKey]: newValue?.invited_members || [],
            }));
          }}
        />
      )}
    </div>
  );
}
