import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';

import {
  GetAllSetupsCountries,
  GetAllSetupsDegreeTypes,
  GetAllSetupsJobMajors,
} from '../../../services';
import {
  SharedAPIAutocompleteControl,
  SharedInputControl,
} from '../../../pages/setups/shared';
// import Datepicker from '../../Elevatus/Datepicker';
import { CheckboxesComponent } from '../../Checkboxes/Checkboxes.Component';
import DatePickerComponent from '../../Datepicker/DatePicker.Component';
import moment from 'moment/moment';
import { GlobalDateFormat } from '../../../helpers';

export const EducationSection = ({
  state,
  onStateChanged,
  errors,
  isSubmitted,
  isLoading,
  parentTranslationPath,
  isFullWidth,
  company_uuid,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  return (
    <div className="section-item-wrapper">
      <div className="section-item-title">{t('education')}</div>
      <div className="section-item-description">{t('education-description')}</div>
      <div className="section-item-action">
        <ButtonBase
          onClick={() => {
            const localeEducation = [...(state.education || [])];
            localeEducation.push({
              institution: '',
              major_uuid: '',
              degree_type_uuid: '',
              gpa: 0,
              from_date: '',
              to_date: '',
              is_currently: false,
              country_uuid: '',
              description: '',
            });
            onStateChanged({ id: 'education', value: localeEducation });
          }}
          className="btns theme-solid"
        >
          <span className="mdi mdi-plus" />
          <span>{t('add-education')}</span>
        </ButtonBase>
      </div>
      <div className="section-item-body-wrapper px-2">
        {state.education
          && state.education.map((item, index) => (
            <div key={`${index + 1}-education-item`}>
              <div className="experience-section-wrapper w-100">
                <div className="w-100">
                  <SharedInputControl
                    isHalfWidth={!isFullWidth}
                    isFullWidth={isFullWidth}
                    errors={errors}
                    parentIndex={index}
                    parentId="education"
                    isDisabled={isLoading}
                    errorPath={`education[${index}].institution`}
                    stateKey="institution"
                    isSubmitted={isSubmitted}
                    title="institution-school"
                    editValue={item.institution}
                    onValueChanged={onStateChanged}
                    placeholder="institution-school"
                    parentTranslationPath={parentTranslationPath}
                  />
                  <SharedAPIAutocompleteControl
                    isHalfWidth={!isFullWidth}
                    isFullWidth={isFullWidth}
                    title="major"
                    errors={errors}
                    searchKey="search"
                    placeholder="major"
                    stateKey="major_uuid"
                    isDisabled={isLoading}
                    isSubmitted={isSubmitted}
                    editValue={item.major_uuid}
                    parentIndex={index}
                    parentId="education"
                    errorPath={`education[${index}].major_uuid`}
                    onValueChanged={onStateChanged}
                    getDataAPI={GetAllSetupsJobMajors}
                    extraProps={{
                      company_uuid,
                      ...(item.major_uuid && { with_than: [item.major_uuid] }),
                    }}
                    parentTranslationPath={parentTranslationPath}
                    getOptionLabel={(option) =>
                      option.name[i18next.language] || option.name.en
                    }
                  />
                  <SharedAPIAutocompleteControl
                    isHalfWidth={!isFullWidth}
                    isFullWidth={isFullWidth}
                    errors={errors}
                    searchKey="search"
                    title="degree-type"
                    errorPath={`education[${index}].degree_type_uuid`}
                    isDisabled={isLoading}
                    isSubmitted={isSubmitted}
                    placeholder="degree-type"
                    stateKey="degree_type_uuid"
                    parentIndex={index}
                    parentId="education"
                    onValueChanged={onStateChanged}
                    editValue={item.degree_type_uuid}
                    getDataAPI={GetAllSetupsDegreeTypes}
                    extraProps={{
                      company_uuid,
                      ...(item.degree_type_uuid && {
                        with_than: [item.degree_type_uuid],
                      }),
                    }}
                    parentTranslationPath={parentTranslationPath}
                    getOptionLabel={(option) =>
                      option.name[i18next.language] || option.name.en
                    }
                  />
                  <SharedInputControl
                    isHalfWidth={!isFullWidth}
                    isFullWidth={isFullWidth}
                    title="gpa"
                    stateKey="gpa"
                    errors={errors}
                    placeholder="gpa"
                    parentIndex={index}
                    editValue={item.gpa}
                    parentId="education"
                    isDisabled={isLoading}
                    errorPath={`education[${index}].gpa`}
                    isSubmitted={isSubmitted}
                    onValueChanged={onStateChanged}
                    parentTranslationPath={parentTranslationPath}
                    type="number"
                  />
                  <div className="d-flex flex-wrap">
                    <div className="w-50 px-2">
                      <DatePickerComponent
                        parentId="education"
                        parentIndex={index}
                        stateKey="from_date"
                        datePickerWrapperClasses="px-0"
                        label={t('start-date')}
                        inputPlaceholder={`${t('Shared:eg')} ${moment()
                          .locale(i18next.language)
                          .format(GlobalDateFormat)}`}
                        // helperText={t('this-field-is-required')}
                        // error={
                        //   errors
                        //   && errors.education
                        //   && errors.education[index].from_date
                        // }
                        idRef={`educationStartDateRef${index + 1}`}
                        value={item.from_date || ''}
                        isSubmitted={isSubmitted}
                        displayFormat={GlobalDateFormat}
                        maxDate={moment().toDate()}
                        onDelayedChange={onStateChanged}
                        errors={errors}
                        errorPath={`education[${index}].from_date`}
                      />
                      {/*<Datepicker*/}
                      {/*  minDate=""*/}
                      {/*  idRef={`educationStartDateRef${index + 1}`}*/}
                      {/*  label={t('start-date')}*/}
                      {/*  isSubmitted={isSubmitted}*/}
                      {/*  value={item.from_date || ''}*/}
                      {/*  inputPlaceholder="YYYY-MM-DD"*/}
                      {/*  helperText={t('this-field-is-required')}*/}
                      {/*  error={*/}
                      {/*    errors*/}
                      {/*    && errors.education*/}
                      {/*    && errors.education[index].from_date*/}
                      {/*  }*/}
                      {/*  onChange={(date) => {*/}
                      {/*    if (date !== 'Invalid date')*/}
                      {/*      onStateChanged({*/}
                      {/*        parentId: 'education',*/}
                      {/*        parentIndex: index,*/}
                      {/*        id: 'from_date',*/}
                      {/*        value: date,*/}
                      {/*      });*/}
                      {/*    else*/}
                      {/*      onStateChanged({*/}
                      {/*        parentId: 'education',*/}
                      {/*        parentIndex: index,*/}
                      {/*        id: 'from_date',*/}
                      {/*        value: null,*/}
                      {/*      });*/}
                      {/*  }}*/}
                      {/*/>*/}
                    </div>
                    {!item.is_currently ? (
                      <div className="w-50 px-2">
                        <DatePickerComponent
                          parentId="education"
                          parentIndex={index}
                          stateKey="to_date"
                          datePickerWrapperClasses="px-0"
                          label={t('end-date')}
                          inputPlaceholder={`${t('Shared:eg')} ${moment()
                            .locale(i18next.language)
                            .format(GlobalDateFormat)}`}
                          // helperText={t('this-field-is-required')}
                          // error={
                          //   errors
                          //   && errors.education
                          //   && errors.education[index].to_date
                          // }
                          idRef={`educationEndDateRef${index + 1}`}
                          value={item.to_date || ''}
                          isSubmitted={isSubmitted}
                          displayFormat={GlobalDateFormat}
                          maxDate={moment().toDate()}
                          onDelayedChange={onStateChanged}
                          errors={errors}
                          errorPath={`education[${index}].to_date`}
                        />
                      </div>
                    ) : (
                      <div className="w-50 px-2 present-text-wrapper">
                        <span className="mdi mdi-arrow-right pr-2-reversed" />
                        {t('present')}
                      </div>
                    )}
                  </div>
                  <div className="px-2 pt-3">
                    <CheckboxesComponent
                      idRef="isCurrentPositionRef"
                      singleChecked={item.is_currently}
                      label={t('i-am-currently-studying-here')}
                      onSelectedCheckboxChanged={(event, checkedValue) => {
                        onStateChanged({
                          parentId: 'education',
                          parentIndex: index,
                          id: 'is_currently',
                          value: checkedValue,
                        });

                        if (checkedValue)
                          onStateChanged({
                            parentId: 'education',
                            parentIndex: index,
                            id: 'to_date',
                            value: null,
                          });
                      }}
                    />
                  </div>
                  <div className="px-2 pt-3">
                    <SharedAPIAutocompleteControl
                      isFullWidth
                      title="country"
                      errors={errors}
                      searchKey="search"
                      placeholder="country"
                      isDisabled={isLoading}
                      stateKey="country_uuid"
                      parentIndex={index}
                      parentId="education"
                      errorPath={`education[${index}].country_uuid`}
                      isSubmitted={isSubmitted}
                      editValue={item.country_uuid}
                      onValueChanged={onStateChanged}
                      getDataAPI={GetAllSetupsCountries}
                      extraProps={{
                        company_uuid,
                        ...(item.country_uuid && {
                          with_than: [item.country_uuid],
                        }),
                      }}
                      parentTranslationPath={parentTranslationPath}
                      getOptionLabel={(option) =>
                        option.name[i18next.language] || option.name.en
                      }
                    />
                  </div>
                  <SharedInputControl
                    rows={3}
                    multiline
                    isFullWidth
                    errors={errors}
                    parentIndex={index}
                    parentId="education"
                    wrapperClasses="px-2"
                    errorPath={`education[${index}].description`}
                    stateKey="description"
                    isDisabled={isLoading}
                    isSubmitted={isSubmitted}
                    editValue={item.description}
                    onValueChanged={onStateChanged}
                    parentTranslationPath={parentTranslationPath}
                    title="describe-your-educational-background-here"
                    placeholder="describe-your-educational-background-here"
                    InputLabelProps={{ className: 'p_truncate' }}
                  />
                </div>
                <ButtonBase
                  onClick={() => {
                    const localeEducation = [...state.education];
                    localeEducation.splice(index, 1);
                    onStateChanged({ id: 'education', value: localeEducation });
                  }}
                  className="btns-icon theme-danger mx-2 mt-1"
                >
                  <span className="fas fa-minus" />
                </ButtonBase>
              </div>
              {state.education && state.education.length !== index + 1 && <hr />}
            </div>
          ))}
      </div>
    </div>
  );
};

EducationSection.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  isFullWidth: PropTypes.bool.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  state: PropTypes.instanceOf(Object).isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  company_uuid: PropTypes.string,
};

EducationSection.defaultProps = {
  company_uuid: undefined,
};
