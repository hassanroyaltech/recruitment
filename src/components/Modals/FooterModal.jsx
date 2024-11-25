// React and reactstrap
import React, { useContext, useEffect, useState } from 'react';
import { Col, Input, InputGroup, InputGroupText, Row } from 'reactstrap';

// Toast notifications
import { useToasts } from 'react-toast-notifications';

// API
import { evabrandAPI } from '../../api/evabrand';
import { StandardModal } from '../../components/Modals/StandardModal';
import { ModalButtons } from '../../components/Buttons/ModalButtons';

// Content
// import { evabrandContent } from 'assets/content/evabrandContent';

// Context API
import { useTranslation } from 'react-i18next';
import { CareerBrandingContext } from '../../pages/evabrand/CareerBrandingContext';

const translationPath = '';
const parentTranslationPath = 'EvaBrand';

/**
 * Footer Modal component containing social media links and website address
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const FooterModal = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  // Toast notifications
  const { addToast } = useToasts();

  // Required Data
  const user = JSON.parse(localStorage.getItem('user'))?.results;
  const { languageId } = useContext(CareerBrandingContext);

  // Loading states
  const [isWorking, setIsWorking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Get Appearance
  const [data, setData] = useState();
  const [errors, setErrors] = useState([]);
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);

  /**
   * Effect to prepare and get data
   */
  useEffect(() => {
    if (data || !languageId) return;

    /**
     * Get data via API
     * @returns {Promise<void>}
     */
    const getData = async () => {
      evabrandAPI
        .getSocial(languageId)
        .then((res) => {
          const socialMedia = res?.data?.results?.website_and_social;
          setData((data) => ({
            ...data,
            angel_url: socialMedia.angel_url ? socialMedia.angel_url : '',
            blog_url: socialMedia.blog_url ? socialMedia.blog_url : '',
            facebook_url: socialMedia.facebook_url ? socialMedia.facebook_url : '',
            instagram_url: socialMedia.instagram_url
              ? socialMedia.instagram_url
              : '',
            linkedin_url: socialMedia.linkedin_url ? socialMedia.linkedin_url : '',
            twitter_url: socialMedia.twitter_url ? socialMedia.twitter_url : '',
            website_url: socialMedia.website_url ? socialMedia.website_url : '',
          }));
          setData((data) => ({
            ...data,
            header: res.data.results.information.section_title,
          }));
          setData((data) => ({
            ...data,
            sub_header: res.data.results.information.section_description,
          }));
        })
        .catch(() => {
          addToast(t(`${translationPath}error-in-getting-data`), {
            appearance: 'error',
            autoDismiss: true,
          });
        });
    };
    getData();
  }, [languageId]);

  /**
   * Wrapper to update data
   * @returns {Promise<void>}
   */
  const updateData = async () => {
    setIsWorking(true);
    setIsSaving(true);

    /**
     * Update data via API
     */
    evabrandAPI
      .updateSocial(languageId, data)
      .then(() => {
        evabrandAPI.updateSocialInformation(languageId, data);
        setIsWorking(false);
        setIsSaving(false);
        addToast(t(`${translationPath}successfully-updated`), {
          appearance: 'success',
          autoDismiss: true,
        });
        setErrors([]);
        setSaveButtonDisabled(true);
      })
      .catch((error) => {
        setIsWorking(false);
        setIsSaving(false);
        addToast(error?.response?.data?.message, {
          appearance: 'error',
          autoDismiss: true,
        });
        setErrors(error?.response?.data?.errors);
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
  const saveButtonHandler = () => updateData();

  /**
   * Render the component
   * @return {JSX.Element}
   */
  return (
    <>
      {/* MODAL COMPONENT */}
      <StandardModal
        title={t(`${translationPath}website-and-social-media`)}
        subtitle={t(
          `${translationPath}add-links-of-your-company-website-and-social-media-platform-to-increase-the-engagement-of-your-career-branding-visitors`,
        )}
        isOpen={props.isOpen}
        isLoading={isWorking || !data}
        onClose={props.closeModal}
        languageTag={user?.language.filter((l) => l.id === languageId)[0].title}
        buttons={
          <ModalButtons
            cancelButton
            cancelButtonHandler={cancelButtonHandler}
            saveButton
            saveButtonDisabled={saveButtonDisabled}
            saveButtonHandler={saveButtonHandler}
            isSaving={isSaving}
          />
        }
      >
        {/* Body */}
        {data && (
          <>
            <div className="mt-5">
              <Row className="mb-4">
                <Col xs="12">
                  <Input
                    className="form-control-alternative"
                    type="text"
                    value={data.header || ''}
                    placeholder={t(`${translationPath}header-text`)}
                    onChange={(e) => {
                      const { value } = e.currentTarget;
                      setData((data) => ({ ...data, header: value }));
                      setSaveButtonDisabled(false);
                    }}
                  />
                </Col>
              </Row>
              <Row className="mb-4">
                <Col xs="12">
                  <Input
                    className="form-control-alternative"
                    type="text"
                    value={data.sub_header || ''}
                    placeholder={t(`${translationPath}subheader-text`)}
                    onChange={(e) => {
                      const { value } = e.currentTarget;
                      setData((data) => ({ ...data, sub_header: value }));
                      setSaveButtonDisabled(false);
                    }}
                  />
                </Col>
              </Row>

              <hr className="border-bottom" />

              {/* Social Media Links */}
              <h3 className="font-weight-400 text-gray mb-3">
                {t(`${translationPath}social-media-links`)}
              </h3>
              <Row>
                <Col xs="12" className="mb-2">
                  <InputGroup>
                    <InputGroup addonType="prepend">
                      <InputGroupText>
                        {t(`${translationPath}company-website`)}
                      </InputGroupText>
                    </InputGroup>
                    <Input
                      type="text"
                      value={data.website_url || ''}
                      onChange={(e) => {
                        const { value } = e.currentTarget;
                        setData((data) => ({ ...data, website_url: value }));
                        setSaveButtonDisabled(false);
                      }}
                    />
                  </InputGroup>
                  {errors && errors.website_url ? (
                    errors.website_url.length > 1 ? (
                      errors.website_url.map((error, index) => (
                        <p key={index} className="mb-0 mt-1 text-xs text-danger">
                          {error}
                        </p>
                      ))
                    ) : (
                      <p className="mb-0 mt-1 text-xs text-danger">
                        {errors.website_url}
                      </p>
                    )
                  ) : (
                    ''
                  )}
                </Col>
              </Row>

              <Row>
                <Col xs="6" className="mb-2">
                  <InputGroup>
                    <InputGroup addonType="prepend">
                      <InputGroupText>
                        <i
                          className="fab fa-facebook"
                          style={{ fontSize: '1.5rem' }}
                        />
                      </InputGroupText>
                    </InputGroup>
                    <Input
                      type="text"
                      placeholder={t(`${translationPath}facebook`)}
                      value={data.facebook_url}
                      onChange={(e) => {
                        const { value } = e.currentTarget;
                        setData((data) => ({ ...data, facebook_url: value }));
                        setSaveButtonDisabled(false);
                      }}
                    />
                  </InputGroup>
                  {errors && errors.facebook_url ? (
                    errors.facebook_url.length > 1 ? (
                      errors.facebook_url.map((error, index) => (
                        <p key={index} className="mb-0 mt-1 text-xs text-danger">
                          {error}
                        </p>
                      ))
                    ) : (
                      <p className="mb-0 mt-1 text-xs text-danger">
                        {errors.facebook_url}
                      </p>
                    )
                  ) : (
                    ''
                  )}
                </Col>
                <Col xs="6" className="mb-2">
                  <InputGroup>
                    <InputGroup addonType="prepend">
                      <InputGroupText>
                        <i
                          className="fab fa-twitter"
                          style={{ fontSize: '1.5rem' }}
                        />
                      </InputGroupText>
                    </InputGroup>
                    <Input
                      type="text"
                      placeholder={t(`${translationPath}twitter`)}
                      value={data.twitter_url}
                      onChange={(e) => {
                        const { value } = e.currentTarget;
                        setData((data) => ({ ...data, twitter_url: value }));
                        setSaveButtonDisabled(false);
                      }}
                    />
                  </InputGroup>
                  {errors && errors.twitter_url ? (
                    errors.twitter_url.length > 1 ? (
                      errors.twitter_url.map((error, index) => (
                        <p key={index} className="mb-0 mt-1 text-xs text-danger">
                          {error}
                        </p>
                      ))
                    ) : (
                      <p className="mb-0 mt-1 text-xs text-danger">
                        {errors.twitter_url}
                      </p>
                    )
                  ) : (
                    ''
                  )}
                </Col>
              </Row>

              <Row>
                <Col xs="6" className="mb-2">
                  <InputGroup>
                    <InputGroup addonType="prepend">
                      <InputGroupText>
                        <i
                          className="fab fa-linkedin"
                          style={{ fontSize: '1.5rem' }}
                        />
                      </InputGroupText>
                    </InputGroup>
                    <Input
                      type="text"
                      placeholder={t(`${translationPath}linkedin`)}
                      value={data.linkedin_url}
                      onChange={(e) => {
                        const { value } = e.currentTarget;
                        setData((data) => ({ ...data, linkedin_url: value }));
                        setSaveButtonDisabled(false);
                      }}
                    />
                  </InputGroup>
                  {errors && errors.linkedin_url ? (
                    errors.linkedin_url.length > 1 ? (
                      errors.linkedin_url.map((error, index) => (
                        <p key={index} className="mb-0 mt-1 text-xs text-danger">
                          {error}
                        </p>
                      ))
                    ) : (
                      <p className="mb-0 mt-1 text-xs text-danger">
                        {errors.linkedin_url}
                      </p>
                    )
                  ) : (
                    ''
                  )}
                </Col>
                <Col xs="6" className="mb-2">
                  <InputGroup>
                    <InputGroup addonType="prepend">
                      <InputGroupText>
                        <i
                          className="fab fa-instagram"
                          style={{ fontSize: '1.5rem' }}
                        />
                      </InputGroupText>
                    </InputGroup>
                    <Input
                      type="text"
                      placeholder={t(`${translationPath}instagram`)}
                      value={data.instagram_url}
                      onChange={(e) => {
                        const { value } = e.currentTarget;
                        setData((data) => ({ ...data, instagram_url: value }));
                        setSaveButtonDisabled(false);
                      }}
                    />
                  </InputGroup>
                  {errors && errors.instagram_url ? (
                    errors.instagram_url.length > 1 ? (
                      errors.instagram_url.map((error, index) => (
                        <p key={index} className="mb-0 mt-1 text-xs text-danger">
                          {error}
                        </p>
                      ))
                    ) : (
                      <p className="mb-0 mt-1 text-xs text-danger">
                        {errors.instagram_url}
                      </p>
                    )
                  ) : (
                    ''
                  )}
                </Col>
              </Row>

              <Row>
                <Col xs="6" className="mb-2">
                  <InputGroup>
                    <InputGroup addonType="prepend">
                      <InputGroupText>
                        <i
                          className="fab fa-angellist"
                          style={{ fontSize: '1.5rem' }}
                        />
                      </InputGroupText>
                    </InputGroup>
                    <Input
                      type="text"
                      placeholder={t(`${translationPath}angellist`)}
                      value={data.angel_url}
                      onChange={(e) => {
                        const { value } = e.currentTarget;
                        setData((data) => ({ ...data, angel_url: value }));
                        setSaveButtonDisabled(false);
                      }}
                    />
                  </InputGroup>
                  {errors && errors.angel_url ? (
                    errors.angel_url.length > 1 ? (
                      errors.angel_url.map((error, index) => (
                        <p key={index} className="mb-0 mt-1 text-xs text-danger">
                          {error}
                        </p>
                      ))
                    ) : (
                      <p className="mb-0 mt-1 text-xs text-danger">
                        {errors.angel_url}
                      </p>
                    )
                  ) : (
                    ''
                  )}
                </Col>
                <Col xs="6" className="mb-2">
                  <InputGroup>
                    <InputGroup addonType="prepend">
                      <InputGroupText>
                        <i className="fas fa-globe" style={{ fontSize: '1.5rem' }} />
                      </InputGroupText>
                    </InputGroup>
                    <Input
                      type="text"
                      placeholder={t(`${translationPath}blog`)}
                      value={data.blog_url}
                      onChange={(e) => {
                        const { value } = e.currentTarget;
                        setData((data) => ({ ...data, blog_url: value }));
                        setSaveButtonDisabled(false);
                      }}
                    />
                  </InputGroup>
                  {errors && errors.blog_url ? (
                    errors.blog_url.length > 1 ? (
                      errors.blog_url.map((error, index) => (
                        <p key={index} className="mb-0 mt-1 text-xs text-danger">
                          {error}
                        </p>
                      ))
                    ) : (
                      <p className="mb-0 mt-1 text-xs text-danger">
                        {errors.blog_url}
                      </p>
                    )
                  ) : (
                    ''
                  )}
                </Col>
              </Row>
            </div>
          </>
        )}
      </StandardModal>
    </>
  );
};

export default FooterModal;
