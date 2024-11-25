import React from 'react';
import PropTypes from 'prop-types';
import '../../pipelines/managements/pipeline/sections/pipeline-drawer/PipelineDrawer.Style.scss';
import { PipelineTasksViewsEnum } from '../../../../enums';
import { PipelineTaskLibrary } from './views/PipelineTaskLibrary';
import { CreatePipelineTask } from './views/CreatePipelineTask';
import { ViewPipelineTask } from './views/ViewPipelineTask';
import './PipelineTasksSection.scss';

export const PipelineTasksSection = ({
  parentTranslationPath,
  translationPath,
  activePipeline,
  onOpenedDetailsSectionChanged,
  view,
  setView,
  viewInit,
  setIsOpen,
  setListingFilter,
}) => (
  <>
    {view.key === PipelineTasksViewsEnum.LIBRARY.key && (
      <PipelineTaskLibrary
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onOpenedDetailsSectionChanged={onOpenedDetailsSectionChanged}
        setView={setView}
        setIsOpen={setIsOpen}
      />
    )}
    {view.key === PipelineTasksViewsEnum.CREATE.key && (
      <CreatePipelineTask
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        // onOpenedDetailsSectionChanged={onOpenedDetailsSectionChanged}
        setView={setView}
        activePipeline={activePipeline}
        view={view}
        setListingFilter={setListingFilter}
      />
    )}
    {view.key === PipelineTasksViewsEnum.VIEW_DETAILS.key && (
      <ViewPipelineTask
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onOpenedDetailsSectionChanged={onOpenedDetailsSectionChanged}
        setView={setView}
        activePipeline={activePipeline}
        pipelineTaskUuid={view.data?.pipeline_task_uuid}
        view={view}
        viewInit={viewInit}
        setListingFilter={setListingFilter}
      />
    )}
  </>
);

PipelineTasksSection.propTypes = {
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
  activePipeline: PropTypes.shape({
    uuid: PropTypes.string,
    description: PropTypes.string,
    tags: PropTypes.instanceOf(Array),
    stages: PropTypes.instanceOf(Array),
    team: PropTypes.instanceOf(Array),
    status: PropTypes.bool,
    language_id: PropTypes.string,
    position: PropTypes.instanceOf(Object),
    title: PropTypes.string,
    stages_count: PropTypes.number,
    origin_pipeline_uuid: PropTypes.string,
  }),
  onOpenedDetailsSectionChanged: PropTypes.func,
  view: PropTypes.shape({
    key: PropTypes.number,
    data: PropTypes.shape({
      pipeline_task_uuid: PropTypes.string,
    }),
  }),
  setView: PropTypes.func,
  viewInit: PropTypes.shape({}),
  setIsOpen: PropTypes.func,
  setListingFilter: PropTypes.func,
};

PipelineTasksSection.defaultProps = {
  parentTranslationPath: undefined,
  translationPath: undefined,
  activePipeline: undefined,
  onOpenedDetailsSectionChanged: undefined,
};
