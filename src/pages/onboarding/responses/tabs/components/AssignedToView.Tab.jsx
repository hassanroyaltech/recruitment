import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Grid, ButtonBase } from '@mui/material';
import { OnboardingAccordion } from '../../../shared';

import TablesComponent from '../../../../../components/Tables/Tables.Component';
import Skeleton from '@mui/material/Skeleton';
import {
  FormsAssistRoleTypesEnum,
  FormsForTypesEnum,
  FormsRolesEnum,
  FormsSubmissionsLevelsTypesEnum,
  NavigationSourcesEnum,
  OnboardingGroupByActionsEnum,
  SystemActionsEnum,
} from '../../../../../enums';
import { GetOnboardingFlowURL } from '../../../../../services';
import {
  getIsAllowedPermissionV2,
  GlobalHistory,
  showError,
} from '../../../../../helpers';
import { ManageFlowPermissions } from '../../../../../permissions';
import { useSelector } from 'react-redux';
import { RedirectToCandidateButton } from './../../../shared/components';

export const AssignedToView = ({
  parentTranslationPath,
  expandedAccordions,
  extractName,
  // onScrollHandler,
  bodyRef,
  onChangeAccordion,
  filtersComponent,
  // filter,
  tableData,
  isLoading,
  filter,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );
  const tableColumns = useMemo(
    () => [
      filter?.group?.group_by === OnboardingGroupByActionsEnum?.Fields?.group_by
        ? {
          id: 1,
          input: 'member',
          label: t('member'),
          isHidden: false,
          component: (row) =>
            row.redirect_link ? (
              <a href={row.redirect_link} target={'_blank'} rel="noreferrer">
                <span className={'responses-question'}>{row.member}</span>
              </a>
            ) : (
              <span className={'responses-question'}>{row.member}</span>
            ),
        }
        : {
          id: 1,
          input: 'field',
          label: t('field'),
          isHidden: false,
          cellClasses: 'w-30',
          component: (row) => (
            <span className={'responses-question'}>{row.field}</span>
          ),
        },
      // {
      //   id: 2,
      //   input: 'reply',
      //   label: t('reply'),
      //   isHidden: false,
      //   // cellClasses: 'w-30',
      //   component: (row) => <span className={'responses-reply'}>{row.reply}</span>,
      // },
      {
        id: 2,
        input: 'section',
        label: t('content-section'),
        isHidden: false,
        component: (row) => (
          <span className={'table-tag py-1 px-2'}>{row.section}</span>
        ),
      },
      {
        id: 3,
        input: 'flow',
        label: t('flow'),
        isHidden: false,
        component: (row) =>
          row.flow ? <span className={'table-tag py-1 px-2'}>{row.flow}</span> : '',
      },
      {
        id: 4,
        input: 'space',
        label: t('space'),
        isHidden: false,
        component: (row) =>
          row.space ? (
            <span className={'table-tag py-1 px-2'}>{row.space}</span>
          ) : (
            ''
          ),
      },
    ],
    [filter?.group?.group_by, t],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to generate the redirect link to form for each flow
   * */
  const generateFormLinkHandler = useCallback(
    async ({ row, member }) => {
      setIsLocalLoading(true);
      const response = await GetOnboardingFlowURL({
        uuid: row.flow_uuid,
        forType: FormsForTypesEnum.SystemUser.key,
        email: member.email || row?.email,
        type_of_submission: FormsSubmissionsLevelsTypesEnum.FieldsLevel.key,
        editor_role: FormsRolesEnum.Variables.key,
        role_type: FormsAssistRoleTypesEnum.Viewer.key,
      });
      setIsLocalLoading(false);
      if (response && response.status === 200)
        GlobalHistory.push(
          `${response.data.results.form_link}&source=${NavigationSourcesEnum.OnboardingResponsesViewToFormBuilder.key}`,
        );
      else showError(t(`InvitationsPage:generate-form-link-failed`), response);
    },
    [t],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle table actions
   */
  const onActionClicked = ({ action, row, member }) => {
    if (action.key === SystemActionsEnum.view.key)
      generateFormLinkHandler({ row, member });
  };

  return (
    <div className="  px-1 ">
      {filtersComponent()}
      <Grid
        container
        spacing={2}
        className="onboarding-scrollable-page-contents-wrapper p-2"
        ref={bodyRef}
        style={{ marginInlineStart: '-16px' }}
      >
        <Grid item md={12} className=" p-0" sx={{ maxWidth: '100%' }}>
          {tableData?.results.map((item, index) => (
            <OnboardingAccordion
              actionComponent={
                item.redirect_link ? (
                  <RedirectToCandidateButton redirectLink={item.redirect_link} />
                ) : (
                  false
                )
              }
              key={`${item.uuid}-${index}`}
              withAvatar={
                filter?.group?.group_by
                !== OnboardingGroupByActionsEnum?.Fields?.group_by
              }
              member={{
                name:
                  filter?.group?.group_by
                  === OnboardingGroupByActionsEnum?.Fields?.group_by
                    ? item?.title
                    : item?.member || extractName(item),
                url: item.url,
              }}
              expanded={expandedAccordions.includes(index)}
              onChange={() => onChangeAccordion(index)}
              withExtraButton={true}
              onExtraButtonClick={() => null}
              bodyComponent={
                <div className="d-flex mx-2 ">
                  <div className="page-body-wrapper responses-table">
                    <TablesComponent
                      // tableOptions={{ tableSize: 'small' }}
                      // isWithCheckAll
                      isWithoutBoxWrapper
                      themeClasses={'theme-transparent'}
                      // pageSize={item?.responses?.length || 0}
                      totalItems={item?.variables?.length || 0}
                      data={item?.variables}
                      headerData={tableColumns}
                      isWithTableActions
                      onActionClicked={(action, row) =>
                        onActionClicked({ action, row, member: item })
                      }
                      tableActions={[SystemActionsEnum.view]}
                      pageIndex={0}
                      isLoading={isLoading || isLocalLoading}
                      tableActionsOptions={{
                        getTooltipTitle: ({ row, actionEnum }) =>
                          (actionEnum.key === SystemActionsEnum.delete.key
                            && row.can_delete === false
                            && t('Shared:can-delete-description'))
                          || '',
                        getDisabledAction: (row, rowIndex, action) => {
                          if (action.key === SystemActionsEnum.view.key)
                            return !getIsAllowedPermissionV2({
                              permissionId: ManageFlowPermissions.ViewFlow.key,
                              permissions: permissionsReducer,
                            });
                          return true;
                        },
                      }}
                      // isLoading={isApprovalsLoading}
                      // onActionClicked={onActionClicked}
                      // totalItems={approvals.totalCount}
                      // onPageSizeChanged={onPageSizeChanged}
                      // onPageIndexChanged={onPageIndexChanged}

                      // withCustomButton
                    />
                  </div>
                </div>
              }
            />
          ))}
        </Grid>

        {isLoading
          && Array.from(new Array(4)).map((item, index) => (
            <Grid item md={12} key={`${item}${index}`}>
              <Skeleton
                variant="rectangular"
                sx={{ height: '30px', width: '100%' }}
              />
            </Grid>
          ))}
      </Grid>
    </div>
  );
};

AssignedToView.propTypes = {
  onChangeAccordion: PropTypes.func.isRequired,
  extractName: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  translationPath: PropTypes.string.isRequired,
  filtersComponent: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.func,
    PropTypes.node,
  ]).isRequired,

  members: PropTypes.shape({
    url: PropTypes.string,
    name: PropTypes.string,
  }),
  expandedAccordions: PropTypes.instanceOf(Array),
  bodyRef: PropTypes.instanceOf(Object),
  tableData: PropTypes.instanceOf(Object),
  // filter: PropTypes.instanceOf(Object),
};

AssignedToView.defaultProps = {};
