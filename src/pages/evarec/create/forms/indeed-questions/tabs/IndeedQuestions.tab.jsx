import React, { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import QuestionCard from '../../../../../../shared/components/QuestionCard';
import { IndeedQuestionsTypesEnum } from '../../../../../../enums';
import { generateUUIDV4 } from '../../../../../../helpers';
const AddCol = styled.div`
  align-items: center;
  cursor: pointer;
  display: flex;
  justify-content: center;
  padding: 0.5rem;
  transition: 0.3s ease;
  &:hover {
    background: #e9ecef;
  }
`;

/**
 * Styled item
 */
const I = styled.i`
  align-items: center;
  background-color: var(--bg-primary, #03396c);
  border-radius: 999px;
  color: #fff;
  display: flex;
  height: 40px;
  justify-content: center;
  margin-right: 1rem;
  padding: 0.5rem;
  width: 40px;
`;

export const IndeedQuestionsTab = ({
  parentTranslationPath,
  translationPath,
  form,
  setForm,
  stateKey,
  description,
}) => {
  const questionsSelectTypesRef = useRef(
    Object.values(IndeedQuestionsTypesEnum).map((item) => item.key),
  );
  const { t } = useTranslation(parentTranslationPath);
  const addQuestion = () => {
    setForm((items) => ({
      ...items,
      [stateKey]: {
        questions: [
          ...(items?.[stateKey]?.questions || []),
          {
            description: '',
            title: '',
            type: 'text',
            is_required: false,
            uuid: generateUUIDV4(),
          },
        ],
      },
    }));
  };
  const updateQuestion = (idToUpdate, newQuestion) => {
    setForm((items) => ({
      ...items,
      [stateKey]: {
        questions: [
          ...(items?.[stateKey]?.questions || []).map(
            (q) => (q.uuid === idToUpdate && newQuestion) || q,
          ),
        ],
      },
    }));
  };
  const removeQuestion = (idToRemove) => {
    setForm((items) => ({
      ...items,
      [stateKey]: {
        questions: [
          ...(items?.[stateKey]?.questions || []).filter(
            (q) => q.uuid !== idToRemove.uuid,
          ),
        ],
      },
    }));
  };
  const duplicateQuestion = (questionToDuplicate) => {
    setForm((items) => ({
      ...items,
      [stateKey]: {
        questions: [
          ...(items?.[stateKey]?.questions || []),
          {
            ...questionToDuplicate,
            uuid: generateUUIDV4(),
          },
        ],
      },
    }));
  };
  const questions = useMemo(
    () => form?.[stateKey]?.questions || [],
    [form, stateKey],
  );
  return (
    <div>
      <div className="text-gray mx-1 mt-1 mb-2 font-14">
        {t(`${translationPath}${description}`)}
      </div>
      {questions
        && questions.map((q, i) => (
          <QuestionCard
            question={q}
            key={q.uuid}
            index={i}
            questionsTypes={questionsSelectTypesRef.current}
            updateQuestion={updateQuestion}
            removeQuestion={removeQuestion}
            duplicateQuestion={duplicateQuestion}
            isForIndeed={true}
          />
        ))}
      <AddCol onClick={() => addQuestion(stateKey)}>
        <I className="fas fa-plus" />
        <span>{t(`${translationPath}add-new-question`)}</span>
      </AddCol>
    </div>
  );
};
