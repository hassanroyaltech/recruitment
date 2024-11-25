import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { DynamicFormTypesEnum } from '../../../enums';
import {
  SharedAutocompleteControl,
  SharedAPIAutocompleteControl,
  SharedInputControl,
} from '../../../pages/setups/shared';
import {
  GetAllSetupsCertificates,
  getSetupsCertificatesById,
  GetAllSetupsMaritalStatus,
  getSetupsMaritalStatusById,
  GetAllSetupsRelationships,
  GetAllSetupsPositionsTitle,
  GetAllSetupsCategories,
} from '../../../services';
import { numbersExpression } from '../../../utils';
import DatePickerComponent from '../../Datepicker/DatePicker.Component';
import { useSelector } from 'react-redux';

const parentTranslationPath = 'EvarecCandidateModel';

export const ExtrasSection = ({
  state,
  onStateChanged,
  isSubmitted,
  isLoading,
  errors,
  isEdit,
  isFullWidth,
  isHalfWidth,
  company_uuid,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [certificates, setCertificates] = useState([]);
  const [maritalStatus, setMaritalStatus] = useState([]);
  const [interestedPositionTitle, setInterestedPositionTitle] = useState([]);
  const [interestedJobFamily, setInterestedJobFamily] = useState([]);
  const selectedBranchReducer = useSelector(
    (reducerState) => reducerState?.selectedBranchReducer,
  );
  const booleanValues = [
    { label: t('yes'), value: 'yes' },
    { label: t('no'), value: 'no' },
  ];
  const getAllCertificatesData = useCallback(
    async (items) => {
      const response = await GetAllSetupsCertificates({
        with_than: items,
        company_uuid,
      });
      if (response.status === 200) setCertificates(response.data.results);
    },
    [company_uuid],
  );

  const getMaritalStatusByIdHandler = useCallback(async (uuid, company_uuid) => {
    const response = await getSetupsMaritalStatusById({
      uuid,
      company_uuid,
    });
    if (response.status === 200) setMaritalStatus(response.data.results);
  }, []);

  const getInterestedPositionTitle = useCallback(
    async (items) => {
      const response = await GetAllSetupsPositionsTitle({
        with_than: items,
        company_uuid,
      });
      if (response.status === 200) setInterestedPositionTitle(response.data.results);
    },
    [company_uuid],
  );
  const getInterestedJobFamily = useCallback(
    async (items) => {
      const response = await GetAllSetupsCategories({
        with_than: items,
        branch_uuid: company_uuid,
      });
      if (response.status === 200) setInterestedJobFamily(response.data.results);
    },
    [company_uuid],
  );

  useEffect(() => {
    if (state.extra?.academic_certificate?.length)
      getAllCertificatesData(state.extra?.academic_certificate);
    if (state.extra?.martial_status)
      getMaritalStatusByIdHandler(state.extra?.martial_status, company_uuid);
    if (state.extra?.interested_position_title?.length)
      getInterestedPositionTitle(state.extra?.interested_position_title);
    if (state.extra?.interested_job_family?.length)
      getInterestedJobFamily(state.extra?.interested_job_family);
  }, [
    getAllCertificatesData,
    getMaritalStatusByIdHandler,
    state.extra,
    company_uuid,
    getInterestedPositionTitle,
    getInterestedJobFamily,
  ]);
  return (
    <div className="section-item-wrapper w-100">
      {isEdit && <div className="section-item-title">{t('extra-info')}</div>}
      <div className="section-item-body-wrapper px-2">
        {isEdit && (
          <SharedAPIAutocompleteControl
            parentId="extra"
            isFullWidth={isFullWidth}
            isHalfWidth={isHalfWidth}
            errors={errors}
            title="marital-status"
            stateKey="martial_status"
            isSubmitted={isSubmitted}
            errorPath="martial_status"
            onValueChanged={onStateChanged}
            editValue={state?.extra?.martial_status}
            placeholder="select-marital-status"
            idRef="martial_statusAutocompleteRef"
            getDataAPI={GetAllSetupsMaritalStatus}
            parentTranslationPath={parentTranslationPath}
            getOptionLabel={(option) =>
              option.name[i18next.language] || option.name.en
            }
            extraProps={{
              company_uuid,
              ...(state.extra?.martial_status && {
                with_than: [state.extra?.martial_status],
              }),
            }}
            wrapperClasses={isHalfWidth ? 'px-0' : 'px-2'}
            isDisabled={!isEdit}
          />
        )}
        {((!isEdit && state?.extra?.employee_number) || isEdit) && (
          <SharedInputControl
            idRef="employee-number-input-id"
            isDisabled={!isEdit}
            parentId="extra"
            isFullWidth={isFullWidth}
            isHalfWidth={isHalfWidth}
            title="employee-number"
            errors={errors}
            stateKey="employee_number"
            errorPath="employee_number"
            editValue={state?.extra?.employee_number}
            isSubmitted={isSubmitted}
            onValueChanged={onStateChanged}
            parentTranslationPath={parentTranslationPath}
            wrapperClasses="px-2"
          />
        )}
        {!isEdit && state.extra?.martial_status && maritalStatus && (
          <div className="mb-3">
            {' '}
            {t('marital-status')}
            {':  '}
            <span>
              {maritalStatus.name?.[i18next.language] || maritalStatus.name?.en}
            </span>
          </div>
        )}
        {isEdit && (
          <SharedAPIAutocompleteControl
            parentId="extra"
            isFullWidth={isFullWidth}
            isHalfWidth={isHalfWidth}
            errors={errors}
            title="interested-position-title"
            stateKey="interested_position_title"
            isSubmitted={isSubmitted}
            errorPath="interested_position_title"
            onValueChanged={onStateChanged}
            editValue={state.extra?.interested_position_title}
            placeholder="select-interested-position-title"
            idRef="interested_position_titleAutocompleteRef"
            getDataAPI={GetAllSetupsPositionsTitle}
            parentTranslationPath={parentTranslationPath}
            getOptionLabel={(option) =>
              option.name[i18next.language] || option.name.en
            }
            extraProps={{
              company_uuid,
              ...(state.extra?.interested_position_title && {
                with_than: [state.extra?.interested_position_title],
              }),
            }}
            wrapperClasses={isHalfWidth ? 'px-0' : 'px-2'}
            type={DynamicFormTypesEnum.array.key}
          />
        )}
        {!isEdit
          && state.extra?.interested_position_title
          && interestedPositionTitle.length > 0 && (
          <div className="mb-3">
            {' '}
            {t('interested-position-title')}
            {':  '}
            {state.extra?.interested_position_title.map((item, index) => (
              <div key={index} className="chip-item small-item mr-1 mb-3">
                {interestedPositionTitle.find((cert) => cert.uuid === item)
                  ?.name?.[i18next.language]
                    || interestedPositionTitle.find((cert) => cert.uuid === item)?.name
                      ?.en}
              </div>
            ))}
          </div>
        )}
        {isEdit && (
          <SharedAPIAutocompleteControl
            parentId="extra"
            isFullWidth={isFullWidth}
            isHalfWidth={isHalfWidth}
            errors={errors}
            title="interested-job-family"
            stateKey="interested_job_family"
            isSubmitted={isSubmitted}
            errorPath="interested_job_family"
            onValueChanged={onStateChanged}
            editValue={state.extra?.interested_job_family}
            placeholder="select-interested-job-family"
            idRef="interested_job_familyAutocompleteRef"
            getDataAPI={GetAllSetupsCategories}
            parentTranslationPath={parentTranslationPath}
            getOptionLabel={(option) =>
              (option.title
                && (option.title[i18next.language] || option.title.en || 'N/A'))
              || 'N/A'
            }
            extraProps={{
              branch_uuid: company_uuid,
              ...(state.extra?.interested_job_family && {
                with_than: [state.extra?.interested_job_family],
              }),
            }}
            wrapperClasses={isHalfWidth ? 'px-0' : 'px-2'}
            type={DynamicFormTypesEnum.array.key}
          />
        )}
        {!isEdit
          && state.extra?.interested_job_family
          && interestedJobFamily.length > 0 && (
          <div className="mb-3">
            {' '}
            {t('interested-job-family')}
            {':  '}
            {state.extra?.interested_job_family.map((item, index) => (
              <div key={index} className="chip-item small-item mr-1 mb-3">
                {interestedJobFamily?.find((it) => it.uuid === item)?.title?.[
                  i18next.language
                ] || interestedJobFamily.find((it) => it.uuid === item)?.title?.en}
              </div>
            ))}
          </div>
        )}
        {((!isEdit && state?.extra?.availability_date_of_joining) || isEdit) && (
          <DatePickerComponent
            isFullWidth={isFullWidth}
            isHalfWidth={isHalfWidth}
            isDisabled={!isEdit}
            parentId="extra"
            datePickerWrapperClasses="px-2"
            idRef="availability_date_of_joining"
            minDate={new Date()}
            isSubmitted={isSubmitted}
            inputPlaceholder="YYYY-MM-DD"
            value={state.extra?.availability_date_of_joining || ''}
            helperText={
              (errors.extra?.availability_date_of_joining
                && errors.extra?.availability_date_of_joining.message)
              || undefined
            }
            error={
              (errors.extra?.availability_date_of_joining
                && errors.extra?.availability_date_of_joining.error)
              || false
            }
            label={t('availability-date-of-joining')}
            onChange={(date) => {
              if (date?.value !== 'Invalid date')
                onStateChanged({
                  parentId: 'extra',
                  id: 'availability_date_of_joining',
                  value: date?.value,
                });
              else
                onStateChanged({
                  parentId: 'extra',
                  id: 'availability_date_of_joining',
                  value: null,
                });
            }}
          />
        )}
        <div>
          {((!isEdit && state?.extra?.height) || isEdit) && (
            <SharedInputControl
              isDisabled={!isEdit}
              parentId="extra"
              isFullWidth={isFullWidth}
              isHalfWidth={isHalfWidth}
              type="number"
              title="height"
              errors={errors}
              stateKey="height"
              errorPath="height"
              editValue={state.extra?.height}
              isSubmitted={isSubmitted}
              pattern={numbersExpression}
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              wrapperClasses="px-2"
            />
          )}
          {((!isEdit && state?.extra?.weight) || isEdit) && (
            <SharedInputControl
              isDisabled={!isEdit}
              parentId="extra"
              isFullWidth={isFullWidth}
              isHalfWidth={isHalfWidth}
              type="number"
              title="weight"
              errors={errors}
              stateKey="weight"
              errorPath="weight"
              editValue={state.extra?.weight}
              isSubmitted={isSubmitted}
              pattern={numbersExpression}
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              wrapperClasses="px-2"
            />
          )}
        </div>
        <div>
          {((!isEdit && state?.extra?.current_salary) || isEdit) && (
            <SharedInputControl
              isDisabled={!isEdit}
              parentId="extra"
              isFullWidth={isFullWidth}
              isHalfWidth={isHalfWidth}
              type="number"
              title={`${t('current-salary')}  [${selectedBranchReducer?.currency ?? t('sar') }]`}
              errors={errors}
              stateKey="current_salary"
              errorPath="current_salary"
              editValue={state.extra?.current_salary}
              isSubmitted={isSubmitted}
              pattern={numbersExpression}
              onValueChanged={onStateChanged}
              // parentTranslationPath={parentTranslationPath}
              wrapperClasses="px-2"
            />
          )}
          {((!isEdit && state?.extra?.excepted_salary) || isEdit) && (
            <SharedInputControl
              isDisabled={!isEdit}
              parentId="extra"
              isFullWidth={isFullWidth}
              isHalfWidth={isHalfWidth}
              type="number"
              title={`${t('excepted-salary')}  [${selectedBranchReducer?.currency ?? t('sar') }]`}
              errors={errors}
              stateKey="excepted_salary"
              errorPath="excepted_salary"
              editValue={state.extra?.excepted_salary}
              isSubmitted={isSubmitted}
              pattern={numbersExpression}
              onValueChanged={onStateChanged}
              // parentTranslationPath={parentTranslationPath}
              wrapperClasses="px-2"
            />
          )}
        </div>
        {isEdit && (
          <SharedAPIAutocompleteControl
            isDisabled={!isEdit}
            parentId="extra"
            isFullWidth={isFullWidth}
            isHalfWidth={isHalfWidth}
            title="dr-certificate-recruiter"
            errors={errors}
            isSubmitted={isSubmitted}
            stateKey="academic_certificate"
            errorPath="academic_certificate"
            placeholder="select-dr-certificate-recruiter"
            onValueChanged={onStateChanged}
            editValue={state.extra?.academic_certificate}
            searchKey="search"
            getDataAPI={GetAllSetupsCertificates}
            getItemByIdAPI={getSetupsCertificatesById}
            type={DynamicFormTypesEnum.array.key}
            parentTranslationPath={parentTranslationPath}
            getOptionLabel={(option) =>
              option?.name?.[i18next.language] || option?.name?.en
            }
            getByIdCompanyUUID={company_uuid}
            extraProps={{
              company_uuid,
              ...(state.extra?.academic_certificate && {
                with_than: [state.extra?.academic_certificate],
              }),
            }}
          />
        )}
        {!isEdit
          && certificates?.length > 0
          && state.extra?.academic_certificate?.length > 0 && (
          <div>
            {' '}
            {t('dr-certificate-recruiter')}
            {':  '}
            {state.extra?.academic_certificate.map((item, index) => (
              <div key={index} className="chip-item small-item mr-1 mb-3">
                {certificates.find((cert) => cert.uuid === item)?.name?.[
                  i18next.language
                ] || certificates.find((cert) => cert.uuid === item)?.name?.en}
              </div>
            ))}
          </div>
        )}
        {isEdit && (
          <SharedAutocompleteControl
            parentId="extra"
            editValue={state.extra?.other_certificate}
            placeholder="press-enter-to-add"
            title="other-certificate"
            isFreeSolo
            stateKey="other_certificate"
            errorPath="other_certificate"
            onValueChanged={onStateChanged}
            isSubmitted={isSubmitted}
            isDisabled={isLoading || !isEdit}
            errors={errors}
            type={DynamicFormTypesEnum.array.key}
            parentTranslationPath={parentTranslationPath}
            isFullWidth={isFullWidth}
            isHalfWidth={isHalfWidth}
            sharedClassesWrapper="px-2"
          />
        )}
        {!isEdit && state.extra?.OtherCertificate?.length > 0 && (
          <div>
            {' '}
            {t('other-certificate')}
            {':  '}
            {state.extra?.OtherCertificate.map((item, index) => (
              <div
                key={`otherCertificateKey${index + 1}`}
                className="chip-item small-item mr-1 mb-3"
              >
                {item.name}
              </div>
            ))}
          </div>
        )}
        {isEdit && (
          <SharedAutocompleteControl
            isHalfWidth={!isFullWidth}
            isFullWidth={isFullWidth}
            errors={errors}
            searchKey="search"
            initValuesKey="value"
            isDisabled={isLoading}
            initValuesTitle="label"
            isSubmitted={isSubmitted}
            initValues={booleanValues}
            stateKey="rehire"
            errorPath="rehire"
            parentId="extra"
            onValueChanged={(e) => {
              onStateChanged({
                parentId: 'extra',
                id: 'rehire',
                value: e.value,
              });
            }}
            title="rehire-label-profile"
            editValue={state.extra.rehire}
            placeholder="rehire-label-profile"
            parentTranslationPath={parentTranslationPath}
            sharedClassesWrapper="px-2"
          />
        )}
        {isEdit && state.extra?.rehire === 'yes' && (
          <SharedInputControl
            isDisabled={!isEdit}
            parentId="extra"
            isFullWidth={isFullWidth}
            isHalfWidth={isHalfWidth}
            type="text"
            title="rehire-name"
            errors={errors}
            stateKey="rehire_name"
            errorPath="extra.rehire_name"
            editValue={state.extra?.rehire_name}
            isSubmitted={isSubmitted}
            onValueChanged={onStateChanged}
            parentTranslationPath={parentTranslationPath}
            wrapperClasses="px-2"
          />
        )}
        {!isEdit
          && (state.extra?.rehire === true || state.extra?.rehire === false) && (
          <div>
            <div>
              <div className="fw-bolder">{t('rehire-label-profile')}</div>
              <div className="py-2">{t(state.extra?.rehire ? 'yes' : 'no')}</div>
            </div>
            {state.extra?.rehire && (
              <div>
                <div className="fw-bolder">{t('rehire-name')}</div>
                <div className="py-2">{state.extra?.rehire_name}</div>
              </div>
            )}
          </div>
        )}
        {isEdit && (
          <SharedAutocompleteControl
            isHalfWidth={!isFullWidth}
            isFullWidth={isFullWidth}
            errors={errors}
            searchKey="search"
            initValuesKey="value"
            isDisabled={isLoading}
            initValuesTitle="label"
            isSubmitted={isSubmitted}
            initValues={booleanValues}
            stateKey="relative"
            errorPath="relative"
            parentId="extra"
            onValueChanged={(e) => {
              onStateChanged({
                parentId: 'extra',
                id: 'relative',
                value: e.value,
              });
            }}
            title="relative-label-profile"
            editValue={state.extra.relative}
            placeholder="relative-label-profile"
            parentTranslationPath={parentTranslationPath}
            sharedClassesWrapper="px-2"
          />
        )}
        {isEdit && state.extra.relative === 'yes' && (
          <>
            <SharedAPIAutocompleteControl
              parentId="extra"
              isFullWidth={isFullWidth}
              isHalfWidth={isHalfWidth}
              errors={errors}
              title="relationship"
              stateKey="relationship"
              isSubmitted={isSubmitted}
              errorPath="extra.relationship"
              onValueChanged={onStateChanged}
              editValue={state?.extra?.relationship}
              placeholder="select-relationship"
              idRef="relationshipAutocompleteRef"
              getDataAPI={GetAllSetupsRelationships}
              parentTranslationPath={parentTranslationPath}
              getOptionLabel={(option) =>
                option.name[i18next.language] || option.name.en
              }
              extraProps={{
                company_uuid,
                ...(state.extra?.relationship && {
                  with_than: [state.extra?.relationship],
                }),
              }}
              wrapperClasses="px-2"
              isDisabled={!isEdit}
            />
            <SharedInputControl
              isDisabled={!isEdit}
              parentId="extra"
              isFullWidth={isFullWidth}
              isHalfWidth={isHalfWidth}
              type="text"
              title="relative-name"
              errors={errors}
              stateKey="relative_name"
              errorPath="extra.relative_name"
              editValue={state.extra?.relative_name}
              isSubmitted={isSubmitted}
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              wrapperClasses="px-2"
            />
          </>
        )}
        {!isEdit
          && (state.extra.relative === true || state.extra.relative === false) && (
          <div>
            <div>
              <div className="fw-bolder">{t('relative-label-profile')}</div>
              <div className="py-2">{t(state.extra.relative ? 'yes' : 'no')}</div>
            </div>
            {state.extra.relative && (
              <div>
                <div>
                  <div className="fw-bolder">{t('relative-name')}</div>
                  <div className="py-2">{state.extra.relative_name}</div>
                </div>
                {state.extra.relationship && (
                  <div>
                    <div className="fw-bolder">{t('relationship')}</div>
                    <div className="py-2">{state.extra.relationship}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

ExtrasSection.propTypes = {
  onStateChanged: PropTypes.func.isRequired,
  state: PropTypes.instanceOf(Object).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  isEdit: PropTypes.bool,
  isFullWidth: PropTypes.bool,
  isHalfWidth: PropTypes.bool,
  company_uuid: PropTypes.string,
};

ExtrasSection.defaultProps = {
  isEdit: undefined,
  isFullWidth: undefined,
  isHalfWidth: undefined,
  company_uuid: undefined,
};
