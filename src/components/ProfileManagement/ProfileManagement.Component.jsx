import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { ButtonBase, IconButton } from '@mui/material';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import i18next from 'i18next';
import { getErrorByName, showError, showSuccess } from '../../helpers';
import { UploaderComponent } from '../Uploader/Uploader.Component';
import {
  UploaderPageEnum,
  ProfileManagementFeaturesEnum,
  ProfileSourcesTypesEnum,
} from '../../enums';
import {
  BasicInformationSection,
  ContactInformationSection,
  EducationSection,
  ExperienceSection,
  LanguagesSection,
  QuestionnaireSection,
  SignupRequirementsSection,
  SkillsSection,
  VideoCvSection,
  ExtrasSection,
  TagsSection,
  DynamicPropertiesSection,
} from './sections';
import {
  emailExpression,
  facebookExpression,
  gitHubExpression,
  linkedinExpression,
  phoneExpression,
  twitterExpression,
} from '../../utils';
import {
  UpdateCandidatesProfile,
  GetCandidatesProfileById,
  GetMultipleMedias,
  CreateCandidatesProfile,
  GetJobRequirementsByJobId,
  GetSignupRequirementsByCategories,
  GetProviderProfile,
} from '../../services';
import './ProfileManagement.Style.scss';
import {
  SetupsReducer,
  SetupsReset,
  SharedInputControl,
} from '../../pages/setups/shared';
import { DialogComponent } from '../Dialog/Dialog.Component';
import { CustomCandidatesFilterTagsEnum } from 'enums/Pages/CandidateFilterTags.Enum';
import moment from 'moment';

const parentTranslationPath = 'ProfileManagementComponent';
const isValidDate = (dateString) => {
  if (dateString === null || dateString === '') return true;
  const inputDate = moment(dateString, 'YYYY-MM-DD', true).locale('en');
  // 1900 is the earliest selectable date in Material-UI
  return inputDate.isValid() && inputDate.toDate().getFullYear() > 1900;
};
const transformDate = (value, originalValue) => {
  if (!originalValue) return null; // Convert empty string and null to null

  return value;
};
export const ProfileManagementComponent = ({
  candidate_uuid,
  feature,
  job_uuid,
  pipeline_uuid,
  job_requirement,
  is_employee,
  profile_uuid,
  company_uuid,
  isFullWidthFields,
  onSave,
  initDataProfile,
  onFailed,
  from_feature,
  componentPermission,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const userReducer = useSelector((state) => state?.userReducer);
  const [activeLanguageUUID, setActiveLanguageUUID] = useState(null);
  const [localCompanyUUID, setLocalCompanyUUID] = useState(company_uuid);
  const [dynamicPropertiesReq, setDynamicPropertiesReq] = useState([]);
  // const candidatePropertyRef = useRef([]);
  // const candidatePropertiesRef = useRef([]);
  const isEditInitRef = useRef(false);
  const [sections, setSections] = useState(() => [
    {
      key: 1,
      id: 'contact-information',
      name: t('contact-information'),
      // icon: 'mdi mdi-information-outline',
    },
    {
      key: 2,
      id: 'basic-information',
      name: t('basic-information'),
      icon: 'mdi mdi-information-outline',
    },
    {
      key: 3,
      id: 'experience',
      name: t('experience'),
      icon: 'mdi mdi-arrow-up-bold-hexagon-outline',
    },
    {
      key: 4,
      id: 'education',
      name: t('education'),
      icon: 'mdi mdi-book-open-outline',
    },
    {
      key: 5,
      id: 'skills',
      name: t('skills'),
      icon: 'mdi mdi-briefcase-edit-outline',
    },
    {
      key: 6,
      id: 'languages',
      name: t('languages'),
      icon: 'mdi mdi-translate',
    },
    {
      key: 7,
      id: 'questionnaire',
      name: t('questionnaire'),
      // icon: 'mdi mdi-translate',
      isHidden: !job_requirement || job_requirement.length === 0,
    },
    {
      key: 8,
      id: 'signup-requirements',
      name: t('signup-requirements'),
      // icon: 'mdi mdi-translate',
      isHidden: true,
    },
    {
      key: 9,
      id: 'video-cv',
      name: t('video-cv'),
      icon: 'mdi mdi-video-wireless-outline',
    },
    {
      key: 10,
      id: 'tags',
      name: t('tags'),
    },
  ]);
  const [socialItems] = useState(() => [
    {
      key: 1,
      label: 'facebook',
      stateKey: 'facebook_url',
      icon: 'mdi mdi-facebook',
      pattern: facebookExpression,
    },
    {
      key: 2,
      label: 'twitter',
      stateKey: 'twitter_url',
      icon: 'mdi mdi-twitter',
      pattern: twitterExpression,
    },
    {
      key: 3,
      label: 'linkedin',
      stateKey: 'linkedin_url',
      icon: 'mdi mdi-linkedin',
      pattern: linkedinExpression,
    },
    {
      key: 4,
      label: 'github',
      stateKey: 'github_url',
      icon: 'mdi mdi-github',
      pattern: gitHubExpression,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSocialDialogOpen, setIsSocialDialogOpen] = useState(false);
  const [currentSocialItem, setCurrentSocialItem] = useState(null);
  const [localCategories, setLocalCategories] = useState([]);
  const stateInitRef = useRef({
    language_profile_uuid: profile_uuid || null,
    job_uuid: job_uuid || null,
    pipeline_uuid: pipeline_uuid || null,
    job_requirement: job_requirement || (!profile_uuid && []) || null,
    sign_up_requirement: (!profile_uuid && []) || null,
    category_uuid: (profile_uuid && []) || null,
    first_name: null,
    last_name: null,
    phone_number: null,
    country_code: null,
    assigned_user_uuid: null,
    salutation_uuid: null,
    source_type: null,
    source_uuid: null,
    is_employee,
    feature,
    dob: null,
    email: null,
    gender: null,
    address: null,
    cv_url: null,
    cv: [],
    cv_uuid: null,
    job_types: [],
    description: null,
    nationality: [],
    owns_a_vehicle: null,
    profile_pic: [],
    profile_pic_uuid: null,
    willing_to_travel: null,
    willing_to_relocate: null,
    twitter_url: '',
    facebook_url: '',
    linkedin_url: '',
    github_url: '',
    video: [],
    video_uuid: null,
    extra: {
      martial_status: '',
      interested_job_family: '',
      interested_position_title: '',
      availability_date_of_joining: '',
      height: '',
      weight: '',
      current_salary: '',
      excepted_salary: '',
      academic_certificate: [],
      other_certificate: [],
      relative: null,
      relative_name: '',
      rehire: null,
      rehire_name: '',
    },
    skills: [],
    references: [],
    questionnaire: {},
    location: {
      city: null,
      country_uuid: null,
    },
    right_to_work: {
      country_uuid: null,
      document_type: null,
    },
    language_proficiency: [],
    experience: [
      {
        company_name: '',
        role: '',
        industry_uuid: '',
        career_level_uuid: '',
        country_uuid: '',
        no_of_beds: 0,
        locations: [],
        from_date: '',
        to_date: null,
        is_currently: false,
        description: '',
      },
    ],
    education: [
      {
        institution: '',
        major_uuid: '',
        degree_type_uuid: '',
        gpa: 0,
        from_date: '',
        to_date: '',
        is_currently: false,
        country_uuid: '',
        description: '',
      },
    ],
    tags: [],
    custom_tags: [],
    candidate_property: [],
    dynamic_properties: [],
    ...(initDataProfile || {}),
  });
  const [errors, setErrors] = useState(() => ({}));
  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is sent new value for state from child
   */
  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  /**
   * @param newFiles - the current file
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle updating the uploading the logo
   */
  const onUploadChanged = (newFiles) => {
    setState({
      id: 'profile_pic_uuid',
      value: (newFiles.length && newFiles[0].uuid) || null,
    });
    setState({
      id: 'profile_pic',
      value: newFiles || [],
    });
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle when the dialog closes
   */
  const isSocialDialogOpenChanged = () => {
    onStateChanged({ id: 'facebook_url', value: '' });
    onStateChanged({ id: 'linkedin_url', value: '' });
    onStateChanged({ id: 'twitter_url', value: '' });
    onStateChanged({ id: 'github_url', value: '' });

    setIsSocialDialogOpen(false);
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle when the dialog is saved
   */
  const saveSocialHandler = (event) => {
    event.preventDefault();
    setIsSocialDialogOpen(false);
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle when the dialog is opened
   */
  const openSocialHandler = (socialItem) => {
    setCurrentSocialItem(socialItem);
    setIsSocialDialogOpen(true);
  };
  const fromToDatesSchema = useMemo(
    () =>
      yup.object().shape({
        to_date: yup
          .date()
          .nullable()
          .transform(transformDate)
          .test('is-valid-date', t('Shared:invalid-date'), isValidDate)
          .max(
            moment().locale('en').toDate(),
            t('Shared:end-date-must-be-today-or-before-today'),
          ),
        from_date: yup
          .date()
          .nullable()
          .transform(transformDate)
          .min('1900-01-01', t('Shared:invalid-date'))
          .max(
            moment().locale('en').toDate(),
            t('Shared:start-date-must-be-today-or-before-today'),
          )
          .test('is-valid-date', t('Shared:invalid-date'), isValidDate)
          .when('to_date', (to_date, schema) => {
            if (to_date && moment(to_date).locale('en').isValid())
              return schema.max(
                to_date,
                t('Shared:start-date-must-be-before-end-date'),
              );
            else
              return schema.max(
                moment().locale('en').toDate(),
                t('Shared:start-date-must-be-today-or-before-today'),
              );
          }),
      }),
    [t],
  );
  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to check if the string is html or not
   */
  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: yup
          .object()
          .shape({
            uuid: yup.string().nullable(),
            source_type: yup
              .number()
              .nullable()
              .when(
                'uuid',
                (value, field) =>
                  (!value
                    && field
                      .oneOf(
                        Object.values(ProfileSourcesTypesEnum).map(
                          (item) => item.key,
                        ),
                        t('Shared:this-field-is-required'),
                      )
                      .required(t('Shared:this-field-is-required')))
                  || field,
              ),
            source_uuid: yup
              .string()
              .nullable()
              .when(
                'source_type',
                (value, field) =>
                  (value
                    && +value !== ProfileSourcesTypesEnum.Portal.key
                    && +value !== ProfileSourcesTypesEnum.Migrated.key
                    && field.required(t('Shared:this-field-is-required')))
                  || field,
              ),
            email: yup
              .string()
              .nullable()
              .matches(emailExpression, {
                message: t('Shared:invalid-email'),
                excludeEmptyString: true,
              })
              .required(t('this-field-is-required')),
            nationality: yup
              .array()
              .nullable()
              .required(t('this-field-is-required'))
              .min(1, t('this-field-is-required')),
            // .when(
            //   'language_profile_uuid',
            //   (value, field) => (value && field) || field.required(t('this-field-is-required')),
            // ),
            phone_number: yup
              .string()
              .nullable()
              .matches(phoneExpression, {
                message: t('Shared:invalid-phone-number'),
                excludeEmptyString: true,
              }),
            // .required(t('this-field-is-required')),
            // .when(
            //   'language_profile_uuid',
            //   (value, field) => (value && field) || field.required(t('this-field-is-required')),
            // ),
            country_code: yup.string().nullable(),
            // .required(t('this-field-is-required')),
            // .when(
            //   'language_profile_uuid',
            //   (value, field) => (value && field) || field.required(t('this-field-is-required')),
            // ),
            first_name: yup
              .string()
              .nullable()
              .required(t('this-field-is-required')),
            // .when(
            //   'language_profile_uuid',
            //   (value, field) => (value && field) || field.required(t('this-field-is-required')),
            // ),
            last_name: yup.string().nullable().required(t('this-field-is-required')),
            // .when(
            //   'language_profile_uuid',
            //   (value, field) => (value && field) || field.required(t('this-field-is-required')),
            // ),
            category_uuid: yup
              .array()
              .nullable()
              .required(t('this-field-is-required'))
              .min(1, t('this-field-is-required')),
            // .when(
            //   'language_profile_uuid',
            //   (value, field) => (value && field)
            //     || field.min(
            //       1,
            //       t(`${t('Shared:please-select-at-least')} ${1} ${t('category')}`),
            //     ),
            // ),
            location: yup
              .object()
              .shape({
                country_uuid: yup.string().nullable(),
                // .required(t('this-field-is-required')),
              })
              .nullable(),
            language_proficiency: yup
              .array()
              .of(
                yup
                  .object()
                  .nullable()
                  .shape({
                    uuid: yup
                      .string()
                      .nullable()
                      .required(t('this-field-is-required')),
                    value: yup
                      .string()
                      .nullable()
                      .required(t('this-field-is-required')),
                  }),
              )
              .nullable(),
            // TODO: check implementation with when (it returns array of the value instead of only value)
            cv_uuid: yup.string().nullable().required(t('this-field-is-required')),
            extra: yup
              .object()
              .shape({
                rehire: yup.string().nullable(),
                relative: yup.string().nullable(),
                rehire_name: yup.lazy((value, { parent }) => {
                  if (parent?.rehire === 'yes')
                    return yup
                      .string()
                      .nullable()
                      .required(t('this-field-is-required'));
                  else return yup.string().nullable();
                }),
                relative_name: yup.lazy((value, { parent }) => {
                  if (parent?.relative === 'yes')
                    return yup
                      .string()
                      .nullable()
                      .required(t('this-field-is-required'));
                  else return yup.string().nullable();
                }),
                relationship: yup.lazy((value, { parent }) => {
                  if (parent?.relative === 'yes')
                    return yup
                      .string()
                      .nullable()
                      .required(t('this-field-is-required'));
                  else return yup.string().nullable();
                }),
              })
              .nullable(),
            candidate_property: yup
              .array()
              .of(
                yup.object().shape({
                  isRequired: yup.boolean().nullable(),
                  uuid: yup
                    .string()
                    .nullable()
                    .required(t('Shared:this-field-is-required')),
                  value: yup
                    .mixed()
                    .test(
                      'isRequired',
                      t('Shared:this-field-is-required'),
                      (value, { parent }) => !parent.isRequired || value,
                    ),
                }),
              )
              .nullable(),
            experience: yup.array().of(fromToDatesSchema).nullable(),
            education: yup.array().of(fromToDatesSchema).nullable(),
            tags: yup
              .array()
              .of(
                yup
                  .object()
                  .nullable()
                  .shape({
                    key: yup
                      .string()
                      .nullable()
                      .required(t('this-field-is-required')),
                    value: yup
                      .string()
                      .nullable()
                      .required(t('this-field-is-required')),
                  }),
              )
              .nullable(),
          })
          .nullable(),
      },
      state,
    ).then((result) => {
      setErrors(result);
    });
  }, [fromToDatesSchema, state, t]);

  const getEditInit = useCallback(async () => {
    setIsLoading(true);
    const response = await GetCandidatesProfileById({
      candidate_uuid,
      profile_uuid,
      from_feature,
    });
    isEditInitRef.current = false;
    setIsLoading(false);
    if (response && response.status === 200) {
      const localResult = response.data.results;
      const stringFiles = [];
      if (
        localResult.profile_pic_uuid
        && typeof localResult.profile_pic_uuid === 'string'
      )
        stringFiles.push({
          key: 'profile_pic_uuid',
          entireFile: 'profile_pic',
          value: localResult.profile_pic_uuid,
        });
      if (localResult.cv_uuid && typeof localResult.cv_uuid === 'string')
        stringFiles.push({
          key: 'cv_uuid',
          entireFile: 'cv',
          value: localResult.cv_uuid,
        });
      if (localResult.video_uuid && typeof localResult.video_uuid === 'string')
        stringFiles.push({
          key: 'video_uuid',
          entireFile: 'video',
          value: localResult.video_uuid,
        });

      if (stringFiles.length) {
        const mediaResponse = await GetMultipleMedias({
          uuids: stringFiles.map((item) => item.value),
        });
        if (
          mediaResponse
          && mediaResponse.status === 200
          && mediaResponse.data.results.data.length > 0
        )
          stringFiles.map((item) => {
            const fileIndex = mediaResponse.data.results.data.findIndex(
              (element) => element.original.uuid === item.value,
            );
            if (fileIndex !== -1)
              localResult[item.entireFile] = [
                mediaResponse.data.results.data[fileIndex].original,
              ];
            else localResult[item.key] = null;
            return undefined;
          });
        else {
          showError(t('Shared:failed-to-get-uploaded-file'), mediaResponse);
          if (onFailed) onFailed();
        }
      }
      const getValue = (value) => {
        switch (value) {
        case true:
          return 'yes';
        case false:
          return 'no';
        default:
          return null;
        }
      };
      const tags = [];
      const custom_tags = [];
      // const custom_tags_final = {};
      localResult?.tag?.forEach((item) => {
        if (
          Object.values(CustomCandidatesFilterTagsEnum).some(
            (element) => element.key === item.key,
          )
        )
          custom_tags.push(item);
        // custom_tags_final[item.key] = [...(custom_tags_final[item.key] || []), item.value]
        else tags.push(item);
      });

      // const requiredProperties = candidatePropertiesRef.current.filter(
      //   (item) => item.is_required
      // );
      // if (requiredProperties.length > 0) {
      //   const localCandidateProperty = [...(localResult.candidate_property || [])];
      //   localCandidateProperty.map((item) => {
      //     const propertyIndex = requiredProperties.findIndex(
      //       (element) => element.uuid === item.uuid
      //     );
      //     if (propertyIndex !== -1)
      //       localCandidateProperty[propertyIndex].isRequired = true;
      //
      //     return undefined;
      //   });
      //   localResult.candidate_property = localCandidateProperty;
      // }
      setState({
        id: 'edit',
        value: {
          ...localResult,
          willing_to_relocate: getValue(localResult.willing_to_relocate),
          willing_to_travel: getValue(localResult.willing_to_travel),
          owns_a_vehicle: getValue(localResult.owns_a_vehicle),
          tags,
          custom_tags,
          extra:
            (localResult.extra && {
              ...localResult.extra,
              rehire: getValue(localResult.extra.rehire),
              relative: getValue(localResult.extra.relative),
            })
            || (stateInitRef.current?.extra && {
              ...stateInitRef.current.extra,
              rehire: getValue(stateInitRef.current.extra.rehire),
              relative: getValue(stateInitRef.current.extra.relative),
            }),
          // custom_tags: Object.keys(custom_tags_final)?.map(key=> ({ key, value: custom_tags_final[key] }))
        },
      });
    } else {
      showError(t('Shared:failed-to-get-saved-data'), response);
      if (onFailed) onFailed();
    }
  }, [candidate_uuid, profile_uuid, from_feature, t, onFailed]);

  const getJobRequirementsByJobId = useCallback(async () => {
    setIsLoading(true);
    const response = await GetJobRequirementsByJobId({
      job_uuid,
      company_uuid: localCompanyUUID,
    });
    setIsLoading(false);
    if (response && response.status === 200) {
      setState({
        id: 'job_requirement',
        value: response.data.results.job_requirement.map((item) => ({
          ...item,
          answer_uuid: null,
          media_uuid: null,
          answer_text: null,
          question_uuid: item.uuid,
        })),
      });
      if (response.data.results.job_requirement.length)
        setSections((items) => {
          items[6].isHidden = false;
          return [...items];
        });
    } else {
      showError(t('Shared:failed-to-get-saved-data'), response);
      if (onFailed) onFailed();
    }
  }, [localCompanyUUID, job_uuid, onFailed, t]);

  const getSignupRequirementsByCategories = useCallback(
    async (localCategories, language_profile_uuid) => {
      setIsLoading(true);
      const response = await GetSignupRequirementsByCategories({
        category_uuid: localCategories,
        language_profile_uuid,
        company_uuid: localCompanyUUID,
        job_uuid,
      });
      setIsLoading(false);
      if (response && response.status === 200) {
        setState({
          id: 'sign_up_requirement',
          value: response.data.results.sign_up_requirement.map((item) => ({
            ...item,
            answer_uuid: null,
            media_uuid: null,
            answer_text: null,
            question_uuid: item.uuid,
          })),
        });
        setSections((items) => {
          // eslint-disable-next-line no-param-reassign
          items[7].isHidden = !response.data.results.sign_up_requirement.length;
          return [...items];
        });
        setDynamicPropertiesReq(response?.data?.results?.dynamic_properties || []);
      } else {
        showError(t('Shared:failed-to-get-saved-data'), response);
        if (onFailed) onFailed();
      }
    },
    [localCompanyUUID, onFailed, t, job_uuid],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to save and submit the profile builder
   */
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    if (
      !profile_uuid
      && (!userReducer
        || !userReducer.results
        || !userReducer.results.language
        || !userReducer.results.language.length)
    ) {
      showError(t('Shared:failed-to-get-languages'));
      if (onFailed) onFailed();
    }
    const getValue = (value) => {
      switch (value) {
      case 'yes':
        return true;
      case 'no':
        return false;
      default:
        return null;
      }
    };
    setIsLoading(true);
    const stateClone = { ...state };
    delete stateClone['tags'];
    delete stateClone['custom_tags'];

    // const finCustomTags = [];
    // state.custom_tags?.forEach(tag => {
    //   tag.value?.forEach(val=> finCustomTags.push({ key:tag.key, value: val.uuid }))
    // })

    let profileRes;
    if (userReducer?.results?.user?.is_provider) {
      profileRes = await GetProviderProfile({
        member_type: userReducer?.results?.user?.member_type,
        user_uuid: userReducer?.results?.user?.uuid,
        type: userReducer?.results?.user?.type,
        is_other: false,
      });
      if (profileRes.status !== 200 && profileRes.status !== 200) {
        showError(t('candidate-create-failed'), profileRes);
        return;
      }
    }
    const response = await ((profile_uuid
      && UpdateCandidatesProfile(
        {
          job_uuid,
          pipeline_uuid,
          candidate_uuid,
          candidate_data: {
            ...stateClone,
            willing_to_relocate: getValue(state.willing_to_relocate),
            willing_to_travel: getValue(state.willing_to_travel),
            owns_a_vehicle: getValue(state.owns_a_vehicle),
            extra: {
              ...stateClone.extra,
              rehire: getValue(state.extra.rehire),
              relative: getValue(state.extra.relative),
            },
            // tag: [...state.tags, ...finCustomTags]
            tag: [...state.tags, ...state.custom_tags].filter(
              (item) => item?.key && item?.value?.length,
            ),
            sourced_by_uuid: profileRes?.data?.results?.uuid,
            sourced_by: profileRes?.data?.results?.type,
          },
        },
        localCompanyUUID,
      ))
      || CreateCandidatesProfile({
        ...stateClone,
        job_uuid,
        language_profile_uuid: userReducer.results.language[0].id,
        willing_to_relocate: getValue(state.willing_to_relocate),
        willing_to_travel: getValue(state.willing_to_travel),
        owns_a_vehicle: getValue(state.owns_a_vehicle),
        extra: {
          ...stateClone.extra,
          rehire: getValue(state.extra.rehire),
          relative: getValue(state.extra.relative),
        },
        // tag: [...state.tags, ...finCustomTags]
        tag: [...state.tags, ...state.custom_tags].filter(
          (item) => item?.key && item?.value?.length,
        ),
        ...(userReducer?.results?.user?.is_provider && {
          sourced_by: profileRes?.data?.results?.type,
          sourced_by_uuid: profileRes?.data?.results?.uuid,
          source_uuid: userReducer?.results?.user?.source_uuid,
        }),
      }));
    if (
      response
      && (response.status === 200 || response.status === 201 || response.status === 202)
    ) {
      if (profile_uuid) showSuccess(t('profile-saved-successfully'));
      else {
        showSuccess(t('candidate-created-successfully'));
        if (state?.source_type === ProfileSourcesTypesEnum.Agency.key)
          window?.ChurnZero?.push([
            'trackEvent',
            `EVA-Agency - Agency adding candidate`,
            `Agency adding candidate`,
            1,
            {},
          ]);
        window?.ChurnZero?.push([
          'trackEvent',
          'Add candidate',
          'Add a new candidate',
          1,
          {},
        ]);
      }
      if (onSave)
        onSave(
          profile_uuid
            || (response.data.results && response.data.results.profile_uuid),
        );
      else setIsLoading(false);
    } else if (profile_uuid) {
      showError(t('profile-save-failed'), response);
      setIsLoading(false);
    } else {
      showError(t('candidate-create-failed'), response);
      setIsLoading(false);
    }
  };

  // this to call errors' updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  useEffect(() => {
    if (profile_uuid) {
      isEditInitRef.current = true;
      getEditInit();
    }
  }, [profile_uuid, getEditInit]);

  useEffect(() => {
    if (job_uuid && (!job_requirement || !job_requirement.length))
      getJobRequirementsByJobId();
  }, [getJobRequirementsByJobId, job_requirement, job_uuid]);

  useEffect(() => {
    if ((profile_uuid || activeLanguageUUID) && localCategories.length > 0)
      getSignupRequirementsByCategories(
        localCategories,
        profile_uuid || activeLanguageUUID,
      );
  }, [
    activeLanguageUUID,
    getSignupRequirementsByCategories,
    profile_uuid,
    localCategories,
  ]);

  useEffect(() => {
    if (
      (!state.category_uuid || !state.category_uuid.length)
      && state.sign_up_requirement
      && state.sign_up_requirement.length
    ) {
      setState({ id: 'sign_up_requirement', value: [] });
      setSections((items) => {
        // eslint-disable-next-line no-param-reassign
        items[7].isHidden = true;
        return [...items];
      });
    }
  }, [state.category_uuid, state.sign_up_requirement]);

  // this to get languages
  useEffect(() => {
    if (userReducer && userReducer.results && userReducer.results.language) {
      const localLanguage = userReducer.results.language.find(
        (item) => item.code === i18next.language,
      );
      if (localLanguage) setActiveLanguageUUID(localLanguage.id);
    } else {
      showError(t('Shared:failed-to-get-languages'));
      if (onFailed) onFailed();
    }
  }, [onFailed, t, userReducer]);

  useEffect(() => {
    if (state.category_uuid)
      setLocalCategories((items) => {
        if (items.length !== state.category_uuid.length) return state.category_uuid;
        return items;
      });
  }, [state.category_uuid]);

  useEffect(() => {
    setLocalCompanyUUID((item) => (item !== company_uuid ? company_uuid : item));
  }, [company_uuid]);

  useEffect(() => {
    if (userReducer?.results?.user?.is_provider) {
      if (userReducer?.results?.user?.type === 'university')
        onStateChanged({
          id: 'source_type',
          value: ProfileSourcesTypesEnum.University.key,
        });
      if (userReducer?.results?.user?.type === 'agency')
        onStateChanged({
          id: 'source_type',
          value: ProfileSourcesTypesEnum.Agency.key,
        });
      onStateChanged({ id: 'source_uuid', value: userReducer?.results?.user?.uuid });
    }
  }, [userReducer]);

  // useEffect(() => {
  //   candidatePropertyRef.current = state.candidate_property;
  // }, [state.candidate_property]);
  // useEffect(() => {
  //   candidatePropertiesRef.current = candidateProperties;
  // }, [candidateProperties]);

  // useEffect(() => {
  //   const requiredProperties = candidateProperties.filter(
  //     (item) => item.is_required
  //   );
  //   if (requiredProperties.length === 0 || isEditInitRef.current) return;
  //   const localCandidateProperty = candidatePropertyRef.current
  //     ? [...candidatePropertyRef.current]
  //     : [];
  //   let isChanged = false;
  //   requiredProperties.map((item) => {
  //     const propertyIndex = localCandidateProperty.findIndex(
  //       (element) => element.uuid === item.uuid
  //     );
  //     if (
  //       propertyIndex !== -1
  //       && !localCandidateProperty[propertyIndex].isRequired
  //     ) {
  //       localCandidateProperty[propertyIndex].isRequired = true;
  //       isChanged = true;
  //     } else if (propertyIndex === -1) {
  //       isChanged = true;
  //       localCandidateProperty.push({
  //         isRequired: true,
  //         uuid: item.uuid,
  //         value: null,
  //       });
  //     }
  //     return undefined;
  //   });
  //   if (isChanged && !isEditInitRef.current)
  //     setState({ id: 'candidate_property', value: localCandidateProperty });
  // }, [candidateProperties]);

  return (
    <div className="profile-management-component-wrapper view-wrapper">
      <div className="profile-management-body-wrapper">
        <div className="profile-management-section is-left">
          <div className="profile-picture">
            <UploaderComponent
              uploadedFiles={state.profile_pic}
              uploaderPage={UploaderPageEnum.ProfileImage}
              uploadedFileChanged={(newFiles) => onUploadChanged(newFiles)}
              company_uuid={localCompanyUUID}
            />
          </div>
          <div className="section-items-wrapper">
            {sections
              && sections
                .filter((item) => !item.isHidden)
                .map((item) => (
                  <div className="section-item" key={`${item.key}-${item.id}`}>
                    <a href={`#${item.id}`}>
                      <ButtonBase>
                        <span className={item.icon} />
                        <span className="pl-2-reversed">{item.name}</span>
                      </ButtonBase>
                    </a>
                  </div>
                ))}
          </div>
          <div className="social-media-accounts">
            {socialItems
              && socialItems.map((item, index) => (
                <IconButton
                  key={`${index + 1}-${item.label}`}
                  onClick={() => openSocialHandler(item)}
                >
                  <span className={item.icon} />
                </IconButton>
              ))}
          </div>
        </div>
        <div className="profile-management-section is-right">
          <div id="contact-information">
            <ContactInformationSection
              state={state}
              errors={errors}
              isLoading={isLoading}
              isFullWidth={isFullWidthFields}
              isSubmitted={isSubmitted}
              onStateChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              profile_uuid={profile_uuid}
              company_uuid={localCompanyUUID}
              job_uuid={job_uuid}
              componentPermission={componentPermission}
            />
          </div>
          <div id="basic-information">
            <BasicInformationSection
              state={state}
              errors={errors}
              isLoading={isLoading}
              isFullWidth={isFullWidthFields}
              isSubmitted={isSubmitted}
              onStateChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              company_uuid={localCompanyUUID}
            />
          </div>
          <div id="experience">
            <ExperienceSection
              state={state}
              errors={errors}
              isLoading={isLoading}
              isSubmitted={isSubmitted}
              isFullWidth={isFullWidthFields}
              onStateChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              company_uuid={localCompanyUUID}
            />
          </div>
          <div id="education">
            <EducationSection
              state={state}
              errors={errors}
              isLoading={isLoading}
              isSubmitted={isSubmitted}
              isFullWidth={isFullWidthFields}
              onStateChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              company_uuid={localCompanyUUID}
            />
          </div>
          {state.extra && (
            <div id="extra">
              <ExtrasSection
                state={state}
                isSubmitted={isSubmitted}
                isLoading={isLoading}
                errors={errors}
                onStateChanged={onStateChanged}
                parentTranslationPath={parentTranslationPath}
                isEdit
                isFullWidth={isFullWidthFields}
                isHalfWidth={!isFullWidthFields}
                company_uuid={localCompanyUUID}
              />
            </div>
          )}
          {dynamicPropertiesReq?.length > 0 && (
            <div id="dynamic_properties">
              <DynamicPropertiesSection
                state={state}
                requirements={dynamicPropertiesReq}
                isSubmitted={isSubmitted}
                isLoading={isLoading}
                errors={errors}
                onStateChanged={onStateChanged}
                parentTranslationPath={parentTranslationPath}
                isEdit
                isFullWidth={isFullWidthFields}
                isHalfWidth={!isFullWidthFields}
                company_uuid={localCompanyUUID}
              />
            </div>
          )}
          <div id="tags">
            <TagsSection
              state={state}
              isSubmitted={isSubmitted}
              isLoading={isLoading}
              errors={errors}
              onStateChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              isEdit
              isFullWidth={isFullWidthFields}
              isHalfWidth={!isFullWidthFields}
              company_uuid={localCompanyUUID}
            />
          </div>
          <div id="skills">
            <SkillsSection
              state={state}
              isSubmitted={isSubmitted}
              isLoading={isLoading}
              errors={errors}
              onStateChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
            />
          </div>
          <div id="languages">
            <LanguagesSection
              state={state}
              errors={errors}
              isLoading={isLoading}
              isSubmitted={isSubmitted}
              onStateChanged={onStateChanged}
              isFullWidth={isFullWidthFields}
              parentTranslationPath={parentTranslationPath}
              company_uuid={localCompanyUUID}
            />
          </div>
          {state.job_requirement && state.job_requirement.length > 0 && (
            <div id="questionnaire">
              <QuestionnaireSection
                state={state}
                errors={errors}
                isLoading={isLoading}
                isSubmitted={isSubmitted}
                onStateChanged={onStateChanged}
                parentTranslationPath={parentTranslationPath}
                company_uuid={localCompanyUUID}
              />
            </div>
          )}
          {state.sign_up_requirement && state.sign_up_requirement.length > 0 && (
            <div id="signup-requirements">
              <SignupRequirementsSection
                state={state}
                errors={errors}
                isLoading={isLoading}
                isSubmitted={isSubmitted}
                onStateChanged={onStateChanged}
                parentTranslationPath={parentTranslationPath}
                company_uuid={localCompanyUUID}
              />
            </div>
          )}
          <div id="video-cv">
            <VideoCvSection
              state={state}
              errors={errors}
              isLoading={isLoading}
              isSubmitted={isSubmitted}
              onStateChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              company_uuid={localCompanyUUID}
            />
          </div>
        </div>
      </div>
      <div className="submit-profile-wrapper">
        <ButtonBase
          onClick={saveHandler}
          disabled={isLoading}
          className="btns theme-solid"
        >
          {t('save')}
        </ButtonBase>
      </div>
      <DialogComponent
        maxWidth="sm"
        dialogContent={
          <div className="d-flex-column-center">
            {currentSocialItem && (
              <div className="social-media-dialog-wrapper">
                <span className={currentSocialItem.icon} />
                <div className="social-media-dialog-body">
                  <span>
                    {t('add-your')} {t(`${currentSocialItem.label}`)}{' '}
                    {t('social-media-link-here')}
                  </span>
                  <SharedInputControl
                    isFullWidth
                    errors={errors}
                    wrapperClasses="pt-2"
                    isDisabled={isLoading}
                    isSubmitted={isSubmitted}
                    title={currentSocialItem.label}
                    onValueChanged={onStateChanged}
                    placeholder={currentSocialItem.label}
                    stateKey={currentSocialItem.stateKey}
                    errorPath={currentSocialItem.stateKey}
                    parentTranslationPath={parentTranslationPath}
                    editValue={state[`${currentSocialItem.stateKey}`]}
                  />
                </div>
              </div>
            )}
          </div>
        }
        isSaving={isLoading}
        isOpen={isSocialDialogOpen}
        onSubmit={saveSocialHandler}
        onCloseClicked={isSocialDialogOpenChanged}
        onCancelClicked={isSocialDialogOpenChanged}
        parentTranslationPath={parentTranslationPath}
      />
    </div>
  );
};

ProfileManagementComponent.propTypes = {
  candidate_uuid: PropTypes.string,
  job_uuid: PropTypes.string,
  pipeline_uuid: PropTypes.string,
  profile_uuid: PropTypes.string,
  company_uuid: PropTypes.string,
  is_employee: PropTypes.bool,
  initDataProfile: PropTypes.instanceOf(Object),
  componentPermission: PropTypes.instanceOf(Object),
  job_requirement: PropTypes.instanceOf(Array),
  isFullWidthFields: PropTypes.bool,
  feature: PropTypes.oneOf(
    Object.values(ProfileManagementFeaturesEnum).map((item) => item.key),
  ),
  onSave: PropTypes.func.isRequired,
  onFailed: PropTypes.func.isRequired,
  from_feature: PropTypes.number,
};

ProfileManagementComponent.defaultProps = {
  job_uuid: undefined,
  pipeline_uuid: undefined,
  candidate_uuid: undefined,
  profile_uuid: undefined,
  company_uuid: undefined,
  is_employee: false,
  job_requirement: undefined,
  feature: undefined,
  isFullWidthFields: false,
  from_feature: undefined,
};
