import React, { useState, useCallback, useEffect, useRef, useReducer } from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import * as yup from 'yup';
import Loader from 'components/Elevatus/Loader';
import { useTranslation } from 'react-i18next';
// import { hiringFields } from './dummyData';
import {
  SharedInputControl,
  // SharedAutocompleteControl,
  SetupsReducer,
  SetupsReset,
  SharedAPIAutocompleteControl,
} from 'pages/setups/shared';
import { CheckboxesComponent, RadiosComponent, DialogComponent } from 'components';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  ButtonBase,
} from '@mui/material';
import {
  UpdateCandidateHiringData,
  SendCandidateHiringData,
  GetCandidateHiringData,
  DynamicService,
} from 'services';
import {
  showError,
  showSuccess,
  getErrorByName,
  GlobalDateFormat,
  // GlobalSavingHijriDateFormat,
  // GlobalSavingDateFormat,
} from 'helpers';
// import { PipelineStagesEnum } from 'enums';
import {
  alphabetsWithApostropheExpression,
  numbersExpression,
  phoneExpression,
} from 'utils';
// import Datepicker from 'components/Elevatus/Datepicker';
import { HiringStatusesEnums } from 'enums/Shared/HiringStatuses.Enum';
import DatePickerComponent from '../../../../Datepicker/DatePicker.Component';
import moment from 'moment-hijri';

export const HiringTab = ({
  job_uuid,
  candidateDetail,
  parentTranslationPath,
  // stages,
  // stage_uuid,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState([]);
  const [filter, setFilter] = useState({});
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  // const [isConfirmSaveOpen, setIsConfirmSaveOpen] = useState(false);
  const [expandedAccordions, setExpandedAccordions] = useState([]);

  const stateInitRef = useRef({
    employee_number: null,
    fields: [],
  });
  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  const onStateChanged = useCallback((newValue) => {
    setState(newValue);
  }, []);

  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: yup.object().shape({
          information: yup.array().of(
            yup.object().shape({
              name: yup.string().required(t('this-field-is-required')),
              fields: yup.array().of(
                yup.object().shape({
                  type: yup.string().required(t('this-field-is-required')),
                  code: yup.string().required(t('this-field-is-required')),
                  is_required: yup.boolean().required(t('this-field-is-required')),
                  value: yup.lazy((fieldVal, { parent }) => {
                    // TODO: When backend fix checkbox login uncomment this code
                    // if(parent.type === 'checkbox' && parent.is_required) return yup.array().nullable().min(1, `${t('please-select-at-least')}`);
                    // else if(parent.type === 'checkbox' && !parent.is_required) return yup.array().nullable();
                    // else if(parent.is_required) return yup.string().nullable().required(t('this-field-is-required'));
                    // else return yup.string().nullable();
                    if (!parent.is_visible) return yup.string().nullable();
                    if (parent.is_required && !fieldVal && !fieldVal === 0)
                      return yup
                        .string()
                        .nullable()
                        .required(
                          `${parent.label[i18next.language] || parent.label.en} ${t(
                            'Shared:is-required',
                          )}`,
                        );
                    if (
                      parent.type === 'text'
                      && parent.code === 'emer_contact_per_code'
                    )
                      return yup
                        .string()
                        .nullable()
                        .matches(alphabetsWithApostropheExpression, {
                          message: t('Shared:invalid-format'),
                          excludeEmptyString: true,
                        });
                    if (
                      parent.type === 'text'
                      && parent.code === 'emer_contact_phone_code'
                    )
                      return yup
                        .string()
                        .nullable()
                        .matches(phoneExpression, {
                          message: t('Shared:invalid-phone-number'),
                          excludeEmptyString: true,
                        })
                        .matches(numbersExpression, {
                          message: t('Shared:invalid-number'),
                          excludeEmptyString: true,
                        });
                    else return yup.string().nullable();
                  }),
                }),
              ),
            }),
          ),
        }),
      },
      state,
    ).then((result) => {
      setErrors(result);
    });
  }, [state, t]);

  const getHiringFields = useCallback(async () => {
    setIsLoading(true);
    const response = await GetCandidateHiringData({
      candidate_uuid: candidateDetail?.identity?.uuid,
      job_uuid,
    });
    setIsLoading(false);
    // onStateChanged({ id:'edit', value: hiringFields })
    if (response?.status === 200 || response?.status === 201)
      onStateChanged({
        id: 'edit',
        value: {
          ...response.data?.results,
          information: response.data?.results?.information?.map((section) => ({
            ...section,
            fields: section?.fields?.map((field) => ({
              ...field,
              value:
                field?.value || field?.value === 0
                  ? field?.value
                  : field?.default_value,
            })),
          })),
        },
      });
    else showError('Failed to get data');
  }, [candidateDetail, job_uuid, onStateChanged]);
  console.log({ state });
  const saveHandler = async () => {
    setIsSubmitted(true);
    // const keys = Object.keys(errors);
    // if (keys?.length) {
    //   const expanded = [];
    //   keys.forEach((key) => {
    //     expanded.push(parseInt(key?.slice(12, 13)));
    //   });
    //   setExpandedAccordions(expanded);
    //   return;
    // }
    setIsLoading(true);
    const response = await UpdateCandidateHiringData({
      ...state,
      information: state.information?.map((section) => ({
        ...section,
        fields: section?.fields?.map((field) => ({
          ...field,
          value:
            field?.value || field?.value === 0 ? field?.value : field?.default_value,
        })),
      })),
    });
    setIsLoading(false);
    if (response?.status === 200 || response?.status === 201) {
      showSuccess('Data saved successfully');
      setFilter((items) => ({ ...items }));
      setExpandedAccordions([]);
      // setIsConfirmSaveOpen(false);
    } else showError('Failed to save data');
  };

  // const getCandidateStageType = useMemo(
  //   () => stages && stages?.find((stage) => stage.uuid === stage_uuid)?.type,
  //   [stage_uuid, stages]
  // );

  const expandErrors = useCallback(
    (dialogCloseState) => {
      setIsSubmitted(true);
      const keys = Object.keys(errors);
      if (keys?.length) {
        // setIsConfirmSaveOpen(true);
        const expanded = [];
        keys.forEach((key) => {
          expanded.push(parseInt(key?.slice(12, 13)));
        });
        setExpandedAccordions(expanded);
        dialogCloseState(false);
      }
    },
    [errors],
  );

  const sendHandler = async () => {
    setIsLoading(true);
    setIsSubmitted(true);
    const keys = Object.keys(errors);
    if (keys?.length) {
      const expanded = [];
      keys.forEach((key) => {
        expanded.push(parseInt(key?.slice(12, 13)));
      });
      setExpandedAccordions(expanded);
      setIsSendDialogOpen(false);
      setIsLoading(false);
      return;
    }
    const saveResponse = await UpdateCandidateHiringData({ ...state });
    if (saveResponse?.status === 200 || saveResponse?.status === 201) {
      const response = await SendCandidateHiringData({
        candidate_uuid: candidateDetail?.identity?.uuid,
        job_uuid,
      });
      setIsLoading(false);
      setExpandedAccordions([]);
      if (response?.status === 200 || response?.status === 201) {
        showSuccess('Data sent successfully');
        setFilter((items) => ({ ...items }));
        setIsSendDialogOpen(false);
      } else
        showError(
          (response && response.data.reason.response) || 'Failed to send data',
        );
    } else {
      showError('Failed to save data', saveResponse);
      setIsLoading(false);
    }
  };

  const getDynamicServicePropertiesHandler = useCallback(
    // eslint-disable-next-line max-len
    ({ apiFilter, apiSearch, apiExtraProps }) => ({
      ...(apiExtraProps || {}),
      params: {
        ...((apiExtraProps && apiExtraProps.params) || {}),
        ...(apiFilter || {}),
        query: apiSearch || null,
      },
    }),
    [],
  );

  useEffect(() => {
    if (candidateDetail?.identity?.uuid && job_uuid) getHiringFields();
  }, [getHiringFields, filter, candidateDetail, job_uuid]);

  useEffect(() => {
    getErrors();
  }, [getErrors, state]);
  return (
    <div className="m-2 p-2">
      {isLoading && <Loader width="730px" height="49vh" speed={1} color="primary" />}
      {state?.information?.length > 0 && (
        <div style={{ display: isLoading && 'none' }}>
          {state.employee_number && !state.has_error_form_vendor?.status && (
            <div className="d-inline-flex header-text mb-3">
              <span>{t('employee-number')}</span>
              <span className="px-1">{state.employee_number}</span>
            </div>
          )}
          {state.has_error_form_vendor?.status && (
            <div className="d-inline-flex header-text mb-3 c-danger">
              <span>
                {t('error-from-vendor')}
                {' : '}
              </span>
              <span className="px-1">{state.has_error_form_vendor.message}</span>
            </div>
          )}

          {!state?.can_sent && (
            <div className="d-inline-flex   mb-3 c-danger">
              <span>{t('you-can-not-send-data')}</span>
            </div>
          )}

          {state?.information?.map(
            (section, sectionIdx) =>
              section.is_visible && (
                <Accordion
                  key={`field-section-${sectionIdx}`}
                  expanded={expandedAccordions.includes(sectionIdx)}
                  onChange={(e, ex) => {
                    setExpandedAccordions((items) => {
                      if (ex) return [...items, sectionIdx];
                      else return items.filter((it) => it !== sectionIdx);
                    });
                  }}
                >
                  <AccordionSummary
                    expandIcon={<span className="fas fa-chevron-down" />}
                  >
                    <div className="fw-bold">
                      {section?.title?.[i18next.language]
                        || section?.title?.en
                        || section?.name}
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="section-item-body-wrapper px-2">
                      {/* text, dropdown, checkbox, radio*/}
                      {section?.fields.map(
                        (field, fieldIdx) =>
                          field.is_visible && (
                            <div
                              key={`section-${sectionIdx}-field-${fieldIdx}`}
                              className="mb-4"
                            >
                              <div className="fw-bold mb-2">
                                {field.label?.[i18next.language] || field.label?.en}
                              </div>
                              {field.type === 'text' && (
                                <SharedInputControl
                                  isFullWidth
                                  errors={errors}
                                  stateKey="value"
                                  errorPath={`information[${sectionIdx}].fields[${fieldIdx}].value`}
                                  placeholder={
                                    field.label?.[i18next.language]
                                    || field.label?.en
                                  }
                                  isDisabled={isLoading || !field.is_editable}
                                  isSubmitted={isSubmitted}
                                  editValue={field.value}
                                  onValueChanged={onStateChanged}
                                  parentTranslationPath={parentTranslationPath}
                                  wrapperClasses="p-0"
                                  parentId="information"
                                  parentIndex={sectionIdx}
                                  subParentId="fields"
                                  subParentIndex={fieldIdx}
                                />
                              )}
                              {field.type === 'dropdown' && (
                                <SharedAPIAutocompleteControl
                                  filterOptions={(options) => options}
                                  editValue={field.value}
                                  placeholder={
                                    field.label?.[i18next.language]
                                    || field.label?.en
                                  }
                                  stateKey="value"
                                  parentIndex={sectionIdx}
                                  parentId="information"
                                  subParentId="fields"
                                  subParentIndex={fieldIdx}
                                  errorPath={`information[${sectionIdx}].fields[${fieldIdx}].value`}
                                  isSubmitted={isSubmitted}
                                  errors={errors}
                                  isDisabled={isLoading || !field.is_editable}
                                  searchKey="query"
                                  getDataAPI={DynamicService}
                                  getAPIProperties={
                                    getDynamicServicePropertiesHandler
                                  }
                                  extraProps={{
                                    path: field?.options?.endpoint,
                                    method: field?.options?.method,
                                    params: {
                                      with_than: field?.value ? [field.value] : [],
                                    },
                                  }}
                                  getOptionLabel={(option) =>
                                    option.value
                                    || (option.title
                                      && (option.title[i18next.language]
                                        || option.title.en))
                                    || (option.name
                                      && (option.name[i18next.language]
                                        || option.name.en))
                                    || `${
                                      option.first_name
                                      && (option.first_name[i18next.language]
                                        || option.first_name.en)
                                    }${
                                      option.last_name
                                      && ` ${
                                        option.last_name[i18next.language]
                                        || option.last_name.en
                                      }`
                                    }`
                                  }
                                  parentTranslationPath={parentTranslationPath}
                                  onValueChanged={onStateChanged}
                                  isFullWidth
                                />
                                // <SharedAutocompleteControl
                                //   isFullWidth
                                //   errors={errors}
                                //   searchKey="search"
                                //   initValuesKey="uuid"
                                //   isDisabled={isLoading}
                                //   initValuesTitle="label"
                                //   isSubmitted={isSubmitted}
                                //   initValues={field.options}
                                //   stateKey='value'
                                //   errorPath={`information[${sectionIdx}].fields[${fieldIdx}].value`}
                                //   onValueChanged={onStateChanged}
                                //   editValue={field.value}
                                //   placeholder={field.label?.[i18next.language] || field.label?.en}
                                //   parentTranslationPath={parentTranslationPath}
                                //   sharedClassesWrapper='p-0'
                                //   parentId='information'
                                //   parentIndex={sectionIdx}
                                //   subParentId='fields'
                                //   subParentIndex={fieldIdx}
                                // />
                              )}
                              {field.type === 'checkbox' && (
                                <div>
                                  <CheckboxesComponent
                                    key={`section-${sectionIdx}-field-${fieldIdx}`}
                                    idRef={`section-${sectionIdx}-field-${fieldIdx}`}
                                    // TODO: When backend fix checkbox logic uncomment this code
                                    // checked={(item, index) => field?.value?.includes(item?.uuid) || false}
                                    checked={(item) =>
                                      field?.value === item?.uuid || false
                                    }
                                    onSelectedCheckboxChanged={(item, isChecked) => {
                                      // TODO: When backend fix checkbox logic uncomment this code
                                      // let vals = field.value?.filter(it => it !== item?.uuid)
                                      // if(vals && (vals?.length === field.value?.length))
                                      //   vals = [...vals, item?.uuid]
                                      // else if(!vals) vals = [item?.uuid]
                                      onStateChanged({
                                        id: 'value',
                                        value: isChecked ? item?.uuid : null,
                                        parentId: 'information',
                                        parentIndex: sectionIdx,
                                        subParentId: 'fields',
                                        subParentIndex: fieldIdx,
                                      });
                                    }}
                                    isSubmitted={isSubmitted}
                                    isDisabled={isLoading || !field.is_editable}
                                    error={
                                      errors?.[
                                        `information[${sectionIdx}].fields[${fieldIdx}].value`
                                      ]?.error
                                    }
                                    helperText={
                                      errors?.[
                                        `information[${sectionIdx}].fields[${fieldIdx}].value`
                                      ]?.message
                                    }
                                    data={field.options}
                                    getLabel={(item) => item?.label}
                                  />
                                </div>
                              )}
                              {field.type === 'radio' && (
                                <div>
                                  <RadiosComponent
                                    idRef={`radio-section-${sectionIdx}-field-${fieldIdx}`}
                                    name={field.code}
                                    labelInput="label"
                                    valueInput="uuid"
                                    value={field.value}
                                    data={field.options}
                                    parentTranslationPath={parentTranslationPath}
                                    isSubmitted={isSubmitted}
                                    isDisabled={isLoading || !field.is_editable}
                                    onSelectedRadioChanged={(event, newValue) => {
                                      onStateChanged({
                                        id: 'value',
                                        value: newValue,
                                        parentId: 'information',
                                        parentIndex: sectionIdx,
                                        subParentId: 'fields',
                                        subParentIndex: fieldIdx,
                                      });
                                    }}
                                    helperText={
                                      errors?.[
                                        `information[${sectionIdx}].fields[${fieldIdx}].value`
                                      ]?.message
                                    }
                                    error={
                                      errors?.[
                                        `information[${sectionIdx}].fields[${fieldIdx}].value`
                                      ]?.error
                                    }
                                  />
                                </div>
                              )}
                              {field.type === 'number' && (
                                <SharedInputControl
                                  isFullWidth
                                  errors={errors}
                                  stateKey="value"
                                  errorPath={`information[${sectionIdx}].fields[${fieldIdx}].value`}
                                  placeholder={
                                    field.label?.[i18next.language]
                                    || field.label?.en
                                  }
                                  isDisabled={isLoading || !field.is_editable}
                                  isSubmitted={isSubmitted}
                                  editValue={field.value || field.default_value}
                                  onValueChanged={onStateChanged}
                                  parentTranslationPath={parentTranslationPath}
                                  wrapperClasses="p-0"
                                  parentId="information"
                                  parentIndex={sectionIdx}
                                  subParentId="fields"
                                  subParentIndex={fieldIdx}
                                  pattern={numbersExpression}
                                  type="number"
                                />
                              )}
                              {field.type === 'date' && (
                                <DatePickerComponent
                                  datePickerWrapperClasses="px-0"
                                  stateKey="value"
                                  errorPath={`information[${sectionIdx}].fields[${fieldIdx}].value`}
                                  inputPlaceholder={`${t('Shared:eg')} ${moment()
                                    .locale(i18next.language)
                                    .format(GlobalDateFormat)}`}
                                  isDisabled={isLoading || !field.is_editable}
                                  isSubmitted={isSubmitted}
                                  value={field.value}
                                  maxDate={
                                    (field.code !== 'pass_expiry_date_code'
                                      && moment().toDate())
                                    || undefined
                                  }
                                  minDate={
                                    (field.code === 'hire_date'
                                      && moment().subtract(1, 'month').toDate())
                                    || undefined
                                  }
                                  onDelayedChange={onStateChanged}
                                  parentTranslationPath={parentTranslationPath}
                                  wrapperClasses="p-0"
                                  parentId="information"
                                  parentIndex={sectionIdx}
                                  subParentId="fields"
                                  subParentIndex={fieldIdx}
                                  // inputPlaceholder="YYYY-MM-DD"
                                  displayFormat={GlobalDateFormat}
                                  helperText={
                                    (errors?.[
                                      `information[${sectionIdx}].fields[${fieldIdx}].value`
                                    ]
                                      && errors?.[
                                        `information[${sectionIdx}].fields[${fieldIdx}].value`
                                      ]?.message)
                                    || undefined
                                  }
                                  error={
                                    (errors?.[
                                      `information[${sectionIdx}].fields[${fieldIdx}].value`
                                    ]
                                      && errors?.[
                                        `information[${sectionIdx}].fields[${fieldIdx}].value`
                                      ]?.error)
                                    || false
                                  }
                                />
                              )}
                            </div>
                          ),
                      )}
                    </div>
                  </AccordionDetails>
                </Accordion>
              ),
          )}
          <div className="d-flex-v-center-h-end my-4">
            <ButtonBase
              disabled={
                isLoading || state.status === HiringStatusesEnums.COMPLETED.key
              }
              onClick={() => saveHandler()}
              className="btns theme-solid mx-1 mb-2"
            >
              <span className="px-1">{t('save')}</span>
            </ButtonBase>
            <ButtonBase
              disabled={
                isLoading
                || state.status === HiringStatusesEnums.COMPLETED.key
                || !state?.can_sent
                // || PipelineStagesEnum.HIRED.key !== getCandidateStageType
              }
              onClick={() => setIsSendDialogOpen(true)}
              className="btns theme-solid mx-1 mb-2"
            >
              <span className="px-1">{t('send')}</span>
            </ButtonBase>
          </div>
        </div>
      )}
      <DialogComponent
        saveText={t('save-and-send')}
        isWithoutConfirmClasses
        isConfirm
        dialogContent={
          <div className="d-flex-column-center">
            <span>{t('send-hiring-description')}</span>
          </div>
        }
        isOpen={isSendDialogOpen}
        saveType="button"
        onSaveClicked={() => {
          const keys = Object.values(errors);
          if (keys?.length) {
            showError(t('Shared:failed-to-get-saved-data'), {
              reason: keys.map((field) => ({ error: field.message })),
            });
            expandErrors(setIsSendDialogOpen);
          } else sendHandler();
        }}
        isSaving={isLoading}
        onCloseClicked={() => setIsSendDialogOpen(false)}
        onCancelClicked={() => setIsSendDialogOpen(false)}
        parentTranslationPath={parentTranslationPath}
        isLoading={isLoading}
      />
      {/*<DialogComponent*/}
      {/*  saveText={t('save')}*/}
      {/*  isWithoutConfirmClasses*/}
      {/*  isConfirm*/}
      {/*  dialogContent={*/}
      {/*    <div className="d-flex-column-center">*/}
      {/*      <span>{t('save-required-hiring-description')}</span>*/}
      {/*    </div>*/}
      {/*  }*/}
      {/*  isOpen={isConfirmSaveOpen}*/}
      {/*  saveType="button"*/}
      {/*  onSaveClicked={() => saveHandler()}*/}
      {/*  isSaving={isLoading}*/}
      {/*  onCloseClicked={() => {*/}
      {/*    expandErrors();*/}
      {/*    setIsConfirmSaveOpen(false);*/}
      {/*  }}*/}
      {/*  onCancelClicked={() => {*/}
      {/*    expandErrors();*/}
      {/*    setIsConfirmSaveOpen(false);*/}
      {/*  }}*/}
      {/*  parentTranslationPath={parentTranslationPath}*/}
      {/*  isLoading={isLoading}*/}
      {/*/>*/}
    </div>
  );
};

HiringTab.propTypes = {
  job_uuid: PropTypes.string.isRequired,
  candidateDetail: PropTypes.instanceOf(Object).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  stages: PropTypes.bool,
  stage_uuid: PropTypes.string,
};

HiringTab.defaultProps = {
  stages: [],
  stage_uuid: '',
};
