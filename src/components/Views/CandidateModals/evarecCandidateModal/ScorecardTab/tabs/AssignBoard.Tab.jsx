import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { CollapseComponent } from '../../../../../Collapse/Collapse.Component';
import { AvatarList } from '../../../../../../pages/onboarding/activity/components/AvatarsList';
import { Backdrop, CircularProgress } from '@mui/material';
import { BlockAccordionScore } from '../cards/block-accordion/BlockAccordion.Card';
import i18next from 'i18next';
import ScorecardStarRating from '../../../../../../pages/recruiter-preference/Scorecard/ScorecaredBuilder/components/RatingInputs/ScorecardStarRating.compnent';
import TablesComponent from '../../../../../Tables/Tables.Component';
import { getIsAllowedPermissionV2 } from '../../../../../../helpers';
import {
  ManageApplicationsPermissions,
  ScorecardPermissions,
} from '../../../../../../permissions';
import { useSelector } from 'react-redux';

export const AssignBoardTab = ({
  parentTranslationPath,
  candidateDetails,
  onIsOpenDialogsChanged,
  loadingArray,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [expandedCollapse, setExpandedCollapse] = useState(['invited']);
  const [expandedAccordions, setExpandedAccordions] = useState(['all-members']);
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );
  const onChangeAccordion = useCallback((id) => {
    setExpandedAccordions((items) =>
      items.includes(id) ? items.filter((item) => item !== id) : [...items, id],
    );
  }, []);
  const onChangeCollapse = useCallback((id) => {
    setExpandedCollapse((items) =>
      items.includes(id) ? items.filter((item) => item !== id) : [...items, id],
    );
  }, []);
  const getItemName = useCallback(
    (item) => item.label || `${item.first_name || ''} ${item.last_name || ''}` || '',
    [],
  );
  const scoreCardMembers = useMemo(
    () =>
      (candidateDetails?.committee_members || []).map((item) => ({
        ...item,
        name: getItemName(item),
      })),
    [candidateDetails?.committee_members, getItemName],
  );

  const pendingTableColumns = useMemo(
    () => [
      {
        input: 'name',
        label: t(`member`),
        sort: true,
        component: (row) => (
          <span>
            <AvatarList
              members={[{ name: row?.name || '' }] || []}
              max={1}
              dimension={27}
            />
            <span className="c-black fz-14px font-weight-400 px-1">
              {row?.name || ''}
            </span>
          </span>
        ),
      },
      {
        input: 'avg',
        label: t(`average-rating`),
        component: (row) =>
          row?.avg || row?.avg === 0 ? (
            <span className="d-inline-flex-v-center section-title">
              <ScorecardStarRating
                value={1}
                maxNumber={1}
                isView={true}
                ishideLabels={true}
              />
              <span className="c-black fz-14px font-weight-400 px-1">
                {((row?.avg || row?.avg === 0) && row.avg) || ''}
              </span>
            </span>
          ) : (
            <></>
          ),
      },
      {
        input: 'completed_on',
        label: t(`completed-on`),
        component: (row) => (
          <span className="c-black fz-12px c-neutral-scale-3 font-weight-400 px-1">
            {row?.completed_on || ''}
          </span>
        ),
      },
      {
        input: 'last_reminder',
        label: t(`last-reminder`),
        component: (row) => (
          <span className="c-black fz-12px c-neutral-scale-3 font-weight-400 px-1">
            {row?.last_reminder || ''}
          </span>
        ),
      },
    ],
    [t],
  );

  return (
    <div className="w-100 min-h-50px score-candidate-tab-wrapper p-relative py-2">
      <div className="d-flex-v-center-h-between c-gray-primary px-2">
        {t(`evaluation-team`)}
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
              <span className="px-2">{t(`assign`)}</span>
            </ButtonBase>
          </div>
        }
      />
      <div className="d-block my-1 mx-1 separator-candidate-scorecard"></div>
      {candidateDetails?.assigned_board?.length > 0 ? (
        <BlockAccordionScore
          expanded={expandedAccordions.includes('all-members')}
          onChange={() => {
            onChangeAccordion('all-members');
          }}
          title={
            <div className="d-flex section-title">
              <span className="c-black  w-100 px-2 py-1 mx-2 fz-14px font-weight-500">
                {t(`all-members`)}
              </span>
            </div>
          }
          body={
            <>
              <TablesComponent
                isWithoutBoxWrapper
                isWithNumbering
                uniqueKeyInput="uuid"
                pageSize={candidateDetails?.assigned_board?.length}
                headerData={pendingTableColumns}
                pageIndex={0}
                data={candidateDetails?.assigned_board || []}
                totalItems={candidateDetails?.assigned_board?.length}
              />
            </>
          }
        />
      ) : null}

      <Backdrop
        className="spinner-wrapper p-absolute"
        open={loadingArray.includes('candidate-score')}
        sx={{ backgroundColor: '#7272720a' }}
      >
        <CircularProgress color="inherit" size={30} />
      </Backdrop>
    </div>
  );
};

AssignBoardTab.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  candidateDetails: PropTypes.instanceOf(Object),
  candidateDetail: PropTypes.instanceOf(Object),
  loadingArray: PropTypes.instanceOf(Array),
  onIsOpenDialogsChanged: PropTypes.func,
};
AssignBoardTab.defaultProps = {
  parentTranslationPath: 'EvarecCandidateModel',
};
