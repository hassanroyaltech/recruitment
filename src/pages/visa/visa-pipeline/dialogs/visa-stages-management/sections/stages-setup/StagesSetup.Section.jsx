import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ConfirmDeleteDialog } from '../../../../../../setups/shared';
import { ActiveStageSection, StagesNavigatorSection } from './sections';
import {
  DeleteVisaStage,
  GetAllVisaStagesReminderTypes,
  UpdateVisaStagesReorder,
} from '../../../../../../../services';
import { VisaStagePeriodTypesEnum } from '../../../../../../../enums';
import { GetReorderDraggedItems } from '../../../../../../evabrand/helpers';
import { showError, showSuccess } from '../../../../../../../helpers';
import './StagesSetup.Style.scss';

export const StagesSetupSection = ({
  state,
  isSubmitted,
  isLoading,
  errors,
  onStateChanged,
  onIsLoadingChanged,
  isOpenChanged,
  onStageChanged,
  parentTranslationPath,
  translationPath,
  activeStage,
  onActiveStageChanged,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [localActiveItem, setLocalActiveItem] = useState(null);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [stageReminderTypes, setStageReminderTypes] = useState([]);
  const [isLoadingReminderTypes, setIsLoadingReminderTypes] = useState(false);
  const [durationTypes] = useState(() =>
    Object.values(VisaStagePeriodTypesEnum).map((item) => ({
      ...item,
      value: t(`${translationPath}${item.value}`),
    })),
  );

  const reorderStagesChangedHandler = async ({
    reorderedItems,
    sourceIndex,
    destinationIndex,
  }) => {
    const localReorderedItems = reorderedItems || [...(state.stages || [])];
    if (!reorderedItems) {
      localReorderedItems.splice(
        destinationIndex,
        0,
        localReorderedItems.splice(sourceIndex, 1)[0],
      );
      if (activeStage === destinationIndex) onActiveStageChanged(sourceIndex);
      if (activeStage === sourceIndex) onActiveStageChanged(destinationIndex);
    }
    localReorderedItems.map((item, index) => {
      // eslint-disable-next-line no-param-reassign
      item.order = index;
      return undefined;
    });
    const saveReorderForSavedStages = localReorderedItems.filter(
      (item) => item.uuid,
    );
    if (saveReorderForSavedStages.length > 0) {
      onIsLoadingChanged(true);
      const response = await UpdateVisaStagesReorder({
        stages: saveReorderForSavedStages.map((item) => ({
          uuid: item.uuid,
          order: item.order,
        })),
      });
      onIsLoadingChanged(false);
      if (response && response.status === 200) {
        onStageChanged({
          stageIndex: destinationIndex,
          oldStageLocation: sourceIndex,
          isReorderStage: true,
        });
        showSuccess(t(`${translationPath}stages-reordered-successfully`));
        onStateChanged({ id: 'stages', value: [...localReorderedItems] });
      } else showError(t(`${translationPath}stages-reorder-failed`));
    } else {
      onStageChanged({
        stageIndex: destinationIndex,
        oldStageLocation: sourceIndex,
        isReorderStage: true,
      });
      onStateChanged({ id: 'stages', value: [...localReorderedItems] });
    }
  };
  /**
   * @param dropEvent
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to reorder stages items
   */
  const onDragEndHandler = (dropEvent) => {
    const reorderedItems = GetReorderDraggedItems(dropEvent, state.stages);
    if (!reorderedItems) return;
    if (activeStage === dropEvent.destination.index)
      onActiveStageChanged(dropEvent.source.index);
    else if (activeStage === dropEvent.source.index)
      onActiveStageChanged(dropEvent.destination.index);
    else if (
      dropEvent.destination.index < activeStage
      && dropEvent.source.index > activeStage
    )
      onActiveStageChanged(activeStage + 1);
    else if (
      dropEvent.destination.index > activeStage
      && dropEvent.source.index < activeStage
    )
      onActiveStageChanged(activeStage - 1);
    reorderStagesChangedHandler({
      reorderedItems,
      destinationIndex: dropEvent.destination.index,
      sourceIndex: dropEvent.source.index,
    });
  };

  /**
   * @param items
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to add new stage to the array
   */
  const addStageHandler = useCallback(
    (currentStages) => () => {
      const localStates = [...currentStages];
      localStates.push({
        title: '',
        order: localStates.length,
        can_delete: true,
        has_reminder: false,
        reminder: null,
        is_effective: false,
        in_dashboard: false,
        stage_color: null,
      });

      onStageChanged({ stageIndex: localStates.length - 1 });
      onStateChanged({
        id: 'stages',
        value: localStates,
      });
    },
    [onStageChanged, onStateChanged],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the workflow options & enums
   */
  const getVisaStagesReminderTypes = useCallback(async () => {
    setIsLoadingReminderTypes(true);
    const response = await GetAllVisaStagesReminderTypes();
    setIsLoadingReminderTypes(false);
    if (response && response.status === 200) {
      const {
        data: { results },
      } = response;
      setStageReminderTypes(results);
    } else {
      showError(t('Shared:failed-to-get-saved-data'), response);
      isOpenChanged();
    }
  }, [isOpenChanged, t]);

  /**
   * @param stageIndex
   * @param item
   * @param items
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to remove stages from the array
   */
  const onDeleteStageClicked = useCallback(
    (stageIndex, item, items = []) =>
      () => {
        const localStages = [...items];
        if (item.uuid) {
          setIsOpenDeleteDialog(true);
          setLocalActiveItem({ ...item, stageIndex });
        } else {
          localStages.splice(stageIndex, 1);
          localStages.map((element, index) => {
            // eslint-disable-next-line no-param-reassign
            element.order = index;
            return undefined;
          });
          onStateChanged({
            id: 'stages',
            value: localStages,
          });
          onStageChanged({ stageIndex: stageIndex, isRemove: true });
        }
      },
    [onStageChanged, onStateChanged],
  );

  // this to get table data on init
  useEffect(() => {
    getVisaStagesReminderTypes();
  }, [getVisaStagesReminderTypes]);

  return (
    <div className="stages-setup-section-wrapper">
      <StagesNavigatorSection
        state={state}
        activeStage={activeStage}
        addStageHandler={addStageHandler}
        onActiveStageChanged={onActiveStageChanged}
        onDeleteStageClicked={onDeleteStageClicked}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onDragEndHandler={onDragEndHandler}
        reorderStagesChangedHandler={reorderStagesChangedHandler}
        isLoading={isLoading}
      />
      {activeStage >= 0 && activeStage < state.stages.length && (
        <ActiveStageSection
          state={state}
          activeStage={activeStage}
          stageItem={state.stages[activeStage]}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isLoading={isLoading}
          errors={errors}
          durationTypes={durationTypes}
          stageReminderTypes={stageReminderTypes}
          isLoadingReminderTypes={isLoadingReminderTypes}
          onDeleteStageClicked={onDeleteStageClicked}
          onStateChanged={onStateChanged}
          isSubmitted={isSubmitted}
        />
      )}

      {isOpenDeleteDialog && (
        <ConfirmDeleteDialog
          activeItem={localActiveItem}
          successMessage="stage-deleted-successfully"
          onSave={() => {
            const localStages = [...state.stages];
            localStages.splice(localActiveItem.stageIndex, 1);
            localStages.map((element, index) => {
              // eslint-disable-next-line no-param-reassign
              element.order = index;
              return undefined;
            });
            onStageChanged({
              stageIndex: localActiveItem.stageIndex,
              isRemove: true,
            });
            // u may to need to call API to reorder the stages from backend on delete
            onStateChanged({ id: 'stages', value: localStages });
          }}
          isOpenChanged={() => {
            setIsOpenDeleteDialog(false);
            setLocalActiveItem(null);
          }}
          descriptionMessage="stage-delete-description"
          deleteApi={DeleteVisaStage}
          apiProps={{
            uuid: localActiveItem && localActiveItem.uuid,
          }}
          errorMessage="stage-delete-failed"
          activeItemKey="uuid"
          apiDeleteKey="uuid"
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isOpen={isOpenDeleteDialog}
        />
      )}
    </div>
  );
};

StagesSetupSection.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  isOpenChanged: PropTypes.instanceOf(Object).isRequired,
  onStageChanged: PropTypes.func.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  onIsLoadingChanged: PropTypes.func.isRequired,
  activeStage: PropTypes.number.isRequired,
  onActiveStageChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
StagesSetupSection.defaultProps = {
  activePipelineItem: null,
};
