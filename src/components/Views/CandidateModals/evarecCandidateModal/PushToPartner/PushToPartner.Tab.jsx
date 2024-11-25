import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  SetupsReducer,
  SetupsReset,
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../../../pages/setups/shared';
import {
  getErrorByName,
  GlobalDateFormat,
  GlobalSavingDateFormat,
  showError,
  showSuccess,
} from '../../../../../helpers';
import * as yup from 'yup';
import i18next from 'i18next';
import {
  alphabetsExpression,
  emailExpression,
  numbersExpression,
  urlExpression,
} from '../../../../../utils';
import DatePickerComponent from '../../../../Datepicker/DatePicker.Component';
import moment from 'moment';
import {
  DynamicFormTypesEnum,
  IntegrationsPartnersEnum,
  // DynamicFormTypesEnum,
  PartnersLookupsEnum,
  PushToPartnerContractPeriodsEnum,
  PushToPartnerContractTypesEnum,
  PushToPartnerGendersEnum,
  PushToPartnerMaritalStatusesEnum,
  PushToPartnerOfferStatusesEnum,
} from '../../../../../enums';
import { ButtonBase } from '@mui/material';
import './PushToPartner.Style.scss';
import {
  GetAllSetupsIntegrationsForPartner,
  GetUpsideLMSDropdowns,
} from '../../../../../services';

const PushToPartnerTab = ({
  partner,
  job_candidate_uuid,
  currentJob,
  candidateDetail,
  parentTranslationPath,
  translationPath,
  isReloadAfterSave,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabledSaving, setIsDisabledSaving] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState([]);
  const [employeeTypesData, setEmployeeTypesData] = useState([]);
  const [genders] = useState(
    Object.values(PushToPartnerGendersEnum).map((item) => ({
      ...item,
      value: t(item.value),
    })),
  );
  const [maritalStatuses] = useState(
    Object.values(PushToPartnerMaritalStatusesEnum).map((item) => ({
      ...item,
      value: t(item.value),
    })),
  );
  const [contractTypes] = useState(
    Object.values(PushToPartnerContractTypesEnum).map((item) => ({
      ...item,
      value: t(item.value),
    })),
  );
  const [contractPeriods] = useState(
    Object.values(PushToPartnerContractPeriodsEnum).map((item) => ({
      ...item,
      value: t(item.value),
    })),
  );
  const [offerStatuses] = useState(
    Object.values(PushToPartnerOfferStatusesEnum).map((item) => ({
      ...item,
      value: t(item.value),
    })),
  );

  const stateInitRef = useRef({
    // organization_slug: 'string',
    isEdit: false,
    job_candidate_uuid,
    code: null,
    full_name_en: null,
    full_name_ar: null,
    department_id: null,
    employment_type_id: null,
    location_id: null,
    outsourcing_company_id: null,
    joining_date: null,
    email: null,
    marital_status: null,
    // identification_info_attributes: {
    document_number: null,
    nationality_id: null,
    // },
    // employee_contracts_attributes: {
    contract_type: null,
    contract_period: null,
    start_date: null,
    end_date: null,
    first_name: null,
    middle_name: null,
    last_name: null,
    gender: null,
    display_name: null,
    work_email: null,
    user_name: null,
    assignment_name: null,
    date_of_birth: null,
    address_line: null,
    postal_code: null,
    national_id: null,
    national_id_country: null,
    national_id_expiration_date: null,
    region: null,
    country: null,
    national_id_type: null,
    business_unit_id: null,
    legal_entity_id: null,
    unique_id: null,
    current_experience: null,
    total_experience: null,
    termination_date: null,
    user_expiry_date: null,
    joining_date_upside_lms: null,
    gender_upside_lms: null,
    status_upside_lms: null,
    password: null,
    alternate_email: null,
    phone: null,
    mobile: null,
    user_language: null,
    grade: null,
    designation: null,
    lms_role: null,
    line_manager: null,
    local_address: null,
    local_pin_no: null,
    address_line1: null,
    address_line2: null,
    pin_no: null,
    city: null,
    org: [],
    // },
  });
  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  /**
   * @param { key, isAccountLevel, isPrimary } - The account level and key
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the key if its exist for the current active partner
   */
  const getKeyItem = useMemo(
    () =>
      ({ key, isAccountLevel = true, isPrimary = false }) =>
        (partner.pushToPartnerKeys
          && partner.pushToPartnerKeys.find(
            (item) =>
              (item.key === key && item.isAccountLevel === isAccountLevel)
              || (isPrimary && isPrimary === item.isPrimary),
          ))
        || {},
    [partner],
  );

  /**
   * @param { key, isAccountLevel, value } - The account level and key
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the key is existing in the current active partner
   */
  const getIsExistKey = useMemo(
    () =>
      ({ key, isAccountLevel, value = null }) =>
        partner.pushToPartnerKeys
        && partner.pushToPartnerKeys.some(
          (item) => item.key === key && item.isAccountLevel === isAccountLevel,
        )
        && (!getKeyItem({ key }).isOnlyVisibleOnEdit || value),
    [partner, getKeyItem],
  );

  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is sent new value for state from child
   */
  const onStateChanged = useCallback((newValue) => {
    setState(newValue);
  }, []);

  /**
   * @param event
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle saving & updating partners' data
   */
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    setIsLoading(true);
    const response = await (
      (state.isEdit && partner.updatePushDataAPI)
      || partner.createPushDataAPI
    )(state);
    setIsLoading(false);
    if (response && (response.status === 200 || response.status === 201)) {
      if (!partner.updatePushDataAPI) setIsDisabledSaving(true);
      if (isReloadAfterSave) getEditInit();
      showSuccess(t(`${translationPath}${partner.key}-data-saved-successfully`));
    } else
      showError(t(`${translationPath}${partner.key}-data-save-failed`), response);
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the selected partner from lookups
   */
  const getActivePushToPartnerEnum = useMemo(
    () =>
      ({ items = [], activeKey }) =>
        items.find((item) => item.key === activeKey) || {},
    [],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the data on edit
   */
  const getEditInit = useCallback(async () => {
    setIsLoading(true);
    const response = await partner.getPushDataAPI({ job_candidate_uuid });
    setIsLoading(false);
    if (response && response.status === 200) {
      const fullName
        = candidateDetail
        && candidateDetail.basic_information
        && `${candidateDetail.basic_information.first_name || ''}${
          (candidateDetail.basic_information.last_name
            && ` ${candidateDetail.basic_information.last_name}`)
          || ''
        }`;
      if (
        !partner.updatePushDataAPI
        && response.data[getKeyItem({ isPrimary: true })?.key || '']
      )
        setIsDisabledSaving(true);
      setState({
        id: 'edit',
        value: {
          job_candidate_uuid,
          isEdit: Boolean(response.data[getKeyItem({ isPrimary: true })?.key || '']),
          ...response.data,
          first_name:
            response.data.first_name
            || candidateDetail?.basic_information?.first_name
            || null,
          last_name:
            response.data.last_name
            || candidateDetail?.basic_information?.last_name
            || null,
          full_name_en: response.data.full_name_en || fullName,
          full_name_ar: response.data.full_name_ar || fullName,
          job_title: response.data.job_title || currentJob?.title || null,
          work_email:
            response.data.work_email
            || candidateDetail?.basic_information?.email
            || null,
          email:
            response.data.email || candidateDetail?.basic_information?.email || null,
          date_of_birth:
            response.data.date_of_birth
            || candidateDetail?.basic_information?.dob
            || null,
          postal_code:
            response.data.postal_code
            || candidateDetail?.basic_information?.zip_code
            || null,
          national_id:
            response.data.national_id
            || candidateDetail?.basic_information?.national_id
            || null,
        },
      });
    } else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [
    candidateDetail,
    partner,
    job_candidate_uuid,
    t,
    getKeyItem,
    currentJob?.title,
  ]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get is without sourcing for the current selected employee type
   */
  const getIsWithOutsourcingCompany = useMemo(
    () => (currentEmployeeType) =>
      employeeTypesData.some(
        (item) =>
          item.uuid === currentEmployeeType && item.is_with_outsourcing_company,
      ),
    [employeeTypesData],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get form errors
   */
  const getErrors = useCallback(async () => {
    const result = await getErrorByName(
      {
        current: yup.object().shape({
          status: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'status',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'status' }).isDisabled,
            ),
          first_name: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'first_name',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'first_name' }).isDisabled,
            ),
          middle_name: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'middle_name',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'middle_name' }).isDisabled,
            ),
          last_name: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'last_name',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'last_name' }).isDisabled,
            ),
          display_name: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'display_name',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'display_name' }).isDisabled,
            ),
          link: yup
            .string()
            .nullable()
            .matches(urlExpression, {
              message: t('Shared:invalid-url'),
              excludeEmptyString: true,
            })
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'link',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'link' }).isDisabled,
            ),
          start_date: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'start_date',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'start_date' }).isDisabled,
            ),
          code: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'code',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'code' }).isDisabled,
            ),
          full_name_en: yup
            .string()
            .nullable()
            .test(
              'isAtLeastTwoSections',
              `${t('Shared:this-field-must-be-more-than-or-equal')} ${2} ${t(
                'Shared:parts',
              )}`,
              (value) => !value || value.trim().indexOf(' ') !== -1,
            )
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'full_name_en',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'full_name_en' }).isDisabled,
            )
            .matches(alphabetsExpression, {
              message: t('Shared:this-field-must-be-only-characters'),
              excludeEmptyString: true,
            }),
          full_name_ar: yup
            .string()
            .nullable()
            .test(
              'isAtLeastTwoSections',
              `${t('Shared:this-field-must-be-more-than-or-equal')} ${2} ${t(
                'Shared:parts',
              )}`,
              (value) => !value || value.trim().indexOf(' ') !== -1,
            )
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'full_name_ar',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'full_name_ar' }).isDisabled,
            )
            .matches(alphabetsExpression, {
              message: t('Shared:this-field-must-be-only-characters'),
              excludeEmptyString: true,
            }),
          department_id: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'department_id',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'department_id' }).isDisabled,
            ),
          employment_type_id: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'employment_type_id',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'employment_type_id' }).isDisabled,
            ),
          location_id: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'location_id',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'location_id' }).isDisabled,
            ),
          joining_date: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'joining_date',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'joining_date' }).isDisabled,
            ),
          address_line: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'address_line',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'address_line' }).isDisabled,
            ),
          region: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'region',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'region' }).isDisabled,
            ),
          postal_code: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'postal_code',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'postal_code' }).isDisabled,
            ),
          national_id: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'national_id',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'national_id' }).isDisabled,
            ),
          national_id_country: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'national_id_country',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'national_id_country' }).isDisabled,
            ),
          national_id_expiration_date: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'national_id_expiration_date',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'national_id_expiration_date' }).isDisabled,
            ),
          outsourcing_company_id: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value, { parent }) =>
                value
                || !getIsWithOutsourcingCompany(parent.employment_type_id)
                || !getIsExistKey({
                  key: 'outsourcing_company_id',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'outsourcing_company_id' }).isDisabled,
            ),
          // .when('employment_type_id', (value, field)=> {
          //   value && value ===
          // })
          // .required(t('Shared:this-field-is-required')),
          email: yup
            .string()
            .nullable()
            .matches(emailExpression, {
              message: t('Shared:invalid-email'),
              excludeEmptyString: true,
            })
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'email',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'email' }).isDisabled,
            ),
          work_email: yup
            .string()
            .nullable()
            .matches(emailExpression, {
              message: t('Shared:invalid-email'),
              excludeEmptyString: true,
            })
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'work_email',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'work_email' }).isDisabled,
            ),
          gender: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'gender',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'gender' }).isDisabled,
            ),
          user_name: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'user_name',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'user_name' }).isDisabled,
            ),
          date_of_birth: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'date_of_birth',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'date_of_birth' }).isDisabled,
            ),
          assignment_name: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'assignment_name',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'assignment_name' }).isDisabled,
            ),
          marital_status: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'marital_status',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'marital_status' }).isDisabled,
            ),
          // identification_info_attributes: yup.object().shape({
          document_number: yup
            .string()
            .nullable()
            .min(
              10,
              `${t('Shared:this-field-must-be-more-than-or-equal')} ${10} ${t(
                'Shared:characters',
              )}`,
            )
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'document_number',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'document_number' }).isDisabled,
            ),
          nationality_id: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'nationality_id',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'nationality_id' }).isDisabled,
            ),
          // }),
          // employee_contracts_attributes:
          //   yup
          // .array()
          // .of(
          // yup.object().shape({
          contract_type: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'contract_type',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'contract_type' }).isDisabled,
            ),
          contract_period: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value, { parent }) =>
                value
                || !getIsExistKey({
                  key: 'contract_period',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'contract_period' }).isDisabled
                || getActivePushToPartnerEnum({
                  items: contractTypes,
                  activeKey: parent.contract_type,
                }).is_without_contract_period,
            ),
          end_date: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value, { parent }) =>
                value
                || !getIsExistKey({
                  key: 'end_date',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'end_date' }).isDisabled
                || getActivePushToPartnerEnum({
                  items: contractTypes,
                  activeKey: parent.contract_type,
                }).is_without_contract_period,
            ),
          country: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'country',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'country' }).isDisabled
                || !getKeyItem({ key: 'country' }).isRequired,
            ),
          national_id_type: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'national_id_type',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'national_id_type' }).isDisabled,
            ),
          business_unit_id: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'business_unit_id',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'business_unit_id' }).isDisabled,
            ),
          legal_entity_id: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'legal_entity_id',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'legal_entity_id' }).isDisabled,
            ),
          unique_id: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'unique_id',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'unique_id' }).isDisabled,
            ),
          current_experience: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'current_experience',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'current_experience' }).isDisabled,
            ),
          total_experience: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'total_experience',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'total_experience' }).isDisabled,
            ),
          termination_date: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'termination_date',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'termination_date' }).isDisabled,
            ),
          user_expiry_date: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'user_expiry_date',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'user_expiry_date' }).isDisabled,
            ),
          joining_date_upside_lms: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'joining_date_upside_lms',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'joining_date_upside_lms' }).isDisabled,
            ),
          gender_upside_lms: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'gender_upside_lms',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'gender_upside_lms' }).isDisabled,
            ),
          status_upside_lms: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'status_upside_lms',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'status_upside_lms' }).isDisabled,
            ),
          password: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'password',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'password' }).isDisabled,
            ),
          alternate_email: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'alternate_email',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'alternate_email' }).isDisabled,
            ),

          phone: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'phone',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'phone' }).isDisabled,
            ),
          mobile: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'mobile',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'mobile' }).isDisabled,
            ),
          user_language: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'user_language',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'user_language' }).isDisabled,
            ),
          grade: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'grade',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'grade' }).isDisabled,
            ),
          designation: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'designation',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'designation' }).isDisabled,
            ),
          lms_role: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'lms_role',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'lms_role' }).isDisabled,
            ),
          local_address: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'local_address',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'local_address' }).isDisabled,
            ),
          local_pin_no: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'local_pin_no',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'local_pin_no' }).isDisabled,
            ),
          address_line1: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'address_line1',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'address_line1' }).isDisabled,
            ),
          address_line2: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'address_line2',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'address_line2' }).isDisabled,
            ),
          pin_no: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'pin_no',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'pin_no' }).isDisabled,
            ),
          city: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'city',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'city' }).isDisabled,
            ),
          line_manager: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'line_manager',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'line_manager' }).isDisabled,
            ),
          org: yup
            .mixed()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value?.length > 0
                || !getIsExistKey({
                  key: 'org',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'org' }).isDisabled,
            ),
        }),
      },
      state,
    );
    setErrors(result);
  }, [
    getIsExistKey,
    getKeyItem,
    contractTypes,
    getActivePushToPartnerEnum,
    getIsWithOutsourcingCompany,
    state,
    t,
  ]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get employee types data on initialization or data change
   */
  const getEmployeeTypeData = useMemo(
    () => (returnedData) => {
      setEmployeeTypesData(returnedData);
    },
    [],
  );

  // this to call error's updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  useEffect(() => {
    getEditInit();
  }, [getEditInit]);

  return (
    <div className="push-to-partner-tab-wrapper tab-wrapper">
      {/*{isLoading && <Loader width="730px" height="49vh" speed={1} color="primary" />}*/}
      <div className="push-to-partner-card-wrapper">
        <div className="push-to-partner-card-body">
          {getIsExistKey({
            key: 'status',
            isAccountLevel: true,
          }) && (
            <SharedAutocompleteControl
              isFullWidth
              initValuesKey="key"
              isDisabled={isLoading || isDisabledSaving}
              initValues={offerStatuses}
              errors={errors}
              isSubmitted={isSubmitted}
              onValueChanged={onStateChanged}
              title="offer-status"
              errorPath="status"
              stateKey="status"
              editValue={state.status}
              placeholder="select-offer-status"
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {getIsExistKey({
            key: 'unique_id',
            isAccountLevel: true,
          }) && (
            <SharedInputControl
              isFullWidth
              title="unique-id"
              editValue={state.unique_id}
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errors={errors}
              errorPath="unique_id"
              stateKey="unique_id"
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}

          {getIsExistKey({
            key: 'status_upside_lms',
            isAccountLevel: true,
          }) && (
            <SharedAPIAutocompleteControl
              isFullWidth
              initValuesKey="key"
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errors={errors}
              onValueChanged={onStateChanged}
              title="status"
              errorPath="status_upside_lms"
              stateKey="status_upside_lms"
              editValue={state.status_upside_lms}
              placeholder="select-status"
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              extraProps={{
                slug: 'status',
              }}
              uniqueKey="status"
              getDisabledOptions={(option) =>
                !state.isEdit && option.status === 'Inactive'
              }
              getOptionLabel={(option) => option.status || 'N/A'}
              getDataAPI={GetUpsideLMSDropdowns}
            />
          )}
          {getIsExistKey({
            key: 'first_name',
            isAccountLevel: true,
          }) && (
            <SharedInputControl
              isFullWidth
              title="first-name"
              editValue={state.first_name}
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errors={errors}
              errorPath="first_name"
              stateKey="first_name"
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {getIsExistKey({
            key: 'middle_name',
            isAccountLevel: true,
          }) && (
            <SharedInputControl
              isFullWidth
              title="middle-name"
              editValue={state.middle_name}
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errors={errors}
              errorPath="middle_name"
              stateKey="middle_name"
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {getIsExistKey({
            key: 'last_name',
            isAccountLevel: true,
          }) && (
            <SharedInputControl
              isFullWidth
              title="last-name"
              editValue={state.last_name}
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errors={errors}
              errorPath="last_name"
              stateKey="last_name"
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {getIsExistKey({
            key: 'display_name',
            isAccountLevel: true,
          }) && (
            <SharedInputControl
              isFullWidth
              title="display-name"
              editValue={state.display_name}
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errors={errors}
              errorPath="display_name"
              stateKey="display_name"
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {getIsExistKey({
            key: 'user_name',
            isAccountLevel: true,
          }) && (
            <SharedInputControl
              isFullWidth
              title="user-name"
              editValue={state.user_name}
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errors={errors}
              errorPath="user_name"
              stateKey="user_name"
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {getIsExistKey({
            key: 'assignment_name',
            isAccountLevel: true,
          }) && (
            <SharedInputControl
              isFullWidth
              title="assignment-name"
              editValue={state.assignment_name}
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errors={errors}
              errorPath="assignment_name"
              stateKey="assignment_name"
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {getIsExistKey({
            key: 'link',
            isAccountLevel: true,
          }) && (
            <SharedInputControl
              isFullWidth
              title="link"
              editValue={state.link}
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errors={errors}
              errorPath="link"
              stateKey="link"
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {getIsExistKey({
            key: 'job_title',
            isAccountLevel: true,
          }) && (
            <SharedInputControl
              isFullWidth
              title="job-title"
              editValue={state.job_title}
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errors={errors}
              errorPath="job_title"
              stateKey="job_title"
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {getIsExistKey({
            key: 'code',
            isAccountLevel: true,
          }) && (
            <SharedInputControl
              isFullWidth
              title="code"
              editValue={state.code}
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errors={errors}
              errorPath="code"
              stateKey="code"
              floatNumbers={0}
              pattern={numbersExpression}
              // pattern={numericAndAlphabeticalAndSpecialExpression}
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {getIsExistKey({
            key: 'full_name_en',
            isAccountLevel: true,
          }) && (
            <SharedInputControl
              isFullWidth
              title="full-name-en"
              editValue={state.full_name_en}
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errors={errors}
              errorPath="full_name_en"
              stateKey="full_name_en"
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {getIsExistKey({
            key: 'full_name_ar',
            isAccountLevel: true,
          }) && (
            <SharedInputControl
              isFullWidth
              title="full-name-ar"
              editValue={state.full_name_ar}
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errors={errors}
              errorPath="full_name_ar"
              stateKey="full_name_ar"
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {getIsExistKey({
            key: 'email',
            isAccountLevel: true,
          }) && (
            <SharedInputControl
              isFullWidth
              title="email"
              editValue={state.email}
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errors={errors}
              errorPath="email"
              stateKey="email"
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}

          {getIsExistKey({
            key: 'alternate_email',
            isAccountLevel: true,
          }) && (
            <SharedInputControl
              isFullWidth
              title="alternate-email"
              editValue={state.alternate_email}
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errors={errors}
              errorPath="alternate_email"
              stateKey="alternate_email"
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}

          {getIsExistKey({
            key: 'password',
            isAccountLevel: true,
          }) && (
            <SharedInputControl
              isFullWidth
              title="password"
              editValue={state.password}
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errors={errors}
              errorPath="password"
              stateKey="password"
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {getIsExistKey({
            key: 'work_email',
            isAccountLevel: true,
          }) && (
            <SharedInputControl
              isFullWidth
              title="work-email"
              editValue={state.work_email}
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errors={errors}
              errorPath="work_email"
              stateKey="work_email"
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}

          {getIsExistKey({
            key: 'phone',
            isAccountLevel: true,
          }) && (
            <SharedInputControl
              isFullWidth
              title="phone"
              editValue={state.phone}
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errors={errors}
              errorPath="phone"
              stateKey="phone"
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {getIsExistKey({
            key: 'mobile',
            isAccountLevel: true,
          }) && (
            <SharedInputControl
              isFullWidth
              title="mobile"
              editValue={state.mobile}
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errors={errors}
              errorPath="mobile"
              stateKey="mobile"
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {getIsExistKey({
            key: 'date_of_birth',
            isAccountLevel: true,
          }) && (
            <DatePickerComponent
              isFullWidth
              stateKey="date_of_birth"
              label="date-of-birth"
              inputPlaceholder={`${t('Shared:eg')} ${moment()
                .locale(i18next.language)
                .format(GlobalDateFormat)}`}
              errors={errors}
              errorPath="date_of_birth"
              key={state.date_of_birth || undefined}
              idRef="dateOfBirthRef"
              value={state.date_of_birth || ''}
              isSubmitted={isSubmitted}
              isDisabled={isLoading || isDisabledSaving}
              disableMaskedInput
              displayFormat={GlobalDateFormat}
              maxDate={moment().toDate()}
              onDelayedChange={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}

          {getIsExistKey({
            key: 'current_experience',
            isAccountLevel: true,
          }) && (
            <SharedInputControl
              isFullWidth
              title="current-experience"
              editValue={state.current_experience}
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errors={errors}
              errorPath="current_experience"
              stateKey="current_experience"
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {getIsExistKey({
            key: 'total_experience',
            isAccountLevel: true,
          }) && (
            <SharedInputControl
              isFullWidth
              title="total-experience"
              editValue={state.total_experience}
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errors={errors}
              errorPath="total_experience"
              stateKey="total_experience"
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}

          {getIsExistKey({
            key: 'org',
            isAccountLevel: true,
          }) && (
            <SharedAPIAutocompleteControl
              isFullWidth
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errors={errors}
              onValueChanged={onStateChanged}
              title="organization"
              errorPath="org"
              stateKey="org"
              editValue={state.org}
              placeholder="select-organization"
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              type={DynamicFormTypesEnum.array.key}
              extraProps={{
                slug: 'org',
              }}
              uniqueKey="key"
              titleKey={'name'}
              // getOptionLabel={(option) => option.name || 'N/A'}
              getDataAPI={GetUpsideLMSDropdowns}
            />
          )}

          {getIsExistKey({
            key: 'legal_entity_id',
            isAccountLevel: true,
          }) && (
            <SharedAPIAutocompleteControl
              isFullWidth
              title="legal-entity-id"
              editValue={state.legal_entity_id}
              idRef="legalEntityAutocompleteRef"
              errors={errors}
              titleKey="name"
              searchKey="search"
              stateKey="legal_entity_id"
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errorPath="legal_entity_id"
              placeholder="select-legal-entity-id"
              getDataAPI={GetAllSetupsIntegrationsForPartner}
              onValueChanged={onStateChanged}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              extraProps={{
                lookup: PartnersLookupsEnum.LegalEntityID.key,
                ...(state.business_unit_id && {
                  with_than: [state.business_unit_id],
                }),
              }}
            />
          )}
          {getIsExistKey({
            key: 'business_unit_id',
            isAccountLevel: true,
          }) && (
            <SharedAPIAutocompleteControl
              isFullWidth
              title="business-unit-id"
              editValue={state.business_unit_id}
              idRef="businessUnitAutocompleteRef"
              titleKey="name"
              errors={errors}
              searchKey="search"
              stateKey="business_unit_id"
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errorPath="business_unit_id"
              placeholder="select-business-unit-id"
              getDataAPI={GetAllSetupsIntegrationsForPartner}
              onValueChanged={onStateChanged}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              extraProps={{
                lookup: PartnersLookupsEnum.BusinessUnitID.key,
                ...(state.business_unit_id && {
                  with_than: [state.business_unit_id],
                }),
              }}
            />
          )}
          {getIsExistKey({
            key: 'nationality',
            isAccountLevel: true,
          }) && (
            <SharedAPIAutocompleteControl
              isFullWidth
              title="nationality"
              editValue={state.nationality}
              idRef="nationalityAutocompleteRef"
              getOptionLabel={(option) =>
                (option.name
                  && (option.name[i18next.language] || option.name.en || 'N/A'))
                || 'N/A'
              }
              errors={errors}
              searchKey="search"
              stateKey="nationality"
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errorPath="nationality"
              placeholder="select-nationality"
              getDataAPI={GetAllSetupsIntegrationsForPartner}
              onValueChanged={onStateChanged}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              // type={DynamicFormTypesEnum.array.key}
              extraProps={{
                lookup: PartnersLookupsEnum.DeelCountries.key,
                ...(state.nationality && { with_than: [state.nationality] }),
              }}
            />
          )}
          {getIsExistKey({
            key: 'country',
            isAccountLevel: true,
          })
            && partner.key === IntegrationsPartnersEnum.Deel.key && (
            <SharedAPIAutocompleteControl
              isFullWidth
              title="country"
              editValue={state.country}
              idRef="countryAutocompleteRef"
              getOptionLabel={(option) =>
                (option.name
                    && (option.name[i18next.language] || option.name.en || 'N/A'))
                  || 'N/A'
              }
              errors={errors}
              searchKey="search"
              stateKey="country"
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errorPath="country"
              placeholder="select-country"
              getDataAPI={GetAllSetupsIntegrationsForPartner}
              onValueChanged={onStateChanged}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              extraProps={{
                lookup: PartnersLookupsEnum.DeelCountries.key,
                ...(state.country && { with_than: [state.country] }),
              }}
            />
          )}
          {getIsExistKey({
            key: 'country',
            isAccountLevel: true,
          })
            && partner.key === IntegrationsPartnersEnum.Oracle.key && (
            <SharedAPIAutocompleteControl
              isFullWidth
              idRef="countryOracleAutocompleteRef"
              title="country"
              searchKey="search"
              editValue={state.country}
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errors={errors}
              errorPath="country"
              stateKey="country"
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              extraProps={{
                lookup: PartnersLookupsEnum.OracleHCMCountries.key,
                limit: 10,
                ...(state.country && { with_than: [state.country] }),
              }}
              getOptionLabel={(option) => option?.country_name || 'N/A'}
              getDataAPI={GetAllSetupsIntegrationsForPartner}
            />
          )}
          {getIsExistKey({
            key: 'region',
            isAccountLevel: true,
          }) && (
            <SharedInputControl
              isFullWidth
              title="region"
              editValue={state.region}
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errors={errors}
              errorPath="region"
              stateKey="region"
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {getIsExistKey({
            key: 'address_line',
            isAccountLevel: true,
          }) && (
            <SharedInputControl
              isFullWidth
              title="address-line"
              editValue={state.address_line}
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errors={errors}
              errorPath="address_line"
              stateKey="address_line"
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {getIsExistKey({
            key: 'postal_code',
            isAccountLevel: true,
          }) && (
            <SharedInputControl
              isFullWidth
              title="postal-code"
              editValue={state.postal_code}
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errors={errors}
              errorPath="postal_code"
              stateKey="postal_code"
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {getIsExistKey({
            key: 'national_id',
            isAccountLevel: true,
          }) && (
            <SharedInputControl
              isFullWidth
              title="national-id"
              editValue={state.national_id}
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errors={errors}
              errorPath="national_id"
              stateKey="national_id"
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {getIsExistKey({
            key: 'national_id_type',
            isAccountLevel: true,
          }) && (
            <SharedAPIAutocompleteControl
              isFullWidth
              title="national-id-type"
              editValue={state.national_id_type}
              idRef="nationalIDTypeAutocompleteRef"
              titleKey="name"
              getOptionLabel={(option) => option.lookup_code}
              renderOption={(renderProps, option) => (
                <li {...renderProps}>
                  <span className="px-1">
                    <span className="d-flex-v-center">
                      <span className="header-text">{option.lookup_code}</span>
                    </span>
                    <span className="c-gray-primary">{option.meaning}</span>
                  </span>
                </li>
              )}
              errors={errors}
              searchKey="search"
              stateKey="national_id_type"
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errorPath="national_id_type"
              placeholder="select-national-id-type"
              getDataAPI={GetAllSetupsIntegrationsForPartner}
              onValueChanged={onStateChanged}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              extraProps={{
                lookup: PartnersLookupsEnum.NationalIDType.key,
                ...(state.national_id_type && {
                  with_than: [state.national_id_type],
                }),
              }}
            />
          )}
          {getIsExistKey({
            key: 'national_id_country',
            isAccountLevel: true,
          }) && (
            <SharedAPIAutocompleteControl
              isFullWidth
              title="national-id-country"
              editValue={state.national_id_country}
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errors={errors}
              idRef="nationalIDCountryOracleAutocompleteRef"
              searchKey="search"
              errorPath="national_id_country"
              stateKey="national_id_country"
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              extraProps={{
                lookup: PartnersLookupsEnum.OracleHCMCountries.key,
                ...(state.national_id_country && {
                  with_than: [state.national_id_country],
                }),
              }}
              getOptionLabel={(option) => option?.country_name || 'N/A'}
              getDataAPI={GetAllSetupsIntegrationsForPartner}
            />
          )}
          {getIsExistKey({
            key: 'national_id_expiration_date',
            isAccountLevel: true,
          }) && (
            <DatePickerComponent
              isFullWidth
              stateKey="national_id_expiration_date"
              label="national-id-expiration-date"
              inputPlaceholder={`${t('Shared:eg')} ${moment()
                .locale(i18next.language)
                .format(GlobalDateFormat)}`}
              errors={errors}
              errorPath="national_id_expiration_date"
              key={state.national_id_expiration_date || undefined}
              idRef="nationalIDExpirationRef"
              value={state.national_id_expiration_date || ''}
              isSubmitted={isSubmitted}
              isDisabled={isLoading || isDisabledSaving}
              disableMaskedInput
              displayFormat={GlobalDateFormat}
              onDelayedChange={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}

          {getIsExistKey({
            key: 'city',
            isAccountLevel: true,
          }) && (
            <SharedInputControl
              isFullWidth
              title="city"
              editValue={state.city}
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errors={errors}
              errorPath="city"
              stateKey="city"
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}

          {getIsExistKey({
            key: 'state',
            isAccountLevel: true,
          }) && (
            <SharedInputControl
              isFullWidth
              title="state"
              editValue={state.state}
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errors={errors}
              errorPath="state"
              stateKey="state"
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}

          {getIsExistKey({
            key: 'gender',
            isAccountLevel: true,
          }) && (
            <SharedAutocompleteControl
              isFullWidth
              initValuesKey="key"
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              initValues={genders}
              errors={errors}
              onValueChanged={onStateChanged}
              title="gender"
              errorPath="gender"
              stateKey="gender"
              editValue={state.gender}
              placeholder="select-gender"
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {getIsExistKey({
            key: 'user_language',
            isAccountLevel: true,
          }) && (
            <SharedAPIAutocompleteControl
              isFullWidth
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errors={errors}
              onValueChanged={onStateChanged}
              title="user-language"
              errorPath="user_language"
              stateKey="user_language"
              editValue={state.user_language}
              placeholder="select-language"
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              extraProps={{
                slug: 'language',
              }}
              uniqueKey="language"
              getOptionLabel={(option) => option.language || 'N/A'}
              getDataAPI={GetUpsideLMSDropdowns}
            />
          )}
          {getIsExistKey({
            key: 'grade',
            isAccountLevel: true,
          }) && (
            <SharedAPIAutocompleteControl
              isFullWidth
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errors={errors}
              onValueChanged={onStateChanged}
              title="grade"
              errorPath="grade"
              stateKey="grade"
              editValue={state.grade}
              placeholder="select-grade"
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              extraProps={{
                slug: 'grade',
              }}
              uniqueKey="grade"
              getOptionLabel={(option) => option.grade || 'N/A'}
              getDataAPI={GetUpsideLMSDropdowns}
            />
          )}
          {getIsExistKey({
            key: 'designation',
            isAccountLevel: true,
          }) && (
            <SharedAPIAutocompleteControl
              isFullWidth
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errors={errors}
              onValueChanged={onStateChanged}
              title="designation"
              errorPath="designation"
              stateKey="designation"
              editValue={state.designation}
              placeholder="select-designation"
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              extraProps={{
                slug: 'designation',
              }}
              uniqueKey="designation"
              getOptionLabel={(option) => option.designation || 'N/A'}
              getDataAPI={GetUpsideLMSDropdowns}
            />
          )}
          {getIsExistKey({
            key: 'role',
            isAccountLevel: true,
          }) && (
            <SharedAPIAutocompleteControl
              isFullWidth
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errors={errors}
              onValueChanged={onStateChanged}
              title="role"
              errorPath="role"
              stateKey="role"
              editValue={state.role}
              placeholder="select-role"
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              type={DynamicFormTypesEnum.array.key}
              extraProps={{
                slug: 'role',
              }}
              uniqueKey="role"
              getOptionLabel={(option) => option.role || 'N/A'}
              getDataAPI={GetUpsideLMSDropdowns}
            />
          )}
          {getIsExistKey({
            key: 'lms_role',
            isAccountLevel: true,
          }) && (
            <SharedAPIAutocompleteControl
              isFullWidth
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errors={errors}
              onValueChanged={onStateChanged}
              title="lms-role"
              errorPath="lms_role"
              stateKey="lms_role"
              editValue={state.lms_role}
              placeholder="select-lms-role"
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              d
              extraProps={{
                slug: 'lmsrole',
              }}
              uniqueKey="key"
              getOptionLabel={(option) => option.name || 'N/A'}
              getDataAPI={GetUpsideLMSDropdowns}
            />
          )}
          {getIsExistKey({
            key: 'line_manager',
            isAccountLevel: true,
          }) && (
            <SharedInputControl
              isFullWidth
              title="line-manager"
              editValue={state.line_manager}
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errors={errors}
              errorPath="line_manager"
              stateKey="line_manager"
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}

          {getIsExistKey({
            key: 'indirect_line_manager',
            isAccountLevel: true,
          }) && (
            <SharedAutocompleteControl
              isFullWidth
              isFreeSolo
              type={DynamicFormTypesEnum.array.key}
              title="indirect-line-manager"
              editValue={state.indirect_line_manager || []}
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errors={errors}
              errorPath="indirect_line_manager"
              stateKey="indirect_line_manager"
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {getIsExistKey({
            key: 'learning_group',
            isAccountLevel: true,
          }) && (
            <SharedAutocompleteControl
              isFullWidth
              isFreeSolo
              type={DynamicFormTypesEnum.array.key}
              title="learning-group"
              editValue={state.learning_group || []}
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errors={errors}
              errorPath="learning_group"
              stateKey="learning_group"
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {getIsExistKey({
            key: 'gender_upside_lms',
            isAccountLevel: true,
          }) && (
            <SharedAPIAutocompleteControl
              isFullWidth
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errors={errors}
              onValueChanged={onStateChanged}
              title="gender"
              errorPath="gender_upside_lms"
              stateKey="gender_upside_lms"
              editValue={state.gender_upside_lms}
              placeholder="select-gender"
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              extraProps={{
                slug: 'gender',
              }}
              uniqueKey="gender"
              getOptionLabel={(option) => option.gender || 'N/A'}
              getDataAPI={GetUpsideLMSDropdowns}
            />
          )}
          {getIsExistKey({
            key: 'joining_date_upside_lms',
            isAccountLevel: true,
          }) && (
            <DatePickerComponent
              isFullWidth
              stateKey="joining_date_upside_lms"
              label="joining-date"
              inputPlaceholder={`${t('Shared:eg')} ${moment()
                .locale(i18next.language)
                .format(GlobalDateFormat)}`}
              errors={errors}
              errorPath="joining_date_upside_lms"
              key={state.joining_date_upside_lms || undefined}
              idRef="joiningUpsideDateRef"
              value={state.joining_date_upside_lms || ''}
              isSubmitted={isSubmitted}
              isDisabled={isLoading || isDisabledSaving}
              disableMaskedInput
              displayFormat={GlobalDateFormat}
              onDelayedChange={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {getIsExistKey({
            key: 'document_number',
            isAccountLevel: true,
          }) && (
            <SharedInputControl
              isFullWidth
              title="document-number"
              editValue={state.document_number}
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errors={errors}
              errorPath="document_number"
              stateKey="document_number"
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {getIsExistKey({
            key: 'marital_status',
            isAccountLevel: true,
          }) && (
            <SharedAutocompleteControl
              isFullWidth
              initValuesKey="key"
              isDisabled={isLoading || isDisabledSaving}
              initValues={maritalStatuses}
              errors={errors}
              isSubmitted={isSubmitted}
              onValueChanged={onStateChanged}
              title="marital-status"
              errorPath="marital_status"
              stateKey="marital_status"
              editValue={state.marital_status}
              placeholder="select-marital-status"
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {getIsExistKey({
            key: 'department_id',
            isAccountLevel: true,
          }) && (
            <SharedAPIAutocompleteControl
              isFullWidth
              title="department"
              editValue={state.department_id}
              idRef="departmentAutocompleteRef"
              getOptionLabel={(option) =>
                (option.name
                  && (option.name[i18next.language] || option.name.en || 'N/A'))
                || 'N/A'
              }
              errors={errors}
              searchKey="search"
              stateKey="department_id"
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errorPath="department_id"
              placeholder="select-department"
              getDataAPI={GetAllSetupsIntegrationsForPartner}
              onValueChanged={onStateChanged}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              extraProps={{
                lookup: PartnersLookupsEnum.Departments.key,
                ...(state.department_id && { with_than: [state.department_id] }),
              }}
            />
          )}

          {getIsExistKey({
            key: 'location_id',
            isAccountLevel: true,
          }) && (
            <SharedAPIAutocompleteControl
              isFullWidth
              title="location"
              editValue={state.location_id}
              idRef="locationAutocompleteRef"
              getOptionLabel={(option) =>
                (option.name
                  && (option.name[i18next.language] || option.name.en || 'N/A'))
                || 'N/A'
              }
              errors={errors}
              searchKey="search"
              stateKey="location_id"
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errorPath="location_id"
              placeholder="select-location"
              getDataAPI={GetAllSetupsIntegrationsForPartner}
              onValueChanged={onStateChanged}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              extraProps={{
                lookup: PartnersLookupsEnum.Locations.key,
                ...(state.location_id && { with_than: [state.location_id] }),
              }}
            />
          )}
          {getIsExistKey({
            key: 'nationality_id',
            isAccountLevel: true,
          }) && (
            <SharedAPIAutocompleteControl
              isFullWidth
              title="nationality"
              editValue={state.nationality_id}
              idRef="nationalityIdAutocompleteRef"
              getOptionLabel={(option) =>
                (option.name
                  && (option.name[i18next.language] || option.name.en || 'N/A'))
                || 'N/A'
              }
              errors={errors}
              searchKey="search"
              stateKey="nationality_id"
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errorPath="nationality_id"
              placeholder="select-nationality"
              getDataAPI={GetAllSetupsIntegrationsForPartner}
              onValueChanged={onStateChanged}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              // type={DynamicFormTypesEnum.array.key}
              extraProps={{
                lookup: PartnersLookupsEnum.Nationality.key,
                ...(state.nationality_id && { with_than: [state.nationality_id] }),
              }}
            />
          )}
          {getIsExistKey({
            key: 'employment_type_id',
            isAccountLevel: true,
          }) && (
            <SharedAPIAutocompleteControl
              isFullWidth
              title="employment-type"
              editValue={state.employment_type_id}
              idRef="employmentTypeAutocompleteRef"
              getOptionLabel={(option) =>
                (option.name
                  && (option.name[i18next.language] || option.name.en || 'N/A'))
                || 'N/A'
              }
              errors={errors}
              searchKey="search"
              stateKey="employment_type_id"
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errorPath="employment_type_id"
              placeholder="select-employment-type"
              getDataAPI={GetAllSetupsIntegrationsForPartner}
              getReturnedData={getEmployeeTypeData}
              onValueChanged={onStateChanged}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              extraProps={{
                lookup: PartnersLookupsEnum.JobTypes.key,
                ...(state.employment_type_id && {
                  with_than: [state.employment_type_id],
                }),
              }}
            />
          )}
          {getIsExistKey({
            key: 'outsourcing_company_id',
            isAccountLevel: true,
          }) && (
            <SharedAPIAutocompleteControl
              isFullWidth
              title="outsourcing-company"
              editValue={state.outsourcing_company_id}
              idRef="outsourcingCompanyAutocompleteRef"
              getOptionLabel={(option) =>
                (option.name
                  && (option.name[i18next.language] || option.name.en || 'N/A'))
                || 'N/A'
              }
              errors={errors}
              searchKey="search"
              stateKey="outsourcing_company_id"
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errorPath="outsourcing_company_id"
              placeholder="select-outsourcing-company"
              getDataAPI={GetAllSetupsIntegrationsForPartner}
              onValueChanged={onStateChanged}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              extraProps={{
                lookup: PartnersLookupsEnum.OutsourcingCompanies.key,
                ...(state.outsourcing_company_id && {
                  with_than: [state.outsourcing_company_id],
                }),
              }}
            />
          )}
          <div className="separator-h mb-3" />
          {getIsExistKey({
            key: 'contract_type',
            isAccountLevel: true,
          }) && (
            <SharedAutocompleteControl
              isFullWidth
              initValuesKey="key"
              isDisabled={isLoading || isDisabledSaving}
              initValues={contractTypes}
              errors={errors}
              isSubmitted={isSubmitted}
              onValueChanged={onStateChanged}
              title="contract-type"
              errorPath="contract_type"
              // parentId="employee_contracts_attributes"
              stateKey="contract_type"
              editValue={state.contract_type}
              placeholder="select-contract-type"
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {getIsExistKey({
            key: 'contract_period',
            isAccountLevel: true,
          })
            && !getActivePushToPartnerEnum({
              items: contractTypes,
              activeKey: state.contract_type,
            }).is_without_contract_period && (
            <SharedAutocompleteControl
              isFullWidth
              initValuesKey="key"
              isDisabled={isLoading || isDisabledSaving}
              initValues={contractPeriods}
              errors={errors}
              isSubmitted={isSubmitted}
              onValueChanged={(newValue) => {
                if (state.joining_date && newValue.value) {
                  const numberOfYears = getActivePushToPartnerEnum({
                    items: contractPeriods,
                    activeKey: newValue.value,
                  }).fixedEndDateYears;
                  if (numberOfYears)
                    setState({
                      id: 'end_date',
                      value: moment(state.joining_date, GlobalSavingDateFormat)
                        .add(numberOfYears, 'years')
                        .locale('en')
                        .format(GlobalSavingDateFormat),
                    });
                }
                onStateChanged(newValue);
              }}
              title="contract-period"
              errorPath="contract_period"
              // parentId="employee_contracts_attributes"
              stateKey="contract_period"
              editValue={state.contract_period}
              placeholder="select-contract-period"
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {getIsExistKey({
            key: 'joining_date',
            isAccountLevel: true,
          }) && (
            <DatePickerComponent
              isFullWidth
              stateKey="joining_date"
              label="joining-date"
              inputPlaceholder={`${t('Shared:eg')} ${moment()
                .locale(i18next.language)
                .format(GlobalDateFormat)}`}
              errors={errors}
              errorPath="joining_date"
              idRef="employeeJoiningDateRef"
              value={state.joining_date || ''}
              isSubmitted={isSubmitted}
              displayFormat={GlobalDateFormat}
              maxDate={
                (!getActivePushToPartnerEnum({
                  items: contractTypes,
                  activeKey: state.contract_type,
                }).is_without_contract_period
                  && state.end_date)
                || undefined
              }
              onDelayedChange={(newValue) => {
                const numberOfYears = getActivePushToPartnerEnum({
                  items: contractPeriods,
                  activeKey: state.contract_period,
                }).fixedEndDateYears;
                if (newValue.value && state.contract_period && numberOfYears)
                  setState({
                    ...newValue,
                    id: 'end_date',
                    value: moment(newValue.value)
                      .add(numberOfYears, 'years')
                      .locale('en')
                      .format(GlobalSavingDateFormat),
                  });
                else if (!newValue.value && state.contract_period && numberOfYears)
                  setState({
                    ...newValue,
                    id: 'end_date',
                    value: null,
                  });

                onStateChanged(newValue);
              }}
              disableMaskedInput
              isDisabled={
                isLoading
                || (!getActivePushToPartnerEnum({
                  items: contractTypes,
                  activeKey: state.contract_type,
                }).is_without_contract_period
                  && !state.contract_period)
                || isDisabledSaving
              }
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {getIsExistKey({
            key: 'start_date',
            isAccountLevel: true,
          }) && (
            <DatePickerComponent
              isFullWidth
              stateKey="start_date"
              label="start-date"
              inputPlaceholder={`${t('Shared:eg')} ${moment()
                .locale(i18next.language)
                .format(GlobalDateFormat)}`}
              errors={errors}
              // parentId="employee_contracts_attributes"
              errorPath="start_date"
              key={state.start_date || undefined}
              idRef="startDateRef"
              value={state.start_date || ''}
              isSubmitted={isSubmitted}
              isDisabled={isLoading || isDisabledSaving}
              disableMaskedInput
              displayFormat={GlobalDateFormat}
              minDate={moment().locale('en').add(1, 'day').toDate()}
              onDelayedChange={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {getIsExistKey({
            key: 'end_date',
            isAccountLevel: true,
          })
            && !getActivePushToPartnerEnum({
              items: contractTypes,
              activeKey: state.contract_type,
            }).is_without_contract_period && (
            <DatePickerComponent
              isFullWidth
              stateKey="end_date"
              label="end-date"
              inputPlaceholder={`${t('Shared:eg')} ${moment()
                .locale(i18next.language)
                .format(GlobalDateFormat)}`}
              errors={errors}
              // parentId="employee_contracts_attributes"
              errorPath="end_date"
              key={state.contract_period || undefined}
              idRef="contactEndDateRef"
              value={state.end_date || ''}
              isSubmitted={isSubmitted}
              isDisabled={
                isLoading
                  || !state.contract_period
                  || Boolean(
                    getActivePushToPartnerEnum({
                      items: contractPeriods,
                      activeKey: state.contract_period,
                    }).fixedEndDateYears,
                  )
                  || isDisabledSaving
              }
              disableMaskedInput
              displayFormat={GlobalDateFormat}
              minDate={state.joining_date || moment().toDate()}
              onDelayedChange={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {getIsExistKey({
            key: 'termination_date',
            isAccountLevel: true,
          }) && (
            <DatePickerComponent
              isFullWidth
              stateKey="termination_date"
              label="termination-date"
              inputPlaceholder={`${t('Shared:eg')} ${moment()
                .locale(i18next.language)
                .format(GlobalDateFormat)}`}
              errors={errors}
              // parentId="employee_contracts_attributes"
              errorPath="termination_date"
              key={state.termination_date || undefined}
              idRef="terminationDateRef"
              value={state.termination_date || ''}
              isSubmitted={isSubmitted}
              isDisabled={isLoading || isDisabledSaving}
              disableMaskedInput
              displayFormat={GlobalDateFormat}
              onDelayedChange={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {getIsExistKey({
            key: 'user_expiry_date',
            isAccountLevel: true,
          }) && (
            <DatePickerComponent
              isFullWidth
              stateKey="user_expiry_date"
              label="user-expiry-date"
              inputPlaceholder={`${t('Shared:eg')} ${moment()
                .locale(i18next.language)
                .format(GlobalDateFormat)}`}
              errors={errors}
              // parentId="employee_contracts_attributes"
              errorPath="user_expiry_date"
              key={state.user_expiry_date || undefined}
              idRef="userExpiryDateRef"
              value={state.user_expiry_date || ''}
              isSubmitted={isSubmitted}
              isDisabled={isLoading || isDisabledSaving}
              disableMaskedInput
              displayFormat={GlobalDateFormat}
              onDelayedChange={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
        </div>
      </div>
      <div className="d-flex-v-center-h-end my-3 pb-3">
        <ButtonBase
          className="btns theme-solid"
          disabled={isLoading || isDisabledSaving}
          onClick={saveHandler}
        >
          <span>{t(`${translationPath}save`)}</span>
        </ButtonBase>
      </div>
    </div>
  );
};

PushToPartnerTab.propTypes = {
  job_candidate_uuid: PropTypes.string.isRequired,
  partner: PropTypes.oneOf(
    Object.values(IntegrationsPartnersEnum).map((item) => item),
  ).isRequired,
  candidateDetail: PropTypes.instanceOf(Object),
  currentJob: PropTypes.instanceOf(Object),
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  isReloadAfterSave: PropTypes.bool,
};

export default PushToPartnerTab;
