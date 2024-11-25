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
} from '../../../../../../../../enums';
import './ScorecardReminder.Style.scss';
import { SharedInputControl } from '../../../../../../../setups/shared';
import { ShareScorecardSummary } from '../../../../../../../../services';
import { ButtonBase } from '@mui/material';
import FormMembersPopover from '../../../../../../../form-builder-v2/popovers/FormMembers.Popover';
import { ScorecardAssignTabs } from '../../../../../../create/components/scorecard-assign/ScorecardAssign.Tabs';
const parentTranslationPath = 'EvaRecPipelines';
const translationPath = 'ScorecardShareDialog.';
export const ScorecardShareDialog = ({
  titleText,
  isOpen,
  isOpenChanged,
  scorecardData,
  dataKey,
  jobRequisitionUUID,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [popoverAttachedWith, setPopoverAttachedWith] = useState({
    members: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(() => ({}));
  const [state, setState] = useState({
    decision_makers: [],
    committee_members: [],
    send_as_email: true,
    send_as_notification: true,
  });
  const shareHandler = async (event) => {
    event.preventDefault();
    if (
      Object.keys(errors).length > 0
      || (!state?.send_as_email && !state?.send_as_notification)
    ) {
      if (errors.members) showError(errors.members.message);
      if (!state?.send_as_email && !state?.send_as_notification)
        showError(t(`${translationPath}please-select-share-type`));
      return;
    }
    setIsLoading(true);
    const response = await ShareScorecardSummary({
      ...state,
      job_score_card_uuid: scorecardData?.uuid || '',
      committee_members: state?.members.map((item) => item?.value),
    });
    setIsLoading(false);
    if (response?.status === 200) {
      showSuccess(t(`${translationPath}score-shared-successfully`));
      isOpenChanged();
    } else showError(t(`${translationPath}failed-to-share-scores`), response);
  };
  const getEditInit = useCallback(async () => {
    if (scorecardData)
      setState((items) => ({
        ...items,
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

  const getItemName = useCallback(
    (item) => item.label || `${item.first_name || ''} ${item.last_name || ''}` || '',
    [],
  );
  const handleRemoveAssignee = useCallback(
    (arrayKey, value) => (event) => {
      event.preventDefault();
      event.stopPropagation();
      setState((items) => ({
        ...items,
        [arrayKey]: (items?.[arrayKey] || []).filter(
          (item) => item?.value !== value,
        ),
      }));
    },
    [],
  );
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
  return (
    <DialogComponent
      maxWidth="sm"
      titleText={titleText}
      wrapperClasses="scorecard-reminder-dialog-wrapper"
      contentClasses="px-0"
      dialogContent={
        <div className="px-3">
          <div className="d-flex pt-3 score-reminder-section ">
            <span className="c-neutral-scale-3 w-120-px">
              {t(`${translationPath}share-with`)}
            </span>
            <div className="d-block px-3   w-100 p-end-0px">
              <div
                className="reminder-avatars flex-wrap d-flex-v-center w-100 "
                onClick={(event) => popoverToggleHandler('members', event)}
                onKeyUp={() => {}}
                role="button"
                tabIndex={0}
              >
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
                    onTagBtnClicked={handleRemoveAssignee('members', item.value)}
                    avatarTheme={AvatarsThemesEnum.TagAvatar.theme}
                    translationPath={translationPath}
                    parentTranslationPath={parentTranslationPath}
                  />
                ))}
                <span
                  className={`c-neutral-scale-3 px-2  d-inline-flex-v-center-flex-v-center  
                  ${state?.members?.length === 0 ? 'mb-1' : 'mb-0'}
                  `}
                >
                  {' '}
                  {t(`search`)}...
                </span>
              </div>
            </div>
          </div>

          <hr className="c-gray my-2" />
          <div className="d-flex pt-1  score-reminder-section ">
            <span className="c-neutral-scale-3 w-120-px">
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
          <div className="d-flex pt-2 score-reminder-section ">
            <span className="c-neutral-scale-3 w-120-px">
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
          {popoverAttachedWith.members && (
            <FormMembersPopover
              arrayKey="invited_members"
              values={state.members}
              popoverTabs={ScorecardAssignTabs}
              isWithJobsFilter={false}
              popoverAttachedWith={popoverAttachedWith.members}
              handleClose={() => {
                popoverToggleHandler('members', null);
              }}
              getListAPIProps={() => ({
                with_than: [],
                ...(jobRequisitionUUID && {
                  job_requisition_uuid: jobRequisitionUUID,
                }),
              })}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onSave={(newValue) => {
                setState((items) => ({
                  ...items,
                  members: newValue?.invited_members || [],
                }));
              }}
            />
          )}
        </div>
      }
      contentFooterClasses="px-2"
      saveCancelWrapperClasses="px-2"
      isSaving={isLoading}
      isOpen={isOpen}
      saveText="share"
      cancelText="discard"
      onSaveClicked={shareHandler}
      onCloseClicked={isOpenChanged}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

ScorecardShareDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  titleText: PropTypes.string,
  isOpenChanged: PropTypes.func,
  dataKey: PropTypes.string,
  jobRequisitionUUID: PropTypes.string,
  scorecardData: PropTypes.instanceOf(Object),
};
ScorecardShareDialog.defaultProps = {
  titleText: 'share',
};
