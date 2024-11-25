import {
  StagesSetupTab,
  TemplateSetupTab,
  PipelineAutomations,
} from '../../pipelines/dialogs/pipeline-templates-management/tabs';

export const PipelineTemplatesTabs = [
  {
    key: 1,
    label: 'stages-setup',
    component: StagesSetupTab,
  },
  {
    key: 2,
    label: 'template-setup',
    component: TemplateSetupTab,
  },
  {
    key: 3,
    label: 'pipeline-automation',
    component: PipelineAutomations,
  },
];
