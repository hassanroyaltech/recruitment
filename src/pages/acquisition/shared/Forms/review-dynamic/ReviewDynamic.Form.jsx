import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { ReviewTypesEnum } from 'enums';
import { GetAllReviewsV2 } from 'services';
import { LoaderComponent } from 'components';

import { useTranslation } from 'react-i18next';
import { DynamicFormHandler } from './handlers';
import './ReviewDynamic.Style.scss';
import { GetIsFieldDisplayedHelper } from '../../../campaigns/helpers/GetIsFieldDisplayed.helper';

export const ReviewDynamicForm = ({
  state,
  onStateChanged,
  campaignUuid,
  errors,
  isSubmitted,
  isRequired,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [controls, setControls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const timerRef = useRef(null);
  const isMountedRef = useRef(false);
  const getAllReviews = useCallback(async () => {
    if (isMountedRef.current) return;
    isMountedRef.current = true;
    if (
      JSON.stringify(state.selectedChannels)
        === JSON.stringify(state.savedSelectedChannels)
      && JSON.stringify(state.selectedContracts)
        === JSON.stringify(state.savedSelectedContracts)
    ) {
      timerRef.current = setTimeout(() => setIsLoading(false), 1000);
      return;
    }

    setIsLoading(true);
    // onStateChanged({
    //   id: 'destructObject',
    //   value: {
    //     campaignData: {
    //       campaign_fields: [],
    //       contract_fields: [],
    //     },
    //   },
    // });
    const response = await GetAllReviewsV2({
      campaign_uuid: campaignUuid,
    });
    timerRef.current = setTimeout(() => setIsLoading(false), 1000);
    if (response && response.status === 200) {
      setControls(response.data.results);
      onStateChanged({
        id: 'destructObject',
        value: {
          campaignData: {
            campaign_fields: response.data.results.campaign_fields || [],
            contract_fields: response.data.results.contract_fields || [],
          },
          savedSelectedChannels: state.selectedChannels,
          savedSelectedContracts: state.selectedContracts,
        },
      });
    }
  }, [
    state.selectedChannels,
    state.savedSelectedChannels,
    state.selectedContracts,
    state.savedSelectedContracts,
    onStateChanged,
    campaignUuid,
  ]);

  // const getSchemaByReviewtype = useCallback(
  //   ({ type, currentStateItem, currentControls }) => {
  //     const localeSchema = {};
  //     currentControls.map((item) => {
  //       if (item.type === DynamicFormTypesEnum.array.key) {
  //         if (item.validation === 'required') {
  //           const arraySchema = yup
  //             .array()
  //             .nullable()
  //             .required(
  //               `${t(`${translationPath}please-select-at-least-one`)} "${
  //                 item.title
  //               }"`,
  //             );
  //           if (item.parent_key) {
  //             if (!localeSchema[item.parent_key]) localeSchema[item.parent_key] = {};
  //             localeSchema[item.parent_key][item.name] = arraySchema;
  //           } else localeSchema[item.name] = arraySchema;
  //         }
  //       } else if (item.type === DynamicFormTypesEnum.select.key) {
  //         if (item.validation === 'required') {
  //           let selectSchema = yup
  //             .string()
  //             .nullable()
  //             .required(`${t(`${translationPath}please-select`)} "${item.title}"`);
  //           if (item.origin_vonq_type === 'AUTOCOMPLETE')
  //             selectSchema = yup
  //               .object()
  //               .nullable()
  //               .required(`${t(`${translationPath}please-select`)} "${item.title}"`);
  //           if (item.parent_key) {
  //             if (!localeSchema[item.parent_key]) localeSchema[item.parent_key] = {};
  //             localeSchema[item.parent_key][item.name] = selectSchema;
  //           } else localeSchema[item.name] = selectSchema;
  //         }
  //       } else if (
  //         item.type === DynamicFormTypesEnum.text.key
  //         || item.type === DynamicFormTypesEnum.date.key
  //       ) {
  //         const stringSchema = yup
  //           .string()
  //           .nullable()
  //           .matches(
  //             (item.regex || []).map((reg) => reg.substring(1, reg?.length - 1)),
  //             {
  //               message: `${t(`${translationPath}please-insert`)} "${
  //                 item.title
  //               }" RegExp: ${(item.regex || []).join(',')}`,
  //               excludeEmptyString: true,
  //             },
  //           )
  //           .test(
  //             'is-required',
  //             `${t(`${translationPath}please-insert`)} "${item.title}"`,
  //             (value) => value || !item.validation === 'required',
  //           );
  //         if (item.parent_key) {
  //           if (!localeSchema[item.parent_key]) localeSchema[item.parent_key] = {};
  //           localeSchema[item.parent_key][item.name] = stringSchema;
  //         } else localeSchema[item.name] = stringSchema;
  //       } else if (item.type === DynamicFormTypesEnum.email.key) {
  //         const emailSchema = yup
  //           .string()
  //           .nullable()
  //           .matches(emailExpression, {
  //             message: t('Shared:invalid-email'),
  //             excludeEmptyString: true,
  //           })
  //           .test(
  //             'is-required',
  //             `${t(`${translationPath}please-insert`)} "${item.title}"`,
  //             (value) => value || !item.validation === 'required',
  //           );
  //         if (item.parent_key) {
  //           if (!localeSchema[item.parent_key]) localeSchema[item.parent_key] = {};
  //           localeSchema[item.parent_key][item.name] = emailSchema;
  //         } else localeSchema[item.name] = emailSchema;
  //       } else if (item.type === DynamicFormTypesEnum.url.key) {
  //         const urlSchema = yup
  //           .string()
  //           .nullable()
  //           .matches(urlExpression, {
  //             message: t('Shared:invalid-url'),
  //             excludeEmptyString: true,
  //           })
  //           .test(
  //             'is-required',
  //             `${t(`${translationPath}please-insert`)} "${item.title}"`,
  //             (value) => value || !item.validation === 'required',
  //           );
  //         if (item.parent_key) {
  //           if (!localeSchema[item.parent_key]) localeSchema[item.parent_key] = {};
  //           localeSchema[item.parent_key][item.name] = urlSchema;
  //         } else localeSchema[item.name] = urlSchema;
  //       } else if (item.type === DynamicFormTypesEnum.number.key) {
  //         const effectedByControl = GroupControlsByParentKey(
  //           item,
  //           currentControls,
  //         ).find((ele) => ele.name !== item.name);
  //         const numberSchema = yup
  //           .number()
  //           .nullable()
  //           .test(
  //             'isRequired',
  //             `${t(`${translationPath}please-insert`)} "${item.title}"`,
  //             (value) => item.validation !== 'required' || value || value === 0,
  //           )
  //           .test(
  //             'isEffectedByMin',
  //             `${t(`${translationPath}please-insert-a-value-greater-than`)} "${
  //               (effectedByControl && effectedByControl.title) || null
  //             }"`,
  //             (value) =>
  //               !effectedByControl
  //               || (!value && value !== 0)
  //               || (!effectedByControl.min && effectedByControl.min !== 0)
  //               || !currentStateItem
  //               || !currentStateItem[item.parent_key]
  //               || (!currentStateItem[item.parent_key][effectedByControl.name]
  //                 && currentStateItem[item.parent_key][effectedByControl.name] !== 0)
  //               || value > currentStateItem[item.parent_key][effectedByControl.name],
  //           )
  //           .test(
  //             'isEffectedByMax',
  //             `${t(`${translationPath}please-insert-a-value-less-than`)} "${
  //               (effectedByControl && effectedByControl.title) || null
  //             }"`,
  //             (value) =>
  //               !effectedByControl
  //               || (!value && value !== 0)
  //               || (!effectedByControl.max && effectedByControl.max !== 0)
  //               || !currentStateItem
  //               || !currentStateItem[item.parent_key]
  //               || (!currentStateItem[item.parent_key][effectedByControl.name]
  //                 && currentStateItem[item.parent_key][effectedByControl.name] !== 0)
  //               || value < currentStateItem[item.parent_key][effectedByControl.name],
  //           )
  //           .test(
  //             'isMin',
  //             `${t(
  //               `${translationPath}please-insert-a-value-greater-than-or-equal`,
  //             )} "${item.min}"`,
  //             (value) =>
  //               (!value && value !== 0)
  //               || (!item.min && item.min !== 0)
  //               || value >= item.min,
  //           )
  //           .test(
  //             'isMax',
  //             `${t(`${translationPath}please-insert-a-value-less-than-or-equal`)} "${
  //               item.max
  //             }"`,
  //             (value) =>
  //               (!value && value !== 0)
  //               || (!item.max && item.max !== 0)
  //               || value <= item.max,
  //           );
  //         if (item.parent_key) {
  //           if (!localeSchema[item.parent_key]) localeSchema[item.parent_key] = {};
  //           localeSchema[item.parent_key][item.name] = numberSchema;
  //         } else localeSchema[item.name] = numberSchema;
  //       } else if (item.type === DynamicFormTypesEnum.uploader.key)
  //         if (item.validation === 'required') {
  //           const uploaderSchema = yup
  //             .string()
  //             .nullable()
  //             .required(`${t(`${translationPath}please-upload`)} "${item.title}"`);
  //           if (item.parent_key) {
  //             if (!localeSchema[item.parent_key]) localeSchema[item.parent_key] = {};
  //             localeSchema[item.parent_key][item.name] = uploaderSchema;
  //           } else localeSchema[item.name] = uploaderSchema;
  //         }
  //       return undefined;
  //     });
  //     currentControls
  //       .filter(
  //         (item, index, items) =>
  //           item.parent_key
  //           && index
  //             === items.findIndex((element) => element.parent_key === item.parent_key),
  //       )
  //       .map((item) => {
  //         if (localeSchema[item.parent_key])
  //           localeSchema[item.parent_key] = yup
  //             .object()
  //             .nullable()
  //             .shape(localeSchema[item.parent_key]);
  //         return undefined;
  //       });
  //     return localeSchema;
  //   },
  //   [t, translationPath],
  // );
  // const schemaRefChangeHandler = useCallback(() => {
  //   if (controls.length === 0) return;
  //   const currentSchema = { ...(schema.current || {}) };
  //   currentSchema[reviewType] = {};
  //   if (reviewType === ReviewTypesEnum.contract.key) {
  //     const tempSchema = controls.map((item, index) =>
  //       getSchemaByReviewtype({
  //         type: reviewType,
  //         currentStateItem: state[reviewType]?.[index] || {},
  //         currentControls: item.messing_fields,
  //       }),
  //     );
  //     currentSchema[reviewType] = yup
  //       .array()
  //       .of(
  //         yup.lazy((value) => {
  //           const index = controls.findIndex(
  //             (item) => item.id === value.contract_id,
  //           );
  //           return yup
  //             .object()
  //             .nullable()
  //             .shape({
  //               fields: yup.object().nullable().shape(tempSchema[index]),
  //             });
  //         }),
  //       )
  //       .nullable();
  //   } else {
  //     currentSchema[reviewType] = getSchemaByReviewtype({
  //       type: reviewType,
  //       currentStateItem: state[reviewType],
  //       currentControls: controls,
  //     });
  //     currentSchema[reviewType] = yup
  //       .object()
  //       .nullable()
  //       .shape(currentSchema[reviewType]);
  //   }
  //   if (onSchemaChanged) onSchemaChanged(currentSchema);
  // }, [controls, getSchemaByReviewtype, onSchemaChanged, reviewType, schema, state]);
  //
  // const initEditValuesHandler = useCallback(async () => {
  //   if (
  //     state
  //     && reviewType === ReviewTypesEnum.contract.key
  //     && controls.length > 0
  //     && (!state[`saved${reviewType}`]
  //       || JSON.stringify(
  //         (state[`saved${ReviewTypesEnum.contract.key}`] || []).map(
  //           (item) => item.campaign_contract_uuid,
  //         ),
  //       ) !== JSON.stringify(controls.map((item) => item.campaign_contract_uuid)))
  //   ) {
  //     const tempData = [];
  //     controls.forEach((item) => {
  //       const tempControl = {
  //         contract_id: item.id,
  //         campaign_contract_uuid: item.campaign_contract_uuid,
  //         fields: {},
  //       };
  //       if (item.messing_fields)
  //         item.messing_fields.forEach((field) => {
  //           tempControl.fields[field.name] = field.current_value || null;
  //         });
  //       tempData.push(tempControl);
  //     });
  //     if (onStateChanged)
  //       onStateChanged({
  //         id: 'destructObject',
  //         value: {
  //           [`saved${reviewType}`]: tempData,
  //           [reviewType]: tempData,
  //           [ReviewTypesEnum.job.key]: state?.[ReviewTypesEnum.job.key] || {},
  //         },
  //       });
  //   }
  //
  //   if (
  //     state
  //     && !state[`saved${reviewType}`]
  //     && reviewType !== ReviewTypesEnum.contract.key
  //   )
  //     controls
  //       .filter((item) => item.current_values)
  //       .map((item) => {
  //         if (onStateChanged) {
  //           onStateChanged({
  //             parentId: reviewType,
  //             subParentId: item.parent_key,
  //             id: item.name,
  //             value: item.current_values,
  //           });
  //           onStateChanged({
  //             parentId: `saved${reviewType}`,
  //             subParentId: item.parent_key,
  //             id: item.name,
  //             value: item.current_values,
  //           });
  //         }
  //         return undefined;
  //       });
  // }, [controls, onStateChanged, reviewType, state]);

  // useEffect(() => {
  //   schemaRefChangeHandler();
  // }, [controls, schemaRefChangeHandler]);
  //
  // useEffect(() => {
  //   initEditValuesHandler();
  // }, [controls, initEditValuesHandler]);

  useEffect(() => {
    getAllReviews();
  }, [getAllReviews]);

  useEffect(
    () => () => {
      isMountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );
  return (
    <div className="review-dynamic-form-wrapper shared-wrapper" key={controls}>
      <LoaderComponent
        wrapperClasses="dynamic-form-skeltons mb-3"
        skeletonItems={[
          { variant: 'text', style: { width: 100 } },
          { style: { minHeight: 32, transform: 'scale(1)', marginBottom: '1rem' } },
          { variant: 'text', style: { width: 100 } },
          { style: { minHeight: 32, transform: 'scale(1)', marginBottom: '1rem' } },
          { variant: 'text', style: { width: 100 } },
          { style: { minHeight: 32, transform: 'scale(1)', marginBottom: '1rem' } },
        ]}
        isLoading={isLoading}
      />

      {!isLoading
        && state.campaignData
        && state.campaignData.campaign_fields.map((section, idx) => (
          <React.Fragment key={`section${section.type}${idx}`}>
            <div className="d-flex ">
              <span className="ml--1-reversed mb-2 text-bold-700">
                {section.section}
              </span>
            </div>
            {section.fields.map((field, fieldIdx) =>
              field?.fields ? (
                <React.Fragment
                  key={`subFieldsFormKeys${section.type}${field.type}${
                    fieldIdx + 1
                  }`}
                >
                  <div className="d-flex ">
                    <span className="ml--1-reversed mb-2 text-bold-700">
                      {field.section}
                    </span>
                  </div>
                  {field.fields.map((subField, subFieldIdx, items) => (
                    <DynamicFormHandler
                      key={`dynamicSubFormKeys${section.type}${
                        subField.index
                      }-${idx}-${fieldIdx}-${subFieldIdx}${fieldIdx + 1}`}
                      controlItem={{
                        ...subField,
                        isVonqAutoComplete:
                          subField?.origin_vonq_type === 'AUTOCOMPLETE',
                        helper_name: subField?.end_point ? 'dynamic-service' : '',
                        options: subField.options || subField.values,
                        // parentIndex: index,
                        // subParentId: 'fields',
                      }}
                      controls={field.fields}
                      reviewType={'campaignData'}
                      // state={state}
                      editValue={
                        state?.campaignData?.campaign_fields?.[idx]?.fields?.[
                          fieldIdx
                        ]?.fields?.[subFieldIdx]?.current_value ?? null
                      }
                      errorPath={`campaign_fields.${subField.index}-${idx}-${fieldIdx}-${subFieldIdx}.current_value`}
                      onEditValueChanged={(newValue) => {
                        const localeFields = [...items];
                        localeFields[subFieldIdx].current_value = newValue.value;
                        onStateChanged({
                          value: localeFields,
                          id: 'fields',
                          parentId: 'campaignData',
                          subParentId: 'campaign_fields',
                          subParentIndex: idx,
                          subSubParentId: 'fields',
                          subSubParentIndex: fieldIdx,
                        });
                      }}
                      errors={errors}
                      isSubmitted={isSubmitted}
                      isRequired={isRequired}
                    />
                  ))}
                </React.Fragment>
              ) : (
                <DynamicFormHandler
                  key={`dynamicDirectFormKeys${field.index}-${idx}--${fieldIdx}`}
                  controlItem={{
                    ...field,
                    isVonqAutoComplete: field?.origin_vonq_type === 'AUTOCOMPLETE',
                    helper_name: field?.end_point ? 'dynamic-service' : '',
                    options: field.options || field.values,
                    // parentIndex: index,
                    // subParentId: 'fields',
                  }}
                  controls={section.fields}
                  reviewType={'campaignData'}
                  // state={state}
                  editValue={
                    state?.campaignData?.campaign_fields?.[idx]?.fields?.[fieldIdx]
                      ?.current_value ?? null
                  }
                  // -${parentIndex ?? ""}-${idx}
                  errorPath={`campaign_fields.${field.index}-${idx}--${fieldIdx}.current_value`}
                  onEditValueChanged={(newValue) => {
                    onStateChanged({
                      value: newValue.value,
                      id: 'current_value',
                      parentId: 'campaignData',
                      subParentId: 'campaign_fields',
                      subParentIndex: idx,
                      subSubParentId: 'fields',
                      subSubParentIndex: fieldIdx,
                    });
                  }}
                  errors={errors}
                  isSubmitted={isSubmitted}
                  isRequired={isRequired}
                />
              ),
            )}
          </React.Fragment>
        ))}
      {!isLoading
        && state.campaignData
        && state.campaignData?.contract_fields?.length > 0 && (
        <div className="d-flex ">
          <span className="ml--1-reversed mb-2 text-bold-700">
            {t(`${translationPath}contract-details`)}
          </span>
        </div>
      )}
      {!isLoading
        && state.campaignData
        && state.campaignData.contract_fields.map(
          (field, idx) =>
            GetIsFieldDisplayedHelper(state.campaignData.contract_fields, field) && (
              <DynamicFormHandler
                key={`dynamicContractFormKeys${field.index}${idx}`}
                controlItem={{
                  ...field,
                  isVonqAutoComplete: field?.origin_vonq_type === 'AUTOCOMPLETE',
                  helper_name: field?.end_point ? 'dynamic-service' : '',
                  options: field.options || field.values,
                  // parentIndex: index,
                  // subParentId: 'fields',
                }}
                controls={state.campaignData?.contract_fields}
                reviewType={'campaignData'}
                // state={state}
                editValue={field?.current_value || null}
                errorPath={`contract_fields.${field.index}.current_value`}
                onEditValueChanged={(newValue) => {
                  onStateChanged({
                    value: newValue.value,
                    id: 'current_value',
                    parentId: 'campaignData',
                    subParentId: 'contract_fields',
                    subParentIndex: idx,
                  });
                }}
                errors={errors}
                isSubmitted={isSubmitted}
                isRequired={isRequired}
              />
            ),
        )}
    </div>
  );
};

ReviewDynamicForm.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  schema: PropTypes.instanceOf(Object).isRequired,
  onSchemaChanged: PropTypes.func.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  campaignUuid: PropTypes.string.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  isRequired: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  reviewType: PropTypes.oneOf(
    Object.values(ReviewTypesEnum).map((item) => item.key),
  ),
  translationPath: PropTypes.string,
};
ReviewDynamicForm.defaultProps = {
  reviewType: ReviewTypesEnum.campaign.key,
  translationPath: 'ReviewDynamicForm.',
};
