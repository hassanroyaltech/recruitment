/* eslint-disable react/no-danger */
import React, { useCallback, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@mui/material/ButtonBase';
import { useTranslation } from 'react-i18next';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { NavigationTextEditorControl } from './controls';
import {
  NavigationInternalPagesEnum,
  NavigationLinkTypesEnum,
  SystemActionsEnum,
} from '../../../../../../enums';
import './NavigationMenu.Style.scss';
import { CollapseComponent } from '../../../../../../components';
import { GetReorderDraggedItems, GetSectionTitle } from '../../../../helpers';
import {
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../../../setups/shared';
// tab that handles the navigation menu data
export const NavigationMenuTab = ({
  sections,
  state,
  onStateChanged,
  errors,
  isSubmitted,
  isAdvancedMode,
  parentTranslationPath,
  translationPath,
  language,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [activeCollapse, setActiveCollapse] = useState(0);
  const [navigationToSectionData] = useState(() =>
    sections
      .filter((item) => item.uuid && item.uuid !== state.uuid)
      .map((item) => ({
        key: item.uuid,
        value:
          item.section_title
          || GetSectionTitle(sections, item, parentTranslationPath),
      })),
  );
  const [navigationLinkTypes] = useState(() =>
    Object.values(NavigationLinkTypesEnum).map((item) => ({
      ...item,
      value: t(`${translationPath}${item.value}`),
    })),
  );
  // eslint-disable-next-line max-len
  const [navigationToInternalPageData] = useState(() =>
    Object.values(NavigationInternalPagesEnum).map((item) => ({
      ...item,
      value: t(`${translationPath}${item.value}`),
    })),
  );
  const menuItemRef = useRef({
    title: '',
    type: null,
    link: null,
  });
  // function to add the first navigation item
  const addNavigationMenuClicked = useCallback(() => {
    if (onStateChanged)
      onStateChanged({
        parentId: 'section_data',
        id: 'nav_items',
        value: [{ ...menuItemRef.current }],
      });
  }, [onStateChanged]);
  /**
   * method to add or delete menu item
   * @param type => 'increment', 'decrement'
   * @param index
   */
  const navigationMenuActionClicked = useCallback(
    (
      type,
      index,
      items,
      {
        id,
        parentId,
        subSubParentIndex,
        subSubParentId,
        subParentIndex,
        subParentId,
      },
    ) =>
      () => {
        const localNavbar = (items && [...JSON.parse(JSON.stringify(items))]) || [];
        if (type === 'increment') {
          localNavbar.splice(index + 1, 0, { ...menuItemRef.current });
          setActiveCollapse(localNavbar.length - 1);
        } else if (type === 'add-sub-item')
          localNavbar[index].nav_items = [
            ...(localNavbar[index]?.nav_items || []),
            {
              title: '',
              type: null,
              link: '',
            },
          ];
        else localNavbar.splice(index, 1);
        if (onStateChanged)
          onStateChanged({
            subParentId,
            subParentIndex,
            subSubParentId,
            subSubParentIndex,
            parentId,
            id,
            value: [...localNavbar],
          });
      },
    [onStateChanged],
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
   * @Description this method is to reorder navigation menu items
   */
  const onDragEndHandler = (dropEvent) => {
    const reorderedItems = GetReorderDraggedItems(
      dropEvent,
      (state && state.section_data && state.section_data.nav_items) || [],
    );
    if (!reorderedItems) return;
    if (onStateChanged)
      onStateChanged({
        parentId: 'section_data',
        id: 'nav_items',
        value: [...reorderedItems],
      });
  };
  /**
   * @param key
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get current internal page enum by key
   * @return oneOf(NavigationInternalPagesEnum)
   */
  const getCurrentInternalPageEnum = useMemo(
    () => (key) =>
      Object.values(NavigationInternalPagesEnum).find((el) => el.key === key),
    [],
  );
  /**
   * @param item
   * @param itemIndex
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to disable the menu item if the min is
   * exist and the index is bigger than it
   * @return boolean
   */
  const isNotEditableOrDisabled = useMemo(
    () => (item, itemIndex, items) =>
      item.type === NavigationLinkTypesEnum.InternalPage.key
      && item.link
      && getCurrentInternalPageEnum(item.link)
      && getCurrentInternalPageEnum(item.link).min
      && items.filter((element, index) => {
        const currentLink = getCurrentInternalPageEnum(element.link);
        return (
          element.link === item.link
          && currentLink
          && currentLink.min
          && index <= itemIndex
        );
      }).length <= getCurrentInternalPageEnum(item.link).min,
    [getCurrentInternalPageEnum],
  );
  return (
    <div className="navigation-menu-tab-wrapper tab-wrapper">
      {!state
        || !state.section_data
        || !state.section_data.nav_items
        || (state.section_data.nav_items.length === 0 && (
          <div className="d-flex-v-center-h-end w-100">
            <ButtonBase
              className="btns theme-solid"
              onClick={addNavigationMenuClicked}
            >
              <span>{t(`${translationPath}add-navigation-menu`)}</span>
            </ButtonBase>
          </div>
        ))}
      <DragDropContext onDragEnd={onDragEndHandler}>
        <Droppable droppableId="navigationMenuManagementDroppableId">
          {(droppableProvided) => (
            <div
              className="navigation-menu-items-wrapper"
              {...droppableProvided.droppableProps}
              ref={droppableProvided.innerRef}
            >
              {state
                && state.section_data
                && state.section_data.nav_items.map((item, index, items) => (
                  <Draggable
                    key={`navigationMenuItemKey${index + 1}`}
                    draggableId={`navigationMenuItemId${index + 1}`}
                    index={index}
                    isDragDisabled={items.length < 2}
                  >
                    {(provided, snapshot) => (
                      <div
                        className={`navigation-menu-item-wrapper${
                          (isAdvancedMode && ' is-advanced-mode') || ''
                        }${(snapshot.isDragging && ' is-dragging') || ''}`}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                      >
                        <div className="item-contents-wrapper">
                          {items.length > 1 && (
                            <div className="navigation-menu-actions-wrapper">
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
                                  <span>
                                    {t(`${translationPath}navigation-item`)}
                                  </span>
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
                                <div className="d-flex-column">
                                  <div className="d-flex-v-center-h-between">
                                    <div className="navigation-menu-controls-wrapper">
                                      {!isAdvancedMode && (
                                        <SharedInputControl
                                          isQuarterWidth
                                          idRef="titleInputRef"
                                          editValue={item.title}
                                          onValueChanged={(e) => {
                                            onStateChanged(e);
                                          }}
                                          isSubmitted={isSubmitted}
                                          stateKey="title"
                                          subParentIndex={index}
                                          parentId="section_data"
                                          subParentId="nav_items"
                                          errors={errors}
                                          title="title"
                                          placeholder="title"
                                          parentTranslationPath={
                                            parentTranslationPath
                                          }
                                          translationPath={translationPath}
                                          wrapperClasses={
                                            (language.code === 'ar'
                                              && ' rtl-direction')
                                            || ''
                                          }
                                        />
                                      )}
                                      {isAdvancedMode && (
                                        <NavigationTextEditorControl
                                          wrapperClasses={
                                            (language.code === 'ar'
                                              && ' rtl-direction')
                                            || ''
                                          }
                                          // isQuarterWidth
                                          editValue={item.title}
                                          onValueChanged={onStateChanged}
                                          isSubmitted={isSubmitted}
                                          stateKey="title"
                                          subParentIndex={index}
                                          parentId="section_data"
                                          subParentId="nav_items"
                                          errors={errors}
                                          title="title"
                                          parentTranslationPath={
                                            parentTranslationPath
                                          }
                                          translationPath={translationPath}
                                          idRef={`section_data-nav_items-${index}-title`}
                                        />
                                      )}
                                      <SharedAutocompleteControl
                                        isQuarterWidth
                                        editValue={item.type}
                                        onValueChanged={(e) => {
                                          onStateChanged({
                                            ...e,
                                            id: 'link',
                                            value: null,
                                          });
                                          onStateChanged(e);
                                        }}
                                        isSubmitted={isSubmitted}
                                        stateKey="type"
                                        subParentIndex={index}
                                        parentId="section_data"
                                        subParentId="nav_items"
                                        errors={errors}
                                        title="link-type"
                                        placeholder="select-link-type"
                                        isDisabled={isNotEditableOrDisabled(
                                          item,
                                          index,
                                          state.section_data.nav_items,
                                        )}
                                        parentTranslationPath={parentTranslationPath}
                                        translationPath={translationPath}
                                        initValues={navigationLinkTypes}
                                      />
                                      {item.type
                                        === NavigationLinkTypesEnum.HtmlId.key && (
                                        <SharedAutocompleteControl
                                          isQuarterWidth
                                          initValues={navigationToSectionData}
                                          editValue={item.link}
                                          onValueChanged={onStateChanged}
                                          isSubmitted={isSubmitted}
                                          stateKey="link"
                                          subParentIndex={index}
                                          parentId="section_data"
                                          subParentId="nav_items"
                                          errors={errors}
                                          title="section"
                                          placeholder="select-section"
                                          parentTranslationPath={
                                            parentTranslationPath
                                          }
                                          translationPath={translationPath}
                                        />
                                      )}
                                      {item.type
                                        === NavigationLinkTypesEnum.InternalPage.key && (
                                        <SharedAutocompleteControl
                                          isQuarterWidth
                                          initValues={navigationToInternalPageData}
                                          editValue={item.link}
                                          onValueChanged={onStateChanged}
                                          isSubmitted={isSubmitted}
                                          stateKey="link"
                                          subParentIndex={index}
                                          parentId="section_data"
                                          subParentId="nav_items"
                                          errors={errors}
                                          title="internal-page"
                                          placeholder="select-internal-page"
                                          isDisabled={isNotEditableOrDisabled(
                                            item,
                                            index,
                                            state.section_data.nav_items,
                                          )}
                                          parentTranslationPath={
                                            parentTranslationPath
                                          }
                                          translationPath={translationPath}
                                        />
                                      )}
                                      {item.type
                                        === NavigationLinkTypesEnum.Hyperlink.key && (
                                        <SharedInputControl
                                          isQuarterWidth
                                          editValue={item.link}
                                          onValueChanged={onStateChanged}
                                          isSubmitted={isSubmitted}
                                          stateKey="link"
                                          subParentIndex={index}
                                          parentId="section_data"
                                          subParentId="nav_items"
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
                                    <div className="navigation-menu-actions-wrapper">
                                      {items.length > 1
                                        && !isNotEditableOrDisabled(
                                          item,
                                          index,
                                          state.section_data.nav_items,
                                        ) && (
                                        <div>
                                          <ButtonBase
                                            className="btns theme-shadow c-danger miw-32px ml-2-reversed mr-0-reversed"
                                            onClick={navigationMenuActionClicked(
                                              'decrement',
                                              index,
                                              state.section_data.nav_items,
                                              {
                                                parentId: 'section_data',
                                                id: 'nav_items',
                                              },
                                            )}
                                          >
                                            <span
                                              className={
                                                SystemActionsEnum.delete.icon
                                              }
                                            />
                                          </ButtonBase>
                                        </div>
                                      )}
                                      <ButtonBase
                                        className="btns theme-shadow miw-32px ml-2-reversed mr-0-reversed"
                                        onClick={navigationMenuActionClicked(
                                          'add-sub-item',
                                          index,
                                          state.section_data.nav_items,
                                          {
                                            parentId: 'section_data',
                                            id: 'nav_items',
                                          },
                                        )}
                                      >
                                        <span className="fas fa-plus" />
                                      </ButtonBase>
                                    </div>
                                  </div>
                                  {!!item?.nav_items?.length && (
                                    <div className="d-inline-flex-column-center-v">
                                      {item?.nav_items.map(
                                        (sub_nav_item, sub_nav_item_idx) => (
                                          <div
                                            key={`${sub_nav_item_idx}-subitem-${sub_nav_item.link}`}
                                            className="w-100 d-flex-v-center-h-between"
                                          >
                                            <div className="navigation-menu-controls-wrapper">
                                              {!isAdvancedMode && (
                                                <SharedInputControl
                                                  isQuarterWidth
                                                  idRef="titleInputRef"
                                                  editValue={sub_nav_item.title}
                                                  onValueChanged={onStateChanged}
                                                  isSubmitted={isSubmitted}
                                                  stateKey="title"
                                                  parentId="section_data"
                                                  subParentId="nav_items"
                                                  subParentIndex={index}
                                                  subSubParentId="nav_items"
                                                  subSubParentIndex={
                                                    sub_nav_item_idx
                                                  }
                                                  errors={errors}
                                                  title="title"
                                                  placeholder="title"
                                                  parentTranslationPath={
                                                    parentTranslationPath
                                                  }
                                                  translationPath={translationPath}
                                                  wrapperClasses={
                                                    (language.code === 'ar'
                                                      && ' rtl-direction')
                                                    || ''
                                                  }
                                                />
                                              )}
                                              {isAdvancedMode && (
                                                <NavigationTextEditorControl
                                                  // isQuarterWidth
                                                  isQuarterWidth
                                                  idRef={`titleInputRef${index}${sub_nav_item_idx}`}
                                                  editValue={sub_nav_item.title}
                                                  onValueChanged={(e) => {
                                                    onStateChanged({
                                                      id: 'title',
                                                      parentId: 'section_data',
                                                      parentIndex: undefined,
                                                      subParentId: 'nav_items',
                                                      subParentIndex: index,
                                                      subSubParentId: 'nav_items',
                                                      subSubParentIndex:
                                                        sub_nav_item_idx,
                                                      value: e?.value || null,
                                                    });
                                                  }}
                                                  isSubmitted={isSubmitted}
                                                  stateKey="title"
                                                  parentId="section_data"
                                                  subParentId="nav_items"
                                                  subParentIndex={index}
                                                  subSubParentId="nav_items"
                                                  subSubParentIndex={
                                                    sub_nav_item_idx
                                                  }
                                                  errors={errors}
                                                  title="title"
                                                  placeholder="title"
                                                  parentTranslationPath={
                                                    parentTranslationPath
                                                  }
                                                  translationPath={translationPath}
                                                  wrapperClasses={
                                                    (language.code === 'ar'
                                                      && ' rtl-direction')
                                                    || ''
                                                  }
                                                />
                                              )}
                                              <SharedAutocompleteControl
                                                isQuarterWidth
                                                editValue={sub_nav_item.type}
                                                onValueChanged={(e) => {
                                                  onStateChanged({
                                                    id: 'link',
                                                    parentId: 'section_data',
                                                    subParentId: 'nav_items',
                                                    subParentIndex: index,
                                                    subSubParentId: 'nav_items',
                                                    subSubParentIndex:
                                                      sub_nav_item_idx,
                                                    value: null,
                                                  });
                                                  onStateChanged(e);
                                                }}
                                                isSubmitted={isSubmitted}
                                                stateKey="type"
                                                parentId="section_data"
                                                subParentId="nav_items"
                                                subParentIndex={index}
                                                subSubParentId="nav_items"
                                                subSubParentIndex={sub_nav_item_idx}
                                                errors={errors}
                                                title="link-type"
                                                placeholder="select-link-type"
                                                isDisabled={isNotEditableOrDisabled(
                                                  sub_nav_item,
                                                  index,
                                                  item?.nav_items,
                                                )}
                                                parentTranslationPath={
                                                  parentTranslationPath
                                                }
                                                translationPath={translationPath}
                                                initValues={navigationLinkTypes}
                                              />
                                              {sub_nav_item.type
                                                === NavigationLinkTypesEnum.HtmlId
                                                  .key && (
                                                <SharedAutocompleteControl
                                                  isQuarterWidth
                                                  initValues={
                                                    navigationToSectionData
                                                  }
                                                  editValue={sub_nav_item.link}
                                                  onValueChanged={onStateChanged}
                                                  isSubmitted={isSubmitted}
                                                  stateKey="link"
                                                  parentId="section_data"
                                                  subParentId="nav_items"
                                                  subParentIndex={index}
                                                  subSubParentId="nav_items"
                                                  subSubParentIndex={
                                                    sub_nav_item_idx
                                                  }
                                                  errors={errors}
                                                  title="section"
                                                  placeholder="select-section"
                                                  parentTranslationPath={
                                                    parentTranslationPath
                                                  }
                                                  translationPath={translationPath}
                                                />
                                              )}
                                              {sub_nav_item.type
                                                === NavigationLinkTypesEnum.InternalPage
                                                  .key && (
                                                <SharedAutocompleteControl
                                                  isQuarterWidth
                                                  initValues={
                                                    navigationToInternalPageData
                                                  }
                                                  editValue={sub_nav_item.link}
                                                  onValueChanged={onStateChanged}
                                                  isSubmitted={isSubmitted}
                                                  stateKey="link"
                                                  parentId="section_data"
                                                  subParentId="nav_items"
                                                  subParentIndex={index}
                                                  subSubParentId="nav_items"
                                                  subSubParentIndex={
                                                    sub_nav_item_idx
                                                  }
                                                  errors={errors}
                                                  title="internal-page"
                                                  placeholder="select-internal-page"
                                                  isDisabled={isNotEditableOrDisabled(
                                                    sub_nav_item,
                                                    index,
                                                    item?.nav_items,
                                                  )}
                                                  parentTranslationPath={
                                                    parentTranslationPath
                                                  }
                                                  translationPath={translationPath}
                                                />
                                              )}
                                              {sub_nav_item.type
                                                === NavigationLinkTypesEnum.Hyperlink
                                                  .key && (
                                                <SharedInputControl
                                                  isQuarterWidth
                                                  editValue={sub_nav_item.link}
                                                  onValueChanged={onStateChanged}
                                                  isSubmitted={isSubmitted}
                                                  stateKey="link"
                                                  parentId="section_data"
                                                  subParentId="nav_items"
                                                  subParentIndex={index}
                                                  subSubParentId="nav_items"
                                                  subSubParentIndex={
                                                    sub_nav_item_idx
                                                  }
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
                                            <div className="navigation-menu-actions-wrapper">
                                              <div>
                                                <ButtonBase
                                                  className="btns theme-shadow c-danger miw-32px ml-2-reversed mr-0-reversed"
                                                  onClick={navigationMenuActionClicked(
                                                    'decrement',
                                                    sub_nav_item_idx,
                                                    item?.nav_items,
                                                    {
                                                      parentId: 'section_data',
                                                      subParentId: 'nav_items',
                                                      subParentIndex: index,
                                                      id: 'nav_items',
                                                    },
                                                  )}
                                                >
                                                  <span
                                                    className={
                                                      SystemActionsEnum.delete.icon
                                                    }
                                                  />
                                                </ButtonBase>
                                              </div>
                                            </div>
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  )}
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
      {state
        && state.section_data
        && state.section_data.nav_items
        && state.section_data.nav_items.length > 0 && (
        <div className="d-flex-v-center-h-end w-100">
          <ButtonBase
            className="btns theme-solid miw-auto"
            onClick={navigationMenuActionClicked(
              'increment',
              state.section_data.nav_items.length,
              state.section_data.nav_items,
              {
                parentId: 'section_data',
                id: 'nav_items',
              },
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

NavigationMenuTab.propTypes = {
  sections: PropTypes.instanceOf(Array).isRequired,
  state: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  isAdvancedMode: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
  language: PropTypes.shape({
    code: PropTypes.string,
  }),
};
NavigationMenuTab.defaultProps = {
  translationPath: 'NavigationMenuTab.',
};
