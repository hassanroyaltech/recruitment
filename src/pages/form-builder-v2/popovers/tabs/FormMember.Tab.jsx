import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../setups/shared';
import {
  CheckboxesComponent,
  LoadableImageComponant,
  LoaderComponent,
} from '../../../../components';
import defaultUserImage from '../../../../assets/icons/user-avatar.svg';
import Avatar from '@mui/material/Avatar';
import { GlobalSearchDelay, showError, StringToColor } from '../../../../helpers';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import {
  AnalyticsDashboardPermissionsTypesEnum,
  FormsAssignTypesEnum,
  FormsMembersTypesEnum,
} from '../../../../enums';
import { useEventListener } from '../../../../hooks';
import { GetAllActiveJobs, GetJobById } from '../../../../services';

const FormMemberTab = ({
  listAPI,
  listAPIDataPath,
  listAPITotalPath,
  imageAltValue,
  arrayKey,
  typeKey,
  type,
  isWithIndeterminate,
  state,
  isImage,
  isDisabled,
  uuidKey,
  listAPIProps,
  getListAPIProps,
  onStateChanged,
  extraStateData,
  getIsDisabledItem,
  dropdownsProps,
  isWithJobsFilter,
  getPropsByType,
  parentTranslationPath,
  translationPath,
  dataKey,
  nameKey,
  isDisabledTextSearch,
  withAnalyticsPermissions,
  isReadJobFromParent,
  jobUUID,
  isStaticDataList,
  dataList,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const bodyRef = useRef(null);
  const isLoadingRef = useRef(null);
  const [pipelinesList, setPipelinesList] = useState([]);
  const selectedItemsUUIDsRef = useRef([]);
  const [stagesList, setStagesList] = useState([]);
  const [localListAPIProps, setLocalListAPIProps] = useState(
    (dropdownsProps && {
      job_uuid: dropdownsProps.job_uuid,
      pipeline_uuid: dropdownsProps.job_pipeline_uuid,
      stage_uuid: dropdownsProps.stage_uuid,
      selected_candidates: dropdownsProps.selected_candidates,
    })
      || {},
  );

  const [data, setData] = useState(() => ({
    results: [],
    totalCount: 0,
  }));
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    search: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const searchTimerRef = useRef(null);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is update filter on search
   */
  const searchHandler = (newValue) => {
    const { value } = newValue;
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setFilter((items) => ({ ...items, page: 1, search: value }));
    }, GlobalSearchDelay);
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is checking if the stage is half select or not (by selecting the stage)
   */
  const getIsIndeterminateChecked = useMemo(
    () =>
      ({ item, arrayToCheck }) =>
        isWithIndeterminate
        && arrayToCheck.some(
          (element) =>
            element[uuidKey] !== item.uuid
            && element.stage_uuid
            && element.stage_uuid === item.uuid,
        ),
    [isWithIndeterminate, uuidKey],
  );
  /**
   * @param item - the return item from data source
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the item name
   */
  const getItemName = useCallback(
    (item) =>
      nameKey
        ? item[nameKey]
        : (item.name
            && (typeof item.name === 'object'
              ? item.name[i18next.language] || item.name.en
              : item.name))
          || (item.title
            && (item.title[i18next.language] || item.title.en || item.title))
          || `${
            item.first_name
            && (typeof item.first_name === 'object'
              ? item.first_name[i18next.language] || item.first_name.en
              : item.first_name)
          }${
            item.last_name
            && ` ${
              typeof item.last_name === 'object'
                ? item.last_name[i18next.language] || item.last_name?.en || ''
                : item.last_name
            }`
          }`
          || '',
    [nameKey],
  );

  /**
   * @param element - instance of object
   * @param isFullData - bool if reading from the full list
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the selected item index
   */
  const getIsSelectedItemIndex = useMemo(
    () =>
      ({ element }) =>
        state[arrayKey]
          ? state[arrayKey].findIndex(
            (item) =>
              item[uuidKey] === element[uuidKey]
                || (element.stage_uuid
                  && (type === FormsMembersTypesEnum.Candidates.key
                    || type === FormsAssignTypesEnum.JobCandidate.key)
                  && item[uuidKey] === element.stage_uuid),
          )
          : -1,
    [arrayKey, state, type, uuidKey],
  );

  const getSelectedItemUUIDs = useMemo(
    () => () =>
      state[arrayKey]
        ? state[arrayKey]
          .filter((item) => item.type === type)
          .map((item) => item[uuidKey])
        : [],
    [arrayKey, state, uuidKey, type],
  );
  const initializeStaticDataList = useCallback(() => {
    if (!dataList) return null;
    return {
      results: dataList.map((item) => ({
        ...item,
        [nameKey]: t(`${translationPath}${item.value}`),
      })),
      totalCount: dataList.length,
    };
  }, [dataList, nameKey, t, translationPath]);
  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to responsibility data
   */
  const getAllData = useCallback(
    async (isFromUseEffect = false) => {
      if (!isFromUseEffect) return;
      if (
        (isWithJobsFilter || dropdownsProps)
        && (!localListAPIProps.job_uuid
          || !localListAPIProps.pipeline_uuid
          || !localListAPIProps.stage_uuid)
      )
        return;
      if (isStaticDataList) {
        setData(initializeStaticDataList());
        return;
      }
      isLoadingRef.current = true;
      setIsLoading(true);
      const localWithThan
        = (getPropsByType && getPropsByType({ type }).with_than)
        || (getListAPIProps && getListAPIProps({ type }).with_than)
        || (listAPIProps && listAPIProps.with_than)
        || (selectedItemsUUIDsRef.current?.length > 0
          && selectedItemsUUIDsRef.current)
        || undefined;
      const response = await listAPI({
        ...filter,
        ...(getPropsByType
          && getPropsByType({ type }).isWithThanOnly && {
          limit:
              // (getListAPIProps
              //   && (getListAPIProps({ type }).with_than || []).length)
              // || (listAPIProps && (listAPIProps.with_than || []).length)
              // ||
              0,
        }),
        ...(listAPIProps || {}),
        ...(((isWithJobsFilter || dropdownsProps) && localListAPIProps) || {}),
        ...((getListAPIProps && getListAPIProps({ type })) || {}),
        ...{
          with_than: filter.page > 1 ? undefined : localWithThan,
        },
      });
      if (response && (response.status === 200 || response.status === 201)) {
        const {
          data: { results },
        } = response;
        let localData = results;
        const localTotal = listAPITotalPath
          ? localData[listAPITotalPath] || 0
          : response.data.paginate
            ? response.data.paginate.total || 0
            : localData.length || 0;
        if (listAPIDataPath) localData = results[listAPIDataPath];
        if (dataKey) localData = localData[dataKey];
        if (getPropsByType && getPropsByType({ type }).isWithThanOnly)
          localData = localData.filter(
            (item) =>
              localWithThan?.includes(item.uuid)
              || localWithThan?.includes(item.stage_uuid),
          );
        if (filter.page === 1)
          setData({
            results: localData || [],
            totalCount: localTotal,
          });
        else
          setData((items) => ({
            results: [...items.results, ...localData].filter(
              (item, index, items) =>
                items.findIndex((element) => element[uuidKey] === item[uuidKey])
                === index,
            ),
            totalCount: localTotal,
          }));
      } else {
        showError(t('Shared:failed-to-get-saved-data'), response);
        setData({
          results: [],
          totalCount: 0,
        });
      }
      isLoadingRef.current = false;
      setIsLoading(false);
    },
    [
      isWithJobsFilter,
      dropdownsProps,
      localListAPIProps,
      isStaticDataList,
      getPropsByType,
      type,
      getListAPIProps,
      listAPIProps,
      listAPI,
      filter,
      initializeStaticDataList,
      listAPITotalPath,
      listAPIDataPath,
      dataKey,
      uuidKey,
      t,
    ],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the selection of the filter for candidates list
   */
  const onLocalListAPIPropsChanged = useCallback((newValue) => {
    if (newValue.id === 'job_uuid') {
      setLocalListAPIProps({
        [newValue.id]: newValue.value,
        pipeline_uuid: null,
        stage_uuid: null,
      });
      setData({
        results: [],
        totalCount: 0,
      });
    } else if (newValue.id === 'pipeline_uuid')
      setLocalListAPIProps((items) => ({
        ...items,
        [newValue.id]: newValue.value,
        stage_uuid: null,
      }));
    else {
      setLocalListAPIProps((items) => ({
        ...items,
        [newValue.id]: newValue.value,
      }));
      setFilter((items) => ({ ...items, page: 1 }));
    }
  }, []);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to save the returned pipelines list for the selected job
   */
  const getPipelinesList = useCallback((data) => {
    const localPipelines = (data && data.job && data.job.pipelines) || [];
    setPipelinesList(localPipelines);
  }, []);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to save the returned stages list for the selected pipeline
   */
  const getStagesList = useCallback(() => {
    const selectedPipeline = pipelinesList.find(
      (item) => item.uuid === localListAPIProps.pipeline_uuid,
    );
    if (selectedPipeline) setStagesList(selectedPipeline.stages || []);
  }, [localListAPIProps.pipeline_uuid, pipelinesList]);

  // this is to get stages list on selected pipeline change
  useEffect(() => {
    if (localListAPIProps.pipeline_uuid) getStagesList();
    else setStagesList((items) => (items.length > 0 ? [] : items));
  }, [pipelinesList, getStagesList, localListAPIProps.pipeline_uuid]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to load more data on scroll the container of the list to the end or not scrollable yet
   */
  const onScrollHandler = useCallback(() => {
    if (
      bodyRef.current.offsetHeight + bodyRef.current.scrollTop
        >= bodyRef.current.scrollHeight - 5
      && data.results.length < data.totalCount
      && !isLoadingRef.current
      && (!getPropsByType || !getPropsByType({ type }).isWithThanOnly)
    )
      setFilter((items) => ({ ...items, page: items.page + 1 }));
  }, [data.results.length, data.totalCount, getPropsByType, type]);

  useEventListener('scroll', onScrollHandler, bodyRef.current);

  useEffect(() => {
    selectedItemsUUIDsRef.current = getSelectedItemUUIDs();
  }, [getSelectedItemUUIDs]);
  useEffect(() => {
    if (isReadJobFromParent && jobUUID) setLocalListAPIProps({ job_uuid: jobUUID });
  }, [isReadJobFromParent, jobUUID]);
  useEffect(() => {
    getAllData(true);
  }, [getAllData, filter]);
  const isAnalyticsEditChecked = useCallback(
    (item) => {
      const itemIndex = getIsSelectedItemIndex({ element: item });
      if (getIsSelectedItemIndex({ element: item }) !== -1)
        return (
          state[arrayKey]?.[itemIndex]?.permission
          === AnalyticsDashboardPermissionsTypesEnum.Edit.key
        );
      return false;
    },
    [arrayKey, getIsSelectedItemIndex, state],
  );
  return (
    <div className="form-member-tab-wrapper tab-wrapper">
      <div className="list-wrapper mb-3">
        <SharedInputControl
          placeholder="search-by-name"
          stateKey="selection_search"
          editValue={filter.search}
          inputWrapperClasses="bx-0"
          isLoading={isLoading}
          onValueChanged={searchHandler}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isFullWidth
          isDisabled={isDisabledTextSearch}
        />
        {isWithJobsFilter
          && (!getPropsByType || !getPropsByType({ type }).isWithThanOnly) && (
          <>
            <SharedAPIAutocompleteControl
              isFullWidth
              editValue={localListAPIProps.job_uuid}
              placeholder="select-job"
              title="job"
              stateKey="job_uuid"
              getOptionLabel={(option) => option.title}
              searchKey="search"
              getDataAPI={GetAllActiveJobs}
              extraProps={{
                ...(localListAPIProps.job_uuid && {
                  with_than: [localListAPIProps.job_uuid],
                  job_type: 'active-archived',
                }),
              }}
              dataKey="jobs"
              controlWrapperClasses="px-2"
              onValueChanged={onLocalListAPIPropsChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              isDisabled={isReadJobFromParent}
            />
            {localListAPIProps.job_uuid && (
              <SharedAPIAutocompleteControl
                isHalfWidth
                editValue={localListAPIProps.pipeline_uuid}
                placeholder="select-pipeline"
                title="pipeline"
                stateKey="pipeline_uuid"
                getOptionLabel={(option) => option.title}
                searchKey="search"
                getDataAPI={GetJobById}
                getReturnedData={getPipelinesList}
                extraProps={{
                  ...(localListAPIProps.job_uuid && {
                    job_uuid: localListAPIProps.job_uuid,
                  }),
                }}
                dataKey="job.pipelines"
                controlWrapperClasses="px-2"
                onValueChanged={onLocalListAPIPropsChanged}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
              />
            )}
            {localListAPIProps.pipeline_uuid && (
              <SharedAutocompleteControl
                isHalfWidth
                title="stage"
                stateKey="stage_uuid"
                searchKey="search"
                placeholder="select-stage"
                editValue={localListAPIProps.stage_uuid}
                isDisabled={isLoading}
                onValueChanged={onLocalListAPIPropsChanged}
                initValues={stagesList}
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                initValuesKey="uuid"
                initValuesTitle="title"
                sharedClassesWrapper="px-2"
              />
            )}
          </>
        )}
        <div className="list-items-wrapper" ref={bodyRef}>
          <div>
            {data?.results?.map(
              (item, index) =>
                (!filter.search
                  || !getItemName(item)
                  || getItemName(item)
                    .toLowerCase()
                    .includes(filter.search.toLowerCase())) && (
                  <div
                    className="list-item"
                    key={`selectionGroupItemKey${uuidKey}${index + 1}`}
                  >
                    <CheckboxesComponent
                      idRef={`selectionGroupItemRef${uuidKey}${index + 1}`}
                      singleIndeterminate={getIsIndeterminateChecked({
                        item,
                        arrayToCheck: state[arrayKey],
                      })}
                      singleChecked={
                        getIsSelectedItemIndex({ element: item }) !== -1
                      }
                      isDisabled={
                        isDisabled
                        || isLoading
                        || (getIsDisabledItem
                          && getIsDisabledItem({
                            memberItem: item,
                            memberIndex: index,
                            isSelectedItem:
                              getIsSelectedItemIndex({ element: item }) !== -1,
                            selectedItems: state[arrayKey]
                          }))
                        || undefined
                      }
                      onSelectedCheckboxChanged={(event, isChecked) => {
                        if (!onStateChanged) return;
                        let localItems = [...(state[arrayKey] || [])];
                        if (isChecked) {
                          localItems.push({
                            [typeKey]: type,
                            [uuidKey]: item.uuid || item[uuidKey],
                            stage_uuid: item.stage_uuid,
                            name: item.name || getItemName(item),
                            ...(nameKey && { [nameKey]: getItemName(item) }),
                            ...extraStateData,
                          });
                          if (isWithIndeterminate)
                            localItems = localItems.filter(
                              (element) =>
                                !element.stage_uuid
                                || element.stage_uuid !== item.uuid,
                            );
                        } else {
                          const localItemIndex = getIsSelectedItemIndex({
                            element: item,
                          });
                          if (localItemIndex !== -1)
                            localItems.splice(localItemIndex, 1);
                        }
                        onStateChanged({
                          id: arrayKey,
                          value: localItems,
                        });
                      }}
                    />
                    <span className="d-inline-flex-v-center">
                      {(isImage && (item.url || !getItemName(item)) && (
                        <LoadableImageComponant
                          classes="list-image-wrapper"
                          alt={t(`${translationPath}${imageAltValue}`)}
                          src={item.url || defaultUserImage}
                        />
                      )) || (
                        <>
                          <Avatar
                            sx={{
                              backgroundColor: StringToColor(getItemName(item)),
                            }}
                          >
                            {getItemName(item)
                              .split(' ')
                              .filter(
                                (element, elementIndex, elements) =>
                                  elementIndex === 0
                                  || elementIndex === elements.length - 1,
                              )
                              .map((word) => word[0]) || ''}
                          </Avatar>
                          <span className="px-2 break-word">
                            {getItemName(item)}
                          </span>
                        </>
                      )}
                    </span>
                    {getIsSelectedItemIndex({ element: item }) !== -1
                    && withAnalyticsPermissions ? (
                        <div className="permissions-checkboxes d-inline-flex-v-center">
                          <CheckboxesComponent
                            idRef={`selectedViewPermissionRef${uuidKey}${index + 1}`}
                            singleChecked={true}
                            translationPath={translationPath}
                            parentTranslationPath={parentTranslationPath}
                            label={t(
                              `${translationPath}${AnalyticsDashboardPermissionsTypesEnum.View.value}`,
                            )}
                            isDisabled={true}
                          />
                          <CheckboxesComponent
                            idRef={`selectedEditPermissionRef${uuidKey}${index + 1}`}
                            singleChecked={isAnalyticsEditChecked(item)}
                            translationPath={translationPath}
                            parentTranslationPath={parentTranslationPath}
                            label={t(
                              `${translationPath}${AnalyticsDashboardPermissionsTypesEnum.Edit.value}`,
                            )}
                            onSelectedCheckboxChanged={(event, isChecked) => {
                              if (!onStateChanged) return;
                              let localItems = [...(state[arrayKey] || [])];
                              const itemIndex = getIsSelectedItemIndex({
                                element: item,
                              });
                              if (isChecked)
                                localItems[itemIndex].permission
                                = AnalyticsDashboardPermissionsTypesEnum.Edit.key;
                              else
                                localItems[itemIndex].permission
                                = AnalyticsDashboardPermissionsTypesEnum.View.key;

                              onStateChanged({
                                id: arrayKey,
                                value: localItems,
                              });
                            }}
                          />
                        </div>
                      ) : (
                        ''
                      )}
                  </div>
                ),
            )}
          </div>
          <LoaderComponent
            isLoading={isLoading}
            isSkeleton
            skeletonItems={[
              {
                variant: 'rectangular',
                style: { minHeight: 30, marginTop: 5, marginBottom: 5 },
              },
            ]}
            numberOfRepeat={4}
          />
        </div>
      </div>
    </div>
  );
};

FormMemberTab.propTypes = {
  listAPI: PropTypes.func.isRequired,
  listAPIDataPath: PropTypes.string,
  listAPITotalPath: PropTypes.string,
  imageAltValue: PropTypes.string,
  type: PropTypes.oneOf(
    Object.values(FormsMembersTypesEnum).map((item) => item.key),
  ),
  getIsIndeterminateChecked: PropTypes.func,
  dropdownsProps: PropTypes.shape({
    job_uuid: PropTypes.string,
    job_pipeline_uuid: PropTypes.string,
    stage_uuid: PropTypes.string,
    selected_candidates: PropTypes.arrayOf(PropTypes.string),
  }),
  isWithJobsFilter: PropTypes.bool,
  isWithIndeterminate: PropTypes.bool,
  getPropsByType: PropTypes.func,
  listAPIProps: PropTypes.instanceOf(Object),
  arrayKey: PropTypes.string.isRequired,
  getIsDisabledItem: PropTypes.func,
  state: PropTypes.instanceOf(Object).isRequired,
  uuidKey: PropTypes.string.isRequired,
  typeKey: PropTypes.string.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  getListAPIProps: PropTypes.func,
  isImage: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  extraStateData: PropTypes.instanceOf(Object).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  dataKey: PropTypes.string,
  nameKey: PropTypes.string,
  isDisabledTextSearch: PropTypes.bool,
  withAnalyticsPermissions: PropTypes.bool,
  isReadJobFromParent: PropTypes.bool,
  jobUUID: PropTypes.string,
  isStaticDataList: PropTypes.bool,
  dataList: PropTypes.instanceOf(Array),
};

export default FormMemberTab;
