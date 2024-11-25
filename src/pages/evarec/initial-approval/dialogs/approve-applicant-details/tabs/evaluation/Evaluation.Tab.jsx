import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { getErrorByName, showError } from '../../../../../../../helpers';
import {
  GetApprovalEvaluations,
  GetMultipleMedias,
} from '../../../../../../../services';
import './Evaluation.Style.scss';
import { SetupsReducer, SetupsReset } from '../../../../../../setups/shared';
import { EvaluationsSection } from './sections';
import { LoaderComponent } from '../../../../../../../components';
import {
  EvaluationQuestionsTypesEnum,
  EvaluationRatingLabelsEnum,
} from '../../../../../../../enums';

export const EvaluationTab = ({
  pre_candidate_uuid,
  category_code,
  parentTranslationPath,
  translationPath,
  pre_candidate_approval_uuid,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const ratingLabelsRef = useRef(
    Object.values(EvaluationRatingLabelsEnum).map((item) => ({
      ...item,
      value: t(item.value),
    })),
  );
  const stateInitRef = useRef({
    evaluations: [],
  });
  const [errors, setErrors] = useState(() => ({}));
  const [changedStates, setChangedStates] = useState([]);
  const [openCollapseIndex, setOpenCollapseIndex] = useState(-1);

  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );
  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get list of evaluations
   */
  const getPreScreeningEvaluations = useCallback(async () => {
    setIsLoading(true);
    const response = await GetApprovalEvaluations({
      pre_candidate_approval_uuid,
      category_code,
    });
    if (response && response.status === 200) {
      const localEvaluations = [...(response.data.results || [])];
      await Promise.all(
        localEvaluations.map(async (item, index) => {
          await Promise.all(
            item.questions.map(async (element, elementIndex) => {
              if (
                element.type !== EvaluationQuestionsTypesEnum.Files.key
                || !element.answer
              )
                return;
              const mediaResponse = await GetMultipleMedias({
                uuids: [element.answer],
              });
              if (
                mediaResponse
                && mediaResponse.status === 200
                && mediaResponse.data.results.data.length > 0
              )
                // eslint-disable-next-line max-len
                localEvaluations[index].questions[elementIndex].localFile
                  = mediaResponse.data.results.data[0].original;
              else localEvaluations[index].questions[elementIndex].answer = null;
            }),
          );
        }),
      );
      setIsLoading(false);
      setState({ id: 'evaluations', value: response.data.results });
    } else {
      setIsLoading(false);
      showError(t('Shared:failed-to-get-saved-data'), response);
    }
  }, [pre_candidate_approval_uuid, category_code, t]);

  /**
   * @param evaluationIndex
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change open evaluation collapse from child
   */
  const onOpenCollapseChanged = useCallback((evaluationIndex) => {
    setOpenCollapseIndex((item) => {
      if (item === evaluationIndex) return -1;
      return evaluationIndex;
    });
  }, []);
  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is sent new value for state from child
   */
  const onStateChanged = (newValue) => {
    setState(newValue);
    setChangedStates((items) => {
      const localItems = [...items];
      if (newValue.parentIndex || newValue.parentIndex === 0) {
        if (localItems.includes(newValue.parentIndex)) return items;

        localItems.push(newValue.parentIndex);
        return localItems;
      }
      if (localItems.includes(newValue.index)) return items;
      localItems.push(newValue.index);
      return localItems;
    });
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the errors list
   */
  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: yup.object().shape({
          evaluations: yup
            .array()
            .of(
              yup.object().shape({
                rate: yup
                  .number()
                  .nullable()
                  .required(t('Shared:this-field-is-required')),
                notes: yup.string().nullable(),
                questions: yup.array().of(
                  yup.object().shape({
                    type: yup.number(),
                    answer: yup
                      .mixed()
                      .nullable()
                      .required(t('Shared:this-field-is-required')),
                  }),
                ),
              }),
            )
            .nullable(),
        }),
      },
      state,
    ).then((result) => {
      setErrors(result);
    });
  }, [state, t]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle remove the evaluation index
   * from changed evaluations list after save
   */
  const onSaveEvaluationHandler = useCallback((evaluationIndex) => {
    setChangedStates((items) => {
      const localItems = [...items];
      const changedEvaluationIndex = localItems.indexOf(evaluationIndex);
      if (changedEvaluationIndex !== -1) {
        localItems.splice(changedEvaluationIndex, 1);
        return localItems;
      }
      return items;
    });
  }, []);

  // this is to get list of evaluations
  useEffect(() => {
    getPreScreeningEvaluations();
  }, [getPreScreeningEvaluations]);

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  return (
    <div className="evaluation-wrapper tab-wrapper">
      {/* <ButtonBase */}
      {/*  className="btns theme-outline new-evaluation-btn mb-3 mx-0" */}
      {/*  onClick={() => { */}
      {/*    GlobalHistory.push( */}
      {/*      `/recruiter/job/initial-approval/
      pre-screening-approval/add-approval?uuid=${approval_uuid}`, */}
      {/*    ); */}
      {/*  }} */}
      {/* > */}
      {/*  <span className="px-2">{t(`${translationPath}create-new-evaluation`)}</span> */}
      {/*  <span className="fas fa-plus fa-3x mx-2" /> */}
      {/* </ButtonBase> */}
      {!isLoading && (!state.evaluations || state.evaluations.length === 0) && (
        <div className="d-flex-center header-text-x2">
          <span>{t(`${translationPath}no-results-found`)}</span>
        </div>
      )}
      <div className="evaluation-items-wrapper">
        {state.evaluations
          && state.evaluations.map((item, index) => (
            <EvaluationsSection
              key={item.evaluation_uuid}
              onStateChanged={onStateChanged}
              onSave={onSaveEvaluationHandler}
              evaluation={item}
              evaluationIndex={index}
              errors={errors}
              pre_candidate_uuid={pre_candidate_uuid}
              category_code={category_code}
              changedStates={changedStates}
              ratingLabels={ratingLabelsRef.current}
              isOpenCollapse={index === openCollapseIndex}
              onOpenCollapseChanged={onOpenCollapseChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          ))}
        <LoaderComponent
          isLoading={isLoading}
          isSkeleton
          wrapperClasses="evaluation-items-wrapper card-wrapper"
          skeletonClasses="evaluation-item-wrapper"
          skeletonStyle={{ minHeight: 125 }}
        />
      </div>
    </div>
  );
};
EvaluationTab.propTypes = {
  pre_candidate_uuid: PropTypes.string.isRequired,
  category_code: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  // approval_uuid: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
  pre_candidate_approval_uuid: PropTypes.string.isRequired,
};

EvaluationTab.defaultProps = {
  parentTranslationPath: 'EvarecCandidateModel',
  translationPath: '',
};
