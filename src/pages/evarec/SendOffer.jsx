/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
// React and Reactstrap
import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Col,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  Row,
} from 'reactstrap';

// Axios

import { commonAPI } from '../../api/common';

// UI component
import { ThreeDots } from '../recruiter-preference/components/Loaders';
import { useTranslation } from 'react-i18next';
import { TextEditorComponent } from '../../components';

/**
 * Function to send an offer
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const translationPath = 'SendOfferComponent.';
const SendOffer = (props) => {
  const { t } = useTranslation(props.parentTranslationPath || 'EvaSSESSPipeline');
  // Set a state for the offer and lost of offers
  const [listOfOffers, setListOfOffers] = useState();
  const [offer, setOffer] = useState();
  const editorRef = useRef(null);
  // Initialize an empty state
  const [state, setState] = useState({});

  // IMPORTANT: EXPLANATION REQUIRED
  const [firstTime, setFirstTime] = useState(true);
  const [isWorking] = useState(false);

  useEffect(() => {
    if (!props.isOpen || !firstTime) return;
    setFirstTime(false);

    /**
     * Handler to get list of offers
     * @returns {Promise<void>}
     */
    const getOffers = async () => {
      commonAPI.getOffersList().then((res) => {
        setListOfOffers(res.data.results.data);
      });
    };
    getOffers();
  }, [props.isOpen]);

  useEffect(() => {
    if (offer)
      commonAPI.viewOffers(offer).then((res) => {
        setState({ emailBody: res.data.results.translation[0].body });
      });
  }, [offer]);

  // useEffect(() => {
  //   if (!listOfOffers) return;
  //   setOffer(listOfOffers[0].uuid);
  // }, [listOfOffers]);

  const sendOffer = async () => {};

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
   * Return JSX
   */
  return (
    <Modal
      className="modal-dialog-centered"
      size="lg"
      isOpen={props.isOpen}
      toggle={() => props.closeModal()}
    >
      <div className="modal-header border-0">
        <h3 className="h3 mb-0">{t(`${translationPath}send-an-offer`)}</h3>
        <button
          type="button"
          className="close"
          data-dismiss="modal"
          aria-hidden="true"
          onClick={() => props.closeModal()}
        >
          <i className="fas fa-times" />
        </button>
      </div>
      <ModalBody
        className="modal-body"
        style={{ maxHeight: '70vh', padding: '0px 62px', overflow: 'auto' }}
      >
        {!listOfOffers && <ThreeDots />}
        {listOfOffers && (
          <div>
            <Row>
              <Col xs={12}>
                <FormGroup>
                  <Label
                    className="form-control-label text-gray"
                    for="questionnaire"
                  >
                    {t(`${translationPath}select-the-offer-description`)}
                  </Label>
                  <Input
                    className="form-control-alternative mt-4"
                    type="select"
                    name="select"
                    value={offer}
                    onChange={(e) => {
                      setOffer(
                        [...e.currentTarget.options].filter(
                          (option) => option.selected === true,
                        )[0].value,
                      );
                    }}
                    id="questionnaire"
                  >
                    <option selected disabled>
                      {t(`${translationPath}select-an-offer`)}
                    </option>
                    {listOfOffers.map((items, i) => (
                      <option value={items.uuid} key={`listOfOffersKey${i}`}>
                        {items.title}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col xs={12} className="mt-3 text-gray">
                {t(`${translationPath}type-email-offer-description`)}
              </Col>
            </Row>
            <Row className="mt-4">
              <Col sm="6" xs="12" className="mb-2">
                <Input
                  type="text"
                  className="form-control-alternative"
                  placeholder={t(`${translationPath}email-subject`)}
                  value={state.emailSubject}
                  onChange={(e) => {
                    setState({
                      emailSubject: e.target.value,
                    });
                  }}
                />
              </Col>

              <Col xs="12" sm="6" className="mb-2">
                <Input
                  className="form-control-alternative"
                  onChange={(e) => handleAddAnnotation(e.currentTarget.value)}
                  type="select"
                >
                  <option default>{t(`${translationPath}email-annotations`)}</option>
                  {props.emailVariables?.map((v, index) => (
                    <option value={v} key={`emailVariablesKey${index + 1}`}>
                      {v}
                    </option>
                  ))}
                </Input>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col xs="12">
                <h6 className="h6">{t(`${translationPath}email-body`) + '*'}</h6>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col xs="12">
                <TextEditorComponent
                  idRef="offer-editor-1"
                  editorValue={state.emailBody || ''}
                  onInit={(current) => (editorRef.current = current)}
                  onEditorChange={(content, editor) => {
                    setState({
                      emailBody: content,
                    });
                  }}
                  isRequired
                  height={500}
                />
                {/*   <Editor*/}
                {/*     id="offer-editor-1"*/}
                {/*     value={state.emailBody || ''}*/}
                {/*     init={{*/}
                {/*       height: 500,*/}
                {/*       plugins: [*/}
                {/*         'advlist autolink lists link image preview anchor',*/}
                {/*         'searchreplace code',*/}
                {/*         'insertdatetime media paste code wordcount',*/}
                {/*       ],*/}
                {/*       toolbar:*/}
                {/*         'formatselect | bold italic backcolor | \*/}
                {/*alignleft aligncenter alignright alignjustify | \*/}
                {/*bullist numlist outdent indent | removeformat',*/}

                {/*       //  Remove Branding*/}
                {/*       init_instance_callback(editor) {*/}
                {/*         const freeTiny = document.querySelector(*/}
                {/*           '.tox .tox-notification--in'*/}
                {/*         );*/}
                {/*         if (freeTiny) freeTiny.style.display = 'none';*/}
                {/*       },*/}
                {/*       branding: false,*/}
                {/*     }}*/}
                {/*     onEditorChange={(content, editor) => {*/}
                {/*       setState({*/}
                {/*         emailBody: content,*/}
                {/*       });*/}
                {/*     }}*/}
                {/*   />*/}
              </Col>
            </Row>
          </div>
        )}
        <div className="my-5 d-flex justify-content-center">
          <Button
            color="primary"
            style={{ width: '220px' }}
            onClick={sendOffer}
            disabled={isWorking}
          >
            {isWorking && (
              <i className="fas fa-circle-notch fa-spin mr-2-reversed" />
            )}
            {`${
              isWorking
                ? t(`${translationPath}sending`)
                : t(`${translationPath}send`)
            }`}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default SendOffer;
