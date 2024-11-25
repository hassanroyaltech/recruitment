// React, reactstrap, MUI
import React, { useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';

// classnames
import classnames from 'classnames';

// Loader
import Loader from 'components/Elevatus/Loader';

// Uploading Card and Item
import { StandardButton } from 'components/Buttons/StandardButton';
import { StandardModalFrame } from 'components/Modals/StandardModalFrame';
import { useTranslation } from 'react-i18next';
import UploadingCard from './UploadingCard';
import UploadingItem from './UploadingItem';
import { VitallyTrack } from '../../utils/Vitally';

const translationPath = '';
const parentTranslationPath = 'EvarecRecModals';

/**
 * Function to return the UploadingDialog
 * @param isOpen
 * @param onClose
 * @param onSuccess
 * @param uploadings
 * @param resumes
 * @param seconds
 * @param files
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const UploadingDialog = ({
  isOpen,
  onClose,
  onSuccess,
  uploadings,
  resumes,
  seconds,
  files,
  ...props
}) => {
  const { t } = useTranslation(parentTranslationPath);

  // Set collapsed state
  const [collapsed, setCollapsed] = useState(false);

  // Set loading state
  const [loading, setLoading] = useState(false);

  /**
   * Return JSX
   */
  return (
    <StandardModalFrame
      className={classnames(
        'modal-dialog-centered uploading-dialog',
        collapsed && 'collapsed-modal',
        'share-candidate-modal',
      )}
      isOpen={isOpen}
      toggle={onClose}
      closeOnClick={onClose}
      modalTitle="File upload"
    >
      <UploadingCard
        NumberOfFiles={files}
        filesCount={resumes?.length}
        dueSeconds={seconds}
        completed={resumes?.filter((item) => item?.progress >= 1).length}
        onClose={onClose}
        onSuccess={() => {
          setCollapsed(!collapsed);
        }}
        onToggle={() => {
          setCollapsed(!collapsed);
        }}
        collapsed={collapsed}
      />
      {loading ? (
        <Loader />
      ) : (
        !collapsed && (
          <>
            <div className="mt-4 ml-2">{t(`${translationPath}uploaded-files`)}</div>
            {resumes.map((item, index) => (
              <div className="align-center uploading-list mt-4" key={index}>
                <div className="mb-3 mr-4" key={index}>
                  <UploadingItem
                    file={item}
                    active={index === 0}
                    onClose={() => {
                      setLoading(true);
                      resumes.splice(index, 1);
                      setTimeout(() => {
                        setLoading(false);
                        if (resumes.length === 0) onClose();
                      }, 1000);
                    }}
                  />
                </div>
              </div>
            ))}

            <div style={{ marginTop: 20 }} className="w-100 text-center">
              {props.Saving ? (
                <LinearProgress color="primary" />
              ) : (
                <StandardButton
                  onClick={props.onApply}
                  disabled={
                    !!(
                      !resumes?.length || resumes.some((item) => item.errors?.length)
                    )
                  }
                  label="Save"
                />
              )}
            </div>
          </>
        )
      )}
    </StandardModalFrame>
  );
};

export default UploadingDialog;
