import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SharedAPIAutocompleteControl } from '../../../../../../shared';
import {
  GetAllSetupsBranches,
  GetSetupsBranchesById,
  GetAllSetupsPermissions,
  GetAllSetupsCategories,
  getSetupsCategoriesById,
  GetSetupsPermissionsById,
} from '../../../../../../../../services';
import { DynamicFormTypesEnum } from '../../../../../../../../enums';
import { PermissionsManagementComponent } from '../../../../../permissions/dialogs/permissions-management/PermissionsManagementComponent';
import { SwitchComponent } from '../../../../../../../../components';
import '../PermissionsManagement.Style.scss';

export const AccessItemComponent = ({
  state,
  errors,
  accessItem,
  isSubmitted,
  onStateChanged,
  accessItemIndex,
  isWithoutStatus,
  isWithoutCategory,
  translationPath,
  parentTranslationPath,
  permissionsCategories,
  outerExpanded,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  const [expanded, setExpanded] = useState('');

  const handleExpandChange = (panel, item) => (event, isExpanded) => {
    if (item.toggles && item.toggles.length === 0) return;
    setExpanded(isExpanded ? panel : '');
  };

  /**
   * @param parentId
   * @param parentIndex
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
   * @Description this method is to change the status of lookups
   */
  const onStatusChangedHandler = (parentId, parentIndex) => (event, newValue) => {
    onStateChanged({
      parentId,
      parentIndex,
      id: 'status',
      value: newValue,
    });
  };

  return (
    <div>
      <div className="access-item-wrapper">
        {!isWithoutStatus && (
          <div className="px-4">
            <SwitchComponent
              label="active"
              isReversedLabel
              idRef="is_masterSwitchRef"
              isChecked={accessItem.status}
              parentTranslationPath={parentTranslationPath}
              onChange={onStatusChangedHandler('user_access', accessItemIndex)}
            />
          </div>
        )}

        {outerExpanded === `panel-${accessItemIndex + 1}` && (
          <>
            <div className="d-flex align-items-baseline">
              <SharedAPIAutocompleteControl
                isQuarterWidth
                title="branch"
                errors={errors}
                searchKey="search"
                placeholder="branch"
                parentId="user_access"
                stateKey="company_uuid"
                isSubmitted={isSubmitted}
                parentIndex={accessItemIndex}
                onValueChanged={onStateChanged}
                translationPath={translationPath}
                getDataAPI={GetAllSetupsBranches}
                getItemByIdAPI={GetSetupsBranchesById}
                editValue={accessItem.company_uuid}
                parentTranslationPath={parentTranslationPath}
                errorPath={`user_access[${accessItemIndex}].company_uuid`}
                isRequired
                getOptionLabel={(option) =>
                  option.name[i18next.language] || option.name.en
                }
                extraProps={{
                  ...(accessItem.company_uuid && {
                    with_than: [accessItem.company_uuid],
                  }),
                }}
              />
              {accessItem && accessItem.company_uuid && (
                <>
                  {!isWithoutCategory && (
                    <SharedAPIAutocompleteControl
                      isQuarterWidth
                      errors={errors}
                      title="category"
                      searchKey="search"
                      parentId="user_access"
                      stateKey="category_uuid"
                      isSubmitted={isSubmitted}
                      placeholder="select-category"
                      parentIndex={accessItemIndex}
                      onValueChanged={onStateChanged}
                      getDataAPI={GetAllSetupsCategories}
                      getItemByIdAPI={getSetupsCategoriesById}
                      idRef="categoriesAutocompleteRef"
                      translationPath={translationPath}
                      type={DynamicFormTypesEnum.array.key}
                      editValue={accessItem.category_uuid}
                      parentTranslationPath={parentTranslationPath}
                      errorPath={`user_access[${accessItemIndex}].category_uuid`}
                      getOptionLabel={(option) =>
                        option.title[i18next.language] || option.title.en
                      }
                      isRequired
                      extraProps={{
                        branch_uuid: accessItem.company_uuid,
                        ...(accessItem.category_uuid?.length && {
                          with_than: accessItem.category_uuid,
                        }),
                      }}
                    />
                  )}
                  <SharedAPIAutocompleteControl
                    isQuarterWidth
                    errors={errors}
                    searchKey="search"
                    title="permissions"
                    parentId="user_access"
                    stateKey="permissions"
                    isSubmitted={isSubmitted}
                    parentIndex={accessItemIndex}
                    isEntireObject
                    onValueChanged={(newValue) => {
                      onStateChanged({
                        ...newValue,
                        value: newValue.value.map((item) => item.uuid),
                      });
                      const localRolePermissions = newValue.value
                        .reduce(
                          (total, item) =>
                            total.concat(item.roles_permissions || []),
                          [],
                        )
                        .filter(
                          (item, index, items) => items.indexOf(item) === index,
                        );

                      onStateChanged({
                        parentId: 'user_access',
                        parentIndex: accessItemIndex,
                        id: 'role_permissions',
                        value: localRolePermissions,
                      });
                      // getAllSetupsPermissionsCategories(newValue.value);
                    }}
                    editValue={accessItem.permissions}
                    placeholder="select-permissions"
                    translationPath={translationPath}
                    idRef="permissionsAutocompleteRef"
                    getDataAPI={GetAllSetupsPermissions}
                    getItemByIdAPI={GetSetupsPermissionsById}
                    type={DynamicFormTypesEnum.array.key}
                    parentTranslationPath={parentTranslationPath}
                    errorPath={`user_access[${accessItemIndex}].permissions`}
                    isRequired
                    getOptionLabel={(option) =>
                      option.title[i18next.language] || option.title.en
                    }
                    extraProps={{
                      company_uuid: accessItem.company_uuid,
                      status:true,
                      ...(accessItem.permissions?.length && {
                        with_than: accessItem.permissions,
                      }),
                    }}
                  />
                </>
              )}
              <IconButton
                onClick={() => {
                  state.user_access.splice(accessItemIndex, 1);
                  onStateChanged({ id: 'user_access', value: state.user_access });
                }}
                className="btns-icon theme-danger mt-1"
              >
                <span className="far fa-trash-alt pb-1" />
              </IconButton>
            </div>
            <div className="px-2 pb-3">
              {permissionsCategories
                && accessItem.permissions
                && accessItem.permissions.length > 0
                && permissionsCategories.length > 0 && (
                <Accordion
                  expanded={expanded === `panel-${accessItemIndex + 1}`}
                  onChange={handleExpandChange(
                    `panel-${accessItemIndex + 1}`,
                    accessItem,
                  )}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <span className="fw-bold">
                      {t(`${translationPath}permissions`)}
                    </span>
                  </AccordionSummary>
                  <AccordionDetails>
                    <PermissionsManagementComponent
                      state={accessItem}
                      parentId="user_access"
                      parentIndex={accessItemIndex}
                      permissionsKey="role_permissions"
                      data={permissionsCategories}
                      onStateChanged={onStateChanged}
                      parentTranslationPath={parentTranslationPath}
                    />
                  </AccordionDetails>
                </Accordion>
              )}
            </div>
          </>
        )}
      </div>
      {accessItemIndex !== state.user_access.length - 1 && <hr />}
    </div>
  );
};

AccessItemComponent.propTypes = {
  state: PropTypes.shape({
    user_access: PropTypes.instanceOf(Array).isRequired,
  }).isRequired,
  permissionsCategories: PropTypes.instanceOf(Array).isRequired,
  accessItem: PropTypes.shape({
    status: PropTypes.bool,
    company_uuid: PropTypes.string.isRequired,
    permissions: PropTypes.instanceOf(Array).isRequired,
    role_permissions: PropTypes.instanceOf(Array).isRequired,
    category_uuid: PropTypes.instanceOf(Array),
  }).isRequired,
  isWithoutStatus: PropTypes.bool.isRequired,
  isWithoutCategory: PropTypes.bool.isRequired,
  translationPath: PropTypes.string,
  isSubmitted: PropTypes.bool.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  accessItemIndex: PropTypes.number.isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  outerExpanded: PropTypes.string,
};
AccessItemComponent.defaultProps = {
  translationPath: 'UsersInfoDialog.',
  outerExpanded: undefined,
};
