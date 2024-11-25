import {
  UpdateSetupsCandidateProperties,
  CreateSetupsCandidateProperties,
  GetSetupsCandidatePropertiesById,
  GetAllSetupsCandidateProperties,
  DeleteSetupsCandidateProperties,
} from '../../../../services';
import { TablesNameEnum } from '../../../../enums';

import LookupsComponent from '../components/lookups/Lookups.Component';
import { CandidatePropertiesExtrasComponent } from '../components';

export const CandidatePropertiesTabs = [
  {
    label: 'candidate-properties',
    component: LookupsComponent,
    props: {
      lookup: {
        key: 1,
        label: 'candidate-properties',
        valueSingle: 'candidate-properties',
        feature_name: TablesNameEnum.CandidateProperty.key, // change
        updateAPI: UpdateSetupsCandidateProperties,
        createAPI: CreateSetupsCandidateProperties,
        viewAPI: GetSetupsCandidatePropertiesById,
        listAPI: GetAllSetupsCandidateProperties,
        deleteAPI: DeleteSetupsCandidateProperties,
        atTheEndComponent: CandidatePropertiesExtrasComponent,
        isWithDescription: true,
      },
    },
  },
];
