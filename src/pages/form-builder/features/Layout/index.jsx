import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@mui/material';
import axios from 'axios';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { toCamelCase } from '../../utils/helpers/toCamelCase';
import Builder from './Builder';
import Previewer from './Previewer';
import Header from '../Header';
import EditorPanel from '../EditorPanel';
// import useWindowSize from '../../utils/hooks/useWindowSize';
import tData from '../../data/templateData';
import inputFields from '../../data/inputFields';
import dataCustomSections from '../../data/customSections';
import urls from '../../../../api/urls';
import { generateHeaders } from '../../../../api/headers';
import './FormBuilder.Style.scss';
import {
  FormsFieldsTypesEnum,
  FormsRolesEnum,
  NavigationSourcesEnum,
  OffersStatusesEnum,
  TemplateRolesEnum,
} from '../../../../enums';
import {
  GetMultipleMedias,
  GetOfferAccountValidationWithDataBase,
  SendEmailWithOffer,
  UpdateDownLoadPDFRecipient,
  UpdateDownLoadPDFSender,
  DownloadFormBuilderFilesSender,
  GenerateSSOKey,
} from '../../../../services';
import { updateOffersValidationWithDatabase } from '../../../../stores/actions/offersValidationWithDataBaseActions';
import {
  showError,
  showSuccess,
  GlobalHistory,
  GetFormSourceItem,
  DownloadPDFFormV1,
  GlobalSavingDateFormat,
  GlobalDateTimeFormat,
} from '../../../../helpers';
import { useTranslation } from 'react-i18next';
import { toSnakeCase } from 'pages/form-builder/utils/helpers/toSnakeCase';
import { useQuery } from 'hooks';
import i18next from 'i18next';
import PDFPreviewer from './PDFPreviewer';
import moment from 'moment';
import { currencies } from '../../data/currencies';
const parentTranslationPath = 'FormBuilderPage';
export default function App() {
  const { t } = useTranslation(['Shared', parentTranslationPath]);
  const history = GlobalHistory;
  // const { height } = useWindowSize();
  const [headerHeight, setHeaderHeight] = useState(126.5);
  const [isOpenSideMenu, setIsOpenSideMenu] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isGlobalLoading, setIsGlobalLoading] = useState([]);
  const userReducer = useSelector((reducerState) => reducerState.userReducer);
  const candidateUserReducer = useSelector((state) => state?.candidateUserReducer);
  const offersValidationWithDatabaseReducer = useSelector(
    (reducerState) => reducerState?.offersValidationWithDatabaseReducer,
  );
  const [isValidOffer, setIsValidOffer] = useState(
    !offersValidationWithDatabaseReducer
      || !offersValidationWithDatabaseReducer.hasValidation,
  );
  const [templateData, setTemplateData] = useState(tData);
  const [preview, setPreview] = useState({
    isActive: false,
    role: 'sender',
  });
  const [dataSectionItems, setDataSectionItems] = useState({});
  const [fieldsItems, setFieldsItems] = useState(inputFields);
  const [customSections, setCustomSections] = useState(dataCustomSections);
  const [customFields, setCustomFields] = useState({});
  const [isLoadingPDF, setIsLoadingPDF] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const parsedUpdatedAt = new Date(templateData.updatedAt).getTime();
  const parsedCreatedAt = new Date(templateData.createdAt).getTime();
  const [lastTimeChanged, setLastTimeChanged] = useState(
    templateData.updatedAt ? parsedUpdatedAt : formatDistanceToNow(Date.now()),
  );
  const [templateCreationTime, setTemplateCreationTime] = useState(
    templateData.createdAt ? parsedCreatedAt : '',
  );

  const [dataSectionContainers, setDataSectionContainers] = useState([
    ...Object.keys(dataSectionItems),
  ]);
  const [offerData, setOfferData] = useState({});
  const [queryStatus, setQueryStatus] = useState('1');
  const [errors, setErrors] = useState({});
  const q = useQuery();

  const getImagesAndFiles = useCallback(
    async (sections, primaryLang) => {
      const imagesAndFiles = Object.entries(sections).reduce(
        (total, [key, value]) => {
          value.items
            .filter((item) => ['attachment'].includes(item.type))
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
      const response = await GetMultipleMedias(
        {
          uuids: imagesAndFiles.reduce((total, item) => {
            if (item.isArray) total.push(...item.id);
            else total.push(item.id);
            return total;
          }, []),
        },
        candidateUserReducer?.token
          ? {
            customHeaders: true,
            'Accept-Company': candidateUserReducer?.company?.uuid,
            'recipient-token': candidateUserReducer?.token,
            'Accept-Account': candidateUserReducer?.account?.uuid,
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
    [candidateUserReducer],
  );

  const onIsValidOfferChange = useCallback((newValue) => {
    setIsValidOffer(newValue);
  }, []);

  const getIsFormSource = useMemo(
    () => () =>
      templateData.source
      && Object.values(NavigationSourcesEnum).some(
        (item) => +templateData.source === item.key && item.isForm,
      ),
    [templateData.source],
  );
  const isFromBulkSelect = useMemo(
    () =>
      +templateData.source === NavigationSourcesEnum.PipelineBulkToFormBuilderV1.key,
    [templateData.source],
  );
  const getSourceItem = useMemo(
    () => () =>
      (templateData.source
        && Object.values(NavigationSourcesEnum).find(
          (item) => +templateData.source === item.key,
        ))
      || null,
    [templateData.source],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get all branches for current account
   */
  const getOfferAccountValidationWithDataBase = useCallback(async () => {
    setIsGlobalLoading((items) => {
      items.push('getOfferAccountValidationWithDataBase');
      return [...items];
    });
    const response = await GetOfferAccountValidationWithDataBase({
      type_uuid: templateData.typeUUID,
    });
    if (response && response.status === 200) {
      const {
        data: { results },
      } = response;
      dispatch(
        updateOffersValidationWithDatabase({
          hasValidation: results.hasValidation,
        }),
      );
    } else showError(t('failed-to-get-saved-data'), response);

    setIsGlobalLoading((items) => {
      items.pop();
      return [...items];
    });
  }, [dispatch, t, templateData.typeUUID]);

  const getIsValidData = useCallback(
    (fromSource, primaryLanguage, secondaryLanguage, sections) => {
      if (!sections)
        return {
          data: {
            errors: [
              {
                error: 'Unknown Data Source',
              },
            ],
          },
        };
      if (
        fromSource === TemplateRolesEnum.Recipient.key
        || fromSource === TemplateRolesEnum.Sender.key
      ) {
        const requiredAndFilledByMeItems = Object.values(sections)
          .map((section) =>
            section.items.filter(
              (item) => item.isRequired && item.fillBy === fromSource,
            ),
          )
          .flat();
        return {
          data: {
            errors: requiredAndFilledByMeItems
              .filter((item) =>
                !primaryLanguage && !secondaryLanguage
                  ? true
                  : Object.entries(item.languages).some(([key, { value }]) => {
                    if (
                      key === secondaryLanguage
                        && (item.type === 'attachment' || item.type === 'signature')
                    )
                      return false;
                    if (key === primaryLanguage || key === secondaryLanguage) {
                      if (item.type === 'name')
                        return value.some(
                          (item, idx) => !item && idx !== 1 && idx !== 2,
                        );
                      if (item.type === 'phone')
                        return (
                          !value
                            || value.split('-').length !== 3
                            || !value.split('-')[2]
                        );
                      if (item.type === 'checkbox')
                        return !value || value.length === 0;
                      return (
                        (!value && value !== 0)
                          || (value !== 0 && value.length === 0)
                      );
                    }
                    return false;
                  }),
              )
              .map((item) => ({
                error: `${t(item.cardTitle, { ns: 'FormBuilderPage' })}:- ${t(
                  'Shared:this-field-is-required',
                )}`,
                id: item.id,
              })),
          },
        };
      }

      return {
        data: {
          errors: [
            {
              error: 'Unknown Source',
            },
          ],
        },
      };
    },
    [t],
  );

  const scrollToField = (id) => {
    let a = document.getElementById(id);
    if (a) a.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // a.click();
  };

  const selfServiceHandler = useCallback(
    async (formSourceItem, offerData) => {
      const response = await GenerateSSOKey();
      if (response && response.status === 201) {
        const { results } = response.data;
        const account_uuid = localStorage.getItem('account_uuid');
        const user
          = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'));
        window.open(
          `${process.env.REACT_APP_SELFSERVICE_URL}/accounts/login?token_key=${
            results.key
          }&account_uuid=${account_uuid}${
            user?.results?.user?.uuid
              ? `&user_uuid=${user?.results?.user?.uuid}`
              : ''
          }&redirect_path=${
            (formSourceItem.source_url
              && formSourceItem.source_url({
                offerData,
              }))
            || ''
          }`,
          '_self',
        );
      } else if (!response || response.message)
        showError(t('Shared:failed-to-get-saved-data'));
    },
    [t],
  );

  const SendEmailWithOfferHandler = React.useCallback(
    async (form_uuid) => {
      const response = await SendEmailWithOffer({
        form_uuid,
      });
      setIsLoading(false);
      if (response && (response.status === 201 || response.status === 200)) {
        showSuccess(response.data.message);
        if (response.data.message === 'This form has been submitted for approval.')
          window?.ChurnZero?.push([
            'trackEvent',
            'EVA-REC - Offer submitted for approval',
            'Offer submitted for approval',
            1,
            {},
          ]);
        const formSourceItem = GetFormSourceItem(
          q.get('source') && parseInt(q.get('source')),
          undefined,
        );
        if (formSourceItem?.isFromSelfService) {
          await selfServiceHandler(formSourceItem, offerData);
          return;
        }
        if (formSourceItem && formSourceItem.source_url && isFromBulkSelect)
          history.push(formSourceItem.source_url({ templateData }));
        history.push(
          `/recruiter/job/manage/pipeline/${offerData.jobUuid}?${
            offerData.pipelineUuid ? `pipeline_uuid=${offerData.pipelineUuid}&` : ''
          }candidate_uuid=${offerData.candidateUuid}&source=${
            NavigationSourcesEnum.FromFormBuilderToPipeline.key
          }`,
        );
      } else showError('Shared:failed-to-get-saved-data', response);
    },
    [q, isFromBulkSelect, history, templateData, offerData, selfServiceHandler],
  );

  const UpdateDownLoadPDFSenderHandler = React.useCallback(async () => {
    setIsSubmitted(true);
    if (Object.values(errors).filter((item) => item).length) {
      showError('Please fill fields with only valid formats');
      return;
    }
    if (
      getIsValidData(
        TemplateRolesEnum.Sender.key,
        templateData.primaryLang,
        templateData.secondaryLang,
        dataSectionItems,
      ).data.errors.length > 0
    ) {
      showError(
        '',
        getIsValidData(
          TemplateRolesEnum.Sender.key,
          templateData.primaryLang,
          templateData.secondaryLang,
          dataSectionItems,
        ),
      );
      return;
    }
    const template = {
      ...templateData,
      sections: dataSectionItems,
      status: OffersStatusesEnum.WaitingToBeSigned.key,
    };
    setIsLoading(true);
    const response = await UpdateDownLoadPDFSender({
      uuid: offerData.uuid,
      ...toSnakeCase(template),
      status: OffersStatusesEnum.WaitingToBeSigned.key,
      // ...(parseInt(template.status) === OffersStatusesEnum.NotSent.key
      //  && { status: OffersStatusesEnum.WaitingToBeSigned.key }),
    });
    setIsLoading(false);
    if (response && (response.status === 201 || response.status === 200)) {
      const link = document.createElement('a');
      const file_url = URL.createObjectURL(response.data);
      link.setAttribute('target', '_blank');
      link.download = offerData.title;
      link.href = file_url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showSuccess('PDF file downloaded successfully!');
    } else {
      setIsLoading(false);
      showError('Shared:failed-to-get-saved-data', response);
    }
  }, [errors, getIsValidData, templateData, dataSectionItems, offerData]);
  const UpdateDownLoadFilesSenderHandler = React.useCallback(
    async ({ path, successMsg, type }) => {
      setIsSubmitted(true);
      if (Object.values(errors).filter((item) => item).length) {
        showError('Please fill fields with only valid formats');
        return;
      }
      if (
        getIsValidData(
          TemplateRolesEnum.Sender.key,
          templateData.primaryLang,
          templateData.secondaryLang,
          dataSectionItems,
        ).data.errors.length > 0
      ) {
        showError(
          '',
          getIsValidData(
            TemplateRolesEnum.Sender.key,
            templateData.primaryLang,
            templateData.secondaryLang,
            dataSectionItems,
          ),
        );
        return;
      }
      const template = {
        ...templateData,
        sections: dataSectionItems,
        status: OffersStatusesEnum.WaitingToBeSigned.key,
      };
      setIsLoading(true);
      const response = await DownloadFormBuilderFilesSender({
        body: {
          uuid: offerData.uuid,
          ...toSnakeCase(template),
          status: OffersStatusesEnum.WaitingToBeSigned.key,
          // ...(parseInt(template.status) === OffersStatusesEnum.NotSent.key
          //  && { status: OffersStatusesEnum.WaitingToBeSigned.key }),
        },
        path,
        type,
      });
      setIsLoading(false);
      if (
        response
        && (response.status === 201
          || response.status === 200
          || response.status === 202)
      ) {
        const link = document.createElement('a');
        let file_url = '';
        if (type === 'file') file_url = URL.createObjectURL(response.data);
        else file_url = response?.data?.results?.url;
        link.setAttribute('target', '_blank');
        link.download = offerData.title;
        link.href = file_url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showSuccess(successMsg);
      } else {
        setIsLoading(false);
        showError('Shared:failed-to-get-saved-data', response);
      }
    },
    [errors, getIsValidData, templateData, dataSectionItems, offerData],
  );

  const UpdateDownLoadPDFRecipientHandler = React.useCallback(async () => {
    setIsSubmitted(true);
    if (Object.values(errors).filter((item) => item).length) {
      showError('Please fill fields with only valid formats');
      return;
    }
    const form = {
      ...offerData,
      sections: dataSectionItems,
    };
    const errs = getIsValidData(
      TemplateRolesEnum.Recipient.key,
      form.primaryLang,
      form.secondaryLang,
      dataSectionItems,
    );
    if (errs.data?.errors?.[errs.data?.errors?.length - 1]?.id)
      scrollToField(errs.data.errors[errs.data.errors.length - 1].id);
    if (errs.data.errors.length > 0) {
      showError('', errs);
      return;
    }
    setIsLoading(true);
    const response = await UpdateDownLoadPDFRecipient({
      body: {
        ...toSnakeCase(form),
        form_uuid: offerData.uuid,
      },
      token: candidateUserReducer?.token,
      company_uuid: candidateUserReducer?.company?.uuid,
      account_uuid: candidateUserReducer?.account?.uuid,
    });
    setIsLoading(false);
    if (response.status === 200) {
      const link = document.createElement('a');
      const file_url = URL.createObjectURL(response.data);
      link.setAttribute('target', '_blank');
      link.download = offerData.title;
      link.href = file_url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showSuccess('PDF file downloaded successfully!');
    } else showError('failed-to-get-saved-data', response);
  }, [
    candidateUserReducer?.account?.uuid,
    candidateUserReducer?.company?.uuid,
    candidateUserReducer?.token,
    dataSectionItems,
    getIsValidData,
    offerData,
    setIsSubmitted,
    errors,
  ]);

  useEffect(() => {
    if (templateData.editorRole === TemplateRolesEnum.Sender.key)
      getOfferAccountValidationWithDataBase();
  }, [getOfferAccountValidationWithDataBase, templateData.editorRole]);

  // GET template data
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const localBulkSession
      = (sessionStorage.getItem('bulkFormState')
        && JSON.parse(sessionStorage.getItem('bulkFormState')))
      || null;
    const localAssign = (localBulkSession && localBulkSession.invitedMember) || [];
    if (query.get('template_type_uuid')) {
      setTemplateData((prev) => ({
        ...prev,
        ...(localBulkSession || {}),
        assign: localAssign,
        // TODO safely remove status from template
        status: true,
        editorRole: query.get('editorRole'),
        source: query.get('source'),
        typeUUID: query.get('template_type_uuid'),
        uuid: query.get('template_uuid'),
        jobUUID: query.get('job_uuid'),
        extraQueries: {
          jobUUID: query.get('job_uuid'),
          pipelineUUID: query.get('pipeline_uuid'),
          jobPipelineUUID: query.get('pipeline_uuid'),
        },
        sender: {
          avatar: '',
          name: `${userReducer.results.user.first_name?.en || ''} ${
            userReducer.results.user.last_name?.en || ''
          }`,
        },
        recipient: {
          avatar: '',
          name: '',
        },
      }));
      setQueryStatus(query.get('status'));
    }
    if (query.get('approval_uuid')) {
      setTemplateData((prev) => ({
        ...prev,
        extraQueries: {
          approvalUUID: query.get('approval_uuid'),
        },
      }));
      setQueryStatus(query.get('status'));
    }
    const template_uuid = query.get('template_uuid');
    const form_uuid = query.get('form_uuid');
    if (template_uuid && !form_uuid) {
      // if id for template is persistant, then do the get request to a server to get a template data
      const getTemplateData = async () => {
        try {
          setIsGlobalLoading((items) => {
            items.push('getTemplateData');
            return [...items];
          });
          const resp = await axios.get(urls.formBuilder.GET_TEMPLATE, {
            headers: {
              ...generateHeaders(),
              ...(query.get('form_branch_uuid') && {
                'Accept-Company': query.get('form_branch_uuid'),
              }),
            },
            params: { uuid: query.get('template_uuid') },
          });

          const flattenData = toCamelCase(resp.data.results);
          if (flattenData && !flattenData.tags) flattenData.tags = [];
          const imagesAndFiles = await getImagesAndFiles(
            flattenData.sections,
            flattenData.primaryLang,
          );
          if (imagesAndFiles.length > 0)
            imagesAndFiles.map((item) => {
              if (item.imageKey !== 'value')
                flattenData.sections[item.sectionKey][item.saveIn] = item.value;
              else {
                const itemIndex = flattenData.sections[
                  item.sectionKey
                ].items.findIndex((element) => element.id === item.itemId);
                if (itemIndex !== -1)
                  flattenData.sections[item.sectionKey].items[itemIndex].languages[
                    flattenData.primaryLang
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
                const hasLanguageValueBeforeToday = Object.values(
                  item.languages,
                ).some(
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
            status: true,
            editorRole: query.get('editorRole'),
            sender: {
              avatar: '',
              name: `${userReducer.results.user.first_name?.en || ''} ${
                userReducer.results.user.last_name?.en || ''
              }`,
            },
          }));
          setDataSectionItems({ ...flattenData.sections });
          setDataSectionContainers([...Object.keys(flattenData.sections)]);
          setTemplateCreationTime(parsedCreatedAt);
          setQueryStatus(query.get('status'));
          setIsGlobalLoading((items) => {
            items.pop();
            return [...items];
          });
        } catch (err) {
          console.error(err);
        }
      };
      getTemplateData();
    }

    // GET form data
    if (query.get('form_uuid')) {
      // if id for form/offer is persistant, then do the get request to a server to get a offer data including template data
      const getOfferData = async () => {
        try {
          setIsGlobalLoading((items) => {
            items.push('getOfferData');
            return [...items];
          });
          const resp = await axios.get(urls.offer.GET_OFFER, {
            headers: {
              ...generateHeaders(),
              ...(query.get('form_branch_uuid') && {
                'Accept-Company': query.get('form_branch_uuid'),
              }),
            },
            params: { uuid: query.get('form_uuid') },
          });
          const flattenData = toCamelCase({
            ...resp.data.results,
            ...(q.get('pipeline_uuid') && { pipeline_uuid: q.get('pipeline_uuid') }),
          });
          const imagesAndFiles = await getImagesAndFiles(
            flattenData.sections,
            flattenData.primaryLang,
          );
          if (imagesAndFiles.length > 0)
            imagesAndFiles.map((item) => {
              if (item.imageKey !== 'value')
                flattenData.sections[item.sectionKey][item.saveIn] = item.value;
              else {
                const itemIndex = flattenData.sections[
                  item.sectionKey
                ].items.findIndex((element) => element.id === item.itemId);
                if (itemIndex !== -1)
                  flattenData.sections[item.sectionKey].items[itemIndex].languages[
                    flattenData.primaryLang
                  ][item.saveIn] = item.value;
              }
              return undefined;
            });
          setOfferData(flattenData);
          setTemplateData((prev) => ({
            ...prev,
            ...flattenData,
            editorRole:
              query.get('editorRole') || (candidateUserReducer && 'recipient'),
            sender: {
              avatar: '',
              name: `${
                userReducer.results.user.first_name?.[i18next.language]
                || userReducer.results.user.first_name?.en
                || ''
              } ${
                userReducer.results.user.last_name?.[i18next.language]
                || userReducer.results.user.last_name?.en
                || ''
              }`,
            },
          }));
          setDataSectionItems({ ...flattenData.sections });
          setDataSectionContainers([...Object.keys(flattenData.sections)]);
          setQueryStatus(query.get('status'));
          setIsGlobalLoading((items) => {
            items.pop();
            return [...items];
          });
        } catch (err) {
          console.error(err);
        }
      };
      getOfferData();
    }
  }, []);

  useEffect(() => {
    if (candidateUserReducer) {
      const flattenData = toCamelCase(candidateUserReducer.form_data);
      setOfferData(flattenData);
      setTemplateData((prev) => ({
        ...prev,
        ...flattenData,
        editorRole: 'recipient',
      }));
      setDataSectionItems({ ...flattenData.sections });
      setDataSectionContainers([...Object.keys(flattenData.sections)]);
    }
  }, [candidateUserReducer]);

  // GET custom fields
  useEffect(() => {
    const getCustomFields = async () => {
      try {
        setIsGlobalLoading((items) => {
          items.push('getCustomFields');
          return [...items];
        });
        const resp = await axios.get(urls.formBuilder.GET_CUSTOM_FIELDS, {
          headers: {
            ...generateHeaders(),
            ...(q.get('form_branch_uuid') && {
              'Accept-Company': q.get('form_branch_uuid'),
            }),
          },
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
    if (!candidateUserReducer) getCustomFields();
  }, [q, candidateUserReducer]);

  // both useEffects are Timer that show time after change was made
  useEffect(() => {
    setTemplateData((data) => ({ ...data, updatedAt: Date.now() }));
  }, [dataSectionItems]);

  useEffect(() => {
    // TODO POSSIBLE IMPROVEMENT make setInterval timer dynamic and more responsive, since now it will be updated only every 5 sec
    const interval = setInterval(() => {
      setLastTimeChanged(formatDistanceToNow(templateData.updatedAt || Date.now()));
    }, 5000);
    return () => clearInterval(interval);
  }, [templateData.updatedAt]);

  const isFieldDisabled = useCallback(
    (fillBy) => {
      if (preview.isActive) return true;
      if (
        templateData.source
        && [
          NavigationSourcesEnum.FromSelfServiceToFormBuilder.key,
          NavigationSourcesEnum.FromOfferViewToFormBuilder.key,
        ].includes(+templateData.source)
      )
        return true;
      if (
        typeof templateData.status === 'number'
        && ((templateData.status === OffersStatusesEnum.WaitingToBeSigned.key
          && !['recipient'].includes(templateData.editorRole))
          || (templateData.status !== OffersStatusesEnum.WaitingToBeSigned.key
            && templateData.status !== OffersStatusesEnum.Rejected.key
            && templateData.status !== OffersStatusesEnum.Failed.key
            && templateData.status !== OffersStatusesEnum.Draft.key
            && templateData.status !== OffersStatusesEnum.RequestingMoreInfo.key
            && templateData.status !== OffersStatusesEnum.PendingApproval.key)
          || ((templateData.status === OffersStatusesEnum.RequestingMoreInfo.key
            || templateData.status === OffersStatusesEnum.RejectedByRecipient.key
            || templateData.status === OffersStatusesEnum.Rejected.key)
            && templateData.source
            && [
              NavigationSourcesEnum.TasksSelfServiceToFormBuilder.key,
              NavigationSourcesEnum.TasksSelfServicesToOfferBuilder.key,
              NavigationSourcesEnum.FromOfferToFormBuilder.key,
            ].includes(+templateData.source)))
      )
        return true;
      return !preview.isActive
        ? ['creator'].includes(templateData.editorRole)
          ? false
          : ![templateData.editorRole].includes(fillBy)
        : ![preview.role].includes(fillBy);
    },
    [
      preview.isActive,
      preview.role,
      templateData.editorRole,
      templateData.source,
      templateData.status,
    ],
  );
  // to reset the validation with database on change
  useEffect(() => {
    if (dataSectionItems) setIsValidOffer((item) => (item ? false : item));
  }, [dataSectionItems]);
  const pdfRef = useRef(null);

  const pdfDownLoad = useCallback(
    async ({ pdfName, element, ref, isView }) => {
      try {
        setIsLoadingPDF(true);
        const res = await DownloadPDFFormV1({
          pdfName: templateData?.pdfName || pdfName,
          element,
          ref,
          isView,
        });
        setIsLoadingPDF(false);
        if (res) showSuccess('PDF file downloaded successfully!');
        else showError(t('Shared:failed-to-download-pdf'));
      } catch (err) {
        setIsLoadingPDF(false);
        showError(t('Shared:failed-to-download-pdf'));
        if (isView) window.close();
      }
    },
    [t, templateData?.pdfName],
  );
  const extractCurrencyByLang = useCallback((lang, currency) => {
    if (!lang || !currency) return '';
    const localeCurrency = currencies.find((item) => item.currency === currency)
      ?.languages?.[lang];
    return localeCurrency || '';
  }, []);

  useEffect(
    () => () => {
      if (sessionStorage.getItem('bulkFormState'))
        sessionStorage.removeItem('bulkFormState');
    },
    [],
  );
  const isTypographyField = React.useCallback(
    (type) =>
      Object.values(inputFields)
        .filter((field) => field.type === 'inline' || field.type === 'texteditor')
        .some((item) => item.type === type),
    [],
  );

  return (
    <Grid
      className="form-builder-layout-wrapper"
      container
      direction="column"
      sx={{
        background: '#FBFBFB',
        // height,
      }}
    >
      <Header
        preview={preview}
        lastTimeChanged={lastTimeChanged}
        setPreview={setPreview}
        templateData={templateData}
        setTemplateData={setTemplateData}
        dataSectionItems={dataSectionItems}
        isGlobalLoading={isGlobalLoading}
        offerData={offerData}
        isSubmitted={isSubmitted}
        getIsFormSource={getIsFormSource}
        getSourceItem={getSourceItem}
        setIsSubmitted={setIsSubmitted}
        queryStatus={queryStatus}
        errors={errors}
        isValidOffer={isValidOffer}
        getIsValidData={getIsValidData}
        UpdateDownLoadPDFSenderHandler={UpdateDownLoadPDFSenderHandler}
        UpdateDownLoadPDFRecipientHandler={UpdateDownLoadPDFRecipientHandler}
        isLoadingPDF={isLoadingPDF}
        setIsLoadingPDF={setIsLoadingPDF}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setHeaderHeight={setHeaderHeight}
        isOpenSideMenu={isOpenSideMenu}
        setIsOpenSideMenu={setIsOpenSideMenu}
        setDataSectionItems={setDataSectionItems}
        SendEmailWithOfferHandler={SendEmailWithOfferHandler}
        scrollToField={scrollToField}
        pdfDownLoad={pdfDownLoad}
        pdfRef={pdfRef}
        isFromBulkSelect={isFromBulkSelect}
        parentTranslationPath={parentTranslationPath}
      />
      <Grid container item xs>
        {(!['creator'].includes(templateData.editorRole) || preview.isActive) && (
          //TODO since sender logic changed, its better to move Editor panel to Previewer comp
          <EditorPanel
            preview={preview}
            lastTimeChanged={lastTimeChanged}
            templateCreationTime={templateCreationTime}
            templateData={templateData}
            setTemplateData={setTemplateData}
            customSections={customSections}
            fieldsItems={fieldsItems}
            customFields={customFields}
            setDataSectionItems={setDataSectionItems}
            setFieldsItems={setFieldsItems}
            //TODO use setCustomSections
            setCustomSections={setCustomSections}
            setErrors={setErrors}
            offerData={offerData}
            headerHeight={headerHeight}
            isOpenSideMenu={isOpenSideMenu}
            UpdateDownLoadPDFSenderHandler={UpdateDownLoadPDFSenderHandler}
            UpdateDownLoadPDFRecipientHandler={UpdateDownLoadPDFRecipientHandler}
            UpdateDownLoadFilesSenderHandler={UpdateDownLoadFilesSenderHandler}
            pdfDownLoad={pdfDownLoad}
            isGlobalLoading={isGlobalLoading}
            pdfRef={pdfRef}
            isFromBulkSelect={isFromBulkSelect}
            errors={errors}
            isSubmitted={isSubmitted}
            parentTranslationPath={parentTranslationPath}
          />
        )}
        {!['creator'].includes(templateData.editorRole) || preview.isActive ? (
          <>
            <Previewer
              isFieldDisabled={isFieldDisabled}
              preview={preview}
              templateData={templateData}
              isSubmitted={isSubmitted}
              dataSectionItems={dataSectionItems}
              setDataSectionItems={setDataSectionItems}
              isValidOffer={isValidOffer}
              onIsValidOfferChange={onIsValidOfferChange}
              queryStatus={queryStatus}
              headerHeight={headerHeight}
              setErrors={setErrors}
              setIsGlobalLoading={setIsGlobalLoading}
              extractCurrencyByLang={extractCurrencyByLang}
              isTypographyField={isTypographyField}
            />
            <PDFPreviewer
              isFieldDisabled={isFieldDisabled}
              preview={{
                isActive: true,
                role: preview.role,
              }}
              templateData={{
                ...templateData,
                ...(pdfRef && {
                  editorRole: FormsRolesEnum.Recipient.key,
                }),
              }}
              isSubmitted={isSubmitted}
              dataSectionItems={dataSectionItems}
              setDataSectionItems={setDataSectionItems}
              isValidOffer={isValidOffer}
              onIsValidOfferChange={onIsValidOfferChange}
              queryStatus={queryStatus}
              headerHeight={headerHeight}
              pdfDownLoad={pdfDownLoad}
              isGlobalLoading={isGlobalLoading}
              setErrors={setErrors}
              pdfRef={pdfRef}
              setIsGlobalLoading={setIsGlobalLoading}
              extractCurrencyByLang={extractCurrencyByLang}
              isTypographyField={isTypographyField}
            />
          </>
        ) : (
          <Builder
            isFieldDisabled={isFieldDisabled}
            preview={preview}
            lastTimeChanged={lastTimeChanged}
            templateCreationTime={templateCreationTime}
            templateData={templateData}
            setTemplateData={setTemplateData}
            dataSectionItems={dataSectionItems}
            setDataSectionItems={setDataSectionItems}
            dataSectionContainers={dataSectionContainers}
            setDataSectionContainers={setDataSectionContainers}
            fieldsItems={fieldsItems}
            headerHeight={headerHeight}
            isOpenSideMenu={isOpenSideMenu}
            customFields={customFields}
            setFieldsItems={setFieldsItems}
            customSections={customSections}
            errors={errors}
            setErrors={setErrors}
            UpdateDownLoadPDFSenderHandler={UpdateDownLoadPDFSenderHandler}
            UpdateDownLoadPDFRecipientHandler={UpdateDownLoadPDFRecipientHandler}
            extractCurrencyByLang={extractCurrencyByLang}
          />
        )}
      </Grid>
    </Grid>
  );
}
