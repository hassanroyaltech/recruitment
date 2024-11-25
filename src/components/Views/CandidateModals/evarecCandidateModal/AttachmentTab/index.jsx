/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable import/no-unresolved */
// Import React Components
import React, { useCallback, useEffect, useState } from 'react';

// Import Reactstrap components
import { CardBody, Col, Row } from 'reactstrap';

// Import DropZoneWrapper component
import DropzoneWrapper from '../../../../../components/Elevatus/DropzoneWrapper';

// Import APIs
import { commonAPI } from '../../../../../api/common';
import { evarecAPI } from '../../../../../api/evarec';

// Import Loader
import Loader from '../../../../../components/Elevatus/Loader';

import { Button, IconButton, Tooltip } from '@mui/material';
// Import Image Icons
import { useTranslation } from 'react-i18next';
import ThumbnailItemCard from '../VideoAssessmentTab/ThumbnailItemCard';
import docxIcon from '../../../../../assets/images/FileTypes/icon_docx.svg';
import videoIcon from '../../../../../assets/images/FileTypes/icon_video.svg';
import otherFileIcon from '../../../../../assets/images/FileTypes/icon_other_file.svg';
import Helpers from '../../../../../utils/Helpers';
import { Can } from '../../../../../utils/functions/permissions';
import { showSuccess, showError, getIsAllowedPermissionV2 } from 'helpers';
import { useSelector } from 'react-redux';
import { ManageApplicationsPermissions } from 'permissions';

const translationPath = '';
const parentTranslationPath = 'EvarecCandidateModel';

/**
 * Attachment Tab  Functional component
 * @param {*} props
 * @returns {JSX element}
 */

const AttachmentTab = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  const [uploaded, setUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [files, setFiles] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
  /**
   * Get attachments List Function
   * @param uuid
   * @returns {Promise}
   */
  const getAttachmentsList = useCallback(() => {
    setLoading(true);
    evarecAPI.getAttachments(props.candidate).then((res) => {
      setAttachments(res.data.results);
      setLoading(false);
    });
  }, [props.candidate]);

  /**
   * Effect to invoke getAttachmentsList Function, once the attachment component is mount
   */
  useEffect(() => {
    getAttachmentsList();
  }, [getAttachmentsList]);

  const deleteAttachment = useCallback(
    (item) => {
      setLoading(true);
      evarecAPI
        .deleteAttachments(item?.uuid, props.candidate, item?.media?.original?.uuid)
        .then(() => {
          setLoading(true);
          showSuccess(t(`${translationPath}attachment-deleted`));
          getAttachmentsList();
          setLoading(false);
        })
        .catch((error) =>
          showError(t(`${translationPath}attachment-deleted-failed`), error),
        );
    },
    [getAttachmentsList, props.candidate, t],
  );

  /**
   * Handle upload files Function
   * @param {*} data
   * @note This Function Works As below :
   * [Step 1] => Select files from dialog.
   * [Step 2] => Invoke createMedia API to handle upload files then generate url & media_uuid.
   * [Step 3] => Invoke uploadMedia API to handle associate media for specific candidate
   * [Step 4] => Invoke getAttachmentsList Function after done uploading to
   * display new file with the previous
   *   attachments.
   *
   * @note This function has slightly changed to only allow a single file at a time
   */
  const handleFileChange = async (data) => {
    setLoading(true);
    let type = 'image';
    if (data.length) {
      if (data.length > 5) {
        showError(t('Shared:max-allowed-files-limit-exceeded'));
        data.length = 5;
      }
      setUploading(true);
      setUploaded(false);

      data.map(async (item) => {
        // Handle upload a different type of files
        if (item.type.includes('image')) type = 'image';
        else if (item.type.includes('video')) type = 'video';
        else type = 'docs';

        try {
          const formData = new FormData();
          formData.append('file', item);
          formData.append('type', type);

          // Replace the preset name with your own
          formData.append('from_feature', 'ats');

          const { data } = await commonAPI.createMedia(formData);
          setUploaded(true);

          const elementUUID = data.results.original.uuid;
          files.push(elementUUID);

          commonAPI.uploadMedia(props.candidate, elementUUID).then(() => {
            getAttachmentsList();
            document.getElementById('file').value = '';
            setUploading(false);
          });
        } catch (error) {
          console.log(error);
        }
      });
    }

    setLoading(false);
    setFiles(files);
  };

  const fileTypeHandler = useCallback((type) => {
    switch (type) {
    case 'video':
      return videoIcon;
    case 'docs':
      return docxIcon;
    default:
      return otherFileIcon;
    }
  }, []);

  return (
    <Row>
      <Col className="d-flex flex-column">
        <DropzoneWrapper
          disabled={!Can('create', 'upload_attachments')}
          onUpload={handleFileChange}
          multiple
          // maxFiles={5}
          accept=".jpg, .jpeg, .webp, .png, .pdf, .mp4, .doc, .docx"
          className="attachment-file-wrapper"
        >
          <div className="attachment-file-status">
            {uploading ? (
              <i className="fas fa-circle-notch fa-spin" />
            ) : deleting ? (
              <i className="fas fa-circle-notch fa-spin" />
            ) : (
              <i className="fas fa-cloud-upload-alt" />
            )}
            {uploading ? (
              <span className="ml-2 file-status-title">
                {t(`${translationPath}uploading`)}
              </span>
            ) : deleting ? (
              <span className="ml-2 file-status-title">
                {t(`${translationPath}deleting`)}
              </span>
            ) : (
              <span className="file-status-title">
                {t(`${translationPath}upload-description`)}
              </span>
            )}
            <Button disabled={!Can('create', 'upload_attachments')}>
              {t(`${translationPath}upload`)}
            </Button>
          </div>
        </DropzoneWrapper>
        {loading ? (
          <CardBody className="text-center">
            <Row>
              <Col xl="12">
                <Loader width="730px" height="49vh" speed={1} color="primary" />
              </Col>
            </Row>
          </CardBody>
        ) : (
          <div className="attachments-list-wrapper">
            {attachments.map((item, index) => (
              <div key={`${index + 1}-atachments`} className="attachments-list-item">
                <div className="attachments-list-info">
                  <a
                    download
                    rel="noreferrer"
                    target="_blank"
                    href={item?.media?.original?.url}
                  >
                    {item?.media?.original?.type ? (
                      <ThumbnailItemCard
                        img={item?.media?.original?.url}
                        // title={item?.media?.original?.type}
                        extension={item?.media?.original?.extension}
                      />
                    ) : (
                      <img
                        alt={item?.media?.original?.type}
                        src={fileTypeHandler(item?.media?.original?.type)}
                      />
                    )}
                  </a>
                  <div className="info-wrapper">
                    <div className="info-type">{item?.media?.original?.name}</div>
                    {/*<div>*/}
                    {/*  {t(`${translationPath}uploader`)}*/}
                    {/*  :*/}
                    {/*  {item?.relation === 2 ? 'Recruiter' : 'Candidate'}*/}
                    {/*</div>*/}
                  </div>
                </div>
                <div className="attachments-actions">
                  <IconButton
                    onClick={() => deleteAttachment(item, props.candidate)}
                    disabled={
                      !getIsAllowedPermissionV2({
                        permissions,
                        permissionId:
                          ManageApplicationsPermissions.DeleteAttachment.key,
                      })
                    }
                  >
                    <i className="fas fa-trash-alt" />
                  </IconButton>
                  <a
                    rel="noreferrer"
                    target="_blank"
                    href={item?.media?.original?.url}
                  >
                    <Tooltip title="View">
                      <span>
                        <IconButton>
                          <i className="fas fa-eye is-dark" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </a>
                  <Tooltip title="Download">
                    <a
                      download
                      rel="noreferrer"
                      href={`${Helpers.DOWNLOAD}?file=${item?.media?.original?.path}`}
                    >
                      <IconButton onClick={() => {}}>
                        <i className="fas fa-download is-dark" />
                      </IconButton>
                    </a>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        )}
      </Col>
    </Row>
  );
};

export default AttachmentTab;
