/* eslint-disable no-param-reassign */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@mui/material/ButtonBase';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import i18next from 'i18next';
import {
  ConfirmDeleteDialog,
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../../shared';
// import { SwitchComponent } from '../../../../../../components';
import { numericAndAlphabeticalAndSpecialExpression } from '../../../../../../utils';
import './HierarchicalSetups.Style.scss';
import { ParentAddDialog } from '../../dialogs';
import { GetAllSetupsNewOrganizationGroup } from '../../../../../../services';

const HierarchicalSetupsTab = ({
  state,
  onStateChanged,
  onIsChangedChanged,
  onRemoveItemClicked,
  isChanged,
  languages,
  getNotSelectedLanguage,
  removeLanguageHandler,
  addLanguageHandler,
  onAddItemClicked,
  getAvailableParents,
  // changeItemParentHandler,
  getLanguageTitle,
  errors,
  isSubmitted,
  isLoading,
  hierarchyLevelsData,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const selectedBranchReducer = useSelector(
    (reducerState) => reducerState?.selectedBranchReducer,
  );
  const accountReducer = useSelector((reducerState) => reducerState?.accountReducer);
  const [search, setSearch] = useState('');
  const [activeItem, setActiveItem] = useState(null);
  const [isOpenAddDialog, setIsOpenAddDialog] = useState(false);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);

  /**
   * @param key
   * @param {parentIndex, index, nameIndex, names, parent_uuid, nameValue}
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to organize the long conditions
   * that changed at any action
   */
  const getIsVisible = useMemo(
    () =>
      (key, { parentIndex, index, nameIndex, names, parent_uuid, nameValue }) => {
        if (key === 'add-language')
          return (
            parentIndex === 0
            && index === 0
            && nameIndex === names.length - 1
            && languages.length > 0
            && (names.length === 0 || languages.length > names.length)
          );
        if (key === 'delete-language') {
          const defaultLanguageIndex = names.findIndex((item) => item === 'en');
          return names.length > 1 && defaultLanguageIndex !== index;
        }
        if (key === 'change-parent-node')
          return (
            !selectedBranchReducer
            || !parent_uuid
            || !selectedBranchReducer.uuid
            || (parent_uuid !== selectedBranchReducer.uuid && index === 0)
          );

        if (key === 'current-node')
          return (
            (!selectedBranchReducer
              || !parent_uuid
              || !selectedBranchReducer.uuid
              || index === 0
              || search)
            && (!search
              || names.some(
                (item) => !item || item.toLowerCase().includes(search.toLowerCase()),
              ))
          );

        if (key === 'repeated-title')
          return (
            !nameValue
            || !search
            || `${nameValue}`.toLowerCase().includes(search.toLowerCase())
          );
        if (key === 'remove-item') return nameIndex === names.length - 1;
        if (key === 'delete-btn')
          return index === names.length - 1 && names.length > 1;
        return true;
      },
    [selectedBranchReducer, languages.length, search],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the name if the childs that will be removed
   */
  const getChildsNames = useCallback(
    () =>
      activeItem && (
        <ul className="px-3 mb-0">
          {activeItem.children
            .filter((el) => !el.is_deleted)
            .map((item, index) => (
              <li key={`childsKeys${index + 1}`}>
                {item.name[i18next.language] || item.name.en || 'N/A'}
                {(item.children
                  && item.children.filter((el) => !el.is_deleted).length > 0
                  && ' ...')
                  || ''}
              </li>
            ))}
        </ul>
      ),
    [activeItem],
  );

  /**
   * @param errorPath
   * @param currentItem
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get if the current code value is duplicated
   * or not
   */
  const getIsDuplicatedCode = useCallback(
    (errorPath, currentItem) =>
      (getAvailableParents(currentItem.uuid).some(
        (item) => item.code === currentItem.code,
      ) && {
        [errorPath]: { error: true, message: t('Shared:this-field-is-duplicated') },
      })
      || {},
    [getAvailableParents, t],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to paint fake table body with the
   * recursive children of each parent node
   */
  const getFakeTableBody = useMemo(
    () =>
      (
        currentHierarch,
        parentIndex = 0,
        childrenErrorKey = '',
        parentName,
        parent_uuid = (selectedBranchReducer && selectedBranchReducer.uuid) || null,
      ) =>
        currentHierarch
          .filter((item) => !item.is_deleted)
          .map((item, index, hierarchyItems) => (
            <React.Fragment key={`hierarchyItemKey${parentIndex}-${index + 1}`}>
              {getIsVisible('current-node', {
                parent_uuid,
                index,
                names: Object.values(item.name),
              }) && (
                <>
                  <div className="fake-table-body-row">
                    <div className="fake-table-body-item parent-node-wrapper">
                      {childrenErrorKey.length === 0 && index === 0 && (
                        <div className="d-flex">
                          <SharedInputControl
                            editValue={
                              (selectedBranchReducer
                                && selectedBranchReducer.name
                                && selectedBranchReducer.name[i18next.language])
                              || null
                            }
                            parentTranslationPath={parentTranslationPath}
                            translationPath={translationPath}
                            stateKey="value"
                            isDisabled
                            tabIndex={-1}
                            title="branch-title"
                          />
                        </div>
                      )}
                      {getIsVisible('change-parent-node', {
                        parent_uuid,
                        index,
                      }) && (
                        <SharedInputControl
                          editValue={
                            parentName[i18next.language] || parentName.en || 'N/A'
                          }
                          parentTranslationPath={parentTranslationPath}
                          translationPath={translationPath}
                          stateKey="name"
                          isDisabled
                          tabIndex={-1}
                          title="parent-node"
                        />
                      )}
                    </div>

                    <div className="fake-table-body-item organization-group-item first-separator-item">
                      <SharedAPIAutocompleteControl
                        idRef={`organizationGroupAutocompleteRef${item.uuid}`}
                        editValue={item.org_group_uuid}
                        // title="section"
                        placeholder="select-organization-group"
                        stateKey="org_group_uuid"
                        parentIndex={index}
                        // tabIndex={
                        //   (index + 1) * (parentIndex + 1) * hierarchyItems.length
                        // }
                        getOptionLabel={(option) =>
                          (option.name
                            && (option.name[i18next.language] || option.name.en))
                          || 'N/A'
                        }
                        isGlobalLoading={isLoading}
                        extraProps={accountReducer}
                        searchKey="search"
                        getDataAPI={GetAllSetupsNewOrganizationGroup}
                        errorPath={`hierarchy${
                          (childrenErrorKey === '' && `[${index}]`) || ''
                        }${childrenErrorKey}${
                          (childrenErrorKey !== '' && `[${index}]`) || ''
                        }.org_group_uuid`}
                        isSubmitted={isSubmitted}
                        errors={errors}
                        isDisabled={isLoading}
                        parentTranslationPath={parentTranslationPath}
                        translationPath={translationPath}
                        onValueChanged={(newValue) => {
                          item.org_group_uuid = newValue.value;
                          onStateChanged({
                            id: 'hierarchy',
                            value: state.hierarchy,
                          });
                        }}
                        isFullWidth
                      />
                      {selectedBranchReducer
                        && selectedBranchReducer.uuid
                        && parent_uuid
                        && parent_uuid !== selectedBranchReducer.uuid
                        && hierarchyItems
                          .filter((el) => el.uuid !== item.uuid)
                          .map((childs, childIndex) => (
                            <React.Fragment
                              key={`repeatedOrganizationGroupItemKey-${
                                childIndex + 1
                              }-${parentIndex}-${index + 1}`}
                            >
                              <SharedAPIAutocompleteControl
                                idRef={`organizationGroupAutocompleteRepeatedRef${item.uuid}-${childs.uuid}`}
                                editValue={childs.org_group_uuid}
                                // title="section"
                                placeholder="select-organization-group"
                                stateKey="org_group_uuid"
                                parentIndex={index}
                                errorPath={`hierarchy${childrenErrorKey}[${
                                  childIndex + 1
                                }].org_group_uuid`}
                                searchKey="search"
                                getDataAPI={GetAllSetupsNewOrganizationGroup}
                                isSubmitted={isSubmitted}
                                errors={errors}
                                getOptionLabel={(option) =>
                                  (option.name
                                    && (option.name[i18next.language]
                                      || option.name.en))
                                  || 'N/A'
                                }
                                isGlobalLoading={isLoading}
                                parentTranslationPath={parentTranslationPath}
                                translationPath={translationPath}
                                onValueChanged={(newValue) => {
                                  childs.org_group_uuid = newValue.value;
                                  onStateChanged({
                                    id: 'hierarchy',
                                    value: state.hierarchy,
                                  });
                                }}
                                isFullWidth
                              />
                            </React.Fragment>
                          ))}
                    </div>

                    <div className="fake-table-body-item hierarchy-level-code-wrapper">
                      <div className="hierarchy-level-column">
                        <SharedAutocompleteControl
                          idRef={`hierarchyLevelAutocompleteRef${item.uuid}`}
                          editValue={item.level_uuid}
                          // title="section"
                          placeholder="select-hierarchy-level"
                          stateKey="level_uuid"
                          parentIndex={index}
                          initValues={hierarchyLevelsData}
                          initValuesKey="uuid"
                          initValuesTitle="name"
                          // tabIndex={
                          //   (index + 1) * (parentIndex + 1) * hierarchyItems.length
                          // }
                          getOptionLabel={(option) =>
                            (option.title
                              && (option.title[i18next.language] || option.title.en))
                            || 'N/A'
                          }
                          isGlobalLoading={isLoading}
                          extraProps={accountReducer}
                          // searchKey="search"
                          // getItemByIdAPI={GetSetupsHierarchyLevelById}
                          errorPath={`hierarchy${
                            (childrenErrorKey === '' && `[${index}]`) || ''
                          }${childrenErrorKey}${
                            (childrenErrorKey !== '' && `[${index}]`) || ''
                          }.level_uuid`}
                          isSubmitted={isSubmitted}
                          errors={errors}
                          isDisabled={isLoading}
                          parentTranslationPath={parentTranslationPath}
                          translationPath={translationPath}
                          onValueChanged={(newValue) => {
                            item.level_uuid = newValue.value;
                            onStateChanged({
                              id: 'hierarchy',
                              value: state.hierarchy,
                            });
                          }}
                          isFullWidth
                        />
                        {selectedBranchReducer
                          && selectedBranchReducer.uuid
                          && parent_uuid
                          && parent_uuid !== selectedBranchReducer.uuid
                          && hierarchyItems
                            .filter((el) => el.uuid !== item.uuid)
                            .map((childs, childIndex) => (
                              <React.Fragment
                                key={`repeatedHierarchyLevelItemKey-${
                                  childIndex + 1
                                }-${parentIndex}-${index + 1}`}
                              >
                                <SharedAutocompleteControl
                                  idRef={`hierarchyLevelAutocompleteRepeatedRef${item.uuid}-${childs.uuid}`}
                                  editValue={childs.level_uuid}
                                  // title="section"
                                  placeholder="select-hierarchy-level"
                                  stateKey="level_uuid"
                                  parentIndex={index}
                                  errorPath={`hierarchy${childrenErrorKey}[${
                                    childIndex + 1
                                  }].level_uuid`}
                                  isSubmitted={isSubmitted}
                                  errors={errors}
                                  initValues={hierarchyLevelsData}
                                  initValuesKey="uuid"
                                  initValuesTitle="name"
                                  getOptionLabel={(option) =>
                                    (option.title
                                      && (option.title[i18next.language]
                                        || option.title.en))
                                    || 'N/A'
                                  }
                                  isGlobalLoading={isLoading}
                                  parentTranslationPath={parentTranslationPath}
                                  translationPath={translationPath}
                                  onValueChanged={(newValue) => {
                                    childs.level_uuid = newValue.value;
                                    onStateChanged({
                                      id: 'hierarchy',
                                      value: state.hierarchy,
                                    });
                                  }}
                                  isFullWidth
                                />
                              </React.Fragment>
                            ))}
                      </div>
                      <div className="code-column">
                        <SharedInputControl
                          title="code"
                          idRef={`codeIdRef${item.uuid}`}
                          errors={
                            (errors[
                              `hierarchy${
                                (childrenErrorKey === '' && `[${index}]`) || ''
                              }${childrenErrorKey}${
                                (childrenErrorKey !== '' && `[${index}]`) || ''
                              }.code`
                            ]
                              && errors)
                            || getIsDuplicatedCode(
                              `hierarchy${
                                (childrenErrorKey === '' && `[${index}]`) || ''
                              }${childrenErrorKey}${
                                (childrenErrorKey !== '' && `[${index}]`) || ''
                              }.code`,
                              item,
                            )
                          }
                          stateKey="code"
                          errorPath={`hierarchy${
                            (childrenErrorKey === '' && `[${index}]`) || ''
                          }${childrenErrorKey}${
                            (childrenErrorKey !== '' && `[${index}]`) || ''
                          }.code`}
                          editValue={item.code}
                          isDisabled={isLoading}
                          isSubmitted={isSubmitted}
                          onValueChanged={(newValue) => {
                            item.code = newValue.value;
                            onStateChanged({
                              id: 'hierarchy',
                              value: state.hierarchy,
                            });
                          }}
                          pattern={numericAndAlphabeticalAndSpecialExpression}
                          parentTranslationPath={parentTranslationPath}
                        />
                        {selectedBranchReducer
                          && selectedBranchReducer.uuid
                          && parent_uuid
                          && parent_uuid !== selectedBranchReducer.uuid
                          && hierarchyItems
                            .filter((el) => el.uuid !== item.uuid)
                            .map((childs, childIndex) => (
                              <React.Fragment
                                key={`repeatedCodeItemKey-${
                                  childIndex + 1
                                }-${parentIndex}-${index + 1}`}
                              >
                                <SharedInputControl
                                  title="code"
                                  idRef={`codeRepeatedIdRef${item.uuid}-${childs.uuid}`}
                                  errorPath={`hierarchy${childrenErrorKey}[${
                                    childIndex + 1
                                  }].code`}
                                  stateKey="code"
                                  errors={
                                    (errors[
                                      `hierarchy${childrenErrorKey}[${
                                        childIndex + 1
                                      }].code`
                                    ]
                                      && errors)
                                    || getIsDuplicatedCode(
                                      `hierarchy${childrenErrorKey}[${
                                        childIndex + 1
                                      }].code`,
                                      childs,
                                    )
                                  }
                                  parentIndex={index}
                                  editValue={childs.code}
                                  isDisabled={isLoading}
                                  isSubmitted={isSubmitted}
                                  onValueChanged={(newValue) => {
                                    childs.code = newValue.value;
                                    onStateChanged({
                                      id: 'hierarchy',
                                      value: state.hierarchy,
                                    });
                                  }}
                                  isFullWidth
                                  pattern={
                                    numericAndAlphabeticalAndSpecialExpression
                                  }
                                  parentTranslationPath={parentTranslationPath}
                                />
                              </React.Fragment>
                            ))}
                      </div>
                    </div>
                    {item.name
                      && Object.entries(item.name).map((element, nameIndex) => (
                        <React.Fragment
                          key={`namesItemKey${parentIndex}-${nameIndex + 1}-${
                            index + 1
                          }`}
                        >
                          <div className="fake-table-body-item">
                            {childrenErrorKey === '' && index === 0 && (
                              <div className="language-actions-wrapper">
                                {/* {!element.language_uuid && ( */}
                                <SharedAutocompleteControl
                                  editValue={element[0]}
                                  placeholder="select-language"
                                  title="language"
                                  stateKey="name"
                                  errorPath={`hierarchy${
                                    (childrenErrorKey === '' && `[${index}]`) || ''
                                  }${childrenErrorKey}${
                                    (childrenErrorKey !== '' && `[${index}]`) || ''
                                  }.name`}
                                  disableClearable
                                  onValueChanged={(newValue) => {
                                    // eslint-disable-next-line prefer-destructuring
                                    item.name[newValue.value] = element[1];
                                    if (element[0]) delete item.name[element[0]];
                                    onStateChanged({
                                      id: 'hierarchy',
                                      value: state.hierarchy,
                                    });
                                  }}
                                  isSubmitted={isSubmitted}
                                  errors={errors}
                                  initValues={getNotSelectedLanguage(
                                    Object.keys(item.name),
                                    nameIndex,
                                  )}
                                  initValuesKey="code"
                                  initValuesTitle="title"
                                  parentTranslationPath={parentTranslationPath}
                                />
                                {getIsVisible('add-language', {
                                  parentIndex,
                                  index,
                                  nameIndex,
                                  names: Object.keys(item.name),
                                }) && (
                                  <div className="d-inline-flex">
                                    <ButtonBase
                                      className="btns theme-transparent mx-2 mt-1 mb-3"
                                      onClick={addLanguageHandler}
                                      disabled={isLoading}
                                    >
                                      <span className="fas fa-plus" />
                                      <span className="px-1">
                                        {t('add-language')}
                                      </span>
                                    </ButtonBase>
                                  </div>
                                )}
                              </div>
                            )}
                            <div
                              className={`d-flex-v-start-h-end language-input-${element[0]}`}
                            >
                              {getIsVisible('repeated-title', {
                                nameValue: element[1],
                              }) && (
                                <SharedInputControl
                                  editValue={element[1]}
                                  idRef={`titleIdRef${item.uuid}-${element[0]}`}
                                  parentTranslationPath={parentTranslationPath}
                                  translationPath={translationPath}
                                  stateKey="value"
                                  errors={errors}
                                  errorPath={`hierarchy${
                                    (childrenErrorKey.length === 0
                                      && `[${index}]`)
                                    || ''
                                  }${childrenErrorKey}${
                                    (childrenErrorKey.length > 0 && `[${index}]`)
                                    || ''
                                  }.name.${element[0]}`}
                                  title="title"
                                  isSubmitted={isSubmitted}
                                  onInputBlur={(newValue) => {
                                    item.name[element[0]] = newValue.value;
                                    onStateChanged({
                                      id: 'hierarchy',
                                      value: state.hierarchy,
                                    });
                                  }}
                                />
                              )}
                              {nameIndex === Object.keys(item.name).length - 1 && (
                                <ButtonBase
                                  className="btns-icon theme-transparent c-danger mt-1 mx-1"
                                  disabled={
                                    isLoading
                                    || (!item.isNotSaved
                                      && !item.can_delete
                                      && item.children
                                      && item.children.filter((el) => !el.is_deleted)
                                        .length > 0)
                                    || (!item.isNotSaved && !parent_uuid)
                                    || (!item.isNotSaved
                                      && selectedBranchReducer
                                      && parent_uuid === selectedBranchReducer.uuid)
                                  }
                                  onClick={
                                    ((!item.children
                                      || item.children.filter((el) => !el.is_deleted)
                                        .length === 0)
                                      && onRemoveItemClicked(item.uuid))
                                    || (() => {
                                      setActiveItem(item);
                                      setIsOpenDeleteDialog(true);
                                    })
                                  }
                                >
                                  <span className="fas fa-times" />
                                </ButtonBase>
                              )}
                            </div>

                            {selectedBranchReducer
                              && selectedBranchReducer.uuid
                              && parent_uuid
                              && parent_uuid !== selectedBranchReducer.uuid
                              && hierarchyItems
                                .filter((el) => el.uuid !== item.uuid)
                                .map(
                                  (childs, childIndex) =>
                                    getIsVisible('repeated-title', {
                                      nameValue: childs.name[element[0]],
                                    }) && (
                                      <React.Fragment
                                        key={`repeatedTitlesItemKey-${
                                          childIndex + 1
                                        }-${parentIndex}-${nameIndex + 1}-${
                                          index + 1
                                        }`}
                                      >
                                        <div
                                          className={`d-flex language-input-${element[0]}`}
                                        >
                                          <SharedInputControl
                                            editValue={childs.name[element[0]]}
                                            idRef={`titleRepeatedIdRef${item.uuid}-${childs.uuid}-${element[0]}`}
                                            parentTranslationPath={
                                              parentTranslationPath
                                            }
                                            translationPath={translationPath}
                                            stateKey="value"
                                            errors={errors}
                                            errorPath={`hierarchy${childrenErrorKey}[${
                                              childIndex + 1
                                            }].name.${element[0]}`}
                                            title="title"
                                            isSubmitted={isSubmitted}
                                            onInputBlur={(newValue) => {
                                              childs.name[element[0]]
                                                = newValue.value;
                                              onStateChanged({
                                                id: 'hierarchy',
                                                value: state.hierarchy,
                                              });
                                            }}
                                          />
                                          {getIsVisible('remove-item', {
                                            nameIndex,
                                            names: Object.keys(item.name),
                                          }) && (
                                            <ButtonBase
                                              className="btns-icon theme-transparent c-danger mt-1 mx-1"
                                              disabled={
                                                isLoading
                                                || (!childs.isNotSaved
                                                  && !childs.can_delete
                                                  && childs.children
                                                  && childs.children.filter(
                                                    (el) => !el.is_deleted,
                                                  ).length > 0)
                                              }
                                              onClick={
                                                ((!childs.children
                                                  || childs.children.filter(
                                                    (el) => !el.is_deleted,
                                                  ).length === 0)
                                                  && onRemoveItemClicked(
                                                    childs.uuid,
                                                  ))
                                                || (() => {
                                                  setActiveItem(childs);
                                                  setIsOpenDeleteDialog(true);
                                                })
                                              }
                                            >
                                              <span className="fas fa-times" />
                                            </ButtonBase>
                                          )}
                                        </div>
                                      </React.Fragment>
                                    ),
                                )}
                          </div>
                        </React.Fragment>
                      ))}
                  </div>
                  <div className="fake-table-body-row add-nodes-row">
                    <div
                      className="fake-table-body-item px-2"
                      style={{
                        maxWidth: `${100 / (Object.keys(item.name).length + 3)}%`,
                      }}
                    />
                    <div className="fake-table-body-item px-2">
                      <ButtonBase
                        className="btns theme-solid bg-secondary mx-0 w-100"
                        onClick={() => onAddItemClicked(parent_uuid)}
                        disabled={
                          isLoading
                          || !parent_uuid
                          || (selectedBranchReducer
                            && selectedBranchReducer.uuid === parent_uuid)
                        }
                      >
                        <span className="fas fa-plus" />
                        <span className="px-1">
                          {t(`${translationPath}add-child-node`)}
                        </span>
                      </ButtonBase>
                    </div>
                  </div>
                </>
              )}

              {item.children
                && item.children.filter((el) => !el.is_deleted).length > 0
                && getFakeTableBody(
                  item.children,
                  index,
                  `${childrenErrorKey}[${index}].children`,
                  item.name,
                  item.uuid,
                )}
            </React.Fragment>
          )),
    [
      selectedBranchReducer,
      getIsVisible,
      parentTranslationPath,
      translationPath,
      hierarchyLevelsData,
      isLoading,
      accountReducer,
      isSubmitted,
      errors,
      t,
      onStateChanged,
      state.hierarchy,
      getIsDuplicatedCode,
      getNotSelectedLanguage,
      addLanguageHandler,
      onRemoveItemClicked,
      onAddItemClicked,
    ],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the tab indexing
   */
  const tabIndexHandler = useCallback((cssSelector) => {
    document.querySelectorAll(cssSelector).forEach((item, index) => {
      item.setAttribute('tabindex', index);
    });
  }, []);

  // this is to handle the tab indexing the inputs on state change
  useEffect(() => {
    tabIndexHandler('.organization-group-item input');
    tabIndexHandler('.hierarchy-level-column input');
    tabIndexHandler('.code-column input');
    if (state.hierarchy.length > 0 && !state.hierarchy[0].is_deleted)
      Object.keys(state.hierarchy[0].name).map((item) =>
        tabIndexHandler(`.language-input-${item} input`),
      );
  }, [state.hierarchy, tabIndexHandler]);

  return (
    <div className="hierarchical-setups-page tab-wrapper">
      <div className="page-body-wrapper">
        <div className="d-flex-v-center-h-between flex-wrap">
          <div className="d-inline-flex">
            <SharedInputControl
              idRef="searchRef"
              title="search"
              placeholder="search"
              stateKey="search"
              themeClass="theme-filled"
              endAdornment={
                <span className="end-adornment-wrapper">
                  <span className="fas fa-search" />
                </span>
              }
              onValueChanged={(newValue) => {
                setSearch(newValue.value);
              }}
              parentTranslationPath={parentTranslationPath}
            />
          </div>
          <div className="px-2">
            <ButtonBase
              onClick={() => {
                if (state.hierarchy.length === 0 || state.hierarchy[0].is_deleted) {
                  if (!isChanged) onIsChangedChanged();
                  if (onAddItemClicked) onAddItemClicked();
                } else setIsOpenAddDialog(true);
              }}
              disabled={
                !selectedBranchReducer || !selectedBranchReducer.uuid || isLoading
              }
              className="btns theme-solid mx-2 mb-2"
            >
              <span className="fas fa-plus" />
              <span className="px-1">{t(`${translationPath}add-parent-node`)}</span>
            </ButtonBase>
            <ButtonBase
              type="submit"
              disabled={
                !selectedBranchReducer
                || !selectedBranchReducer.uuid
                || isLoading
                || !isChanged
              }
              className={`btns theme-solid mx-2 mb-2${
                (state.initHierarchy
                  && state.initHierarchy.length > 0
                  && ' bg-secondary')
                || ' bg-green-primary'
              }`}
            >
              <span className="px-1">
                {t(
                  `${translationPath}${
                    (state.initHierarchy
                      && state.initHierarchy.length > 0
                      && 'update')
                    || 'create'
                  }`,
                )}
              </span>
            </ButtonBase>
          </div>
        </div>
        {state.hierarchy
          && state.hierarchy.length > 0
          && !state.hierarchy[0].is_deleted && (
          <div className="fake-table-responsive">
            <div className="fake-table-wrapper">
              <div className="fake-table-header">
                <div className="fake-table-header-item">
                  <span>{t(`${translationPath}parent-node`)}</span>
                </div>
                <div className="fake-table-header-item">
                  <span>{t(`${translationPath}organization-group`)}</span>
                </div>
                <div className="fake-table-header-item hierarchy-level-code-wrapper">
                  <span className="hierarchy-level-column">
                    {t(`${translationPath}hierarchy-level`)}
                  </span>
                  <span className="code-column">
                    {t(`${translationPath}code`)}
                  </span>
                </div>
                {Object.entries(state.hierarchy[0].name || {}).map(
                  (item, index) => (
                    <div
                      className="fake-table-header-item"
                      key={`headerItemKey${index + 1}`}
                    >
                      <span>
                        {`${t(
                          `${translationPath}hierarchical-node`,
                        )} (${getLanguageTitle(item[0])})`}
                      </span>

                      {getIsVisible('delete-language', {
                        names: Object.keys(state.hierarchy[0].name || {}),
                        index,
                      }) && (
                        <div className="d-inline-flex">
                          <ButtonBase
                            className="btns-icon theme-transparent c-danger mx-2"
                            onClick={removeLanguageHandler(item[0])}
                            disabled={isLoading}
                          >
                            <span className="fas fa-times" />
                          </ButtonBase>
                        </div>
                      )}
                    </div>
                  ),
                )}
              </div>
              <div className="fake-table-body">
                {getFakeTableBody(state.hierarchy)}
              </div>
            </div>
          </div>
        )}
      </div>
      {isOpenAddDialog && (
        <ParentAddDialog
          isOpen={isOpenAddDialog}
          getAvailableParents={getAvailableParents}
          onAddItemClicked={onAddItemClicked}
          isOpenChanged={() => setIsOpenAddDialog(false)}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
      {activeItem && isOpenDeleteDialog && (
        <ConfirmDeleteDialog
          isConfirmOnly
          activeItem={activeItem}
          onSave={() => {
            onRemoveItemClicked(activeItem.uuid)();
          }}
          saveType="button"
          isOpenChanged={() => {
            setIsOpenDeleteDialog(false);
            setActiveItem(null);
          }}
          descriptionMessage="node-delete-description"
          extraDescription={getChildsNames()}
          parentTranslationPath={parentTranslationPath}
          isOpen={isOpenDeleteDialog}
        />
      )}
    </div>
  );
};
const hierarchyDto = PropTypes.arrayOf(
  PropTypes.shape({
    parent_uuid: PropTypes.string,
    uuid: PropTypes.string,
    code: PropTypes.string,
    isNotSaved: PropTypes.bool,
    name: PropTypes.instanceOf(Object),
    can_delete: PropTypes.bool,
    is_deleted: PropTypes.bool,
    children: PropTypes.instanceOf(Array),
  }),
);
HierarchicalSetupsTab.propTypes = {
  state: PropTypes.shape({
    initHierarchy: hierarchyDto,
    hierarchy: hierarchyDto,
  }).isRequired,
  hierarchyLevelsData: PropTypes.instanceOf(Array).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  onIsChangedChanged: PropTypes.func.isRequired,
  onAddItemClicked: PropTypes.func.isRequired,
  languages: PropTypes.instanceOf(Array).isRequired,
  isChanged: PropTypes.bool.isRequired,
  getNotSelectedLanguage: PropTypes.func.isRequired,
  onRemoveItemClicked: PropTypes.func.isRequired,
  getLanguageTitle: PropTypes.func.isRequired,
  getAvailableParents: PropTypes.func.isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  removeLanguageHandler: PropTypes.func.isRequired,
  // changeItemParentHandler: PropTypes.func.isRequired,
  addLanguageHandler: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};

export default HierarchicalSetupsTab;
