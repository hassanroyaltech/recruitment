import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@mui/material';
import i18next from 'i18next';
import Avatar from '@mui/material/Avatar';
import {
  CheckboxesComponent,
  LoadableImageComponant,
  PopoverComponent,
  SwitchComponent,
} from '../../../../../../../../../../../../../components';
import { PipelineStageUsersTypesEnum } from '../../../../../../../../../../../../../enums';
import './ResponsibilityManagement.Style.scss';
import { SharedInputControl } from '../../../../../../../../../../../../setups/shared';
import {
  GlobalSearchDelay,
  showError,
  StringToColor,
} from '../../../../../../../../../../../../../helpers';
import defaultUserImage from '../../../../../../../../../../../../../assets/icons/user-avatar.svg';
import { useEventListener } from '../../../../../../../../../../../../../hooks';

export const ResponsibilityManagementSection = memo(
  ({
    activeStage,
    stageItem,
    onStateChanged,
    getUserAPIByType,
    getUsersByType,
    enableKey,
    arrayKey,
    stageUsersTypes,
    managementTitleDescription,
    managementTitle,
    parentTranslationPath,
    translationPath,
  }) => {
    const { t } = useTranslation(parentTranslationPath);
    const [isLoading, setIsLoading] = useState(false);
    const isLoadingRef = useRef(false);
    const bodyRef = useRef(null);
    const [
      responsibilityTypePopoverAttachedWith,
      setResponsibilityTypePopoverAttachedWith,
    ] = useState(null);

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
    const [activeRelationType, setActiveRelationType] = useState(
      () => PipelineStageUsersTypesEnum.Users,
    );

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
     * @Description this method is to toggle the page popovers
     */
    const popoverToggleHandler = useCallback((event) => {
      setResponsibilityTypePopoverAttachedWith(
        (event && event.currentTarget) || null,
      );
    }, []);

    /**
     * @param itemUUID - the responsibility type item uuid
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description this method is to return the selected item index
     */
    const getIsSelectedItemIndex = useCallback(
      (itemUUID) =>
        stageItem && stageItem[arrayKey]
          ? stageItem[arrayKey].findIndex((item) => item.relation_uuid === itemUUID)
          : -1,
      [arrayKey, stageItem],
    );

    /**
     * @param itemUUID - the responsibility type item uuid
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description this method is to return the item name
     */
    const getItemName = useCallback(
      (item) =>
        (item.name && (item.name[i18next.language] || item.name.en))
        || `${
          item.first_name
          && (item.first_name[i18next.language] || item.first_name.en)
        }${
          item.last_name
          && ` ${item.last_name[i18next.language] || item.last_name.en}`
        }`,
      [],
    );

    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description this method is to responsibility data
     */
    const getAllData = useCallback(
      async (isFromUseEffect = false) => {
        if (!isFromUseEffect) return;
        setIsLoading(true);
        const response = await getUserAPIByType(activeRelationType.key).getDataAPI({
          ...filter,
          with_than: getUsersByType(activeRelationType.key).map(
            (item) => item.relation_uuid,
          ),
        });
        isLoadingRef.current = false;
        setIsLoading(false);
        if (response && (response.status === 200 || response.status === 201))
          if (filter.page === 1)
            setData({
              results: response.data.results || [],
              totalCount: response.data.paginate.total || 0,
            });
          else
            setData((items) => ({
              results: items.results.concat(response.data.results) || [],
              totalCount: response.data.paginate.total || 0,
            }));
        else {
          showError(t('Shared:failed-to-get-saved-data'), response);
          setData({
            results: [],
            totalCount: 0,
          });
        }
      },
      [activeRelationType.key, filter, getUserAPIByType, getUsersByType, t],
    );

    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description this method is to change the active responsibility type
     */
    const changeActiveTypeHandler = useCallback(
      (item, currentSelectedType) => () => {
        if (item.key === currentSelectedType) return;
        setData({
          results: [],
          totalCount: 0,
        });
        setFilter((items) => ({ ...items, page: 1 }));
        setActiveRelationType(item);
        setResponsibilityTypePopoverAttachedWith(null);
      },
      [],
    );

    const onScrollHandler = useCallback(() => {
      if (
        (bodyRef.current.scrollHeight <= bodyRef.current.clientHeight
          || bodyRef.current.scrollTop + bodyRef.current.clientHeight
            >= bodyRef.current.firstChild.clientHeight - 5)
        && data.results.length < data.totalCount
        && !isLoadingRef.current
      )
        setFilter((items) => ({ ...items, page: items.page + 1 }));
    }, [bodyRef, data.results.length, data.totalCount]);

    useEventListener('scroll', onScrollHandler, bodyRef.current);

    useEffect(() => {
      if (
        getUserAPIByType(activeRelationType.key).getDataAPI
        && !isLoadingRef.current
      ) {
        isLoadingRef.current = true;
        getAllData(true);
      }
    }, [activeRelationType.key, filter, getAllData, getUserAPIByType]);

    return (
      <div className="responsibility-management-section">
        <div className="d-flex">
          <div className="d-inline-flex">
            <SwitchComponent
              idRef={`isEnableRef${enableKey}`}
              isChecked={(stageItem && stageItem[enableKey]) || false}
              onChange={(event, isChecked) => {
                onStateChanged({
                  parentId: 'stages',
                  parentIndex: activeStage,
                  id: enableKey,
                  value: isChecked,
                });
                if (
                  stageItem[arrayKey]
                  && stageItem[arrayKey].length > 0
                  && isChecked
                )
                  onStateChanged({
                    parentId: 'stages',
                    parentIndex: activeStage,
                    id: arrayKey,
                    value: [],
                  });
              }}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          </div>
          <div
            className={`d-flex-column mb-3 mt-2 px-2${
              (stageItem && !stageItem[enableKey] && ' description-text') || ''
            }`}
          >
            <span>
              <span>{t(`${translationPath}${managementTitle}`)}</span>
              <span>:</span>
            </span>
            {stageItem && stageItem[enableKey] && (
              <div className="description-text">
                <span>{t(`${translationPath}${managementTitleDescription}`)}</span>
              </div>
            )}
          </div>
        </div>
        {stageItem && !stageItem[enableKey] && (
          <div className="selection-group-wrapper mb-3">
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
              endAdornment={
                <ButtonBase
                  className={`btns theme-transparent${
                    (responsibilityTypePopoverAttachedWith && ' is-active') || ''
                  }`}
                  disabled={isLoading}
                  onClick={popoverToggleHandler}
                >
                  <span>{t(`${translationPath}${activeRelationType.value}`)}</span>
                  <span
                    className={`px-2 fas fa-caret-${
                      (responsibilityTypePopoverAttachedWith && 'up') || 'down'
                    }`}
                  />
                </ButtonBase>
              }
            />
            <div className="selection-group-items-wrapper" ref={bodyRef}>
              <div>
                {data.results.map((item, index) => (
                  <div
                    className="selection-group-item"
                    key={`selectionGroupItemKey${enableKey}${index + 1}`}
                  >
                    <CheckboxesComponent
                      idRef={`selectionGroupItemRef${enableKey}${index + 1}`}
                      singleChecked={getIsSelectedItemIndex(item.uuid) !== -1}
                      onSelectedCheckboxChanged={(event, isChecked) => {
                        if (!onStateChanged || !activeRelationType) return;
                        const localItems = JSON.parse(
                          JSON.stringify((stageItem && stageItem[arrayKey]) || []),
                        );
                        if (isChecked)
                          localItems.push({
                            relation_type: activeRelationType.key,
                            relation_uuid: item.uuid,
                            name: getItemName(item),
                            url: item.url || null,
                          });
                        else {
                          const itemIndex = getIsSelectedItemIndex(item.uuid);
                          if (itemIndex !== -1) localItems.splice(itemIndex, 1);
                        }
                        onStateChanged({
                          parentId: 'stages',
                          parentIndex: activeStage,
                          id: arrayKey,
                          value: localItems,
                        });
                      }}
                    />
                    <span className="d-inline-flex">
                      {(activeRelationType && activeRelationType.isImage && (
                        <span className="d-inline-flex-v-center">
                          {((item.url || !item.name) && (
                            <LoadableImageComponant
                              classes="user-image-wrapper"
                              alt={
                                getItemName(item)
                                || t(`${translationPath}user-image`)
                              }
                              src={item.url || defaultUserImage}
                            />
                          )) || (
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
                          )}
                          <span className="px-2">{getItemName(item)}</span>
                        </span>
                      )) || (
                        <span>
                          <span className="far fa-tag" />
                          <div className="d-inline-flex-column px-2">
                            <span>
                              {t(`${translationPath}${getItemName(item)}`)}
                            </span>
                            {item.description && (
                              <span className="description-text">
                                {item.description}
                              </span>
                            )}
                          </div>
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {responsibilityTypePopoverAttachedWith && (
          <PopoverComponent
            idRef={`responsibilityTypesPopover${arrayKey}`}
            attachedWith={responsibilityTypePopoverAttachedWith}
            handleClose={() => popoverToggleHandler()}
            popoverClasses="responsibility-types-popover-wrapper"
            component={
              <div>
                {stageUsersTypes.map((item) => (
                  <ButtonBase
                    className={`btns theme-transparent br-0 w-100 mx-0${
                      (activeRelationType
                        && item.key === activeRelationType.key
                        && ' is-active')
                      || ''
                    }`}
                    key={`pipelineStageUsers${item.key}`}
                    disabled={isLoading}
                    onClick={changeActiveTypeHandler(
                      item,
                      (activeRelationType && activeRelationType.key) || null,
                    )}
                  >
                    <span>{item.value}</span>
                  </ButtonBase>
                ))}
              </div>
            }
          />
        )}
        {stageItem && stageItem[enableKey] && (
          <ButtonBase
            className="btns theme-solid bg-accent-secondary br-0 mih-50px w-100 mx-0"
            onClick={() =>
              onStateChanged({
                parentId: 'stages',
                parentIndex: activeStage,
                id: enableKey,
                value: false,
              })
            }
          >
            <span className="fas fa-plus" />
            <span className="px-2">
              {t(`${translationPath}or-only-selected-users`)}
            </span>
          </ButtonBase>
        )}
      </div>
    );
  },
);
ResponsibilityManagementSection.displayName = 'ResponsibilityManagementSection';

ResponsibilityManagementSection.propTypes = {
  activeStage: PropTypes.number.isRequired,
  stageItem: PropTypes.instanceOf(Object).isRequired,
  enableKey: PropTypes.string.isRequired,
  arrayKey: PropTypes.string.isRequired,
  stageUsersTypes: PropTypes.instanceOf(Array).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  getUsersByType: PropTypes.func.isRequired,
  getUserAPIByType: PropTypes.func.isRequired,
  managementTitle: PropTypes.string.isRequired,
  managementTitleDescription: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
