import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { useTranslation } from 'react-i18next';
import {
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
  SharedInputControl,
  SharedUploaderControl,
} from '../../../../../../../../shared';
import {
  GetAllSetupsBranches,
  GetSetupsBranchesById,
  GetAllSetupsPermissions,
  GetAllJobsByBranch,
  GetAllSetupsUsers,
  getSetupsUsersById,
  GetAllSetupsCategories,
} from '../../../../../../../../../../services';
import {
  AssigneeTypesEnum,
  DynamicFormTypesEnum,
} from '../../../../../../../../../../enums';
import { SwitchComponent } from 'components';
import { showError } from 'helpers';

export const InvitationTab = ({
  state,
  errors,
  onStateChanged,
  isSubmitted,
  isLoading,
  parentTranslationPath,
  translationPath,
  userType,
  isEdit,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [selectedBranchesList, setSelectedBranchesList] = useState([]);
  const [assigneeTypes] = useState(
    Object.values(AssigneeTypesEnum).map((item) => ({
      ...item,
      value: t(item.value),
    })),
  );

  const getBranches = useCallback(
    async (ids) => {
      const res = await GetAllSetupsBranches({
        with_than: ids,
      });
      if (res?.status === 200 && res?.data?.results)
        setSelectedBranchesList(
          res.data.results.filter((it) => ids.includes(it.uuid)),
        );
      else showError(t('Shared:failed-to-get-saved-data'), res);
    },
    [t],
  );

  const onUploadChanged = (newValue, key) => {
    onStateChanged({
      id: key,
      value: (newValue.value.length && newValue.value[0]) || null,
    });
    onStateChanged({
      id: `${key}_uuid`,
      value: (newValue.value.length && newValue.value[0].uuid) || null,
    });
    onStateChanged({
      id: `${key}_url`,
      value: newValue.value[0].url || [],
    });
  };
  useEffect(() => {
    if (state.access?.filter((it) => it.branch_uuid)?.length) {
      const accessIds = state.access
        ?.filter((it) => it.branch_uuid)
        ?.map((it) => it.branch_uuid);
      getBranches([...new Set(accessIds)]);
    } else setSelectedBranchesList([]);
  }, [getBranches, state.access]);

  return (
    <div className="provider-invitation-tab-wrapper tab-content-wrapper">
      <div>
        <SharedInputControl
          isHalfWidth
          editValue={state.first_name}
          parentTranslationPath={parentTranslationPath}
          stateKey="first_name"
          errors={errors}
          errorPath="first_name"
          labelValue={t(`${translationPath}${userType}-name`)}
          isSubmitted={isSubmitted}
          onValueChanged={onStateChanged}
        />
        <SharedInputControl
          isHalfWidth
          errors={errors}
          labelValue="email"
          isSubmitted={isSubmitted}
          stateKey="email"
          errorPath="email"
          editValue={state.email}
          onValueChanged={onStateChanged}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          isDisabled={isEdit}
        />
      </div>
      <div>
        <div className="px-2 mb-2">{t(`${translationPath}grant-access`)}</div>
        {state.access
          && state.access?.map((item, index) => (
            <div
              key={`${index + 1}-provider-access-permissions-branch`}
              className="d-flex mb-4"
            >
              <SharedAPIAutocompleteControl
                isQuarterWidth
                title="branch"
                errors={errors}
                searchKey="search"
                placeholder="branch"
                parentId="access"
                stateKey="branch_uuid"
                isSubmitted={isSubmitted}
                parentIndex={index}
                onValueChanged={(e) => {
                  onStateChanged(e);
                  onStateChanged({
                    parentId: 'access',
                    parentIndex: index,
                    id: 'permissions',
                    value: [],
                  });
                  onStateChanged({
                    parentId: 'access',
                    parentIndex: index,
                    id: 'jobs',
                    value: [],
                  });
                }}
                translationPath={translationPath}
                getDataAPI={GetAllSetupsBranches}
                getItemByIdAPI={GetSetupsBranchesById}
                editValue={item.branch_uuid}
                parentTranslationPath={parentTranslationPath}
                errorPath={`access[${index}].branch_uuid`}
                getOptionLabel={(option) =>
                  option.name[i18next.language] || option.name.en
                }
                extraProps={{
                  ...(item.branch_uuid && {
                    with_than: [item.branch_uuid],
                  }),
                }}
                controlWrapperClasses="mb-0"
                getDisabledOptions={(option) =>
                  state.access?.some((it) => it.branch_uuid === option.uuid)
                }
              />
              {item.branch_uuid && (
                <>
                  <SharedAPIAutocompleteControl
                    key={`${index}${item.branch_uuid || ''}-permissions`}
                    isQuarterWidth
                    errors={errors}
                    searchKey="search"
                    title="permissions"
                    parentId="access"
                    parentIndex={index}
                    stateKey="permissions"
                    isSubmitted={isSubmitted}
                    isEntireObject
                    onValueChanged={(newValue) => {
                      onStateChanged({
                        ...newValue,
                        value: newValue.value.map((item) => item.uuid),
                      });
                    }}
                    editValue={item.permissions}
                    placeholder="select-permissions"
                    translationPath={translationPath}
                    idRef="permissionsAutocompleteRef"
                    getDataAPI={GetAllSetupsPermissions}
                    type={DynamicFormTypesEnum.array.key}
                    parentTranslationPath={parentTranslationPath}
                    errorPath={`access[${index}].permissions`}
                    getOptionLabel={(option) =>
                      option.title[i18next.language] || option.title.en
                    }
                    extraProps={{
                      company_uuid: item.branch_uuid,
                      status:true,
                      ...(item.permissions?.length && {
                        with_than: item.permissions,
                      }),
                    }}
                    controlWrapperClasses="mb-0"
                  />
                  <SharedAPIAutocompleteControl
                    key={`${index}${item.branch_uuid || ''}-jobs`}
                    isQuarterWidth
                    isEntireObject
                    errors={errors}
                    searchKey="search"
                    title="jobs"
                    errorPath={`access[${index}].jobs`}
                    isDisabled={isLoading}
                    isSubmitted={isSubmitted}
                    placeholder="select-jobs"
                    parentId="access"
                    parentIndex={index}
                    stateKey="jobs"
                    dataKey="jobs"
                    onValueChanged={(newValue) => {
                      onStateChanged({
                        ...newValue,
                        value: newValue.value.map((item) => item.uuid),
                      });
                    }}
                    editValue={item.jobs}
                    getDataAPI={GetAllJobsByBranch}
                    extraProps={{
                      company_uuid: item.branch_uuid || undefined,
                      ...(item?.jobs && {
                        with_than: item.jobs,
                      }),
                    }}
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                    getOptionLabel={(option) => option.title}
                    type={DynamicFormTypesEnum.array.key}
                    controlWrapperClasses="mb-0"
                  />
                </>
              )}
              <div>
                <ButtonBase
                  onClick={(e) => {
                    let accessItems = [...state.access];
                    accessItems.splice(index, 1);
                    onStateChanged({ id: 'access', value: accessItems });
                  }}
                  className="btns theme-transparent"
                  disabled={state.access?.length === 1}
                >
                  <i className="fas fa-trash" />
                </ButtonBase>
              </div>
            </div>
          ))}
        <ButtonBase
          onClick={() => {
            const accessLocalArray = {
              branch_uuid: '',
              permissions: [],
              jobs: [],
            };
            onStateChanged({
              id: 'access',
              value: [...state.access, accessLocalArray],
            });
          }}
          className="btns theme-solid"
        >
          <span className="fas fa-plus" />
          <span className="px-1">{t(`${translationPath}add-access`)}</span>
        </ButtonBase>
      </div>
      <div className="my-4">
        <div className="px-2 mb-2">{t(`${translationPath}rating-criteria`)}</div>
        {state?.rating?.rating_criteria
          && state?.rating.rating_criteria?.map((item, index) => (
            <div
              key={`${index + 1}-provider-rating-criteria-item`}
              className="d-flex mb-2"
            >
              <SharedInputControl
                isHalfWidth
                editValue={state.rating?.rating_criteria?.[index]?.name || ''}
                parentTranslationPath={parentTranslationPath}
                errors={errors}
                isSubmitted={isSubmitted}
                errorPath={`rating.rating_criteria[${index}].name`}
                parentId="rating"
                subParentId="rating_criteria"
                stateKey="name"
                subParentIndex={index}
                onValueChanged={(e) => {
                  let ratingCriteriaItems = state?.rating?.rating_criteria
                    ? [...state.rating.rating_criteria]
                    : [];
                  if (ratingCriteriaItems[index])
                    ratingCriteriaItems[index].name = e.value;
                  onStateChanged({
                    parentId: 'rating',
                    id: 'rating_criteria',
                    value: ratingCriteriaItems,
                  });
                }}
                isDisabled={false}
              />
              <div>
                <ButtonBase
                  onClick={(e) => {
                    let ratingCriteriaItems = state?.rating?.rating_criteria
                      ? [...state.rating.rating_criteria]
                      : [];
                    ratingCriteriaItems.splice(index, 1);
                    onStateChanged({
                      parentId: 'rating',
                      id: 'rating_criteria',
                      value: ratingCriteriaItems,
                    });
                  }}
                  className="btns theme-transparent"
                  disabled={state?.rating?.rating_criteria?.length === 1}
                >
                  <i className="fas fa-trash" />
                </ButtonBase>
              </div>
            </div>
          ))}
        <ButtonBase
          onClick={() => {
            const ratingLocalArray = {
              name: '',
              rate: 0,
              ratings_num: 0,
              uuid: null,
            };
            onStateChanged({
              parentId: 'rating',
              id: 'rating_criteria',
              value: state?.rating?.rating_criteria
                ? [...state.rating.rating_criteria, ratingLocalArray]
                : [ratingLocalArray],
            });
          }}
          className="btns theme-solid"
        >
          <span className="fas fa-plus" />
          <span className="px-1">{t(`${translationPath}add-rating-criteria`)}</span>
        </ButtonBase>
      </div>
      <div className="my-4">
        <SharedUploaderControl
          editValue={(state.account_logo && [state.account_logo]) || []}
          onValueChanged={(newvalue) => onUploadChanged(newvalue, 'account_logo')}
          stateKey="account_logo"
          labelValue="account-logo"
          isSubmitted={isSubmitted}
          errors={errors}
          labelClasses="theme-primary"
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
        <SharedUploaderControl
          editValue={(state.provider_logo && [state.provider_logo]) || []}
          onValueChanged={(newvalue) => onUploadChanged(newvalue, 'provider_logo')}
          stateKey="provider_logo"
          labelValue="provider-logo"
          isSubmitted={isSubmitted}
          errors={errors}
          labelClasses="theme-primary"
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      </div>
      <div className="mx-2">
        <SwitchComponent
          isChecked={state.automatic_assign}
          label="automatic-assign"
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          onChange={(e) => {
            onStateChanged({ id: 'automatic_assign', value: e?.target?.checked });
            onStateChanged({
              id: 'assignee',
              value: e?.target?.checked
                ? [
                  {
                    branch_uuid: null,
                    assignee_type: null,
                    assignee_uuid: null,
                    category: null,
                    positions: [],
                  },
                ]
                : [],
            });
          }}
          isFlexStart
          isDisabled={selectedBranchesList.length === 0}
        />
      </div>
      {state.automatic_assign && (
        <div className="my-4">
          {state.assignee
            && state.assignee?.map((item, index) => (
              <div
                key={`${index + 1}-provider-automatic-assignee`}
                className="mb-4 p-3"
                style={{
                  border: '1px dashed lightgray',
                }}
              >
                <div className="d-flex-v-start-h-end">
                  <ButtonBase
                    onClick={(e) => {
                      let assigneeItems = [...state.assignee];
                      assigneeItems.splice(index, 1);
                      onStateChanged({ id: 'assignee', value: assigneeItems });
                    }}
                    className="btns-icon theme-transparent mb-2"
                    disabled={state.assignee?.length === 1}
                  >
                    <i className="fas fa-times" />
                  </ButtonBase>
                </div>
                <SharedAutocompleteControl
                  isHalfWidth
                  title="branch"
                  errors={errors}
                  searchKey="search"
                  placeholder="branch"
                  parentId="assignee"
                  stateKey="branch_uuid"
                  isSubmitted={isSubmitted}
                  parentIndex={index}
                  onValueChanged={(e) => {
                    onStateChanged(e);
                    onStateChanged({
                      parentId: 'assignee',
                      parentIndex: index,
                      id: 'assignee_type',
                      value: '',
                    });
                    onStateChanged({
                      parentId: 'assignee',
                      parentIndex: index,
                      id: 'assignee_uuid',
                      value: '',
                    });
                    onStateChanged({
                      parentId: 'assignee',
                      parentIndex: index,
                      id: 'category',
                      value: '',
                    });
                    onStateChanged({
                      parentId: 'assignee',
                      parentIndex: index,
                      id: 'positions',
                      value: [],
                    });
                  }}
                  translationPath={translationPath}
                  initValuesKey="uuid"
                  initValues={selectedBranchesList || []}
                  editValue={item.branch_uuid}
                  parentTranslationPath={parentTranslationPath}
                  errorPath={`assignee[${index}].branch_uuid`}
                  getOptionLabel={(option) =>
                    option.name[i18next.language] || option.name.en
                  }
                  extraProps={{
                    ...(item.branch_uuid && {
                      with_than: [item.branch_uuid],
                    }),
                  }}
                  controlWrapperClasses="mb-0"
                />
                {item.branch_uuid && (
                  <>
                    <SharedAutocompleteControl
                      isHalfWidth
                      searchKey="search"
                      initValuesKey="key"
                      errors={errors}
                      initValues={assigneeTypes}
                      stateKey="assignee_type"
                      parentId="assignee"
                      parentIndex={index}
                      onValueChanged={(e) => {
                        onStateChanged(e);
                        onStateChanged({
                          parentId: 'assignee',
                          parentIndex: index,
                          id: 'assignee_uuid',
                          value: '',
                        });
                        onStateChanged({
                          parentId: 'assignee',
                          parentIndex: index,
                          id: 'category',
                          value: '',
                        });
                        onStateChanged({
                          parentId: 'assignee',
                          parentIndex: index,
                          id: 'positions',
                          value: [],
                        });
                      }}
                      title="assignee-type"
                      editValue={item.assignee_type}
                      placeholder="select-assignee-type"
                      translationPath={translationPath}
                      parentTranslationPath={parentTranslationPath}
                      isSubmitted={isSubmitted}
                      errorPath={`assignee[${index}].assignee_type`}
                    />
                    {item.assignee_type && (
                      <>
                        {item.assignee_type === AssigneeTypesEnum.Employee.key && (
                          <SharedAPIAutocompleteControl
                            errors={errors}
                            errorPath={`assignee[${index}].assignee_uuid`}
                            isSubmitted={isSubmitted}
                            title="assignee"
                            isHalfWidth
                            placeholder="select-assignee"
                            stateKey="assignee_uuid"
                            parentId="assignee"
                            parentIndex={index}
                            onValueChanged={(e) => {
                              onStateChanged(e);
                              onStateChanged({
                                parentId: 'assignee',
                                parentIndex: index,
                                id: 'category',
                                value: '',
                              });
                              onStateChanged({
                                parentId: 'assignee',
                                parentIndex: index,
                                id: 'positions',
                                value: [],
                              });
                            }}
                            isDisabled={isLoading}
                            idRef="assignee_uuid"
                            getOptionLabel={(option) =>
                              `${
                                option.first_name
                                && (option.first_name[i18next.language]
                                  || option.first_name.en)
                              }${
                                option.last_name
                                && ` ${
                                  option.last_name[i18next.language]
                                  || option.last_name.en
                                }`
                              }${
                                (!option.has_access
                                  && item.assignee_uuid !== option.uuid
                                  && ` ${t('Shared:dont-have-permissions')}`)
                                || ''
                              }`
                            }
                            type={DynamicFormTypesEnum.select.key}
                            getDataAPI={GetAllSetupsUsers}
                            getItemByIdAPI={getSetupsUsersById}
                            translationPath={translationPath}
                            parentTranslationPath={parentTranslationPath}
                            searchKey="search"
                            extraProps={{
                              company_uuid: item.branch_uuid,
                              committeeType: 'all',
                              ...(item.assignee_uuid && {
                                with_than: [item.assignee_uuid],
                              }),
                            }}
                            editValue={item.assignee_uuid}
                            getDisabledOptions={(option) => !option.has_access}
                          />
                        )}
                        {item.assignee_type === AssigneeTypesEnum.User.key && (
                          <SharedAPIAutocompleteControl
                            errors={errors}
                            errorPath={`assignee[${index}].assignee_uuid`}
                            isSubmitted={isSubmitted}
                            isHalfWidth
                            title="assignee"
                            stateKey="assignee_uuid"
                            parentId="assignee"
                            parentIndex={index}
                            placeholder="select-assignee"
                            isDisabled={isLoading}
                            onValueChanged={(e) => {
                              onStateChanged(e);
                              onStateChanged({
                                parentId: 'assignee',
                                parentIndex: index,
                                id: 'category',
                                value: '',
                              });
                              onStateChanged({
                                parentId: 'assignee',
                                parentIndex: index,
                                id: 'positions',
                                value: [],
                              });
                            }}
                            searchKey="search"
                            getDataAPI={GetAllSetupsUsers}
                            // getItemByIdAPI={getSetupsUsersById}
                            translationPath={translationPath}
                            parentTranslationPath={parentTranslationPath}
                            getOptionLabel={(option) =>
                              `${
                                option.first_name
                                && (option.first_name[i18next.language]
                                  || option.first_name.en)
                              }${
                                option.last_name
                                && ` ${
                                  option.last_name[i18next.language]
                                  || option.last_name.en
                                }`
                              }`
                            }
                            editValue={item.assignee_uuid}
                            extraProps={{
                              company_uuid: item.branch_uuid,
                              ...(item.assignee_uuid && {
                                with_than: [item.assignee_uuid],
                              }),
                            }}
                          />
                        )}
                      </>
                    )}
                    {item.assignee_uuid && (
                      <SharedAPIAutocompleteControl
                        errors={errors}
                        errorPath={`assignee[${index}].category`}
                        isSubmitted={isSubmitted}
                        isHalfWidth
                        searchKey="search"
                        title="category"
                        stateKey="category"
                        parentId="assignee"
                        parentIndex={index}
                        editValue={item.category}
                        onValueChanged={(e) => {
                          onStateChanged(e);
                          onStateChanged({
                            parentId: 'assignee',
                            parentIndex: index,
                            id: 'positions',
                            value: [],
                          });
                        }}
                        placeholder="category"
                        getDataAPI={GetAllSetupsCategories}
                        extraProps={{
                          branch_uuid: item.branch_uuid,
                          with_than: (item?.category && [item.category]) || null,
                        }}
                        translationPath={translationPath}
                        parentTranslationPath={parentTranslationPath}
                        getOptionLabel={(option) =>
                          option.title[i18next.language] || option.title.en
                        }
                        // getDisabledOptions={(option)=> {
                        //   let selectedCategoriesIds = [];
                        //   state.assignee.forEach(it => {
                        //     selectedCategoriesIds = [...selectedCategoriesIds, it.category];
                        //   })
                        //   return selectedCategoriesIds.includes(option.uuid)
                        // }}
                      />
                    )}
                    {item.category && (
                      <>
                        <SharedAPIAutocompleteControl
                          isHalfWidth
                          errors={errors}
                          searchKey="search"
                          title="jobs"
                          errorPath={`assignee[${index}].positions`}
                          isDisabled={isLoading}
                          isSubmitted={isSubmitted}
                          placeholder="select-jobs"
                          parentId="assignee"
                          parentIndex={index}
                          stateKey="positions"
                          dataKey="positions"
                          onValueChanged={onStateChanged}
                          editValue={item.positions}
                          getDataAPI={GetAllJobsByBranch}
                          extraProps={{
                            category: item.category && [item.category],
                            company_uuid: item.branch_uuid || undefined,
                            ...(item?.positions && {
                              with_than: item.positions,
                            }),
                          }}
                          translationPath={translationPath}
                          parentTranslationPath={parentTranslationPath}
                          getOptionLabel={(option) => option.title}
                          type={DynamicFormTypesEnum.array.key}
                          controlWrapperClasses="mb-0"
                          getDisabledOptions={(option) => {
                            let selectedPositionsIds = [];
                            state.assignee.forEach((it) => {
                              selectedPositionsIds = [
                                ...selectedPositionsIds,
                                ...it.positions,
                              ];
                            });
                            return selectedPositionsIds.includes(option);
                          }}
                        />
                      </>
                    )}
                  </>
                )}
              </div>
            ))}
          <ButtonBase
            onClick={() => {
              const assigneesLocalArray = {
                branch_uuid: null,
                assignee_type: null,
                assignee_uuid: null,
                category: null,
                positions: [],
              };
              onStateChanged({
                id: 'assignee',
                value: [...state.assignee, assigneesLocalArray],
              });
            }}
            className="btns theme-solid"
          >
            <span className="fas fa-plus" />
            <span className="px-1">{t(`${translationPath}add-assignee`)}</span>
          </ButtonBase>
        </div>
      )}
    </div>
  );
};

InvitationTab.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  languages: PropTypes.instanceOf(Array).isRequired,
  removeLanguageHandler: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  userType: PropTypes.string.isRequired,
  isEdit: PropTypes.bool.isRequired,
};
