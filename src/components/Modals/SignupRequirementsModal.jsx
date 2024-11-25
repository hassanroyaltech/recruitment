// React and reactstrap
import React, { useContext, useEffect, useState } from 'react';
import { TabContent, TabPane } from 'reactstrap';

// Styled components
import styled from 'styled-components';

// Toast notifications
import { useToasts } from 'react-toast-notifications';

// Helper function
import { getUniqueID } from '../../shared/utils';

// Card component
import QuestionCard from '../../shared/components/QuestionCard';

// API
import { evabrandAPI } from '../../api/evabrand';

// Modal
import { StandardModal } from '../../components/Modals/StandardModal';
import { ModalButtons } from '../../components/Buttons/ModalButtons';

// Content
// import { evabrandContent } from 'assets/content/evabrandContent';

// Context API
import { useTranslation } from 'react-i18next';
import { CareerBrandingContext } from '../../pages/evabrand/CareerBrandingContext';

// Require module
import Require from '../../pages/evabrand/Require';

const translationPath = '';
const parentTranslationPath = 'EvaBrand';

/**
 * Add column styled div
 */
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

/**
 * Signup requirements modal component
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const SignupRequirementsModal = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  const { addToast, removeAllToasts } = useToasts(); // Toasts

  // Required Data
  const { languageId } = useContext(CareerBrandingContext);
  const [isWorking, setIsWorking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'))?.results;

  // Get Appearance
  const [data, setData] = useState();
  const [profileUUID, setProfileUUID] = useState(null);
  const [title, setTitle] = useState(null);
  const [options, setOptions] = useState([]);
  const [, setErrors] = useState([]);

  // Tabs
  const [currentTab, setCurrentTab] = useState('tab-1');

  // Requirements/Questionnaire Modal
  const [questions, setQuestions] = useState([]);
  const [response, setResponse] = useState(null);
  const [newResponse, setNewResponse] = useState(false);

  /**
   * Prepare by getting the signup requirements data
   */
  useEffect(() => {
    if (data || !languageId) return;
    setIsWorking(true);

    /**
     * Get data from the API
     * @returns {Promise<void>}
     */
    const getData = async () => {
      evabrandAPI
        .getSignUpProfileBuilder(languageId)
        .then((res) => {
          // View the signup requirements
          setResponse(res.data?.results?.profile);

          // Set the signup requires (to be sent in API)
          setNewResponse(res.data?.results?.profile);
          setOptions(Object.keys(res.data?.results?.profile));
          setData(Object.values(res.data?.results?.profile));

          // Set the questions state
          setQuestions(res.data?.results?.questions);
          setProfileUUID(res.data?.results?.uuid);
          setTitle(res.data?.results?.title);
          setIsWorking(false);
        })
        .catch(() => {
          setIsWorking(false);
          addToast(t(`${translationPath}error-in-getting-data`), {
            appearance: 'error',
            autoDismiss: true,
          });
        });
    };
    getData();
  }, [languageId]);

  /**
   * Add a question
   */
  const addQuestion = () => {
    setQuestions((items) => [
      ...items,
      {
        description: '',
        title: '',
        type: 'text',
        order: questions.length,
        is_required: false,
        uuid: getUniqueID(),
      },
    ]);
  };

  /**
   * Update a question
   * @param idToUpdate
   * @param newQuestion
   * @param index
   */
  const updateQuestion = (idToUpdate, newQuestion) => {
    setQuestions([
      ...questions.map((q) => (q.uuid === idToUpdate && newQuestion) || q),
    ]);
  };

  /**
   * Delete a question
   * @param idToRemove
   */
  const removeQuestion = (idToRemove) => {
    setQuestions((items) => [...items.filter((q) => q.uuid !== idToRemove.uuid)]);
    removeAllToasts();
  };

  /**
   * Duplicate a question
   * @param questionToDuplicate
   */
  const duplicateQuestion = (questionToDuplicate) => {
    setQuestions((items) => [
      ...items,
      { ...questionToDuplicate, uuid: getUniqueID() },
    ]);
    removeAllToasts();
  };

  /**
   * Function to handle file
   * @note transform questions data to match the request structure in create signup requirments API
   */
  const transformQuestions = () => {
    for (let i = 0; i < questions.length; i += 1) {
      if (questions[i].type === 'file') {
        questions[i].file_data = {
          file_size: questions[i].fileAnswer?.file_size || '1', // 1MB
          file_type: questions[i].fileAnswer?.file_type || '2', // starts with .pdf
        };
        delete questions[i].fileAnswer;
      }
      delete questions[i].uuid;
    }
    return questions;
  };

  /**
   * Update signup requirements
   * @returns {Promise<void>}
   */
  const updateData = async () => {
    // Make copy of questions before invoke transformQuestions Function.
    const copy = questions.map((object) => ({ ...object }));
    setIsWorking(true);
    const questionsData = transformQuestions();
    setIsSaving(true);
    const params = {
      title,
      uuid: profileUUID,
      ...newResponse,
      language_id: languageId,
      questions: questionsData,
      language_uuid: languageId,
      // questions: questionsList,
    };

    /**
     * Update date via API
     * @returns {Promise<void>}
     */
    evabrandAPI
      .updateSignupProfileBuilder(params)
      .then(() => {
        addToast(t(`${translationPath}successfully-updated`), {
          appearance: 'success',
          autoDismiss: true,
        });
        setQuestions(copy);
        setIsWorking(false);
        setIsSaving(false);
      })
      .catch((error) => {
        setQuestions(copy);
        addToast(error?.response?.data?.message, {
          appearance: 'error',
          autoDismiss: true,
        });
        setErrors(error?.response?.data?.errors);
        setIsWorking(false);
        setIsSaving(false);
      });
  };

  /**
   * Handler for 'Cancel' button
   * @returns {*}
   */
  const cancelButtonHandler = () => props.closeModal();

  /**
   * Handler for 'Save' button
   * @returns {*}
   */
  const saveButtonHandler = () => {
    updateData();
  };

  /**
   * Return the SignupRequirements Modal
   * @return {JSX.Element}
   */
  return (
    <>
      {/* MODAL COMPONENT */}
      <StandardModal
        title={t(`${translationPath}signup-requirements`)}
        subtitle={t(`${translationPath}signup-requirements-subtitle`)}
        isOpen={props.isOpen}
        isLoading={isWorking}
        onClose={props.closeModal}
        tabs={[t(`${translationPath}general`), t(`${translationPath}questionnaire`)]}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        languageTag={user?.language.filter((l) => l.id === languageId)[0].title}
        buttons={
          <ModalButtons
            cancelButton
            cancelButtonHandler={cancelButtonHandler}
            saveButton
            saveButtonHandler={saveButtonHandler}
            isSaving={isSaving}
          />
        }
      >
        {/* TAB CONTENT */}
        <TabContent activeTab={currentTab}>
          <TabPane className="pt-4" key="tab-1" tabId="tab-1">
            {data
              && options.map((o, i) => (
                <Require
                  title={title}
                  response={response}
                  setNewResponse={(value) => {
                    setNewResponse(value);
                  }}
                  ProfileUUID={profileUUID}
                  options={o}
                  label={data[i]}
                  key={`optionRequireKey${i + 1}`}
                />
              ))}
          </TabPane>
          <TabPane className="pt-4" key="tab-2" tabId="tab-2">
            {questions
              && questions.map((q, i) => (
                <QuestionCard
                  question={q}
                  key={q.uuid}
                  index={i}
                  updateQuestion={updateQuestion}
                  removeQuestion={removeQuestion}
                  duplicateQuestion={duplicateQuestion}
                  setNewQuestion={(value) => {
                    setQuestions(value);
                  }}
                />
              ))}
            <AddCol onClick={addQuestion}>
              <I className="fas fa-plus" />
              <span>{t(`${translationPath}add-new-question`)}</span>
            </AddCol>
          </TabPane>
        </TabContent>
      </StandardModal>
    </>
  );
};

export default SignupRequirementsModal;
