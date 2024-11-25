import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { SharedInputControl } from '../../../../setups/shared';
import {
  CheckboxesComponent,
  LoadableImageComponant,
  LoaderComponent,
} from '../../../../../components';
import defaultUserImage from '../../../../../assets/icons/user-avatar.svg';
import Avatar from '@mui/material/Avatar';
import { GlobalSearchDelay, showError, StringToColor } from '../../../../../helpers';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { OnboardingTypesEnum } from '../../../../../enums';
import { useEventListener } from '../../../../../hooks';

const DirectoryTab = ({
  listAPI,
  listAPIDataPath,
  imageAltValue,
  arrayKey,
  typeKey,
  type,
  state,
  isImage,
  isDisabled,
  uuidKey,
  listAPIProps,
  getListAPIProps,
  onStateChanged,
  extraStateData,
  getIsDisabledItem,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const bodyRef = useRef(null);
  const isLoadingRef = useRef(null);
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
   * @param item - the return item from data source
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the item name
   */
  const getItemName = useCallback(
    (item) =>
      (item.name && (item.name[i18next.language] || item.name.en || item.name))
      || (item.title
        && (item.title[i18next.language] || item.title.en || item.title))
      || `${
        item.first_name && (item.first_name[i18next.language] || item.first_name.en)
      }${
        item.last_name
        && ` ${item.last_name[i18next.language] || item.last_name?.en || ''}`
      }`
      || '',
    [],
  );

  const getCurrentTypeEnumItem = useMemo(
    () => () =>
      Object.values(OnboardingTypesEnum).find((item) => item.key === type) || {},
    [type],
  );

  /**
   * @param currentItem - the item of object can be space or folder or flow
   * @param isFullData - bool if reading from the full list
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the selected item index
   */
  const getIsSelectedItemIndex = useMemo(
    () =>
      ({ currentItem, isActualSelect }) =>
        state[arrayKey]
          ? state[arrayKey].findIndex(
            (item) =>
              item[uuidKey] === currentItem.uuid
                || (!isActualSelect
                  && type === OnboardingTypesEnum.Folders.key
                  && item[uuidKey] === currentItem.space_uuid)
                || (!isActualSelect
                  && type === OnboardingTypesEnum.Flows.key
                  && (item[uuidKey] === currentItem.space_uuid
                    || item[uuidKey] === currentItem.folder_uuid)),
          )
          : -1,
    [arrayKey, state, type, uuidKey],
  );

  /**
   * @param currentItem - the item of object can be space or folder or flow
   * @param isFullData - bool if reading from the full list
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the selected item index
   */
  const getIsIndeterminateSelected = useMemo(
    () =>
      ({ currentItem }) =>
        state[arrayKey]
        && !state[arrayKey].some((item) => item[uuidKey] === currentItem[uuidKey])
        && ((type === OnboardingTypesEnum.Spaces.key
          && state[arrayKey].some(
            (item) => item.space_uuid === currentItem[uuidKey],
          ))
          || (type === OnboardingTypesEnum.Folders.key
            && state[arrayKey].some(
              (item) => item.folder_uuid === currentItem[uuidKey],
            ))),
    [arrayKey, state, type, uuidKey],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to prevent the user from select from different types at the same time
   */
  const getIsDisabledByLocal = useMemo(
    () => () =>
      state[arrayKey] && state[arrayKey].some((item) => type !== item[typeKey]),
    [arrayKey, state, type, typeKey],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to responsibility data
   */
  const getAllData = useCallback(
    async (isFromUseEffect = false) => {
      if (!isFromUseEffect) return;

      isLoadingRef.current = true;
      setIsLoading(true);
      const response = await listAPI({
        ...filter,
        ...(listAPIProps || {}),
        ...((getListAPIProps && getListAPIProps({ type })) || {}), // this is to return more props for API from parent
      });
      if (response && (response.status === 200 || response.status === 201)) {
        const {
          data: { results },
        } = response;
        let localData = results;
        if (listAPIDataPath) localData = results[listAPIDataPath];

        if (filter.page === 1 || !response.data.paginate)
          setData({
            results: localData || [],
            totalCount: response.data.paginate
              ? response.data.paginate.total || 0
              : localData.length || 0,
          });
        else if (response.data.paginate)
          setData((items) => ({
            results: [...items.results, ...localData],
            totalCount: response.data.paginate.total || 0,
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
    [listAPI, filter, listAPIProps, getListAPIProps, type, listAPIDataPath, t],
  );

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
    )
      setFilter((items) => ({ ...items, page: items.page + 1 }));
  }, [data]);

  useEventListener('scroll', onScrollHandler, bodyRef.current);

  useEffect(() => {
    getAllData(true);
  }, [getAllData, filter]);

  return (
    <div className="directory-tab-wrapper tab-wrapper">
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
        />
        <div className="list-items-wrapper" ref={bodyRef}>
          <div>
            {data.results.map(
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
                      singleChecked={
                        getIsSelectedItemIndex({ currentItem: item }) !== -1
                      }
                      singleIndeterminate={
                        (getCurrentTypeEnumItem().isWithIndeterminate
                          && getIsIndeterminateSelected({
                            currentItem: item,
                          }))
                        || undefined
                      }
                      isDisabled={
                        isDisabled
                        || isLoading
                        || getIsDisabledByLocal()
                        || (getIsDisabledItem
                          && getIsDisabledItem({
                            memberItem: item,
                            memberIndex: index,
                          }))
                        || undefined
                      }
                      onSelectedCheckboxChanged={(event, isChecked) => {
                        if (!onStateChanged) return;
                        let localItems = [...(state[arrayKey] || [])];

                        if (isChecked) {
                          localItems = localItems.filter(
                            (element) =>
                              element.space_uuid !== item.uuid
                              && element.folder_uuid !== item.uuid,
                          );
                          localItems.push({
                            ...item,
                            [typeKey]: type,
                            [uuidKey]: item.uuid,
                            name: item.name || getItemName(item),
                            ...extraStateData,
                          });
                          // check if the current item space or folder is entirely selected
                          //  need API call because the parent not exist with selected
                          //  item, I can not know how many items in the parent
                        } else {
                          const localItemIndex = getIsSelectedItemIndex({
                            currentItem: item,
                            isActualSelect: true,
                          });
                          if (localItemIndex !== -1)
                            localItems.splice(localItemIndex, 1);
                          else {
                            // to select the childs except the current item and remove the parent from selected
                            const firstSelectedParent = localItems.find(
                              (element) =>
                                element[uuidKey] === item.space_uuid
                                || element[uuidKey] === item.folder_uuid,
                            );
                            const firstSelectedParentIndex = localItems.findIndex(
                              (element) =>
                                element[uuidKey] === item.space_uuid
                                || element[uuidKey] === item.folder_uuid,
                            );
                            if (firstSelectedParent) {
                              let itemsToSelect = [];
                              if (
                                firstSelectedParent.folders
                                && firstSelectedParent.folders.length > 0
                              )
                                itemsToSelect.push(
                                  ...firstSelectedParent.folders.map((element) => ({
                                    ...element,
                                    [typeKey]: OnboardingTypesEnum.Folders.key,
                                    [uuidKey]: element.uuid,
                                    name: element.name || getItemName(element),
                                    ...extraStateData,
                                  })),
                                );
                              if (
                                itemsToSelect.flows
                                && itemsToSelect.flows.length > 0
                              )
                                itemsToSelect.push(
                                  ...firstSelectedParent.flows.map((element) => ({
                                    ...element,
                                    [typeKey]: OnboardingTypesEnum.Flows.key,
                                    [uuidKey]: element.uuid,
                                    name: element.name || getItemName(element),
                                    ...extraStateData,
                                  })),
                                );
                              if (firstSelectedParentIndex !== -1)
                                localItems.splice(firstSelectedParentIndex, 1);
                              itemsToSelect = itemsToSelect.filter(
                                (element) =>
                                  element[uuidKey] !== item[uuidKey]
                                  && element[uuidKey] !== item.folder_uuid
                                  && element[uuidKey] !== item.space_uuid,
                              );
                              localItems.push(...itemsToSelect);
                            }
                          }
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
                          <span className="px-2">{getItemName(item)}</span>
                        </>
                      )}
                    </span>
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

DirectoryTab.propTypes = {
  listAPI: PropTypes.func.isRequired,
  listAPIDataPath: PropTypes.string,
  imageAltValue: PropTypes.string,
  type: PropTypes.oneOf(Object.values(OnboardingTypesEnum).map((item) => item.key)),
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
};

export default DirectoryTab;
