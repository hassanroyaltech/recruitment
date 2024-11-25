import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  CollapseComponent,
  LoaderComponent,
  TooltipsComponent,
} from '../../../../../../components';
import {
  DeleteFormsTemplate,
  DeleteOnboardingFolders,
  DeleteOnboardingSpaces,
  GetAllOnboardingDirectoriesLink,
  GetAllOnboardingDirectoriesMove,
} from '../../../../../../services';
import ButtonBase from '@mui/material/ButtonBase';
import {
  DefaultFormsTypesEnum,
  FormsForTypesEnum,
  NavigationSourcesEnum,
  OnboardingMenuForSourceEnum,
  OnboardingTypesEnum,
  SystemActionsEnum,
} from '../../../../../../enums';
import { useTranslation } from 'react-i18next';
import {
  GetBoxXYInformation,
  getIsAllowedPermissionV2,
  GlobalHistory,
  GlobalOnboardingMenuFilterState,
  SetGlobalConnectionsFilter,
  showError,
  showSuccess,
} from '../../../../../../helpers';
import { ConnectionsManagementDialog } from '../../../../dialogs';
import { ConfirmDeleteDialog } from '../../../../../setups/shared';
import { FoldersSection } from '../folders/Folders.Section';
import { FlowsSection } from '../flows/Flows.Section';
import { useEventListener, useQuery } from '../../../../../../hooks';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  ManageDirectoryPermissions,
  ManageFlowPermissions,
  ManageFolderPermissions,
  ManageSpacePermissions,
} from '../../../../../../permissions';

const parentTranslationPath = 'OnboardingPage';
const translationPath = '';

export const SpacesSection = ({
  forSource,
  getIsWithoutData,
  isWithSelectTheFirstItem,
  getIsActiveCollapseItem,
  getReturnedData,
  getSelectedConnection,
  getOnConnectionsClicked,
  isGlobalLoading,
  getIsLoading,
  directoryData,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const query = useQuery();
  const [openedCollapses, setOpenedCollapses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const candidateReducer = useSelector((state) => state?.candidateReducer);
  const userReducer = useSelector((reducerState) => reducerState.userReducer);
  const lastDragOverRef = useRef(null);
  const dropIndicatorElementRef = useRef(null);
  const lastDropIndicatorContainerElementRef = useRef(null);
  const currentDraggingItemRef = useRef(null);
  const currentDraggingItemInitRef = useRef({
    isForLink: false,
    isMoved: false, // needed to know if the current dragging is finish dragging and specify location or link (not related to save)
    newItemDetails: null, // needed to save the current new location during saving the move or link
    dragItemType: null,
    itemSpaceUUID: null,
    itemFolderUUID: null,
    item: null,
  });
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );
  const [currentDraggingItem, setCurrentDraggingItem] = useState({
    ...currentDraggingItemInitRef.current,
  });
  const currentURLQueriesRef = useRef({
    space_uuid: null,
    folder_uuid: null,
  });
  const [selectedConnection, setSelectedConnection] = useState({
    space_uuid: null,
    folder_uuid: null,
  });
  const [activeItem, setActiveItem] = useState(null);
  const [isOpenDialogs, setIsOpenDialogs] = useState({
    spaces: false,
    folders: false,
    spaceDelete: false,
    folderDelete: false,
    flowDelete: false,
  });
  // const [activeItem, setActiveItem] = useState({
  //   subFolder: null,
  //   flow: null,
  // });
  const [filter, setFilter] = useState({
    search: '',
    status: true,
    isForceReload: false,
    use_for: 'menu', // ignore pagination (without pagination)
    is_with_disconnected: 1,
    for: (query.get('for') && +query.get('for')) || null,
    email: query.get('email'),
  });
  const onboardingListRef = useRef(null);
  const [onboardingList, setOnboardingList] = useState(() => ({
    spaces: [],
    folders: [],
    flows: [], // list of disconnected flows (not connected with any spaces)
  }));

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to update the child item like folder or flow
   */
  // const onActiveItemChanged = useCallback((newValue) => {
  //   setActiveItem((items) => ({
  //     ...items,
  //     ...newValue,
  //   }));
  // }, []);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return if the item is collapsed or not whether for folders or spaces or both
   */
  const getIsOpenCollapse = useMemo(
    () =>
      ({ space_uuid, folder_uuid }) =>
        openedCollapses.some(
          (item) =>
            (item.space_uuid === space_uuid && !folder_uuid)
            || (item.folder_uuid === folder_uuid && !space_uuid)
            || (item.space_uuid === space_uuid && item.folder_uuid === folder_uuid),
        ),
    [openedCollapses],
  );
  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return current opened collapse whether for folders or spaces or both
   */
  const getOpenCollapseIndex = useMemo(
    () =>
      ({ items, space_uuid, folder_uuid }) =>
        items.findIndex(
          (item) =>
            (item.space_uuid === space_uuid && !folder_uuid)
            || (item.folder_uuid === folder_uuid && !space_uuid)
            || (item.space_uuid === space_uuid && item.folder_uuid === folder_uuid),
        ),
    [],
  );

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
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to init the spaces of onboarding
   * */
  const onboardingInit = useCallback(async () => {
    if (forSource.isDataPassedFromParent) {
      setOnboardingList(directoryData);
      return;
    }
    setIsLoading(true);
    const response = await (
      (filter.for === FormsForTypesEnum.Candidate.key
        && forSource.callAPIRecipient)
      || forSource.callAPI
    )({
      ...filter,
      email:
        filter.email
        || (filter.for === FormsForTypesEnum.Candidate.key
          && candidateReducer
          && candidateReducer.candidate.email)
        || (filter.for === FormsForTypesEnum.SystemUser.key
          && userReducer
          && userReducer.results.user.email),
      ...(filter.for === FormsForTypesEnum.Candidate.key
        && candidateReducer && {
        company_uuid: candidateReducer.company?.uuid,
        token: candidateReducer.token,
        account_uuid: candidateReducer.account?.uuid,
      }),
    });
    setIsLoading(false);
    if (response && response.status === 200) {
      setOnboardingList(response.data.results);
      if (getIsWithoutData)
        getIsWithoutData(
          response.data.results.spaces.length === 0
            && response.data.results.folders.length === 0
            && response.data.results.flows.length === 0,
        );
    } else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [
    candidateReducer,
    filter,
    forSource.callAPI,
    forSource.callAPIRecipient,
    forSource.isDataPassedFromParent,
    directoryData,
    getIsWithoutData,
    t,
    userReducer,
  ]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the new value of current dragging item from child
   * */
  const onCurrentDraggingItemChanged = useCallback((newValue) => {
    setCurrentDraggingItem((items) => ({ ...items, ...newValue }));
  }, []);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle adding or editing the connections (OnboardingTypesEnum)
   */
  const onConnectionsClicked = useCallback(
    ({
      space_uuid = null,
      folder_uuid = null,
      key,
      selectedItem,
      actionKey,
      isCollapseAction,
      isSurvey,
    }) =>
      () => {
        if (isCollapseAction) {
          if (
            forSource.redirectPath
            && (space_uuid !== currentURLQueriesRef.current
              || currentURLQueriesRef.current !== folder_uuid)
          ) {
            const pathQueries = [];
            if (space_uuid) pathQueries.push(`space_uuid=${space_uuid}`);
            if (folder_uuid) pathQueries.push(`folder_uuid=${folder_uuid}`);
            GlobalHistory.push(`${forSource.redirectPath}?${pathQueries.join('&')}`);
            currentURLQueriesRef.current = {
              space_uuid,
              folder_uuid,
            };
          }
          setOpenedCollapses((items) => {
            const isOpenedIndex = getOpenCollapseIndex({
              space_uuid,
              folder_uuid,
              items,
            });
            if (isOpenedIndex !== -1) {
              items.splice(isOpenedIndex, 1);
              if (!folder_uuid && space_uuid)
                items = items.filter((item) => item.space_uuid !== space_uuid);
            } else items.push({ space_uuid, folder_uuid });
            return [...items];
          });
        }

        setSelectedConnection({
          space_uuid,
          folder_uuid,
        });
        setActiveItem((items) =>
          (items && !selectedItem) || selectedItem ? selectedItem : items,
        );
        if (getOnConnectionsClicked)
          getOnConnectionsClicked({
            space_uuid,
            folder_uuid,
            key,
            selectedItem,
            actionKey,
            isCollapseAction,
          });
        if (!forSource.isWithActions) return;

        if (key === OnboardingTypesEnum.Spaces.key)
          if (actionKey === SystemActionsEnum.delete.key)
            onIsOpenDialogsChanged('spaceDelete', true)();
          else onIsOpenDialogsChanged('spaces', true)();
        if (key === OnboardingTypesEnum.Folders.key)
          if (actionKey === SystemActionsEnum.delete.key)
            onIsOpenDialogsChanged('folderDelete', true)();
          else onIsOpenDialogsChanged('folders', true)();
        if (key === OnboardingTypesEnum.Flows.key)
          if (actionKey === SystemActionsEnum.delete.key)
            onIsOpenDialogsChanged('flowDelete', true)();
          else
            GlobalHistory.push(
              `/forms?code=${DefaultFormsTypesEnum.Flows.key}&source=${
                NavigationSourcesEnum.OnboardingMenuToFormBuilder.key
              }${(selectedItem && `&template_uuid=${selectedItem.uuid}`) || ''}${
                (actionKey === SystemActionsEnum.view.key
                  && `&source=${NavigationSourcesEnum.OnboardingMenuViewToFormBuilder.key}`)
                || ''
              }${(space_uuid && `&space_uuid=${space_uuid}`) || ''}${
                (isSurvey && `&is_survey=${true}`) || ''
              }${(folder_uuid && `&folder_uuid=${folder_uuid}`) || ''}`,
            );
      },
    [
      forSource.isWithActions,
      forSource.redirectPath,
      getOnConnectionsClicked,
      getOpenCollapseIndex,
      onIsOpenDialogsChanged,
    ],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to reset the current dragging space or subFolder or flow
   */
  const onDragCancel = () => {
    setCurrentDraggingItem({ ...currentDraggingItemInitRef.current });
    if (lastDropIndicatorContainerElementRef.current) {
      lastDropIndicatorContainerElementRef.current.removeChild(
        dropIndicatorElementRef.current,
      );
      lastDropIndicatorContainerElementRef.current = null;
    }
    if (lastDragOverRef.current) lastDragOverRef.current = null;
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return whether the current dragging item can be dropped or not
   */
  const getIsDisabledDrop = useCallback(
    ({
      overItem,
      isSameDraggingItem,
      dragOverType,
      dragOverSpaceUUID,
      dragOverFolderUUID,
    }) => {
      const { item, isForLink, dragItemType, itemSpaceUUID, itemFolderUUID }
        = currentDraggingItemRef.current;

      if (isSameDraggingItem || !item) return true;

      if (isForLink) {
        // Check if the dragged item is a link and if it can be linked with the current drop item
        if (
          ![
            OnboardingTypesEnum.Folders.key,
            OnboardingTypesEnum.Spaces.key,
          ].includes(dragOverType)
        )
          return true;

        // Check if the drop item already contains the link being dragged
        if (overItem.flows?.some((flow) => flow.uuid === item.uuid)) return true;
      } else if (
        dragItemType !== dragOverType
        && ((dragOverType === OnboardingTypesEnum.Spaces.key
          && itemSpaceUUID !== overItem.uuid)
          || ((dragOverType === OnboardingTypesEnum.Folders.key
            || dragOverType === OnboardingTypesEnum.Flows.key)
            && itemSpaceUUID !== overItem.space_uuid))
      )
        return true;
      else if (
        dragItemType !== dragOverType
        && (dragItemType === OnboardingTypesEnum.Spaces.key
          || (dragItemType === OnboardingTypesEnum.Folders.key
            && dragOverType === OnboardingTypesEnum.Flows.key))
      )
        return true;
      else if (
        dragItemType === OnboardingTypesEnum.Flows.key
        && (dragOverSpaceUUID !== itemSpaceUUID
          || dragOverFolderUUID !== itemFolderUUID)
      )
        return true;

      return false;
    },
    [currentDraggingItemRef],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to decide whether move is disconnect or not
   */
  const getIsDisconnectMove = useCallback(
    ({ event, isLastItem, dragOverType }) =>
      currentDraggingItemRef.current.isForLink
      && currentDraggingItemRef.current.dragItemType !== dragOverType
      && isLastItem
      && GetBoxXYInformation({ event, centerDivide: 3 }).isBeforeXCenter
      && GetBoxXYInformation({ event }).isBeforeYCenter,
    [],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to decide whether move is disconnect && oder happen only when move the flow
   * to the higher level like from folder to space or from folder or space to disconnected flows
   * by make sure that the child include a clone of it that is mean it will be disconnected
   */
  const getIsDisconnectWithOrder = useCallback(({ dragOver, isDisconnect }) => {
    if (isDisconnect) return false;
    if (
      currentDraggingItemRef.current.dragItemType
        === OnboardingTypesEnum.Flows.key
      && (((currentDraggingItemRef.current.item.space_uuid
        || currentDraggingItemRef.current.item.folder_uuid)
        && !dragOver.space_uuid
        && !dragOver.folder_uuid)
        || (currentDraggingItemRef.current.item.folder_uuid
          && dragOver.space_uuid
          && !dragOver.folder_uuid))
    )
      if (dragOver.space_uuid) {
        // this if is to make sure current flow is connected with other folders at the space or not
        const spaceItem = onboardingListRef.current.spaces.find(
          (item) => item.uuid === dragOver.space_uuid,
        );
        if (spaceItem)
          return spaceItem.folders.some((folder) =>
            folder.flows.some(
              (flow) =>
                flow.uuid === currentDraggingItemRef.current.item.uuid
                && currentDraggingItemRef.current.item.folder_uuid !== flow.folder_uuid,
            ),
          );
        // this else is to make sure that the current disconnect flow not connected with other spaces or folders
      } else
        return (
          onboardingListRef.current.spaces.some(
            (space) =>
              space.flows.some(
                (flow) =>
                  flow.uuid === currentDraggingItemRef.current.item.uuid
                  && currentDraggingItemRef.current.item.space_uuid !== flow.space_uuid,
              )
              || space.folders.some((folder) =>
                folder.flows.some(
                  (flow) =>
                    flow.uuid === currentDraggingItemRef.current.item.uuid
                    && (currentDraggingItemRef.current.item.folder_uuid
                      !== flow.folder_uuid
                      || currentDraggingItemRef.current.item.space_uuid
                        !== flow.space_uuid),
                ),
              ),
          )
          || onboardingListRef.current.folders.some((folder) =>
            folder.flows.some(
              (flow) =>
                flow.uuid === currentDraggingItemRef.current.item.uuid
                && currentDraggingItemRef.current.item.folder_uuid !== flow.folder_uuid,
            ),
          )
        );

    return false;
  }, []);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to decide whether to drop or not also where & to draw the indicator
   */
  const onDragOverItemHandler = useCallback(
    ({
      item,
      isSameDraggingItem,
      currentDragOverNumber,
      isLastItem,
      isFirstItem,
      itemSpaceUUID,
      itemFolderUUID,
      dragOverType,
    }) =>
      (event) => {
        event.preventDefault();
        // to prevent the drag change on
        if (
          getIsDisabledDrop({
            overItem: item,
            dragOverType,
            dragOverSpaceUUID: itemSpaceUUID,
            dragOverFolderUUID: itemFolderUUID,
            isSameDraggingItem,
          })
        ) {
          lastDragOverRef.current = null;
          if (lastDropIndicatorContainerElementRef.current) {
            lastDropIndicatorContainerElementRef.current.removeChild(
              dropIndicatorElementRef.current,
            );
            lastDropIndicatorContainerElementRef.current = null;
          }
          return;
        }

        const isDisconnect = getIsDisconnectMove({
          event,
          isLastItem,
          dragOverType,
        });
        const isDisconnectWithOrder = getIsDisconnectWithOrder({
          dragOver: item,
          dragOverType,
          isDisconnect,
        });

        const isInside
          = !isDisconnect
          && currentDraggingItemRef.current.dragItemType !== dragOverType;

        lastDragOverRef.current = {
          item,
          isLastItem,
          isFirstItem,
          currentDragOverNumber,
          dragOverSpaceUUID: itemSpaceUUID,
          dragOverFolderUUID: itemFolderUUID,
          isInside,
          isDisconnect,
          isDisconnectWithOrder,
          dragOverType,
        };

        // Remove the drop indicator (overlay) from the DOM if it exists
        if (lastDropIndicatorContainerElementRef.current) {
          lastDropIndicatorContainerElementRef.current.removeChild(
            dropIndicatorElementRef.current,
          );
          lastDropIndicatorContainerElementRef.current = null;
        }

        // Create the drop indicator (overlay) if it doesn't exist
        if (!dropIndicatorElementRef.current) {
          dropIndicatorElementRef.current = document.createElement('div');
          dropIndicatorElementRef.current.classList.add('drag-line-wrapper');
          dropIndicatorElementRef.current.innerHTML = `<span></span>`;
        }

        // Add the "is-inside" class to the drop indicator (overlay) if necessary
        dropIndicatorElementRef.current.classList.toggle('is-inside', isInside);

        // Add the "is-disconnect" class to the drop indicator (overlay) if necessary
        dropIndicatorElementRef.current.classList.toggle(
          'is-disconnect',
          isDisconnect || isDisconnectWithOrder,
        );

        // Bind the drop indicator (overlay) to the DOM
        const touchEvent = event.originalEvent?.touches?.[0];
        lastDropIndicatorContainerElementRef.current
          = touchEvent ?? event.currentTarget;

        // Add the drop indicator (overlay) to the appropriate position in the DOM
        const boxXYInformation = GetBoxXYInformation({ event });
        const isBeforeOrEqualYCenter = boxXYInformation.isBeforeOrEqualYCenter;
        if (!isInside && !isDisconnect && isBeforeOrEqualYCenter) {
          lastDropIndicatorContainerElementRef.current.insertBefore(
            dropIndicatorElementRef.current,
            lastDropIndicatorContainerElementRef.current.firstChild,
          );
          lastDragOverRef.current.isBefore = true;
        } else {
          lastDropIndicatorContainerElementRef.current.appendChild(
            dropIndicatorElementRef.current,
          );
          lastDragOverRef.current.isBefore = false;
        }
      },
    [getIsDisabledDrop, getIsDisconnectMove, getIsDisconnectWithOrder],
  );

  /**
   * @param event
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to reorder stages items or change the dragged candidate stage
   */
  const onDragEndHandler = async (event) => {
    if (
      !currentDraggingItemRef.current?.item
      || !lastDragOverRef.current
      || GetBoxXYInformation({ event }).isOutsideElement
    ) {
      onDragCancel();
      return;
    }

    setCurrentDraggingItem((items) => ({ ...items, isMoved: true }));
    const {
      isDisconnect,
      isDisconnectWithOrder,
      isBefore,
      isInside,
      currentDragOverNumber,
      dragOverSpaceUUID,
      dragOverFolderUUID,
      item,
      dragOverType,
    } = lastDragOverRef.current;
    const requestState = {
      type: currentDraggingItemRef.current.dragItemType,
      uuid: currentDraggingItemRef.current.item.uuid,
    };
    if (!isDisconnect || isDisconnectWithOrder)
      if (isInside)
        requestState.order
          = (dragOverType === OnboardingTypesEnum.Spaces.key
            && (currentDraggingItemRef.current.dragItemType
            === OnboardingTypesEnum.Folders.key
              ? item.folders.length
              : item.flows.length))
          || item.flows.length;
      else
        requestState.order = isBefore
          ? currentDragOverNumber
          : currentDragOverNumber + 1;

    if (currentDraggingItemRef.current.isForLink)
      if (isDisconnect) {
        if (dragOverType === OnboardingTypesEnum.Folders.key && item.space_uuid)
          requestState.space_uuids = [item.space_uuid];
      } else {
        if (dragOverType === OnboardingTypesEnum.Spaces.key)
          requestState.space_uuids = [item.uuid];

        // else if (dragOverType === OnboardingTypesEnum.Flows.key && item.space_uuid)
        //   requestState.space_uuids = [item.space_uuid];
        if (dragOverType === OnboardingTypesEnum.Folders.key)
          requestState.folder_uuids = [item.uuid];
        // else if (dragOverType === OnboardingTypesEnum.Flows.key && item.folder_uuid)
        //   requestState.folder_uuids = [item.folder_uuid];
      }
    else if (isInside) {
      if (dragOverSpaceUUID) requestState.space_uuid = dragOverSpaceUUID;
      if (dragOverFolderUUID) requestState.folder_uuid = dragOverFolderUUID;
    } else {
      if (dragOverSpaceUUID && !isDisconnect)
        requestState.space_uuid = dragOverSpaceUUID;
      if (dragOverFolderUUID && !isDisconnect)
        requestState.folder_uuid = dragOverFolderUUID;
    }

    setIsLoading(true);
    const response = await (
      (currentDraggingItemRef.current.isForLink
        && GetAllOnboardingDirectoriesLink)
      || GetAllOnboardingDirectoriesMove
    )(requestState);
    setIsLoading(false);
    if (response && response.status === 200) {
      showSuccess(
        t(
          `${translationPath}${
            (currentDraggingItemRef.current.dragItemType
              === OnboardingTypesEnum.Spaces.key
              && 'space')
            || (currentDraggingItemRef.current.dragItemType
              === OnboardingTypesEnum.Folders.key
              && 'folder')
            || 'flow'
          }-${
            (currentDraggingItemRef.current.isForLink && 'linked') || 'moved'
          }-successfully`,
        ),
      );
      await onboardingInit();
    } else
      showError(
        t(
          `${translationPath}${
            (currentDraggingItemRef.current.dragItemType
              === OnboardingTypesEnum.Spaces.key
              && 'space')
            || (currentDraggingItemRef.current.dragItemType
              === OnboardingTypesEnum.Folders.key
              && 'folder')
            || 'flow'
          }-${
            (currentDraggingItemRef.current.isForLink && 'link') || 'move'
          }-failed`,
        ),
        response,
      );
    onDragCancel();
  };

  // /**
  //  * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
  //  * @Description this method is to handle load more on scroll or scroll not exist
  //  */
  // const onScrollHandler = useCallback(() => {
  //   if (
  //     (bodyRef.current.scrollHeight <= bodyRef.current.clientHeight
  //       || bodyRef.current.scrollTop + bodyRef.current.clientHeight
  //         >= bodyRef.current.firstChild.clientHeight - 5)
  //     && onboardingList.results.length < onboardingList.totalCount
  //     && !isLoadingRef.current
  //     && !isLoading
  //   )
  //     setFilter((items) => ({ ...items, page: items.page + 1 }));
  // }, [isLoading, onboardingList.results.length, onboardingList.totalCount]);
  //
  // useEventListener('scroll', onScrollHandler, bodyRef.current);

  useEffect(() => {
    onboardingInit();
  }, [onboardingInit, filter]);

  // this is to control the active space and/or folder (are they active as page)
  useEffect(() => {
    const querySpace = query.get('space_uuid');
    const queryFolder = query.get('folder_uuid');
    // ref to avoid infinite loop because the read and update at the same location
    if (
      (querySpace || queryFolder)
      && window.location.pathname === '/onboarding/connections'
    )
      currentURLQueriesRef.current = {
        space_uuid: querySpace,
        folder_uuid: queryFolder,
      };
  }, [query]);

  // needed to rerender the menu when add folder and/or space from another location
  useEffect(() => {
    GlobalOnboardingMenuFilterState(setFilter);
  }, []);

  useEffect(() => {
    currentDraggingItemRef.current = currentDraggingItem;
  }, [currentDraggingItem]);

  useEffect(() => {
    onboardingListRef.current = onboardingList;
  }, [onboardingList]);

  useEffect(() => {
    if (getReturnedData) getReturnedData(onboardingList);
  }, [getReturnedData, onboardingList]);

  useEffect(() => {
    if (isWithSelectTheFirstItem) {
      const firstItem
        = (onboardingList.spaces.length > 0 && onboardingList.spaces[0])
        || (onboardingList.folders.length > 0 && onboardingList.folders[0]);
      if (firstItem)
        if (onboardingList.spaces.length > 0)
          onConnectionsClicked({
            space_uuid: firstItem.uuid,
            isCollapseAction: true,
          })();
        else
          onConnectionsClicked({
            space_uuid: firstItem.space_uuid,
            folder_uuid: firstItem.uuid,
            isCollapseAction: true,
          })();
    }
  }, [isWithSelectTheFirstItem, onConnectionsClicked, onboardingList]);

  useEffect(() => {
    if (getSelectedConnection) getSelectedConnection(selectedConnection);
  }, [getSelectedConnection, selectedConnection]);

  useEffect(() => {
    if (getIsLoading) getIsLoading(isLoading);
  }, [getIsLoading, isLoading]);

  useEventListener('keyup', (event) => {
    if (
      event.key === 'Escape'
      && currentDraggingItemRef.current.item
      && !currentDraggingItemRef.current.isMoved
    )
      onDragCancel();
  });

  return (
    <div
      className="spaces-section-wrapper section-wrapper"
      role="grid"
      tabIndex={0}
      onDragStart={() => {
        document.body.addEventListener('dragover', (event) =>
          event.preventDefault(),
        );
        document.body.addEventListener('drop', (event) => {
          const element
            = typeof event.originalEvent === 'undefined'
              ? event.currentTarget
              : event.originalEvent.touches[0];
          if (!element || !element.innerHTML.includes('.spaces-section-wrapper'))
            onDragCancel();
          document.body.removeEventListener('dragover', () => {});
          document.body.removeEventListener('drop', () => {});
        });
      }}
      onDragOver={(event) => event.preventDefault()}
      onDrop={onDragEndHandler}
      onTouchEnd={onDragEndHandler}
    >
      <div className="spaces-items-wrapper">
        {onboardingList.spaces
          .filter(
            (item) =>
              !currentDraggingItem.item
              || currentDraggingItem.dragItemType !== OnboardingTypesEnum.Spaces.key
              || currentDraggingItem.item.uuid !== item.uuid,
          )
          .map((item, index, items) => (
            <div
              key={`spacesKey${index + 1}${item.uuid}`}
              className={`space-item-wrapper onboarding-menu-item-wrapper${
                ((items.length < 2 || isLoading) && ' is-disabled') || ''
              }`}
            >
              <div
                className="onboarding-menu-item-body-wrapper"
                onDragOver={onDragOverItemHandler({
                  item,
                  currentDragOverNumber: index + 1,
                  isLastItem: index === items.length - 1,
                  isFirstItem: index === 0,
                  itemSpaceUUID: item.uuid,
                  dragOverType: OnboardingTypesEnum.Spaces.key,
                })}
              >
                <div className="btns-and-actions-wrapper">
                  <ButtonBase
                    className={`btns theme-transparent${
                      ((currentURLQueriesRef.current.space_uuid === item.uuid
                        || (getIsActiveCollapseItem
                          && getIsActiveCollapseItem({
                            type: OnboardingTypesEnum.Spaces.key,
                            item,
                          })))
                        && ' is-active')
                      || ''
                    }`}
                    disabled={
                      isGlobalLoading
                      || (!getIsAllowedPermissionV2({
                        permissionId: ManageSpacePermissions.ViewSpace.key,
                        permissions: permissionsReducer,
                      })
                        && forSource?.key
                          !== OnboardingMenuForSourceEnum.Invitations.key)
                    }
                    onClick={onConnectionsClicked({
                      space_uuid: item.uuid,
                      isCollapseAction: true,
                    })}
                  >
                    <span className="btns-content">
                      <span
                        className={`fas fa-chevron-${
                          (getIsOpenCollapse({ space_uuid: item.uuid }) && 'up')
                          || 'down'
                        }`}
                      />
                      <TooltipsComponent
                        title={
                          ((!currentDraggingItem.item
                            || currentDraggingItem.isMoved)
                            && item.title)
                          || ''
                        }
                        contentComponent={
                          <span className="title-text px-2">{item.title}</span>
                        }
                      />
                    </span>
                  </ButtonBase>
                  {forSource.isWithActions
                    && (!currentDraggingItem.item || currentDraggingItem.isMoved) && (
                    <div className="btns-actions-wrapper">
                      <TooltipsComponent
                        title="move"
                        parentTranslationPath={parentTranslationPath}
                        translationPath={translationPath}
                        contentComponent={
                          <span className="d-inline-flex">
                            <ButtonBase
                              className="dragging-btn btns-icon theme-transparent"
                              disabled={
                                currentDraggingItem.isMoved
                                  || !getIsAllowedPermissionV2({
                                    permissionId:
                                      ManageDirectoryPermissions.ManageReorder.key,
                                    permissions: permissionsReducer,
                                  })
                              }
                              draggable
                              onDrag={() => {
                                onCurrentDraggingItemChanged({
                                  isMoved: false,
                                  dragItemType: OnboardingTypesEnum.Spaces.key,
                                  itemSpaceUUID: item.uuid,
                                  item: item,
                                });
                              }}
                            >
                              <span className="fas fa-ellipsis-v" />
                              <span className="fas fa-ellipsis-v" />
                            </ButtonBase>
                          </span>
                        }
                      />
                      <TooltipsComponent
                        title="edit"
                        parentTranslationPath={parentTranslationPath}
                        translationPath={translationPath}
                        contentComponent={
                          <span>
                            <ButtonBase
                              className="btns-icon theme-transparent"
                              disabled={
                                currentDraggingItem.isMoved
                                  || !getIsAllowedPermissionV2({
                                    permissionId:
                                      ManageSpacePermissions.DeleteSpace.key,
                                    permissions: permissionsReducer,
                                  })
                              }
                              onClick={onConnectionsClicked({
                                key: OnboardingTypesEnum.Spaces.key,
                                space_uuid: item.uuid,
                                selectedItem: item,
                                actionKey: SystemActionsEnum.edit.key,
                              })}
                            >
                              <span className={SystemActionsEnum.edit.icon} />
                            </ButtonBase>
                          </span>
                        }
                      />
                      <TooltipsComponent
                        title="delete"
                        parentTranslationPath={parentTranslationPath}
                        translationPath={translationPath}
                        contentComponent={
                          <span>
                            <ButtonBase
                              className="btns-icon theme-transparent"
                              disabled={
                                currentDraggingItem.isMoved
                                  || !getIsAllowedPermissionV2({
                                    permissionId:
                                      ManageSpacePermissions.DeleteSpace.key,
                                    permissions: permissionsReducer,
                                  })
                              }
                              onClick={onConnectionsClicked({
                                key: OnboardingTypesEnum.Spaces.key,
                                space_uuid: item.uuid,
                                selectedItem: item,
                                actionKey: SystemActionsEnum.delete.key,
                              })}
                            >
                              <span className={SystemActionsEnum.delete.icon} />
                            </ButtonBase>
                          </span>
                        }
                      />
                    </div>
                  )}
                </div>
              </div>

              <CollapseComponent
                isOpen={getIsOpenCollapse({ space_uuid: item.uuid })}
                wrapperClasses="w-100"
                component={
                  <div className="space-collapse-content-wrapper collapse-content-wrapper">
                    <FoldersSection
                      isLoading={isLoading || isGlobalLoading}
                      folders={item.folders}
                      forSource={forSource}
                      space_uuid={item.uuid}
                      droppableType="spaceFoldersType"
                      droppableId={`${item.uuid}${index}`}
                      currentDraggingItem={currentDraggingItem}
                      getIsActiveCollapseItem={getIsActiveCollapseItem}
                      onCurrentDraggingItemChanged={onCurrentDraggingItemChanged}
                      onDragOverItemHandler={onDragOverItemHandler}
                      currentURLQueriesRef={currentURLQueriesRef}
                      getIsOpenCollapse={getIsOpenCollapse}
                      translationPath={translationPath}
                      parentTranslationPath={parentTranslationPath}
                      onConnectionsClicked={onConnectionsClicked}
                    />
                    <FlowsSection
                      isLoading={isLoading || isGlobalLoading}
                      flows={item.flows}
                      space_uuid={item.uuid}
                      currentDraggingItem={currentDraggingItem}
                      onDragOverItemHandler={onDragOverItemHandler}
                      onCurrentDraggingItemChanged={onCurrentDraggingItemChanged}
                      droppableType="spaceFlowsType"
                      forSource={forSource}
                      droppableId={`${item.uuid}${index}`}
                      translationPath={translationPath}
                      parentTranslationPath={parentTranslationPath}
                      onConnectionsClicked={onConnectionsClicked}
                    />
                    {forSource.isWithAddActions
                      && (!currentDraggingItem.item || currentDraggingItem.isMoved) && (
                      <>
                        <ButtonBase
                          className="btns theme-transparent"
                          onClick={onConnectionsClicked({
                            key: OnboardingTypesEnum.Folders.key,
                            space_uuid: item.uuid,
                          })}
                          disabled={
                            !getIsAllowedPermissionV2({
                              permissionId:
                                  ManageFolderPermissions.CreateFolder.key,
                              permissions: permissionsReducer,
                            })
                          }
                        >
                          <span className="fas fa-plus" />
                          <span className="px-2">
                            {t(`${translationPath}add-folder`)}
                          </span>
                        </ButtonBase>
                        <ButtonBase
                          className="btns theme-transparent"
                          disabled={
                            currentDraggingItem.isMoved
                              || !getIsAllowedPermissionV2({
                                permissionId: ManageFlowPermissions.CreateFlow.key,
                                permissions: permissionsReducer,
                              })
                          }
                          onClick={onConnectionsClicked({
                            key: OnboardingTypesEnum.Flows.key,
                            space_uuid: item.uuid,
                          })}
                        >
                          <span className="fas fa-plus" />
                          <span className="px-2">
                            {t(`${translationPath}add-flow`)}
                          </span>
                        </ButtonBase>
                        <ButtonBase
                          className="btns theme-transparent"
                          disabled={
                            currentDraggingItem.isMoved
                              || !getIsAllowedPermissionV2({
                                permissionId: ManageFlowPermissions.CreateFlow.key,
                                permissions: permissionsReducer,
                              })
                          }
                          onClick={onConnectionsClicked({
                            key: OnboardingTypesEnum.Flows.key,
                            space_uuid: item.uuid,
                            isSurvey: true,
                          })}
                        >
                          <span className="fas fa-plus" />
                          <span className="px-2">
                            {t(`${translationPath}add-survey`)}
                          </span>
                        </ButtonBase>
                      </>
                    )}
                  </div>
                }
              />
            </div>
          ))}
      </div>
      <FoldersSection
        isLoading={isLoading || isGlobalLoading}
        folders={onboardingList.folders}
        forSource={forSource}
        getIsOpenCollapse={getIsOpenCollapse}
        currentDraggingItem={currentDraggingItem}
        getIsActiveCollapseItem={getIsActiveCollapseItem}
        onCurrentDraggingItemChanged={onCurrentDraggingItemChanged}
        onDragOverItemHandler={onDragOverItemHandler}
        currentURLQueriesRef={currentURLQueriesRef}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
        onConnectionsClicked={onConnectionsClicked}
      />
      <FlowsSection
        isLoading={isLoading || isGlobalLoading}
        flows={onboardingList.flows}
        forSource={forSource}
        onDragOverItemHandler={onDragOverItemHandler}
        currentDraggingItem={currentDraggingItem}
        onCurrentDraggingItemChanged={onCurrentDraggingItemChanged}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
        onConnectionsClicked={onConnectionsClicked}
      />
      {/*{!isLoading*/}
      {/*  && onboardingList.spaces.length === 0*/}
      {/*  && onboardingList.folders.length === 0*/}
      {/*  && onboardingList.flows.length === 0 && (*/}
      {/*  <div className="onboarding-menu-no-data-wrapper">*/}
      {/*    <span>{t(`Shared:no-data-found`)}</span>*/}
      {/*  </div>*/}
      {/*)}*/}
      {forSource.isWithAddActions
        && (!currentDraggingItem.item || currentDraggingItem.isMoved) && (
        <>
          <ButtonBase
            className="btns theme-transparent"
            onClick={onConnectionsClicked({ key: OnboardingTypesEnum.Spaces.key })}
            disabled={
              !getIsAllowedPermissionV2({
                permissionId: ManageSpacePermissions.CreateSpace.key,
                permissions: permissionsReducer,
              })
            }
          >
            <span className="fas fa-plus" />
            <span className="px-2">{t(`${translationPath}add-space`)}</span>
          </ButtonBase>
          <ButtonBase
            className="btns theme-transparent"
            onClick={onConnectionsClicked({
              key: OnboardingTypesEnum.Folders.key,
            })}
            disabled={
              !getIsAllowedPermissionV2({
                permissionId: ManageFolderPermissions.CreateFolder.key,
                permissions: permissionsReducer,
              })
            }
          >
            <span className="fas fa-plus" />
            <span className="px-2">{t(`${translationPath}add-folder`)}</span>
          </ButtonBase>
          <ButtonBase
            className="btns theme-transparent"
            disabled={
              currentDraggingItem.isMoved
                || !getIsAllowedPermissionV2({
                  permissionId: ManageFlowPermissions.CreateFlow.key,
                  permissions: permissionsReducer,
                })
            }
            onClick={onConnectionsClicked({ key: OnboardingTypesEnum.Flows.key })}
          >
            <span className="fas fa-plus" />
            <span className="px-2">{t(`${translationPath}add-flow`)}</span>
          </ButtonBase>
          <ButtonBase
            className="btns theme-transparent"
            disabled={
              currentDraggingItem.isMoved
                || !getIsAllowedPermissionV2({
                  permissionId: ManageFlowPermissions.CreateFlow.key,
                  permissions: permissionsReducer,
                })
            }
            onClick={onConnectionsClicked({
              key: OnboardingTypesEnum.Flows.key,
              isSurvey: true,
            })}
          >
            <span className="fas fa-plus" />
            <span className="px-2">{t(`${translationPath}add-survey`)}</span>
          </ButtonBase>
        </>
      )}
      <LoaderComponent
        isLoading={isLoading}
        isSkeleton
        skeletonItems={[
          {
            variant: 'rectangular',
            style: { minHeight: 20, marginTop: 5, marginBottom: 5 },
          },
        ]}
        numberOfRepeat={3}
      />

      {(isOpenDialogs.spaces || isOpenDialogs.folders) && (
        <ConnectionsManagementDialog
          activeItem={activeItem}
          isOpen={isOpenDialogs.spaces || isOpenDialogs.folders}
          space_uuid={
            (selectedConnection && selectedConnection.space_uuid) || undefined
          }
          isFolders={isOpenDialogs.folders}
          onSave={() => {
            SetGlobalConnectionsFilter((items) => ({
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
            // this logic to redirect the user to another connection if he deleted the one that currently active
            // or just redirect him to activity page if there is no spaces or folders
            if (isOpenDialogs.spaceDelete || isOpenDialogs.folderDelete)
              if (
                isOpenDialogs.spaceDelete
                && currentURLQueriesRef.current.space_uuid === activeItem.uuid
              ) {
                // this one if delete for space
                const nextAvailableSpace = onboardingList.spaces.find(
                  (item) => item.uuid !== currentURLQueriesRef.current.space_uuid,
                );
                if (nextAvailableSpace)
                  onConnectionsClicked({
                    space_uuid: nextAvailableSpace.uuid,
                    isCollapseAction: true,
                  });
                else {
                  // this one is for delete of the space but there is no other spaces to select
                  const nextAvailableFolders
                    = onboardingList.folders.length > 0 && onboardingList.folders[0];
                  if (nextAvailableFolders)
                    onConnectionsClicked({
                      folder_uuid: nextAvailableFolders.uuid,
                      isCollapseAction: true,
                    });
                  else GlobalHistory.push('/onboarding/activity');
                }
                setFilter((items) => ({
                  ...items,
                  isForceReload: !items.isForceReload,
                }));
                return;
              } else if (
                isOpenDialogs.folderDelete
                && currentURLQueriesRef.current.folder_uuid === activeItem.uuid
                && (currentURLQueriesRef.current.space_uuid || null)
                  === (activeItem.space_uuid || null)
              ) {
                // this one is for delete of the folder but there is space to select
                const nextAvailableSpace
                  = onboardingList.spaces.length > 0 && onboardingList.spaces[0];
                if (nextAvailableSpace)
                  onConnectionsClicked({
                    space_uuid: nextAvailableSpace.uuid,
                    isCollapseAction: true,
                  });
                else {
                  // this one is for delete of the folder but there is no space to select
                  const nextAvailableFolders = onboardingList.folders.find(
                    (item) => item.uuid !== activeItem.uuid,
                  );
                  if (nextAvailableFolders)
                    onConnectionsClicked({
                      folder_uuid: nextAvailableFolders.uuid,
                      isCollapseAction: true,
                    });
                  else GlobalHistory.push('/onboarding/activity');
                }
                setFilter((items) => ({
                  ...items,
                  isForceReload: !items.isForceReload,
                }));
                return;
              }
            // this one for reload the current connection data
            SetGlobalConnectionsFilter((items) => ({
              ...items,
              isForceReload: !items.isForceReload,
            }));
            // this one for reload the current tree data
            setFilter((items) => ({
              ...items,
              isForceReload: !items.isForceReload,
            }));
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

SpacesSection.propTypes = {
  forSource: PropTypes.oneOf(
    Object.values(OnboardingMenuForSourceEnum).map((item) => item),
  ).isRequired,
  getReturnedData: PropTypes.func,
  getIsLoading: PropTypes.func,
  getSelectedConnection: PropTypes.func,
  getOnConnectionsClicked: PropTypes.func,
  getIsActiveCollapseItem: PropTypes.func,
  isWithSelectTheFirstItem: PropTypes.bool,
  isGlobalLoading: PropTypes.bool,
  getIsWithoutData: PropTypes.func,
};
