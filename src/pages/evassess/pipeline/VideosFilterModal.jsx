import React, { useState } from 'react';
import { Button, Modal, ModalBody } from 'reactstrap';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';

const translationPath = '';
export default function VideosFilterModal(props) {
  const { t } = useTranslation('EvaSSESSPipeline');
  const { isOpen, onClose, onApply } = props;
  const [question, setQuestion] = useState(null);

  return (
    <>
      <Modal
        className="modal-dialog-centered choose-assessment-type"
        size="md"
        isOpen={isOpen}
        toggle={onClose}
      >
        <div className="modal-header border-0">
          <h3 className="h3 mb-0 ml-5">{t(`${translationPath}filter`)}</h3>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-hidden="true"
            onClick={onClose}
          >
            <i className="fas fa-times" />
          </button>
        </div>
        <ModalBody
          className="modal-body pt-0"
          style={{ overflow: 'auto', maxHeight: '100%' }}
        >
          <div className="px-5 pb-3">
            <div className="h6 font-weight-normal text-gray">
              <span>{t(`${translationPath}filter-results-based-on-the-below`)}</span>
              <span>:</span>
            </div>
            <div style={{ minHeight: 270 }}>
              <Select
                onChange={(e) => setQuestion(e)}
                className="form-control-alternative"
                options={props.questions.map((v) => ({
                  label: v.title,
                  value: v.uuid,
                }))}
                placeholder={t(`${translationPath}search-for-question`)}
              />
            </div>
            <div className="mt-5 d-flex justify-content-center">
              <Button
                type="button"
                color="primary"
                className="btn"
                style={{ width: 220 }}
                disabled={!question}
                onClick={() => onApply({ question })}
              >
                {t(`${translationPath}apply`)}
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}
