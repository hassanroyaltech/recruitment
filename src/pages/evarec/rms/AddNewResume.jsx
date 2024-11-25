import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalBody } from 'reactstrap';

import DropzoneWrapper from 'components/Elevatus/DropzoneWrapper';
import { useToasts } from 'react-toast-notifications';
import { commonAPI } from 'api/common';
import { evarecAPI } from 'api/evarec';
import { useTranslation } from 'react-i18next';
import { rmsUploadsMockData } from '../services/mockData';
import { showError } from '../../../helpers';

const translationPath = '';
const parentTranslationPath = 'EvarecRecRms';

const AddNewResume = ({ isOpen, onClose, ...props }) => {
  const { t } = useTranslation(parentTranslationPath);
  const { addToast } = useToasts(); // Toasts
  const [recentUploads, setRecentUploads] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [NumberOfFiles, setNumberOfFiles] = useState(0);

  useEffect(() => {
    const getRecentUploads = async (uuid) => {
      setRecentUploads(rmsUploadsMockData);
    };

    getRecentUploads();
  }, []);

  const handleFileChange = async (data) => {
    if (data.length > 0 && data.length <= 50)
      data.forEach((item) => {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', item);
        formData.append('type', 'cv');
        formData.append('from_feature', 'rms--resume_upload'); // Replace the preset name with your own
        commonAPI
          .createMedia(formData)
          .then(({ data }) => {
            setUploading(false);
            files.push(data?.results?.original?.uuid);
            setNumberOfFiles(files.length);
          })
          .catch((error) => {
            showError(t('Shared:failed-to-get-saved-data'), error);
          });
      });
    else showError(t(`${translationPath}you-cant-upload-more-that-50-files`));

    setFiles(files);
  };

  const onApply = () => {
    setSaving(true);
    evarecAPI
      .createResumes(files)
      .then(() => {
        setSaving(false);
        addToast(t(`${translationPath}created-successfully`), {
          appearance: 'success',
          autoDismiss: true,
        });
        onClose();
        window.location.reload();
      })
      .catch((error) => {
        setSaving(false);
        showError(t('Shared:failed-to-get-saved-data'), error);
      });
  };

  return (
    <Modal
      className="modal-dialog-centered share-candidate-modal"
      isOpen={isOpen}
      toggle={onClose}
    >
      <div className="modal-header border-0">
        <h3 className="h3 mb-0 ml-5 mt-3">
          {t(`${translationPath}add-new-CV-or-resume`)}
        </h3>
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
        className="modal-body pt-0 mx-3 px-5"
        style={{ overflow: 'auto', maxHeight: '100%' }}
      >
        <div className="pb-3">
          <div className="mb-3 text-right font-12 text-gray">
            {NumberOfFiles} {t(`${translationPath}files-have-been-uploaded`)}{' '}
            {uploading && (
              <>
                <i className="fas fa-circle-notch fa-spin" />
              </>
            )}
          </div>
          <div>
            <DropzoneWrapper
              multiple
              onUpload={handleFileChange}
              accept=".pdf, .docx, .doc"
              className="custom-file-input cv-custom-file-input"
            >
              <div className="d-flex flex-row align-items-center">
                {uploading ? (
                  <>
                    <i
                      className="fas fa-circle-notch fa-spin"
                      style={{ fontSize: '2rem' }}
                    />
                    <span className="h6 text-gray ml-2 mb-0">
                      {t(`${translationPath}uploading`)}
                    </span>
                  </>
                ) : deleting ? (
                  <>
                    <i
                      className="fas fa-circle-notch fa-spin"
                      style={{ fontSize: '2rem' }}
                    />
                    <span className="h6 text-gray ml-2 mb-0">
                      {t(`${translationPath}deleting`)}
                    </span>
                  </>
                ) : (
                  <>
                    <i
                      className="fas fa-cloud-upload-alt"
                      style={{ fontSize: '2rem' }}
                    />
                    <span className="h6 text-gray ml-2 mb-0">
                      {t(`${translationPath}upload-resumes`)}
                    </span>
                  </>
                )}
              </div>
            </DropzoneWrapper>
          </div>
          <div className="mt-3 text-right font-12 text-gray">
            {t(`${translationPath}note-you-can-upload-maximum-100-resumes`)}
          </div>
        </div>
        <div className="my-4 d-flex justify-content-center">
          <Button
            color="primary"
            style={{ width: '220px' }}
            onClick={onApply}
            disabled={saving || files.length === 0}
          >
            {saving && <i className="fas fa-circle-notch fa-spin mr-2" />}
            {`${
              saving
                ? t(`${translationPath}uploading`)
                : t(`${translationPath}upload`)
            }`}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default AddNewResume;
