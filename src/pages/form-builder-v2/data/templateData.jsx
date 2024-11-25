// import { FormsRolesEnum } from '../../../enums';

const template = {
  uuid: '',
  code: '',
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
  // isNotShareable: false,
  primaryLang: 'en',
  secondaryLang: '',
  layout: 'row', // layout -        ['column', 'row']
  labelsLayout: 'row', // labelsLayout -        ['column', 'row']
  fieldLayout: 'column', // fieldLayout -        ['column', 'row']
  // editorRole: FormsRolesEnum.Creator.key, // editorRole -    [FormsRolesEnum.Creator.key, FormsRolesEnum.Sender.key, FormsRolesEnum.Recipient.key]
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
