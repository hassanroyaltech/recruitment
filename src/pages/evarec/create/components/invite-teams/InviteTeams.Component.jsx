import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { styled } from '@mui/material/styles';
import { ButtonBase } from '@mui/material';
import { AvatarsThemesEnum } from '../../../../../enums';
import FormMembersPopover from '../../../../form-builder-v2/popovers/FormMembers.Popover';
import { AvatarsComponent } from '../../../../../components';
import './InviteTeams.Style.scss';

import { InviteTeamsTabs } from './InviteTeams.Tabs';
const SectionLabel = styled('span')(() => ({
  width: '160px',
  paddingBlockStart: '5px',
}));

export default function InviteTeamsComponent({
  form,
  setForm,
  isJobOnboarding,
  translationPath,
  parentTranslationPath,
  jobRequisitionUUID,
  isDisabled,
}) {
  const { t } = useTranslation(parentTranslationPath);
  const inviteTeamsArray = useRef(
    (isJobOnboarding && [
      {
        key: 'recruiter',
        value: 'recruiter',
        description: 'recruiter-member-description',
      },
      {
        key: 'hiring_manager',
        value: 'hiring-manager',
        description: 'hiring-manager-description',
      },
      { key: 'hod', value: 'h-o-d', description: 'h-o-d-description' },
      {
        key: 'onboarding_team',
        value: 'onboarding-team',
        description: 'onboarding-team-description',
      },
      { key: 'other_team', value: 'other-team', description: 'teams-description' },
    ]) || [
      {
        key: 'job_poster',
        value: 'poster',
        description: 'recruiter-member-description',
        isDisabled: true,
        max: 1,
      },
      {
        key: 'job_recruiter',
        value: 'recruiter',
        description: 'recruiter-member-description',
        max: 1,
      },
    ],
  );
  const [popoverState, setPopoverState] = useState({
    attachedWith: false,
    stateKey: '',
  });
  const getItemName = useCallback((item) => {
    if (item.label) return item.label;
    if (typeof item.first_name === 'object')
      return (
        `${item.first_name?.[i18next.language] || item.first_name?.en || ''} ${
          item.last_name?.[i18next.language] || item.last_name?.en || ''
        }` || ''
      );
    if (typeof item.first_name === 'string')
      return `${item.first_name || ''} ${item.last_name || ''}` || '';
    return '';
  }, []);

  const handleRemoveAssignee = (arrayKey, value) => {
    setForm((items) => ({
      ...items,
      [arrayKey]: (items?.[arrayKey] || []).filter((item) => item?.value !== value),
    }));
  };

  /**
   * Return JSX
   */
  return (
    <div className="job-management-invite-teams-step">
      {inviteTeamsArray.current.map((element) => (
        <React.Fragment key={element.key}>
          <div className="d-flex pt-3 evaluate-section ">
            <SectionLabel>{t(`${translationPath}${element.value}`)}</SectionLabel>
            <div className="d-block w-100 px-3 px-sm-0">
              {form?.[element.key]?.map((item) => (
                <AvatarsComponent
                  key={`recruiter${item.value}`}
                  avatar={{
                    ...item,
                    name:
                      typeof getItemName(item) === 'string'
                        ? getItemName(item)
                        : 'N/A',
                  }}
                  isDisabled={isDisabled || element.isDisabled}
                  avatarImageAlt="member"
                  onTagBtnClicked={() =>
                    handleRemoveAssignee(element.key, item.value)
                  }
                  avatarTheme={AvatarsThemesEnum.TagAvatar.theme}
                  translationPath={translationPath}
                  parentTranslationPath={parentTranslationPath}
                />
              ))}
              <ButtonBase
                className="btns theme-transparent mt-0  mb-2 mx-0"
                onClick={(event) =>
                  setPopoverState({
                    attachedWith: (event && event.currentTarget) || null,
                    stateKey: element.key,
                  })
                }
                disabled={isDisabled || element.isDisabled}
              >
                <span className="fas fa-plus pr-2" />
                {t(`${translationPath}invite`)}
              </ButtonBase>
              {/*<div*/}
              {/*  className="mt-1 mb-2 fz-12px font-weight-normal text-gray"*/}
              {/*  style={{ opacity: 0.66 }}*/}
              {/*>*/}
              {/*  {t(`${translationPath}${element.description}`)}*/}
              {/*</div>*/}
            </div>
          </div>
          <hr className="my-0" />
        </React.Fragment>
      ))}

      {popoverState?.attachedWith && (
        <FormMembersPopover
          arrayKey="invited_members"
          values={form?.[popoverState.stateKey]}
          popoverTabs={InviteTeamsTabs}
          isWithJobsFilter={false}
          popoverAttachedWith={popoverState?.attachedWith}
          getIsDisabledItem={({ memberItem, selectedItems }) => {
            const inviteTeamItem = inviteTeamsArray.current.find(
              (item) => item.key === popoverState.stateKey,
            );
            if (!inviteTeamItem || !inviteTeamItem.max) return false;
            return (
              inviteTeamItem.max <= selectedItems.length
              && !selectedItems.find((item) => item.value === memberItem.value)
            );
          }}
          handleClose={() => {
            setPopoverState((items) => ({ ...items, attachedWith: null }));
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
              [popoverState.stateKey]: newValue?.invited_members || [],
            }));
          }}
        />
      )}
    </div>
  );
}
