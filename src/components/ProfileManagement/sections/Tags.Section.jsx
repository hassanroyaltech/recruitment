import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { DynamicFormTypesEnum, LookupsTypesEnum } from '../../../enums';
import {
  SharedAutocompleteControl,
  SharedAPIAutocompleteControl,
  SharedInputControl,
} from '../../../pages/setups/shared';
import { ButtonBase } from '@mui/material';
import { CustomCandidatesFilterTagsEnum } from 'enums/Pages/CandidateFilterTags.Enum';
import { DynamicService, GetAllSetupsCandidateProperties } from 'services';
import { IsUUID, showError } from 'helpers';
import { LoaderComponent } from 'components';

const parentTranslationPath = 'EvarecCandidateModel';

export const TagsSection = ({
  state,
  onStateChanged,
  isSubmitted,
  isLoading,
  errors,
  isEdit,
  isHalfWidth,
  isFullWidth,
  company_uuid,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [candidateProperties, setCandidateProperties] = useState([]);
  const [isCandidatePropsLoading, setIsCandidatePropsLoading] = useState(false);
  const [isSectionLoading, setIsSectionLoading] = useState(false);
  const [tagsValues, setTagsValues] = useState([]);
  const getDisplayedLabel = useMemo(
    () => (option) =>
      option.value
      || (option.title && (option.title[i18next.language] || option.title.en))
      || (option.name && (option.name[i18next.language] || option.name.en))
      || `${
        option.first_name
        && (option.first_name[i18next.language] || option.first_name.en)
      }${
        option.last_name
        && ` ${option.last_name[i18next.language] || option.last_name.en}`
      }`,
    [],
  );

  const onTagDeleteHandler = useCallback(
    (currentIndex, items, id) => () => {
      const localTags = [...items];
      localTags.splice(currentIndex, 1);
      onStateChanged({
        id,
        value: localTags,
      });
    },
    [onStateChanged],
  );

  const getCurrentCandidatePropertyItem = useMemo(
    () => (propertyUUID) =>
      (candidateProperties || []).find((item) => item?.uuid === propertyUUID),
    [candidateProperties],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to control the props of autocomplete from parent
   */
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

  const responsesPromises = useCallback(() => {
    setIsSectionLoading(true);
    let promises = state.tags
      .filter((tag) =>
        Object.values(CustomCandidatesFilterTagsEnum).some(
          (item) => item.key === tag?.key,
        ),
      )
      ?.map((item) =>
        Object.values(CustomCandidatesFilterTagsEnum)
          .find((element) => element.key === item.key)
          ?.getApiFunction({
            limit: 10,
            page: 1,
            with_than: item.value,
            company_uuid,
          })
          .then((response) => response),
      );
    Promise.all(promises)
      .then((responses) => {
        const returned = responses.map((it, idx) =>
          it.data.results.filter((x) => state.tags?.[idx]?.value?.includes(x.uuid)),
        );
        setTagsValues(returned);
        setIsSectionLoading(false);
      })
      .catch((e) => {
        setIsSectionLoading(false);
        if (e)
          e.map((error) => showError(t('Shared:failed-to-get-saved-data'), error));
        else showError(t('Shared:failed-to-get-saved-data'), e);
      });
  }, [state.tags, company_uuid, t]);

  const getAllCandidateProperties = useCallback(async () => {
    setIsCandidatePropsLoading(true);
    const response = await GetAllSetupsCandidateProperties({
      is_paginate: 0,
      use_for: 'list',
      company_uuid,
    });
    setIsCandidatePropsLoading(false);
    if (response && response.status === 200)
      setCandidateProperties(response.data.results);
    else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [company_uuid, t]);

  useEffect(() => {
    if (state.tags) responsesPromises();
  }, [responsesPromises, state.tags]);

  useEffect(() => {
    getAllCandidateProperties();
  }, [getAllCandidateProperties]);

  return (
    <div className="section-item-wrapper w-100">
      {isEdit && <div className="section-item-title">{t('tags')}</div>}
      <div className="section-item-body-wrapper px-2">
        <div className="tags-filter-section">
          {!isEdit && (
            <div>
              {isSectionLoading ? (
                <LoaderComponent
                  isLoading={isSectionLoading}
                  isSkeleton
                  skeletonItems={[
                    {
                      variant: 'rectangular',
                      style: { minHeight: 10, marginTop: 5, marginBottom: 5 },
                    },
                  ]}
                  numberOfRepeat={3}
                />
              ) : (
                tagsValues?.map((item, idx) => (
                  <div key={idx} className="d-flex my-2">
                    <div className="fw-bold">
                      {Object.values(CustomCandidatesFilterTagsEnum).some(
                        (element) => element.key === state?.tags?.[idx]?.key,
                      )
                        && t(
                          Object.values(CustomCandidatesFilterTagsEnum).find(
                            (element) => element.key === state?.tags?.[idx]?.key,
                          )?.label,
                        )}
                    </div>
                    <div className="mx-2">
                      {item
                        .map((val) => val?.name?.[i18next.language] || val?.name?.en)
                        .join(', ')}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          {/*{isEdit && (*/}
          {/*  <div className="custom-tags-section mb-4">*/}
          {/*<div className="d-flex my-2">*/}
          {/*<SharedAPIAutocompleteControl*/}
          {/*  isFullWidth*/}
          {/*  // isHalfWidth={isHalfWidth}*/}
          {/*  title={t(`${CustomCandidatesFilterTagsEnum.company_uuid.label}`)}*/}
          {/*  placeholder={t(*/}
          {/*    `select-${CustomCandidatesFilterTagsEnum.company_uuid.label}`*/}
          {/*  )}*/}
          {/*  stateKey="value"*/}
          {/*  errorPath={`custom_tags[0].value`}*/}
          {/*  parentIndex={0}*/}
          {/*  parentId="custom_tags"*/}
          {/*  onValueChanged={(e) => {*/}
          {/*    if (e.value?.length) {*/}
          {/*      onStateChanged(e);*/}
          {/*      onStateChanged({*/}
          {/*        parentId: 'custom_tags',*/}
          {/*        parentIndex: 0,*/}
          {/*        id: 'key',*/}
          {/*        value: CustomCandidatesFilterTagsEnum.company_uuid.key,*/}
          {/*      });*/}
          {/*    } else {*/}
          {/*      const customTagsClone = [...state.custom_tags];*/}
          {/*      customTagsClone[0] = [];*/}
          {/*      onStateChanged({ value: customTagsClone, id: 'custom_tags' });*/}
          {/*    }*/}
          {/*  }}*/}
          {/*  getOptionLabel={(option) =>*/}
          {/*    option.name*/}
          {/*      ? option.name[i18next.language] || option.name.en*/}
          {/*      : ''*/}
          {/*  }*/}
          {/*  type={DynamicFormTypesEnum.array.key}*/}
          {/*  getDataAPI={*/}
          {/*    CustomCandidatesFilterTagsEnum.company_uuid.getApiFunction*/}
          {/*  }*/}
          {/*  parentTranslationPath={parentTranslationPath}*/}
          {/*  searchKey="search"*/}
          {/*  controlWrapperClasses="mb-0"*/}
          {/*  editValue={*/}
          {/*    state?.custom_tags?.find(*/}
          {/*      (v) =>*/}
          {/*        v?.key === CustomCandidatesFilterTagsEnum.company_uuid.key*/}
          {/*    )?.value || []*/}
          {/*  }*/}
          {/*  extraProps={{*/}
          {/*    company_uuid,*/}
          {/*    with_than:*/}
          {/*      state?.custom_tags?.find(*/}
          {/*        (v) =>*/}
          {/*          v?.key === CustomCandidatesFilterTagsEnum.company_uuid.key*/}
          {/*      )?.value || null,*/}
          {/*  }}*/}
          {/*  isSubmitted={isSubmitted}*/}
          {/*  errors={errors}*/}
          {/*/>*/}
          {/*</div>*/}
          {/*<div className="d-flex my-2">*/}
          {/*  <SharedAPIAutocompleteControl*/}
          {/*    isFullWidth*/}
          {/*    // isHalfWidth={isHalfWidth}*/}
          {/*    title={t(*/}
          {/*      `${CustomCandidatesFilterTagsEnum.original_nationality.label}`*/}
          {/*    )}*/}
          {/*    placeholder={t(*/}
          {/*      `select-${CustomCandidatesFilterTagsEnum.original_nationality.label}`*/}
          {/*    )}*/}
          {/*    stateKey="value"*/}
          {/*    errorPath={`custom_tags[1].value`}*/}
          {/*    parentIndex={1}*/}
          {/*    parentId="custom_tags"*/}
          {/*    onValueChanged={(e) => {*/}
          {/*      if (e.value?.length) {*/}
          {/*        onStateChanged(e);*/}
          {/*        onStateChanged({*/}
          {/*          parentId: 'custom_tags',*/}
          {/*          parentIndex: 1,*/}
          {/*          id: 'key',*/}
          {/*          value:*/}
          {/*            CustomCandidatesFilterTagsEnum.original_nationality.key,*/}
          {/*        });*/}
          {/*      } else {*/}
          {/*        const customTagsClone = [...state.custom_tags];*/}
          {/*        customTagsClone[1] = [];*/}
          {/*        onStateChanged({ value: customTagsClone, id: 'custom_tags' });*/}
          {/*      }*/}
          {/*    }}*/}
          {/*    getOptionLabel={(option) =>*/}
          {/*      option.name*/}
          {/*        ? option.name[i18next.language] || option.name.en*/}
          {/*        : ''*/}
          {/*    }*/}
          {/*    type={DynamicFormTypesEnum.array.key}*/}
          {/*    getDataAPI={*/}
          {/*      CustomCandidatesFilterTagsEnum.original_nationality*/}
          {/*        .getApiFunction*/}
          {/*    }*/}
          {/*    parentTranslationPath={parentTranslationPath}*/}
          {/*    searchKey="search"*/}
          {/*    controlWrapperClasses="mb-0"*/}
          {/*    editValue={*/}
          {/*      state?.custom_tags?.find(*/}
          {/*        (v) =>*/}
          {/*          v?.key*/}
          {/*          === CustomCandidatesFilterTagsEnum.original_nationality.key*/}
          {/*      )?.value || []*/}
          {/*    }*/}
          {/*    isSubmitted={isSubmitted}*/}
          {/*    errors={errors}*/}
          {/*    extraProps={{*/}
          {/*      company_uuid,*/}
          {/*      with_than:*/}
          {/*        state?.custom_tags?.find(*/}
          {/*          (v) =>*/}
          {/*            v?.key*/}
          {/*            === CustomCandidatesFilterTagsEnum.original_nationality.key*/}
          {/*        )?.value || null,*/}
          {/*    }}*/}
          {/*  />*/}
          {/*</div>*/}
          {/*<div className="d-flex my-2">*/}
          {/*  <SharedAPIAutocompleteControl*/}
          {/*    isFullWidth*/}
          {/*    // isHalfWidth={isHalfWidth}*/}
          {/*    title={t(`${CustomCandidatesFilterTagsEnum.board.label}`)}*/}
          {/*    placeholder={t(*/}
          {/*      `select-${CustomCandidatesFilterTagsEnum.board.label}`*/}
          {/*    )}*/}
          {/*    stateKey="value"*/}
          {/*    errorPath={`custom_tags[2].value`}*/}
          {/*    parentIndex={2}*/}
          {/*    parentId="custom_tags"*/}
          {/*    onValueChanged={(e) => {*/}
          {/*      if (e.value?.length) {*/}
          {/*        onStateChanged(e);*/}
          {/*        onStateChanged({*/}
          {/*          parentId: 'custom_tags',*/}
          {/*          parentIndex: 2,*/}
          {/*          id: 'key',*/}
          {/*          value: CustomCandidatesFilterTagsEnum.board.key,*/}
          {/*        });*/}
          {/*      } else {*/}
          {/*        const customTagsClone = [...state.custom_tags];*/}
          {/*        customTagsClone[2] = [];*/}
          {/*        onStateChanged({ value: customTagsClone, id: 'custom_tags' });*/}
          {/*      }*/}
          {/*    }}*/}
          {/*    getOptionLabel={(option) =>*/}
          {/*      option.name*/}
          {/*        ? option.name[i18next.language] || option.name.en*/}
          {/*        : ''*/}
          {/*    }*/}
          {/*    type={DynamicFormTypesEnum.array.key}*/}
          {/*    getDataAPI={CustomCandidatesFilterTagsEnum.board.getApiFunction}*/}
          {/*    parentTranslationPath={parentTranslationPath}*/}
          {/*    searchKey="search"*/}
          {/*    controlWrapperClasses="mb-0"*/}
          {/*    editValue={*/}
          {/*      state?.custom_tags?.find(*/}
          {/*        (v) => v?.key === CustomCandidatesFilterTagsEnum.board.key*/}
          {/*      )?.value || []*/}
          {/*    }*/}
          {/*    isSubmitted={isSubmitted}*/}
          {/*    errors={errors}*/}
          {/*    extraProps={{*/}
          {/*      company_uuid,*/}
          {/*      with_than:*/}
          {/*        state?.custom_tags?.find(*/}
          {/*          (v) => v?.key === CustomCandidatesFilterTagsEnum.board.key*/}
          {/*        )?.value || null,*/}
          {/*    }}*/}
          {/*  />*/}
          {/*</div>*/}
          {/*</div>*/}
          {/*)}*/}
          {isEdit && (
            <div className="tags-section">
              <ButtonBase
                className="btns theme-transparent mx-3 mb-2"
                onClick={() => {
                  const localTags = [...(state.candidate_property || [])];
                  localTags.push({
                    key: '',
                    value: '',
                  });
                  onStateChanged({ id: 'candidate_property', value: localTags });
                }}
              >
                <span className="fas fa-plus" />
                <span className="px-1">{t('add-candidate-prop')}</span>
              </ButtonBase>
              {candidateProperties?.length > 0
                && state?.candidate_property?.length > 0
                && (state?.candidate_property || [])?.map((item, idx, items) => (
                  <div
                    key={`candidatePropertiesKey${idx}`}
                    className={`my-2 ${!isFullWidth && 'd-flex'}`}
                  >
                    {isFullWidth && (
                      <ButtonBase
                        className="btns-icon theme-transparent"
                        onClick={onTagDeleteHandler(
                          idx,
                          items,
                          'candidate_property',
                        )}
                        // disabled={
                        //   getCurrentCandidatePropertyItem(item.uuid)
                        //   && getCurrentCandidatePropertyItem(item.uuid).is_required
                        // }
                      >
                        <span className="fas fa-times" />
                      </ButtonBase>
                    )}
                    <SharedAPIAutocompleteControl
                      isHalfWidth={isHalfWidth}
                      isFullWidth={isFullWidth}
                      title="candidate-property"
                      placeholder="select-candidate-property"
                      stateKey="uuid"
                      errorPath={`candidate_property[${idx}].uuid`}
                      parentIndex={idx}
                      parentId="candidate_property"
                      onValueChanged={(newValue) => {
                        onStateChanged({
                          ...newValue,
                          id: 'isRequired',
                          value: Boolean(
                            newValue.value
                              && getCurrentCandidatePropertyItem(newValue.value)
                                ?.is_required,
                          ),
                        });
                        if (item.value)
                          onStateChanged({ ...newValue, id: 'value', value: null });
                        onStateChanged(newValue);
                      }}
                      getOptionLabel={(option) =>
                        option?.name?.[i18next.language] || option?.name?.en
                      }
                      getDataAPI={GetAllSetupsCandidateProperties}
                      parentTranslationPath={parentTranslationPath}
                      searchKey="search"
                      controlWrapperClasses="mb-0"
                      editValue={item.uuid}
                      isLoading={isCandidatePropsLoading}
                      isSubmitted={isSubmitted}
                      errors={errors}
                      extraProps={{
                        company_uuid,
                        ...(item?.uuid?.length && { with_than: [item.uuid] }),
                      }}
                      wrapperClasses={isFullWidth && 'my-2'}
                    />

                    {(item.uuid
                      && ((getCurrentCandidatePropertyItem(item.uuid)
                        && getCurrentCandidatePropertyItem(item.uuid)?.from_lookup)
                        || IsUUID(item.value)) && (
                      <SharedAPIAutocompleteControl
                        editValue={
                          item.value
                            || (getCurrentCandidatePropertyItem(item.uuid)
                              ?.lookup_type === LookupsTypesEnum.Multiple.key
                              && [])
                            || undefined
                        }
                        title="candidate-property-value"
                        isRequired={
                          getCurrentCandidatePropertyItem(item.uuid)?.is_required
                        }
                        placeholder="select-candidate-property-value"
                        key={`candidatePropertiesKeys${idx + 1}`}
                        stateKey="value"
                        parentIndex={idx}
                        isLoading={isCandidatePropsLoading}
                        parentId="candidate_property"
                        errorPath={`candidate_property[${idx}].value`}
                        isSubmitted={isSubmitted}
                        errors={errors}
                        searchKey="query"
                        getDataAPI={DynamicService}
                        uniqueKey={
                          getCurrentCandidatePropertyItem(item.uuid)?.config?.api
                            .primary_key
                        }
                        getAPIProperties={getDynamicServicePropertiesHandler}
                        extraProps={{
                          path: getCurrentCandidatePropertyItem(item.uuid)?.config
                            ?.api?.end_point,
                          method: getCurrentCandidatePropertyItem(item.uuid)
                            ?.config?.api?.method,
                          headers:
                              (company_uuid && {
                                'Accept-Company': company_uuid,
                              })
                              || undefined,
                          params: {
                            with_than:
                                (item.value
                                  && ((getCurrentCandidatePropertyItem(item.uuid)
                                    ?.lookup_type
                                    === LookupsTypesEnum.Multiple.key
                                    && item.value) || [item.value]))
                                || [],
                          },
                        }}
                        getOptionLabel={getDisplayedLabel}
                        parentTranslationPath={parentTranslationPath}
                        type={
                          (getCurrentCandidatePropertyItem(item.uuid)
                            ?.lookup_type === LookupsTypesEnum.Multiple.key
                              && DynamicFormTypesEnum.array.key)
                            || undefined
                        }
                        onValueChanged={onStateChanged}
                        isHalfWidth={isHalfWidth}
                        isFullWidth={isFullWidth}
                      />
                    )) || (
                      <SharedInputControl
                        isHalfWidth={isHalfWidth}
                        isFullWidth={isFullWidth}
                        title="candidate-property-value"
                        parentId="candidate_property"
                        parentIndex={idx}
                        stateKey="value"
                        searchKey="search"
                        placeholder="candidate-property-value"
                        isDisabled={isCandidatePropsLoading}
                        onValueChanged={onStateChanged}
                        parentTranslationPath={parentTranslationPath}
                        editValue={item.value || ''}
                        wrapperClasses={`${isFullWidth && 'mb-0'}`}
                        errorPath={`candidate_property[${idx}].value`}
                        isSubmitted={isSubmitted}
                        errors={errors}
                      />
                    )}
                    {!isFullWidth && (
                      <ButtonBase
                        className="btns-icon theme-transparent mx-3"
                        onClick={onTagDeleteHandler(
                          idx,
                          items,
                          'candidate_property',
                        )}
                        // disabled={
                        //   getCurrentCandidatePropertyItem(item.uuid)
                        //   && getCurrentCandidatePropertyItem(item.uuid).is_required
                        // }
                      >
                        <span className="fas fa-times" />
                      </ButtonBase>
                    )}
                  </div>
                ))}
            </div>
          )}
          {isEdit && (
            <div className="section-item-body-wrapper">
              <SharedAutocompleteControl
                editValue={state.free_tags}
                placeholder="press-enter-to-add"
                title="free-tags"
                isFreeSolo
                stateKey="free_tags"
                errorPath="free_tags"
                onValueChanged={onStateChanged}
                isSubmitted={isSubmitted}
                isDisabled={isLoading || isCandidatePropsLoading}
                errors={errors}
                type={DynamicFormTypesEnum.array.key}
                parentTranslationPath={parentTranslationPath}
                isFullWidth
              />
            </div>
          )}
          {!isEdit && state?.free_tags?.length > 0 && (
            <div className="mt-3">
              <span className="fw-bold">{t('free-tags')}:</span>
              <span className="mx-2">{state.free_tags?.join(', ')}</span>
            </div>
          )}
          {!isEdit && state?.candidate_property?.length > 0 && (
            <>
              {state?.candidate_property?.map(
                (item, idx) =>
                  (item.name && (
                    <div key={`${item.uuid}-${idx}`}>
                      <span className="fw-bold">{item.name}:</span>
                      <span className="mx-2">
                        {(Array.isArray(item.value) && item.value.join(', '))
                          || item.value}
                      </span>
                    </div>
                  )) || (
                    <div key={`${item.uuid}-${idx}`}>
                      <span className="fw-bold">
                        <SharedAPIAutocompleteControl
                          isHalfWidth={isHalfWidth}
                          isFullWidth={isFullWidth}
                          title="candidate-property"
                          placeholder="select-candidate-property"
                          stateKey="uuid"
                          errorPath={`candidate_property[${idx}].uuid`}
                          parentIndex={idx}
                          parentId="candidate_property"
                          getOptionLabel={(option) =>
                            option?.name?.[i18next.language] || option?.name?.en
                          }
                          getDataAPI={GetAllSetupsCandidateProperties}
                          parentTranslationPath={parentTranslationPath}
                          searchKey="search"
                          isDisabled
                          isLoading={isCandidatePropsLoading}
                          onValueChanged={() => {}}
                          controlWrapperClasses="mb-0"
                          editValue={item.uuid}
                          extraProps={{
                            company_uuid,
                            ...(item?.uuid?.length && { with_than: [item.uuid] }),
                          }}
                          wrapperClasses={isFullWidth && 'my-2'}
                        />
                      </span>
                      <span className="mx-2">
                        {!Array.isArray(item.value) && !IsUUID(item.value) ? (
                          <span className="d-inline-flex mb-2">{item.value}</span>
                        ) : (
                          candidateProperties.length > 0 && (
                            <SharedAPIAutocompleteControl
                              editValue={
                                item.value
                                || (Array.isArray(item.value) && [])
                                || undefined
                              }
                              title="candidate-property-value"
                              placeholder="select-candidate-property-value"
                              key={`candidatePropertiesKeys${idx + 1}`}
                              stateKey="value"
                              parentIndex={idx}
                              parentId="candidate_property"
                              errorPath={`candidate_property[${idx}].value`}
                              isSubmitted={isSubmitted}
                              errors={errors}
                              searchKey="query"
                              getDataAPI={DynamicService}
                              uniqueKey={
                                getCurrentCandidatePropertyItem(item.uuid)?.config
                                  ?.api?.primary_key
                              }
                              getAPIProperties={getDynamicServicePropertiesHandler}
                              extraProps={{
                                path: getCurrentCandidatePropertyItem(item.uuid)
                                  ?.config?.api?.end_point,
                                method: getCurrentCandidatePropertyItem(item.uuid)
                                  ?.config?.api?.method,
                                headers:
                                  (company_uuid && {
                                    'Accept-Company': company_uuid,
                                  })
                                  || undefined,
                                params: {
                                  with_than:
                                    (item.value
                                      && ((Array.isArray(item.value) && item.value) || [
                                        item.value,
                                      ]))
                                    || [],
                                },
                              }}
                              getOptionLabel={getDisplayedLabel}
                              parentTranslationPath={parentTranslationPath}
                              type={
                                (Array.isArray(item.value)
                                  && DynamicFormTypesEnum.array.key)
                                || undefined
                              }
                              isLoading={isCandidatePropsLoading}
                              isDisabled
                              onValueChanged={() => {}}
                              isHalfWidth={isHalfWidth}
                              isFullWidth={isFullWidth}
                            />
                          )
                        )}
                      </span>
                    </div>
                  ),
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

TagsSection.propTypes = {
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

TagsSection.defaultProps = {
  isEdit: undefined,
  isFullWidth: undefined,
  isHalfWidth: undefined,
  company_uuid: undefined,
};
