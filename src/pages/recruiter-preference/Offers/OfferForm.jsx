import React, { useState, useEffect, useCallback } from 'react';
import axios from 'api/middleware';
import RecuiterPreference from 'utils/RecuiterPreference';
// Share Components
import { Button, Row, Col, Modal } from 'reactstrap';
import TinyMCE from 'components/Elevatus/TinyMCE';
import { generateHeaders } from 'api/headers';
import TextField from '@mui/material/TextField';
import { Form, Formik } from 'formik';
import { useToasts } from 'react-toast-notifications';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import i18next from 'i18next';
import {
  CreateOffer,
  FindOffer,
  getOfferReferenceNumber,
  UpdateOffer,
} from '../../../shared/APIs/RecruiterPreferences/Offers';
import Loader from '../components/Loader';
import { showError } from '../../../helpers';

const translationPath = 'Offers.';
const mainParentTranslationPath = 'RecruiterPreferences';

// Forms Validation

const OfferForm = (props) => {
  const { t } = useTranslation(mainParentTranslationPath);
  const { addToast } = useToasts(); // Toasts

  // Required Data
  const [isWorking, setIsWorking] = useState(false);
  const [state, setState] = useState({
    title: '',
    reference_number: '',
    language_uuid: '',
    message: '',
    errors: [],
  });
  const [translations, setTranslations] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [bodyValidationError, setBodyValidationError] = useState(false);
  const [titleValidationError, setTitleValidationError] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState('');

  // Add Data
  const addData = useCallback(async () => {
    const translationIndex = translations.findIndex(
      (item) => item.language.id === state.language_uuid,
    );

    if (!state.title) {
      setTitleValidationError(true);
      return;
    }

    if (translationIndex !== -1)
      if (!translations || !translations[translationIndex].body) {
        setBodyValidationError(true);
        return;
      }

    setIsWorking(true);
    const params = {
      title: state.title,
      reference_number: state.reference_number,
      translation: translations
        .filter((item) => item.body && item.body.length > 0)
        ?.map((item) =>
          item.uuid ? { ...item, language_id: item?.language?.id } : item,
        ),
      uuid: props.uuid,
    };
    if (props.uuid)
      UpdateOffer(params)
        .then((res) => {
          setIsWorking(false);
          addToast(t(`${translationPath}offer-updated-successfully`), {
            appearance: 'success',
            autoDismiss: true,
          });
          setTitleValidationError(false);
          setBodyValidationError(false);
          props.GetOffersData();
          // window.location.reload();
          props.closeModal();
        })
        .catch((error) => {
          setIsWorking(false);
          showError(t('Shared:failed-to-get-saved-data'), error);
          setState((prevState) => ({
            ...prevState,
            message: error.response.data?.message,
            errors: error.response.data?.errors,
          }));
        });
    else
      CreateOffer(params)
        .then((res) => {
          setIsWorking(false);
          addToast(t(`${translationPath}offer-created-successfully`), {
            appearance: 'success',
            autoDismiss: true,
          });
          setBodyValidationError(false);
          setTitleValidationError(false);
          props.GetOffersData();
          // window.location.reload();
          props.closeModal();
        })
        .catch((error) => {
          setIsWorking(false);
          showError(t('Shared:failed-to-get-saved-data'), error);
          setState((prevState) => ({
            ...prevState,
            message: error.response.data?.message,
            errors: error.response.data?.errors,
          }));
        });
  }, [
    addToast,
    props,
    state.reference_number,
    state.language_uuid,
    state.title,
    t,
    translations,
  ]);

  // Get Variables
  const [variables, setVariables] = useState();

  // Get Variables
  const getVariables = useCallback(async () => {
    await axios
      .get(RecuiterPreference.OFFERS_COLLECTION, {
        headers: generateHeaders(),
      })
      .then((res) => setVariables(res.data.results.keys))
      .catch((error) => {
        showError(t('Shared:failed-to-get-saved-data'), error);
      });
  }, [t]);

  useEffect(() => {
    getVariables();
  }, [getVariables]);

  useEffect(() => {
    if (!props.uuid)
      if (localStorage.getItem('offer_reference_number'))
        // if reference number stored in local storage fetch data from local storage
        // otherwise fetch data from API
        // */
        setState((positionData) => ({
          ...positionData,
          reference_number: JSON.parse(
            localStorage.getItem('offer_reference_number'),
          ),
        }));
      else
        getOfferReferenceNumber().then((data) => {
          if (data.data?.statusCode === 200)
            setState((positionData) => ({
              ...positionData,
              reference_number: data.data?.results?.reference_number,
            }));
        });
  }, [props.uuid]);

  useEffect(() => {
    const userLanguages = JSON.parse(localStorage.getItem('user'))?.results
      ?.language;

    setTranslations(() => {
      const languagesArray = userLanguages.map((language) => ({
        language,
        body: '',
        language_id: language?.id,
      }));
      return [...languagesArray];
    });
    setLanguages(userLanguages);
    setActiveLanguage(userLanguages[0]?.id);
    setState((items) => ({ ...items, language_uuid: userLanguages[0]?.id }));
  }, []);

  useEffect(() => {
    if (props.uuid) {
      setIsWorking(true);
      // find offer
      FindOffer(props.uuid).then((res) => {
        const { results } = res.data;

        setState((prevState) => ({
          ...prevState,
          title: results?.title,
          reference_number: results?.reference_number,
          language_uuid: results?.translation[0]?.language?.id,
        }));
        if (results?.translation && results?.translation[0]) {
          setTranslations((items) => {
            const newTranslation = [...(results?.translation || []), ...items];
            const newValues = newTranslation.filter(
              (item, index, values) =>
                item.body
                || values.findIndex((el) => item.language.id === el.language.id)
                  === index,
            );
            return [...newValues];
          });
          setActiveLanguage(results?.translation[0]?.language?.id);
        }
        setIsWorking(false);
      });
    }
  }, [props.uuid]);

  const sendTranslation = useCallback(
    (newTranslation) => {
      setTranslations((items) => {
        const index = items.findIndex((el) => el.language.id === activeLanguage);
        items[index] = newTranslation;
        return [...items];
      });
    },
    [activeLanguage],
  );

  const OfferModalSchema = Yup.object().shape({
    title: Yup.string()
      .min(3, t(`${translationPath}offer-name-must-be-at-least-3-characters`))
      .max(50, t(`${translationPath}offer-name-must-be-at-most-50-characters`))
      .required(t('Shared:required')),
    reference_number: Yup.string().nullable(),
  });

  return (
    <Modal
      className="modal-dialog-centered choose-assessment-type"
      size="md"
      isOpen={props.isOpen}
      toggle={() => props.closeModal()}
    >
      <div className="modal-header border-0 pb-0">
        <div className="border-bottom ml-4-reversed w-100">
          <div className="d-flex align-items-center">
            <h1 className="mb-2 mr-2-reversed">
              {props.uuid
                ? t(`${translationPath}edit-offer`)
                : t(`${translationPath}add-new-offer`)}
            </h1>
          </div>
        </div>

        <button
          aria-label="Close"
          className="close"
          data-dismiss="modal"
          type="button"
          onClick={() => props.closeModal()}
        >
          <span aria-hidden>×</span>
        </button>
      </div>

      <Formik
        enableReinitialize
        initialValues={{
          title: state.title,
        }}
        validationSchema={OfferModalSchema}
        onSubmit={(values) => addData()}
      >
        {({ errors, touched, isValidating, submitForm }) => (
          <Form>
            {!variables && <Loader />}
            {variables && (
              <div className="modal-body px-5">
                <Row className="mb-2">
                  <Col xs="6">
                    <TextField
                      className="form-control-alternative w-100"
                      type="text"
                      required
                      label={t(`${translationPath}offers-title`)}
                      variant="outlined"
                      placeholder={t(`${translationPath}offers-title`)}
                      value={state.title}
                      invalid={!errors.title}
                      onChange={(e) => {
                        const { value } = e.currentTarget;
                        setState((prevState) => ({
                          ...prevState,
                          title: value,
                        }));

                        if (value) setTitleValidationError(false);
                        else setTitleValidationError(true);
                      }}
                    />
                    {state.errors
                      && state.errors.title
                      && (state.errors.title.length > 1 ? (
                        state.errors.title.map((error, key) => (
                          <p className="m-0 text-xs text-danger" key={key}>
                            {error}
                          </p>
                        ))
                      ) : (
                        <p className="m-o text-xs text-danger">
                          {state.errors.title}
                        </p>
                      ))}
                    {titleValidationError && (
                      <div className="text-danger pt-2">{t('Shared:required')}</div>
                    )}
                  </Col>
                  <Col xs="6">
                    <TextField
                      className="form-control-alternative w-100"
                      id="offer-language"
                      label={t(`${translationPath}select-language`)}
                      variant="outlined"
                      select
                      required
                      placeholder={t(`${translationPath}language`)}
                      value={state.language_uuid}
                      SelectProps={{
                        native: true,
                        displayEmpty: false,
                        defaultValue: t(`${translationPath}select-language`),
                      }}
                      onChange={(e) => {
                        const { value } = e.target;

                        setActiveLanguage(value);
                        setState((prevState) => ({
                          ...prevState,
                          language_uuid: value,
                        }));

                        setTitleValidationError(false);
                        setBodyValidationError(false);
                      }}
                    >
                      {translations?.map(
                        (translation, i) =>
                          translation?.language && (
                            <option
                              key={`${i + 1}-language-option`}
                              value={translation?.language?.id}
                            >
                              {translation?.language?.translation[i18next.language]}
                            </option>
                          ),
                      )}
                    </TextField>
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="6">
                    <TextField
                      id="reference-number"
                      label={t(`${translationPath}reference-number`)}
                      variant="outlined"
                      className="form-control-alternative w-100 mt-3"
                      name="referenceNumber"
                      invalid={!errors.reference_number}
                      type="text"
                      onChange={(e) => {
                        const { value } = e.currentTarget;
                        setState((prevState) => ({
                          ...prevState,
                          reference_number: value,
                        }));
                      }}
                      autoComplete
                      value={state.reference_number}
                      required
                    />
                    {state.errors && state.errors.reference_number ? (
                      state.errors.reference_number.length > 1 ? (
                        state.errors.reference_number.map((error, key) => (
                          <p className="m-0 text-xs text-danger" key={key}>
                            {error}
                          </p>
                        ))
                      ) : (
                        <p className="m-o text-xs text-danger">
                          {state.errors.reference_number}
                        </p>
                      )
                    ) : (
                      ''
                    )}
                  </Col>
                  <Col xl={12} lg={12} md={12} xs={12}>
                    <TinyMCE
                      id="offer-editor"
                      value={
                        translations.find(
                          (item) => item.language.id === activeLanguage,
                        )?.body
                      }
                      bodyLabel={t(`${translationPath}offers-body`)}
                      annotationLabel=" "
                      onChange={(value) => {
                        sendTranslation({
                          language: languages.find(
                            (item) => item.id === state?.language_uuid,
                          ),
                          body: value,
                          language_id: languages.find(
                            (item) => item.id === state?.language_uuid,
                          )?.id,
                        });

                        if (value) setTitleValidationError(false);
                        else setTitleValidationError(true);
                      }}
                      variables={variables}
                    />
                    {bodyValidationError && (
                      <div className="text-danger pt-2">{t('Shared:required')}</div>
                    )}
                  </Col>
                </Row>
              </div>
            )}

            <div className="modal-footer border-0 d-flex justify-content-center">
              <Button
                className="btn btn-icon mr-2-reversed"
                color="secondary"
                data-dismiss="modal"
                type="button"
                onClick={() => props.closeModal()}
              >
                {t(`${translationPath}cancel`)}
              </Button>
              <Button
                className="btn btn-primary btn-icon float-right"
                color="primary"
                type="button"
                onClick={() => addData()}
                disabled={isWorking}
              >
                {isWorking && (
                  <i className="fas fa-circle-notch fa-spin mr-2-reversed" />
                )}
                {`${
                  isWorking
                    ? t(`${translationPath}saving`)
                    : t(`${translationPath}save-changes`)
                }`}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default OfferForm;
