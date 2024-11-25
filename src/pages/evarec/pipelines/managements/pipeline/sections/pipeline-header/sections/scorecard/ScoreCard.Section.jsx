import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CollapseComponent } from '../../../../../../../../../components';

import ButtonBase from '@mui/material/ButtonBase';
import { AvatarList } from '../../../../../../../../onboarding/activity/components/AvatarsList';
import i18next from 'i18next';
import { getIsAllowedPermissionV2 } from '../../../../../../../../../helpers';
import { ScorecardPermissions } from '../../../../../../../../../permissions';
import { useSelector } from 'react-redux';

export const ScorecardSection = ({
  parentTranslationPath,
  translationPath,
  scorecardDrawersHandler,
  activeJob,
  onIsOpenDialogsChanged,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );
  const [expandedCollapse, setExpandedCollapse] = useState([
    'connected-to',
    'invited',
  ]);
  const onChangeCollapse = useCallback((id) => {
    setExpandedCollapse((items) =>
      items.includes(id) ? items.filter((item) => item !== id) : [...items, id],
    );
  }, []);
  const scoreCardTitle = useMemo(
    () =>
      activeJob?.job_score_card?.title?.[i18next.language]
      || activeJob?.job_score_card?.title?.en
      || '',
    [activeJob?.job_score_card?.title],
  );
  const getItemName = useCallback(
    (item) => item.label || `${item.first_name || ''} ${item.last_name || ''}` || '',
    [],
  );
  const scoreCardMembers = useMemo(
    () =>
      (activeJob?.job_score_card?.committee_members || []).map((item) => ({
        ...item,
        name: getItemName(item),
      })),
    [activeJob?.job_score_card?.committee_members, getItemName],
  );
  return (
    <>
      <div className="separator-h mb-1" />
      <div className="d-flex-v-center-h-between c-gray-primary px-2">
        {t(`${translationPath}connected-to-this-position`)}
        <ButtonBase
          onClick={() => onChangeCollapse('connected-to')}
          className="btns-icon theme-transparent miw-0 mt-1"
        >
          <span className="fas fa-chevron-down c-gray-primary" />
        </ButtonBase>
      </div>
      <CollapseComponent
        isOpen={expandedCollapse.includes('connected-to')}
        wrapperClasses="w-100 mb-1"
        component={
          <div className="d-flex">
            <ButtonBase
              className="btns theme-transparent scorecard-btn my-2"
              disabled={
                !getIsAllowedPermissionV2({
                  permissionId:
                    ScorecardPermissions.ViewEvaluationConnectedToJob.key,
                  permissions: permissionsReducer,
                })
              }
              onClick={() => {
                scorecardDrawersHandler('isOpenDetails', true);
              }}
            >
              <span className="fas fa-star d-inline-flex-center icon-with-bg" />
              <span className="px-2"> {scoreCardTitle}</span>
            </ButtonBase>
          </div>
        }
      />
      <div className="separator-h mb-1" />
      <div className="d-flex-v-center-h-between c-gray-primary px-2">
        {t(`${translationPath}evaluation-team`)}
        <ButtonBase
          onClick={() => onChangeCollapse('invited')}
          className="btns-icon theme-transparent miw-0 mt-1"
        >
          <span className="fas fa-chevron-down c-gray-primary" />
        </ButtonBase>
      </div>
      <CollapseComponent
        isOpen={expandedCollapse.includes('invited')}
        wrapperClasses="w-100 mb-1"
        component={
          <div className="d-flex-v-center gap-2 my-2">
            <span>
              <div className="d-inline-flex-v-center gap-1 p-1 score-assign-avatars">
                <AvatarList
                  members={scoreCardMembers || []}
                  max={3}
                  dimension={27}
                />
                <span className="px-2">{scoreCardMembers.length}</span>
              </div>
            </span>
            <ButtonBase
              className="btns theme-transparent my-2"
              onClick={() => onIsOpenDialogsChanged('assignScorecard', true)}
              disabled={
                !getIsAllowedPermissionV2({
                  permissionId: ScorecardPermissions.ScorecardViewAssignee.key,
                  permissions: permissionsReducer,
                })
              }
            >
              <span className="fas fa-plus" />
              <span className="px-2">{t(`${translationPath}assign`)}</span>
            </ButtonBase>
          </div>
        }
      />
    </>
  );
};

ScorecardSection.propTypes = {
  activeJob: PropTypes.instanceOf(Object),
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  scorecardDrawersHandler: PropTypes.func,
  onIsOpenDialogsChanged: PropTypes.func,
};
