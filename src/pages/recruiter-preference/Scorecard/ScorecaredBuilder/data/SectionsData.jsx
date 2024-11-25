import { ScorecardSectionIcon } from '../../../../../assets/icons';
import { ScorecardRangesEnum, ScorecardStylesEnum } from '../../../../../enums';

const sections = {
  section: {
    id: 'section',
    type: 'section',
    model: 'section',
    blocks: [],
    cardTitle: { en: 'New section', ar: 'قسم جديد' },
    title: { en: 'Untitled section' },
    description: {
      en: '',
    },
    weight: undefined,
    section_setting: {
      score: {
        score_range: '',
        score_style: '',
      },
      range_labels: {
        min: 'Bad',
        med: '',
        max: 'Good',
      },
    },
    icon: ScorecardSectionIcon,
  },
};
export default sections;
