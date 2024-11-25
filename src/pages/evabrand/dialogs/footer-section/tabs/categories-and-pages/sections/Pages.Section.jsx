/* eslint-disable react/no-danger */
import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@mui/material/ButtonBase';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import {
  NavigationInternalPagesEnum,
  NavigationLinkTypesEnum,
  SystemActionsEnum,
} from '../../../../../../../enums';
import './Pages.Style.scss';
import {
  PagesCandidatePagesAutocompleteControl,
  PagesInputControl,
  PagesTextEditorControl,
  PagesTypeAutocompleteControl,
} from './controls';
import { GetReorderDraggedItems, GetSectionTitle } from '../../../../../helpers';
import { CollapseComponent } from '../../../../../../../components';
// tab that handles the pages section data
export const PagesSection = ({
  sections,
  state,
  categoryItem,
  onStateChanged,
  errors,
  categoryIndex,
  isSubmitted,
  isAdvancedMode,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [activeCollapse, setActiveCollapse] = useState(0);
  const [navigationToSectionData] = useState(() =>
    sections
      .filter((item) => item.uuid && item.uuid !== state.uuid)
      .map((item) => ({
        key: item.uuid,
        value:
          GetSectionTitle(sections, item, parentTranslationPath)
          || item.section_title,
      })),
  );
  // eslint-disable-next-line max-len
  const [navigationToInternalPageData] = useState(() =>
    Object.values(NavigationInternalPagesEnum).map((item) => ({
      ...item,
      value: t(`${translationPath}${item.value}`),
    })),
  );
  const pageItemRef = useRef({
    title: '',
    link_type: null,
    link: '',
  });
  /**
   * method to add or delete page item
   * @param type => 'increment', 'decrement'
   * @param index
   */
  const pageItemActionClicked = useCallback(
    (type, index) => () => {
      const localPages
        = (categoryItem
          && categoryItem.pages && [
          ...JSON.parse(JSON.stringify(categoryItem.pages)),
        ])
        || [];
      if (type === 'increment') {
        localPages.splice(index + 1, 0, { ...pageItemRef.current });
        setActiveCollapse(localPages.length - 1);
      } else localPages.splice(index, 1);
      if (onStateChanged)
        onStateChanged({
          parentId: 'section_data',
          subParentId: 'categories',
          index: categoryIndex,
          id: 'pages',
          value: localPages,
        });
    },
    [categoryIndex, categoryItem, onStateChanged],
  );
  /**
   * @param index
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle collapse click
   */
  const onCollapseClicked = useCallback(
    (index) => () => {
      setActiveCollapse((item) => (item === index ? null : index));
    },
    [],
  );
  /**
   * @param dropEvent
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to reorder categories items
   */
  const onDragEndHandler = (dropEvent) => {
    const reorderedItems = GetReorderDraggedItems(
      dropEvent,
      (categoryItem && categoryItem.pages) || [],
    );
    if (!reorderedItems) return;
    if (onStateChanged)
      onStateChanged({
        parentId: 'section_data',
        subParentId: 'categories',
        index: categoryIndex,
        id: 'pages',
        value: reorderedItems,
      });
  };
  return (
    <div className="pages-section-wrapper tab-wrapper">
      {!categoryItem
        || !categoryItem.pages
        || (categoryItem.pages.length === 0 && (
          <div className="d-flex-v-center-h-end w-100 mb-3">
            <ButtonBase
              className="btns theme-solid"
              onClick={pageItemActionClicked('increment', 0)}
            >
              <span className="fas fa-plus" />
              <span className="px-1">{t(`${translationPath}add-subcategory`)}</span>
            </ButtonBase>
          </div>
        ))}
      <DragDropContext onDragEnd={onDragEndHandler}>
        <Droppable droppableId={`pagesManagementDroppableId${categoryIndex + 1}`}>
          {(droppableProvided) => (
            <div
              className="pages-items-wrapper"
              {...droppableProvided.droppableProps}
              ref={droppableProvided.innerRef}
            >
              {categoryItem
                && categoryItem.pages
                && categoryItem.pages.map((item, index, items) => (
                  <Draggable
                    key={`pagesItemKey${categoryIndex + 1}-${index + 1}`}
                    draggableId={`pagesItemId${categoryIndex + 1}-${index + 1}`}
                    index={index}
                    isDragDisabled={items.length < 2}
                  >
                    {(provided, snapshot) => (
                      <div
                        className={`pages-item-wrapper${
                          (isAdvancedMode && ' is-advanced-mode') || ''
                        }${(snapshot.isDragging && ' is-dragging') || ''}`}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                      >
                        <div className="item-contents-wrapper">
                          {items.length > 1 && (
                            <div className="pages-actions-wrapper">
                              <div
                                className="dragging-btn"
                                {...provided.dragHandleProps}
                              >
                                <span className="fas fa-ellipsis-v" />
                                <span className="fas fa-ellipsis-v" />
                              </div>
                            </div>
                          )}
                          <div className="header-and-body-wrapper">
                            <ButtonBase
                              className={`header-menu-wrapper${
                                (activeCollapse === index && ' is-open-collapse')
                                || ''
                              }`}
                              onClick={onCollapseClicked(index)}
                              disabled={!isAdvancedMode}
                            >
                              {(!item.title && (
                                <span className="header-text-x2">
                                  <span>{t(`${translationPath}subcategory`)}</span>
                                  <span className="px-1">{index + 1}</span>
                                </span>
                              ))
                                || (isAdvancedMode && (
                                  <span
                                    dangerouslySetInnerHTML={{ __html: item.title }}
                                  />
                                )) || (
                                <span className="header-text-x2">
                                  {item.title}
                                </span>
                              )}
                            </ButtonBase>
                            <CollapseComponent
                              isOpen={activeCollapse === index || !isAdvancedMode}
                              component={
                                <div className="pages-contents-wrapper">
                                  <div className="pages-controls-wrapper">
                                    {!isAdvancedMode && (
                                      <PagesInputControl
                                        idRef="titlePagesInputRef"
                                        pages={items}
                                        editValue={item.title}
                                        onValueChanged={onStateChanged}
                                        isSubmitted={isSubmitted}
                                        stateKey="title"
                                        index={index}
                                        parentId="section_data"
                                        categoryIndex={categoryIndex}
                                        subSubParentId="pages"
                                        subParentId="categories"
                                        errors={errors}
                                        title="title"
                                        placeholder="title"
                                        parentTranslationPath={parentTranslationPath}
                                        translationPath={translationPath}
                                      />
                                    )}
                                    {isAdvancedMode && (
                                      <PagesTextEditorControl
                                        pages={items}
                                        editValue={item.title}
                                        onValueChanged={onStateChanged}
                                        isSubmitted={isSubmitted}
                                        stateKey="title"
                                        index={index}
                                        parentId="section_data"
                                        categoryIndex={categoryIndex}
                                        subSubParentId="pages"
                                        subParentId="categories"
                                        errors={errors}
                                        title="title"
                                        parentTranslationPath={parentTranslationPath}
                                        translationPath={translationPath}
                                      />
                                    )}
                                    <PagesTypeAutocompleteControl
                                      pages={items}
                                      editValue={item.link_type}
                                      onValueChanged={onStateChanged}
                                      isSubmitted={isSubmitted}
                                      stateKey="link_type"
                                      linkStateKey="link"
                                      index={index}
                                      parentId="section_data"
                                      categoryIndex={categoryIndex}
                                      subSubParentId="pages"
                                      subParentId="categories"
                                      errors={errors}
                                      title="link-type"
                                      placeholder="select-link-type"
                                      parentTranslationPath={parentTranslationPath}
                                      translationPath={translationPath}
                                    />
                                    {item.link_type
                                      === NavigationLinkTypesEnum.HtmlId.key && (
                                      <PagesCandidatePagesAutocompleteControl
                                        pages={items}
                                        data={navigationToSectionData}
                                        editValue={item.link}
                                        onValueChanged={onStateChanged}
                                        isSubmitted={isSubmitted}
                                        stateKey="link"
                                        index={index}
                                        parentId="section_data"
                                        categoryIndex={categoryIndex}
                                        subSubParentId="pages"
                                        subParentId="categories"
                                        errors={errors}
                                        title="section"
                                        placeholder="select-section"
                                        parentTranslationPath={parentTranslationPath}
                                        translationPath={translationPath}
                                      />
                                    )}
                                    {item.link_type
                                      === NavigationLinkTypesEnum.InternalPage.key && (
                                      <PagesCandidatePagesAutocompleteControl
                                        pages={items}
                                        data={navigationToInternalPageData}
                                        editValue={item.link}
                                        onValueChanged={onStateChanged}
                                        isSubmitted={isSubmitted}
                                        stateKey="link"
                                        index={index}
                                        parentId="section_data"
                                        subParentId="categories"
                                        categoryIndex={categoryIndex}
                                        subSubParentId="pages"
                                        errors={errors}
                                        title="internal-page"
                                        placeholder="select-internal-page"
                                        parentTranslationPath={parentTranslationPath}
                                        translationPath={translationPath}
                                      />
                                    )}
                                    {item.link_type
                                      === NavigationLinkTypesEnum.Hyperlink.key && (
                                      <PagesInputControl
                                        pages={items}
                                        editValue={item.link}
                                        onValueChanged={onStateChanged}
                                        isSubmitted={isSubmitted}
                                        stateKey="link"
                                        index={index}
                                        parentId="section_data"
                                        categoryIndex={categoryIndex}
                                        subSubParentId="pages"
                                        subParentId="categories"
                                        errors={errors}
                                        title="link"
                                        placeholder="link-example"
                                        parentTranslationPath={parentTranslationPath}
                                        translationPath={translationPath}
                                      />
                                    )}
                                  </div>
                                  <div className="pages-actions-wrapper">
                                    <ButtonBase
                                      className="btns theme-shadow c-danger miw-32px ml-2-reversed mr-0-reversed"
                                      onClick={pageItemActionClicked(
                                        'decrement',
                                        index,
                                      )}
                                    >
                                      <span
                                        className={SystemActionsEnum.delete.icon}
                                      />
                                    </ButtonBase>
                                  </div>
                                </div>
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {categoryItem && categoryItem.pages && categoryItem.pages.length > 0 && (
        <div className="d-flex-v-center-h-end w-100 mb-3">
          <ButtonBase
            className="btns theme-solid miw-auto"
            onClick={pageItemActionClicked('increment', categoryItem.pages.length)}
          >
            <span className="fas fa-plus" />
            <span className="px-1">{t(`${translationPath}add-subcategory`)}</span>
          </ButtonBase>
        </div>
      )}
    </div>
  );
};

PagesSection.propTypes = {
  sections: PropTypes.instanceOf(Array).isRequired,
  state: PropTypes.instanceOf(Object).isRequired,
  categoryItem: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  isAdvancedMode: PropTypes.bool.isRequired,
  categoryIndex: PropTypes.number.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};
PagesSection.defaultProps = {
  translationPath: 'PagesSection.',
};
