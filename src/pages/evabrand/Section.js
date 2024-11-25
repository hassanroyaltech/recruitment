// React and reactstrap
import React, { useState } from 'react';
import { Button } from 'reactstrap';

// Stylesheet
import 'assets/scss/elevatus/_evabrand.scss';
import { useTranslation } from 'react-i18next';

const translationPath = '';
const parentTranslationPath = 'EvaBrand';

/**
 * Draggable section constructor
 * @param Component
 * @param imgSrc
 * @param rest
 * @returns {JSX.Element}
 * @constructor
 */
const DraggableSection = ({ component: Component, imgSrc, ...rest }) => {
  const { t } = useTranslation(parentTranslationPath);
  // Set open state
  const [isOpen, setIsOpen] = useState(false);

  // Handler for closing modals
  const closeModal = () => {
    setIsOpen(false);
  };

  /**
   * Return the JSX
   */
  return (
    <div id="image-wrapper">
      <img id="styled-img" src={imgSrc} alt="styled-img" />
      <div id="toolbar" className="image-wrapper-toolbar">
        <Button
          className="btn nav-link bg-white form-control-alternative"
          onClick={() => setIsOpen(true)}
        >
          <i className="fas fa-pen mr-2-reversed" />
          {t(`${translationPath}edit`)}
        </Button>
      </div>
      {isOpen && <Component isOpen={isOpen} closeModal={closeModal} {...rest} />}
    </div>
  );
};
export default DraggableSection;
