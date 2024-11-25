import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { SharedInputControl } from '../../../../../../../../../../../../../../setups/shared';
import {
  CheckboxesComponent,
  LoadableImageComponant,
} from '../../../../../../../../../../../../../../../components';
import defaultUserImage from '../../../../../../../../../../../../../../../assets/icons/user-avatar.svg';
import Avatar from '@mui/material/Avatar';
import {
  GlobalSearchDelay,
  showError,
  StringToColor,
} from '../../../../../../../../../../../../../../../helpers';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { PipelineStageCandidateActionsEnum } from '../../../../../../../../../../../../../../../enums';

export const ListTab = ({
  getAllDataAPI,
  extraAPIProps,
  isImage,
  savingKey,
  savedItems,
  onStateChanged,
  fullDataKey,
  type,
  getActionIndexByType,
  getActionItemByType,
  activeStage,
  arrayKey,
  imageAltValue,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    results: [],
    totalCount: 0,
  });
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    search: '',
  });
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
      || `${
        item.first_name && (item.first_name[i18next.language] || item.first_name.en)
      }${
        item.last_name
        && ` ${item.last_name[i18next.language] || item.last_name?.en || ''}`
      }`
      || '',
    [],
  );

  /**
   * @param itemUUID - the item uuid
   * @param isFullData - bool if reading from the full list
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the selected item index
   */
  const getIsSelectedItemIndex = useMemo(
    () =>
      (itemUUID, isFullData = false) =>
        getActionItemByType(type)
          ? (
            getActionItemByType(type)[(isFullData && fullDataKey) || savingKey]
              || []
          ).findIndex(
            (item) =>
              (isFullData && item.uuid === itemUUID)
                || (!isFullData && item === itemUUID),
          )
          : -1,
    [fullDataKey, getActionItemByType, savingKey, type],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to responsibility data
   */
  const getAllData = useCallback(
    async (isFromUseEffect = false) => {
      if (!isFromUseEffect) return;
      setIsLoading(true);
      const response = await getAllDataAPI({
        ...filter,
        ...(extraAPIProps || {}),
      });
      setIsLoading(false);
      if (response && (response.status === 200 || response.status === 201)) {
        if (filter.page === 1 || !response.data.paginate)
          setData({
            results: response.data.results || [],
            totalCount: response.data.paginate
              ? response.data.paginate.total || 0
              : response.data.results.length || 0,
          });
        else if (response.data.paginate)
          setData((items) => ({
            results: items.concat(response.data.results) || [],
            totalCount: response.data.paginate.total || 0,
          }));
      } else {
        showError(t('Shared:failed-to-get-saved-data'), response);
        setData({
          results: [],
          totalCount: 0,
        });
      }
    },
    [extraAPIProps, getAllDataAPI, filter, t],
  );

  useEffect(() => {
    getAllData(true);
  }, [getAllData, filter]);

  useEffect(() => {
    setData({
      results: [],
      totalCount: 0,
    });
    setFilter(
      (items) =>
        (items.page > 1 && {
          ...items,
          page: 1,
        })
        || items,
    );
  }, [savingKey]);

  return (
    <div className="list-tab-wrapper">
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
        <div className="list-items-wrapper">
          {data.results.map(
            (item, index) =>
              (!filter.search
                || !getItemName(item)
                || getItemName(item)
                  .toLowerCase()
                  .includes(filter.search.toLowerCase())) && (
                <div
                  className="list-item"
                  key={`selectionGroupItemKey${savingKey}${index + 1}`}
                >
                  <CheckboxesComponent
                    idRef={`selectionGroupItemRef${savingKey}${index + 1}`}
                    singleChecked={getIsSelectedItemIndex(item.uuid) !== -1}
                    onSelectedCheckboxChanged={(event, isChecked) => {
                      if (!onStateChanged) return;
                      const localItems = [...(savedItems || [])];
                      const localItemIndex = localItems.findIndex(
                        (element) => element.type === type,
                      );
                      if (localItemIndex === -1) return;
                      const localItem = localItems[localItemIndex];
                      if (isChecked) {
                        const localFullJSON = {
                          uuid: item.uuid,
                          name: getItemName(item),
                          url: item.url || null,
                        };
                        if (localItem[savingKey])
                          localItem[savingKey].push(item.uuid);
                        else localItem[savingKey] = [item.uuid];
                        if (localItem[fullDataKey])
                          localItem[fullDataKey].push(localFullJSON);
                        else localItem[fullDataKey] = [localFullJSON];
                      } else {
                        const savedIndex = getIsSelectedItemIndex(item.uuid);
                        const fullDataIndex = getIsSelectedItemIndex(
                          item.uuid,
                          true,
                        );
                        if (savedIndex !== -1)
                          localItem[savingKey].splice(savedIndex, 1);
                        if (fullDataIndex !== -1)
                          localItem[fullDataKey].splice(fullDataIndex, 1);
                      }
                      localItems[localItemIndex] = localItem;
                      onStateChanged({
                        parentId: 'stages',
                        parentIndex: activeStage,
                        subParentIndex: getActionIndexByType(type),
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
                          style={{
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
      </div>
    </div>
  );
};

ListTab.propTypes = {
  type: PropTypes.oneOf(
    Object.values(PipelineStageCandidateActionsEnum).map((item) => item.key),
  ),
  getAllDataAPI: PropTypes.func.isRequired,
  extraAPIProps: PropTypes.instanceOf(Object),
  isForceToReload: PropTypes.bool.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  savingKey: PropTypes.string.isRequired,
  savedItems: PropTypes.instanceOf(Array).isRequired,
  fullDataKey: PropTypes.string.isRequired,
  getActionIndexByType: PropTypes.func.isRequired,
  getActionItemByType: PropTypes.func.isRequired,
  activeStage: PropTypes.number.isRequired,
  arrayKey: PropTypes.string.isRequired,
  isImage: PropTypes.bool,
  imageAltValue: PropTypes.string,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
ListTab.defaultProps = {
  imageAltValue: undefined,
  isImage: false,
};
