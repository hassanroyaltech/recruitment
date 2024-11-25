/* eslint-disable no-underscore-dangle */
import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import {
  CheckboxesComponent,
  SwitchComponent,
  TabsComponent,
} from '../../../../../../components';
import './PermissionsManagement.Style.scss';
import { MainPermissionsTypesEnum } from '../../../../../../enums';

export const PermissionsManagementComponent = ({
  data,
  state,
  parentId,
  parentIndex,
  onStateChanged,
  permissionsKey,
  parentTranslationPath,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [expanded, setExpanded] = useState('');

  const handleExpandChange = (panel, item) => (event, isExpanded) => {
    if (item.toggles && item.toggles.length === 0) return;
    setExpanded(isExpanded ? panel : '');
  };

  /**
   * @param id
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
   * @Description this method is to get active index
   */
  const getIsChecked = useMemo(
    () => (id) => state[permissionsKey].findIndex((item) => item === id) !== -1,
    [permissionsKey, state],
  );

  /**
   * @param id
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
   * @Description this method is to get active index
   */
  const getPermissionIndex = useMemo(
    () => (id) => state[permissionsKey].findIndex((item) => item === id),
    [permissionsKey, state],
  );

  /**
   * @param id
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
   * @Description this method is to get active index
   */
  const getMainPermissionIndex = useMemo(
    () => (id) => state[permissionsKey].findIndex((item) => item === id),
    [permissionsKey, state],
  );

  return (
    <div className="permissions-wrapper px-2">
      <TabsComponent
        isPrimary
        isWithLine
        labelInput="name"
        data={data || []}
        currentTab={activeTab}
        idRef="permissionsTabsRef"
        onTabChanged={(event, currentTab) => {
          setExpanded(false);
          setActiveTab(currentTab);
        }}
      />
      <div className="d-flex px-2 pt-3">
        <SwitchComponent
          isFlexEnd
          label="active"
          isReversedLabel
          idRef="StatusSwitchRef"
          isChecked={getIsChecked(data[activeTab]._id)}
          onChange={() => {
            const { _id, features } = data[activeTab];
            const isChecked = getIsChecked(_id);
            const permissionIndex = getMainPermissionIndex(_id);
            const localRolePermissions = [...(state[permissionsKey] || [])];
            if (isChecked) {
              localRolePermissions.splice(permissionIndex, 1);
              const allRolesOfThisTab = features.reduce((total, item) => {
                const localPermissions = item.permissions.map(
                  (element) => element._id,
                );
                localPermissions.push(item.service._id);
                let localToggles = item.toggles.map((element) => element._id);
                localToggles = localToggles.concat(localPermissions);
                return total.concat(localToggles);
              }, []);
              onStateChanged({
                parentId,
                parentIndex,
                id: permissionsKey,
                value: localRolePermissions.filter(
                  (item) => !allRolesOfThisTab.includes(item),
                ),
              });
            } else {
              localRolePermissions.push(_id);
              onStateChanged({
                parentId,
                parentIndex,
                id: permissionsKey,
                value: localRolePermissions,
              });
            }
          }}
          parentTranslationPath={parentTranslationPath}
        />
      </div>
      <div className="permissions-items-wrapper">
        {data
          && data[activeTab]
          && getIsChecked(data[activeTab]._id)
          && data[activeTab].features.map((item, index) => (
            <div
              key={`${index + 1}-permission`}
              className={`permission-item ${
                item.toggles.length === 0 ? 'disabled-button' : ''
              }`}
            >
              <Accordion
                expanded={expanded === `panel-${index + 1}`}
                onChange={handleExpandChange(`panel-${index + 1}`, item)}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <div className="permission-title">{item.service.name}</div>
                  {item.permissions && item.permissions.length > 0 && (
                    <div className="permission-checkboxes-wrapper">
                      {item.permissions.map((el, i, elements) => {
                        const { _id } = el;
                        const { name } = el;

                        return (
                          <div
                            key={`check-box-${_id}-${i + 1}`}
                            className={`permission-checkboxes-item 
                                ${
                          item.permissions.length === 3
                            ? 'is-three-items'
                            : ''
                          }`}
                          >
                            <CheckboxesComponent
                              label={name}
                              singleChecked={getIsChecked(_id)}
                              idRef={`check-box-${_id}-${i + 1}`}
                              onSelectedCheckboxClicked={(event) => {
                                event.preventDefault();
                                event.stopPropagation();

                                const isChecked = getIsChecked(_id);
                                const permissionIndex = getPermissionIndex(_id);
                                let localRolesPermissions = [
                                  ...(state[permissionsKey] || []),
                                ];
                                if (isChecked) {
                                  if (el.type === MainPermissionsTypesEnum.View.key)
                                    localRolesPermissions
                                      = localRolesPermissions.filter(
                                        (roleItem) =>
                                          roleItem !== item.service._id
                                          && !elements.some(
                                            (permElement) =>
                                              permElement._id === roleItem,
                                          )
                                          && !item.toggles.some(
                                            (toggleElement) =>
                                              toggleElement._id === roleItem,
                                          ),
                                      );
                                  else
                                    localRolesPermissions.splice(permissionIndex, 1);

                                  onStateChanged({
                                    parentId,
                                    parentIndex,
                                    id: permissionsKey,
                                    value: localRolesPermissions,
                                  });
                                } else {
                                  localRolesPermissions.push(_id);

                                  if (
                                    el.type !== MainPermissionsTypesEnum.View.key
                                  ) {
                                    const viewPermissionItem = item.permissions.find(
                                      (permission) =>
                                        permission.type
                                        === MainPermissionsTypesEnum.View.key,
                                    );

                                    const viewPermissionIndex = state[
                                      permissionsKey
                                    ].findIndex(
                                      (permission) =>
                                        permission === viewPermissionItem._id,
                                    );

                                    if (viewPermissionIndex === -1) {
                                      localRolesPermissions.push(
                                        viewPermissionItem._id,
                                      );
                                      localRolesPermissions.push(item.service._id);
                                      onStateChanged({
                                        parentId,
                                        parentIndex,
                                        id: permissionsKey,
                                        value: localRolesPermissions,
                                      });
                                    } else
                                      onStateChanged({
                                        parentId,
                                        parentIndex,
                                        id: permissionsKey,
                                        value: localRolesPermissions,
                                      });
                                  } else {
                                    localRolesPermissions.push(item.service._id);
                                    onStateChanged({
                                      parentId,
                                      parentIndex,
                                      id: permissionsKey,
                                      value: localRolesPermissions,
                                    });
                                  }
                                }
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </AccordionSummary>
                <AccordionDetails>
                  <div className="permission-item-content">
                    <div className="permissions-toggles-wrapper">
                      {item.toggles
                        && item.toggles.length > 0
                        && item.toggles.map((el, i, elements) => {
                          const { _id } = el;
                          const { name } = el;
                          const { info } = el;

                          return (
                            <div key={`toggle-${_id}-${i + 1}`}>
                              <div className="toggle-wrapper">
                                <div className="toggle-title">
                                  {name}
                                  <div className="toggle-description">{info}</div>
                                </div>
                                <div className="permission-toggle-item">
                                  <SwitchComponent
                                    isFlexEnd
                                    isReversedLabel
                                    isChecked={getIsChecked(_id)}
                                    idRef={`toggle-${_id}-${i + 1}`}
                                    onChange={() => {
                                      const isChecked = getIsChecked(_id);
                                      const permissionIndex
                                        = getPermissionIndex(_id);
                                      const localRolesPermissions = [
                                        ...(state[permissionsKey] || []),
                                      ];
                                      const viewPermissionItem
                                        = item.permissions.find(
                                          (permission) =>
                                            permission.type
                                            === MainPermissionsTypesEnum.View.key,
                                        );
                                      if (isChecked) {
                                        localRolesPermissions.splice(
                                          permissionIndex,
                                          1,
                                        );
                                        const supperIndex
                                          = localRolesPermissions.indexOf(
                                            item.service._id,
                                          );
                                        if (
                                          !viewPermissionItem
                                          && !localRolesPermissions.some(
                                            (rolePermission) =>
                                              item.permissions.some(
                                                (permElement) =>
                                                  permElement._id === rolePermission,
                                              )
                                              || elements.some(
                                                (toggleElement) =>
                                                  toggleElement._id
                                                  === rolePermission,
                                              ),
                                          )
                                          && supperIndex !== -1
                                        )
                                          localRolesPermissions.splice(
                                            supperIndex,
                                            1,
                                          );
                                        onStateChanged({
                                          parentId,
                                          parentIndex,
                                          id: permissionsKey,
                                          value: localRolesPermissions,
                                        });
                                      } else {
                                        localRolesPermissions.push(_id);

                                        if (viewPermissionItem) {
                                          const viewPermissionIndex = state[
                                            permissionsKey
                                          ].findIndex(
                                            (permission) =>
                                              permission === viewPermissionItem._id,
                                          );

                                          if (
                                            el.type
                                              !== MainPermissionsTypesEnum.View.key
                                            && viewPermissionIndex === -1
                                          ) {
                                            localRolesPermissions.push(
                                              viewPermissionItem._id,
                                            );
                                            localRolesPermissions.push(
                                              item.service._id,
                                            );
                                            onStateChanged({
                                              parentId,
                                              parentIndex,
                                              id: permissionsKey,
                                              value: localRolesPermissions,
                                            });
                                          } else {
                                            localRolesPermissions.push(
                                              item.service._id,
                                            );
                                            onStateChanged({
                                              parentId,
                                              parentIndex,
                                              id: permissionsKey,
                                              value: localRolesPermissions,
                                            });
                                          }
                                        } else {
                                          const supperIndex
                                            = localRolesPermissions.indexOf(
                                              item.service._id,
                                            );
                                          if (supperIndex === -1)
                                            localRolesPermissions.push(
                                              item.service._id,
                                            );
                                          onStateChanged({
                                            parentId,
                                            parentIndex,
                                            id: permissionsKey,
                                            value: localRolesPermissions,
                                          });
                                        }
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                              {i + 1 < item.toggles.length && <hr />}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>
            </div>
          ))}
      </div>
    </div>
  );
};

PermissionsManagementComponent.propTypes = {
  state: PropTypes.shape({
    title: PropTypes.instanceOf(Object),
    roles_permissions: PropTypes.instanceOf(Array),
  }).isRequired,
  permissionsKey: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  onStateChanged: PropTypes.func.isRequired,
  data: PropTypes.instanceOf(Array).isRequired,
  parentId: PropTypes.string,
  parentIndex: PropTypes.number,
};

PermissionsManagementComponent.defaultProps = {
  parentTranslationPath: '',
  permissionsKey: 'roles_permissions',
  parentId: undefined,
  parentIndex: undefined,
};
