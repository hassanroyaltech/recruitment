// React and reactstrap
import React, { useEffect, useState } from 'react';
// Loader
import Loader from '../../../components/Elevatus/Loader';

// APIs and routes
import { evarecAPI } from '../../../api/evarec';

// Helpers
import { getEllipseFileName } from '../../../utils/functions/helpers';
import { StandardModalFrame } from '../../../components/Modals/StandardModalFrame';
import { useTranslation } from 'react-i18next';
import { StandardButton } from '../../../components/Buttons/StandardButton';

const translationPath = '';
const parentTranslationPath = 'EvarecRecRms';

/**
 * Returns the Upload document component
 * @param isOpen
 * @param onClose
 * @param onUpload
 * @returns {JSX.Element}
 * @constructor
 */
const UploadDocument = ({ isOpen, onClose, onUpload }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [recentUploads, setRecentUploads] = useState([]);
  const [files, setFiles] = useState(null);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setLoader(true);
    evarecAPI.getRecentUploads(8).then((res) => {
      setRecentUploads(res.jobs);
      setLoader(false);
    });
  }, []);

  return (
    <StandardModalFrame
      className="modal-dialog-centered share-candidate-modal"
      isOpen={isOpen}
      closeOnClick={onClose}
      modalTitle={t(`${translationPath}match-CVs-via-upload`)}
    >
      <div className="mt-5 ml-5 align-items-center">
        {t(`${translationPath}recent-uploads`)}
      </div>
      {!loader ? (
        <div className="mt-4 mb-3 text-gray d-flex flex-row flex-wrap justify-content-center">
          {recentUploads
            && recentUploads?.map((item, index) => (
              <div
                className="mb-2 pdf-card d-flex flex-column "
                key={`${index + 1}-upload`}
                role="button"
                onKeyUp={() => {}}
                tabIndex={0}
                onClick={() =>
                  setFiles({
                    reference_uuid: item.uuid,
                    title: item.title,
                    data: item,
                    immediately: true,
                  })
                }
                style={
                  files && files.reference_uuid === item.uuid
                    ? { background: '#f4f5f7' }
                    : { background: 'white' }
                }
              >
                <i
                  className="fas fa-file-pdf"
                  style={
                    files && files.reference_uuid === item.uuid
                      ? { color: '#d9300b' }
                      : { color: '#8898aa' }
                  }
                />
                <div className="mt-3 w-100 text-wrap text-gray h8 text-center">
                  {getEllipseFileName(item.title, 25)}
                </div>
              </div>
            ))}
        </div>
      ) : (
        <Loader width="100%" speed={1} color="primary" />
      )}
      <hr className="my-4 w-100" />
      <div className="my-4 d-flex justify-content-center">
        <StandardButton
          disabled={!files}
          onClick={() => onUpload(files)}
          label={t(`${translationPath}apply`)}
        />
      </div>
    </StandardModalFrame>
  );
};

export default UploadDocument;
