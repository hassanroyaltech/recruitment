import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BuilderSection,
  HeaderSection,
  PreviewSection,
  SidebarSection,
} from './sections';
import { useTranslation } from 'react-i18next';
import {
  DownloadPDF,
  generateUUIDV4,
  GetFormSourceItem,
  GlobalDateTimeFormat,
  GlobalHistory,
  GlobalSavingDateFormat,
  showError,
  showSuccess,
} from '../../helpers';
import { useDispatch, useSelector } from 'react-redux';
import template from './data/templateData';
import inputFields from './data/inputFields';
import blockFieldsData from './data/BlocksFields.Data';
import dataCustomSections from './data/customSections';
import { useQuery } from '../../hooks';
import {
  GetMultipleMedias,
  GetBuilderTemplate,
  GetBuilderForm,
  DownloadFormBuilderFilesSender,
  GetBuilderFormCandidate,
  VerifyBuilderFormKey,
  FormDownLoadPDFUser,
  FormDownLoadPDFRecipient,
  GetMultipleMediasRecipient,
  GetOnboardingFolderById,
  GetOnboardingSpaceById,
  // DownloadPDFService
} from '../../services';
import {
  NavigationSourcesEnum,
  FormsStatusesEnum,
  FormsRolesEnum,
  FormsForTypesEnum,
  FormsAssistRoleTypesEnum,
  FormDownloadEnum,
  DefaultFormsTypesEnum,
  FormsSubmissionsLevelsTypesEnum,
  FormsFieldsTypesEnum,
  ScorecardRangesEnum,
} from '../../enums';
import { toSnakeCase } from '../form-builder/utils/helpers/toSnakeCase';
import axios from 'axios';
import urls from '../../api/urls';
import { generateHeaders } from '../../api/headers';
import { toCamelCase } from '../form-builder/utils/helpers/toCamelCase';
import i18next from 'i18next';
import moment from 'moment';
import { CandidateTypes } from '../../stores/types/candidateTypes';
import { emailExpression } from '../../utils';
import { PreviewPDFSection } from './sections/preview/Preview.PDFSection';
import { currencies } from './data/currencies';

const parentTranslationPath = 'FormBuilderPage';
const translationPath = '';

const FormBuilderPage = () => {
  const { t } = useTranslation(parentTranslationPath);
  const dispatch = useDispatch();
  const isInitRef = useRef(true);
  const query = useQuery();
  const [headerHeight, setHeaderHeight] = useState(126.5);
  const [isOpenSideMenu, setIsOpenSideMenu] = useState(false);
  const [isFailedToGetSections, setIsFailedToGetSections] = useState(false);
  const [isValidUser, setIsValidUser] = useState(
    query.get('editor_role') !== FormsRolesEnum.Recipient.key,
  );
  const [systemUserRecipient, setSystemUserRecipient] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isGlobalLoading, setIsGlobalLoading] = useState([]);
  const userReducer = useSelector((reducerState) => reducerState.userReducer);
  const candidateReducer = useSelector((state) => state?.candidateReducer);
  const [formsRolesTypes] = useState(
    Object.values(FormsRolesEnum).map((item) => ({
      ...item,
      value: t(`${translationPath}${item.value}`),
      popoverValue: t(`${translationPath}${item.popoverValue}`),
      popoverDescription:
        (item.popoverDescription
          && t(`${translationPath}${item.popoverDescription}`))
        || undefined,
    })),
  );
  const templateDataInitRef = useRef({});
  const [templateData, setTemplateData] = useState({
    ...template,
    extraQueries: {},
    code: query.get('code'),
    task_uuid: query.get('task_uuid'),
    isSurvey: Boolean(query.get('is_survey')),
  });
  const [dataSectionItems, setDataSectionItems] = useState({});
  const [fieldsItems, setFieldsItems] = useState(inputFields);
  const [blocksItems, setBlocksItems] = useState(blockFieldsData);
  const [customSections, setCustomSections] = useState(dataCustomSections);
  const [customFields, setCustomFields] = useState({});
  const [isLoadingPDF, setIsLoadingPDF] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialization, setIsInitialization] = useState(true);
  const isInitializationRef = useRef(true);
  const pdfRef = useRef(null);
  const [dataSectionContainers, setDataSectionContainers] = useState([
    ...Object.keys(dataSectionItems),
  ]);
  const [errors, setErrors] = useState({});
  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is return the role types after filter by conditions
   */
  const getFilteredRoleTypes = useMemo(
    () =>
      (localIsWithRecipient = undefined) =>
        formsRolesTypes.filter(
          (item) =>
            (!item.isHiddenIfWithoutRecipient
              || (item.isHiddenIfWithoutRecipient
                && (localIsWithRecipient !== undefined
                  ? localIsWithRecipient
                  : templateData.isWithRecipient)))
            && ((item.isVisibleInAllForms
              && item.hiddenInFormDropdowns.some(
                (element) => element !== templateData.code,
              ))
              || item.visibleInFormDropdowns.some(
                (element) => element === templateData.code,
              )),
        ),
    [formsRolesTypes, templateData.code, templateData.isWithRecipient],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is return the first default role type enum
   */
  const getFirstAvailableDefault = useMemo(
    () => () => getFilteredRoleTypes().find((item) => item.isDefault) || {},
    [getFilteredRoleTypes],
  );

  const [preview, setPreview] = useState({
    isActive: false,
    role: getFirstAvailableDefault().key,
  });

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is return the default enum item for form type (if its default)
   */
  const getCurrentDefaultEnumItem = useMemo(
    () => () =>
      Object.values(DefaultFormsTypesEnum).find(
        (item) => item.key === templateData.code,
      ) || {},
    [templateData.code],
  );

  const getImagesAndFiles = useCallback(
    async (
      sections = {},
      primaryLang,
      forType = FormsForTypesEnum.SystemUser.key,
      secondaryLang = null,
    ) => {
      const imagesAndFiles = Object.entries(sections).reduce(
        (total, [key, value]) => {
          value.items
            .filter((item) =>
              [
                'attachment',
                'video_gallery',
                'video',
                'image',
                'image_gallery',
              ].includes(item.type),
            )
            .map((item) => {
              if (item.languages?.[primaryLang]?.value?.length > 0)
                total.push({
                  sectionKey: key,
                  itemId: item.id,
                  isArray: true,
                  isFullObject: true,
                  imageKey: 'value',
                  saveIn: 'files',
                  id: item.languages?.[primaryLang]?.value,
                  value: [],
                  lang: primaryLang,
                });
              if (
                secondaryLang
                && item.languages?.[secondaryLang]?.value?.length > 0
              )
                total.push({
                  sectionKey: key,
                  itemId: item.id,
                  isArray: true,
                  isFullObject: true,
                  imageKey: 'value',
                  saveIn: 'files',
                  id: item.languages?.[secondaryLang]?.value,
                  value: [],
                  lang: secondaryLang,
                });
              return undefined;
            });
          value.items
            .filter((item) => ['team_member'].includes(item.type))
            .map((item) => {
              if (item.languages?.[primaryLang]?.value?.length > 0)
                total.push({
                  sectionKey: key,
                  itemId: item.id,
                  isArray: true,
                  isArrayOfObjects: true,
                  isFullObject: true,
                  imageKey: 'profilePicUuid',
                  saveIn: 'profilePic',
                  id: item.languages?.[primaryLang]?.value,
                  value: [],
                  lang: primaryLang,
                });
              if (
                secondaryLang
                && item.languages?.[secondaryLang]?.value?.length > 0
              )
                total.push({
                  sectionKey: key,
                  itemId: item.id,
                  isArray: true,
                  isArrayOfObjects: true,
                  isFullObject: true,
                  imageKey: 'profilePicUuid',
                  saveIn: 'profilePic',
                  id: item.languages?.[secondaryLang]?.value,
                  value: [],
                  lang: secondaryLang,
                });
              return undefined;
            });
          if (value.logoUuid)
            total.push({
              sectionKey: key,
              isArray: false,
              isFullObject: false,
              imageKey: 'logoUuid',
              saveIn: 'logoImage',
              id: value.logoUuid,
              value: null,
            });
          if (value.bgUuid)
            total.push({
              sectionKey: key,
              isArray: false,
              isFullObject: false,
              imageKey: 'bgUuid',
              saveIn: 'bgImage',
              id: value.bgUuid,
              value: null,
            });
          return total;
        },
        [],
      );
      if (
        imagesAndFiles.length === 0
        || imagesAndFiles.reduce((total, item) => {
          if (item.isArray) total.push(...item.id);
          else total.push(item.id);
          return total;
        }, []).length === 0
      )
        return [];
      const response = await (
        (forType === FormsForTypesEnum.Candidate.key
          && GetMultipleMediasRecipient)
        || GetMultipleMedias
      )(
        {
          uuids: imagesAndFiles.reduce((total, item) => {
            if (item.isArray && !item.isArrayOfObjects) total.push(...item.id);
            else if (item.isArray && item.isArrayOfObjects) {
              if (item.id instanceof Array)
                total.push(
                  ...item.id
                    .filter((it) => it[item.imageKey])
                    .map((el) => el[item.imageKey]),
                );
            } else total.push(item.id);
            return total;
          }, []),
        },
        candidateReducer?.token && forType === FormsForTypesEnum.Candidate.key
          ? {
            customHeaders: true,
            'Accept-Company': candidateReducer?.company?.uuid,
            'recipient-token': candidateReducer?.token,
            'Accept-Account': candidateReducer?.account?.uuid,
            Authorization: null,
          }
          : null,
      );
      if (
        response
        && response.status === 200
        && response.data.results.data.length > 0
      ) {
        const {
          data: {
            results: { data },
          },
        } = response;
        imagesAndFiles.map((item) => {
          if (!item.isArray) {
            const itemIndex = data.findIndex(
              (element) => element.original.uuid === item.id,
            );
            if (itemIndex !== -1)
              if (item.isFullObject) item.value = data[itemIndex].original;
              else item.value = data[itemIndex].original.url;
          } else if (item.isArray && item.isArrayOfObjects) {
            const filteredData = data
              .filter((element) =>
                item.id.some((it) => it[item.imageKey] === element.original.uuid),
              )
              .map((element) => element.original);
            if (item.isFullObject) item.value.push(...filteredData);
            else item.value.push(...filteredData.map((element) => element.uuid));
          } else {
            const filteredData = data
              .filter((element) => item.id.includes(element.original.uuid))
              .map((element) => element.original);
            if (item.isFullObject) item.value.push(...filteredData);
            else item.value.push(...filteredData.map((element) => element.uuid));
          }
          return undefined;
        });
        return imagesAndFiles;
      }
      return [];
    },
    [
      candidateReducer?.account?.uuid,
      candidateReducer?.company?.uuid,
      candidateReducer?.token,
    ],
  );

  /**
   * @param currentRole - current role item key
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the role enum item by key
   */
  const getSelectedRoleEnumItem = useMemo(
    () => (currentRole) =>
      formsRolesTypes.find((item) => item.key === currentRole) || {},
    [formsRolesTypes],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return if the current field is editable by current login user or not (based or role
   *  and assign)
   */
  const getIsAssignToMe = useMemo(
    () =>
      ({
        fillBy,
        assign,
        editorRole = templateData.editorRole,
        currentUserUUID = templateData.currentUserUUID,
        isWithOtherRoles = true,
      }) =>
        (fillBy === editorRole
          || (isWithOtherRoles
            && getSelectedRoleEnumItem(fillBy).canBeFilledByOtherRoles
            && getSelectedRoleEnumItem(fillBy).canBeFilledByOtherRoles.some(
              (item) => item.key === editorRole,
            )))
        && (templateData.isMaster
          || getSelectedRoleEnumItem(fillBy).isWithRoleTypeCompareOnly
          || (getSelectedRoleEnumItem(fillBy).isWithGlobalAssignToAssist
            && templateData.assignToAssist.some(
              (item) =>
                item.role === FormsAssistRoleTypesEnum.Editor.key
                && item.uuid === currentUserUUID,
            ))
          || (getSelectedRoleEnumItem(fillBy).isWithGlobalSubmission
            && (!templateData.typeOfSubmission
              || templateData.typeOfSubmission
                === FormsSubmissionsLevelsTypesEnum.FormLevel.key))
          || (getSelectedRoleEnumItem(fillBy).isWithAssignToAssist
            && assign.some(
              (element) =>
                element.role === FormsAssistRoleTypesEnum.Editor.key
                && (element.uuid === currentUserUUID
                  || templateData.invitedMember.some(
                    (member) => member.uuid === element.uuid,
                  )),
            ))
          || (getSelectedRoleEnumItem(fillBy).isWithAssignToView
            && assign.some(
              (element) =>
                element.role === FormsAssistRoleTypesEnum.Viewer.key
                && (element.uuid === currentUserUUID
                  || templateData.invitedMember.some(
                    (member) => member.uuid === element.uuid,
                  )),
            ))),
    [
      getSelectedRoleEnumItem,
      templateData.assignToAssist,
      templateData.currentUserUUID,
      templateData.editorRole,
      templateData.invitedMember,
      templateData.isMaster,
      templateData.typeOfSubmission,
    ],
  );

  const getIsFormSource = useMemo(
    () => (source) =>
      (templateData.source || source)
      && Object.values(NavigationSourcesEnum).some(
        (item) => (templateData.source || source) === item.key && item.isForm,
      ),
    [templateData.source],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return if the field data is valid or not (it return an object of errors)
   */
  const getIsValidData = useCallback(
    (localTemplateData = templateData, sections = dataSectionItems) => {
      const localErrors = {};
      if (!sections)
        localErrors['sections'] = {
          type: 'undefinedSections',
          error: true,
          message: 'Unknown Data Source',
        };

      if (
        localTemplateData.isWithDelay
        && (!localTemplateData.delayDuration || !localTemplateData.delayDuration < 1)
      )
        if (
          !localTemplateData.delayDuration
          && localTemplateData.delayDuration !== 0
        )
          localErrors['delayDuration'] = {
            id: 'delayDuration',
            error: true,
            message: t('Shared:this-field-is-required'),
            type: 'requiredField',
          };
        else if (localTemplateData.delayDuration < 0)
          localErrors['delayDuration'] = {
            id: 'delayDuration',
            error: true,
            message: `${t('Shared:this-field-must-be-more-than-or-equal')} ${0}`,
            type: 'requiredField',
          };
      if (
        localTemplateData.isWithDeadline
        && (!localTemplateData.deadlineDays || !localTemplateData.deadlineDays < 1)
      )
        if (!localTemplateData.deadlineDays && localTemplateData.deadlineDays !== 0)
          localErrors['deadlineDays'] = {
            id: 'deadlineDays',
            error: true,
            message: t('Shared:this-field-is-required'),
            type: 'requiredField',
          };
        else if (localTemplateData.deadlineDays < 0)
          localErrors['deadlineDays'] = {
            id: 'deadlineDays',
            error: true,
            message: `${t('Shared:this-field-must-be-more-than-or-equal')} ${0}`,
            type: 'requiredField',
          };
      // invalid data like email
      Object.values(sections).map((section) =>
        section.items.map((item) => {
          item.type === 'email'
            && Object.entries(item.languages).map(([key, { value }]) => {
              if (value && !value.toLowerCase().match(emailExpression))
                localErrors[`${item.id}${key}`] = {
                  error: true,
                  message: `${t(item.cardTitle)}:- ${t('Shared:invalid-email')}`,
                  id: `${item.id}${key}`,
                  itemId: item.id,
                  type: 'invalidField',
                };
              return undefined;
            });
          item.type === 'number'
            && Object.entries(item.languages).map(([key, { value }]) => {
              const val = parseFloat(value);
              const min = parseFloat(item.charMin);
              const max = parseFloat(item.charMax);
              if (isNaN(val)) return undefined;
              if ((!isNaN(min) && val < min) || (!isNaN(max) && val > max))
                localErrors[`${item.id}${key}`] = {
                  error: true,
                  message: `${t(item.cardTitle)}:- ${t('Shared:invalid-number')}`,
                  id: `${item.id}${key}`,
                  itemId: item.id,
                  type: 'invalidField',
                };
              return undefined;
            });
          return undefined;
        }),
      );
      const requiredAndFilledByMeItems = Object.values(sections)
        .map((section) =>
          section.items.filter(
            (item) =>
              item.isRequired
              && getIsAssignToMe({
                fillBy: item.fillBy,
                assign: item.assign,
                isWithOtherRoles: false,
              }),
          ),
        )
        .flat();
      requiredAndFilledByMeItems.map((item) =>
        !localTemplateData.primaryLang && !localTemplateData.secondaryLang
          ? (localErrors[item.id] = {
            error: true,
            message: `${t(item.cardTitle)}:- ${t(
              'Shared:this-field-is-required',
            )}`,
            id: item.id,
            itemId: item.id,
            type: 'requiredField',
          })
          : Object.entries(item.languages).map(([key, { value }]) => {
            if (
              key === localTemplateData.secondaryLang
                && (item.type === 'attachment'
                  || item.type === 'signature'
                  || item.type === 'rating')
            )
              return undefined;

            if (
              key === localTemplateData.primaryLang
                || key === localTemplateData.secondaryLang
            ) {
              if (item.type === 'rating' && !item.ratingValue) {
                localErrors[`${item.id}${key}`] = {
                  error: true,
                  message: `${t(item.cardTitle)}:- ${t(
                    'Shared:this-field-is-required',
                  )}`,
                  id: `${item.id}${key}`,
                  itemId: item.id,
                  type: 'requiredField',
                };
                return undefined;
              }
              if (
                item.type === 'name'
                  && value.some((item, idx) => !item && idx !== 1 && idx !== 2)
              ) {
                localErrors[`${item.id}${key}`] = {
                  error: true,
                  message: `${t(item.cardTitle)}:- ${t(
                    'Shared:this-field-is-required',
                  )}`,
                  id: `${item.id}${key}`,
                  itemId: item.id,
                  type: 'requiredField',
                };
                return undefined;
              }
              if (
                item.type === 'phone'
                  && (!value || value.split('-').length !== 3 || !value.split('-')[2])
              ) {
                localErrors[`${item.id}${key}`] = {
                  error: true,
                  message: `${t(item.cardTitle)}:- ${t(
                    'Shared:this-field-is-required',
                  )}`,
                  id: `${item.id}${key}`,
                  itemId: item.id,
                  type: 'requiredField',
                };
                return undefined;
              }
              if (item.type === 'checkbox' && (!value || value.length === 0)) {
                localErrors[`${item.id}${key}`] = {
                  error: true,
                  message: `${t(item.cardTitle)}:- ${t(
                    'Shared:this-field-is-required',
                  )}`,
                  id: `${item.id}${key}`,
                  itemId: item.id,
                  type: 'requiredField',
                };
                return undefined;
              }
              if (
                ((!value && value !== 0) || (value !== 0 && value.length === 0))
                  && item.type !== 'rating'
              ) {
                localErrors[`${item.id}${key}`] = {
                  error: true,
                  message: `${t(item.cardTitle)}:- ${t(
                    'Shared:this-field-is-required',
                  )}`,
                  id: `${item.id}${key}`,
                  itemId: item.id,
                  type: 'requiredField',
                };
                return undefined;
              }
            }
            return undefined;
          }),
      );

      return localErrors;
    },
    [dataSectionItems, getIsAssignToMe, t, templateData],
  );

  const scrollToField = (id) => {
    let a = document.getElementById(id);
    if (a) a.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // a.click();
  };

  const UpdateDownLoadFilesSenderHandler = React.useCallback(
    async ({ path, successMsg, key, type }) => {
      setIsSubmitted(true);
      const localErrors = getIsValidData();
      if (Object.values(localErrors).some((item) => item.itemId))
        scrollToField(Object.values(localErrors).find((item) => item.itemId).itemId);
      if (Object.keys(localErrors).length > 0) {
        showError('', { errors: localErrors });
        return;
      }
      const template = {
        ...templateData,
        sections: dataSectionItems,
      };
      setIsLoading(true);
      setIsLoadingPDF(true);
      const response = await (
        (FormDownloadEnum.pdf.key === key && FormDownLoadPDFUser)
        || DownloadFormBuilderFilesSender
      )({
        body: (FormDownloadEnum.pdf.key === key && toSnakeCase(template)) || {
          uuid: template.formUUID,
          ...toSnakeCase(template),
          // ...(parseInt(template.status) === FormsStatusesEnum.NotSent.key
          //  && { status: FormsStatusesEnum.WaitingToBeSigned.key }),
        },
        path,
        type,
      });
      setIsLoadingPDF(false);
      setIsLoading(false);
      if (
        response
        && (response.status === 201
          || response.status === 200
          || response.status === 202)
      ) {
        const link = document.createElement('a');
        link.setAttribute('target', '_blank');
        link.download = templateData.title;
        link.href
          = type === 'file'
            ? URL.createObjectURL(response.data)
            : response?.data?.results?.url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showSuccess(successMsg);
      } else {
        setIsLoading(false);
        showError(t('Shared:failed-to-get-saved-data'), response);
      }
    },
    [getIsValidData, templateData, dataSectionItems, t],
  );

  const UpdateDownLoadPDFRecipientHandler = useCallback(async () => {
    setIsSubmitted(true);
    const form = {
      ...templateData,
      sections: dataSectionItems,
    };
    const localErrors = getIsValidData();

    if (Object.values(localErrors).some((item) => item.itemId))
      scrollToField(Object.values(localErrors).find((item) => item.itemId).itemId);
    if (Object.keys(localErrors).length > 0) {
      showError('', { errors: localErrors });
      return;
    }
    setIsLoading(true);
    setIsLoadingPDF(true);
    const response = await (
      (templateData.extraQueries.for === FormsForTypesEnum.SystemUser.key
        && FormDownLoadPDFUser)
      || FormDownLoadPDFRecipient
    )({
      body: {
        ...toSnakeCase(form),
      },
      token: candidateReducer?.token,
      company_uuid: candidateReducer?.company?.uuid,
      account_uuid: candidateReducer?.account?.uuid,
    });
    setIsLoadingPDF(false);
    setIsLoading(false);
    if (response.status === 200) {
      const link = document.createElement('a');
      const file_url = URL.createObjectURL(response.data);
      link.setAttribute('target', '_blank');
      link.download = templateData.title;
      link.href = file_url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showSuccess('PDF file downloaded successfully!');
    } else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [
    templateData,
    dataSectionItems,
    getIsValidData,
    candidateReducer?.token,
    candidateReducer?.company?.uuid,
    candidateReducer?.account?.uuid,
    t,
  ]);

  const getFormStatusEnumItem = useMemo(
    () =>
      (currentStatus = templateData.formStatus) =>
        Object.values(FormsStatusesEnum).find(
          (item) => item.key === currentStatus,
        ) || {},
    [templateData.formStatus],
  );

  const getCurrentSpaceFolderDetails = useCallback(
    async ({ queryFolder, querySpace }) => {
      const promises = [];
      const spacesAndFolders = { spaces: [], folders: [] };
      if (querySpace) promises.push(GetOnboardingSpaceById({ uuid: querySpace }));
      if (queryFolder) promises.push(GetOnboardingFolderById({ uuid: queryFolder }));
      const response = await Promise.all(promises);
      if (response && response.some((item) => item.status === 200)) {
        const successResults = response.filter((item) => item.status === 200);
        successResults.map((item) => {
          if (item.data.results.uuid === querySpace)
            spacesAndFolders.spaces.push(item.data.results);
          else spacesAndFolders.folders.push(item.data.results);
          return undefined;
        });
        if (successResults.length !== promises.length)
          response
            .filter((item) => item.status !== 200)
            .map((item) => showError(t('Shared:failed-to-get-saved-data'), item));
      } else showError(t('Shared:failed-to-get-saved-data'));
      return spacesAndFolders;
    },
    [t],
  );

  const getEditInit = useCallback(
    async ({ template_uuid, form_uuid, isFromUseEffect = false }) => {
      if (!isFromUseEffect) return;
      const querySource = (query.get('source') && +query.get('source')) || undefined;
      const queryFor = (query.get('for') && +query.get('for')) || undefined;
      const queryCode = query.get('code') || undefined;
      const querySpace = query.get('space_uuid') || undefined;
      const queryFolder = query.get('folder_uuid') || undefined;
      const currentUserUUID = query.get('invited_uuid') || undefined;
      const typeOfSubmission
        = (query.get('type_of_submission') && +query.get('type_of_submission'))
        || undefined;
      const taskSlug = query.get('slug') || undefined;
      const localBulkSession
        = (sessionStorage.getItem('bulkFormState')
          && JSON.parse(sessionStorage.getItem('bulkFormState')))
        || null;
      const localAssign
        = (query.get('assign_uuid') && [
          {
            type: GetFormSourceItem(querySource, queryCode).assignType,
            uuid: query.get('assign_uuid'),
          },
        ])
        || (localBulkSession && localBulkSession.assign)
        || [];
      setTemplateData((prev) => ({
        ...prev,
        ...(localBulkSession || {}),
        currentUserUUID,
        // (candidateReducer
        //   && queryFor === FormsForTypesEnum.Candidate.key
        //   && candidateReducer.candidate.uuid)
        // || (queryFor !== FormsForTypesEnum.Candidate.key
        //   && userReducer
        //   && userReducer.results.user.uuid)
        // || null,
        typeOfSubmission,
        isMaster: Boolean(
          queryFor !== FormsForTypesEnum.Candidate.key
            && userReducer
            && userReducer.results.user.is_master,
        ),
        status: true, // status (template) active or not
        source: querySource,
        formStatus: FormsStatusesEnum.Draft.key,
        space_uuid: querySpace,
        folder_uuid: queryFolder,
        spaces: [], // use to display the spaces tags in info
        folders: [], // use to display the folders tags in info
        connections: [], // use to display the tree on recipient to be able to flip between templates of each space or folder
        isWithRecipient: true,
        isWithDelay: false,
        delayDuration: null,
        isWithDeadline: false,
        deadlineDays: null,
        formUUID: form_uuid,
        uuid: template_uuid,
        updatedAt: moment().locale('en').format(GlobalDateTimeFormat),
        assign: localAssign,
        invitedMember: [],
        assignToAssist: [],
        editorRole: query.get('editor_role') || FormsRolesEnum.Creator.key,
        code: queryCode,
        extraQueries: {
          jobUUID: query.get('job_uuid'),
          pipelineUUID: query.get('pipeline_uuid'),
          jobPipelineUUID: query.get('pipeline_uuid'),
          stageUUID: query.get('stage_uuid'),
          assignUUID: query.get('assign_uuid'),
          candidateUUID: query.get('candidate_uuid'),
          role: (query.get('role_type') && +query.get('role_type')) || undefined,
          approvalUUID: query.get('approval_uuid'),
          for: queryFor,
          fromSide: query.get('from_side'),
          isView: query.get('is_view') === 'true',
          utmSources:
            (query.get('utm_sources') && +query.get('utm_sources')) || undefined,
          key: query.get('verification_form_key'),
          email:
            (queryFor !== FormsForTypesEnum.Candidate.key
              && ((systemUserRecipient
                && systemUserRecipient.sys_user
                && systemUserRecipient.sys_user.email)
                || (userReducer && userReducer.results.user.email)))
            || (candidateReducer
              && queryFor === FormsForTypesEnum.Candidate.key
              && candidateReducer.candidate.email)
            || '',
          slug: taskSlug,
        },
        sender: {
          avatar: '',
          name:
            (systemUserRecipient
              && systemUserRecipient.sentUser
              && `${
                systemUserRecipient.sentUser.first_name?.[i18next.language]
                || systemUserRecipient.sentUser.first_name?.en
                || ''
              } ${
                systemUserRecipient.sentUser.last_name?.[i18next.language]
                || systemUserRecipient.sentUser.last_name?.en
                || ''
              }`)
            || (candidateReducer
              && queryFor === FormsForTypesEnum.Candidate.key
              && `${
                candidateReducer.sentUser.first_name?.[i18next.language]
                || candidateReducer.sentUser.first_name?.en
                || ''
              } ${
                candidateReducer.sentUser.last_name?.[i18next.language]
                || candidateReducer.sentUser.last_name?.en
                || ''
              }`)
            || (userReducer
              && `${
                userReducer.results.user.first_name?.[i18next.language]
                || userReducer.results.user.first_name?.en
                || ''
              } ${
                userReducer.results.user.last_name?.[i18next.language]
                || userReducer.results.user.last_name?.en
                || ''
              }`)
            || '',
        },
        recipient: {
          avatar: '',
          name:
            (queryFor !== FormsForTypesEnum.Candidate.key
              && systemUserRecipient
              && systemUserRecipient.sys_user
              && `${
                systemUserRecipient.sys_user.name?.[i18next.language]
                || systemUserRecipient.sys_user.name?.en
                || ''
              }`)
            || (candidateReducer
              && queryFor === FormsForTypesEnum.Candidate.key
              && candidateReducer.candidate.name)
            || '',
        },
      }));
      if ((!template_uuid && !form_uuid) || (form_uuid && !isValidUser)) {
        // this logic to return the current folder or space or both details to be displayed on create template
        if (!template_uuid && (querySpace || queryFolder)) {
          const spacesAndFolders = await getCurrentSpaceFolderDetails({
            querySpace,
            queryFolder,
          });
          setTemplateData((prev) => ({
            ...prev,
            ...spacesAndFolders,
          }));
        }
        setIsInitialization(false);
        return;
      }
      // || candidateReducer.reducer_status === CandidateTypes.SUBMITTED
      if (queryFor === FormsForTypesEnum.Candidate.key && !candidateReducer) return;
      setIsGlobalLoading((items) => {
        items.push('getTemplateData');
        return [...items];
      });
      const resp = await (
        (form_uuid
          && ((queryFor === FormsForTypesEnum.Candidate.key
            && GetBuilderFormCandidate)
            || GetBuilderForm))
        || GetBuilderTemplate
      )({
        template_uuid,
        form_uuid,
        editor_role: query.get('editor_role') || FormsRolesEnum.Creator.key,
        space_uuid: querySpace,
        folder_uuid: queryFolder,
        type_of_submission: typeOfSubmission,
        ...(localAssign.length === 1 && { assign: localAssign }),
        ...(candidateReducer?.token
          && queryFor === FormsForTypesEnum.Candidate.key && {
          company_uuid: candidateReducer?.company?.uuid,
          token: candidateReducer?.token,
          account_uuid: candidateReducer?.account?.uuid,
        }),
        ...(queryFor !== FormsForTypesEnum.Candidate.key
          && systemUserRecipient
          && systemUserRecipient.company && {
          company_uuid: systemUserRecipient.company.uuid,
        }),
      });
      if (resp && resp.status === 200) {
        const flattenData = toCamelCase(resp.data.results);
        if (
          queryFor !== FormsForTypesEnum.Candidate.key
          && (flattenData.spaceUuid || flattenData.folderUuid)
        ) {
          const spacesAndFolders = await getCurrentSpaceFolderDetails({
            querySpace: flattenData.spaceUuid,
            queryFolder: flattenData.folderUuid,
          });
          flattenData.spaces = spacesAndFolders.spaces;
          flattenData.folders = spacesAndFolders.folders;
        }
        if (flattenData && !flattenData.tags) flattenData.tags = [];
        const imagesAndFiles = await getImagesAndFiles(
          flattenData.sections,
          flattenData.primaryLang,
          queryFor,
          flattenData.secondaryLang,
        );
        if (imagesAndFiles.length > 0)
          imagesAndFiles.map((item) => {
            if (item.imageKey !== 'value')
              if (item.isArray && item.isArrayOfObjects) {
                const itemIndex = flattenData.sections[
                  item.sectionKey
                ].items.findIndex((element) => element.id === item.itemId);
                if (itemIndex !== -1 && item.value && item.id instanceof Array)
                  item.value.forEach((el) => {
                    const subItemIndex = item.id.findIndex(
                      (it) => it[item.imageKey] === el.uuid,
                    );
                    if (subItemIndex !== -1)
                      flattenData.sections[item.sectionKey].items[
                        itemIndex
                      ].languages[item.lang || flattenData.primaryLang].value[
                        subItemIndex
                      ][item.saveIn] = [el];
                  });
              } else flattenData.sections[item.sectionKey][item.saveIn] = item.value;
            else {
              const itemIndex = flattenData.sections[
                item.sectionKey
              ].items.findIndex((element) => element.id === item.itemId);
              if (itemIndex !== -1)
                flattenData.sections[item.sectionKey].items[itemIndex].languages[
                  item.lang || flattenData.primaryLang
                ][item.saveIn] = item.value;
            }
            return undefined;
          });
        // this condition is to forward the bast dates to now on templates edits only
        if (template_uuid && !form_uuid && flattenData.sections)
          Object.entries(flattenData.sections).forEach(([key, value]) => {
            value.items.forEach((item, index) => {
              const isDateField
                = item.type === FormsFieldsTypesEnum.Date.key
                || item.type === FormsFieldsTypesEnum.Datetime.key;
              const hasLanguageValueBeforeToday = Object.values(item.languages).some(
                (language) =>
                  language.value
                  && moment
                    .unix(language.value / 1000)
                    .locale('en')
                    .isBefore(
                      moment().locale('en'),
                      isDateField ? 'd' : 'milliseconds',
                    ),
              );

              if (isDateField && hasLanguageValueBeforeToday)
                Object.keys(item.languages).forEach((languageKey) => {
                  const date = moment()
                    .locale('en')
                    .format(
                      isDateField ? GlobalSavingDateFormat : GlobalDateTimeFormat,
                    );
                  flattenData.sections[key].items[index].languages[
                    languageKey
                  ].value = moment(date).unix() * 1000;
                });
            });
          });
        setTemplateData((prev) => ({
          ...prev,
          ...flattenData,
          assign:
            (localAssign.length > 1 && localAssign)
            || (flattenData.assign
              && typeof flattenData.assign === 'object' && [
              { ...flattenData.assign, stage_uuid: flattenData.assign.stageUuid },
            ])
            || localAssign,
          invitedMember:
            (localBulkSession && localBulkSession.invitedMember)
            || (flattenData.isWithRecipient
              && flattenData.assign
              && !form_uuid && [
              {
                ...flattenData.assign,
                stage_uuid: flattenData.assign.stageUuid,
                type: GetFormSourceItem(querySource, queryCode).memberType,
              },
            ])
            || flattenData.invitedMember,
          editorRole: query.get('editor_role') || FormsRolesEnum.Creator.key,
        }));
        setDataSectionItems({ ...flattenData.sections });
        setDataSectionContainers([...Object.keys(flattenData.sections)]);
      } else {
        showError(t('Shared:failed-to-get-saved-data'), resp);
        setIsFailedToGetSections(true);
      }
      setIsGlobalLoading((items) => {
        items.pop();
        return [...items];
      });
      setIsInitialization(false);
    },
    [
      candidateReducer,
      getCurrentSpaceFolderDetails,
      getImagesAndFiles,
      isValidUser,
      query,
      systemUserRecipient,
      t,
      userReducer,
    ],
  );

  const isFieldDisabled = (fillBy, assign, type) => {
    if (preview.isActive) return true;
    if (templateData.extraQueries.isView) return true;
    if (
      templateData.editorRole === fillBy
      && getSelectedRoleEnumItem(fillBy).isWithAssignToView
      && assign.some(
        (element) =>
          element.role === FormsAssistRoleTypesEnum.Viewer.key
          && (element.uuid === templateData.currentUserUUID
            || templateData.invitedMember.some(
              (member) => member.uuid === element.uuid,
            )),
      )
    )
      return true;
    if (
      // Form Fields should be enabled if:
      (getFormStatusEnumItem().isEditableForm !== false // If form status doesn't explicitly say that the form is not editable (either true or undefined)
        && templateData.extraQueries.isView === false // If is_view is specified in query as false
        && templateData.editorRole === fillBy) // If field role is the same as current role
      || (FormsStatusesEnum.Sent.key.toString()
        === templateData.formStatus.toString() // If Status is sent
        && templateData.editorRole === 'recipient' // If Role is recipient
        && fillBy === 'recipient') // If a field role is also recipient
    )
      return false;
    if (templateData.extraQueries.role === FormsAssistRoleTypesEnum.Viewer.key)
      return true;
    if (
      templateData.source
      && GetFormSourceItem(templateData.source, templateData.code).isView
    )
      return true;
    if (
      templateData.source
      && GetFormSourceItem(templateData.source, templateData.code).isEdit
      && ((!preview.isActive
        && getIsAssignToMe({
          fillBy,
          assign,
        }))
        || (preview.isActive
          && getIsAssignToMe({
            editorRole: preview.role,
            fillBy,
            assign,
          })))
    )
      return false;
    if (
      !getFormStatusEnumItem().isEditableForm
      && (!getSelectedRoleEnumItem(templateData.editorRole).isWithMultipleSubmit
        || (preview.isActive
          && !getSelectedRoleEnumItem(preview.role).isWithMultipleSubmit))
    )
      return true;
    if (
      type === 'inline'
      && (!getSelectedRoleEnumItem(templateData.editorRole).isEnabledTypography
        || (preview.isActive
          && !getSelectedRoleEnumItem(preview.role).isEnabledTypography))
    )
      return true;
    return !preview.isActive
      ? !getIsAssignToMe({
        fillBy,
        assign,
      })
      : !getIsAssignToMe({
        editorRole: preview.role,
        fillBy,
        assign,
      });
  };

  const handleAddSection = useCallback(() => {
    const newContainerId = generateUUIDV4();
    setDataSectionContainers((containers) => [...containers, newContainerId]);
    setDataSectionItems((items) => ({
      ...items,
      [newContainerId]: {
        id: generateUUIDV4(),
        title: `Untitled section`,
        isTitleVisibleOnTheFinalDocument: true,
        isStepper: false,
        order: null,
        isSectionVisibleOnTheFinalDoc: true,
        items: [],
        sectionTitleDecoration: null,
        sectionTitleFontSize: 0,
      },
    }));
    return newContainerId;
  }, []);

  const verifyCurrentLogin = useCallback(async () => {
    setIsGlobalLoading((items) => {
      items.push('verifyCurrentLogin');
      return [...items];
    });
    const response = await VerifyBuilderFormKey({
      key: templateData.extraQueries.key,
      from_side: templateData.extraQueries.fromSide,
    });
    setIsGlobalLoading((items) => {
      items.pop();
      return [...items];
    });
    if (response && response.status === 200) {
      setSystemUserRecipient(response.data.results);
      setIsValidUser(true);
    } else if (response && response.status === 401) {
      showError(t(`${translationPath}please-login-first`));
      GlobalHistory.push(`/el/login?${query.toString()}`);
    } else {
      showError(t('Shared:failed-to-get-saved-data'), response);
      GlobalHistory.push(`/recruiter/overview`);
    }
  }, [query, t, templateData.extraQueries.fromSide, templateData.extraQueries.key]);

  // this is to recalculate the errors after changing the fields values or the form templates
  useEffect(() => {
    setErrors(getIsValidData());
  }, [templateData, dataSectionItems, getIsValidData, isSubmitted]);

  // GET template data
  useEffect(() => {
    const template_uuid = query.get('template_uuid')?.split('?')?.[0];
    const form_uuid = query.get('form_uuid');
    getEditInit({ template_uuid, form_uuid, isFromUseEffect: true });
  }, [getEditInit, isValidUser, query]);

  useEffect(() => {
    if (
      isInitRef.current
      && (!candidateReducer
        || (candidateReducer.reducer_status !== CandidateTypes.SUCCESS
          && candidateReducer.reducer_status !== CandidateTypes.SUBMITTED
          && candidateReducer.reducer_status !== CandidateTypes.REJECTED))
      && templateData.extraQueries.for === FormsForTypesEnum.Candidate.key
    ) {
      isInitRef.current = false;
      showError(t(`${translationPath}please-login-first`));
      // GlobalHistory.replace({
      //   pathname: '/v2/recipient-login?' + query.toString(),
      // });
    } else if (
      templateData.extraQueries.for === FormsForTypesEnum.Candidate.key
      && candidateReducer
      && (candidateReducer.reducer_status === CandidateTypes.SUCCESS
        || candidateReducer.reducer_status === CandidateTypes.SUBMITTED
        || candidateReducer.reducer_status === CandidateTypes.SUBMITTED)
    )
      setIsValidUser(true);
  }, [query, dispatch, candidateReducer, t, templateData.extraQueries.for]);

  // both useEffects are Timer that show time after change was made
  useEffect(() => {
    if (!isInitializationRef.current && !isInitialization)
      setTemplateData((data) => ({
        ...data,
        updatedAt: moment().locale('en').format(GlobalDateTimeFormat),
      }));
    else if (isInitializationRef.current && !isInitialization)
      isInitializationRef.current = false;
  }, [dataSectionItems, isInitialization]);

  // GET custom fields
  useEffect(() => {
    const getCustomFields = async () => {
      try {
        setIsGlobalLoading((items) => {
          items.push('getCustomFields');
          return [...items];
        });
        const resp = await axios.get(urls.formBuilder.GET_CUSTOM_FIELDS, {
          headers: generateHeaders(),
        });
        setIsGlobalLoading((items) => {
          items.pop();
          return [...items];
        });
        setCustomFields(resp.data.results);
      } catch (err) {
        console.error(err);
      }
    };

    if (templateData.editorRole === FormsRolesEnum.Creator.key) getCustomFields();
  }, [templateData.editorRole]);

  // both useEffects are Timer that show time after change was made
  useEffect(() => {
    if (!isInitializationRef.current && !isInitialization)
      setTemplateData((data) => ({
        ...data,
        updatedAt: moment().locale('en').format(GlobalDateTimeFormat),
      }));
    else if (isInitializationRef.current && !isInitialization)
      isInitializationRef.current = false;
  }, [dataSectionItems, isInitialization]);

  useEffect(() => {
    if (
      !userReducer
      && templateData.extraQueries.for === FormsForTypesEnum.SystemUser.key
    ) {
      showError(t(`${translationPath}please-login-first`));
      GlobalHistory.push(`/el/login?${query.toString()}`);
    }
    if (
      templateData.extraQueries.key
      && templateData.extraQueries.for === FormsForTypesEnum.SystemUser.key
    )
      verifyCurrentLogin();
    else if (
      !templateData.extraQueries.key
      && templateData.extraQueries.for === FormsForTypesEnum.SystemUser.key
    )
      setIsValidUser(true);
  }, [
    verifyCurrentLogin,
    query,
    templateData.extraQueries.for,
    templateData.extraQueries.key,
    userReducer,
    t,
  ]);

  useEffect(() => {
    templateDataInitRef.current = templateData;
  }, [templateData]);

  const pdfDownLoad = useCallback(
    async ({ pdfName, element, ref, isView }) => {
      // if (isBE){
      //   const response = await DownloadPDFService({
      //     company_uuid: queryFor === FormsForTypesEnum.Candidate.key? candidateReducer?.company?.uuid: ,
      //   })
      //   return;
      // }
      try {
        setIsLoadingPDF(true);
        const res = await DownloadPDF({
          pdfName: templateData?.pdfName || pdfName,
          element,
          ref,
          isView,
        });
        setIsLoadingPDF(false);
        if (res) showSuccess(FormDownloadEnum.pdf.success);
        else showError(t('Shared:failed-to-download-pdf'));
      } catch (err) {
        setIsLoadingPDF(false);
        showError(t('Shared:failed-to-download-pdf'));
        if (isView) window.close();
      }
    },
    [t, templateData?.pdfName],
  );

  // this is to remove the bulk form state if exists
  useEffect(
    () => () => {
      if (sessionStorage.getItem('bulkFormState'))
        sessionStorage.removeItem('bulkFormState');
    },
    [],
  );
  const extractCurrencyByLang = useCallback((lang, currency) => {
    if (!lang || !currency) return '';
    const localeCurrency = currencies.find((item) => item.currency === currency)
      ?.languages?.[lang];
    return localeCurrency || '';
  }, []);

  const isTypographyField = React.useCallback(
    (type) =>
      Object.values(inputFields)
        .filter((field) => field.type === 'inline' || field.type === 'texteditor')
        .some((item) => item.type === type),
    [],
  );
  const ratingAverageData = useMemo(() => {
    const localeData = {
      withRatingFields: false,
      avg: '',
    };
    if (!getCurrentDefaultEnumItem().isShowRatingValue) return localeData;
    let allFields = [];
    Object.values(dataSectionItems).forEach((it) => {
      allFields = [...allFields, ...it.items];
    });
    const ratingFields = allFields.filter((item) => item.type === 'rating');
    if (ratingFields?.length === 0 || !ratingFields) return localeData;
    const total = ratingFields.reduce(
      (accumulator, currentValue) => accumulator + currentValue.ratingValue,
      0,
    );
    let avg = total / ratingFields.length;
    const decimals = (avg.toString().split('.')[1] || []).length;
    if (decimals > 2) avg = parseFloat(avg.toFixed(2));
    localeData.avg = `${avg}/${
      templateData.ratingRange === ScorecardRangesEnum.zeroTen.key
        ? ScorecardRangesEnum.zeroTen.maxValue
        : ScorecardRangesEnum.zeroFive.maxValue
    }`;
    localeData.withRatingFields = true;
    return localeData;
  }, [dataSectionItems, getCurrentDefaultEnumItem, templateData.ratingRange]);

  return (
    <div className="form-builder-page-wrapper page-wrapper p-0">
      <HeaderSection
        preview={preview}
        setPreview={setPreview}
        templateData={templateData}
        setTemplateData={setTemplateData}
        dataSectionItems={dataSectionItems}
        isGlobalLoading={isGlobalLoading}
        isSubmitted={isSubmitted}
        getSelectedRoleEnumItem={getSelectedRoleEnumItem}
        isFailedToGetSections={isFailedToGetSections}
        getIsFormSource={getIsFormSource}
        setIsSubmitted={setIsSubmitted}
        getIsValidData={getIsValidData}
        systemUserRecipient={systemUserRecipient}
        UpdateDownLoadPDFRecipientHandler={UpdateDownLoadPDFRecipientHandler}
        isLoadingPDF={isLoadingPDF}
        // setIsLoadingPDF={setIsLoadingPDF}
        getFormStatusEnumItem={getFormStatusEnumItem}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setHeaderHeight={setHeaderHeight}
        isOpenSideMenu={isOpenSideMenu}
        setIsOpenSideMenu={setIsOpenSideMenu}
        setDataSectionItems={setDataSectionItems}
        formsRolesTypes={formsRolesTypes}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        scrollToField={scrollToField}
        getFilteredRoleTypes={getFilteredRoleTypes}
        pdfRef={pdfRef}
        pdfDownLoad={pdfDownLoad}
        isInitialization={isInitialization}
        getCurrentDefaultEnumItem={getCurrentDefaultEnumItem}
        ratingAverageData={ratingAverageData}
      />
      <div className="form-builder-body-wrapper">
        {((![FormsRolesEnum.Creator.key].includes(templateData.editorRole)
          || preview.isActive) && (
          <>
            {(getSelectedRoleEnumItem(templateData.editorRole).isWithViewSidebar
              || (preview.isActive
                && getSelectedRoleEnumItem(preview.role).isWithViewSidebar)) && (
              <SidebarSection
                preview={preview}
                errors={errors}
                templateData={templateData}
                setTemplateData={setTemplateData}
                customSections={customSections}
                fieldsItems={fieldsItems}
                getSelectedRoleEnumItem={getSelectedRoleEnumItem}
                customFields={customFields}
                dataSectionItems={dataSectionItems}
                setDataSectionItems={setDataSectionItems}
                setFieldsItems={setFieldsItems}
                handleAddSection={handleAddSection}
                setCustomSections={setCustomSections}
                isGlobalLoading={isGlobalLoading}
                headerHeight={headerHeight}
                isOpenSideMenu={isOpenSideMenu}
                isLoadingPDF={isLoadingPDF}
                isSubmitted={isSubmitted}
                UpdateDownLoadFilesSenderHandler={UpdateDownLoadFilesSenderHandler}
                UpdateDownLoadPDFRecipientHandler={UpdateDownLoadPDFRecipientHandler}
                getFilteredRoleTypes={getFilteredRoleTypes}
                getFirstAvailableDefault={getFirstAvailableDefault}
                getCurrentDefaultEnumItem={getCurrentDefaultEnumItem}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                blocksItems={blocksItems}
                setBlocksItems={setBlocksItems}
                pdfRef={pdfRef}
                pdfDownLoad={pdfDownLoad}
                isLoading={isLoading}
                isInitialization={isInitialization}
              />
            )}
            <PreviewSection
              isFieldDisabled={isFieldDisabled}
              preview={preview}
              templateData={templateData}
              isSubmitted={isSubmitted}
              getIsAssignToMe={getIsAssignToMe}
              dataSectionItems={dataSectionItems}
              setDataSectionItems={setDataSectionItems}
              // onIsValidOfferChange={onIsValidOfferChange}
              formsRolesTypes={formsRolesTypes}
              headerHeight={headerHeight}
              errors={errors}
              getSelectedRoleEnumItem={getSelectedRoleEnumItem}
              setIsGlobalLoading={setIsGlobalLoading}
              systemUserRecipient={systemUserRecipient}
              extractCurrencyByLang={extractCurrencyByLang}
              isTypographyField={isTypographyField}
              getCurrentDefaultEnumItem={getCurrentDefaultEnumItem}
            />
            <PreviewPDFSection
              isFieldDisabled={isFieldDisabled}
              preview={{
                isActive: true,
                role: preview.role,
              }}
              pdfDownLoad={pdfDownLoad}
              isGlobalLoading={isGlobalLoading}
              templateData={templateData}
              isSubmitted={isSubmitted}
              dataSectionItems={dataSectionItems}
              setDataSectionItems={setDataSectionItems}
              // onIsValidOfferChange={onIsValidOfferChange}
              getIsAssignToMe={getIsAssignToMe}
              formsRolesTypes={formsRolesTypes}
              headerHeight={headerHeight}
              errors={errors}
              pdfRef={pdfRef}
              getSelectedRoleEnumItem={getSelectedRoleEnumItem}
              setIsGlobalLoading={setIsGlobalLoading}
              extractCurrencyByLang={extractCurrencyByLang}
              isTypographyField={isTypographyField}
            />
          </>
        )) || (
          <BuilderSection
            isFieldDisabled={isFieldDisabled}
            preview={preview}
            errors={errors}
            templateData={templateData}
            setIsGlobalLoading={setIsGlobalLoading}
            setTemplateData={setTemplateData}
            formsRolesTypes={formsRolesTypes}
            dataSectionItems={dataSectionItems}
            setDataSectionItems={setDataSectionItems}
            dataSectionContainers={dataSectionContainers}
            setDataSectionContainers={setDataSectionContainers}
            fieldsItems={fieldsItems}
            isSubmitted={isSubmitted}
            headerHeight={headerHeight}
            isOpenSideMenu={isOpenSideMenu}
            isGlobalLoading={isGlobalLoading}
            customFields={customFields}
            getFilteredRoleTypes={getFilteredRoleTypes}
            getFirstAvailableDefault={getFirstAvailableDefault}
            getSelectedRoleEnumItem={getSelectedRoleEnumItem}
            getCurrentDefaultEnumItem={getCurrentDefaultEnumItem}
            handleAddSection={handleAddSection}
            setFieldsItems={setFieldsItems}
            customSections={customSections}
            isLoadingPDF={isLoadingPDF}
            UpdateDownLoadFilesSenderHandler={UpdateDownLoadFilesSenderHandler}
            UpdateDownLoadPDFRecipientHandler={UpdateDownLoadPDFRecipientHandler}
            setCustomSections={setCustomSections}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            blocksItems={blocksItems}
            setBlocksItems={setBlocksItems}
            extractCurrencyByLang={extractCurrencyByLang}
          />
        )}
      </div>
    </div>
  );
};

export default FormBuilderPage;
