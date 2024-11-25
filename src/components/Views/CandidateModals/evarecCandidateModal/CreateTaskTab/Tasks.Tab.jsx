import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@mui/material';
import { SystemActionsEnum } from '../../../../../enums';
import { GetAllTasks } from '../../../../../services';
import { TasksCardsComponent } from './TasksCard.Component';
import i18next from 'i18next';
import { TasksIcon } from './Tasks.Icon';
import { TaskDrawer } from './components/Task.Drawer';
import { getIsAllowedPermissionV2, showError } from '../../../../../helpers';
import { EvaRecTaskManagementPermissions } from '../../../../../permissions';
import { useSelector } from 'react-redux';

export const TasksTab = ({ candidate_uuid, parentTranslationPath, job_uuid }) => {
  const { t } = useTranslation(parentTranslationPath);
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );
  const isLoadingRef = useRef(false);
  const [
    ,
    // isLoading
    setIsLoading,
  ] = useState(false);
  const [showTaskDrawer, setShowTaskDrawer] = useState(false);
  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
    use_for: 'list',
  });
  const [tasksList, setTasksList] = useState({
    results: [],
    totalCount: 0,
    lastPage: 0,
  });
  const [activeItem, setActiveItem] = useState(null);
  const [createTaskModeOn, setCreateTaskModeOn] = useState(false);

  const GetAllTasksHandler = useCallback(async () => {
    isLoadingRef.current = true;
    setIsLoading(true);
    const res = await GetAllTasks({
      ...filter,
      filters: {
        relation_uuid: candidate_uuid,
        job_uuid,
      },
    });
    isLoadingRef.current = true;
    setIsLoading(false);
    if (res && res.status === 200)
      if (filter.page === 1)
        setTasksList({
          results: res.data.results || [],
          totalCount: res.data.paginate?.total || 0,
          lastPage: res.data.paginate?.lastPage || 0,
        });
      else
        setTasksList((items) => ({
          results: items.results.concat(res.data.results || []),
          totalCount: res.data.paginate.total || 0,
          lastPage: res.data.paginate.lastPage || 0,
        }));
    else {
      setTasksList({ results: [], totalCount: 0, lastPage: 0 });
      showError(t('Shared:failed-to-get-saved-data'), res);
    }
  }, [candidate_uuid, filter, t, job_uuid]);

  const onPageIndexChanged = (newIndex) => {
    setFilter((items) => ({ ...items, page: newIndex + 1 }));
  };

  const onActionClicked = (action, row, rowIndex, event, popoverToggleHandler) => {
    setActiveItem(row);
    if (action.key === SystemActionsEnum.viewDetails.key) setShowTaskDrawer(true);

    if (popoverToggleHandler) popoverToggleHandler();
  };

  useEffect(() => {
    GetAllTasksHandler();
  }, [GetAllTasksHandler, filter]);

  return (
    <div className="my-2 bg-white p-3">
      <div className="drawer-header d-flex-v-center-h-between mt-2 mb-4">
        <div className="d-flex-v-center">
          <div className="fz-20px fw-bold">{t('new-task')}</div>
        </div>
        <div className="d-flex-v-center-h-end">
          <ButtonBase
            disabled={
              !getIsAllowedPermissionV2({
                permissionId: EvaRecTaskManagementPermissions.CreateTask.key,
                permissions: permissionsReducer,
              })
            }
            className="btns theme-solid mx-3"
            onClick={() => {
              setCreateTaskModeOn(true);
              setShowTaskDrawer(true);
            }}
          >
            {t('create-task')}
          </ButtonBase>
        </div>
      </div>
      <div>
        <TasksCardsComponent
          data={tasksList.results}
          lastPage={tasksList.lastPage}
          pageIndex={filter.page}
          limit={filter.limit}
          icon={<TasksIcon />}
          titleKey="title"
          subTitleComponent={(card) => (
            <div className="d-flex-v-center">
              <span className="fas fa-file c-black" />
              <span className="c-black mx-2">{card.type?.value || ''}</span>
            </div>
          )}
          tagComponent={(card) => (
            <>
              <span
                className="fas fa-circle fa-xs c-gray-secondary mx-2"
                style={{ fontSize: '8px' }}
              />
              <span>
                {card.status?.name?.[i18next.language]
                  || card.status?.name?.en
                  || ''}
              </span>
            </>
          )}
          dateKey="due_date"
          onPageIndexChanged={onPageIndexChanged}
          parentTranslationPath={parentTranslationPath}
          onCardClick={({ card, index, e }) =>
            onActionClicked(SystemActionsEnum.viewDetails, card, index, e)
          }
          isVertical
          // footerComponent={(card) =>
          //   card?.additional_data?.job?.uuid !== job_uuid && (
          //     <TooltipsComponent
          //       parentTranslationPath={parentTranslationPath}
          //       title={`${t('this-task-belongs-to-job')}: ${card?.additional_data?.job?.name}`}
          //       contentComponent={
          //         <div className="c-accent-secondary my-2">
          //           <span className="fas fa-external-link-alt"/>
          //           <span className="mx-2">{t('external-task')}</span>
          //         </div>}
          //     />
          //   )
          // }
        />
      </div>
      {showTaskDrawer && (
        <TaskDrawer
          drawerOpen={showTaskDrawer}
          setDrawerOpen={setShowTaskDrawer}
          parentTranslationPath={parentTranslationPath}
          activeTask={activeItem}
          setActiveTask={setActiveItem}
          setFilter={setFilter}
          createTaskModeOn={createTaskModeOn}
          setCreateTaskModeOn={setCreateTaskModeOn}
          candidate_uuid={candidate_uuid}
          job_uuid={job_uuid}
        />
      )}
    </div>
  );
};

TasksTab.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  candidate_uuid: PropTypes.string.isRequired,
  job_uuid: PropTypes.string,
};
TasksTab.defaultProps = {
  parentTranslationPath: 'EvarecCandidateModel',
};
