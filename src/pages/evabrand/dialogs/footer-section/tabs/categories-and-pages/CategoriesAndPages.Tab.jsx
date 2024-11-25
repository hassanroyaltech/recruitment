/* eslint-disable */
import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@mui/material/ButtonBase';
import { useTranslation } from 'react-i18next';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import {
  NavigationInternalPagesEnum,
  NavigationLinkTypesEnum,
  SystemActionsEnum,
} from '../../../../../../enums';
import './CategoriesAndPages.Style.scss';
import {
  CategoriesCandidatePagesAutocompleteControl,
  CategoriesInputControl,
  CategoriesTextEditorControl,
  CategoriesTypeAutocompleteControl,
} from './controls';
import { PagesSection } from './sections';
import { GetReorderDraggedItems, GetSectionTitle } from '../../../../helpers';
import { CollapseComponent } from '../../../../../../components';
// tab that handles the categories and pages tab data
export const CategoriesAndPagesTab = ({
  sections,
  state,
  onStateChanged,
  errors,
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
          GetSectionTitle(sections, item, parentTranslationPath) ||
          item.section_title,
      })),
  );
  // eslint-disable-next-line max-len
  const [navigationToInternalPageData] = useState(() =>
    Object.values(NavigationInternalPagesEnum).map((item) => ({
      ...item,
      value: t(`${translationPath}${item.value}`),
    })),
  );
  const categoryItemRef = useRef({
    title: '',
    link_type: null,
    link: null,
    pages: [],
  });
  /**
   * method to add or delete category item
   * @param type => 'increment', 'decrement'
   * @param index
   */
  const categoryItemActionClicked = useCallback(
    (type, index) => () => {
      const localCategories =
        (state &&
          state.section_data &&
          state.section_data.categories && [
            ...JSON.parse(JSON.stringify(state.section_data.categories)),
          ]) ||
        [];
      if (type === 'increment') {
        localCategories.splice(index + 1, 0, { ...categoryItemRef.current });
        setActiveCollapse(localCategories.length - 1);
      } else localCategories.splice(index, 1);
      if (onStateChanged)
        onStateChanged({
          parentId: 'section_data',
          id: 'categories',
          value: [...localCategories],
        });
    },
    [onStateChanged, state],
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
      (state && state.section_data && state.section_data.categories) || [],
    );
    if (!reorderedItems) return;
    if (onStateChanged)
      onStateChanged({
        parentId: 'section_data',
        id: 'categories',
        value: [...reorderedItems],
      });
  };

  return (
    <div className="categories-and-pages-tab-wrapper tab-wrapper">
      {!state ||
        !state.section_data ||
        !state.section_data.categories ||
        (state.section_data.categories.length === 0 && (
          <div className="d-flex-v-center-h-end w-100">
            <ButtonBase
              className="btns theme-solid"
              onClick={categoryItemActionClicked('increment', 0)}
            >
              <span className="fas fa-plus" />
              <span className="px-1">{t(`${translationPath}add-category`)}</span>
            </ButtonBase>
          </div>
        ))}
      <DragDropContext onDragEnd={onDragEndHandler}>
        <Droppable droppableId="categoriesManagementDroppableId">
          {(droppableProvided) => (
            <div
              className="categories-and-pages-items-wrapper"
              {...droppableProvided.droppableProps}
              ref={droppableProvided.innerRef}
            >
              {state &&
                state.section_data &&
                state.section_data.categories &&
                state.section_data.categories.map((item, index, items) => (
                  <Draggable
                    key={`categoriesAndPagesItemKey${index + 1}`}
                    draggableId={`categoriesAndPagesItemId${index + 1}`}
                    index={index}
                    isDragDisabled={items.length < 2}
                  >
                    {(provided, snapshot) => (
                      <div
                        className={`categories-and-pages-item-wrapper${
                          (isAdvancedMode && ' is-advanced-mode') || ''
                        }${(snapshot.isDragging && ' is-dragging') || ''}`}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                      >
                        <div className="item-contents-wrapper">
                          {items.length > 1 && (
                            <div className="categories-and-pages-actions-wrapper">
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
                                (activeCollapse === index && ' is-open-collapse') ||
                                ''
                              }`}
                              onClick={onCollapseClicked(index)}
                              disabled={!isAdvancedMode}
                            >
                              {(!item.title && (
                                <span className="header-text-x2">
                                  <span>{t(`${translationPath}category`)}</span>
                                  <span className="px-1">{index + 1}</span>
                                </span>
                              )) ||
                                (isAdvancedMode && (
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
                                <>
                                  <div className="categories-and-pages-contents-wrapper">
                                    <div className="categories-and-pages-controls-wrapper">
                                      {!isAdvancedMode && (
                                        <CategoriesInputControl
                                          idRef="CategoriesInputTitleControlRef"
                                          editValue={item.title}
                                          onValueChanged={onStateChanged}
                                          isSubmitted={isSubmitted}
                                          stateKey="title"
                                          index={index}
                                          parentId="section_data"
                                          subParentId="categories"
                                          errors={errors}
                                          title="title"
                                          placeholder="title"
                                          parentTranslationPath={
                                            parentTranslationPath
                                          }
                                          translationPath={translationPath}
                                        />
                                      )}
                                      {isAdvancedMode && (
                                        <CategoriesTextEditorControl
                                          editValue={item.title}
                                          onValueChanged={onStateChanged}
                                          isSubmitted={isSubmitted}
                                          stateKey="title"
                                          index={index}
                                          parentId="section_data"
                                          subParentId="categories"
                                          errors={errors}
                                          title="title"
                                          parentTranslationPath={
                                            parentTranslationPath
                                          }
                                          translationPath={translationPath}
                                        />
                                      )}
                                      <CategoriesTypeAutocompleteControl
                                        categories={items}
                                        editValue={item.link_type}
                                        onValueChanged={onStateChanged}
                                        isSubmitted={isSubmitted}
                                        stateKey="link_type"
                                        linkStateKey="link"
                                        index={index}
                                        parentId="section_data"
                                        subParentId="categories"
                                        errors={errors}
                                        title="link-type"
                                        placeholder="select-link-type"
                                        parentTranslationPath={parentTranslationPath}
                                        translationPath={translationPath}
                                      />
                                      {item.link_type ===
                                        NavigationLinkTypesEnum.HtmlId.key && (
                                        <CategoriesCandidatePagesAutocompleteControl
                                          data={navigationToSectionData}
                                          editValue={item.link}
                                          onValueChanged={onStateChanged}
                                          isSubmitted={isSubmitted}
                                          stateKey="link"
                                          index={index}
                                          parentId="section_data"
                                          subParentId="categories"
                                          errors={errors}
                                          title="section"
                                          placeholder="select-section"
                                          parentTranslationPath={
                                            parentTranslationPath
                                          }
                                          translationPath={translationPath}
                                        />
                                      )}
                                      {item.link_type ===
                                        NavigationLinkTypesEnum.InternalPage.key && (
                                        <CategoriesCandidatePagesAutocompleteControl
                                          data={navigationToInternalPageData}
                                          editValue={item.link}
                                          onValueChanged={onStateChanged}
                                          isSubmitted={isSubmitted}
                                          stateKey="link"
                                          index={index}
                                          parentId="section_data"
                                          subParentId="categories"
                                          errors={errors}
                                          title="internal-page"
                                          placeholder="select-internal-page"
                                          parentTranslationPath={
                                            parentTranslationPath
                                          }
                                          translationPath={translationPath}
                                        />
                                      )}
                                      {item.link_type ===
                                        NavigationLinkTypesEnum.Hyperlink.key && (
                                        <CategoriesInputControl
                                          editValue={item.link}
                                          onValueChanged={onStateChanged}
                                          isSubmitted={isSubmitted}
                                          stateKey="link"
                                          index={index}
                                          parentId="section_data"
                                          subParentId="categories"
                                          errors={errors}
                                          title="link"
                                          placeholder="link-example"
                                          parentTranslationPath={
                                            parentTranslationPath
                                          }
                                          translationPath={translationPath}
                                        />
                                      )}
                                    </div>
                                    {items.length > 1 && (
                                      <div className="categories-and-pages-actions-wrapper">
                                        <ButtonBase
                                          className="btns theme-shadow c-danger miw-32px ml-2-reversed mr-0-reversed"
                                          onClick={categoryItemActionClicked(
                                            'decrement',
                                            index,
                                          )}
                                        >
                                          <span
                                            className={SystemActionsEnum.delete.icon}
                                          />
                                        </ButtonBase>
                                      </div>
                                    )}
                                  </div>
                                  <PagesSection
                                    categoryItem={item}
                                    sections={sections}
                                    state={state}
                                    onStateChanged={onStateChanged}
                                    errors={errors}
                                    isSubmitted={isSubmitted}
                                    isAdvancedMode={isAdvancedMode}
                                    categoryIndex={index}
                                    parentTranslationPath={parentTranslationPath}
                                    translationPath={translationPath}
                                  />
                                </>
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
      {state &&
        state.section_data &&
        state.section_data.categories &&
        state.section_data.categories.length > 0 && (
          <div className="d-flex-v-center-h-end w-100">
            <ButtonBase
              className="btns theme-solid miw-auto"
              onClick={categoryItemActionClicked(
                'increment',
                state.section_data.categories.length,
              )}
            >
              <span className="fas fa-plus" />
              <span className="px-1">{t('Shared:add')}</span>
            </ButtonBase>
          </div>
        )}
    </div>
  );
};

CategoriesAndPagesTab.propTypes = {
  sections: PropTypes.instanceOf(Array).isRequired,
  state: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  isAdvancedMode: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};
CategoriesAndPagesTab.defaultProps = {
  translationPath: 'CategoriesAndPagesTab.',
};
