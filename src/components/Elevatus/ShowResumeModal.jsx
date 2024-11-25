import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { StandardModalFrame } from 'components/Modals/StandardModalFrame';
import { useTranslation } from 'react-i18next';
import sampleResume from '../../assets/img/theme/sample_resume.pdf';

const translationPath = '';
const parentTranslationPath = 'EvarecRecRms';

const ShowResumeModal = ({ link, isOpen, onClose }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [showMsg, setShowMsg] = useState(false);

  useEffect(() => {
    const format = link.substring(link.lastIndexOf('.') + 1, link.lastIndexOf('?'));
    if (format !== 'pdf') setShowMsg(true);
  }, [link, onClose]);

  return (
    <StandardModalFrame
      isOpen={isOpen}
      toggle={onClose}
      closeOnClick={onClose}
      modalTitle={t(`${translationPath}view-resume`)}
      divHeightClass="50"
    >
      {showMsg && (
        <div className="w-100 h-100 d-flex-center my-3">
          <p>{t('resume-downloaded')}</p>
        </div>
      )}
      <embed
        style={{ display: showMsg ? 'none' : '' }}
        src={link || sampleResume}
        type="application/pdf"
        width="100%"
        height={window.innerHeight * 0.8}
      />
    </StandardModalFrame>
  );
};

ShowResumeModal.propTypes = {
  link: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ShowResumeModal;
