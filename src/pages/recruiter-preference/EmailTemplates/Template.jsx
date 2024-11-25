import React, { useState, useEffect, useCallback } from 'react';

import { Col, Input, FormGroup, Row } from 'reactstrap';

import TinyMCE from 'components/Elevatus/TinyMCE';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { ChatGPTIcon } from '../../../assets/icons';

const translationPath = 'EmailTemplates.';
const parentTranslationPath = 'RecruiterPreferences';

const Template = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  const { i } = props;
  const [subject, setSubject] = useState(props.mail.subject);
  const [body, setBody] = useState(props.mail.body);
  const { sendTranslation } = props;
  useEffect(() => {
    sendTranslation({
      language: props.mail.language,
      subject,
      body,
      index: props.mail.index,
    });
  }, [props.mail.language, subject, body]);

  const gptGenerateBody = useCallback(() => {
    if (!props?.gptGenerateEmailTemplate) return;

    props?.gptGenerateEmailTemplate(
      { language: props?.mail?.language.code || 'en', purpose: props?.purpose },
      (val) => {
        setBody((val || '').replaceAll('\n', '<br/>'));
      },
    );
  }, [props?.gptGenerateEmailTemplate, props?.mail.language.code, props?.purpose]);

  return (
    <>
      <Row>
        <Col md="12">
          <TinyMCE
            id={`editor-${i}`}
            value={body || ''}
            name="body"
            onChange={(value) => setBody(value)}
            variables={props.variables}
            language={props?.mail?.language}
            isForEmailTemplate
          >
            <Col sm="12" md="6">
              <FormGroup>
                <label
                  className="form-control-label mt-3"
                  htmlFor={`email-subject-${i}`}
                >
                  {t(`${translationPath}email-subject`) + '*'}
                </label>

                <Col xl={11} className="pr-0 pl-0">
                  <Input
                    className="form-control-alternative"
                    id={`email-subject-${i}`}
                    placeholder={t(`${translationPath}email-subject`)}
                    value={subject}
                    onChange={(e) => setSubject(e.currentTarget.value)}
                    type="text"
                    name="subject"
                    disabled={props?.isLoading}
                    required
                  />
                  {props.errors
                    && props.selectedTab === i
                    && props.errors.translations
                    && typeof props.errors.translations === 'string' && (
                    <div className="c-error fz-12px">
                      {props.errors.translations}
                    </div>
                  )}
                </Col>
              </FormGroup>
            </Col>
            {props?.isWithChatGPT && (
              <Col md="12" className="px-0">
                {t(`${translationPath}generate-email-template`)}
                <ButtonBase
                  type="button"
                  onClick={() => {
                    gptGenerateBody();
                  }}
                  className="btns theme-solid"
                  disabled={props?.isLoading || !props?.purpose}
                >
                  {props?.isLoading ? (
                    <>
                      <>
                        {t(`${translationPath}generating`)}
                        <span className="fas fa-circle-notch fa-spin m-1" />
                      </>
                    </>
                  ) : (
                    <>
                      {t(`${translationPath}generate-using-ChatGPT`)}
                      <span className="m-1">
                        <ChatGPTIcon />
                      </span>
                    </>
                  )}
                </ButtonBase>
              </Col>
            )}
          </TinyMCE>
          {props.errors
            && props.selectedTab === i
            && props.errors.translations
            && props.errors.translations[i]
            && props.errors.translations[i].body && (
            <div className="c-error fz-12px">
              {props.errors.translations[i].body}
            </div>
          )}
        </Col>
      </Row>
    </>
  );
};

export default Template;
