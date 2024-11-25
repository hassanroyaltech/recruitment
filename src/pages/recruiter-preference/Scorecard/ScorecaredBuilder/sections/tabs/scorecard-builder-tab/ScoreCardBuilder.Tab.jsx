import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import AddTranslationButton from '../../../components/AddTranslationsButton/AddTranslationButton.Component';
import {
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../../../../setups/shared';
import { DynamicFormTypesEnum } from '../../../../../../../enums';
import { SystemLanguagesConfig } from '../../../../../../../configs';
import { ScorecardTranslationDialog } from '../../../components/TranslationDialog/ScorecardTranslationDialog';
import { ButtonBase, Grid } from '@mui/material';
import { SidebarSection } from '../../sidebar/Sidebar.Section';
import {
  closestCenter,
  defaultDropAnimation,
  DndContext,
  DragOverlay,
  MeasuringStrategy,
  MouseSensor,
  rectIntersection,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import SectionsWrapper from '../../../../../../form-builder-v2/features/Section/SectionsWrapper';
import EmptySection from '../../../components/Section/EmptySection';
import { createPortal } from 'react-dom';
import DroppableContainer from '../../../../../../form-builder-v2/features/Dragndrop/DroppableContainer';
import Section from '../../../../../../form-builder-v2/features/Section';
import DraggableCard from '../../../../../../form-builder-v2/features/Dragndrop/DraggableCard';
import { LayersIcon } from '../../../../../../form-builder/icons';
import { generateUUIDV4 } from '../../../../../../../helpers';
import DroppableContainerWrapper from '../../../../../../form-builder-v2/features/Dragndrop/DroppableContainerWrapper';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import SortableItem from '../../../../../../form-builder-v2/features/Dragndrop/SortableItem';
import FieldItemSection from '../../../components/FieldItem/FieldItem.Section';
import blocksItems from '../../../data/BlocksData';
import sectionsItems from '../../../data/SectionsData';
import ScoreCardSection from '../../../components/Section';
import { PlusIcon } from '../../../../../../../assets/icons';
export const ScorecardBuilderTab = ({
  isLoading,
  parentTranslationPath,
  translationPath,
  templateData,
  headerHeight,
  setTemplateData,
  dataSectionContainers,
  dataSectionItems,
  setDataSectionItems,
  setDataSectionContainers,
  setIsGlobalLoading,
  SectionsData,
  BlocksData,
  handleAddSection,
  ratingSections,
  handleSettingChange,
  handleWeightChange,
  isOpenSideMenu,
  handleOpenChatGPTDialog,
  isGlobalLoading,
  handleAddBlockFromEmpty,
  isDesicionExist,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [clonedDataSectionItems, setClonedDataSectionItems] = useState(null);
  const [activeId, setActiveId] = useState({
    sectionId: null,
    cardId: null,
    dragId: null,
  });
  const lastOverId = useRef(null);
  const recentlyMovedToNewContainer = useRef(false);

  const getIsSortingContainer = useMemo(
    () => activeId && dataSectionContainers?.includes(activeId.dragId),
    [activeId, dataSectionContainers],
  );

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });
  }, [dataSectionItems]);

  const findContainer = (id) => {
    if (id in dataSectionItems) return id;

    return Object.keys(dataSectionItems).find((key) =>
      dataSectionItems[key].blocks.map((x) => x.id).includes(id),
    );
  };

  // Custom collision detection strategy optimized for multiple containers
  const collisionDetectionStrategy = useCallback(
    (args) => {
      //Start by finding any intersecting droppable
      let overId = rectIntersection(args);
      if (activeId.dragId && activeId.dragId in dataSectionItems)
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            (container) => container.id in dataSectionItems,
          ),
        });

      if (overId != null) {
        if (overId in dataSectionItems) {
          const containerItems = dataSectionItems[overId];
          // If a container is matched, and it contains items (e.g. columns 'Offer data', 'Insurance', 'Transportation')
          if (containerItems.length > 0)
            // Return the closest droppable within that container
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (container) =>
                  container.id !== overId && containerItems.includes(container.id),
              ),
            });
        }
        lastOverId.current = overId;
        return overId;
      }
      // When a draggable item moves to a new container, the layout may shift
      // and the `overId` may become `null`. We manually set the cached `lastOverId`
      // to the id of the draggable item that was moved to the new container, otherwise
      // the previous `overId` will be returned which can cause items to incorrectly shift positions
      if (recentlyMovedToNewContainer.current) lastOverId.current = activeId.dragId;

      // If no droppable is matched, return the last match
      return lastOverId.current;
    },
    [activeId.dragId, dataSectionItems],
  );

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  return (
    <DndContext
      sensors={sensors}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={({ active }) => {
        setActiveId((ids) => ({ ...ids, dragId: active.id }));
        setClonedDataSectionItems(templateData?.sections || []);
      }}
      onDragOver={({ active, over }) => {
        const overId = over?.id;
        if (!overId || active.id in dataSectionItems) return;
        const overContainer = findContainer(overId);
        const activeContainer = findContainer(active.id);

        // if (['section'].includes(dataSectionItems[overContainer]?.model))
        //   return;
        if (active.id in blocksItems && overContainer && !activeContainer) {
          /*eslint no-param-reassign: ["error", { "props": false }]*/
          // description in DraggbleWrapper.jsx
          const originalType = active.id;
          active.id = active.data.current.id;
          setDataSectionItems((items) => ({
            ...items,
            [overContainer]: {
              ...items[overContainer],
              blocks: [
                ...items[overContainer].blocks,
                { ...blocksItems[originalType], id: active.data.current.id },
              ],
            },
          }));
        }

        if (!overContainer || !activeContainer) return;

        if (activeContainer !== overContainer)
          setDataSectionItems((items) => {
            const activeItems = items[activeContainer].blocks.map((x) => x.id);
            const overItems = items[overContainer].blocks.map((x) => x.id);
            // Give new positions to items by index while dragging
            const overIndex = overItems.indexOf(overId);
            const activeIndex = activeItems.indexOf(active.id);

            let newIndex;

            if (overId in items) newIndex = overItems.length + 1;
            else {
              const isBelowOverItem
                = over
                && active.rect.current.translated
                && active.rect.current.translated.offsetTop
                  > over.rect.offsetTop + over.rect.height;

              const modifier = isBelowOverItem ? 1 : 0;

              newIndex
                = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
            }

            recentlyMovedToNewContainer.current = true;

            return {
              ...items,
              [activeContainer]: {
                ...items[activeContainer],
                blocks: items[activeContainer].blocks.filter(
                  (item) => item.id !== active.id,
                ),
              },
              [overContainer]: {
                ...items[overContainer],
                blocks: [
                  ...items[overContainer].blocks.slice(0, newIndex),
                  items[activeContainer].blocks[activeIndex],
                  ...items[overContainer].blocks.slice(
                    newIndex,
                    items[overContainer].blocks.length,
                  ),
                ],
              },
            };
          });
      }}
      onDragEnd={({ active, over }) => {
        const overId = over?.id;
        const originalType = active.id;
        // builder
        if (active.id in blocksItems && active.data.current.id)
          /*eslint no-param-reassign: ["error", { "props": false }]*/
          active.id = active.data.current.id;

        if (!overId) {
          setActiveId((ids) => ({ ...ids, dragId: null }));
          return;
        }
        const overContainer = findContainer(overId);
        const activeContainer = findContainer(active.id);

        if (over && !activeContainer && over.id === 'droppableWrapper') {
          // Add field item to the container
          if (active?.data.current?.model === 'section') {
            setDataSectionContainers((containers) => [
              ...containers,
              active.data.current.id,
            ]);
            setDataSectionItems((items) => ({
              ...items,
              [active.data.current.id]: {
                ...sectionsItems[active.data.current.type],
                id: generateUUIDV4(),
              },
            }));
          }
          //or create new container if item dragged to the empty screen
          if (active?.data.current?.model === 'card') {
            const newSectionId = handleAddSection();
            setDataSectionItems((items) => ({
              ...items,
              [newSectionId]: {
                ...sectionsItems.section,
                ...items[newSectionId],
                blocks: [
                  ...items[newSectionId].blocks,
                  {
                    ...blocksItems[originalType],
                    id: generateUUIDV4(),
                  },
                ],
              },
            }));
          }
        }

        if (active.id in dataSectionItems && over?.id) {
          setDataSectionContainers((containers) => {
            const activeIndex = containers.indexOf(active.id);
            const overIndex = containers.indexOf(over.id);

            return arrayMove(containers, activeIndex, overIndex);
          });
          setDataSectionItems((c) => {
            const containers = Object.keys(c);
            const activeIndex = containers.indexOf(active.id);
            const overIndex = containers.indexOf(over.id);

            return Object.fromEntries(
              arrayMove(Object.entries(c), activeIndex, overIndex),
            );
          });
        }

        if (!activeContainer) {
          setActiveId((ids) => ({ ...ids, dragId: null }));
          return;
        }
        if (
          overContainer
          && !['bg'].includes(dataSectionItems[overContainer]?.model)
        ) {
          const activeIndex = dataSectionItems[activeContainer].blocks
            .map((x) => x.id)
            .indexOf(active.id);
          const overIndex = dataSectionItems[overContainer].blocks
            .map((x) => x.id)
            .indexOf(overId);
          if (activeIndex !== overIndex)
            setDataSectionItems((items) => ({
              ...items,
              [overContainer]: {
                ...items[overContainer],
                blocks: arrayMove(
                  items[overContainer].blocks,
                  activeIndex,
                  overIndex,
                ),
              },
            }));
        }

        setActiveId((ids) => ({ ...ids, dragId: null }));
      }}
      onDragCancel={() => {
        if (clonedDataSectionItems)
          // Reset items to their original state in case items have been
          // Dragged across containers
          setDataSectionItems(clonedDataSectionItems);

        setActiveId((ids) => ({ ...ids, dragId: null }));
        setClonedDataSectionItems(null);
      }}
    >
      <Grid
        className="form-builder-wrapper"
        container
        item
        xs
        sx={{
          height: `calc(100vh - ${headerHeight + 35}px)`,
          overflow: 'auto',
        }}
      >
        <SidebarSection
          parentTranslationPath={parentTranslationPath}
          SectionsData={SectionsData}
          BlocksData={BlocksData}
          isOpenSideMenu={isOpenSideMenu}
          isDesicionExist={isDesicionExist}
        />
        <DroppableContainerWrapper
          className="form-builder-sections-wrapper"
          element={SectionsWrapper}
          xs
          item
        >
          {!dataSectionContainers?.length && (
            <EmptySection
              handleAddSection={handleAddSection}
              handleAddBlockFromEmpty={handleAddBlockFromEmpty}
              parentTranslationPath={parentTranslationPath}
            />
          )}
          <SortableContext items={dataSectionContainers || []}>
            {dataSectionContainers?.map((containerId) => (
              <DroppableContainer
                key={`dataSectionContainersKey${containerId}`}
                element={ScoreCardSection}
                id={containerId}
                activeId={activeId}
                dataSectionItems={dataSectionItems}
                setActiveId={setActiveId}
                setDataSectionItems={setDataSectionItems}
                setDataSectionContainers={setDataSectionContainers}
                items={[...dataSectionItems[containerId].blocks]}
                templateData={templateData}
                setTemplateData={setTemplateData}
                ratingSections={ratingSections}
                handleSettingChange={handleSettingChange}
                handleWeightChange={handleWeightChange}
                handleOpenChatGPTDialog={handleOpenChatGPTDialog}
                isGlobalLoading={isGlobalLoading}
              >
                <SortableContext
                  items={dataSectionItems?.[containerId]?.blocks
                    .filter((item) => item)
                    .map((v) => v.id)}
                >
                  {dataSectionItems[containerId].blocks.map(
                    (v, idx) =>
                      v && (
                        <SortableItem
                          {...v}
                          key={`dataSectionItemKey${v.id}-${idx}`}
                          element={FieldItemSection}
                          setActiveId={setActiveId}
                          setIsGlobalLoading={setIsGlobalLoading}
                          containerId={containerId}
                          templateData={templateData}
                          dataSectionItems={dataSectionItems}
                          setDataSectionItems={setDataSectionItems}
                          parentTranslationPath={parentTranslationPath}
                          translationPath={translationPath}
                          isSorting={activeId.dragId}
                          isActive={
                            activeId.sectionId === containerId
                            && activeId.cardId === v.id
                          }
                          disabled={getIsSortingContainer}
                          handleOpenChatGPTDialog={handleOpenChatGPTDialog}
                          isGlobalLoading={isGlobalLoading}
                          isDesicionExist={isDesicionExist}
                          // errors={errors}
                          // isSubmitted={isSubmitted}
                        />
                      ),
                  )}
                </SortableContext>
              </DroppableContainer>
            ))}
          </SortableContext>
          <ButtonBase
            className="btns theme-transparent"
            onClick={() => {
              handleAddSection();
            }}
          >
            <span className="pr-2">
              {' '}
              <PlusIcon />{' '}
            </span>{' '}
            {t('add-section')}
          </ButtonBase>
        </DroppableContainerWrapper>
      </Grid>

      {createPortal(
        <DragOverlay
          adjustScale={false}
          dropAnimation={{
            ...defaultDropAnimation,
            dragSourceOpacity: 0.5,
          }}
        >
          {dataSectionContainers?.includes(activeId.dragId) ? (
            <DroppableContainer
              element={ScoreCardSection}
              id={activeId.dragId}
              activeId={activeId}
              setActiveId={setActiveId}
              dataSectionItems={dataSectionItems}
              setDataSectionItems={setDataSectionItems}
              setDataSectionContainers={setDataSectionContainers}
            >
              Section placement
            </DroppableContainer>
          ) : (
            <DraggableCard disableRipple startIcon={<LayersIcon />}>
              Field placement
            </DraggableCard>
          )}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  );
};

ScorecardBuilderTab.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
