import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import {
  GetAllSetupsEmployees,
  GetAllSetupsGroupPermissions,
  GetAllSetupsPositions,
  GetAllSetupsUsers,
  getSetupsEmployeesById,
  GetSetupsGroupPermissionById,
  getSetupsPositionsById,
  getSetupsUsersById,
} from '../../../../../../../../../../../services';
import {
  PipelineStageUsersTypesEnum,
  SystemActionsEnum,
} from '../../../../../../../../../../../enums';
import {
  LoadableImageComponant,
  PopoverComponent,
} from '../../../../../../../../../../../components';
import defaultUserImage from '../../../../../../../../../../../assets/icons/user-avatar.svg';
import { ResponsibilityManagementSection } from './sections';
import './StageResponsibility.Style.scss';
import { StringToColor } from '../../../../../../../../../../../helpers';

export const StageResponsibilitySection = ({
  onStateChanged,
  activeStage,
  stageItem,
  onRemoveItemClicked,
  enableKey,
  arrayKey,
  stageUsersTypes,
  errors,
  isSubmitted,
  titleDescription,
  managementTitle,
  managementTitleDescription,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [
    responsibilityManagementPopoverAttachedWith,
    setResponsibilityManagementPopoverAttachedWith,
  ] = useState(null);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to toggle the page popovers
   */
  const popoverToggleHandler = useCallback((event) => {
    setResponsibilityManagementPopoverAttachedWith(
      (event && event.currentTarget) || null,
    );
  }, []);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the API based on the user type
   */
  const getUserAPIByType = useCallback((relation_type) => {
    if (relation_type === PipelineStageUsersTypesEnum.Employees.key)
      return {
        getDataAPI: GetAllSetupsEmployees,
        getItemByIdAPI: getSetupsEmployeesById,
      };
    if (relation_type === PipelineStageUsersTypesEnum.Positions.key)
      return {
        getDataAPI: GetAllSetupsPositions,
        getItemByIdAPI: getSetupsPositionsById,
      };
    if (relation_type === PipelineStageUsersTypesEnum.Teams.key)
      return {
        getDataAPI: GetAllSetupsGroupPermissions,
        getItemByIdAPI: GetSetupsGroupPermissionById,
      };
    if (relation_type === PipelineStageUsersTypesEnum.Users.key)
      return {
        getDataAPI: GetAllSetupsUsers,
        getItemByIdAPI: getSetupsUsersById,
      };
    return {};
  }, []);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the users list by type
   */
  const getUsersByType = useCallback(
    (relation_type) =>
      (stageItem
        && stageItem[arrayKey]
        && stageItem[arrayKey].filter(
          (item) => item.relation_type === relation_type,
        ))
      || [],
    [arrayKey, stageItem],
  );

  return (
    <div className="stage-responsibility-section-wrapper section-wrapper">
      <div className="responsibility-description-wrapper">
        <div className="description-text px-2">
          <span>
            <span>{t(`${translationPath}${titleDescription}`)}</span>
            <span>:</span>
          </span>
        </div>
        {stageItem
          && stageItem[arrayKey]
          && !stageItem[enableKey]
          && stageItem[arrayKey].length > 0 && (
          <ButtonBase
            className="btns-icon theme-transparent c-warning mx-2"
            onClick={() => {
              onStateChanged({
                parentId: 'stages',
                parentIndex: activeStage,
                id: arrayKey,
                value: [],
              });
            }}
          >
            <span className={SystemActionsEnum.delete.icon} />
          </ButtonBase>
        )}
      </div>
      {errors[`stages[${activeStage}][${arrayKey}]`]
        && errors[`stages[${activeStage}][${arrayKey}]`].error
        && isSubmitted && (
        <div className="c-error fz-10 mb-2">
          <span>{errors[`stages[${activeStage}][${arrayKey}]`].message}</span>
        </div>
      )}
      <div className="px-2">
        {stageItem && stageItem[arrayKey] && !stageItem[enableKey] && (
          <div className="stage-responsibility-items-wrapper">
            {stageItem[arrayKey].map((element, index, elements) => (
              <div
                className="stage-responsibility-item-wrapper"
                key={`stageResponsibilityKey${arrayKey}${index + 1}`}
              >
                <div className="responsibility-item-body">
                  {((element.url || !element.name) && (
                    <LoadableImageComponant
                      classes="user-image-wrapper"
                      alt={element.name || t(`${translationPath}user-image`)}
                      src={element.url || defaultUserImage}
                    />
                  )) || (
                    <Avatar
                      style={{
                        backgroundColor: StringToColor(element.name),
                      }}
                    >
                      {(element.name
                        && element.name
                          .split(' ')
                          .filter(
                            (nameItem, nameIndex, names) =>
                              nameIndex === 0 || nameIndex === names.length - 1,
                          )
                          .map((word) => word[0]))
                        || ''}
                    </Avatar>
                  )}
                  <span className="px-2">{element.name}</span>
                  <ButtonBase
                    className="btns-icon theme-transparent"
                    onClick={onRemoveItemClicked({
                      parentIndex: activeStage,
                      elementIndex: index,
                      key: arrayKey,
                      items: elements,
                    })}
                  >
                    <span className="fas fa-times" />
                  </ButtonBase>
                </div>
              </div>
            ))}
          </div>
        )}
        {stageItem && (
          <div className="stage-responsibility-item-wrapper">
            <ButtonBase
              className={`btns theme-outline mx-0${
                (responsibilityManagementPopoverAttachedWith && ' is-active') || ''
              }`}
              onClick={popoverToggleHandler}
            >
              {(stageItem[enableKey] && (
                <>
                  <span className="far fa-user" />
                  <span className="px-2">{t(`${translationPath}anyone`)}</span>
                  <span
                    className={`fas fa-caret-${
                      (responsibilityManagementPopoverAttachedWith && 'up') || 'down'
                    }`}
                  />
                </>
              )) || (
                <>
                  <span className="fas fa-plus" />
                  <span className="px-2">{t(`${translationPath}add`)}</span>
                </>
              )}
            </ButtonBase>
          </div>
        )}
        {isSubmitted && errors[`stages[${activeStage}].${arrayKey}`] && (
          <div className="c-error fz-10 mb-2 px-2">
            <span>{errors[`stages[${activeStage}].${arrayKey}`].message}</span>
          </div>
        )}
      </div>

      {/* <SharedAutocompleteControl */}
      {/*    isHalfWidth */}
      {/*    title="user-type" */}
      {/*    errors={errors} */}
      {/*    stateKey="relation_type" */}
      {/*    parentId="stages" */}
      {/*    searchKey="search" */}
      {/*    parentIndex={activeStage} */}
      {/*    subParentId="responsibility" */}
      {/*    subParentIndex={index} */}
      {/*    placeholder="select-user-type" */}
      {/*    editValue={element.relation_type} */}
      {/*    isDisabled={isLoading} */}
      {/*    isSubmitted={isSubmitted} */}
      {/*    onValueChanged={onStateChanged} */}
      {/*    initValues={stageUsersTypes} */}
      {/*    translationPath={translationPath} */}
      {/*    parentTranslationPath={parentTranslationPath} */}
      {/*    errorPath={`stages[${index}].responsibility[${index}].relation_type`} */}
      {/*    getOptionLabel={(option) => t(`${translationPath}${option.title}`)} */}
      {/* /> */}
      {/* {element.relation_type && ( */}
      {/*    <SharedAPIAutocompleteControl */}
      {/*        isHalfWidth */}
      {/*        title="users" */}
      {/*        placeholder="select-users" */}
      {/*        errors={errors} */}
      {/*        stateKey="users" */}
      {/*        parentId="stages" */}
      {/*        searchKey="search" */}
      {/*        parentIndex={activeStage} */}
      {/*        subParentId="responsibility" */}
      {/*        subParentIndex={index} */}
      {/*        editValue={element.users} */}
      {/*        isDisabled={isLoading} */}
      {/*        isSubmitted={isSubmitted} */}
      {/*        onValueChanged={onStateChanged} */}
      {/*        translationPath={translationPath} */}
      {/*        getDataAPI={getUserAPIByType().getDataAPI} */}
      {/*        getItemByIdAPI={getUserAPIByType().getItemByIdAPI} */}
      {/*        parentTranslationPath={parentTranslationPath} */}
      {/*        type={DynamicFormTypesEnum.array.key} */}
      {/*        errorPath={`stages[${activeStage}].responsibility[${index}].users`} */}
      {/*        getOptionLabel={(option) => */}
      {/*            `${ */}
      {/*                option.first_name && */}
      {/*                (option.first_name[i18next.language] || option.first_name.en) */}
      {/*            }${ */}
      {/*                option.last_name && */}
      {/*                ` ${option.last_name[i18next.language] || option.last_name.en}` */}
      {/*            }` */}
      {/*        } */}
      {/*        extraProps={{ */}
      {/*            ...(element.users?.length && { with_than: element.users }), */}
      {/*        }} */}
      {/*    /> */}
      {/* )} */}
      {responsibilityManagementPopoverAttachedWith && (
        <PopoverComponent
          idRef={`responsibilityManagementPopover${arrayKey}`}
          attachedWith={responsibilityManagementPopoverAttachedWith}
          handleClose={() => popoverToggleHandler(null)}
          popoverClasses="responsibility-management-popover-wrapper"
          component={
            <ResponsibilityManagementSection
              stageItem={stageItem}
              onStateChanged={onStateChanged}
              activeStage={activeStage}
              onRemoveItemClicked={onRemoveItemClicked}
              getUserAPIByType={getUserAPIByType}
              enableKey={enableKey}
              arrayKey={arrayKey}
              stageUsersTypes={stageUsersTypes}
              getUsersByType={getUsersByType}
              managementTitle={managementTitle}
              managementTitleDescription={managementTitleDescription}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          }
        />
      )}
    </div>
  );
};

StageResponsibilitySection.propTypes = {
  activeStage: PropTypes.number.isRequired,
  stageItem: PropTypes.instanceOf(Object).isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  enableKey: PropTypes.string.isRequired,
  arrayKey: PropTypes.string.isRequired,
  titleDescription: PropTypes.string.isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  stageUsersTypes: PropTypes.instanceOf(Array).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  onRemoveItemClicked: PropTypes.func.isRequired,
  managementTitle: PropTypes.string.isRequired,
  managementTitleDescription: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
