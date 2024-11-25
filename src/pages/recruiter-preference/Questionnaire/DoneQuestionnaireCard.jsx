import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import { Button } from 'reactstrap';
import { useTranslation } from 'react-i18next';

const translationPath = 'Questionnaire.';
const mainParentTranslationPath = 'RecruiterPreferences';

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
  margin-top: 2rem;
  max-width: 900px;
  min-height: 500px;
  & > * {
    margin-bottom: 1rem;
  }
`;

const DoneQuestionnaireCard = ({ isDoneEdit }) => {
  const { t } = useTranslation(mainParentTranslationPath);
  const history = useHistory();

  const handleClick = () => {
    history.push('/recruiter/recruiter-preference/questionnaire');
  };
  return (
    <Wrapper className="p-3">
      <div
        style={{
          fontSize: '100px',
          color: '#a5dc86',
          lineHeight: '1em',
        }}
      >
        <i className="far fa-check-circle" />
      </div>
      <h3 className="h3" style={{ color: '#a5dc86', fontWeight: 'bold' }}>
        {t(`${translationPath}thank-you`)}
      </h3>
      <p className="text-gray" style={{ marginBottom: '1.5rem', fontSize: '18px' }}>
        {t(`${translationPath}your-questionnaire-has-been-successfully`)}{' '}
        {!isDoneEdit
          ? t(`${translationPath}created`)
          : t(`${translationPath}updated`)}
      </p>
      <Button color="primary" style={{ width: '220px' }} onClick={handleClick}>
        {t(`${translationPath}done`)}
      </Button>
    </Wrapper>
  );
};
export default DoneQuestionnaireCard;
DoneQuestionnaireCard.propTypes = {
  isDoneEdit: PropTypes.bool.isRequired,
};
