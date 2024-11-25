/* eslint-disable react/prop-types */
/**
 * ----------------------------------------------------------------------------------
 * @title OfferSetup.jsx
 * ----------------------------------------------------------------------------------
 * This module contains the OfferSetup component which allow user to select or edit
 * offer data : offer body, offer subject, offer title.
 * ----------------------------------------------------------------------------------
 */

// React Components
import React, { useEffect, useRef, useState } from 'react';

// ReactStrap Components
import { Col, Input, Row } from 'reactstrap';

// Select
import Select from 'react-select';

// Styles
import { customSelectStyles, selectColors } from '../../../shared/styles';

// Import API
import { commonAPI } from '../../../api/common';
// UI component
// import { UploaderComponent } from 'components';
// import { UploaderPageEnum } from 'enums/Pages/UploaderPage.Enum';
import { ThreeDots } from '../../../pages/recruiter-preference/components/Loaders';
import { useTranslation } from 'react-i18next';
import { TextEditorComponent } from '../../TextEditor/TextEditor.Component';

/**
 * Main Component
 * @param {*} offer
 * @param {*} setOffer
 * @param {*} annotations
 * @param {*} offers
 */
const translationPath = 'OfferSetupComponent.';
const OfferSetup = ({
  offer,
  setOffer,
  annotations,
  offers,
  parentTranslationPath,
  // emailAttachments,
  // onEmailAttachmentsChanged,
}) => {
  const { t } = useTranslation(parentTranslationPath || 'EvaSSESSPipeline');
  const [flag, setFlag] = useState(null);
  const [offerTitle, setOfferTitle] = useState('');
  const editorRef = useRef(null);
  /**
   * Effect to invoke API to determine offer body depends on offer uuid
   */
  useEffect(() => {
    if (offer?.offer_uuid && flag)
      commonAPI.viewOffers(offer?.offer_uuid?.uuid).then((res) => {
        setOffer((items) => ({
          ...items,
          offer_body: res?.data?.results?.translation[0]?.body,
        }));
        setOfferTitle(res?.data?.results?.title);
      });
  }, [offer?.offer_uuid]);
  /**
   * When an event occurs on the Offer (like typing, I assume)
   * @param field
   * @returns {function(*): void}
   */
  const onOfferEvent = (field) => (e) => {
    const v = e.target.value;
    setOffer((items) => ({ ...items, [field]: v }));
  };

  /**
   * When selection changes
   * @param field
   * @returns {function(*): void}
   */
  const onSelectChange = (field) => (options) => {
    setFlag(options);
    setOffer((items) => ({ ...items, [field]: options }));
  };

  /**
   * Handler fucntion to add an annotation
   * @param annotation
   */
  const handleAddAnnotation = (annotation) => {
    // if (!window.tinymce || !annotation) return;
    // window.tinymce.get('offer-editor-2').insertContent(annotation);
    if (!editorRef.current || !annotation) return;
    {
      editorRef.current.html.insert(annotation, true);
      editorRef.current.undo.saveStep();
    }
  };

  /**
   * @returns {JSX element}
   */
  return (
    <Row className="mt-4 mb--2 text-gray align-items-center">
      {!offers && <ThreeDots />}
      {offers && (
        <div>
          <Row className="mt-4">
            <Col sm="6" xs={12} className="mb-2">
              <Row className="mt-4">
                <Col xs="12">
                  <h6 className="h6">{t(`${translationPath}select-an-offer`)}</h6>
                </Col>
              </Row>

              <Select
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    ...selectColors,
                  },
                })}
                styles={customSelectStyles}
                placeholder={t(`${translationPath}select-an-offer`)}
                onChange={onSelectChange('offer_uuid')}
                value={offer?.offer_uuid || []}
                getOptionLabel={({ title }) => title}
                getOptionValue={({ uuid }) => uuid}
                options={offers}
                isClearable
              />
            </Col>
            <Col sm="6" xs="12" className="mb-2">
              <Row className="mt-4">
                <Col xs="12">
                  <h6 className="h6">{t(`${translationPath}offer-title`)}</h6>
                </Col>
              </Row>

              <Input
                type="text"
                className="form-control-alternative"
                placeholder={t(`${translationPath}offer-title`)}
                value={offerTitle || ''}
                onChange={(e) => {
                  const { value } = e.target;
                  setOfferTitle(value);
                  onOfferEvent('offer_title');
                }}
              />
            </Col>
            <Col xs={12} className="mt-3 text-gray">
              {t(`${translationPath}type-email-offer-description`)}
            </Col>
          </Row>
          <Row className="mt-4">
            <Col sm="6" xs="12" className="mb-2">
              <Row className="mt-4">
                <Col xs="12">
                  <h6 className="h6">{t(`${translationPath}offer-subject`)}</h6>
                </Col>
              </Row>
              <Input
                type="text"
                className="form-control-alternative"
                value={offer?.subject || ' '}
                onChange={onOfferEvent('subject')}
                placeholder={t(`${translationPath}offer-subject`)}
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
                  <option value={v} key={`annotationsKey${index}`}>
                    {v}
                  </option>
                ))}
              </Input>
            </Col>
          </Row>
          <Row className="mt-4 w-100">
            <Col xs="12">
              <h6 className="h6">{t(`${translationPath}email-body`)}</h6>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xs="12">
              <TextEditorComponent
                idRef="offer-editor-2"
                editorValue={offer?.offer_body || ''}
                onInit={(current) => (editorRef.current = current)}
                onEditorChange={(content, editor) => {
                  setOffer((items) => ({ ...items, offer_body: content }));
                }}
                height={500}
              />
              {/* <Editor*/}
              {/*   id="offer-editor-2"*/}
              {/*   value={offer?.offer_body || ''}*/}
              {/*   init={{*/}
              {/*     height: 500,*/}
              {/*     plugins: [*/}
              {/*       'advlist autolink lists link image preview anchor',*/}
              {/*       'searchreplace code',*/}
              {/*       'insertdatetime media paste code wordcount',*/}
              {/*     ],*/}
              {/*     toolbar:*/}
              {/*       // eslint-disable-next-line no-multi-str*/}
              {/*       'formatselect | bold italic backcolor | \*/}
              {/*alignleft aligncenter alignright alignjustify | \*/}
              {/*bullist numlist outdent indent | removeformat',*/}

              {/*     //  Remove Branding*/}
              {/*     init_instance_callback(editor) {*/}
              {/*       const freeTiny = document.querySelector(*/}
              {/*         '.tox .tox-notification--in'*/}
              {/*       );*/}
              {/*       if (freeTiny) freeTiny.style.display = 'none';*/}
              {/*     },*/}
              {/*     branding: false,*/}
              {/*   }}*/}
              {/*   onEditorChange={(content, editor) => {*/}
              {/*     setOffer((items) => ({ ...items, offer_body: content }));*/}
              {/*   }}*/}
              {/* />*/}
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
    </Row>
  );
};

export default OfferSetup;
