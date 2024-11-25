// React and reactstrap
import React, { useState, useEffect } from 'react';
import { Button, Select, MenuItem, FormControl } from '@mui/material';

// Toast notifications
import { useToasts } from 'react-toast-notifications';

// API
import axios from 'api/middleware';
import urls from 'api/urls';
import { generateHeaders } from 'api/headers';

// Modals
import { useTranslation } from 'react-i18next';
import ColorModal from '../../components/Modals/ColorModal';
import SeoModal from '../../components/Modals/SeoModal';
import SignupRequirementsModal from '../../components/Modals/SignupRequirementsModal';

// Stylesheet
import 'assets/scss/elevatus/_evabrand.scss';
import { showError } from '../../helpers';

const translationPath = '';
const parentTranslationPath = 'EvaBrand';

/**
 * HeaderBar constructor
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const HeaderBar = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  // State for toast notifications
  const { addToast } = useToasts();

  // Get the user object from local storage
  const user = JSON.parse(localStorage.getItem('user'))?.results;

  // Language Select
  const [language, setLanguage] = useState(user?.language[0].id);
  useEffect(() => {
    if (!language) return;
    props.setNewLanguage(language);
  }, [language]);

  // Modals Logics
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [isSeoModalOpen, setIsSeoModalOpen] = useState(false);
  const [isSignUpRModalOpen, setIsSignUpRModalOpen] = useState(false);

  // Handler to close modals
  const closeModal = () => {
    setIsColorModalOpen(false);
    setIsSeoModalOpen(false);
    setIsSignUpRModalOpen(false);
  };

  // Publish Logic
  const [isWorking, setIsWorking] = useState(false);
  const doPublish = async () => {
    setIsWorking(true);
    await axios
      .put(
        urls.evabrand.publish,
        {},
        {
          headers: generateHeaders(),
        },
      )
      .then(() => {
        setIsWorking(false);
        window?.ChurnZero?.push([
          'trackEvent',
          'Eva Brand - Publish career portal',
          'Publish career portal',
          1,
          {},
        ]);
        addToast(t(`${translationPath}published`), {
          appearance: 'success',
          autoDismiss: true,
        });
      })
      .catch((error) => {
        setIsWorking(false);
        showError(t('Shared:failed-to-get-saved-data'), error);
      });
  };

  /**
   * Return JSX
   */
  return (
    <>
      {/* Modals */}
      {isColorModalOpen && (
        <ColorModal isOpen={isColorModalOpen} closeModal={closeModal} />
      )}
      {isSeoModalOpen && (
        <SeoModal isOpen={isSeoModalOpen} closeModal={closeModal} />
      )}
      {isSignUpRModalOpen && (
        <SignupRequirementsModal
          isOpen={isSignUpRModalOpen}
          closeModal={closeModal}
        />
      )}

      {/* Bar */}
      <div id="header-bar" className="nav justify-content-between">
        <div className="col-10 nav">
          <Button
            // disabled={
            //   !getIsAllowedPermission(
            //     CurrentFeatures,
            //     response,
            //     CurrentFeatures.signup_requirements.permissionsId,
            //   )
            // }
            className="btn nav-link bg-white form-control-alternative font-weight-400 text-capitalize"
            onClick={() => setIsSignUpRModalOpen(true)}
          >
            {t(`${translationPath}sign-up-requirements`)}
          </Button>
          <Button
            className="btn nav-link bg-white form-control-alternative font-weight-400 text-capitalize"
            onClick={() => setIsSeoModalOpen(true)}
          >
            {t(`${translationPath}seo`)}
          </Button>
          {/* <a */}
          {/*  href={portalLink} */}
          {/*  target="_blank" */}
          {/*  rel="noreferrer" */}
          {/*  className="btn nav-link bg-white form-control-alternative d-flex align-items-center" */}
          {/* > */}
          {/*  <i className="fas fa-eye" /> */}
          {/* </a> */}
          <Button
            className="btn nav-link bg-white form-control-alternative font-weight-400 text-capitalize"
            onClick={() => setIsColorModalOpen(true)}
          >
            <i className="fas fa-paint-brush mr-1-reversed" />
            {t(`${translationPath}color`)}
          </Button>
          <FormControl
            variant="outlined"
            size="small"
            className="col-5 col-md-2 nav-link rounded mt-2 mb-2 text-center text-white not--included font-weight-400 evabrand-select-language"
          >
            <Select
              className="text-white bg-primary rounded"
              size="small"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {user?.language.map((lang, i) => (
                <MenuItem key={`${i + 1}-lang-item`} value={lang.id}>
                  {t(`${translationPath}${lang.title}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="col-auto nav">
          <Button
            className="btn nav-link text-white form-control-alternative font-weight-400 bg-success text-capitalize"
            onClick={doPublish}
          >
            {isWorking && (
              <i className="fas fa-circle-notch fa-spin mr-2-reversed" />
            )}
            {!isWorking
              ? t(`${translationPath}publish`)
              : t(`${translationPath}publishing`)}
          </Button>
        </div>
      </div>
    </>
  );
};
export default HeaderBar;
