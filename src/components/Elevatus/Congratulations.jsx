import React from 'react';
import { useHistory } from 'react-router-dom';
import ButtonBase from '@mui/material/ButtonBase';
import Card from '@mui/material/Card';
import { useTranslation } from 'react-i18next';
import CopyToClipboardInput from './CopyToClipboardInput';

const translationPath = 'CongratulationsComponent.';
const Congratulations = (props) => {
  const history = useHistory();
  const { t } = useTranslation(props.parentTranslationPath || 'EvaSSESS');
  return (
    <Card
      className="step-card d-flex flex-column align-items-center"
      style={{ paddingTop: 40, paddingBottom: 40 }}
    >
      <div
        style={{
          marginBottom: 30,
          fontSize: '100px',
          color: '#a5dc86',
          lineHeight: '1em',
        }}
      >
        <i className="far fa-check-circle" />
      </div>
      <h3 className="h3" style={{ color: '#a5dc86', marginBottom: 27 }}>
        {t(`${translationPath}congratulation`)}
      </h3>
      <p className="text-gray" style={{ marginBottom: 55, fontSize: '18px' }}>
        {t(`${translationPath}your-assessment-${props.type}-successfully`)}
      </p>
      <div style={{ marginBottom: 55, width: 500 }}>
        <CopyToClipboardInput
          link={props.link}
          parentTranslationPath={props.parentTranslationPath}
          translationPath={translationPath}
        />
      </div>
      <ButtonBase
        className="btns theme-solid"
        onClick={() => history.push('/recruiter/assessment/manage/list')}
      >
        {t(`${translationPath}done`)}
      </ButtonBase>
    </Card>
  );
};
export default Congratulations;
