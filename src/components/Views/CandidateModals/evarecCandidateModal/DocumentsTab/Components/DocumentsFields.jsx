import React, { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import {
  SharedAPIAutocompleteControl,
  SharedInputControl,
  SharedUploaderControl,
} from '../../../../../../pages/setups/shared';
import { DynamicService } from '../../../../../../services';
import { numbersExpression } from '../../../../../../utils';
import DatePickerComponent from '../../../../../Datepicker/DatePicker.Component';
import moment from 'moment-hijri';
import { GlobalDateFormat } from '../../../../../../helpers';
import { UploaderPageEnum } from '../../../../../../enums';
import PropTypes from 'prop-types';

export const DocumentsFields = memo(
  ({
    onUploadChanged,
    errors,
    sectionIdx,
    isDisabled,
    getDynamicServicePropertiesHandler,
    fieldIdx,
    type,
    value,
    parentTranslationPath,
    media_details,
    label,
    is_required,
    isSubmitted,
    onStateChanged,
    options,
    setIsFileUploading,
    effectedOnIdx,
    hasParent,
    parentValue,
  }) => {
    const { t } = useTranslation(parentTranslationPath);
    const memoFileDetails = useMemo(() => {
      if (Array.isArray(media_details)) return media_details;
      if (media_details?.original)
        return [
          {
            ...media_details?.original,
            fileName: media_details?.original?.name,
          },
        ];
      return [];
    }, [media_details]);
    const handleAffectedFieldChange = useCallback(() => {
      if (!options?.effected_on) return;
      onStateChanged({
        id: 'value',
        parentIndex: sectionIdx,
        parentId: 'sections',
        subParentId: 'fields',
        subParentIndex: effectedOnIdx,
        value: '',
      });
    }, [effectedOnIdx, onStateChanged, options?.effected_on, sectionIdx]);

    return (
      <div className="mb-4">
        <div className="fw-bold mb-2">
          {label?.[i18next.language] || label?.en} {(is_required && ' *') || ''}
        </div>
        {type === 'text' && (
          <SharedInputControl
            isFullWidth
            errors={errors}
            stateKey="value"
            errorPath={`sections[${sectionIdx}].fields[${fieldIdx}].value`}
            placeholder={label?.[i18next.language] || label?.en}
            isDisabled={isDisabled}
            isSubmitted={isSubmitted}
            editValue={value}
            onValueChanged={onStateChanged}
            parentTranslationPath={parentTranslationPath}
            wrapperClasses="p-0"
            parentId="sections"
            parentIndex={sectionIdx}
            subParentId="fields"
            subParentIndex={fieldIdx}
          />
        )}
        {type === 'textarea' && (
          <SharedInputControl
            isFullWidth
            errors={errors}
            stateKey="value"
            errorPath={`sections[${sectionIdx}].fields[${fieldIdx}].value`}
            placeholder={label?.[i18next.language] || label?.en}
            isDisabled={isDisabled}
            isSubmitted={isSubmitted}
            editValue={value}
            onValueChanged={onStateChanged}
            parentTranslationPath={parentTranslationPath}
            wrapperClasses="p-0"
            parentId="sections"
            parentIndex={sectionIdx}
            subParentId="fields"
            subParentIndex={fieldIdx}
            rows={2}
            multiline={true}
          />
        )}
        {type === 'dropdown' && (
          <SharedAPIAutocompleteControl
            filterOptions={(options) => options}
            editValue={value}
            placeholder={label?.[i18next.language] || label?.en}
            stateKey="value"
            parentIndex={sectionIdx}
            parentId="sections"
            subParentId="fields"
            subParentIndex={fieldIdx}
            errorPath={`sections[${sectionIdx}].fields[${fieldIdx}].value`}
            isSubmitted={isSubmitted}
            errors={errors}
            isDisabled={isDisabled || (hasParent && !parentValue)}
            searchKey="query"
            getDataAPI={DynamicService}
            getAPIProperties={getDynamicServicePropertiesHandler}
            extraProps={{
              path: options?.endpoint,
              method: options?.method,
              params: {
                with_than: value ? [value] : [],
                ...(options?.pk && {
                  [options.pk]: parentValue,
                }),
              },
            }}
            getOptionLabel={(option) =>
              option.value
              || (option.title
                && (option.title[i18next.language] || option.title.en))
              || (option.name && (option.name[i18next.language] || option.name.en))
              || `${
                option.first_name
                && (option.first_name[i18next.language] || option.first_name.en)
              }${
                option.last_name
                && ` ${option.last_name[i18next.language] || option.last_name.en}`
              }`
            }
            parentTranslationPath={parentTranslationPath}
            onValueChanged={(newValue) => {
              onStateChanged(newValue);
              if (options?.effected_on) handleAffectedFieldChange();
            }}
            isFullWidth
          />
        )}

        {type === 'number' && (
          <SharedInputControl
            isFullWidth
            errors={errors}
            stateKey="value"
            errorPath={`sections[${sectionIdx}].fields[${fieldIdx}].value`}
            placeholder={label?.[i18next.language] || label?.en}
            isDisabled={isDisabled}
            isSubmitted={isSubmitted}
            editValue={value}
            onValueChanged={onStateChanged}
            parentTranslationPath={parentTranslationPath}
            wrapperClasses="p-0"
            parentId="sections"
            parentIndex={sectionIdx}
            subParentId="fields"
            subParentIndex={fieldIdx}
            pattern={numbersExpression}
            type="number"
          />
        )}
        {type === 'date' && (
          <DatePickerComponent
            datePickerWrapperClasses="px-0"
            stateKey="value"
            errorPath={`sections[${sectionIdx}].fields[${fieldIdx}].value`}
            inputPlaceholder={`${t('Shared:eg')} ${moment()
              .locale(i18next.language)
              .format(GlobalDateFormat)}`}
            isDisabled={isDisabled}
            isSubmitted={isSubmitted}
            value={value}
            onDelayedChange={onStateChanged}
            parentTranslationPath={parentTranslationPath}
            wrapperClasses="p-0"
            parentId="sections"
            parentIndex={sectionIdx}
            subParentId="fields"
            subParentIndex={fieldIdx}
            displayFormat={GlobalDateFormat}
            helperText={
              (errors?.[`sections[${sectionIdx}].fields[${fieldIdx}].value`]
                && errors?.[`sections[${sectionIdx}].fields[${fieldIdx}].value`]
                  ?.message)
              || undefined
            }
            error={
              (errors?.[`sections[${sectionIdx}].fields[${fieldIdx}].value`]
                && errors?.[`sections[${sectionIdx}].fields[${fieldIdx}].value`]
                  ?.error)
              || false
            }
          />
        )}

        {type === 'file' && (
          <SharedUploaderControl
            isFullWidth
            errors={errors}
            uploaderPage={UploaderPageEnum.CandidateDocuments}
            // translationPath=""
            label={label?.[i18next.language] || label?.en}
            fileTypeText="file"
            // company_uuid={company_uuid}
            errorPath={`sections[${sectionIdx}].fields[${fieldIdx}].value`}
            isDisabled={isDisabled}
            isSubmitted={isSubmitted}
            editValue={memoFileDetails}
            labelClasses="theme-primary"
            stateKey="value"
            parentId="sections"
            parentIndex={sectionIdx}
            subParentId="fields"
            subParentIndex={fieldIdx}
            onValueChanged={onUploadChanged}
            onIsUploadingChanged={(val) => {
              setIsFileUploading(val);
            }}
            // parentTranslationPath={parentTranslationPath}
          />
        )}
        {type === 'date_year' && (
          <DatePickerComponent
            views={['year']}
            datePickerWrapperClasses="px-0"
            stateKey="value"
            errorPath={`sections[${sectionIdx}].fields[${fieldIdx}].value`}
            inputPlaceholder={`${t('Shared:eg')} ${moment()
              .locale(i18next.language)
              .format('YYYY')}`}
            isDisabled={isDisabled}
            isSubmitted={isSubmitted}
            value={value}
            onDelayedChange={onStateChanged}
            parentTranslationPath={parentTranslationPath}
            wrapperClasses="p-0"
            parentId="sections"
            parentIndex={sectionIdx}
            subParentId="fields"
            subParentIndex={fieldIdx}
            displayFormat={'YYYY'}
            savingFormat={'YYYY'}
            helperText={
              (errors?.[`sections[${sectionIdx}].fields[${fieldIdx}].value`]
                && errors?.[`sections[${sectionIdx}].fields[${fieldIdx}].value`]
                  ?.message)
              || undefined
            }
            error={
              (errors?.[`sections[${sectionIdx}].fields[${fieldIdx}].value`]
                && errors?.[`sections[${sectionIdx}].fields[${fieldIdx}].value`]
                  ?.error)
              || false
            }
          />
        )}
      </div>
    );
  },
);
DocumentsFields.displayName = 'DocumentsFields';
DocumentsFields.propTypes = {
  onUploadChanged: PropTypes.func,
  errors: PropTypes.instanceOf(Object).isRequired,
  sectionIdx: PropTypes.number,
  isDisabled: PropTypes.bool,
  getDynamicServicePropertiesHandler: PropTypes.func,
  fieldIdx: PropTypes.number,
  type: PropTypes.string,
  value: PropTypes.any,
  parentTranslationPath: PropTypes.string,
  media_details: PropTypes.any,
  label: PropTypes.instanceOf(Object).isRequired,
  is_required: PropTypes.bool,
  isSubmitted: PropTypes.bool,
  onStateChanged: PropTypes.func,
  options: PropTypes.instanceOf(Object).isRequired,
  setIsFileUploading: PropTypes.func,
  effectedOnIdx: PropTypes.number,
  hasParent: PropTypes.bool,
  parentValue: PropTypes.string,
};
