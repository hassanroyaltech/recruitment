import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import QuestionCard from '../../../../../../shared/components/QuestionCard';

export const QuestionnairesTab = ({
  state,
  onStateChanged,
  // isLoading,
  translationPath,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [questions, setQuestions] = useState([]);
  const [isDuplicateDisabled, setIsDuplicateDisabled] = useState(false);

  /**
   * @param index
   * @param newValue
   * @param isDelete
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method to handle send changes to parent
   */
  const updateParentHandler = useCallback(
    (index, newValue, isDelete = false) => {
      const localState = { ...state };
      if (
        !localState.changedCategoriesRequirements
        || !localState.categoriesRequirements
      )
        return;
      const activeCategoriesRequirementsIndex
        = localState.categoriesRequirements.findIndex(
          (element) => element.category_uuid === localState.category_uuid,
        );
      const changedRequirementsIndex
        = localState.changedCategoriesRequirements.findIndex(
          (element) => element.category_uuid === localState.category_uuid,
        );

      // changedCategoriesRequirements
      if (!isDelete && localState.activeCategoryRequirements.questions[index])
        localState.activeCategoryRequirements.questions[index] = newValue;
      else if (!isDelete)
        localState.activeCategoryRequirements.questions.push(newValue);
      if (isDelete) localState.activeCategoryRequirements.questions.splice(index, 1);
      // eslint-disable-next-line operator-linebreak
      localState.categoriesRequirements[activeCategoriesRequirementsIndex] =
        localState.activeCategoryRequirements;
      const toSaveDto = {
        ...localState.activeCategoryRequirements,
        ...(localState.activeCategoryRequirements.profile || {}),
      };
      if (toSaveDto.profile) delete toSaveDto.profile;
      if (changedRequirementsIndex !== -1)
        localState.changedCategoriesRequirements[changedRequirementsIndex]
          = toSaveDto;
      else localState.changedCategoriesRequirements.push(toSaveDto);
      if (onStateChanged) onStateChanged({ id: 'edit', value: localState });
      setTimeout(() => setIsDuplicateDisabled(false));
    },
    [onStateChanged, state],
  );
  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method to handle add a new question
   */
  const onAddQuestionClicked = () => {
    setIsDuplicateDisabled(true);
    const maxOrder
      = (questions?.length > 0
        && Math.max(...(questions || []).map((item) => item?.order || 0)))
      || 0;
    const newDto = {
      title: '',
      description: '',
      type: 'text',
      order: maxOrder + 1 || 1,
      is_required: false,
    };
    setQuestions((items) => {
      const localItems = [...items];
      localItems.push(newDto);
      return localItems;
    });
    updateParentHandler(questions?.length || 0, newDto);
  };

  /**
   * @param index
   * @param uuid
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method to handle update question on edit
   */
  const updateQuestionHandler = useCallback(
    (index) => (uuid, newValue) => {
      const localNewValue = { ...newValue };
      setQuestions((items) => {
        const localItems = [...items];
        localItems[index] = {
          ...(newValue || {}),
          fileAnswer: {
            ...(newValue.fileAnswer
              || newValue.file_data || {
              file_size: '1',
              file_type: '2',
            }),
          },
        };
        if (localItems[index].type !== 'file') delete localItems[index].fileAnswer;
        return localItems;
      });
      if (localNewValue.type === 'file')
        localNewValue.file_data = {
          ...(localNewValue.fileAnswer
            || localNewValue.file_data || {
            file_size: '1',
            file_type: '2',
          }),
        };

      updateParentHandler(index, localNewValue);
    },
    [updateParentHandler],
  );

  /**
   * @param index
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method to handle remove question
   */
  const removeQuestionHandler = useCallback(
    (index) => () => {
      setQuestions((items) => {
        const localItems = [...items];
        localItems.splice(index, 1);
        return localItems;
      });
      updateParentHandler(index, undefined, true);
    },
    [updateParentHandler],
  );

  /**
   * @param index
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method to handle duplicate question
   */
  const duplicateQuestionHandler = useCallback(
    () => (toDuplicateItem) => {
      setIsDuplicateDisabled(true);
      const maxOrder
        = (questions?.length > 0
          && Math.max(...(questions || []).map((item) => item?.order || 0)))
        || 0;
      const localNewItem = { ...toDuplicateItem };
      delete localNewItem.uuid;
      localNewItem.order = maxOrder + 1;
      setQuestions((items) => {
        const localItems = [...items];
        localItems.push(localNewItem);
        return localItems;
      });
      updateParentHandler(questions.length, localNewItem);
    },
    [questions, updateParentHandler],
  );

  // this is ti init questions values
  useEffect(() => {
    if (
      state.activeCategoryRequirements
      && state.activeCategoryRequirements.questions
    )
      setQuestions(
        state.activeCategoryRequirements.questions.map((item, index) => ({
          ...item,
          order: index + 1,
        })),
      );
    else setQuestions([]);
  }, [state.activeCategoryRequirements]);

  return (
    <div className="questionnaires-tab-wrapper tab-content-wrapper">
      {questions
        && questions.map((item, index) => (
          <QuestionCard
            question={item}
            key={item.uuid || `questionsRef${index}`}
            index={index}
            updateQuestion={updateQuestionHandler(index)}
            removeQuestion={removeQuestionHandler(index)}
            duplicateQuestion={duplicateQuestionHandler(index)}
            isDuplicateDisabled={isDuplicateDisabled}
          />
        ))}
      {state.category_uuid && (
        <ButtonBase className="btns theme-solid" onClick={onAddQuestionClicked}>
          <span className="fas fa-plus" />
          <span className="px-1">{t(`${translationPath}add-new-question`)}</span>
        </ButtonBase>
      )}
    </div>
  );
};

QuestionnairesTab.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func,
  // isLoading: PropTypes.bool,
  translationPath: PropTypes.string,
  parentTranslationPath: PropTypes.string.isRequired,
};
QuestionnairesTab.defaultProps = {
  onStateChanged: undefined,
  // isLoading: false,
  translationPath: '',
};
