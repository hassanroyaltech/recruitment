import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import Drawer from '@mui/material/Drawer';
import { PipelineTasksSection } from '../../../../../../templates/pipeline-tasks/PipelineTasks.Section';
export const PipelineAutomationDrawer = ({
  isOpen,
  setIsOpen,
  activePipeline,
  activePipelineItem,
  view,
  setView,
  viewInit,
  translationPath,
  parentTranslationPath,
  setListingFilter,
}) => {
  const drawerRef = useRef(null);

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={() => setIsOpen(null)}
      hideBackdrop
      PaperProps={{
        ref: drawerRef,
        style: {
          position: 'absolute',
        },
      }}
      className="pipeline-automation-drawer section-wrapper pipeline-details-section-wrapper"
    >
      <div className="details-contents-wrapper">
        <PipelineTasksSection
          activePipeline={activePipeline || activePipelineItem?.pipeline}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          setView={setView}
          view={view}
          viewInit={viewInit}
          setIsOpen={setIsOpen}
          setListingFilter={setListingFilter}
        />
      </div>
    </Drawer>
  );
};

PipelineAutomationDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  activePipeline: PropTypes.shape({}),
  activePipelineItem: PropTypes.shape({
    pipeline: PropTypes.shape({}),
  }),
  view: PropTypes.shape({
    key: PropTypes.number,
    data: PropTypes.shape({}),
  }),
  setView: PropTypes.func.isRequired,
  viewInit: PropTypes.shape({}),
  translationPath: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  setListingFilter: PropTypes.func,
};
