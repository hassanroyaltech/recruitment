import React, { useEffect, useState } from 'react';
import { Col, Row } from 'reactstrap';
import { evarecAPI } from '../../../../../api/evarec';
import { evassessAPI } from '../../../../../api/evassess';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import QuestionItemCard from './QuestionItemCard';
import { useTranslation } from 'react-i18next';

// import evarec API
const translationPath = 'QuestionnaireTabComponent.';
const QuestionnaireTab = (props) => {
  const { t } = useTranslation(
    props.parentTranslationPath || 'EvarecCandidateModel',
  );
  const [state, setState] = useState({
    questionnaires: props.questionnaires,
    questionnaire: [],
  });
  // Will uncomment this function once the Questionnaire Details API is ready to use

  /**
   * Function to view questions in selected questionnaire
   * @returns {Promise}
   * @param e
   */
  const handleViewQuestionnaire = (e) => {
    if (props?.type === 'prep_assessment')
      evassessAPI
        .getCandidatesQuestionnairesDetails(props.candidate_uuid, e.uuid)
        .then((response) => {
          setState((items) => ({
            ...items,
            questionnaire: response.data.results,
          }));
        });
    else {
      const isSignUpQuestionnaire = e.is_sing_up_questionnaire ? 1 : 0;

      // if (state?.questionnaires?.is_answered === true) {
      evarecAPI
        .getQuestionnaireDetails(
          isSignUpQuestionnaire ? props.candidate_uuid : props.candidate,
          e.uuid,
          isSignUpQuestionnaire,
        )
        .then((response) => {
          setState((items) => ({
            ...items,
            questionnaire: response.data.results,
          }));
        });
    }
  };
  useEffect(() => {
    // Get Questionnaire List From API => then set the result to the drop down menu Questionnaire
    if (props.type === 'ats')
      evarecAPI.getCandidateQuestionnaire(props.candidate).then((res) => {
        setState((items) => ({
          ...items,
          questionnaires: res.data.results,
        }));
      });
  }, [props.candidate, props.type]);
  return (
    <>
      {state.questionnaires?.length > 0 && (
        <Row>
          <Col lg={8} md={12}>
            <div className="p-3 mb-0 regular-shadow">
              <div className="d-flex flex-column align-items-start mx-3">
                <div className="font-14 font-weight-bold ml-4-reversed">
                  {t(`${translationPath}questionnaire`)}
                </div>
                <div className="mt-4 w-100">
                  {state.questionnaire?.map((item, index) => (
                    <QuestionItemCard
                      key={`questionnaireKey${index + 1}`}
                      index={index + 1}
                      parentTranslationPath={props.parentTranslationPath}
                      question={item}
                      answer={item}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Col>
          <Col lg={4} md={12} xs={12}>
            <TextField
              fullWidth
              select
              className="mt-4"
              id="questionnaire"
              name="questionnaire"
              label={t(`${translationPath}questionnaire`)}
              variant="outlined"
              size="small"
              defaultValue=""
              onChange={(e) => handleViewQuestionnaire(e.target.value)}
            >
              {state.questionnaires.map((questionnaire, i) => (
                <MenuItem key={`questionnairesKey${i + 1}`} value={questionnaire}>
                  {questionnaire.title}
                </MenuItem>
              ))}
            </TextField>
          </Col>
        </Row>
      )}
    </>
  );
};
export default QuestionnaireTab;
