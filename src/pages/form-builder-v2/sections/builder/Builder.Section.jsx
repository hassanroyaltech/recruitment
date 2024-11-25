import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { generateUUIDV4 } from '../../../../helpers';
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
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { Grid } from '@mui/material';
import { createPortal } from 'react-dom';
import { LayersIcon } from '../../../form-builder/icons';
import { SidebarSection } from '../sidebar/Sidebar.Section';
import Section from '../../features/Section';
import SectionsWrapper from '../../features/Section/SectionsWrapper';
import DroppableContainerWrapper from '../../features/Dragndrop/DroppableContainerWrapper';
import DraggableCard from '../../features/Dragndrop/DraggableCard';
import EmptySection from '../../features/Section/EmptySection';
import DroppableContainer from '../../features/Dragndrop/DroppableContainer';
import SortableItem from '../../features/Dragndrop/SortableItem';
import {
  DefaultFormsTypesEnum,
  FormsAssistRoleTypesEnum,
  FormsAssistTypesEnum,
  FormsMembersTypesEnum,
  FormsRolesEnum,
  NavigationSourcesEnum,
  FormsStatusesEnum,
  FormsAssignTypesEnum,
} from '../../../../enums';
import FieldItemSection from '../../features/FieldItem/FieldItem.Section';

export const BuilderSection = ({
  isFieldDisabled,
  preview,
  templateData,
  setTemplateData,
  dataSectionItems,
  setDataSectionItems,
  dataSectionContainers,
  setDataSectionContainers,
  getSelectedRoleEnumItem,
  customFields,
  fieldsItems,
  setFieldsItems,
  customSections,
  isSubmitted,
  errors,
  headerHeight,
  isOpenSideMenu,
  isLoadingPDF,
  isGlobalLoading,
  UpdateDownLoadFilesSenderHandler,
  UpdateDownLoadPDFRecipientHandler,
  setCustomSections,
  formsRolesTypes,
  getFilteredRoleTypes,
  handleAddSection,
  getFirstAvailableDefault,
  getCurrentDefaultEnumItem,
  parentTranslationPath,
  translationPath,
  blocksItems,
  setIsGlobalLoading,
  setBlocksItems,
  extractCurrencyByLang,
}) => {
  // Cloned items are using for reverting data in case of dnd cancellation
  const [clonedDataSectionItems, setClonedDataSectionItems] = useState(null);
  const [activeId, setActiveId] = useState({
    sectionId: null,
    cardId: null,
    dragId: null,
  });
  const lastOverId = useRef(null);
  const recentlyMovedToNewContainer = useRef(false);

  const getIsSortingContainer = useMemo(
    () => activeId && dataSectionContainers.includes(activeId.dragId),
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
      dataSectionItems[key].items.map((x) => x.id).includes(id),
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

  const getItemAfterRemoveUnusedLanguages = useMemo(
    () => (customOrItemField, primaryLang, secondaryLang) => {
      if (!customOrItemField || (!primaryLang && !secondaryLang))
        return customOrItemField;
      const localField = JSON.parse(JSON.stringify(customOrItemField));
      Object.entries(localField.languages).map(([key]) => {
        if (key !== primaryLang && key !== secondaryLang)
          delete localField.languages[key];
        return undefined;
      });
      return localField;
    },
    [],
  );

  const getFixedItemsAfterChangeOptionsUUIDs = useMemo(
    () => (fieldItemToConvert) => {
      if (
        !fieldItemToConvert
        || !['select', 'custom_select', 'radio', 'checkbox'].includes(
          fieldItemToConvert.type,
        )
      )
        return fieldItemToConvert;
      const localField = { ...fieldItemToConvert };
      Object.entries(localField.languages).map(([key, value], index) => {
        localField.languages[key].options = value.options.map(
          (option, optionIndex) =>
            index === 0
              ? { ...option, id: generateUUIDV4() }
              : {
                ...option,
                id: Object.values(localField.languages)[0].options[optionIndex].id,
              },
        );
        return undefined;
      });
      return localField;
    },
    [],
  );
  const memoizedSectionItems = useMemo(
    () =>
      ({ localeDataSectionItems, containerId }) =>
        localeDataSectionItems[containerId].items,
    [],
  );
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
        setClonedDataSectionItems(dataSectionItems);
      }}
      onDragOver={({ active, over }) => {
        const overId = over?.id;
        if (!overId || active.id in dataSectionItems) return;

        const overContainer = findContainer(overId);
        const activeContainer = findContainer(active.id);

        if (['logo', 'bg'].includes(dataSectionItems[overContainer]?.subModel))
          return;
        if (
          (active.id in fieldsItems
            || active.id in customFields
            || active.id in blocksItems)
          && overContainer
          && !activeContainer
        ) {
          /*eslint no-param-reassign: ["error", { "props": false }]*/
          // description in DraggbleWrapper.jsx
          const originalType = active.id;
          active.id = active.data.current.id;
          setDataSectionItems((items) => ({
            ...items,
            [overContainer]: {
              ...items[overContainer],
              items: [
                ...items[overContainer].items,
                {
                  ...(originalType in customFields
                    ? getItemAfterRemoveUnusedLanguages(customFields[originalType])
                    : getFixedItemsAfterChangeOptionsUUIDs(
                      getItemAfterRemoveUnusedLanguages(
                        fieldsItems[originalType] || blocksItems[originalType],
                      ),
                    )),
                  ...(active?.data?.current?.type !== 'inline' && {
                    fillBy: getFirstAvailableDefault().key,
                  }),
                  id: active.data.current.id,
                },
              ],
            },
          }));
        }

        if (!overContainer || !activeContainer) return;

        if (activeContainer !== overContainer)
          setDataSectionItems((items) => {
            const activeItems = items[activeContainer].items.map((x) => x.id);
            const overItems = items[overContainer].items.map((x) => x.id);
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
                items: items[activeContainer].items.filter(
                  (item) => item.id !== active.id,
                ),
              },
              [overContainer]: {
                ...items[overContainer],
                items: [
                  ...items[overContainer].items.slice(0, newIndex),
                  items[activeContainer].items[activeIndex],
                  ...items[overContainer].items.slice(
                    newIndex,
                    items[overContainer].items.length,
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
        if (
          (active.id in fieldsItems
            || active.id in customFields
            || active.id in blocksItems)
          && active.data.current.id
        )
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
                ...customSections[active.data.current.type],
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
                ...items[newSectionId],
                items: [
                  ...items[newSectionId].items,
                  {
                    ...(originalType in customFields
                      ? getItemAfterRemoveUnusedLanguages(
                        customFields[originalType],
                        templateData.primaryLang,
                        templateData.secondaryLang,
                      )
                      : getFixedItemsAfterChangeOptionsUUIDs(
                        getItemAfterRemoveUnusedLanguages(
                          fieldsItems[originalType] || blocksItems[originalType],
                          templateData.primaryLang,
                          templateData.secondaryLang,
                        ),
                      )),
                    ...(active?.data?.current?.type !== 'inline' && {
                      fillBy: getFirstAvailableDefault().key,
                    }),
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
          && !['logo', 'bg'].includes(dataSectionItems[overContainer]?.subModel)
        ) {
          const activeIndex = dataSectionItems[activeContainer].items
            .map((x) => x.id)
            .indexOf(active.id);
          const overIndex = dataSectionItems[overContainer].items
            .map((x) => x.id)
            .indexOf(overId);
          if (activeIndex !== overIndex)
            setDataSectionItems((items) => ({
              ...items,
              [overContainer]: {
                ...items[overContainer],
                items: arrayMove(items[overContainer].items, activeIndex, overIndex),
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
          height: `calc(100vh - ${headerHeight}px)`,
          overflow: 'auto',
          '--font': `${templateData.primaryFontFamily || 'inherit'}`,
          '--font-fb-secondary': `${templateData?.secondaryFontFamily || ''}`,
        }}
      >
        <SidebarSection
          preview={preview}
          errors={errors}
          templateData={templateData}
          setTemplateData={setTemplateData}
          customSections={customSections}
          fieldsItems={fieldsItems}
          customFields={customFields}
          dataSectionItems={dataSectionItems}
          setDataSectionItems={setDataSectionItems}
          setFieldsItems={setFieldsItems}
          setCustomSections={setCustomSections}
          headerHeight={headerHeight}
          isOpenSideMenu={isOpenSideMenu}
          isLoadingPDF={isLoadingPDF}
          isGlobalLoading={isGlobalLoading}
          isSubmitted={isSubmitted}
          handleAddSection={handleAddSection}
          getSelectedRoleEnumItem={getSelectedRoleEnumItem}
          getFilteredRoleTypes={getFilteredRoleTypes}
          getFirstAvailableDefault={getFirstAvailableDefault}
          getCurrentDefaultEnumItem={getCurrentDefaultEnumItem}
          UpdateDownLoadFilesSenderHandler={UpdateDownLoadFilesSenderHandler}
          UpdateDownLoadPDFRecipientHandler={UpdateDownLoadPDFRecipientHandler}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          blocksItems={blocksItems}
          setBlocksItems={setBlocksItems}
        />
        <DroppableContainerWrapper
          className="form-builder-sections-wrapper"
          element={SectionsWrapper}
          xs
          item
        >
          {!dataSectionContainers.length && <EmptySection />}
          <SortableContext items={dataSectionContainers}>
            {dataSectionContainers.map((containerId) => (
              <DroppableContainer
                key={`dataSectionContainersKey${containerId}`}
                element={Section}
                id={containerId}
                activeId={activeId}
                dataSectionItems={dataSectionItems}
                primaryLang={templateData.primaryLang}
                setActiveId={setActiveId}
                setDataSectionItems={setDataSectionItems}
                setDataSectionContainers={setDataSectionContainers}
                items={memoizedSectionItems({
                  localeDataSectionItems: dataSectionItems,
                  containerId,
                })}
                templateData={templateData}
              >
                <SortableContext
                  items={dataSectionItems[containerId].items
                    .filter((item) => item)
                    .map((v) => v.id)}
                >
                  {dataSectionItems[containerId].items.map(
                    (v, idx) =>
                      v && (
                        <SortableItem
                          key={`dataSectionItemKey${v.id}-${idx}`}
                          element={FieldItemSection}
                          preview={preview}
                          isFieldDisabled={isFieldDisabled}
                          setActiveId={setActiveId}
                          setIsGlobalLoading={setIsGlobalLoading}
                          formsRolesTypes={formsRolesTypes}
                          containerId={containerId}
                          fieldsItems={fieldsItems}
                          blocksItems={blocksItems}
                          templateData={templateData}
                          dataSectionItems={dataSectionItems}
                          setDataSectionItems={setDataSectionItems}
                          getFilteredRoleTypes={getFilteredRoleTypes}
                          parentTranslationPath={parentTranslationPath}
                          translationPath={translationPath}
                          isSorting={activeId.dragId}
                          isActive={
                            activeId.sectionId === containerId
                            && activeId.cardId === v.id
                          }
                          disabled={getIsSortingContainer}
                          errors={errors}
                          isSubmitted={isSubmitted}
                          extractCurrencyByLang={extractCurrencyByLang}
                          theme={v.theme}
                          isVisible={v.isVisible}
                          transform={v.transform}
                          transition={v.transition}
                          assign={v.assign}
                          signatureMethod={v.signatureMethod}
                          isDrawAllowed={v.isDrawAllowed}
                          isWriteAllowed={v.isWriteAllowed}
                          isUploadAllowed={v.isUploadAllowed}
                          isPhoneMaskChecked={v.isPhoneMaskChecked}
                          attachmentAllowedFileFormats={
                            v.attachmentAllowedFileFormats
                          }
                          maxFileSize={v.maxFileSize}
                          fileQuantityLimitation={v.fileQuantityLimitation}
                          phoneAllowedCountries={v.phoneAllowedCountries}
                          phoneDefaultCountry={v.phoneDefaultCountry}
                          currency={v.currency}
                          multiline={v.multiline}
                          charMin={v.charMin}
                          charMax={v.charMax}
                          rowMin={v.rowMin}
                          rowMax={v.rowMax}
                          isRequired={v.isRequired}
                          disablePastDates={v.disablePastDates}
                          disableFutureDates={v.disableFutureDates}
                          equationUnit={v.equationUnit}
                          result={v.result}
                          equation={v.equation}
                          decimalPlaces={v.decimalPlaces}
                          fillBy={v.fillBy}
                          listeners={v.listeners}
                          languages={v.languages}
                          style={v.style}
                          isDragging={v.isDragging}
                          type={v.type}
                          id={v.id}
                          showDescriptionInsteadOfTitle={
                            v.showDescriptionInsteadOfTitle
                          }
                          ratingValue={v.ratingValue}
                          showNumberOnEnglish={v.showNumberOnEnglish}
                        />
                      ),
                  )}
                </SortableContext>
              </DroppableContainer>
            ))}
          </SortableContext>
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
          {dataSectionContainers.includes(activeId.dragId) ? (
            <DroppableContainer
              element={Section}
              id={activeId.dragId}
              primaryLang={templateData.primaryLang}
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

BuilderSection.propTypes = {
  isFieldDisabled: PropTypes.func.isRequired,
  isLoadingPDF: PropTypes.bool.isRequired,
  preview: PropTypes.shape({
    isActive: PropTypes.bool.isRequired,
    role: PropTypes.oneOf(Object.values(FormsRolesEnum).map((item) => item.key)),
  }).isRequired,
  templateData: PropTypes.shape({
    isWithRecipient: PropTypes.bool,
    isWithDelay: PropTypes.bool,
    delayDuration: PropTypes.number,
    isWithDeadline: PropTypes.bool,
    deadlineDays: PropTypes.number,
    assign: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.oneOf(
          Object.values(FormsAssignTypesEnum).map((item) => item.key),
        ),
        uuid: PropTypes.string,
        name: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Object)]),
      }),
    ),
    invitedMember: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.oneOf(
          Object.values(FormsMembersTypesEnum).map((item) => item.key),
        ),
        uuid: PropTypes.string,
        name: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Object)]),
      }),
    ),
    assignToAssist: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.oneOf(
          Object.values(FormsAssistTypesEnum).map((item) => item.key),
        ),
        uuid: PropTypes.string,
        role: PropTypes.oneOf(
          Object.values(FormsAssistRoleTypesEnum).map((item) => item.key),
        ),
        name: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Object)]),
      }),
    ),
    categories: PropTypes.instanceOf(Array),
    createdAt: PropTypes.string,
    description: PropTypes.string,
    editorRole: PropTypes.oneOf(
      Object.values(FormsRolesEnum).map((item) => item.key),
    ),
    primaryFontFamily: PropTypes.string,
    isGrid: PropTypes.bool,
    // isNotShareable: PropTypes.bool,
    labelsLayout: PropTypes.oneOf(['row', 'column']),
    fieldLayout: PropTypes.oneOf(['row', 'column']),
    languages: PropTypes.instanceOf(Object),
    layout: PropTypes.oneOf(['row', 'column']),
    name: PropTypes.string,
    positionLevel: PropTypes.instanceOf(Array),
    primaryLang: PropTypes.string,
    secondaryLang: PropTypes.string,
    recipient: PropTypes.shape({
      avatar: PropTypes.string,
      name: PropTypes.string,
    }),
    sender: PropTypes.shape({
      avatar: PropTypes.string,
      name: PropTypes.string,
    }),
    source: PropTypes.oneOf(
      Object.values(NavigationSourcesEnum).map((item) => item.key),
    ),
    formStatus: PropTypes.oneOf(
      Object.values(FormsStatusesEnum).map((item) => item.key),
    ),
    tags: PropTypes.arrayOf(PropTypes.string),
    title: PropTypes.string,
    code: PropTypes.oneOf(
      Object.values(DefaultFormsTypesEnum).map((item) => item.key),
    ),
    updatedAt: PropTypes.string,
    uuid: PropTypes.string,
    formUUID: PropTypes.string,
  }).isRequired,
  setTemplateData: PropTypes.func.isRequired,
  dataSectionItems: PropTypes.instanceOf(Object).isRequired,
  setDataSectionItems: PropTypes.func.isRequired,
  dataSectionContainers: PropTypes.arrayOf(PropTypes.string).isRequired,
  setDataSectionContainers: PropTypes.func.isRequired,
  getFilteredRoleTypes: PropTypes.func.isRequired,
  getFirstAvailableDefault: PropTypes.func.isRequired,
  getCurrentDefaultEnumItem: PropTypes.func.isRequired,
  handleAddSection: PropTypes.func.isRequired,
  customFields: PropTypes.instanceOf(Object).isRequired,
  fieldsItems: PropTypes.instanceOf(Object).isRequired,
  setFieldsItems: PropTypes.func.isRequired,
  customSections: PropTypes.instanceOf(Object).isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  headerHeight: PropTypes.number.isRequired,
  isOpenSideMenu: PropTypes.bool.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  isGlobalLoading: PropTypes.arrayOf(PropTypes.string).isRequired,
  UpdateDownLoadFilesSenderHandler: PropTypes.func.isRequired,
  UpdateDownLoadPDFRecipientHandler: PropTypes.func.isRequired,
  setCustomSections: PropTypes.func.isRequired,
  getSelectedRoleEnumItem: PropTypes.func.isRequired,
  setIsGlobalLoading: PropTypes.func.isRequired,
  formsRolesTypes: PropTypes.instanceOf(Object).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  blocksItems: PropTypes.instanceOf(Object).isRequired,
  setBlocksItems: PropTypes.func.isRequired,
  extractCurrencyByLang: PropTypes.func.isRequired,
};
