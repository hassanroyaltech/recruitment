import {
  RatingStarIcon,
  ScorecardDesicionIcon,
  ScorecardDropdownIcon,
} from '../../../../../assets/icons';

const blocksData = {
  rating: {
    id: 'rating-component',
    type: 'rating', //dynamic=rating, decision/dropdown
    model: 'card',
    cardTitle: { en: 'Rating', ar: 'التقييم' },
    is_required: true,
    title: { en: 'Rating' },
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
        min: 'bad',
        med: '',
        max: 'good',
      },
    },
    icon: RatingStarIcon,
    block_setting: {
      is_enable_comment: false,
      is_required_comment: false,
    },
    is_dynamic: false,
    profile_field: '',
    decision: {
      accept: { en: 'Accept' },
      reject: { en: 'Reject' },
      value: 0,
    },
    options: ['Option'],
  },
  dropdown: {
    id: 'dropdown-component',
    type: 'dropdown',
    model: 'card',
    is_required: true,
    cardTitle: { en: 'Dropdown', ar: 'قائمة منسدلة' },
    title: { en: 'Dropdown' },
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
        min: 'bad',
        med: '',
        max: 'good',
      },
    },
    icon: ScorecardDropdownIcon,
    block_setting: {
      is_enable_comment: false,
      is_required_comment: false,
    },
    is_dynamic: false,
    profile_field: '',
    decision: {
      accept: { en: 'Accept' },
      reject: { en: 'Reject' },
      value: 0,
    },
    options: ['Option'],
  },
  decision: {
    id: 'decision-component',
    type: 'decision', //dynamic=rating, decision/dropdown
    model: 'card',
    cardTitle: { en: 'Decision', ar: 'القرار النهائي' },
    is_required: true,
    title: { en: 'Would you hire this person?' },
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
        min: 'bad',
        med: '',
        max: 'good',
      },
    },
    icon: ScorecardDesicionIcon,
    block_setting: {
      is_enable_comment: false,
      is_required_comment: false,
    },
    is_dynamic: false,
    profile_field: '',
    decision: {
      accept: { en: 'Accept' },
      reject: { en: 'Reject' },
      value: 0,
    },
    options: ['Option'],
  },
};
export default blocksData;
