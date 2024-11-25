import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { PermissionsComponent } from 'components/Permissions/Permissions.Component';
import './Tabs.Style.scss';
import { getDataFromObject, getIsAllowedPermissionV2 } from '../../helpers';
import { TooltipsComponent } from '../Tooltips/Tooltips.Component';

export const TabsComponent = memo(
  ({
    iconInput,
    iconComponentInput,
    tooltipTitleComponent,
    tooltipTitleInput,
    tooltipPlacement,
    data,
    currentTab,
    onTabChanged,
    wrapperClasses,
    tabsAriaLabel,
    labelInput,
    translationPath,
    parentTranslationPath,
    variant,
    orientation,
    iconOnly,
    themeClasses,
    scrollButtons,
    visibleScrollbar,
    hiddenTabIndexes,
    maxIndex,
    minIndex,
    dynamicComponentProps,
    componentInput,
    withDynamicComponents,
    totalCountInput,
    isDisabled,
    isWithLine,
    isPrimary,
    idRef,
    dynamicIdRef,
    tabsContentRefInput,
    permissionsReducerInput,
    permissions,
    tabsContentClasses,
    tabsHeaderClasses,
    isHiddenByPermissions,
    tabIndicatorProps,
    getBeforeTabsComponent,
    getAfterTabsComponent,
    customLabel,
    tabItemClasses,
  }) => {
    const { t } = useTranslation(parentTranslationPath);
    const tabsContentRef = useRef(null);
    const tabsHeaderRef = useRef(null);
    const [activeTooltip, setActiveTooltip] = useState(null);
    // const loginResponse = useSelector((state) => state.login.loginResponse);
    // eslint-disable-next-line max-len
    const permissionsReducer = useSelector((state) =>
      getDataFromObject(state, permissionsReducerInput, true),
    );

    const getTheFirstActiveTab = useCallback(() => {
      const firstActiveTabIndex = data.findIndex((item) =>
        getIsAllowedPermissionV2({
          defaultPermissions: item.defaultPermissions,
          permissions: permissions || permissionsReducer,
          permissionId: item.permissionId,
          allowEmptyRules: true,
        }),
      );

      if (
        firstActiveTabIndex > currentTab
        || (firstActiveTabIndex === -1 && currentTab !== -1)
      ) {
        if (onTabChanged) onTabChanged({}, firstActiveTabIndex);
      } else if (firstActiveTabIndex !== -1 && currentTab !== -1) {
        const checkCurrentTabAllow = getIsAllowedPermissionV2({
          defaultPermissions: data[currentTab].defaultPermissions,
          permissions: permissions || permissionsReducer,
          permissionId: data[currentTab].permissionId,
          allowEmptyRules: true,
        });
        if (!checkCurrentTabAllow && onTabChanged)
          onTabChanged({}, firstActiveTabIndex);
      }
    }, [currentTab, data, onTabChanged, permissions, permissionsReducer]);

    const CloneProps = useMemo(
      () =>
        ({ children, ...other }) =>
          children(other),
      [],
    );

    // this is to make sure that the active index is not disabled by permissions
    useEffect(() => {
      if (!isHiddenByPermissions && data) getTheFirstActiveTab();
    }, [isHiddenByPermissions, data, getTheFirstActiveTab]);

    return (
      <>
        <div
          className={`tabs-header-wrapper${
            (tabsHeaderClasses && `${tabsHeaderClasses}`) || ''
          }${(orientation === 'vertical' && ' is-vertical') || ''}`}
          ref={tabsHeaderRef}
        >
          {getBeforeTabsComponent && getBeforeTabsComponent()}
          <Tabs
            value={currentTab !== -1 ? currentTab : false}
            onChange={onTabChanged}
            variant={variant}
            orientation={orientation}
            scrollButtons={scrollButtons}
            visibleScrollbar={visibleScrollbar}
            indicatorColor="primary"
            disabled={isDisabled}
            TabIndicatorProps={tabIndicatorProps}
            textColor="primary"
            className={`tabs-wrapper ${wrapperClasses} ${themeClasses}${
              isWithLine ? ' is-with-line' : ''
            }${iconOnly ? ' icon-only' : ''}${isPrimary ? ' is-primary' : ''}`}
            aria-label={tabsAriaLabel}
          >
            {data
              && data
                .filter(
                  (item, index) =>
                    hiddenTabIndexes.findIndex((element) => element === index)
                      === -1
                    && (!isHiddenByPermissions
                      || getIsAllowedPermissionV2({
                        defaultPermissions: item.defaultPermissions,
                        permissions: permissions || permissionsReducer,
                        permissionId: item.permissionId,
                        allowEmptyRules: true,
                      })),
                )
                .map((item, index) => (
                  <CloneProps key={`${idRef}${index + 1}`}>
                    {(tabProps) => (
                      <TooltipsComponent
                        key={`${idRef}${index + 1}`}
                        tooltipTitleComponent={
                          (tooltipTitleComponent
                            && tooltipTitleComponent({ item, index }))
                          || undefined
                        }
                        title={
                          (tooltipTitleInput && item[tooltipTitleInput]) || undefined
                        }
                        placement={tooltipPlacement}
                        translationPath={translationPath}
                        parentTranslationPath={parentTranslationPath}
                        isOpen={activeTooltip === item.key}
                        contentComponent={
                          <Tab
                            {...tabProps}
                            onMouseOver={
                              (tooltipTitleComponent || tooltipTitleInput)
                              && (() => {
                                setActiveTooltip(item.key);
                              })
                            }
                            onTouchStart={
                              (tooltipTitleComponent || tooltipTitleInput)
                              && (() => {
                                setActiveTooltip(item.key);
                              })
                            }
                            onMouseOut={
                              (tooltipTitleComponent || tooltipTitleInput)
                              && (() => {
                                setActiveTooltip(null);
                              })
                            }
                            onTouchEnd={
                              (tooltipTitleComponent || tooltipTitleInput)
                              && (() => {
                                setActiveTooltip(null);
                              })
                            }
                            disabled={
                              isDisabled
                              || item.disabled
                              || (!isHiddenByPermissions
                                && !getIsAllowedPermissionV2({
                                  defaultPermissions: item.defaultPermissions,
                                  permissions: permissions || permissionsReducer,
                                  permissionId: item.permissionId,
                                  allowEmptyRules: true,
                                }))
                              || index > (maxIndex || data.length - 1)
                              || index < (minIndex || 0)
                            }
                            label={
                              labelInput
                              && !iconOnly && (
                                <span className={tabItemClasses}>
                                  {item.inlineIcon && (
                                    <span className="mx-2">{item.inlineIcon}</span>
                                  )}
                                  {t(
                                    `${translationPath}${
                                      item?.isWithCustomLabel
                                        ? customLabel
                                        : item[labelInput]
                                    }`,
                                  )}
                                  {totalCountInput && (
                                    <span className="px-1">
                                      ({item[totalCountInput]})
                                    </span>
                                  )}
                                </span>
                              )
                            }
                            icon={
                              item.isSVGIcon
                                ? item.svgIcon
                                : (iconComponentInput && item[iconComponentInput])
                                  || (iconInput && (
                                    <span className={item[iconInput]} />
                                  ))
                                  || undefined
                            }
                            onClick={item.onClick}
                            onContextMenu={item.onContextMenu}
                          />
                        }
                      />
                    )}
                  </CloneProps>
                ))}
          </Tabs>
          {getAfterTabsComponent && getAfterTabsComponent()}
        </div>
        {(dynamicComponentProps || withDynamicComponents) && data && (
          <div
            className={`tabs-content-wrapper${
              (orientation === 'vertical' && ' is-vertical-tabs') || ''
            }${(tabsContentClasses && ` ${tabsContentClasses}`) || ''}`}
            ref={tabsContentRef}
            style={
              (orientation === 'vertical' && {
                maxWidth: `calc(100% - ${
                  (tabsHeaderRef.current && tabsHeaderRef.current.clientWidth)
                  || undefined
                }px)`,
              })
              || undefined
            }
          >
            {data
              .filter(
                (item, index) =>
                  hiddenTabIndexes.findIndex((element) => element === index)
                    === -1
                  && (!isHiddenByPermissions
                    || getIsAllowedPermissionV2({
                      defaultPermissions: item.defaultPermissions,
                      permissions: item.permissions || permissionsReducer,
                      permissionId: item.permissionId,
                      allowEmptyRules: true,
                    })),
              )
              .map((item, index) => {
                const Component = item[componentInput];
                return (
                  currentTab === index
                  && ((Component && (
                    <PermissionsComponent
                      defaultPermissions={item.defaultPermissions}
                      permissionId={item.permissionId}
                      key={`${idRef}${dynamicIdRef}${index + 1}`}
                      allowEmptyRules
                    >
                      <Component
                        {...((tabsContentRefInput && {
                          [tabsContentRefInput]: tabsContentRef,
                        })
                          || {})}
                        {...(dynamicComponentProps || {})}
                        {...(item.props || {})}
                      />
                    </PermissionsComponent>
                  ))
                    || null)
                );
              })}
          </div>
        )}
      </>
    );
  },
);

TabsComponent.displayName = 'TabsComponent';

TabsComponent.propTypes = {
  data: PropTypes.instanceOf(Array).isRequired,
  onTabChanged: PropTypes.func.isRequired,
  hiddenTabIndexes: PropTypes.arrayOf(PropTypes.number),
  currentTab: PropTypes.number,
  iconInput: PropTypes.string,
  iconComponentInput: PropTypes.string,
  labelInput: PropTypes.string,
  tooltipTitleInput: PropTypes.string,
  tooltipTitleComponent: PropTypes.func,
  tooltipPlacement: PropTypes.string,
  wrapperClasses: PropTypes.string,
  tabsHeaderClasses: PropTypes.string,
  tabsAriaLabel: PropTypes.string,
  translationPath: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  variant: PropTypes.string,
  isHiddenByPermissions: PropTypes.bool,
  visibleScrollbar: PropTypes.bool,
  permissionsReducerInput: PropTypes.string,
  permissions: PropTypes.arrayOf(PropTypes.string),
  tabsContentRefInput: PropTypes.string,
  tabsContentClasses: PropTypes.string,
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  totalCountInput: PropTypes.string,
  themeClasses: PropTypes.oneOf([
    'theme-solid',
    'theme-default',
    'theme-curved',
    'theme-icon',
  ]),
  scrollButtons: PropTypes.oneOf(['auto', false, true]),
  iconOnly: PropTypes.bool,
  isWithLine: PropTypes.bool,
  maxIndex: PropTypes.number,
  minIndex: PropTypes.number,
  dynamicComponentProps: PropTypes.instanceOf(Object),
  tabIndicatorProps: PropTypes.oneOfType([PropTypes.elementType, PropTypes.node]),
  getBeforeTabsComponent: PropTypes.func,
  getAfterTabsComponent: PropTypes.func,
  componentInput: PropTypes.string,
  idRef: PropTypes.string,
  dynamicIdRef: PropTypes.string,
  withDynamicComponents: PropTypes.bool,
  isPrimary: PropTypes.bool,
  isDisabled: PropTypes.bool,
  customLabel: PropTypes.string,
  tabItemClasses: PropTypes.string,
};
TabsComponent.defaultProps = {
  hiddenTabIndexes: [],
  currentTab: 0,
  iconInput: undefined,
  iconComponentInput: undefined,
  labelInput: undefined,
  tooltipTitleInput: undefined,
  tooltipTitleComponent: undefined,
  scrollButtons: undefined,
  totalCountInput: undefined,
  isHiddenByPermissions: false,
  wrapperClasses: '',
  tabsHeaderClasses: undefined,
  translationPath: '',
  parentTranslationPath: '',
  tabsAriaLabel: 'tabs',
  variant: 'scrollable',
  themeClasses: 'theme-default',
  orientation: undefined, // 'vertical',undefined (for horizontal)
  iconOnly: false,
  isWithLine: false,
  maxIndex: undefined,
  minIndex: undefined,
  tabsContentRefInput: undefined,
  tabsContentClasses: undefined,
  dynamicComponentProps: undefined,
  tabIndicatorProps: undefined,
  getBeforeTabsComponent: undefined,
  getAfterTabsComponent: undefined,
  componentInput: 'component',
  withDynamicComponents: undefined,
  permissionsReducerInput: 'permissionsReducer.permissions',
  permissions: undefined,
  idRef: 'tabRef',
  dynamicIdRef: 'dynamicComponentRef',
  isDisabled: false,
  isPrimary: false,
  customLabel: undefined,
  tabItemClasses: '',
};
