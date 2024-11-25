/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import AddQuestionnaire from './AddQuestionnaire';
import AddQuestionsWrapper from './AddQuestionsWrapper';
import DoneQuestionnaireCard from './DoneQuestionnaireCard';
import ChooseStageDialog from './ChooseStageDialog';
import i18next from 'i18next';
import axios from '../../../api/middleware';
import Helpers from '../../../utils/Helpers';
import { generateHeaders } from '../../../api/headers';
import { GPTGenerateQuestionnaire } from '../../../services';
import { showError, showSuccess } from '../../../helpers';
import { useTranslation } from 'react-i18next';
import { ChatGPTJobDetailsDialog } from '../../evassess/templates/dialogs/ChatGPTJobDetails.Dialog';

const parentTranslationPath = 'QuestionnairePage';
const AddQuestionnaireWrapper = ({ match, ...props }) => {
  const [active, setActive] = useState(
    props?.location?.state?.active ? props.location.state.active : 1,
  );
  const [questionnaire, setQuestionnaire] = useState({
    title: props?.location?.state?.title ? props.location.state.title : '',
    email_subject: props?.location?.state?.email_subject
      ? props.location.state.email_subject
      : '',
    email_body: props?.location?.state?.email_body
      ? props.location.state.email_body
      : '',
  });
  const [questions, setQuestions] = useState();
  const [currentUUID] = useState(match.params?.qid ? match.params.qid : false);
  const [emailAttachments, setEmailAttachments] = useState([]);
  const [gptDetails, setGPTDetails] = useState({
    job_title: '',
    year_of_experience: '',
    type: 'text',
    language: i18next.language,
    number_of_questions: 'three',
  });

  const goNext = (data) => {
    if (data)
      setQuestionnaire((items) => ({
        ...data,
        stage_uuid: items.stage_uuid,
      }));

    setActive((item) => item + 1);
  };
  const goPrev = () => {
    setActive((item) => item - 1);
  };
  const [isSaved, setIsSaved] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const closeDialog = () => setIsOpen(false);
  const openDialog = () => setIsOpen(true);

  const handleSave = (stage) => {
    setQuestionnaire((q) => ({ ...q, stage_uuid: stage }));
    setIsSaved(true);
    setIsOpen(false);
  };

  return (
    <>
      {active === 2 && (!isSaved || isOpen) && (
        <ChooseStageDialog
          data={questionnaire}
          isOpen={isOpen}
          onClose={() => closeDialog()}
          onSave={handleSave}
        />
      )}
      <AddQuestionnaire
        goNext={goNext}
        isActive={active === 1}
        // On Editing Props
        currentUUID={currentUUID}
        onQuestionsChanged={(newValue) => setQuestions(newValue)}
        emailAttachments={emailAttachments}
        onEmailAttachmentsChanged={(newValue) => setEmailAttachments(newValue)}
        parentTranslationPath={parentTranslationPath}
        onSave={handleSave}
      />
      <AddQuestionsWrapper
        data={questionnaire}
        isActive={active === 2}
        goPrev={goPrev}
        goNext={goNext}
        openDialog={openDialog}
        emailAttachments={emailAttachments}
        gptDetails={gptDetails}
        setGPTDetails={setGPTDetails}
        // On Editing Props
        currentUUID={currentUUID}
        initialQuestions={questions}
      />
      {active === 3 && <DoneQuestionnaireCard isDoneEdit={currentUUID} />}
    </>
  );
};

export default AddQuestionnaireWrapper;
