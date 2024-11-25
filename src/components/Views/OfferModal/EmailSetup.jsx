/**
 * ----------------------------------------------------------------------------------
 * @title EmailSetup.jsx
 * ----------------------------------------------------------------------------------
 * This module contains the EmailSetup component which allow user to select or edit
 * offer slug : email body and email subject.
 * ----------------------------------------------------------------------------------
 */

// React Components
import React, { useRef } from 'react';

// ReactStrap Components
import { Col, Input, Row } from 'reactstrap';
// UI component
// import { UploaderComponent } from 'components/Uploader/Uploader.Component';
// import { UploaderPageEnum } from 'enums/Pages/UploaderPage.Enum';
import { useTranslation } from 'react-i18next';
import { ThreeDots } from '../../../pages/recruiter-preference/components/Loaders';
import { TextEditorComponent } from '../../TextEditor/TextEditor.Component';

/**
 * Main Component
 * @param {*} offer
 * @param {*} setOffer
 * @param {*} annotations
 */
const translationPath = 'EmailSetupComponent.';
const EmailSetup = ({
  offer,
  setOffer,
  annotations,
  parentTranslationPath,
  // emailAttachments,
  // onEmailAttachmentsChanged,
}) => {
  const { t } = useTranslation(parentTranslationPath || 'EvaSSESSPipeline');
  const editorRef = useRef(null);
  /**
   * When an event occurs on the Offer
   * @param field
   * @returns {function(*): void}
   */
  const onOfferEvent = (field) => (e) => {
    const { value } = e.target;
    setOffer((items) => ({ ...items, [field]: value }));
  };

  /**
   * Handler fucntion to add an annotation
   * @param annotation
   */
  const handleAddAnnotation = (annotation) => {
    // if (!window.tinymce || !annotation) return;
    // window.tinymce.get('offer-editor-1').insertContent(annotation);
    if (!editorRef.current || !annotation) return;
    {
      editorRef.current.html.insert(annotation, true);
      editorRef.current.undo.saveStep();
    }
  };
  /**
   * Effect to handle change in Email body
   */
  // useEffect(() => {
  //   if (state.EmailBody) {
  //     setOffer((offer) => ({ ...offer, EmailBody: state.EmailBody }));
  //   }
  // }, [state.EmailBody]);

  /**
   * @returns {JSX element}
   */
  return (
    <div className="mt-4 mb--2 text-gray align-items-center">
      {!offer && <ThreeDots />}
      {offer && (
        <div className="email-setup-wrapper w-100">
          <Row className="mt-4 w-100">
            <Col sm="6" xs="12" className="mb-2">
              <Row className="mt-4">
                <Col xs="12">
                  <h6 className="h6">{`${t(
                    `${translationPath}email-subject`,
                  )}*`}</h6>
                </Col>
              </Row>
              <Input
                type="text"
                className="form-control-alternative"
                value={offer?.email_subject || ' '}
                onChange={onOfferEvent('email_subject')}
                placeholder={t(`${translationPath}email-subject`)}
              />
            </Col>

            <Col xs="12" sm="6" className="mb-2">
              <Row className="mt-4">
                <Col xs="12">
                  <h6 className="h6">{t(`${translationPath}email-annotations`)}</h6>
                </Col>
              </Row>

              <Input
                className="form-control-alternative"
                onChange={(e) => handleAddAnnotation(e.currentTarget.value)}
                type="select"
              >
                <option default>{t(`${translationPath}email-annotations`)}</option>
                {annotations?.map((v, index) => (
                  <option value={v} key={`annotationsKey${index + 1}`}>
                    {v}
                  </option>
                ))}
              </Input>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col xs="12">
              <h6 className="h6">{t(`${translationPath}email-body`)}</h6>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xs="12">
              <TextEditorComponent
                idRef="offer-editor-1"
                editorValue={offer.EmailBody || ''}
                onInit={(current) => (editorRef.current = current)}
                onEditorChange={(content) => {
                  setOffer((items) => ({ ...items, EmailBody: content }));
                }}
                height={500}
              />
            </Col>
          </Row>
          {/* <div className="form-item mt-3">
            <UploaderComponent
              uploaderPage={UploaderPageEnum.ATSAttachment}
              uploadedFiles={emailAttachments}
              labelValue="upload-attachments"
              parentTranslationPath="Shared"
              uploadedFileChanged={(newFiles) => {
                if (onEmailAttachmentsChanged) onEmailAttachmentsChanged(newFiles);
              }}
            />
          </div> */}
        </div>
      )}
    </div>
  );
};

export default EmailSetup;
