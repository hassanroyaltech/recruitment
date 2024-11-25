import React, { useCallback, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  DeletePipelineTask,
  GetAllPipelineTasks,
} from '../../../../../../../services';
import { ButtonBase, CircularProgress } from '@mui/material';
import {
  PipelineDetailsSectionEnum,
  PipelineTasksViewsEnum,
  SystemActionsEnum,
} from '../../../../../../../enums';
import { LoaderComponent, PopoverComponent } from '../../../../../../../components';
import { showError, showSuccess } from '../../../../../../../helpers';
import { PipelineTaskCard } from '../../../../../templates/pipeline-tasks/components/PipelineTaskCard.Component';

export const AutomatedWorkflowsTab = ({
  activePipeline,
  activePipelineItem,
  onOpenedDetailsSectionChanged,
  setView,
  setIsOpen,
  translationPath,
  parentTranslationPath,
  listingFilter,
  setListingFilter,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [pipelineTasksList, setPipelineTasksList] = useState({
    results: [],
    totalCount: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [popoverAttachedWith, setPopoverAttachedWith] = useState(null);
  const [activeItem, setActiveItem] = useState(null);

  const GetAutomatedWorkflowsHandler = useCallback(async () => {
    if (listingFilter.page === 1) setIsLoading(true);
    else setLoadMoreLoading(true);
    const response = await GetAllPipelineTasks({
      ...listingFilter,
      pipeline_uuid:
        activePipeline?.origin_pipeline_uuid
        || activePipelineItem?.pipeline?.origin_pipeline_uuid
        || activePipeline?.uuid
        || activePipelineItem?.pipeline?.uuid,
    });
    setIsLoading(false);
    setLoadMoreLoading(false);
    if (response && response.status === 200)
      if (listingFilter.page === 1)
        setPipelineTasksList({
          results: response.data.results || [],
          totalCount: response.data.paginate?.total || 0,
        });
      else
        setPipelineTasksList((items) => ({
          results: items.results.concat(response.data.results || []),
          totalCount: response.data.paginate.total || 0,
        }));
    else {
      setPipelineTasksList({ results: [], totalCount: 0 });
      showError(t('Shared:failed-to-get-saved-data'), response);
    }
  }, [t, activePipeline, listingFilter, activePipelineItem]);

  const DeletePipelineTaskHandler = useCallback(async () => {
    const response = await DeletePipelineTask({ uuids: [activeItem.uuid] });
    if (response && response.status === 202) {
      showSuccess(t(`${translationPath}pipeline-task-deleted-successfully`));
      setListingFilter((items) => ({ ...items }));
      setActiveItem(null);
    } else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [activeItem, setListingFilter, t, translationPath]);

  useEffect(() => {
    GetAutomatedWorkflowsHandler();
  }, [GetAutomatedWorkflowsHandler, listingFilter]);

  return (
    <div style={{ minHeight: '30vh' }}>
      <div className="px-4">
        <div className="fz-12px c-gray">{`${pipelineTasksList.totalCount} ${t(
          `${translationPath}actions-and-triggers`,
        )}`}</div>
        {isLoading ? (
          <LoaderComponent
            isLoading={isLoading}
            isSkeletonto
            skeletonItems={[
              {
                variant: 'rectangular',
                style: { minHeight: 25, marginTop: 10, marginBottom: 10 },
              },
            ]}
            numberOfRepeat={7}
          />
        ) : (
          <>
            <div className="my-3">
              {pipelineTasksList.results.map((item, idx) => (
                <div
                  role="button"
                  tabIndex={idx}
                  key={`pipeline-task-${item.uuid}-${idx}`}
                  className="pipeline-task-card-wrapper p-3 d-flex my-2"
                  onClick={(e) => {
                    setPopoverAttachedWith(e.target);
                    setActiveItem(item);
                  }}
                  onKeyDown={() => {
                    setView({
                      key: PipelineTasksViewsEnum.VIEW_DETAILS.key,
                      data: {
                        pipeline_task_uuid: item.uuid,
                      },
                    });
                    onOpenedDetailsSectionChanged(
                      PipelineDetailsSectionEnum.PipelineTasks.key,
                    );
                    if (setIsOpen) setIsOpen(true);
                  }}
                >
                  <div>
                    <ButtonBase className="btns theme-transparent miw-0 bg-gray-lighter p-2">
                      <span className="fas fa-random" />
                    </ButtonBase>
                  </div>
                  <div className="mx-3">
                    <PipelineTaskCard
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                      activePipeline={activePipeline}
                      data={item}
                    />
                  </div>
                </div>
              ))}
            </div>
            {pipelineTasksList.results.length < pipelineTasksList.totalCount && (
              <ButtonBase
                className="btns theme-transparent"
                onClick={() =>
                  setListingFilter((items) => ({ ...items, page: items.page + 1 }))
                }
              >
                {loadMoreLoading && (
                  <div className="mx-2 c-gray">
                    <CircularProgress size={20} color="inherit" />
                  </div>
                )}
                <span>{t(`${translationPath}load-more`)}</span>
              </ButtonBase>
            )}
          </>
        )}
      </div>
      <div className="my-3">
        <ButtonBase
          className="btns theme-transparent mx-3 px-3"
          onClick={() => {
            if (onOpenedDetailsSectionChanged)
              onOpenedDetailsSectionChanged(
                PipelineDetailsSectionEnum.PipelineTasks.key,
              );
            if (setIsOpen) setIsOpen(true);
          }}
        >
          <span className="fas fa-plus" />
          <span className="mx-2">
            {t(`${translationPath}add-triggered-actions`)}
          </span>
        </ButtonBase>
      </div>
      {popoverAttachedWith && (
        <PopoverComponent
          idRef="stagesNavigatorSectionPopover"
          attachedWith={popoverAttachedWith}
          handleClose={() => {
            setPopoverAttachedWith(null);
            setActiveItem(null);
          }}
          popoverClasses="stages-navigator-popover-wrapper"
          component={
            <div className="stages-navigator-items-wrapper min-width-200px">
              <ButtonBase
                className="btns theme-transparent"
                onClick={() => {
                  setView({
                    key: PipelineTasksViewsEnum.VIEW_DETAILS.key,
                    data: {
                      pipeline_task_uuid: activeItem.uuid,
                    },
                  });
                  onOpenedDetailsSectionChanged(
                    PipelineDetailsSectionEnum.PipelineTasks.key,
                  );
                  if (setIsOpen) setIsOpen(true);
                  setPopoverAttachedWith(null);
                }}
              >
                <span className="px-2">{t(`${translationPath}view-task`)}</span>
              </ButtonBase>
              <ButtonBase
                className="btns theme-transparent"
                onClick={() => {
                  // call view logs
                  setPopoverAttachedWith(null);
                }}
              >
                <span className="px-2">{`${t(`${translationPath}view-logs`)} (${t(
                  `${translationPath}coming-soon`,
                )})`}</span>
              </ButtonBase>
              <ButtonBase
                className="btns theme-transparent"
                onClick={() => {
                  // call change status
                  setPopoverAttachedWith(null);
                }}
              >
                <span
                  className={`fas fa-toggle-${
                    activeItem.status ? 'on c-accent-secondary' : 'off c-gray'
                  }`}
                />
                <span className="px-2">{`${t(
                  `${translationPath}${
                    activeItem.status ? 'pause-task' : 'run-task'
                  }`,
                )} (${t(`${translationPath}coming-soon`)})`}</span>
              </ButtonBase>
              <div className="separator-h" />
              <ButtonBase
                className="btns theme-transparent"
                onClick={() => {
                  DeletePipelineTaskHandler();
                  setPopoverAttachedWith(null);
                }}
              >
                <span className={SystemActionsEnum.delete.icon} />
                <span className="px-2">{t(`${translationPath}remove`)}</span>
              </ButtonBase>
            </div>
          }
        />
      )}
    </div>
  );
};
AutomatedWorkflowsTab.propTypes = {
  activePipeline: PropTypes.shape({
    uuid: PropTypes.string,
    origin_pipeline_uuid: PropTypes.string,
  }),
  activePipelineItem: PropTypes.shape({
    pipeline: PropTypes.shape({
      uuid: PropTypes.string,
      origin_pipeline_uuid: PropTypes.string,
    }),
  }),
  onOpenedDetailsSectionChanged: PropTypes.func,
  setView: PropTypes.func,
  setIsOpen: PropTypes.func,
  translationPath: PropTypes.string,
  parentTranslationPath: PropTypes.string.isRequired,
  listingFilter: PropTypes.shape({
    page: PropTypes.number,
    limit: PropTypes.number,
    query: PropTypes.string,
  }).isRequired,
  setListingFilter: PropTypes.func.isRequired,
};
