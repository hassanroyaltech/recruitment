import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
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
  showError,
  showSuccess,
} from '../../../../../helpers';
import * as yup from 'yup';
import i18next from 'i18next';

import DatePickerComponent from '../../../../Datepicker/DatePicker.Component';
import moment from 'moment';
import {
  BinzagerSapPaymentTypeEnum,
  BinzagerSapSlugTypesEnum,
  BinzagrSapEmployeeWageTypeEnum,
  OffersStatusesEnum,
  ProfileManagementFeaturesEnum,
} from '../../../../../enums';
import { ButtonBase } from '@mui/material';
import './BinzagerSAP.Style.scss';
import {
  BinzagerSapAddEmployee,
  BinzagerSapGetDropdown,
  BinzagerSapGetEmployee,
  GetAllOffers,
  GetAllSetupsCountries,
  GetAllSetupsDegreeTypes,
  GetAllSetupsGender,
  GetAllSetupsMaritalStatus,
  GetAllSetupsNationality,
  GetCandidatesProfileById,
  getSetupsNationalityById,
  ShowOfferById,
} from '../../../../../services';
const gpaValues = ['4', '5'];
const fieldGroups = {
  group1: [
    'first_name_en',
    'first_name_ar',
    'second_name_en',
    'second_name_ar',
    'last_name_en',
    'last_name_ar',
  ],
  group2: ['position_num', 'children_num'],
  group3: [
    'city',
    'work_city',
    'postal_code',
    'work_postal_code',
    'district',
    'street',
    'address_line_1',
    'house_number',
    'telephone',
  ],
  group4: ['bank_account', 'iban_number'],
  group5: ['gosi_number'],
};
const BinzagerSAPTab = ({
  job_candidate_uuid,
  candidateDetail,
  parentTranslationPath,
  translationPath,
  activeJob,
  job_uuid,
  candidate_uuid,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabledSaving, setIsDisabledSaving] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState([]);

  const stateInitRef = useRef({
    job_candidate_uuid,
    first_name_en: '',
    first_name_ar: '',
    second_name_en: '',
    second_name_ar: '',
    last_name_en: '',
    last_name_ar: '',
    birth_date: '',
    entry_date: '',
    nationality: '',
    religion: '',
    marital_status: '',
    gender: '',
    position_num: '',
    contract: '',
    employee_group: '',
    employee_subgroup: '',
    address_title: '',
    country: '',
    work_country: '',
    city: '',
    work_city: '',
    postal_code: '',
    work_postal_code: '',
    district: '',
    state: '',
    street: '',
    address_line_1: '',
    house_number: '',
    telephone: '',
    payment_method: '',
    bank_key: '',
    bank_account: '',
    iban_number: '',

    gosi_number: '',
    employee_family: [],
    employee_communication: [],
    employee_documents: [],
    employee_education: [],
    employee_wage: [],
  });
  const stateRef = useRef({});
  const arrayKeysRef = useRef({
    employee_communication: {
      communication_type: '',
      identification: '',
    },
    employee_documents: {
      document_type: '',
      document_number: '',
      issue_date: '',
      expiry_date: '',
    },
    employee_education: {
      education_type: '',
      major: '',
      country: '',
      grade: '',
      year: '',
      gpa: '',
      gpa_percent: '',
      school_name: '',
    },
    employee_family: {
      relation: '',
      first_name: '',
      last_name: '',
      gender: '',
      birth_date: '',
      nationality: '',
    },
    employee_wage: {
      wage_type: '',
      amount: '',
    },
  });
  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  const onStateChanged = useCallback((newValue) => {
    setState(newValue);
  }, []);

  const getEditInit = useCallback(async () => {
    setIsLoading(true);
    let completedOfferFields = [];
    // 1 candidate profile
    // 2 Binzager Sap get employee
    // 3 get all candidate offers

    const [candidateResponse, employeeResponse, candidateOffersRes]
      = await Promise.allSettled([
        GetCandidatesProfileById({
          candidate_uuid: candidateDetail.identity.uuid,
          profile_uuid: candidateDetail.profile_uuid,
          from_feature: ProfileManagementFeaturesEnum.Job.key,
        }),
        BinzagerSapGetEmployee({ job_candidate_uuid }),
        GetAllOffers({
          candidate_uuid,
          job_uuid,
          page: 1,
          limit: 10,
          status: OffersStatusesEnum.Completed.key,
        }),
      ]);

    if (
      candidateOffersRes.value?.status === 200
      && candidateOffersRes.value?.data?.results?.forms?.[0]?.uuid
    ) {
      const completedOfferRes = await ShowOfferById({
        uuid: candidateOffersRes.value?.data?.results?.forms?.[0]?.uuid,
      });
      if (completedOfferRes.status === 200) {
        let allFields = [];
        Object.values(completedOfferRes.data.results.sections || []).forEach(
          (it) => {
            allFields = [...allFields, ...it.items];
          },
        );

        completedOfferFields = allFields
          .filter((it) =>
            Object.values(BinzagrSapEmployeeWageTypeEnum)
              .map((item) => item.key)
              .includes(it.code),
          )
          .map((field) => ({
            wage_type: field?.code || '',
            amount:
              field?.languages?.[completedOfferRes.data.results?.primary_lang]
                ?.value,
          }));
      }
    }

    setIsLoading(false);
    if (employeeResponse && employeeResponse.value?.status === 200) {
      if (employeeResponse.value.data?.results?.employee_number)
        setIsDisabledSaving(true);
      const employee_communication = [];
      if (candidateResponse.value.data.results?.phone_number)
        employee_communication.push({
          communication_type: '0003',
          identification: candidateResponse.value.data.results?.phone_number,
        });
      if (candidateResponse.value.data.results?.email)
        employee_communication.push({
          communication_type: '0005',
          identification: candidateResponse.value.data.results?.email,
        });

      setState({
        id: 'edit',
        value: {
          ...stateInitRef.current,
          job_candidate_uuid,
          ...employeeResponse.value.data.results,
          first_name_en:
            employeeResponse.value.data?.results?.first_name_en
            || candidateDetail?.basic_information?.first_name
            || null,
          last_name_en:
            employeeResponse.value.data?.results?.last_name_en
            || candidateDetail?.basic_information?.last_name
            || null,
          birth_date:
            employeeResponse.value.data?.results?.birth_date
            || (candidateResponse.value.data.results?.dob
              && moment(candidateResponse.value.data.results?.dob)
                .locale('en')
                .format('DD.MM.YYYY'))
            || null,
          postal_code:
            employeeResponse.value.data?.results?.postal_code
            || employeeResponse.value?.basic_information?.zip_code
            || null,
          gender:
            employeeResponse.value.data.results?.gender
            || candidateResponse.value.data.results?.gender
            || null,
          marital_status:
            employeeResponse.value.data.results?.marital_status
            || candidateResponse.value.data.results?.extra?.martial_status
            || null,
          nationality:
            employeeResponse.value.data.results?.nationality
            || candidateResponse.value.data.results?.nationality?.[0]
            || null,
          country:
            employeeResponse.value.data.results?.country
            || candidateResponse.value.data.results?.location?.country_uuid
            || null,
          work_country:
            employeeResponse.value.data.results?.work_country
            || (candidateResponse.value.data.results?.experience?.length > 0
              && candidateResponse.value.data.results?.experience[
                candidateResponse.value.data.results?.experience.length - 1
              ]?.country_uuid)
            || null,
          city:
            employeeResponse.value.data.results?.city
            || candidateResponse.value.data.results?.location?.city
            || null,
          telephone:
            employeeResponse.value.data.results?.telephone
            || candidateResponse.value.data.results?.phone_number
            || null,
          position_num:
            employeeResponse.value.data.results?.position_num
            || activeJob.position_code
            || null,
          employee_wage:
            employeeResponse.value.data.results?.employee_wage
            || completedOfferFields
            || [],
          employee_education:
            employeeResponse.value.data.results?.employee_education
            || candidateDetail?.education
              .filter((item) => item.institution)
              .map((item) => ({
                education_type: item.degree_type?.uuid || '',
                major: item?.major?.title || '',
                country: item.country?.uuid || '',
                year: (item.to_date && item.to_date.split('-')[0]) || '',
                gpa: '',
                gpa_percent: item.gpa || item.gpa === 0 ? `${item.gpa}` : '',
                grade: '',
                school_name: item.institution || '',
              }))
            || [],
          employee_communication:
            employeeResponse.value.data.results?.employee_communication
            || employee_communication
            || [],
        },
      });
    } else
      showError(t('Shared:failed-to-get-saved-data'), employeeResponse.value.data);
  }, [
    candidateDetail,
    candidate_uuid,
    job_uuid,
    job_candidate_uuid,
    activeJob.position_code,
    t,
  ]);
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    setIsLoading(true);
    const response = await BinzagerSapAddEmployee(state);
    setIsLoading(false);
    if (response && (response.status === 200 || response.status === 201)) {
      const messages = response.data?.results.return_messages || [];
      if (messages?.length === 0) showError(t(`employee-data-save-failed`));
      else if (messages.join(' ').includes('Employee Created'))
        showSuccess(
          <ul>
            {messages.map((msg, index) => (
              <li key={`msg-${msg}-${index}`}>{msg}</li>
            ))}
          </ul>,
        );
      else {
        const localErrors = {};
        messages.forEach((item, index) => {
          localErrors[`${index}`] = item;
        });
        showError(t(`employee-data-save-failed`), { errors: localErrors });
      }
      if (response.data?.results?.employee_number) getEditInit();
    } else showError(t(`employee-data-save-failed`), response);
  };

  const arraysItemsHandler = useCallback(
    ({ arrayKey, type, index }) =>
      () => {
        const localeData = stateRef.current[arrayKey] || [];
        if (type === 'remove') localeData.splice(index, 1);
        else localeData.push(arrayKeysRef.current[arrayKey]);
        setState({ id: arrayKey, value: [...localeData] });
      },
    [],
  );

  const getErrors = useCallback(async () => {
    const result = await getErrorByName(
      {
        current: yup.object().shape({
          payment_method: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          country: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          state: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          postal_code: yup
            .string()
            .nullable()
            .min(
              5,
              `${t('characters-length-should-be-equal-to')} ${5} ${t('characters')}`,
            )
            .max(
              5,
              `${t('characters-length-should-be-equal-to')} ${5} ${t('characters')}`,
            )
            .required(t('Shared:this-field-is-required')),
          work_postal_code: yup
            .string()
            .nullable()
            .min(
              5,
              `${t('characters-length-should-be-equal-to')} ${5} ${t('characters')}`,
            )
            .max(
              5,
              `${t('characters-length-should-be-equal-to')} ${5} ${t('characters')}`,
            )
            .required(t('Shared:this-field-is-required')),
          work_country: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          work_city: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          city: yup.string().nullable().required(t('Shared:this-field-is-required')),
          contract: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          employee_subgroup: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          entry_date: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          address_title: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          position_num: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          first_name_en: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          first_name_ar: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          last_name_ar: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          last_name_en: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          gender: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          birth_date: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          marital_status: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          nationality: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          religion: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          children_num: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          employee_group: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          employee_family: yup.array().of(
            yup.object().shape({
              first_name: yup
                .string()
                .nullable()
                .required(t('Shared:this-field-is-required')),
              last_name: yup
                .string()
                .nullable()
                .required(t('Shared:this-field-is-required')),
              relation: yup
                .string()
                .nullable()
                .required(t('Shared:this-field-is-required')),
              gender: yup
                .string()
                .nullable()
                .required(t('Shared:this-field-is-required')),
              birth_date: yup
                .string()
                .nullable()
                .required(t('Shared:this-field-is-required')),
              nationality: yup
                .string()
                .nullable()
                .required(t('Shared:this-field-is-required')),
            }),
          ),
          bank_key: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || state.payment_method === BinzagerSapPaymentTypeEnum.Cheques.key,
            ),
          bank_account: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || state.payment_method === BinzagerSapPaymentTypeEnum.Cheques.key,
            ),
          iban_number: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || state.payment_method === BinzagerSapPaymentTypeEnum.Cheques.key,
            ),
          employee_documents: yup.array().of(
            yup.object().shape({
              expiry_date: yup
                .string()
                .nullable()
                .required(t('Shared:this-field-is-required')),
              issue_date: yup
                .string()
                .nullable()
                .required(t('Shared:this-field-is-required')),
              document_type: yup
                .string()
                .nullable()
                .required(t('Shared:this-field-is-required')),
              document_number: yup
                .string()
                .nullable()
                .when('document_type', (document_type, schema) => {
                  if (document_type !== '3')
                    return schema.required(t('Shared:this-field-is-required'));
                  return schema;
                }),
            }),
          ),
          employee_communication: yup.array().of(
            yup.object().shape({
              communication_type: yup
                .string()
                .nullable()
                .required(t('Shared:this-field-is-required')),
            }),
          ),
          employee_wage: yup.array().of(
            yup.object().shape({
              wage_type: yup
                .string()
                .nullable()
                .required(t('Shared:this-field-is-required')),
            }),
          ),
          employee_education: yup.array().of(
            yup.object().shape({
              education_type: yup
                .string()
                .nullable()
                .required(t('Shared:this-field-is-required')),
              country: yup
                .string()
                .nullable()
                .required(t('Shared:this-field-is-required')),
              grade: yup
                .string()
                .nullable()
                .required(t('Shared:this-field-is-required')),
              gpa_percent: yup
                .string()
                .nullable()
                .required(t('Shared:this-field-is-required')),
              gpa: yup
                .string()
                .nullable()
                .required(t('Shared:this-field-is-required')),
              major: yup
                .string()
                .nullable()
                .required(t('Shared:this-field-is-required')),
              year: yup
                .string()
                .nullable()
                .required(t('Shared:this-field-is-required')),
              school_name: yup
                .string()
                .nullable()
                .required(t('Shared:this-field-is-required')),
            }),
          ),
        }),
      },
      state,
    );
    setErrors(result);
  }, [state, t]);

  // this to call error's updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  useEffect(() => {
    getEditInit();
  }, [getEditInit]);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  return (
    <div className="binzager-sap-tab-wrapper tab-wrapper">
      <div className="binzager-sap-tab-wrapper ">
        <div className="binzager-sap-card-body">
          <SharedAPIAutocompleteControl
            isFullWidth
            title="address-title"
            editValue={state.address_title}
            idRef="addressTitleAutocompleteRef"
            titleKey="title"
            uniqueKey="code"
            errors={errors}
            searchKey="query"
            stateKey="address_title"
            isDisabled={isLoading || isDisabledSaving}
            isSubmitted={isSubmitted}
            errorPath="address_title"
            placeholder="select-address-title"
            getDataAPI={BinzagerSapGetDropdown}
            onValueChanged={onStateChanged}
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            extraProps={{
              slug: BinzagerSapSlugTypesEnum.sapAddressTitles.key,
            }}
          />
          {fieldGroups.group1.map((item, index) => (
            <SharedInputControl
              key={`field-${item}-${index}`}
              isFullWidth
              title={item.replaceAll('_', '-')}
              editValue={state[item]}
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errors={errors}
              errorPath={item}
              stateKey={item}
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          ))}
          <DatePickerComponent
            isFullWidth
            stateKey="birth_date"
            label="date-of-birth"
            isHijri={false}
            maxDate={moment().toDate()}
            inputPlaceholder={`${t('Shared:eg')} ${moment()
              .locale(i18next.language)
              .format(GlobalDateFormat)}`}
            errors={errors}
            errorPath="birth_date"
            key={state.birth_date || undefined}
            idRef="dateOfBirthRef"
            value={state.birth_date || ''}
            isSubmitted={isSubmitted}
            isDisabled={isLoading || isDisabledSaving}
            disableMaskedInput
            displayFormat={GlobalDateFormat}
            savingFormat={'DD.MM.YYYY'}
            onDelayedChange={onStateChanged}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
          <DatePickerComponent
            isFullWidth
            stateKey="entry_date"
            label="entry-date"
            inputPlaceholder={`${t('Shared:eg')} ${moment()
              .locale(i18next.language)
              .format(GlobalDateFormat)}`}
            errors={errors}
            errorPath="entry_date"
            key={state.entry_date || undefined}
            idRef="entryDateRef"
            value={state.entry_date || ''}
            isSubmitted={isSubmitted}
            isDisabled={isLoading || isDisabledSaving}
            disableMaskedInput
            displayFormat={GlobalDateFormat}
            savingFormat={'DD.MM.YYYY'}
            onDelayedChange={onStateChanged}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
          <SharedAPIAutocompleteControl
            isFullWidth
            title="nationality"
            editValue={state.nationality}
            idRef="nationalityAutocompleteRef"
            errors={errors}
            searchKey="search"
            stateKey="nationality"
            isDisabled={isLoading || isDisabledSaving}
            isSubmitted={isSubmitted}
            errorPath="nationality"
            placeholder="select-nationality"
            getDataAPI={GetAllSetupsNationality}
            getItemByIdAPI={getSetupsNationalityById}
            getOptionLabel={(option) =>
              option.name[i18next.language] || option.name.en
            }
            extraProps={{
              ...(state.nationality && { with_than: [state.nationality] }),
            }}
            onValueChanged={onStateChanged}
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
          />
          <SharedAPIAutocompleteControl
            isFullWidth
            title="religion"
            editValue={state.religion}
            idRef="religionAutocompleteRef"
            titleKey="title"
            uniqueKey="code"
            errors={errors}
            searchKey="query"
            stateKey="religion"
            isDisabled={isLoading || isDisabledSaving}
            isSubmitted={isSubmitted}
            errorPath="religion"
            placeholder="select-religion"
            getDataAPI={BinzagerSapGetDropdown}
            onValueChanged={onStateChanged}
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            extraProps={{
              slug: BinzagerSapSlugTypesEnum.sapReligion.key,
            }}
          />
          <SharedAPIAutocompleteControl
            isFullWidth
            title="marital-status"
            editValue={state.marital_status}
            idRef="maritalStatusAutocompleteRef"
            errors={errors}
            stateKey="marital_status"
            isDisabled={isLoading || isDisabledSaving}
            isSubmitted={isSubmitted}
            errorPath="marital_status"
            placeholder="select-marital-status"
            getDataAPI={GetAllSetupsMaritalStatus}
            getOptionLabel={(option) =>
              option.name[i18next.language] || option.name.en
            }
            extraProps={{
              company_uuid: candidateDetail.identity.company_uuid,
              ...(state?.marital_status && {
                with_than: [state.marital_status],
              }),
            }}
            onValueChanged={onStateChanged}
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
          />

          <SharedAPIAutocompleteControl
            isFullWidth
            title="gender"
            errors={errors}
            stateKey="gender"
            idRef="genderAutocompleteRef"
            errorPath="gender"
            searchKey="search"
            placeholder="gender"
            isDisabled={isLoading || isDisabledSaving}
            editValue={state.gender}
            isSubmitted={isSubmitted}
            onValueChanged={onStateChanged}
            getDataAPI={GetAllSetupsGender}
            extraProps={{
              company_uuid: candidateDetail.identity.company_uuid,
              ...(state.gender && { with_than: [state.gender] }),
            }}
            parentTranslationPath={parentTranslationPath}
            getOptionLabel={(option) =>
              option.name[i18next.language] || option.name.en
            }
          />

          <SharedAPIAutocompleteControl
            isFullWidth
            title="work-contract"
            editValue={state.contract}
            idRef="contractAutocompleteRef"
            titleKey="title"
            uniqueKey="code"
            errors={errors}
            searchKey="query"
            stateKey="contract"
            isDisabled={isLoading || isDisabledSaving}
            isSubmitted={isSubmitted}
            errorPath="contract"
            placeholder="select-contract"
            getDataAPI={BinzagerSapGetDropdown}
            onValueChanged={onStateChanged}
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            extraProps={{
              slug: BinzagerSapSlugTypesEnum.sapContractTypes.key,
            }}
          />

          {fieldGroups.group2.map((item, index) => (
            <SharedInputControl
              key={`field-${item}-${index}`}
              isFullWidth
              title={item.replaceAll('_', '-')}
              editValue={state[item]}
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errors={errors}
              errorPath={item}
              stateKey={item}
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          ))}

          <SharedAPIAutocompleteControl
            isFullWidth
            title="employee-group"
            editValue={state.employee_group}
            idRef="employeeGroupAutocompleteRef"
            titleKey="title"
            uniqueKey="code"
            errors={errors}
            searchKey="query"
            stateKey="employee_group"
            isDisabled={isLoading || isDisabledSaving}
            isSubmitted={isSubmitted}
            errorPath="employee_group"
            placeholder="select-employee-group"
            getDataAPI={BinzagerSapGetDropdown}
            onValueChanged={(newValue) =>
              onStateChanged({
                id: 'destructObject',
                value: { employee_group: newValue.value, employee_subgroup: '' },
              })
            }
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            extraProps={{
              slug: BinzagerSapSlugTypesEnum.sapEmployeeGroups.key,
            }}
          />
          <SharedAPIAutocompleteControl
            isFullWidth
            title="employee-subgroup"
            editValue={state.employee_subgroup}
            idRef="employeeSubgroupAutocompleteRef"
            titleKey="title"
            uniqueKey="code"
            errors={errors}
            searchKey="query"
            stateKey="employee_subgroup"
            isDisabled={isLoading || isDisabledSaving || !state.employee_group}
            isSubmitted={isSubmitted}
            errorPath="employee_subgroup"
            placeholder="select-employee-subgroup"
            getDataAPI={BinzagerSapGetDropdown}
            onValueChanged={onStateChanged}
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            extraProps={{
              slug: BinzagerSapSlugTypesEnum.sapEmployeeSubgroups.key,
              group_code: state.employee_group,
            }}
          />
          <SharedAPIAutocompleteControl
            isFullWidth
            title="country-key"
            editValue={state.country}
            idRef="countryAutocompleteRef"
            errors={errors}
            stateKey="country"
            isDisabled={isLoading || isDisabledSaving}
            isSubmitted={isSubmitted}
            errorPath="country"
            placeholder="select-country-key"
            searchKey="search"
            getDataAPI={GetAllSetupsCountries}
            extraProps={{
              company_uuid: candidateDetail.identity.company_uuid,
              ...(state.country && { with_than: [state.country] }),
            }}
            getOptionLabel={(option) =>
              option.name[i18next.language] || option.name.en
            }
            onValueChanged={onStateChanged}
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
          />
          <SharedAPIAutocompleteControl
            isFullWidth
            title="work-country"
            editValue={state.work_country}
            idRef="workcountryAutocompleteRef"
            errors={errors}
            stateKey="work_country"
            isDisabled={isLoading || isDisabledSaving}
            isSubmitted={isSubmitted}
            errorPath="work_country"
            placeholder="select-work-country"
            searchKey="search"
            getDataAPI={GetAllSetupsCountries}
            extraProps={{
              company_uuid: candidateDetail.identity.company_uuid,
              ...(state.work_country && { with_than: [state.work_country] }),
            }}
            getOptionLabel={(option) =>
              option.name[i18next.language] || option.name.en
            }
            onValueChanged={onStateChanged}
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
          />
          <SharedAPIAutocompleteControl
            isFullWidth
            title="state"
            editValue={state.state}
            idRef="stateAutocompleteRef"
            titleKey="title"
            uniqueKey="code"
            errors={errors}
            searchKey="query"
            stateKey="state"
            isDisabled={isLoading || isDisabledSaving}
            isSubmitted={isSubmitted}
            errorPath="state"
            placeholder="select-state"
            getDataAPI={BinzagerSapGetDropdown}
            onValueChanged={onStateChanged}
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            extraProps={{
              slug: BinzagerSapSlugTypesEnum.sapRegion.key,
            }}
          />

          {fieldGroups.group3.map((item, index) => (
            <SharedInputControl
              key={`field-${item}-${index}`}
              isFullWidth
              title={item.replaceAll('_', '-')}
              editValue={state[item]}
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errors={errors}
              errorPath={item}
              stateKey={item}
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          ))}

          <SharedAPIAutocompleteControl
            isFullWidth
            title="payment-method"
            editValue={state.payment_method}
            idRef="paymentMethodKeyAutocompleteRef"
            titleKey="title"
            uniqueKey="code"
            errors={errors}
            searchKey="query"
            stateKey="payment_method"
            isDisabled={isLoading || isDisabledSaving}
            isSubmitted={isSubmitted}
            errorPath="payment_method"
            placeholder="select-payment-method"
            getDataAPI={BinzagerSapGetDropdown}
            onValueChanged={(newValue) =>
              onStateChanged({
                id: 'destructObject',
                value: {
                  payment_method: newValue.value,
                  bank_account: '',
                  iban_number: '',
                  bank_key: '',
                },
              })
            }
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            extraProps={{
              slug: BinzagerSapSlugTypesEnum.sapPaymentMethod.key,
            }}
          />

          {state.payment_method === BinzagerSapPaymentTypeEnum.BankTransfer.key ? (
            <>
              <SharedAPIAutocompleteControl
                isFullWidth
                title="bank-key"
                editValue={state.bank_key}
                idRef="bankKeyAutocompleteRef"
                titleKey="name"
                uniqueKey="code"
                errors={errors}
                searchKey="query"
                stateKey="bank_key"
                isDisabled={isLoading || isDisabledSaving}
                isSubmitted={isSubmitted}
                errorPath="bank_key"
                placeholder="select-bank-key"
                getDataAPI={BinzagerSapGetDropdown}
                onValueChanged={onStateChanged}
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                extraProps={{
                  slug: BinzagerSapSlugTypesEnum.sapBanks.key,
                }}
              />
              {fieldGroups.group4.map((item, index) => (
                <SharedInputControl
                  key={`field-${item}-${index}`}
                  isFullWidth
                  title={item.replaceAll('_', '-')}
                  editValue={state[item]}
                  isDisabled={isLoading || isDisabledSaving}
                  isSubmitted={isSubmitted}
                  errors={errors}
                  errorPath={item}
                  stateKey={item}
                  onValueChanged={onStateChanged}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              ))}
            </>
          ) : (
            ''
          )}

          {fieldGroups.group5.map((item, index) => (
            <SharedInputControl
              key={`field-${item}-${index}`}
              isFullWidth
              title={item.replaceAll('_', '-')}
              editValue={state[item]}
              isDisabled={isLoading || isDisabledSaving}
              isSubmitted={isSubmitted}
              errors={errors}
              errorPath={item}
              stateKey={item}
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          ))}

          <div className="d-flex flex-wrap gap-1">
            <div className={'d-flex-v-center-h-between mb-1'}>
              <span>{t(`${translationPath}employee-family`)}</span>
              <ButtonBase
                onClick={arraysItemsHandler({
                  arrayKey: 'employee_family',
                  type: 'add',
                })}
                className="btns-icon theme-transparent c-primary"
                disabled={isLoading || isDisabledSaving}
              >
                <span className="fas fa-plus fa-lg" />
              </ButtonBase>
            </div>
            {state.employee_family.map((item, index) => (
              <div
                className={'d-flex flex-wrap  b-sap-item-card'}
                key={`field-family-${index}`}
              >
                <div className={'d-flex-v-center-h-end'}>
                  <ButtonBase
                    onClick={arraysItemsHandler({
                      arrayKey: 'employee_family',
                      type: 'remove',
                      index,
                    })}
                    className="btns-icon theme-transparent c-error"
                    disabled={isLoading || isDisabledSaving}
                  >
                    <i className="fas fa-trash fa-xs  " />
                  </ButtonBase>
                </div>
                <SharedInputControl
                  isHalfWidth
                  title={'first-name'}
                  editValue={item.first_name}
                  isDisabled={isLoading || isDisabledSaving}
                  isSubmitted={isSubmitted}
                  errors={errors}
                  parentIndex={index}
                  stateKey="first_name"
                  parentId="employee_family"
                  errorPath={`employee_family[${index}].first_name`}
                  onValueChanged={onStateChanged}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
                <SharedInputControl
                  isHalfWidth
                  title={'last-name'}
                  editValue={item.last_name}
                  isDisabled={isLoading || isDisabledSaving}
                  isSubmitted={isSubmitted}
                  errors={errors}
                  parentIndex={index}
                  stateKey="last_name"
                  parentId="employee_family"
                  errorPath={`employee_family[${index}].last_name`}
                  onValueChanged={onStateChanged}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
                <SharedAPIAutocompleteControl
                  isHalfWidth
                  title="gender"
                  editValue={item.gender}
                  idRef={`genderAutocompleteRef-${index}`}
                  errors={errors}
                  parentIndex={index}
                  parentId="employee_family"
                  stateKey="gender"
                  isDisabled={isLoading || isDisabledSaving}
                  isSubmitted={isSubmitted}
                  errorPath={`employee_family[${index}].gender`}
                  placeholder="select-gender"
                  searchKey="search"
                  getDataAPI={GetAllSetupsGender}
                  extraProps={{
                    company_uuid: candidateDetail.identity.company_uuid,
                    ...(item.gender && { with_than: [item.gender] }),
                  }}
                  getOptionLabel={(option) =>
                    option.name[i18next.language] || option.name.en
                  }
                  onValueChanged={onStateChanged}
                  translationPath={translationPath}
                  parentTranslationPath={parentTranslationPath}
                />
                <DatePickerComponent
                  isHalfWidth
                  stateKey="birth_date"
                  parentIndex={index}
                  parentId="employee_family"
                  errorPath={`employee_family[${index}].birth_date`}
                  label="date-of-birth"
                  inputPlaceholder={`${t('Shared:eg')} ${moment()
                    .locale(i18next.language)
                    .format(GlobalDateFormat)}`}
                  errors={errors}
                  key={item.birth_date || undefined}
                  idRef={`dateOfBirthRef-${index}`}
                  value={item.birth_date || ''}
                  isSubmitted={isSubmitted}
                  isDisabled={isLoading || isDisabledSaving}
                  disableMaskedInput
                  displayFormat={GlobalDateFormat}
                  savingFormat={'DD.MM.YYYY'}
                  maxDate={moment().toDate()}
                  onDelayedChange={onStateChanged}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
                <SharedAPIAutocompleteControl
                  isHalfWidth
                  title="relation"
                  editValue={item.relation}
                  idRef="relationAutocompleteRef"
                  titleKey="title"
                  uniqueKey="code"
                  errors={errors}
                  parentIndex={index}
                  parentId="employee_family"
                  searchKey="query"
                  stateKey="relation"
                  isDisabled={isLoading || isDisabledSaving}
                  isSubmitted={isSubmitted}
                  errorPath={`employee_family[${index}].relation`}
                  placeholder="select-relation"
                  getDataAPI={BinzagerSapGetDropdown}
                  onValueChanged={onStateChanged}
                  translationPath={translationPath}
                  parentTranslationPath={parentTranslationPath}
                  extraProps={{
                    slug: BinzagerSapSlugTypesEnum.sapRelations.key,
                  }}
                />
                <SharedAPIAutocompleteControl
                  isHalfWidth
                  title="nationality"
                  editValue={item.nationality}
                  idRef="nationalityAutocompleteRef"
                  titleKey="title"
                  // uniqueKey="code"
                  errors={errors}
                  parentIndex={index}
                  parentId="employee_family"
                  stateKey="nationality"
                  isDisabled={isLoading || isDisabledSaving}
                  isSubmitted={isSubmitted}
                  errorPath={`employee_family[${index}].nationality`}
                  placeholder="select-nationality"
                  onValueChanged={onStateChanged}
                  translationPath={translationPath}
                  parentTranslationPath={parentTranslationPath}
                  searchKey="search"
                  getDataAPI={GetAllSetupsNationality}
                  getItemByIdAPI={getSetupsNationalityById}
                  getOptionLabel={(option) =>
                    option.name[i18next.language] || option.name.en
                  }
                  extraProps={{
                    ...(item.nationality && { with_than: [item.nationality] }),
                  }}
                />
              </div>
            ))}
          </div>
          <hr className={'mb-0 my-1'} />
          <div className="d-flex flex-wrap gap-1">
            <div className={'d-flex-v-center-h-between mb-1'}>
              <span>{t(`${translationPath}employee-documents`)}</span>
              <ButtonBase
                onClick={arraysItemsHandler({
                  arrayKey: 'employee_documents',
                  type: 'add',
                })}
                className="btns-icon theme-transparent c-primary"
                disabled={isLoading || isDisabledSaving}
              >
                <span className="fas fa-plus fa-lg" />
              </ButtonBase>
            </div>

            {state.employee_documents.map((item, index) => (
              <div
                className={'d-flex flex-wrap  b-sap-item-card'}
                key={`field-documents-${index}`}
              >
                <div className={'d-flex-v-center-h-end'}>
                  <ButtonBase
                    onClick={arraysItemsHandler({
                      arrayKey: 'employee_documents',
                      type: 'remove',
                      index,
                    })}
                    className="btns-icon theme-transparent c-error"
                    disabled={isLoading || isDisabledSaving}
                  >
                    <i className="fas fa-trash fa-xs  " />
                  </ButtonBase>
                </div>

                <SharedAPIAutocompleteControl
                  isHalfWidth
                  title="document-type"
                  editValue={item.document_type}
                  idRef={`documentTypeAutocompleteRef-${index}`}
                  titleKey="title"
                  uniqueKey="code"
                  errors={errors}
                  searchKey="query"
                  parentIndex={index}
                  parentId="employee_documents"
                  stateKey="document_type"
                  isDisabled={isLoading || isDisabledSaving}
                  isSubmitted={isSubmitted}
                  errorPath={`employee_documents[${index}].document_type`}
                  getDataAPI={BinzagerSapGetDropdown}
                  onValueChanged={(newValue) => {
                    onStateChanged({
                      parentId: 'employee_documents',
                      parentIndex: index,
                      value: {
                        ...item,
                        document_type: newValue.value,
                        document_number: '',
                      },
                    });
                  }}
                  translationPath={translationPath}
                  parentTranslationPath={parentTranslationPath}
                  extraProps={{
                    slug: BinzagerSapSlugTypesEnum.sapDocumentsTypes.key,
                  }}
                />

                {item.document_type !== '3' && (
                  <SharedInputControl
                    isHalfWidth
                    title={'document-number'}
                    editValue={item.document_number}
                    isDisabled={isLoading || isDisabledSaving}
                    isSubmitted={isSubmitted}
                    errors={errors}
                    parentIndex={index}
                    stateKey="document_number"
                    parentId="employee_documents"
                    errorPath={`employee_documents[${index}].document_number`}
                    onValueChanged={onStateChanged}
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                  />
                )}

                <DatePickerComponent
                  isHalfWidth
                  stateKey="issue_date"
                  parentIndex={index}
                  parentId="employee_documents"
                  errorPath={`employee_documents[${index}].issue_date`}
                  label="issue-date"
                  inputPlaceholder={`${t('Shared:eg')} ${moment()
                    .locale(i18next.language)
                    .format(GlobalDateFormat)}`}
                  errors={errors}
                  key={item.issue_date || undefined}
                  idRef={`dateOfBirthRef-${index}`}
                  value={item.issue_date || ''}
                  isSubmitted={isSubmitted}
                  isDisabled={isLoading || isDisabledSaving}
                  disableMaskedInput
                  displayFormat={GlobalDateFormat}
                  savingFormat={'DD.MM.YYYY'}
                  onDelayedChange={onStateChanged}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
                <DatePickerComponent
                  isHalfWidth
                  stateKey="expiry_date"
                  parentIndex={index}
                  parentId="employee_documents"
                  errorPath={`employee_documents[${index}].expiry_date`}
                  label="expiry_date"
                  inputPlaceholder={`${t('Shared:eg')} ${moment()
                    .locale(i18next.language)
                    .format(GlobalDateFormat)}`}
                  errors={errors}
                  key={item.expiry_date || undefined}
                  idRef={`expiry_date-${index}`}
                  value={item.expiry_date || ''}
                  isSubmitted={isSubmitted}
                  isDisabled={isLoading || isDisabledSaving}
                  disableMaskedInput
                  displayFormat={GlobalDateFormat}
                  savingFormat={'DD.MM.YYYY'}
                  onDelayedChange={onStateChanged}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              </div>
            ))}
          </div>
          <hr className={'mb-0 my-1'} />
          <div className="d-flex flex-wrap gap-1">
            <div className={'d-flex-v-center-h-between mb-1'}>
              <span>{t(`${translationPath}employee-communication`)}</span>
              <ButtonBase
                onClick={arraysItemsHandler({
                  arrayKey: 'employee_communication',
                  type: 'add',
                })}
                className="btns-icon theme-transparent c-primary"
                disabled={isLoading || isDisabledSaving}
              >
                <span className="fas fa-plus fa-lg" />
              </ButtonBase>
            </div>

            {state.employee_communication.map((item, index) => (
              <div
                className={'d-flex flex-wrap  b-sap-item-card'}
                key={`field-education-${index}`}
              >
                <div className={'d-flex-v-center-h-end'}>
                  <ButtonBase
                    onClick={arraysItemsHandler({
                      arrayKey: 'employee_communication',
                      type: 'remove',
                      index,
                    })}
                    className="btns-icon theme-transparent c-error"
                    disabled={isLoading || isDisabledSaving}
                  >
                    <i className="fas fa-trash fa-xs  " />
                  </ButtonBase>
                </div>
                <SharedAPIAutocompleteControl
                  isHalfWidth
                  title="communication-type"
                  editValue={item.communication_type}
                  idRef={`communicationTypeAutocompleteRef-${index}`}
                  titleKey="title"
                  uniqueKey="code"
                  errors={errors}
                  searchKey="query"
                  parentIndex={index}
                  parentId="employee_communication"
                  stateKey="communication_type"
                  isDisabled={isLoading || isDisabledSaving}
                  isSubmitted={isSubmitted}
                  errorPath={`employee_communication[${index}].communication_type`}
                  placeholder="select-communication-type"
                  getDataAPI={BinzagerSapGetDropdown}
                  onValueChanged={onStateChanged}
                  translationPath={translationPath}
                  parentTranslationPath={parentTranslationPath}
                  extraProps={{
                    slug: BinzagerSapSlugTypesEnum.sapCommunicationTypes.key,
                  }}
                />
                <SharedInputControl
                  isHalfWidth
                  title={'identification'}
                  editValue={item.identification}
                  isDisabled={isLoading || isDisabledSaving}
                  isSubmitted={isSubmitted}
                  errors={errors}
                  parentIndex={index}
                  stateKey="identification"
                  parentId="employee_communication"
                  errorPath={`employee_communication[${index}].identification`}
                  onValueChanged={onStateChanged}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              </div>
            ))}
          </div>
          <hr className={'mb-0 my-1'} />
          <div className="d-flex flex-wrap gap-1">
            <div className={'d-flex-v-center-h-between mb-1'}>
              <span>{t(`${translationPath}employee-wage`)}</span>
              <ButtonBase
                onClick={arraysItemsHandler({
                  arrayKey: 'employee_wage',
                  type: 'add',
                })}
                disabled
                className="btns-icon theme-transparent c-primary"
              >
                <span className="fas fa-plus fa-lg" />
              </ButtonBase>
            </div>

            {state.employee_wage.map((item, index) => (
              <div
                className={'d-flex flex-wrap  b-sap-item-card'}
                key={`field-education-${index}`}
              >
                <div className={'d-flex-v-center-h-end'}>
                  <ButtonBase
                    onClick={arraysItemsHandler({
                      arrayKey: 'employee_wage',
                      type: 'remove',
                      index,
                    })}
                    disabled
                    className="btns-icon theme-transparent c-error"
                  >
                    <i className="fas fa-trash fa-xs  " />
                  </ButtonBase>
                </div>
                <SharedAPIAutocompleteControl
                  isHalfWidth
                  title="wage-type"
                  editValue={item.wage_type}
                  idRef={`wageTypeAutocompleteRef-${index}`}
                  titleKey="title"
                  uniqueKey="code"
                  errors={errors}
                  searchKey="query"
                  parentIndex={index}
                  parentId="employee_wage"
                  stateKey="wage_type"
                  isDisabled={true}
                  isSubmitted={isSubmitted}
                  errorPath={`employee_wage[${index}].wage_type`}
                  placeholder="select-wage-type"
                  getDataAPI={BinzagerSapGetDropdown}
                  onValueChanged={onStateChanged}
                  translationPath={translationPath}
                  parentTranslationPath={parentTranslationPath}
                  extraProps={{
                    slug: BinzagerSapSlugTypesEnum.sapWageType.key,
                  }}
                />
                <SharedInputControl
                  isHalfWidth
                  title={'amount'}
                  editValue={item.amount}
                  isDisabled={true}
                  isSubmitted={isSubmitted}
                  errors={errors}
                  parentIndex={index}
                  stateKey="amount"
                  parentId="employee_wage"
                  errorPath={`employee_wage[${index}].amount`}
                  onValueChanged={onStateChanged}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              </div>
            ))}
          </div>
          <hr className={'mb-0 my-1'} />
          <div className="d-flex flex-wrap gap-1">
            <div className={'d-flex-v-center-h-between mb-1'}>
              <span>{t(`${translationPath}employee-education`)}</span>
              <ButtonBase
                onClick={arraysItemsHandler({
                  arrayKey: 'employee_education',
                  type: 'add',
                })}
                className="btns-icon theme-transparent c-primary"
                disabled={isLoading || isDisabledSaving}
              >
                <span className="fas fa-plus fa-lg" />
              </ButtonBase>
            </div>
            {state.employee_education.map((item, index) => (
              <div
                className={'d-flex flex-wrap  b-sap-item-card'}
                key={`field-education-${index}`}
              >
                <div className={'d-flex-v-center-h-end'}>
                  <ButtonBase
                    onClick={arraysItemsHandler({
                      arrayKey: 'employee_education',
                      type: 'remove',
                      index,
                    })}
                    className="btns-icon theme-transparent c-error"
                    disabled={isLoading || isDisabledSaving}
                  >
                    <i className="fas fa-trash fa-xs  " />
                  </ButtonBase>
                </div>

                <SharedAPIAutocompleteControl
                  isHalfWidth
                  title="education-type"
                  editValue={item.education_type}
                  idRef={`educationTypeAutocompleteRef-${index}`}
                  errors={errors}
                  parentIndex={index}
                  parentId="employee_education"
                  stateKey="education_type"
                  isDisabled={isLoading || isDisabledSaving}
                  isSubmitted={isSubmitted}
                  errorPath={`employee_education[${index}].education_type`}
                  placeholder="select-education-type"
                  searchKey="search"
                  getDataAPI={GetAllSetupsDegreeTypes}
                  extraProps={{
                    company_uuid: candidateDetail.identity.company_uuid,
                    ...(item.education_type && {
                      with_than: [item.education_type],
                    }),
                  }}
                  getOptionLabel={(option) =>
                    option.name[i18next.language] || option.name.en
                  }
                  onValueChanged={onStateChanged}
                  translationPath={translationPath}
                  parentTranslationPath={parentTranslationPath}
                />
                <SharedInputControl
                  isHalfWidth
                  title={'major'}
                  editValue={item.major}
                  isDisabled={isLoading || isDisabledSaving}
                  isSubmitted={isSubmitted}
                  errors={errors}
                  parentIndex={index}
                  stateKey="major"
                  parentId="employee_education"
                  errorPath={`employee_education[${index}].major`}
                  onValueChanged={onStateChanged}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
                <SharedAPIAutocompleteControl
                  isHalfWidth
                  title="grade"
                  editValue={item.grade}
                  idRef={`gradeAutocompleteRef-${index}`}
                  titleKey="title"
                  uniqueKey="code"
                  errors={errors}
                  searchKey="query"
                  parentIndex={index}
                  parentId="employee_education"
                  stateKey="grade"
                  isDisabled={isLoading || isDisabledSaving}
                  isSubmitted={isSubmitted}
                  errorPath={`employee_education[${index}].grade`}
                  placeholder="select-grade"
                  getDataAPI={BinzagerSapGetDropdown}
                  onValueChanged={onStateChanged}
                  translationPath={translationPath}
                  parentTranslationPath={parentTranslationPath}
                  extraProps={{
                    slug: BinzagerSapSlugTypesEnum.sapGrades.key,
                  }}
                />
                <SharedAutocompleteControl
                  isHalfWidth
                  title={'gpa'}
                  editValue={item.gpa}
                  isDisabled={isLoading || isDisabledSaving}
                  isSubmitted={isSubmitted}
                  errors={errors}
                  isStringArray={true}
                  getOptionLabel={(option) => option}
                  initValues={gpaValues}
                  parentIndex={index}
                  stateKey="gpa"
                  parentId="employee_education"
                  errorPath={`employee_education[${index}].gpa`}
                  onValueChanged={onStateChanged}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />

                <SharedInputControl
                  isHalfWidth
                  title={'gpa-percent'}
                  editValue={item.gpa_percent}
                  isDisabled={isLoading || isDisabledSaving}
                  isSubmitted={isSubmitted}
                  errors={errors}
                  parentIndex={index}
                  stateKey="gpa_percent"
                  parentId="employee_education"
                  errorPath={`employee_education[${index}].gpa_percent`}
                  onValueChanged={onStateChanged}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
                <SharedInputControl
                  isHalfWidth
                  title={'year'}
                  editValue={item.year}
                  isDisabled={isLoading || isDisabledSaving}
                  isSubmitted={isSubmitted}
                  errors={errors}
                  parentIndex={index}
                  stateKey="year"
                  parentId="employee_education"
                  errorPath={`employee_education[${index}].year`}
                  onValueChanged={onStateChanged}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
                <SharedAPIAutocompleteControl
                  isHalfWidth
                  title="country-key"
                  editValue={item.country}
                  idRef="countryAutocompleteRef"
                  errors={errors}
                  parentIndex={index}
                  stateKey={'country'}
                  parentId="employee_education"
                  errorPath={`employee_education[${index}].country`}
                  isDisabled={isLoading || isDisabledSaving}
                  isSubmitted={isSubmitted}
                  placeholder="select-country-key"
                  searchKey="search"
                  getDataAPI={GetAllSetupsCountries}
                  extraProps={{
                    company_uuid: candidateDetail.identity.company_uuid,
                    ...(item.country && { with_than: [item.country] }),
                  }}
                  getOptionLabel={(option) =>
                    option.name[i18next.language] || option.name.en
                  }
                  onValueChanged={onStateChanged}
                  translationPath={translationPath}
                  parentTranslationPath={parentTranslationPath}
                />

                <SharedInputControl
                  isHalfWidth
                  title={'school-name'}
                  editValue={item.school_name}
                  isDisabled={isLoading || isDisabledSaving}
                  isSubmitted={isSubmitted}
                  errors={errors}
                  parentIndex={index}
                  stateKey="school_name"
                  parentId="employee_education"
                  errorPath={`employee_education[${index}].school_name`}
                  onValueChanged={onStateChanged}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              </div>
            ))}
          </div>
          <hr className={'mb-0 my-1'} />
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

BinzagerSAPTab.propTypes = {
  job_candidate_uuid: PropTypes.string.isRequired,
  candidateDetail: PropTypes.instanceOf(Object),
  currentJob: PropTypes.instanceOf(Object),
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};

export default BinzagerSAPTab;
