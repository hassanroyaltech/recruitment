import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery, useTitle } from '../../../hooks';
import { useTranslation } from 'react-i18next';
import {
  DeleteFormsTemplate,
  DeleteOnboardingFolders,
  DeleteOnboardingSpaces,
  GetOnboardingFolderById,
  GetOnboardingSpaceById,
} from '../../../services';
import {
  GlobalConnectionsFilterState,
  GlobalHistory,
  SetGlobalOnboardingMenuFilter,
  showError,
} from '../../../helpers';
import { ConnectionsManagementDialog } from '../dialogs';
import {
  DefaultFormsTypesEnum,
  NavigationSourcesEnum,
  OnboardingTypesEnum,
  SystemActionsEnum,
} from '../../../enums';
import { ConnectionsHeaderSection } from './sections';
import { LoaderComponent, TabsComponent } from '../../../components';
import { ConnectionsTabs } from '../tabs-data';
import { ConfirmDeleteDialog } from '../../setups/shared';
import './Connections.Style.scss';
import InviteManagementDialog from '../dialogs/invite-management/InviteManagement.Dialog';
import { TasksFilterSection } from '../tasks/sections';

const parentTranslationPath = 'OnboardingPage';
const translationPath = '';
const ConnectionsPage = () => {
  const { t } = useTranslation(parentTranslationPath);
  useTitle(t(`${translationPath}connections`));
  const query = useQuery();
  const bodyRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionsTabsData] = useState(() => ConnectionsTabs);

  const [activeTab, setActiveTab] = useState(0);
  const activeConnectionsRef = useRef({
    space: null,
    folder: null,
  });
  const [activeConnections, setActiveConnections] = useState(
    activeConnectionsRef.current,
  );
  const [popoverAttachedWith, setPopoverAttachedWith] = useState({
    more: null,
  });
  const [activeItem, setActiveItem] = useState(null);
  const [isOpenDialogs, setIsOpenDialogs] = useState({
    spaces: false,
    folders: false,
    spaceDelete: false,
    folderDelete: false,
    inviteInner: false, // use when invite from the button inside the space (can be folder or space)
    inviteOuter: false, // use when invite from the button outside the space (can be space or folder (if space not specified))
  });
  const [filter, setFilter] = useState({
    isForceReload: false,
  });
  const [expandedAccordions, setExpandedAccordions] = useState([0]);
  const [tasksFilter, setTasksFilter] = useState({
    limit: 10,
    page: 1,
    status: '',
    use_for: 'list',
    group_by: '',
    sort_by: '',
    search: '',
    member: '',
    task: '',
  });

  /**
   * @param key
   * @param newValue - bool
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the change of is open dialog from child
   */
  const onIsOpenDialogsChanged = useCallback(
    (key, newValue) => () => {
      if (newValue === false || !newValue)
        setActiveItem((item) => (item ? null : item));
      setIsOpenDialogs((items) => ({ ...items, [key]: newValue }));
    },
    [],
  );

  /**
   * @param newValue - this is an object of the new value for the keys
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to update filter from child
   */
  const onFilterChanged = useCallback((newValue) => {
    setFilter((items) => ({ ...items, ...newValue }));
  }, []);

  /**
   * @param newValue - this is an object of the new value for the keys
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to update tasks filter from child
   */
  const onTasksFilterChanged = useCallback((newValue) => {
    setTasksFilter((items) => ({ ...items, ...newValue }));
  }, []);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to load more data on scroll the container of the list to the end or not scrollable yet
   * (do not copy this method from this page it is handle a special cases)
   */
  const onScrollHandler = useCallback(
    (localData) => () => {
      if (
        bodyRef.current.offsetHeight + bodyRef.current.scrollTop
          >= bodyRef.current.scrollHeight - 5
        && localData.results.length < localData.totalCount
      )
        if (activeTab === 2)
          setTasksFilter((items) => ({ ...items, page: items.page + 1 }));
        else setFilter((items) => ({ ...items, page: items.page + 1 }));
    },
    [activeTab],
  );

  /**
   * @param newValue - this is array of indexes
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to update expanded accordions from child
   */
  const onExpandedAccordionsChanged = useCallback((newValue) => {
    setExpandedAccordions(newValue);
  }, []);

  const onChangeAccordion = useCallback(
    (index) => {
      if (expandedAccordions.includes(index)) {
        setExpandedAccordions((items) => items.filter((item) => item !== index));
        return;
      }
      setExpandedAccordions((items) => [...items, index]);
    },
    [expandedAccordions],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the tasks filters in the header of each tab
   */
  const FilterComponent = useMemo(
    // eslint-disable-next-line react/display-name
    () => () => (
      <TasksFilterSection
        filter={tasksFilter}
        onFilterChanged={onTasksFilterChanged}
        onExpandedAccordionsChanged={onExpandedAccordionsChanged}
      />
    ),
    [tasksFilter, onExpandedAccordionsChanged, onTasksFilterChanged],
  );

  /**
   * @param key
   * @param newValue - eventTarget
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the change of attached popovers from child
   */
  const onPopoverAttachedWithChanged = useCallback((key, newValue) => {
    setPopoverAttachedWith((items) => ({ ...items, [key]: newValue }));
  }, []);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle adding or editing the connections (OnboardingTypesEnum)
   */
  const onConnectionsClicked
    = ({
      key,
      selectedItem,
      actionKey,
      inviteLocation,
      flowCreateLocation,
      isNavigate,
      isSurvey,
    }) =>
      () => {
        if (selectedItem) setActiveItem(selectedItem);

        if (inviteLocation === 'inner') onIsOpenDialogsChanged('inviteInner', true)();
        else if (inviteLocation === 'outer')
          onIsOpenDialogsChanged('inviteOuter', true)();

        if (key === OnboardingTypesEnum.Spaces.key)
          if (actionKey === SystemActionsEnum.delete.key)
            onIsOpenDialogsChanged('spaceDelete', true)();
          else onIsOpenDialogsChanged('spaces', true)();

        if (key === OnboardingTypesEnum.Folders.key)
          if (actionKey === SystemActionsEnum.delete.key)
            onIsOpenDialogsChanged('folderDelete', true)();
          else if (isNavigate)
            setActiveConnections((items) => ({ ...items, folder: selectedItem }));
          else onIsOpenDialogsChanged('folders', true)();

        if (key === OnboardingTypesEnum.Flows.key)
          if (actionKey === SystemActionsEnum.delete.key)
            onIsOpenDialogsChanged('flowDelete', true)();
          else
            GlobalHistory.push(
              `/forms?code=${DefaultFormsTypesEnum.Flows.key}&source=${
                NavigationSourcesEnum.OnboardingMenuToFormBuilder.key
              }${
                (selectedItem
                && selectedItem.uuid
                && `&template_uuid=${selectedItem.uuid}`)
              || ''
              }${
                (activeConnections.space
                && `&space_uuid=${activeConnections.space.uuid}`)
              || ''
              }${
                ((flowCreateLocation !== 'outer' || !activeConnections.space)
                && activeConnections.folder
                && `&folder_uuid=${activeConnections.folder.uuid}`)
              || ''
              }${(isSurvey && `&is_survey=${true}`) || ''}`,
            );
      };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the current selected space and/or folder details
   */
  const getActiveConnections = useCallback(
    async ({ querySpace, queryFolder }) => {
      const promises = [];
      const spacesAndFolders = {};
      if (querySpace) promises.push(GetOnboardingSpaceById({ uuid: querySpace }));
      if (queryFolder) promises.push(GetOnboardingFolderById({ uuid: queryFolder }));
      setIsLoading(true);
      const response = await Promise.all(promises);
      setIsLoading(false);
      if (response && response.some((item) => item.status === 200)) {
        const successResults = response.filter((item) => item.status === 200);
        successResults.map((item) => {
          if (item.data.results.uuid === querySpace)
            spacesAndFolders.space = item.data.results;
          else spacesAndFolders.folder = item.data.results;
          return undefined;
        });
        setActiveConnections((items) => ({
          ...items,
          ...spacesAndFolders,
        }));
        if (successResults.length !== promises.length)
          response
            .filter((item) => item.status !== 200)
            .map((item) => showError(t('Shared:failed-to-get-saved-data'), item));
      } else showError(t('Shared:failed-to-get-saved-data'));
    },
    [t],
  );

  useEffect(() => {
    const querySpace = query.get('space_uuid');
    const queryFolder = query.get('folder_uuid');
    setActiveConnections({
      space: null,
      folder: null,
    });
    getActiveConnections({
      querySpace,
      queryFolder,
    });
  }, [getActiveConnections, query]);

  useEffect(() => {
    if (!activeConnectionsRef.current.folder && !activeConnectionsRef.current.space)
      return;
    const localParams = {
      querySpace: null,
      queryFolder: null,
    };
    if (activeConnectionsRef.current.folder)
      localParams.queryFolder = activeConnectionsRef.current.folder.uuid;
    else localParams.querySpace = activeConnectionsRef.current.space.uuid;
    getActiveConnections(localParams);
  }, [filter, getActiveConnections]);

  useEffect(() => {
    activeConnectionsRef.current = activeConnections;
  }, [activeConnections]);

  useEffect(() => {
    GlobalConnectionsFilterState(setFilter);
  }, []);

  useEffect(() => {
    setTasksFilter((items) => ({
      ...items,
      page: 1,
      space_uuid: (activeConnections.space && activeConnections.space.uuid) || null,
      folder_uuid:
        ((!activeConnections.space || !activeConnections.space.uuid)
          && activeConnections.folder
          && activeConnections.folder.uuid)
        || null,
    }));
  }, [activeConnections]);
  const onChangeTabs = useCallback((currentTab) => {
    if (currentTab === 2)
      setTasksFilter((items) => ({
        ...items,
        page: 1,
      }));
    setActiveTab(currentTab);
  }, []);
  return (
    <div className="connections-page-wrapper page-wrapper">
      {((activeConnections.space || activeConnections.folder) && (
        <>
          <ConnectionsHeaderSection
            activeConnections={activeConnections}
            onConnectionsClicked={onConnectionsClicked}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
          <TabsComponent
            isPrimary
            isWithLine
            labelInput="label"
            idRef="connectionsPageTabsRef"
            currentTab={activeTab}
            data={connectionsTabsData}
            onTabChanged={(event, currentTab) => {
              onChangeTabs(currentTab);
            }}
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            dynamicComponentProps={{
              activeConnections,
              onConnectionsClicked,
              isFromTabs: true,
              space_uuid:
                (activeConnections.space && activeConnections.space.uuid) || null,
              folder_uuid:
                ((!activeConnections.space || !activeConnections.space.uuid)
                  && activeConnections.folder
                  && activeConnections.folder.uuid)
                || null,
              isLoading,
              onFilterChanged:
                (activeTab === 2 && onTasksFilterChanged) || onFilterChanged,
              onPopoverAttachedWithChanged,
              popoverAttachedWith,
              parentTranslationPath,
              translationPath,
              onIsOpenDialogsChanged,
              onScrollHandler,
              bodyRef,
              onChangeAccordion,
              filter: tasksFilter,
              expandedAccordions,
              FilterComponent,
            }}
          />
        </>
      )) || (
        <LoaderComponent
          isLoading={isLoading}
          isSkeleton
          skeletonItems={[
            {
              variant: 'rectangular',
              style: { minHeight: 10, marginTop: 5, marginBottom: 5 },
            },
          ]}
          numberOfRepeat={4}
        />
      )}

      {(isOpenDialogs.spaces || isOpenDialogs.folders) && (
        <ConnectionsManagementDialog
          activeItem={activeItem}
          isOpen={isOpenDialogs.spaces || isOpenDialogs.folders}
          space_uuid={activeConnections.space.uuid || undefined}
          isFolders={isOpenDialogs.folders}
          onSave={() => {
            SetGlobalOnboardingMenuFilter((items) => ({
              ...items,
              isForceReload: !items.isForceReload,
            }));
            setFilter((items) => ({
              ...items,
              isForceReload: !items.isForceReload,
            }));
          }}
          isOpenChanged={
            (isOpenDialogs.spaces && onIsOpenDialogsChanged('spaces', false))
            || onIsOpenDialogsChanged('folders', false)
            || undefined
          }
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
      {(isOpenDialogs.inviteInner || isOpenDialogs.inviteOuter) && (
        <InviteManagementDialog
          isOpen={isOpenDialogs.inviteInner || isOpenDialogs.inviteOuter}
          space_uuid={
            (!activeConnections.folder || isOpenDialogs.inviteOuter)
            && activeConnections.space
              ? activeConnections.space.uuid
              : undefined
          }
          folder_uuid={
            (isOpenDialogs.inviteOuter
              && !activeConnections.space
              && activeConnections.folder
              && activeConnections.folder.uuid)
            || (isOpenDialogs.inviteInner
              && activeConnections.folder
              && activeConnections.folder.uuid)
            || undefined
          }
          onSave={() => {
            // SetGlobalOnboardingMenuFilter((items) => ({
            //   ...items,
            //   isForceReload: !items.isForceReload,
            // }));
            setFilter((items) => ({
              ...items,
              isForceReload: !items.isForceReload,
            }));
          }}
          isOpenChanged={
            (isOpenDialogs.inviteInner
              && onIsOpenDialogsChanged('inviteInner', false))
            || onIsOpenDialogsChanged('inviteOuter', false)
            || undefined
          }
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
      {(isOpenDialogs.spaceDelete
        || isOpenDialogs.folderDelete
        || isOpenDialogs.flowDelete) && (
        <ConfirmDeleteDialog
          activeItem={activeItem}
          successMessage={`${
            (isOpenDialogs.spaceDelete && 'space')
            || (isOpenDialogs.folderDelete && 'folder')
            || (isOpenDialogs.flowDelete && 'flow')
          }-deleted-successfully`}
          onSave={() => {
            SetGlobalOnboardingMenuFilter((items) => ({
              ...items,
              isForceReload: !items.isForceReload,
            }));
            // this logic to redirect the user to another connection if he deleted the one that currently active
            // or just redirect him to activity page if there is no spaces or folders in the connection list
            if (isOpenDialogs.spaceDelete || isOpenDialogs.folderDelete)
              if (isOpenDialogs.spaceDelete)
                GlobalHistory.push('/onboarding/activity');
              else if (isOpenDialogs.folderDelete)
                if (activeConnections.space && activeConnections.space.uuid) {
                  // this one is for delete of the folder but there is space to select
                  setActiveConnections((items) => ({ ...items, folder: null }));
                  activeConnectionsRef.current.folder = null;
                  onConnectionsClicked({
                    space_uuid: activeConnections.space.uuid,
                    isCollapseAction: true,
                  });
                  setFilter((items) => ({
                    ...items,
                    isForceReload: !items.isForceReload,
                  }));
                } else GlobalHistory.push('/onboarding/activity');
          }}
          isOpenChanged={
            (isOpenDialogs.spaceDelete
              && onIsOpenDialogsChanged('spaceDelete', false))
            || (isOpenDialogs.folderDelete
              && onIsOpenDialogsChanged('folderDelete', false))
            || (isOpenDialogs.flowDelete && onIsOpenDialogsChanged('flowDelete', false))
          }
          descriptionMessage={`${
            (isOpenDialogs.spaceDelete && 'space')
            || (isOpenDialogs.folderDelete && 'folder')
            || (isOpenDialogs.flowDelete && 'flow')
          }-delete-description`}
          deleteApi={
            (isOpenDialogs.spaceDelete && DeleteOnboardingSpaces)
            || (isOpenDialogs.folderDelete && DeleteOnboardingFolders)
            || (isOpenDialogs.flowDelete && DeleteFormsTemplate)
          }
          apiProps={{
            uuid:
              activeItem
              && ((isOpenDialogs.flowDelete && [activeItem.uuid]) || activeItem.uuid),
          }}
          errorMessage={`${
            (isOpenDialogs.spaceDelete && 'space')
            || (isOpenDialogs.folderDelete && 'folder')
            || (isOpenDialogs.flowDelete && 'flow')
          }-delete-failed`}
          activeItemKey="uuid"
          apiDeleteKey="uuid"
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isOpen={
            isOpenDialogs.spaceDelete
            || isOpenDialogs.folderDelete
            || isOpenDialogs.flowDelete
          }
        />
      )}
    </div>
  );
};

export default ConnectionsPage;
