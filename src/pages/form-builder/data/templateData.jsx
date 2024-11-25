const template = {
  uuid: '',
  typeUUID: '',
  title: 'Untitled',
  name: 'Untitled',
  categories: [],
  positionLevel: [],
  tags: [],
  status: true,
  pipelineType: '',
  description: 'Edit description',
  source: null,
  isGrid: false,
  isNotShareable: false,
  isWithDeadline: false,
  deadlineDays: null,
  primaryLang: 'en',
  secondaryLang: '',
  layout: 'row', // layout -        ['column', 'row']
  labelsLayout: 'row', // labelsLayout -        ['column', 'row']
  fieldLayout: 'column', // fieldLayout -        ['column', 'row']
  editorRole: 'creator', // editorRole -    ['creator', 'sender', 'recipient']
  sender: {
    name: '',
    avatar: '',
  },
  recipient: {
    name: '',
    avatar: '',
  },
  updatedAt: '',
  createdAt: '',
  sections: {},
  languages: {
    en: {
      name: 'English',
      icon: '',
    },
    ar: {
      name: 'Arabic',
      icon: '',
    },
    de: {
      name: 'Deutsch',
      icon: '',
    },
  },
};

export default template;
