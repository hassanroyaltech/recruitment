import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { getErrorByName, showError } from '../../../../helpers';
import {
  SetupsReducer,
  SetupsReset,
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../setups/shared';
import { DialogComponent, RadiosComponent } from '../../../../components';
import ButtonBase from '@mui/material/ButtonBase';
import {
  GetAllRmsFiltersDropdown,
  GetAllRmsDropdownData,
  GetAllSetupsJobTypes,
  GetAllSetupsJobMajors,
  GetAllSetupsCareerLevels,
  GetAllSetupsCountries,
  GetAllSetupsIndustries,
  GetAllSetupsNationality,
  GetAllSetupsLanguages,
  GetAllSetupsGender,
  DynamicRMSServices,
} from '../../../../services';
import Datepicker from '../../../../components/Elevatus/Datepicker';
import { numbersExpression } from '../../../../utils';
import i18next from 'i18next';
import { DynamicFormTypesEnum } from '../../../../enums';
import { Divider } from '@mui/material';

const parentTranslationPath = 'EvarecRecModals';
const translationPath = '';
export const RmsFilterDialog = ({
  filterEditValue,
  isOpen,
  isOpenChanged,
  onApply,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState(() => ({}));
  const schema = useRef(null);
  const stateInitRef = useRef({
    rms_filters: [],
  });

  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  const onStateChanged = (newValue) => {
    setState(newValue);
  };
  const getErrors = useCallback(() => {
    if (schema.current)
      getErrorByName(schema, state).then((result) => {
        setErrors(result);
      });
    else
      setTimeout(() => {
        getErrors();
      });
  }, [state]);

  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) {
      if (errors.name) showError(errors.name.message);
      return;
    }
    onApply(state);
  };

  const onTagDeleteHandler = useCallback(
    (currentIndex, items, id) => () => {
      const localVals = [...items];
      localVals.splice(currentIndex, 1);
      onStateChanged({
        id,
        value: localVals,
      });
    },
    [],
  );

  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  useEffect(() => {
    schema.current = yup.object().shape({
      rms_filters: yup
        .array()
        .of(
          yup.object().shape({
            key: yup
              .object()
              .nullable()
              .shape({
                slug: yup
                  .string()
                  .nullable()
                  .required(t(`${translationPath}this-field-is-required`)),
              })
              .required(t(`${translationPath}this-field-is-required`)),
            value: yup.lazy((item, obj) => {
              if (
                obj?.parent?.key?.input_type === 'number'
                || obj?.parent?.key?.input_type === 'date'
              )
                return yup
                  .string()
                  .nullable()
                  .required(t(`${translationPath}this-field-is-required`));
              else if (obj?.parent?.key?.input_type === 'str')
                return yup
                  .array()
                  .min(1)
                  .nullable()
                  .required(t(`${translationPath}this-field-is-required`));
              else if (obj?.parent?.key?.input_type === 'boolean')
                return yup
                  .bool()
                  .nullable()
                  .required(t(`${translationPath}this-field-is-required`));
              else if (obj?.parent?.key?.input_type === 'dropdown')
                return yup
                  .array()
                  .nullable()
                  .required(t(`${translationPath}this-field-is-required`));
            }),
          }),
        )
        .nullable(),
    });
  }, [t]);

  useEffect(() => {
    if (filterEditValue) onStateChanged({ id: 'edit', value: filterEditValue });
  }, [filterEditValue]);

  return (
    <DialogComponent
      maxWidth="md"
      titleText="filter-dialog"
      contentClasses="px-0"
      dialogContent={
        <div>
          <div className="w-100">
            <ButtonBase
              className="btns theme-transparent mx-3 mb-2 px-0"
              onClick={() => {
                const localVals = [...(state.rms_filters || [])];
                localVals.push({
                  key: '',
                  value: '',
                });
                onStateChanged({ id: 'rms_filters', value: localVals });
              }}
            >
              <span className="fas fa-plus" />
              <span className="px-1">{t('add-filter')}</span>
            </ButtonBase>
          </div>
          {state?.rms_filters?.map((item, idx, items) => (
            <div key={`rmsFiltersKey${idx}`} className="my-2 d-flex w-100 mb-3">
              <SharedAPIAutocompleteControl
                isHalfWidth
                title="filter-key"
                placeholder="select-filter-key"
                stateKey="key"
                parentIndex={idx}
                parentId="rms_filters"
                onValueChanged={(e) => {
                  onStateChanged(e);
                  onStateChanged({
                    parentId: 'rms_filters',
                    parentIndex: idx,
                    id: 'value',
                    value: null,
                  });
                }}
                getOptionLabel={(option) => option?.title}
                getDataAPI={GetAllRmsFiltersDropdown}
                parentTranslationPath={parentTranslationPath}
                searchKey="search"
                controlWrapperClasses="mb-0"
                extraProps={{
                  slug: 'rms',
                }}
                editValue={item.key?.slug || ''}
                uniqueKey="slug"
                isSubmitted={isSubmitted}
                errors={errors}
                errorPath={`rms_filters[${idx}].key`}
                isEntireObject
                // getDisabledOptions={option => option.slug === 'company_uuid'} // remove later
              />
              {item.key?.input_type === 'date' && (
                <div className="w-50 px-2">
                  <Datepicker
                    stateKey="value"
                    errorPath={`rms_filters[${idx}].value`}
                    placeholder="filter-value"
                    isSubmitted={isSubmitted}
                    value={item.value || ''}
                    onChange={(date) => {
                      onStateChanged({
                        parentId: 'rms_filters',
                        parentIndex: idx,
                        id: 'value',
                        value: date !== 'Invalid date' ? date : null,
                      });
                    }}
                    parentTranslationPath={parentTranslationPath}
                    wrapperClasses="p-0"
                    parentId="rms_filters"
                    parentIndex={idx}
                    inputPlaceholder="YYYY-MM-DD"
                    helperText={
                      (errors?.[`rms_filters[${idx}].value`]
                        && errors?.[`rms_filters[${idx}].value`]?.message)
                      || undefined
                    }
                    error={
                      (errors?.[`rms_filters[${idx}].value`]
                        && errors?.[`rms_filters[${idx}].value`]?.error)
                      || false
                    }
                  />
                </div>
              )}
              {item.key?.input_type === 'number' && (
                <SharedInputControl
                  isHalfWidth
                  title="filter-value"
                  stateKey="value"
                  parentId="rms_filters"
                  parentIndex={idx}
                  searchKey="search"
                  placeholder="filter-value"
                  onValueChanged={onStateChanged}
                  parentTranslationPath={parentTranslationPath}
                  editValue={item.value || ''}
                  isSubmitted={isSubmitted}
                  errors={errors}
                  errorPath={`rms_filters[${idx}].value`}
                  pattern={numbersExpression}
                  type="number"
                  wrapperClasses="mb-0"
                />
              )}
              {item.key?.input_type === 'str' && (
                <SharedAutocompleteControl
                  placeholder="press-enter-to-add"
                  title="filter-value"
                  // title="condition"
                  isFreeSolo
                  stateKey="value"
                  parentId="rms_filters"
                  parentIndex={idx}
                  errorPath={`rms_filters[${idx}].value`}
                  errors={errors}
                  onValueChanged={onStateChanged}
                  // initValues={operations}
                  // initValuesTitle="value"
                  type={DynamicFormTypesEnum.array.key}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  isHalfWidth
                  editValue={item.value || []}
                />
              )}
              {item.key?.input_type === 'dropdown'
                && !item.key?.options?.end_point && (
                <SharedAPIAutocompleteControl
                  isHalfWidth
                  title="filter-key"
                  placeholder="select-filter-key"
                  stateKey="value"
                  parentIndex={idx}
                  parentId="rms_filters"
                  onValueChanged={onStateChanged}
                  getDataAPI={GetAllRmsDropdownData}
                  parentTranslationPath={parentTranslationPath}
                  searchKey="search"
                  controlWrapperClasses="mb-0"
                  extraProps={{
                    slug: item.key.slug,
                  }}
                  editValue={item.value || []}
                  isSubmitted={isSubmitted}
                  errors={errors}
                  errorPath={`rms_filters[${idx}].value`}
                  uniqueKey="value"
                  getOptionLabel={(option) => option.label}
                  type={DynamicFormTypesEnum.array.key}
                />
              )}

              {item.key?.input_type === 'dropdown'
                && item.key?.options?.end_point && (
                <SharedAPIAutocompleteControl
                  isHalfWidth
                  title="filter-key"
                  placeholder="select-filter-key"
                  stateKey="value"
                  parentIndex={idx}
                  parentId="rms_filters"
                  isEntireObject
                  onValueChanged={onStateChanged}
                  getDataAPI={DynamicRMSServices}
                  parentTranslationPath={parentTranslationPath}
                  searchKey="search"
                  controlWrapperClasses="mb-0"
                  extraProps={{
                    end_point: item.key.options?.end_point,
                    with_than: item.value?.map((item) => item.uuid) || null,
                  }}
                  editValue={item.value?.map((item) => item.uuid) || []}
                  isSubmitted={isSubmitted}
                  errors={errors}
                  errorPath={`rms_filters[${idx}].value`}
                  uniqueKey={item.key.options?.primary_key || 'uuid'}
                  getOptionLabel={(option) =>
                    (option.name
                        && (option.name[i18next.language]
                          || option.name.en
                          || 'N/A'))
                      || 'N/A'
                  }
                  type={DynamicFormTypesEnum.array.key}
                />
              )}
              {item.key?.input_type === 'boolean' && (
                <div width="w-50">
                  <RadiosComponent
                    idRef={`fitler-value-${idx}`}
                    name="filterValue"
                    labelInput="value"
                    valueInput="key"
                    value={item.value}
                    data={[
                      {
                        key: true,
                        value: 'yes',
                      },
                      {
                        key: false,
                        value: 'no',
                      },
                    ]}
                    parentTranslationPath={parentTranslationPath}
                    translationPathForData={translationPath}
                    translationPath={translationPath}
                    onSelectedRadioChanged={(event, newValue) => {
                      onStateChanged({
                        id: 'value',
                        value: newValue,
                        parentId: 'rms_filters',
                        parentIndex: idx,
                      });
                    }}
                  />
                </div>
              )}
              <ButtonBase
                className="btns-icon theme-transparent mx-3"
                onClick={onTagDeleteHandler(idx, items, 'rms_filters')}
                // disabled={state.rms_filters?.length === 1}
              >
                <span className="fas fa-times" />
              </ButtonBase>
            </div>
          ))}
          <div className="mb-4 mx-2">
            <Divider color="#808080" />
          </div>
          <div className="lookup-filters">
            <SharedAPIAutocompleteControl
              isEntireObject
              isHalfWidth
              title={t(`${translationPath}job-type`)}
              placeholder={t(`${translationPath}job-type`)}
              stateKey="job_type"
              errorPath="job_type"
              onValueChanged={onStateChanged}
              idRef="job_type"
              getOptionLabel={(option) =>
                option.name[i18next.language] || option.name.en
              }
              type={DynamicFormTypesEnum.array.key}
              getDataAPI={GetAllSetupsJobTypes}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              searchKey="search"
              editValue={state.job_type?.map((item) => item.uuid) || []}
              extraProps={{
                with_than:
                  (state.job_type && state.job_type?.map((item) => item?.uuid))
                  || null,
              }}
            />
            <SharedAPIAutocompleteControl
              isEntireObject
              isHalfWidth
              title={t(`${translationPath}job-major`)}
              placeholder={t(`${translationPath}job-major`)}
              stateKey="major"
              errorPath="major"
              onValueChanged={onStateChanged}
              idRef="major"
              getOptionLabel={(option) =>
                option.name ? option.name[i18next.language] || option.name.en : ''
              }
              type={DynamicFormTypesEnum.array.key}
              getDataAPI={GetAllSetupsJobMajors}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              searchKey="search"
              editValue={state.major?.map((item) => item.uuid) || []}
              extraProps={{
                with_than:
                  (state.major && state.major?.map((item) => item?.uuid)) || null,
              }}
            />
            <SharedAPIAutocompleteControl
              isEntireObject
              isHalfWidth
              title={t(`${translationPath}career-level`)}
              placeholder={t(`${translationPath}career-level`)}
              stateKey="career_level"
              errorPath="career_level"
              onValueChanged={onStateChanged}
              idRef="career_level"
              getOptionLabel={(option) =>
                option.name ? option.name[i18next.language] || option.name.en : ''
              }
              type={DynamicFormTypesEnum.array.key}
              getDataAPI={GetAllSetupsCareerLevels}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              searchKey="search"
              editValue={state.career_level?.map((item) => item.uuid) || []}
              extraProps={{
                with_than:
                  (state.career_level
                    && state.career_level?.map((item) => item?.uuid))
                  || null,
              }}
            />
            <SharedAPIAutocompleteControl
              isEntireObject
              isHalfWidth
              title={t(`${translationPath}country`)}
              placeholder={t(`${translationPath}country`)}
              stateKey="country"
              errorPath="country"
              onValueChanged={onStateChanged}
              idRef="country"
              getOptionLabel={(option) =>
                option.name ? option.name[i18next.language] || option.name.en : ''
              }
              type={DynamicFormTypesEnum.array.key}
              getDataAPI={GetAllSetupsCountries}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              searchKey="search"
              editValue={state.country?.map((item) => item.uuid) || []}
              extraProps={{
                with_than:
                  (state.country && state.country?.map((item) => item?.uuid))
                  || null,
              }}
            />
            <SharedAPIAutocompleteControl
              isEntireObject
              isHalfWidth
              title={t(`${translationPath}industry`)}
              placeholder={t(`${translationPath}industry`)}
              stateKey="industry"
              errorPath="industry"
              onValueChanged={onStateChanged}
              idRef="industry"
              getOptionLabel={(option) =>
                option.name ? option.name[i18next.language] || option.name.en : ''
              }
              type={DynamicFormTypesEnum.array.key}
              getDataAPI={GetAllSetupsIndustries}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              searchKey="search"
              editValue={state.industry?.map((item) => item.uuid) || []}
              extraProps={{
                with_than:
                  (state.industry && state.industry?.map((item) => item?.uuid))
                  || null,
              }}
            />
            <SharedAPIAutocompleteControl
              isEntireObject
              isHalfWidth
              title={t(`${translationPath}nationality`)}
              placeholder={t(`${translationPath}nationality`)}
              stateKey="nationality"
              errorPath="nationality"
              onValueChanged={onStateChanged}
              idRef="nationality"
              getOptionLabel={(option) =>
                option.name ? option.name[i18next.language] || option.name.en : ''
              }
              type={DynamicFormTypesEnum.array.key}
              getDataAPI={GetAllSetupsNationality}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              searchKey="search"
              editValue={state.nationality?.map((item) => item.uuid) || []}
              extraProps={{
                with_than:
                  (state.nationality
                    && state.nationality?.map((item) => item?.uuid))
                  || null,
              }}
            />
            <SharedAPIAutocompleteControl
              isEntireObject
              isHalfWidth
              title={t(`${translationPath}language-proficiency`)}
              placeholder={t(`${translationPath}language-proficiency`)}
              stateKey="language"
              errorPath="language"
              onValueChanged={onStateChanged}
              idRef="language"
              getOptionLabel={(option) =>
                option.name ? option.name[i18next.language] || option.name.en : ''
              }
              type={DynamicFormTypesEnum.array.key}
              getDataAPI={GetAllSetupsLanguages}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              searchKey="search"
              editValue={state.language?.map((item) => item.uuid) || []}
              extraProps={{
                with_than:
                  (state.language && state.language?.map((item) => item?.uuid))
                  || null,
              }}
            />
            <SharedAPIAutocompleteControl
              isEntireObject
              isHalfWidth
              title={t(`${translationPath}gender`)}
              placeholder={t(`${translationPath}gender`)}
              stateKey="gender"
              errorPath="gender"
              onValueChanged={onStateChanged}
              idRef="gender"
              getOptionLabel={(option) =>
                option.name ? option.name[i18next.language] || option.name.en : ''
              }
              type={DynamicFormTypesEnum.select.key}
              getDataAPI={GetAllSetupsGender}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              searchKey="search"
              editValue={state.gender?.uuid || ''}
              extraProps={{
                with_than: (state.gender?.uuid && [state.gender.uuid]) || null,
              }}
            />
            <SharedAutocompleteControl
              placeholder="press-enter-to-add"
              title="skills"
              // title="condition"
              isFreeSolo
              stateKey="skills"
              errorPath="skills"
              onValueChanged={onStateChanged}
              // initValues={operations}
              // initValuesTitle="value"
              type={DynamicFormTypesEnum.array.key}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              isHalfWidth
              editValue={state.skills || []}
            />
            <SharedAutocompleteControl
              placeholder="press-enter-to-add"
              title="job-position"
              // title="condition"
              isFreeSolo
              stateKey="job_position"
              errorPath="job_position"
              onValueChanged={onStateChanged}
              // initValues={operations}
              // initValuesTitle="value"
              type={DynamicFormTypesEnum.array.key}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              isHalfWidth
              editValue={state.job_position || []}
            />
          </div>
        </div>
      }
      isOpen={isOpen}
      onSubmit={saveHandler}
      onCloseClicked={isOpenChanged}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
      saveText="apply"
    />
  );
};

RmsFilterDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  onApply: PropTypes.func,
  filterEditValue: PropTypes.shape({}),
};
RmsFilterDialog.defaultProps = {
  isOpenChanged: undefined,
};
