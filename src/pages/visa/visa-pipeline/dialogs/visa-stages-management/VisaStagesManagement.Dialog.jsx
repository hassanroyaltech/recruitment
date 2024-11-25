import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import {
  CreateVisaStage,
  GetAllVisaStages,
  UpdateVisaStage,
} from '../../../../../services';
import { getErrorByName, showError, showSuccess } from '../../../../../helpers';
import { DialogComponent } from '../../../../../components';
import {
  ConfirmDeleteDialog,
  SetupsReducer,
  SetupsReset,
} from '../../../../setups/shared';
import './VisaStagesManagement.Style.scss';
import { StagesSetupSection } from './sections';

export const VisaStagesManagementDialog = ({
  isOpen,
  onSave,
  isOpenChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const changedStagesRef = useRef([]);
  const [errors, setErrors] = useState({});
  const [activeStage, setActiveStage] = useState(0);

  const [state, setState] = useReducer(
    SetupsReducer,
    {
      stages: [],
    },
    SetupsReset,
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get form errors
   */
  const getErrors = useCallback(async () => {
    const result = await getErrorByName(
      {
        current: yup.object().shape({
          stages: yup
            .array()
            .of(
              yup.object().shape({
                reminder: yup.lazy((value, { parent }) =>
                  yup
                    .object()
                    .shape(
                      (parent.has_reminder && {
                        action_type: yup
                          .string()
                          .nullable()
                          .required(t('Shared:this-field-is-required')),
                        delay: yup
                          .number()
                          .nullable()
                          .min(1, `${t('Shared:this-field-must-be-more-than')} ${0}`)
                          .required(t('Shared:this-field-is-required')),
                        delay_type: yup
                          .string()
                          .nullable()
                          .required(t('Shared:this-field-is-required')),
                      }) || {
                        action_type: yup.string().nullable(),
                        delay: yup.number().nullable(),
                        delay_type: yup.string().nullable(),
                      },
                    )
                    .nullable(),
                ),
                has_reminder: yup.boolean().nullable(),
                title: yup
                  .string()
                  .nullable()
                  .required(t('Shared:this-field-is-required'))
                  .min(
                    3,
                    `${t('Shared:this-field-must-be-more-than')} ${3} ${t(
                      'Shared:characters',
                    )}`,
                  )
                  .max(
                    255,
                    `${t('Shared:this-field-must-be-less-than')} ${255} ${t(
                      'Shared:characters',
                    )}`,
                  ),
                is_effective: yup.boolean().nullable(),
                in_dashboard: yup.boolean().nullable(),
                stage_color: yup
                  .string()
                  .nullable()
                  .required(t('Shared:this-field-is-required')),
              }),
            )
            .nullable()
            .min(
              1,
              `${t('Shared:please-add-at-least')} ${1} ${t(
                `${translationPath}stage`,
              )}`,
            ),
        }),
      },
      state,
    );
    setErrors(result);
  }, [state, t, translationPath]);

  /**
   * @param {stageIndex, isRemove, isReorderStage, oldStageLocation}
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this is to identify which method has been changed but not saved yet
   */
  const onStageChanged = useCallback(
    ({ stageIndex, isRemove, isReorderStage, oldStageLocation }) => {
      if (isReorderStage) {
        const itemIndex = changedStagesRef.current.indexOf(oldStageLocation);
        if (itemIndex !== -1)
          changedStagesRef.current.splice(itemIndex, 1, stageIndex);
        return;
      }
      const itemIndex = changedStagesRef.current.indexOf(stageIndex);
      if (itemIndex === -1) changedStagesRef.current.push(stageIndex);
      if (isRemove && itemIndex !== -1)
        changedStagesRef.current.splice(itemIndex, 1);
    },
    [],
  );

  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this is to change the active focus stage
   */
  const onActiveStageChanged = useCallback((newValue) => {
    setActiveStage(newValue);
  }, []);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get update the state
   */
  const onStateChanged = useCallback(
    (newValue) => {
      setState(newValue);
      if (
        (newValue.parentIndex || newValue.parentIndex === 0)
        && newValue.id !== 'uuid'
      )
        onStageChanged({ stageIndex: newValue.parentIndex });
    },
    [onStageChanged],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get update the isLoading
   */
  const onIsLoadingChanged = (newValue) => {
    setIsLoading(newValue);
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get all stages on edit
   */
  const getAllVisaStages = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllVisaStages({
      limit: 200,
      page: 1,
      use_for: 'list',
    });
    setIsLoading(false);
    if (response && response.status === 200)
      setState({
        id: 'stages',
        value: response.data.results,
      });
    else {
      showError(t('Shared:failed-to-get-saved-data'), response);
      if (isOpenChanged) isOpenChanged();
    }
  }, [isOpenChanged, t]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the name if the stages that will be removed
   */
  const getStagesNames = useCallback(
    () =>
      changedStagesRef.current && (
        <ul className="px-3 mb-0">
          {changedStagesRef.current.map((item) => (
            <li key={`stagesKeys${item}`}>
              {state.stages[item].title
                || `${t(`${translationPath}stage-#`)} ${item + 1}`}
            </li>
          ))}
        </ul>
      ),
    [state.stages, t, translationPath],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the close for the staging dialog
   */
  const onCancelHandler = useCallback(() => {
    if (changedStagesRef.current.length > 0) setIsOpenConfirmDialog(true);
    else if (isOpenChanged) isOpenChanged();
  }, [isOpenChanged]);

  /**
   * @param index
   * @param isLastStageChanged - if it's the last unsaved changed stage
   * @param isBulkSaving - if this method called from template save button
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle saving for each stage
   */
  const saveStagesHandler = async (index, isLastStageChanged, isBulkSaving) => {
    if (changedStagesRef.current.indexOf(index) === -1) return;
    if (Object.keys(errors).length > 0) {
      if (errors.stages) {
        showError(errors.stages.message);
        return;
      }
      return;
      // if (Object.keys(errors).some((item) => item.includes(`stages[${index}]`))) {
      //   setActiveStage(())
      //   return;
      // }
    }
    setIsLoading(true);
    let response;
    if (state.stages[index].uuid)
      response = await UpdateVisaStage(state.stages[index]);
    else response = await CreateVisaStage(state.stages[index]);
    setIsLoading(false);
    if (
      response
      && (response.status === 200 || response.status === 201 || response.status === 202)
    ) {
      if (!isBulkSaving || isLastStageChanged)
        showSuccess(
          t(
            `${translationPath}${
              (state.stages[index].uuid && 'visa-stages-updated-successfully')
              || 'visa-stages-created-successfully'
            }`,
          ),
        );
      if (isLastStageChanged && Object.keys(errors).length === 0) {
        if (onSave) onSave();
        if (isOpenChanged) isOpenChanged();
      } else if (!isBulkSaving) {
        const changedStageLocation = changedStagesRef.current.indexOf(index);
        if (changedStageLocation !== -1)
          changedStagesRef.current.splice(changedStageLocation, 1);
        onStateChanged({
          parentId: 'stages',
          parentIndex: index,
          id: 'uuid',
          value: response.data.results.uuid,
        });
        if (Object.keys(errors).length > 0) {
          const firstInvalidStageIndex = Object.keys(errors).findIndex((item) =>
            item.startsWith('stages'),
          );
          if (firstInvalidStageIndex !== -1) setActiveStage(firstInvalidStageIndex);
        }
      }
    } else
      showError(
        t(
          `${translationPath}${
            (state.stages
              && state.stages[index]
              && state.stages[index].uuid
              && 'visa-stages-update-failed')
            || 'visa-stages-create-failed'
          }`,
        ),
        response,
      );
  };

  /**
   * @param event
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle saving the stages & pipeline template
   */
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (changedStagesRef.current.length === 0 && Object.keys(errors).length === 0) {
      if (isOpenChanged) isOpenChanged();
      return;
    }
    if (Object.keys(errors).length === 0)
      changedStagesRef.current.map(
        async (item, index, items) =>
          await saveStagesHandler(activeStage, index === items.length - 1, true),
      );
    else await saveStagesHandler(activeStage, changedStagesRef.current.length === 1);
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to disable the saving for single stage button if not changed
   */
  const getIsChangedStage = useMemo(
    () => () => changedStagesRef.current.indexOf(activeStage) !== -1,
    [activeStage, changedStagesRef],
  );

  // this is to get the saved stages on init
  useEffect(() => {
    getAllVisaStages();
  }, [getAllVisaStages]);

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  return (
    <>
      <DialogComponent
        isWithFullScreen
        titleIcon="fas fa-signal"
        titleText="visa-stages"
        maxWidth="lg"
        // maxWidth="xs"
        contentFooterClasses="px-0 pb-0"
        contentClasses="px-0 pb-0"
        wrapperClasses="visa-stages-dialog-wrapper"
        dialogContent={
          <div className="visa-stages-management-dialog-content-wrapper">
            <div className="description-text mb-3 px-3">
              <span>{t(`${translationPath}visa-management-description`)}</span>
            </div>
            <StagesSetupSection
              state={state}
              isSubmitted={isSubmitted}
              isLoading={isLoading}
              errors={errors}
              isOpenChanged={isOpenChanged}
              activeStage={activeStage}
              onActiveStageChanged={onActiveStageChanged}
              onStateChanged={onStateChanged}
              onIsLoadingChanged={onIsLoadingChanged}
              onStageChanged={onStageChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          </div>
        }
        isSaving={isLoading}
        saveIsDisabled={!getIsChangedStage()}
        isOpen={isOpen}
        onSubmit={saveHandler}
        onCancelClicked={onCancelHandler}
        onCloseClicked={onCancelHandler}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
      {isOpenConfirmDialog && (
        <ConfirmDeleteDialog
          isConfirmOnly
          onSave={() => {
            if (isOpenChanged) isOpenChanged();
          }}
          saveType="button"
          isOpenChanged={() => {
            setIsOpenConfirmDialog(false);
          }}
          descriptionMessage="close-confirm-description"
          extraDescription={getStagesNames()}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isOpen={isOpenConfirmDialog}
        />
      )}
    </>
  );
};

VisaStagesManagementDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
  onSave: PropTypes.func,
};
VisaStagesManagementDialog.defaultProps = {
  isOpenChanged: undefined,
  onSave: undefined,
  translationPath: 'PipelineTemplatesManagementDialog.',
};
