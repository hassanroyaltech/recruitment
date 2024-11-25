import { IndeedQuestionsTab } from './tabs/IndeedQuestions.tab';

export const IndeedQuestionsTabs = [
  {
    label: 'screener-questions',
    key: 1,
    component: IndeedQuestionsTab,
    props: {
      description: 'screener-questions-description',
      stateKey: 'screenerQuestions',
    },
  },
  {
    label: 'demographic-questions',
    key: 2,
    component: IndeedQuestionsTab,
    props: {
      description: 'demographic-questions-description',
      stateKey: 'demographicQuestions',
    },
  },
];
