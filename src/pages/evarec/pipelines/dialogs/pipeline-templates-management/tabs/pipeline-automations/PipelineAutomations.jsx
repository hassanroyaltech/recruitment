import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { AutomatedWorkflowsTab } from './AutomatedWorkflows.Tab';
import { PipelineTasksViewsEnum } from '../../../../../../../enums';
import { PipelineAutomationDrawer } from './drawer/PipelineAutomation.Drawer';

const localParentTranslationPath = 'EvaRecPipelines';
const localTranslationPath = 'PipelineManagement.';
export const PipelineAutomations = ({
  activePipelineItem,
  activeItem,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const viewInit = useRef({
    key: PipelineTasksViewsEnum.LIBRARY.key,
    data: {},
  });
  const [view, setView] = useState(viewInit.current);
  const [isOpen, setIsOpen] = useState(null);
  const filterInit = useRef({
    limit: 4,
    page: 1,
    query: null,
  });
  const [listingFilter, setListingFilter] = useState(filterInit.current);

  return (
    <>
      <div className="template-setup-tab-wrapper">
        <div className="body-content-wrapper">
          <div className="header-text-x2 mb-4">
            <span>{t(`${translationPath}pipeline-automations`)}</span>
          </div>
          <div>
            <AutomatedWorkflowsTab
              activePipeline={activeItem}
              translationPath={localTranslationPath}
              parentTranslationPath={localParentTranslationPath}
              onOpenedDetailsSectionChanged={() => {}}
              jobUUID=""
              setView={setView}
              setIsOpen={setIsOpen}
              activePipelineItem={activePipelineItem}
              listingFilter={listingFilter}
              setListingFilter={setListingFilter}
            />
          </div>
        </div>
      </div>
      <PipelineAutomationDrawer
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        activePipeline={activeItem}
        activePipelineItem={activePipelineItem}
        view={view}
        setView={setView}
        viewInit={viewInit}
        translationPath={localTranslationPath}
        parentTranslationPath={localParentTranslationPath}
        setListingFilter={setListingFilter}
      />
    </>
  );
};

PipelineAutomations.propTypes = {
  activePipelineItem: PropTypes.shape({
    pipeline: PropTypes.shape({
      uuid: PropTypes.string,
    }),
  }),
  activeItem: PropTypes.instanceOf(Object),
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
PipelineAutomations.defaultProps = {
  activeItem: null,
};
