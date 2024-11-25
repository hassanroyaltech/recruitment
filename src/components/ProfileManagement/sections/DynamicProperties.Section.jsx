import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { DynamicFormTypesEnum, LookupsTypesEnum } from '../../../enums';
import {
  SharedAPIAutocompleteControl,
  SharedInputControl,
} from '../../../pages/setups/shared';

import { DynamicService, GetAllSetupsCandidateProperties } from 'services';
import { RemoveDuplicatesByUuid, showError } from 'helpers';
import item from '../../../pages/evassess/pipeline/Item';

const parentTranslationPath = 'EvarecCandidateModel';

export const DynamicPropertiesSection = ({
  state,
  onStateChanged,
  // isSubmitted,
  // isLoading,
  // errors,
  isEdit,
  isHalfWidth,
  isFullWidth,
  company_uuid,
  requirements,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [candidateProperties, setCandidateProperties] = useState([]);
  const [isCandidatePropsLoading, setIsCandidatePropsLoading] = useState(false);
  const [requirementsData, setRequirementsData] = useState([]);
  const [dynamicPropertiesDetails, setDynamicPropertiesDetails] = useState([]);
  const getDisplayedLabel = useMemo(
    () => (option) =>
      (option.title && (option.title[i18next.language] || option.title.en))
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

  const getEditInitRequirements = useCallback(() => {
    if (!isEdit || !candidateProperties?.length || !requirements?.length) return;
    let localeRequirement = (requirements || []).filter(
      (item) => item.value !== 'disabled',
    );
    if (!localeRequirement.length) return;
    const detailedRequirements = localeRequirement
      .filter((item) => candidateProperties.some((el) => el.uuid === item.uuid))
      .map((item) => {
        const detailedItem
          = candidateProperties.find((el) => el.uuid === item.uuid) || {};
        return {
          ...item,
          ...detailedItem,
        };
      });
    setRequirementsData(detailedRequirements);
  }, [candidateProperties, isEdit, requirements]);
  useEffect(() => {
    getEditInitRequirements();
  }, [getEditInitRequirements]);

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
    getAllCandidateProperties();
  }, [getAllCandidateProperties]);

  const viewDynamicHandler = useCallback(async () => {
    if (!state?.dynamic_properties?.length || !candidateProperties.length || isEdit)
      return;
    let responses = [];
    const itemsTofetch = (state?.dynamic_properties || [])
      .filter(
        (item) =>
          Array.isArray(item?.value)
          && item?.value?.length > 0
          && candidateProperties.some((el) => el.uuid === item.uuid),
      )
      .map((item) => {
        const detailedItem
          = candidateProperties.find((el) => el.uuid === item.uuid) || {};
        return {
          ...item,
          apiParams: {
            path: detailedItem.config.api.end_point,
            method: detailedItem.config.api.method,
            headers:
              (company_uuid && {
                'Accept-Company': company_uuid,
              })
              || undefined,
            params: {
              with_than: item.value || [],
              limit: 1,
            },
          },
        };
      });
    if (itemsTofetch?.length > 0) {
      const promisesArrayRes = await Promise.allSettled(
        itemsTofetch.map((item) => DynamicService(item.apiParams)),
      );
      if (promisesArrayRes.length)
        promisesArrayRes.forEach((item) => {
          if (item.status === 'fulfilled')
            responses = RemoveDuplicatesByUuid([
              ...responses,
              ...(item?.value?.data?.results || []),
            ]);
        });
    }
    const itemsToView = (
      (state?.dynamic_properties || []).filter((item) =>
        candidateProperties.some((el) => el.uuid === item.uuid),
      ) || []
    ).map((item) => ({
      ...item,
      ...(candidateProperties.find((el) => el.uuid === item.uuid) || {}),
      value: !Array.isArray(item?.value)
        ? item.value
        : (responses || []).filter((el) => (item?.value || []).includes(el.uuid)),
    }));
    setDynamicPropertiesDetails(itemsToView);
  }, [candidateProperties, company_uuid, isEdit, state?.dynamic_properties]);

  useEffect(() => {
    viewDynamicHandler();
  }, [viewDynamicHandler]);

  const extractViewValues = useCallback((item) => {
    if (typeof item.value === 'string') return item.value;
    if (Array.isArray(item.value))
      return item.value
        .map((item) => item.name[i18next.language] || item.name.en)
        .join(', ');
    return '-';
  }, []);

  const extractEditValue = useCallback(
    (property) => {
      const localeItem
        = (state?.dynamic_properties || []).find(
          (item) => item.uuid === property.uuid,
        ) || {};
      if (property?.type === 'text') return localeItem?.value;
      if (property.lookup_type === LookupsTypesEnum.Multiple.key)
        if (Array.isArray(localeItem?.value)) return localeItem?.value;
        else return [];
      if (property.lookup_type === LookupsTypesEnum.Single.key)
        if (Array.isArray(localeItem?.value)) return localeItem?.value?.[0];
        else return null;
      return localeItem?.value || '';
    },
    [state?.dynamic_properties],
  );
  const onChangeHandler = (property, value) => {
    let localeValue = {
      uuid: property.uuid,
      value,
    };
    const localeState = [...(state?.dynamic_properties || [])];
    const itemIndex = localeState.findIndex((item) => item.uuid === property.uuid);
    if (
      property.lookup_type === LookupsTypesEnum.Single.key
      && property?.type !== 'text'
    )
      localeValue.value = value ? [value] : [];
    localeState[itemIndex === -1 ? localeState.length : itemIndex] = localeValue;
    onStateChanged({ id: 'dynamic_properties', value: localeState });
  };

  return (
    <div className="section-item-wrapper w-100">
      {isEdit && <div className="section-item-title">{t('dynamic-properties')}</div>}
      <div className="section-item-body-wrapper px-2">
        {isEdit && requirementsData?.length > 0 && (
          <>
            {requirementsData?.map((item) => (
              <React.Fragment key={`candidatePropertiesKey${item.uuid}`}>
                {(item.uuid && item.from_lookup && item?.type !== 'text' && (
                  <SharedAPIAutocompleteControl
                    editValue={extractEditValue(item) || undefined}
                    title={getDisplayedLabel(item)}
                    placeholder={getDisplayedLabel(item)}
                    stateKey="value"
                    isLoading={isCandidatePropsLoading}
                    searchKey="query"
                    getDataAPI={DynamicService}
                    uniqueKey={item.config.api.primary_key}
                    getAPIProperties={getDynamicServicePropertiesHandler}
                    extraProps={{
                      path: item.config.api.end_point,
                      method: item.config.api.method,
                      headers:
                        (company_uuid && {
                          'Accept-Company': company_uuid,
                        })
                        || undefined,
                      params: {
                        with_than:
                          (extractEditValue(item)
                            && ((item.lookup_type === LookupsTypesEnum.Multiple.key
                              && extractEditValue(item)) || [
                              extractEditValue(item),
                            ]))
                          || [],
                      },
                    }}
                    getOptionLabel={getDisplayedLabel}
                    parentTranslationPath={parentTranslationPath}
                    type={
                      (item.lookup_type === LookupsTypesEnum.Multiple.key
                        && DynamicFormTypesEnum.array.key)
                      || undefined
                    }
                    onValueChanged={(newValue) => {
                      onChangeHandler(item, newValue?.value);
                    }}
                    isHalfWidth={isHalfWidth}
                    isFullWidth={isFullWidth}
                  />
                )) || (
                  <SharedInputControl
                    isHalfWidth={isHalfWidth}
                    isFullWidth={isFullWidth}
                    title={getDisplayedLabel(item)}
                    searchKey="search"
                    placeholder={getDisplayedLabel(item)}
                    isDisabled={isCandidatePropsLoading}
                    onValueChanged={(newValue) => {
                      onChangeHandler(item, newValue?.value);
                    }}
                    parentTranslationPath={parentTranslationPath}
                    editValue={extractEditValue(item) || ''}
                    // wrapperClasses={`${isFullWidth && 'mb-0'}`}
                  />
                )}
              </React.Fragment>
            ))}
          </>
        )}
        {!isEdit && dynamicPropertiesDetails.length > 0 && (
          <>
            {dynamicPropertiesDetails?.map((item, idx) => (
              <div key={`${item.uuid}-${idx}`}>
                <span className="fw-bold">{getDisplayedLabel(item)} :</span>
                <span className="mx-2">{extractViewValues(item) || '-'}</span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
