// Import React Components
import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LicensingAuthoritySection from './sections/LicensingAuthority.Section';
import './DataFlowPage.Style.scss';
import { GetAllCandidatesSearchDB, CreateCandidateCase } from 'services';
import {
  SharedAPIAutocompleteControl,
  SetupsReducer,
  SetupsReset,
} from 'pages/setups/shared';
import PackageDetailsSection from './sections/PackageDetails.Section';
import EducationDetailsSection from './sections/EducationDetails.Section';
import EmploymentDetailsSection from './sections/EmploymentDetails.Section';
import HealthLicenseDetailsSection from './sections/HealthLicenseDetails.Section';
import { ButtonBase } from '@mui/material';
import { showSuccess, getErrorByName, showError } from 'helpers';
import * as yup from 'yup';
import PersonalDetailsSection from './sections/PersonalDetails.Section';
import { RadiosComponent } from 'components';

const parentTranslationPath = 'DataFlowPage';

const DataFlowPage = () => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [created, setCreated] = useState(null);
  const stateInitRef = useRef({
    candidate_uuid: null,
    candidate_type: 'new',
    package: null,
    education: [
      {
        authority_name: '',
        authority_country: '',
        qualification_attend: '',
        qualification_date: '',
        name_as_per_certificate: '',
        files: [
          {
            name: '',
            category: '',
          },
        ],
      },
    ],
    employment: {
      authority_name: '',
      authority_state: '',
      authority_country: '',
      last_designation: '',
      nature_of_employment: '',
      name_as_per_document: '',
      period_from: '',
      period_to: '',
      files: [
        {
          name: '',
          category: '',
        },
      ],
    },
    health: {
      authority_name: '',
      authority_address: '',
      authority_city: '',
      authority_state: '',
      authority_country: '',
      authority_phone_type: '',
      authority_country_code: '',
      authority_state_code: '',
      authority_telephone_number: '',
      authority_mail: '',
      authority_website: '',
      applicant_name_per_document: '',
      licence_type: '',
      licence_attend: '',
      licence_number: '',
      licence_conferred_date: '',
      licence_expired_date: '',
      licence_status: '',
      bar_code: '',
      component_label: '',
      files: [
        {
          name: '',
          category: '',
        },
      ],
    },
    referential: {
      application_type: '',
      case_type: '',
      category: '',
      sub_category: '',
      service_type: '',
    },
    personal: {
      firstname: '',
      lastname: '',
      date_of_birth: '',
      passport_number: '',
      mail: '',
      country_code: '', // 0
      country_code_id: '', // 0
      telephone_number: '',
      passport_country_id: '', // 0
      nationality_id: '', // 0
      files: [
        {
          name: '',
          category: '',
        },
      ],
    },
    // passport: {
    //   files: [],
    // }
  });

  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is send new value for state from child
   */
  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  const onSaveHandler = useCallback(async () => {
    setIsSubmitted(true);
    if (Object.keys(errors).length) return;
    setIsLoading(true);

    const response = await CreateCandidateCase({
      ...state,
      personal: {
        ...state.personal,
        files: state.personal?.files
          .filter((it) => it.category?.uuid)
          .map((it) => ({
            category: it?.category.name?.en,
            media_uuid: it?.media_uuid,
          })),
        country_code:
          (state.personal.country_code && parseInt(state.personal.country_code))
          || 0,
        country_code_id:
          (state.personal.country_code_id
            && parseInt(state.personal.country_code_id))
          || 0,
        passport_country_id:
          (state.personal.passport_country_id
            && parseInt(state.personal.passport_country_id))
          || 0,
        nationality_id:
          (state.personal.nationality_id
            && parseInt(state.personal.nationality_id))
          || 0,
      },
      education: state.education.map((item) => ({
        ...item,
        authority_name: item?.authority_name?.name?.en || item?.authority_name,
        files: item.files
          .filter((it) => it.category?.uuid)
          .map((it) => ({
            category: it?.category.name?.en,
            media_uuid: it?.media_uuid,
          })),
      })),
      employment: {
        ...state.employment,
        authority_name:
          state.employment?.authority_name?.name?.en
          || state.employment?.authority_name,
        files: state.employment?.files
          .filter((it) => it.category?.uuid)
          .map((it) => ({
            category: it?.category.name?.en,
            media_uuid: it?.media_uuid,
          })),
      },
      health: {
        ...state.health,
        authority_name:
          state.health?.authority_name?.name?.en || state.health?.authority_name,
        files: state.health?.files
          .filter((it) => it.category?.uuid)
          .map((it) => ({
            category: it?.category.name?.en,
            media_uuid: it?.media_uuid,
          })),
      },
      referential: {
        ...state.referential,
        application_type:
          state.referential?.application_type?.name?.en
          || state.referential?.application_type,
        case_type:
          state.referential?.case_type?.name?.en || state.referential?.case_type,
        category:
          state.referential?.category?.name?.en || state.referential?.category,
        sub_category:
          state.referential?.sub_category?.name?.en
          || state.referential?.sub_category,
        service_type:
          state.referential?.service_type?.name?.en
          || state.referential?.service_type,
      },
    });
    setIsLoading(false);
    if (response?.status === 201 || response?.status === 200) {
      showSuccess('Case created successfully');
      setCreated(response.data);
    } else showError('Failed to create a case!');
  }, [errors, state]);

  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: yup
          .object()
          .shape({
            package: yup
              .object()
              .shape({
                uuid: yup.string().nullable().required(t('this-field-is-required')),
                name: yup
                  .object()
                  .shape({
                    en: yup
                      .string()
                      .nullable()
                      .required(t('this-field-is-required')),
                    ar: yup
                      .string()
                      .nullable()
                      .required(t('this-field-is-required')),
                  })
                  .required(t('this-field-is-required')),
                sections: yup.array().nullable(),
              })
              .nullable()
              .required(t('this-field-is-required')),
            employment: yup.lazy((value, { parent }) => {
              if (parent.package?.sections?.includes('employment'))
                return yup
                  .object()
                  .shape({
                    authority_name: yup.lazy((value) => {
                      if (value)
                        return yup
                          .object()
                          .shape({
                            uuid: yup
                              .string()
                              .nullable()
                              .required(t('this-field-is-required')),
                          })
                          .nullable();
                      else
                        return yup
                          .string()
                          .nullable()
                          .required(t('this-field-is-required'));
                    }),
                    authority_state: yup
                      .string()
                      .nullable()
                      .required(t('this-field-is-required')),
                    authority_country: yup
                      .string()
                      .nullable()
                      .required(t('this-field-is-required')),
                    last_designation: yup
                      .string()
                      .nullable()
                      .required(t('this-field-is-required')),
                    nature_of_employment: yup
                      .string()
                      .nullable()
                      .required(t('this-field-is-required')),
                    name_as_per_document: yup
                      .string()
                      .nullable()
                      .required(t('this-field-is-required')),
                    period_from: yup
                      .string()
                      .nullable()
                      .required(t('this-field-is-required')),
                    period_to: yup
                      .string()
                      .nullable()
                      .required(t('this-field-is-required')),
                    files: yup
                      .array()
                      .of(
                        yup.object().shape({
                          name: yup
                            .string()
                            .nullable()
                            .required(t('this-field-is-required')),
                          category: yup.lazy((value) => {
                            if (value?.uuid)
                              return yup
                                .object()
                                .shape({
                                  uuid: yup
                                    .string()
                                    .nullable()
                                    .required(t('this-field-is-required')),
                                })
                                .nullable();
                            else
                              return yup
                                .string()
                                .nullable()
                                .required(t('this-field-is-required'));
                          }),
                        }),
                      )
                      .min(1, 'Please at least add one file'),
                  })
                  .nullable();
              else return yup.object().nullable();
            }),
            education: yup.lazy((value, { parent }) => {
              if (parent.package?.sections?.includes('education'))
                return yup
                  .array()
                  .min(1)
                  .of(
                    yup.object().shape({
                      authority_name: yup.lazy((value) => {
                        if (value)
                          return yup
                            .object()
                            .shape({
                              uuid: yup
                                .string()
                                .nullable()
                                .required(t('this-field-is-required')),
                            })
                            .nullable();
                        else
                          return yup
                            .string()
                            .nullable()
                            .required(t('this-field-is-required'));
                      }),
                      authority_country: yup
                        .string()
                        .nullable()
                        .required(t('this-field-is-required')),
                      qualification_attend: yup
                        .string()
                        .nullable()
                        .required(t('this-field-is-required')),
                      qualification_date: yup
                        .string()
                        .nullable()
                        .required(t('this-field-is-required')),
                      name_as_per_certificate: yup
                        .string()
                        .nullable()
                        .required(t('this-field-is-required')),
                      files: yup
                        .array()
                        .of(
                          yup.object().shape({
                            name: yup
                              .string()
                              .nullable()
                              .required(t('this-field-is-required')),
                            category: yup.lazy((value) => {
                              if (value?.uuid)
                                return yup
                                  .object()
                                  .shape({
                                    uuid: yup
                                      .string()
                                      .nullable()
                                      .required(t('this-field-is-required')),
                                  })
                                  .nullable();
                              else
                                return yup
                                  .string()
                                  .nullable()
                                  .required(t('this-field-is-required'));
                            }),
                          }),
                        )
                        .min(1, 'Please at least add one file'),
                    }),
                  )
                  .nullable();
              else return yup.array().nullable();
            }),
            health: yup.lazy((value, { parent }) => {
              if (parent.package?.sections?.includes('health'))
                return yup
                  .object()
                  .shape({
                    authority_name: yup.lazy((value) => {
                      if (value)
                        return yup
                          .object()
                          .shape({
                            uuid: yup
                              .string()
                              .nullable()
                              .required(t('this-field-is-required')),
                          })
                          .nullable();
                      else
                        return yup
                          .string()
                          .nullable()
                          .required(t('this-field-is-required'));
                    }),
                    authority_address: yup.string().nullable(),
                    authority_city: yup.string().nullable(),
                    authority_state: yup.string().nullable(),
                    authority_country: yup
                      .string()
                      .nullable()
                      .required(t('this-field-is-required')),
                    authority_phone_type: yup.string().nullable(),
                    authority_country_code: yup.string().nullable(),
                    authority_state_code: yup.string().nullable(),
                    authority_telephone_number: yup.string().nullable(),
                    authority_mail: yup.string().nullable(),
                    authority_website: yup.string().nullable(),
                    applicant_name_per_document: yup
                      .string()
                      .nullable()
                      .required(t('this-field-is-required')),
                    licence_type: yup
                      .string()
                      .nullable()
                      .required(t('this-field-is-required')),
                    licence_attend: yup
                      .string()
                      .nullable()
                      .required(t('this-field-is-required')),
                    licence_number: yup
                      .string()
                      .nullable()
                      .required(t('this-field-is-required')),
                    licence_conferred_date: yup
                      .string()
                      .nullable()
                      .required(t('this-field-is-required')),
                    licence_expired_date: yup
                      .string()
                      .nullable()
                      .required(t('this-field-is-required')),
                    licence_status: yup
                      .string()
                      .nullable()
                      .required(t('this-field-is-required')),
                    bar_code: yup.string().nullable(),
                    component_label: yup.string().nullable(),
                    files: yup
                      .array()
                      .of(
                        yup.object().shape({
                          name: yup
                            .string()
                            .nullable()
                            .required(t('this-field-is-required')),
                          category: yup.lazy((value) => {
                            if (value?.uuid)
                              return yup
                                .object()
                                .shape({
                                  uuid: yup
                                    .string()
                                    .nullable()
                                    .required(t('this-field-is-required')),
                                })
                                .nullable();
                            else
                              return yup
                                .string()
                                .nullable()
                                .required(t('this-field-is-required'));
                          }),
                        }),
                      )
                      .min(1, 'Please at least add one file'),
                  })
                  .nullable();
              else return yup.object().nullable();
            }),
            referential: yup
              .object()
              .shape({
                application_type: yup.lazy((value) => {
                  if (value)
                    return yup
                      .object()
                      .shape({
                        uuid: yup
                          .string()
                          .nullable()
                          .required(t('this-field-is-required')),
                      })
                      .nullable();
                  else
                    return yup
                      .string()
                      .nullable()
                      .required(t('this-field-is-required'));
                }),
                case_type: yup.lazy((value) => {
                  if (value)
                    return yup
                      .object()
                      .shape({
                        uuid: yup
                          .string()
                          .nullable()
                          .required(t('this-field-is-required')),
                      })
                      .nullable();
                  else
                    return yup
                      .string()
                      .nullable()
                      .required(t('this-field-is-required'));
                }),
                category: yup.lazy((value) => {
                  if (value)
                    return yup
                      .object()
                      .shape({
                        uuid: yup
                          .string()
                          .nullable()
                          .required(t('this-field-is-required')),
                      })
                      .nullable();
                  else
                    return yup
                      .string()
                      .nullable()
                      .required(t('this-field-is-required'));
                }),
                sub_category: yup.lazy((value) => {
                  if (value)
                    return yup
                      .object()
                      .shape({
                        uuid: yup
                          .string()
                          .nullable()
                          .required(t('this-field-is-required')),
                      })
                      .nullable();
                  else
                    return yup
                      .string()
                      .nullable()
                      .required(t('this-field-is-required'));
                }),
                service_type: yup.lazy((value) => {
                  if (value)
                    return yup
                      .object()
                      .shape({
                        uuid: yup
                          .string()
                          .nullable()
                          .required(t('this-field-is-required')),
                      })
                      .nullable();
                  else
                    return yup
                      .string()
                      .nullable()
                      .required(t('this-field-is-required'));
                }),
              })
              .nullable(),
            personal: yup
              .object()
              .shape({
                firstname: yup
                  .string()
                  .nullable()
                  .required(t('this-field-is-required'))
                  .matches(/^[a-z]+$/gi, t('alpha-only')),
                lastname: yup
                  .string()
                  .nullable()
                  .required(t('this-field-is-required')),
                date_of_birth: yup
                  .string()
                  .nullable()
                  .required(t('this-field-is-required')),
                passport_number: yup
                  .string()
                  .nullable()
                  .required(t('this-field-is-required'))
                  .matches(
                    /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/gi,
                    t('alpha-numeric-both'),
                  ),
                mail: yup.string().nullable().required(t('this-field-is-required')),
                country_code: yup.lazy((value) => {
                  if (value === '')
                    return yup
                      .string()
                      .nullable()
                      .required(t('this-field-is-required'));
                  else
                    return yup
                      .number()
                      .nullable()
                      .required(t('this-field-is-required'));
                }),
                country_code_id: yup.lazy((value) => {
                  if (value === '')
                    return yup
                      .string()
                      .nullable()
                      .required(t('this-field-is-required'));
                  else
                    return yup
                      .number()
                      .nullable()
                      .required(t('this-field-is-required'));
                }),
                telephone_number: yup
                  .string()
                  .min(7, t('phone-number-min-validation'))
                  .max(11, t('phone-number-max-validation'))
                  .nullable()
                  .required(t('this-field-is-required')),
                passport_country_id: yup.lazy((value) => {
                  if (value === '')
                    return yup
                      .string()
                      .nullable()
                      .required(t('this-field-is-required'));
                  else
                    return yup
                      .number()
                      .nullable()
                      .required(t('this-field-is-required'));
                }),
                nationality_id: yup.lazy((value) => {
                  if (value === '')
                    return yup
                      .string()
                      .nullable()
                      .required(t('this-field-is-required'));
                  else
                    return yup
                      .number()
                      .nullable()
                      .required(t('this-field-is-required'));
                }),
                files: yup
                  .array()
                  .of(
                    yup.object().shape({
                      name: yup
                        .string()
                        .nullable()
                        .required(t('this-field-is-required')),
                      category: yup.lazy((value) => {
                        if (value?.uuid)
                          return yup
                            .object()
                            .shape({
                              uuid: yup.string().nullable(),
                            })
                            .nullable();
                        else return yup.string().nullable();
                      }),
                    }),
                  )
                  .min(1, 'Please at least add one file'),
              })
              .nullable(),
          })
          .nullable(),
      },
      state,
    ).then((result) => {
      setErrors(result);
    });
  }, [state, t]);

  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  return (
    <div className="m-4">
      <div className="page-header-wrapper px-3 pb-3">
        <span className="header-text-x2 d-flex mb-1">{t('create-new-case')}</span>
        <span className="description-text">{t('create-case-description')}</span>
      </div>
      {created ? (
        <div className="d-flex-center">
          <div className="my-4">
            <div className="description-text">{t('create-another-case-text')}</div>
            <div className="fw-bold my-2">{`CRN: ${created.CRN}`}</div>
            <div className="my-2">{created.MESSAGE}</div>
            <div className="my-2">
              {`Payment url: `}
              <a href={created.PAYMENTURL}>{created.PAYMENTURL}</a>
            </div>
            <ButtonBase
              onClick={() => {
                setCreated(null);
                onStateChanged({ id: 'edit', value: stateInitRef.current });
                setIsSubmitted(false);
              }}
              className="btns theme-solid p-2 my-2"
            >
              <span>{t('create-another-case')}</span>
            </ButtonBase>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-2">
            <RadiosComponent
              idRef="filter"
              valueInput="value"
              labelInput="label"
              themeClass="theme-line"
              value={state.candidate_type}
              data={[
                {
                  label: t('new-candidate'),
                  value: 'new',
                },
                {
                  label: t('existing-candidate'),
                  value: 'existing',
                },
              ]}
              onSelectedRadioChanged={(e, value) =>
                onStateChanged({ id: 'candidate_type', value })
              }
              parentTranslationPath={parentTranslationPath}
            />
          </div>
          {state.candidate_type === 'existing' && (
            <SharedAPIAutocompleteControl
              isEntireObject
              dataKey="candidates"
              // isHalfWidth={!isFullWidth}
              // isFullWidth={isFullWidth}
              isHalfWidth
              title="candidate"
              errors={errors}
              stateKey="candidate_uuid"
              errorPath="candidate_uuid"
              searchKey="search"
              placeholder="candidate"
              isDisabled={isLoading}
              editValue={state.candidate_uuid}
              isSubmitted={isSubmitted}
              onValueChanged={(newValue) => {
                onStateChanged({
                  ...newValue,
                  id: 'personal',
                  value: newValue.value,
                });
              }}
              getDataAPI={GetAllCandidatesSearchDB}
              extraProps={{
                ...(state.candidate_uuid && { with_than: [state.candidate_uuid] }),
              }}
              parentTranslationPath={parentTranslationPath}
              getOptionLabel={(option) =>
                `${option?.first_name || ''} ${option?.last_name || ''}`
              }
            />
          )}
          <div className="m-2">
            <PersonalDetailsSection
              parentTranslationPath={parentTranslationPath}
              state={state}
              errors={errors}
              isSubmitted={isSubmitted}
              onStateChanged={onStateChanged}
              isLoading={isLoading}
            />
            <LicensingAuthoritySection
              parentTranslationPath={parentTranslationPath}
              state={state}
              errors={errors}
              isSubmitted={isSubmitted}
              onStateChanged={onStateChanged}
              isLoading={isLoading}
            />
            <PackageDetailsSection
              parentTranslationPath={parentTranslationPath}
              state={state}
              errors={errors}
              isSubmitted={isSubmitted}
              onStateChanged={onStateChanged}
              isLoading={isLoading}
            />
            {state.package && state.package?.sections?.includes('education') && (
              <EducationDetailsSection
                parentTranslationPath={parentTranslationPath}
                state={state}
                errors={errors}
                isSubmitted={isSubmitted}
                onStateChanged={onStateChanged}
                isLoading={isLoading}
              />
            )}
            {state.package && state.package?.sections?.includes('employment') && (
              <EmploymentDetailsSection
                parentTranslationPath={parentTranslationPath}
                state={state}
                errors={errors}
                isSubmitted={isSubmitted}
                onStateChanged={onStateChanged}
                isLoading={isLoading}
              />
            )}
            {state.package && state.package?.sections?.includes('health') && (
              <HealthLicenseDetailsSection
                parentTranslationPath={parentTranslationPath}
                state={state}
                errors={errors}
                isSubmitted={isSubmitted}
                onStateChanged={onStateChanged}
                isLoading={isLoading}
              />
            )}
            <div className="d-flex-v-center-h-end">
              <ButtonBase onClick={onSaveHandler} className="btns theme-solid p-2">
                <span>{t('create-case')}</span>
              </ButtonBase>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataFlowPage;
