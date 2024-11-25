import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTitle } from '../../../hooks';
import { VisaPipelineBodySection, VisaPipelineHeaderSection } from './sections';
import { VisaFiltersDialog, VisaStagesManagementDialog } from './dialogs';
import { GlobalSavingDateFormat, showError } from '../../../helpers';
import { GetAllVisaPipelineStages } from '../../../services';
import moment from 'moment';

const parentTranslationPath = 'VisaPage';
const translationPath = 'VisaPipelinePage.';

const VisaPipelinePage = () => {
  const { t } = useTranslation(parentTranslationPath);
  useTitle(t(`${translationPath}visa-pipeline`));
  const [isLoading, setIsLoading] = useState(false);
  const [pipelineDetails, setPipelineDetails] = useState({
    stages: [],
    total_candidates: 0, // total candidates in all stages
  });
  const [isForceToReloadCandidates, setIsForceToReloadCandidates] = useState(false);
  const [firstPageStagesCandidates, setFirstPageStagesCandidates] = useState([]);
  const [isDisabledAllDragging, setIsDisabledAllDragging] = useState(false);
  const [popoverAttachedWith, setPopoverAttachedWith] = useState({
    sort: null,
  });
  const [candidatesFilters, setCandidatesFilters] = useState({
    limit: 10,
    page: 1,
    search: '',
    start_date: moment()
      .locale('en')
      .add(-2, 'month')
      .format(GlobalSavingDateFormat),
    end_date: moment().locale('en').format(GlobalSavingDateFormat),
    order_type: null,
    order_by: null,
  });
  const [isOpenDialogs, setIsOpenDialogs] = useState({
    filters: false,
    stagesManagement: false,
    visaUsedConfirm: false,
  });
  const [temporaryMovedCandidates, setTemporaryMovedCandidates] = useState({
    candidates: [],
    stage_uuid: null,
    stage_title: null,
    is_successfully_confirmed: false,
  });

  /**
   * @param newValue - object
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the update the dragging candidate details from child
   */
  const onTemporaryMovedCandidatesChanged = useCallback((newValue) => {
    setTemporaryMovedCandidates((items) => ({
      ...items,
      ...newValue,
    }));
  }, []);

  /**
   * @param newValue - object
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change the candidates filters from child
   */
  const onCandidatesFiltersChanged = useCallback((newValue) => {
    setCandidatesFilters((items) => ({
      ...items,
      ...newValue,
    }));
  }, []);

  /**
   * @param newValue - bool
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the change of is disabled all dragging
   * from child to prevent the move for candidates during saving another moving process
   */
  const onIsDisabledAllDraggingChanged = useCallback((newValue) => {
    setIsDisabledAllDragging(newValue);
  }, []);

  /**
   * @param newValue - bool
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the change of search from child
   */
  const onIsLoadingChanged = useCallback((newValue) => {
    setIsLoading(newValue);
  }, []);

  /**
   * @param key
   * @param newValue - bool
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the change of is open dialog from child
   */
  const onIsOpenDialogsChanged = useCallback((key, newValue) => {
    setIsOpenDialogs((items) => ({ ...items, [key]: newValue }));
  }, []);

  /**
   * @param { stageUUID, currentStages, toCheckCandidates, currentDraggingCandidate } - string
   * @param isWithMessage - bool - to display the reason for the candidate if true
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return if some candidates are not droppable on the current stage
   */
  const getIsDroppableSelectedCandidates = useCallback(
    ({
      stageUUID,
      // isWithMessage = false,
      currentStages,
      toCheckCandidates,
      currentDraggingCandidate,
    }) => {
      const stageIndex = currentStages.findIndex((item) => item.uuid === stageUUID);
      if (stageIndex === -1) return false;
      const localSelectedCandidates = [...(toCheckCandidates || [])];
      if (
        currentDraggingCandidate
        && !localSelectedCandidates.some(
          (item) => item.candidate.uuid === currentDraggingCandidate.candidate.uuid,
        )
      )
        localSelectedCandidates.push(currentDraggingCandidate);
      return true;
    },
    [],
  );

  /**
   * @param { candidates, targetStageItem, isReturnAsBoolean }
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the candidates that can be moved to the target stage after filter them
   */
  const getFilteredCandidates = useCallback(
    ({
      candidates,
      targetStageItem,
      // isWithMessage = false,
      isReturnAsBoolean = false,
      // isDisableOnFirstInvalidCandidate = false,
    }) => {
      const localCandidates = [...candidates];
      let filterNotFromTargetStage = localCandidates.filter(
        (candidate) => candidate.stage.uuid !== targetStageItem.uuid,
      );
      const candidatesCountBeforeCheck = filterNotFromTargetStage.length;
      if (isReturnAsBoolean)
        return filterNotFromTargetStage.length === candidatesCountBeforeCheck;
      return filterNotFromTargetStage;
    },
    [],
  );

  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the change of selected candidates from child
   */
  const onLoadedCandidatesChanged = useCallback(
    async (newCandidates, stage_uuid, isMoreCandidates = false) => {
      setPipelineDetails((items) => {
        const localItems = { ...items };
        const changedStageIndex = items.stages.findIndex(
          (item) => item.uuid === stage_uuid,
        );
        if (changedStageIndex !== -1)
          if (isMoreCandidates) {
            localItems.stages[changedStageIndex].candidates.push(
              ...newCandidates.candidates,
            );
            localItems.stages[changedStageIndex].total_candidates
              = newCandidates.total_candidates;
            return localItems;
          } else {
            localItems.stages[changedStageIndex] = {
              candidates: [],
              ...localItems.stages[changedStageIndex],
              ...newCandidates,
            };
            return localItems;
          }
        return items;
      });
    },
    [],
  );

  const getAllStagesCandidates = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllVisaPipelineStages({
      ...candidatesFilters,
    });
    setIsLoading(false);
    setIsDisabledAllDragging(false);
    // this is to clear the temporary cache candidates until the load for candidates new status done
    setTemporaryMovedCandidates(
      (items) =>
        (items.stage_uuid && {
          candidates: [],
          stage_uuid: null,
          is_successfully_confirmed: false,
        })
        || items,
    );
    if (response && response.status === 200) {
      const connectStagesWithCandidatesDetails = response.data.results.stages.map(
        (item) => {
          item.candidates
            = (response.data.results.candidates
              && response.data.results.candidates.filter(
                (candidate) => candidate.stage_uuid === item.uuid,
              ))
            || [];
          if (item.candidates.length > 10) item.candidates.length = 10;
          item.total_candidates = item.total;
          return item;
        },
      );
      setPipelineDetails((items) => ({
        ...items,
        stages: connectStagesWithCandidatesDetails,
        total_candidates: response.data.results.total_candidates || 0,
      }));
      setFirstPageStagesCandidates(connectStagesWithCandidatesDetails);
    } else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [candidatesFilters, t]);

  /**
   * @param newValue - object
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the change of stages or pipeline details changed from the child's
   */
  const onPipelineDetailsChanged = useCallback((newValue) => {
    setPipelineDetails(newValue);
  }, []);

  /**
   * @param key
   * @param newValue - eventTarget
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the change of attached popovers from child
   */
  const onPopoverAttachedWithChanged = useCallback((key, newValue) => {
    setPopoverAttachedWith((items) => ({ ...items, [key]: newValue }));
  }, []);

  // this is to change the location of the candidates to the pipeline after move successfully
  useEffect(() => {
    if (temporaryMovedCandidates.is_successfully_confirmed) {
      setIsForceToReloadCandidates((item) => !item);
      // I need this because during load the candidates again the candidate modal can be opened
      const localTemporaryMovedCandidates = { ...temporaryMovedCandidates };
      setPipelineDetails((items) => {
        const localItems = { ...items };
        if (localTemporaryMovedCandidates.candidates.length === 0) return items;
        localItems.stages = localItems.stages.map((stage) => {
          if (stage.uuid !== localTemporaryMovedCandidates.stage_uuid) {
            const removedCandidates = stage.candidates.filter((candidate) =>
              localTemporaryMovedCandidates.candidates.some(
                (element) => element.uuid === candidate.uuid,
              ),
            );

            if (removedCandidates.length > 0)
              return {
                ...stage,
                candidates: stage.candidates.filter(
                  (candidate) =>
                    !removedCandidates.some(
                      (element) => element.uuid === candidate.uuid,
                    ),
                ),
                total_candidates: stage.total_candidates - removedCandidates.length,
              };
            else return stage;
          } else {
            localTemporaryMovedCandidates.candidates
              = localTemporaryMovedCandidates.candidates.map((candidate) => ({
                ...candidate,
                stage_uuid: stage.uuid,
                move_to_stage_at: moment().unix(),
              }));
            return {
              ...stage,
              candidates: [
                ...(stage.candidates || []),
                ...localTemporaryMovedCandidates.candidates,
              ],
              total_candidates:
                stage.total_candidates
                + localTemporaryMovedCandidates.candidates.length,
            };
          }
        });

        return localItems;
      });
    }
  }, [temporaryMovedCandidates]);

  // this is to load the first page candidate on change the selected pipeline
  useEffect(() => {
    getAllStagesCandidates();
  }, [getAllStagesCandidates, isForceToReloadCandidates]);

  return (
    <div className="visa-pipeline-page-wrapper page-wrapper pt-2">
      <VisaPipelineHeaderSection
        pipelineDetails={pipelineDetails}
        candidatesFilters={candidatesFilters}
        onCandidatesFiltersChanged={onCandidatesFiltersChanged}
        onIsOpenDialogsChanged={onIsOpenDialogsChanged}
        popoverAttachedWith={popoverAttachedWith}
        onPopoverAttachedWithChanged={onPopoverAttachedWithChanged}
        isLoading={isLoading}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
      {firstPageStagesCandidates.length > 0 && (
        <div className="pipeline-management-body-wrapper">
          <VisaPipelineBodySection
            onIsLoadingChanged={onIsLoadingChanged}
            isLoading={isLoading}
            pipelineDetails={pipelineDetails}
            isDisabledAllDragging={isDisabledAllDragging}
            firstPageStagesCandidates={firstPageStagesCandidates}
            onIsDisabledAllDraggingChanged={onIsDisabledAllDraggingChanged}
            isForceToReloadCandidates={isForceToReloadCandidates}
            getIsDroppableSelectedCandidates={getIsDroppableSelectedCandidates}
            getFilteredCandidates={getFilteredCandidates}
            temporaryMovedCandidates={temporaryMovedCandidates}
            onPipelineDetailsChanged={onPipelineDetailsChanged}
            onLoadedCandidatesChanged={onLoadedCandidatesChanged}
            onTemporaryMovedCandidatesChanged={onTemporaryMovedCandidatesChanged}
            candidatesFilters={candidatesFilters}
            onIsOpenDialogsChanged={onIsOpenDialogsChanged}
            isOpenDialogs={isOpenDialogs}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            getAllStagesCandidates={getAllStagesCandidates}
          />
        </div>
      )}
      {isOpenDialogs.stagesManagement && (
        <VisaStagesManagementDialog
          isOpen={isOpenDialogs.stagesManagement}
          onSave={() => {
            setCandidatesFilters((items) => ({ ...items, page: 1 }));
          }}
          isOpenChanged={() => onIsOpenDialogsChanged('stagesManagement', false)}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
      {isOpenDialogs.filters && (
        <VisaFiltersDialog
          isOpen={isOpenDialogs.filters}
          candidatesFilters={candidatesFilters}
          onSave={(newValues) => {
            setCandidatesFilters((items) => ({ ...items, page: 1, ...newValues }));
          }}
          isOpenChanged={() => onIsOpenDialogsChanged('filters', false)}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
    </div>
  );
};

export default VisaPipelinePage;
