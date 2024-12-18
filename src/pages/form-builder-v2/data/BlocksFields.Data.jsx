import {
  MeetMemberIcon,
  VideoIcon,
  ImageIcon,
  FormRatingIcon,
} from '../../form-builder/icons';
import { FormsRolesEnum } from '../../../enums';

const fields = {
  meetTeam: {
    id: 'meet-team-field',
    type: 'team_member',
    code: '',
    isVisible: true,
    isVisibleFinalDoc: true,
    showNumberOnEnglish: false,
    charMin: null,
    charMax: null,
    rowMin: null,
    rowMax: null,
    phoneAllowedCountries: [],
    attachmentAllowedFileFormats: [],
    maxFileSize: '',
    fileQuantityLimitation: '',
    isUploadAllowed: true,
    isDrawAllowed: true,
    isWriteAllowed: true,
    isRequired: false,
    phoneDefaultCountry: '',
    isPhoneMaskChecked: undefined,
    currency: null,
    description: '',
    fillBy: FormsRolesEnum.Sender.key,
    assign: [],
    cardTitle: 'meet-member',
    ratingValue: null,
    languages: {
      en: {
        value: '',
        placeholder: 'Enter text',
        title: 'Meet member',
        buttonLabel: 'Upload files',
        isConditionalHidden: false,
        isConditionalHiddenValue: null,
        labelDecorations: null,
        labelFontSize: 0,
        hideLabel: false,
        options: [
          {
            id: '',
            title: 'Option 1',
            isVisible: true,
            code: '',
          },
        ],
        rangeLabels: {
          min: 'Bad',
          med: '',
          max: 'Good',
        },
      },
      ar: {
        value: '',
        placeholder: 'أدخل النص',
        title: 'Meet member',
        buttonLabel: 'رفع الملفات',
        isConditionalHidden: false,
        isConditionalHiddenValue: null,
        labelDecorations: null,
        labelFontSize: 0,
        hideLabel: false,
        options: [
          {
            id: '',
            title: 'الخيار 1',
            isVisible: true,
            code: '',
          },
        ],
        rangeLabels: {
          min: 'سيِّئ',
          med: '',
          max: 'جيد',
        },
      },
      de: {
        value: '',
        placeholder: 'Enter text',
        title: 'Meet member',
        buttonLabel: 'Upload files',
        isConditionalHidden: false,
        isConditionalHiddenValue: null,
        labelDecorations: null,
        labelFontSize: 0,
        hideLabel: false,
        options: [
          {
            id: '',
            title: 'Option 1',
            isVisible: true,
            code: '',
          },
        ],
        rangeLabels: {
          min: 'Bad',
          med: '',
          max: 'Good',
        },
      },
    },
    icon: MeetMemberIcon,
  },
  video: {
    id: 'video-field',
    type: 'video',
    code: '',
    isVisible: true,
    isVisibleFinalDoc: true,
    showNumberOnEnglish: false,
    charMin: null,
    charMax: null,
    rowMin: null,
    rowMax: null,
    phoneAllowedCountries: [],
    attachmentAllowedFileFormats: [],
    maxFileSize: '',
    fileQuantityLimitation: '',
    isUploadAllowed: true,
    isDrawAllowed: true,
    isWriteAllowed: true,
    isRequired: false,
    phoneDefaultCountry: '',
    isPhoneMaskChecked: undefined,
    currency: null,
    description: '',
    fillBy: FormsRolesEnum.Sender.key,
    assign: [],
    cardTitle: 'video',
    ratingValue: null,
    languages: {
      en: {
        value: '',
        placeholder: 'About our company',
        title: 'Video',
        buttonLabel: 'Upload file',
        isConditionalHidden: false,
        isConditionalHiddenValue: null,
        labelDecorations: null,
        labelFontSize: 0,
        hideLabel: false,
        options: [
          {
            id: '',
            title: 'Option 1',
            isVisible: true,
            code: '',
          },
        ],
        rangeLabels: {
          min: 'Bad',
          med: '',
          max: 'Good',
        },
      },
      ar: {
        value: '',
        placeholder: 'About our company',
        title: 'Video',
        buttonLabel: 'رفع ملف',
        isConditionalHidden: false,
        isConditionalHiddenValue: null,
        labelDecorations: null,
        labelFontSize: 0,
        hideLabel: false,
        options: [
          {
            id: '',
            title: 'الخيار 1',
            isVisible: true,
            code: '',
          },
        ],
        rangeLabels: {
          min: 'سيِّئ',
          med: '',
          max: 'جيد',
        },
      },
      de: {
        value: '',
        placeholder: 'About our company',
        title: 'Video',
        buttonLabel: 'Upload file',
        isConditionalHidden: false,
        isConditionalHiddenValue: null,
        labelDecorations: null,
        labelFontSize: 0,
        hideLabel: false,
        options: [
          {
            id: '',
            title: 'Option 1',
            isVisible: true,
            code: '',
          },
        ],
        rangeLabels: {
          min: 'Bad',
          med: '',
          max: 'Good',
        },
      },
    },
    icon: VideoIcon,
  },
  videoGallery: {
    id: 'video-gallery-field',
    type: 'video_gallery',
    code: '',
    isVisible: true,
    isVisibleFinalDoc: true,
    showNumberOnEnglish: false,
    charMin: null,
    charMax: null,
    rowMin: null,
    rowMax: null,
    phoneAllowedCountries: [],
    attachmentAllowedFileFormats: [],
    maxFileSize: '',
    fileQuantityLimitation: '',
    isUploadAllowed: true,
    isDrawAllowed: true,
    isWriteAllowed: true,
    isRequired: false,
    phoneDefaultCountry: '',
    isPhoneMaskChecked: undefined,
    currency: null,
    description: '',
    fillBy: FormsRolesEnum.Sender.key,
    assign: [],
    cardTitle: 'video-gallery',
    ratingValue: null,
    languages: {
      en: {
        value: '',
        placeholder: { 0: 'About our company' },
        title: 'Video gallery',
        buttonLabel: 'Upload files',
        isConditionalHidden: false,
        isConditionalHiddenValue: null,
        labelDecorations: null,
        labelFontSize: 0,
        hideLabel: false,
        options: [
          {
            id: '',
            title: 'Option 1',
            isVisible: true,
            code: '',
          },
        ],
        rangeLabels: {
          min: 'Bad',
          med: '',
          max: 'Good',
        },
      },
      ar: {
        value: '',
        placeholder: { 0: 'About our company' },
        title: 'Video gallery',
        buttonLabel: 'رفع ملفات',
        isConditionalHidden: false,
        isConditionalHiddenValue: null,
        labelDecorations: null,
        labelFontSize: 0,
        hideLabel: false,
        options: [
          {
            id: '',
            title: 'الخيار 1',
            isVisible: true,
            code: '',
          },
        ],
        rangeLabels: {
          min: 'سيِّئ',
          med: '',
          max: 'جيد',
        },
      },
      de: {
        value: '',
        placeholder: { 0: 'About our company' },
        title: 'Video gallery',
        buttonLabel: 'Upload files',
        isConditionalHidden: false,
        isConditionalHiddenValue: null,
        labelDecorations: null,
        labelFontSize: 0,
        hideLabel: false,
        options: [
          {
            id: '',
            title: 'Option 1',
            isVisible: true,
            code: '',
          },
        ],
        rangeLabels: {
          min: 'Bad',
          med: '',
          max: 'Good',
        },
      },
    },
    icon: VideoIcon,
  },
  image: {
    id: 'form-onboarding-image',
    type: 'image',
    code: '',
    isVisible: true,
    isVisibleFinalDoc: true,
    showNumberOnEnglish: false,
    charMin: null,
    charMax: null,
    rowMin: null,
    rowMax: null,
    phoneAllowedCountries: [],
    attachmentAllowedFileFormats: [],
    maxFileSize: '',
    fileQuantityLimitation: '',
    isUploadAllowed: true,
    isDrawAllowed: true,
    isWriteAllowed: true,
    isRequired: false,
    phoneDefaultCountry: '',
    isPhoneMaskChecked: undefined,
    currency: null,
    description: '',
    fillBy: FormsRolesEnum.Sender.key,
    assign: [],
    cardTitle: 'image',
    ratingValue: null,
    languages: {
      en: {
        value: '',
        placeholder: '',
        title: 'Image',
        buttonLabel: 'Upload file',
        isConditionalHidden: false,
        isConditionalHiddenValue: null,
        labelDecorations: null,
        labelFontSize: 0,
        hideLabel: false,
        options: [
          {
            id: '',
            title: 'Option 1',
            isVisible: true,
            code: '',
          },
        ],
        rangeLabels: {
          min: 'Bad',
          med: '',
          max: 'Good',
        },
      },
      ar: {
        value: '',
        placeholder: 'About our company',
        title: 'Image',
        buttonLabel: 'رفع صورة',
        isConditionalHidden: false,
        isConditionalHiddenValue: null,
        labelDecorations: null,
        labelFontSize: 0,
        hideLabel: false,
        options: [
          {
            id: '',
            title: 'الخيار 1',
            isVisible: true,
            code: '',
          },
        ],
        rangeLabels: {
          min: 'سيِّئ',
          med: '',
          max: 'جيد',
        },
      },
      de: {
        value: '',
        placeholder: '',
        title: 'Image',
        buttonLabel: 'Upload file',
        isConditionalHidden: false,
        isConditionalHiddenValue: null,
        labelDecorations: null,
        labelFontSize: 0,
        hideLabel: false,
        options: [
          {
            id: '',
            title: 'Option 1',
            isVisible: true,
            code: '',
          },
        ],
        rangeLabels: {
          min: 'Bad',
          med: '',
          max: 'Good',
        },
      },
    },
    icon: ImageIcon,
  },
  imageGallery: {
    id: 'form-onboarding-image-gallery',
    type: 'image_gallery',
    code: '',
    isVisible: true,
    isVisibleFinalDoc: true,
    showNumberOnEnglish: false,
    charMin: null,
    charMax: null,
    rowMin: null,
    rowMax: null,
    phoneAllowedCountries: [],
    attachmentAllowedFileFormats: [],
    maxFileSize: '',
    fileQuantityLimitation: '',
    isUploadAllowed: true,
    isDrawAllowed: true,
    isWriteAllowed: true,
    isRequired: false,
    phoneDefaultCountry: '',
    isPhoneMaskChecked: undefined,
    currency: null,
    description: '',
    fillBy: FormsRolesEnum.Sender.key,
    assign: [],
    cardTitle: 'image-gallery',
    ratingValue: null,
    languages: {
      en: {
        value: '',
        placeholder: '',
        title: 'Image gallery',
        buttonLabel: 'Upload files',
        isConditionalHidden: false,
        isConditionalHiddenValue: null,
        labelDecorations: null,
        labelFontSize: 0,
        hideLabel: false,
        options: [
          {
            id: '',
            title: 'Option 1',
            isVisible: true,
            code: '',
          },
        ],
        rangeLabels: {
          min: 'Bad',
          med: '',
          max: 'Good',
        },
      },
      ar: {
        value: '',
        placeholder: 'About our company',
        title: 'Image gallery',
        buttonLabel: 'رفع صور',
        isConditionalHidden: false,
        isConditionalHiddenValue: null,
        labelDecorations: null,
        labelFontSize: 0,
        hideLabel: false,
        options: [
          {
            id: '',
            title: 'الخيار 1',
            isVisible: true,
            code: '',
          },
        ],
        rangeLabels: {
          min: 'سيِّئ',
          med: '',
          max: 'جيد',
        },
      },
      de: {
        value: '',
        placeholder: '',
        title: 'Image gallery',
        buttonLabel: 'Upload file',
        isConditionalHidden: false,
        isConditionalHiddenValue: null,
        labelDecorations: null,
        labelFontSize: 0,
        hideLabel: false,
        options: [
          {
            id: '',
            title: 'Option 1',
            isVisible: true,
            code: '',
          },
        ],
        rangeLabels: {
          min: 'Bad',
          med: '',
          max: 'Good',
        },
      },
    },
    icon: ImageIcon,
  },
  directManager: {
    id: 'direct-manager-field',
    type: 'direct_manager',
    code: '',
    isVisible: true,
    isVisibleFinalDoc: true,
    showNumberOnEnglish: false,
    charMin: null,
    charMax: null,
    rowMin: null,
    rowMax: null,
    phoneAllowedCountries: [],
    attachmentAllowedFileFormats: [],
    maxFileSize: '',
    fileQuantityLimitation: '',
    isUploadAllowed: true,
    isDrawAllowed: true,
    isWriteAllowed: true,
    isRequired: false,
    phoneDefaultCountry: '',
    isPhoneMaskChecked: undefined,
    currency: null,
    description: '',
    fillBy: FormsRolesEnum.Sender.key,
    assign: [],
    cardTitle: 'direct-manager',
    ratingValue: null,
    languages: {
      en: {
        value: '',
        placeholder: 'Enter text',
        title: 'Direct manager',
        buttonLabel: 'Upload files',
        isConditionalHidden: false,
        isConditionalHiddenValue: null,
        labelDecorations: null,
        labelFontSize: 0,
        hideLabel: false,
        options: [
          {
            id: '',
            title: 'Option 1',
            isVisible: true,
            code: '',
          },
        ],
        rangeLabels: {
          min: 'Bad',
          med: '',
          max: 'Good',
        },
      },
      ar: {
        value: '',
        placeholder: 'المدير المباشر',
        title: 'المدير المباشر',
        buttonLabel: 'رفع الملفات',
        isConditionalHidden: false,
        isConditionalHiddenValue: null,
        labelDecorations: null,
        labelFontSize: 0,
        hideLabel: false,
        options: [
          {
            id: '',
            title: 'الخيار 1',
            isVisible: true,
            code: '',
          },
        ],
        rangeLabels: {
          min: 'سيِّئ',
          med: '',
          max: 'جيد',
        },
      },
      de: {
        value: '',
        placeholder: 'Enter text',
        title: 'Direct manager',
        buttonLabel: 'Upload files',
        isConditionalHidden: false,
        isConditionalHiddenValue: null,
        labelDecorations: null,
        labelFontSize: 0,
        hideLabel: false,
        options: [
          {
            id: '',
            title: 'Option 1',
            isVisible: true,
            code: '',
          },
        ],
        rangeLabels: {
          min: 'Bad',
          med: '',
          max: 'Good',
        },
      },
    },
    icon: MeetMemberIcon,
  },
  headOfDepartment: {
    id: 'head-of-department-field',
    type: 'head_of_department',
    code: '',
    isVisible: true,
    isVisibleFinalDoc: true,
    showNumberOnEnglish: false,
    charMin: null,
    charMax: null,
    rowMin: null,
    rowMax: null,
    phoneAllowedCountries: [],
    attachmentAllowedFileFormats: [],
    maxFileSize: '',
    fileQuantityLimitation: '',
    isUploadAllowed: true,
    isDrawAllowed: true,
    isWriteAllowed: true,
    isRequired: false,
    phoneDefaultCountry: '',
    isPhoneMaskChecked: undefined,
    currency: null,
    description: '',
    fillBy: FormsRolesEnum.Sender.key,
    assign: [],
    cardTitle: 'head-of-department',
    ratingValue: null,
    languages: {
      en: {
        value: '',
        placeholder: 'Enter text',
        title: 'Head of department',
        buttonLabel: 'Upload files',
        isConditionalHidden: false,
        isConditionalHiddenValue: null,
        labelDecorations: null,
        labelFontSize: 0,
        hideLabel: false,
        options: [
          {
            id: '',
            title: 'Option 1',
            isVisible: true,
            code: '',
          },
        ],
        rangeLabels: {
          min: 'Bad',
          med: '',
          max: 'Good',
        },
      },
      ar: {
        value: '',
        placeholder: 'رئيس القسم',
        title: 'رئيس القسم',
        buttonLabel: 'رفع الملفات',
        isConditionalHidden: false,
        isConditionalHiddenValue: null,
        labelDecorations: null,
        labelFontSize: 0,
        hideLabel: false,
        options: [
          {
            id: '',
            title: 'الخيار 1',
            isVisible: true,
            code: '',
          },
        ],
        rangeLabels: {
          min: 'سيِّئ',
          med: '',
          max: 'جيد',
        },
      },
      de: {
        value: '',
        placeholder: 'Enter text',
        title: 'Head of department',
        buttonLabel: 'Upload files',
        isConditionalHidden: false,
        isConditionalHiddenValue: null,
        labelDecorations: null,
        labelFontSize: 0,
        hideLabel: false,
        options: [
          {
            id: '',
            title: 'Option 1',
            isVisible: true,
            code: '',
          },
        ],
        rangeLabels: {
          min: 'Bad',
          med: '',
          max: 'Good',
        },
      },
    },
    icon: MeetMemberIcon,
  },
  rating: {
    id: 'rating-field',
    type: 'rating',
    code: '',
    isVisible: true,
    isVisibleFinalDoc: true,
    showNumberOnEnglish: false,
    charMin: null,
    charMax: null,
    rowMin: null,
    rowMax: null,
    phoneAllowedCountries: [],
    attachmentAllowedFileFormats: [],
    maxFileSize: '',
    fileQuantityLimitation: '',
    isUploadAllowed: true,
    isDrawAllowed: true,
    isWriteAllowed: true,
    isRequired: false,
    phoneDefaultCountry: '',
    isPhoneMaskChecked: undefined,
    currency: null,
    description: '',
    fillBy: FormsRolesEnum.Sender.key,
    assign: [],
    cardTitle: 'rating',
    ratingValue: null,
    languages: {
      en: {
        value: '',
        placeholder: 'Enter text',
        title: 'Rating',
        buttonLabel: 'Upload files',
        isConditionalHidden: false,
        isConditionalHiddenValue: null,
        labelDecorations: null,
        labelFontSize: 0,
        hideLabel: false,
        options: [
          {
            id: '',
            title: 'Option 1',
            isVisible: true,
            code: '',
          },
        ],
        rangeLabels: {
          min: 'Bad',
          med: '',
          max: 'Good',
        },
      },
      ar: {
        value: '',
        placeholder: 'أدخل النص',
        title: 'التقييم',
        buttonLabel: 'رفع الملفات',
        isConditionalHidden: false,
        isConditionalHiddenValue: null,
        labelDecorations: null,
        labelFontSize: 0,
        hideLabel: false,
        options: [
          {
            id: '',
            title: 'الخيار 1',
            isVisible: true,
            code: '',
          },
        ],
        rangeLabels: {
          min: 'سيِّئ',
          med: '',
          max: 'جيد',
        },
      },
      de: {
        value: '',
        placeholder: 'Enter text',
        title: 'Rating',
        buttonLabel: 'Upload files',
        isConditionalHidden: false,
        isConditionalHiddenValue: null,
        labelDecorations: null,
        labelFontSize: 0,
        hideLabel: false,
        options: [
          {
            id: '',
            title: 'Option 1',
            isVisible: true,
            code: '',
          },
        ],
        rangeLabels: {
          min: 'Bad',
          med: '',
          max: 'Good',
        },
      },
    },
    icon: FormRatingIcon,
  },
};

export default fields;
