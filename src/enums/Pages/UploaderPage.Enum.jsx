// noinspection SpellCheckingInspection,LongLine

import { UploaderThemesEnum } from '../Shared/UploaderThemes.Enum';
import { EvaBrandMediaTypesEnum } from './EvaBrandMediaTypes.Enum';
import { UploaderTypesEnum } from '../Shared/UploderTypes.Enum';

export const UploaderPageEnum = {
  EmailTemplates: {
    key: 'EmailTemplates',
    fromFeature: 'mail',
    accept: `${UploaderTypesEnum.Image.accept}, ${UploaderTypesEnum.Video.accept}, ${UploaderTypesEnum.Docs.accept}`,
    // type: UploaderTypesEnum.Docs.key,
    isDynamicCheck: true,
    multiple: true,
    isViewUploadedFilesCount: true,
    theme: UploaderThemesEnum.Box,
    isWithGalleryPreview: false,
    isDownloadable: true,
  },
  LookupsImport: {
    key: 'LookupsImport',
    fromFeature: 'media--lookups_import',
    accept: UploaderTypesEnum.DocsOnlyDB.accept,
    type: UploaderTypesEnum.DocsOnlyDB.key,
    isDynamicCheck: false,
    multiple: false,
    maxFileNumber: 1,
    isViewUploadedFilesCount: true,
    theme: UploaderThemesEnum.Box,
    isWithGalleryPreview: false,
    isDownloadable: true,
  },
  EvaSSESSVideo: {
    key: 'EvaSSESSVideo',
    fromFeature: 'prep_assessment',
    accept: `${UploaderTypesEnum.Video.accept}`,
    // type: UploaderTypesEnum.Docs.key,
    isDynamicCheck: true,
    multiple: false,
    maxFileNumber: 1,
    isViewUploadedFilesCount: true,
    theme: UploaderThemesEnum.Box,
    isWithGalleryPreview: false,
    isDownloadable: true,
  },
  EvaSSESSInviteCandidate: {
    key: 'EvaSSESSInviteCandidate',
    fromFeature: 'prep_assessment',
    accept: UploaderTypesEnum.DocsOnlyDB.accept,
    type: UploaderTypesEnum.DocsOnlyDB.key,
    multiple: false,
    isViewUploadedFilesCount: true,
    theme: UploaderThemesEnum.Box,
    isWithGalleryPreview: false,
    isDownloadable: true,
    maxFileNumber: 1,
  },
  EvaSSESSPipelineInviteCandidate: {
    key: 'EvaSSESSPipelineInviteCandidate',
    fromFeature: 'prep_assessment',
    accept: UploaderTypesEnum.DocsOnlyDB.accept,
    type: UploaderTypesEnum.DocsOnlyDB.key,
    multiple: false,
    isViewUploadedFilesCount: true,
    theme: UploaderThemesEnum.Box,
    isWithGalleryPreview: false,
    isDownloadable: true,
    maxFileNumber: 1,
  },
  AssessmentAttachment: {
    key: 'Eva-SSESS',
    fromFeature: 'prep_assessment--attachment',
    accept: `${UploaderTypesEnum.Image.accept}, ${UploaderTypesEnum.Video.accept}, ${UploaderTypesEnum.Docs.accept}`,
    // type: UploaderTypesEnum.Docs.key,
    isDynamicCheck: true,
    multiple: true,
    isViewUploadedFilesCount: true,
    theme: UploaderThemesEnum.Box,
    isWithGalleryPreview: false,
    isDownloadable: true,
  },
  QuestionnaireAttachment: {
    key: 'Questionnaire',
    fromFeature: 'questionnaires--attachment',
    accept: `${UploaderTypesEnum.Image.accept}, ${UploaderTypesEnum.Video.accept}, ${UploaderTypesEnum.Docs.accept}`,
    // type: UploaderTypesEnum.Docs.key,
    isDynamicCheck: true,
    multiple: true,
    isViewUploadedFilesCount: true,
    theme: UploaderThemesEnum.Box,
    isWithGalleryPreview: false,
    isDownloadable: true,
  },
  ATSAttachment: {
    key: 'Eva-Rec',
    fromFeature: 'ats--attachment',
    accept: `${UploaderTypesEnum.Image.accept}, ${UploaderTypesEnum.Video.accept}, ${UploaderTypesEnum.Docs.accept}`,
    // type: UploaderTypesEnum.Docs.key,
    isDynamicCheck: true,
    multiple: true,
    isViewUploadedFilesCount: true,
    theme: UploaderThemesEnum.Box,
    isWithGalleryPreview: false,
    isDownloadable: true,
    maxFileNumber: 5,
  },
  PipelineAttachment: {
    key: 'Pipeline',
    fromFeature: 'pipeline--attachment',
    accept: `${UploaderTypesEnum.Image.accept}, ${UploaderTypesEnum.Video.accept}, ${UploaderTypesEnum.Docs.accept}`,
    // type: UploaderTypesEnum.Docs.key,
    isDynamicCheck: true,
    multiple: true,
    isViewUploadedFilesCount: true,
    theme: UploaderThemesEnum.Box,
    isWithGalleryPreview: false,
    isDownloadable: true,
  },
  HeaderSectionContentsTap: {
    key: 'HeaderSectionContentsTap',
    fromFeature: 'career_portal',
    accept: `${UploaderTypesEnum.Image.accept}, ${UploaderTypesEnum.Video.accept}`,
    multiple: false,
    isViewUploadedFilesCount: true,
    theme: UploaderThemesEnum.Input,
    isWithGalleryPreview: false,
    isDownloadable: true,
    inputThemeClass: 'theme-solid',
    maxFileNumber: 1,
  },
  MediaTypeSingleImage: {
    key: 'MediaTypeSingleImage',
    fromFeature: 'career_portal',
    accept: UploaderTypesEnum.Image.accept,
    type: UploaderTypesEnum.Image.key,
    multiple: false,
    isViewUploadedFilesCount: true,
    theme: UploaderThemesEnum.Input,
    isWithGalleryPreview: false,
    isDownloadable: true,
    inputThemeClass: 'theme-solid',
    maxFileNumber: 1,
    mediaType: EvaBrandMediaTypesEnum.SingleImage.key,
  },
  MediaTypeMultipleImages: {
    key: 'MediaTypeMultipleImages',
    fromFeature: 'career_portal',
    accept: UploaderTypesEnum.Image.accept,
    type: UploaderTypesEnum.Image.key,
    multiple: true,
    isViewUploadedFilesCount: true,
    theme: UploaderThemesEnum.Input,
    isWithGalleryPreview: false,
    inputThemeClass: 'theme-solid',
    isDownloadable: true,
    mediaType: EvaBrandMediaTypesEnum.MultipleImages.key,
  },
  MediaTypeSingleVideo: {
    key: 'MediaTypeSingleVideo',
    fromFeature: 'career_portal',
    accept: UploaderTypesEnum.Video.accept,
    type: UploaderTypesEnum.Video.key,
    multiple: false,
    isViewUploadedFilesCount: true,
    theme: UploaderThemesEnum.Input,
    isWithGalleryPreview: false,
    isDownloadable: true,
    inputThemeClass: 'theme-solid',
    maxFileNumber: 1,
    mediaType: EvaBrandMediaTypesEnum.SingleVideo.key,
  },
  MediaTypeMultipleVideos: {
    key: 'MediaTypeMultipleVideos',
    fromFeature: 'career_portal',
    accept: UploaderTypesEnum.Video.accept,
    type: UploaderTypesEnum.Video.key,
    multiple: true,
    isViewUploadedFilesCount: true,
    theme: UploaderThemesEnum.Input,
    isWithGalleryPreview: false,
    isDownloadable: true,
    inputThemeClass: 'theme-solid',
    mediaType: EvaBrandMediaTypesEnum.MultipleVideos.key,
  },
  EvaBrandGrid: {
    key: 'EvaBrandGrid',
    fromFeature: 'career_portal',
    accept: UploaderTypesEnum.Image.accept,
    type: UploaderTypesEnum.Image.key,
    multiple: false,
    isViewUploadedFilesCount: true,
    theme: UploaderThemesEnum.Input,
    isWithGalleryPreview: false,
    isDownloadable: true,
    inputThemeClass: 'theme-solid',
    maxFileNumber: 1,
  },
  EvaBrandImagesTab: {
    key: 'EvaBrandImagesTab',
    fromFeature: 'career_portal',
    accept: UploaderTypesEnum.Image.accept,
    type: UploaderTypesEnum.Image.key,
    multiple: false,
    isViewUploadedFilesCount: true,
    theme: UploaderThemesEnum.Input,
    isWithGalleryPreview: false,
    isDownloadable: true,
    inputThemeClass: 'theme-solid',
    maxFileNumber: 1,
  },
  EvaBrandMembersTab: {
    key: 'EvaBrandMembersTab',
    fromFeature: 'career_portal',
    accept: UploaderTypesEnum.Image.accept,
    type: UploaderTypesEnum.Image.key,
    multiple: false,
    isViewUploadedFilesCount: true,
    theme: UploaderThemesEnum.Input,
    isWithGalleryPreview: false,
    isDownloadable: true,
    inputThemeClass: 'theme-solid',
    maxFileNumber: 1,
  },
  EvaBrandSharedUploader: {
    key: 'EvaBrandSharedUploader',
    fromFeature: 'career_portal',
    accept: UploaderTypesEnum.Image.accept,
    type: UploaderTypesEnum.Image.key,
    multiple: false,
    isViewUploadedFilesCount: true,
    theme: UploaderThemesEnum.Input,
    isWithGalleryPreview: false,
    isDownloadable: true,
    inputThemeClass: 'theme-solid',
    maxFileNumber: 1,
  },
  MediasTap: {
    key: 'MediasTap',
    fromFeature: 'career_portal',
    accept: `${UploaderTypesEnum.Image.accept}, ${UploaderTypesEnum.Video.accept}`,
    multiple: false,
    isViewUploadedFilesCount: true,
    theme: UploaderThemesEnum.Input,
    isWithGalleryPreview: false,
    isDownloadable: true,
    inputThemeClass: 'theme-solid',
    maxFileNumber: 1,
  },
  StoriesTap: {
    key: 'StoriesTap',
    fromFeature: 'career_portal',
    accept: `${UploaderTypesEnum.Image.accept}, ${UploaderTypesEnum.Video.accept}`,
    multiple: false,
    isViewUploadedFilesCount: true,
    theme: UploaderThemesEnum.Input,
    isWithGalleryPreview: false,
    isDownloadable: true,
    inputThemeClass: 'theme-solid',
    maxFileNumber: 1,
  },
  EvaBrandQuotesTab: {
    key: 'EvaBrandQuotesTab',
    fromFeature: 'career_portal',
    accept: UploaderTypesEnum.Image.accept,
    type: UploaderTypesEnum.Image.key,
    multiple: false,
    isViewUploadedFilesCount: true,
    theme: UploaderThemesEnum.Input,
    isWithGalleryPreview: false,
    isDownloadable: true,
    inputThemeClass: 'theme-solid',
    maxFileNumber: 1,
  },
  EvaBrandPartnersTab: {
    key: 'EvaBrandPartnersTab',
    fromFeature: 'career_portal',
    accept: UploaderTypesEnum.Image.accept,
    type: UploaderTypesEnum.Image.key,
    multiple: false,
    isViewUploadedFilesCount: true,
    theme: UploaderThemesEnum.Input,
    isWithGalleryPreview: false,
    isDownloadable: true,
    inputThemeClass: 'theme-solid',
    maxFileNumber: 1,
  },
  EvaBrandSEOManagement: {
    key: 'EvaBrandSEOManagement',
    fromFeature: 'career_portal',
    accept: UploaderTypesEnum.Image.accept,
    type: UploaderTypesEnum.Image.key,
    multiple: false,
    isViewUploadedFilesCount: true,
    theme: UploaderThemesEnum.Input,
    isWithGalleryPreview: false,
    isDownloadable: true,
    inputThemeClass: 'theme-solid',
    maxFileNumber: 1,
  },
  EvaBrandCategoriesTab: {
    key: 'EvaBrandCategoriesTab',
    fromFeature: 'career_portal',
    accept: UploaderTypesEnum.Image.accept,
    type: UploaderTypesEnum.Image.key,
    multiple: false,
    isViewUploadedFilesCount: true,
    theme: UploaderThemesEnum.Input,
    isWithGalleryPreview: false,
    isDownloadable: true,
    inputThemeClass: 'theme-solid',
    maxFileNumber: 1,
  },
  MenuSectionContentsTap: {
    key: 'MenuSectionContentsTap',
    fromFeature: 'career_portal',
    accept: UploaderTypesEnum.Image.accept,
    type: UploaderTypesEnum.Image.key,
    multiple: false,
    isViewUploadedFilesCount: true,
    theme: UploaderThemesEnum.Input,
    isWithGalleryPreview: false,
    isDownloadable: true,
    inputThemeClass: 'theme-solid',
    maxFileNumber: 1,
  },
  AppearanceManagementDialog: {
    key: 'AppearanceManagementDialog',
    fromFeature: 'career_portal',
    accept: UploaderTypesEnum.Image.accept,
    type: UploaderTypesEnum.Image.key,
    multiple: false,
    isViewUploadedFilesCount: true,
    theme: UploaderThemesEnum.Input,
    isWithGalleryPreview: false,
    isDownloadable: true,
    inputThemeClass: 'theme-solid',
    maxFileNumber: 1,
  },
  DynamicForm: {
    key: 'DynamicForm',
    fromFeature: 'company',
    accept: UploaderTypesEnum.Image.accept,
    type: UploaderTypesEnum.Image.key,
    multiple: false,
    forAccount: false,
    isViewUploadedFilesCount: true,
    theme: UploaderThemesEnum.Box,
    isWithGalleryPreview: false,
    isDownloadable: true,
    inputThemeClass: 'theme-solid',
    maxFileNumber: 1,
  },
  Employee: {
    key: 'DynamicForm',
    fromFeature: 'company',
    accept: UploaderTypesEnum.Image.accept,
    type: UploaderTypesEnum.Image.key,
    multiple: false,
    isViewUploadedFilesCount: true,
    theme: UploaderThemesEnum.Input,
    isWithGalleryPreview: false,
    isDownloadable: true,
    inputThemeClass: 'theme-solid',
    maxFileNumber: 1,
  },
  Contract: {
    key: 'ContractForm',
    fromFeature: 'employee',
    accept: `${UploaderTypesEnum.Image.accept}, ${UploaderTypesEnum.Docs.accept}`,
    multiple: false,
    isViewUploadedFilesCount: true,
    theme: UploaderThemesEnum.Box,
    isWithGalleryPreview: false,
    isDownloadable: true,
    inputThemeClass: 'theme-solid',
    maxFileNumber: 1,
  },
  EmployeeProfile: {
    key: 'EmployeeProfile',
    fromFeature: 'company',
    accept: UploaderTypesEnum.Image.accept,
    type: UploaderTypesEnum.Image.key,
    multiple: false,
    forAccount: false,
    isViewUploadedFilesCount: true,
    theme: UploaderThemesEnum.Box,
    isWithGalleryPreview: false,
    isDownloadable: true,
    inputThemeClass: 'theme-solid',
    maxFileNumber: 5,
  },
  PipelineNoteAttachment: {
    key: 'PipelineNote',
    fromFeature: 'ats',
    accept: `${UploaderTypesEnum.Image.accept}, ${UploaderTypesEnum.Video.accept}, ${UploaderTypesEnum.Docs.accept}`,
    isDynamicCheck: true,
    multiple: true,
    isViewUploadedFilesCount: true,
    theme: UploaderThemesEnum.Box,
    isWithGalleryPreview: false,
    isDownloadable: true,
    maxFileNumber: 1,
  },
  InitialApprovalAttachments: {
    key: 'InitialApprovalAttachments',
    fromFeature: 'company',
    accept: `${UploaderTypesEnum.Image.accept}, ${UploaderTypesEnum.Video.accept}, ${UploaderTypesEnum.Docs.accept}`,
    isDynamicCheck: true,
    multiple: true,
    isViewUploadedFilesCount: true,
    theme: UploaderThemesEnum.Box,
    isWithGalleryPreview: false,
    isDownloadable: true,
    maxFileNumber: 5,
  },
  ProfileImage: {
    key: 'ProfileImage',
    fromFeature: 'company',
    accept: UploaderTypesEnum.Image.accept,
    type: UploaderTypesEnum.Image.key,
    multiple: false,
    isViewUploadedFilesCount: true,
    theme: UploaderThemesEnum.Circle,
    isWithGalleryPreview: false,
    isDownloadable: true,
    inputThemeClass: 'theme-solid',
  },
  ProfileCV: {
    key: 'ProfileCV',
    fromFeature: 'company',
    accept: `${UploaderTypesEnum.Image.accept}, ${UploaderTypesEnum.Video.accept}, ${UploaderTypesEnum.Docs.accept}`,
    isDynamicCheck: true,
    multiple: false,
    isViewUploadedFilesCount: true,
    theme: UploaderThemesEnum.Box,
    isWithGalleryPreview: false,
    isDownloadable: true,
    maxFileNumber: 1,
  },
  ProfileCVVideo: {
    key: 'ProfileCVVideo',
    fromFeature: 'company',
    accept: UploaderTypesEnum.Video.accept,
    type: UploaderTypesEnum.Video.key,
    multiple: false,
    isViewUploadedFilesCount: true,
    theme: UploaderThemesEnum.Box,
    isWithGalleryPreview: false,
    isDownloadable: true,
    maxFileNumber: 1,
  },
  ProfileCVDoc: {
    key: 'ProfileCVDoc',
    fromFeature: 'company',
    accept: UploaderTypesEnum.PDFDoc.accept,
    type: UploaderTypesEnum.Docs.key,
    multiple: false,
    isViewUploadedFilesCount: true,
    theme: UploaderThemesEnum.Box,
    isWithGalleryPreview: false,
    isDownloadable: true,
    maxFileNumber: 1,
  },
  OfferUpload: {
    key: 'OfferUpload',
    fromFeature: 'company',
    accept: `${UploaderTypesEnum.Image.accept}, ${UploaderTypesEnum.PDFDoc.accept}, ${UploaderTypesEnum.Docs.accept}`,
    isDynamicCheck: true,
    multiple: false,
    forAccount: false,
    isViewUploadedFilesCount: true,
    theme: UploaderThemesEnum.Box,
    isWithGalleryPreview: false,
    isDownloadable: true,
    inputThemeClass: 'theme-solid',
    maxFileNumber: 1,
  },
  VisaAttachments: {
    key: 'VisaAttachments',
    fromFeature: 'company',
    accept: '*',
    type: '*',
    multiple: false,
    isDownloadable: true,
    theme: UploaderThemesEnum.Tags,
    maxFileNumber: 1,
    pageCustomProps: undefined,
  },
  OnboardingSingleVideo: {
    key: 'OnboardingSingleVideo',
    fromFeature: 'company',
    accept: UploaderTypesEnum.Video.accept,
    type: UploaderTypesEnum.Video.key,
    multiple: false,
    isViewUploadedFilesCount: true,
    theme: UploaderThemesEnum.MediaTheme,
    isWithGalleryPreview: false,
    isDownloadable: true,
    maxFileNumber: 1,
  },
  OnboardingMultipleVideos: {
    key: 'OnboardingMultipleVideos',
    fromFeature: 'company',
    accept: UploaderTypesEnum.Video.accept,
    type: UploaderTypesEnum.Video.key,
    multiple: true,
    isViewUploadedFilesCount: true,
    theme: UploaderThemesEnum.MediaTheme,
    isWithGalleryPreview: false,
    isDownloadable: true,
    maxFileNumber: 5,
  },
  OnboardingSingleImage: {
    key: 'OnboardingSingleImage',
    fromFeature: 'company',
    accept: UploaderTypesEnum.Image.accept,
    type: UploaderTypesEnum.Image.key,
    multiple: false,
    isViewUploadedFilesCount: true,
    theme: UploaderThemesEnum.MediaTheme,
    isWithGalleryPreview: false,
    isDownloadable: true,
    maxFileNumber: 1,
  },
  OnboardingMultipleImages: {
    key: 'OnboardingMultipleImages',
    fromFeature: 'company',
    accept: UploaderTypesEnum.Image.accept,
    type: UploaderTypesEnum.Image.key,
    multiple: true,
    isViewUploadedFilesCount: true,
    theme: UploaderThemesEnum.MediaTheme,
    isWithGalleryPreview: false,
    isDownloadable: true,
    maxFileNumber: 5,
  },
  CandidateDocuments: {
    key: 'CandidateDocumentsAttachments',
    fromFeature: 'media--employee_file',
    accept: `${UploaderTypesEnum.Image.accept}, ${UploaderTypesEnum.PDFDoc.accept}, ${UploaderTypesEnum.Docs.accept}`,
    isDynamicCheck: true,
    multiple: false,
    forAccount: false,
    isViewUploadedFilesCount: true,
    theme: UploaderThemesEnum.Input,
    isWithGalleryPreview: false,
    isDownloadable: true,
    inputThemeClass: 'theme-solid',
    maxFileNumber: 1,
  },
};
