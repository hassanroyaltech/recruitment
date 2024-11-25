import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { SystemActionsEnum } from '../../../../../../../../../../../enums';
import {
  LoadableImageComponant,
  PopoverComponent,
} from '../../../../../../../../../../../components';
import defaultUserImage from '../../../../../../../../../../../assets/icons/user-avatar.svg';
import { ActionsManagementSection } from './sections';
import './CandidateActions.Style.scss';
import { StringToColor } from '../../../../../../../../../../../helpers';

export const CandidateActionsSection = ({
  onStateChanged,
  activeStage,
  stageItem,
  onRemoveItemClicked,
  enableKey,
  arrayKey,
  stageCandidateActionsEnum,
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
    actionsManagementPopoverAttachedWith,
    setActionsManagementPopoverAttachedWith,
  ] = useState(null);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to toggle the page popovers
   */
  const popoverToggleHandler = useCallback((event) => {
    setActionsManagementPopoverAttachedWith((event && event.currentTarget) || null);
  }, []);

  /**
   * type - the current key for enum
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the current type enum item
   */
  const getCandidateActionEnumItem = useMemo(
    () => (type) =>
      stageCandidateActionsEnum.find((item) => item.key === type) || {},
    [stageCandidateActionsEnum],
  );

  return (
    <div className="candidate-actions-section-wrapper section-wrapper">
      <div className="candidate-actions-description-wrapper">
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
        <div className="d-flex c-error fz-10 mb-2">
          <span>{errors[`stages[${activeStage}][${arrayKey}]`].message}</span>
        </div>
      )}
      <div className="d-flex flex-wrap px-2">
        {stageItem && stageItem[arrayKey] && !stageItem[enableKey] && (
          <div className="candidate-actions-items-wrapper">
            {stageItem[arrayKey].map((element, index, elements) => (
              <React.Fragment key={`candidateActionsKey${arrayKey}${index + 1}`}>
                {((!getCandidateActionEnumItem(element.type).listDetails
                  || !element[
                    getCandidateActionEnumItem(element.type).listDetails.savingKey
                  ]
                  || element[
                    getCandidateActionEnumItem(element.type).listDetails.savingKey
                  ].length === 0) && (
                  <div className="candidate-actions-item-wrapper">
                    <div className="candidate-actions-item-body">
                      {((element.url
                        || !getCandidateActionEnumItem(element.type).value) && (
                        <LoadableImageComponant
                          classes="user-image-wrapper"
                          alt={t(`${translationPath}action-image`)}
                          src={element.url || defaultUserImage}
                        />
                      )) || (
                        <Avatar
                          style={{
                            backgroundColor: StringToColor(
                              getCandidateActionEnumItem(element.type).value,
                            ),
                          }}
                        >
                          {getCandidateActionEnumItem(element.type)
                            .value.split(' ')
                            .filter(
                              (nameItem, nameIndex, names) =>
                                nameIndex === 0 || nameIndex === names.length - 1,
                            )
                            .map((word) => word[0]) || ''}
                        </Avatar>
                      )}
                      <span className="px-2">
                        {getCandidateActionEnumItem(element.type).value}
                      </span>
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
                ))
                  || element[
                    getCandidateActionEnumItem(element.type).listDetails.fullDataKey
                  ]?.map((item, itemIndex, items) => (
                    <div
                      className="candidate-actions-item-wrapper"
                      key={`candidateActionsKey${arrayKey}${index + 1}-${
                        itemIndex + 1
                      }`}
                    >
                      <div className="candidate-actions-item-body">
                        {((item.url || !item.name) && (
                          <LoadableImageComponant
                            classes="user-image-wrapper"
                            alt={t(`${translationPath}action-image`)}
                            src={item.url || defaultUserImage}
                          />
                        )) || (
                          <Avatar
                            style={{
                              backgroundColor: StringToColor(item.name),
                            }}
                          >
                            {(item.name
                              && item.name
                                .split(' ')
                                .filter(
                                  (nameItem, nameIndex, names) =>
                                    nameIndex === 0
                                    || nameIndex === names.length - 1,
                                )
                                .map((word) => word[0]))
                              || ''}
                          </Avatar>
                        )}
                        <span className="px-2">
                          <span>
                            {getCandidateActionEnumItem(element.type).value}
                          </span>
                          <span className="px-1">-</span>
                          <span>{item.name}</span>
                        </span>
                        <ButtonBase
                          className="btns-icon theme-transparent"
                          onClick={() => {
                            const localListDetails = getCandidateActionEnumItem(
                              element.type,
                            ).listDetails;
                            const localSavedActions
                              = element[localListDetails.savingKey];
                            const localSavedIndex = localSavedActions.findIndex(
                              (action) => action === item.uuid,
                            );
                            console.log({
                              localSavedActions,
                              localSavedIndex,
                              items,
                              item,
                              element,
                              elements,
                            });
                            if (localSavedIndex !== -1)
                              onRemoveItemClicked({
                                parentIndex: activeStage,
                                subParentId: arrayKey,
                                subParentIndex: index,
                                elementIndex: localSavedIndex,
                                key: localListDetails.savingKey,
                                items: localSavedActions,
                              })();
                            onRemoveItemClicked({
                              parentIndex: activeStage,
                              subParentId: arrayKey,
                              subParentIndex: index,
                              elementIndex: itemIndex,
                              key: localListDetails.fullDataKey,
                              items,
                            })();
                          }}
                        >
                          <span className="fas fa-times" />
                        </ButtonBase>
                      </div>
                    </div>
                  ))}
              </React.Fragment>
            ))}
          </div>
        )}
        {stageItem && (
          <div className="candidate-actions-item-wrapper">
            <ButtonBase
              className={`btns theme-outline mx-0${
                (actionsManagementPopoverAttachedWith && ' is-active') || ''
              }`}
              onClick={popoverToggleHandler}
            >
              {(stageItem[enableKey] && (
                <>
                  <span className="far fa-user" />
                  <span className="px-2">{t(`${translationPath}any-action`)}</span>
                  <span
                    className={`fas fa-caret-${
                      (actionsManagementPopoverAttachedWith && 'up') || 'down'
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
          <div className="d-flex c-error fz-10 mb-2 px-2">
            <span>{errors[`stages[${activeStage}].${arrayKey}`].message}</span>
          </div>
        )}
      </div>
      {actionsManagementPopoverAttachedWith && (
        <PopoverComponent
          idRef={`actionsManagementPopover${arrayKey}`}
          attachedWith={actionsManagementPopoverAttachedWith}
          handleClose={() => popoverToggleHandler(null)}
          popoverClasses="candidate-actions-management-popover-wrapper"
          component={
            <ActionsManagementSection
              stageItem={stageItem}
              onStateChanged={onStateChanged}
              activeStage={activeStage}
              onRemoveItemClicked={onRemoveItemClicked}
              enableKey={enableKey}
              arrayKey={arrayKey}
              stageCandidateActionsEnum={stageCandidateActionsEnum}
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

CandidateActionsSection.propTypes = {
  activeStage: PropTypes.number.isRequired,
  stageItem: PropTypes.instanceOf(Object).isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  enableKey: PropTypes.string.isRequired,
  arrayKey: PropTypes.string.isRequired,
  titleDescription: PropTypes.string.isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  stageCandidateActionsEnum: PropTypes.instanceOf(Array).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  onRemoveItemClicked: PropTypes.func.isRequired,
  managementTitle: PropTypes.string.isRequired,
  managementTitleDescription: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
